# Generate LR Data Product: Support summary and length fields from the template – Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 339 · Test Plan · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#5769](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5769) |
| **Source** | [ReportingGPTool_SummaryandLengthField_TestPlan 1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/ReportingGPTool_SummaryandLengthField_TestPlan%201.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE Lakshmi · dev Michael |
| **Edited** | 2024-08-09 23:47 by Lakshmi Ananthanarayanan |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | length field · summary field · route · network · polygon · line event · functional class · pipe material · spanning event · gapped route · time sliced scenario · mileage · geoprocessing · test case · error handling |
| **Tools** | Generate LR Data Product |

## Summary

Test plan for the Generate LR Data Product geoprocessing tool focusing on support for summary and length fields from a template JSON. It covers calculation of length/mileage for routes and events, validation of input parameters, error handling, and extensive test cases including various summary and length field combinations, network types, and data sources.

## Related documents

<!-- related:begin -->
- [Pro 3.4 and 11.4 User Acceptance Issues and Documentation Updates](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Schedules/504-pro-3-4-and-11-4-user-acceptance-issues-and-documentation.md>) — shared issue ArcGISPro/ps-location-referencing#5769 · gantt link (2 shared) · similar text 0.04 · same surface <!-- rel:194 s=1120.838 -->
- [Support multiple summary fields in Generate LRS Data Product – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5773-support-multiple-summary-fields-in-generate-lrs-data-product.md>) — similar text 0.27 · 5 title words · same kind/surface/dev/folder <!-- rel:321 s=6.404 -->
- [GenerateLengthSummary – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6202-generatelengthsummary.md>) — similar text 0.83 · 1 filename word · same kind/surface/dev <!-- rel:172 s=6.229 -->
- [Transform LRS Data GP tool: Summarize by polygon boundaries – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5744-transform-lrs-data-gp-summarize-by-polygon-boundaries.md>) — similar text 0.20 · 1 filename word · same kind/surface/dev/folder <!-- rel:359 s=5.294 -->
- [Support table output with the length product template – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6458-support-table-output-with-the-length-product-template.md>) — similar text 0.19 · 3 title words · 1 filename word · same kind/surface/dev <!-- rel:232 s=5.052 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html)

_No page matched:_ [Generate LR Data Product](https://www.google.com/search?q=%22Generate%20LR%20Data%20Product%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Generate LR Data Product: Support summary and length fields from the template – Test Plan <!-- slide 1 -->

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5769

PE: Lakshmi
Dev: Michael

### Slide 2 <!-- slide 2 -->

General

- Use the summary field and length field from the template json  and calculate the length/mileage in the output file
- If the length fields are events or network, then length is calculated as a ∑ of (To measure – From Measure) for each event segment present in route.
- Summary field can be polygons, LRS network , LRS Line Events
- Summary field can be LRS or non LRS layers(boundary layers)
- Summary fields should be from the same database only.
- If the template Json has length field but no summary field, then create output  length /mileage as per the length field for each route (For nonline it will be route wise , for line network it will contain both line info and route info)
- If the template JSON has a Summary field but no Length field, utilize the field called "Length" to compute the length using the routes
- If the template json has no length field and no summary field, then create output length /mileage for each route, utilise the field called “Length” to compute the length.
- For this user story , single summary field  and multiple length fields can only be used.
- Selection is available only for Network. If any route is selected, then that route is summarized on the given date for the provided summary field and length field. If no route is selected, the output will contain the information for entire network
- If there are no summary fields   in the json then show up the parameters for Summary layer/boundary field and summary field in the GP tool.

## Test Cases

### TC-N01 — Providing a non LRS line as a summary layer (Boundary Line) <!-- src: S4 · slide 3 · Negative Test cases · 1 -->

- **Group:** Cases

### TC-N02 — If the summary field /summary layer and Length field/Length layer provided <!-- src: S4 · slide 3 · Negative Test cases · 2 -->

- **Group:** Cases
- **Case:** If the summary field /summary layer and Length field/Length layer provided in the input template does not match with the input database containing the chosen network, then error out with proper error message.

### TC-N03 — If the summary layer / Length layer is a LRS event and it does not belong <!-- src: S4 · slide 3 · Negative Test cases · 3 -->

- **Group:** Cases
- **Case:** If the summary layer / Length layer is a LRS event and it does not belong to the chosen network, then error out. Currently measure translation is not supported.

### TC-N04 — User after providing the json input with summary and length parameters ,add <!-- src: S4 · slide 3 · Negative Test cases · 4 -->

- **Group:** Cases
- **Case:** User after providing the json input with summary and length parameters ,add an extra summary layer for the GP tool using the python error out

### TC-N05 — User provide incorrect file type we don’t support yet in python, error out <!-- src: S4 · slide 3 · Negative Test cases · 5 -->

- **Group:** Cases

### TC-U01 — Summarize by Polygon No length field – Nonline network <!-- src: S2 · slide 9 · case 4 -->

| Summarize by / summary field |
| --- |
| County/ Name |

| Name | Length |
| --- | --- |
| Clark | 6.500 |
| Lewis | 3.000 |
| Place | 2.500 |

CSV from GP Tool
The heading for the output in the csv will come from the field names.
Name , Length
Clark , 6.500
Lewis , 3.000
Place , 2.500
RH Sample Report(similar ones with/without the same length fields)

[figure: Input · 0 · 10 · 1–9 · 11 · 12 · Lewis · Placer · Clark · Template Canvas · R1]

![Figure 7 — TestCase4 – Summarize by Polygon No length field – Nonline network](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-07-slide-09-testcase4-summarize-by-polygon-no-length.png)
![Figure 8 — TestCase4 – Summarize by Polygon No length field – Nonline network](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-08-slide-09-testcase4-summarize-by-polygon-no-length.png)
![Figure 9 — TestCase4 – Summarize by Polygon No length field – Nonline network](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-09-slide-09-testcase4-summarize-by-polygon-no-length.png)

![Figure 10 — TestCase4 – Summarize by Polygon No length field – Nonline network](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-10-slide-09-testcase4-summarize-by-polygon-no-length.svg)

### TC-U02 — Summarize by LRS event(functional class) <!-- src: S2 · slide 13 · case 9 -->

| Summarize by/ summary field |
| --- |
| Functional Class/Class |

| Class | Length |
| --- | --- |
| Interstate | 8.000 |
| Arterial | 4.000 |

CSV from GP Tool
Class , Length
Interstate , 8.000
Arterial , 4.000

[figure: Input · 0 · 10 · 1–9 · 11 · 12 · Lewis · Placer · Clark · Template Canvas · R1 · Interstate · Arterial]

![Figure 17 — TestCase9 –Summarize by LRS event(functional class)](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-17-slide-13-testcase9-summarize-by-lrs-event.svg)

### TC-U03 — Summarize by polygon and length (Toll) <!-- src: S2 · slide 14 · case 10 -->

| Summarize by/ summary field | Length Field (Toll event) |
| --- | --- |
| County/Name | Toll Miles |

| Name | Toll Miles |
| --- | --- |
| Clark | 4.000 |
| Lewis | 1.000 |
| Placer | 0.000 |

CSV from GP Tool
The length fields is Toll event layer
Name , Toll Miles
Clark , 4.000
Lewis , 1.000
Placer , 0.000

[figure: Input · 0 · 10 · 1–9 · 11 · 12 · Lewis · Placer · Clark · Template Canvas · R1]

![Figure 18 — TestCase10 – Summarize by polygon and length (Toll)](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-18-slide-14-testcase10-summarize-by-polygon.svg)

### TC-U04 — Summarize by polygon and length (Functional Class) <!-- src: S2 · slide 15 · case 10a -->

| Summarize by/ summary field | Length Field (Functional Class) |  |
| --- | --- | --- |
| County/Name | Interstate | Arterial |

| Name | Interstate | Arterial |
| --- | --- | --- |
| Clark | 6.5 |  |
| Lewis | 1.5 | 1.5 |
| Placer | 0.000 | 2.5 |

CSV from GP Tool
The length fields is Toll event layer

[figure: Input · 0 · 10 · 1–9 · 11 · 12 · Lewis · Placer · Clark · Template Canvas · R1 · Interstate · Arterial]

![Figure 19 — TestCase10a – Summarize by polygon and length (Functional Class)](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-19-slide-15-testcase10a-summarize-by-polygon.png)

![Figure 20 — TestCase10a – Summarize by polygon and length (Functional Class)](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-20-slide-15-testcase10a-summarize-by-polygon.svg)

### TC-U05 — Summarize by LRS Event(functional class) and length field (Toll ) <!-- src: S2 · slide 16 · case 11 -->

| Summarize by/ summary field | Length Field (Toll event) |
| --- | --- |
| Functional Class/Class | Toll Miles |

| Class | Toll Miles |
| --- | --- |
| Interstate | 5.000 |
| Principal Arterial - Freeway | 1.000 |
| Principal Arterial – other | 0.000 |
| Minor Arterial | 0.000 |
| Major Collector | 0.000 |
| Minor Collector | 0.000 |
| Local | 0.000 |

CSV from GP Tool
The length fields is Toll event layer
Class, Toll Miles
Interstate , 5.000
Principal Arterial-Freeway , 1.000
Principal Arterial - Other , 0.000
Minor Arterial, 0.000
Major Collector, 0.000
Minor Collector, 0.000
Local, 0.000

[figure: Input · 0 · 10 · 1–9 · 11 · 12 · Lewis · Placer · Clark · Template Canvas · R1 · Interstate · Arterial- Freeway]

![Figure 21 — TestCase11 – Summarize by LRS Event(functional class) and length field (Toll )](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-21-slide-16-testcase11-summarize-by-lrs-event.svg)

### TC-U06 — – Summarize by LRS Event(functional class) and length field (Toll ) <!-- src: S2 · slide 17 · case 11a -->

| Summarize by/ summary field | Length Field (Toll event) |
| --- | --- |
| Functional Class/Class | Network |

| Class | Length |
| --- | --- |
| Interstate | 8.000 |
| Principal Arterial - Freeway | 4.000 |

CSV from GP Tool
The length fields is network  layer
Class, Toll Miles
Interstate , 8.000
Principal Arterial-Freeway , 4.000
RH Sample Report(similar ones with/without the same length fields)

[figure: Input · 0 · 10 · 1–9 · 11 · 12 · Lewis · Placer · Clark · Template Canvas · R1 · Interstate · Arterial- Freeway]

![Figure 22 — TestCase11a. – Summarize by LRS Event(functional class) and length field (Toll )](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-22-slide-17-testcase11a-summarize-by-lrs-event.png)

![Figure 23 — TestCase11a. – Summarize by LRS Event(functional class) and length field (Toll )](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-23-slide-17-testcase11a-summarize-by-lrs-event.svg)

### TC-U07 — Time Sliced Scenario <!-- src: S2 · slide 27 · case 22 -->

| Summarize by/ summary field | Length Field |  |
| --- | --- | --- |
| Functional Class/Class | Toll Miles | Guardrail Miles |

| R1 | 1/1/2000 - Null |
| --- | --- |
| Functional Class | 1/1/2005 – Null |
| Toll | 1/1/2010 – Null |
| Guard Rail | 1/1/2005 -1/1/2020 |

CSV from GP Tool

| Class | Toll Miles | Guardrail Miles |
| --- | --- | --- |

1. Effective Date : 1/1/2003 (warning empty csv )
2. Effective Date : 1/1/2006

| Class | Toll Miles | Guardrail Miles |
| --- | --- | --- |
| Interstate | 5.000 | 2.000 |
| Principal Arterial - Freeway | 1.000 | 2.000 |

| Class | Toll Miles | Guardrail Miles |
| --- | --- | --- |
| Interstate | 0.000 | 2.000 |
| Principal Arterial - Freeway | 0.000 | 2.000 |

| Class | Toll Miles | Guardrail Miles |
| --- | --- | --- |
| Interstate | 5.000 | 0.000 |
| Principal Arterial - Freeway | 1.000 | 0.000 |

3. Effective Date : 1/1/2015
4. Effective Date : 1/1/2020

[figure: Input · 0 · 10 · 1–9 · 11 · 12 · Lewis · Placer · Clark · Template Canvas · R1 · Interstate · Arterial- Freeway]

![Figure 33 — Test Case 22 - Time Sliced Scenario](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-33-slide-27-test-case-22-time-sliced-scenario.svg)

### TC-U08 — Derived Route Network <!-- src: S2 · slide 32 · case 26 -->

CSV from GP Tool

| Summarize by/ summary field | Length Field |
| --- | --- |
| County/Name | Mileage |

| County | Mileage |
| --- | --- |
| Clark | 6.500 |
| Lewis | 5.500 |

[figure: Input · Template Canvas · Lewis · Clark · 1–3 · 5 · 4 · 0 · 2–4 · 1 · 7–9 · 11 · 10 · R1L1 · R2L1 · R1L2 · Route1(Derived Network) · Route2(Derived Network)]

![Figure 38 — Test Case 26 - Derived Route Network](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-38-slide-32-test-case-26-derived-route-network.svg)

## Other content

### Slide 3 <!-- slide 3 -->

Verification

- Verify the output is created  as per provided summary and length field
- Verify the mileage/length  is calculated as per the selected effective date.
- Verify tool supports running against fgdb , egdb, FS (default and versions). If json is configured for fdgb or direct connect it can be used only for fgdb or direct connect.  If the json is configured for FS, it can be used only for FS.
- Verify the summary layer(boundary layer) is from the same database only

### Slide 4 — Error Messages <!-- slide 4 -->

| Condition | Error Message |
| --- | --- |
| Summary Layer not found in the database |  |
| Length field Event /Network layer not found in the data |  |
| Event /Network layer used for length field not found in the data |  |
| Using Python, provide json template with summary layer and also provide a second boundary feature/summary feature |  |
| Providing a non- LRS line feature class(boundary line) as a summary field |  |
| Providing summary field /length field not in the data |  |
| Providing invalid Json with missing parameters |  |
| Use the json configured for direct connect with network from Feature service |  |
| Use the json configured for FS with network from direct connect or fgdb |  |
| Choose a different network from the one that is provided in Json for summary and length fields.(No measure translation as of now) |  |
| Choose a different network from a different database added to the map. |  |

### Slide 5 <!-- slide 5 -->

Testing

- Test in fgdb, egdb (oracle + SQL), fs - default and versions
- Test with nonline network and  Line work with events
- Test with PoM  and derived network using polygon summary layer or network layer.
- Test using spanning and non-spanning events
- Test with and without route selection and definition query
- The tool should run when the layers are checked off (invisible) in map
- Test running against thousands of routes
- Test simple, gapped routes, multi-gapped routes, complex shapes, and z values
- Test with overlapping events and test with gaps in events
- Test with mileage/Length unit different from the network units of measure. Take a route in GCS and verify the mileage in km, m, ft and miles.
- Test in python inline and stand alone
- Batch processing using multiple json (low priority)
- Batch processing using the same json with different selection set of routes. (low priority)
- Batch Processing using different effective date(low priority)
- Test in model builder with chaining-  Generate LR Product GP tool -  csv to excel.

Data
Test with large sets of data. All the illustrated test cases contain single route, will be tested with large set of customer data
 InDot,  Caltrans, APR data. Test with one more RH  customer data with diff unit of measure if possible.

### Slide 6 <!-- slide 6 -->

TestCase1 – Summarize by  LRS Network (no summary field and no length field). For this case, the GP parameters Boundary layer and Summary field show up .  If nothing is provided, then the mileage will be summarized route wise. If boundary layer is chosen, then use that boundary to summarise.

| RouteID | Length |
| --- | --- |
| R1 | 12.000 |

CSV from GP Tool

| County Name | Length |
| --- | --- |
| Clark | 6.500 |
| Lewis | 3.000 |
| Placer | 2.500 |

If no boundary layer is chosen, then
If  boundary layer is chosen, then

[figure: Input · 0 · 10 · 1–9 · 11 · 12 · Lewis · Placer · Clark · Template Canvas · R1]

![Figure 1 — 6](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-01-slide-06-6.png)

![Figure 2 — 6](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-02-slide-06-6.svg)

### Slide 7 <!-- slide 7 -->

TestCase2 – Summarize by Line Network –  (no summary field and no length field). For this case, the GP parameters Boundary layer and Summary field show up .  If nothing is provided, then the mileage will be summarized route wise. (Add an output containing countywise summary)
CSV from GP Tool

When no summary or length name is provided in the template

[figure: Input · Template Canvas · Lewis · Clark · 1–3 · 5 · 4 · 0 · 2–4 · 1 · 7–9 · 11 · 10 · R1L1 · R2L1 · R1L2]

![Figure 1 — 6](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-01-slide-06-6.png)
![Figure 3 — 7](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-03-slide-07-7.png)

![Figure 4 — 7](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-04-slide-07-7.svg)

### Slide 8 <!-- slide 8 -->

TestCase3 – Summarize by Line Network –  Summary Field  - Line name , no length field (enhancement)
CSV from GP Tool

| Summarize by / summary field |
| --- |
| Network/Line Name |

| Line Name | Length |
| --- | --- |
| L1 | 8.000 |
| L2 | 4.000 |

Line Name , Length
L1 , 8.000
L2 , 4.000

[figure: Input · Template Canvas · Lewis · Clark · 1–3 · 5 · 4 · 0 · 2–4 · 1 · 7–9 · 11 · 10 · R1L1 · R2L1 · R1L2]

![Figure 5 — 8](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-05-slide-08-8.png)

![Figure 6 — 8](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-06-slide-08-8.svg)

### Slide 10 — RH Sample Report(similar ones with/without the same length fields) <!-- slide 10 -->

TestCase5 – Summarize by Line Network –  Summary Field  - County , no length field
CSV from GP Tool

| Summarize by / summary field |
| --- |
| County/ County |

County , Length
Clark , 6.500
Lewis , 5.500

[figure: Input · Template Canvas · Lewis · Clark · 1–3 · 5 · 4 · 0 · 2–4 · 1 · 7–9 · 11 · 10 · R1L1 · R2L1 · R1L2]

![Figure 11 — RH Sample Report(similar ones with/without the same length fields)](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-11-slide-10-rh-sample-report-similar-ones.png)
![Figure 12 — RH Sample Report(similar ones with/without the same length fields)](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-12-slide-10-rh-sample-report-similar-ones.png)

![Figure 13 — RH Sample Report(similar ones with/without the same length fields)](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-13-slide-10-rh-sample-report-similar-ones.svg)

### Slide 11 <!-- slide 11 -->

TestCase7 – Summarize by  Polygon No length field, few polygons are already chosen in the template

| Summarize by/summary field |
| --- |
| County / Name |
| Clark |
| Lewis |

| Name | Length |
| --- | --- |
| Clark | 6.500 |
| Lewis | 3.000 |

CSV from GP Tool
Name, Length
Clark ,  6.500
Lewis , 3.000

[figure: Input · 0 · 10 · 1–9 · 11 · 12 · Lewis · Placer · Clark · Template Canvas · R1]

![Figure 14 — 11](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-14-slide-11-11.svg)

### Slide 12 <!-- slide 12 -->

TestCase8 –No Summary field only length field -  Summary will be route wise

| Summary Field (Network) | Length Field (No of Lanes) |  |
| --- | --- | --- |
| Mileage | 2 lanes Miles | 4 lanes Miles |

| RouteID | 2 lanes Miles | 4 lanes Miles |
| --- | --- | --- |
| R1 | 8.000 | 4.000 |

CSV from GP Tool
The length fields are from the unique values for number of lanes attribute field from Lane event layer.
RouteID , 2 lanes Miles , 4 lanes Miles
R1  , 8.000 , 4.000

[figure: Input · 0 · 10 · 1–9 · 11 · 12 · R1 · 2 lanes · 4 lanes · Template Canvas]

![Figure 15 — 12](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-15-slide-12-12.png)

![Figure 16 — 12](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-16-slide-12-12.svg)

### Slide 18 <!-- slide 18 -->

TestCase12 – Summarize by LRS Event(functional class) and length fields   (Toll , Guardrail)

| Summarize by/ summary field | Length Field |  |
| --- | --- | --- |
| Functional Class/Class | Toll | Guardrail |

| Class | Toll | Guardrail |
| --- | --- | --- |
| Interstate | 5.000 | 3.000 |
| Principal Arterial - Freeway | 1.000 | 2.000 |
| Principal Arterial – other | 0.000 | 0.000 |
| Minor Arterial | 0.000 | 0.000 |
| Major Collector | 0.000 | 0.000 |
| Minor Collector | 0.000 | 0.000 |
| Local | 0.000 | 0.000 |

CSV from GP Tool
The length fields is Toll event layer and Guardrail event layer
Class, Toll, Guardrail
Interstate , 5.000, 3.000
Principal Arterial-Freeway, 1.000, 2.000
Principal Arterial - Other, 0.000, 0.000
Minor Arterial, 0.000, 0.000
Major Collector, 0.000, 0.000
Minor Collector, 0.000, 0.000
Local, 0.000, 0.000

[figure: Input · 0 · 10 · 1–9 · 11 · 12 · Lewis · Placer · Clark · Template Canvas · R1 · Interstate · Arterial- Freeway]

![Figure 24 — 18](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-24-slide-18-18.svg)

### Slide 19 <!-- slide 19 -->

Test Case 13  – Summarize by LRS Event(functional class) and length fields   (Toll , Guardrail ).  Exclude null values in the GP tool

| Summarize by/ summary field | Length Field |  |
| --- | --- | --- |
| Functional Class/Class | Toll | Guardrail |

| Class | Toll | Guardrail |
| --- | --- | --- |
| Interstate | 5.000 | 3.000 |
| Principal Arterial - Freeway | 1.000 | 2.000 |

CSV from GP Tool
The length fields is Toll event layer and Guardrail event layer
Class, Toll, Guardrail
Interstate , 5.000, 3.000
Principal Arterial-Freeway, 1.000, 2.000
Principal Arterial - Other, 0.000, 0.000

[figure: Input · 0 · 10 · 1–9 · 11 · 12 · Lewis · Placer · Clark · Template Canvas · R1 · Interstate · Arterial- Freeway]

![Figure 25 — 19](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-25-slide-19-19.svg)

### Slide 20 — RH Sample Report(similar ones with/without the same length fields) <!-- slide 20 -->

Test Case 14  – Summarize by LRS Event(Rural urban) and length fields  (mileage(network) , lanes )

| Summarize by/ summary field | Length Field |  |  |
| --- | --- | --- | --- |
| Rural Urban/Rural urban | Network | Functionclass –Interstate | Functional class - Freeway |

| Rural Urban | Length | Inter State | Freeway |
| --- | --- | --- | --- |
| 0 - outside urban_outside corporation(Rural) | 2.500 | 2.500 | 0.000 |
| 1 - Inside urban_outside_corporation(urban) | 4.000 | 4.000 | 0.000 |
| 2- Inside urban_Outside_Corporation (urban) | 1.500 | 1.500 | 0.000 |
| 2- Inside urban_Outside_Corporation (urban) | 1.500 | 0.000 | 1.500 |
| 3 - outside _ urban_Inside corporation(Rural) | 2.500 | 0.000 | 2.500 |

CSV from GP Tool

Rural Urban, Length, Inter State, Freeway
0-outside urban_outside corporation(Rural), 2.500, 2.500, 0.000
1-outside urban_outside corporation(Rural), 4.000, 4.000, 0.000
2-Inside urban_Outside_Corporation(urban), 1.500, 1.500, 0.000
2-Inside urban_Outside_Corporation(urban), 1.500, 0.000, 1.500
3-outside_urban_Inside corporation(Rural), 2.500, 0.000, 2.500

[figure: Input · 0 · 10 · 1–9 · 11 · 12 · 2 · 3 · Template Canvas · R1 · Interstate · Arterial-freeway · Output · 1]

![Figure 26 — RH Sample Report(similar ones with/without the same length fields)](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-26-slide-20-rh-sample-report-similar-ones.svg)

### Slide 21 <!-- slide 21 -->

TestCase15 – Summarize by LRS Event(functional class) and length fields  ( county field from network)

| Summarize by/ summary field | Length Field (County Name from network) |  |  |
| --- | --- | --- | --- |
| Functional Class/Class | Clark | Lewis | Placer |

| Class | Clark | Lewis | Placer |
| --- | --- | --- | --- |
| Interstate | 6.500 | 2.500 | 0.000 |
| Principal Arterial - Freeway | 0.000 | 2.500 | 2.500 |
| Principal Arterial – other | 0.000 | 0.000 | 0.000 |
| Minor Arterial | 0.000 | 0.000 | 0.000 |
| Major Collector | 0.000 | 0.000 | 0.000 |
| Minor Collector | 0.000 | 0.000 | 0.000 |
| Local | 0.000 | 0.000 | 0.000 |

CSV from GP Tool
Class, Clark, Lewis, Placer
Interstate, 6.500, 2.500, 0.000
Principal Arterial -Freeway, 0.000, 2.500, 2.500
Principal Arterial - other, 0.000, 0.000, 0.000
Minor Arterial, 0.000, 0.000, 0.000
Major Collector, 0.000, 0.000, 0.000
Minor Collector, 0.000, 0.000, 0.000
Local, 0.000, 0.000, 0.000

[figure: Input · 0 · 10 · 1–9 · 11 · 12 · Template Canvas · R1 · Interstate · Arterial- Freeway]

![Figure 27 — 21](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-27-slide-21-21.svg)

### Slide 22 <!-- slide 22 -->

TestCase16 – Summarize by LRS Event and length fields   ( Pavement condition & Functional class)

| Summarize by/ summary field | Length Field (Pavement condition & Functional Class) |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| Speed Limit /Speed | IRI Rating (>220) miles | IRI Rating<br>(120-170) miles | IRI Rating<br>(60 -119) miles | IRI Rating<br>(<60)<br>miles | FunCls Interstate miles | FunCls – Arterial Freeway miles |

| Speed | IRI Rating<br>(>220) miles | IRI Rating<br>(120-170) miles | IRI Rating<br>(60 -119) miles | IRI Rating<br>(<60)<br>miles | FunCls Interstate miles | FunCls – Arterial Freeway miles |
| --- | --- | --- | --- | --- | --- | --- |
| 65 mph | 3.500 | 3.000 | 0.000 | 0.000 | 6.500 | 0.000 |
| 45 mph | 0.500 | 1.000 | 0.000 | 0.500 | 1.500 | 1.500 |
| 25 mph | 0.000 | 0.000 | 1.500 | 1.000 | 0.000 | 2.500 |

CSV from GP Tool
Speed, IRI Rating(>220) miles, IRI Rating(120-170) miles, IRI Rating(60 -119) miles, IRI Rating(<60)miles, FunCls Interstate miles, FunCls – Arterial Freeway miles
65 mph, 3.500, 3.000, 0.000, 0.000, 6.500, 0.000
45 mph, 0.500, 1.000, 0.000, 0.500, 1.500, 1.500
25 mph, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000
<40 mph, 0.000, 0.000, 1.500, 1.000, 0.000, 2.500

[figure: Input · 0 · 10 · 1–9 · 11 · 12 · 45 mph · 25 mph · 65 mph · Template Canvas · R1 · Interstate · Arterial- Freeway · <60 · 60 - 119 · 120-170 · >220]

![Figure 28 — 22](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-28-slide-22-22.svg)

### Slide 23 — RH Sample Report(similar ones with/without the same length fields) <!-- slide 23 -->

Test Case 18  - County wise summary on mileage with federal Aid mileage as length

| Summarize by/ summary field | Length Field |  |  |  |
| --- | --- | --- | --- | --- |
| County /County Name | Fed Aid– Non-Interstate | Fed Aid – Rural on | Fed Aid –Urban on | Fed Aid -Interstate |

| County Name | Fed Aid-Non-Interstate | Fed Aid-Rural On | Fed Aid-Urban On | Fed Aid- Inter State |
| --- | --- | --- | --- | --- |
| Clark | 0.000 | 0.000 | 0.000 | 6.500 |
| Lewis | 1.500 | 0.000 | 0.000 | 1.500 |
| Placer | 2.500 | 0.000 | 0.000 | 0.000 |

CSV from GP Tool
County Name, FedAid-InterState, FedAid-Rural on, FedAid- Urban on , FedAid- Interstate
Clark, 0.000, 0.000, 0.000, 6.500
Lewis, 1.500, 0.000, 0.000, 1.500
Placer, 2.500, 0.000, 0.000, 0.000

[figure: Input · 0 · 10 · 1–9 · 11 · 12 · Lewis · Placer · Clark · Template Canvas · R1 · Interstate · NonInterstate]

![Figure 29 — RH Sample Report(similar ones with/without the same length fields)](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-29-slide-23-rh-sample-report-similar-ones.svg)

### Slide 24 <!-- slide 24 -->

Test Case 19  - Overlapping Events – Speed Limit – For mileage both the events will be considered.

| Summarize by/ summary field | Length Field (Speed Limit) |  |  |  |
| --- | --- | --- | --- | --- |
| County /Name | >60 | 50 -60 | 40 – 50 | <40 |

| Name | >60 | 50 -60 | 40 -50 | <40 |
| --- | --- | --- | --- | --- |
| Clark | 5.000 | 0.000 | 1.500 | 0.000 |
| Lewis | 0.000 | 0.000 | 3.000 | 1.500 |
| Placer | 0.000 | 0.000 | 2.500 | 2.500 |

CSV from GP Tool
Name, >60, 50-60, 40-50, >40
Clark, 5.000, 0.000, 1.500, 0.000
Lewis, 0.000, 0.000, 3.000, 1.500
Placer,0.000, 0.000, 2.500, 2.500
 Save a  filter expression for the length fields.

[figure: Input · 0 · 10 · 1–9 · 11 · 12 · Lewis · Placer · Clark · Template Canvas · R1 · 65 · 45 · 40 · 25]

![Figure 30 — 24](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-30-slide-24-24.svg)

### Slide 25 <!-- slide 25 -->

Test Case 20  - Complex route  Test with variety of complex route  loop , alpha, branch.

| Summarize by/ summary field | Length Field (Network & parking Event) |  |  |  |
| --- | --- | --- | --- | --- |
| County/Name | Network | Peak Parking Allowed on one side | Peak Parking allowed on both sides | Peak Parking not allowed |

CSV from GP Tool

| Name | Network | Peak Parking Allowed on one side | Peak Parking allowed on both sides | Peak Parking not allowed |
| --- | --- | --- | --- | --- |
| Clark | 0.600 | 0.350 | 0.250 | 0.050 |
| Lewis | 0.350 | 0.200 | 0.000 | 0.150 |
| Placer | 0.440 | 0.190 | 0.250 | 0.000 |
| Placer1 | 0.260 | 0.110 | 0.000 | 0.150 |

Name, Network, Peak parking allowed on one side, Peak parking allowed on both sides, Peak parking not allowed
Clark, 0.600, 0.350, 0.250, 0.050
Lewis, 0.350, 0.200, 0.000, 0.150
Placer, 0.440, 0.190, 0.250, 0.000
Placer1, 0.260, 0.110, 0.000, 0.150

[figure: Input · R1 · Clark · Lewis · Placer · Placer1 · Template Canvas · One side · Both sides · None]

![Figure 31 — 25](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-31-slide-25-25.svg)

### Slide 26 — RH Sample Report(similar ones with/without the same length fields) <!-- slide 26 -->

Test Case 21  - Gapped  route
Test with Multiple gapped routes, test with network with different sets of calibration rules. Get the test data from Claire.

| Summarize by | Length Field (Network/Lanes) |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| Network | Rural<br>Miles | Urban Miles | 6 lanes | 4 lanes | 2 lanes |

 Save a  SQL query for Lane miles (no of lanes *mileage(ToMeasure - FromMeasure) in template.
CSV from GP Tool

| RouteID | Rural Miles | Urban Miles | 6 lanes | 4 lanes | 2 lanes |
| --- | --- | --- | --- | --- | --- |
| I-16 | 4.000 | 8.000 | 3.000 | 3.000 | 1.000 |

[figure: Input · 0 · 10 · 1–5 · 7–9 · 11 · 12 · Lewis · Placer · Clark · Template Canvas · R1 · Urban · Rural · 2 lanes · 3 lanes · 4 lanes · 6 lanes]

![Figure 32 — RH Sample Report(similar ones with/without the same length fields)](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-32-slide-26-rh-sample-report-similar-ones.svg)

### Slide 28 — APR Sample Report(similar ones with/without the same length fields) <!-- slide 28 -->

Test Case 23  -Spanning Events – Line Network – Countywise – Pipe material Mileage  (Pipes – spanning event )

| Summarize by/ summary field | Length Field (Pipes Event – diameter Field) |  |  |  |
| --- | --- | --- | --- | --- |
| Network/Line Name | 2” To 4” | 6” To 10” | 12” To 20” | 24” To 28” |

| Line Name | 2” To 4” | 6” To 10” | 12” To 20” | 24” To 28” |
| --- | --- | --- | --- | --- |
| L1 | 0.000 | 9.000 | 0.000 | 0.000 |
| L2 | 0.000 | 0.000 | 4.000 | 0.000 |

CSV from GP Tool

[figure: Input · Template Canvas · 1–3 · 5 · 4 · 0 · 2–4 · 1 · 7–9 · 11 · 10 · R1L1 · R2L1 · R1L2 · 6” To 10” · 12” To 20”]

![Figure 34 — APR Sample Report(similar ones with/without the same length fields)](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-34-slide-28-apr-sample-report-similar-ones.svg)

### Slide 29 <!-- slide 29 -->

Test Case 24 -Spanning Events – Line Network – Countywise – Pipe material Mileage  (Pipes – spanning event )

| Summarize by/ summary field | Length Field (Pipes Event – Material Field) |  |  |  |
| --- | --- | --- | --- | --- |
| County /Name | Bare Steel | Coated Steel | Cast Iron or Wrought Iron (Filter expression two unique values) | Copper |

| Name | Bare Steel | Coated Steel | Cast Iron or Wrought Iron | Copper |
| --- | --- | --- | --- | --- |
| Clark | 0.000 | 5.000 | 2.5 | 0.000 |
| Lewis | 0.000 | 0.000 | 5.500 | 0.000 |

CSV from GP Tool

Name, Bare Steel, Coated Steel, Cast Iron/Wrought Iron, Copper
Clark, 0.000, 6.500, 0.000, 0.000
Lewis, 0.000, 0.000, 1.500, 4.000

[figure: Input · Template Canvas · Lewis · Clark · 1–3 · 5 · 4 · 0 · 2–4 · 1 · 7–9 · 11 · 10 · R1L1 · R2L1 · R1L2 · Coated Steel · Cast Iron · Wrought Iron]

![Figure 35 — 29](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-35-slide-29-29.svg)

### Slide 30 <!-- slide 30 -->

Test Case 25  -Spanning Events – Line Network – Countywise – Pipe material Mileage  (Pipes – spanning event) – selecting only route R2L1

| Summarize by/ summary field | Length Field (Pipes Event – Material Field) |  |  |  |
| --- | --- | --- | --- | --- |
| County /Name | Bare Steel | Coated Steel | Cast Iron | Copper |

| Name | Bare Steel | Coated Steel | Cast Iron | Copper |
| --- | --- | --- | --- | --- |
| Clark | 0.000 | 4.500 | 0.000 | 2.000 |
| Lewis | 0.000 | 3.500 | 2.000 | 0.000 |

CSV from GP Tool

Name, Bare Steel, Coated Steel, Cast Iron/Wrought Iron, Copper
Clark, 0.000, 2.500, 0.000, 0.000
Lewis, 0.000, 0.000, 1.500, 0.000
Only select route R2L1 in the GP tool expand the result to the entire line. For a line network provide for entire line

[figure: Input · Template Canvas · Lewis · Clark · 1–3 · 5 · 4 · 0 · 2–4 · 1 · 7–9 · 11 · 10 · R1L1 · R2L1 · R3L1 · Coated Steel · Cast Iron · Copper]

![Figure 36 — 30](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-36-slide-30-30.svg)

### Slide 31 <!-- slide 31 -->

Test Case 26  -Spanning Events – Line Network – Countywise – Pipe material Mileage  (Pipes – spanning event) –  selecting only one county.

| Summarize by/ summary field | Length Field (Pipes Event – Material Field) |  |  |  |
| --- | --- | --- | --- | --- |
| County /Name | Bare Steel | Coated Steel | Cast Iron | Copper |
| Clark |  |  |  |  |

| Name | Bare Steel | Coated Steel | Cast Iron | Copper |
| --- | --- | --- | --- | --- |
| Clark | 0.000 | 4.500 | 0.000 | 3.000 |

CSV from GP Tool

Name, Bare Steel, Coated Steel, Cast Iron/Wrought Iron, Copper
Clark, 0.000, 2.500, 0.000, 0.000

[figure: Input · Template Canvas · Lewis · Clark · 1–3 · 5 · 4 · 0 · 2–4 · 1 · 7–9 · 11 · 10 · R1L1 · R2L1 · R3L1 · Coated Steel · Cast Iron · Copper]

![Figure 37 — 31](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-37-slide-31-31.svg)

### Slide 33 <!-- slide 33 -->

Cases   for multiple summary field user stories

### Slide 34 <!-- slide 34 -->

TestCase6 – Summarize by Line Network –  Two Summary Fields from two layers  - County (county boundary), Line name (LRS network)  and  no length field(Not possible for this userstory)
CSV from GP Tool

County ,Line, Length
Clark , L1, 6.508
Lewis ,L1, 1.403
Lewis, L2, 4.000

[figure: Input · Template Canvas · Lewis · Clark · 1–3 · 5 · 4 · 0 · 2–4 · 1 · 7–9 · 11 · 10 · R1L1 · R2L1 · R1L2]

![Figure 39 — 34](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-39-slide-34-34.svg)

### Slide 35 — RH Sample Report(similar ones with/without the same length fields) <!-- slide 35 -->

TestCase17 – Summarize Functional Class (LRS event)  - Length (State wise , countywise, city wise(nor LRS layers fields)) – Exclude null rows. This is multiple boundary layers   Not possible

| Summarize by/ summary field | Length Field (Fields from different non LRS layers) |  |  |
| --- | --- | --- | --- |
| Functional Class/Class | Name<br>(State) | Name<br>(County) | Name<br>(City) |

| Functional Class | State | County |  |  | City |
| --- | --- | --- | --- | --- | --- |
|  |  | Clark | Lewis | Placer |  |
| Interstate | 8 | 6.5 | 2.5 |  | 1.25 |
| Principal Arterial - Freeway | 4 | 0 | 2.5 | 2.5 | 1.25 |

CSV from GP Tool

[figure: Input · 0 · 10 · 1–9 · 11 · 12 · Lewis · Placer · Clark · Template Canvas · R1 · Interstate · Arterial- Freeway · State1 · City1]

![Figure 40 — RH Sample Report(similar ones with/without the same length fields)](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-40-slide-35-rh-sample-report-similar-ones.svg)

### Slide 36 <!-- slide 36 -->

These Reports are possible if we have multiple summary fields.

![Figure 41 — 36](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-41-slide-36-36.png)

### Slide 37 <!-- slide 37 -->

### Slide 38 <!-- slide 38 -->

![Figure 12 — RH Sample Report(similar ones with/without the same length fields)](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-12-slide-10-rh-sample-report-similar-ones.png)
![Figure 5 — 8](../media/5769-generate-lr-data-product-support-summary-and-length-fields/fig-05-slide-08-8.png)
