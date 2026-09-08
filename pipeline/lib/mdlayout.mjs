/**
 * mdlayout.mjs v1.6 — the markdown layout kernel
 * (docs/design/Markdown_Layout_Plan.md §4.1, phase 2's inhabitant).
 *
 * The project writes ONE markdown dialect — GitHub-flavored: ATX
 * headings, pipe tables, GFM alerts (`> [!WARNING]`), GFM task lists
 * (`- [ ] …`), fenced code, HTML comments for machine data, and no
 * raw HTML except the `<br>` a multi-column table cell carries
 * (Sidecar_Format_Plan.md decision 2). GitHub, the SharePoint preview,
 * the Q&A agent and `render/draft2docx.mjs` all read that dialect
 * natively.
 *
 * MkDocs Material does not. It is the one consumer with a render step,
 * so the translation lives HERE and runs in that lane only — the files
 * on disk stay dialect-neutral:
 *
 *   - **Group:** Normal   ->  Group / `:   Normal` (a definition list)
 *   > [!WARNING]          ->  !!! warning  + indented body
 *   > [!WARNING] Title    ->  !!! warning "Title"
 *   > [!NOTE]-            ->  ??? note       (collapsed; `+` opens it)
 *   <RouteID>             ->  &lt;RouteID>   (raw text python-markdown
 *                             would otherwise swallow as an HTML tag)
 *   trailing {measure}    ->  \{measure}     (attr_list is enabled)
 *   <br>, <https://…>     ->  left alone (the dialect's two exceptions)
 *
 * Code spans and fenced blocks are never touched: `<` renders itself
 * there, and escaping would show the entity.
 *
 * v1.6 — `Case` bares too: the full case line the heading shortened
 * is the card's lead sentence (`/// html | div.lrs-case-text`), not a
 * labelled definition. `Trace` is the one field still a definition.
 *
 * v1.5 — two fields lose their labels in the MkDocs lane. `Group` is
 * a category, not a fact about the case, and `Steps` ARE the case:
 * a reader of the card gains nothing from the words "Group" and
 * "Steps" beside them. Each is written as a class-named Blocks html
 * block holding the content alone (`/// html | div.lrs-group`,
 * `/// html | div.lrs-steps`), which the wiki's stylesheet draws as
 * a quiet line over the card and as the procedure, flush with the card.
 * `FIELD_BARE` is the whole rule; `Case` and `Trace` stay a definition
 * list, and nothing on disk changes shape.
 *
 * v1.4 — Blocks syntax where blocks NEST
 * (https://facelessuser.github.io/pymdown-extensions/extensions/blocks/).
 * The `!!!` admonition form nests by indentation, which a reader of
 * the generated markdown cannot see; the Blocks form nests by slash
 * count — an outer block takes MORE slashes than the blocks inside
 * it, and the nesting is in the margin. `block()` composes one, and
 * the Expected Result admonition is written in that form, because it
 * sits inside the wiki's case card (`//// html | div.lrs-case`).
 * Flat blocks keep the `!!!` form.
 *
 * v1.3 — a field that IS a verdict. Of the case grammar's fields,
 * `Expected Result` is not one more definition: it is the pass
 * criterion, the line a tester reads last and a reviewer reads first.
 * In the MkDocs lane it renders as a `success` admonition
 * (https://squidfunk.github.io/mkdocs-material/reference/admonitions/
 * — the green check), so every case on a page ends in the same green
 * box, while Group, Case, Steps and Trace stay a definition list.
 * `FIELD_ADMONITIONS` is the whole rule; the files on disk keep the
 * bold-label bullet GitHub and the SharePoint preview read.
 *
 * v1.2 — definition lists
 * (https://squidfunk.github.io/mkdocs-material/reference/lists/). The
 * case grammar writes its fields as bold-label bullets — `- **Group:**
 * Normal Routes` — because GFM has no definition list and GitHub, the
 * SharePoint preview and `draft2docx` all read a bullet. MkDocs does
 * have one, and a case's fields ARE definitions, so the lane
 * translates them; `defList()` composes one for the pages a job
 * writes. Nothing on disk changes shape.
 *
 * v1.1 — the whole admonition vocabulary Material documents
 * (https://squidfunk.github.io/mkdocs-material/reference/admonitions/)
 * is reachable from the dialect, and `admonition()` composes one
 * directly for the pages a job WRITES for the wiki (no GitHub
 * consumer, so no dialect constraint): every Material type and its
 * aliases, a custom title, `""` for no title at all, the collapsible
 * `???`/`???+` forms and the `inline` modifier.
 */

/**
 * GFM / Obsidian-style alert type -> python-markdown admonition class.
 *
 * The first five are the dialect's own vocabulary and their mapping is
 * fixed (GFM's IMPORTANT is an aside, not a hint; its CAUTION is the
 * strongest of the five). The rest are Material's remaining types and
 * their documented aliases, read tolerantly: a source document that
 * carries `> [!EXAMPLE]` gets the right block instead of a blockquote
 * whose first line reads "[!EXAMPLE]". `draft` is the site's own
 * custom type (its colour and icon live in the wiki's extra.css).
 */
const ADMONITION = {
  // GFM's five
  NOTE: "note", TIP: "tip", IMPORTANT: "info",
  WARNING: "warning", CAUTION: "danger",
  // Material's remaining types and aliases
  ABSTRACT: "abstract", SUMMARY: "abstract", TLDR: "abstract",
  INFO: "info", TODO: "info",
  HINT: "tip",
  SUCCESS: "success", CHECK: "success", DONE: "success",
  QUESTION: "question", HELP: "question", FAQ: "question",
  ATTENTION: "warning",
  FAILURE: "failure", FAIL: "failure", MISSING: "failure",
  DANGER: "danger", ERROR: "danger",
  BUG: "bug", EXAMPLE: "example",
  QUOTE: "quote", CITE: "quote",
  // the site's own
  DRAFT: "draft",
};

/** Every class an alert can name, for the consumers that style them. */
export const ADMONITION_TYPES = [...new Set(Object.values(ADMONITION))].sort();

/** Fenced code blocks and inline code spans, as [text, isCode] runs. */
function codeRuns(text) {
  const out = [];
  const re = /^(```|~~~)[^\n]*\n[\s\S]*?(?:^\1[^\n]*$|$(?![\s\S]))/gm;
  let at = 0;
  for (let m; (m = re.exec(text)) !== null; ) {
    if (m.index > at) out.push([text.slice(at, m.index), false]);
    out.push([m[0], true]);
    at = m.index + m[0].length;
  }
  if (at < text.length) out.push([text.slice(at), false]);
  // inline spans inside the prose runs
  const final = [];
  for (const [seg, isCode] of out) {
    if (isCode) { final.push([seg, true]); continue; }
    const sre = /`+[^`\n]*`+/g;
    let sat = 0;
    for (let m; (m = sre.exec(seg)) !== null; ) {
      if (m.index > sat) final.push([seg.slice(sat, m.index), false]);
      final.push([m[0], true]);
      sat = m.index + m[0].length;
    }
    if (sat < seg.length) final.push([seg.slice(sat), false]);
  }
  return final;
}

/**
 * Escape the two constructs python-markdown consumes silently in text
 * that came out of a source document: a `<word>` placeholder (read as
 * an HTML tag) and a brace run at the end of a line (read by attr_list
 * as an attribute list). The dialect's own raw HTML — `<br>` — and
 * autolinks (`<https://…>`) survive, as do link targets `](<…>)`.
 */
export function escapeBodyText(text) {
  return codeRuns(String(text ?? ""))
    .map(([seg, isCode]) => {
      if (isCode) return seg;
      let out = seg.replace(/<(?!br\s*\/?>)(?!(?:[a-z][a-z0-9+.-]+:\/\/|mailto:))/gi, (m, i, s) => {
        // a link/image target `](<…>)` keeps its angle brackets
        return /\]\($/.test(s.slice(0, i)) ? m : "&lt;";
      });
      // attr_list only reads a brace run that ENDS a line — and an
      // attribute list is exactly what we WANT read when the pipeline
      // wrote it (a case heading's `{ #tc-p01 }`, a figure's
      // `{ width=160 }`), so only a brace run that is not one is
      // escaped
      out = out.replace(/(?<!\\)\{([^{}\n]*)\}[ \t]*$/gm, (m, inner) =>
        /^\s*[#.]|=/.test(inner) ? m : `\\{${inner}}`);
      return out;
    })
    .join("");
}

/**
 * One admonition block, composed (Material's reference syntax):
 *
 *   admonition("warning", "Body.", { title: "Careful" })
 *     -> !!! warning "Careful"  + indented body
 *   admonition("note", "…", { collapse: "open" })   -> ???+ note
 *   admonition("info", "…", { title: "", inline: "end" })
 *     -> !!! info inline end ""
 *
 * `title` omitted keeps the type's own title ("Warning"); `title: ""`
 * removes the title bar entirely. `collapse` is "" (a plain block),
 * "collapsed" (`???`, needs pymdownx.details) or "open" (`???+`).
 * `inline` is "" , "start" or "end".
 *
 * This is for text a JOB writes for the MkDocs lane only. Anything
 * that also has to render on GitHub or in the SharePoint preview
 * writes a GFM alert and lets `alertsToAdmonitions` translate it.
 */
export function admonition(type, body = "", opts = {}) {
  const { title, collapse = "", inline = "" } = opts;
  const marker = collapse === "open" ? "???+" : collapse ? "???" : "!!!";
  const cls = (ADMONITION[String(type ?? "").toUpperCase()] || String(type ?? "note"))
    .toLowerCase().replace(/[^a-z0-9_-]/g, "") || "note";
  const mods = inline === "start" || inline === true ? " inline" : inline === "end" ? " inline end" : "";
  const named = title === undefined ? "" : ` "${String(title).replace(/"/g, "'")}"`;
  const lines = String(body ?? "").split("\n").map((l) => (l.trim() === "" ? "" : `    ${l}`));
  return [`${marker} ${cls}${mods}${named}`, "", ...lines, ""].join("\n").replace(/\n{3,}/g, "\n\n");
}

/**
 * One Blocks-syntax block (pymdownx.blocks, v1.4):
 *
 *   block("admonition", "Body.", { title: "Expected result", options: { type: "success" } })
 *     -> /// admonition | Expected result
 *            type: success
 *
 *        Body.
 *        ///
 *
 * `depth` is the number of slashes (3 or more): an outer block takes
 * more slashes than the blocks it nests — `//// html | div.card`
 * around a `/// admonition` — which is the extension's nesting rule.
 * The body is NOT indented (unlike `!!!`), so what nests is visible
 * in the margin, not in the whitespace.
 */
export function block(name, body = "", opts = {}) {
  const { title, options = {}, depth = 3 } = opts;
  const bar = "/".repeat(Math.max(3, depth));
  const head = `${bar} ${name}${title ? ` | ${String(title).replace(/\n/g, " ")}` : ""}`;
  const lines = Object.entries(options).map(([k, v]) => `    ${k}: ${v}`);
  return [head, ...lines, "", String(body ?? "").trim(), bar].join("\n");
}

/**
 * GFM alerts -> admonition blocks. The top-level form the emitters
 * write (`> [!TYPE]` on its own line, then `> ` body lines), plus the
 * two things Material can say and GFM's own marker cannot: text after
 * the marker becomes the block's title, and a `-` / `+` suffix makes
 * it collapsible (`???` / `???+`). A blockquote that is not an alert,
 * and an alert naming a type nothing maps, are left as blockquotes.
 */
export function alertsToAdmonitions(text) {
  const lines = String(text ?? "").split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^>\s*\[!([A-Za-z]+)\]([-+]?)[ \t]*(.*)$/.exec(lines[i]);
    const cls = m && ADMONITION[m[1].toUpperCase()];
    if (!cls) { out.push(lines[i]); continue; }
    const body = [];
    let j = i + 1;
    for (; j < lines.length && /^>/.test(lines[j]); j++) {
      body.push(lines[j].replace(/^>[ \t]?/, ""));
    }
    const named = m[3].trim();
    out.push(admonition(cls, body.join("\n"), {
      // `> [!NOTE] ""` is Material's "no title bar"; bare text is a title
      title: named === '""' ? "" : named || undefined,
      collapse: m[2] === "-" ? "collapsed" : m[2] === "+" ? "open" : "",
    }));
    i = j - 1;
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}

/** A bold-label field bullet: `- **Expected Result:** A lock is held.` */
const FIELD_LINE = /^-[ \t]+\*\*(.+?):\*\*[ \t]*(.*)$/;

/** The fields that render as an admonition rather than a definition
 *  (v1.3): label (case-folded) -> [type, title]. */
export const FIELD_ADMONITIONS = {
  "expected result": ["success", "Expected result"],
};

/** The fields whose LABEL the wiki hides (v1.5): the content stands
 *  alone in a class-named html block. label (case-folded) -> class. */
export const FIELD_BARE = {
  group: "lrs-group",
  steps: "lrs-steps",
  case: "lrs-case-text",
};

/**
 * One definition list, composed. `defList([["Doc", "the row id"], …])`
 * -> `Doc` / `:   the row id`. A multi-line definition keeps its own
 * shape, indented under the marker.
 */
export function defList(pairs) {
  const out = [];
  for (const [term, def] of pairs) {
    // python-markdown reads a run of terms as ONE list only when a
    // blank line separates the groups; without it the second term is
    // swallowed into the first definition
    if (out.length) out.push("");
    out.push(String(term ?? "").trim());
    const lines = String(def ?? "").split("\n").filter((l, i) => i === 0 || l.trim() !== "");
    out.push(`:   ${(lines[0] || "").trim()}`);
    for (const l of lines.slice(1)) out.push(`    ${l.replace(/^[ \t]{1,4}/, "")}`);
  }
  return out.join("\n");
}

/**
 * A run of the case grammar's field bullets -> a definition list. The
 * fields of a test case (Group, Case, Steps, Trace) are definitions,
 * not list items; GFM has no way to say so, MkDocs does, and this is
 * the lane that can tell the difference. A field in
 * `FIELD_ADMONITIONS` — Expected Result — becomes an admonition
 * block instead (v1.3), and a field in `FIELD_BARE` — Group, Steps —
 * a class-named html block with no label (v1.5); either splits the
 * definition list around it.
 *
 * Only a CONTIGUOUS run at the top level converts, and lines indented
 * under a field — the task list under `- **Steps:**` — travel with it
 * into the definition. Anything else, a plain bullet list included, is
 * left exactly as it is.
 */
export function fieldsToDefList(text) {
  const lines = String(text ?? "").split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (!FIELD_LINE.test(lines[i])) { out.push(lines[i]); continue; }
    const fields = [];
    for (; i < lines.length; i++) {
      const m = FIELD_LINE.exec(lines[i]);
      if (m) { fields.push([m[1].trim(), m[2].trim() ? [m[2].trim()] : []]); continue; }
      // an indented line after a field belongs to that field — the
      // task list under `- **Steps:**` travels into the definition
      if (fields.length && /^[ \t]+\S/.test(lines[i])) {
        fields[fields.length - 1][1].push(lines[i].replace(/^[ \t]{1,4}/, ""));
        continue;
      }
      break;
    }
    i--;
    // the run, split around the fields that are admonitions. Each
    // block starts after a blank line: python-markdown reads the line
    // before a `:   definition` as its term (an image line just above
    // the fields became a term) and a `!!!` line glued to a paragraph
    // as more of that paragraph
    const sep = () => { if (out.length && out[out.length - 1].trim() !== "") out.push(""); };
    let pending = [];
    const flush = () => {
      if (pending.length) { sep(); out.push(defList(pending.map(([term, body]) => [term, body.join("\n")])), ""); }
      pending = [];
    };
    for (const [term, body] of fields) {
      const adm = FIELD_ADMONITIONS[term.toLowerCase()];
      const bare = FIELD_BARE[term.toLowerCase()];
      if (!adm && !bare) { pending.push([term, body]); continue; }
      flush();
      sep();
      // Blocks form (v1.4): it sits inside the wiki's case card, an
      // outer block, so its nesting shows in the slash count
      if (adm) out.push(block("admonition", body.join("\n"), { title: adm[1], options: { type: adm[0] } }), "");
      // v1.5: the content alone, the class saying which field it was
      else out.push(block("html", body.join("\n"), { title: `div.${bare}` }), "");
    }
    flush();
  }
  return out.join("\n");
}

/** The MkDocs lane's full translation of a stretch of sidecar text. */
export function toMkDocs(text) {
  return escapeBodyText(alertsToAdmonitions(fieldsToDefList(text)));
}

/** One trailing newline, no trailing whitespace, no blank-line runs. */
export function normalize(text) {
  return String(text ?? "").replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
}

// ---- the machine-comment grammar (Markdown_Layout_Plan §4.4) --------

/**
 * One grammar for the machine data hidden in a markdown file:
 *
 *   <!-- lrs:case det=S4 conf=high src="slide 1 · Positive Tests · 1" -->
 *   <!-- lrs:docs:begin -->  …  <!-- lrs:docs:end -->
 *
 * `kind` names what the mark is about, the attributes are key=value
 * with quotes only where a value has spaces. One writer, one reader,
 * instead of the five ad-hoc comment shapes the emitters grew
 * (`rel:N s=…`, `docs:begin`, `src: …`, `slide N`, the draft banner).
 * The readers accept the older shapes for one backfill window, the
 * way `sidecarmeta.readMeta` still accepts the pre-3.0 yaml.
 */
const attrValue = (v) => {
  const s = String(v ?? "").replace(/\s+/g, " ").replace(/-{2,}/g, "-").replace(/[<>"]/g, "").trim();
  return /[\s=]/.test(s) ? `"${s}"` : s;
};

/** `<!-- lrs:<kind> k=v … -->`; attributes with an empty value are dropped. */
export function mark(kind, attrs = {}) {
  const body = Object.entries(attrs)
    .filter(([, v]) => v !== undefined && v !== null && String(v) !== "")
    .map(([k, v]) => `${k}=${attrValue(v)}`)
    .join(" ");
  return `<!-- lrs:${kind}${body ? " " + body : ""} -->`;
}

/** One mark's attributes, or null when the line carries no `lrs:<kind>`. */
export function readMark(line, kind) {
  const m = new RegExp(`<!--\\s*lrs:${kind}\\b([^>]*?)-->`).exec(String(line ?? ""));
  if (!m) return null;
  const out = {};
  const re = /([A-Za-z_][\w-]*)=(?:"([^"]*)"|(\S+))/g;
  for (let a; (a = re.exec(m[1])) !== null; ) out[a[1]] = a[2] !== undefined ? a[2] : a[3];
  return out;
}

/** Every `lrs:<kind>` mark in a stretch of text, in document order. */
export function marks(text, kind) {
  const out = [];
  for (const ln of String(text ?? "").split("\n")) {
    const m = readMark(ln, kind);
    if (m) out.push(m);
  }
  return out;
}

// ---- explicit heading anchors (Markdown_Layout_Plan §4.3) ----------

/**
 * `### TC-P01 — Title { #tc-p01 }` -> { text: "### TC-P01 — Title",
 * id: "tc-p01" }. The attr_list form GitHub ignores, MkDocs honours
 * and the SharePoint preview shows as text — a case's link target
 * that survives a retitle. A heading without one comes back with
 * `id: ""` and its text untouched.
 */
export function splitAnchor(heading) {
  const s = String(heading ?? "");
  const m = /\{\s*#([A-Za-z][\w.:-]*)\s*\}\s*$/.exec(s);
  return m ? { text: s.slice(0, m.index).replace(/\s+$/, ""), id: m[1] } : { text: s, id: "" };
}
