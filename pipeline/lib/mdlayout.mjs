/**
 * mdlayout.mjs v1.0 — the markdown layout kernel
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
 *   > [!WARNING] …        ->  !!! warning  + indented body
 *   <RouteID>             ->  &lt;RouteID>   (raw text python-markdown
 *                             would otherwise swallow as an HTML tag)
 *   trailing {measure}    ->  \{measure}     (attr_list is enabled)
 *   <br>, <https://…>     ->  left alone (the dialect's two exceptions)
 *
 * Code spans and fenced blocks are never touched: `<` renders itself
 * there, and escaping would show the entity.
 */

/** GFM alert type -> python-markdown admonition class. */
const ADMONITION = {
  NOTE: "note", TIP: "tip", IMPORTANT: "info",
  WARNING: "warning", CAUTION: "danger",
};

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
      // attr_list only reads a brace run that ENDS a line
      out = out.replace(/(?<!\\)\{([^{}\n]*)\}[ \t]*$/gm, "\\{$1}");
      return out;
    })
    .join("");
}

/**
 * GFM alerts -> admonition blocks. Only the top-level form the
 * emitters write (`> [!TYPE]` on its own line, then `> ` body lines);
 * a blockquote that is not an alert is left as a blockquote.
 */
export function alertsToAdmonitions(text) {
  const lines = String(text ?? "").split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^>\s*\[!([A-Za-z]+)\]\s*$/.exec(lines[i]);
    if (!m || !ADMONITION[m[1].toUpperCase()]) { out.push(lines[i]); continue; }
    const body = [];
    let j = i + 1;
    for (; j < lines.length && /^>/.test(lines[j]); j++) {
      body.push(lines[j].replace(/^>[ \t]?/, ""));
    }
    out.push(`!!! ${ADMONITION[m[1].toUpperCase()]}`, "");
    for (const b of body) out.push(b.trim() === "" ? "" : `    ${b}`);
    out.push("");
    i = j - 1;
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}

/** The MkDocs lane's full translation of a stretch of sidecar text. */
export function toMkDocs(text) {
  return escapeBodyText(alertsToAdmonitions(text));
}

/** One trailing newline, no trailing whitespace, no blank-line runs. */
export function normalize(text) {
  return String(text ?? "").replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
}
