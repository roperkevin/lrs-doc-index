# Support International Miles in LRS

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Source** | [Test.Plan_SupportInternationalMiles.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/Test.Plan_SupportInternationalMiles.docx>) |
| **Edited** | 2024-12-10 22:38 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support International Miles in LRS"
source_file: "Test.Plan_SupportInternationalMiles.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/Test.Plan_SupportInternationalMiles.docx"
doc_id: 271
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Praveen Kumar"
last_edited_by: "Praveen Kumar"
last_edited: "2024-12-10T22:38:00Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["international miles", "measure units", "referent fields", "stationing fields", "route editing", "calibration points", "split centerline", "event replacement", "rest api"]
tools: ["Route Editing tools", "Calibration Points", "Split Centerline by Measure", "Identify Routes", "Locate Route and Measures", "Translate", "Add Point Event", "Add Line Event", "Split Event", "Event Replacement", "Search by Route", "Merge Event"]
products: []
issues: []
related: [{"doc":293,"file":"support-international-miles-measure-method__doc293.md","s":7.391},{"doc":115,"file":"regression-testing-task-list-v1__doc115.md","s":4.565},{"doc":470,"file":"64-bit-oid-values-in-rest-operations-test-plan__doc470.md","s":3.282},{"doc":231,"file":"add-line-events-by-offsetting-from-other-points-test-plan__doc231.md","s":3.103},{"doc":628,"file":"investigate-negative-measures-for-lr-tools-in-pro-rest-ee__doc628.md","s":2.782}]
```
-->

## Summary

This document outlines testing for supporting international miles units in the Linear Referencing System (LRS). It covers tests for creating LRS networks with various units, verifying measure and offset units, and validating related tools and properties across ArcGIS Pro, Experience Builder, and REST endpoints.

## Related documents

<!-- related:begin -->
- [Support International Miles Measure Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-international-miles-measure-method__doc293.md>) — similar text 0.54 · 3 title words · 2 filename words · same surface <!-- rel:293 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/regression-testing-task-list-v1__doc115.md>) — similar text 0.22 · same kind/surface <!-- rel:115 -->
- [64-bit OID Values in REST Operations Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/64-bit-oid-values-in-rest-operations-test-plan__doc470.md>) — similar text 0.20 · same kind/folder <!-- rel:470 -->
- [Add Line Events by offsetting from other points – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-line-events-by-offsetting-from-other-points-test-plan__doc231.md>) — similar text 0.11 · same kind/surface/folder <!-- rel:231 -->
- [Investigate Negative Measures for LR Tools in Pro/REST/EE](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/investigate-negative-measures-for-lr-tools-in-pro-rest-ee__doc628.md>) — similar text 0.16 · same kind/surface <!-- rel:628 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html) · [Locate route and measures](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/locate-route-and-measures.html) · [Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html)

_No page matched:_ [Route Editing tools](https://www.google.com/search?q=%22Route%20Editing%20tools%22+site%3Adoc.esri.com) · [Calibration Points](https://www.google.com/search?q=%22Calibration%20Points%22+site%3Adoc.esri.com) · [Identify Routes](https://www.google.com/search?q=%22Identify%20Routes%22+site%3Adoc.esri.com) · [Translate](https://www.google.com/search?q=%22Translate%22+site%3Adoc.esri.com) · [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com) · [Split Event](https://www.google.com/search?q=%22Split%20Event%22+site%3Adoc.esri.com) · [Event Replacement](https://www.google.com/search?q=%22Event%20Replacement%22+site%3Adoc.esri.com) · [Search by Route](https://www.google.com/search?q=%22Search%20by%20Route%22+site%3Adoc.esri.com) · [Merge Event](https://www.google.com/search?q=%22Merge%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

Support International Miles in LRS

Notes

- Test with a mix of line and non line networks
- Test with a mix of spanning and non spanning events
- Verify labels are consistent with other methods
- 508/i18n
- Test in python
- Check LRS metadata

Test

Gp

- Create LRS (spatial reference units of measure)
- Create LRS Network (measure unit)
- Create LRS Network from Existing Dataset (validate correct units)
- Enable Referent Fields (offset units)
- Enable Stationing Fields (station measure units)
- Generate LRS Data Products

Pro LR ribbon

- Route Editing tools (From and To measures)
- Calibration Points (Measure)
- Split Centerline by Measure
- Identify Routes (drop down for measures)
- Locate Route and Measures (Locate measures)
- Translate (measures)
- Add Point Event (measure)
- Add Line Event (From and To measures)
- Split Event (measure)
- Event Replacement (From and To measures)
- LRS Network Properties
- LRS Event Properties
- LRS Intersection Properties

ExB

- Search by Route (Measure for Route and Measure method)
- Search by Route (Offset for Referent method)  For offset in referent method, we should also add International feet.
- Identify Routes (Measure in the results)
- Add Point Event (Measure for Route and Measure input method)
- Add Line Event (Measure for Route and Measure input method)
- Split Event (Measure for Route and Measure input method)
- Merge Event (Measure for Route and Measure input method)

REST

    - Network unit of measure
    - Spatial Reference Info
    - GeometrytoReferent – outOffsetUnit
    - ReferentToGeometry – offsetunit
    - Event unit of measure
