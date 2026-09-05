# Spike: Combined APR-UN Pro Ribbon

| Field | Value |
| --- | --- |
| **Doc** | 633 · Design Spike · Pro |
| **Product** | Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [SpikeCombined APR-UN ribbon.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SpikeCombined%20APR-UN%20ribbon.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2022-09-21 02:37 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | custom ribbon · pipeline referencing · utility network · editing tools · arcgis pro |
| **Tools** | — |

## Summary

Investigation of options for creating a custom ArcGIS Pro ribbon that combines Pipeline Referencing, Utility Network, and Editing ribbon tools. The goal is to determine how to build, release, and maintain this ribbon without permanent integration into Pro. Potential release methods include Solutions templates in UPDM or user-importable custom ribbons.

## Related documents

<!-- related:begin -->
- [Combined APR-UN Ribbon User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/4958-combined-apr-un-ribbon.md>) — similar text 0.20 · 3 title words · 2 filename words · same surface/folder <!-- rel:606 s=4.961 -->
- [Create combined APR-UN Pro ribbon add-in – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4958-create-combined-apr-un-pro-ribbon-add.md>) — similar text 0.14 · 4 title words · 1 filename word · same surface <!-- rel:596 s=3.749 -->
- [Spike: Advanced Table Editing options in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/advanced-table-editing-options-in-pro.md>) — similar text 0.21 · 1 title word · same kind/surface/folder <!-- rel:492 s=2.712 -->
- [Set Time Filter Button LR Pro Ribbon: Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4138-set-time-filter-button-lr-pro-ribbon.md>) — similar text 0.07 · 2 title words · same surface <!-- rel:656 s=2.506 -->
- [Spike: Subtype Group Layers in LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/subtype-group-layers-in-lrs.md>) — similar text 0.13 · same kind/surface/folder <!-- rel:816 s=2.36 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)
<!-- docs:end -->

---

## Slide 1 — Spike: Combined APR-UN Pro ribbon

Spike

## Slide 2 — Combined APR-UN Pro ribbon

- Investigate options for creating a custom Pro ribbon that incorporates Pipeline Referencing ribbon tools, Utility Network ribbon tools, and Editing ribbon tools
- We don’t want to integrate this permanently into Pro like we do with product/capability ribbons, we want to determine how we can create a custom ribbon and release it through other means
- Potential release options to investigate include:
  - Creating a ribbon that can be released via the Solutions templates in UPDM
  - Our team creating a customized ribbon that users can import into Pro when installed on a machine
  - Other options?
- You may want to contact Jason Schroeder on the Solutions team as well as members of the Pro team to discuss potential options

Deliverable from this spike is to present to the team the best option for how to support this combined ribbon (how should we build it, release it, and maintain it)

## Slide 3 — Assignment

Story Points:
Dev:
