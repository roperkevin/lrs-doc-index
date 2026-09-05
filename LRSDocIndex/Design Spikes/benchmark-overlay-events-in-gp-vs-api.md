# Spike Benchmark Overlay Events in GP vs API

| Field | Value |
| --- | --- |
| **Doc** | 185 · Design Spike · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike Benchmark Overlay Events in GP vs API.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Benchmark%20Overlay%20Events%20in%20GP%20vs%20API.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2025-04-22 21:57 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | overlay events · benchmark · geoprocessing · api · event on event · performance |
| **Tools** | Overlay Events |

## Summary

This spike document benchmarks the performance differences between running the Overlay Events geoprocessing tool and calling the Overlay Events logic via API. It uses INDOT data with 20 linear events selected to compare execution times and evaluates copying the results table from a file geodatabase to SQLite. The goal is to support the Data Reviewer team's use of Overlay Events/Query Attribute Set logic for event-on-event checks.

## Related documents

<!-- related:begin -->
- [Spike: Performance improvement to Overlay Events/Query Attribute Set](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/performance-improvement-to-overlay-events-query-attribute.md>) — similar text 0.18 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:227 s=4.302 -->
- [Spike: Profile Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/profile-overlay-events-gp.md>) — similar text 0.19 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:110 s=4.285 -->
- [Support performance improvements in Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/6954-support-performance-improvements-in-overlay-events.md>) — similar text 0.21 · 2 title words · 2 filename words · same surface/folder <!-- rel:99 s=4.086 -->
- [Use Async GP tool in Overlay Events for Feature Services](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/use-async-gp-in-overlay-events-for-feature-services.md>) — similar text 0.23 · 2 title words · 2 filename words · same surface/folder <!-- rel:179 s=4.002 -->
- [Support Parallel Processing in Overlay Events GP Tool Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/support-parallel-processing-in-overlay-events-gp-2026-02-2.md>) — similar text 0.20 · 2 title words · 2 filename words · same surface <!-- rel:54 s=3.318 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Benchmark Overlay Events in GP vs API

Spike

## Slide 2 — Overlay Events

The Data Reviewer team wants to be able to utilize the Overlay Events/Query Attribute Set logic to run the Event on Event check via fgdb
To support this, there are a few options available.  This spike with benchmark performance differences between running the GP tool and calling the API for Overlay Events logic.

- Benchmark the performance of running the Overlay Events GP tool from a fgdb in python/c++ on INDOT data (run against the entire state with 20 linear events selected) with a table output vs calling the Overlay Events logic in the API using the same dataset and route/event selection  (We should eliminate the UI being a part of this and mimic how Data Reviewer could call this logic)
- Provide a comparison of time needed for the GP framework vs the actual Overlay Events logic
- Benchmark the time needed to copy the results table of the GP tool in a fgdb to SQL Lite

## Slide 3 — Assignment

Story Points:
