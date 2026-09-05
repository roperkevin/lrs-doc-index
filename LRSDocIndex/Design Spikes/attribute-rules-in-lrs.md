# Spike: Attribute Rules in LRS

| Field | Value |
| --- | --- |
| **Doc** | 814 · Design Spike · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike Attrbitue Rules in LRS.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Attrbitue%20Rules%20in%20LRS.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2020-04-28 23:12 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | attribute rules · calculation rule · validation rule · constraint rule · editing tools · geoprocessing tools · rest endpoints · event editor · updm · roads and highways · domains · subtypes |
| **Tools** | — |

## Summary

Investigation of attribute rules in LRS data including calculation, validation, and constraint rules. Testing their enforcement and error messaging across editing tools in ArcGIS Pro, geoprocessing tools, REST endpoints, and the Event Editor. Includes use of UPDM with Roads and Highways dataset and rules on domains and subtypes.

## Related documents

<!-- related:begin -->
- [Spike: Subtype Group Layers in LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/subtype-group-layers-in-lrs.md>) — similar text 0.43 · same kind/surface/folder <!-- rel:816 s=3.075 -->
- [Support Core Editing Grid for LRS Route Editing Tools: Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4250-support-core-editing-grid-for-lrs-route-editing-tools-v3.md>) — similar text 0.23 · same surface <!-- rel:654 s=2.974 -->
- [Spike: 64-bit OID in LRS Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-editing-tools.md>) — similar text 0.10 · same kind/surface/folder <!-- rel:515 s=2.368 -->
- [Spike: Combined APR-UN Pro Ribbon](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/combined-apr-un-pro-ribbon.md>) — similar text 0.11 · same kind/surface/folder <!-- rel:633 s=2.336 -->
- [LR Feature Classes Inside Feature Dataset Housing LRCD User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/lr-feature-classes-inside-feature-dataset-housing-lrcd.md>) — similar text 0.06 · same surface/folder <!-- rel:870 s=1.742 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)

_No page matched:_ [adm](https://www.google.com/search?q=%22adm%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Attribute Rules in LRS

Spike

## Slide 2 — Attribute Rules in LRS

- Investigate Attribute Rules and how they work when configured on LRS data
  - Test with all three types of rules (calculation, validation, and constraint)
  - Verify that we will honor these rules/give good and descriptive error messages when one of them is violated in the following places:
    - Editing tools in Pro
    - GP tools where data is created/updated/deleted
    - REST endpoints where data is created/updated/deleted
    - Event Editor
  - Utilize UPDM (pipeline testing) and add rules to an existing Roads and Highways dataset
  - Make sure to test with rules configured on domains/subtypes
- Log any issues found in the correct repo (Pro, WebGIS) as bugs so they can be addressed

## Slide 3 — Assignment

Story Points:
Dev:
