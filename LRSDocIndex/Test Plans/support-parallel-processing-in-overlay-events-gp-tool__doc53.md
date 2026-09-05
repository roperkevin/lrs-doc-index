# Support Parallel Processing in Overlay Events GP Tool

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Source** | [SupportParallelProcessingOverlayEvents_TestPlan (1).pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/SupportParallelProcessingOverlayEvents_TestPlan%20(1).pptx>) |
| **Edited** | 2026-02-02 19:29 by Karlie Murray |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Parallel Processing in Overlay Events GP Tool"
source_file: "SupportParallelProcessingOverlayEvents_TestPlan (1).pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/SupportParallelProcessingOverlayEvents_TestPlan%20(1).pptx"
doc_id: 53
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Karlie Murray"
last_edited_by: "Karlie Murray"
last_edited: "2026-02-02T19:29:52Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["overlay events", "parallel processing", "performance tests", "geoprocessing tool", "feature service", "model builder", "python", "rest endpoint"]
tools: ["Overlay Events"]
products: []
issues: []
related: [{"doc":54,"file":"support-parallel-processing-in-overlay-events-gp-tool-test-plan__doc54.md","s":13.343},{"doc":160,"file":"overlay-event-performance-improvements-using-async-tool-and-parallel-processing__doc160.md","s":5.972},{"doc":66,"file":"overlay-events-location-referencing__doc66.md","s":4.949},{"doc":179,"file":"use-async-gp-tool-in-overlay-events-for-feature-services__doc179.md","s":4.468},{"doc":99,"file":"support-performance-improvements-in-overlay-events__doc99.md","s":4.051}]
```
-->

## Summary

Test plan for validating parallel processing enhancements in the Overlay Events geoprocessing tool. Includes benchmark performance tests, functional tests, negative tests, and comparisons of processing times with different data sources and parallel processing factors. Tests cover various environments such as Model Builder, Python, REST, and different output types.

## Related documents

<!-- related:begin -->
- [Support Parallel Processing in Overlay Events GP Tool Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/support-parallel-processing-in-overlay-events-gp-tool-test-plan__doc54.md>) — similar text 1.00 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:54 -->
- [Overlay Event Performance Improvements using Async tool and parallel processing – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/overlay-event-performance-improvements-using-async-tool-and-parallel-processing__doc160.md>) — similar text 0.20 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:160 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-location-referencing__doc66.md>) — similar text 0.20 · 2 title words · 4 filename words · same surface <!-- rel:66 -->
- [Use Async GP tool in Overlay Events for Feature Services](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/use-async-gp-tool-in-overlay-events-for-feature-services__doc179.md>) — similar text 0.35 · 3 title words · 2 filename words · same surface <!-- rel:179 -->
- [Support performance improvements in Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-performance-improvements-in-overlay-events__doc99.md>) — similar text 0.19 · 3 title words · 2 filename words · same surface <!-- rel:99 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/edit-feature-services.html)

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support parallel processing in Overlay Events GP tool

Test Plan

## Slide 2 — Notes

Benchmark performance before enhancements
Test with fgdb, direct connection, feature service, and in-memory table before and after enhancements
Test with and without parallel processing after changes are implemented
Test parallel processing in Model Builder, python (expose env parameter), REST, and output table vs. feature class
Test with different parallel processing factors
Test with line and non-line data
Test with events from same/different networks
Verify parallel processing icon is displayed
Watch CPU usage in Task Manager

## Slide 3 — Benchmark Performance Tests

Before dlls are implemented, run Overlay Events with lrauto.lr.Indianafull (40 counties selected) dataset. Record time for each type.

- FGBD
- Direct Connection
- Feature Service
- In-Memory Table Output
- Events in same/different LRS network

## Slide 4 — Parallel Processing Performance Tests

With dlls implemented, run Overlay Events with 40 counties from Indianafull dataset in GP Tool with Feature Service. Compare output with Feature Compare.

- Feature Service
- Parallel Processing Factor – 100
- Output - feature class

Expected Result: Processing time is less than benchmark

## Slide 5 — Parallel Processing Performance Tests

With dlls implemented, run Overlay Events with same counties from Indianafull dataset in GP Tool with Feature Service.

- Feature Service
- Parallel Processing Factor – 100
- Output - table

Expected Result: Processing time is less than feature class output

## Slide 6 — Parallel Processing Performance Tests

With dlls implemented, run Overlay Events with same counties from Indianafull dataset in GP Tool with Feature Service. Output is in-memory table. Compare with feature compare.

- Feature Service
- Parallel Processing Factor – 100
- Output – in-memory table

Expected Result: Processing time is less than benchmark

## Slide 7 — Parallel Processing Performance Tests

With dlls implemented, run Overlay Events with same counties from Indianafull dataset in Python with FGDB. Compare output with Feature Compare.

- FGDB
- Parallel Processing Factor – 100
- Output – feature class

Expected Result: Processing time is less than benchmark

## Slide 8 — Parallel Processing Performance Tests

With dlls implemented, run Overlay Events with same counties from Indianafull dataset in GP tool with direct connection. Compare output with Feature Compare.

- Direct Connect
- Parallel Processing Factor – 100
- Output – feature class

Expected Result: Processing time is less than benchmark

## Slide 9 — Parallel Processing Performance Tests

With dlls implemented, run Overlay Events with same counties from Indianafull dataset in GP tool with direct connection. Use parallel processing factor of 50%.

- Direct Connect
- Parallel Processing Factor – 50
- Output – feature class

Expected Result: Processing time is greater than previous test with parallel processing factor of 100, but less than benchmark

## Slide 10 — Parallel Processing Performance Tests

With dlls implemented, run Overlay Events with state log network and county log events in GP tool with direct connection. Compare output with Feature Compare.

- Direct Connect
- Parallel Processing Factor – 100
- Output – feature class

Expected Result: Processing time is less than benchmark

## Slide 11 — Parallel Processing - Functional Tests

With dlls implemented, run Overlay Events with a few route Ids from same non-line dataset in REST with feature service.

- Feature Service
- Parallel Processing Factor – 100
- Output – feature class

Expected Result: REST endpoint returns output feature class successfully.

## Slide 12 — Parallel Processing - Functional Tests

With dlls implemented, run Overlay Events with Indianafull dataset in Model Builder with feature service. Test chaining Overlay Events with another GP tool (create feature).

- Feature Service
- Parallel Processing Factor – 100
- Output – feature class

Expected Result: Model Builder returns output feature class successfully.

## Slide 13 — Negative Tests

With dlls implemented, run Overlay Events with an invalid parallel processing factor. Example – negative numbers, value greater than 1? Compare with what is accepted for other GP Tools with parallel processing.

Test with:
GP Tool
Python
REST
Model Builder

Expected Result: Error occurs and error message is shown

## Slide 14 — Without Parallel Processing Performance Tests

With dlls implemented, run Overlay Events without parallel processing on same counties from Indianafull dataset in GP Tool with Feature Service. Compare output with Feature Compare.

- Feature Service
- Parallel Processing Factor – 0
- Output - feature class

Expected Result: Processing time is greater than run with parallel processing

## Slide 15 — Without Parallel Processing Performance Tests

With dlls implemented, run Overlay Events without parallel processing on same counties from Indianafull dataset in Python with FGDB. Compare output with Feature Compare.

- FGDB
- Parallel Processing Factor – 0
- Output - feature class

Expected Result: Processing time is greater than run with parallel processing

## Slide 16 — Without Parallel Processing Performance Tests

With dlls implemented, run Overlay Events without parallel processing on same counties from Indianafull dataset in GP tool with direct connection. Compare output with Feature Compare.

- Direct Connect
- Parallel Processing Factor – 0
- Output - feature class

Expected Result: Processing time is greater than run with parallel processing

## Slide 17 — Line Network Performance Tests

With dlls implemented, run Overlay Events without parallel processing on a large line network dataset in GP tool with feature service.

- Feature Service
- Parallel Processing Factor – 0
- Output - feature class

Expected Result: GP Tool finishes successfully. Record time it takes to run

## Slide 18 — Line Network Performance Tests

With dlls implemented, run Overlay Events with parallel processing on same line network dataset in GP tool with feature service. Compare output with Feature Compare.

- Feature Service
- Parallel Processing Factor – 100
- Output - feature class

Expected Result: Processing time is less than benchmark
