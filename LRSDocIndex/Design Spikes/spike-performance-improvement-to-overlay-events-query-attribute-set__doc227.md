# Spike: Performance improvement to Overlay Events/Query Attribute Set

|   |   |
| --- | --- |
| **Kind** | Design Spike · Pro |
| **Release** | — |
| **Source** | [Spike OverlayEvents QueryAttrributeSet Performance.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20OverlayEvents%20QueryAttrributeSet%20Performance.pptx>) |
| **Edited** | 2025-02-25 16:24 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Performance improvement to Overlay Events/Query Attribute Set"
source_file: "Spike OverlayEvents QueryAttrributeSet Performance.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20OverlayEvents%20QueryAttrributeSet%20Performance.pptx"
doc_id: 227
doc_kind: "Design Spike"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2025-02-25T16:24:54Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["overlay events", "query attribute set", "performance improvement", "dynamic segmentation", "multi threading", "large datasets"]
tools: ["Overlay Events", "Query Attribute Set"]
products: []
issues: []
related: [{"doc":748,"file":"spike-performance-improvement-to-generate-events__doc748.md","s":5.298},{"doc":110,"file":"spike-profile-overlay-events-gp-tool__doc110.md","s":4.685},{"doc":752,"file":"spike-performance-improvement-to-generate-routes__doc752.md","s":4.395},{"doc":749,"file":"spike-performance-improvement-for-apply-event-behaviors__doc749.md","s":4.392},{"doc":751,"file":"spike-performance-improvement-for-derive-event-measures__doc751.md","s":4.377}]
```
-->

## Summary

Investigation into performance issues with the Overlay Events/Query Attribute Set tool, focusing on identifying bottlenecks and exploring multi-threading to improve processing speed. Testing involves large datasets from multiple sources to evaluate potential optimizations and refactoring of business logic.

## Related documents

<!-- related:begin -->
- [Spike: Performance Improvement to Generate Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-performance-improvement-to-generate-events__doc748.md>) — similar text 0.35 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:748 -->
- [Spike: Profile Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-profile-overlay-events-gp-tool__doc110.md>) — similar text 0.17 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:110 -->
- [Spike: Performance Improvement to Generate Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-performance-improvement-to-generate-routes__doc752.md>) — similar text 0.35 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:752 -->
- [Spike: Performance improvement for Apply Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-performance-improvement-for-apply-event-behaviors__doc749.md>) — similar text 0.35 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:749 -->
- [Spike: Performance Improvement for Derive Event Measures](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-performance-improvement-for-derive-event-measures__doc751.md>) — similar text 0.34 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:751 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com) · [Query Attribute Set](https://www.google.com/search?q=%22Query%20Attribute%20Set%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Performance improvement to Overlay Events/Query Attribute Set

Spike

## Slide 2 — OE/QAS performance improvement

Esri PS on behalf of multiple users has mentioned performance on the Overlay Events/QAS tool as being too slow and taking too long to complete (including timing out when run on more than 1 route for some users)
Additionally, we’ve added significant logic to the tool over the past 2-3 releases that add additional processing time to the dynamic segmentation operation
Explore how to optimize the performance of the tool.  Utilize the profiling approach that has been used with other tools to determine where logic could be restructured/improved to boost performance.  It might also be good to investigate if the tool can be run multi threaded and if there is a way to take advantage of that.
Questions to answer:
What’s the bottleneck for the tool?  Based on what’s found, where can we refactor business logic to improve performance?
Can the tool have performance improved by moving from single to multi threaded? (Check the Pro developer guide for the GP framework for multi threading and existing LRS tools that use multi threading for a pattern)
Use large datasets with many events for this testing (suggest a mix of ONEOK, CDOT, and another full state dataset).  I’d also test on the City of Nashville dataset Amit H shared with us for the new Addressing related logic added to the tool in recent releases.

After completing the investigation, if there are fixes that can be made to improve performance, go ahead and make them and we can revise the estimate for the story as needed.

## Slide 3 — Assignment

Story Points:
Dev:
