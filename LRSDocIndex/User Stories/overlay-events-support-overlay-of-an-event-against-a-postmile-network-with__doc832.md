# Overlay Events: Support overlay of an event against a Postmile network with routes within routes

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Issue** | [ArcGISPro/ps-location-referencing#1453](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/1453) |
| **Source** | [OverlayPostmileRoutewithinRoute.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/OverlayPostmileRoutewithinRoute.pptx>) |
| **Edited** | 2020-03-10 21:49 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Overlay Events: Support overlay of an event against a Postmile network with routes within routes"
source_file: "OverlayPostmileRoutewithinRoute.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/OverlayPostmileRoutewithinRoute.pptx"
doc_id: 832
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-03-10T21:49:29Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["postmile network", "route within route", "overlay events", "dynamic segmentation", "measures", "shapes", "routes", "event overlay"]
tools: ["Overlay Events GP tool"]
products: ["Roads & Highways"]
issues: ["ArcGISPro/ps-location-referencing#1453"]
related: [{"doc":831,"file":"translate-events-support-translation-of-an-event-to-a-network-with-postmile__doc831.md","s":9.075},{"doc":799,"file":"support-complex-route-shapes-in-overlay-events-gp-tool__doc799.md","s":5.071},{"doc":765,"file":"support-vertical-route-segments-in-overlay-events-gp-tool__doc765.md","s":4.553},{"doc":344,"file":"update-address-range-information-in-overlay-events-and-query-attribute-sets__doc344.md","s":3.718},{"doc":392,"file":"consider-point-events-in-query-attribute-set-and-overlay-events__doc392.md","s":3.703}]
```
-->

## Summary

User story for overlaying events against a postmile network with a route within route scenario to ensure correct measures, route IDs, dates, and shapes in the output feature class or table. Includes testing scenarios for various route within route conditions and gaps.

## Related documents

<!-- related:begin -->
- [Translate Events: Support translation of an event to a network with Postmile routes within routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/translate-events-support-translation-of-an-event-to-a-network-with-postmile__doc831.md>) — similar text 0.61 · 6 title words · 3 filename words · same kind/surface/folder <!-- rel:831 -->
- [Support Complex Route Shapes in Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-overlay-events-gp-tool__doc799.md>) — similar text 0.38 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:799 -->
- [Support Vertical Route Segments in Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-route-segments-in-overlay-events-gp-tool__doc765.md>) — similar text 0.33 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:765 -->
- [Update Address Range Information in Overlay Events and Query Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-address-range-information-in-overlay-events-and-query-attribute-sets__doc344.md>) — similar text 0.10 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:344 -->
- [Consider Point Events in Query Attribute Set and Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/consider-point-events-in-query-attribute-set-and-overlay-events__doc392.md>) — similar text 0.22 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:392 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Methods for calibrating routes with physical gaps](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/methods-for-calibrating-routes-with-physical-gaps.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html) · [Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-shapes.html)

_No page matched:_ [Overlay Events GP tool](https://www.google.com/search?q=%22Overlay%20Events%20GP%20tool%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Overlay Events: Support overlay of an event against a Postmile network with routes within routes

User Story

## Slide 2 — User Story

As a Roads and Highways user at Caltrans, I need to be able to overlay events against a postmile network where the event would fall along a route with a route within route scenario so that the measures and shapes in the output feature class/table are correct and accurate.

## Slide 3 — Route with Route in Overlay Events

![Measured route diagram drawn from the slide's own shapes.](../media/doc72_slide3.svg)

In the overlay events GP tool, choosing events to be dynamically segmented against a postmile network with a route within route scenario needs to be supported.
When an event is overlaid against a postmile network and the from and to routeIDs would be on the same route, with at least one other route between the two parts of the from/to route, the following should occur:

  - The correct From RouteID, To RouteID, From Measure, To Measure, and From/To Dates should be applied to the output record
  - The correct shape should be built (if the output format is a feature class), which begins/ends at the correct locations on the route, with the shape encompassing the entire path between those two points on the postmile line
If the input of the tool has multiple event records that will result in additional slicing so a single output record no longer reaches across the route within route scenario, the output records should still have the correct RouteIDs, Measures, Dates, and Shapes
R1 (100)  R2 (200)  R3 (300)   R1 (100)    R2 (200)
0                  5  5                 10  10                15  15                  20   10.001        15
R2,8     R3,12              R1,17  R1,18    R2,11 R2,12
Input events on non line network

Overlaid events again a postmile network (route within route scenario)
 R3,12       R1,17        R1,18  R2,11

## Slide 4 — Testing

Verify the previous test cases from https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/1453 still work
Test the following scenarios:

  - One or more events overlaid against a postmile route where From/To RouteIDs are on the same route without any gaps
  - One or more events overlaid against a postmile route where From/To RouteIDs are on the same route with a physical gap (without any routes filling the gap)
  - One or more events overlaid against a postmile route where From/To RouteIDs are on the same route with a route within route scenario (at least one other route on the same line between the From/To locations)
  - One or more events overlaid against a postmile route where From/To RouteIDs are on the same route with a route within route scenario (at least one other route on the same line between the From/To locations), but the segmentation results in shapes that don’t span across the route within route scenario
  - One or more events overlaid against a postmile route where From/To RouteIDs are on the same route with a route within route scenario, but the route between the From/To locations in on a different line (edge case that might not exist in the Caltrans data)

## Slide 5 — Assignment

Story Points:
Dev:
PE:
