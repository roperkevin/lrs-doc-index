/**
 * WorkbookDump v1.1 — xlsx → markdown (the free xlsx extraction lane)
 * ------------------------------------------------------------------
 * Dumps every worksheet's used range as a GFM pipe table:
 *
 *   ## Sheet: <name>
 *   | header | header |
 *   | --- | --- |
 *   | cell | cell |
 *
 * v1.1 (was: tab-separated rows): rows render as pipe tables — the
 * first row of each sheet is treated as the header row (true for the
 * schedule/data-template sheets this corpus holds; a single-row sheet
 * still gets a separator so the table stays valid GFM). Pipes inside
 * cells are escaped, cells are capped at CELLCAP chars ("…" appended
 * when cut), rows are padded to the sheet's table width, and rows
 * wider than COLCAP columns are cut with a final "…(+N more)" cell.
 *
 * getTexts() returns RENDERED cell text, so formulas come out as
 * their displayed values (e.g. =ROW()-ROW($A$2) -> "1") — exactly
 * what the indexing prompt should see. Newlines inside a cell are
 * flattened to spaces so one output line = one sheet row; trailing
 * empty cells are trimmed per row.
 *
 * maxCells guards the ~5 MB Run-script return limit: any sheet that
 * would push the cumulative cell count past it is skipped with a
 * visible [truncated: ...] marker instead of failing the run.
 *
 * Power Automate wiring: unchanged from v1.0 (same name, signature and
 * return shape).
 *   Excel Online (Business) "Run script"
 *     Workbook = THE TARGET .xlsx ITSELF (unlike TagStrip /
 *                RegexExtract, this script runs against the document
 *                being indexed — pass the file identifier from the
 *                sweep loop; Location can be a SharePoint site)
 *     maxCells = optional, default 60000
 */
const COLCAP = 24;
const CELLCAP = 300;

function main(
  workbook: ExcelScript.Workbook,
  maxCells: number = 60000
): string {
  const out: string[] = [];
  let used = 0;

  for (const ws of workbook.getWorksheets()) {
    out.push("## Sheet: " + ws.getName());

    const rng = ws.getUsedRange();
    if (!rng) {
      out.push("(empty)");
      out.push("");
      continue;
    }

    const rows = rng.getRowCount();
    const cols = rng.getColumnCount();
    if (used + rows * cols > maxCells) {
      out.push(
        "[truncated: sheet skipped, " + String(rows) + "x" + String(cols) + " cells]"
      );
      out.push("");
      continue;
    }
    used += rows * cols;

    const texts = rng.getTexts();
    // clean cells and trim trailing empties per row, then size the table
    const grid: string[][] = [];
    for (const row of texts) {
      let cells = row.map((c) => {
        let v = c.replace(/\r?\n/g, " ").replace(/\|/g, "\\|");
        if (v.length > CELLCAP) v = v.slice(0, CELLCAP) + "…";
        return v;
      });
      let last = cells.length;
      while (last > 0 && cells[last - 1] === "") last--;
      grid.push(cells.slice(0, last));
    }
    let width = 0;
    for (const r of grid) if (r.length > width) width = r.length;
    const over = width > COLCAP ? width - COLCAP : 0;
    if (over > 0) width = COLCAP;

    for (let i = 0; i < grid.length; i++) {
      const r = grid[i].slice(0, width);
      while (r.length < width) r.push("");
      // when any row overflows COLCAP every row gets the extra column,
      // so all rows keep the header's column count (valid GFM)
      if (over > 0) r.push(grid[i].length > COLCAP ? "…(+" + String(grid[i].length - COLCAP) + " more)" : "");
      out.push("| " + r.join(" | ") + " |");
      if (i === 0) {
        const sep: string[] = [];
        for (let k = 0; k < width + (over > 0 ? 1 : 0); k++) sep.push("---");
        out.push("| " + sep.join(" | ") + " |");
      }
    }
    out.push("");
  }

  return out.join("\n").trim();
}
