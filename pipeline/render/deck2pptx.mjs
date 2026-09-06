#!/usr/bin/env node
/**
 * deck2pptx v1.2 (DECK_VERSION below is the stamp) — the model-laid-out review deck (TestPlanGen v2.36 / v2.37)
 * --------------------------------------------------------------------
 * Standalone (Node ≥ 18, zero dependencies). Takes a TestPlanGen draft
 * and a DECK SPEC — the layout decisions a model made over it with
 * `prompts/testplan_deck.md` — and renders a .pptx in which
 * every element is a native, editable PowerPoint object: text boxes,
 * cards, chips, checkboxes, tables, chevron flows, and every figure
 * as the same shape group svg2pptx emits. Where draft2pptx.mjs maps
 * the draft dialect to slides by fixed rule, this deck's STRUCTURE is
 * the model's (which pattern each slide uses, what goes where, how
 * cases group, what earns a statement slide, the speaker notes); its
 * GEOMETRY is the design system's (lib/designsystem.mjs — Fluent 2
 * tokens on a 12-column grid, MIT); its WORDS are the draft's
 * (lib/deckspec.mjs grounds every item, card, cell and statement
 * against the draft and drops a slide that says anything the draft
 * does not).
 *
 *   node pipeline/render/deck2pptx.mjs <draft.md> --spec <deck.json> [-o out.pptx]
 *                            [--media <dir>] [--figures <dir>] [--design <name>]
 *   node pipeline/render/deck2pptx.mjs <draft.md> --generate --config <config.json>
 *                            [--stream]
 *                            [-o out.pptx] [--media <dir>] [--figures <dir>]
 *                            [--design <name>]
 *
 * --design     v1.1: which design system lays the deck out — fluent
 *              (default; Segoe UI), carbon (IBM Carbon; IBM Plex Sans),
 *              uswds (U.S. Web Design System; Source Sans Pro). The spec
 *              is design-independent: the same JSON renders on any of
 *              them. A design's typeface that is not installed on the
 *              viewing machine is substituted by PowerPoint — install
 *              or embed it for fidelity (lib/designsystem.mjs).
 * --theme      v1.2: light (default) or dark, per design. Every
 *              embedded figure — story, generated, inline — is
 *              re-coloured into the chosen design + theme before it
 *              becomes a shape group (restyleFigureSvg), so a Carbon
 *              deck's diagrams are Carbon's blues and greys, and a dark
 *              deck's diagrams sit on the dark surface; the SVG files
 *              on disk are never touched.
 *
 * --spec       render an existing spec (a PE can hand-edit the JSON a
 *              --generate run wrote beside the deck and re-render —
 *              the layout decisions are a text file, not a mystery)
 * --generate   make the ONE model call (the same llm section the
 *              sweep and testplangen use; testplangen.deckMaxTokens
 *              bounds the reply) and write the spec as
 *              <out>.deck.json beside the deck
 * --media      the synced sidecar library's media folder (story
 *              figures a case cites); --figures the folder holding
 *              a --figures run's generated SVGs (the drafts folder or
 *              the dry run's workDir). A figure the spec places that
 *              resolves nowhere degrades to a note on the slide.
 *
 * Exports (for testplangen.mjs --deck): renderDeck(draft, spec, opts)
 * → {buf, slides, dropped, warnings, spec}; generateDeckSpec(...).
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import {
  textbox, card, pill, pillW, checkbox, inlineRuns, tableFrame, slide, buildPptx, figureGroupXml,
  sp, xfrm, solidFill, paraXml, xesc, setShapeId, setDefaultFont, linesOf, lineH, IN, PT, SLIDE_W, SLIDE_H,
} from "./draft2pptx.mjs";
import { parseFigureSvg, EMU_PX } from "./svg2pptx.mjs";
import { verifyFigureSpec, renderFigureSvg, draftCorpus } from "../lib/figurespec.mjs";
import {
  parseDeckReply, deckCorpus, verifyDeckSpec, layoutDeck, DECK_BEGIN, DECK_END,
} from "../lib/deckspec.mjs";
import { designOf, DESIGN_NAMES, DEFAULT_DESIGN, DEFAULT_THEME, describeDesigns, restyleFigureSvg } from "../lib/designsystem.mjs";
import { generate } from "../llm.mjs";

export const DECK_VERSION = "v1.2";
export const DECK_PROMPT_VERSION = "v0.1"; // TestPlanDeckPromptVersion
const HERE = path.dirname(fileURLToPath(import.meta.url));
export const DECK_PROMPT = "testplan_deck"; // prompts/testplan_deck.md


// ------------------------------------------------------------ figures
// A figure reference resolves, in order: an in-memory SVG the caller
// holds (the generation pass), a file under --figures, a file under
// --media; an inline figurespec is grounded against the draft and
// rendered here. null = not embeddable (the slide carries a note).
function resolveFigure(ref, o, corpus, notes, ds) {
  if (!ref) return null;
  // v1.2: every figure is re-coloured into the design + theme first
  const parse = (svg, name) => parseFigureSvg(restyleFigureSvg(svg, ds), name);
  if (ref.spec) {
    const findings = verifyFigureSpec(ref.spec, draftCorpus(corpus.text));
    if (findings.length) { notes.push(`inline figure for ${ref.case || "?"} dropped: ${findings[0]}`); return null; }
    try {
      return parse(renderFigureSvg(ref.spec), `figure ${ref.case || ""}`.trim());
    } catch (e) { notes.push(`inline figure for ${ref.case || "?"}: ${e.message}`); return null; }
  }
  const name = ref.id;
  if (o.svgs && o.svgs.has(name)) {
    try { return parse(o.svgs.get(name), name); } catch (e) { notes.push(`${name}: ${e.message}`); return null; }
  }
  for (const dir of [o.figuresDir, o.mediaDir]) {
    if (!dir) continue;
    const p = path.join(dir, name);
    if (fs.existsSync(p)) {
      try { return parse(fs.readFileSync(p, "utf8"), path.basename(p)); } catch (e) { notes.push(`${name}: ${e.message}`); return null; }
    }
  }
  notes.push(
    `figure not embedded (${name}): ` +
    (o.figuresDir || o.mediaDir ? "no such file under --figures / --media" : "pass --media / --figures so cited figures embed as native shapes")
  );
  return null;
}

// ------------------------------------------------------------- render
const adjFor = (radiusEmu, w, h) => Math.min(50, (radiusEmu / Math.max(1, Math.min(w, h))) * 100);

function runsFor(e, base) {
  return inlineRuns(e.text, base);
}

function elementXml(e, ctx) {
  const { TYPE, SPACE, RADIUS, C } = ctx.ds;
  switch (e.kind) {
    case "text": {
      const base = { color: e.color || C.ink, sz: e.sz, b: !!e.bold, i: !!e.italic, spc: e.spc || 0 };
      return textbox(e.role, e.x, e.y, e.w, e.h,
        [{ line: e.line, algn: e.algn || "l", runs: runsFor(e, base) }], { anchor: e.anchor || "t" });
    }
    case "pageno":
      return textbox("page", e.x, e.y, e.w, e.h,
        [{ algn: "r", runs: [{ t: String(ctx.page), color: e.color || C.muted, sz: TYPE[e.role].sz }] }]);
    case "card":
      return card(e.name || "card", e.x, e.y, e.w, e.h, e.fill, e.line || null, adjFor(RADIUS[e.radius || "large"], e.w, e.h));
    case "pill": {
      const sz = TYPE[e.role || "label"].sz;
      const w = e.w || pillW(e.text, sz);
      return pill(e.text, e.x, e.y, w, e.h, e.fill, e.color, sz, true);
    }
    case "checkbox":
      return checkbox(e.x, e.y, e.size, !!e.checked, { paper: C.paper, line: C.muted, on: C.green, tick: C.onInk });
    case "dot":
      return sp("dot", xfrm(e.x, e.y, e.size, e.size) +
        '<a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom>' + solidFill(e.color || C.teal) + "<a:ln><a:noFill/></a:ln>");
    case "bar":
      return sp("accent", xfrm(e.x, e.y, e.w, e.h) +
        '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>' + solidFill(e.fill) + "<a:ln><a:noFill/></a:ln>");
    case "circle":
      return sp("number", xfrm(e.x, e.y, e.size, e.size) +
        '<a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom>' + solidFill(e.fill) + "<a:ln><a:noFill/></a:ln>",
        '<p:txBody><a:bodyPr wrap="none" lIns="0" tIns="0" rIns="0" bIns="0" anchor="ctr"/><a:lstStyle/>' +
        paraXml({ algn: "ctr", runs: [{ t: e.text, color: e.color || C.onInk, sz: Math.max(9, (e.size / PT) * 0.5), b: true }] }) + "</p:txBody>");
    case "chevron": {
      // first step a homePlate (flat left edge), the rest chevrons: the
      // arrow IS the shape, so the chain stays editable as a chain
      const prst = e.first ? "homePlate" : "chevron";
      const ins = Math.round(SPACE.l);
      const body = `<p:txBody><a:bodyPr wrap="square" lIns="${ins + (e.first ? 0 : Math.round(e.h * 0.18))}" tIns="${ins}" rIns="${ins + Math.round(e.h * 0.18)}" bIns="${ins}" anchor="ctr"/><a:lstStyle/>` +
        paraXml({ algn: "l", line: TYPE[e.role || "body"].line, runs: inlineRuns(e.text, { color: e.color || C.ink, sz: TYPE[e.role || "body"].sz }) }) + "</p:txBody>";
      return sp("step", xfrm(e.x, e.y, e.w, e.h) +
        `<a:prstGeom prst="${prst}"><a:avLst><a:gd name="adj" fmla="val 30000"/></a:avLst></a:prstGeom>` +
        solidFill(e.fill) + "<a:ln><a:noFill/></a:ln>", body);
    }
    case "table": {
      const tf = tableFrame(e.x, e.y, e.rows, e.maxW, e.accentCol, {
        headFill: C.inverse, headText: C.onInk, text: C.ink, accent: C.teal, rowA: C.paper, rowB: C.tint, border: C.border,
      });
      ctx.tableBottom = e.y + tf.h;
      if (tf.h > e.maxH) ctx.warnings.push(`page ${ctx.page}: table runs ${Math.round((tf.h - e.maxH) / PT)} pt past the body band`);
      return tf.xml;
    }
    case "tablenote": {
      const y = (ctx.tableBottom || e.y) + SPACE.l;
      const h = linesOf(e.text, TYPE[e.role].sz, e.w) * lineH(TYPE[e.role].sz);
      return textbox("note", e.x, y, e.w, h,
        [{ line: TYPE[e.role].line, runs: inlineRuns(e.text, { color: e.color || C.muted, sz: TYPE[e.role].sz }).map((r) => ({ ...r, i: true })) }]);
    }
    case "figure": {
      const fig = resolveFigure(e.ref, ctx.opts, ctx.corpus, ctx.notes, ctx.ds);
      if (!fig) {
        const label = e.ref?.alt || e.ref?.id || e.ref?.case || "figure";
        return card("figure missing", e.x, e.y, e.w, Math.round(e.h * 0.35), C.tint, null, adjFor(RADIUS.large, e.w, e.h * 0.35)) +
          textbox("figure note", e.x + SPACE.l, e.y + SPACE.l, e.w - 2 * SPACE.l, Math.round(e.h * 0.35) - 2 * SPACE.l,
            [{ line: TYPE.body.line, runs: [{ t: `Figure: ${label} (not embedded)`, color: C.muted, sz: TYPE.body.sz, i: true }] }]);
      }
      if (fig.unknown.length) ctx.notes.push(`${fig.name}: skipped unknown element(s): ${fig.unknown.join(", ")}`);
      const wEmu = fig.w * EMU_PX, hEmu = fig.h * EMU_PX;
      const s = Math.min(1, e.w / wEmu, e.h / hEmu);
      const gw = Math.round(wEmu * s), gh = Math.round(hEmu * s);
      const gx = Math.round(e.x + (e.w - gw) / 2), gy = Math.round(e.y + Math.max(0, (e.h - gh) / 2));
      const g = figureGroupXml(fig, s, gx, gy, gw, gh);
      if (g.skipped.length) ctx.notes.push(`${fig.name}: skipped ${g.skipped.length} shape(s)`);
      return g.xml;
    }
    default:
      ctx.warnings.push(`page ${ctx.page}: unknown element ${e.kind}`);
      return "";
  }
}

/**
 * Draft text + spec object → {buf, slides, dropped, warnings, notes,
 * spec}. opts: {mediaDir, figuresDir, svgs: Map<name, svgText>,
 * provenance, design, theme}. Throws only when nothing survives the
 * check (or the design / theme name is unknown).
 */
