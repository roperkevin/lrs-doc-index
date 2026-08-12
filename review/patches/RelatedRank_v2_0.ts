/**
 * RelatedRank v2.0 — score and rank a document's related documents
 * ------------------------------------------------------------------
 * r3 batch (related-ranking overhaul) — gated by check_batch_r3.py.
 * DO NOT PASTE until the gate is green, and never without the v2.6
 * flow edits in the same maintenance window: the signature changed,
 * so the live flow's Run-script bindings break until reconfigured
 * (see review/patches/designer-edits.md §v2_6).
 * ------------------------------------------------------------------
 * v1.3 provenance: r2 batch (REVIEW_v2_5_r2.md SB-9), gate passed
 * 2026-08-11; perf-only over v1.2 (kwWeight precomputed per doc).
 * v1.2 provenance: SC-12 defensive fixes, pasted 2026-08-11.
 *
 * v2.0 = the four-part overhaul. On legacy-shaped input (id-only
 * links, no keyword metadata, no candidate metadata, default config)
 * the ranking and scores are identical to v1.3 — the r3 gate proves
 * it — plus a new `flags` field on the result:
 *
 *   (1) ALL Doc Links edge types score, weighted per type
 *       (default: id 1000, review 100, gantt 60, titlematch 40;
 *       unknown types weigh 0 and are ignored). 'id' keeps the
 *       v1.3 unique-shared-value counting; other types count by
 *       the row's Strength (else SharedValues count, else 1).
 *       Minting non-id edges stays with Flow #2 — this script just
 *       stops ignoring them the day they exist.
 *   (2) Keyword kind weighting: topic 1.0, tool 0.6, product 0.4
 *       (from the kwMetaJson Keywords rows; unknown kind reads as
 *       topic, which is also why legacy input scores unchanged).
 *       kwMetaJson's alias rows (CanonicalRef set) also map
 *       alias-id sharer rows onto their canonical id — the DX-2
 *       mitigation for pre-curation junction rows.
 *   (3) Metadata affinity + recency (mode "final" only): same
 *       DocKind / Surface / TargetRelease / PE / Dev add small
 *       config-weighted bonuses; a recency bonus decays with the
 *       age of the OLDER doc's SourceModified (pair-min, so
 *       s(A,B) === s(B,A) — SidecarPatch merge mode reuses scores
 *       reciprocally and the symmetry contract must hold; never
 *       switch this to candidate-only recency). Metadata is a
 *       RE-RANKER only: a doc with no shared edge/keyword never
 *       enters the candidate universe.
 *   (4) Every weight, cap and ceiling reads from configJson with
 *       the in-script defaults below — tuning is a flow designer
 *       edit (Config.RelatedWeights), not a script re-paste.
 *
 * Two-phase wiring (flow v2.6): the flow first calls mode
 * "shortlist" (edges + keywords only, topN = Config.RelatedShortlist)
 * to pick candidates, fetches those candidates' Doc Index rows, then
 * calls mode "final" with candsMetaJson to re-rank with metadata and
 * cap at Config.RelatedTopN. In final mode a non-empty candsMetaJson
 * restricts the universe to those docs; an empty one leaves the
 * universe unrestricted (defensive degradation if the candidate
 * fetch fails — and what the gate's equivalence leg exercises).
 *
 * Scoring: s = E + min(K + M + R, softCap), rounded to 3 decimals:
 *   E = Σ per edge type: edge[type] × n   (id: n = |unique shared
 *       values|; others: n = Σ Strength-or-count per row)
 *   K = Σ shared canonical keywords k: kwKind[kind(k)] × 1/log2(1+df(k))
 *       (df = OTHER docs carrying k in the sharers sample)
 *   M = meta.* bonuses for case-insensitive equal, non-empty fields
 *   R = recency.weight × 2^(−ageDays/recency.halfLifeDays),
 *       ageDays from the older SourceModified; 0 if either missing
 * With defaults, id links still structurally outrank everything
 * soft (softCap 999 < edge.id 1000) — the v1.3 dominance contract,
 * now a config choice instead of a constant. Sort s desc, then item
 * id desc (newer doc wins ties); self excluded; caps at topN.
 * Shared keywords list most-informative first (kind × rarity), ties
 * alphabetical — identical to v1.3 ordering on kind-less input. df
 * and every other term is a property of the PAIR or the keyword,
 * never of which doc queried, so scores stay symmetric.
 *
 * `flags` reports input truncation: any input arriving at (or past)
 * its configured ceiling (tops.*) means the rarity sample and the
 * candidate universe may be clipped — "myKws-at-top" /
 * "sharers-at-top" / "links-at-top", comma-joined, "" when clean.
 * The flow surfaces it in the run summary (README: the ceiling is
 * the knob; now it's a detectable knob).
 *
 * All inputs are defensive: unparseable JSON reads as empty array /
 * object / defaults; lookups read row.Field.Id with a row.FieldId
 * fallback; choice columns read {Value} with a plain-string
 * fallback; unknown mode reads as "final".
 *
 * Power Automate wiring (flow v2.6):
 *   Excel Online (Business) "Run script"
 *     workbook      = any dummy .xlsx (host only)
 *     selfId        = Doc Index item id of the current doc
 *     mode          = "shortlist" | "final"
 *     myKwsJson     = string(body('Get_my_kws')?['value'])
 *     sharersJson   = string(body('Get_kw_sharers')?['value'])
 *     linksJson     = string(body('Get_id_links')?['value'])
 *                     (name historical; the v2.6 filter has no
 *                     LinkType clause — all edge types arrive)
 *     kwMetaJson    = string(body('Get_kw_meta')?['value'])
 *     candsMetaJson = "[]" (shortlist) /
 *                     string(body('Get_cand_docs')?['value']) (final)
 *     selfMetaJson  = string(outputs('Self_rank_meta'))
 *                     {"kind","surface","release","pe","dev","modified"}
 *     configJson    = Config.RelatedWeights ("" -> all defaults)
 *     topN          = Config.RelatedShortlist / Config.RelatedTopN
 *   Returns a typed object — related[], docIds[], count and flags
 *   surface as structured dynamic content in the designer.
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
  flags: string;
}

interface SpRow {
  [key: string]: unknown;
}

interface RankConfig {
  edge: { [t: string]: number };
  kwKind: { [k: string]: number };
  meta: { kind: number; surface: number; release: number; pe: number; dev: number };
  recency: { weight: number; halfLifeDays: number };
  softCap: number;
  tops: { myKws: number; sharers: number; links: number };
  today: string;
}

interface DocMeta {
  kind: string;
  surface: string;
  release: string;
  pe: string;
  dev: string;
  modified: string;
}

function parseRows(json: string): SpRow[] {
  try {
    const v: unknown = JSON.parse(json);
    return Array.isArray(v) ? (v as SpRow[]) : [];
  } catch (e) {
    return [];
  }
}

function parseObject(json: string): SpRow {
  try {
    const v: unknown = JSON.parse(json);
    return v && typeof v === "object" && !Array.isArray(v) ? (v as SpRow) : {};
  } catch (e) {
    return {};
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

// Choice columns arrive as {Value} from GetItems but as plain strings
// from hand-built payloads and older fixtures — accept both.
function choiceValue(row: SpRow, field: string): string {
  const nested = lookupValue(row, field);
  if (nested) {
    return nested;
  }
  return typeof row[field] === "string" ? (row[field] as string) : "";
}

function plainInt(v: unknown): number {
  const n = typeof v === "number" ? v : parseInt(String(v), 10);
  return isNaN(n) ? 0 : n;
}

function strField(row: SpRow, field: string): string {
  return typeof row[field] === "string" ? (row[field] as string) : "";
}

function numOr(v: unknown, dflt: number): number {
  return typeof v === "number" && isFinite(v) ? v : dflt;
}

// Case-insensitive, trimmed comparison key; "" never matches anything.
function normKey(s: string): string {
  return s.replace(/^\s+|\s+$/g, "").toLowerCase();
}

function defaultConfig(): RankConfig {
  return {
    edge: { id: 1000, review: 100, gantt: 60, titlematch: 40 },
    kwKind: { topic: 1.0, tool: 0.6, product: 0.4 },
    meta: { kind: 0.5, surface: 0.5, release: 1.0, pe: 0.75, dev: 0.75 },
    recency: { weight: 1.0, halfLifeDays: 180 },
    softCap: 999,
    tops: { myKws: 100, sharers: 2000, links: 200 },
    today: "",
  };
}

// Deep-merge the parsed config over the defaults, one known key at a
// time — a partial override tunes only what it names, and any
// garbage value silently keeps its default.
function mergeConfig(json: string): RankConfig {
  const cfg = defaultConfig();
  const raw = parseObject(json);
  const edges = raw["edge"] as SpRow | undefined;
  if (edges && typeof edges === "object") {
    for (const t in edges) {
      cfg.edge[normKey(t)] = numOr(edges[t], cfg.edge[normKey(t)] || 0);
    }
  }
  const kinds = raw["kwKind"] as SpRow | undefined;
  if (kinds && typeof kinds === "object") {
    for (const k in kinds) {
      cfg.kwKind[normKey(k)] = numOr(kinds[k], cfg.kwKind[normKey(k)] || 0);
    }
  }
  const meta = raw["meta"] as SpRow | undefined;
  if (meta && typeof meta === "object") {
    cfg.meta.kind = numOr(meta["kind"], cfg.meta.kind);
    cfg.meta.surface = numOr(meta["surface"], cfg.meta.surface);
    cfg.meta.release = numOr(meta["release"], cfg.meta.release);
    cfg.meta.pe = numOr(meta["pe"], cfg.meta.pe);
    cfg.meta.dev = numOr(meta["dev"], cfg.meta.dev);
  }
  const rec = raw["recency"] as SpRow | undefined;
  if (rec && typeof rec === "object") {
    cfg.recency.weight = numOr(rec["weight"], cfg.recency.weight);
    const hl = numOr(rec["halfLifeDays"], cfg.recency.halfLifeDays);
    cfg.recency.halfLifeDays = hl > 0 ? hl : cfg.recency.halfLifeDays;
  }
  cfg.softCap = numOr(raw["softCap"], cfg.softCap);
  const tops = raw["tops"] as SpRow | undefined;
  if (tops && typeof tops === "object") {
    cfg.tops.myKws = numOr(tops["myKws"], cfg.tops.myKws);
    cfg.tops.sharers = numOr(tops["sharers"], cfg.tops.sharers);
    cfg.tops.links = numOr(tops["links"], cfg.tops.links);
  }
  if (typeof raw["today"] === "string") {
    cfg.today = raw["today"] as string;
  }
  return cfg;
}

// Doc Index row -> the metadata slice the affinity terms read.
function docMetaOf(row: SpRow): DocMeta {
  return {
    kind: choiceValue(row, "DocKind"),
    surface: choiceValue(row, "Surface"),
    release: strField(row, "TargetRelease"),
    pe: strField(row, "PE"),
    dev: strField(row, "Dev"),
    modified: strField(row, "SourceModified"),
  };
}

function main(
  workbook: ExcelScript.Workbook,
  selfId: string,
  mode: string,
  myKwsJson: string,
  sharersJson: string,
  linksJson: string,
  kwMetaJson: string,
  candsMetaJson: string,
  selfMetaJson: string,
  configJson: string,
  topN: number
): RankResult {
  const self = parseInt(selfId, 10) || 0;
  const cap = topN > 0 ? topN : 5;
  const finalMode = mode !== "shortlist";
  const cfg = mergeConfig(configJson);

  // --- 0) keyword metadata: kind per canonical, alias -> canonical -
  const myKwsRows = parseRows(myKwsJson);
  const sharersRows = parseRows(sharersJson);
  const linksRows = parseRows(linksJson);
  const kwMetaRows = parseRows(kwMetaJson);

  // --- 1) my canonical keywords: id -> title ----------------------
  const myKw: { [id: number]: string } = {};
  for (const row of myKwsRows) {
    const id = lookupId(row, "Keyword");
    if (id > 0) {
      myKw[id] = lookupValue(row, "Keyword");
    }
  }

  // Keywords-list rows: my canonicals carry Kind; alias rows
  // (CanonicalRef set, pointing at one of my canonicals) fold
  // pre-curation sharer rows onto the canonical id (DX-2).
  const kwKindOf: { [id: number]: string } = {};
  const aliasTo: { [id: number]: number } = {};
  for (const row of kwMetaRows) {
    const rowId = plainInt(row["ID"]);
    if (rowId <= 0) {
      continue;
    }
    const canon = lookupId(row, "CanonicalRef");
    if (rowId in myKw) {
      kwKindOf[rowId] = normKey(choiceValue(row, "Kind"));
    } else if (canon > 0 && canon in myKw) {
      aliasTo[rowId] = canon;
    }
  }

  function kindMult(kw: number): number {
    const kind = kwKindOf[kw] || "topic";
    const m = cfg.kwKind[kind];
    return typeof m === "number" ? m : cfg.kwKind["topic"];
  }

  // --- 2) keyword sharers: doc -> shared kw ids; kw -> carriers ---
  // The same pass yields document frequency: df[kw] = the OTHER docs
  // carrying kw (self excluded, sample bounded by the query's $top).
  // Sharer rows on an alias id count as their canonical.
  const kwShared: { [doc: number]: { [kw: number]: boolean } } = {};
  const df: { [kw: number]: { [doc: number]: boolean } } = {};
  for (const row of sharersRows) {
    const doc = lookupId(row, "Document");
    const rawKw = lookupId(row, "Keyword");
    const kw = aliasTo[rawKw] !== undefined ? aliasTo[rawKw] : rawKw;
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

  // --- 3) links: id keeps unique-shared-value sets; other types ---
  // count by Strength (else SharedValues count, else 1) per row.
  // Unknown/zero-weight types are ignored entirely.
  const idShared: { [doc: number]: { [val: string]: boolean } } = {};
  const edgeN: { [doc: number]: { [type: string]: number } } = {};
  for (const row of linksRows) {
    const a = lookupId(row, "DocA");
    const b = lookupId(row, "DocB");
    if (a !== self && b !== self) {
      continue; // v1.2 (SC-12a): row isn't about this doc — never credit it
    }
    const other = a === self ? b : a;
    if (other <= 0 || other === self) {
      continue;
    }
    const type = normKey(choiceValue(row, "LinkType"));
    if (!(cfg.edge[type] > 0)) {
      continue;
    }
    const sv = typeof row["SharedValues"] === "string" ? (row["SharedValues"] as string) : "";
    if (type === "id") {
      if (!idShared[other]) {
        idShared[other] = {};
      }
      for (const part of sv.split(";")) {
        const val = part.trim();
        if (val) {
          idShared[other][val] = true;
        }
      }
      continue;
    }
    let n = 0;
    const strength = row["Strength"];
    if (typeof strength === "number" && isFinite(strength) && strength >= 1) {
      n = strength;
    } else {
      for (const part of sv.split(";")) {
        if (part.trim()) {
          n += 1;
        }
      }
      if (n === 0) {
        n = 1;
      }
    }
    if (!edgeN[other]) {
      edgeN[other] = {};
    }
    edgeN[other][type] = (edgeN[other][type] || 0) + n;
  }

  // --- 4) candidate + self metadata (final mode only) -------------
  const candMeta: { [doc: number]: DocMeta } = {};
  let candCount = 0;
  if (finalMode) {
    for (const row of parseRows(candsMetaJson)) {
      const id = plainInt(row["ID"]);
      if (id > 0 && id !== self) {
        candMeta[id] = docMetaOf(row);
        candCount += 1;
      }
    }
  }
  const selfRaw = parseObject(selfMetaJson);
  const selfMeta: DocMeta = {
    kind: strField(selfRaw, "kind"),
    surface: strField(selfRaw, "surface"),
    release: strField(selfRaw, "release"),
    pe: strField(selfRaw, "pe"),
    dev: strField(selfRaw, "dev"),
    modified: strField(selfRaw, "modified"),
  };
  const todayMs = cfg.today ? Date.parse(cfg.today) : Date.now();
  const selfMs = Date.parse(selfMeta.modified);

  // --- score, merge, sort, cap ------------------------------------
  const docs: { [doc: number]: boolean } = {};
  for (const d in kwShared) {
    docs[parseInt(d, 10)] = true;
  }
  for (const d in idShared) {
    docs[parseInt(d, 10)] = true;
  }
  for (const d in edgeN) {
    docs[parseInt(d, 10)] = true;
  }

  const entries: RankedEntry[] = [];
  for (const d in docs) {
    const doc = parseInt(d, 10);
    // final mode with a fetched shortlist: the shortlist IS the
    // candidate universe (empty candsMeta leaves it unrestricted)
    if (finalMode && candCount > 0 && !(doc in candMeta)) {
      continue;
    }
    const ids = Object.keys(idShared[doc] || {}).sort();
    const kwIds = Object.keys(kwShared[doc] || {}).map((k) => parseInt(k, 10));
    // v1.3 (SB-9): weights are computed once per id, not in the
    // comparator; v2.0 folds the kind multiplier into the same map
    const w: { [k: number]: number } = {};
    for (const k of kwIds) {
      w[k] = kindMult(k) * kwWeight(k);
    }
    // most informative (kind × rarity) first; ties alphabetical
    kwIds.sort((a, b) => {
      const dw = w[b] - w[a];
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
      kwScore += w[k];
    }

    let eScore = cfg.edge["id"] * ids.length;
    const types = Object.keys(edgeN[doc] || {}).sort();
    for (const t of types) {
      eScore += cfg.edge[t] * edgeN[doc][t];
    }

    let metaScore = 0;
    const metaParts: string[] = [];
    let recScore = 0;
    if (finalMode && doc in candMeta) {
      const cm = candMeta[doc];
      if (normKey(cm.kind) && normKey(cm.kind) === normKey(selfMeta.kind)) {
        metaScore += cfg.meta.kind;
        metaParts.push("same kind");
      }
      if (normKey(cm.surface) && normKey(cm.surface) === normKey(selfMeta.surface)) {
        metaScore += cfg.meta.surface;
        metaParts.push("same surface");
      }
      if (normKey(cm.release) && normKey(cm.release) === normKey(selfMeta.release)) {
        metaScore += cfg.meta.release;
        metaParts.push("release " + cm.release.replace(/^\s+|\s+$/g, ""));
      }
      if (normKey(cm.pe) && normKey(cm.pe) === normKey(selfMeta.pe)) {
        metaScore += cfg.meta.pe;
        metaParts.push("same pe");
      }
      if (normKey(cm.dev) && normKey(cm.dev) === normKey(selfMeta.dev)) {
        metaScore += cfg.meta.dev;
        metaParts.push("same dev");
      }
      // recency: pair-min — the OLDER doc's age, so the bonus is
      // symmetric; missing either date means no bonus
      const candMs = Date.parse(cm.modified);
      if (!isNaN(selfMs) && !isNaN(candMs) && !isNaN(todayMs) && cfg.recency.weight > 0) {
        const olderMs = Math.min(selfMs, candMs);
        const ageDays = Math.max(0, Math.floor((todayMs - olderMs) / 86400000));
        recScore = cfg.recency.weight * Math.pow(2, -ageDays / cfg.recency.halfLifeDays);
      }
    }

    // soft signals can never total past softCap — with the default
    // 999 / edge.id 1000 that keeps id dominance strictly lexicographic
    const soft = Math.min(kwScore + metaScore + recScore, cfg.softCap);
    let s = eScore + Math.round(soft * 1000) / 1000;
    s = Math.round(s * 1000) / 1000;
    if (s <= 0) {
      continue;
    }
    const parts: string[] = [];
    if (ids.length > 0) {
      parts.push("shared issue " + ids.join(", "));
    }
    for (const t of types) {
      parts.push(t + " link" + (edgeN[doc][t] > 1 ? " (" + edgeN[doc][t] + " shared)" : ""));
    }
    if (kws.length > 0) {
      const shown = kws.slice(0, 4).join(", ");
      const more = kws.length > 4 ? ", +" + (kws.length - 4) + " more" : "";
      parts.push(
        kws.length + " shared keyword" + (kws.length === 1 ? "" : "s") +
        ": " + shown + more
      );
    }
    if (metaParts.length > 0) {
      parts.push("also: " + metaParts.join(", "));
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

  // truncation tripwire: an input at (or past) its query ceiling
  // means the sample was clipped — surfaced, not just documented
  const flagged: string[] = [];
  if (myKwsRows.length >= cfg.tops.myKws) {
    flagged.push("myKws-at-top");
  }
  if (sharersRows.length >= cfg.tops.sharers) {
    flagged.push("sharers-at-top");
  }
  if (linksRows.length >= cfg.tops.links) {
    flagged.push("links-at-top");
  }

  return {
    related: related,
    docIds: related.map((e) => e.doc),
    count: related.length,
    flags: flagged.join(","),
  };
}
