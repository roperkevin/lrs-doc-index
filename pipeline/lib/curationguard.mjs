/**
 * curationguard.mjs — the deterministic half of the curation guard.
 *
 * The model is asked (prompts/keyword_curation.md) to merge only a
 * DIFFERENCE OF FORM — plural, typo, joining, abbreviation — and to
 * point the alias at the catalog-style form: singular, spaced, spelled
 * out. Both halves are checkable without a model for the common
 * shapes, and 2026-09-07 showed why they must be: told that a title
 * may never be an alias (the DoNotPropose list), the model proposed
 * the REVERSE pair instead — 'centerline' -> 'centerlines',
 * '3d measure' -> '3d measures', 39 of 39 in one run — every one a
 * merge in the wrong direction whose alias side happened to be
 * blocked. `directionProblem()` names that shape so curate.mjs drops
 * it, and `--approve` refuses it even from a reviewed list.
 *
 * Also here: `readIds()`, the one-ID-per-line file the review commands
 * (curate --approve / --withdraw, unmerge --ids-file) take.
 */

import fs from "node:fs";

/** lowercase, punctuation to spaces, runs of spaces collapsed — the
 *  prompt's own normalization. */
export function normalizeTitle(t) {
  return String(t ?? "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
}

/** true when `p` is the regular English plural of `s`. */
export function isPluralOf(p, s) {
  if (!s || p === s) return false;
  if (p === s + "s" || p === s + "es") return true;
  if (s.endsWith("y") && p === s.slice(0, -1) + "ies") return true;
  return false;
}

/** true when the letters of `short` are, in order, the initials of the
 *  words of `long` ("sld" / "straight line diagram"). */
export function isInitialism(short, long) {
  const s = normalizeTitle(short).replace(/ /g, "");
  const words = normalizeTitle(long).split(" ").filter(Boolean);
  if (!s || words.length < 2 || s.length !== words.length) return false;
  return words.every((w, i) => w[0] === s[i]);
}

/**
 * The reason `canonical` is the wrong side of the pair, or "" when the
 * direction is fine (or undecidable — a typo pair has no side).
 *   - same word count, and some canonical word is the plural of its
 *     alias word while no alias word is a plural → the canonical is
 *     the plural side
 *   - the two collapse to the same string without spaces/hyphens and
 *     the canonical has fewer words, or hyphens the alias lacks → the
 *     canonical is the joined / hyphenated form
 *   - the canonical is an initialism of the alias → the canonical is
 *     the abbreviation
 */
export function directionProblem(alias, canonical, official = null) {
  const a = normalizeTitle(alias);
  const c = normalizeTitle(canonical);
  if (!a || !c) return "";
  // the Esri documentation's own term is the catalog's canonical form:
  // an official alias may only fold into another official term, and an
  // official canonical is the right side whatever its shape — "Apply
  // Event Behaviors" is the tool's name, so 'apply event behavior' folds
  // into the plural, against the A1 rule below
  if (official?.size) {
    if (official.has(a) && !official.has(c)) return "the alias is the official Esri term — merge the other way";
    if (official.has(c)) return "";
  }
  const hy = (s) => (String(s ?? "").match(/-/g) || []).length;
  if (a === c) {
    // the same words: only punctuation differs (A3) — the spaced,
    // unhyphenated form is the catalog's
    return hy(canonical) > hy(alias) ? "the canonical is the hyphenated form — merge it into the spaced form" : "";
  }
  const aw = a.split(" ");
  const cw = c.split(" ");
  if (aw.length === cw.length) {
    let canonPlural = 0;
    let aliasPlural = 0;
    for (let i = 0; i < aw.length; i++) {
      if (aw[i] === cw[i]) continue;
      if (isPluralOf(cw[i], aw[i])) canonPlural++;
      else if (isPluralOf(aw[i], cw[i])) aliasPlural++;
    }
    if (canonPlural && !aliasPlural) return "the canonical is the plural side — merge the plural into the singular";
  }
  const aJoined = a.replace(/ /g, "");
  const cJoined = c.replace(/ /g, "");
  if (aJoined === cJoined) {
    if (cw.length < aw.length) return "the canonical is the joined form — merge it into the spaced form";
  }
  if (isInitialism(canonical, alias)) return "the canonical is the abbreviation — merge it into the expansion";
  return "";
}

/**
 * Every reason a proposal (alias row → canonical row) may not stand,
 * in the order curate.mjs reports them; "" when it passes. Rows are
 * the Keywords snapshot shape {ID, Title, Kind, CanonicalRefId,
 * CurationStatus}; either may be undefined (not a real row).
 * `official` is the Set of normalized official terms and tool names
 * (lib/vocabulary.mjs) — an official title is never the alias of an
 * unofficial one.
 */
export function proposalProblem(aliasRow, canonRow, official = null) {
  if (!aliasRow) return "the alias is not a real row";
  if (!canonRow) return "the canonical is not a real row";
  if (aliasRow.ID === canonRow.ID) return "alias and canonical are the same row";
  if (aliasRow.CanonicalRefId) return "the alias is already merged";
  if (aliasRow.CurationStatus) return `the alias is ${aliasRow.CurationStatus}`;
  if (canonRow.CanonicalRefId) return "the canonical is itself an alias";
  if (canonRow.CurationStatus === "Proposed") return "the canonical is itself pending review as an alias";
  if (aliasRow.Kind && canonRow.Kind && aliasRow.Kind !== canonRow.Kind) {
    return `kinds differ ([${aliasRow.Kind}] vs [${canonRow.Kind}])`;
  }
  return directionProblem(aliasRow.Title, canonRow.Title, official);
}

/** One row ID per line; blank lines and `#` comments ignored. Order kept. */
export function readIds(file) {
  const ids = [];
  const seen = new Set();
  for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const n = Number(line);
    if (!Number.isFinite(n)) throw new Error(`${file}: "${raw.trim()}" is not a row ID`);
    if (!seen.has(n)) { seen.add(n); ids.push(n); }
  }
  if (!ids.length) throw new Error(`${file}: no row IDs found`);
  return ids;
}
