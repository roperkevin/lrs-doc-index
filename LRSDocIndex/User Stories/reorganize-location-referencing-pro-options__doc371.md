# Reorganize Location Referencing Pro options

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [ReorganizeLocationReferencingProOptions.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ReorganizeLocationReferencingProOptions.pptx>) |
| **Edited** | 2024-05-16 17:43 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Reorganize Location Referencing Pro options"
source_file: "ReorganizeLocationReferencingProOptions.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ReorganizeLocationReferencingProOptions.pptx"
doc_id: 371
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2024-05-16T17:43:17Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["location referencing pro options", "route editing", "event editing", "configuration", "conflict prevention", "accordion structure"]
tools: []
products: []
issues: []
related: [{"doc":369,"file":"advanced-table-editing-options-in-arcgis-pro__doc369.md","s":4.325},{"doc":341,"file":"reorganize-location-referencing-pro-options-test-plan__doc341.md","s":3.496},{"doc":340,"file":"reorganize-location-referencing-pro-options-test-plan__doc340.md","s":3.496},{"doc":714,"file":"hide-lock-transfer-in-event-editor-for-pro-services__doc714.md","s":2.994},{"doc":361,"file":"experience-builder-dynamic-segmentation-widget-additional-options__doc361.md","s":2.595}]
```
-->

## Summary

This user story describes the need to reorganize the Location Referencing tab in ArcGIS Pro options to improve usability for LRS and event editors. It specifies using an accordion structure with sections for Configuration and Conflict Prevention, Route Editing, Event Editing, and Documentation. The goal is to enhance efficiency by allowing configuration of default options and handling exceptions.

## Related documents

<!-- related:begin -->
- [Advanced Table Editing Options in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/advanced-table-editing-options-in-arcgis-pro__doc369.md>) — similar text 0.21 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:369 -->
- [Reorganize Location Referencing Pro Options Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/reorganize-location-referencing-pro-options-test-plan__doc341.md>) — similar text 0.12 · 3 title words · 1 filename word · same surface <!-- rel:341 -->
- [Reorganize Location Referencing Pro Options Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/reorganize-location-referencing-pro-options-test-plan__doc340.md>) — similar text 0.12 · 3 title words · 1 filename word · same surface <!-- rel:340 -->
- [Hide Lock Transfer in Event Editor for Pro Services](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/hide-lock-transfer-in-event-editor-for-pro-services__doc714.md>) — similar text 0.07 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:714 -->
- [Experience Builder Dynamic Segmentation Widget Additional Options](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-additional-options__doc361.md>) — similar text 0.19 · 1 title word · 1 filename word · same kind/folder <!-- rel:361 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html)
<!-- docs:end -->

---

## Slide 1 — Reorganize Location Referencing Pro options

User Story
ArcGIS Pro

## Slide 2 — User Story

As a LRS editor and event editor, I need to have a convenient way to select and maintain advanced LRS options for route and event editing tools, so that I can improve the efficiency of my work by configuring default options while still maintaining flexibility for exception type edits.
Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawings, FGDBs, etc.).
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.).
Both editor types will need to access and utilize the Location Referencing Pro options tab to configure defaults and setup how to handle exceptions.  The number of options continues to grow, so organizing it will make it easier for users to utilize it to meet their needs.

## Slide 3 — Requirements

Reorganize the Location Referencing tab of the Pro options
Utilize an accordion structure with the following sections: Configuration and Conflict Prevention, Route Editing, Event Editing, and Documentation
Other tabs utilize this approach, use them as a guide if needed

![image1.png](../media/doc598_image1.png)

## Slide 4 — Testing

Verify that each option continues to work as expected

## Slide 5 — Automation

No automation for this story

## Slide 6 — Documentation

Update the Set Location Referencing options topic with an updated screenshot and reorganize the topic into sections that align with the accordion design

## Slide 7 — Story Points

Story Points:
Dev:
PE:
