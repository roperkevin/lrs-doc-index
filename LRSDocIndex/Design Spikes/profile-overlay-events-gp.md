# Spike: Profile Overlay Events GP tool

| Field | Value |
| --- | --- |
| **Doc** | 110 · Design Spike · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike Profile Overlay Events GP tool.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Profile%20Overlay%20Events%20GP%20tool.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2025-11-06 15:57 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | overlay events · dynamic segmentation · geoprocessing · performance profiling · routes · events |
| **Tools** | Overlay Events |

## Summary

This document profiles the Overlay Events geoprocessing tool to analyze execution time distribution and identify performance bottlenecks using INDOT data. It aims to document findings and rank potential performance improvements for dynamic segmentation on linear referenced data.

## Related documents

<!-- related:begin -->
- [Spike: Profile Generate LRS Data Products GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/profile-generate-lrs-data-products-gp.md>) — similar text 0.92 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:108 s=7.346 -->
- [Spike: Performance improvement to Overlay Events/Query Attribute Set](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/performance-improvement-to-overlay-events-query-attribute.md>) — similar text 0.17 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:227 s=4.685 -->
- [Use Async GP tool in Overlay Events for Feature Services](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/use-async-gp-in-overlay-events-for-feature-services.md>) — similar text 0.17 · 3 title words · 3 filename words · same surface/folder <!-- rel:179 s=4.619 -->
- [Spike Benchmark Overlay Events in GP vs API](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/benchmark-overlay-events-in-gp-vs-api.md>) — similar text 0.19 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:185 s=4.285 -->
- [Support performance improvements in Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/6954-support-performance-improvements-in-overlay-events.md>) — similar text 0.18 · 2 title words · 2 filename words · same surface/folder <!-- rel:99 s=4.076 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Profile Overlay Events GP tool

Spike

## Slide 2 — Overlay Events

As a GIS Analyst, I want dynamic segmentation on my linear referenced data to be performant for any size dataset, so that I can run the operation against my entire dataset which has many routes and events.

- Profile the Overlay Events geoprocessing tool to identify how much of the tool execution time is devoted to various parts of the overlay process
- Do this profiling using INDOT data.  Use all the routes in the CountyLog Network and the 15 event layers with the most records.
- Utilize that profile to analyze where there are bottlenecks that could be removed and opportunities to improve performance

Deliverables

- Document findings from the profiling
- Provide a list of all changes that could provide performance improvements
- Rank this list from most impactful to least impactful on performance of the tool

## Slide 3 — Assignment

Story Points:
