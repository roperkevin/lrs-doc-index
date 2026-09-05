# Event Behavior for Route Realignment and Calibration

| Field | Value |
| --- | --- |
| **Doc** | 384 · Other · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [final.change.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5748_EB_topics/final.change.docx>) |
| **People** | author Claire Wang · PE — · dev — |
| **Edited** | 2024-04-12 18:12 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | event behavior · route realignment · route calibration · calibration point · recalibrate downstream · location referencing |
| **Tools** | — |

## Summary

This document provides updates and clarifications on event behavior related to route realignment and calibration in location referencing pipelines. It includes instructions to modify event behavior tables, replace notes with detailed explanations about recalibration options, and update graphics illustrating upstream and downstream calibration points.

## Related documents

<!-- related:begin -->
- [Event Behavior for Route Calibration](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-route-calibration-apr-2023-11-2.md>) — similar text 0.17 · 4 title words · same kind/surface <!-- rel:448 s=3.813 -->
- [Event Behavior for Route Calibration](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-route-calibration-apr-2023-11.md>) — similar text 0.22 · 4 title words · same kind/surface <!-- rel:446 s=3.772 -->
- [Event Behavior for Route Calibration](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-route-calibration-rh-2023-11-2.md>) — similar text 0.20 · 4 title words · same kind/surface <!-- rel:449 s=3.727 -->
- [Event Behavior for Route Retirement](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-route-retirement-apr-2024-01-2.md>) — similar text 0.20 · 3 title words · 1 filename word · same kind/surface <!-- rel:443 s=3.657 -->
- [Event Behavior for Route Retirement](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-route-retirement-rh-2024-01-2.md>) — similar text 0.18 · 3 title words · 1 filename word · same kind/surface <!-- rel:442 s=3.595 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)

_No page matched:_ [calibration point layer](https://www.google.com/search?q=%22calibration%20point%20layer%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

https://prodev.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/what-is-event-behavior.htmhttps://prodev.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/what-is-event-behavior.htm
Remove duplicate note
https://prodev.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/event-behavior-for-route-realignment.htm and https://prodev.arcgis.com/en/pro-app/latest/help/production/roads-highways/event-behavior-for-route-realignment.htm
change the first 3 cells in this column to be No action. (so all 5 cells show No action.)
https://prodev.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/event-behavior-for-route-calibration.htm and https://prodev.arcgis.com/en/pro-app/latest/help/production/roads-highways/event-behavior-for-route-calibration.htm

1. Remove this bullet

1. Replace the Note with the text below

In this example, the Recalibrate downstream option is chosen, so the recalibrated route section starts from the nearest upstream calibration point of the edited calibration point to the end of the route. If the Recalibrate downstream option is not chosen, the recalibrated route section is between the nearest upstream and downstream calibration points of the edited calibration point.

1. Replace the Upstream/Downstream graphic to be the one below (see attached draw.io)

![Figure 1](../media/eb-for-route-realignment-and-calibration/fig-01.png)
![Figure 2](../media/eb-for-route-realignment-and-calibration/fig-02.png)
![Figure 3](../media/eb-for-route-realignment-and-calibration/fig-03.png)
![Figure 4](../media/eb-for-route-realignment-and-calibration/fig-04.png)
![Figure 5](../media/eb-for-route-realignment-and-calibration/fig-05.png)
![Figure 6](../media/eb-for-route-realignment-and-calibration/fig-06.png)
