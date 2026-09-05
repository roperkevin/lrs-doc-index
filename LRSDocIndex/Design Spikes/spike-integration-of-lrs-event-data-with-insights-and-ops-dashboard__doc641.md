# Spike: Integration of LRS Event data with Insights and Ops Dashboard

|   |   |
| --- | --- |
| **Kind** | Design Spike · Other |
| **Release** | — |
| **Source** | [Spike InsightsOpsDashboardIntegrationPattern.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20InsightsOpsDashboardIntegrationPattern.pptx>) |
| **Edited** | 2022-08-21 23:35 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Integration of LRS Event data with Insights and Ops Dashboard"
source_file: "Spike InsightsOpsDashboardIntegrationPattern.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20InsightsOpsDashboardIntegrationPattern.pptx"
doc_id: 641
doc_kind: "Design Spike"
surface: "Other"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2022-08-21T23:35:55Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["event data", "insights", "ops dashboard", "dynamic segmentation", "visualization", "migration"]
tools: ["Overlay Events"]
products: []
issues: []
related: [{"doc":47,"file":"length-data-product-support-features-enhancement__doc47.md","s":1.238},{"doc":294,"file":"update-address-range-via-address-points-in-overlay-events-and-query-attribute__doc294.md","s":1.172},{"doc":181,"file":"include-site-addresses-layer-in-straight-line-diagram__doc181.md","s":1.167},{"doc":290,"file":"support-overlapping-events-in-query-attribute-set-and-overlay-events-gp-tool__doc290.md","s":1.145},{"doc":344,"file":"update-address-range-information-in-overlay-events-and-query-attribute-sets__doc344.md","s":1.136}]
```
-->

## Summary

Investigates the best pattern to integrate LRS event data, including point, line, and dynamically segmented events, into ArcGIS Insights and Ops Dashboards for visualization. Includes testing visualization methods such as heat maps and mileage summaries, documenting migration processes, and demonstrating the workflow to the team.

## Related documents

<!-- related:begin -->
- [Length Data Product Support Features Enhancement](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/length-data-product-support-features-enhancement__doc47.md>) — similar text 0.08 · same folder <!-- rel:47 -->
- [Update Address Range via Address Points in Overlay Events and Query Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-address-range-via-address-points-in-overlay-events-and-query-attribute__doc294.md>) — similar text 0.04 · same folder <!-- rel:294 -->
- [Include Site Addresses Layer in Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/include-site-addresses-layer-in-straight-line-diagram__doc181.md>) — similar text 0.05 · same folder <!-- rel:181 -->
- [Support Overlapping Events in Query Attribute Set and Overlay Events GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-overlapping-events-in-query-attribute-set-and-overlay-events-gp-tool__doc290.md>) — similar text 0.03 · same folder <!-- rel:290 -->
- [Update Address Range Information in Overlay Events and Query Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-address-range-information-in-overlay-events-and-query-attribute-sets__doc344.md>) — similar text 0.03 · same folder <!-- rel:344 -->
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

Investigate the best pattern to get LRS event data into ArcGIS Insights for visualization
Test with point event data, line event data, and dynamically segmented event data (the output of Overlay Events GP tool)
Visualize the data incorporating the measures in some way (i.e., heat maps of clusters of point features based on measured segments, summary of mileage of certain line event attributes)
Also investigate the best pattern for getting these same data types (point, line, dynseg) into Ops Dashboards and visualize them in a similar way as in Insights
Deliverables for this spike will be the following:

  - Document any migration process to get LRS event data into Insights and Ops Dashboards (if any scripts or other tools are used, provide those as well)
  - Demo the process to the team so we can discuss any new tools/capabilities that can be added to the software to streamline this process for our users

## Slide 3 — Assignment

Story Points:
Dev:
