/**
 * designsystem.mjs v1.3 — the deck's design systems: open-source design
 * tokens on a 16:9 slide, plus the closed LAYOUT PATTERN catalog the
 * TestPlanDeck prompt chooses from (prompts/testplan_deck.md,
 * pipeline/lib/deckspec.mjs, pipeline/render/deck2pptx.mjs). Pure module, no I/O.
 *
 * v1.1: THREE designs, selectable (`--design`, `testplangen.deckDesign`):
 *
 *   fluent  Microsoft Fluent 2 (MIT, `@fluentui/tokens`) — the default;
 *           Segoe UI, the face PowerPoint and Windows already carry
 *   carbon  IBM Carbon v11 (Apache 2.0, `@carbon/type` / `@carbon/layout`
 *           / `@carbon/colors`) — the denser, squarer, table-friendly
 *           variant; IBM Plex Sans (OFL — NOT on a typical Windows
 *           machine: PowerPoint substitutes unless the face is installed
 *           or embedded)
 *   uswds   U.S. Web Design System v3 (public domain, `@uswds/uswds`
 *           tokens) — the most readable variant; Source Sans Pro, the
 *           system's default sans (OFL, same installation caveat;
 *           Public Sans is the alternative the system ships)
 *
 * v1.3: every value below was VERIFIED against the published packages
 * (@carbon/colors 11.57, @carbon/type 11.66, @carbon/layout 11.58,
 * @carbon/themes 11.80, @fluentui/tokens 1.0.0-alpha.24, @uswds/uswds
 * 3.14) by `tests/check_design_tokens.py`, which downloads them
 * from the npm registry and diffs — six transcription slips corrected
 * (Carbon border-subtle-01 on both themes and g100 text-helper, Fluent
 * subtitle1's line height, USWDS's line-height token 2, its largest
 * column gap and its default typeface).
 *
 * Every design supplies the SAME shape — `makeDesign` derives it from
 * the design's token block — so deckspec.layoutDeck and deck2pptx
 * never know which system is on. The deck addresses type by DECK
 * ROLE (display, hero, title, title2, subtitle, subtitle2, body2, body,
 * bodyStrong, label, caption, caption2) and colour by DECK ROLE
 * (textPrimary … dangerTint); each design maps its own token names
 * onto those roles, named in its `roles` / `colors` tables so the
 * provenance of every number is one lookup away.
 *
 * THE CANVAS. A 16:9 slide is 13.333 × 7.5 in = 1280 × 720 CSS px at
 * 96 dpi, so web px tokens apply to it directly. Web ramps are sized
 * for arm's-length reading; a projected slide is read from across a
 * room, so every token is multiplied by one PRESENTATION SCALE (1.5)
 * — the ratios, line-height rhythm and spacing steps stay the
 * system's, only the unit is larger.
 *
 * GRID. 12 columns on every design; margin and gutter are named
 * spacing tokens of the design (Fluent: XXXL / XXL; Carbon: spacing-07
 * for both, its 2x Grid gutter is 32 px; USWDS: units-4 margin, units-3
 * gutter — $theme-column-gap-lg is 3 units). Three vertical bands — header
 * (eyebrow + title), body, footer — derived from the design's own
 * caption and title line heights. Regions are expressed as column
 * spans + band, never as coordinates; deckspec.layoutDeck resolves them.
 *
 * COLOUR. Fluent stays THEMED with the Diagram Style Framework palette
 * draft2pptx and the sweep's figures use, so the default deck, the
 * rule-built deck and the figure slides read as one design; Carbon and
 * USWDS use their own published values (light theme on paper slides,
 * the system's dark surface on inverted slides). Two legibility
 * substitutions are named inline: a system's yellow "warning" is an
 * icon tint, not a text colour, so the text role takes the system's
 * darker warm value.
 *
 * THEMES (v1.2). Every design has a LIGHT and a DARK theme
 * (`designOf(name, theme)`). Light = the system's published light
 * values. Dark = the system's own dark surface tokens where it
 * publishes them (Fluent: the Diagram Style Framework's ink surfaces;
 * Carbon: the Gray 100 theme; USWDS has no dark theme — its dark
 * neutrals are the system's own darkest base steps and its status
 * colours the "-light" ramp steps) with the status TINTS derived by
 * blending each status colour a fixed 25 % over the dark layer
 * (`mix`), since no system publishes dark status backgrounds a slide
 * can use. On a dark theme "paper" slides sit on the dark surface and
 * "inverted" dividers on the design's deep brand surface.
 *
 * FIGURES (v1.2). Story and generated figures are drawn in the Diagram
 * Style Framework palette (figurespec FIG_STYLE, the sweep's
 * SlideFigures — one closed set of hex values and one font). So a
 * figure can follow the deck, `restyleFigureSvg` maps every one of
 * those values onto the design's colour roles before svg2pptx parses
 * it — the SVG files on disk stay as they are (the markdown sidecars
 * keep their palette); only the embedded shape group changes. On the
 * default design + theme the map is the identity.
 *
 * PATTERNS + LIMITS are deck-level and shared by every design (the
 * prompt states them once; `check_deckspec.py` asserts the two agree).
 */

/** Blend hex a toward hex b by t (0..1); the derived-colour helper. */
export function mix(a, b, t) {
  const A = parseInt(a, 16), B = parseInt(b, 16);
  const ch = (sh) => Math.round(((A >> sh) & 255) * (1 - t) + ((B >> sh) & 255) * t);
  return [16, 8, 0].map((sh) => ch(sh).toString(16).padStart(2, "0")).join("").toUpperCase();
}
export const THEMES = ["light", "dark"];

// ---------------------------------------------------------- the canvas
export const PRESENTATION_SCALE = 1.5;
export const CANVAS_PX = { w: 1280, h: 720 }; // 13.333 × 7.5 in at 96 dpi
export const EMU_PER_PX = 9525;
export const EMU_PER_PT = 12700;
export const SLIDE_W = CANVAS_PX.w * EMU_PER_PX; // 12192000
export const SLIDE_H = CANVAS_PX.h * EMU_PER_PX; // 6858000

/** A px token on the slide, in EMU (scaled). */
export const px = (v) => Math.round(v * PRESENTATION_SCALE * EMU_PER_PX);
/** A px token as a PowerPoint point size (scaled). */
export const pt = (v) => Math.round(v * PRESENTATION_SCALE * 0.75 * 100) / 100;

/** The deck's type roles, in the order the hierarchy reads. */
export const TYPE_ROLES = [
  "display", "hero", "title", "title2", "subtitle", "subtitle2",
  "body2", "body", "bodyStrong", "label", "caption", "caption2",
];
/** The deck's colour roles. */
export const COLOR_ROLES = [
  "textPrimary", "textSecondary", "textTertiary", "textOnInverse", "textOnInverseSecondary",
  "background", "layer", "backgroundInverse", "layerInverse", "border",
  "brand", "brandTint", "success", "successTint", "warning", "warningTint",
  "danger", "dangerTint", "accent",
];

// ------------------------------------------------------- Fluent 2 (MIT)
// @fluentui/tokens — px values as published, light theme.
export const FLUENT = {
  id: "fluent",
  name: "Fluent 2",
  license: "MIT",
  source: "@fluentui/tokens (github.com/microsoft/fluentui)",
  font: "Segoe UI",
  fontNote: "installed with Windows and Office",
  // type ramp: token → [fontSize px, lineHeight px, weight]
  type: {
    caption2: [10, 14, 400],
    caption1: [12, 16, 400],
    caption1Strong: [12, 16, 600],
    body1: [14, 20, 400],
    body1Strong: [14, 20, 600],
    body2: [16, 22, 400],
    subtitle2: [16, 22, 600],
    subtitle1: [20, 28, 600],
    title3: [24, 32, 600],
    title2: [28, 36, 600],
    title1: [32, 40, 600],
    largeTitle: [40, 52, 600],
    display: [68, 92, 600],
  },
  // deck role → type token
  roles: {
    display: "display", hero: "largeTitle", title: "title1", title2: "title2",
    subtitle: "subtitle1", subtitle2: "subtitle2", body2: "body2", body: "body1",
    bodyStrong: "body1Strong", label: "caption1Strong", caption: "caption1", caption2: "caption2",
  },
  // spacing ramp (horizontal and vertical share the values)
  spacing: { none: 0, xxs: 2, xs: 4, sNudge: 6, s: 8, mNudge: 10, m: 12, l: 16, xl: 20, xxl: 24, xxxl: 32 },
  // deck spacing role → token
  space: { xxs: "xxs", xs: "xs", s: "s", m: "m", l: "l", xl: "xl", xxl: "xxl", xxxl: "xxxl" },
  grid: { margin: "xxxl", gutter: "xxl" },
  borderRadius: { none: 0, small: 2, medium: 4, large: 6, xLarge: 8, circular: 10000 },
  strokeWidth: { thin: 1, thick: 2, thicker: 3, thickest: 4 },
  // deck colour role → [hex, the Fluent role it stands in for]. The
  // VALUES are the Diagram Style Framework palette (draft2pptx /
  // svg2pptx / figurespec FIG_STYLE) — the theme, not Fluent's own
  // light-theme neutrals (kept in FLUENT_LIGHT for reference).
  colors: {
    textPrimary: ["16302F", "neutralForeground1"],
    textSecondary: ["23423F", "neutralForeground2"],
    textTertiary: ["6E8285", "neutralForeground3"],
    textOnInverse: ["FFFFFF", "neutralForegroundOnBrand"],
    textOnInverseSecondary: ["CFDCDC", "neutralForegroundInverted2"],
    background: ["FFFFFF", "neutralBackground1"],
    layer: ["EFF2F2", "neutralBackground2"],
    backgroundInverse: ["16302F", "neutralBackgroundInverted"],
    layerInverse: ["23423F", "neutralBackgroundInverted (raised)"],
    border: ["D7DFDF", "neutralStroke1"],
    brand: ["1B6E8C", "brandForeground1"],
    brandTint: ["E4EEF2", "brandBackground2"],
    success: ["2E7D5B", "statusSuccessForeground1"],
    successTint: ["E4EFE9", "statusSuccessBackground1"],
    warning: ["C2701A", "statusWarningForeground1"],
    warningTint: ["F7EDDF", "statusWarningBackground1"],
    danger: ["B2442F", "statusDangerForeground1"],
    dangerTint: ["F4E7E3", "statusDangerBackground1"],
    accent: ["7A5AA6", "paletteVioletForeground1"],
  },
  // dark: the Diagram Style Framework's ink surfaces (draft2pptx's INK /
  // INK_SOFT / PAPER / ICE), status colours lifted toward white, the
  // divider on a deep brand surface
  colorsDark: {
    textPrimary: ["FFFFFF", "PAPER on ink"],
    textSecondary: ["CFDCDC", "ICE"],
    textTertiary: [mix("CFDCDC", "16302F", 0.3), "ICE toward INK 30 %"],
    textOnInverse: ["FFFFFF", "PAPER"],
    textOnInverseSecondary: ["CFDCDC", "ICE"],
    background: ["16302F", "INK"],
    layer: ["23423F", "INK_SOFT"],
    backgroundInverse: [mix("1B6E8C", "000000", 0.5), "TEAL toward black 50 %"],
    layerInverse: [mix("1B6E8C", "000000", 0.35), "TEAL toward black 35 %"],
    border: [mix("16302F", "FFFFFF", 0.18), "INK toward white 18 %"],
    brand: [mix("1B6E8C", "FFFFFF", 0.35), "TEAL toward white 35 %"],
    success: [mix("2E7D5B", "FFFFFF", 0.35), "GREEN toward white 35 %"],
    warning: [mix("C2701A", "FFFFFF", 0.3), "AMBER toward white 30 %"],
    danger: [mix("B2442F", "FFFFFF", 0.35), "RED toward white 35 %"],
    accent: [mix("7A5AA6", "FFFFFF", 0.3), "accent4 toward white 30 %"],
  },
};

// Fluent's own light- and dark-theme values for the roles used here
// (reference — webLightTheme / webDarkTheme in @fluentui/tokens)
export const FLUENT_LIGHT = {
  neutralForeground1: "242424", neutralForeground2: "424242", neutralForeground3: "616161",
  neutralForegroundOnBrand: "FFFFFF", neutralBackground1: "FFFFFF", neutralBackground2: "FAFAFA",
  neutralBackground3: "F5F5F5", neutralStroke1: "D1D1D1", neutralStroke2: "E0E0E0",
  brandForeground1: "0F6CBD", brandBackground: "0F6CBD",
};
export const FLUENT_DARK = {
  neutralForeground1: "FFFFFF", neutralForeground2: "D6D6D6", neutralForeground3: "ADADAD",
  neutralBackground1: "292929", neutralBackground2: "1F1F1F", neutralStroke1: "666666",
  brandForeground1: "479EF5",
};

// ------------------------------------------------ IBM Carbon v11 (Apache 2.0)
// @carbon/type (productive set — the fluid/expressive set is not carried),
// @carbon/layout (spacing scale, 2x Grid), @carbon/colors + the White /
// Gray 100 themes.
export const CARBON = {
  id: "carbon",
  name: "IBM Carbon",
  license: "Apache-2.0",
  source: "@carbon/type, @carbon/layout, @carbon/colors (github.com/carbon-design-system/carbon)",
  font: "IBM Plex Sans",
  fontNote: "OFL; not installed on a typical Windows machine — install or embed it, or PowerPoint substitutes",
  type: {
    "caption-01": [12, 16, 400],
    "label-01": [12, 16, 400],
    "helper-text-01": [12, 16, 400],
    "body-compact-01": [14, 18, 400],
    "body-01": [14, 20, 400],
    "body-compact-02": [16, 22, 400],
    "body-02": [16, 24, 400],
    "heading-compact-01": [14, 18, 600],
    "heading-01": [14, 20, 600],
    "heading-02": [16, 24, 600],
    "heading-03": [20, 28, 400],
    "heading-04": [28, 36, 400],
    "heading-05": [32, 40, 400],
    "heading-06": [42, 50, 300],
    "heading-07": [54, 64, 300],
  },
  roles: {
    display: "heading-07", hero: "heading-06", title: "heading-05", title2: "heading-04",
    subtitle: "heading-03", subtitle2: "heading-02", body2: "body-02", body: "body-01",
    bodyStrong: "heading-01", label: "label-01", caption: "caption-01", caption2: "caption-01",
  },
  // spacing scale: spacing-01 … spacing-13
  spacing: {
    "spacing-01": 2, "spacing-02": 4, "spacing-03": 8, "spacing-04": 12, "spacing-05": 16,
    "spacing-06": 24, "spacing-07": 32, "spacing-08": 40, "spacing-09": 48, "spacing-10": 64,
    "spacing-11": 80, "spacing-12": 96, "spacing-13": 160,
  },
  space: {
    xxs: "spacing-01", xs: "spacing-02", s: "spacing-03", m: "spacing-04", l: "spacing-05",
    xl: "spacing-06", xxl: "spacing-07", xxxl: "spacing-07",
  },
  grid: { margin: "spacing-07", gutter: "spacing-07" }, // the 2x Grid's 32 px gutter
  // Carbon surfaces are square; only tags are round
  borderRadius: { none: 0, small: 0, medium: 0, large: 0, xLarge: 0, circular: 10000 },
  strokeWidth: { thin: 1, thick: 2, thicker: 3, thickest: 4 },
  colors: {
    textPrimary: ["161616", "text-primary (Gray 100)"],
    textSecondary: ["525252", "text-secondary (Gray 70)"],
    textTertiary: ["6F6F6F", "text-helper (Gray 60)"],
    textOnInverse: ["FFFFFF", "text-on-color"],
    textOnInverseSecondary: ["C6C6C6", "g100 text-secondary (Gray 30)"],
    background: ["FFFFFF", "background (White)"],
    layer: ["F4F4F4", "layer-01 (Gray 10)"],
    backgroundInverse: ["161616", "g100 background (Gray 100)"],
    layerInverse: ["262626", "g100 layer-01 (Gray 90)"],
    border: ["C6C6C6", "border-subtle-01 (Gray 30)"],
    brand: ["0F62FE", "interactive (Blue 60)"],
    brandTint: ["EDF5FF", "Blue 10"],
    success: ["198038", "Green 60 (text); support-success is Green 50 #24A148"],
    successTint: ["DEFBE6", "Green 10"],
    warning: ["BA4E00", "Orange 60 (text); support-warning Yellow 30 is an icon tint"],
    warningTint: ["FCF4D6", "Yellow 10"],
    danger: ["DA1E28", "support-error (Red 60)"],
    dangerTint: ["FFF1F1", "Red 10"],
    accent: ["8A3FFC", "Purple 60"],
  },
  // dark: the Gray 100 theme
  colorsDark: {
    textPrimary: ["F4F4F4", "g100 text-primary (Gray 10)"],
    textSecondary: ["C6C6C6", "g100 text-secondary (Gray 30)"],
    textTertiary: ["A8A8A8", "g100 text-helper (Gray 40)"],
    textOnInverse: ["FFFFFF", "text-on-color"],
    textOnInverseSecondary: ["C6C6C6", "Gray 30"],
    background: ["161616", "g100 background (Gray 100)"],
    layer: ["262626", "g100 layer-01 (Gray 90)"],
    backgroundInverse: ["002D9C", "Blue 80"],
    layerInverse: ["001D6C", "Blue 90"],
    border: ["525252", "g100 border-subtle-01 (Gray 70)"],
    brand: ["4589FF", "g100 interactive (Blue 50)"],
    success: ["42BE65", "g100 support-success (Green 40)"],
    warning: ["FF832B", "Orange 40 (text); support-warning stays an icon tint"],
    danger: ["FA4D56", "g100 support-error (Red 50)"],
    accent: ["A56EFF", "Purple 50"],
  },
};

// ------------------------------------------ USWDS v3 (public domain, CC0)
// @uswds/uswds — system font-size tokens, line-height tokens, spacing
// units (1 unit = 8 px), the default theme's colour tokens.
export const USWDS = {
  id: "uswds",
  name: "U.S. Web Design System",
  license: "CC0-1.0 (public domain)",
  source: "@uswds/uswds design tokens (designsystem.digital.gov)",
  font: "Source Sans Pro",
  fontNote: "the system's default sans ($theme-font-type-sans: source-sans-pro; Public Sans is the shipped alternative); OFL; not installed on a typical Windows machine — install or embed it, or PowerPoint substitutes",
  // system font-size tokens (px) × line-height tokens (1 = 1, 2 = 1.2,
  // 3 = 1.35, 4 = 1.5, 5 = 1.62, 6 = 1.75); weight per theme setting
  type: {
    "micro/3": [10, 13.5, 400],
    "size-1/3": [12, 16.2, 400],
    "size-3/4": [14, 21, 400],
    "size-3/4 bold": [14, 21, 700],
    "size-5/4": [16, 24, 400],
    "size-5/3 bold": [16, 21.6, 700],
    "size-8/3 bold": [20, 27, 700],
    "size-11/2 bold": [28, 33.6, 700],
    "size-13/2 bold": [36, 43.2, 700],
    "size-15/2 bold": [48, 57.6, 700],
    "size-18/1 bold": [80, 80, 700],
  },
  roles: {
    display: "size-18/1 bold", hero: "size-15/2 bold", title: "size-13/2 bold", title2: "size-11/2 bold",
    subtitle: "size-8/3 bold", subtitle2: "size-5/3 bold", body2: "size-5/4", body: "size-3/4",
    bodyStrong: "size-3/4 bold", label: "size-1/3", caption: "size-1/3", caption2: "micro/3",
  },
  spacing: {
    "units-05": 4, "units-1": 8, "units-105": 12, "units-2": 16, "units-205": 20, "units-3": 24,
    "units-4": 32, "units-5": 40, "units-6": 48, "units-7": 56, "units-8": 64, "units-9": 72, "units-10": 80,
  },
  space: {
    xxs: "units-05", xs: "units-05", s: "units-1", m: "units-105", l: "units-2", xl: "units-205",
    xxl: "units-3", xxxl: "units-4",
  },
  grid: { margin: "units-4", gutter: "units-3" }, // $theme-column-gap-lg: 3 units (the largest gap setting)
  // $theme-border-radius-sm = 2 px, md = 0.5 unit (4 px), lg = 1 unit (8 px)
  borderRadius: { none: 0, small: 2, medium: 4, large: 4, xLarge: 8, circular: 10000 },
  strokeWidth: { thin: 1, thick: 2, thicker: 4, thickest: 8 },
  colors: {
    textPrimary: ["1B1B1B", "ink / base-darkest"],
    textSecondary: ["3D4551", "base-darker"],
    textTertiary: ["565C65", "base-dark"],
    textOnInverse: ["FFFFFF", "white"],
    textOnInverseSecondary: ["DFE1E2", "base-lighter"],
    background: ["FFFFFF", "white"],
    layer: ["F0F0F0", "base-lightest"],
    backgroundInverse: ["162E51", "primary-darker"],
    layerInverse: ["1A4480", "primary-dark"],
    border: ["DFE1E2", "base-lighter"],
    brand: ["005EA2", "primary"],
    brandTint: ["D9E8F6", "primary-lighter"],
    success: ["008817", "success-dark (text); success is #00A91C"],
    successTint: ["ECF3EC", "success-lighter"],
    warning: ["936F38", "warning-darker (text); warning #FFBE2E is an icon tint"],
    warningTint: ["FAF3D1", "warning-lighter"],
    danger: ["B50909", "error-dark (text); error is #D54309"],
    dangerTint: ["F4E3DB", "error-lighter"],
    accent: ["28A0CB", "accent-cool-dark"],
  },
  // dark: USWDS publishes no dark theme — its own darkest base steps
  // as surfaces, the "-light" ramp steps as text-on-dark status colours
  colorsDark: {
    textPrimary: ["FFFFFF", "white"],
    textSecondary: ["DFE1E2", "base-lighter"],
    textTertiary: ["A9AEB1", "base-light"],
    textOnInverse: ["FFFFFF", "white"],
    textOnInverseSecondary: ["DFE1E2", "base-lighter"],
    background: ["1B1B1B", "base-darkest"],
    layer: ["3D4551", "base-darker"],
    backgroundInverse: ["162E51", "primary-darker"],
    layerInverse: ["1A4480", "primary-dark"],
    border: ["565C65", "base-dark"],
    brand: ["73B3E7", "primary-light"],
    success: ["70E17B", "success-light"],
    warning: ["FFBE2E", "warning"],
    danger: ["F39268", "error-light"],
    accent: ["97D4EA", "accent-cool-light"],
  },
};

// --------------------------------------------------------- makeDesign
/**
 * A token block → the shape every consumer reads: {id, name, license,
 * source, font, fontNote, TYPE (deck role → {sz pt, line pt, bold, px,
 * token}), SPACE (deck role → EMU), RADIUS, STROKE, GRID, BANDS, COLOR
 * (deck role → hex), COLOR_SOURCE (deck role → token name), C (the
 * short palette deckspec draws with), TONE_COLOR, tokens (the raw
 * block)}.
 */
export function makeDesign(t, theme = "light") {
  if (!THEMES.includes(theme)) throw new Error(`unknown theme "${theme}" — one of ${THEMES.join(", ")}`);
  const TYPE = {};
  for (const role of TYPE_ROLES) {
    const token = t.roles[role];
    const v = t.type[token];
    if (!v) throw new Error(`design ${t.id}: role ${role} names unknown type token ${token}`);
    const [sz, lh, w] = v;
    TYPE[role] = { sz: pt(sz), line: pt(lh), bold: w >= 600, px: sz, token };
  }
  const SPACE = {};
  for (const [role, token] of Object.entries(t.space)) {
    if (t.spacing[token] === undefined) throw new Error(`design ${t.id}: space role ${role} names unknown token ${token}`);
    SPACE[role] = px(t.spacing[token]);
  }
  const RADIUS = Object.fromEntries(Object.entries(t.borderRadius).map(([k, v]) => [k, px(v)]));
  const STROKE = Object.fromEntries(Object.entries(t.strokeWidth).map(([k, v]) => [k, px(v)]));
  const COLOR = {}, COLOR_SOURCE = {};
  const table = theme === "dark" ? t.colorsDark : t.colors;
  for (const role of COLOR_ROLES) {
    const c = table[role];
    if (!c && theme === "dark" && role.endsWith("Tint")) {
      // derived: the status colour blended 25 % over the dark layer
      const base = table[role.replace(/Tint$/, "")];
      COLOR[role] = mix(table.layer[0], base[0], 0.25);
      COLOR_SOURCE[role] = `${base[1]} 25 % over layer (derived)`;
      continue;
    }
    if (!c) throw new Error(`design ${t.id} (${theme}): colour role ${role} is missing`);
    COLOR[role] = c[0];
    COLOR_SOURCE[role] = c[1];
  }
  // grid: 12 columns, margin + gutter from the design's spacing tokens
  const GRID = (() => {
    const cols = 12;
    const margin = px(t.spacing[t.grid.margin]);
    const gutter = px(t.spacing[t.grid.gutter]);
    const contentW = SLIDE_W - 2 * margin;
    const colW = (contentW - (cols - 1) * gutter) / cols;
    const x = (c) => Math.round(margin + c * (colW + gutter));
    const span = (n) => Math.round(n * colW + (n - 1) * gutter);
    return { cols, margin, gutter, contentW, colW, x, span, marginToken: t.grid.margin, gutterToken: t.grid.gutter };
  })();
  // bands: header (caption line + title line), body, footer (caption line)
  const BANDS = (() => {
    const top = GRID.margin;
    const titleLine = Math.round(TYPE.title.line * EMU_PER_PT);
    const captionLine = Math.round(TYPE.caption.line * EMU_PER_PT);
    const headerH = captionLine + titleLine;
    const bodyTop = top + headerH + SPACE.xl;
    const footerH = captionLine;
    const footerTop = SLIDE_H - GRID.margin - footerH;
    const bodyBottom = footerTop - SPACE.xl;
    return { top, headerH, titleLine, bodyTop, bodyBottom, footerTop, footerH };
  })();
  const C = {
    ink: COLOR.textPrimary, inkSoft: COLOR.layerInverse, muted: COLOR.textTertiary, paper: COLOR.background,
    tint: COLOR.layer, border: COLOR.border, ice: COLOR.textOnInverseSecondary, onInk: COLOR.textOnInverse,
    inverse: COLOR.backgroundInverse,
    green: COLOR.success, greenTint: COLOR.successTint, red: COLOR.danger, redTint: COLOR.dangerTint,
    amber: COLOR.warning, amberTint: COLOR.warningTint, teal: COLOR.brand, tealTint: COLOR.brandTint,
    accent: COLOR.accent,
  };
  const TONE_COLOR = {
    neutral: { fg: C.muted, bg: C.tint },
    brand: { fg: C.teal, bg: C.tealTint },
    success: { fg: C.green, bg: C.greenTint },
    warning: { fg: C.amber, bg: C.amberTint },
    danger: { fg: C.red, bg: C.redTint },
  };
  const design = {
    id: t.id, theme, name: t.name + (theme === "dark" ? " (dark)" : ""), license: t.license, source: t.source,
    font: t.font, fontNote: t.fontNote,
    TYPE, SPACE, RADIUS, STROKE, GRID, BANDS, COLOR, COLOR_SOURCE, C, TONE_COLOR, tokens: t,
  };
  // fluent / light IS the palette the figures are drawn in: no map
  design.figureMap = t.id === "fluent" && theme === "light" ? [] : figureMap(design);
  return design;
}

