/**
 * slug.mjs — sidecar file STEMS (Sidecar_Format_Plan §4.6, phase 1b).
 *
 *   <Kind folder>/<issue>-<slug>[-<qualifier>].md
 *   media/<stem>/<asset>
 *
 * Decided 2026-09-05: issue-number prefix on (number only, no
 * padding), no doc-id token, glossary abbreviations on. A stem is
 * minted once and then frozen (the row's TextFileUrl is the record);
 * `--rename` re-mints the whole corpus from these rules.
 *
 * Pure functions, no I/O: the sweep supplies the rows and the taken
 * set; the gate feeds titles straight in.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const SOFT_CAP = 60;
export const HARD_CAP = 72;
export const MEDIA_PLACEHOLDER = "../media/__MEDIA__/";

const STOPWORDS = new Set(["a", "an", "and", "as", "at", "by", "for", "from", "in", "into",
  "of", "on", "or", "the", "to", "via", "vs", "with"]);

/** Kind words dropped from a slug when they match the document's kind. */
const KIND_WORDS = {
  "Test Plan": [/\btest[\s-]*plans?\b/gi, /\btest[\s-]*cases?\b/gi, /\bacceptance[\s-]*tests?\b/gi, /\btest[\s-]*plan[\s-]*v\d+\b/gi],
  "User Story": [/\buser[\s-]*stor(?:y|ies)\b/gi],
  "Design Spike": [/\bdesign[\s-]*spikes?\b/gi, /\bspikes?\b/gi],
  "Doc Review": [/\bdoc(?:ument)?[\s-]*reviews?\b/gi],
};

const PRODUCT_ACRONYM = {
  "roads & highways": "rh", "roads and highways": "rh",
  "pipeline referencing": "apr", "utility network": "un",
};

let defaultAbbr = null;
/** The shipped abbreviation map (local/slug_abbreviations.json). */
export function defaultAbbreviations() {
  if (!defaultAbbr) {
    try {
      const j = JSON.parse(fs.readFileSync(path.join(HERE, "..", "slug_abbreviations.json"), "utf8"));
      defaultAbbr = Object.fromEntries(Object.entries(j).filter(([k]) => !k.startsWith("$")));
    } catch {
      defaultAbbr = {};
    }
  }
  return defaultAbbr;
}

