# Identify Routes with Vertex Spacing Issues

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Source** | [IdentifyRouteswithVertexSpacingIssues.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/IdentifyRouteswithVertexSpacingIssues.pptx>) |
| **Edited** | 2023-03-20 20:32 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Identify Routes with Vertex Spacing Issues"
source_file: "IdentifyRouteswithVertexSpacingIssues.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/IdentifyRouteswithVertexSpacingIssues.pptx"
doc_id: 591
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2023-03-20T20:32:46Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["vertex spacing", "routes", "python tool", "unprojected data", "tolerance", "feature class"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":571,"file":"identify-routes-with-vertex-spacing-issues-test-plan__doc571.md","s":6.065},{"doc":536,"file":"append-routes-sparse-vertex-check-user-story__doc536.md","s":4.86},{"doc":575,"file":"auto-densify-lrs-routes__doc575.md","s":4.343},{"doc":570,"file":"auto-densify-lrs-routes__doc570.md","s":4.331},{"doc":574,"file":"migrate-lrs-to-new-geodatabase-tool__doc574.md","s":4.136}]
```
-->

## Summary

This document describes a user story for creating a Python tool with a UI to identify routes with vertex spacing issues in unprojected data within the LRS. The tool will analyze route segments for vertex spacing too wide for spatial reference tolerances and output feature classes and summary tables for LRS administrators to address. Testing and documentation plans are also outlined.

## Related documents

<!-- related:begin -->
- [Identify Routes with Vertex Spacing Issues – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/identify-routes-with-vertex-spacing-issues-test-plan__doc571.md>) — similar text 0.28 · 5 title words · 4 filename words · same surface <!-- rel:571 -->
- [Append Routes Sparse Vertex Check User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/append-routes-sparse-vertex-check-user-story__doc536.md>) — similar text 0.44 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:536 -->
- [Auto-Densify LRS Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-densify-lrs-routes__doc575.md>) — similar text 0.45 · 1 title word · same kind/surface/folder <!-- rel:575 -->
- [Auto-Densify LRS Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-densify-lrs-routes__doc570.md>) — similar text 0.45 · 1 title word · same kind/surface/folder <!-- rel:570 -->
- [Migrate LRS to New Geodatabase Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/migrate-lrs-to-new-geodatabase-tool__doc574.md>) — similar text 0.43 · same kind/surface/folder <!-- rel:574 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Tolerance and resolution settings for the LRS](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/tolerance-and-resolution-settings-for-the-lrs.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)
<!-- docs:end -->

---

## Slide 1 — Identify Routes with Vertex Spacing Issues

## Slide 2 — User Story

As an LRS administrator, I need to be able to identify routes with vertex spacing issues, so I can modify those routes, so they work as expected within the LRS.

Persona
LRS Administrator: This user is responsible for the initial configuration and ongoing changes to the configuration of the LRS.  For pipeline operators with unprojected data with very large distances between vertices, some of our operations aren’t working as expected.  To assist these users with determining how widespread this vertex spacing issue is in their data, we need to build a python tool that will identify these routes and provide a useable output for the LRS admin to act on to fix the problem routes (either via densification or changing the tolerance/resolution for the LRS).

## Slide 3 — Identify Routes with Vertex Spacing Issues

Create a python tool (needs to have a UI interface) to support identifying routes that have vertex spacing issues
The tool should work with Pro 3.1, but will not be released with any Pro release
Follow the pattern of the ArcMap to Pro migration tools (Github repo, etc.)
The parameters for the tool UI would be:

  - Input Routes (can either be an LRS Network or source routes, but must be a feature class)
When executed, the tool would do the following:

  - Iterate through the input routes feature class and find all route segments that have vertex spacing too wide for the spatial reference/tolerance/resolution
  - Determine which of these segments would also be too sparse at the following tolerance values: 1cm, 2cm, 3cm, and 10cm
The output from the tool would be:

  - A feature class which contains a record for each route with at least one segment with vertices that are too sparse (if a route has more than one segment, show a record for each segment that is too spaced) along with the attributes from the original feature
  - A text file (or table) which lists the number and percentage of routes with at least one segment that is too spaced apart at each of the tolerances listed above (1cm, 2cm, 3cm, and 10cm)
The tool shouldn’t execute if the input routes feature class is projected as this tool should only run against unprojected data

## Slide 4 — Testing

Test on at least one RH, APR, and APR-UN dataset
Test on 1 projected dataset (should fail) and the remaining cases on unprojected datasets
Test with a mix of fgdb and sde (traditional and branch versioned) for the source route
Test with a mix of LRS Network fc as the input as well as non LRS Network fc as the input

## Slide 5 — Automation

Automate this via python

## Slide 6 — Documentation

The tool will be released independently of Pro; however, we should still document it in the same format as other GP tools within Pro
When the tool is released via GitHub, we should include this documentation with the tool on the site

## Slide 7 — Assignment

Story Points:
Dev:
PE:
