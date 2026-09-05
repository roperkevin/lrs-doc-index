# Transform LRS Data GP tool: Summarize by polygon boundaries – Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 359 · Test Plan · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#5744](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5744) |
| **Source** | [TransformReportingDataGP_BoundarySum_Testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/TransformReportingDataGP_BoundarySum_Testplan.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE Praveen Kumar · dev Michael |
| **Edited** | 2024-06-27 20:44 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | polygon boundary · summary field · geoprocessing tool · route mileage · boundary layer · test case · cancellation · complex route |
| **Tools** | Transform LRS Data GP tool |

## Summary

Test plan for the Transform LRS Data geoprocessing tool that summarizes route data by polygon boundaries. It covers UI verification, functionality checks including support for various route types and databases, automation, and negative test cases. The plan includes detailed test cases for route boundary inclusion, handling of gapped and complex routes, and cancellation behavior.

## Related documents

<!-- related:begin -->
- [Transform LRS Data GP tool – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5742-transform-lrs-data-gp.md>) — similar text 0.35 · 2 title words · 3 filename words · same kind/surface/dev/folder <!-- rel:372 s=7.616 -->
- [Generate a Route Log using the GLRSDP GP Tool – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6209-generate-a-route-log-using-the-glrsdp-gp.md>) — similar text 0.32 · 1 title word · 1 filename word · same kind/surface/pe/dev/folder <!-- rel:260 s=7.145 -->
- [Generate LR Data Product: Support summary and length fields from the template – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5769-generate-lr-data-product-support-summary-and-length-fields.md>) — similar text 0.20 · 1 filename word · same kind/surface/dev/folder <!-- rel:339 s=5.294 -->
- [Support multiple summary fields in Generate LRS Data Product – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5773-support-multiple-summary-fields-in-generate-lrs-data-product.md>) — similar text 0.24 · 1 filename word · same kind/surface/dev/folder <!-- rel:321 s=3.901 -->
- [GenerateLengthSummary – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6202-generatelengthsummary.md>) — similar text 0.18 · 1 filename word · same kind/surface/dev <!-- rel:172 s=3.617 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Complex scenarios for route calibration](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/complex-scenarios-for-route-calibration.html)

_No page matched:_ [Transform LRS Data GP tool](https://www.google.com/search?q=%22Transform%20LRS%20Data%20GP%20tool%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Transform LRS Data GP tool : Summarize by polygon boundaries – Test Plan <!-- slide 1 -->

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5744

PE: Praveen Kumar
Dev: Michael

## Test Cases

### TC-U01 — GP tool <!-- src: S5 · slide 2 · label GP tool -->

**Steps:**
1. Add a new parameter ‘Boundary Layer’ to Transform LRS Data GP tool that accepts polygon features as input.
2. Add a new parameter ‘Summary Field’ to the gp tool

### TC-N01 — Boundary layer is not a polygon layer <!-- src: S4 · slide 3 · Negative cases · 1 -->

### TC-N02 — Summary field does not exist <!-- src: S4 · slide 3 · Negative cases · 2 -->

### TC-N03 — User provides incorrect format for these fields (this can happen in python) <!-- src: S4 · slide 3 · Negative cases · 3 -->

### TC-N04 — User provide incorrect file type we don’t support yet in python <!-- src: S4 · slide 3 · Negative cases · 4 -->

## Other content

### Slide 2 <!-- slide 2 -->

UI verification

- Verify in the pane the label of the boundary layer and summary fields are of same font size and aligned properly
- Verify the boundary layer and summary field is not marked with * (to show it as optional)
- Users can change the layer in the pane
- Users can change the summary field in the pane
- When few features are selected ensure that the ‘use the selected records:’ is shown.
- 508 and i18n

![Figure 1 — 2](../media/5744-transform-lrs-data-gp-summarize-by-polygon-boundaries/fig-01-slide-02-2.png)

### Slide 3 <!-- slide 3 -->

Functionality Verification

- Verify simple route, gapped routes, multi-gapped routes, 3D and complex shapes are supported.
- Verify the boundary layer accept only polygon features
- Verify the boundary layer is acceptable even if it in different database
- Verify that the multipart polygons are supported in the boundary layer
- Verify that the selection set of the boundary layer is honoured
- Verify that the summary field drop down lists only the non-system fields
- Verify in python inline and stand alone
- Verify in model builder include chaining
- Verify tool supports running against fgdb, egdb, fs default and versions
- Verify there is a progress bar at the bottom of tool pane and it shows the progress
- Clicking cancel will actually cancel the tool – depend on what stage of cancel, output will be different
Automation: PY
Doc: update the GP doc

![Figure 2 — 3](../media/5744-transform-lrs-data-gp-summarize-by-polygon-boundaries/fig-02-slide-03-3.png)

### Slide 4 <!-- slide 4 -->

Testing

- Test in fgdb, egdb (oracle + sql), fs - default and versions
- Test with nonline, Line,  derived routes, PoM and Addressing (sanity)
- Test with and without route selection and definition query
- Test with and without boundary selection and definition query
- The tool should run when the layers are checked off (invisible) in map
- Test running against thousands of routes
- Test running against 0 route e.g. an effective date that no route exists – output should not contain any row
- Test simple, gapped routes, multi-gapped routes, complex shapes, and z values
- Test with different gap calibration rules
- Test with overlapping routes
- Test with routes with time slices at different locations – only the time slice that exists in Effective Date is returned
- Test with routes that have measures different from geographic length
- Test with uncalibrated routes – they will not be added in the output csv
- Test cancelling tool while it’s running – not generate anything
- Test python inline and stand alone
- Test chained model builder

### Slide 5 <!-- slide 5 -->

TC1

| County | Miles |
| --- | --- |
| FAYETTE | 121.4341308 |
| FRANKLIN | 296.8384691 |
| UNION | 128.8240573 |

![Figure 3 — 5](../media/5744-transform-lrs-data-gp-summarize-by-polygon-boundaries/fig-03-slide-05-5.png)

### Slide 6 <!-- slide 6 -->

TC2

Route on boundary goes to franklin or union?
We should include in either of one.

| County | Miles |
| --- | --- |
| FAYETTE | 121.4341308 |
| FRANKLIN | 296.8384691 |
| UNION | 128.8240573 |

![Figure 4 — 6](../media/5744-transform-lrs-data-gp-summarize-by-polygon-boundaries/fig-04-slide-06-6.png)

### Slide 7 <!-- slide 7 -->

TC3

| County | Miles |
| --- | --- |
| FAYETTE | 131.4341308 |
| FRANKLIN | 306.8384691 |
| UNION | 128.8240573 |

We should include the parts inside the respective boundary in which its falling, if its exactly coincident with boundary include in any one boundary.

![Figure 5 — 7](../media/5744-transform-lrs-data-gp-summarize-by-polygon-boundaries/fig-05-slide-07-7.png)

### Slide 8 <!-- slide 8 -->

TC4

| County | Miles |
| --- | --- |
| FRANKLIN | 296.8384691 |

![Figure 6 — 8](../media/5744-transform-lrs-data-gp-summarize-by-polygon-boundaries/fig-06-slide-08-8.png)

### Slide 9 <!-- slide 9 -->

TC5

| County | Miles |
| --- | --- |
| RUSH | 0 |

![Figure 7 — 9](../media/5744-transform-lrs-data-gp-summarize-by-polygon-boundaries/fig-07-slide-09-9.png)

### Slide 10 <!-- slide 10 -->

TC6

| County | Miles |
| --- | --- |
| FAYETTE | 121.4341308 |
| FRANKLIN | 320.8384691 |
| UNION | 128.8240573 |

Route mileage outside boundary is not included

![Figure 8 — 10](../media/5744-transform-lrs-data-gp-summarize-by-polygon-boundaries/fig-08-slide-10-10.png)

### Slide 11 <!-- slide 11 -->

TC7

| County | Miles |
| --- | --- |
| UNION | 31.4341308 |

![Figure 9 — 11](../media/5744-transform-lrs-data-gp-summarize-by-polygon-boundaries/fig-09-slide-11-11.png)

### Slide 12 <!-- slide 12 -->

TC8

| County | Miles |
| --- | --- |
| FRANKLIN | 0 |

![Figure 10 — 12](../media/5744-transform-lrs-data-gp-summarize-by-polygon-boundaries/fig-10-slide-12-12.png)

### Slide 13 <!-- slide 13 -->

TC9

| County | Miles |
| --- | --- |
| FRANKLIN | 220.654651 |

Should not include the routes which falls in the hollow portion

![Figure 11 — 13](../media/5744-transform-lrs-data-gp-summarize-by-polygon-boundaries/fig-11-slide-13-13.png)
