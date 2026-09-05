# Use Async GP tool in Overlay Events for Feature Services

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Use AsyncGP tool in Overlay Events.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Use%20AsyncGP%20tool%20in%20Overlay%20Events.pptx>) |
| **Edited** | 2025-04-29 12:02 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Use Async GP tool in Overlay Events for Feature Services"
source_file: "Use AsyncGP tool in Overlay Events.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Use%20AsyncGP%20tool%20in%20Overlay%20Events.pptx"
doc_id: 179
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2025-04-29T12:02:00Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["dynamic segmentation", "overlay events", "async tool", "feature service", "parallel processing", "event editor"]
tools: ["Overlay Events"]
products: []
issues: []
related: [{"doc":160,"file":"overlay-event-performance-improvements-using-async-tool-and-parallel-processing__doc160.md","s":6.179},{"doc":99,"file":"support-performance-improvements-in-overlay-events__doc99.md","s":5.512},{"doc":54,"file":"support-parallel-processing-in-overlay-events-gp-tool-test-plan__doc54.md","s":4.468},{"doc":53,"file":"support-parallel-processing-in-overlay-events-gp-tool__doc53.md","s":4.468},{"doc":227,"file":"spike-performance-improvement-to-overlay-events-query-attribute-set__doc227.md","s":4.203}]
```
-->

## Summary

This user story describes the need for an Event Editor to run dynamic segmentation operations on feature services without timeouts, improving performance by using an asynchronous tool and parallel processing. It includes testing plans to benchmark performance improvements and documentation updates to reflect these changes.

## Related documents

<!-- related:begin -->
- [Overlay Event Performance Improvements using Async tool and parallel processing – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/overlay-event-performance-improvements-using-async-tool-and-parallel-processing__doc160.md>) — similar text 0.33 · 3 title words · 3 filename words · same surface <!-- rel:160 -->
- [Support performance improvements in Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-performance-improvements-in-overlay-events__doc99.md>) — similar text 0.49 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:99 -->
- [Support Parallel Processing in Overlay Events GP Tool Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/support-parallel-processing-in-overlay-events-gp-tool-test-plan__doc54.md>) — similar text 0.35 · 3 title words · 2 filename words · same surface <!-- rel:54 -->
- [Support Parallel Processing in Overlay Events GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-parallel-processing-in-overlay-events-gp-tool__doc53.md>) — similar text 0.35 · 3 title words · 2 filename words · same surface <!-- rel:53 -->
- [Spike: Performance improvement to Overlay Events/Query Attribute Set](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-performance-improvement-to-overlay-events-query-attribute-set__doc227.md>) — similar text 0.17 · 2 title words · 2 filename words · same surface/folder <!-- rel:227 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/edit-feature-services.html)

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Use Async GP tool in Overlay Events for Feature Services

User Story

## Slide 2 — User Story

As an Event Editor, I want to be to run dynamic segmentation operations that don’t time out on feature services, so I can run the operations often without delay or the need to restart services.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.).  These users will often run dynamic segmentation operations on the data and need to have the operations perform as quickly as possible, no matter whether in fgdb, direct connect, or feature services.

## Slide 3 — Overlay Events async tool

To improve performance, use the async tool when executing Overlay Events via a feature service instead of the Query Attribute Set operation we use today
Also add support for parallel processing in the tool when run fgdb, direct connect, and via feature services to improve performance
Also, as part of this story, utilize the new tool attributes for all the GP tools within the Location Referencing toolbox

## Slide 4 — Testing

Test the tool with fgdb, direct connect, and fs to benchmark performance before and after the enhancements (use the INDOT dataset with 10+ event layers and all the routes in the state)
Test with and without parallel processing (we should see enhanced performance without parallel processing compared to before the changes and even faster performance with it enabled)
Compare the benchmarks with the results from the spike completed by Sharon
No need to test the actual results of the dynseg as the tool is automated

## Slide 5 — Automation

No automation updates

## Slide 6 — Documentation

Update the tool documentation to mention utilization of parallel processing to improve performance

## Slide 7 — Assignment

Story Points:
Dev:
PE:
