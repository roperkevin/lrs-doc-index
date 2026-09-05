# SLD OI Widget Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Experience Builder |
| **Release** | — |
| **Source** | [SLD_OI_TestPlan1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/SLD_OI_TestPlan1.pptx>) |
| **Edited** | 2026-03-05 21:43 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "SLD OI Widget Test Plan"
source_file: "SLD_OI_TestPlan1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/SLD_OI_TestPlan1.pptx"
doc_id: 63
doc_kind: "Test Plan"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Rahul Rakshit"
last_edited_by: "Rahul Rakshit"
last_edited: "2026-03-05T21:43:04Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["oriented imagery", "photolog", "image points", "straight line diagram", "marker synchronization", "search tolerance", "image coverage"]
tools: ["Straight Line Diagram", "Oriented Imagery"]
products: []
issues: []
related: [{"doc":145,"file":"spike-oriented-imagery-widget-integration-with-dynamic-segmentation-sld__doc145.md","s":4.979},{"doc":28,"file":"sld-devices-and-junctions-test-plan__doc28.md","s":4.142},{"doc":71,"file":"test-plan-include-intersections-in-sld__doc71.md","s":3.657},{"doc":76,"file":"dynamic-segmentation-widget-integration-with-oriented-imagery__doc76.md","s":3.242},{"doc":57,"file":"dynamic-segmentation-widget__doc57.md","s":2.965}]
```
-->

## Summary

Test plan for the Straight Line Diagram (SLD) integration with Oriented Imagery (OI) layers. It covers verification of image point display, photolog coverage, marker synchronization between SLD, map, and OI widget, and interaction behaviors such as clicking and double-clicking on photo points.

## Related documents

<!-- related:begin -->
- [Spike: Oriented Imagery widget integration with Dynamic Segmentation/SLD](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-oriented-imagery-widget-integration-with-dynamic-segmentation-sld__doc145.md>) — similar text 0.17 · 2 title words · 1 filename word · same surface <!-- rel:145 -->
- [SLD Devices and Junctions Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/sld-devices-and-junctions-test-plan__doc28.md>) — similar text 0.14 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:28 -->
- [Test Plan: Include Intersections in SLD](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/test-plan-include-intersections-in-sld__doc71.md>) — similar text 0.20 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:71 -->
- [Dynamic Segmentation widget integration with Oriented Imagery](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynamic-segmentation-widget-integration-with-oriented-imagery__doc76.md>) — similar text 0.30 · 1 title word · 1 filename word · same surface <!-- rel:76 -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/dynamic-segmentation-widget__doc57.md>) — similar text 0.17 · 1 title word · same surface <!-- rel:57 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Straight Line Diagram](https://www.google.com/search?q=%22Straight%20Line%20Diagram%22+site%3Adoc.esri.com) · [Oriented Imagery](https://www.google.com/search?q=%22Oriented%20Imagery%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

## Slide 2

Datasets

- WV photolog data containing 1+ OI layers
- Multiple images with different camera angles at each location
- Create a separate OI hosted service for each camera angle
Tests

- The OI layer shows at the top row of the SLD
- The image points on the SLD are symbolized using the webmap
- Verify that the SLD shows the OI layer selected in the OI widget. Multiple OI layers can be present but only one is shown in the SLD
- If an image does not fall on the route, then it gets located at the nearest point on the route in the SLD
- Verify that each image that falls under the search tolerance from the route is shown in its SLD
- The photolog coverage is shown with a shading and sections without coverage are shown as empty
  - What if the coverage comes from images located near another route
- When a location on the route is clicked, then a marker shows up in the SLD, and the OI also shows the image associated to that location (if present)
- When a location on the SLD is clicked a marker shows up there and at the corresponding location in the Map, and the OI also shows the image associated to that location. The corresponding photo that shows the location of the marker in the OI widget is highlighted on the OI layer row.
- Opening/advancing images on the OI widget should move the marker on the Map, show the marker on the SLD and highlight the corresponding image in the SLD.
- Double clicking at one of photo points in the SLD does not show any properties. It just pans/zooms to that location on the map and the corresponding image is shown in the OI viewer.
