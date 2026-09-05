# Nonline Network Realignment Bugs

| Field | Value |
| --- | --- |
| **Doc** | 451 · Other · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [RealignBugsConcurrent.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RealignBugsConcurrent.pdf>) |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | concurrent routes · realignment · event drawing · location error · line network · event spanning · experience builder |
| **Tools** | Realign Snap · Reassign Snap · Calibrate Stayput |

## Summary

Document describes issues with concurrent routes in a line network where events spanning multiple routes have missing segments or zero shape length due to location errors. It highlights realignment problems and event drawing errors in the Experience Builder tools Realign Snap, Reassign Snap, and Calibrate Stayput.

## Related documents

<!-- related:begin -->
- [Realign Event Behavior](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/realign-eb.md>) — similar text 0.25 · 1 filename word · same folder <!-- rel:373 s=3.478 -->
- [Support Snap Event Behavior in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-snap-eb-in-realign-route.md>) — similar text 0.17 · 1 filename word · same folder <!-- rel:730 s=2.607 -->
- [Support Event Behaviors for New Reassign Method: Transfer to another line](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-for-new-reassign-method-transfer-to-another-line.md>) — similar text 0.14 · same surface/folder <!-- rel:572 s=2.33 -->
- [Support Snap Event Behavior in Retire Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/3780-support-snap-eb-in-retire-routes-rh-apr-v4.md>) — similar text 0.10 · same surface/folder <!-- rel:479 s=2.241 -->
- [Cover Event Behavior in Realign Route with Concurrencies](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-eb-in-realign-route-with-concurrencies.md>) — similar text 0.10 · 1 filename word · same folder <!-- rel:715 s=2.122 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Location errors](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/location-errors.html)

_No page matched:_ [Realign Snap](https://www.google.com/search?q=%22Realign%20Snap%22+site%3Adoc.esri.com) · [Reassign Snap](https://www.google.com/search?q=%22Reassign%20Snap%22+site%3Adoc.esri.com) · [Calibrate Stayput](https://www.google.com/search?q=%22Calibrate%20Stayput%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

                                 Nonline Network
Dark and light blue routes are concurrent routes. No dominancy is set. Orange event is on dark thin blue route. Realignment is on dark thin blue route.

                                 EB:
                                 Realign Snap
                                 Reassign Snap
                                 Calibrate Stayput

This is correct behavior. Line network has bugs. See following 2 slides.
                                                               Line
Dark and light blue routes are concurrent routes. No dominancy is set. Orange event is spanning on all dark thin blue routes.
Realignment is in the middle of the first dark thin blue route.
a (calibration changed)
                                                                EB:
Realign Snap b
                                                                Reassign Snap
                                                                Calibrate Stayput
Issue: only getting 1 segment of orange event. This event is not drawn. It has a shape length 0 due to loc error. I just draw it here for visualization

  Event fields:
  From: Route2 beginning
To: Route1 (end of realignment)(it has a measure but this measure no longer exists on Route1 because it’s route b)
  Loc error: Different From Route And To Route Line IDs
                                     Line
Dark and light blue routes are concurrent routes. No dominancy is set. Orange event is spanning on all dark thin blue routes. Yellow event is crossing realignment end point. Realignment starts from the middle of the first dark thin blue route, and ends in the middle of the second dark thin blue route.

                                     EB:
                                     Realign Snap
                                     Reassign Snap
Issue: a missing portion of orange   Calibrate Stayput event; a missing portion of yellow event
