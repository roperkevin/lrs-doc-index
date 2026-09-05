# Spike: Performance Improvement Prioritization

| Field | Value |
| --- | --- |
| **Doc** | 391 · Design Spike · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike PrioritizePerformanceImprovements.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20PrioritizePerformanceImprovements.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2024-03-27 18:44 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | performance improvement · tools prioritization · optimization · generate intersections · generate routes · derive event measures · translate events · generate events |
| **Tools** | — |

## Summary

This spike document focuses on prioritizing performance improvements for various tools and capabilities used in common workflows. It aims to identify and rank tools and operations that would benefit most from optimization efforts within limited development time. The deliverable is a prioritized list of tools for performance enhancement investigation.

## Related documents

<!-- related:begin -->
- [Spike: Performance Improvement to Generate Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/performance-improvement-to-generate-events.md>) — similar text 0.20 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:748 s=3.973 -->
- [Spike: Performance Improvement to Generate Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/performance-improvement-to-generate-routes.md>) — similar text 0.20 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:752 s=3.951 -->
- [Spike: Performance Improvement for Derive Event Measures](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/performance-improvement-for-derive-event-measures.md>) — similar text 0.21 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:751 s=3.827 -->
- [Spike: Performance improvement for Apply Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/performance-improvement-for-apply-eb.md>) — similar text 0.19 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:749 s=3.632 -->
- [Spike: Performance improvement to Overlay Events/Query Attribute Set](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/performance-improvement-to-overlay-events-query-attribute.md>) — similar text 0.17 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:227 s=3.586 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [generate routes](https://www.google.com/search?q=%22generate%20routes%22+site%3Adoc.esri.com) · [derive event measures](https://www.google.com/search?q=%22derive%20event%20measures%22+site%3Adoc.esri.com) · [generate events](https://www.google.com/search?q=%22generate%20events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Performance improvement prioritization

Spike

## Slide 2 — Performance improvement prioritization

- Moving forward, we’d like to address performance improvement for tools/capabilities during each release cycle
- To support this work, a prioritized list of tools to investigate and optimize will be needed
- Look at all the tools that part of commonly executed workflows and provide a prioritized list of which tools would be most beneficial to investigate for performance improvements
- These don’t have to be only GP tools
- Make sure to consider whether the tool has previously been focused for performance improvements (Centerline selection, Generate Intersections, Generate Routes, Derive Event Measures, Translate Events, and Generate Events are tools that were previously profiled)
- Also consider the potential effort needed to get performance gains on tools/operations.  We want to get the most improvement but can’t devote more than half an iteration towards the effort
- Deliverable for the spike is a list of tools/operations identified that could be focused on for performance improvements.  Rank the items from most impactful to least impactful.

## Slide 3 — Assignment

Story Points:
Dev:
