# Auto-Populate Referents for Merge, Split, DynSeg, and Table Widgets

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Source** | [ExB.-.AutopopulateReferentsMergeSplitDynSegTable.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB.-.AutopopulateReferentsMergeSplitDynSegTable.pptx>) |
| **Edited** | 2026-09-04 07:49 by Kevin Roper |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Auto-Populate Referents for Merge, Split, DynSeg, and Table Widgets"
source_file: "ExB.-.AutopopulateReferentsMergeSplitDynSegTable.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB.-.AutopopulateReferentsMergeSplitDynSegTable.pptx"
doc_id: 910
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Kevin Roper"
last_edited: "2026-09-04T07:49:05Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["referent", "event editing", "merge", "split", "dynamic segmentation", "attribute table", "experience builder"]
tools: ["Merge", "Split", "Dynamic Segmentation", "Table"]
products: []
issues: []
related: [{"doc":1,"file":"auto-populate-referents-for-event-edits__doc1.md","s":7.281},{"doc":604,"file":"merge-coincident-option-in-dynseg-tool-in-pro__doc604.md","s":4.237},{"doc":631,"file":"populate-route-and-measure-referents-when-adding-updating-lrs-events__doc631.md","s":3.332},{"doc":25,"file":"dynamic-segmentation-sld-expression-display-support__doc25.md","s":3.132},{"doc":13,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md","s":3.113}]
```
-->

## Summary

Describes the user story for automatically populating referent fields when events are added or updated in merge, split, dynamic segmentation, and table widgets. Defines acceptance criteria for referent updates based on event edits and measure changes. Includes testing, automation, and documentation plans.

## Related documents

<!-- related:begin -->
- [Auto-Populate Referents for Event Edits](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-populate-referents-for-event-edits__doc1.md>) — similar text 0.77 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:1 -->
- [Merge coincident option in DynSeg tool in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/merge-coincident-option-in-dynseg-tool-in-pro__doc604.md>) — similar text 0.16 · 2 title words · 3 filename words · same kind/folder <!-- rel:604 -->
- [Populate Route and Measure Referents When Adding/Updating LRS Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/populate-route-and-measure-referents-when-adding-updating-lrs-events__doc631.md>) — similar text 0.24 · 2 title words · 1 filename word · same kind/folder <!-- rel:631 -->
- [Dynamic Segmentation SLD - Expression Display Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynamic-segmentation-sld-expression-display-support__doc25.md>) — similar text 0.19 · same kind/surface/folder <!-- rel:25 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md>) — similar text 0.16 · same kind/surface/folder <!-- rel:13 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html) · [Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html) · [Release locks through the LRS Locks table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/lrs-locks-table.html) · [Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)
<!-- docs:end -->

---

## Slide 1 — ExB : Auto-Populate Referents for Merge, Split, DynSeg , and Table widgets

## Slide 2 — User Story, Personas, Workflow

As an Event Editor, I need referent fields to automatically populate when events are added or updated, so that referent information stays consistent with route and measure inputs without manual effort.
Persona: Event Editor – Maintains LRS event data using Pro and Experience Builder tools and relies on consistent location referencing.
Workflow: Add/Update Point/Line events-> system captures referent and route/measures -> populate referents for events with those fields configured

## Slide 3 — Acceptance Criteria & Requirements ( 1 )

Applies only when referents are configured
Split Events: Use route and measure for new referents below

  - Upstream event: Update To Referent, Keep From Referent
  - Downstream event: Update From Referent, Keep To Referent
Merge Events: preserve referents

  - From Referent from upstream event, To Referent from downstream event

## Slide 4 — Acceptance Criteria & Requirements ( 2 )

Dynamic Segmentation & Attribute Table

  - If routeID or measures updated -> update referents
  - Only update impacted referent(s) when partial measure edits occur
  - If no measure change -> do NOT update referents
  - Attribute-only or date edits preserve referents
  - Note that you can’t edit routes/measures in DynSeg so referents shouldn’t update for those edits

## Slide 5 — Testing

Test adding and updating events in all 4 widgets
Validate referent updates for full and partial measure edits
Validate only impacted referents update
Validate no updates for attribute/date edits
Should match the Pro tools actions

## Slide 6 — Automation

Update automation for all 4 tools to incorporate the referent cases

## Slide 7 — Documentation

Document automatic referent population in Split and Merge widgets
Document split and merge rules for each scenario

## Slide 8 — Estimation & Assignment

Story Points: 5
Dev Effort: 3 Days
PE Effort: 3 Days
