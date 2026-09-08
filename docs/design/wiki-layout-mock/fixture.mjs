// Builds a sidecar library of 14 test plans + config, for the layout mockups.
import fs from "node:fs"; import path from "node:path";
const root = process.argv[2];
const lib = path.join(root, "lib"), work = path.join(root, "work");
fs.mkdirSync(path.join(lib, "Test Plans"), { recursive: true });
fs.mkdirSync(path.join(lib, "User Stories"), { recursive: true });
fs.mkdirSync(work, { recursive: true });
const RH = "Roads & Highways", PR = "Pipeline Referencing", ADM = "Address Data Management";
export const PLANS = [
  ["4855-merge-plan", "Merge Events Test Plan", 17, "Pro", [RH], "3.8", ["Merge Events", "Apply Event Behaviors"], "2026-08-01 10:00", "Mac Christmas", "Claire Wang",
   "Covers merging line events across routes, with the lock conflict case. Verifies that measures, referents and event behaviors are preserved when events on concurrent routes are merged, and that a held lock refuses the edit."],
  ["5102-realign-route-plan", "Route Realignment Test Plan", 21, "Pro", [RH], "3.7", ["Realign Route", "Apply Event Behaviors"], "2026-07-22 15:30", "Claire Wang", "Claire Wang",
   "Realigns a route to a new geometry and checks every registered event behavior — stay put, move, retire, snap — for point and line events on the realigned span."],
  ["5211-carto-realign-plan", "Cartographic Realignment Test Plan", 23, "Pro", [RH], "3.8", ["Cartographic Realignment", "Realign Route"], "2026-08-19 09:05", "Dan Ortiz", "Claire Wang",
   "Exercises cartographic realignment, where the route geometry changes but measures do not, on single routes and on routes with concurrencies."],
  ["4990-retire-reassign-plan", "Retire and Reassign Routes", 12, "Pro", [RH, PR], "3.6", ["Retire Route", "Reassign Route"], "2026-05-30 11:45", "Mac Christmas", "Priya Nair",
   "Retires whole routes and partial spans, reassigns a span to a neighbouring route, and checks event behaviors and the resulting time slices on both products."],
  ["5340-event-editor-widget-plan", "Event Editor Widget Test Plan", 31, "Experience Builder", [RH], "11.4", ["Event Editor", "Add Point Events", "Add Line Events"], "2026-08-28 16:20", "Sam Reed", "Claire Wang",
   "The Experience Builder Event Editor widget end to end: adding, editing and retiring point and line events, attribute sets, and the offset and referent inputs."],
  ["5017-append-events-plan", "Append Events Regression", 14, "Pro", [PR], "3.9", ["Append Events"], "2026-06-12 08:10", "Priya Nair", "Priya Nair",
   "Appends event records from tables, layers and feature classes into existing LRS event feature classes, covering field mapping, load date and the overwrite option."],
  ["5288-concurrencies-plan", "Calculate Route Concurrencies Test Plan", 26, "Pro", [RH], "3.8", ["Calculate Route Concurrencies"], "2026-08-11 13:00", "Dan Ortiz", "Claire Wang",
   "Reports concurrent route sections for networks with dominance rules, gaps and calibration changes, and checks the output table against a hand-calculated set."],
  ["5401-calibration-points-plan", "Generate Calibration Points Test Plan", 33, "Pro", [RH, PR], "3.10", ["Generate Calibration Points", "Generate Routes"], "2026-09-02 17:40", "Sam Reed", "Priya Nair",
   "Generates calibration points from route geometry with and without existing points, for looped routes, branched routes and routes with measure gaps."],
  ["5150-dynseg-plan", "Dynamic Segmentation Test Plan", 19, "Pro", [RH], "3.9", ["Make Route Event Layer", "Overlay Route Events"], "2026-07-08 10:15", "Claire Wang", "Claire Wang",
   "Dynamic segmentation over point and line event tables: route event layers, overlays, the treatment of measure gaps and of events beyond the route's calibrated extent."],
  ["5366-rest-operations-plan", "LRS REST Operations Test Plan", 30, "REST", [RH], "11.5", ["geometryToMeasure", "measureToGeometry", "translate"], "2026-08-30 12:00", "Dan Ortiz", "Priya Nair",
   "The Linear Referencing Service operations against a published network: request and response JSON, tolerance, temporal view date, and the error shapes for unknown routes."],
  ["4855-conflict-locks-plan", "Conflict Prevention Locks Test Plan", 18, "Pro", [RH, PR], "3.8", ["Conflict Prevention", "Create Route"], "2026-07-30 14:25", "Mac Christmas", "Claire Wang",
   "Lock acquisition and release around route and event edits: locks held by another user, locks on concurrent routes, and the lock dialog's messages."],
  ["5420-address-ranges-plan", "Address Range Maintenance Test Plan", 35, "Pro", [ADM], "3.10", ["Configure Address Feature Classes"], "2026-09-05 09:30", "Sam Reed", "Priya Nair",
   "Address Data Management ranges kept in step with route edits: extend, realign and retire, and the site address points that follow the range."],
  ["5060-update-measures-plan", "Update Measures From LRS Test Plan", 15, "Pro", [PR], "3.7", ["Update Measures From LRS"], "2026-06-25 11:00", "Priya Nair", "Priya Nair",
   "Updates the measures of external event layers from the LRS after calibration edits, including events that no longer locate."],
  ["4801-create-extend-plan", "Create Route and Extend Route Test Plan", 11, "Pro", [RH], "3.6", ["Create Route", "Extend Route"], "2025-12-15 16:00", "Claire Wang", "Claire Wang",
   "Creating routes from selected centerlines and extending routes at either end, with the calibration options and the resulting measures checked."],
];
const cases = (n) => Array.from({ length: n }, (_, i) =>
  `### TC-P${String(i + 1).padStart(2, "0")} — Case ${i + 1} { #tc-p${String(i + 1).padStart(2, "0")} }\n- **Group:** Normal Routes\n- **Steps:**\n  - [ ] 1. Do the thing.\n- **Expected Result:** It works.\n`).join("\n");
for (const [stem, title, id, surface, products, release, tools, edited, author, pe, summary] of PLANS) {
  const n = 6 + (id % 9);
  const md = `# ${title}

| Field | Value |
| --- | --- |
| **Doc** | ${id} · Test Plan · ${surface} |
| **Status** | Indexed |
| **Product** | ${products.join(" · ")} |
| **Release** | ${release} |
| **Source** | [${title}.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/${encodeURIComponent(title)}.pptx>) · rev V2 |
| **People** | author ${author} · PE ${pe} · dev — |
| **Edited** | ${edited} by ${author} |
| **Extracted** | 2026-09-06 · lane xmlstrip · format 3.1 · prompt v4.0.0 |
| **Keywords** | route · events |
| **Tools** | ${tools.join(" · ")} |

## Summary

${summary}

---

## Test Cases

${cases(n)}
`;
  fs.writeFileSync(path.join(lib, "Test Plans", stem + ".md"), md);
}
fs.writeFileSync(path.join(lib, "_Index.md"), "# Browse\n");
fs.writeFileSync(path.join(root, "config.json"), JSON.stringify({ paths: { sidecarLibrary: lib, workDir: work }, wiki: { siteName: "LRS Docs" } }));
