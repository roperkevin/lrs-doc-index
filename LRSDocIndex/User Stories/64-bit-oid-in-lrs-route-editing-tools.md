# 64-bit OID in LRS Route Editing Tools

| Field | Value |
| --- | --- |
| **Doc** | 502 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [64bitOIDLRSRouteEditingTools.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/64bitOIDLRSRouteEditingTools.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2023-09-07 23:02 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | 64 bit oid · route editing tools · centerlines · calibration points · network feature classes · schema elements |
| **Tools** | Create · Extend · Retire · Realign · Reassign · Reverse · Calibrate · Cartographic Realignment |

## Summary

This document describes the need to support 64-bit OID values in the LRS route editing tools to enable route edits on large LRS datasets. It outlines the required route editing operations and schema elements that must handle 64-bit OIDs, testing approaches, and automation plans for validation.

## Related documents

<!-- related:begin -->
- [64-bit OID in LRS Event Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-event-editing-tools.md>) — similar text 0.94 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:504 s=8.064 -->
- [Spike: 64-bit OID in LRS Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-editing-tools.md>) — similar text 0.49 · 4 title words · 2 filename words · same surface/folder <!-- rel:515 s=7.76 -->
- [64-bit OID Support for Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5013-64-bit-oid-support-for-route-editing-tools.md>) — similar text 0.46 · 5 title words · 3 filename words · same surface <!-- rel:483 s=7.349 -->
- [64-bit OID in other LRS Pro tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-other-lrs-pro-tools.md>) — similar text 0.83 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:501 s=7.255 -->
- [64-bit OID in LRS GP tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/64-bit-oid-in-lrs-gp.md>) — similar text 0.86 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:505 s=6.077 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Reverse routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reverse-routes.html) · [Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-cartographic-realignment.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [Calibrate](https://www.google.com/search?q=%22Calibrate%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### 64-bit OID in LRS Route editing tools <!-- slide 1 -->
Spike

### User Story <!-- slide 2 -->
As an LRS editor, I need to ensure 64-bit values in my OID field work in the route editing tools, so that I can continue to make route edits to my LRS.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  As the size of the LRS and the number of edits grows over time, users will encounter 64-bit values for their OIDs.  We need to ensure the software correctly handles these in the LRS route editing tools.

## Acceptance Criteria
### 64-bit OID LRS route editing tools <!-- slide 3 -->
- Remove the down casting that ArcGIS Pro implemented for 64bit OIDs in the LRS route editing tools to support actual 64-bit values in the schema items updated by the tools
  - Create
  - Extend
  - Retire
  - Realign
  - Reassign
  - Reverse
  - Calibrate
  - Cartographic Realignment
- Ensure the tools can handle 64-bit OID values in any schema element that is read/updated
  - Centerline sequence table
  - Centerlines
  - Calibration points
  - Network feature classes

## Testing
<!-- slide 4 -->
- Test on a mix of line and non line networks
- Test on each route editing operation (breadth, not depth)
- Ensure all schema elements impacted by each route edit has a 64-bit OID value

## Automation
<!-- slide 5 -->
- Create an automated test (ex. 64-bit OID route editing tools) that automates one test case for each route edit tool

## Documentation
<!-- slide 6 -->
- No documentation updates for this story

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
