/**
 * RegexExtract v1.1 — deterministic ID + doc revision extraction
 * ------------------------------------------------------------------
 * Implements the three validated ID sources, in precedence order:
 *
 *   url      devtopia.esri.com/{org}/{repo}/issues/{n}   (authoritative
 *            — carries its own repo namespace; also matches inside raw
 *            _rels XML, so hyperlink-only references are caught)
 *   filename ^(\d{2,5})[-_]   leading digit-run + separator
 *            (2-digit minimum: a single leading digit — e.g.
 *            "5_Data_Template..." — is treated as ordering noise;
 *            8-digit date prefixes like 20260806_ can never match)
 *   hashtag  #(\d{3,5})       Gantt-style labeled refs
 *
 * filename + hashtag numbers get `defaultRepo` as their namespace.
 * A hashtag is a weak, repo-less signal: it is DROPPED whenever the
 * same number was already claimed by a url or filename source (this
 * prevents e.g. ExB issue #26161 from also registering a phantom
 * copy under the default repo).
 *
 * docRevision: [Vv]\d{1,2} at the very end of the base filename —
 * matches TestPlanV1, _V4, _v2; ignores trailing "_1" and "2_35".
 *
 * Power Automate wiring:
 *   Excel Online (Business) "Run script"
 *     Workbook    = any dummy .xlsx (host only)
 *     fileName    = the document's file name (with extension)
 *     content     = joined TagStrip outputs + raw _rels/*.rels text
 *                   (xlsx lane: the WorkbookDump output; rels n/a)
 *     defaultRepo = e.g. "ArcGISPro/ps-location-referencing"
 *   Returns a typed object — ids[] and docRevision surface as
 *   structured dynamic content in the designer, no Parse JSON needed.
 */
interface IdRef {
  repo: string;
  number: number;
  source: string; // "url" | "filename" | "hashtag"
}

interface IdResult {
  ids: IdRef[];
  docRevision: string; // normalized "V<n>", or "" when absent
  idCount: number;
}

function main(
  workbook: ExcelScript.Workbook,
  fileName: string,
  content: string,
  defaultRepo: string
): IdResult {
  const ids: IdRef[] = [];
  const byKey: { [key: string]: boolean } = {};   // repo|number
  const byNumber: { [num: number]: boolean } = {}; // any strong claim

  function add(repo: string, num: number, source: string): void {
    if (!(num > 0 && num <= 999999)) {
      return;
    }
    const key = repo + "|" + String(num);
    if (byKey[key]) {
      return;
    }
    byKey[key] = true;
    byNumber[num] = true;
    ids.push({ repo: repo, number: num, source: source });
  }

  // --- base name: strip any path, then the extension --------------
  const baseName = fileName
    .replace(/^.*[\\/]/, "")
    .replace(/\.[^.]+$/, "");

  // --- 1) url source (strongest — carries its own repo) -----------
  const urlRe = /devtopia\.esri\.com\/([^\/\s"'<>\)\]]+)\/([^\/\s"'<>\)\]]+)\/issues\/(\d+)/gi;
  let m: RegExpExecArray | null;
  while ((m = urlRe.exec(content)) !== null) {
    add(m[1] + "/" + m[2], parseInt(m[3], 10), "url");
  }

  // --- 2) filename source ------------------------------------------
  // v1.1: (a) a url-claimed NUMBER suppresses the filename source the
  // same way it suppresses hashtags — filenames are repo-blind, urls
  // are authoritative (kills the cross-repo phantom, e.g. 16343);
  // (b) 5-digit filename ids route to the ExB repo: ps-location-
  // referencing lives in 2-4 digits, ExperienceBuilder-Web-Extensions
  // in 5 (revisit if ps-location-referencing ever crosses 10000).
  const EXB_REPO = "Beijing-R-D-Center/ExperienceBuilder-Web-Extensions";
  const fm = baseName.match(/^(\d{2,5})[-_]/);
  if (fm) {
    const num = parseInt(fm[1], 10);
    if (!byNumber[num]) {
      add(fm[1].length === 5 ? EXB_REPO : defaultRepo, num, "filename");
    }
  }

  // --- 3) hashtag source (weak: skip any number already claimed) --
  const hashRe = /#(\d{3,5})\b/g;
  while ((m = hashRe.exec(content)) !== null) {
    const num = parseInt(m[1], 10);
    if (!byNumber[num]) {
      add(defaultRepo, num, "hashtag");
    }
  }

  // --- doc revision from the base filename ------------------------
  const rv = baseName.match(/[Vv](\d{1,2})$/);
  const docRevision = rv ? "V" + rv[1] : "";

  return { ids: ids, docRevision: docRevision, idCount: ids.length };
}
