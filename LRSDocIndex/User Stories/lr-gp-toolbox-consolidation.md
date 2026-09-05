# Linear Referencing GP Toolbox Consolidation

| Field | Value |
| --- | --- |
| **Doc** | 43 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [ArcGIS_Pro_Linear_Referencing_GP_Toolbox_Consolidation.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ArcGIS_Pro_Linear_Referencing_GP_Toolbox_Consolidation.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2026-04-28 01:34 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | linear referencing · location referencing · geoprocessing toolbox · toolbox consolidation · map toolset · extension toolset · automation · testing · documentation |
| **Tools** | — |

## Summary

This document describes the consolidation of the Linear Referencing and Location Referencing geoprocessing toolboxes into a single Linear Referencing toolbox in ArcGIS Pro. It outlines the personas involved, workflow, acceptance criteria, testing approach, automation updates, and documentation changes. The goal is to maintain backward compatibility and ensure all tools remain functionally unchanged while improving discoverability.

## Related documents

<!-- related:begin -->
- [ArcGIS Linear Referencing Product Renaming](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/arcgis-lr-product-renaming.md>) — similar text 0.25 · 1 title word · 3 filename words · same kind/surface/folder <!-- rel:44 s=6.186 -->
- [Linear Referencing ArcGIS Server Toolbox Rename](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-arcgis-server-toolbox-rename.md>) — similar text 0.28 · 2 title words · 3 filename words · same kind/folder <!-- rel:6 s=5.866 -->
- [Linear Referencing Ribbon – Unified Experience](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-ribbon-unified-experience.md>) — similar text 0.36 · 1 title word · 4 filename words · same kind/surface/folder <!-- rel:42 s=5.577 -->
- [Combined APR-UN Ribbon User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/4958-combined-apr-un-ribbon.md>) — similar text 0.05 · same kind/surface/folder <!-- rel:606 s=2.821 -->
- [Add Single Point Event tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-single-point-event-tool-in-pro.md>) — similar text 0.06 · same kind/surface/folder <!-- rel:688 s=2.427 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Multiple linear referencing methods](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/multiple-linear-referencing-methods.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)

_No page matched:_ [linear referencing toolbox](https://www.google.com/search?q=%22linear%20referencing%20toolbox%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Linear Referencing GP Toolbox Consolidation <!-- slide 1 -->
- As a linear referencing analyst and ArcGIS Pro user, I need the Linear Referencing and Location Referencing geoprocessing toolboxes combined into a single toolbox called Linear Referencing so that all linear referencing GP workflows are discoverable in one consistent location.
- Personas: LRS Analyst / Editor; Transportation & Pipeline Analyst; Automation / Python User; ArcGIS Pro Engineer
- Workflow: Open Linear Referencing toolbox → Use Map toolset for core tools → Use Extension toolset for extension‑level tools → Existing scripts and models continue to run

## Acceptance Criteria
### Acceptance Criteria & Requirements <!-- slide 2 -->
- Single Linear Referencing GP toolbox replaces existing Linear Referencing and Location Referencing toolboxes
- Tools from the original Linear Referencing toolbox are grouped under a Map toolset
- Tools from the original Location Referencing toolbox are grouped under an Extension toolset
- All tools remain functionally unchanged
- Backward compatibility preserved for existing scripts, models, and tool references

## Testing
<!-- slide 3 -->
- Minimal manual validation of toolbox structure and tool grouping
- Run representative tools from Map and Extension toolsets
- Programmatic validation of Python scripts and ModelBuilder workflows
- Existing automated GP tests pass with no regressions once paths are updated to new toolbox location
- Verify scripts from previous versions still execute as expected

## Automation
<!-- slide 4 -->
- Existing automation validates tool execution and discoverability
- Automation updated only as needed for toolbox path or alias changes
- No new automation required beyond maintaining existing coverage

## Documentation
<!-- slide 5 -->
- Update existing format of impacted GP tool topics to mention their new location within the GP toolbox
- Internal developer documentation updated as needed

## Assignment
### Estimation <!-- slide 6 -->
- Estimation –
- Dev Effort –
- PE Effort –
