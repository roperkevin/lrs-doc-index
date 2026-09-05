# 64 bit OID GP Tools – Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 467 · Test Plan · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#5509](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5509) |
| **Source** | [64bitOIDGPTools_testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/64bitOIDGPTools_testplan.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE Claire Wang · dev Michael |
| **Edited** | 2023-11-03 22:20 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | 64 bit oid · geoprocessing tools · event measures · routes · intersections · calibration points · network feature classes |
| **Tools** | Create LRS from existing dataset · Create LRS Network from existing dataset · Create LRS Event from existing dataset · Create LRS Intersection from existing dataset · Append Events · Append Routes · Apply Event Behaviors · Calculate Intersecting Route Measures · Calculate Route Concurrencies · Delete Routes · Derive Event Measures · Generate CP · Generate Events · Generate Intersections · Generate Routes · Overlay Events · Remove Overlapping Centerlines · Reverse Line Orders · Translate Event Measures |

## Summary

Test plan for verifying geoprocessing tools support for 64-bit OID values in schema elements across various LRS datasets and networks. Covers positive test cases for creating, appending, generating, and calculating routes, events, intersections, and measures, as well as verification of tool behavior with different network types and data sources. Includes validation of schema integrity and selection/query support.

## Related documents

<!-- related:begin -->
- [64 bit OID Other Pro LR Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5510-64-bit-oid-other-pro-lr-tools.md>) — similar text 0.50 · 3 title words · 2 filename words · same kind/surface/pe/folder <!-- rel:482 s=6.913 -->
- [64 bit OID LRS Event Editing Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5507-64-bit-oid-lrs-event-editing-tools.md>) — similar text 0.47 · 3 title words · 2 filename words · same kind/surface/pe/folder <!-- rel:481 s=6.233 -->
- [64-bit OID Support for Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5013-64-bit-oid-support-for-route-editing-tools.md>) — similar text 0.29 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:483 s=5.178 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/regression-testing-task-list-v1.md>) — similar text 0.25 · same kind/surface <!-- rel:115 s=5.004 -->
- [Spike: 64-bit OID in LRS Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-editing-tools.md>) — similar text 0.28 · 3 title words · 1 filename word · same surface <!-- rel:515 s=4.487 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-intersection-properties.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [Create LRS from existing dataset](https://www.google.com/search?q=%22Create%20LRS%20from%20existing%20dataset%22+site%3Adoc.esri.com) · [Create LRS Network from existing dataset](https://www.google.com/search?q=%22Create%20LRS%20Network%20from%20existing%20dataset%22+site%3Adoc.esri.com) · [Create LRS Event from existing dataset](https://www.google.com/search?q=%22Create%20LRS%20Event%20from%20existing%20dataset%22+site%3Adoc.esri.com) · [Create LRS Intersection from existing dataset](https://www.google.com/search?q=%22Create%20LRS%20Intersection%20from%20existing%20dataset%22+site%3Adoc.esri.com) · [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com) · [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com) · [Apply Event Behaviors](https://www.google.com/search?q=%22Apply%20Event%20Behaviors%22+site%3Adoc.esri.com) · [Calculate Intersecting Route Measures](https://www.google.com/search?q=%22Calculate%20Intersecting%20Route%20Measures%22+site%3Adoc.esri.com) · [Calculate Route Concurrencies](https://www.google.com/search?q=%22Calculate%20Route%20Concurrencies%22+site%3Adoc.esri.com) · [Delete Routes](https://www.google.com/search?q=%22Delete%20Routes%22+site%3Adoc.esri.com) · [Derive Event Measures](https://www.google.com/search?q=%22Derive%20Event%20Measures%22+site%3Adoc.esri.com) · [Generate CP](https://www.google.com/search?q=%22Generate%20CP%22+site%3Adoc.esri.com) +7
<!-- docs:end -->

---

## Overview

### Slide 1 — 64 bit OID GP Tools – Test Plan <!-- slide 1 -->

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5509

PE: Claire Wang
Dev: Michael

### Slide 2 <!-- slide 2 -->

Data:
The scope of testing for this user story is to test everything on 64 bit OID.

- These GP tools can support actual 64-bit values in the schema items updated by the tools (Skip the configuration tools where we create the schema items (but do test the …from Existing Dataset tools))
    - use existing 64bit FC and create a network, the GP tool should not fail
    - Create LRS from existing dataset
    - Create LRS Network from existing dataset
    - Create LRS Event from existing dataset
    - Create LRS Intersection from existing dataset
    - Append Events
    - Append Routes
    - Apply Event Behaviors
    - Calculate Intersecting Route Measures
    - Calculate Route Concurrencies
    - Delete Routes
    - Derive Event Measures
    - Generate CP
    - Generate Events
    - Generate Intersections
    - Generate Routes
    - Overlay Events
    - Remove Overlapping Centerlines
    - Reverse Lien Orders
    - Translate Event Measures
    - Update Measures from LRS (not available until UN team enables UN for 64 bit oid)
    - Detect sparse vertices *(GitHub script) (just try if it works. If not, log a low bug)
- Test with line and non line networks (RH, APR, PoM, and APRUN)
- Test on each tool (breadth, not depth)
- Ensure all schema elements impacted by each event edit has a 64-bit OID value
- Test with fgdb, egdb (branch)(run whatever is available),, and FS in Pro

### Slide 3 <!-- slide 3 -->

Verification

- Verify the tools can handle 64-bit OID values in any schema element that is read/updated
  - Centerline sequence table
  - Centerlines
  - Calibration points
  - Network feature classes
  - Event feature classes
- Verify the tools proceed correctly and the OID fields in associated features are intact
- Verify the some of the tools support selection/definition query

Automation
N/A
Documentation
N/A

### Slide 4 — Positive cases <!-- slide 4 -->

Do the following tests for available features in RH, APR, PoM, and APRUN

  - Create LRS from existing dataset
  - Create LRS Network from existing dataset
    - Non-line, Line, and Derived network
  - Create LRS Event from existing dataset
    - Point, line, and spanning-line events
  - Create LRS Intersection from existing dataset
    - NetworkA – Network B
    - Network - boundary
  - Append Events
    - Point, line, and spanning-line events
  - Append Routes
    - Non-line and line
  - Apply Event Behaviors
    - Mix and Match EBs and route editing activities
  - Calculate Intersecting Route Measures
    - Self-intersecting
    - Intersecting with another network

## Test Cases

### TC-P01 — Calculate Route Concurrencies <!-- src: S4 · slide 5 · Positive cases – cont. 2 · 1 -->

- **Group:** Cont. 2
- Delete Routes
  - With and without associated events, CPs, and CLs
- Derive Event Measures
  - Point, line, and spanning-line events
- Generate CP
  - Normal and complex shapes that are self-intersecting
- Generate Events
  - Point, line, and spanning-line events
- Generate Intersections
  - NetworkA – Network B
  - Network - boundary
- Generate Routes
  - Non-line and line
- Overlay Events
  - Non-line and line
  - Non-spanning and spanning line events
- Remove Overlapping Centerlines

### TC-N01 — Verify a couple errors <!-- src: S4 · slide 6 · Negative cases · 1 -->

## Other content

### Slide 6 — Positive cases – cont. 3 <!-- slide 6 -->

  - Reverse Line Orders
    - With and without time slicing
  - Translate Event Measures
    - Point, line, and spanning-line events
