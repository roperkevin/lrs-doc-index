# Reorganize Location Referencing Pro Options Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#5826](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5826) |
| **Source** | [5826-ReorganizeLROptions_TestPlanV2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/5826-ReorganizeLROptions_TestPlanV2.pptx>) |
| **Edited** | 2024-08-05 16:20 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Reorganize Location Referencing Pro Options Test Plan"
source_file: "5826-ReorganizeLROptions_TestPlanV2.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/5826-ReorganizeLROptions_TestPlanV2.pptx"
doc_id: 341
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: "V2"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2024-08-05T16:20:04Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["location referencing", "pro options", "route editing", "event editing", "configuration", "conflict prevention", "documentation"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#5826"]
related: [{"doc":340,"file":"reorganize-location-referencing-pro-options-test-plan__doc340.md","s":1008.96},{"doc":371,"file":"reorganize-location-referencing-pro-options__doc371.md","s":3.496},{"doc":199,"file":"set-location-referencing-options__doc199.md","s":3.487},{"doc":315,"file":"set-location-referencing-options__doc315.md","s":3.434},{"doc":308,"file":"set-location-referencing-options__doc308.md","s":3.387}]
```
-->

## Summary

Test plan for reorganizing the Location Referencing tab in ArcGIS Pro options to improve usability. Covers positive UI tests, configuration and conflict prevention, route editing, event editing, and documentation preferences. Ensures options persist across sessions and function correctly in light and dark modes.

## Related documents

<!-- related:begin -->
- [Reorganize Location Referencing Pro Options Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/reorganize-location-referencing-pro-options-test-plan__doc340.md>) — shared issue ArcGISPro/ps-location-referencing#5826 · similar text 0.98 · 3 title words · 2 filename words · same kind/surface <!-- rel:340 -->
- [Reorganize Location Referencing Pro options](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/reorganize-location-referencing-pro-options__doc371.md>) — similar text 0.12 · 3 title words · 1 filename word · same surface <!-- rel:371 -->
- [Set Location Referencing options](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/set-location-referencing-options__doc199.md>) — similar text 0.35 · 1 title word · 1 filename word · same surface <!-- rel:199 -->
- [Set Location Referencing options](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/set-location-referencing-options__doc315.md>) — similar text 0.39 · 1 title word · 1 filename word · same surface <!-- rel:315 -->
- [Set Location Referencing options](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/set-location-referencing-options__doc308.md>) — similar text 0.40 · 1 title word · 1 filename word · same surface <!-- rel:308 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-location-referencing-options.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html)
<!-- docs:end -->

---

## Slide 1

Reorganize Location Referencing Pro Options

| Notes |
| --- |
| Reorganize Location Referencing tab of the Pro options for ease of use Test in light and dark mode Ensure opening and closing a project maintains chosen options 508/i18n Mix and match option choices |

Devtopia Issue

![image1.png](../media/doc628_image1.png)

## Slide 2

| Positive Tests: UI |
| --- |
| Click on accordion will expand or minimize sections of the options Checkboxes can be checked or unchecked Clicking on folder icon opens file explorer Options are saved and maintained when closing and reopening Pro Accordions will be expanded by default |

| Positive Tests: Configuration and Conflict Prevention |
| --- |
| Checking “Set layers in maps to the current date and time when project is opened” refreshes time to be the current date and time when opening maps in a project for the first time Unchecking “Set layers in maps to the current date and time when project is opened” maintains the existing time settings when reopening maps in a project for the first time Checking “Automatically reconcile prior to obtaining locks” automatically reconciles when obtaining locks Unchecking “Automatically reconcile prior to obtaining locks” does not automatically reconcile when obtaining locks Ensure the chosen scale for “Display measure along route during cursor movement up to this scale” is displayed at the different scales |

| Positive Tests: Route Editing |
| --- |
| Checking “Keep centerlines chosen and selected” keeps chosen centerlines selected after a route edits requires a centerline selection (Create, Extend, or Realign Route) Unchecking “Keep centerlines chosen and selected” unselects chosen centerlines after a route edit that requires centerline selection (Create, Extend, or Realign Route) Checking “Warn before allowing route edits that can create physical gaps” warns when a physical gap occurs during route edits that cause physical gaps in a route Unchecking “Warn before allowing route edits that can create physical gaps” does not warn when a physical gap occurs during route edits that cause physical gaps in a route |

| Positive Tests: Event Editing |
| --- |
| Checking “Don’t allow override of event placement on dominant routes” doesn’t allow for the override of event placement on dominant routes Unchecking “Don’t allow override of event placement on dominant routes” allows for the override of event placement on dominant routes Checking “Merge coincident events in the Dynamic Segmentation table” merges attribute-exact and overlapping measure events Unchecking “Merge coincident events in the Dynamic Segmentation table” doesn’t merge attribute-exact and overlapping measure events Choosing a different “Attribute Set Folder Location” changes the Attribute Set folder Choosing a different “Replace Events Folder Location” changes the Replace Events folder |

## Slide 3

| Positive Tests: Documentation |
| --- |
| Choosing “Pipeline Referencing” as the preferred documentation solution opens APR help pages when opening help documentation from Pro Choosing “Roads and Highways” as the preferred documentation solution opens RH help pages when opening help documentation in Pro |
