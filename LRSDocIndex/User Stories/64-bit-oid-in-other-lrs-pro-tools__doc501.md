# 64-bit OID in other LRS Pro tools

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [64bitOIDLRSProTools.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/64bitOIDLRSProTools.pptx>) |
| **Edited** | 2023-09-07 23:37 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "64-bit OID in other LRS Pro tools"
source_file: "64bitOIDLRSProTools.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/64bitOIDLRSProTools.pptx"
doc_id: 501
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2023-09-07T23:37:35Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["64 bit oid", "oid field", "lrs editor", "lrs pro tools", "route edits", "schema elements"]
tools: ["Split Centerline", "Locate Route and Measures", "Identify", "Translate", "Rename Route", "LRS Hierarchy", "Attribute Sets"]
products: []
issues: []
related: [{"doc":482,"file":"64-bit-oid-other-pro-lr-tools-test-plan__doc482.md","s":7.846},{"doc":502,"file":"64-bit-oid-in-lrs-route-editing-tools__doc502.md","s":7.255},{"doc":504,"file":"64-bit-oid-in-lrs-event-editing-tools__doc504.md","s":6.865},{"doc":505,"file":"64-bit-oid-in-lrs-gp-tools__doc505.md","s":6.661},{"doc":518,"file":"spike-64-bit-oid-in-lrs-gp-and-pro-tools__doc518.md","s":6.179}]
```
-->

## Summary

This document describes the need to support 64-bit OID values in various LRS Pro tools to ensure proper handling of large LRS datasets. It lists specific tools affected and outlines testing and automation plans to verify 64-bit OID support. No documentation updates are required for this story.

## Related documents

<!-- related:begin -->
- [64 bit OID Other Pro LR Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/64-bit-oid-other-pro-lr-tools-test-plan__doc482.md>) — similar text 0.54 · 5 title words · 3 filename words · same surface <!-- rel:482 -->
- [64-bit OID in LRS Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-route-editing-tools__doc502.md>) — similar text 0.83 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:502 -->
- [64-bit OID in LRS Event Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-event-editing-tools__doc504.md>) — similar text 0.85 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:504 -->
- [64-bit OID in LRS GP tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/64-bit-oid-in-lrs-gp-tools__doc505.md>) — similar text 0.87 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:505 -->
- [Spike: 64-bit OID in LRS GP and Pro Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-64-bit-oid-in-lrs-gp-and-pro-tools__doc518.md>) — similar text 0.46 · 4 title words · 1 filename word · same surface/folder <!-- rel:518 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html) · [Locate route and measures](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/locate-route-and-measures.html) · [Rename a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/rename-a-route.html) · [View the LRS hierarchy](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-the-lrs-hierarchy.html)

_No page matched:_ [Identify](https://www.google.com/search?q=%22Identify%22+site%3Adoc.esri.com) · [Translate](https://www.google.com/search?q=%22Translate%22+site%3Adoc.esri.com) · [Attribute Sets](https://www.google.com/search?q=%22Attribute%20Sets%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — 64-bit OID in other LRS Pro tools

Spike

## Slide 2 — User Story

As an LRS editor, I need to ensure 64-bit values in my OID field work in the other LRS Pro tools, so that I can continue to utilize these various operations in my LRS.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  As the size of the LRS and the number of edits grows over time, users will encounter 64-bit values for their OIDs.  We need to ensure the software correctly handles these in the other LRS Pro tools.

## Slide 3 — 64-bit OID other LRS Pro tools

Remove any down casting implemented for 64bit OIDs in the LRS GP tools to support actual 64-bit values in the schema items updated by the tools

  - Split Centerline
  - Locate Route and Measures
  - Identify
  - Translate
  - Rename Route
  - LRS Hierarchy
  - Attribute Sets

## Slide 4 — Testing

Test on each tool (breadth, not depth)
Ensure all schema elements impacted by each operation has a 64-bit OID value

## Slide 5 — Automation

Automate the tools that have been previously automated in a single test

## Slide 6 — Documentation

No documentation updates for this story

## Slide 7 — Assignment

Story Points:
Dev:
