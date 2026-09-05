# Linear Referencing Ribbon – Unified Experience

| Field | Value |
| --- | --- |
| **Doc** | 42 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [ArcGIS_Pro_Linear_Referencing_Unified Ribbon.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ArcGIS_Pro_Linear_Referencing_Unified%20Ribbon.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2026-04-28 01:29 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | linear referencing ribbon · context sensitive ribbon · m enabled features · core tools · extension tools · lrs controller dataset |
| **Tools** | — |

## Summary

Combines the Linear Referencing and Location Referencing ribbons into a single context-sensitive Linear Referencing ribbon in ArcGIS Pro. The ribbon appears only when M-enabled feature layers are present and enables core and extension tools based on layer presence. Includes acceptance criteria, testing, automation, and documentation considerations for this unified ribbon experience.

## Related documents

<!-- related:begin -->
- [Linear Referencing GP Toolbox Consolidation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-gp-toolbox-consolidation.md>) — similar text 0.36 · 1 title word · 4 filename words · same kind/surface/folder <!-- rel:43 s=5.577 -->
- [ArcGIS Linear Referencing Product Renaming](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/arcgis-lr-product-renaming.md>) — similar text 0.23 · 1 title word · 3 filename words · same kind/surface/folder <!-- rel:44 s=4.883 -->
- [Linear Referencing Attribution in Linear Feature Extraction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-attribution-in-linear-feature-extraction.md>) — similar text 0.15 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:7 s=3.471 -->
- [Linear Referencing attribution in Feature Extraction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-attribution-in-feature-extraction.md>) — similar text 0.15 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:14 s=3.459 -->
- [Add LRS Container to Catalog Window](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-lrs-container-to-catalog-window.md>) — similar text 0.07 · same kind/surface/folder <!-- rel:833 s=2.894 -->
<!-- related:end -->

---

## Story
### Linear Referencing Ribbon – Unified Experience <!-- slide 1 -->
- As a linear referencing analyst and ArcGIS Pro user, I need the Linear Referencing and Location Referencing ribbons combined into a single context-sensitive ribbon called Linear Referencing so that all linear referencing workflows are discoverable in one place.
- Personas: LRS Analyst / Editor; Transportation & Pipeline Editor; ArcGIS Pro Power User; ArcGIS Pro Engineer
- Workflow: Add layers → Detect M-enabled features → Show Linear Referencing ribbon → Core tools enabled → Extension tools enabled only when LRS Controller datasets are present

## Acceptance Criteria
### Acceptance Criteria & Requirements <!-- slide 2 -->
- Single Linear Referencing ribbon replaces existing Linear Referencing and Location Referencing ribbons
- Ribbon appears only when M-enabled feature layers are present in the map
- Core linear referencing tools are always enabled when the ribbon is visible
- Extension tools are enabled only when extension-enabled layers with an LRS Controller dataset are present
- Ribbon layout and grouping follow the approved external design specification

## Testing
<!-- slide 3 -->
- Manual UI testing focused on ribbon visibility and enablement
- Validation of map state changes and tool enablement when adding and removing layers
- Existing automated tests and builds complete with no regressions

## Automation
<!-- slide 4 -->
- Automated tests validate context sensitivity based on M-enabled features
- Automated tests validate core versus extension tool enablement
- Automation reusable for future context-sensitive ribbon behavior

## Documentation
<!-- slide 5 -->
- No new end-user documentation required for this story
- Ribbon naming and grouping reflected in follow-on documentation updates
- Internal developer documentation updated as needed

## Assignment
### Estimation <!-- slide 6 -->
- Estimation –
- Dev Effort –
- PE Effort –
