/**
 * layoutaudit.mjs — the convergence audit (Markdown_Layout_Plan
 * phase 6). Pure functions, no I/O.
 *
 * Phases 1–5 each left the READERS able to understand the shape they
 * replaced, so no consumer had to wait for a backfill. That tolerance
 * is not free: every legacy form is a branch that has to keep working
 * and a fixture that has to keep passing. It comes out only when the
 * corpus no longer holds the shape — and this module is how anyone
 * can tell.
 *
 * `auditLayout(content)` reports which legacy shapes ONE sidecar still
 * carries. `summarizeLayout` counts them across the corpus and names
 * the reader each one keeps alive; `renderLayoutPage` writes
 * `_Layout Audit.md` next to the other underscore pages. A shape whose
 * count is 0 across the whole corpus is a reader that can be deleted —
 * `retirable()` says which, and the sweep prints it.
 *
 * Every shape below is one the pipeline WROTE at some point, so the
 * names are stable: the audit page, the run summary and the gate all
 * key on them.
 */

import { readMeta, SIDECAR_FORMAT } from "./sidecarmeta.mjs";
import { bodySeamEnd } from "./doclinks.mjs";

export const LAYOUTAUDIT_VERSION = "1.0";

/** shape -> what still reads it, and where the reader lives. */
export const LEGACY_SHAPES = {
  yamlFrame: {
    what: "the pre-3.0 yaml metadata block",
    reader: "sidecarmeta.readMeta's legacy branch, doclinks.yamlList",
  },
  yamlRelated: {
    what: "the machine `related: [...]` yaml line",
    reader: "sidecarmeta.relEntries / yamlRelated, sidecarmeta.migrateRelMarkers",
  },
  format30: {
    what: "a 3.0 metadata table (every row printed, `—` when empty)",
    reader: "sidecarmeta.readMeta's `—` normalisation",
  },
  srcComment: {
    what: "a case's provenance as a trailing `<!-- src: … -->`",
    reader: "caseindex.tcCases' legacy capture, casegrammar.canonicalizeCaseBlocks",
  },
  deckCases: {
    what: "pre-3 `## Case N <!-- slide N -->` case sections",
    reader: "caseindex.deckCases",
  },
  h3Units: {
    what: "pre-1.3 H3 unit headings inside a test plan",
    reader: "nothing — presentation only (the wiki's table of contents)",
  },
  unanchoredCases: {
    what: "a case heading with no `{ #tc-… }` anchor",
    reader: "caseindex.slugger's derived-slug fallback",
  },
};

export const SHAPE_NAMES = Object.keys(LEGACY_SHAPES);

const count = (re, s) => (s.match(re) || []).length;

/**
 * auditLayout(content, { kind }) → { format, shapes: {name: count},
 * legacy: boolean } for ONE sidecar. `kind` gates the test-plan-only
 * shapes so a User Story's `### <slide title>` sections are never
 * counted as pre-1.3 units.
 */
export function auditLayout(content, opts = {}) {
  const s = String(content || "");
  const meta = readMeta(s);
  const seam = bodySeamEnd(s);
  const body = seam >= 0 ? s.slice(seam) : "";
  const isPlan = (opts.kind || meta.doc_kind) === "Test Plan";
  const tcHeads = [...body.matchAll(/^### TC-[PNU]\d+\b[^\n]*$/gm)].map((m) => m[0]);
  const shapes = {
    yamlFrame: /<!--\s*metadata\b/.test(s) || /^doc_id:\s/m.test(s) ? 1 : 0,
    yamlRelated: /^related:\s*\[/m.test(s) ? 1 : 0,
    format30: meta.format !== SIDECAR_FORMAT && /^\| \*\*Doc\*\* \|/m.test(s) ? 1 : 0,
    srcComment: count(/<!-- src: /g, body),
    deckCases: count(/^## .+ <!-- slide \d+ -->$/gm, body),
    h3Units: isPlan ? count(/^### (?!TC-[PNU]\d)/gm, body) : 0,
    unanchoredCases: tcHeads.filter((h) => !/\{\s*#[^}]+\}\s*$/.test(h)).length,
  };
  return {
    format: meta.format || "?",
    shapes,
    legacy: SHAPE_NAMES.some((k) => shapes[k] > 0),
  };
}

/** Corpus totals: files carrying each shape, and the occurrence count. */
export function summarizeLayout(entries) {
  const files = {};
  const hits = {};
  for (const k of SHAPE_NAMES) { files[k] = 0; hits[k] = 0; }
  const byFormat = {};
  for (const e of entries) {
    byFormat[e.format] = (byFormat[e.format] || 0) + 1;
    for (const k of SHAPE_NAMES) {
      if (e.shapes[k] > 0) { files[k]++; hits[k] += e.shapes[k]; }
    }
  }
  return {
    sidecars: entries.length,
    converged: entries.filter((e) => !e.legacy).length,
    formats: byFormat,
    shape_files: files,
    shape_hits: hits,
    retirable: retirable(files),
  };
}

/** The shapes no file carries any more — their readers can go. */
export function retirable(shapeFiles) {
  return SHAPE_NAMES.filter((k) => !shapeFiles[k]);
}

const clip = (s, n) => String(s || "").replaceAll("|", "/").replace(/\s+/g, " ").trim().slice(0, n);

export function renderLayoutPage(entries, stampIso) {
  const sum = summarizeLayout(entries);
  const out = [
    "# Layout audit — what still carries a legacy shape",
    "",
    "_Written by `sweep.mjs --layout-audit` (Markdown_Layout_Plan phase 6). " +
    "Every phase left the readers able to understand the shape it replaced, " +
    "so nothing had to wait for a backfill. A shape no file carries any more " +
    "is a reader that can be deleted — this page is the evidence._",
    "",
    `Run ${clip(stampIso, 20)} · ${sum.sidecars} sidecar(s) · ` +
    `${sum.converged} carrying no legacy shape.`,
    "",
    "## Formats",
    "",
    "| Format | Sidecars |", "|---|---|",
    ...Object.entries(sum.formats).sort().map(([f, n]) => `| ${f} | ${n} |`),
    "",
    "## Legacy shapes",
    "",
    "| Shape | Files | Occurrences | What it is | Kept alive for |",
    "|---|---|---|---|---|",
  ];
  for (const k of SHAPE_NAMES) {
    out.push(
      `| \`${k}\` | ${sum.shape_files[k]} | ${sum.shape_hits[k]} | ` +
      `${LEGACY_SHAPES[k].what} | ${LEGACY_SHAPES[k].reader} |`
    );
  }
  out.push("");
  if (sum.retirable.length) {
    out.push(
      "## Retirable now", "",
      "No sidecar carries these any more; their readers can be deleted:",
      "",
      ...sum.retirable.map((k) => `- \`${k}\` — ${LEGACY_SHAPES[k].reader}`),
      ""
    );
  } else {
    out.push("## Retirable now", "", "_None — every legacy shape is still in the corpus._", "");
  }
  const stragglers = entries.filter((e) => e.legacy);
  out.push(
    "## Sidecars still carrying one", "",
    stragglers.length ? "" : "_None._",
  );
  if (stragglers.length) {
    out.push("| Document | Format | Shapes |", "|---|---|---|");
    for (const e of stragglers.slice(0, 500)) {
      const carried = SHAPE_NAMES.filter((k) => e.shapes[k] > 0)
        .map((k) => `${k} ${e.shapes[k]}`).join(", ");
      out.push(`| [${clip(e.title, 80)}](<${e.target}>) | ${e.format} | ${carried} |`);
    }
    if (stragglers.length > 500) out.push(`| … ${stragglers.length - 500} more | | |`);
  }
  return out.join("\n") + "\n";
}
