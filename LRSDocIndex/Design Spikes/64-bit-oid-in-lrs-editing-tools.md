# Spike: 64-bit OID in LRS Editing Tools

| Field | Value |
| --- | --- |
| **Doc** | 515 · Design Spike · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike 64bitOIDLRSEditingTools.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%2064bitOIDLRSEditingTools.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2023-08-01 00:25 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | 64 bit oid · lrs editing tools · route editing · event editing · centerline sequence · calibration point · network feature class · event feature class |
| **Tools** | Create · Extend · Retire · Realign · Reassign · Reverse · Calibrate · Cartographic Realignment · Add Point · Add Line · Add Multi Point · Add Multi Line · Split Event · Merge Event · Dynamic Segmentation |

## Summary

Investigation of LRS editing tools' behavior when handling 64-bit OID values in various feature classes including centerline sequence, centerlines, calibration points, network, and event feature classes. Testing covers route editing tools such as Create, Extend, Retire, Realign, Reassign, Reverse, Calibrate, Cartographic Realignment, and event editing tools including Add Point, Add Line, Split Event, Merge Event, and Dynamic Segmentation. The goal is to identify which tools fail or do not work as expected with 64-bit OID values.

## Related documents

<!-- related:begin -->
- [64-bit OID in LRS Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-route-editing-tools.md>) — similar text 0.49 · 4 title words · 2 filename words · same surface/folder <!-- rel:502 s=7.76 -->
- [64-bit OID in LRS Event Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-event-editing-tools.md>) — similar text 0.43 · 4 title words · 2 filename words · same surface/folder <!-- rel:504 s=6.493 -->
- [64-bit OID Support for Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5013-64-bit-oid-support-for-route-editing-tools.md>) — similar text 0.40 · 4 title words · 2 filename words · same surface <!-- rel:483 s=6.314 -->
- [Spike: 64-bit OID in LRS GP and Pro Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-gp-and-pro-tools.md>) — similar text 0.74 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:518 s=5.889 -->
- [64 bit OID LRS Event Editing Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5507-64-bit-oid-lrs-event-editing-tools.md>) — similar text 0.38 · 4 title words · 2 filename words · same surface <!-- rel:481 s=5.354 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Reverse routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reverse-routes.html) · [Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-cartographic-realignment.html) · [Add calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/add-calibration-points.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [View centerline sequence table properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-centerline-sequence-table-properties.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [Calibrate](https://www.google.com/search?q=%22Calibrate%22+site%3Adoc.esri.com) · [Add Line](https://www.google.com/search?q=%22Add%20Line%22+site%3Adoc.esri.com) · [Add Multi Point](https://www.google.com/search?q=%22Add%20Multi%20Point%22+site%3Adoc.esri.com) · [Add Multi Line](https://www.google.com/search?q=%22Add%20Multi%20Line%22+site%3Adoc.esri.com) · [Split Event](https://www.google.com/search?q=%22Split%20Event%22+site%3Adoc.esri.com) · [Merge Event](https://www.google.com/search?q=%22Merge%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: 64-bit OID in LRS Editing tools

Spike

## Slide 2 — 64-bit OID LRS editing tools

- Investigate the LRS editing tools that don’t work as expected when encountering a 64-bit OID value (not just configured as 64-bit, but a 64-bit value)
- Test on LRS route editing tools (Create, Extend, Retire, Realign, Reassign, Reverse, Calibrate, Cartographic Realignment) with a 64-bit OID value for the centerline sequence table, centerlines, calibration point, and network feature classes
- Test on LRS event editing tools (Add Pt, Add Ln, Add Multi Pt, Add Multi Ln, Split Event, Merge Event, Dynamic Segmentation) with a 64-bit OID value for the network and event feature classes
- Report back with the following:
  - Which, if any, LRS editing tools don’t work when encountering a feature with a 64-bit OID

## Slide 3 — Assignment

Story Points:
Dev:
