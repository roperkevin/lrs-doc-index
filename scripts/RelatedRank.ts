/**
 * RelatedRank v1.0 — score and rank a document's related documents
 * ------------------------------------------------------------------
 * Pure aggregation over the raw rows of three SharePoint queries the
 * flow has just issued for the current document (WDL has no group-by,
 * so the counting/sorting lives here, RegexExtract-style):
 *
 *   myKwsJson    Doc Keywords rows WHERE DocumentId eq {self}
 *                (the doc's own canonical keyword links)
 *   sharersJson  Doc Keywords rows WHERE KeywordId in {my keyword ids}
 *                (every doc sharing at least one of those keywords —
 *                the second of the documented "two indexed queries")
 *   idLinksJson  Doc Links rows WHERE (DocAId eq {self} or DocBId eq
 *                {self}) and LinkType eq 'id'
 *
 * Scoring: s = 1000 * |shared issue ids| + |shared keywords|.
 * Any id link outranks any keyword count (no doc plausibly shares
 * 1000 keywords), and a doc related both ways collapses into a single
 * entry with the combined score. Sort s desc, then item id desc
 * (newer doc wins ties). Self is excluded; list caps at topN.
 *
 * Keyword ids arriving here are canonical by construction — the flow's
 * Kw_id compose resolves CanonicalRef before writing Doc Keywords rows
 * — so aliases never need handling.
 *
 * All inputs are defensive: unparseable JSON reads as an empty array,
 * lookup fields read as row.Field.Id with a row.FieldId fallback.
 *
 * Power Automate wiring:
 *   Excel Online (Business) "Run script"
 *     Workbook  = any dummy .xlsx (host only)
 *     selfId    = Doc Index item id of the current doc (numeric string)
 *     myKwsJson / sharersJson / idLinksJson
 *               = string(body('Get_...')?['value'])
 *     topN      = Config.RelatedTopN (5)
 *   Returns a typed object — related[], docIds[] and count surface as
 *   structured dynamic content in the designer, no Parse JSON needed.
 */
interface RankedEntry {
  doc: number;
  s: number;
  why: string;
  sharedIds: string[];
  sharedKeywords: string[];
}

interface RankResult {
  related: RankedEntry[];
  docIds: number[];
  count: number;
}

interface SpRow {
  [key: string]: unknown;
}

function parseRows(json: string): SpRow[] {
  try {
    const v: unknown = JSON.parse(json);
    return Array.isArray(v) ? (v as SpRow[]) : [];
  } catch (e) {
    return [];
  }
}

function lookupId(row: SpRow, field: string): number {
  const nested = row[field] as { Id?: unknown } | undefined;
  const raw = nested && nested.Id !== undefined ? nested.Id : row[field + "Id"];
  const n = typeof raw === "number" ? raw : parseInt(String(raw), 10);
  return isNaN(n) ? 0 : n;
}

function lookupValue(row: SpRow, field: string): string {
  const nested = row[field] as { Value?: unknown } | undefined;
  return nested && typeof nested.Value === "string" ? nested.Value : "";
}

function main(
  workbook: ExcelScript.Workbook,
  selfId: string,
  myKwsJson: string,
  sharersJson: string,
  idLinksJson: string,
  topN: number
): RankResult {
  const self = parseInt(selfId, 10) || 0;
  const cap = topN > 0 ? topN : 5;

  // --- 1) my canonical keywords: id -> title ----------------------
  const myKw: { [id: number]: string } = {};
  for (const row of parseRows(myKwsJson)) {
    const id = lookupId(row, "Keyword");
    if (id > 0) {
      myKw[id] = lookupValue(row, "Keyword");
    }
  }

  // --- 2) keyword sharers: doc -> set of shared keyword titles ----
  const kwShared: { [doc: number]: { [title: string]: boolean } } = {};
  for (const row of parseRows(sharersJson)) {
    const doc = lookupId(row, "Document");
    const kw = lookupId(row, "Keyword");
    if (doc <= 0 || doc === self || !(kw in myKw)) {
      continue;
    }
    if (!kwShared[doc]) {
      kwShared[doc] = {};
    }
    kwShared[doc][myKw[kw] || String(kw)] = true;
  }

  // --- 3) id links: doc -> set of shared issue ids ----------------
  const idShared: { [doc: number]: { [val: string]: boolean } } = {};
  for (const row of parseRows(idLinksJson)) {
    const a = lookupId(row, "DocA");
    const b = lookupId(row, "DocB");
    const other = a === self ? b : a;
    if (other <= 0 || other === self) {
      continue;
    }
    if (!idShared[other]) {
      idShared[other] = {};
    }
    const sv = typeof row["SharedValues"] === "string" ? (row["SharedValues"] as string) : "";
    for (const part of sv.split(";")) {
      const val = part.trim();
      if (val) {
        idShared[other][val] = true;
      }
    }
  }

  // --- score, merge, sort, cap ------------------------------------
  const docs: { [doc: number]: boolean } = {};
  for (const d in kwShared) {
    docs[parseInt(d, 10)] = true;
  }
  for (const d in idShared) {
    docs[parseInt(d, 10)] = true;
  }

  const entries: RankedEntry[] = [];
  for (const d in docs) {
    const doc = parseInt(d, 10);
    const ids = Object.keys(idShared[doc] || {}).sort();
    const kws = Object.keys(kwShared[doc] || {}).sort();
    const s = 1000 * ids.length + kws.length;
    if (s <= 0) {
      continue;
    }
    const parts: string[] = [];
    if (ids.length > 0) {
      parts.push("shared issue " + ids.join(", "));
    }
    if (kws.length > 0) {
      const shown = kws.slice(0, 4).join(", ");
      const more = kws.length > 4 ? ", +" + (kws.length - 4) + " more" : "";
      parts.push(
        kws.length + " shared keyword" + (kws.length === 1 ? "" : "s") +
        ": " + shown + more
      );
    }
    entries.push({
      doc: doc,
      s: s,
      why: parts.join(" · "),
      sharedIds: ids,
      sharedKeywords: kws,
    });
  }

  entries.sort((x, y) => (y.s - x.s) || (y.doc - x.doc));
  const related = entries.slice(0, cap);

  return {
    related: related,
    docIds: related.map((e) => e.doc),
    count: related.length,
  };
}
