# Support Parallel Processing in Overlay Events GP Tool Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 54 · Test Plan · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [SupportParallelProcessingOverlayEvents_TestPlan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/SupportParallelProcessingOverlayEvents_TestPlan.pptx>) |
| **People** | author Karlie Murray · PE — · dev — |
| **Edited** | 2026-02-02 19:29 by Karlie Murray |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | overlay events · parallel processing · performance testing · geoprocessing tool · feature service · in-memory table · direct connection · model builder · python · rest endpoint |
| **Tools** | Overlay Events |

## Summary

Test plan for validating parallel processing enhancements in the Overlay Events geoprocessing tool. Includes benchmark performance tests before and after enhancements, functional tests across different environments (Model Builder, Python, REST), and negative tests for invalid parameters. Tests cover various data sources and output types to verify performance improvements and correct functionality.

## Related documents

<!-- related:begin -->
- [Support Parallel Processing in Overlay Events GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-parallel-processing-in-overlay-events-gp-2026-02.md>) — similar text 1.00 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:53 s=15.099 -->
- [Overlay Event Performance Improvements using Async tool and parallel processing – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6379-overlay-event-performance-improvements-using-async-tool.md>) — similar text 0.19 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:160 s=6.666 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/7061-overlay-events-lr.md>) — similar text 0.19 · 2 title words · 4 filename words · same surface <!-- rel:66 s=5.342 -->
- [Use Async GP tool in Overlay Events for Feature Services](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/use-async-gp-in-overlay-events-for-feature-services.md>) — similar text 0.34 · 3 title words · 2 filename words · same surface <!-- rel:179 s=4.861 -->
- [Support performance improvements in Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/6954-support-performance-improvements-in-overlay-events.md>) — similar text 0.19 · 3 title words · 2 filename words · same surface <!-- rel:99 s=4.062 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/edit-feature-services.html)

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Support parallel processing in Overlay Events GP tool <!-- slide 1 -->

Test Plan

### Slide 2 — Notes <!-- slide 2 -->

- Benchmark performance before enhancements
- Test with fgdb, direct connection, feature service, and in-memory table before and after enhancements
- Test with and without parallel processing after changes are implemented
- Test parallel processing in Model Builder, python (expose env parameter), REST, and output table vs. feature class
- Test with different parallel processing factors
- Test with line and non-line data
- Test with events from same/different networks
- Verify parallel processing icon is displayed
- Watch CPU usage in Task Manager

![Figure 1 — Notes](../media/support-parallel-processing-in-overlay-events-gp-2026-02-2/fig-01-slide-02-notes.svg)

### Slide 3 — Benchmark Performance Tests <!-- slide 3 -->

Before dlls are implemented, run Overlay Events with lrauto.lr.Indianafull (40 counties selected) dataset. Record time for each type.

- FGBD
- Direct Connection
- Feature Service
- In-Memory Table Output
- Events in same/different LRS network

![Figure 2 — Benchmark Performance Tests](../media/support-parallel-processing-in-overlay-events-gp-2026-02-2/fig-02-slide-03-benchmark-performance-tests.svg)

### Slide 4 — Parallel Processing Performance Tests <!-- slide 4 -->

With dlls implemented, run Overlay Events with 40 counties from Indianafull dataset in GP Tool with Feature Service. Compare output with Feature Compare.

- Feature Service
- Parallel Processing Factor – 100
- Output - feature class

Expected Result: Processing time is less than benchmark

![Figure 3 — Parallel Processing Performance Tests](../media/support-parallel-processing-in-overlay-events-gp-2026-02-2/fig-03-slide-04-parallel-processing-performance-tests.svg)

### Slide 5 — Parallel Processing Performance Tests <!-- slide 5 -->

With dlls implemented, run Overlay Events with same counties from Indianafull dataset in GP Tool with Feature Service.

- Feature Service
- Parallel Processing Factor – 100
- Output - table

Expected Result: Processing time is less than feature class output

![Figure 4 — Parallel Processing Performance Tests](../media/support-parallel-processing-in-overlay-events-gp-2026-02-2/fig-04-slide-05-parallel-processing-performance-tests.svg)

### Slide 6 — Parallel Processing Performance Tests <!-- slide 6 -->

With dlls implemented, run Overlay Events with same counties from Indianafull dataset in GP Tool with Feature Service. Output is in-memory table. Compare with feature compare.

- Feature Service
- Parallel Processing Factor – 100
- Output – in-memory table

Expected Result: Processing time is less than benchmark

![Figure 5 — Parallel Processing Performance Tests](../media/support-parallel-processing-in-overlay-events-gp-2026-02-2/fig-05-slide-06-parallel-processing-performance-tests.svg)

### Slide 7 — Parallel Processing Performance Tests <!-- slide 7 -->

With dlls implemented, run Overlay Events with same counties from Indianafull dataset in Python with FGDB. Compare output with Feature Compare.

- FGDB
- Parallel Processing Factor – 100
- Output – feature class

Expected Result: Processing time is less than benchmark

![Figure 6 — Parallel Processing Performance Tests](../media/support-parallel-processing-in-overlay-events-gp-2026-02-2/fig-06-slide-07-parallel-processing-performance-tests.svg)

### Slide 8 — Parallel Processing Performance Tests <!-- slide 8 -->

With dlls implemented, run Overlay Events with same counties from Indianafull dataset in GP tool with direct connection. Compare output with Feature Compare.

- Direct Connect
- Parallel Processing Factor – 100
- Output – feature class

Expected Result: Processing time is less than benchmark

![Figure 7 — Parallel Processing Performance Tests](../media/support-parallel-processing-in-overlay-events-gp-2026-02-2/fig-07-slide-08-parallel-processing-performance-tests.svg)

### Slide 9 — Parallel Processing Performance Tests <!-- slide 9 -->

With dlls implemented, run Overlay Events with same counties from Indianafull dataset in GP tool with direct connection. Use parallel processing factor of 50%.

- Direct Connect
- Parallel Processing Factor – 50
- Output – feature class

Expected Result: Processing time is greater than previous test with parallel processing factor of 100, but less than benchmark

![Figure 8 — Parallel Processing Performance Tests](../media/support-parallel-processing-in-overlay-events-gp-2026-02-2/fig-08-slide-09-parallel-processing-performance-tests.svg)

### Slide 10 — Parallel Processing Performance Tests <!-- slide 10 -->

With dlls implemented, run Overlay Events with state log network and county log events in GP tool with direct connection. Compare output with Feature Compare.

- Direct Connect
- Parallel Processing Factor – 100
- Output – feature class

Expected Result: Processing time is less than benchmark

![Figure 9 — Parallel Processing Performance Tests](../media/support-parallel-processing-in-overlay-events-gp-2026-02-2/fig-09-slide-10-parallel-processing-performance-tests.svg)

### Slide 11 — Parallel Processing - Functional Tests <!-- slide 11 -->

With dlls implemented, run Overlay Events with a few route Ids from same non-line dataset in REST with feature service.

- Feature Service
- Parallel Processing Factor – 100
- Output – feature class

Expected Result: REST endpoint returns output feature class successfully.

![Figure 10 — Parallel Processing - Functional Tests](../media/support-parallel-processing-in-overlay-events-gp-2026-02-2/fig-10-slide-11-parallel-processing-functional-tests.svg)

### Slide 12 — Parallel Processing - Functional Tests <!-- slide 12 -->

With dlls implemented, run Overlay Events with Indianafull dataset in Model Builder with feature service. Test chaining Overlay Events with another GP tool (create feature).

- Feature Service
- Parallel Processing Factor – 100
- Output – feature class

Expected Result: Model Builder returns output feature class successfully.

![Figure 11 — Parallel Processing - Functional Tests](../media/support-parallel-processing-in-overlay-events-gp-2026-02-2/fig-11-slide-12-parallel-processing-functional-tests.svg)

## Test Cases

### TC-N01 — Test with <!-- src: S5 · slide 13 · label Test with -->

**Steps:**
1. GP Tool
2. Python
3. REST
4. Model Builder

## Other content

### Slide 13 — Negative Tests <!-- slide 13 -->

With dlls implemented, run Overlay Events with an invalid parallel processing factor. Example – negative numbers, value greater than 1? Compare with what is accepted for other GP Tools with parallel processing.

Expected Result: Error occurs and error message is shown

![Figure 12 — Negative Tests](../media/support-parallel-processing-in-overlay-events-gp-2026-02-2/fig-12-slide-13-negative-tests.svg)

### Slide 14 — Without Parallel Processing Performance Tests <!-- slide 14 -->

With dlls implemented, run Overlay Events without parallel processing on same counties from Indianafull dataset in GP Tool with Feature Service. Compare output with Feature Compare.

- Feature Service
- Parallel Processing Factor – 0
- Output - feature class

Expected Result: Processing time is greater than run with parallel processing

![Figure 13 — Without Parallel Processing Performance Tests](../media/support-parallel-processing-in-overlay-events-gp-2026-02-2/fig-13-slide-14-without-parallel-processing-performance.svg)

### Slide 15 — Without Parallel Processing Performance Tests <!-- slide 15 -->

With dlls implemented, run Overlay Events without parallel processing on same counties from Indianafull dataset in Python with FGDB. Compare output with Feature Compare.

- FGDB
- Parallel Processing Factor – 0
- Output - feature class

Expected Result: Processing time is greater than run with parallel processing

![Figure 14 — Without Parallel Processing Performance Tests](../media/support-parallel-processing-in-overlay-events-gp-2026-02-2/fig-14-slide-15-without-parallel-processing-performance.svg)

### Slide 16 — Without Parallel Processing Performance Tests <!-- slide 16 -->

With dlls implemented, run Overlay Events without parallel processing on same counties from Indianafull dataset in GP tool with direct connection. Compare output with Feature Compare.

- Direct Connect
- Parallel Processing Factor – 0
- Output - feature class

Expected Result: Processing time is greater than run with parallel processing

![Figure 15 — Without Parallel Processing Performance Tests](../media/support-parallel-processing-in-overlay-events-gp-2026-02-2/fig-15-slide-16-without-parallel-processing-performance.svg)

### Slide 17 — Line Network Performance Tests <!-- slide 17 -->

With dlls implemented, run Overlay Events without parallel processing on a large line network dataset in GP tool with feature service.

- Feature Service
- Parallel Processing Factor – 0
- Output - feature class

Expected Result: GP Tool finishes successfully. Record time it takes to run

![Figure 16 — Line Network Performance Tests](../media/support-parallel-processing-in-overlay-events-gp-2026-02-2/fig-16-slide-17-line-network-performance-tests.svg)

### Slide 18 — Line Network Performance Tests <!-- slide 18 -->

With dlls implemented, run Overlay Events with parallel processing on same line network dataset in GP tool with feature service. Compare output with Feature Compare.

- Feature Service
- Parallel Processing Factor – 100
- Output - feature class

Expected Result: Processing time is less than benchmark

![Figure 17 — Line Network Performance Tests](../media/support-parallel-processing-in-overlay-events-gp-2026-02-2/fig-17-slide-18-line-network-performance-tests.svg)
