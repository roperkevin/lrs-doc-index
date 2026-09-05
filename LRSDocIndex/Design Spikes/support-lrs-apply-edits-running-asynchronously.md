# Spike: Support LRS Apply Edits Running Asynchronously

| Field | Value |
| --- | --- |
| **Doc** | 471 · Design Spike · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike AsyncLRSApplyEdits.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20AsyncLRSApplyEdits.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2023-11-01 00:21 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | apply edits · rest operation · asynchronous processing · timeout issues · feature service · arcgis pro |
| **Tools** | — |

## Summary

This spike investigates the feasibility and effort required to support the LRS Apply Edits REST operation running asynchronously. It explores necessary changes in REST and ArcGIS Pro, potential limitations, and whether this approach resolves timeout issues in Pro and geoprocessing tools. The feature service team's prior work on core Apply Edits is referenced for implementation patterns.

## Related documents

<!-- related:begin -->
- [Spike: Advanced Table Editing options in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/advanced-table-editing-options-in-pro.md>) — similar text 0.20 · same kind/surface/folder <!-- rel:492 s=2.276 -->
- [Relocate Events in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/relocate-events-in-pro.md>) — similar text 0.09 · same kind/surface/folder <!-- rel:812 s=2.129 -->
- [Spike: Location Referencing support in Linux](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/lr-support-in-linux.md>) — similar text 0.15 · 1 title word · same kind/folder <!-- rel:519 s=1.864 -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/arcgis-apr-an-introduction-rh-apr-un.md>) — similar text 0.03 · same surface/folder <!-- rel:885 s=1.794 -->
- [Spike: 64-bit OID in LRS REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-rest.md>) — similar text 0.18 · same kind/folder <!-- rel:520 s=1.542 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/edit-feature-services.html)

_No page matched:_ [apply edits](https://www.google.com/search?q=%22apply%20edits%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Support LRS apply edits running asynchronously

Spike

## Slide 2 — Async LRS Apply Edits

- Investigate the feasibility and effort involved to support the LRS Apply Edits REST operation running asynchronously
- What effort would be required to make this change?
- Where do we need to make this change in REST? in Pro?
- Are there any limitations we should be aware of?
- Will this fix the timeout issues we’ve been encountering in Pro and GP tools that leverage this endpoint?
- The feature service team has already done the work to support this in core Apply Edits; reach out to them to understand the patterns and effort involved with these potential changes
- Deliverable is a short write up that discusses the answers to the questions above with all the areas we’d need to address to implement this

## Slide 3 — Assignment

Story Points:
Dev:
