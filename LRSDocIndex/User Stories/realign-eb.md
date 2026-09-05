# Realign Event Behavior

| Field | Value |
| --- | --- |
| **Doc** | 373 · User Story · Pro |
| **Product** | — |
| **Release** | ~13 |
| **Issues** | — |
| **Source** | [RealignFinal.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RealignFinal.pptx>) |
| **People** | author Claire Wang · PE Michael · dev — |
| **Edited** | 2024-05-15 20:02 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | event behavior · realign · calibrate stayput · realign snap · downstream route · event gap · user story |
| **Tools** | — |

## Summary

The document discusses event behavior during route realignment in linear referencing, focusing on how events are managed on downstream routes with different realignment and calibration behaviors. It outlines decisions to keep events on downstream routes and plans for a user story to address event gaps and related fixes. Next steps include combining code changes, fixing automation, and updating documentation.

## Related documents

<!-- related:begin -->
- [Support Snap Event Behavior in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-eb-in-realign-route.md>) — similar text 0.16 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:730 s=4.325 -->
- [Cover Event Behavior in Realign Route with Concurrencies](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-eb-in-realign-route-with-concurrencies.md>) — similar text 0.08 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:715 s=3.999 -->
- [Support Event Behaviors on Vertical Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-realign-route.md>) — similar text 0.16 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:761 s=3.829 -->
- [Support Event Behaviors on Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-realign-route.md>) — similar text 0.19 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:836 s=3.697 -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-reassign-route.md>) — similar text 0.15 · 1 title word · same kind/surface/folder <!-- rel:758 s=2.965 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html)
<!-- docs:end -->

---

## Slide 1 — Realign Event Behavior

## Slide 2 — Continuous – no recal

Realign stayput Calibrate stayput
Realign snap Calibrate stayput

[figure: 0 · 30]

![Figure 1 — Continuous – no recal](../media/realign-eb/fig-01-slide-02-continuous-no-recal.svg)

## Slide 3 — Continuous – recal downstream

Realign stayput Calibrate stayput
Realign snap Calibrate stayput

[figure: 0 · 30 · 50]

![Figure 2 — Continuous – recal downstream](../media/realign-eb/fig-02-slide-03-continuous-recal-downstream.svg)

## Slide 4 — Line

Realign stayput Calibrate stayput
Realign snap Calibrate stayput
Change realignment measures – new route in realignment
Do not recalibrate downstream – new route downstream

Michael: If we want events to show up on the downstream new route, we change event behavior code, not edit log

We decide to keep the events on downstream route. This will be done in a user story along with the fix in 5641.

We decide to keep the events on downstream route. This will be done in a user story along with the fix in 5641.

[figure: 0 · 10 · 30 · 50 · 80 · 20 · R1 · new · down]

![Figure 3 — Line](../media/realign-eb/fig-03-slide-04-line.svg)

## Slide 5 — Line

Realign stayput Calibrate stayput
Realign snap Calibrate stayput
Recalibrate downstream – remaining R3 becomes R2

A tiny non-spanning event
We decide to keep the events on downstream route. This will be done in a user story along with the fix in 5641.
We decide to keep the events on downstream route. This will be done in a user story along with the fix in 5641.

[figure: R1 · R2 · R3 · R4 · R5]

![Figure 4 — Line](../media/realign-eb/fig-04-slide-05-line.svg)

## Slide 6 — Line

Realign stayput Calibrate stayput
Realign snap Calibrate stayput
Change realignment measures – new route in realignment
Do not recalibrate downstream – new route downstream

We decide to keep the events on downstream route. This will be done in a user story along with the fix in 5641.
We decide to keep the events on downstream route. This will be done in a user story along with the fix in 5641.

[figure: R1 · R2 · R3 · R4 · R5 · new · down]

![Figure 5 — Line](../media/realign-eb/fig-05-slide-06-line.svg)

## Slide 7

Next steps:

- Keep the code from 5641 that will leave an event gap (no event on downstream route)
- Write a ~13 user story to fix the event gap for Calibrate stayput (treat as Snap). For Move, it will still get Route not found Error just like 5015. (we assume Stayput-Snap only exists in such few Realign scenarios) 5641 code will be combined with code in this user story to check in.
- Fix automation
- Update doc
