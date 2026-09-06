/**
 * storyprofile.mjs — the `story/v1` body profile for User Story decks
 * (Sidecar_Format_Plan §4.3, phase 5).
 *
 * The team's story template titles its slides consistently — in the
 * corpus: "User Story" (246 of 298 decks), "Testing" (264),
 * "Documentation" (238), "Automation" (213), "Assignment" (213),
 * "Story Points" / "Estimation", "Acceptance Criteria" /
 * "Requirements", "Configuration" — with the feature's requirement
 * slides in between under their own titles. This pass maps those
 * slide titles onto canonical sections so every story reads the same
 * way and TestPlanGen has a fixed place to find the acceptance
 * criteria:
 *
 *   ## Story                 title slide, "User Story", "Personas", "Workflow"
 *   ## Acceptance Criteria   "Acceptance Criteria", "Requirements",
 *                            "Configuration", and every otherwise-untitled
 *                            requirement slide between Story and Testing
 *   ## Testing               "Testing", "Test data"
 *   ## Automation            "Automation"
 *   ## Documentation         "Documentation"
 *   ## Assignment            "Assignment", "Story Points", "Estimation"
 *   ## Other content         anything after Testing that maps nowhere
 *
 * Each source slide keeps its own "### <title> <!-- slide N -->"
 * sub-heading inside its section (omitted when the slide title IS the
 * section name), so nothing is lost and provenance survives. Applied
 * only when the deck carries at least two canonical titles — a story
 * that does not follow the template keeps its tidied slide sections
 * (shape "none"). Deterministic, no AI.
 */

export const STORY_PROFILE = "story/v1";

const SECTIONS = ["Story", "Acceptance Criteria", "Testing", "Automation", "Documentation", "Assignment"];

const CANON = [
  [/^(user stor(?:y|ies)|story|personas?|workflows?|user story,? personas?,? (?:and )?workflows?|user story & personas)$/i, "Story"],
  [/^(acceptance criteria|acceptance criteria (?:&|and) requirements|requirements?|functional requirements?|configuration|acceptance)$/i, "Acceptance Criteria"],
  [/^(testing|tests?|test data|test plan|testing notes?)$/i, "Testing"],
  [/^(automation|automation notes?|automation documentation)$/i, "Automation"],
  [/^(documentation|docs?|documentation notes?)$/i, "Documentation"],
  [/^(assignment|story points?|estimation|estimates?|assignment & estimate)$/i, "Assignment"],
];

function canonOf(title) {
  const t = String(title || "").replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ").trim();
  for (const [re, name] of CANON) if (re.test(t)) return name;
  return null;
}

function splitSlides(lines) {
  const units = [];
  let cur = null;
  for (const ln of lines) {
    const m = /^## Slide (\d+)(?:\s+—\s+(.*))?$/.exec(ln);
    if (m) {
      cur = { slideNo: parseInt(m[1], 10), title: (m[2] || "").trim(), lines: [] };
      units.push(cur);
      continue;
    }
    if (/^## /.test(ln)) { cur = null; units.push({ slideNo: 0, title: ln.replace(/^## /, ""), lines: [], foreign: true }); cur = units[units.length - 1]; continue; }
    if (!cur) { cur = { slideNo: 0, title: "", lines: [], preamble: true }; units.push(cur); }
    cur.lines.push(ln);
  }
  return units;
}

const trim = (ls) => {
  const out = ls.slice();
  while (out.length && out[0].trim() === "") out.shift();
  while (out.length && out[out.length - 1].trim() === "") out.pop();
  return out;
};

/** renderStoryBody(tidiedBody) → { body, shape: "story" | "none", profile } */
export function renderStoryBody(tidied) {
  const text = String(tidied || "").replace(/\r\n?/g, "\n");
  if (/^## (Story|Acceptance Criteria|Testing)$/m.test(text)) return { body: text, shape: "story", profile: STORY_PROFILE };
  const lines = text.split("\n");
  const units = splitSlides(lines);
  const canonHits = units.filter((u) => u.slideNo && canonOf(u.title)).length;
  if (canonHits < 2) return { body: text, shape: "none", profile: STORY_PROFILE };

  const buckets = new Map(SECTIONS.map((s) => [s, []]));
  buckets.set("Other content", []);
  let seenTesting = false;
  let first = true;
  for (const u of units) {
    if (u.foreign || u.preamble) {
      const body = trim(u.lines);
      if (!body.length && !u.foreign) continue;
      buckets.get("Other content").push("", u.foreign ? `### ${u.title}` : "", ...body);
      continue;
    }
    let sec = canonOf(u.title);
    if (!sec) {
      if (first) sec = "Story";                       // the title slide
      else sec = seenTesting ? "Other content" : "Acceptance Criteria";
    }
    if (sec === "Testing") seenTesting = true;
    first = false;
    const body = trim(u.lines);
    const label = u.title && canonOf(u.title) !== sec ? u.title : (u.title && u.title.toLowerCase() !== sec.toLowerCase() ? u.title : "");
    const head = label ? `### ${label} <!-- slide ${u.slideNo} -->` : `<!-- slide ${u.slideNo} -->`;
    buckets.get(sec).push("", head, ...body);
  }
  const out = [];
  for (const s of [...SECTIONS, "Other content"]) {
    const b = trim(buckets.get(s));
    if (!b.length) continue;
    out.push(`## ${s}`, ...b, "");
  }
  return {
    body: out.join("\n").replace(/\n{3,}/g, "\n\n").replace(/\s+$/, "") + "\n",
    shape: "story",
    profile: STORY_PROFILE,
  };
}

/**
 * For TestPlanGen: the story text with the parts that ground a draft
 * first — Story and Acceptance Criteria ahead of Testing and the rest —
 * so a StoryCap cut keeps the requirements. Non-profile bodies return
 * unchanged.
 */
export function storyTextFirst(md) {
  const s = String(md || "");
  if (!/^## Acceptance Criteria$/m.test(s)) return s;
  const at = s.search(/^## (Story|Acceptance Criteria)$/m);
  if (at < 0) return s;
  const head = s.slice(0, at);
  const rest = s.slice(at);
  const secs = rest.split(/(?=^## )/m);
  const order = (name) => {
    const i = ["## Story", "## Acceptance Criteria", "## Testing", "## Automation", "## Documentation", "## Assignment", "## Other content"]
      .findIndex((h) => name.startsWith(h + "\n") || name.trim() === h);
    return i < 0 ? 99 : i;
  };
  return head + secs.slice().sort((a, b) => order(a) - order(b)).join("");
}
