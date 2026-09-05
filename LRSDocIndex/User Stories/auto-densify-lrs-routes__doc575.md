# Auto-Densify LRS Routes

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Source** | [DensifyLRSRoutes (1).pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/DensifyLRSRoutes%20(1).pptx>) |
| **Edited** | 2023-03-21 01:58 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Auto-Densify LRS Routes"
source_file: "DensifyLRSRoutes (1).pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/DensifyLRSRoutes%20(1).pptx"
doc_id: 575
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2023-03-21T01:58:27Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["densify", "routes", "lrs administrator", "geodesic densify", "vertex spacing"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":570,"file":"auto-densify-lrs-routes__doc570.md","s":8.501},{"doc":536,"file":"append-routes-sparse-vertex-check-user-story__doc536.md","s":4.499},{"doc":591,"file":"identify-routes-with-vertex-spacing-issues__doc591.md","s":4.343},{"doc":569,"file":"migrate-lrs-to-new-gdb-tool__doc569.md","s":3.558},{"doc":574,"file":"migrate-lrs-to-new-geodatabase-tool__doc574.md","s":3.398}]
```
-->

## Summary

This document describes a user story for creating a Python tool with a UI to automatically densify LRS routes geodetically. The tool targets LRS administrators needing to reduce vertex spacing in routes to support LRS operations, working with both projected and unprojected datasets. It includes requirements for testing, automation, and documentation.

## Related documents

<!-- related:begin -->
- [Auto-Densify LRS Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-densify-lrs-routes__doc570.md>) — similar text 0.97 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:570 -->
- [Append Routes Sparse Vertex Check User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/append-routes-sparse-vertex-check-user-story__doc536.md>) — similar text 0.44 · 1 title word · same kind/surface/folder <!-- rel:536 -->
- [Identify Routes with Vertex Spacing Issues](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/identify-routes-with-vertex-spacing-issues__doc591.md>) — similar text 0.45 · 1 title word · same kind/surface/folder <!-- rel:591 -->
- [Migrate LRS to New GDB Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/migrate-lrs-to-new-gdb-tool__doc569.md>) — similar text 0.43 · same kind/surface/folder <!-- rel:569 -->
- [Migrate LRS to New Geodatabase Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/migrate-lrs-to-new-geodatabase-tool__doc574.md>) — similar text 0.43 · same kind/surface/folder <!-- rel:574 -->
<!-- related:end -->

---

## Slide 1 — Auto-Densify LRS Routes

## Slide 2 — User Story

As an LRS administrator, I need to be able to densify my LRS routes, so that I can ensure the vertices are close enough together to work with all LRS operations.

Persona
LRS Administrator: This user is responsible for the initial configuration and ongoing changes to the configuration of the LRS.  For pipeline operators with unprojected data with very large distances between vertices, some of our operations aren’t working as expected.  One of the solutions is to densify their LRS routes in an unprojected dataset to ensure that there is not too much space between each vertex on the route.  Users have been reluctant to do this on their own, so building a tool that does it for them would be a better solution.

## Slide 3 — Auto-Densify LRS Routes

Create a python tool (needs to have a UI interface) to support automatically geodetically densify LRS routes
The tool should work with Pro 3.1, but will not be released with any Pro release
Follow the pattern of the ArcMap to Pro migration tools (Github repo, etc.)
The parameters for the tool UI would be:

  - LRS Network
  - Densification Distance
The Densification Distance should default to whatever is suggested based on the Spatial Reference of the LRS Network, but the user can change it to a different value if they want
When executed, the tool would do the following:

  - Find routes in the LRS Network that have vertices spaced further apart than the Densification Distance provided
  - Run the Geodesic Densify on those routes with the densification distance from the input
  - Use the output of the Geodesic Densify to replace the existing routes (and centerlines associated with those routes as well)
  - Regenerate any LRS Events that are impacted by the updated routes

## Slide 4 — Testing

Test on at least one RH, APR, and APR-UN dataset
Test on 1 projected dataset and the remaining cases on unprojected datasets
Test with a mix of fgdb and sde (traditional and branch versioned) as the input
Test with a variety of distances (suggested and user defined)

## Slide 5 — Automation

Automate this via python

## Slide 6 — Documentation

The tool will be released independently of Pro; however, we should still document it in the same format as other GP tools within Pro
When the tool is released via GitHub, we should include this documentation with the tool on the site

## Slide 7 — Assignment

Story Points:
Dev:
PE:
