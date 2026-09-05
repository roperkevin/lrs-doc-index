# Append Calibration Points To LRS Tool 7203 Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | 3.8 |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [Append Calibration Points To LRS Tool #7203 Test Plan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/Append%20Calibration%20Points%20To%20LRS%20Tool%20%237203%20Test%20Plan.pptx>) |
| **Edited** | 2026-06-16 19:43 by Karlie Murray |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Append Calibration Points To LRS Tool 7203 Test Plan"
source_file: "Append Calibration Points To LRS Tool #7203 Test Plan.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/Append%20Calibration%20Points%20To%20LRS%20Tool%20%237203%20Test%20Plan.pptx"
doc_id: 22
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: "3.8"
pe: ""
dev: ""
author: "Karlie Murray"
last_edited_by: "Karlie Murray"
last_edited: "2026-06-16T19:43:33Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["calibration points", "append", "route recalibration", "time slice", "partial success", "event behavior", "performance testing", "gp tool"]
tools: ["Append Calibration Points To LRS Tool"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":40,"file":"append-calibration-points-to-lrs-tool__doc40.md","s":6.723},{"doc":137,"file":"append-routes-allow-partial-loading-test-plan__doc137.md","s":3.716},{"doc":549,"file":"append-events-load-events-by-routename-test-plan__doc549.md","s":2.891},{"doc":253,"file":"feature-count-support-generate-data-gp-tool-test-plan__doc253.md","s":2.856},{"doc":535,"file":"reassign-ui-existing-line-test-plan__doc535.md","s":2.612}]
```
-->

## Summary

Test plan for the Append Calibration Points to LRS tool in ArcGIS Pro 3.8. Covers validation criteria for source calibration points, UI error handling, successful and partial success scenarios, event behavior application, and performance testing across various data sources and network types. Includes tests for calibration point appending, route recalibration, time slicing, and error reporting.

## Related documents

<!-- related:begin -->
- [Append Calibration Points to LRS tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-calibration-points-to-lrs-tool__doc40.md>) — similar text 0.31 · 4 title words · 4 filename words · same surface <!-- rel:40 -->
- [Append Routes: Allow Partial Loading Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-routes-allow-partial-loading-test-plan__doc137.md>) — similar text 0.10 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:137 -->
- [Append Events: Load Events by RouteName Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-events-load-events-by-routename-test-plan__doc549.md>) — similar text 0.16 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:549 -->
- [Feature Count Support Generate Data GP Tool Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/feature-count-support-generate-data-gp-tool-test-plan__doc253.md>) — similar text 0.08 · 1 title word · same kind/surface/folder <!-- rel:253 -->
- [Reassign UI Existing Line Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/reassign-ui-existing-line-test-plan__doc535.md>) — similar text 0.14 · same kind/surface/folder <!-- rel:535 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html)

_No page matched:_ [Append Calibration Points To LRS Tool](https://www.google.com/search?q=%22Append%20Calibration%20Points%20To%20LRS%20Tool%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Append Calibration Points To LRS Tool 7203 PRO 3.8

## Slide 2 — Valid source calibration points criteria:

- Feature class has Measure, From Date, To Date, and Route ID fields
- Route ID is not null and Route ID is present in Network
- Route is not locked
- Located on Route or within tolerance
- Measure is valid and does not create non-monotonic scenario
- From/To Dates are inside temporal range of route
- CP is not a duplicate or overlaps another CP (unless existing CP does not exist in the same time frame as the source CP)
Environments/Data to Test with:

- GP Tool
- Model Builder
- Python
- Feature service, FGDB, Direct Connect data sources + mixing data sources for source & target
- Large dataset for performance testing
- Non-line and Line Networks
  - Transmountain data for APR
  - CDOT or ODOT data for RH
Note: Tool will never give a red failure message – it will always be partial fail (yellow)

## Slide 3 — UI TESTs:

- Run is disabled until all 3 fields + field mapping is populated
- When Source is not a valid feature class/layer
  - Error: Invalid feature layer or feature class
- When Target Calibration Point layer is missing required fields or invalid
    - Error: The target calibration point is not a valid LRS calibration point
- When LRS Network field does not contain a Network layer
  - Error: Input network parameter is not a recognized LRS Network
- When Source & Target Calibration Point layers are the same
	Error: The source dataset cannot be the same as the target one

- Error on field when Source & Target layers have different coordinate methods or Z-value units
- Field mapping error when Source & Target fields do not have matching data types/lengths (length of source field longer than target field only)
  - Error: Field Mapping parameter cannot be convert to IGPFieldMapping type
Required Fields

![image9.png](../media/doc1010_image9.png) ![image10.png](../media/doc1010_image10.png)

## Slide 4 — UI TESTs: Field Mapping

![image11.png](../media/doc1010_image11.png)

## Slide 5

Result: user receives message that the tool ran successfully

- Calibration Points are appended successfully
- Routes with newly appended calibration points are recalibrated
- Success message is given with no error counts
Run with a Line & Non-line Network in GP Tool when:
Source Calibration Points: Feature Service
Target Network: Feature Service
Input Calibration Points:

![Measured route diagram drawn from the slide's own shapes, measures 1 to 10.](../media/doc1010_slide5.svg)

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 3 |
| R1 | 01/01/2025 | Null | 9 |

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

Black: Pre-existing CPs
Green: New CP

## Slide 6

Result: user receives message that the tool ran successfully

- Calibration Points are appended successfully
- Off the route (but within tolerance) Calibration Points are moved onto route
- Routes with newly appended calibration points are recalibrated
- Success message is given with no error counts

Run with a Line & Non-line Network in GP Tool when:
Source Calibration Points: EGDB
Target Network: EGDB
Input Calibration Points:

![Measured route diagram drawn from the slide's own shapes, measures 1 to 10.](../media/doc1010_slide6.svg)

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 3 |
| R1 | 01/01/2025 | Null | 9 |

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

Black: Pre-existing CPs
Green: New CP

### Notes

Add test for CP off route but within network tolerance

## Slide 7

Result: user receives message that the tool ran successfully

- Calibration Points are appended successfully to route
- New time slice is created
- Original R1 route and calibration points are not retired
- Routes with newly appended calibration points are recalibrated
- Success message is given with no error counts

Run with a Line & Non-line Network in GP Tool when:
Source Calibration Points: EGDB
Target Network: EGDB
Input Calibration Points:

![Measured route diagram drawn from the slide's own shapes, measures 1 to 10.](../media/doc1010_slide7.svg)

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 07/01/2025 | Null | 4 |

Route R1 (01/01/2025 – 07/01/2025)

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

Route R1 (07/01/2025 – Null)
Black: Pre-existing CPs
Green: New CP

![image12.png](../media/doc1010_image12.png)

### Notes

Calibration pts did not retire?

## Slide 8

![Diagram drawn from the slide's own shapes: 2 nodes, 9 connectors.](../media/doc1010_slide8.svg)

| Case # | From Date | To Date |
| --- | --- | --- |
| 1 | 01/01/2000 | 12/31/2025 |
| 2 | 01/01/2005 | 12/31/2025 |
| 3 | 01/01/2025 | 12/31/2020 |
| 4 | 01/01/2000 | Null |
| 5 | 01/01/2005 | Null |
| 6 | 01/01/2030 | 01/01/2012 |
| 7 | Null | 12/31/2010 |
| 8 | Null | Null |

When route R1 has the following From/To Dates:
And then a Calibration Point with the following From/To Dates are appended to route R1:
Append successful + new time slice
Append successful + new time slice
Time Slice Tests on Active Route
Append successful + 3 new time slices
When a new time slice is created the original Route R1 is retired

Append successful + new time slice

## Slide 9

![Diagram drawn from the slide's own shapes: 2 nodes, 9 connectors.](../media/doc1010_slide9.svg)

| Case # | From Date | To Date |
| --- | --- | --- |
| 1 | 01/01/2000 | 12/31/2025 |
| 2 | 01/01/2005 | 12/31/2025 |
| 3 | 01/01/2025 | 12/31/2020 |
| 4 | 01/01/2000 | Null |
| 5 | 01/01/2005 | Null |
| 6 | 01/01/2030 | 01/01/2012 |
| 7 | Null | 12/31/2010 |
| 8 | Null | Null |

When route R1 has the following From/To Dates:
And then a Calibration Point with the following From/To Dates are appended to route R1:
Append successful + new time slice
Time Slice Tests on Retired Route
Append successful + new time slice
Append successful + new time slice

## Slide 10

Result: user receives message that the tool ran successfully

- Z-value Calibration Points are appended successfully
- Routes with newly appended calibration points are recalibrated
- Success message is given with no error counts

Run with a Line & Non-line Network in GP Tool when:
Source Calibration Points: Feature Service
Target Network: FGDB
Input Calibration Points:

| RouteID | From Date | To Date | Measure | Z-value |
| --- | --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 8 | 10 |

![Measured route diagram drawn from the slide's own shapes, measures 1 to 12.](../media/doc1010_slide10.svg)

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

Black: Pre-existing CPs
Green: New CP

![image12.png](../media/doc1010_image12.png)

## Slide 11

Result: user receives message that the tool ran with partial success

- Any valid Calibration Points are appended successfully
- Calibration Points off the route & not within tolerance are skipped
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created with failure reason in status field + text file with error messages
- Message: Point geometry does not fall on route

Run with a Line & Non-line Network in GP Tool when:
Source Calibration Points: Feature Service
Target Network: EGDB
Input Calibration Points:

![Measured route diagram drawn from the slide's own shapes, measures 1 to 12.](../media/doc1010_slide11.svg)

| RouteID | From Date | To Date | Measure | Z-value |
| --- | --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 8 | 25 |

Output Route: No new CPs

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

![image12.png](../media/doc1010_image12.png)

## Slide 12

Result: user receives message that the tool ran successfully

- Calibration Points are appended successfully to route
- Routes with newly appended calibration points are recalibrated to reflect unequal measures
- Success message is given with no error counts

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 8 |
| R1 | 01/01/2025 | Null | 4 |

![Measured route diagram drawn from the slide's own shapes, measures 1 to 10.](../media/doc1010_slide12.svg)

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

Black: Pre-existing CPs
Green: New CP

Source Calibration Points: FGDB
Target Network: EGDB

## Slide 13

Result: user receives message that the tool ran successfully

- Calibration Points are appended successfully to branch route because the minimum requirement of four calibration points was met
- Routes with newly appended calibration points are recalibrated
- Success message is given with no error counts

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

![Measured route diagram drawn from the slide's own shapes, measures 2 to 13.](../media/doc1010_slide13.svg)

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 1 |
| R1 | 01/01/2025 | Null | 10 |
| R1 | 01/01/2025 | Null | 10 |
| R1 | 01/01/2025 | Null | 13 |

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

Black: Pre-existing CPs
Green: New CP

Source Calibration Points: FGDB
Target Network: Feature Service

## Slide 14

Result: user receives message that the tool ran with partial success

- Any valid Calibration Points are appended successfully
- Calibration Points on branch route are skipped
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created with failure reason in status field + text file with error messages
- Message: Calibration points would introduce non-monotonic measures on route '%s'.

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

![Measured route diagram drawn from the slide's own shapes, measures 2 to 13.](../media/doc1010_slide14.svg)

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 1 |
| R1 | 01/01/2025 | Null | 22 |
| R1 | 01/01/2025 | Null | 10 |
| R1 | 01/01/2025 | Null | 13 |

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

Output Route: No new CPs

Source Calibration Points: EGDB
Target Network: Feature Service

## Slide 15

Result: user receives message that the tool ran with partial success

- Any valid Calibration Points are appended successfully
- Calibration Points that overlap existing calibration points are skipped
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created with failure reason in status field + text file with error messages
- Message: There is already a calibration point for this route at this location.  Either add the calibration point at a different location or edit the existing calibration point using the Edit Calibration Point tool.

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 1 |

![Measured route diagram drawn from the slide's own shapes, measures 2 to 13.](../media/doc1010_slide15.svg)

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

Output Route: No new CPs
Source Calibration Points: EGDB
Target Network: FGDB

## Slide 16

Result: user receives message that the tool ran with partial success

- Any valid Calibration Points are appended successfully
- Calibration Points off the route & not within tolerance are skipped
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created with failure reason in status field + text file with error messages
- Message: Point geometry does not fall on route

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

![Measured route diagram drawn from the slide's own shapes, measures 1 to 10.](../media/doc1010_slide16.svg)

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 3 |
| R1 | 01/01/2025 | Null | 9 |

Output Route: no new CPs

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

![image12.png](../media/doc1010_image12.png)

## Slide 17

Result: user receives message that the tool ran with partial success

- Any valid Calibration Points are appended successfully
- Calibration Points on locked route are skipped
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created with failure reason in status field + text file with error messages
- Message: Could not acquire conflict-prevention lock for route
Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 3 |
| R1 | 01/01/2025 | Null | 9 |

Output Route: no new CPs

![Measured route diagram drawn from the slide's own shapes, measures 1 to 10.](../media/doc1010_slide17.svg)

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 (locked by other user/version) | 01/01/2025 | Null |

For Line Network, LineID is locked

![image12.png](../media/doc1010_image12.png)

### Notes

Line network line id is locked

## Slide 18

Result: user receives message that the tool ran with partial success

- Any valid Calibration Points are appended successfully
- Duplicate Calibration Points are skipped
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created with failure reason in status field + text file with error messages
- Message: Calibration points would introduce non-monotonic measures on route

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 3 |
| R1 | 01/01/2025 | Null | 9 |

![Measured route diagram drawn from the slide's own shapes, measures 1 to 10.](../media/doc1010_slide18.svg)

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

Black: Pre-existing CPs
Green: New CP
There is a pre-existing CP at measure 3, so source CP at measure 3 is skipped

## Slide 19

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 07/01/2025 | Null | 3 |

Output Routes: no new CPs

![Measured route diagram drawn from the slide's own shapes, measures 1 to 10.](../media/doc1010_slide19.svg)

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

Result: user receives message that the tool ran with partial success

- Any valid Calibration Points are appended successfully
- Calibration Points with duplicate measure skipped and all other calibration points on same route skipped
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created with failure reason in status field + text file with error messages
- Message: Calibration points would introduce non-monotonic measures on route

## Slide 20

Result: user receives message that the tool ran with partial success

- Any valid Calibration Points are appended successfully
- Overlapping Calibration Points are skipped
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created with failure reason in status field + text file with error messages
- Message: There is already a calibration point for this route at this location.  Either add the calibration point at a different location or edit the existing calibration point using the Edit Calibration Point tool.

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

![Measured route diagram drawn from the slide's own shapes, measures 1 to 10.](../media/doc1010_slide20.svg)

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 3.01 |
| R1 | 01/01/2025 | Null | 9 |

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

Black: Pre-existing CPs
Green: New CP
There is a pre-existing CP that the source CP with measure 3 overlaps, so the source CP is skipped

### Notes

If the dates are different it will create a time slice

## Slide 21

Result: user receives message that the tool ran with partial success

- Any valid Calibration Points are appended successfully
- Route with duplicate Calibration Points is skipped
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created with failure reason in status field + text file with error messages
- Message: Calibration points would create non-monotonic measures on route

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

![Measured route diagram drawn from the slide's own shapes, measures 1 to 10.](../media/doc1010_slide21.svg)

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 3 |
| R1 | 01/01/2025 | Null | 3 |
| R1 | 01/01/2025 | Null | 9 |

Output Route: No new CPs

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

## Slide 22

Result: user receives message that the tool ran with partial success

- Any valid Calibration Points are appended successfully
- Route with overlapping Calibration Points is skipped
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created with failure reason in status field + text file with error messages
- Message: Calibration points would create non-monotonic measures on route

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

![Measured route diagram drawn from the slide's own shapes, measures 1 to 10.](../media/doc1010_slide22.svg)

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 3 |
| R1 | 01/01/2025 | Null | 3.01 |
| R1 | 01/01/2025 | Null | 9 |

Output Route: No new CPs

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

### Notes

Test overlapping cps when the existing cp is retired/not in same time range as source cp – should append successfully

## Slide 23

Result: user receives message that the tool ran successfully

- Calibration Point is appended successfully to time-slice with matching dates
- Routes with newly appended calibration points are recalibrated
- Success message is given with no error counts

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

![Measured route diagram drawn from the slide's own shapes, measures 1 to 10.](../media/doc1010_slide23.svg)

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2020 | 01/01/2025 | 3 |

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2020 | 01/01/2025 |
| R1 | 01/01/2025 | Null |

Black: Pre-existing CPs
Green: New CP

### Notes

Test overlapping cps when the existing cp is retired/not in same time range as source cp – should append successfully

## Slide 24

Result: user receives message that the tool ran with partial success

- Any valid Calibration Points are appended successfully
- Invalid Calibration Points are skipped
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created with failure reason in status field + text file with error messages
- Message: Route Id or measure fields are missing or empty

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

![Measured route diagram drawn from the slide's own shapes, measures 1 to 10.](../media/doc1010_slide24.svg)

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | Null |
| R1 | 01/01/2025 | Null | H |
| R1 | 01/01/2025 | Null | 2* |

Output Route: No new CPs

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

## Slide 25

Result: user receives message that the tool ran with partial success

- Any valid Calibration Points are appended successfully
- Calibration Points with null Route ID or measure are skipped
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created with failure reason in status field + text file with error messages
- Message: Route Id or measure fields are missing or empty.

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

![Measured route diagram drawn from the slide's own shapes, measures 1 to 10.](../media/doc1010_slide25.svg)

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| Null | 01/01/2025 | Null | 3 |
| R1 | 01/01/2025 | Null | Null |

Output Route: No new CPs

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

## Slide 26

Result: user receives message that the tool ran with partial success

- Any valid Calibration Points are appended successfully
- Calibration Points with Route ID not in Network are skipped
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created with failure reason in status field + text file with error messages
- Message: Point geometry does not fall on route

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R99 | 01/01/2025 | Null | 3 |
| R1 | 01/01/2025 | Null | 9 |

![Measured route diagram drawn from the slide's own shapes, measures 1 to 10.](../media/doc1010_slide26.svg)

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |
| R99 – does not exist |  |  |

Black: Pre-existing CPs
Green: New CP

## Slide 27

Result: user receives message that the tool ran with partial success

- Any valid Calibration Points are appended successfully
- All Calibration Points on route will be skipped for non-monotonic scenario
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created with failure reason in status field + text file with error messages
- Message: Calibration points would introduce non-monotonic measures on route '%s'.

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

![Measured route diagram drawn from the slide's own shapes, measures 1 to 10.](../media/doc1010_slide27.svg)

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 4 |
| R1 | 01/01/2025 | Null | 8 |

Output Route: No new CPs

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

## Slide 28

Result: user receives message that the tool ran with partial success

- Calibration Points on lollipop route fail to append because the minimum requirement of four calibration points was not met (missing another CP in loop)
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created with failure reason in status field + text file with error messages
- Message: Calibration points would introduce non-monotonic measures on route

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

![Measured route diagram drawn from the slide's own shapes, measures 1 to 17.](../media/doc1010_slide28.svg)

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 1 |
| R1 | 01/01/2025 | Null | 9 |
| R1 | 01/01/2025 | Null | 17 |

Output Route: No new CPs

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

## Slide 29

Result: user receives message that the tool ran with partial success

- Calibration Points on alpha route fail to append because the minimum requirement of four calibration points was not met (missing another CP in loop)
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created with failure reason in status field + text file with error messages
- Message: Calibration points would introduce non-monotonic measures on route

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

![Measured route diagram drawn from the slide's own shapes, measures 0 to 17.](../media/doc1010_slide29.svg)

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 0 |
| R1 | 01/01/2025 | Null | 6.33 |
| R1 | 01/01/2025 | Null | 15 |

Output Route: No new CPs

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

## Slide 30

Result: user receives message that the tool ran with partial success

- Calibration Points on loop route fail to append because the minimum requirement of four calibration points was not met (missing CP at start of route)
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created with failure reason in status field + text file with error messages
- Message: Calibration points would introduce non-monotonic measures on route

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

![Diagram drawn from the slide's own shapes: 4 nodes, 10 connectors.](../media/doc1010_slide30.svg)

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 4 |
| R1 | 01/01/2025 | Null | 7 |
| R1 | 01/01/2025 | Null | 10 |

Output Route: No new CPs

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

## Slide 31

Result: user receives message that the tool ran with partial success

- Any valid Calibration Points are appended successfully
- Calibration Points on infinity route are skipped
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created with failure reason in status field + text file with error messages
- Message: Calibration points would introduce non-monotonic measures on route '%s'.

Run with a Line & Non-line Network in GP Tool when:
Input Calibration Points:

![Diagram drawn from the slide's own shapes: 5 nodes, 9 connectors.](../media/doc1010_slide31.svg)

| RouteID | From Date | To Date | Measure |
| --- | --- | --- | --- |
| R1 | 01/01/2025 | Null | 0 |
| R1 | 01/01/2025 | Null | 3.33 |
| R1 | 01/01/2025 | Null | 19 |
| R1 | 01/01/2025 | Null | 13.33 |
| R1 | 01/01/2025 | Null | 16.67 |
| R1 | 01/01/2025 | Null | 20 |

Output Route: No new CPs

| RouteID | From Date | To Date |
| --- | --- | --- |
| R1 | 01/01/2025 | Null |

## Slide 32

Apply Event Behavior Tests:
Run Apply Event Behaviors on routes with Move events when:

![Diagram drawn from the slide's own shapes: 18 nodes, 20 connectors.](../media/doc1010_slide32.svg)

| Event | RouteID | From Measure | To Measure |
| --- | --- | --- | --- |
| EventA | R1 | 0 | 3 |
| EventB | R1 | 3 | 7 |
| EventC | R1 | 7 | 10 |

New CP from Append Calibration Points

Result: measures are not changed, but events are moved

| Event | RouteID | From Measure | To Measure |
| --- | --- | --- | --- |
| EventA | R1 | 0 | 3 |
| EventB | R1 | 3 | 7 |
| EventC | R1 | 7 | 10 |

## Slide 33

Apply Event Behavior Tests:
Run Apply Event Behaviors on routes with Stay Put events when:

![Diagram drawn from the slide's own shapes: 17 nodes, 20 connectors.](../media/doc1010_slide33.svg)

| Event | RouteID | From Measure | To Measure |
| --- | --- | --- | --- |
| EventA | R1 | 0 | 2.75 |
| EventB | R1 | 2.75 | 7 |
| EventC | R1 | 7 | 10 |

New CP from Append Calibration Points

Result: measures are changed, but events do not move

| Event | RouteID | From Measure | To Measure |
| --- | --- | --- | --- |
| EventA | R1 | 0 | 3 |
| EventB | R1 | 3 | 7 |
| EventC | R1 | 7 | 10 |

Events moved, measures did not (scenic byway)

## Slide 34

Apply Event Behavior Tests:
Run Apply Event Behaviors on routes with Retire events when:

![Diagram drawn from the slide's own shapes: 19 nodes, 20 connectors.](../media/doc1010_slide34.svg)

| Event | RouteID | From Measure | To Measure |
| --- | --- | --- | --- |
| EventA | R1 | 0 | 3 |
| EventB | R1 | 3 | 7 |
| EventC | R1 | 7 | 10 |

New CP from Append Calibration Points

Result: measures and events are not changed, but events within the recalibrated section are retired

| Event | RouteID | From Measure | To Measure |
| --- | --- | --- | --- |
| EventA | R1 | 0 | 3 |
| EventB | R1 | 3 | 7 |
| EventC | R1 | 7 | 10 |

## Slide 35

Result: user receives message that the tool ran with partial success

- Valid Calibration Points are appended successfully
- Invalid Calibration Points are skipped
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created + text file with error messages
- No timeout or failure occurs on large dataset
Performance Tests:
Run with full Transmountain & CDOT or ODOT datasets – benchmark w/ append routes
-Test appending thousands of calibration points onto one route

## Slide 36

Result: user receives message that the tool ran successfully

- Calibration Points are appended successfully
- Routes with newly appended calibration points are recalibrated
- Success message is given with success and error counts
Run with a Line & Non-line Network in Model Builder when:
GP tools to chain: append routes + append CPs + generate routes

## Slide 37

Run with a Line & Non-line Network in Python when:

- Source or Target Calibration Point layers are missing required fields
- LRS Network field does not contain a Network layer
- Source Calibration Point is empty
- Source & Target Calibration Point layers are the same
- Source & Target layers have different coordinate methods
- Source & Target fields do not have matching data types/lengths
Result: Fails in python with error message

## Slide 38

Result: user receives message that the tool ran successfully

- Calibration Points are appended successfully
- Routes with newly appended calibration points are recalibrated
- Success message is given
Run with a Line & Non-line Network in Python when:

## Slide 39

Result: user receives message that the tool ran with partial success

- Valid Calibration Points are appended successfully
- Invalid Calibration Points are skipped
- Routes with newly appended calibration points are recalibrated
- Partial Success message is given with success and error counts
- Feature layer of failed Calibration Points is created + text file with error messages

Run with a Line & Non-line Network in Python when:
