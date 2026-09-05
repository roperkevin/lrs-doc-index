# Linear Referencing Ribbon – Unified Experience

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [ArcGIS_Pro_Linear_Referencing_Unified Ribbon.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ArcGIS_Pro_Linear_Referencing_Unified%20Ribbon.pptx>) |
| **Edited** | 2026-04-28 01:29 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Linear Referencing Ribbon – Unified Experience"
source_file: "ArcGIS_Pro_Linear_Referencing_Unified Ribbon.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ArcGIS_Pro_Linear_Referencing_Unified%20Ribbon.pptx"
doc_id: 42
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2026-04-28T01:29:53Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["linear referencing ribbon", "context sensitive ribbon", "m enabled features", "core tools", "extension tools", "lrs controller dataset"]
tools: []
products: []
issues: []
related: [{"doc":43,"file":"linear-referencing-gp-toolbox-consolidation__doc43.md","s":5.577},{"doc":44,"file":"arcgis-linear-referencing-product-renaming__doc44.md","s":4.883},{"doc":7,"file":"linear-referencing-attribution-in-linear-feature-extraction__doc7.md","s":3.471},{"doc":14,"file":"linear-referencing-attribution-in-feature-extraction__doc14.md","s":3.459},{"doc":833,"file":"add-lrs-container-to-catalog-window__doc833.md","s":2.894}]
```
-->

## Summary

Combines the Linear Referencing and Location Referencing ribbons into a single context-sensitive Linear Referencing ribbon in ArcGIS Pro. The ribbon appears only when M-enabled feature layers are present and enables core and extension tools based on layer presence. Includes acceptance criteria, testing, automation, and documentation considerations for this unified ribbon experience.

## Related documents

<!-- related:begin -->
- [Linear Referencing GP Toolbox Consolidation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/linear-referencing-gp-toolbox-consolidation__doc43.md>) — similar text 0.36 · 1 title word · 4 filename words · same kind/surface/folder <!-- rel:43 -->
- [ArcGIS Linear Referencing Product Renaming](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/arcgis-linear-referencing-product-renaming__doc44.md>) — similar text 0.23 · 1 title word · 3 filename words · same kind/surface/folder <!-- rel:44 -->
- [Linear Referencing Attribution in Linear Feature Extraction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/linear-referencing-attribution-in-linear-feature-extraction__doc7.md>) — similar text 0.15 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:7 -->
- [Linear Referencing attribution in Feature Extraction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/linear-referencing-attribution-in-feature-extraction__doc14.md>) — similar text 0.15 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:14 -->
- [Add LRS Container to Catalog Window](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-lrs-container-to-catalog-window__doc833.md>) — similar text 0.07 · same kind/surface/folder <!-- rel:833 -->
<!-- related:end -->

---

## Slide 1 — Linear Referencing Ribbon – Unified Experience

As a linear referencing analyst and ArcGIS Pro user, I need the Linear Referencing and Location Referencing ribbons combined into a single context-sensitive ribbon called Linear Referencing so that all linear referencing workflows are discoverable in one place.
Personas: LRS Analyst / Editor; Transportation & Pipeline Editor; ArcGIS Pro Power User; ArcGIS Pro Engineer
Workflow: Add layers → Detect M-enabled features → Show Linear Referencing ribbon → Core tools enabled → Extension tools enabled only when LRS Controller datasets are present

## Slide 2 — Acceptance Criteria & Requirements

Single Linear Referencing ribbon replaces existing Linear Referencing and Location Referencing ribbons
Ribbon appears only when M-enabled feature layers are present in the map
Core linear referencing tools are always enabled when the ribbon is visible
Extension tools are enabled only when extension-enabled layers with an LRS Controller dataset are present
Ribbon layout and grouping follow the approved external design specification

## Slide 3 — Testing

Manual UI testing focused on ribbon visibility and enablement
Validation of map state changes and tool enablement when adding and removing layers
Existing automated tests and builds complete with no regressions

## Slide 4 — Automation

Automated tests validate context sensitivity based on M-enabled features
Automated tests validate core versus extension tool enablement
Automation reusable for future context-sensitive ribbon behavior

## Slide 5 — Documentation

No new end-user documentation required for this story
Ribbon naming and grouping reflected in follow-on documentation updates
Internal developer documentation updated as needed

## Slide 6 — Estimation

Estimation –
Dev Effort –
PE Effort –
