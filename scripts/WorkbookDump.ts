/**
 * WorkbookDump — xlsx → plain text (the free xlsx extraction lane)
 * ------------------------------------------------------------------
 * Dumps every worksheet's used range as:
 *
 *   ## Sheet: <name>
 *   cell \t cell \t cell
 *   ...
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
 * Power Automate wiring:
 *   Excel Online (Business) "Run script"
 *     Workbook = THE TARGET .xlsx ITSELF (unlike TagStrip /
 *                RegexExtract, this script runs against the document
 *                being indexed — pass the file identifier from the
 *                sweep loop; Location can be a SharePoint site)
 *     maxCells = optional, default 60000
 */
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
    for (const row of texts) {
      const cells = row.map((c) => c.replace(/\r?\n/g, " "));
      out.push(cells.join("\t").replace(/\t+$/, ""));
    }
    out.push("");
  }

  return out.join("\n").trim();
}
