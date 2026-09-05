# SLD OI Widget Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 63 · Test Plan · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [SLD_OI_TestPlan1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/SLD_OI_TestPlan1.pptx>) |
| **People** | author Rahul Rakshit · PE — · dev — |
| **Edited** | 2026-03-05 21:43 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | oriented imagery · photolog · image points · straight line diagram · marker synchronization · search tolerance · image coverage |
| **Tools** | Straight Line Diagram · Oriented Imagery |

## Summary

Test plan for the Straight Line Diagram (SLD) integration with Oriented Imagery (OI) layers. It covers verification of image point display, photolog coverage, marker synchronization between SLD, map, and OI widget, and interaction behaviors such as clicking and double-clicking on photo points.

## Related documents

<!-- related:begin -->
- [Spike: Oriented Imagery widget integration with Dynamic Segmentation/SLD](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/oriented-imagery-widget-integration-with-dynseg-sld.md>) — similar text 0.17 · 2 title words · 1 filename word · same surface <!-- rel:145 s=4.979 -->
- [SLD Devices and Junctions Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/29867-sld-devices-and-junctions.md>) — similar text 0.14 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:28 s=4.142 -->
- [Test Plan: Include Intersections in SLD](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/test-plan-include-intersections-in-sld__doc71.md>) — similar text 0.20 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:71 s=3.657 -->
- [Dynamic Segmentation widget integration with Oriented Imagery](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynseg-widget-integration-with-oriented-imagery.md>) — similar text 0.30 · 1 title word · 1 filename word · same surface <!-- rel:76 s=3.242 -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/29871-dynseg-widget.md>) — similar text 0.17 · 1 title word · same surface <!-- rel:57 s=2.965 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Straight Line Diagram](https://www.google.com/search?q=%22Straight%20Line%20Diagram%22+site%3Adoc.esri.com) · [Oriented Imagery](https://www.google.com/search?q=%22Oriented%20Imagery%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 <!-- slide 1 -->

### Slide 2 <!-- slide 2 -->

Datasets

- WV photolog data containing 1+ OI layers
- Multiple images with different camera angles at each location
- Create a separate OI hosted service for each camera angle

## Test Cases

### TC-U01 — The OI layer shows at the top row of the SLD <!-- src: LLM · slide 2 · Tests bullet 1 -->
- **Group:** Tests

### TC-U02 — The image points on the SLD are symbolized using the webmap <!-- src: LLM · slide 2 · Tests bullet 2 -->
- **Group:** Tests

### TC-U03 — SLD shows the OI layer selected in the OI widget <!-- src: LLM · slide 2 · Tests bullet 3 -->
- **Group:** Tests
- **Case:** Verify that the SLD shows the OI layer selected in the OI widget. Multiple OI layers can be present but only one is shown in the SLD

### TC-U04 — Image off the route is located at the nearest point on the route <!-- src: LLM · slide 2 · Tests bullet 4 -->
- **Group:** Tests
- **Case:** If an image does not fall on the route, then it gets located at the nearest point on the route in the SLD

### TC-U05 — Each image under the search tolerance is shown in its SLD <!-- src: LLM · slide 2 · Tests bullet 5 -->
- **Group:** Tests
- **Case:** Verify that each image that falls under the search tolerance from the route is shown in its SLD

### TC-U06 — Photolog coverage shown with shading, gaps shown as empty <!-- src: LLM · slide 2 · Tests bullet 6 -->
- **Group:** Tests
- **Case:** The photolog coverage is shown with a shading and sections without coverage are shown as empty
  - What if the coverage comes from images located near another route

### TC-U07 — Clicking a location on the route shows marker in SLD and image in OI <!-- src: LLM · slide 2 · Tests bullet 7 -->
- **Group:** Tests
- **Case:** When a location on the route is clicked, then a marker shows up in the SLD, and the OI also shows the image associated to that location (if present)

### TC-U08 — Clicking a location on the SLD shows markers, image and highlight <!-- src: LLM · slide 2 · Tests bullet 8 -->
- **Group:** Tests
- **Case:** When a location on the SLD is clicked a marker shows up there and at the corresponding location in the Map, and the OI also shows the image associated to that location. The corresponding photo that shows the location of the marker in the OI widget is highlighted on the OI layer row.

### TC-U09 — Opening/advancing OI images moves marker and highlights image <!-- src: LLM · slide 2 · Tests bullet 9 -->
- **Group:** Tests
- **Case:** Opening/advancing images on the OI widget should move the marker on the Map, show the marker on the SLD and highlight the corresponding image in the SLD.

### TC-U10 — Double clicking a photo point in the SLD shows no properties <!-- src: LLM · slide 2 · Tests bullet 10 -->
- **Group:** Tests
- **Case:** Double clicking at one of photo points in the SLD does not show any properties. It just pans/zooms to that location on the map and the corresponding image is shown in the OI viewer.
