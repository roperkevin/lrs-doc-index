# Overlay Event Performance Improvements using Async tool and parallel processing – Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Issue** | [ArcGISPro/ps-location-referencing#6379](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6379) |
| **Source** | [AsyncGPinOverlayEventsQAS_PerformanceTesting_testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/AsyncGPinOverlayEventsQAS_PerformanceTesting_testplan.pptx>) |
| **Edited** | 2025-05-28 23:35 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Overlay Event Performance Improvements using Async tool and parallel processing – Test Plan"
source_file: "AsyncGPinOverlayEventsQAS_PerformanceTesting_testplan.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/AsyncGPinOverlayEventsQAS_PerformanceTesting_testplan.pptx"
doc_id: 160
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: "1"
author: "Lakshmi Ananthanarayanan"
last_edited_by: "Claire Wang"
last_edited: "2025-05-28T23:35:02Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["overlay events", "performance", "async tool", "parallel processing", "geoprocessing tool", "benchmarking"]
tools: ["Overlay Events"]
products: []
issues: ["ArcGISPro/ps-location-referencing#6379"]
related: [{"doc":131,"file":"overlay-events-location-referencing__doc131.md","s":1002.604},{"doc":179,"file":"use-async-gp-tool-in-overlay-events-for-feature-services__doc179.md","s":6.179},{"doc":54,"file":"support-parallel-processing-in-overlay-events-gp-tool-test-plan__doc54.md","s":5.972},{"doc":53,"file":"support-parallel-processing-in-overlay-events-gp-tool__doc53.md","s":5.972},{"doc":99,"file":"support-performance-improvements-in-overlay-events__doc99.md","s":4.487}]
```
-->

## Summary

Test plan for performance improvements of the Overlay Events geoprocessing tool using an asynchronous tool and parallel processing. Includes benchmarking with various data sources and configurations, verification of new parallel processing icon, and automation coverage for result validation. Documentation updates to reflect parallel processing usage recommendations are also included.

## Related documents

<!-- related:begin -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-location-referencing__doc131.md>) — shared issue ArcGISPro/ps-location-referencing#6379 · similar text 0.08 · 1 title word · 2 filename words · same surface <!-- rel:131 -->
- [Use Async GP tool in Overlay Events for Feature Services](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/use-async-gp-tool-in-overlay-events-for-feature-services__doc179.md>) — similar text 0.33 · 3 title words · 3 filename words · same surface <!-- rel:179 -->
- [Support Parallel Processing in Overlay Events GP Tool Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/support-parallel-processing-in-overlay-events-gp-tool-test-plan__doc54.md>) — similar text 0.20 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:54 -->
- [Support Parallel Processing in Overlay Events GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-parallel-processing-in-overlay-events-gp-tool__doc53.md>) — similar text 0.20 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:53 -->
- [Support performance improvements in Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-performance-improvements-in-overlay-events__doc99.md>) — similar text 0.14 · 3 title words · 3 filename words · same surface <!-- rel:99 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Overlay Event Performance Improvements using Async tool and parallel processing – Test Plan

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6379

PE:
Dev:

## Slide 2

Testing

- Test Overlay Events GP tool
- Test with fgdb, direct connect, and fs to benchmark performance before and after the enhancements (use the INDOT dataset with 10+ point and line events on all the routes (131041) in the state)
- Test with APRUN and ADM (one or two each) with all the routes, many events, and the centerline
- Test 1 or 2 cases with fewer routes (e.g. ½; ¼; 1/10 of all routes.)
- Test with, without, and with a fraction of parallel processing (we should see enhanced performance in fs without parallel processing compared to before the changes (due to async tool) and even faster performance with it enabled)
- Compare the benchmarks with the results from the spike completed by Sharon
  - Report if performance is noticeably worse than expected
- Verify the new icon/flag of Parallel Processing is visible in all LR GP tools now
- No need to check the actual results as it’s automated
Background

- When Overlay Events is run on a feature service, we should use the async tool instead of QAS. This improves performance of fs. Verify with fiddler there is no QAS call. Instead, there should be messages of packaging route and event information and sending to REST.
- In addition, add support for parallel processing (In GP tool Environments). This improves performance for fgdb, dc and fs.
  - So Overlay Events on fs should be faster combining both changes.
- Then, all LR GP tools can utilize the new tool attributes (no need to test them as they are covered in automation) – developer will check with Eric, it’s going to be an icon or similar for Parallel Processing

| f | json |
| --- | --- |
| locations | [{" routeId ":"{0d7f5fae-600d-4103-959a-9a5ce6be303d}"},{" routeId ":"{18728cad-44b1-40d9-ab90-2922122b545f}"},{" routeId ":"{2cf3ad2a-2602-4593-a8f8-13023505dcf5}"},{" routeId ":"{42DEF55F-F9B8-4253-9E1D-448908408FD6}"},{" routeId ":"{7A7A1DAA-9258-470D-8E43-47147C04C266}"},{" routeId ":"{90FA7840-F087-484B-82D4-446020BA9310}"},{" routeId ":"{C2A5E36B-55FD-4AA3-AA7A-84BC4183FEB0}"}] |
| attributeSet | [{"layerId":0,"fields":["DerivedM","DerivedRname","DerivedRID","PRIORITY","INSPECTIONDATE","ANOMALYTYPE","ANOMALYSTATUS","SEVERITY","RID","FromM","ToM"],"objectIds":[7633]},{"layerId":7,"fields":["DerivedFromM","DerivedRname","CLASSTYPE","DerivedToM","CLASSSOURCE","BigInteger","CLASSLENGTH","DerivedRID","DateOnly","TimeOnly","TimestampOffset","RID","FromM","ToM"],"objectIds":[10008,10408,10409,173619]},{"layerId":14,"fields":["STATUS","TrackingDistance","BigInteger","COMMENTS","CrewNum","TimestampOffset","DateOnly","TimeOnly"],"objectIds":[5601,5602,6001,6401,10005,10006]},{"layerId":10,"fields":["RouteId","FromDate","ToDate","RouteName","LineId","LineName","LineOrder"],"objectIds":[8,18,29,120,5763,5764,19767]}] |
| temporalViewDate | [,-] |
| gdbVersion | ROADS.AddLineGap |
| historicMoment |  |

## Slide 3

Automation
Create FSGP for overlay events. Consider utilizing cases from fgdb automation.

Documentation
Update the tool documentation to mention utilization of parallel processing to improve performance (mention recommending using pp when they’re running the tool against a larger number of routes).  Also link to the topic that discusses parallel processing and it’s use with GP.
