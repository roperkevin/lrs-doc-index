# Support multiple summary fields in Generate LRS Data Product – Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 321 · Test Plan · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#5773](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5773) |
| **Source** | [5773_GP_MultipleSummaryFields_Testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5773_GP_MultipleSummaryFields_Testplan.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE — · dev Michael |
| **Edited** | 2024-08-29 22:55 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | summary fields · length fields · generate lrs data product · test plan · nested summary · route length calculation · functional class · polygon summary |
| **Tools** | Generate LRS Data Product |

## Summary

Test plan for verifying the Generate LRS Data Product tool's support for multiple summary fields combined with multiple length fields. Includes functionality verification, testing across various geodatabases and scenarios, and positive and negative test cases to ensure correct summary nesting, length calculations, and error handling.

## Related documents

<!-- related:begin -->
- [Support multiple summary fields in LRS Data Template wizard – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5770-support-multiple-summary-fields-in-lrs-data-template-wizard.md>) — similar text 0.33 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:323 s=6.587 -->
- [Generate LR Data Product: Support summary and length fields from the template – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5769-generate-lr-data-product-support-summary-and-length-fields.md>) — similar text 0.27 · 5 title words · same kind/surface/dev/folder <!-- rel:339 s=6.404 -->
- [User Story: Support Multiple Summary Fields in Generate LRS Data Product](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-multiple-summary-fields-in-generate-lrs-data-product.md>) — similar text 0.17 · 6 title words · 2 filename words · same surface <!-- rel:353 s=5.127 -->
- [Support table output with the length product template – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6458-support-table-output-with-the-length-product-template.md>) — similar text 0.23 · 2 title words · 1 filename word · same kind/surface/dev <!-- rel:232 s=5.114 -->
- [Generate a Route Log using the GLRSDP GP Tool – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6209-generate-a-route-log-using-the-glrsdp-gp.md>) — similar text 0.21 · 1 title word · 1 filename word · same kind/surface/dev/folder <!-- rel:260 s=4.841 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Generate LRS Data Product](https://www.google.com/search?q=%22Generate%20LRS%20Data%20Product%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Support multiple summary fields in Generate LRS Data Product – Test Plan <!-- slide 1 -->

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5773

Test plan writer: Claire
PE: ?
Dev: Michael

### Slide 2 <!-- slide 2 -->

There should be No UI Change
Functionality Verification

- Verify the tool supports multiple summary fields combined or not combined with multiple length fields
- Verify in the final data product, the summary fields are nested based on level
- Length is calculated as To measure – From Measure for each length field’s segment on selected routes

![Figure 1 — 2](../media/5773-support-multiple-summary-fields-in-generate-lrs-data-product/fig-01-slide-02-2.png)
![Figure 2 — 2](../media/5773-support-multiple-summary-fields-in-generate-lrs-data-product/fig-02-slide-02-2.png)
![Figure 3 — 2](../media/5773-support-multiple-summary-fields-in-generate-lrs-data-product/fig-03-slide-02-2.png)

### Slide 3 <!-- slide 3 -->

Testing

- Test in fgdb, egdb (oracle + sql), fs - default and child versions
- Test with nonline, Line with derived routes, PoM and Addressing
- Test a combination of multiple summary fields with and without length fields
  - Test polygons, network and events being summary fields
  - Test events and network fields being length fields
- Test with summary layers that form complex nesting scenarios (see last slide)
- Test with and without route selection and definition query (they are honored)
- Test running against thousands of routes
- Test running against 0 route e.g. an effective date that no route exists – output should not contain any route
- Test simple, gapped routes, multi-gapped routes, complex shapes, and z values
- Test with different gap calibration rules
- Test with overlapping routes (concurrency is not supported)
- Test with routes with time slices at different locations – only the time slice that exists in Effective Date is returned
- Test with routes that have measures different from geographic length
- Test with uncalibrated routes – they will not be included in the output csv
- Test few other effective dates
- Test with m, km, mi, us ft and ft
- Test python inline and stand alone
- Test chained model builder
Automation:
Doc:

![Figure 1 — 2](../media/5773-support-multiple-summary-fields-in-generate-lrs-data-product/fig-01-slide-02-2.png)
![Figure 2 — 2](../media/5773-support-multiple-summary-fields-in-generate-lrs-data-product/fig-02-slide-02-2.png)
![Figure 3 — 2](../media/5773-support-multiple-summary-fields-in-generate-lrs-data-product/fig-03-slide-02-2.png)

### Slide 4 — Negative cases <!-- slide 4 -->

| No | Test | Expected Result | Error Message |
| --- | --- | --- | --- |
| 1 | Some/all Summary layer(s) does not exist in db (when testing dc) or fs (when testing fs) – they can be removed from the map and GP still works | GP error |  |
| 2 | Some/all Length layer(s) does not exist in map | GP error |  |
| 3 | Some/all Summary field(s) does not exist in db or fs | GP error |  |
| 4 | Some/all Value in filter is an invalid code (e.g. DOTclass = aaa ) | GP error |  |
|  | *When value in filter is valid but it does not exist in map, it’s not an error but output will be 0 length |  |  |
| 5 |  |  |  |
| 6 |  |  |  |
| 7 |  |  |  |
| 8 |  |  |  |
| 9 |  |  |  |
| 10 |  |  |  |
|  |  |  |  |
|  |  |  |  |

Error message verification – Developer provides error messages

## Test Cases

### TC-P01 — RH – summarize by county, city, and paved/unpaved roads <!-- src: S3 · slide 5 · table · 1 -->

- **ID:** 1
- **Expected Result:** LRS Data product has correct summary fields and length fields, and the calculation is correct.

### TC-P02 — RH – summarize by county, and functional class with changed display value <!-- src: S3 · slide 5 · table · 2 -->

- **ID:** 2
- **Case:** RH – summarize by county, and functional class with changed display value, filter expression, and removed display value; length fields are speed limit and access control
- **Expected Result:** As above

### TC-P03 — RH – summarize by city and a network-jurisdiction with changed display value <!-- src: S3 · slide 5 · table · 3 -->

- **ID:** 3
- **Case:** RH – summarize by city and a network-jurisdiction with changed display value, filter expression, and modified display value; length fields are functional class
- **Expected Result:** As above

### TC-P04 — APR Engineering – summarize by material and inline inspection <!-- src: S3 · slide 5 · table · 4 -->

- **ID:** 4
- **Case:** APR Engineering – summarize by material and inline inspection; length fields are DOTclass
- **Expected Result:** As above

### TC-P05 — APR Derived – summarize by county, and LineName with changed display value <!-- src: S3 · slide 5 · table · 5 -->

- **ID:** 5
- **Case:** APR Derived – summarize by county, and LineName with changed display value, filter expression, and removed display value
- **Expected Result:** As above

### TC-P06 — APR Engineering – summarize by county and Line ID <!-- src: S3 · slide 5 · table · 6 -->

- **ID:** 6
- **Case:** APR Engineering – summarize by county and Line ID; length fields are centerline accuracy and DOTclass
- **Expected Result:** As above

### TC-P07 — APR Engineering – summarize by installation year <!-- src: S3 · slide 5 · table · 7 -->

- **ID:** 7
- **Case:** APR Engineering – summarize by installation year, material and inline inspection with filters
- **Expected Result:** As above

### TC-P08 — PoM – summarize by summarize by polygon and line ID with changed display value <!-- src: S3 · slide 5 · table · 8 -->

- **ID:** 8
- **Case:** PoM – summarize by summarize by polygon and line ID with changed display value, filter expression, and modified display value.
- **Expected Result:** As above

### TC-P09 — Summary levels are not nested <!-- src: S3 · slide 5 · table · 9 -->

- **ID:** 9
- **Case:** Summary levels are not nested (e.g. first layer is county boundary and the second is also county boundary)
- **Expected Result:** 0 length

### TC-P10 — Change the order of summary field levels for some cases above (e.g. county <!-- src: S3 · slide 5 · table · 10 -->

- **ID:** 10
- **Case:** Change the order of summary field levels for some cases above (e.g. county – city – functional class vs. city – county – functional class)
- **Expected Result:** Length results should be the same.; Columns switch

## Other content

### Slide 5 — Positive cases (test various dbs /FSs) <!-- slide 5 -->

Get json from Claire (5770)

### Slide 6 <!-- slide 6 -->

| County | City | Length |
| --- | --- | --- |
| 1 | A | 20 |
| 1 | B | 20 (2 segments) |
| 1 | C | 10 (2 segments) |
| 1 | D | 5 |
| 2 | D | 20 |
| 2 | E | 10 |
| 2 | F | 10 |
| 2 | G | 7 |
| 2 | H | 5 |

| County | City |
| --- | --- |
| 1 | A |
| 2 | B |
| 3 | C |
|  | D |
|  | E |
|  | F |
|  | G |
|  | H |
|  | I |

[figure: H · G · D · A · B · C · I · F · E · Route1 · Template · Output]

![Figure 4 — 6](../media/5773-support-multiple-summary-fields-in-generate-lrs-data-product/fig-04-slide-06-6.png)
![Figure 5 — 6](../media/5773-support-multiple-summary-fields-in-generate-lrs-data-product/fig-05-slide-06-6.png)
![Figure 6 — 6](../media/5773-support-multiple-summary-fields-in-generate-lrs-data-product/fig-06-slide-06-6.png)

![Figure 7 — 6](../media/5773-support-multiple-summary-fields-in-generate-lrs-data-product/fig-07-slide-06-6.svg)

### Slide 7 — Other classes are excluded <!-- slide 7 -->

| County | City | Functional class | Length |
| --- | --- | --- | --- |
| 1 | A | Interstate | 10 |
| 1 | A | Minor Arterial | 15 |
| 1 | B | Interstate | 20 (2 segments) |
| 1 | D | Interstate | 2.5 |
| 2 | D | Interstate | 5 |
| 2 | D | Minor Arterial | 15 |
| 2 | E | Interstate | 5 |
| 2 | E | Minor Arterial | 5 |
| 2 | F | Interstate | 5 |
| 2 | G | Minor Arterial | 7 |
| 2 | H | Minor Arterial | 5 |

| County | City | FunctionalClass |
| --- | --- | --- |
| 1 | A | Interstate |
| 2 | B | Minor Arterial |
| 3 | C |  |
|  | D |  |
|  | E |  |
|  | F |  |
|  | G |  |
|  | H |  |
|  | I |  |

Overlapping
FunctionalClass
5 is the length of the overlap
so 10+15=25 is 5 longer than the length 20 in A
The other 2.5 has no functional class

| Functional class | City | County | Length |
| --- | --- | --- | --- |
| Interstate | A | 1 | 10 |
| Minor Arterial | A | 1 | 15 |
| Interstate | B | 1 | 20 (2 segments) |
| Interstate | D | 1 | 2.5 |
| Interstate | D | 2 | 5 |
| Minor Arterial | D | 2 | 15 |
| Interstate | E | 2 | 5 |
| Minor Arterial | E | 2 | 5 |
| Interstate | F | 2 | 5 |
| Minor Arterial | G | 2 | 7 |
| Minor Arterial | H | 2 | 5 |

Output with reversed summary levels
Length results do not change. Because technically, we just calculate length within valid intersections

[figure: H · G · D · A · B · C · I · F · E · Route1 · Template · Output · No FunctionalClass]

![Figure 4 — 6](../media/5773-support-multiple-summary-fields-in-generate-lrs-data-product/fig-04-slide-06-6.png)
![Figure 5 — 6](../media/5773-support-multiple-summary-fields-in-generate-lrs-data-product/fig-05-slide-06-6.png)
![Figure 6 — 6](../media/5773-support-multiple-summary-fields-in-generate-lrs-data-product/fig-06-slide-06-6.png)

![Figure 8 — Other classes are excluded](../media/5773-support-multiple-summary-fields-in-generate-lrs-data-product/fig-08-slide-07-other-classes-are-excluded.svg)
