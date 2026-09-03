/**
 * presentation.mjs v1.0 — sidecar-body presentation transforms, moved
 * verbatim out of sweep.mjs v1.30 (module split, no behavior change;
 * covered end-to-end by check_local_sweep.py). Applied to the SIDECAR
 * BODY ONLY — the LLM input, TextPreview and the similarity index
 * always keep the raw extracted text.
 */

/**
 * placeFigure — put a slide's rendered SVG(s) where the slide put them
 * (v1.26), and drop the "[figure: ...]" caption ZipTextExtract left in the
 * body, since the figures now carry those labels. The caption is the
 * fallback: if no figure was produced for a slide it stays exactly as it was.
 *
 * v1.23 inserted every figure directly after the slide heading, which on a
 * case slide stacked the input and output diagrams above the very tables
 * that state their numbers — the reader could no longer tell which figure
 * went with which table. SlideFigures v1.3 reports, per figure, the first
 * row of the slide table the figure sits with (`anchor`, as cell texts); an
 * anchored figure now inserts directly BEFORE that table — the first
 * unclaimed table row in the section that matches the anchor AND opens its
 * table (the line directly above it is not a table row). A figure with no
 * anchor, or whose table did not survive extraction, keeps the v1.23
 * after-heading placement. Figures stay in the renderer's top-to-bottom
 * order throughout.
 */
export function placeFigure(text, slide, items) {
  const lines = String(text).split("\n");
  const head = new RegExp(`^#{2,3} Slide ${slide}\\b`);
  let at = -1;
  for (let i = 0; i < lines.length; i++) {
    if (head.test(lines[i])) { at = i; break; }
  }
  if (at < 0) return text;
  let end = lines.length;
  for (let i = at + 1; i < lines.length; i++) {
    if (/^#{2,3} (Slide \d+|Notes)\b/.test(lines[i])) { end = i; break; }
  }
  const kept = [];
  for (let i = at + 1; i < end; i++) {
    if (/^\[figure: /.test(lines[i].trim())) continue;
    kept.push(lines[i]);
  }
  while (kept.length && kept[0].trim() === "") kept.shift();

  // a markdown table row -> comparable key (cells unescaped and trimmed,
  // trailing empties dropped — gridSpan padding must not defeat a match);
  // null for anything that is not a table row
  const rowKey = (ln) => {
    const s = String(ln ?? "").trim();
    if (s.length < 2 || s[0] !== "|" || s[s.length - 1] !== "|") return null;
    const cells = s.slice(1, -1).split(/(?<!\\)\|/)
      .map((c) => c.replace(/\\\|/g, "|").trim());
    while (cells.length && cells[cells.length - 1] === "") cells.pop();
    return cells.join("\u0001");
  };
  const img = (it) =>
    `![${String(it.alt || "Slide diagram").replace(/[\[\]]/g, "")}](${it.href})`;

  const claimed = new Set();
  const beforeTable = new Map(); // kept[] index -> image lines to insert
  const topImgs = [];
  for (const it of items) {
    const anchor = Array.isArray(it.anchor) && it.anchor.length
      ? (() => {
          const cells = it.anchor.map((c) => String(c).trim());
          while (cells.length && cells[cells.length - 1] === "") cells.pop();
          return cells.join("\u0001");
        })()
      : null;
    let found = -1;
    if (anchor !== null) {
      for (let j = 0; j < kept.length; j++) {
        if (claimed.has(j) || rowKey(kept[j]) !== anchor) continue;
        // the row must OPEN its table: a table row on the line directly
        // above means this is a mid-table echo, not a first row (tables
        // render with a blank line before them, so a blank above is fine)
        if (j > 0 && rowKey(kept[j - 1]) !== null) continue;
        found = j;
        break;
      }
    }
    if (found >= 0) {
      claimed.add(found);
      if (!beforeTable.has(found)) beforeTable.set(found, []);
      beforeTable.get(found).push(img(it));
    } else {
      topImgs.push(img(it));
    }
  }
  const out = lines.slice(0, at + 1);
  if (topImgs.length) out.push("", ...topImgs);
  if (kept.length) out.push("");
  for (let j = 0; j < kept.length; j++) {
    const ins = beforeTable.get(j);
    if (ins) {
      if (out.length && out[out.length - 1].trim() !== "") out.push("");
      out.push(...ins, "");
    }
    out.push(kept[j]);
  }
  return out.concat(lines.slice(end)).join("\n");
}

/**
 * tidyBody — presentation polish for the extracted document text
 * (v1.20). Applied to the SIDECAR BODY ONLY: the LLM input, the
 * TextPreview field and the similarity index keep the raw text, so
 * classification and ranking are untouched. Deliberately here and
 * not in ZipTextExtract — that script is tenant-pasted and under
 * byte-equivalence gates; this is local presentation.
 *
 *   - drops the slide-number placeholder line PowerPoint leaves on
 *     each slide ("3" alone under "## Slide 3")
 *   - normalizes bullets: consistent 2-space depth steps, padding
 *     inside the marker collapsed ("-          text" -> "- text"),
 *     empty bullets dropped
 *   - tightens lists: no blank line between consecutive bullets
 *     (markdown renders them loose/sprawling otherwise)
 *   - drops "### Notes" sections that hold nothing but the slide
 *     number, and collapses runs of blank lines
 */
export function tidyBody(text) {
  const isBullet = (s) => /^\s*[-*]\s/.test(s);
  const lines = String(text).replace(/\r\n?/g, "\n").split("\n");
  const kept = [];
  let slideNo = null;
  for (const raw of lines) {
    let ln = raw.replace(/[ \t]+$/, "");
    const h = /^##+ Slide (\d+)/.exec(ln);
    if (h) slideNo = h[1];
    if (slideNo && ln.trim() === slideNo) continue; // slide-number noise
    if (isBullet(ln)) {
      const m = /^([ \t]*)[-*][ \t]+([\s\S]*)$/.exec(ln);
      if (m) {
        const width = m[1].replace(/\t/g, "  ").length;
        const body = m[2].replace(/^[\s ]+/, "").replace(/[\s ]+$/, "");
        if (!body) continue; // empty bullet
        ln = "  ".repeat(Math.floor(width / 2)) + "- " + body;
      }
    }
    kept.push(ln);
  }
  // tighten: drop blanks between consecutive bullets, collapse runs
  const tight = [];
  for (let i = 0; i < kept.length; i++) {
    if (kept[i].trim() !== "") {
      tight.push(kept[i]);
      continue;
    }
    let n = i + 1;
    while (n < kept.length && kept[n].trim() === "") n++;
    const prev = tight.length ? tight[tight.length - 1] : "";
    const next = n < kept.length ? kept[n] : "";
    if (!tight.length) continue; // leading blanks
    if (isBullet(prev) && isBullet(next)) continue; // inside a list
    if (prev.trim() === "") continue; // already blank
    tight.push("");
  }
  // drop "### Notes" headings whose section is empty
  const out = [];
  for (let i = 0; i < tight.length; i++) {
    if (/^###+ Notes\s*$/.test(tight[i])) {
      let j = i + 1;
      while (j < tight.length && tight[j].trim() === "") j++;
      if (j >= tight.length || /^#{2,4} /.test(tight[j])) {
        i = j - 1;
        continue;
      }
    }
    out.push(tight[i]);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").replace(/\s+$/, "") + "\n";
}

/**
 * caseHeadings — test-case-derived slide headings (v1.25 TC-1;
 * reshaped v1.29, TC-3). The test-plan decks in this corpus put one
 * test case per slide, but few of those slides carry a title
 * placeholder — so their sections rendered as bare "## Slide 12" and
 * the reader had to open each one to learn which case it holds. This
 * pass rewrites a BARE slide heading from what the slide itself
 * states — and, since TC-3, keeps SPECIFICS (route ids, split
 * measures) OUT of headings: the H2 names the case and its
 * Positive/Negative classification, an H3 names the scenario, and
 * the case line's specifics stay in the body:
 *
 *   ## Slide 5                          ## Case 2: Positive - Non Spanning Line Event <!-- slide 5 -->
 *   Positive - Non spanning line event
 *   2. Loop – Split measure : 20    →   ### Loop
 *   ...                                 **Loop – Split measure: 20**
 *
 * Deterministic by decision (recorded in local/CHANGES.md v1.25): the
 * slide's own case + classification lines ARE the header the user
 * wants, an LLM pass would put AI spend and nondeterminism into the
 * no-AI --reformat path, and a slide with no case text keeps its
 * honest "## Slide N".
 *
 * Rules, per section under a heading that is EXACTLY "## Slide N"
 * (a slide the author titled keeps that title; "### Notes" and later
 * sections are never scanned):
 *   a. exactly ONE numbered line ("2. Loop – Split measure : 20",
 *      "8) Gap …", bullet or plain) is the case → "## Case 2: <the
 *      slide's Positive/Negative classification line>", or bare
 *      "## Case 2" when the slide has no classification line.
 *      Two or more numbered lines mean the slide is a CHECKLIST of
 *      verifications, not a case — the heading stays untouched.
 *   b. no numbered line, but a Positive/Negative classification line
 *      is present (the corpus marker of a case slide) → the
 *      classification IS the H2; the first short digit-bearing
 *      content line is the case text ("Normal route - Split measure
 *      :16"). Lines opening "current date" or "modify" (the decks'
 *      modify-this-case notes) never qualify.
 *   c. otherwise, a line of the shape "<name> test cases" titles the
 *      section ("Conflict Prevention test cases").
 * Table rows, image/figure links and fenced code are never candidates.
 * Under rules a/b the case line's SCENARIO — the text minus its
 * split-measure tail, route ids, and a generic leading "Route –" —
 * becomes a title-cased "### <scenario>" directly under the H2
 * (cut at the 60-char title budget's last phrase break, v1.27 TC-2;
 * skipped when the classification already states it), and the full
 * case text survives as a bold body line whenever any heading
 * dropped detail, so no measure or route id is ever lost — it just
 * never sits in a heading. The promoted classification line leaves
 * the body (it now IS the H2); a "current date: …" tail stripped
 * from the case line is re-emitted as its own body line.
 * The original slide number rides along as an HTML comment (hidden by
 * every renderer, like the metadata frame) so provenance survives.
 *
 * Applied with tidyBody to the SIDECAR BODY ONLY — the LLM input,
 * TextPreview and the similarity index keep the raw extracted text,
 * and ZipTextExtract stays untouched (tenant-pasted, byte-equivalence
 * gated); a cloud-flow rollback simply keeps "## Slide N".
 */
export function caseHeadings(text) {
  const lines = String(text).split("\n");
  const clean = (s) =>
    String(s)
      .replace(/[|#]/g, " ")
      .replace(/\s*[-–—,]?\s*current date\s*:.*$/i, "")
      .replace(/\s*:\s*/g, ": ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/[\s\-–—,:;]+$/, "");
  // A long case line no longer truncates mid-sentence into the heading
  // ("…from measures 0-4 and"). The heading takes a SHORT title — the text
  // up to the last phrase break (comma/colon/semicolon/dash) inside the
  // budget, falling back to a word boundary — and the FULL text survives as
  // a bold subheader line where the case line stood (v1.27, TC-2).
  const TITLE_MAX = 60;
  const shortTitle = (t) => {
    if (t.length <= TITLE_MAX) return t;
    const head = t.slice(0, TITLE_MAX + 1);
    let cut = -1;
    const re = /[,;:]\s|\s[-–—]\s/g;
    for (let m; (m = re.exec(head)) !== null; ) cut = m.index;
    if (cut < 16) cut = head.lastIndexOf(" ");
    if (cut < 16) cut = TITLE_MAX;
    return head.slice(0, cut).replace(/[\s\-–—,:;]+$/, "");
  };
  // TC-3 (v1.29): heading text is title-cased with the decks' glued
  // dashes and slashes spaced out ("Positive -line network" →
  // "Positive - Line Network", "from/ To" → "From / To"); small
  // connector words stay lowercase mid-title.
  const SMALL_WORDS = /^(a|an|and|as|at|but|by|for|in|nor|of|on|or|per|the|via|with)$/;
  const headingText = (t) =>
    clean(t)
      .replace(/\s([-–—])(?=\S)/g, " $1 ")
      .replace(/(\S)([–—]) /g, "$1 $2 ")
      .replace(/\s*\/\s*/g, " / ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .map((w, k) =>
        !/^[a-z]/.test(w) ? w
        : k > 0 && SMALL_WORDS.test(w) ? w
        : w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  // the case line's SCENARIO: its text minus the specifics that must
  // never sit in a heading — the split-measure tail ("Split measure:
  // 20", "splitting measure 0(R3L1) or 100", "split measure 20 of
  // R1L1"), route ids, and a generic leading "Route –"
  const scenarioOf = (t) =>
    clean(
      String(t)
        .replace(/[\s\-–—,:]*\bsplit(?:ting)?\s+measures?\b[\s\S]*$/i, "")
        .replace(/\(?\bR\d+(?:L\d+)?\b\)?/g, " ")
        .replace(/^\s*Routes?\s*[-–—]\s*(?=\S)/i, "")
    );
  const heads = [];
  for (let i = 0; i < lines.length; i++)
    if (/^## Slide \d+$/.test(lines[i])) heads.push(i);
  // sections are edited back-to-front so earlier indices stay valid
  for (let h = heads.length - 1; h >= 0; h--) {
    const i = heads[h];
    const hm = /^## Slide (\d+)$/.exec(lines[i]);
    let end = lines.length;
    for (let j = i + 1; j < lines.length; j++) {
      if (/^#{2,3} /.test(lines[j])) { end = j; break; }
    }
    // candidate content lines: no tables, links, figures, fenced code
    const cands = [];
    let fenced = false;
    for (let j = i + 1; j < end; j++) {
      const s = lines[j].trim();
      if (s.indexOf("```") === 0) { fenced = !fenced; continue; }
      if (fenced || s === "" || s.charAt(0) === "|" ||
          s.indexOf("![") === 0 || s.indexOf("[figure:") === 0) continue;
      cands.push({ at: j, s });
    }
    const numbered = [];
    for (const c of cands) {
      const m = /^(?:- )?(\d{1,3})[.)]\s+(.*)$/.exec(c.s);
      if (m && /[A-Za-z]/.test(m[2])) numbered.push({ at: c.at, num: m[1], text: m[2] });
    }
    // the Positive/Negative classification line — the corpus marker of
    // a case slide, and now the H2's text
    const classCand = cands.find((c) =>
      /^(?:- )?(Positive|Negative)\b/i.test(c.s) && c.s.length <= 100) || null;
    const classText = classCand ? headingText(classCand.s.replace(/^- /, "")) : "";
    let heading = "", caseAt = -1, caseFull = "";
    if (numbered.length === 1) {
      caseFull = clean(numbered[0].text);
      if (caseFull) {
        heading = classText ? `Case ${numbered[0].num}: ${classText}` : `Case ${numbered[0].num}`;
        caseAt = numbered[0].at;
      }
    } else if (numbered.length === 0 && classCand) {
      for (const c of cands) {
        const s = c.s.replace(/^- /, "");
        if (/^(Positive|Negative|current date\b|modify\b)/i.test(s)) continue;
        if (s.length > 100 || !/\d/.test(s)) continue;
        caseFull = clean(s);
        if (caseFull) {
          heading = classText;
          caseAt = c.at;
        }
        break;
      }
    }
    if (!heading) {
      for (const c of cands) {
        const m = /^(.{1,60}?)\s*test cases\b/i.exec(c.s);
        if (m && clean(m[1])) { heading = `${clean(m[1])} test cases`; break; }
      }
      if (!heading) continue;
      lines[i] = `## ${heading} <!-- slide ${hm[1]} -->`;
      continue;
    }
    // scenario H3 (title budget per v1.27 TC-2; skipped when the
    // classification already states it), and the full case text as a
    // bold body line whenever a heading dropped detail
    let h3 = "", sub = "";
    const scenario = scenarioOf(caseFull);
    if (scenario) {
      const st = headingText(shortTitle(scenario));
      if (!classText || classText.toLowerCase().indexOf(st.toLowerCase()) < 0) h3 = st;
      if (st.toLowerCase() !== caseFull.toLowerCase()) sub = caseFull;
    } else {
      sub = caseFull;
    }
    // a "current date: …" tail on the case line is re-emitted as its
    // own body line so nothing is lost
    let tail = "";
    const tm = /(current date\s*:\s*\S.*)$/i.exec(lines[caseAt]);
    if (tm) tail = tm[1].charAt(0).toUpperCase() + tm[1].slice(1);
    const repl = [];
    if (sub) repl.push(`**${sub}**`);
    if (tail) repl.push(tail);
    // body edits high-index-first so positions stay valid
    const edits = [{ at: caseAt, repl }];
    if (classCand) edits.push({ at: classCand.at, repl: [] });
    edits.sort((a, b) => b.at - a.at);
    for (const e of edits) lines.splice(e.at, 1, ...e.repl);
    lines[i] = `## ${heading} <!-- slide ${hm[1]} -->`;
    if (h3) lines.splice(i + 1, 0, "", `### ${h3}`, "");
  }
  return lines.join("\n").replace(/\n{3,}/g, "\n\n");
}

/**
 * compactWhy — shorten RelatedRank's evidence prose for display
 * (v1.21). The ranker's full string is great for debugging but long
 * enough that five related entries dominate the sidecar:
 *
 *   similar text (0.46) · 5 title words: bit, editing, oid, +2 more ·
 *   3 filename words: bit, editing, tools · also: same surface
 *   ->  similar text 0.46 · 5 title words · 3 filename words · same surface
 *
 * Token enumerations collapse to their counts, keyword names cap at
 * two, and the "also:" tail loses its repetition. Applied locally to
 * the ranked entries before SidecarPatch renders them, so
 * RelatedRank's own contract (and check_related) is untouched.
 */
export function compactWhy(why) {
  const parts = String(why || "").split(" · ");
  const out = [];
  for (const raw of parts) {
    const p = raw.trim();
    if (!p) continue;
    let m;
    if ((m = /^similar text \(([\d.]+)\)$/.exec(p))) {
      out.push(`similar text ${m[1]}`);
    } else if ((m = /^(\d+) (title|filename) words?:/.exec(p))) {
      out.push(`${m[1]} ${m[2]} word${m[1] === "1" ? "" : "s"}`);
    } else if ((m = /^(\d+) shared keywords?: (.+)$/.exec(p))) {
      const names = m[2].replace(/, \+\d+ more$/, "").split(", ");
      const shown = names.slice(0, 2).join(", ");
      out.push(`${m[1]} shared keyword${m[1] === "1" ? "" : "s"}: ${shown}`);
    } else if ((m = /^also: (.+)$/.exec(p))) {
      out.push(m[1].replace(/\bsame /g, "").split(", ").join("/").replace(/^/, "same "));
    } else {
      out.push(p);
    }
  }
  return out.join(" · ");
}