export function renderDeck(draft, spec, opts) {
  const o = opts || {};
  const ds = designOf(o.design, o.theme);
  const { TYPE, GRID, BANDS, C } = ds;
  const corpus = deckCorpus(draft);
  const v = verifyDeckSpec(spec, corpus);
  if (!v.slides.length) {
    throw new Error("no slide survived the deck check" +
      (v.dropped.length ? ` — first finding: ${v.dropped[0].findings[0]}` : ""));
  }
  const L = layoutDeck(v.slides, corpus, ds);
  const ctx = { opts: o, corpus, ds, warnings: [...L.warnings], notes: [], page: 0, tableBottom: 0 };
  const planTitle = corpus.title || spec.plan || "Test Plan";
  const slides = [];
  setDefaultFont(ds.font);
  for (const p of L.slides) {
    setShapeId(2);
    ctx.page = p.page;
    ctx.tableBottom = 0;
    let x = "";
    for (const e of p.elements) x += elementXml(e, ctx);
    const inverted = p.ground === "inverted";
    if (!inverted) {
      x += textbox("footer title", GRID.x(0), BANDS.footerTop, GRID.span(9), BANDS.footerH,
        [{ runs: [{ t: planTitle, color: C.muted, sz: TYPE.caption.sz }] }]);
      x += textbox("footer page", GRID.x(9), BANDS.footerTop, GRID.span(3), BANDS.footerH,
        [{ algn: "r", runs: [{ t: String(p.page), color: C.muted, sz: TYPE.caption.sz }] }]);
    }
    if (p.pattern === "closing") {
      const prov = [p.provenance, `deck: pipeline/render/deck2pptx.mjs ${DECK_VERSION} · TestPlanDeck prompt ${DECK_PROMPT_VERSION} · design ${ds.name} · theme ${ds.theme}`, o.provenance]
        .filter(Boolean).join("  ·  ");
      x += textbox("prov", GRID.x(0), SLIDE_H - GRID.margin - BANDS.footerH, GRID.span(12), BANDS.footerH,
        [{ runs: [{ t: prov, color: C.muted, sz: TYPE.caption2.sz }] }]);
    }
    slides.push({ xml: slide(x, inverted ? C.inverse : C.paper), notes: p.notes || "" });
  }
  const buf = buildPptx(slides, `${planTitle} — review deck`, "deck2pptx", { font: ds.font });
  setDefaultFont(null);
  return { buf, slides: slides.length, proposed: spec.slides.length, dropped: v.dropped, warnings: ctx.warnings, notes: ctx.notes, corpus, design: ds.id, theme: ds.theme, designName: ds.name };
}

// ----------------------------------------------------------- generate
/** The Figures input: what the draft cites, one line each, for the prompt. */
export function figuresInput(corpus) {
  if (!corpus.figures.length) return "(none)";
  return corpus.figures.map((f) => `- ${f.id} — ${f.kind} figure${f.case ? ` for ${f.case}` : ""}: ${f.alt || "(no caption)"}`).join("\n");
}

/**
 * The one model call. {cfg (the whole config), draft, planTitle,
 * maxTokens, onDelta, showThinking}
 * → {raw, spec}. Throws on transport / sentinel / JSON failure (the
 * caller decides whether that is fatal — the CLI: yes; testplangen:
 * fail soft, the draft never depends on the deck).
 */
export async function generateDeckSpec(args) {
  const { cfg, draft, maxTokens } = args;
  const corpus = deckCorpus(draft);
  const inputs = {
    PlanTitle: args.planTitle || corpus.title || "Test Plan",
    Draft: draft.replace(/<!--[\s\S]*?-->/g, "").trim(),
    Figures: figuresInput(corpus),
  };
  let raw;
  try {
    raw = await generate(cfg.llm, DECK_PROMPT, inputs, {
      maxTokens: Number(maxTokens) || 24000,
      ...(args.onDelta ? { onDelta: args.onDelta, showThinking: !!args.showThinking } : {}),
    });
  } catch (e) {
    if (/max_tokens/.test(String(e.message))) {
      throw new Error(`${e.message} — for the deck pass the knob is testplangen.deckMaxTokens (currently ${maxTokens}; the model allows up to 128000, and with --stream the thinking summary spends the same budget)`);
    }
    throw e;
  }
  return { raw, spec: parseDeckReply(raw), inputs };
}

// ---------------------------------------------------------------- CLI
function collectArgs(argv) {
  const a = { files: [], out: null, spec: null, generate: false, config: null, mediaDir: null, figuresDir: null, stream: false, design: "", theme: "" };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === "-o") a.out = argv[++i];
    else if (t === "--spec") a.spec = argv[++i];
    else if (t === "--generate") a.generate = true;
    else if (t === "--config") a.config = argv[++i];
    else if (t === "--media") a.mediaDir = argv[++i];
    else if (t === "--figures") a.figuresDir = argv[++i];
    else if (t === "--stream") a.stream = true;
    else if (t === "--design") a.design = argv[++i];
    else if (t === "--theme") a.theme = argv[++i];
    else if (t === "-h" || t === "--help") a.help = true;
    else a.files.push(t);
  }
  return a;
}

const USAGE =
  "usage: node pipeline/render/deck2pptx.mjs <draft.md> --spec <deck.json> [-o out.pptx] [--media <dir>] [--figures <dir>] [--design <name>] [--theme light|dark]\n" +
  "       node pipeline/render/deck2pptx.mjs <draft.md> --generate --config <config.json> [--stream] [-o out.pptx] [--media <dir>] [--figures <dir>] [--design <name>] [--theme light|dark]\n" +
  "       --spec renders a deck spec (the JSON a --generate run writes beside the deck — edit and re-render);\n" +
  "       --generate makes the one model call with prompts/testplan_deck.md and writes <out>.deck.json;\n" +
  "       --media / --figures name the folders holding story / generated figure SVGs so figures embed as native shapes;\n" +
  `       --design picks the design system (default ${DEFAULT_DESIGN}; testplangen.deckDesign in config), --theme its light or dark theme (default ${DEFAULT_THEME}; testplangen.deckTheme) — figures are re-coloured to match:\n` +
  describeDesigns().split("\n").map((l) => "         " + l).join("\n");

function loadCfg(file) {
  const cfg = JSON.parse(fs.readFileSync(file, "utf8"));
  cfg.llm = cfg.llm || {};
  cfg.testplangen = { deckMaxTokens: 24000, deckDesign: DEFAULT_DESIGN, deckTheme: DEFAULT_THEME, ...(cfg.testplangen || {}) };
  return cfg;
}

async function main() {
  const a = collectArgs(process.argv.slice(2));
  if (a.help) { console.log(USAGE); process.exit(0); }
  if (a.files.length !== 1 || (!a.spec && !a.generate) || (a.spec && a.generate) || (a.generate && !a.config)) {
    console.error(USAGE);
    process.exit(2);
  }
  for (const [flag, dir] of [["--media", a.mediaDir], ["--figures", a.figuresDir]]) {
    if (dir && !(fs.existsSync(dir) && fs.statSync(dir).isDirectory())) {
      console.error(`${flag} ${dir}: not a directory`);
      process.exit(2);
    }
  }
  const file = a.files[0];
  let design = a.design, theme = a.theme;
  if (a.generate) {
    const tpc = loadCfg(a.config).testplangen;
    if (!design) design = tpc.deckDesign;
    if (!theme) theme = tpc.deckTheme;
  }
  try { designOf(design, theme); } catch (e) { console.error(`--design ${design || DEFAULT_DESIGN} --theme ${theme || DEFAULT_THEME}: ${e.message}`); process.exit(2); }
  const draft = fs.readFileSync(file, "utf8");
  const dest = a.out || file.replace(/\.md$/i, "") + "--deck.pptx";
  let spec;
  let provenance = "";
  if (a.generate) {
    const cfg = loadCfg(a.config);
    let onDelta = null;
    if (a.stream) {
      let mode = "";
      onDelta = (kind, text) => {
        if (kind === "restart") { process.stderr.write("\n--- deck: [stream restarted] ---\n"); mode = ""; return; }
        if (kind !== mode) { mode = kind; process.stderr.write(`\n--- deck: model ${kind === "text" ? "reply" : kind} ---\n`); }
        process.stderr.write(text);
      };
    }
    process.stderr.write(`deck — calling the model (~${draft.length} chars of draft)\n`);
    const g = await generateDeckSpec({
      cfg, draft, maxTokens: cfg.testplangen.deckMaxTokens,
      onDelta, showThinking: !!onDelta,
    });
    if (onDelta) process.stderr.write("\n--- deck: end of stream ---\n");
    spec = g.spec;
    const specPath = dest.replace(/\.pptx$/i, "") + ".deck.json";
    fs.writeFileSync(specPath, JSON.stringify(spec, null, 2) + "\n");
    process.stderr.write(`spec written: ${specPath} (${spec.slides.length} slides proposed)\n`);
  } else {
    const raw = fs.readFileSync(a.spec, "utf8");
    // a spec file may be the bare JSON or a full sentinel-wrapped reply
    spec = raw.includes(DECK_BEGIN) ? parseDeckReply(raw) : JSON.parse(raw);
    if (!spec || !Array.isArray(spec.slides)) { console.error(`${a.spec}: no "slides" array`); process.exit(1); }
  }
  let r;
  try {
    r = renderDeck(draft, spec, { mediaDir: a.mediaDir, figuresDir: a.figuresDir, provenance, design, theme });
  } catch (e) {
    console.error(`deck not rendered: ${e.message}`);
    process.exit(1);
  }
  for (const d of r.dropped) console.error(`dropped slide ${d.index + 1} (${d.pattern || "?"}): ${d.findings.slice(0, 3).join("; ")}`);
  for (const w of r.warnings) console.error(`note: ${w}`);
  for (const n of r.notes) console.error(`note: ${n}`);
  fs.writeFileSync(dest, r.buf);
  console.log(`${dest}: ${r.slides} slides — ${r.corpus.title} (${r.proposed} proposed, ${r.dropped.length} dropped; design ${r.design}, theme ${r.theme})`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((e) => { console.error(`deck2pptx: ${e.message}`); process.exit(1); });
}

export { DECK_BEGIN, DECK_END };
