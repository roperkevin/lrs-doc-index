# 64-bit OID in LRS Event Editing Tools

| Field | Value |
| --- | --- |
| **Doc** | 504 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [64bitOIDLRSEventEditingTools.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/64bitOIDLRSEventEditingTools.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2023-09-07 23:12 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | 64 bit oid · event editing tools · event editing · network feature classes · event feature classes · point event · line event · spanning event |
| **Tools** | Add Single Pt · Add Multiple Pt · Add Single Ln · Add Multiple Ln · Split Event · Merge Events · Dynamic Segmentation table |

## Summary

This document describes the need to support 64-bit OID values in the LRS event editing tools to enable LRS editors to handle large datasets with 64-bit object identifiers. It outlines the required tool updates, testing approach, and automation plans to ensure compatibility with 64-bit OIDs across event editing operations and schema elements.

## Related documents

<!-- related:begin -->
- [64 bit OID LRS Event Editing Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5507-64-bit-oid-lrs-event-editing-tools.md>) — similar text 0.56 · 5 title words · 4 filename words · same surface <!-- rel:481 s=8.331 -->
- [64-bit OID in LRS Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-route-editing-tools.md>) — similar text 0.94 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:502 s=8.064 -->
- [64-bit OID in other LRS Pro tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-other-lrs-pro-tools.md>) — similar text 0.85 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:501 s=6.865 -->
- [Spike: 64-bit OID in LRS Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-editing-tools.md>) — similar text 0.43 · 4 title words · 2 filename words · same surface/folder <!-- rel:515 s=6.493 -->
- [64-bit OID in LRS GP tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/64-bit-oid-in-lrs-gp.md>) — similar text 0.88 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:505 s=6.289 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Merge events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-events.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [Add Single Pt](https://www.google.com/search?q=%22Add%20Single%20Pt%22+site%3Adoc.esri.com) · [Add Multiple Pt](https://www.google.com/search?q=%22Add%20Multiple%20Pt%22+site%3Adoc.esri.com) · [Add Single Ln](https://www.google.com/search?q=%22Add%20Single%20Ln%22+site%3Adoc.esri.com) · [Add Multiple Ln](https://www.google.com/search?q=%22Add%20Multiple%20Ln%22+site%3Adoc.esri.com) · [Split Event](https://www.google.com/search?q=%22Split%20Event%22+site%3Adoc.esri.com) · [Dynamic Segmentation table](https://www.google.com/search?q=%22Dynamic%20Segmentation%20table%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### 64-bit OID in LRS Event editing tools <!-- slide 1 -->
Spike

### User Story <!-- slide 2 -->
As an LRS editor, I need to ensure 64-bit values in my OID field work in the event editing tools, so that I can continue to make event edits to my LRS.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the event edits based on these documents.  As the size of the LRS and the number of edits grows over time, users will encounter 64-bit values for their OIDs.  We need to ensure the software correctly handles these in the LRS event editing tools.

## Acceptance Criteria
### 64-bit OID LRS event editing tools <!-- slide 3 -->
- Remove the down casting that ArcGIS Pro implemented for 64bit OIDs in the LRS event editing tools to support actual 64-bit values in the schema items updated by the tools
  - Add Single Pt
  - Add Multiple Pt
  - Add Single Ln
  - Add Multiple Ln
  - Split Event
  - Merge Events
  - Dynamic Segmentation table
- Ensure the tools can handle 64-bit OID values in any schema element that is read/updated
  - Network feature classes
  - Event feature classes

## Testing
<!-- slide 4 -->
- Test on a mix of line and non line networks with all 3 event types (point, line, spanning)
- Test on each event editing operation (breadth, not depth)
- Ensure all schema elements impacted by each event edit has a 64-bit OID value

## Automation
<!-- slide 5 -->
- Create an automated test (ex. 64-bit OID event editing tools) that automates one test case for each event edit tool

## Documentation
<!-- slide 6 -->
- No documentation updates for this story

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
