# Investigate Line Order with Reverse Stationing

| Field | Value |
| --- | --- |
| **Doc** | 629 · Other · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Line_Order_ReverseStationing.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Line_Order_ReverseStationing.pdf>) |
| **People** | author — · PE Ayan · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | line order · reverse stationing · route editing · derived network · postmile network · linear referencing |
| **Tools** | Realign · Reassign · Extend · Retire · Reverse |

## Summary

This document investigates how the software handles routes loaded with line order opposite to the direction of increasing measures, focusing on defining best practices for data modeling. It examines the effect on line order when performing linear referencing edit activities such as Realign, Reassign, Extend, Retire, and Reverse on various route scenarios. The document also reports on line order behavior post editing and the impact on the derived network.

## Related documents

<!-- related:begin -->
- [Investigate Generate Routes with Reverse Stationing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/investigate-generate-routes-with-reverse-stationing.md>) — similar text 0.35 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:630 s=5.408 -->
- [Spike: Reverse Stationing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/reverse-stationing.md>) — similar text 0.31 · 2 title words · 2 filename words · same surface/folder <!-- rel:695 s=4.771 -->
- [Enhance Reverse Line Orders tool to create common time slice](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/enhance-reverse-line-orders-tool-to-create-common-time-slice.md>) — similar text 0.17 · 2 title words · 2 filename words · same surface/folder <!-- rel:530 s=4.069 -->
- [Reverse Line Orders tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/reverse-line-orders-tool.md>) — similar text 0.21 · 2 title words · 2 filename words · same surface/folder <!-- rel:576 s=3.966 -->
- [Test Plan: Reverse Line Orders GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4983-reverse-line-orders-gp.md>) — similar text 0.10 · 2 title words · 2 filename words · same surface <!-- rel:547 s=3.575 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html) · [Reverse routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reverse-routes.html) · [Multiple linear referencing methods](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/multiple-linear-referencing-methods.html)
<!-- docs:end -->

---

               Investigate Line Order with Reverse Stationing

Line Order in reverse stationing - Investigate how the software handles routes that are loaded with line order opposite of the direction of increasing measures. The goal for this item is to put together a defined best practice of how data needs to be modeled to ensure it works correctly with the software, i.e. what does and doesn't work?
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

Test by editing a single route, part of a route, multiple routes in the middle, routes at the end etc. on Line and Postmile networks
• Report the pattern for the line order behavior post editing.
• Report the effect of the derived network.

                                                                                             834
