# 64-bit OID in other LRS Pro tools

| Field | Value |
| --- | --- |
| **Doc** | 501 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [64bitOIDLRSProTools.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/64bitOIDLRSProTools.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2023-09-07 23:37 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | 64 bit oid · oid field · lrs editor · lrs pro tools · route edits · schema elements |
| **Tools** | Split Centerline · Locate Route and Measures · Identify · Translate · Rename Route · LRS Hierarchy · Attribute Sets |

## Summary

This document describes the need to support 64-bit OID values in various LRS Pro tools to ensure proper handling of large LRS datasets. It lists specific tools affected and outlines testing and automation plans to verify 64-bit OID support. No documentation updates are required for this story.

## Related documents

<!-- related:begin -->
- [64 bit OID Other Pro LR Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5510-64-bit-oid-other-pro-lr-tools.md>) — similar text 0.54 · 5 title words · 3 filename words · same surface <!-- rel:482 s=7.846 -->
- [64-bit OID in LRS Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-route-editing-tools.md>) — similar text 0.83 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:502 s=7.255 -->
- [64-bit OID in LRS Event Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-event-editing-tools.md>) — similar text 0.85 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:504 s=6.865 -->
- [64-bit OID in LRS GP tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/64-bit-oid-in-lrs-gp.md>) — similar text 0.87 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:505 s=6.661 -->
- [Spike: 64-bit OID in LRS GP and Pro Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-gp-and-pro-tools.md>) — similar text 0.46 · 4 title words · 1 filename word · same surface/folder <!-- rel:518 s=6.179 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html) · [Locate route and measures](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/locate-route-and-measures.html) · [Rename a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/rename-a-route.html) · [View the LRS hierarchy](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-the-lrs-hierarchy.html)

_No page matched:_ [Identify](https://www.google.com/search?q=%22Identify%22+site%3Adoc.esri.com) · [Translate](https://www.google.com/search?q=%22Translate%22+site%3Adoc.esri.com) · [Attribute Sets](https://www.google.com/search?q=%22Attribute%20Sets%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### 64-bit OID in other LRS Pro tools <!-- slide 1 -->
Spike

### User Story <!-- slide 2 -->
As an LRS editor, I need to ensure 64-bit values in my OID field work in the other LRS Pro tools, so that I can continue to utilize these various operations in my LRS.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  As the size of the LRS and the number of edits grows over time, users will encounter 64-bit values for their OIDs.  We need to ensure the software correctly handles these in the other LRS Pro tools.

## Acceptance Criteria
### 64-bit OID other LRS Pro tools <!-- slide 3 -->
- Remove any down casting implemented for 64bit OIDs in the LRS GP tools to support actual 64-bit values in the schema items updated by the tools
  - Split Centerline
  - Locate Route and Measures
  - Identify
  - Translate
  - Rename Route
  - LRS Hierarchy
  - Attribute Sets

## Testing
<!-- slide 4 -->
- Test on each tool (breadth, not depth)
- Ensure all schema elements impacted by each operation has a 64-bit OID value

## Automation
<!-- slide 5 -->
- Automate the tools that have been previously automated in a single test

## Documentation
<!-- slide 6 -->
- No documentation updates for this story

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
