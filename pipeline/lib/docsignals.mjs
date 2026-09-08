/**
 * docsignals.mjs v1.0 — the deterministic evidence beside the
 * classifier (sweep v1.66), and the rules that reconcile the two.
 *
 * Why. The classify prompt alone left too much on the floor: most
 * documentation reviews were stamped `Other` although every one of
 * them sits in the source library's "Doc Reviews" folder; a plan that
 * exercises the REST API was `Server` or `Other` because the surface
 * list had no REST; a tool the document names in its title was
 * missing from the row because the model returned six and stopped;
 * and a product the text never abbreviates was missed by the acronym
 * scan. Each of those has evidence a regex can see. This module reads
 * it BEFORE the model call (so the prompt gets it as "Signals") and
 * applies it AFTER (so the row is right even when the model ignores
 * it). Pure functions, no I/O; the sweep supplies the text, the
 * folder path, the vocabulary and the regex products.
 *
 *   folderKind(folder, folderKinds)     the kind a library folder implies
 *   detectSurfaces(text, fileName, vocab) scored surface evidence
 *   signalsBlock(signals)               the prompt's Signals input
 *   reconcile(ai, signals, opts)        the merged classification
 *
 * Surfaces. Six values: Pro, Experience Builder, REST, Server,
 * Enterprise, Other. REST is new — the Linear Referencing Service's
 * operations (applyEdits, geometryToMeasure, …), request and response
 * JSON, endpoint paths. `Server` keeps the service-side concerns that
 * are not an API call (publishing, the LRS server extension, service
 * configuration); `Enterprise` the portal and deployment. A document
 * has one PRIMARY surface (the Doc Index `Surface` choice, the sidecar
 * Doc row) and may have more (`Surfaces`), so a plan that drives a Pro
 * tool and then checks the result through REST shows under both.
 *
 * Evidence is scored, not counted: a strong cue (the literal "ArcGIS
 * Pro", "Experience Builder", an operation name, "ArcGIS Enterprise")
 * scores 3, a good cue ("geoprocessing", "widget", "/rest/services",
 * "portal") 2, a weak one ("ribbon", "endpoint", "web map") 1, each
 * cue once — repetition is not evidence. A surface with score ≥ STRONG
 * (4) is one the document is ABOUT; ≥ PRESENT (2) is one it touches.
 * The reconciliation never demotes the model's own primary surface —
 * the evidence adds, and stands in when the model said Other.
 */

import { TOOL_KINDS, toolKey } from "./vocabulary.mjs";

export const SURFACES = ["Pro", "Experience Builder", "REST", "Server", "Enterprise", "Other"];
export const PRODUCTS = ["Roads & Highways", "Pipeline Referencing", "Utility Network", "Address Data Management"];
export const DOC_KINDS = [
  "Test Plan", "User Story", "Design Spike", "Data Template",
  "Schedule", "Doc Review", "Other",
];

export const STRONG = 4;
export const PRESENT = 2;

/** The folder → kind rule the sweep ships with (`sweep.folderKinds`
 *  in config extends or replaces it). Keys match a folder SEGMENT of
 *  the document's library path, case-insensitively, with runs of
 *  space / underscore / hyphen folded to one space. */
export const DEFAULT_FOLDER_KINDS = {
  "Doc Reviews": "Doc Review",
  "Doc Review": "Doc Review",
  "Documentation Reviews": "Doc Review",
  "Documentation Review": "Doc Review",
};

const segKey = (s) => String(s ?? "").toLowerCase().replace(/[\s_\-]+/g, " ").trim();

/**
 * The kind a document's library folder implies, or "". `folder` is the
 * path of folders under the library root ("General/Doc Reviews/2026");
 * the DEEPEST matching segment wins, so a "Test Plans" folder inside
 * "Doc Reviews" still reads as its own kind when the config maps it.
 */
export function folderKind(folder, folderKinds = DEFAULT_FOLDER_KINDS) {
  const map = new Map();
  for (const [k, v] of Object.entries(folderKinds || {})) {
    if (DOC_KINDS.includes(v)) map.set(segKey(k), v);
  }
  if (!map.size) return "";
  const segs = String(folder ?? "").split(/[\\/]+/).map(segKey).filter(Boolean);
  for (let i = segs.length - 1; i >= 0; i--) {
    if (map.has(segs[i])) return map.get(segs[i]);
  }
  return "";
}

/** The folder part of a library-relative path ("General/Doc Reviews"
 *  from "General/Doc Reviews/x.docx"), "" at the root. */
export function folderOf(libRel) {
  const parts = String(libRel ?? "").split(/[\\/]+/).filter(Boolean);
  parts.pop();
  return parts.join("/");
}

// ---- surfaces --------------------------------------------------------

/** One cue: the surface it argues for, its weight, a label for the
 *  evidence line, and the pattern (case-sensitive unless /i). */
const CUES = [
  // Pro
  { s: "Pro", w: 3, label: "ArcGIS Pro", re: /\bArcGIS\s+Pro\b/i },
  { s: "Pro", w: 2, label: "geoprocessing", re: /\bgeoprocessing\b|\bGP\s+tools?\b/i },
  { s: "Pro", w: 2, label: "Location Referencing tab", re: /\bLocation\s+Referencing\s+(?:tab|ribbon)\b/i },
  { s: "Pro", w: 2, label: "toolbox", re: /\btoolbox\b|\.atbx\b|\.tbx\b/i },
  { s: "Pro", w: 2, label: "Pro project", re: /\.aprx\b|\bPro\s+project\b/i },
  { s: "Pro", w: 1, label: "ribbon", re: /\bribbon\b/i },
  { s: "Pro", w: 1, label: "pane", re: /\b(?:Geoprocessing|Contents|Catalog|Attributes|Modify\s+Features)\s+pane\b/i },
  { s: "Pro", w: 1, label: "Pro", re: /(?:^|[^A-Za-z])Pro(?:\s+\d+\.\d+)?(?=[^A-Za-z]|$)/ },
  { s: "Pro", w: 1, label: "map view", re: /\bmap\s+view\b|\battribute\s+table\b/i },
  // Experience Builder
  { s: "Experience Builder", w: 3, label: "Experience Builder", re: /\bExperience\s+Builder\b/i },
  { s: "Experience Builder", w: 3, label: "ExB", re: /(?:^|[^A-Za-z])ExB(?=[^A-Za-z]|$)/ },
  { s: "Experience Builder", w: 2, label: "widget", re: /\bwidgets?\b/i },
  { s: "Experience Builder", w: 1, label: "web map", re: /\bweb\s+map\b|\bweb\s+app(?:lication)?s?\b/i },
  { s: "Experience Builder", w: 1, label: "experience", re: /\bexperiences?\b(?=.*\b(?:widget|builder|app)\b)/i },
  // REST
  { s: "REST", w: 3, label: "REST API", re: /\bREST\s+(?:API|endpoint|operation|service|request|call)s?\b/i },
  { s: "REST", w: 3, label: "LRServer", re: /\bLRS?Server\b/ },
  { s: "REST", w: 2, label: "REST", re: /(?:^|[^A-Za-z])REST(?=[^A-Za-z]|$)/ },
  { s: "REST", w: 2, label: "/rest/services", re: /\/rest\/services\b/i },
  { s: "REST", w: 2, label: "f=json", re: /\bf=p?json\b|\bf=html\b/ },
  { s: "REST", w: 2, label: "HTTP verb", re: /\b(?:GET|POST)\s+(?:https?:\/\/|\/)/ },
  { s: "REST", w: 2, label: "request/response", re: /\brequest\s+(?:body|parameters?|payload)\b|\bresponse\s+(?:body|JSON)\b|\bJSON\s+(?:request|response)\b/i },
  { s: "REST", w: 1, label: "endpoint", re: /\bendpoints?\b/i },
  { s: "REST", w: 1, label: "query parameters", re: /\bquery\s+param(?:eter)?s?\b|\bstatus\s+code\b|\bHTTP\s+\d{3}\b/i },
  // Server
  { s: "Server", w: 3, label: "ArcGIS Server", re: /\bArcGIS\s+Server\b/i },
  { s: "Server", w: 3, label: "server extension", re: /\b(?:Linear|Location)\s+Referencing\s+(?:Server\s+)?extension\b|\bserver\s+object\s+extension\b|\bSOE\b/i },
  { s: "Server", w: 2, label: "publishing", re: /\bpublish(?:ing|ed)?\s+(?:a\s+|the\s+)?(?:map\s+|feature\s+|web\s+)?(?:service|layer)s?\b/i },
  { s: "Server", w: 1, label: "service", re: /\b(?:map|feature)\s+services?\b|\bservice\s+definition\b|\bArcGIS\s+Server\s+Manager\b/i },
  // Enterprise
  { s: "Enterprise", w: 3, label: "ArcGIS Enterprise", re: /\bArcGIS\s+Enterprise\b|\bPortal\s+for\s+ArcGIS\b/i },
  { s: "Enterprise", w: 2, label: "portal", re: /\bportal\b/i },
  { s: "Enterprise", w: 2, label: "federation", re: /\bfederat(?:ed|ion|e)\b|\bhosting\s+server\b|\bweb\s+adaptor\b/i },
  { s: "Enterprise", w: 1, label: "deployment", re: /\bdeployment\b|\bhigh\s+availability\b|\bupgrade\s+(?:the\s+)?(?:portal|enterprise|server)\b/i },
];

/** A file-name cue is worth a strong signal on its own: the team names
 *  files "ExB_Search_by_Route", "REST applyEdits plan". */
const NAME_CUES = [
  { s: "Experience Builder", label: "file name says ExB", re: /(?:^|[^A-Za-z])(?:ExB|EXB)(?=[^A-Za-z]|$)|experience\s*builder/i },
  { s: "REST", label: "file name says REST", re: /(?:^|[^A-Za-z])REST(?=[^A-Za-z]|$)/ },
  { s: "Pro", label: "file name says Pro", re: /(?:^|[^A-Za-z])Pro(?=[^A-Za-z]|$)/ },
  { s: "Enterprise", label: "file name says Enterprise", re: /\benterprise\b|\bportal\b/i },
  { s: "Server", label: "file name says Server", re: /(?:^|[^A-Za-z])Server(?=[^A-Za-z]|$)/ },
];

/** The kinds → surface map from the vocabulary (tool/ribbon → Pro,
 *  widget → Experience Builder, rest → REST). */
const kindSurface = new Map(TOOL_KINDS.filter((k) => k.surface).map((k) => [k.kind, k.surface]));

/**
 * Scored surface evidence for one document:
 *   [{ surface, score, evidence: [label, …] }] sorted by score desc,
 *   Other never listed. `namedTools` (official names, from
 *   vocabulary.toolsNamedIn) each add 2 to the surface their kind
 *   implies — a document that names three widgets is about Experience
 *   Builder whether or not it says so.
 */
export function detectSurfaces(text, fileName = "", vocab = null, namedTools = []) {
  const src = String(text ?? "");
  const scores = new Map();
  const evidence = new Map();
  const add = (s, w, label) => {
    scores.set(s, (scores.get(s) || 0) + w);
    const list = evidence.get(s) || [];
    if (!list.includes(label)) list.push(label);
    evidence.set(s, list);
  };
  for (const c of CUES) if (c.re.test(src)) add(c.s, c.w, c.label);
  const base = String(fileName ?? "").replace(/\.[^.]+$/, "");
  for (const c of NAME_CUES) if (c.re.test(base)) add(c.s, 3, c.label);
  const kindOf = vocab?.kindOf || new Map();
  for (const t of namedTools || []) {
    const s = kindSurface.get(kindOf.get(t) || "");
    if (s) add(s, 2, t);
  }
  return [...scores.entries()]
    .filter(([s]) => SURFACES.includes(s) && s !== "Other")
    .map(([surface, score]) => ({ surface, score, evidence: evidence.get(surface) || [] }))
    .sort((a, b) => b.score - a.score || SURFACES.indexOf(a.surface) - SURFACES.indexOf(b.surface));
}

// ---- the prompt's Signals block ----------------------------------------

/**
 * The lines the classifier reads under "Signals" — what the pipeline
 * already knows for certain, phrased as evidence, never as an answer
 * the model must copy. `signals` is what the sweep assembles:
 *   { folder, folderKind, products, namedTools, surfaces }
 * "(none)" when nothing is known.
 */
export function signalsBlock(signals = {}) {
  const out = [];
  const fk = signals.folderKind || "";
  if (fk) out.push(`Library folder "${signals.folder || ""}" is the team's ${fk} folder — documents there are ${fk}s unless the content is unmistakably another kind.`);
  if (signals.products?.length) out.push(`Products named in the text: ${signals.products.join("; ")}`);
  if (signals.namedTools?.length) out.push(`Known tools named in the text: ${signals.namedTools.join("; ")}`);
  const strong = (signals.surfaces || []).filter((s) => s.score >= PRESENT);
  if (strong.length) {
    out.push("Surface evidence in the text (strongest first): " +
      strong.map((s) => `${s.surface} (${s.evidence.slice(0, 4).join(", ")})`).join("; "));
  }
  return out.length ? out.join("\n") : "(none)";
}

// ---- reconciliation ----------------------------------------------------

const productKey = (s) => toolKey(s);
const PRODUCT_KEYS = new Map(PRODUCTS.map((p) => [productKey(p), p]));
// the acronyms and the pre-rename names the model might still return
const PRODUCT_ALIASES = new Map([
  ["rh", "Roads & Highways"], ["roads highways", "Roads & Highways"], ["arcgis roads and highways", "Roads & Highways"],
  ["apr", "Pipeline Referencing"], ["arcgis pipeline referencing", "Pipeline Referencing"],
  ["un", "Utility Network"], ["arcgis utility network", "Utility Network"],
  ["adm", "Address Data Management"], ["arcgis address data management", "Address Data Management"],
  ["address management", "Address Data Management"],
]);

/** A product name the model returned → the canonical name, or "". */
export function canonicalProduct(name) {
  const k = productKey(name);
  return PRODUCT_KEYS.get(k) || PRODUCT_ALIASES.get(k) || "";
}

const surfaceKey = (s) => String(s ?? "").toLowerCase().replace(/[^a-z]+/g, " ").trim();
const SURFACE_KEYS = new Map(SURFACES.map((s) => [surfaceKey(s), s]));
const SURFACE_ALIASES = new Map([
  ["arcgis pro", "Pro"], ["exb", "Experience Builder"], ["arcgis experience builder", "Experience Builder"],
  ["rest api", "REST"], ["arcgis server", "Server"], ["arcgis enterprise", "Enterprise"], ["portal", "Enterprise"],
]);

/** A surface the model returned → one of SURFACES, or "". */
export function canonicalSurface(name) {
  const k = surfaceKey(name);
  return SURFACE_KEYS.get(k) || SURFACE_ALIASES.get(k) || "";
}

/**
 * The classification the row gets, from the model's reply and the
 * signals. Every rule is a sentence:
 *
 *   docKind    the model's, whitelisted; a folder kind REPLACES it
 *              (`folderKindWins`, the default — the folder is the
 *              team's own filing) or replaces only `Other` when the
 *              option is off.
 *   surfaces   the model's `surfaces` (its `surface` first), each
 *              whitelisted, Other dropped; then every signal surface
 *              at ≥ STRONG that the model left out is appended; when
 *              the model said nothing but Other, the strongest
 *              signal at ≥ STRONG stands in. Empty = ["Other"] on the
 *              row, [] in the list.
 *   surface    surfaces[0], or Other.
 *   tools      the model's (already normalized by the caller) then the
 *              names the text carries that the model left out.
 *   products   the regex scan's (deterministic, canonical order) plus
 *              the model's, canonicalized — in PRODUCTS order.
 *
 * Returns { docKind, surface, surfaces, tools, products, notes }
 * where notes counts what each rule changed: kindFromFolder,
 * surfaceFromSignals (surfaces added), toolsFromText, productsFromModel.
 */
export function reconcile(ai, signals = {}, opts = {}) {
  const folderKindWins = opts.folderKindWins !== false;
  const notes = { kindFromFolder: 0, surfaceFromSignals: 0, toolsFromText: 0, productsFromModel: 0 };

  // kind
  let docKind = DOC_KINDS.includes(ai?.docKind) ? ai.docKind : "Other";
  const fk = signals.folderKind && DOC_KINDS.includes(signals.folderKind) ? signals.folderKind : "";
  if (fk && fk !== docKind && (folderKindWins || docKind === "Other")) {
    docKind = fk;
    notes.kindFromFolder = 1;
  }

  // surfaces
  const surfaces = [];
  const pushSurface = (s) => {
    const c = canonicalSurface(s);
    if (c && c !== "Other" && !surfaces.includes(c)) surfaces.push(c);
  };
  pushSurface(ai?.surface);
  for (const s of Array.isArray(ai?.surfaces) ? ai.surfaces : []) pushSurface(s);
  // the signals are sorted strongest first, so a model that said Other
  // gets the strongest signal as its primary and the other strong ones
  // as secondaries; a model that answered keeps its order and gains
  // the strong surfaces it left out
  for (const sig of signals.surfaces || []) {
    if (sig.score < STRONG) continue;
    if (!surfaces.includes(sig.surface)) {
      surfaces.push(sig.surface);
      notes.surfaceFromSignals += 1;
    }
  }
  const surface = surfaces[0] || "Other";

  // tools
  const tools = [];
  const seen = new Set();
  const pushTool = (t) => {
    const k = toolKey(t);
    if (!k || seen.has(k)) return false;
    seen.add(k);
    tools.push(String(t));
    return true;
  };
  for (const t of Array.isArray(ai?.tools) ? ai.tools : []) pushTool(t);
  for (const t of signals.namedTools || []) if (pushTool(t)) notes.toolsFromText += 1;

  // products
  const found = new Set((signals.products || []).map(canonicalProduct).filter(Boolean));
  for (const p of Array.isArray(ai?.products) ? ai.products : []) {
    const c = canonicalProduct(p);
    if (c && !found.has(c)) {
      found.add(c);
      notes.productsFromModel += 1;
    }
  }
  const products = PRODUCTS.filter((p) => found.has(p));

  return { docKind, surface, surfaces, tools, products, notes };
}
