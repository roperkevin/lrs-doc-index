# Spike: Performance Improvement to Generate Events

| Field | Value |
| --- | --- |
| **Doc** | 748 · Design Spike · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike GP Performance Generate Events.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20GP%20Performance%20Generate%20Events.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2020-12-03 21:20 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | generate events · performance improvement · multi threaded · refactoring · pipeline operators |
| **Tools** | Generate Events |

## Summary

This document discusses investigating performance improvements for the Generate Events tool used by pipeline operators. It explores refactoring the existing single-threaded code and the possibility of implementing multi-threading to enhance performance. The outcome will guide development efforts and testing requirements.

## Related documents

<!-- related:begin -->
- [Spike: Performance Improvement to Generate Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/performance-improvement-to-generate-routes.md>) — similar text 1.00 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:752 s=8.564 -->
- [Spike: Performance improvement for Apply Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/performance-improvement-for-apply-eb.md>) — similar text 0.98 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:749 s=7.228 -->
- [Spike: Performance Improvement for Derive Event Measures](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/performance-improvement-for-derive-event-measures.md>) — similar text 0.97 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:751 s=7.186 -->
- [Spike: Performance improvement to Overlay Events/Query Attribute Set](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/performance-improvement-to-overlay-events-query-attribute.md>) — similar text 0.35 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:227 s=5.298 -->
- [Spike: Performance Improvement Prioritization](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/performance-improvement-prioritization.md>) — similar text 0.20 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:391 s=3.973 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Generate Events](https://www.google.com/search?q=%22Generate%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Performance improvement to Generate Events

Spike

## Slide 2 — Generate Events performance improvement

Sempra Energy (and other pipeline operators) have given feedback/requests to improve the performance of Generate Events as they run the tool often.
There are two ways we can investigate improving the performance of the tool: refactoring of the existing business logic and exploring taking advantage of making the tool multi threaded.

Questions to answer:

- Can the existing (single threaded) code for the tool be refactored to improve performance?
- Can the tool have performance improved by moving from single to multi threaded?

After investigation, if the answer to either of the questions above is yes (hopefully it’s both options), then move forward with refactoring the tool to improve performance.
We’ll also change the estimate at that time to reflect the effort required to complete the refactoring.  The effort will primarily be development work since the tool is automated, however, we should have a Product Engineer do a day’s worth of testing on the tool once refactored

## Slide 3 — Assignment

Story Points:
Dev:
