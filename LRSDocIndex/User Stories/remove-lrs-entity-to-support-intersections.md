# Remove LRS Entity To Support Intersections

| Field | Value |
| --- | --- |
| **Doc** | 877 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Remove LRS Entity To Support Intersections.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Remove%20LRS%20Entity%20To%20Support%20Intersections.pptx>) |
| **People** | author Rahul Rakshit · PE — · dev — |
| **Edited** | 2019-10-22 16:22 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | lrs intersection · de-register · geoprocessing tool · lrs metadata |
| **Tools** | Remove LRS Entity |

## Summary

User story to add the ability to de-register an LRS intersection from the LRS using the remove LRS entity geoprocessing tool. The tool should work with Python and Model Builder and update the LRS_Metadata table without deleting the feature class. Documentation updates and test plan creation are planned.

## Related documents

<!-- related:begin -->
- [Support Modifying and Deleting Lookup Table in an LRS Network](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-modifying-and-deleting-lookup-table-in-an-lrs.md>) — similar text 0.13 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:610 s=3.174 -->
- [Create LRS Intersection From Existing Feature Class Geoprocessing Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-lrs-intersection-from-existing-feature-class-gp.md>) — similar text 0.16 · 1 filename word · same kind/surface/folder <!-- rel:881 s=2.837 -->
- [Create External Event with No Connection File](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-external-event-with-no-connection-file.md>) — similar text 0.19 · same kind/surface/folder <!-- rel:288 s=2.771 -->
- [Configure External Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/configure-external-events.md>) — similar text 0.07 · same surface/folder <!-- rel:811 s=1.776 -->
- [Support External Event Configuration Without Connection File – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6159-support-external-event-configuration-without-connection-file.md>) — similar text 0.11 · 1 title word · same surface <!-- rel:275 s=1.752 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-lrs-intersection-properties.html)

_No page matched:_ [Remove LRS Entity](https://www.google.com/search?q=%22Remove%20LRS%20Entity%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Remove LRS Entity To Support Intersections

As an lrs maintainer, I’d like to have the ability to de-register an lrs intersection from the lrs using the remove lrs entity geoprocessing tool

## Slide 2 — User Story

Add the ability to de-register an LRS intersection from the LRS using the remove LRS entity geoprocessing tool
Should work with PY
Should work with Model Builder
Do not delete the FC, just update the LRS_Metadata table

## Slide 3

Documentation
Update the existing doc for the GP tool

## Slide 4

Estimates
Points:
Test Plan to be created by:
