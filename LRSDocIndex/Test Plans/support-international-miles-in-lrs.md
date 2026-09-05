# Support International Miles in LRS

| Field | Value |
| --- | --- |
| **Doc** | 271 · Test Plan · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Test.Plan_SupportInternationalMiles.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/Test.Plan_SupportInternationalMiles.docx>) |
| **People** | author Praveen Kumar · PE — · dev — |
| **Edited** | 2024-12-10 22:38 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | international miles · measure units · referent fields · stationing fields · route editing · calibration points · split centerline · event replacement · rest api |
| **Tools** | Route Editing tools · Calibration Points · Split Centerline by Measure · Identify Routes · Locate Route and Measures · Translate · Add Point Event · Add Line Event · Split Event · Event Replacement · Search by Route · Merge Event |

## Summary

This document outlines testing for supporting international miles units in the Linear Referencing System (LRS). It covers tests for creating LRS networks with various units, verifying measure and offset units, and validating related tools and properties across ArcGIS Pro, Experience Builder, and REST endpoints.

## Related documents

<!-- related:begin -->
- [Support International Miles Measure Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-international-miles-measure-method.md>) — similar text 0.54 · 3 title words · 2 filename words · same surface <!-- rel:293 s=7.391 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/regression-testing-task-list-v1.md>) — similar text 0.22 · same kind/surface <!-- rel:115 s=4.565 -->
- [64-bit OID Values in REST Operations Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5508-64-bit-oid-values-in-rest-operations.md>) — similar text 0.20 · same kind/folder <!-- rel:470 s=3.282 -->
- [Add Line Events by offsetting from other points – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/3913-add-line-events-by-offsetting-from-other-points.md>) — similar text 0.11 · same kind/surface/folder <!-- rel:231 s=3.103 -->
- [Investigate Negative Measures for LR Tools in Pro/REST/EE](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/investigate-negative-measures-for-lr-tools-in-pro-rest-ee.md>) — similar text 0.16 · same kind/surface <!-- rel:628 s=2.782 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html) · [Locate route and measures](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/locate-route-and-measures.html) · [Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html)

_No page matched:_ [Route Editing tools](https://www.google.com/search?q=%22Route%20Editing%20tools%22+site%3Adoc.esri.com) · [Calibration Points](https://www.google.com/search?q=%22Calibration%20Points%22+site%3Adoc.esri.com) · [Identify Routes](https://www.google.com/search?q=%22Identify%20Routes%22+site%3Adoc.esri.com) · [Translate](https://www.google.com/search?q=%22Translate%22+site%3Adoc.esri.com) · [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com) · [Split Event](https://www.google.com/search?q=%22Split%20Event%22+site%3Adoc.esri.com) · [Event Replacement](https://www.google.com/search?q=%22Event%20Replacement%22+site%3Adoc.esri.com) · [Search by Route](https://www.google.com/search?q=%22Search%20by%20Route%22+site%3Adoc.esri.com) · [Merge Event](https://www.google.com/search?q=%22Merge%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

Support International Miles in LRS

Notes

1. Test with a mix of line and non line networks

1. Test with a mix of spanning and non spanning events

1. Verify labels are consistent with other methods

1. 508/i18n

1. Test in python

1. Check LRS metadata

Test

Gp

1. Create LRS (spatial reference units of measure)

1. Create LRS Network (measure unit)

1. Create LRS Network from Existing Dataset (validate correct units)

1. Enable Referent Fields (offset units)

1. Enable Stationing Fields (station measure units)

1. Generate LRS Data Products

Pro LR ribbon

1. Route Editing tools (From and To measures)

1. Calibration Points (Measure)

1. Split Centerline by Measure

1. Identify Routes (drop down for measures)

1. Locate Route and Measures (Locate measures)

1. Translate (measures)

1. Add Point Event (measure)

1. Add Line Event (From and To measures)

1. Split Event (measure)

1. Event Replacement (From and To measures)

1. LRS Network Properties

1. LRS Event Properties

1. LRS Intersection Properties

ExB

1. Search by Route (Measure for Route and Measure method)

1. Search by Route (Offset for Referent method)  For offset in referent method, we should also add International feet.

1. Identify Routes (Measure in the results)

1. Add Point Event (Measure for Route and Measure input method)

1. Add Line Event (Measure for Route and Measure input method)

1. Split Event (Measure for Route and Measure input method)

1. Merge Event (Measure for Route and Measure input method)

REST

    1. Network unit of measure

    1. Spatial Reference Info

    1. GeometrytoReferent – outOffsetUnit

    1. ReferentToGeometry – offsetunit

    1. Event unit of measure
