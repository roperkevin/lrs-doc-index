# Investigate Generate Routes with Reverse Stationing

| Field | Value |
| --- | --- |
| **Doc** | 630 · Other · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Generate_Routes_ReverseStationing.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Generate_Routes_ReverseStationing.pdf>) |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | derived network · reverse stationing · route generation · line direction |
| **Tools** | — |

## Summary

This document investigates the handling of generating derived network routes when the first route in a line is oriented in the opposite direction compared to the rest of the routes on that line. It focuses on the implications of reverse stationing in route generation within a derived network context.

## Related documents

<!-- related:begin -->
- [Investigate Line Order with Reverse Stationing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/investigate-line-order-with-reverse-stationing.md>) — similar text 0.35 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:629 s=5.408 -->
- [Spike: Reverse Stationing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/reverse-stationing.md>) — similar text 0.40 · 2 title words · 2 filename words · same surface/folder <!-- rel:695 s=4.391 -->
- [Support Reverse Route in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-in-pro.md>) — similar text 0.14 · 1 title word · 1 filename word · same surface/folder <!-- rel:743 s=2.677 -->
- [Support Reverse Route Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-eb-rh-apr-un-2020-12.md>) — similar text 0.12 · 1 title word · 1 filename word · same surface/folder <!-- rel:739 s=2.614 -->
- [Reverse Line Orders tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/reverse-line-orders-tool.md>) — similar text 0.19 · 1 title word · 1 filename word · same surface/folder <!-- rel:576 s=2.474 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [generate routes](https://www.google.com/search?q=%22generate%20routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

          Investigate Generate Routes with Reverse Stationing

                                Derived Network

Investigate how we handle generating the derived network route when the first route in a line is in the opposite direction as the rest of the routes on the line.

                                                                                      832
