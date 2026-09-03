/**
 * config.mjs v1.0 — shared config guards for the local jobs
 * (sweep.mjs, curate.mjs, gantt.mjs). Two jobs and counting parse the
 * same config.json; a missing section used to die with a bare
 * TypeError deep inside loadConfig, and an old Node died with a
 * confusing "--experimental-strip-types" flag error before any code
 * ran. Both now fail with one plain-language message naming the fix.
 */

/**
 * The pipeline runs the repo's .ts scripts via Node's type stripping,
 * which exists from 22.6 (flagged) and is default-on from 23.6. Fail
 * with instructions instead of the flag error a too-old Node gives.
 */
export function assertNodeVersion(min = [22, 6]) {
  const parts = String(process.versions.node).split(".").map(Number);
  const [maj, minr] = [parts[0] || 0, parts[1] || 0];
  if (maj > min[0] || (maj === min[0] && minr >= min[1])) return;
  throw new Error(
    `Node ${process.versions.node} is too old for this pipeline — ` +
    `type stripping needs Node ${min[0]}.${min[1]}+ (LTS 22 works). ` +
    "Install a current Node LTS on this machine and re-run."
  );
}

/**
 * Validate that the parsed config carries every required dotted path,
 * aggregating ALL misses into one message (nobody wants to fix keys
 * one failed run at a time). `required` is an array of dotted paths,
 * e.g. "sharePoint.lists.docIndex". Empty strings count as missing.
 */
export function validateConfig(cfg, required, configPath) {
  const missing = [];
  for (const dotted of required) {
    let v = cfg;
    for (const seg of dotted.split(".")) {
      v = v && typeof v === "object" ? v[seg] : undefined;
    }
    if (v === undefined || v === null || v === "") missing.push(dotted);
  }
  if (missing.length) {
    throw new Error(
      `config ${configPath || ""} is missing required key(s): ` +
      missing.join(", ") +
      " — compare against local/config.sample.json (Local_Setup.md §4)"
    );
  }
}

/** The config keys the sweep cannot run without. */
export const SWEEP_REQUIRED = [
  "sharePoint.hostname",
  "sharePoint.sitePath",
  "sharePoint.lists.docIndex",
  "sharePoint.lists.keywords",
  "sharePoint.lists.docIds",
  "sharePoint.lists.docKeywords",
  "sharePoint.lists.docLinks",
  "sharePoint.lists.sourceLibrary",
  "paths.sourceLibrary",
  "paths.sidecarLibrary",
];

/** The config keys the curation job cannot run without. */
export const CURATE_REQUIRED = [
  "sharePoint.hostname",
  "sharePoint.sitePath",
  "sharePoint.lists.keywords",
];
