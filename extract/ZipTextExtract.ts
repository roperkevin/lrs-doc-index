/**
 * ZipTextExtract v2.6 — OOXML file (pptx/docx) → markdown text + rels
 * ------------------------------------------------------------
 * v2.6 (2026-09-05, TP-2 — a diagram label is never a slide title):
 *   the v2.5 top-label rule (TP-1) took a title-less slide's topmost
 *   short text shape as its heading; on a test-plan slide whose
 *   drawing sits at the top, that shape is a ROUTE LABEL ("1A_New;
 *   100"), so 80 slides of one deck were headed by a label while the
 *   slide's real case line stayed in the body. A shape whose text is
 *   label-shaped (the DL-1 rule: ≤ 24 chars, ≤ 3 words) is no longer
 *   a title candidate when the slide carries a label cluster (≥ 4 such
 *   shapes — the same threshold that folds them into the
 *   `[figure: …]` line). Long labels and prose shapes are unaffected.
 * ------------------------------------------------------------
 *                       + document core properties
 * --------------------------------------------------------------------
 * v2.5 delta (2026-09-05 — Sidecar_Format_Plan phase 2, "structure
 * the extractor used to throw away"; the local sweep runs this file
 * directly, no tenant paste):
 *   CP-1  table cells keep their PARAGRAPHS. A single-column table
 *         whose cells hold several paragraphs (the decks' "Positive
 *         Tests: <group>" boxes) renders as a bold label + one bullet
 *         per paragraph; multi-column cells join paragraphs on <br>.
 *         The old blanket strip joined them with a space — 62 of 178
 *         test-plan sidecars carried run-on cells no parser could
 *         split.
 *   IB-1  inherited bullets: body-placeholder paragraphs take the
 *         deck's default bullet (slide → layout → master bodyStyle
 *         lvl1pPr), rendered as "- " items; an explicit buNone stays
 *         plain. Slide XML never spells the inherited bullet out, so
 *         the most common bullet in real decks used to render as
 *         loose lines.
 *   TP-1  a slide with no title placeholder takes its TOPMOST short
 *         text shape (2–12 words, ≤ 80 chars, top fifth of the slide,
 *         not grouped) as the "## Slide N — …" heading — section
 *         labels drawn above a table but after it in z-order used to
 *         land below the table.
 *   DL-2  docx: bold label paragraphs (≤ 60 chars) and ":"-labels
 *         followed by a list become "### " headings; list items are
 *         recognised through paragraph STYLES (List Bullet / List
 *         Number) as well as direct numPr, and ordered lists render
 *         as "1. " items (word/numbering.xml numFmt).
 *   Prose/table-only decks without these shapes are byte-identical
 *   to v2.2 — every pre-existing fixture passes unchanged.
 * --------------------------------------------------------------------
 * v2.2 delta (2026-09-03 — the local sweep is the deployed sweep and
 * runs this file directly; on tenant-flow rollback paste v2.2 in place
 * of the pending v2.1, same signature):
 *   DL-1  diagram-label collapse: slides in this corpus carry route
 *         diagrams DRAWN as shapes — dashed/hatched connector lines
 *         plus dozens of tiny floating text boxes holding tick numbers
 *         ("10".."22") and route/event ids ("R1", "E1", "Output").
 *         Those labels used to flatten into long runs of one-token
 *         lines interleaved with the slide's real content. Now, per
 *         slide, floating (non-placeholder) p:sp/p:cxnSp shapes whose
 *         whole text is label-shaped (<= 24 chars, <= 3 words) are —
 *         when at least 4 cluster on one slide, i.e. an actual drawn
 *         diagram — spliced out of the body and collapsed into one
 *         "[figure: 10–22 · R1 · E1 · Output]" line at the end of the
 *         slide (before the image links), mirroring the docx
 *         [figure: ...] grouping that has existed since v1.2.
 *         Ascending integer runs compress to "a–b" (tick marks),
 *         repeats dedupe in first-appearance order, and the item list
 *         caps at 24 + "…". Placeholder shapes (title/body/sldNum),
 *         graphicFrame tables, notes parts and every docx path are
 *         untouched; a slide with fewer than 4 label shapes keeps them
 *         inline (a lone short callout is content, not a diagram).
 *         Prose/table-only decks are byte-identical to v2.1 — proven
 *         on every pre-existing fixture (harness run record
 *         2026-09-03).
 * --------------------------------------------------------------------
 * v2.1 provenance: r6 batch (flow v2.8 sidecar format) — gated by
 * check_batch_r6.py. Tenant paste was pending when the sweep moved
 * off Power Automate (2026-08-14).
 * v2.1 delta:
 *   CF-1  content-aware code fencing: runs of code-shaped lines in the
 *         extracted text (Arcade/JS pasted into slides and docs —
 *         comment lines, keyword starts, brace/semicolon endings,
 *         $feature/$map globals, assignments) are wrapped in fenced
 *         code blocks (```arcade when Arcade globals appear, bare
 *         fences otherwise), and code-shaped list items render as
 *         inline code. Generated structure (headings, tables, image
 *         links, list markers, figure lines) is never absorbed into a
 *         fence; a sentence-shaped line never starts one. The SB-6 /
 *         SC-10 heading escapes are reverted INSIDE a fence (the fence
 *         already neutralizes markdown, and a literal \# would render).
 *         Prose-only documents are byte-identical to v2.0 — the r6
 *         equivalence leg proves it on every existing fixture.
 * --------------------------------------------------------------------
 * v2.0 provenance: r2 batch (REVIEW_v2_5_r2.md SB-5..SB-8) — gated by
 * check_batch_r2.py, gate PASSED 2026-08-11. v2.0 deltas, all
 * output-identical on well-formed inputs:
 *   SB-5  stored-block NLEN (ones-complement of LEN) is now verified —
 *         a corrupted length field previously emitted garbled text as
 *         a "successful" extraction
 *   SB-6  the SC-10 heading escape now covers ## through ######, not
 *         just a single # — pasted markdown can no longer forge
 *         slide/notes-level section structure
 *   SB-7  table rendering past the 200-table guard emits an explicit
 *         truncation marker instead of silently flattening; the table
 *         width max is a loop (Math.max.apply threw RangeError at
 *         argument-limit row counts)
 *   SB-8  KEEP-IN-SYNC banners over the zip-reader block and the
 *         media caps shared with MediaExtract (v1.3 verifies the
 *         central directory's size claims, making the SC-4 mirror
 *         here exact)
 * --------------------------------------------------------------------
 * v1.9 provenance: gate passed and pasted 2026-08-11 (check_batch.py:
 * full v1.8 regression suites green over the batch + every
 * new-behavior fixture; ES2017 type-check clean). Sidecar-format
 * changes rode the Config.PromptVersion v1.8 backfill.
 *
 * v1.9 = v1.8 + the REVIEW_v2_5 script batch (SC-2..SC-10, SC-14, FL-5):
 *
 *   SC-2  slides are ordered and numbered by ppt/presentation.xml's
 *         sldIdLst (true presentation order), not by part filename —
 *         reordered decks index in display order; pruned decks number
 *         1..N. Falls back to the old numeric part sort when
 *         presentation.xml or its rels are missing/unresolvable, and
 *         never drops a slide part that isn't in the list.
 *   SC-3  pptx merged table cells: <a:tc hMerge="1"> continuation
 *         cells are skipped (DrawingML keeps them in the markup;
 *         rendering them plus gridSpan padding column-shifted every
 *         other row). docx (w:tbl) is untouched — WordprocessingML
 *         omits covered cells, so padding alone is correct there.
 *   SC-4  image links are minted only for images MediaExtract will
 *         actually save: the same 12 / 350 KB / 3 MB caps are applied
 *         here (central-directory uncompSize, same selection order),
 *         so sidecars never carry dead image links. The `media` output
 *         filters the same way — a deck whose referenced images are
 *         all over-cap now returns empty media and the flow skips the
 *         MediaExtract call entirely.
 *   SC-5  numeric character entities above the BMP decode via
 *         fromCodePoint (astral emoji no longer truncate to garbage).
 *   SC-6  .rels parsing no longer assumes Id precedes Target in
 *         attribute order (third-party OOXML writers).
 *   SC-7  the 10+ digit geometry strip runs line-wise and skips lines
 *         carrying a markdown link ("](") so generated image links and
 *         unwrapped HYPERLINK urls are never corrupted.
 *   SC-10 a content line that would render as an H1 (leading "# ") is
 *         escaped to "\#" — the sidecar's H1 stays unique to the
 *         flow-composed header even when documents contain pasted
 *         markdown.
 *   SC-14 encrypted zip entries (GP bit 0) throw with a clear message
 *         instead of inflating ciphertext; truncated stored blocks
 *         throw instead of zero-padding silently (SC-8, also fixed in
 *         MediaExtract v1.2).
 *   FL-5  dcterms:modified is returned only when it parses as a date —
 *         a malformed value degrades to "" (library fallback) instead
 *         of poisoning the flow's formatDateTime call every run.
 *
 *   Known limitation (SC-9, documented not changed): docx heading
 *   detection matches the English style ids Heading1..6/Title only;
 *   non-English Word documents lose heading structure (paragraphs
 *   render flat). Fine for this corpus.
 *
 * v1.8 = v1.7 + core-properties extraction (additive; nothing about
 * the text/rels/media pipeline changed):
 *
 *   docProps/core.xml is inflated alongside the content parts and its
 *   dc:creator, cp:lastModifiedBy and dcterms:modified values are
 *   returned as `author`, `lastEditedBy` and `lastEdited` — the
 *   document's OWN authorship trail, which survives file copies and
 *   re-uploads that reset SharePoint's Created By/Modified By columns.
 *   Entities are decoded (names like "O&#8217;Brien" come out right);
 *   a missing or unreadable core.xml degrades to empty strings, never
 *   an error — the flow falls back to library metadata.
 *
 * v1.7 = v1.6 plumbing (typed arrays, harness-verified byte-identical
 * to v1.5) + the sidecar formatting upgrade:
 *
 *   pptx: slide title placeholders are promoted into the section
 *         heading — "## Slide 3 — Locking new routes" — and removed
 *         from the body so they don't render twice. Speaker notes are
 *         interleaved under their slide as "### Notes", resolved
 *         through each slide's .rels (notesSlideM numbering is NOT
 *         assumed to match slide numbering); unmatched notes parts
 *         (malformed decks) are appended at the end, never dropped.
 *         Paragraphs with an explicit outline level (a:pPr lvl>=1) or
 *         explicit bullet props (a:buChar/a:buAutoNum) render as
 *         nested "- " markdown list items. Known limitation: lvl-0
 *         bullets inherited from the layout/master are invisible in
 *         slide XML at string level, so those stay plain lines —
 *         nesting, where structure matters, is always preserved.
 *   docx: Heading1..6 / Title paragraph styles map to markdown
 *         headings, shifted one level down (Heading1 → "##") so the
 *         sidecar's H1 stays unique to the flow-composed header.
 *         Numbered/bulleted paragraphs (w:numPr) render as nested
 *         "- " list items indented by w:ilvl.
 *   both: tables render as GFM pipe tables (since v1.3; the fenced-TSV
 *         wording in older headers was stale). Everything else in the
 *         validated strip recipe — figure grouping, entity decode,
 *         HYPERLINK unwrap, geometry digit-strip, whitespace collapse
 *         — is unchanged.
 *
 * Output contract (consumed as the body of the .md sidecar, appended
 * after the flow's frontmatter + H1 + summary header): nothing above
 * H2 is ever emitted here.
 * --------------------------------------------------------------------
 * Takes the document's raw bytes as base64 (Get file content $content),
 * parses the zip structure itself, inflates ONLY the parts that matter,
 * applies the strip recipe, and returns:
 *
 *   { text, rels, parts, kind, media, author, lastEditedBy, lastEdited }
 *
 * pptx: ppt/slides/slideN.xml (numeric order) + ppt/slides/_rels/*.rels
 * docx: word/document.xml + word/_rels/document.xml.rels
 * both: docProps/core.xml (authorship; optional)
 * Format auto-detected from entry names.
 *
 * Power Automate wiring: unchanged from v1.5/v1.6/v1.7 (same name and
 * signature; the return shape only GAINS fields, so existing bindings
 * are untouched). Throws on malformed archives so failed parses
 * surface as run errors (Catch scope -> IndexStatus=Error ->
 * retry-aware gate), never as silently empty text.
 */
interface ZipTextResult {
  text: string;
  rels: string;
  parts: number;
  kind: string; // "pptx" | "docx" | "unknown"
  media: string; // newline list of raster media entry basenames
  author: string; // docProps/core.xml dc:creator ("" if absent)
  lastEditedBy: string; // docProps/core.xml cp:lastModifiedBy ("" if absent)
  lastEdited: string; // docProps/core.xml dcterms:modified, W3CDTF ("" if absent)
}

function main(workbook: ExcelScript.Workbook, zipBase64: string, mediaPrefix?: string): ZipTextResult {
  const bytes = b64ToBytes(zipBase64);
  const entries = readCentralDirectory(bytes);

  const isPptx = entries.some((e) => e.name.indexOf("ppt/") === 0);
  const isDocx = entries.some((e) => e.name === "word/document.xml");
  const kind = isPptx ? "pptx" : isDocx ? "docx" : "unknown";

  let contentNames: ZipEntry[] = [];
  let relsNames: ZipEntry[] = [];
  // v1.9 (SC-2): slide display order/numbers come from presentation.xml
  const slideDisplay: { [name: string]: number } = {};
  if (isPptx) {
    const slideParts = entries.filter((e) => /^ppt\/slides\/slide\d+\.xml$/.test(e.name));
    const slides = orderSlides(bytes, entries, slideParts);
    for (let i = 0; i < slides.length; i++) slideDisplay[slides[i].name] = i + 1;
    const notes = entries
      .filter((e) => /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(e.name))
      .sort((a, b) => slideNum(a.name) - slideNum(b.name));
    contentNames = slides.concat(notes);
    relsNames = entries.filter((e) => /^ppt\/slides\/_rels\/[^/]+\.rels$/.test(e.name));
  } else if (isDocx) {
    contentNames = entries.filter((e) => e.name === "word/document.xml");
    relsNames = entries.filter((e) => e.name === "word/_rels/document.xml.rels");
  } else {
    throw new Error("ZipTextExtract: archive is neither pptx nor docx");
  }

  const prefix = mediaPrefix || "";
  const relParts: string[] = [];
  const relText: { [slide: string]: string } = {};
  for (const e of relsNames) {
    const t = utf8ToString(extractEntry(bytes, e));
    relParts.push(t);
    relText[e.name] = t;
  }

  // v1.9 (SC-4): only link images MediaExtract will actually save
  const savedSet = mediaSaveSet(entries);
  const mediaSet: { [n: string]: boolean } = {};
  function slideImages(slideName: string, xml: string): string {
    // find r:embed ids in the slide, resolve via its rels to ../media targets
    const relName = isPptx
      ? slideName.replace(/^ppt\/slides\//, "ppt/slides/_rels/") + ".rels"
      : "word/_rels/document.xml.rels";
    const rels = relText[relName] || "";
    // v1.9 (SC-6): attribute-order-independent rels parsing
    const idToMedia: { [id: string]: string } = {};
    const tagRe = /<Relationship\b[^>]*>/g;
    let m: RegExpExecArray | null;
    while ((m = tagRe.exec(rels)) !== null) {
      const idm = m[0].match(/\bId="([^"]+)"/);
      const tgm = m[0].match(/\bTarget="[^"]*media\/([^"]+)"/);
      if (idm && tgm) idToMedia[idm[1]] = tgm[1];
    }
    const links: string[] = [];
    const bre = /r:embed="([^"]+)"/g;
    while ((m = bre.exec(xml)) !== null) {
      const f = idToMedia[m[1]];
      if (f && /\.(png|jpe?g|gif|bmp)$/i.test(f) && savedSet[f] &&
          !links.some((l) => l.indexOf("(" + prefix + f + ")") >= 0)) {
        links.push("![" + f + "](" + prefix + f + ")");
        mediaSet[f] = true;
      }
    }
    return links.length > 0 ? "\n" + links.join(" ") + "\n" : "";
  }

  const xmlParts: string[] = [];
  if (isPptx) {
    const slides = contentNames.filter((e) => e.name.indexOf("ppt/slides/") === 0);
    const notes = contentNames.filter((e) => e.name.indexOf("ppt/notesSlides/") === 0);
    const noteByName: { [n: string]: ZipEntry } = {};
    for (const ne of notes) noteByName[ne.name] = ne;
    const consumed: { [n: string]: boolean } = {};
    // v2.5 (IB-1): the deck's default body bullet — PowerPoint draws a
    // bullet on every body-placeholder paragraph unless the slide,
    // layout or master says buNone, but the slide XML never spells the
    // inherited one out. Resolve slide → layout → master once per part.
    const partCache: { [n: string]: string } = {};
    const partText = (name: string): string => {
      if (partCache[name] === undefined) {
        const ent = entries.filter((x) => x.name === name)[0];
        partCache[name] = ent ? utf8ToString(extractEntry(bytes, ent)) : "";
      }
      return partCache[name];
    };
    const relTarget = (relsXml: string, kind: string): string => {
      const re = /<Relationship\b[^>]*>/g;
      let rm: RegExpExecArray | null;
      while ((rm = re.exec(relsXml)) !== null) {
        const tg = rm[0].match(/\bTarget="([^"]*)"/);
        if (tg && tg[1].indexOf(kind) >= 0) return tg[1].replace(/^(\.\.\/)+/, "ppt/");
      }
      return "";
    };
    const bulletDefaultOf = (slideName: string): boolean => {
      const sRels = relText[slideName.replace(/^ppt\/slides\//, "ppt/slides/_rels/") + ".rels"] || "";
      const layout = relTarget(sRels, "slideLayouts/");
      if (!layout) return false;
      const lRels = partText(layout.replace(/^ppt\/slideLayouts\//, "ppt/slideLayouts/_rels/") + ".rels");
      const master = relTarget(lRels, "slideMasters/");
      let def = false;
      if (master) {
        const bs = (partText(master).match(/<p:bodyStyle>[\s\S]*?<\/p:bodyStyle>/) || [""])[0];
        const l1 = (bs.match(/<a:lvl1pPr\b[^>]*\/>|<a:lvl1pPr\b[\s\S]*?<\/a:lvl1pPr>/) || [""])[0];
        def = /<a:bu(?:Char|AutoNum|Blip)\b/.test(l1) && !/<a:buNone\b/.test(l1);
      }
      // a layout body placeholder may override the master
      const lx = partText(layout);
      const spRe = /<p:sp\b[\s\S]*?<\/p:sp>/g;
      let sm: RegExpExecArray | null;
      while ((sm = spRe.exec(lx)) !== null) {
        const ph = sm[0].match(/<p:ph\b([^>]*)>/);
        if (!ph || /type="(?!body|obj)/.test(ph[1])) continue;
        const l1 = (sm[0].match(/<a:lvl1pPr\b[^>]*\/>|<a:lvl1pPr\b[\s\S]*?<\/a:lvl1pPr>/) || [""])[0];
        if (/<a:buNone\b/.test(l1)) def = false;
        else if (/<a:bu(?:Char|AutoNum|Blip)\b/.test(l1)) def = true;
      }
      return def;
    };
    const sldSz = (partText("ppt/presentation.xml").match(/<p:sldSz\b[^>]*\bcy="(\d+)"/) || ["", "6858000"])[1];
    const slideCy = parseInt(sldSz, 10) || 6858000;
    for (const e of slides) {
      let xml = utf8ToString(extractEntry(bytes, e));
      const imgs = prefix ? slideImages(e.name, xml) : "";
      let hit = findTitleShape(xml);
      // v2.5 (TP-1): a slide without a title placeholder takes its
      // TOPMOST short text shape as the heading — the decks' hand-drawn
      // section labels ("Coordinate Configuration Tests") sit above
      // their table visually but after it in z-order, so they used to
      // land as a stray paragraph below the table
      if (!hit) hit = findTopLabel(xml, slideCy);
      const title = hit ? hit.text : "";
      // v1.9 (SC-2): display number = position in presentation order
      // v2.0 (SB-6): \u0001 = generated-heading sentinel (see stripOoxml)
      const heading = "\n\u0001## Slide " + (slideDisplay[e.name] || slideNum(e.name)) + (title ? " — " + title : "") + "\n";
      let body = hit && title ? xml.slice(0, hit.start) + xml.slice(hit.end) : xml;
      if (bulletDefaultOf(e.name)) body = markInheritedBullets(body);
      // v2.2 (DL-1): collapse a drawn diagram's floating label shapes
      // into one [figure: ...] line (notes parts are prose — untouched)
      const fig = collapseFigureLabels(body);
      xmlParts.push(heading + fig.xml + fig.figure + imgs);
      // resolve this slide's notes part through its own rels — the
      // notesSlideM index is not guaranteed to equal the slide number
      const rels = relText[e.name.replace(/^ppt\/slides\//, "ppt/slides/_rels/") + ".rels"] || "";
      const tagRe = /<Relationship\b[^>]*>/g;
      let tm: RegExpExecArray | null;
      while ((tm = tagRe.exec(rels)) !== null) {
        if (tm[0].indexOf("notesSlide") < 0) continue;
        const tgt = tm[0].match(/Target="[^"]*notesSlides\/(notesSlide\d+\.xml)"/);
        if (!tgt) continue;
        const noteName = "ppt/notesSlides/" + tgt[1];
        const ne = noteByName[noteName];
        if (ne && !consumed[noteName]) {
          consumed[noteName] = true;
          xmlParts.push("\n\u0001### Notes\n" + utf8ToString(extractEntry(bytes, ne)));
        }
        break;
      }
    }
    for (const ne of notes) {
      if (!consumed[ne.name]) {
        xmlParts.push("\n\u0001## Notes (unmatched " + slideNum(ne.name) + ")\n" + utf8ToString(extractEntry(bytes, ne)));
      }
    }
  } else {
    for (const e of contentNames) {
      const xml = utf8ToString(extractEntry(bytes, e));
      const imgs = prefix ? slideImages(e.name, xml) : "";
      xmlParts.push(xml + imgs);
    }
  }

  const mediaNames: string[] = [];
  for (const k in mediaSet) mediaNames.push(k);
  const core = readCoreProps(bytes, entries);
  // v2.5 (DL-2): word/numbering.xml — numId → ilvl → numFmt, so
  // ordered lists render as "1. " items instead of bullets
  let numFmt: { [numId: string]: { [ilvl: string]: string } } | undefined;
  const styleNum: { [styleId: string]: { numId: string; ilvl: string } } = {};
  if (isDocx) {
    // list STYLES (word/styles.xml): a style whose pPr carries numPr
    // makes every paragraph of that style a list item
    const stEnt = entries.filter((x) => x.name === "word/styles.xml")[0];
    if (stEnt) {
      const sx = utf8ToString(extractEntry(bytes, stEnt));
      const sRe = /<w:style\b[^>]*w:styleId="([^"]+)"[\s\S]*?<\/w:style>/g;
      let smx: RegExpExecArray | null;
      while ((smx = sRe.exec(sx)) !== null) {
        const np = smx[0].match(/<w:numPr>[\s\S]*?<\/w:numPr>/);
        if (!np) continue;
        const ni = np[0].match(/<w:numId [^>]*w:val="(\d+)"/);
        const il = np[0].match(/<w:ilvl [^>]*w:val="(\d+)"/);
        if (ni) styleNum[smx[1]] = { numId: ni[1], ilvl: il ? il[1] : "0" };
      }
    }
    const numEnt = entries.filter((x) => x.name === "word/numbering.xml")[0];
    if (numEnt) {
      const nx = utf8ToString(extractEntry(bytes, numEnt));
      const abs: { [id: string]: { [ilvl: string]: string } } = {};
      const aRe = /<w:abstractNum\b[^>]*w:abstractNumId="(\d+)"[\s\S]*?<\/w:abstractNum>/g;
      let am: RegExpExecArray | null;
      while ((am = aRe.exec(nx)) !== null) {
        const lv: { [ilvl: string]: string } = {};
        const lRe = /<w:lvl\b[^>]*w:ilvl="(\d+)"[\s\S]*?<\/w:lvl>/g;
        let lm: RegExpExecArray | null;
        while ((lm = lRe.exec(am[0])) !== null) {
          const f = lm[0].match(/<w:numFmt [^>]*w:val="([^"]+)"/);
          lv[lm[1]] = f ? f[1] : "";
        }
        abs[am[1]] = lv;
      }
      numFmt = {};
      const nRe = /<w:num\b[^>]*w:numId="(\d+)"[\s\S]*?<\/w:num>/g;
      let nm: RegExpExecArray | null;
      while ((nm = nRe.exec(nx)) !== null) {
        const a = nm[0].match(/<w:abstractNumId [^>]*w:val="(\d+)"/);
        if (a && abs[a[1]]) numFmt[nm[1]] = abs[a[1]];
      }
    }
  }
  return {
    text: stripOoxml(xmlParts.join("\n"), isDocx ? { numFmt: numFmt || {}, styleNum: styleNum } : undefined),
    rels: relParts.join("\n"),
    parts: contentNames.length + relsNames.length,
    kind: kind,
    media: mediaNames.join("\n"),
    author: core.author,
    lastEditedBy: core.lastEditedBy,
    lastEdited: core.lastEdited,
  };
}

// --------------------------------------------------------- core properties
// docProps/core.xml is optional in the OOXML spec and absent from some
// generated files, so every failure path degrades to empty strings —
// authorship is best-effort metadata, never worth failing an extraction.
interface CoreProps {
  author: string;
  lastEditedBy: string;
  lastEdited: string;
}

// v1.9 (SC-5): astral-safe code point -> string (fromCharCode truncates
// to 16 bits; &#x1F600; must come out as the emoji, not U+F600 junk)
function codePointStr(cp: number): string {
  if (!isFinite(cp) || cp < 0 || cp > 0x10ffff) return "";
  return cp <= 0xffff ? String.fromCharCode(cp) : String.fromCodePoint(cp);
}

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, h: string) => codePointStr(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_m, d: string) => codePointStr(parseInt(d, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function readCoreProps(bytes: Uint8Array, entries: ZipEntry[]): CoreProps {
  const empty: CoreProps = { author: "", lastEditedBy: "", lastEdited: "" };
  const entry = entries.filter((e) => e.name === "docProps/core.xml")[0];
  if (!entry) return empty;
  let xml = "";
  try {
    xml = utf8ToString(extractEntry(bytes, entry));
  } catch (e) {
    return empty;
  }
  const grab = (re: RegExp): string => {
    const m = xml.match(re);
    return m ? decodeXmlEntities(m[1]).replace(/\s+/g, " ").trim() : "";
  };
  // v1.9 (FL-5): a malformed dcterms:modified would make the flow's
  // formatDateTime throw on EVERY run of this doc (a deterministic
  // poison loop) — keep the value only when it parses as a date.
  const le = grab(/<dcterms:modified[^>]*>([\s\S]*?)<\/dcterms:modified>/);
  return {
    author: grab(/<dc:creator[^>]*>([\s\S]*?)<\/dc:creator>/),
    lastEditedBy: grab(/<cp:lastModifiedBy[^>]*>([\s\S]*?)<\/cp:lastModifiedBy>/),
    lastEdited: le !== "" && !isNaN(Date.parse(le)) ? le : "",
  };
}

function slideNum(name: string): number {
  const m = name.match(/[sS]lide(\d+)\.xml$/);
  return m ? parseInt(m[1], 10) : 0;
}

// v1.9 (SC-2): true presentation order from ppt/presentation.xml's
// sldIdLst, resolved through ppt/_rels/presentation.xml.rels.
// PowerPoint does not renumber slide parts on reorder/delete, so part
// filenames are creation order, not display order. Fallback: the old
// numeric part sort when either part is missing or resolves to zero
// slides; parts absent from the list are appended (never dropped).
function orderSlides(bytes: Uint8Array, entries: ZipEntry[], slides: ZipEntry[]): ZipEntry[] {
  const fallback = slides.slice().sort((a, b) => slideNum(a.name) - slideNum(b.name));
  const presEntry = entries.filter((e) => e.name === "ppt/presentation.xml")[0];
  const presRels = entries.filter((e) => e.name === "ppt/_rels/presentation.xml.rels")[0];
  if (!presEntry || !presRels) return fallback;
  let presXml = "";
  let relsXml = "";
  try {
    presXml = utf8ToString(extractEntry(bytes, presEntry));
    relsXml = utf8ToString(extractEntry(bytes, presRels));
  } catch (e) {
    return fallback;
  }
  const idToSlide: { [id: string]: string } = {};
  const tagRe = /<Relationship\b[^>]*>/g;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(relsXml)) !== null) {
    const idm = m[0].match(/\bId="([^"]+)"/);
    const tgm = m[0].match(/\bTarget="[^"]*?(slides\/slide\d+\.xml)"/);
    if (idm && tgm) idToSlide[idm[1]] = "ppt/" + tgm[1];
  }
  const lst = presXml.match(/<p:sldIdLst>[\s\S]*?<\/p:sldIdLst>/);
  if (!lst) return fallback;
  const byName: { [n: string]: ZipEntry } = {};
  for (const s of slides) byName[s.name] = s;
  const ordered: ZipEntry[] = [];
  const used: { [n: string]: boolean } = {};
  const rid = /r:id="([^"]+)"/g;
  while ((m = rid.exec(lst[0])) !== null) {
    const n = idToSlide[m[1]];
    if (n && byName[n] && !used[n]) {
      used[n] = true;
      ordered.push(byName[n]);
    }
  }
  if (ordered.length === 0) return fallback;
  for (const s of fallback) {
    if (!used[s.name]) ordered.push(s);
  }
  return ordered;
}

