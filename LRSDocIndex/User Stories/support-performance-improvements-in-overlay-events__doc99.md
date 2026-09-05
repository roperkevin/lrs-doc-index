# Support performance improvements in Overlay Events

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Issue** | [ArcGISPro/ps-location-referencing#6954](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6954) |
| **Source** | [OverlayEventsPerformanceImprovements.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/OverlayEventsPerformanceImprovements.pptx>) |
| **Edited** | 2025-12-08 19:07 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support performance improvements in Overlay Events"
source_file: "OverlayEventsPerformanceImprovements.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/OverlayEventsPerformanceImprovements.pptx"
doc_id: 99
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2025-12-08T19:07:34Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["overlay events", "dynamic segmentation", "performance improvements", "event editor", "adm datasets"]
tools: ["Overlay Events"]
products: []
issues: ["ArcGISPro/ps-location-referencing#6954"]
related: [{"doc":59,"file":"iteration-planning-and-issue-tracking-for-esri-lrs-development__doc59.md","s":1002.079},{"doc":179,"file":"use-async-gp-tool-in-overlay-events-for-feature-services__doc179.md","s":5.512},{"doc":160,"file":"overlay-event-performance-improvements-using-async-tool-and-parallel-processing__doc160.md","s":4.487},{"doc":185,"file":"spike-benchmark-overlay-events-in-gp-vs-api__doc185.md","s":4.086},{"doc":110,"file":"spike-profile-overlay-events-gp-tool__doc110.md","s":4.076}]
```
-->

## Summary

This user story addresses performance improvements for the Overlay Events geoprocessing tool to enable dynamic segmentation operations on large datasets without timing out. It targets Event Editors who require efficient processing across file geodatabases, direct connect, and feature services. Testing focuses on ADM datasets to benchmark performance before and after enhancements, with automation added if missing.

## Related documents

<!-- related:begin -->
- [Iteration Planning and Issue Tracking for Esri LRS Development](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Schedules/iteration-planning-and-issue-tracking-for-esri-lrs-development__doc59.md>) — shared issue ArcGISPro/ps-location-referencing#6954 · similar text 0.12 · same surface/folder <!-- rel:59 -->
- [Use Async GP tool in Overlay Events for Feature Services](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/use-async-gp-tool-in-overlay-events-for-feature-services__doc179.md>) — similar text 0.49 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:179 -->
- [Overlay Event Performance Improvements using Async tool and parallel processing – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/overlay-event-performance-improvements-using-async-tool-and-parallel-processing__doc160.md>) — similar text 0.14 · 3 title words · 3 filename words · same surface <!-- rel:160 -->
- [Spike Benchmark Overlay Events in GP vs API](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-benchmark-overlay-events-in-gp-vs-api__doc185.md>) — similar text 0.21 · 2 title words · 2 filename words · same surface/folder <!-- rel:185 -->
- [Spike: Profile Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-profile-overlay-events-gp-tool__doc110.md>) — similar text 0.18 · 2 title words · 2 filename words · same surface/folder <!-- rel:110 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support performance improvements in Overlay Events

User Story

## Slide 2 — User Story

As an Event Editor, I want to be to run dynamic segmentation operations on large datasets that don’t time out, so I can run the operations often without delay or the need to move data to file geodatabase.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.).  These users will often run dynamic segmentation operations on the data and need to have the operations perform as quickly as possible, no matter whether in fgdb, direct connect, or feature services.

## Slide 3 — Overlay Events performance improvements

In the Overlay Events GP tool, implement the ADM configured recommendations from the spike around performance improvements
See https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6954#issuecomment-5922889 and https://devtopia.esri.com/ArcGISPro/PS-Products/pull/10950 for information about the improvements
Will we get these performance improvements in Query Attribute Set as well?

## Slide 4 — Testing

Test the tool with fgdb, direct connect, and fs to benchmark performance before and after the enhancements
Focus testing on the ADM datasets we have as that’s where the performance improvements should be seen
Run 1-2 tests on non-ADM datasets just to ensure no issues are introduced
Verify automation results once the changes are checked in to ensure no changes to results logic are implemented

## Slide 5 — Automation

If we don’t have automation for the tool with ADM, we should add it with this story

## Slide 6 — Documentation

No documentation updates for this story

## Slide 7 — Assignment

Story Points:
Dev:  days
PE:  days
