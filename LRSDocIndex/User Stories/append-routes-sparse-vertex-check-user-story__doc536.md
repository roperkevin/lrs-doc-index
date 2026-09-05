# Append Routes Sparse Vertex Check User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Issue** | [arcgispro/ps-location-referencing#5058](https://devtopia.esri.com/arcgispro/ps-location-referencing/issues/5058) |
| **Source** | [AppendRoutesSparseVertexCheck.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AppendRoutesSparseVertexCheck.pptx>) |
| **Edited** | 2023-07-18 00:04 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Append Routes Sparse Vertex Check User Story"
source_file: "AppendRoutesSparseVertexCheck.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AppendRoutesSparseVertexCheck.pptx"
doc_id: 536
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2023-07-18T00:04:12Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["sparse vertex", "append routes", "densification", "gcs routes", "vertex spacing", "lrs network"]
tools: ["Append Routes"]
products: ["Pipeline Referencing", "Utility Network"]
issues: ["arcgispro/ps-location-referencing#5058"]
related: [{"doc":575,"file":"auto-densify-lrs-routes__doc575.md","s":5.102},{"doc":591,"file":"identify-routes-with-vertex-spacing-issues__doc591.md","s":4.854},{"doc":571,"file":"identify-routes-with-vertex-spacing-issues-test-plan__doc571.md","s":4.701},{"doc":570,"file":"auto-densify-lrs-routes__doc570.md","s":4.695},{"doc":768,"file":"support-vertical-segments-in-append-routes__doc768.md","s":4.131}]
```
-->

## Summary

Describes a user story for adding a sparse vertex check to the Append Routes geoprocessing tool in the LRS system. The check identifies GCS routes with vertices spaced too far apart and provides warnings and output recommendations for densification or tolerance adjustment. Testing, automation, and documentation updates are also outlined.

## Related documents

<!-- related:begin -->
- [Auto-Densify LRS Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-densify-lrs-routes__doc575.md>) — similar text 0.44 · 1 title word · same kind/surface/folder <!-- rel:575 -->
- [Identify Routes with Vertex Spacing Issues](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/identify-routes-with-vertex-spacing-issues__doc591.md>) — similar text 0.44 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:591 -->
- [Identify Routes with Vertex Spacing Issues – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/identify-routes-with-vertex-spacing-issues-test-plan__doc571.md>) — similar text 0.34 · 2 title words · 2 filename words · same surface <!-- rel:571 -->
- [Auto-Densify LRS Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-densify-lrs-routes__doc570.md>) — similar text 0.43 · 1 title word · same kind/surface/folder <!-- rel:570 -->
- [Support Vertical Segments in Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-segments-in-append-routes__doc768.md>) — similar text 0.18 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:768 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html)

_No page matched:_ [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Append Routes Sparse Vertex check

## Slide 2 — User Story

As an LRS Administrator, I want to know when my GCS routes being appended have vertices that are too sparse, so that I can determine how to best densify or alter my LRS to support these routes in the system.

Persona
LRS Administrator: This user is responsible for the initial configuration and ongoing changes to the configuration of the LRS.  For pipeline operators with unprojected data with very large distances between vertices, some of our operations aren’t working as expected.  Adding this check to Append Routes will give alert the user that there are routes being loaded that have this issue.  Users may choose to then use the other densification and changing tolerance tools we’re building to fix their routes/LRS.

## Slide 3 — Sparse Vertex check

Add a check to the Append Routes GP tool to find GCS routes that have too sparse of vertices

  - This check should only be activated when loading routes into an LRS Network in GCS
  - Use the same logic that was utilized in “Identify routes in a GCS with vertices too widely spaced apart story (https://devtopia.esri.com/arcgispro/ps-location-referencing/issues/5058)” to find any routes with too sparse of vertices
As routes are loaded that have too sparse of vertices, provide a warning message “RouteID/Name (routeID/name of route) has too sparse of vertices in one or more segments of the route.  See the output file for more information”.
Add a section to the output txt file the tool produces.  “Routes with too sparse of vertices in one or more segments.  It is recommended you densify these segments or alter the tolerance of the LRS to utilize the routes within the LRS using the <final name of the two tools used to densify routes and change tolerance of the LRS>.”  List the routeIDs/route names of the routes with segments with too sparse of vertices below.

## Slide 4 — Testing

Test on at least one APR, and APR-UN dataset
Test on 1 projected dataset (negative case) and the remaining cases on unprojected datasets
Test with a mix of fgdb and sde (traditional and branch versioned) as the source and the targets
Test with a variety of distances beyond the maximum vertex spacing
Load with a mix of routes that do and do not have too sparse of vertices

## Slide 5 — Automation

Add a case to the existing automation for the tool

## Slide 6 — Documentation

Add a usage note to the GP tool topic that discusses this check and points users toward the two tools to densify and change tolerance that are being built

## Slide 7 — Assignment

Story Points:
