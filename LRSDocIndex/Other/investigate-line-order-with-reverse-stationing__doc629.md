# Investigate Line Order with Reverse Stationing

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Source** | [Line_Order_ReverseStationing.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Line_Order_ReverseStationing.pdf>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "Investigate Line Order with Reverse Stationing"
source_file: "Line_Order_ReverseStationing.pdf"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Line_Order_ReverseStationing.pdf"
doc_id: 629
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: "Ayan"
dev: ""
author: ""
last_edited_by: ""
last_edited: ""
extracted: 2026-09-04
extraction_lane: plaintext
prompt_version: "v2.0.2"
keywords: ["line order", "reverse stationing", "route editing", "derived network", "postmile network", "linear referencing"]
tools: ["Realign", "Reassign", "Extend", "Retire", "Reverse"]
products: []
issues: []
related: [{"doc":630,"file":"investigate-generate-routes-with-reverse-stationing__doc630.md","s":5.408},{"doc":695,"file":"spike-reverse-stationing__doc695.md","s":4.771},{"doc":530,"file":"enhance-reverse-line-orders-tool-to-create-common-time-slice__doc530.md","s":4.069},{"doc":576,"file":"reverse-line-orders-tool__doc576.md","s":3.966},{"doc":547,"file":"test-plan-reverse-line-orders-gp-tool__doc547.md","s":3.575}]
```
-->

## Summary

This document investigates how the software handles routes loaded with line order opposite to the direction of increasing measures, focusing on defining best practices for data modeling. It examines the effect on line order when performing linear referencing edit activities such as Realign, Reassign, Extend, Retire, and Reverse on various route scenarios. The document also reports on line order behavior post editing and the impact on the derived network.

## Related documents

<!-- related:begin -->
- [Investigate Generate Routes with Reverse Stationing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/investigate-generate-routes-with-reverse-stationing__doc630.md>) — similar text 0.35 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:630 -->
- [Spike: Reverse Stationing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-reverse-stationing__doc695.md>) — similar text 0.31 · 2 title words · 2 filename words · same surface/folder <!-- rel:695 -->
- [Enhance Reverse Line Orders tool to create common time slice](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/enhance-reverse-line-orders-tool-to-create-common-time-slice__doc530.md>) — similar text 0.17 · 2 title words · 2 filename words · same surface/folder <!-- rel:530 -->
- [Reverse Line Orders tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/reverse-line-orders-tool__doc576.md>) — similar text 0.21 · 2 title words · 2 filename words · same surface/folder <!-- rel:576 -->
- [Test Plan: Reverse Line Orders GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/test-plan-reverse-line-orders-gp-tool__doc547.md>) — similar text 0.10 · 2 title words · 2 filename words · same surface <!-- rel:547 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html) · [Reverse routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reverse-routes.html) · [Multiple linear referencing methods](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/multiple-linear-referencing-methods.html)
<!-- docs:end -->

---

               Investigate Line Order with Reverse Stationing

Line Order in reverse stationing - Investigate how the software handles routes that are loaded
with line order opposite of the direction of increasing measures. The goal for this item is to put
together a defined best practice of how data needs to be modeled to ensure it works correctly
with the software, i.e. what does and doesn't work?
Source: Ayan with the issue brought up by BuckEye

                                          Realign

                                                         Output

                                                                                                833
                                                    Realign

                                                        Output

Investigate the effect on line order when performing LR edit activities using these tools:
• Realign
• Reassign
• Extend
• Retire
• Reverse

Test by editing a single route, part of a route, multiple routes in the middle, routes at the end
etc. on Line and Postmile networks
• Report the pattern for the line order behavior post editing.
• Report the effect of the derived network.

                                                                                             834
