# Auto-Populate Referents for Event Edits

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Source** | [ExB - AutopopulateReferents.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20AutopopulateReferents.pptx>) |
| **Edited** | 2026-06-01 20:41 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Auto-Populate Referents for Event Edits"
source_file: "ExB - AutopopulateReferents.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20AutopopulateReferents.pptx"
doc_id: 1
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2026-06-01T20:41:31Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["referent", "event editing", "dynamic segmentation", "split events", "merge events", "measure edits"]
tools: []
products: []
issues: []
related: [{"doc":910,"file":"auto-populate-referents-for-merge-split-dynseg-and-table-widgets__doc910.md","s":7.526},{"doc":12,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc12.md","s":3.189},{"doc":631,"file":"populate-route-and-measure-referents-when-adding-updating-lrs-events__doc631.md","s":3.168},{"doc":25,"file":"dynamic-segmentation-sld-expression-display-support__doc25.md","s":3.168},{"doc":13,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md","s":3.129}]
```
-->

## Summary

Describes a user story for automatically populating referent fields during event edits in LRS workflows. Covers acceptance criteria for add, split, merge, and dynamic segmentation event workflows, ensuring referent consistency with route and measure inputs. Includes testing, automation, and documentation plans for the feature.

## Related documents

<!-- related:begin -->
- [Auto-Populate Referents for Merge, Split, DynSeg, and Table Widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/auto-populate-referents-for-merge-split-dynseg-and-table-widgets__doc910.md>) — similar text 0.77 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:910 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc12.md>) — similar text 0.23 · same kind/surface/folder <!-- rel:12 -->
- [Populate Route and Measure Referents When Adding/Updating LRS Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/populate-route-and-measure-referents-when-adding-updating-lrs-events__doc631.md>) — similar text 0.21 · 2 title words · 1 filename word · same kind/folder <!-- rel:631 -->
- [Dynamic Segmentation SLD - Expression Display Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynamic-segmentation-sld-expression-display-support__doc25.md>) — similar text 0.22 · same kind/surface/folder <!-- rel:25 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md>) — similar text 0.21 · same kind/surface/folder <!-- rel:13 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Auto-Populate Referents for Event Edits

## Slide 2 — User Story, Personas, Workflow

As an Event Editor, I need referent fields to automatically populate when events are added or updated, so that referent information stays consistent with route and measure inputs without manual effort.
Persona: Event Editor – Maintains LRS event data using Pro and Experience Builder tools and relies on consistent location referencing.
Workflow: Add/Update/Split/Merge/Dynamic Seg/Attribute edit -> system evaluates route/measures -> if impacted update referents using configured settings, else preserve

## Slide 3 — Acceptance Criteria & Requirements (1)

Applies only when referents are configured
Automatically executes for all point and line event add/edit workflows
Add Point/Line:

  - Honor all input methods
  - Populate referents using existing referent configuration and inputs

## Slide 4 — Acceptance Criteria & Requirements (2)

Split Events: Use route and measure for new referents below

  - Upstream event: Update To Referent
  - Downstream event: Update From Referent
Merge Events: preserve referents

  - From Referent from upstream, To Referent from downstream

## Slide 5 — Acceptance Criteria & Requirements (3)

Dynamic Segmentation & Attribute Table

  - If routeID or measures updated -> update referents
  - Only update impacted referent(s) when partial measure edits occur
  - If no measure change -> do NOT update referents
  - Attribute-only or date edits preserve referents

## Slide 6 — Testing

Test Add Point/Line with all input methods
Validate referent updates for full and partial measure edits
Validate only impacted referents update
Validate no updates for attribute/date edits
Test Split, Merge, Dynamic Seg workflows

## Slide 7 — Automation

Automate all edit pathways (Add, Update, Split, Merge, Dynamic Seg, Table)
Validate impacted referent update logic
Regression coverage for non-measure edits

## Slide 8 — Documentation

Document automatic referent population
Clarify partial measure update behavior
Document split and merge rules
Update event editing documentation

## Slide 9 — Estimation & Assignment

Story Points:
Dev Effort:  Days
PE Effort:  Days
