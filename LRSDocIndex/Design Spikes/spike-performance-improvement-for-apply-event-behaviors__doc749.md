# Spike: Performance improvement for Apply Event Behaviors

|   |   |
| --- | --- |
| **Kind** | Design Spike · Pro |
| **Release** | — |
| **Source** | [Spike GP Performance Apply Event Behaviors.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20GP%20Performance%20Apply%20Event%20Behaviors.pptx>) |
| **Edited** | 2020-12-03 21:18 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Performance improvement for Apply Event Behaviors"
source_file: "Spike GP Performance Apply Event Behaviors.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20GP%20Performance%20Apply%20Event%20Behaviors.pptx"
doc_id: 749
doc_kind: "Design Spike"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2020-12-03T21:18:13Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["apply event behaviors", "performance improvement", "multi threading", "refactoring", "pipeline operators"]
tools: ["Apply Event Behaviors"]
products: []
issues: []
related: [{"doc":751,"file":"spike-performance-improvement-for-derive-event-measures__doc751.md","s":8.08},{"doc":752,"file":"spike-performance-improvement-to-generate-routes__doc752.md","s":7.228},{"doc":748,"file":"spike-performance-improvement-to-generate-events__doc748.md","s":7.228},{"doc":227,"file":"spike-performance-improvement-to-overlay-events-query-attribute-set__doc227.md","s":4.392},{"doc":391,"file":"spike-performance-improvement-prioritization__doc391.md","s":3.632}]
```
-->

## Summary

This document investigates performance improvements for the Apply Event Behaviors tool used by pipeline operators. It explores refactoring the existing single-threaded code and the potential benefits of making the tool multi-threaded. The goal is to determine if these approaches can enhance the tool's performance and plan subsequent development and testing efforts.

## Related documents

<!-- related:begin -->
- [Spike: Performance Improvement for Derive Event Measures](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-performance-improvement-for-derive-event-measures__doc751.md>) — similar text 0.97 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:751 -->
- [Spike: Performance Improvement to Generate Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-performance-improvement-to-generate-routes__doc752.md>) — similar text 0.98 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:752 -->
- [Spike: Performance Improvement to Generate Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-performance-improvement-to-generate-events__doc748.md>) — similar text 0.98 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:748 -->
- [Spike: Performance improvement to Overlay Events/Query Attribute Set](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-performance-improvement-to-overlay-events-query-attribute-set__doc227.md>) — similar text 0.35 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:227 -->
- [Spike: Performance Improvement Prioritization](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-performance-improvement-prioritization__doc391.md>) — similar text 0.19 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:391 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Apply Event Behaviors](https://www.google.com/search?q=%22Apply%20Event%20Behaviors%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Performance improvement for Apply Event Behaviors

Spike

## Slide 2 — Apply Event Behaviors performance improvement

Sempra Energy (and other pipeline operators) have given feedback/requests to improve the performance of Apply Event Measures as they run the tool often.
There are two ways we can investigate improving the performance of the tool: refactoring of the existing business logic and exploring taking advantage of making the tool multi threaded.

Questions to answer:
Can the existing (single threaded) code for the tool be refactored to improve performance?
Can the tool have performance improved by moving from single to multi threaded?

After investigation, if the answer to either of the questions above is yes (hopefully it’s both options), then move forward with refactoring the tool to improve performance.
We’ll also change the estimate at that time to reflect the effort required to complete the refactoring.  The effort will primarily be development work since the tool is automated, however, we should have a Product Engineer do a day’s worth of testing on the tool once refactored

## Slide 3 — Assignment

Story Points:
Dev:
