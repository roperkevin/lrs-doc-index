# 64-bit OID Support for Route Editing Tools

| Field | Value |
| --- | --- |
| **Doc** | 483 · Test Plan · Pro |
| **Product** | Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#5013](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5013) |
| **Source** | [5013-64BitOIDforRouteEditingTools_TestPlan_V1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5013-64BitOIDforRouteEditingTools_TestPlan_V1.pptx>) · rev V1 |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2023-10-20 21:06 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | route editing · 64 bit oid · centerlines · calibration points · cartographic realignment · retire route · realign route · reassign route · reverse route |
| **Tools** | Create Route · Extend Route · Retire Route · Realign Route · Reassign Route · Reverse Route · Calibration Editing · Cartographic Realignment |

## Summary

Test plan for supporting 64-bit OID values in LRS OID fields for route editing tools. Covers positive test cases for creating, extending, realigning, reassigning, reversing, calibrating, cartographic realignment, and retiring routes with OID values greater than 2.1 billion. Tests include various network types and datasets.

## Related documents

<!-- related:begin -->
- [64-bit OID in LRS Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-route-editing-tools.md>) — similar text 0.46 · 5 title words · 3 filename words · same surface <!-- rel:502 s=7.349 -->
- [Spike: 64-bit OID in LRS Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-editing-tools.md>) — similar text 0.40 · 4 title words · 2 filename words · same surface <!-- rel:515 s=6.314 -->
- [64 bit OID LRS Event Editing Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5507-64-bit-oid-lrs-event-editing-tools.md>) — similar text 0.31 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:481 s=5.812 -->
- [64 bit OID Other Pro LR Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5510-64-bit-oid-other-pro-lr-tools.md>) — similar text 0.31 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:482 s=5.371 -->
- [64-bit OID in LRS Event Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-event-editing-tools.md>) — similar text 0.35 · 4 title words · 3 filename words · same surface <!-- rel:504 s=5.285 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Reverse routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reverse-routes.html) · [Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-cartographic-realignment.html) · [Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html)

_No page matched:_ [Calibration Editing](https://www.google.com/search?q=%22Calibration%20Editing%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Test Cases

### TC-P01 — Create a route using multiple centerlines <!-- src: S4 · slide 1 · Positive Tests: Create Route · 1 -->

- **Group:** Create Route

### TC-P02 — Create a complex route <!-- src: S4 · slide 1 · Positive Tests: Create Route · 2 -->

- **Group:** Create Route

### TC-P03 — Create a route at the start/end of an existing line <!-- src: S4 · slide 1 · Positive Tests: Create Route · 3 -->

- **Group:** Create Route

### TC-P04 — Extend a route at the beginning <!-- src: S4 · slide 1 · Positive Tests: Extend Route · 1 -->

- **Group:** Extend Route

### TC-P05 — Extend a route at the end <!-- src: S4 · slide 1 · Positive Tests: Extend Route · 2 -->

- **Group:** Extend Route

### TC-P06 — Extend a route, turning it into a complex route <!-- src: S4 · slide 1 · Positive Tests: Extend Route · 3 -->

- **Group:** Extend Route

### TC-P07 — Realign a route <!-- src: S4 · slide 2 · Positive Tests: Realign Route · 1 -->

- **Group:** Realign Route

### TC-P08 — Realign multiple routes on a line <!-- src: S4 · slide 2 · Positive Tests: Realign Route · 2 -->

- **Group:** Realign Route

### TC-P09 — Realign a route, assigning the abandoned portion to a new route <!-- src: S4 · slide 2 · Positive Tests: Realign Route · 3 -->

- **Group:** Realign Route

### TC-P10 — Reassign a route(s) to a new route <!-- src: S4 · slide 2 · Positive Tests: Reassign Route · 1 -->

- **Group:** Reassign Route

### TC-P11 — Reassign a route(s) to an adjacent route on an adjacent/same line <!-- src: S4 · slide 2 · Positive Tests: Reassign Route · 2 -->

- **Group:** Reassign Route

### TC-P12 — Reassign a route(s) to an existing/new line <!-- src: S4 · slide 2 · Positive Tests: Reassign Route · 3 -->

- **Group:** Reassign Route

### TC-P13 — Reverse a route <!-- src: S4 · slide 2 · Positive Tests: Reverse Route · 1 -->

- **Group:** Reverse Route

### TC-P14 — Reverse a route in the middle of a line <!-- src: S4 · slide 2 · Positive Tests: Reverse Route · 2 -->

- **Group:** Reverse Route

### TC-P15 — Reverse multiple routes on a line <!-- src: S4 · slide 2 · Positive Tests: Reverse Route · 3 -->

- **Group:** Reverse Route

### TC-P16 — Edit the calibration of a route at the beginning of a route <!-- src: S4 · slide 2 · Positive Tests: Calibration Editing · 1 -->

- **Group:** Calibration Editing

### TC-P17 — Edit the calibration of a route at the middle of a route <!-- src: S4 · slide 2 · Positive Tests: Calibration Editing · 2 -->

- **Group:** Calibration Editing

### TC-P18 — Edit the calibration of a route at the end of a route <!-- src: S4 · slide 2 · Positive Tests: Calibration Editing · 3 -->

- **Group:** Calibration Editing

### TC-P19 — Perform Cartographic Realignment on a simple route <!-- src: S4 · slide 2 · Positive Tests: Cartographic Realignment · 1 -->

- **Group:** Cartographic Realignment

### TC-P20 — Perform Cartographic Realignment on a complex route <!-- src: S4 · slide 2 · Positive Tests: Cartographic Realignment · 2 -->

- **Group:** Cartographic Realignment

### TC-P21 — Retire a whole route <!-- src: S4 · slide 2 · Positive Tests: Retire Route · 1 -->

- **Group:** Retire Route

### TC-P22 — Retire multiple routes on a line <!-- src: S4 · slide 2 · Positive Tests: Retire Route · 2 -->

- **Group:** Retire Route

### TC-P23 — Retire a complex route turning it into a simple route <!-- src: S4 · slide 2 · Positive Tests: Retire Route · 3 -->

- **Group:** Retire Route

## Other content

### Slide 1 — Devtopia Issue <!-- slide 1 -->

64-bit OID Support for Route Editing Tools

**Notes**
- Need to support actual 64-bit values in LRS OID fields for users who have more than 2.1 billion records in their LRS networks. For testing, this includes anything related to route editing, such as the LRS network, centerlines, CPs, Centerline Sequence Table, etc.
- Test on mix of line and nonline networks, including postmile. Do a few tests with UNAPR dataset
- Test with FGDB, DC , and FS
- For testing, we will have OIDs greater than 2.1 billion. The creation of 2.1 billion records is not necessary as we can edit the geodatabase properties to force values above 2.1 billion.
- Ensure all schema elements impacted by each route edit have 64-bit OID value and can handle this value
- Test each tool 2-3 times, test breadth not depth. Tools to test:
- Create Route
- Extend Route
- Retire Route
- Realign Route
- Reassign Route
- Reverse Route
- Calibration editing
- Cartographic Realignment
- Test 64-bit OID values can be in any related schema element:
- Centerline Sequence Table
- Centerlines
- Calibration Points
- Network Feature Classes
- Edit Log
- Locks Table
- Conflict Prevention
