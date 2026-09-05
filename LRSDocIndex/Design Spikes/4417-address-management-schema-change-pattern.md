# Spike: Address Management Schema Change Pattern

| Field | Value |
| --- | --- |
| **Doc** | 643 · Design Spike · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#4417](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4417) |
| **Source** | [Spike Address Management Integration Schema Change Pattern.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Address%20Management%20Integration%20Schema%20Change%20Pattern.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2022-08-16 23:15 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | address management · schema change · centerlineid · guid · attribute rule · roads and highways |
| **Tools** | — |

## Summary

This spike document outlines the necessary schema changes to integrate the Address Management Solution with Roads and Highways software. It details steps such as removing an attribute rule and changing the CenterlineID field to a GUID type, including related tables. The deliverable includes documenting these steps and potentially creating an automation script.

## Related documents

<!-- related:begin -->
- [Create LRS with Address Data Management solution present](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-lrs-with-address-data-management-solution-present.md>) — similar text 0.30 · 2 title words · same surface/folder <!-- rel:296 s=2.715 -->
- [Manage Address and Roadway Characteristic Data Together with Roads and Highways and Address Data Management Solution](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/5783-manage-address-and-roadway-characteristic-data-together.md>) — similar text 0.22 · 2 title words · same surface <!-- rel:276 s=2.292 -->
- [Spike: Attribute Rules in LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/attribute-rules-in-lrs.md>) — similar text 0.09 · same kind/surface/folder <!-- rel:814 s=2.107 -->
- [Append Routes with existing Utility Network centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-with-existing-un-centerlines.md>) — similar text 0.11 · same surface/folder <!-- rel:741 s=1.958 -->
- [Manage address and roadway characteristic data together](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/manage-address-and-roadway-characteristic-data-together.md>) — similar text 0.18 · 1 title word · 1 filename word · same surface <!-- rel:96 s=1.952 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Manage address and roadway characteristic data together](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/manage-address-and-roadway-characteristic-data-together.html) · [Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)

_No page matched:_ [adm](https://www.google.com/search?q=%22adm%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Address Management Schema Change Pattern

Spike

## Slide 2 — ADM solution schema change

- Based on the results of the Spike completed by Dan, we can integrate with the Address Management Solution if we make some changes to their schema
- Download the Address Data Management solution https://doc.arcgis.com/en/arcgis-solutions/latest/reference/introduction-to-address-data-management.htm
- Investigate and document the steps to change their schema for the CenterlineID field so that it works with our software.  Steps that have already been identified include:
  - Remove the attribute rule that calculates the CenterlineID
  - Change the CenterlineID field to be a GUID field type
  - Change the CenterlineID field to a GUID field type in any related tables (the Master Road Names table is one for sure)
- Deliverables for this spike are to outline what steps are necessary to make these changes so the solution works with Roads and Highways.  If possible, create a script that can automate these steps for the user.
- See https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4417 for the results of the spike with additional information

## Slide 3 — Assignment

Story Points:
Dev:
