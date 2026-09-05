# Migrate LRS to New Geodatabase Tool

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Source** | [MigrateLRStoNewGDB (1).pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/MigrateLRStoNewGDB%20(1).pptx>) |
| **Edited** | 2023-03-20 16:03 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Migrate LRS to New Geodatabase Tool"
source_file: "MigrateLRStoNewGDB (1).pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/MigrateLRStoNewGDB%20(1).pptx"
doc_id: 574
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2023-03-20T16:03:31Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["lrs administrator", "geodatabase migration", "tolerance", "resolution", "feature dataset", "feature classes", "attribute rules", "python tool", "unprojected data"]
tools: ["Generate Routes", "Generate Events", "Generate Intersections"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":569,"file":"migrate-lrs-to-new-gdb-tool__doc569.md","s":11.343},{"doc":591,"file":"identify-routes-with-vertex-spacing-issues__doc591.md","s":4.58},{"doc":575,"file":"auto-densify-lrs-routes__doc575.md","s":3.839},{"doc":570,"file":"auto-densify-lrs-routes__doc570.md","s":3.425},{"doc":696,"file":"update-intersection-referent-tool-user-story__doc696.md","s":2.84}]
```
-->

## Summary

This document describes a user story for creating a Python tool with a UI to migrate an existing Linear Referencing System (LRS) to a new geodatabase with different tolerance and resolution settings. The tool will copy all relevant datasets, verify domains and rules, refresh the LRS, and regenerate routes, events, and intersections. Testing and automation plans are included, along with documentation guidelines.

## Related documents

<!-- related:begin -->
- [Migrate LRS to New GDB Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/migrate-lrs-to-new-gdb-tool__doc569.md>) — similar text 1.00 · 2 title words · 3 filename words · same kind/surface/folder <!-- rel:569 -->
- [Identify Routes with Vertex Spacing Issues](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/identify-routes-with-vertex-spacing-issues__doc591.md>) — similar text 0.43 · same kind/surface/folder <!-- rel:591 -->
- [Auto-Densify LRS Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-densify-lrs-routes__doc575.md>) — similar text 0.43 · same kind/surface/folder <!-- rel:575 -->
- [Auto-Densify LRS Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-densify-lrs-routes__doc570.md>) — similar text 0.42 · same kind/surface/folder <!-- rel:570 -->
- [Update Intersection Referent Tool User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-intersection-referent-tool-user-story__doc696.md>) — similar text 0.24 · 1 title word · same kind/surface/folder <!-- rel:696 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Tolerance and resolution settings for the LRS](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/tolerance-and-resolution-settings-for-the-lrs.html) · [Create a template for an LRS feature count data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-feature-count-data-product.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [Generate Routes](https://www.google.com/search?q=%22Generate%20Routes%22+site%3Adoc.esri.com) · [Generate Events](https://www.google.com/search?q=%22Generate%20Events%22+site%3Adoc.esri.com) · [Generate Intersections](https://www.google.com/search?q=%22Generate%20Intersections%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Migrate LRS to new GDB tool

## Slide 2 — User Story

As an LRS administrator, I need to be able to migrate my LRS into a new geodatabase while changing the tolerance and resolution, so I can modify those tolerance and resolution settings to better support my unprojected data.

Persona
LRS Administrator: This user is responsible for the initial configuration and ongoing changes to the configuration of the LRS.  For pipeline operators with unprojected data with very large distances between vertices, some of our operations aren’t working as expected.  One of the solutions is to change the tolerance/resolution settings of the feature classes that are part of the LRS to allow wider spacing of vertices.  This user story will build a tool/script that allows users to move their LRS to a new gdb while also changing the tolerance/resolution settings.

## Slide 3 — Migrate LRS to new GDB tool

Create a python tool (needs to have a UI interface) to support migrating an existing LRS to a new GDB with different tolerance/resolutions
The tool should work with Pro 3.1, but will not be released with any Pro release
Follow the pattern of the ArcMap to Pro migration tools (Github repo, etc.)
The parameters for the tool UI would be:

  - Current LRS gdb (can be fgdb or sde)
  - New LRS gdb (can be a fgdb or sde)
  - XY resolution*
  - XY tolerance*
  - Z resolution*
  - Z tolerance*
  - M resolution*
  - M tolerance*
*Populated with the existing value from the current LRS gdb, but can be changed by the user
The values users set for the XYZM resolution/tolerance would need to be verified as valid settings within the gdb

## Slide 4 — Migrate LRS to new GDB tool

When executed, the tool would do the following:

  - Create copies of all the feature dataset, feature classes and tables that participate in the LRS from the existing gdb into the new gdb.  The feature dataset and feature classes would need to be created with the new tolerance/resolution settings the user provides
  - Verify all coded value domains, range domains, subtypes, and attribute rules are copied to the new gdb
  - Ensure the controller dataset also copies to the new gdb
  - If the new tolerance/resolution settings aren’t acknowledged by the LRS, refresh the LRS to ensure it reflects the new settings
  - Run Generate Routes on all the LRS Networks
  - Run Generate Events on all the LRS Events
  - Run Generate Intersections on the LRS Intersections (if present)
Once completed, the new gdb should be an exact replica of the existing LRS gdb but with different tolerance/resolution settings

## Slide 5 — Testing

Test on at least one RH, APR, and APR-UN dataset
Test on 1 projected dataset and the remaining cases on unprojected datasets
Test with a mix of fgdb and sde (traditional and branch versioned)
Test at least one case where the new tolerance/resolution settings are invalid
Verify with at least 1 dataset that it can be moved into an sde, branch versioned, have services published and do some basic LRS editing operations (Create, Realign, Add Event)

## Slide 6 — Automation

Automate this via python

## Slide 7 — Documentation

The tool will be released independently of Pro; however, we should still document it in the same format as other GP tools within Pro
When the tool is released via GitHub, we should include this documentation with the tool on the site

## Slide 8 — Assignment

Story Points:
Dev:
PE:
