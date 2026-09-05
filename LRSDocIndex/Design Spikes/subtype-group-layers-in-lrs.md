# Spike: Subtype Group Layers in LRS

| Field | Value |
| --- | --- |
| **Doc** | 816 · Design Spike · Pro |
| **Product** | Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike Subtype Layers in LRS.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Subtype%20Layers%20in%20LRS.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2020-04-28 23:29 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | subtype group layers · lrs editing · updm geodatabase · pipeline line · pipeline device · pipeline junction · rest endpoints · event editor |
| **Tools** | — |

## Summary

Investigation of subtype group layers and their interaction with LRS editing operations and tools. Includes deployment within a UPDM geodatabase, publishing services with subtype group layers, and verification of LRS tools functionality across editing tools in ArcGIS Pro, geoprocessing tools, REST endpoints, and the Event Editor using web maps. Issues are to be logged for resolution.

## Related documents

<!-- related:begin -->
- [Spike: Attribute Rules in LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/attribute-rules-in-lrs.md>) — similar text 0.43 · same kind/surface/folder <!-- rel:814 s=3.075 -->
- [Spike: Combined APR-UN Pro Ribbon](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/combined-apr-un-pro-ribbon.md>) — similar text 0.13 · same kind/surface/folder <!-- rel:633 s=2.36 -->
- [Configure Utility Network Feature Class (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configure-un-feature-class-lr.md>) — similar text 0.10 · same surface <!-- rel:84 s=1.555 -->
- [View Utility Network Feature Class Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/7300-view-un-feature-class-properties.md>) — similar text 0.12 · same surface <!-- rel:67 s=1.394 -->
- [Manage Pipeline Referencing and a Utility Network Together](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/manage-apr-and-a-un-together.md>) — similar text 0.15 · same surface <!-- rel:74 s=1.337 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)
<!-- docs:end -->

---

## Slide 1 — Spike: Subtype Group Layers in LRS

Spike

## Slide 2 — Subtype Group Layers in LRS

- Investigate Subtype Group layers and how they work with LRS editing operations/tools
  - Utilize a combined APR/UN deployment within a UPDM geodatabase
  - Publish a service with subtype group layers (make sure to include Pipeline Line and Pipeline Device/Junction feature classes since they’re LRS centerline and LRS events)
  - Verify that LRS tools in the following areas work correctly on subtype group layers from the service:
    - Editing tools in Pro
    - GP tools where data is created/updated/deleted with a service layer as an input
    - REST endpoints where data is created/updated/deleted with a service layer as an input
    - Event Editor that utilizes a web map coming from a service with subtype group layers
- Log any issues found in the correct repo (Pro, WebGIS) as bugs so they can be addressed

## Slide 3 — Assignment

Story Points:
Dev:
