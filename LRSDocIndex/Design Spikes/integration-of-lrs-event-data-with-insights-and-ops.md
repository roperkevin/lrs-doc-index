# Spike: Integration of LRS Event data with Insights and Ops Dashboard

| Field | Value |
| --- | --- |
| **Doc** | 641 · Design Spike · Other |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike InsightsOpsDashboardIntegrationPattern.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20InsightsOpsDashboardIntegrationPattern.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2022-08-21 23:35 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | event data · insights · ops dashboard · dynamic segmentation · visualization · migration |
| **Tools** | Overlay Events |

## Summary

Investigates the best pattern to integrate LRS event data, including point, line, and dynamically segmented events, into ArcGIS Insights and Ops Dashboards for visualization. Includes testing visualization methods such as heat maps and mileage summaries, documenting migration processes, and demonstrating the workflow to the team.

## Related documents

<!-- related:begin -->
- [Length Data Product Support Features Enhancement](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/length-data-product-support-features-enhancement.md>) — similar text 0.08 · same folder <!-- rel:47 s=1.238 -->
- [Update Address Range via Address Points in Overlay Events and Query Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-address-range-via-address-points-in-overlay-events.md>) — similar text 0.04 · same folder <!-- rel:294 s=1.172 -->
- [Include Site Addresses Layer in Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/include-site-addresses-layer-in-sld.md>) — similar text 0.05 · same folder <!-- rel:181 s=1.167 -->
- [Support Overlapping Events in Query Attribute Set and Overlay Events GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-overlapping-events-in-query-attribute-set.md>) — similar text 0.03 · same folder <!-- rel:290 s=1.145 -->
- [Update Address Range Information in Overlay Events and Query Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/5537-update-address-range-information-in-overlay-events-and-query.md>) — similar text 0.03 · same folder <!-- rel:344 s=1.136 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Events data model](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/events-data-model.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Integration of LRS Event data with Insights and Ops Dashboard

Spike

## Slide 2 — Insights and Ops Dashboard integration

- Investigate the best pattern to get LRS event data into ArcGIS Insights for visualization
- Test with point event data, line event data, and dynamically segmented event data (the output of Overlay Events GP tool)
- Visualize the data incorporating the measures in some way (i.e., heat maps of clusters of point features based on measured segments, summary of mileage of certain line event attributes)
- Also investigate the best pattern for getting these same data types (point, line, dynseg) into Ops Dashboards and visualize them in a similar way as in Insights
- Deliverables for this spike will be the following:
  - Document any migration process to get LRS event data into Insights and Ops Dashboards (if any scripts or other tools are used, provide those as well)
  - Demo the process to the team so we can discuss any new tools/capabilities that can be added to the software to streamline this process for our users

## Slide 3 — Assignment

Story Points:
Dev:
