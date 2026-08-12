/**
 * SidecarPatch v1.4 — surgical "Related documents" patching for
 * markdown sidecars, batched over every file touched for one doc
 * ------------------------------------------------------------------
 * r2 batch (REVIEW_v2_5_r2.md SB-2, SB-3) — gated by
 * check_batch_r2.py. Gate PASSED (check_batch_r2.py, 2026-08-11).
 * TENANT PASTE STILL PENDING — the live flow runs the previous
 * version until this file is pasted into the Automate workbook
 * (see STATUS.md).
 * v1.4: (SB-2) patchFrontmatter recognizes ANY root `related:` form
 * (inline with extra spaces, bare key, block sequence, null) and
 * replaces the whole node — previously only the exact `related: [`
 * prefix matched, and every other form gained a DUPLICATE related:
 * key. (SB-3) sortAndCap dedupes by doc id (highest-scored occurrence
 * wins) so duplicate ids in rankedJson or a hand-edited related: line
 * can't render duplicate entries.
 * ------------------------------------------------------------------
 * Gate passed and pasted 2026-08-11 (check_batch.py: full
 * check_related suite green + the normalization/escaping cases).
 *
 * v1.3 = v1.2 + out-of-band-edit hardening (REVIEW_v2_5 SC-13).
 * Output on clean input is identical to v1.2:
 *
 *   (a) input is normalized before patching: a leading BOM is
 *       stripped and CRLF line endings become LF. Pre-v1.3, a sidecar
 *       re-saved by an editor with either never matched the frame at
 *       position 0 and every future patch was a silent no-op — the
 *       related section went permanently stale with no Error row.
 *       When a patch succeeds on a normalized file, the normalized
 *       form is what's written back (this patcher is the last
 *       writer); when patching is unsafe (not-frontmatter /
 *       malformed-markers / no-seam) the ORIGINAL bytes are returned
 *       untouched, as before.
 *   (b) rendered bullets escape markdown/HTML metacharacters: "["
 *       "]" "<" ">" in titles/reasons become spaces, "-->" becomes
 *       "-" (a title containing it would visually close the rel tag),
 *       and ">" in URLs is %-encoded so the <...> link target can't
 *       be truncated. Titles/URLs without those characters render
 *       byte-identically to v1.2.
 *   (c) the marker-fallback bullet (an entry whose Doc Index row is
 *       gone from docsMeta) renders as plain unlinked text instead of
 *       a bare-filename link that 404s whenever the neighbor lives in
 *       a different kind subfolder (v2.4+ routing).
 * ------------------------------------------------------------------
 * v1.2: each file object may carry a `folder` (the library folder the
 * sidecar lives in, server-relative — since v2.4 sidecars are routed
 * into per-DocKind subfolders). The value is passed through untouched
 * to the output so the flow's Save_patched writes each patched file
 * back to the folder it was read from. Absent → "" (the flow
 * coalesces to the library root). Nothing about the patching
 * logic changed.
 * ------------------------------------------------------------------
 * One call patches the current doc's own sidecar ("set" mode: the
 * related list is fully recomputed) plus up to topN neighbor sidecars
 * ("merge" mode: upsert one entry — the current doc — into each
 * neighbor's existing list). Mode is inferred per file: doc === selfId
 * → set, else merge. Batching keeps the flow at exactly one Run
 * script call for all reciprocal updates.
 *
 * Two regions of a sidecar are ever rewritten, nothing else:
 *
 *   metadata     the single `related: [...]` line — machine-readable
 *                cache AND merge state, one line of JSON (valid YAML
 *                flow style): [{"doc":17,"file":"...__doc17.md","s":1003}]
 *   body         the first region between the marker lines
 *                <!-- related:begin --> ... <!-- related:end -->
 *                rendered as link bullets, each ending in an
 *                invisible <!-- rel:N --> tag so a later merge can
 *                re-associate, reorder and evict without parsing prose
 *
 * v1.1: the metadata block comes in two frames — the PromptVersion
 * v1.4 fenced form (```yaml ... ```, which SharePoint's markdown
 * preview renders as a code block; `---` frontmatter renders there as
 * a giant setext heading) and the legacy `---` frontmatter form still
 * present until the backfill rewrites a file. Both parse; whichever
 * frame a file carries is preserved on rewrite — format conversion is
 * the version-gated backfill's job, not the patcher's.
 *
 * Safety posture: the body seam `---` and any `related:`-lookalike
 * text in extracted content are never touched (the metadata line is
 * located inside the parsed metadata block only; the body edit is
 * bounded by the first begin/end marker pair). Malformed markers
 * (begin without end, end before begin) → the file is returned
 * unchanged with a note — never risk corrupting extracted text.
 * Markers missing entirely (pre-v2.3 sidecar) → the whole section is
 * synthesized before the header/body seam. Idempotent by
 * construction: patch(patch(x)) === patch(x); `changed` is byte
 * inequality so the flow can skip unchanged writes.
 *
 * Merge-mode evidence is symmetric: shared keywords / issue ids
 * between A and B are identical in both directions, so the ranked
 * entry the current doc holds for a neighbor (from RelatedRank) is
 * exactly the score/reason that neighbor needs for the current doc —
 * no per-neighbor recompute.
 *
 * Power Automate wiring:
 *   Excel Online (Business) "Run script"
 *     Workbook     = any dummy .xlsx (host only)
 *     filesJson    = [{doc, name, folder, content}] — self sidecar
 *                    (composed in memory, byte-identical to what
 *                    Save_sidecar just wrote) + each neighbor
 *                    sidecar read back
 *     selfId       = Doc Index item id of the current doc
 *     rankedJson   = string(outputs('Run_related_rank')?['body/result/related'])
 *     docsMetaJson = string(body('Get_related_docs')?['value'])
 *                    (ID / Title / TextFileUrl used)
 *     selfMetaJson = {"doc":N,"title":"...","url":"...","file":"...__docN.md"}
 *     topN         = Config.RelatedTopN (5)
 *   Returns {files:[{name, folder, content, changed, note}]} — the
 *   flow rewrites only files with changed === true, each into its
 *   own folder.
 */
interface PatchFile {
  doc: number;
  name: string;
  folder: string;
  content: string;
}

interface PatchedFile {
  name: string;
  folder: string;
  content: string;
  changed: boolean;
  note: string;
}

interface PatchResult {
  files: PatchedFile[];
}

interface RelEntry {
  doc: number;
  file: string;
  s: number;
}

interface RankedEntry {
  doc: number;
  s: number;
  why: string;
}

interface DocMeta {
  title: string;
  url: string;
}

const BEGIN = "<!-- related:begin -->";
const END = "<!-- related:end -->";
const HEADING = "## Related documents";
const EMPTY_STATE = "_None yet._";
const FENCE_OPEN = "```yaml\n";
const FENCE_CLOSE = "\n```\n";
const DASH_OPEN = "---\n";
const DASH_CLOSE = "\n---\n";

interface Frame {
  open: string;
  close: string;
  fm: string;
  body: string;
}

/**
 * Split a sidecar into its metadata block and body. Recognizes the
 * fenced frame (```yaml, PromptVersion v1.4+) and the legacy `---`
 * frontmatter frame; returns null when neither opens the file or the
 * frame never closes. The returned open/close let the caller rebuild
 * the file in the same frame it arrived in.
 */
function splitFrame(content: string): Frame | null {
  let open = "";
  let close = "";
  if (content.indexOf(FENCE_OPEN) === 0) {
    open = FENCE_OPEN;
    close = FENCE_CLOSE;
  } else if (content.indexOf(DASH_OPEN) === 0) {
    open = DASH_OPEN;
    close = DASH_CLOSE;
  } else {
    return null;
  }
  const at = content.indexOf(close, open.length - 1);
  if (at < 0) {
    return null;
  }
  return {
    open: open,
    close: close,
    fm: content.slice(open.length, at),
    body: content.slice(at + close.length),
  };
}

function parseJson(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function urlString(raw: unknown): string {
  if (typeof raw === "string") {
    return raw;
  }
  if (raw && typeof raw === "object") {
    const o = raw as { Url?: unknown; Uri?: unknown };
    if (typeof o.Url === "string") return o.Url;
    if (typeof o.Uri === "string") return o.Uri;
  }
  return "";
}

// v1.3 (SC-13b): strip characters that malform the bullet markdown —
// "]" breaks the link text, "-->" visually closes the rel tag, ">"
// truncates the <...> url target. Clean inputs pass through unchanged.
function cleanText(s: string): string {
  return s
    .replace(/-->/g, "-")
    .replace(/<!--/g, "")
    .replace(/[\[\]<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanUrl(u: string): string {
  return u.replace(/>/g, "%3E");
}

function renderBullet(title: string, url: string, why: string, doc: number): string {
  const t = cleanText(title);
  const w = cleanText(why);
  const reason = w ? " — " + w : "";
  return "- [" + (t || "untitled") + "](<" + cleanUrl(url) + ">)" + reason + " <!-- rel:" + doc + " -->";
}

function renderFmLine(entries: RelEntry[]): string {
  const slim = entries.map((e) => ({ doc: e.doc, file: e.file, s: e.s }));
  return "related: " + JSON.stringify(slim);
}

function renderRegionInner(entries: RelEntry[], bullets: { [doc: number]: string }): string {
  if (entries.length === 0) {
    return EMPTY_STATE;
  }
  // v1.3 (SC-13c): the fallback (no bullet and no meta for the entry)
  // renders unlinked — a bare-filename link only resolves when the
  // neighbor happens to share this sidecar's kind subfolder.
  return entries
    .map((e) => bullets[e.doc] || "- " + cleanText(e.file) + " <!-- rel:" + e.doc + " -->")
    .join("\n");
}

function sortAndCap(entries: RelEntry[], cap: number): RelEntry[] {
  entries.sort((x, y) => (y.s - x.s) || (y.doc - x.doc));
  // v1.4 (SB-3): dedupe by doc id — after the sort, the first
  // occurrence is the highest-scored one, so it wins
  const seen: { [d: number]: boolean } = {};
  const out: RelEntry[] = [];
  for (const e of entries) {
    if (!seen[e.doc]) {
      seen[e.doc] = true;
      out.push(e);
    }
  }
  return out.slice(0, cap);
}

/** Replace/insert the `related:` line inside the frontmatter text. */
function patchFrontmatter(fm: string, fmLine: string): string {
  const lines = fm.split("\n");
  let relIdx = -1;
  let relEnd = -1;
  let toolsIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    // v1.4 (SB-2): any root `related:` key is the node to replace —
    // `related: [...]` (any spacing), bare `related:`, `related: null`,
    // or block-sequence form. Only the exact `related: [` prefix
    // matched before, so every other form gained a duplicate key.
    if (/^related:(\s|$)/.test(lines[i])) {
      if (relIdx < 0) {
        relIdx = i;
        relEnd = i + 1;
        // a block-sequence/multiline value continues on indented lines
        while (relEnd < lines.length && /^\s+\S/.test(lines[relEnd])) {
          relEnd++;
        }
      }
    } else if (lines[i].indexOf("tools: [") === 0) {
      toolsIdx = i;
    }
  }
  if (relIdx >= 0) {
    lines.splice(relIdx, relEnd - relIdx, fmLine);
  } else if (toolsIdx >= 0) {
    lines.splice(toolsIdx + 1, 0, fmLine);
  } else {
    lines.push(fmLine);
  }
  return lines.join("\n");
}

/** Read existing entries from the frontmatter's `related:` line. */
function readFmEntries(fm: string): RelEntry[] {
  for (const line of fm.split("\n")) {
    // v1.4 (SB-2): tolerate extra spacing before the bracket; non-inline
    // forms (block sequence, null) read as empty and get rewritten
    // inline by patchFrontmatter
    const m = line.match(/^related:\s*(\[[\s\S]*)$/);
    if (m) {
      const out: RelEntry[] = [];
      for (const raw of asArray(parseJson(m[1]))) {
        const o = raw as { doc?: unknown; file?: unknown; s?: unknown };
        const doc = typeof o.doc === "number" ? o.doc : parseInt(String(o.doc), 10);
        if (doc > 0) {
          out.push({
            doc: doc,
            file: typeof o.file === "string" ? o.file : "",
            s: typeof o.s === "number" ? o.s : 0,
          });
        }
      }
      return out;
    }
  }
  return [];
}

/** Read existing tagged bullets from a marker-region's inner text. */
function readBullets(inner: string): { [doc: number]: string } {
  const out: { [doc: number]: string } = {};
  for (const line of inner.split("\n")) {
    const at = line.indexOf("<!-- rel:");
    if (line.indexOf("- ") === 0 && at > 0) {
      const doc = parseInt(line.slice(at + 9), 10);
      if (doc > 0) {
        out[doc] = line;
      }
    }
  }
  return out;
}

/**
 * Patch one sidecar. Returns the new content plus a note, or the
 * original content with a diagnostic note when patching is unsafe.
 */
function patchOne(
  content: string,
  entries: RelEntry[],
  bullets: { [doc: number]: string },
  noteOk: string
): { content: string; note: string } {
  const frame = splitFrame(content);
  if (!frame) {
    return { content: content, note: "not-frontmatter" };
  }
  const fm = frame.fm;
  let body = frame.body;

  const region = BEGIN + "\n" + renderRegionInner(entries, bullets) + "\n" + END;

  const b = body.indexOf(BEGIN);
  const e = body.indexOf(END);
  if (b >= 0 && e > b) {
    body = body.slice(0, b) + region + body.slice(e + END.length);
  } else if (b >= 0 || e >= 0) {
    return { content: content, note: "malformed-markers" };
  } else {
    // pre-v2.3 sidecar: synthesize the whole section before the
    // header/body seam (the first '---' line after ## Summary)
    const sumAt = body.indexOf("## Summary");
    const seam = body.indexOf("\n---\n", sumAt >= 0 ? sumAt : 0);
    if (seam < 0) {
      return { content: content, note: "no-seam" };
    }
    body = body.slice(0, seam) + "\n\n" + HEADING + "\n\n" + region + body.slice(seam);
  }

  const newFm = patchFrontmatter(fm, renderFmLine(entries));
  return { content: frame.open + newFm + frame.close + body, note: noteOk };
}

function main(
  workbook: ExcelScript.Workbook,
  filesJson: string,
  selfId: string,
  rankedJson: string,
  docsMetaJson: string,
  selfMetaJson: string,
  topN: number
): PatchResult {
  const self = parseInt(selfId, 10) || 0;
  const cap = topN > 0 ? topN : 5;

  const ranked: RankedEntry[] = [];
  for (const raw of asArray(parseJson(rankedJson))) {
    const o = raw as { doc?: unknown; s?: unknown; why?: unknown };
    const doc = typeof o.doc === "number" ? o.doc : parseInt(String(o.doc), 10);
    if (doc > 0) {
      ranked.push({
        doc: doc,
        s: typeof o.s === "number" ? o.s : 0,
        why: typeof o.why === "string" ? o.why : "",
      });
    }
  }

  const metaById: { [doc: number]: DocMeta } = {};
  for (const raw of asArray(parseJson(docsMetaJson))) {
    const o = raw as { ID?: unknown; Id?: unknown; Title?: unknown; TextFileUrl?: unknown };
    const idRaw = o.ID !== undefined ? o.ID : o.Id;
    const id = typeof idRaw === "number" ? idRaw : parseInt(String(idRaw), 10);
    if (id > 0) {
      metaById[id] = {
        title: typeof o.Title === "string" ? o.Title : "",
        url: urlString(o.TextFileUrl),
      };
    }
  }

  const sm = (parseJson(selfMetaJson) || {}) as {
    doc?: unknown; title?: unknown; url?: unknown; file?: unknown;
  };
  const selfMeta = {
    doc: typeof sm.doc === "number" ? sm.doc : self,
    title: typeof sm.title === "string" ? sm.title : "",
    url: typeof sm.url === "string" ? sm.url : "",
    file: typeof sm.file === "string" ? sm.file : "",
  };

  const files: PatchedFile[] = [];
  for (const raw of asArray(parseJson(filesJson))) {
    const f = raw as { doc?: unknown; name?: unknown; folder?: unknown; content?: unknown };
    const original = typeof f.content === "string" ? f.content : "";
    // v1.3 (SC-13a): normalize out-of-band-edit artifacts (BOM, CRLF)
    // so the frame match at position 0 still works; if patching turns
    // out to be unsafe, the ORIGINAL bytes are returned below.
    let normalized = original;
    if (normalized.charCodeAt(0) === 0xfeff) {
      normalized = normalized.slice(1);
    }
    normalized = normalized.replace(/\r\n/g, "\n");
    const file: PatchFile = {
      doc: typeof f.doc === "number" ? f.doc : parseInt(String(f.doc), 10) || 0,
      name: typeof f.name === "string" ? f.name : "",
      folder: typeof f.folder === "string" ? f.folder : "",
      content: normalized,
    };

    let patched: { content: string; note: string };
    if (file.doc === self) {
      // ---- set mode: full recompute of the doc's own list --------
      const entries: RelEntry[] = [];
      const bullets: { [doc: number]: string } = {};
      for (const r of ranked) {
        const meta = metaById[r.doc];
        if (!meta || !meta.url) {
          continue; // Doc Index row gone or sidecar never written
        }
        const parts = meta.url.split("/");
        entries.push({ doc: r.doc, file: parts[parts.length - 1], s: r.s });
        bullets[r.doc] = renderBullet(meta.title || parts[parts.length - 1], meta.url, r.why, r.doc);
      }
      patched = patchOne(file.content, sortAndCap(entries, cap), bullets, "set");
    } else {
      // ---- merge mode: upsert the current doc into a neighbor ----
      let pairEvidence: RankedEntry | null = null;
      for (const r of ranked) {
        if (r.doc === file.doc) {
          pairEvidence = r;
        }
      }
      if (!pairEvidence || !selfMeta.url || !selfMeta.file) {
        patched = { content: file.content, note: "no-pair-evidence" };
      } else {
        const frame = splitFrame(file.content);
        const fm = frame ? frame.fm : "";
        const body = frame ? frame.body : "";
        const b = body.indexOf(BEGIN);
        const e = body.indexOf(END);
        const inner = b >= 0 && e > b ? body.slice(b + BEGIN.length, e) : "";

        const entries = readFmEntries(fm).filter((x) => x.doc !== selfMeta.doc);
        const bullets = readBullets(inner);
        entries.push({ doc: selfMeta.doc, file: selfMeta.file, s: pairEvidence.s });
        bullets[selfMeta.doc] = renderBullet(
          selfMeta.title || selfMeta.file, selfMeta.url, pairEvidence.why, selfMeta.doc
        );
        patched = patchOne(file.content, sortAndCap(entries, cap), bullets, "merged");
      }
    }

    // v1.3 (SC-13a): unsafe-to-patch files keep their original bytes —
    // normalization is only written back alongside a successful patch
    if (patched.note === "not-frontmatter" || patched.note === "malformed-markers" ||
        patched.note === "no-seam" || patched.note === "no-pair-evidence") {
      patched = { content: original, note: patched.note };
    }
    files.push({
      name: file.name,
      folder: file.folder,
      content: patched.content,
      changed: patched.content !== original,
      note: patched.note,
    });
  }

  return { files: files };
}