/** Plain kebab-case of any text: lowercase [a-z0-9-], no edge dashes. */
export function kebab(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/['’‘"“”]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Drop the kind's own words ("Test Plan: X", "X Test Plan V2") and the
 *  punctuation they leave behind. */
export function stripKindWords(title, kind) {
  let t = String(title ?? "");
  for (const re of KIND_WORDS[kind] || []) t = t.replace(re, " ");
  return t.replace(/\s+/g, " ").replace(/^[\s:–—\-,.;]+|[\s:–—\-,.;]+$/g, "").trim();
}

/** Apply the abbreviation map token-wise (whole tokens on hyphen
 *  boundaries, longest keys first). */
export function abbreviate(slug, abbr) {
  const map = abbr || defaultAbbreviations();
  let s = String(slug);
  for (const key of Object.keys(map).sort((a, b) => b.length - a.length)) {
    const re = new RegExp(`(^|-)${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=-|$)`, "g");
    s = s.replace(re, `$1${map[key]}`);
  }
  return s.replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}

/** Cut a slug to the soft cap at a word boundary, never ending on a
 *  stopword; hard cap as the last resort. */
export function capSlug(slug, soft = SOFT_CAP, hard = HARD_CAP) {
  let s = String(slug);
  if (s.length > soft) {
    const cut = s.lastIndexOf("-", soft);
    s = cut >= 16 ? s.slice(0, cut) : s.slice(0, soft);
  }
  for (;;) {
    const parts = s.split("-");
    if (parts.length > 1 && STOPWORDS.has(parts[parts.length - 1])) { parts.pop(); s = parts.join("-"); continue; }
    break;
  }
  if (s.length > hard) s = s.slice(0, hard).replace(/-[^-]*$/, "");
  return s.replace(/^-+|-+$/g, "");
}

/** The source basename with issue prefix, revision suffix and
 *  upload/copy noise removed — the fallback when a title is missing. */
export function cleanBaseName(fileName) {
  let b = String(fileName ?? "").replace(/^.*[\\/]/, "").replace(/\.[^.]+$/, "");
  b = b.replace(/^\d{2,5}[-_ ]+/, "");
  b = b.replace(/[-_ ]*(?:test[-_ ]?plan|testplan|tp)[-_ ]*v?\d*$/i, "");
  b = b.replace(/[-_ ]*v\d{1,2}$/i, "");
  b = b.replace(/\s*\(\d+\)(?:\s*\d+)?$/g, "");
  b = b.replace(/[-_ ]+(?:copy|final|fixed|feedback|draft)\b/gi, " ");
  // camelCase → words so the slug reads
  b = b.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return kebab(b);
}

/**
 * The slug part of a stem: title → kind words dropped → kebab →
 * abbreviations → capped. Falls back to the cleaned basename, then
 * "doc".
 */
export function slugFor({ title, fileName, kind, abbreviations }) {
  const fromTitle = capSlug(abbreviate(kebab(stripKindWords(title, kind)), abbreviations));
  if (fromTitle) return fromTitle;
  const fromName = capSlug(abbreviate(cleanBaseName(fileName), abbreviations));
  return fromName || "doc";
}

/** The document's primary issue number: the source filename's own
 *  prefix first, then the lowest url-sourced id, then any. 0 = none. */
export function primaryIssue(ids, fileName) {
  const list = (ids || []).filter((i) => i && Number(i.number) > 0);
  const fromName = list.find((i) => i.source === "filename");
  if (fromName) return Number(fromName.number);
  const m = /^(\d{2,5})[-_ ]/.exec(String(fileName ?? "").replace(/^.*[\\/]/, ""));
  if (m && list.some((i) => Number(i.number) === Number(m[1]))) return Number(m[1]);
  const byNum = (a, b) => Number(a.number) - Number(b.number);
  const urls = list.filter((i) => i.source === "url").sort(byNum);
  if (urls.length) return Number(urls[0].number);
  const rest = [...list].sort(byNum);
  return rest.length ? Number(rest[0].number) : 0;
}

/** Product acronym qualifier ("rh", "apr", "rh-apr"), "" when none. */
export function productTag(products) {
  const tags = [];
  for (const p of products || []) {
    const t = PRODUCT_ACRONYM[String(p).toLowerCase().trim()];
    if (t && !tags.includes(t)) tags.push(t);
  }
  return tags.join("-");
}

/** The un-qualified stem for a document. */
export function baseStem(doc, abbreviations) {
  const slug = slugFor({ title: doc.title, fileName: doc.fileName, kind: doc.kind, abbreviations });
  const issue = doc.issue !== undefined ? Number(doc.issue) || 0 : primaryIssue(doc.ids, doc.fileName);
  return issue > 0 ? `${issue}-${slug}` : slug;
}

/** Qualifier candidates for one document, weakest-to-strongest, each
 *  cumulative: product · +rev · +month. */
function qualifierLevels(doc) {
  const q = [];
  const prod = productTag(doc.products);
  const rev = String(doc.docRevision || "").trim().toLowerCase();
  const month = (String(doc.lastEdited || "").match(/^\d{4}-\d{2}/) || [""])[0];
  const acc = [];
  if (prod) { acc.push(prod); q.push(acc.join("-")); }
  if (rev) { acc.push(rev.startsWith("v") ? rev : `v${rev}`); q.push(acc.join("-")); }
  if (month) { acc.push(month); q.push(acc.join("-")); }
  return q;
}

/**
 * Incremental minting (a new document arriving nightly): the first
 * candidate not in `taken` — base, base + product, + rev, + month,
 * then a numeric suffix. `taken` is the set of stems already used in
 * the destination folder.
 */
export function mintStem(doc, taken, abbreviations) {
  const base = baseStem(doc, abbreviations);
  const has = (s) => taken && (taken.has ? taken.has(s) : taken.includes(s));
  if (!has(base)) return base;
  for (const q of qualifierLevels(doc)) if (!has(`${base}-${q}`)) return `${base}-${q}`;
  for (let n = 2; n < 1000; n++) if (!has(`${base}-${n}`)) return `${base}-${n}`;
  return `${base}-${Date.now()}`;
}

/**
 * Batch minting (`--rename`): every document of ONE folder at once.
 * Documents sharing a base stem all take the first qualifier level at
 * which the group is fully distinct (so RH/APR twins become `-rh` /
 * `-apr`, not `` / `-apr`), then a numeric suffix in row-id order for
 * whatever still collides. Returns Map<rowId, stem>.
 */
export function mintStems(docs, abbreviations) {
  const out = new Map();
  const groups = new Map();
  for (const d of [...docs].sort((a, b) => Number(a.rowId) - Number(b.rowId))) {
    const base = baseStem(d, abbreviations);
    if (!groups.has(base)) groups.set(base, []);
    groups.get(base).push(d);
  }
  const used = new Set();
  const claim = (d, stem) => {
    let s = stem;
    for (let n = 2; used.has(s); n++) s = `${stem}-${n}`;
    used.add(s);
    out.set(d.rowId, s);
  };
  for (const [base, members] of groups) {
    if (members.length === 1) { claim(members[0], base); continue; }
    const maxLevels = Math.max(...members.map((d) => qualifierLevels(d).length));
    let chosen = null;
    for (let level = 0; level < maxLevels; level++) {
      const cands = members.map((d) => {
        const q = qualifierLevels(d);
        return q[Math.min(level, q.length - 1)] || "";
      });
      if (new Set(cands).size === members.length && cands.every(Boolean)) { chosen = cands; break; }
    }
    if (chosen) members.forEach((d, i) => claim(d, `${base}-${chosen[i]}`));
    else {
      // no qualifier separates them (re-uploads of one file): the
      // strongest level they have, then numeric suffixes
      members.forEach((d) => {
        const q = qualifierLevels(d);
        claim(d, q.length ? `${base}-${q[q.length - 1]}` : base);
      });
    }
  }
  return out;
}

/** The stem (filename without .md) of a sidecar URL or path. */
export function stemOf(urlOrPath) {
  const last = String(urlOrPath ?? "").split(/[\\/]/).pop() || "";
  let name;
  try { name = decodeURIComponent(last); } catch { name = last; }
  return name.replace(/\.md$/i, "");
}

/** True for the pre-3.0 `{slug}__doc{N}` naming. */
export function isLegacyStem(stem) {
  return /__doc\d+$/.test(String(stem));
}

/** Point the body's placeholder media links at the document's media folder. */
export function relinkMedia(text, stem) {
  return String(text ?? "").split(MEDIA_PLACEHOLDER).join(`../media/${stem}/`);
}

/** Media links a body carries, as [{link, dir, name}] where dir is
 *  the `../media/<dir>/` folder or "" for a legacy `doc{N}_` flat file. */
export function mediaLinksOf(body) {
  const out = [];
  const seen = new Set();
  const re = /\]\(<?(\.\.\/media\/([^)\s>]+))>?\)/g;
  let m;
  while ((m = re.exec(String(body ?? ""))) !== null) {
    if (seen.has(m[1])) continue;
    seen.add(m[1]);
    const rel = m[2];
    const slash = rel.indexOf("/");
    if (slash >= 0) out.push({ link: m[1], dir: rel.slice(0, slash), name: rel.slice(slash + 1) });
    else {
      const lm = /^doc(\d+)_(.+)$/.exec(rel);
      out.push({ link: m[1], dir: "", name: lm ? lm[2] : rel, legacyPrefix: lm ? `doc${lm[1]}_` : "" });
    }
  }
  return out;
}
