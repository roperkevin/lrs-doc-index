# Densify and Regenerate LRS Routes Tool – Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 468 · Test Plan · Pro |
| **Product** | Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#5174](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5174) |
| **Source** | [DesifyRegenerateRoute_testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/DesifyRegenerateRoute_testplan.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE Claire Wang · dev Dan |
| **Edited** | 2023-10-15 02:53 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | densify · route regeneration · centerlines · conflict prevention · locks · fgdb · unprojected data |
| **Tools** | Densify and Regenerate LRS Routes |

## Summary

Test plan for the Densify and Regenerate LRS Routes Python tool with UI, covering parameter verification, execution behavior, positive and negative test cases, and error handling. The tool densifies route vertices based on a specified distance and regenerates impacted routes and events. Testing includes various distances, data types, conflict prevention, and version compatibility with ArcGIS Pro 2.9 and 3.1.

## Related documents

<!-- related:begin -->
- [Support Running AEB, Generate Routes, and Derive Event Measures as a Single Operation via the LR Pro Ribbon – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/5198-support-running-aeb-generate-routes-and-derive-event.md>) — similar text 0.15 · 1 title word · 1 filename word · same kind/surface/pe/folder <!-- rel:453 s=3.941 -->
- [Auto-Densify LRS Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-densify-lrs-routes-rh-apr-un-2023-05.md>) — similar text 0.49 · 2 title words · same surface <!-- rel:570 s=3.288 -->
- [Auto-Densify LRS Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-densify-lrs-routes-rh-apr-un-2023-03.md>) — similar text 0.47 · 2 title words · same surface <!-- rel:575 s=3.23 -->
- [Identify Routes with Vertex Spacing Issues – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/identify-routes-with-vertex-spacing-issues.md>) — similar text 0.23 · 1 title word · same kind/surface/folder <!-- rel:571 s=2.773 -->
- [Identify Routes with Vertex Spacing Issues](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/identify-routes-with-vertex-spacing-issues.md>) — similar text 0.27 · 1 title word · same surface <!-- rel:591 s=2.563 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html) · [Release locks with the Release Locks tool](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/release-locks.html)

_No page matched:_ [Densify and Regenerate LRS Routes](https://www.google.com/search?q=%22Densify%20and%20Regenerate%20LRS%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Densify and regenerate LRS routes tool – Test Plan <!-- slide 1 -->

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5174

PE: Claire Wang
Dev: Dan

### Slide 2 <!-- slide 2 -->

Data:

- The tool is a Python tool with a UI
  - 2 parameters: LRS Network and Densification Distance (unit is meters)
  - Test with a variety of distances (suggested and user defined)
- Test with Pro 2.9 and 3.1
- Test with FGDB only
- Test with APRUN and APR data
- Test Conflict Prevention, with and without locks
- Test with unprojected data
- No selection of def queries, it runs against the entire network
Documentation

- The tool will be released independently of Pro; however, we should still document it in the same format as other GP tools within Pro
- When the tool is released via GitHub, we should include this documentation with the tool on the site (can refer to how Unified Pipeline Tools is released)
- Make sure to mention that there should be no one else making edits in the system when this tool is run (?)
- Mention the tool only runs against fgdb
Automation
N/A

### Slide 3 <!-- slide 3 -->

Verification

- Verify the tool pane
  - 2 parameters: LRS Network and Densification Distance (unit is meters)
  - The Densification Distance has a default value that is suggested based on the Spatial Reference of the LRS Network (using the formula from the white paper that includes the 10% buffer),
  - the user can enter a different value in Densification Distance
  - If the user changes the Densification Distance to a number larger than was suggested, provide a warning that some routes may still have vertices that are too sparse
- Verify when executed, the tool would do the following:
  - Find routes in the LRS Network that have vertices spaced further apart than the Densification Distance provided
  - Densify the centerlines that correspond to each section within each route with the densification distance from the input
  - Use the output of the Geodesic Densify to replace the existing centerlines (this should not invoke cartographic realignment)
  - Regenerate the LRS Network routes that were impacted by the densification of centerlines
  - Regenerate any LRS Events that are impacted by the updated routes
- Verify the tool does not work with FS or egdb (error message)
- Verify the tool does not work with projected data (error message)
- Verify the tool fails if there are locks on the routes (error message)
- Verify the output which is a text file that indicates routes that had segments densified
- Verify when the tool fails, tool will roll back and nothing should be changed in source data
- Verify that after densifying routes, route editing tools that fail before will now proceed

## Test Cases

### TC-P01 — Line network with all routes having sparse vertices (1) <!-- src: S4 · slide 4 · Positive cases · 1 -->

- **Case:** Line network with all routes having sparse vertices; default Densification Distance

### TC-P02 — Line network with all routes having sparse vertices (2) <!-- src: S4 · slide 4 · Positive cases · 2 -->

- **Case:** Line network with all routes having sparse vertices; Densification Distance slightly smaller than default

### TC-P03 — Line network with all routes having sparse vertices (3) <!-- src: S4 · slide 4 · Positive cases · 3 -->

- **Case:** Line network with all routes having sparse vertices; Densification Distance larger than default (will see warning)

### TC-P04 — Line network with some routes having sparse vertices (1) <!-- src: S4 · slide 4 · Positive cases · 4 -->

- **Case:** Line network with some routes having sparse vertices; default Densification Distance

### TC-P05 — Line network with some routes having sparse vertices (2) <!-- src: S4 · slide 4 · Positive cases · 5 -->

- **Case:** Line network with some routes having sparse vertices; Densification Distance slightly smaller than default

### TC-P06 — Line network with some routes having sparse vertices (3) <!-- src: S4 · slide 4 · Positive cases · 6 -->

- **Case:** Line network with some routes having sparse vertices; Densification Distance larger than default (will see warning)

### TC-P07 — Line network with no route having sparse vertices <!-- src: S4 · slide 4 · Positive cases · 7 -->

- **Case:** Line network with no route having sparse vertices; default Densification Distance

### TC-P08 — Conflict Prevention – no lock exist <!-- src: S4 · slide 4 · Positive cases · 8 -->

- **Case:** Conflict Prevention – no lock exist: Line network with some routes having sparse vertices; default Densification Distance

### TC-P09 — Do one test to verify the densification was at an acceptable distance <!-- src: S4 · slide 4 · Positive cases · 9 -->

### TC-P10 — Cancel tool while running. Tool will roll back and nothing should be changed <!-- src: S4 · slide 4 · Positive cases · 10 -->

- **Case:** Cancel tool while running. Tool will roll back and nothing should be changed in source data

### TC-N01 — Run in Pro 3.1 and 2.9. <!-- src: S4 · slide 5 · Negative cases and verify error messages · 1 -->

- **Group:** And Verify Error Messages
- We're going to certify it to work against Pro 2.9/3.1.  Whoever the dev who works on it can tell us if we'll be able to have it work on other versions. If not, create error messages for versions we don’t support

### TC-N02 — Tool does not support versioned data <!-- src: S4 · slide 5 · Negative cases and verify error messages · 2 -->

- **Group:** And Verify Error Messages
- We should give an error as soon as they select a FS/EGDB versioned layer (or not show full tool pane at all)

### TC-N03 — Run on a projected network <!-- src: S4 · slide 5 · Negative cases and verify error messages · 3 -->

- **Group:** And Verify Error Messages

### TC-N04 — Run with Conflict Prevention where some routes have locks <!-- src: S4 · slide 5 · Negative cases and verify error messages · 4 -->

- **Group:** And Verify Error Messages

### TC-N05 — Run tool while someone else is making edits in the system <!-- src: S4 · slide 5 · Negative cases and verify error messages · 5 -->

- **Group:** And Verify Error Messages

## Other content

### Slide 4 — Positive cases <!-- slide 4 -->

Test all the route editing tools before and after densifying routes (expected behavior is that they error out before, and proceed after)
