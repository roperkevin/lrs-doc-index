/**
 * RelatedRank v2.1 — score and rank a document's related documents
 * ------------------------------------------------------------------
 * r4 batch (related-ranking upgrade) — gated by check_batch_r4.py.
 * DO NOT PASTE until the gate is green. The signature is UNCHANGED
 * from v2.0 (11 params, same names), so there is no new flow
 * rewiring: in the pending v2.6 window this file simply replaces
 * the v2.0 paste (designer-edits.md §v2_6, r4 amendment); on a
 * tenant already running v2.0 + flow v2.6 it pastes alone safely —
 * title affinity stays dormant until the Self_rank_meta compose
 * gains its "title" line (one additive designer edit, no window).
 * ------------------------------------------------------------------
 * v2.0 provenance: r3 overhaul (all edge types, keyword kinds +
 * DX-2 alias fold, metadata affinity + pair-min recency,
 * config-driven weights, truncation flags) — check_batch_r3.py gate
 * passed 2026-08-12. v1.3 / v1.2 provenance: see git history.
 *
 * v2.1 = three changes on top of v2.0. On v2.0-shaped input (no
 * "title" key in selfMetaJson, single-name PE/Dev fields, per-doc
 * non-id edge totals below softCap) output is identical to v2.0 —
 * the r4 gate proves it:
 *
 *   (1) TOTAL id dominance (HA-9 extension): non-id edge scores now
 *       live in the same softCap bucket as keywords, metadata and
 *       recency. v2.0 capped only the soft signals, so a runaway
 *       Strength could outrank a true id link (gantt 60 × 17 =
 *       1020 > edge.id 1000) the day Flow #2 mints fat edges; now
 *       nothing outranks an id link at default weights. Raising
 *       softCap (or lowering edge.id) in config remains the escape
 *       hatch — the dominance contract stays a config choice, as in
 *       v2.0, but the default now actually holds for every signal.
 *   (2) Person-field set matching: PE/Dev affinity matches on the
 *       overlap of ; , / -separated name sets instead of exact
 *       string equality — "Jane Doe; John Roe" now matches
 *       "jane doe". Exact-equal fields match as before (equality
 *       is a special case of overlap); empty fields still never
 *       match. Overlap is symmetric, so the score contract holds.
 *   (3) Title-token affinity (mode "final" only): distinctive
 *       shared title tokens between self and candidate add
 *       title.weight (0.4) each, counting at most title.cap (6).
 *       Tokens are lowercased alphanumeric runs, 3+ chars with a
 *       letter, minus a stopword list of corpus-generic words
 *       (test/plan/user/story/lrs/... — DocKind affinity already
 *       carries the doc-type signal; title.stop in config appends
 *       tenant-specific words). The shared-token set is a property
 *       of the PAIR (deduped, alphabetical), so scores stay
 *       symmetric. Fires only when BOTH titles are present:
 *       candidates already carry Title on their Doc Index rows;
 *       self gets one when the Self_rank_meta compose adds "title"
 *       (flow v2.6, r4 amendment). Until then the term is 0 —
 *       which is why v2.0-shaped input scores unchanged. Like all
 *       metadata, title affinity is a RE-RANKER only: a doc with
 *       no shared edge/keyword never enters the candidate universe.
 *
 * Scoring: s = Eid + min(Esoft + K + M + T + R, softCap), rounded
 * to 3 decimals:
 *   Eid   = edge.id × |unique shared id values|
 *   Esoft = Σ per non-id edge type: edge[type] × n  (n = Strength,
 *           else SharedValues count, else 1 — per row, summed;
 *           unknown types weigh 0 and are ignored)
 *   K     = Σ shared canonical keywords k:
 *           kwKind[kind(k)] × 1/log2(1+df(k))
 *           (df = OTHER docs carrying k in the sharers sample)
 *   M     = meta.* bonuses — kind/surface/release case-insensitive
 *           equal and non-empty; pe/dev name-set overlap
 *   T     = title.weight × min(|shared title tokens|, title.cap)
 *   R     = recency.weight × 2^(−ageDays/recency.halfLifeDays),
 *           ageDays from the older SourceModified (pair-min, so
 *           s(A,B) === s(B,A) — SidecarPatch merge mode reuses
 *           scores reciprocally and the symmetry contract must
 *           hold; never switch this to candidate-only recency)
 * With defaults, one id link structurally outranks ANY accumulation
 * of everything else (softCap 999 < edge.id 1000) — v2.1 closes the
 * v2.0 gap where non-id edges escaped the cap. Sort s desc, then
 * item id desc (newer doc wins ties); self excluded; caps at topN.
 * Shared keywords list most-informative first (kind × rarity), ties
 * alphabetical. df and every other term is a property of the PAIR
 * or the keyword, never of which doc queried, so scores stay
 * symmetric.
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
 * Power Automate wiring (flow v2.6 + r4 amendment):
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
 *                     {"kind","surface","release","pe","dev",
 *                      "modified","title"} — "title" is the r4
 *                     amendment; absent = title affinity off
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
  title: { weight: number; cap: number; stop: string[] };
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
  title: string;
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

// PE/Dev hold one name or several ("Jane Doe; John Roe") — compare as
// name sets, not strings. "" contributes nothing, so empty never matches.
function personSet(s: string): { [k: string]: boolean } {
  const set: { [k: string]: boolean } = {};
  for (const part of s.split(/[;,\/]+/)) {
    const k = normKey(part);
    if (k) {
      set[k] = true;
    }
  }
  return set;
}

function setOverlaps(a: { [k: string]: boolean }, b: { [k: string]: boolean }): boolean {
  for (const k in a) {
    if (b[k]) {
      return true;
    }
  }
  return false;
}

// Corpus-generic title words carry no pair signal (DocKind affinity
// already scores the doc-type; lrs/location/referencing name the whole
// corpus). config title.stop appends to this list — never replaces it.
const TITLE_STOP: { [t: string]: boolean } = {};
for (const w of (
  "the and for with from into onto over under about are was were not " +
  "all any new old per via use using doc docs document documents file " +
  "files test tests testing plan plans user users story stories design " +
  "designs spike spikes data template templates schedule schedules " +
  "review reviews draft final copy note notes overview version versions " +
  "update updated lrs location referencing arcgis esri"
).split(" ")) {
  TITLE_STOP[w] = true;
}

// Distinctive title tokens: lowercased alphanumeric runs, 3+ chars,
// at least one letter, minus stopwords; deduped.
function titleTokens(title: string, extraStop: { [t: string]: boolean }): { [t: string]: boolean } {
  const set: { [t: string]: boolean } = {};
  for (const part of title.toLowerCase().split(/[^a-z0-9]+/)) {
    if (part.length < 3 || !/[a-z]/.test(part) || TITLE_STOP[part] || extraStop[part]) {
      continue;
    }
    set[part] = true;
  }
  return set;
}

function defaultConfig(): RankConfig {
  return {
    edge: { id: 1000, review: 100, gantt: 60, titlematch: 40 },
    kwKind: { topic: 1.0, tool: 0.6, product: 0.4 },
    meta: { kind: 0.5, surface: 0.5, release: 1.0, pe: 0.75, dev: 0.75 },
    title: { weight: 0.4, cap: 6, stop: [] },
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
  const title = raw["title"] as SpRow | undefined;
  if (title && typeof title === "object") {
    cfg.title.weight = numOr(title["weight"], cfg.title.weight);
    const cap = numOr(title["cap"], cfg.title.cap);
    cfg.title.cap = cap >= 0 ? Math.floor(cap) : cfg.title.cap;
    const stop = title["stop"];
    if (Array.isArray(stop)) {
      for (const w of stop) {
        if (typeof w === "string" && normKey(w)) {
          cfg.title.stop.push(normKey(w));
        }
      }
    }
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
    title: strField(row, "Title"),
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
    title: strField(selfRaw, "title"),
  };
  const todayMs = cfg.today ? Date.parse(cfg.today) : Date.now();
  const selfMs = Date.parse(selfMeta.modified);
  // v2.1: self-side sets are pair-independent — compute them once
  // (the SB-9 rule: nothing loop-invariant inside the entries loop)
  const extraStop: { [t: string]: boolean } = {};
  for (const w of cfg.title.stop) {
    extraStop[w] = true;
  }
  const selfPe = personSet(selfMeta.pe);
  const selfDev = personSet(selfMeta.dev);
  const selfToks = titleTokens(selfMeta.title, extraStop);

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

    // v2.1: only id edges score outside the soft bucket (Eid);
    // every other type accumulates into Esoft below the cap
    const eScore = cfg.edge["id"] * ids.length;
    let eSoft = 0;
    const types = Object.keys(edgeN[doc] || {}).sort();
    for (const t of types) {
      eSoft += cfg.edge[t] * edgeN[doc][t];
    }

    let metaScore = 0;
    const metaParts: string[] = [];
    let titleScore = 0;
    let titleShared: string[] = [];
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
      // v2.1: name-set overlap, not string equality (multi-name fields)
      if (setOverlaps(selfPe, personSet(cm.pe))) {
        metaScore += cfg.meta.pe;
        metaParts.push("same pe");
      }
      if (setOverlaps(selfDev, personSet(cm.dev))) {
        metaScore += cfg.meta.dev;
        metaParts.push("same dev");
      }
      // v2.1: title-token affinity — shared distinctive tokens,
      // alphabetical (side-independent), counted up to title.cap
      if (cfg.title.weight > 0 && cfg.title.cap > 0) {
        const candToks = titleTokens(cm.title, extraStop);
        for (const t in candToks) {
          if (selfToks[t]) {
            titleShared.push(t);
          }
        }
        titleShared.sort();
        titleShared = titleShared.slice(0, cfg.title.cap);
        titleScore = cfg.title.weight * titleShared.length;
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

    // v2.1: EVERYTHING soft — non-id edges, keywords, metadata,
    // title, recency — shares one softCap bucket; with the default
    // 999 / edge.id 1000 an id link outranks any accumulation
    const soft = Math.min(eSoft + kwScore + metaScore + titleScore + recScore, cfg.softCap);
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
    if (titleShared.length > 0) {
      const tShown = titleShared.slice(0, 3).join(", ");
      const tMore = titleShared.length > 3 ? ", +" + (titleShared.length - 3) + " more" : "";
      parts.push(
        titleShared.length + " title word" + (titleShared.length === 1 ? "" : "s") +
        ": " + tShown + tMore
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
