# Investigate Generate Routes with Reverse Stationing

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Source** | [Generate_Routes_ReverseStationing.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Generate_Routes_ReverseStationing.pdf>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "Investigate Generate Routes with Reverse Stationing"
source_file: "Generate_Routes_ReverseStationing.pdf"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Generate_Routes_ReverseStationing.pdf"
doc_id: 630
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: ""
extracted: 2026-09-04
extraction_lane: plaintext
prompt_version: "v2.0.2"
keywords: ["derived network", "reverse stationing", "route generation", "line direction"]
tools: []
products: []
issues: []
related: [{"doc":629,"file":"investigate-line-order-with-reverse-stationing__doc629.md","s":5.408},{"doc":695,"file":"spike-reverse-stationing__doc695.md","s":4.391},{"doc":743,"file":"support-reverse-route-in-pro__doc743.md","s":2.677},{"doc":739,"file":"support-reverse-route-event-behaviors__doc739.md","s":2.614},{"doc":576,"file":"reverse-line-orders-tool__doc576.md","s":2.474}]
```
-->

## Summary

This document investigates the handling of generating derived network routes when the first route in a line is oriented in the opposite direction compared to the rest of the routes on that line. It focuses on the implications of reverse stationing in route generation within a derived network context.

## Related documents

<!-- related:begin -->
- [Investigate Line Order with Reverse Stationing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/investigate-line-order-with-reverse-stationing__doc629.md>) — similar text 0.35 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:629 -->
- [Spike: Reverse Stationing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-reverse-stationing__doc695.md>) — similar text 0.40 · 2 title words · 2 filename words · same surface/folder <!-- rel:695 -->
- [Support Reverse Route in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-in-pro__doc743.md>) — similar text 0.14 · 1 title word · 1 filename word · same surface/folder <!-- rel:743 -->
- [Support Reverse Route Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-event-behaviors__doc739.md>) — similar text 0.12 · 1 title word · 1 filename word · same surface/folder <!-- rel:739 -->
- [Reverse Line Orders tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/reverse-line-orders-tool__doc576.md>) — similar text 0.19 · 1 title word · 1 filename word · same surface/folder <!-- rel:576 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [generate routes](https://www.google.com/search?q=%22generate%20routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

          Investigate Generate Routes with Reverse Stationing

                                Derived Network

Investigate how we handle generating the derived network route when the first
route in a line is in the opposite direction as the rest of the routes on the line.

                                                                                      832
