/**
 * designsystem.mjs v1.0 — the deck's design system: Fluent 2 tokens
 * on a 16:9 slide, plus the closed LAYOUT PATTERN catalog the
 * TestPlanDeck prompt chooses from (prompts/TestPlanDeck_Prompt.md,
 * local/lib/deckspec.mjs, local/deck2pptx.mjs). Pure module, no I/O.
 *
 * WHY FLUENT 2. The review deck is a PowerPoint file read on Windows
 * in Segoe UI, next to figure slides svg2pptx renders in the same
 * face. Microsoft's Fluent 2 design system publishes its tokens as
 * open source (`@fluentui/tokens`, MIT — github.com/microsoft/fluentui)
 * and defines exactly the layout vocabulary a slide needs: a TYPE
 * RAMP (size + line height + weight per role, Caption 1 … Display),
 * a SPACING RAMP (XXS … XXXL), CORNER RADII, STROKE WIDTHS, and
 * neutral / brand / status colour ROLES. This module encodes those
 * tokens verbatim (`FLUENT`), maps them onto the slide canvas, and
 * derives everything a layout decision needs — grid, bands,
 * capacities — so a model choosing a pattern never chooses a pixel.
 *
 * THE CANVAS. A 16:9 slide is 13.333 × 7.5 in = 1280 × 720 CSS px at
 * 96 dpi, so Fluent's px tokens apply to it directly. Fluent's ramp
 * is sized for arm's-length reading; a projected slide is read from
 * across a room, so every token is multiplied by one PRESENTATION
 * SCALE (1.5) — the ratios, line-height rhythm and spacing steps are
 * Fluent's, only the unit is larger. (Title 1 32/40 px → 48/60 px =
 * 36 pt, Body 1 14/20 px → 21/30 px = 15.75 pt.)
 *
 * COLOUR. Fluent names ROLES (neutralForeground1, neutralStroke1,
 * brandForeground1, statusSuccessForeground1 …); the values here are
 * the Diagram Style Framework palette draft2pptx and the sweep's
 * figures already use, so the model-laid-out deck, the deterministic
 * deck and the figure slides read as one design (`FLUENT_LIGHT`
 * keeps Fluent's own light-theme neutrals + brand for reference).
 *
 * GRID. 12 columns; margin = spacingHorizontalXXXL, gutter =
 * spacingHorizontalXXL (both scaled). Three vertical bands: the
 * header (title + eyebrow), the body, the footer (plan title + page).
 * Regions are expressed as column spans + band, never as
 * coordinates; deckspec.layoutDeck resolves them.
 *
 * PATTERNS. The closed catalog (`PATTERNS`): each pattern names its
 * regions, what each region holds, and its CAPACITY (items, chars,
 * columns, rows) derived from the grid and the ramp — the prompt
 * lists the same limits and `check_deckspec.py` asserts the two
 * agree. A pattern is a layout decision; the content in its regions
 * must come from the draft (deckspec.verifyDeckSpec).
 */

// ------------------------------------------------------ Fluent 2 tokens
// @fluentui/tokens (MIT) — px values as published, light theme.
export const FLUENT = {
  fontFamilyBase: "Segoe UI",
  fontFamilyMonospace: "Consolas",
  fontWeightRegular: 400,
  fontWeightSemibold: 600,
  fontWeightBold: 700,
  // type ramp: [fontSize px, lineHeight px, weight]
  type: {
    caption2: [10, 14, 400],
    caption1: [12, 16, 400],
    caption1Strong: [12, 16, 600],
    body1: [14, 20, 400],
    body1Strong: [14, 20, 600],
    body2: [16, 22, 400],
    subtitle2: [16, 22, 600],
    subtitle1: [20, 26, 600],
    title3: [24, 32, 600],
    title2: [28, 36, 600],
    title1: [32, 40, 600],
    largeTitle: [40, 52, 600],
    display: [68, 92, 600],
  },
  // spacing ramp (horizontal and vertical share the values)
  spacing: {
    none: 0, xxs: 2, xs: 4, sNudge: 6, s: 8, mNudge: 10, m: 12, l: 16, xl: 20, xxl: 24, xxxl: 32,
  },
  borderRadius: { none: 0, small: 2, medium: 4, large: 6, xLarge: 8, circular: 10000 },
  strokeWidth: { thin: 1, thick: 2, thicker: 3, thickest: 4 },
};

// Fluent's own light-theme values for the roles used here (reference;
// the deck THEMES these roles with the palette below)
export const FLUENT_LIGHT = {
  neutralForeground1: "242424",
  neutralForeground2: "424242",
  neutralForeground3: "616161",
  neutralForegroundOnBrand: "FFFFFF",
  neutralBackground1: "FFFFFF",
  neutralBackground2: "FAFAFA",
  neutralBackground3: "F5F5F5",
  neutralStroke1: "D1D1D1",
  neutralStroke2: "E0E0E0",
  brandForeground1: "0F6CBD",
  brandBackground: "0F6CBD",
};

// ---------------------------------------------------------- the canvas
export const PRESENTATION_SCALE = 1.5;
export const CANVAS_PX = { w: 1280, h: 720 }; // 13.333 × 7.5 in at 96 dpi
export const EMU_PER_PX = 9525;
export const EMU_PER_PT = 12700;
export const SLIDE_W = CANVAS_PX.w * EMU_PER_PX; // 12192000
export const SLIDE_H = CANVAS_PX.h * EMU_PER_PX; // 6858000

/** A Fluent px token on the slide, in EMU (scaled). */
export const px = (v) => Math.round(v * PRESENTATION_SCALE * EMU_PER_PX);
/** A Fluent px token as a PowerPoint point size (scaled). */
export const pt = (v) => Math.round(v * PRESENTATION_SCALE * 0.75 * 100) / 100;

/** Type roles on the slide: {sz (pt), line (pt), bold}. */
export const TYPE = Object.fromEntries(
  Object.entries(FLUENT.type).map(([k, [sz, lh, w]]) => [k, { sz: pt(sz), line: pt(lh), bold: w >= 600, px: sz }])
);
/** Spacing roles in EMU. */
export const SPACE = Object.fromEntries(Object.entries(FLUENT.spacing).map(([k, v]) => [k, px(v)]));
/** Corner radii in EMU (circular = fully round). */
export const RADIUS = Object.fromEntries(Object.entries(FLUENT.borderRadius).map(([k, v]) => [k, px(v)]));
/** Stroke widths in EMU. */
export const STROKE = Object.fromEntries(Object.entries(FLUENT.strokeWidth).map(([k, v]) => [k, px(v)]));

// --------------------------------------------------------------- colour
// Fluent role names → the Diagram Style Framework palette (draft2pptx /
// svg2pptx / figurespec FIG_STYLE), so every deck reads as one design.
export const COLOR = {
  neutralForeground1: "16302F",        // INK — body text, headings on paper
  neutralForeground2: "23423F",        // INK_SOFT — raised panels on ink
  neutralForeground3: "6E8285",        // MUTED — secondary text, labels
  neutralForegroundOnBrand: "FFFFFF",  // PAPER — text on ink / on a tone
  neutralForegroundInverted2: "CFDCDC", // ICE — secondary text on ink
  neutralBackground1: "FFFFFF",        // PAPER — the light slide
  neutralBackground2: "EFF2F2",        // TINT — light panel fill
  neutralBackgroundInverted: "16302F", // INK — the dark slide
  neutralStroke1: "D7DFDF",            // BORDER
  brandForeground1: "1B6E8C",          // TEAL — coverage / trace / links
  brandBackground2: "E4EEF2",          // TEAL_TINT
  statusSuccessForeground1: "2E7D5B",  // GREEN — positive
  statusSuccessBackground1: "E4EFE9",  // GREEN_TINT
  statusWarningForeground1: "C2701A",  // AMBER — [VERIFY] / caution
  statusWarningBackground1: "F7EDDF",  // AMBER_TINT
  statusDangerForeground1: "B2442F",   // RED — negative
  statusDangerBackground1: "F4E7E3",   // RED_TINT
  paletteVioletForeground1: "7A5AA6",  // theme accent4
};

/** Semantic tones a spec may name; each resolves to a fg/bg pair. */
export const TONES = ["neutral", "brand", "success", "warning", "danger"];
export const TONE_COLOR = {
  neutral: { fg: COLOR.neutralForeground3, bg: COLOR.neutralBackground2 },
  brand: { fg: COLOR.brandForeground1, bg: COLOR.brandBackground2 },
  success: { fg: COLOR.statusSuccessForeground1, bg: COLOR.statusSuccessBackground1 },
  warning: { fg: COLOR.statusWarningForeground1, bg: COLOR.statusWarningBackground1 },
  danger: { fg: COLOR.statusDangerForeground1, bg: COLOR.statusDangerBackground1 },
};

// ----------------------------------------------------------------- grid
export const GRID = (() => {
  const cols = 12;
  const margin = SPACE.xxxl;         // 48 px scaled → the 0.5 in draft2pptx keeps
  const gutter = SPACE.xxl;          // 36 px scaled
  const contentW = SLIDE_W - 2 * margin;
  const colW = (contentW - (cols - 1) * gutter) / cols;
  /** x of column c (0-based) */
  const x = (c) => Math.round(margin + c * (colW + gutter));
  /** width of a span of n columns */
  const span = (n) => Math.round(n * colW + (n - 1) * gutter);
  return { cols, margin, gutter, contentW, colW, x, span };
})();

// vertical bands: header (eyebrow + title), body, footer
export const BANDS = (() => {
  const top = GRID.margin;
  const titleLine = px(FLUENT.type.title1[1]);                // 60 px scaled
  const headerH = px(FLUENT.type.caption1[1]) + titleLine;    // eyebrow line + title line
  const bodyTop = top + headerH + SPACE.xl;                   // 48 + 84 + 30 = 162 px
  const footerH = px(FLUENT.type.caption1[1]);                // 24 px scaled
  const footerTop = SLIDE_H - GRID.margin - footerH;
  const bodyBottom = footerTop - SPACE.xl;
  return { top, headerH, titleLine, bodyTop, bodyBottom, footerTop, footerH };
})();

// ------------------------------------------------------------- patterns
// Capacities are what fits the grid at the ramp above with the
// spacing ramp's gaps — a slide that respects them never overflows;
// the layout still measures and truncates with an ellipsis rather
// than spill past the footer.
export const LIMITS = {
  title: 80,        // headline chars
  eyebrow: 40,
  lede: 320,        // one short paragraph
  item: 180,        // one bullet / step / checklist row
  label: 32,        // card / panel / stat labels
  cardBody: 360,
  callout: 240,
  note: 160,
  cell: 120,
  statValue: 12,
  ask: 120,
  notes: 1200,      // speaker notes
};

export const PATTERNS = {
  title: {
    ground: "inverted",
    regions: {
      eyebrow: { holds: "text", max: 1 },
      headline: { holds: "text", max: 1, required: true },
      subtitle: { holds: "text", max: 1 },
      facts: { holds: "label+value", max: 4 },
    },
    use: "the opening slide: plan title, the draft stamp, the Overview facts",
  },
  section: {
    ground: "inverted",
    regions: {
      number: { holds: "text", max: 1 },
      headline: { holds: "text", max: 1, required: true },
      strap: { holds: "text", max: 1 },
      callout: { holds: "callout", max: 1 },
    },
    use: "a divider between parts of the deck (Positive Tests, Negative Tests, appendices)",
  },
  stats: {
    ground: "paper",
    regions: {
      tiles: { holds: "value+label(+tone)", min: 2, max: 4, required: true },
      lede: { holds: "text", max: 1 },
      callout: { holds: "callout", max: 1 },
    },
    use: "counts that frame the plan (cases, open flags, requirements traced) with the scope statement",
  },
  bullets: {
    ground: "paper",
    regions: {
      items: { holds: "item", min: 1, max: 7, required: true },
      lede: { holds: "text", max: 1 },
    },
    use: "one list on one idea: automation notes, documentation impacts, a section's prose points",
  },
  checklist: {
    ground: "paper",
    regions: {
      items: { holds: "item(+checked)", min: 1, max: 9, required: true },
      lede: { holds: "text", max: 1 },
    },
    use: "setup / prerequisites, open questions — rows a reviewer ticks in the meeting",
  },
  "two-column": {
    ground: "paper",
    regions: {
      left: { holds: "item", min: 1, max: 8, required: true, span: 7 },
      right: { holds: "card", min: 1, max: 3, required: true, span: 5 },
    },
    use: "a test case: the steps on the left, Expected Result / Trace / a note as cards on the right",
  },
  cards: {
    ground: "paper",
    regions: {
      cards: { holds: "card", min: 2, max: 4, required: true },
      lede: { holds: "text", max: 1 },
    },
    use: "parallel things compared side by side: variants of a case, surfaces, roles, risks",
  },
  comparison: {
    ground: "paper",
    regions: {
      left: { holds: "panel", max: 1, required: true, span: 6 },
      right: { holds: "panel", max: 1, required: true, span: 6 },
    },
    use: "before / after, positive / negative, expected / observed — two labelled panels of up to 5 items",
  },
  table: {
    ground: "paper",
    regions: {
      table: { holds: "rows", required: true, maxCols: 6, maxRows: 10 },
      note: { holds: "text", max: 1 },
    },
    use: "the Coverage Map, Issue Trace, fixture tables — native, editable PowerPoint tables",
  },
  flow: {
    ground: "paper",
    regions: {
      steps: { holds: "item", min: 3, max: 6, required: true },
      outcome: { holds: "card", max: 1 },
    },
    use: "a sequence of steps as a left-to-right chain of native shapes with arrows, the outcome beside it",
  },
  figure: {
    ground: "paper",
    regions: {
      figure: { holds: "figure", max: 1, required: true, span: 8 },
      aside: { holds: "text", max: 3, span: 4 },
    },
    use: "a story figure or a generated figure as native editable shapes, with up to three reading notes",
  },
  statement: {
    ground: "paper",
    regions: {
      statement: { holds: "text", max: 1, required: true },
      attribution: { holds: "text", max: 1 },
    },
    use: "one requirement or one finding, quoted large, to anchor a discussion",
  },
  closing: {
    ground: "inverted",
    regions: {
      headline: { holds: "text", max: 1, required: true },
      asks: { holds: "item", min: 1, max: 5, required: true },
    },
    use: "the last slide: what the review must decide before the draft becomes the plan",
  },
};

export const PATTERN_NAMES = Object.keys(PATTERNS);

/** The catalog as the prompt states it (drift check + docs). */
export function describeCatalog() {
  const lines = [];
  for (const [name, p] of Object.entries(PATTERNS)) {
    const regs = Object.entries(p.regions).map(([r, d]) => {
      const cap = d.maxRows ? `≤ ${d.maxRows} rows × ${d.maxCols} cols`
        : d.max === 1 || !d.max ? "" : `${d.min ? d.min + "–" : "≤ "}${d.max}`;
      return `${r}${d.required ? "*" : ""}${cap ? ` (${cap})` : ""}`;
    });
    lines.push(`${name} [${p.ground}]: ${regs.join(", ")} — ${p.use}`);
  }
  return lines.join("\n");
}
