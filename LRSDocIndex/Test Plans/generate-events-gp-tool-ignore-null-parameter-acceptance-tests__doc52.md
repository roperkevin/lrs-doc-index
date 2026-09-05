# Generate Events GP Tool Ignore Null Parameter Acceptance Tests

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Utility Network |
| **Source** | [GenerateEvents_IngnoreNull.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/GenerateEvents_IngnoreNull.pptx>) |
| **Edited** | 2026-02-09 22:01 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Generate Events GP Tool Ignore Null Parameter Acceptance Tests"
source_file: "GenerateEvents_IngnoreNull.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/GenerateEvents_IngnoreNull.pptx"
doc_id: 52
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Rahul Rakshit"
last_edited_by: "Rahul Rakshit"
last_edited: "2026-02-09T22:01:46Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["generate events", "event", "null fields", "routeid", "measure", "geoprocessing", "acceptance tests"]
tools: ["Generate Events"]
products: ["Utility Network"]
issues: []
related: [{"doc":104,"file":"generate-events-skip-records-with-null-lrs-fields__doc104.md","s":5.298},{"doc":229,"file":"support-search-tolerance-parameter-in-update-measures-from-lrs-tool-test-plan__doc229.md","s":3.598},{"doc":638,"file":"add-point-event-tool-add-multipoint-events-tool-coordinate-offset-method-test__doc638.md","s":3.563},{"doc":126,"file":"append-events-date-optional-test-plan__doc126.md","s":3.325},{"doc":277,"file":"update-measures-from-lrs-support-events-and-intersections__doc277.md","s":3.312}]
```
-->

## Summary

This document defines acceptance criteria and test cases for the Generate Events geoprocessing tool's new optional parameter to ignore events with null LRS fields. It covers behavior verification for line and point events with null RouteID and measure fields, including REST endpoint, Model Builder, Python, and batch modes. The tests ensure ignored events are listed in output and no shape or attribute changes occur.

## Related documents

<!-- related:begin -->
- [Generate Events Skip Records with Null LRS Fields](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-events-skip-records-with-null-lrs-fields__doc104.md>) — similar text 0.30 · 3 title words · 3 filename words · same surface <!-- rel:104 -->
- [Support Search Tolerance Parameter in Update Measures from LRS Tool – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-search-tolerance-parameter-in-update-measures-from-lrs-tool-test-plan__doc229.md>) — similar text 0.13 · 2 title words · same kind/surface/folder <!-- rel:229 -->
- [Add Point Event tool/ Add Multipoint Events tool Coordinate offset method – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-point-event-tool-add-multipoint-events-tool-coordinate-offset-method-test__doc638.md>) — similar text 0.16 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:638 -->
- [Append Events Date Optional Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-events-date-optional-test-plan__doc126.md>) — similar text 0.17 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:126 -->
- [Update Measures From LRS: Support Events and Intersections](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/update-measures-from-lrs-support-events-and-intersections__doc277.md>) — similar text 0.06 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:277 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)

_No page matched:_ [Generate Events](https://www.google.com/search?q=%22Generate%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

## Slide 2

## Slide 3

Acceptance Criteria Tests: Verify that
Event Types
GP Specific tests

- An optional parameter called “Ignore events with null LRS fields” is added to the Generate Events GP Tool. Make sure that the parameter is ‘Optional’.
- Default is unchecked.
- This options shows up only when UN dataset is present.
- When this parameter is unchecked, the tool should work as it does today i.e., the tool should work on the geometry of if any event records that have null RouteID and Measure(s) fields are present.
- When this parameter is checked, any event records that have null RouteID and Measure(s) fields should be ignored and the tool should run. Also confirm that no changes are made in terms of shapes or attributes of the event. Both the RID and measure fields should be Null. Ignore Loc Error too.
- The OIDs of event records that were skipped are listed in the text output file for the tool.
- Test REST endpoint.

| Data Type | Event |
| --- | --- |
| FS | Line, Point |
| DC EGDB | Line, Point |
| FGDB | Line, Point |

- Model Builder: Single and chained
- PY: Standalone and in-line
- Batch mode

## Slide 4

![Schematic redrawn from the slide's data: straight route Null after the split at measure 30: event E2 as 20–30 and 30–40.](../media/doc956_slide4_fig2.svg)

Verify that these records are listed in white are ignored for a line event

| Event ID | From Route ID | From Measure | To Route ID | To Measure | From Date | To Date | Event Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E2 | Null | 20 | R2 | 40 | 1/1/2000 | Null | X2 |
| E3 | R1 | Null | R2 | 40 | 1/1/2000 | Null | X3 |
| E4 | R1 | 20 | Null | 40 | 1/1/2000 | Null | X4 |
| E5 | R1 | 20 | R2 | Null | 1/1/2000 | Null | X1 |
| E6 | Null | Null | R2 | 40 | 1/1/2000 | Null | X2 |
| E7 | Null | 20 | Null | 40 | 1/1/2000 | Null | X3 |
| E8 | Null | 20 | R2 | Null | 1/1/2000 | Null | X4 |
| E9 | R1 | Null | Null | 40 | 1/1/2000 | Null | X1 |
| E10 | R1 | Null | R2 | Null | 1/1/2000 | Null | X2 |
| E11 | R1 | 20 | Null | Null | 1/1/2000 | Null | X3 |
| E12 | Null | Null | Null | 40 | 1/1/2000 | Null | X4 |
| E13 | Null | Null | R2 | Null | 1/1/2000 | Null | X1 |
| E14 | Null | 20 | Null | Null | 1/1/2000 | Null | X2 |
| E15 | R1 | Null | Null | Null | 1/1/2000 | Null | X3 |
| E16 | Null | Null | Null | Null | 1/1/2000 | Null | X4 |

![Schematic redrawn from the slide's data: straight route Null, event E2 from measure 20 to 40, before the split at measure 30.](../media/doc956_slide4_fig1.svg)

| Event ID | Route ID | Measure | From Date | To Date | Event Attribute |
| --- | --- | --- | --- | --- | --- |
| E2 | Null | 20 | 1/1/2000 | Null | X2 |
| E3 | R1 | Null | 1/1/2000 | Null | X3 |
| E4 | Null | Null | 1/1/2000 | Null | X4 |

Verify that these records are listed in white are ignored for a point event

## Slide 5

| Route ID | From Date | To Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |
| R2 | 1/1/2000 | Null |

| Event ID | From Route ID | From Measure | To Route ID | To Measure | From Date | To Date |
| --- | --- | --- | --- | --- | --- | --- |
| E1 | R1 | 25 | R2 | 25 | 1/1/2000 | Null |

| Event ID | From Route ID | From Measure | To Route ID | To Measure | From Date | To Date |
| --- | --- | --- | --- | --- | --- | --- |
| E1 | Null | 25 | R2 | 25 | 1/1/2000 | Null |

| Event ID | From Route ID | From Measure | To Route ID | To Measure | From Date | To Date |
| --- | --- | --- | --- | --- | --- | --- |
| E1 | Null | Null | R2 | 25 | 1/1/2000 | Null |

[figure: R1 · R2 · 0 · 50 · 20 · 30]