const TOKEN_SETS = { fluent: FLUENT, carbon: CARBON, uswds: USWDS };
export const DESIGN_NAMES = Object.keys(TOKEN_SETS);
export const DEFAULT_DESIGN = "fluent";
export const DEFAULT_THEME = "light";

const cache = new Map();
/** The design for a name + theme; throws on an unknown one (the CLI / config guard). */
export function designOf(name, theme) {
  const id = String(name || DEFAULT_DESIGN).toLowerCase();
  const th = String(theme || DEFAULT_THEME).toLowerCase();
  if (!TOKEN_SETS[id]) throw new Error(`unknown design "${name}" — one of ${DESIGN_NAMES.join(", ")}`);
  if (!THEMES.includes(th)) throw new Error(`unknown theme "${theme}" — one of ${THEMES.join(", ")}`);
  const key = `${id}/${th}`;
  if (!cache.has(key)) cache.set(key, makeDesign(TOKEN_SETS[id], th));
  return cache.get(key);
}

/** The light designs by name (the v1.1 table). */
export const DESIGNS = Object.fromEntries(DESIGN_NAMES.map((k) => [k, designOf(k, "light")]));

// ------------------------------------------------------ figure restyle
// The Diagram Style Framework palette every figure is drawn in
// (figurespec FIG_STYLE / SlideFigures figStyle) → the design's roles.
// Event strokes and node tints are the lighter companions of a tone;
// they derive from the role the same way on every design.
function figureMap(d) {
  const { COLOR: R } = d;
  const light = (hex) => mix(hex, R.background, 0.45);      // event / swatch strokes
  const tint = (hex) => mix(R.background, hex, d.theme === "dark" ? 0.25 : 0.12); // node fills
  return [
    ["16302F", R.textPrimary],
    ["4E6265", R.textSecondary],
    ["6E8285", R.textTertiary],
    ["B9C6C6", mix(R.border, R.textTertiary, 0.3)],
    ["D7DFDF", R.border],
    ["FFFFFF", R.background],
    ["E9EDED", R.layer],
    ["EFF2F2", R.layer],
    ["E5F0F5", tint(R.brand)],
    ["F9F0E2", tint(R.warning)],
    ["E6F2EC", tint(R.success)],
    ["EFEAF7", tint(R.accent)],
    ["F8E9E5", tint(R.danger)],
    ["1B6E8C", R.brand],
    ["C2701A", R.warning],
    ["9C5A12", R.warning],
    ["2E7D5B", R.success],
    ["7A5AA6", R.accent],
    ["B2442F", R.danger],
    ["4FA7D5", light(R.brand)],
    ["E39A45", light(R.warning)],
    ["4EB183", light(R.success)],
    ["A58BD3", light(R.accent)],
    ["DC8168", light(R.danger)],
  ];
}

/**
 * A figure SVG (text) re-coloured into the design: every palette hex
 * in its <style>, <defs> and inline attributes mapped to the design's
 * roles, the font family to the design's face. Identity on the
 * default design + theme (fluent / light).
 */
export function restyleFigureSvg(svg, design) {
  const d = design && design.TYPE ? design : designOf(design);
  let out = String(svg);
  // single pass through a placeholder so a mapped colour is never re-mapped
  const marks = d.figureMap.map(([from, to], i) => [from, `\u0000${i}\u0000`, to]);
  for (const [from, mark] of marks) out = out.replace(new RegExp("#" + from, "gi"), mark);
  for (const [, mark, to] of marks) out = out.split(mark).join("#" + to);
  out = out.replace(/font-family:'Segoe UI'/g, `font-family:'${d.font.replace(/'/g, "")}'`);
  return out;
}

// the default design's tables, for consumers that never switch
const D0 = DESIGNS[DEFAULT_DESIGN];
export const TYPE = D0.TYPE;
export const SPACE = D0.SPACE;
export const RADIUS = D0.RADIUS;
export const STROKE = D0.STROKE;
export const GRID = D0.GRID;
export const BANDS = D0.BANDS;
export const COLOR = D0.COLOR;
export const TONE_COLOR = D0.TONE_COLOR;

/** Semantic tones a spec may name; each resolves to a fg/bg pair. */
export const TONES = ["neutral", "brand", "success", "warning", "danger"];

// ------------------------------------------------------------- patterns
// Capacities are what fits the grid at the ramp with the spacing ramp's
// gaps — a slide that respects them never overflows; the layout still
// measures and paginates or truncates rather than spill past the footer.
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

/** One line per design, for --help and the docs. */
export function describeDesigns() {
  return DESIGN_NAMES.map((k) => {
    const d = DESIGNS[k];
    return `${k}: ${d.name} (${d.license}) — ${d.font}; ${d.fontNote}`;
  }).join("\n") + `\nthemes: ${THEMES.join(" | ")} (default ${DEFAULT_THEME})`;
}
