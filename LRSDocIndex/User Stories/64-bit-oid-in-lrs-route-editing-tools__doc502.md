# 64-bit OID in LRS Route Editing Tools

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [64bitOIDLRSRouteEditingTools.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/64bitOIDLRSRouteEditingTools.pptx>) |
| **Edited** | 2023-09-07 23:02 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "64-bit OID in LRS Route Editing Tools"
source_file: "64bitOIDLRSRouteEditingTools.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/64bitOIDLRSRouteEditingTools.pptx"
doc_id: 502
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2023-09-07T23:02:15Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["64 bit oid", "route editing tools", "centerlines", "calibration points", "network feature classes", "schema elements"]
tools: ["Create", "Extend", "Retire", "Realign", "Reassign", "Reverse", "Calibrate", "Cartographic Realignment"]
products: []
issues: []
related: [{"doc":504,"file":"64-bit-oid-in-lrs-event-editing-tools__doc504.md","s":8.064},{"doc":515,"file":"spike-64-bit-oid-in-lrs-editing-tools__doc515.md","s":7.76},{"doc":483,"file":"64-bit-oid-support-for-route-editing-tools__doc483.md","s":7.349},{"doc":501,"file":"64-bit-oid-in-other-lrs-pro-tools__doc501.md","s":7.255},{"doc":505,"file":"64-bit-oid-in-lrs-gp-tools__doc505.md","s":6.077}]
```
-->

## Summary

This document describes the need to support 64-bit OID values in the LRS route editing tools to enable route edits on large LRS datasets. It outlines the required route editing operations and schema elements that must handle 64-bit OIDs, testing approaches, and automation plans for validation.

## Related documents

<!-- related:begin -->
- [64-bit OID in LRS Event Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-event-editing-tools__doc504.md>) — similar text 0.94 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:504 -->
- [Spike: 64-bit OID in LRS Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-64-bit-oid-in-lrs-editing-tools__doc515.md>) — similar text 0.49 · 4 title words · 2 filename words · same surface/folder <!-- rel:515 -->
- [64-bit OID Support for Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/64-bit-oid-support-for-route-editing-tools__doc483.md>) — similar text 0.46 · 5 title words · 3 filename words · same surface <!-- rel:483 -->
- [64-bit OID in other LRS Pro tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-other-lrs-pro-tools__doc501.md>) — similar text 0.83 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:501 -->
- [64-bit OID in LRS GP tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/64-bit-oid-in-lrs-gp-tools__doc505.md>) — similar text 0.86 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:505 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Reverse routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reverse-routes.html) · [Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-cartographic-realignment.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [Calibrate](https://www.google.com/search?q=%22Calibrate%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — 64-bit OID in LRS Route editing tools

Spike

## Slide 2 — User Story

As an LRS editor, I need to ensure 64-bit values in my OID field work in the route editing tools, so that I can continue to make route edits to my LRS.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  As the size of the LRS and the number of edits grows over time, users will encounter 64-bit values for their OIDs.  We need to ensure the software correctly handles these in the LRS route editing tools.

## Slide 3 — 64-bit OID LRS route editing tools

Remove the down casting that ArcGIS Pro implemented for 64bit OIDs in the LRS route editing tools to support actual 64-bit values in the schema items updated by the tools

  - Create
  - Extend
  - Retire
  - Realign
  - Reassign
  - Reverse
  - Calibrate
  - Cartographic Realignment
Ensure the tools can handle 64-bit OID values in any schema element that is read/updated

  - Centerline sequence table
  - Centerlines
  - Calibration points
  - Network feature classes

## Slide 4 — Testing

Test on a mix of line and non line networks
Test on each route editing operation (breadth, not depth)
Ensure all schema elements impacted by each route edit has a 64-bit OID value

## Slide 5 — Automation

Create an automated test (ex. 64-bit OID route editing tools) that automates one test case for each route edit tool

## Slide 6 — Documentation

No documentation updates for this story

## Slide 7 — Assignment

Story Points:
Dev:
