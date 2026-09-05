# Linear Referencing GP Toolbox Consolidation

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [ArcGIS_Pro_Linear_Referencing_GP_Toolbox_Consolidation.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ArcGIS_Pro_Linear_Referencing_GP_Toolbox_Consolidation.pptx>) |
| **Edited** | 2026-04-28 01:34 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Linear Referencing GP Toolbox Consolidation"
source_file: "ArcGIS_Pro_Linear_Referencing_GP_Toolbox_Consolidation.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ArcGIS_Pro_Linear_Referencing_GP_Toolbox_Consolidation.pptx"
doc_id: 43
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2026-04-28T01:34:02Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["linear referencing", "location referencing", "geoprocessing toolbox", "toolbox consolidation", "map toolset", "extension toolset", "automation", "testing", "documentation"]
tools: []
products: []
issues: []
related: [{"doc":44,"file":"arcgis-linear-referencing-product-renaming__doc44.md","s":6.186},{"doc":6,"file":"linear-referencing-arcgis-server-toolbox-rename__doc6.md","s":5.866},{"doc":42,"file":"linear-referencing-ribbon-unified-experience__doc42.md","s":5.577},{"doc":606,"file":"combined-apr-un-ribbon-user-story__doc606.md","s":2.821},{"doc":688,"file":"add-single-point-event-tool-in-arcgis-pro__doc688.md","s":2.427}]
```
-->

## Summary

This document describes the consolidation of the Linear Referencing and Location Referencing geoprocessing toolboxes into a single Linear Referencing toolbox in ArcGIS Pro. It outlines the personas involved, workflow, acceptance criteria, testing approach, automation updates, and documentation changes. The goal is to maintain backward compatibility and ensure all tools remain functionally unchanged while improving discoverability.

## Related documents

<!-- related:begin -->
- [ArcGIS Linear Referencing Product Renaming](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/arcgis-linear-referencing-product-renaming__doc44.md>) — similar text 0.25 · 1 title word · 3 filename words · same kind/surface/folder <!-- rel:44 -->
- [Linear Referencing ArcGIS Server Toolbox Rename](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/linear-referencing-arcgis-server-toolbox-rename__doc6.md>) — similar text 0.28 · 2 title words · 3 filename words · same kind/folder <!-- rel:6 -->
- [Linear Referencing Ribbon – Unified Experience](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/linear-referencing-ribbon-unified-experience__doc42.md>) — similar text 0.36 · 1 title word · 4 filename words · same kind/surface/folder <!-- rel:42 -->
- [Combined APR-UN Ribbon User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/combined-apr-un-ribbon-user-story__doc606.md>) — similar text 0.05 · same kind/surface/folder <!-- rel:606 -->
- [Add Single Point Event tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-single-point-event-tool-in-arcgis-pro__doc688.md>) — similar text 0.06 · same kind/surface/folder <!-- rel:688 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Multiple linear referencing methods](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/multiple-linear-referencing-methods.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)

_No page matched:_ [linear referencing toolbox](https://www.google.com/search?q=%22linear%20referencing%20toolbox%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Linear Referencing GP Toolbox Consolidation

As a linear referencing analyst and ArcGIS Pro user, I need the Linear Referencing and Location Referencing geoprocessing toolboxes combined into a single toolbox called Linear Referencing so that all linear referencing GP workflows are discoverable in one consistent location.
Personas: LRS Analyst / Editor; Transportation & Pipeline Analyst; Automation / Python User; ArcGIS Pro Engineer
Workflow: Open Linear Referencing toolbox → Use Map toolset for core tools → Use Extension toolset for extension‑level tools → Existing scripts and models continue to run

## Slide 2 — Acceptance Criteria & Requirements

Single Linear Referencing GP toolbox replaces existing Linear Referencing and Location Referencing toolboxes
Tools from the original Linear Referencing toolbox are grouped under a Map toolset
Tools from the original Location Referencing toolbox are grouped under an Extension toolset
All tools remain functionally unchanged
Backward compatibility preserved for existing scripts, models, and tool references

## Slide 3 — Testing

Minimal manual validation of toolbox structure and tool grouping
Run representative tools from Map and Extension toolsets
Programmatic validation of Python scripts and ModelBuilder workflows
Existing automated GP tests pass with no regressions once paths are updated to new toolbox location
Verify scripts from previous versions still execute as expected

## Slide 4 — Automation

Existing automation validates tool execution and discoverability
Automation updated only as needed for toolbox path or alias changes
No new automation required beyond maintaining existing coverage

## Slide 5 — Documentation

Update existing format of impacted GP tool topics to mention their new location within the GP toolbox
Internal developer documentation updated as needed

## Slide 6 — Estimation

Estimation –
Dev Effort –
PE Effort –
