/**
 * RelatedRank v1.2 — score and rank a document's related documents
 * ------------------------------------------------------------------
 * !!! GATED PATCH — DO NOT PASTE UNTIL review/harness check_batch.py
 * PASSES (it runs the full check_related suite over this file plus
 * the two new defensive cases) !!!
 *
 * v1.2 = v1.1 + two defensive fixes (REVIEW_v2_5 SC-12). Output on
 * well-formed input is identical to v1.1:
 *
 *   (a) an idLinks row where NEITHER endpoint is the current doc is
 *       skipped instead of silently crediting doc A with 1000+ points
 *       (reachable only if the flow's OData filter regresses — but
 *       every other input path here is defensive, this one now is too)
 *   (b) keywords whose lookup Title is missing are dropped from the
 *       human-readable why/sharedKeywords (no more "shared keywords:
 *       41, testing" leaking raw list-item ids into sidecars); they
 *       still count toward the score.
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
 * Scoring: s = 1000 * |shared issue ids| + Σ w(k) over shared
 * keywords k, where w(k) = 1 / log2(1 + df(k)) and df(k) is the
 * number of OTHER docs carrying k in the sharers rows. The sharers
 * result is every Doc Keywords row for every keyword this doc has,
 * so it doubles as a local document-frequency sample (bounded by the
 * query's $top): a keyword shared with exactly one other doc weighs
 * 1.0 — the old flat count's unit — while a term carried by half the
 * corpus fades toward 0.1. The keyword component is capped at 999 and
 * rounded to 3 decimals, so any id link structurally outranks any
 * keyword overlap and scores are byte-stable across reruns. A doc
 * related both ways collapses into a single entry with the combined
 * score. Sort s desc, then item id desc (newer doc wins ties). Self
 * is excluded; list caps at topN. Shared keywords are listed rarest
 * (most informative) first, ties alphabetical. df is a property of
 * the keyword, not of which doc queried, so scores stay symmetric
 * and SidecarPatch's merge mode can reuse them as-is.
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

  // --- 2) keyword sharers: doc -> shared kw ids; kw -> carriers ---
  // The same pass yields document frequency: df[kw] = the OTHER docs
  // carrying kw (self excluded, sample bounded by the query's $top).
  const kwShared: { [doc: number]: { [kw: number]: boolean } } = {};
  const df: { [kw: number]: { [doc: number]: boolean } } = {};
  for (const row of parseRows(sharersJson)) {
    const doc = lookupId(row, "Document");
    const kw = lookupId(row, "Keyword");
    if (doc <= 0 || doc === self || !(kw in myKw)) {
      continue;
    }
    if (!df[kw]) {
      df[kw] = {};
    }
    df[kw][doc] = true;
    if (!kwShared[doc]) {
      kwShared[doc] = {};
    }
    kwShared[doc][kw] = true;
  }

  // Rarity weight: shared with one other doc -> 1.0, common -> small.
  function kwWeight(kw: number): number {
    const n = Object.keys(df[kw] || {}).length;
    return n > 0 ? 1 / Math.log2(1 + n) : 0;
  }

  // --- 3) id links: doc -> set of shared issue ids ----------------
  const idShared: { [doc: number]: { [val: string]: boolean } } = {};
  for (const row of parseRows(idLinksJson)) {
    const a = lookupId(row, "DocA");
    const b = lookupId(row, "DocB");
    if (a !== self && b !== self) {
      continue; // v1.2 (SC-12a): row isn't about this doc — never credit it
    }
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
    const kwIds = Object.keys(kwShared[doc] || {}).map((k) => parseInt(k, 10));
    // rarest (most informative) first; ties alphabetical by title
    kwIds.sort((a, b) => {
      const dw = kwWeight(b) - kwWeight(a);
      if (dw !== 0) {
        return dw;
      }
      const ta = myKw[a] || String(a);
      const tb = myKw[b] || String(b);
      return ta < tb ? -1 : ta > tb ? 1 : 0;
    });
    // v1.2 (SC-12b): title-less keywords stay in the score but leave
    // the human-readable lists — raw list-item ids never reach sidecars
    const kws = kwIds.map((k) => myKw[k]).filter((t) => !!t);
    let kwScore = 0;
    for (const k of kwIds) {
      kwScore += kwWeight(k);
    }
    kwScore = Math.min(kwScore, 999); // id links must always outrank keywords
    const s = 1000 * ids.length + Math.round(kwScore * 1000) / 1000;
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