// v1.9 (SC-4): replicate MediaExtract's selection exactly (same regex,
// same caps, same central-directory order, sizes from uncompSize) so
// the links minted here name only files that will actually exist.
// ================= KEEP IN SYNC with MediaExtract.ts =================
// The three caps below MUST equal MediaExtract's MAX_IMAGES / MAX_ONE
// / MAX_TOTAL, and this selection walk MUST mirror its save loop —
// SC-4 (no dead image links) holds only while both stay identical.
// Budgeting uses the central directory's uncompSize on both sides;
// MediaExtract v1.3 (SB-8) throws on a lying central directory, so
// the claim-based prediction here is exact for every archive that
// extracts successfully.
// =====================================================================
function mediaSaveSet(entries: ZipEntry[]): { [base: string]: boolean } {
  const MAX_IMAGES = 12;
  const MAX_ONE = 350 * 1024;
  const MAX_TOTAL = 3 * 1024 * 1024;
  const set: { [b: string]: boolean } = {};
  let count = 0;
  let total = 0;
  for (const e of entries) {
    if (!/^(ppt|word)\/media\/[^/]+\.(png|jpe?g|gif|bmp)$/i.test(e.name)) continue;
    if (count >= MAX_IMAGES || e.uncompSize > MAX_ONE || total + e.uncompSize > MAX_TOTAL) continue;
    set[e.name.replace(/^.*\//, "")] = true;
    count++;
    total += e.uncompSize;
  }
  return set;
}

// Locate the slide's title placeholder (p:ph type="title"|"ctrTitle")
// at string level, returning its visible text plus the shape's span so
// the caller can splice it out of the body. Entities stay encoded here;
// stripOoxml's entity pass decodes them inside the heading line later.
// No placeholder (or an empty one) → null → the heading stays a plain
// "## Slide N"; we deliberately do NOT fall back to the first text line,
// which would duplicate a body line into the heading.
interface TitleHit {
  text: string;
  start: number;
  end: number;
}

function findTitleShape(xml: string): TitleHit | null {
  const spRe = /<p:sp\b[\s\S]*?<\/p:sp>/g;
  let m: RegExpExecArray | null;
  while ((m = spRe.exec(xml)) !== null) {
    const block = m[0];
    if (!/<p:ph\b[^>]*type="(?:ctrTitle|title)"/.test(block)) continue;
    const texts: string[] = [];
    const tre = /<a:t>([^<]*)<\/a:t>/g;
    let tm: RegExpExecArray | null;
    while ((tm = tre.exec(block)) !== null) {
      const v = tm[1].trim();
      if (v) texts.push(v);
    }
    let title = texts.join(" ").replace(/[|#]/g, " ").replace(/\s+/g, " ").trim();
    if (title.length > 120) {
      title = title.slice(0, 120);
      const cut = title.lastIndexOf(" ");
      if (cut > 80) title = title.slice(0, cut);
    }
    if (title === "") return null;
    return { text: title, start: m.index, end: m.index + block.length };
  }
  return null;
}

// v2.5 (TP-1): the topmost short text shape of a title-less slide.
// Candidates: a top-level p:sp (not inside a group) that is not a
// placeholder of another kind, holding ONE paragraph of 2–12 words
// (≤ 80 chars, no sentence-ending punctuation), positioned in the top
// fifth of the slide. Smallest y wins, then smallest x.
function findTopLabel(xml: string, slideCy: number): TitleHit | null {
  // v2.6 (TP-2): on a slide carrying a diagram-label cluster, a
  // label-shaped shape is part of the drawing, never the title
  const labelCluster = countLabelShapes(xml) >= 4;
  const groups: Array<[number, number]> = [];
  const gRe = /<p:grpSp\b[\s\S]*?<\/p:grpSp>/g;
  let gm: RegExpExecArray | null;
  while ((gm = gRe.exec(xml)) !== null) groups.push([gm.index, gm.index + gm[0].length]);
  const inGroup = (at: number): boolean => {
    for (const g of groups) if (at > g[0] && at < g[1]) return true;
    return false;
  };
  const spRe = /<p:sp\b[\s\S]*?<\/p:sp>/g;
  let best: { text: string; start: number; end: number; y: number; x: number } | null = null;
  let m: RegExpExecArray | null;
  while ((m = spRe.exec(xml)) !== null) {
    if (inGroup(m.index)) continue;
    const block = m[0];
    const ph = block.match(/<p:ph\b([^>]*)>/);
    if (ph && /type="(?!body|obj)/.test(ph[1])) continue;
    const off = block.match(/<a:off\b[^>]*\bx="(-?\d+)"[^>]*\by="(-?\d+)"/);
    if (!off) continue;
    const y = parseInt(off[2], 10);
    const x = parseInt(off[1], 10);
    if (y > slideCy * 0.2) continue;
    const paras = (block.match(/<a:p\b[\s\S]*?<\/a:p>/g) || []).filter((pp) => /<a:t>[^<]*\S[^<]*<\/a:t>/.test(pp));
    if (paras.length !== 1) continue;
    const texts: string[] = [];
    const tre = /<a:t>([^<]*)<\/a:t>/g;
    let tm: RegExpExecArray | null;
    while ((tm = tre.exec(paras[0])) !== null) {
      const v = tm[1].trim();
      if (v) texts.push(v);
    }
    const text = texts.join(" ").replace(/[|#]/g, " ").replace(/\s+/g, " ").trim();
    const words = text.split(" ").length;
    if (text.length > 80 || words < 2 || words > 12 || /[.;!?]$/.test(text)) continue;
    if (labelCluster && text.length <= 24 && words <= 3) continue;
    if (!best || y < best.y || (y === best.y && x < best.x)) {
      best = { text: text, start: m.index, end: m.index + block.length, y: y, x: x };
    }
  }
  return best ? { text: best.text, start: best.start, end: best.end } : null;
}

// v2.5 (IB-1): spell out the inherited bullet on body-placeholder
// paragraphs so the paragraph pass renders them as "- " items. Only
// level-0 paragraphs with text and no explicit bullet property are
// touched; buNone (an author's opt-out) is honoured.
function markInheritedBullets(xml: string): string {
  return xml.replace(/<p:sp\b[\s\S]*?<\/p:sp>/g, (sp) => {
    const ph = sp.match(/<p:ph\b([^>]*)>/);
    if (!ph || /type="(?!body|obj)/.test(ph[1])) return sp;
    return sp.replace(/<a:p\b[\s\S]*?<\/a:p>/g, (para) => {
      if (!/<a:t>[^<]*\S[^<]*<\/a:t>/.test(para)) return para;
      if (/<a:bu(?:None|Char|AutoNum|Blip)\b/.test(para)) return para;
      const lm = para.match(/<a:pPr\b[^>]*\blvl="(\d)"/);
      if (lm && parseInt(lm[1], 10) >= 1) return para;
      if (/<a:pPr\b[^>]*\/>/.test(para)) {
        return para.replace(/<a:pPr\b([^>]*)\/>/, '<a:pPr$1><a:buChar char="•"/></a:pPr>');
      }
      if (/<a:pPr\b[^>]*>/.test(para)) {
        return para.replace(/(<a:pPr\b[^>]*>)/, '$1<a:buChar char="•"/>');
      }
      return para.replace(/^(<a:p\b[^>]*>)/, '$1<a:pPr><a:buChar char="•"/></a:pPr>');
    });
  });
}

// v2.2 (DL-1): collapse a drawn diagram's label shapes.
// Test-plan slides draw route diagrams as shapes: dashed/hatched
// connector lines (p:cxnSp, textless) annotated by dozens of tiny
// floating text boxes — tick numbers, route/event ids. Flattened
// naively those labels render as long runs of one-token lines. At
// string level a diagram is recognizable as a CLUSTER of
// non-placeholder p:sp/p:cxnSp shapes whose entire text is
// label-shaped; placeholders (p:ph — title/body/sldNum) and
// graphicFrame tables never match. Below MIN_CLUSTER matches the
// shapes stay inline: one or two short floating callouts are content,
// not a diagram. Label text is spliced RAW (entities still encoded) —
// the [figure: ...] line rides the normal strip pipeline, which
// already treats "[figure:" as structure (fenceCode barrier).
interface FigureCollapse {
  xml: string;
  figure: string; // "" or "\n[figure: ...]\n"
}

/** How many non-placeholder shapes on the slide carry label-shaped
 *  text (the collapse rule's ≤ 24 chars / ≤ 3 words) — the count that
 *  decides whether the slide has a diagram-label cluster (v2.6). */
function countLabelShapes(xml: string): number {
  const shapeRe = /<p:(sp|cxnSp)\b[\s\S]*?<\/p:\1>/g;
  let n = 0;
  let m: RegExpExecArray | null;
  while ((m = shapeRe.exec(xml)) !== null) {
    const block = m[0];
    if (block.indexOf("<p:ph") >= 0) continue;
    const texts: string[] = [];
    const tre = /<a:t>([^<]*)<\/a:t>/g;
    let tm: RegExpExecArray | null;
    while ((tm = tre.exec(block)) !== null) {
      const v = tm[1].trim();
      if (v) texts.push(v);
    }
    const t = texts.join(" ").replace(/\s+/g, " ").trim();
    if (t === "" || t.length > 24 || t.split(" ").length > 3) continue;
    n++;
  }
  return n;
}

function collapseFigureLabels(xml: string): FigureCollapse {
  const MIN_CLUSTER = 4;
  const MAX_LABEL_CHARS = 24;
  const MAX_LABEL_WORDS = 3;
  const MAX_FIGURE_ITEMS = 24;
  // \1 backreference keeps open/close tags paired (p:sp cannot nest in
  // p:sp, nor p:cxnSp in p:cxnSp, so non-greedy-to-own-closer is exact)
  const shapeRe = /<p:(sp|cxnSp)\b[\s\S]*?<\/p:\1>/g;
  const spans: { start: number; end: number; text: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = shapeRe.exec(xml)) !== null) {
    const block = m[0];
    if (block.indexOf("<p:ph") >= 0) continue; // placeholders are content
    const texts: string[] = [];
    const tre = /<a:t>([^<]*)<\/a:t>/g;
    let tm: RegExpExecArray | null;
    while ((tm = tre.exec(block)) !== null) {
      const v = tm[1].trim();
      if (v) texts.push(v);
    }
    const t = texts.join(" ").replace(/\s+/g, " ").trim();
    if (t === "" || t.length > MAX_LABEL_CHARS) continue;
    if (t.split(" ").length > MAX_LABEL_WORDS) continue;
    spans.push({ start: m.index, end: m.index + block.length, text: t });
  }
  if (spans.length < MIN_CLUSTER) return { xml: xml, figure: "" };
  const parts: string[] = [];
  let prev = 0;
  for (const s of spans) {
    parts.push(xml.slice(prev, s.start));
    prev = s.end;
  }
  parts.push(xml.slice(prev));
  // tick marks: ascending step-1 integer runs of 3+ compress to "a–b"
  const isInt = (s: string): boolean => /^\d+$/.test(s);
  const items: string[] = [];
  let i = 0;
  while (i < spans.length) {
    const t = spans[i].text;
    if (isInt(t)) {
      let j = i;
      while (j + 1 < spans.length && isInt(spans[j + 1].text) &&
             parseInt(spans[j + 1].text, 10) === parseInt(spans[j].text, 10) + 1) j++;
      if (j - i >= 2) {
        items.push(t + "–" + spans[j].text);
        i = j + 1;
        continue;
      }
    }
    items.push(t);
    i++;
  }
  const seen: { [k: string]: boolean } = {};
  const ded: string[] = [];
  for (const it of items) {
    if (!seen[it]) {
      seen[it] = true;
      ded.push(it);
    }
  }
  const shown = ded.length > MAX_FIGURE_ITEMS
    ? ded.slice(0, MAX_FIGURE_ITEMS).concat(["…"])
    : ded;
  return { xml: parts.join(""), figure: "\n[figure: " + shown.join(" · ") + "]\n" };
}

// ------------------------------------------------------------ strip recipe
// Validated 98%+ token recall on real LRS docs; since v1.3 tables render
// as GFM pipe tables (escaped pipes, gridSpan padding) before the strip.
function renderTables(xml: string, ns: string): string {
  // innermost-first so nested tables flatten correctly
  const inner = new RegExp("<" + ns + ":tbl\\b(?:(?!<" + ns + ":tbl\\b)[\\s\\S])*?</" + ns + ":tbl>");
  let t = xml;
  let guard = 0;
  let truncated = false;
  while (inner.test(t)) {
    // v2.0 (SB-7): tables past the guard previously fell through to the
    // raw tag strip and rendered as flattened prose with no marker
    if (guard++ >= 200) {
      truncated = true;
      break;
    }
    t = t.replace(inner, (tbl) => {
      const rows = tbl.split(new RegExp("<" + ns + ":tr\\b"));
      // v2.5 (CP-1): a cell is a LIST OF PARAGRAPHS, not one string —
      // the old blanket tag strip joined a cell's bullet points with a
      // space, so a "Positive Tests: Gapped Routes" cell holding nine
      // test cases rendered as one 900-character run-on nobody could
      // split again (62 of 178 test-plan sidecars).
      const grid: string[][][] = [];
      let multi = false;
      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].split(new RegExp("<" + ns + ":tc\\b"));
        const line: string[][] = [];
        for (let j = 1; j < cells.length; j++) {
          const raw = cells[j];
          const opener = (raw.match(/^[^>]*/) || [""])[0];
          // v1.9 (SC-3): DrawingML keeps horizontally-merged-away cells
          // in the markup as <a:tc hMerge="1"/>; rendering them AND
          // padding gridSpan double-counts and column-shifts the table.
          // (WordprocessingML omits covered cells — w path unchanged.)
          if (ns === "a" && /\bhMerge="(1|true)"/.test(opener)) continue;
          let span = 1;
          const gs = opener.match(/gridSpan="(\d+)"/) ||
                     raw.match(new RegExp("<" + ns + ':gridSpan [^>]*val="(\\d+)"'));
          if (gs) span = parseInt(gs[1], 10);
          const paras: string[] = [];
          const chunks = raw.replace(/^[^>]*>/, "")
            .split(/<\/a:p>|<\/w:p>|<a:br\b[^>]*\/>|<w:br\b[^>]*\/>/);
          for (const ch of chunks) {
            const c = ch
              .replace(/<[^>]+>/g, " ")
              .replace(/\|/g, "\\|")          // escape pipes for markdown
              .replace(/\s+/g, " ")
              .trim();
            if (c !== "") paras.push(c);
          }
          if (paras.length > 1) multi = true;
          line.push(paras);
          for (let s = 1; s < span; s++) line.push([]);  // pad merged columns
        }
        if (line.length > 0) grid.push(line);
      }
      if (grid.length === 0) return "\n";
      // v2.0 (SB-7): loop, not Math.max.apply — the spread hit the
      // argument limit (RangeError) at ~65k rows
      let width = 0;
      for (const r of grid) if (r.length > width) width = r.length;
      // v2.5 (CP-1): a SINGLE-COLUMN table whose cells hold several
      // paragraphs is a labelled list wearing a table border (the
      // decks' "Positive Tests: <group>" boxes): render the first cell
      // as a bold label and every further paragraph as a bullet — the
      // shape the case detector reads and every renderer shows the
      // same way. Multi-column cells keep their paragraphs on <br>
      // (GFM line breaks inside a cell; decided 2026-09-05).
      if (width === 1 && multi) {
        const out: string[] = [];
        let first = true;
        for (const r of grid) {
          for (const para of r[0] || []) {
            if (first) { out.push("**" + para + "**"); first = false; }
            else out.push("- " + para);
          }
        }
        return "\n\n" + out.join("\n") + "\n\n";
      }
      const md: string[] = [];
      for (let i = 0; i < grid.length; i++) {
        // \u0002 = cell line-break sentinel: becomes "<br>" after the
        // blanket tag strip (which would otherwise eat a literal <br>)
        const r = grid[i].map((paras) => paras.join("\u0002"));
        while (r.length < width) r.push("");
        md.push("| " + r.join(" | ") + " |");
        if (i === 0) {
          const sep: string[] = [];
          for (let k = 0; k < width; k++) sep.push("---");
          md.push("| " + sep.join(" | ") + " |");
        }
      }
      return "\n\n" + md.join("\n") + "\n\n";
    });
  }
  if (truncated) {
    t += "\n\n*(tables truncated at 200 — remaining tables render as plain text)*\n";
  }
  return t;
}

// -------------------------------------------------- code fencing (v2.1)
// CF-1: pasted code (Arcade scripts in test-plan decks, JS snippets in
// docs) used to flatten into loose prose lines. This pass runs LAST in
// the strip recipe, over final markdown lines, and wraps code-shaped
// runs in fenced blocks. Detection is heuristic by design; the tuning
// principle is asymmetric: a missed fence renders as the same loose
// text v2.0 produced (no regression), while a false fence would mangle
// prose — so every signal is gated hard against sentence-shaped lines,
// and single-line fences need an unambiguous keyword+structure shape.
interface CodeSignals {
  comment: boolean;  // // line comment, /* */ delimiters
  keyword: boolean;  // lowercase statement keyword opens the line
  global_: boolean;  // Arcade profile globals ($feature, $map, ...)
  closer: boolean;   // the line is only closing brackets
  weak: number;      // count of: ;/{ ending, assignment, operators, bare call
}

function codeSignals(s: string): CodeSignals {
  // sentence guard: >=5 words of plain prose characters (trailing ';'
  // tolerated) carry no signals at all — "Select the route; click
  // Save;" must never count as code, whatever it ends with
  if (s.split(/\s+/).length >= 5 &&
      /^[A-Za-z][A-Za-z0-9 ,.'’&/()%:+–—-]*;?$/.test(s)) {
    return { comment: false, keyword: false, global_: false, closer: false, weak: 0 };
  }
  const endPunct = /[;{]$/.test(s);
  const assign = /^[A-Za-z_$][\w$]*(\.[\w$]+|\[[^\]]*\])*\s*=(?!=)\s*\S/.test(s);
  const ops = /==|!==?|>=|<=|&&|\|\||=>/.test(s);
  const call = /^[A-Za-z_$][\w$.]*\([^()]*\)[;,]?$/.test(s);
  return {
    comment: /^\/\//.test(s) || s.indexOf("/*") >= 0 || s.indexOf("*/") >= 0,
    keyword: /^(var|let|const|function|return|if|else|for|while|switch|break|continue)\b/.test(s),
    global_: /\$feature\b|\$map\b|\$datastore\b|\$layer\b/.test(s),
    closer: /^[})\]];?,?$/.test(s),
    weak: (endPunct ? 1 : 0) + (assign ? 1 : 0) + (ops ? 1 : 0) + (call ? 1 : 0),
  };
}

function isStrongCode(g: CodeSignals): boolean {
  return g.comment || g.keyword || g.global_ || g.closer || g.weak >= 2;
}

function fenceCode(text: string): string {
  const lines = text.split("\n");
  // per-line classification; barriers are structure this pipeline
  // generates (or fence-lookalike content) that never joins a run
  const blank: boolean[] = [];
  const barrier: boolean[] = [];
  const strong: boolean[] = [];
  const codey: boolean[] = [];
  for (let i = 0; i < lines.length; i++) {
    const s = lines[i].trim();
    blank.push(s === "");
    const bar = s !== "" && (
      s.charAt(0) === "|" || /^#{1,6}[ \t]/.test(s) || s.indexOf("![") === 0 ||
      s.indexOf("[figure:") === 0 || s.indexOf("```") === 0 || /^-([ \t]|$)/.test(s));
    barrier.push(bar);
    if (s === "" || bar) {
      strong.push(false);
      codey.push(false);
    } else {
      const g = codeSignals(s);
      strong.push(isStrongCode(g));
      codey.push(isStrongCode(g) || g.weak >= 1);
    }
  }
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    if (!codey[i]) {
      // list items whose content is code-shaped render as inline code
      const m = barrier[i] ? lines[i].match(/^(\s*- )(.+)$/) : null;
      if (m && m[2].indexOf("`") < 0 && m[2].indexOf("](") < 0) {
        const g = codeSignals(m[2].trim());
        if (g.global_ || (g.keyword && /[=;{]/.test(m[2])) || g.weak >= 2) {
          out.push(m[1] + "`" + m[2] + "`");
          i++;
          continue;
        }
      }
      out.push(lines[i]);
      i++;
      continue;
    }
    // extend the run over codey lines; blank lines join only when more
    // code follows them (a script's internal spacing, not its edge)
    let last = i;
    let strongCount = 0;
    let codeyCount = 0;
    let j = i;
    while (j < lines.length) {
      if (codey[j]) {
        last = j;
        codeyCount++;
        if (strong[j]) strongCount++;
        j++;
      } else if (blank[j]) {
        let k = j;
        while (k < lines.length && blank[k]) k++;
        if (k < lines.length && codey[k]) j = k;
        else break;
      } else if (!barrier[j] && j === last + 1 && j + 1 < lines.length && codey[j + 1]) {
        // sandwich absorption: ONE opaque line with code directly on
        // both sides stays in the block (a '# comment' line — escaped
        // to '\#' by SB-6 — or a stray fragment inside a script)
        j++;
      } else {
        break;
      }
    }
    const single = lines[i].trim();
    const fenceIt =
      strongCount >= 2 ||
      (strongCount >= 1 && codeyCount >= 2) ||
      (codeyCount === 1 && strong[i] &&
        /^(var|let|const|function|return|if|for|while)\b/.test(single) &&
        /[=;{]/.test(single));
    if (fenceIt) {
      // inside a fence the SB-6/SC-10 escape is wrong twice over: the
      // fence already neutralizes '#', and the backslash would render
      const block = lines.slice(i, last + 1).map((ln) =>
        ln.charAt(0) === "\\" && ln.charAt(1) === "#" ? ln.slice(1) : ln);
      const lang = block.some((ln) =>
        /\$feature\b|\$map\b|\$datastore\b|\$layer\b/.test(ln)) ? "arcade" : "";
      if (out.length > 0 && out[out.length - 1].trim() !== "") out.push("");
      out.push("```" + lang);
      for (const b of block) out.push(b);
      out.push("```");
      if (last + 1 < lines.length && lines[last + 1].trim() !== "") out.push("");
    } else {
      for (let k = i; k <= last; k++) out.push(lines[k]);
    }
    i = last + 1;
  }
  return out.join("\n");
}

interface DocxCtx {
  numFmt: { [numId: string]: { [ilvl: string]: string } };
  styleNum: { [styleId: string]: { numId: string; ilvl: string } };
}

function stripOoxml(xml: string, ctx?: DocxCtx): string {
  const numFmt = ctx ? ctx.numFmt : undefined;
  const styleNum = ctx ? ctx.styleNum : {};
  let t = xml;
  // kill duplicate renderings: AlternateContent serves Choice AND Fallback
  t = t.replace(/<mc:Fallback>[\s\S]*?<\/mc:Fallback>/g, "");
  // group docx inline-drawing labels into single [figure: ...] lines
  t = t.replace(/<w:drawing\b[\s\S]*?<\/w:drawing>/g, (d) => {
    const labels: string[] = [];
    const tre = /<a:t>([^<]*)<\/a:t>|<w:t\b[^>]*>([^<]*)<\/w:t>/g;
    let m: RegExpExecArray | null;
    while ((m = tre.exec(d)) !== null) {
      const v = (m[1] || m[2] || "").trim();
      if (v) labels.push(v);
    }
    const keep = d.match(/!\[[^\]]*\]\([^)]*\)/g) || [];
    return (labels.length > 0 ? "\n[figure: " + labels.join(" · ") + "]\n" : "") + keep.join(" ");
  });
  t = renderTables(t, "w");
  t = renderTables(t, "a");
  // v1.7: paragraph structure prefixes. These run after renderTables
  // (table-internal paragraphs are already flattened to pipe rows) and
  // before the tag strip, so each prefix lands at the start of the
  // paragraph's rendered line (the </w:p>/</a:p> -> \n rule below
  // terminates the previous line).
  // docx: Heading1..6/Title styles -> markdown headings shifted one
  // level down (the sidecar's H1 belongs to the flow-composed header);
  // numbered/bulleted paragraphs -> nested "- " items by w:ilvl.
  // v2.5 (DL-2): the docx pass sees paragraphs as a SEQUENCE (a label
  // needs its follower) and knows the numbering part (ordered lists
  // render as "1. " items). Structure the corpus' docx plans actually
  // carry — bold label paragraphs ("UI Tests – First Pane:",
  // "Negative Tests:") instead of heading styles — becomes "### "
  // headings so the sections exist.
  {
    const pRe = /<w:p\b(?:(?!<w:p\b)[\s\S])*?<\/w:p>/g;
    const paras: Array<{ start: number; end: number; xml: string }> = [];
    let pm: RegExpExecArray | null;
    while ((pm = pRe.exec(t)) !== null) paras.push({ start: pm.index, end: pm.index + pm[0].length, xml: pm[0] });
    const textOf = (p: string): string => {
      const parts: string[] = [];
      const tre = /<w:t\b[^>]*>([^<]*)<\/w:t>/g;
      let tm: RegExpExecArray | null;
      while ((tm = tre.exec(p)) !== null) parts.push(tm[1]);
      return parts.join("").replace(/\s+/g, " ").trim();
    };
    const allBold = (p: string): boolean => {
      const runs = p.match(/<w:r\b[\s\S]*?<\/w:r>/g) || [];
      let seen = 0;
      for (const r of runs) {
        if (!/<w:t\b[^>]*>[^<]*\S/.test(r)) continue;
        seen++;
        const rpr = (r.match(/<w:rPr\b[\s\S]*?<\/w:rPr>/) || [""])[0];
        if (!/<w:b\b(?![^>]*w:val="(?:0|false)")/.test(rpr)) return false;
      }
      return seen > 0;
    };
    // a list item carries its numPr directly, or through its paragraph
    // style (python-docx / Word "List Bullet" / "List Number" styles)
    const listOf = (p: string): { numId: string; ilvl: string } | null => {
      const ppr = (p.match(/<w:pPr\b[\s\S]*?<\/w:pPr>/) || [""])[0];
      if (ppr.indexOf("<w:numPr>") >= 0) {
        const il = ppr.match(/<w:ilvl [^>]*w:val="(\d+)"/);
        const ni = ppr.match(/<w:numId [^>]*w:val="(\d+)"/);
        return { numId: ni ? ni[1] : "", ilvl: il ? il[1] : "0" };
      }
      const st = ppr.match(/<w:pStyle [^>]*w:val="([^"]+)"/);
      if (st && styleNum[st[1]]) return styleNum[st[1]];
      return null;
    };
    const hasNum = (p: string): boolean => listOf(p) !== null;
    const out: string[] = [];
    let cursor = 0;
    for (let i = 0; i < paras.length; i++) {
      const p = paras[i].xml;
      out.push(t.slice(cursor, paras[i].start));
      cursor = paras[i].end;
      const ppr = (p.match(/<w:pPr\b[\s\S]*?<\/w:pPr>/) || [""])[0];
      const hs = ppr.match(/<w:pStyle [^>]*w:val="Heading([1-6])"/);
      // \u0001 = generated-heading sentinel, consumed by the SB-6 pass
      if (hs) { out.push("\n\u0001" + "######".slice(0, Math.min(parseInt(hs[1], 10) + 1, 6)) + " " + p); continue; }
      if (/<w:pStyle [^>]*w:val="Title"/.test(ppr)) { out.push("\n\u0001## " + p); continue; }
      const li = listOf(p);
      if (li) {
        const lvl = parseInt(li.ilvl, 10) || 0;
        let indent = "";
        for (let k = 0; k < lvl; k++) indent += "  ";
        const fmt = li.numId && numFmt && numFmt[li.numId] ? (numFmt[li.numId][String(lvl)] || "") : "";
        const ordered = fmt !== "" && fmt !== "bullet" && fmt !== "none";
        out.push("\n" + indent + (ordered ? "1. " : "- ") + p);
        continue;
      }
      const text = textOf(p);
      if (text.length >= 2 && text.length <= 60 && !/[.!?]$/.test(text)) {
        let nextHasText = -1;
        for (let j = i + 1; j < paras.length; j++) {
          if (textOf(paras[j].xml) !== "") { nextHasText = j; break; }
        }
        const labelColon = /:$/.test(text) && nextHasText >= 0 && hasNum(paras[nextHasText].xml);
        if (allBold(p) || labelColon) { out.push("\n\u0001### " + p); continue; }
      }
      out.push(p);
    }
    out.push(t.slice(cursor));
    t = out.join("");
  }
  // pptx: explicit outline level (lvl>=1) or explicit bullet props ->
  // nested "- " items. lvl-0 bullets inherited from the layout/master
  // are invisible in slide XML, so those paragraphs stay plain lines.
  t = t.replace(/<a:p\b(?:(?!<a:p\b)[\s\S])*?<\/a:p>/g, (p) => {
    if (p.indexOf("<a:buNone") >= 0) return p;
    const lm = p.match(/<a:pPr\b[^>]*\blvl="(\d)"/);
    const lvl = lm ? parseInt(lm[1], 10) : 0;
    if (lvl < 1 && p.indexOf("<a:buChar") < 0 && p.indexOf("<a:buAutoNum") < 0) return p;
    let indent = "";
    for (let i = 0; i < lvl; i++) indent += "  ";
    return "\n" + indent + "- " + p;
  });
  t = t.replace(/<\/w:p>|<\/w:tc>|<\/a:p>|<w:br\b[^>]*>|<w:cr\b[^>]*>|<a:br\b[^>]*>/g, "\n");
  t = t.replace(/<w:tab\/>/g, "\t");
  t = t.replace(/<[^>]+>/g, "");
  // v2.5 (CP-1): multi-paragraph table cells keep their breaks as <br>
  t = t.replace(/\u0002/g, "<br>");
  // v2.0 (SB-6): escape content heading markers (## through ######
  // collide with the generated "## Slide N"/"### Notes"/docx-style
  // sections; v1.9's SC-10 escape below covers only a single #).
  // This runs while generated headings still carry their \u0001
  // sentinel (added at every injection site) and entities are still
  // encoded — Office writers never entity-escape '#', so every
  // authored hash is literal at this point, and raw \u0001 is not
  // legal XML CharData, so only our sentinels can start a line with
  // it. Escape unsentineled heading-like lines, then drop sentinels.
  t = t.replace(/^#(?=#{0,5}(?:[ \t]|$))/gm, "\\#");
  t = t.replace(/\u0001/g, "");
  // v1.9 (SC-5): astral-safe entity decode (same helper as core props)
  t = t.replace(/&#x([0-9a-fA-F]+);/g, (_m, h: string) => codePointStr(parseInt(h, 16)));
  t = t.replace(/&#(\d+);/g, (_m, d: string) => codePointStr(parseInt(d, 10)));
  t = t
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
  // v1.2 cleanups:
  // - normalize CR (decoded &#13;) to LF
  t = t.replace(/\r\n?/g, "\n");
  // - unwrap Word field codes: HYPERLINK "url" [\o "tooltip"] -> url
  t = t.replace(/\bHYPERLINK\s+"([^"]+)"/g, "$1");
  t = t.replace(/\\[olt]\s+"[^"]*"/g, "");
  // - strip glued drawing-geometry digit runs (posOffset etc.); no real
  //   content is a 10+ digit run (issue ids <=6, dates/measures shorter).
  //   v1.9 (SC-7): applied line-wise, skipping lines that carry a
  //   markdown link ("](") — generated image links and unwrapped
  //   HYPERLINK urls are never corrupted by the strip.
  {
    const lines = t.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].indexOf("](") < 0) lines[i] = lines[i].replace(/\d{10,}/g, "");
    }
    t = lines.join("\n");
  }
  // v1.7: drop prefix artifacts left by empty paragraphs (an empty
  // heading- or list-styled paragraph renders as a bare "- " or "##")
  t = t.replace(/^[ \t]*-[ \t]*$/gm, "").replace(/^#{2,6} *$/gm, "");
  // v1.9 (SC-10): a content line that would render as an H1 breaks the
  // "H1 unique to the flow header" contract (pasted markdown in decks
  // is common) — escape it. Generated headings are always ##..######,
  // never a single #, so only document content can match here. (The
  // ##..###### case is handled by the SB-6 sentinel pass above, which
  // runs while generated headings are still tagged; this line stays as
  // the v1.9 backstop for a single # materialized by entity decode.)
  t = t.replace(/^#(?=[ \t]|$)/gm, "\\#");
  t = t.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
  // v2.1 (CF-1): code fencing runs LAST, over the final line structure
  t = fenceCode(t);
  return t.trim();
}

// ------------------------------------------------------------ base64
// ============ KEEP IN SYNC with MediaExtract.ts (SB-8) ==============
// Everything from here through the utf-8 decoder — b64ToBytes, the
// zip central-directory reader, extractEntry, and the RFC 1951
// inflate — is duplicated byte-for-byte in MediaExtract.ts (Office
// Scripts cannot share modules). Every fix landed here MUST be landed
// there in the same batch, and vice versa; the harness equivalence
// gates are the only enforcement.
// =====================================================================
// v1.6: Uint8Array + charCode table. Skips '=', CR/LF and any
// non-alphabet char exactly as v1.5's dictionary miss did.
function b64ToBytes(b64: string): Uint8Array {
  const T = new Int32Array(128).fill(-1);
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (let i = 0; i < alpha.length; i++) T[alpha.charCodeAt(i)] = i;
  const out = new Uint8Array(Math.floor((b64.length * 3) / 4) + 3);
  let n = 0;
  let buf = 0, bits = 0;
  for (let i = 0; i < b64.length; i++) {
    const code = b64.charCodeAt(i);
    if (code >= 128) continue;
    const v = T[code];
    if (v < 0) continue;
    buf = (buf << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[n++] = (buf >> bits) & 0xff;
    }
  }
  return n === out.length ? out : out.subarray(0, n);
}

// ------------------------------------------------------------ zip reader
interface ZipEntry {
  name: string;
  method: number;
  flags: number; // v1.9 (SC-14): general-purpose bit flags
  compSize: number;
  uncompSize: number;
  localOffset: number;
}

function u16(b: Uint8Array, p: number): number { return b[p] | (b[p + 1] << 8); }
function u32(b: Uint8Array, p: number): number {
  return (b[p] | (b[p + 1] << 8) | (b[p + 2] << 16) | (b[p + 3] << 24)) >>> 0;
}

function readCentralDirectory(b: Uint8Array): ZipEntry[] {
  // find EOCD (0x06054b50) scanning back from end (max comment 64k)
  let eocd = -1;
  const stop = Math.max(0, b.length - 65558);
  for (let p = b.length - 22; p >= stop; p--) {
    if (b[p] === 0x50 && b[p + 1] === 0x4b && b[p + 2] === 0x05 && b[p + 3] === 0x06) {
      eocd = p; break;
    }
  }
  if (eocd < 0) throw new Error("ZipTextExtract: EOCD not found (not a zip?)");
  const count = u16(b, eocd + 10);
  let p = u32(b, eocd + 16); // central directory offset
  const entries: ZipEntry[] = [];
  for (let i = 0; i < count; i++) {
    if (u32(b, p) !== 0x02014b50) throw new Error("ZipTextExtract: bad central header at " + p);
    const flags = u16(b, p + 8);
    const method = u16(b, p + 10);
    const compSize = u32(b, p + 20);
    const uncompSize = u32(b, p + 24);
    const nameLen = u16(b, p + 28);
    const extraLen = u16(b, p + 30);
    const commentLen = u16(b, p + 32);
    const localOffset = u32(b, p + 42);
    let name = "";
    for (let k = 0; k < nameLen; k++) name += String.fromCharCode(b[p + 46 + k]);
    entries.push({ name: name, method: method, flags: flags, compSize: compSize, uncompSize: uncompSize, localOffset: localOffset });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

function extractEntry(b: Uint8Array, e: ZipEntry): Uint8Array {
  // v1.9 (SC-14): an encrypted stored entry would otherwise return
  // ciphertext as "text" silently — the one silent-wrong-output path
  // in the zip layer.
  if ((e.flags & 0x1) !== 0) throw new Error("ZipTextExtract: encrypted entry " + e.name);
  const p = e.localOffset;
  if (u32(b, p) !== 0x04034b50) throw new Error("ZipTextExtract: bad local header for " + e.name);
  const nameLen = u16(b, p + 26);
  const extraLen = u16(b, p + 28); // local extra can differ from central
  const dataStart = p + 30 + nameLen + extraLen;
  const data = b.subarray(dataStart, dataStart + e.compSize); // v1.6: view, no copy
  if (e.method === 0) return data;                    // stored
  if (e.method === 8) return inflateRaw(data, e.uncompSize); // deflate
  throw new Error("ZipTextExtract: unsupported compression method " + e.method + " for " + e.name);
}

// ------------------------------------------------------------ inflate (RFC 1951)
const LEN_BASE = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
const LEN_EXTRA = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
const DIST_BASE = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
const DIST_EXTRA = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
const CLC_ORDER = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];

interface Huff { counts: number[]; symbols: number[]; }

function buildHuff(lengths: number[]): Huff {
  const counts = new Array<number>(16).fill(0);
  for (const l of lengths) counts[l]++;
  counts[0] = 0;
  const offs = new Array<number>(16).fill(0);
  for (let i = 1; i < 16; i++) offs[i] = offs[i - 1] + counts[i - 1];
  const symbols = new Array<number>(lengths.length).fill(0);
  for (let s = 0; s < lengths.length; s++) {
    if (lengths[s] !== 0) symbols[offs[lengths[s]]++] = s;
  }
  return { counts: counts, symbols: symbols };
}

// v1.6: output preallocated from outHint (central-directory uncompSize),
// doubling growth as a safety net; write pointer instead of push. The
// back-reference copy stays a byte-wise loop — overlapping copies
// (distance < length) are RLE by definition and forbid block copies.
function inflateRaw(src: Uint8Array, outHint: number): Uint8Array {
  let out = new Uint8Array(outHint > 0 ? outHint : 1024);
  let outLen = 0;
  let pos = 0;      // byte position
  let bitBuf = 0, bitCnt = 0;

  function ensure(extra: number): void {
    if (outLen + extra <= out.length) return;
    let cap = out.length * 2;
    while (cap < outLen + extra) cap *= 2;
    const grown = new Uint8Array(cap);
    grown.set(out);
    out = grown;
  }

  function bits(n: number): number {
    while (bitCnt < n) {
      if (pos >= src.length) throw new Error("inflate: out of input");
      bitBuf |= src[pos++] << bitCnt;
      bitCnt += 8;
    }
    const v = bitBuf & ((1 << n) - 1);
    bitBuf >>>= n;
    bitCnt -= n;
    return v;
  }

  function decodeSym(h: Huff): number {
    let code = 0, first = 0, index = 0;
    for (let len = 1; len < 16; len++) {
      code |= bits(1);
      const count = h.counts[len];
      if (code - first < count) return h.symbols[index + (code - first)];
      index += count;
      first = (first + count) << 1;
      code <<= 1;
    }
    throw new Error("inflate: bad code");
  }

  let fixedLit: Huff | null = null;
  let fixedDist: Huff | null = null;

  while (true) {
    const final = bits(1);
    const type = bits(2);
    if (type === 0) {
      // stored block: align to byte
      bitBuf = 0; bitCnt = 0;
      const len = src[pos] | (src[pos + 1] << 8);
      const nlen = src[pos + 2] | (src[pos + 3] << 8);
      pos += 4; // skip LEN + NLEN
      // v2.0 (SB-5): NLEN is LEN's ones-complement by spec — a corrupted
      // length field previously emitted garbled text as a "successful"
      // extraction. (A truncated header is caught by the bounds check
      // below, since pos has already advanced past both fields.)
      if (nlen !== (~len & 0xffff)) throw new Error("inflate: stored block NLEN mismatch");
      // v1.9 (SC-8): a truncated stored block previously zero-padded
      // silently (OOB Uint8Array reads yield undefined -> 0), emitting
      // garbled text as a "successful" extraction. Huffman blocks
      // already throw via bits(); stored blocks now match.
      if (pos + len > src.length) throw new Error("inflate: stored block out of input");
      ensure(len);
      for (let i = 0; i < len; i++) out[outLen++] = src[pos++];
    } else {
      let lit: Huff, dist: Huff;
      if (type === 1) {
        if (!fixedLit) {
          const ll = new Array<number>(288);
          for (let i = 0; i < 144; i++) ll[i] = 8;
          for (let i = 144; i < 256; i++) ll[i] = 9;
          for (let i = 256; i < 280; i++) ll[i] = 7;
          for (let i = 280; i < 288; i++) ll[i] = 8;
          fixedLit = buildHuff(ll);
          fixedDist = buildHuff(new Array<number>(30).fill(5));
        }
        lit = fixedLit; dist = fixedDist as Huff;
      } else if (type === 2) {
        const hlit = bits(5) + 257;
        const hdist = bits(5) + 1;
        const hclen = bits(4) + 4;
        const clcLens = new Array<number>(19).fill(0);
        for (let i = 0; i < hclen; i++) clcLens[CLC_ORDER[i]] = bits(3);
        const clc = buildHuff(clcLens);
        const lens: number[] = [];
        while (lens.length < hlit + hdist) {
          const sym = decodeSym(clc);
          if (sym < 16) lens.push(sym);
          else if (sym === 16) {
            const prev = lens[lens.length - 1];
            let rep = 3 + bits(2);
            while (rep--) lens.push(prev);
          } else if (sym === 17) {
            let rep = 3 + bits(3);
            while (rep--) lens.push(0);
          } else {
            let rep = 11 + bits(7);
            while (rep--) lens.push(0);
          }
        }
        lit = buildHuff(lens.slice(0, hlit));
        dist = buildHuff(lens.slice(hlit));
      } else {
        throw new Error("inflate: bad block type");
      }
      while (true) {
        const sym = decodeSym(lit);
        if (sym < 256) { ensure(1); out[outLen++] = sym; }
        else if (sym === 256) break;
        else {
          const li = sym - 257;
          const length = LEN_BASE[li] + bits(LEN_EXTRA[li]);
          const dsym = decodeSym(dist);
          const distance = DIST_BASE[dsym] + bits(DIST_EXTRA[dsym]);
          const start = outLen - distance;
          if (start < 0) throw new Error("inflate: bad distance");
          ensure(length);
          for (let i = 0; i < length; i++) out[outLen++] = out[start + i];
        }
      }
    }
    if (final) break;
  }
  return outLen === out.length ? out : out.subarray(0, outLen);
}

// ------------------------------------------------------------ utf-8 decode
// v1.6: identical decode logic; code units buffered and flushed through
// String.fromCharCode in 4096-unit chunks instead of per-char concat.
function utf8ToString(b: Uint8Array): string {
  const parts: string[] = [];
  let codes: number[] = [];
  let i = 0;
  while (i < b.length) {
    const c = b[i];
    if (c < 0x80) { codes.push(c); i += 1; }
    else if (c < 0xe0) { codes.push(((c & 0x1f) << 6) | (b[i + 1] & 0x3f)); i += 2; }
    else if (c < 0xf0) {
      codes.push(((c & 0x0f) << 12) | ((b[i + 1] & 0x3f) << 6) | (b[i + 2] & 0x3f));
      i += 3;
    } else {
      const cp = ((c & 0x07) << 18) | ((b[i + 1] & 0x3f) << 12) | ((b[i + 2] & 0x3f) << 6) | (b[i + 3] & 0x3f);
      const u = cp - 0x10000;
      codes.push(0xd800 + (u >> 10), 0xdc00 + (u & 0x3ff));
      i += 4;
    }
    if (codes.length >= 4096) {
      parts.push(String.fromCharCode(...codes));
      codes = [];
    }
  }
  if (codes.length > 0) parts.push(String.fromCharCode(...codes));
  return parts.join("");
}
