# Linear Referencing ArcGIS Server Toolbox Rename

| Field | Value |
| --- | --- |
| **Doc** | 6 · User Story · Server |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [LinearReferencing_ArcGISServer_Toolbox_Rename.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/LinearReferencing_ArcGISServer_Toolbox_Rename.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2026-07-23 23:53 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | arcgis server · toolbox rename · legacy alias · locationreferencingsolutions · linearreferencing · user story |
| **Tools** | LinearReferencing |

## Summary

This document describes the renaming of the ArcGIS Server toolbox from LocationReferencingSolutions to LinearReferencing to provide a consistent linear referencing experience. It ensures backward compatibility by maintaining the legacy alias as hidden and non-discoverable, allowing existing scripts and integrations to function without modification. Acceptance criteria, testing, automation updates, and documentation changes are outlined to support this transition.

## Related documents

<!-- related:begin -->
- [Linear Referencing GP Toolbox Consolidation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-gp-toolbox-consolidation.md>) — similar text 0.28 · 2 title words · 3 filename words · same kind/folder <!-- rel:43 s=5.866 -->
- [ArcGIS Linear Referencing Product Renaming](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/arcgis-lr-product-renaming.md>) — similar text 0.19 · 1 title word · 2 filename words · same kind/folder <!-- rel:44 s=4.205 -->
- [Unfederating ArcGIS Server when all else fails](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/unfederating-arcgis-server-when-all-else-fails.md>) — similar text 0.06 · 1 title word · 1 filename word · same surface/folder <!-- rel:898 s=2.52 -->
- [Fix Existing Automations for Reassign REST Signature Update](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/fix-existing-automations-for-reassign-rest-signature-update.md>) — similar text 0.03 · same kind/surface/folder <!-- rel:593 s=2.014 -->
- [Definition of Done for User Story and Test Plan Processes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/definition-of-done-for-user-story-and-test-plan-processes.md>) — similar text 0.04 <!-- rel:3 s=1.61 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Lines](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-a-line.html) · [Location errors](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/location-errors.html)
<!-- docs:end -->

---

## Story
### Linear Referencing ArcGIS Server Toolbox Rename <!-- slide 1 -->
User Story

## Acceptance Criteria
### I Need Statement, Personas, Workflow <!-- slide 2 -->
- As an LRS administrator or developer, I need the ArcGIS Server toolbox currently exposed as LocationReferencingSolutions to be renamed to LinearReferencing, so that ArcGIS Server presents a consistent Linear Referencing experience while existing scripts and applications continue to function without modification.

Personas:

- LRS Administrator: Configures and manages Location Referencing deployments in ArcGIS Enterprise and needs consistent naming across ArcGIS Server surfaces.

Workflow:

- Discover LinearReferencing toolbox in ArcGIS Server -> Execute tools using the new LinearReferencing path -> Existing scripts continue to execute through the hidden LocationReferencingSolutions alias -> No functional differences are observed between the new and legacy paths.

### Acceptance Criteria & Requirements <!-- slide 3 -->
- LinearReferencing is the only discoverable toolbox name exposed in ArcGIS Server.
- All ArcGIS Server locations, endpoints, REST resources, and UI surfaces previously exposing LocationReferencingSolutions now expose LinearReferencing.
- LocationReferencingSolutions remains available as a hidden, non-discoverable compatibility alias.
- Existing Python scripts, REST clients, models, and integrations referencing LocationReferencingSolutions continue to function without modification.
- No warnings or informational messages are returned when the legacy alias is used.
- No changes are made to tool behavior, parameters, outputs, aliases, security, licensing, or execution logic.
- Legacy alias support is maintained for this release and will be deprecated in a future release through documented migration guidance.

## Testing
<!-- slide 4 -->
- Verify only LinearReferencing appears in ArcGIS Server Manager, REST discovery pages, and related user-facing surfaces.
- Validate execution of representative tools using the LinearReferencing toolbox path.
- Validate execution of the same tools using the hidden LocationReferencingSolutions path.
- Confirm tool messages, outputs, and behavior are identical from both entry points.
- Execute regression testing against existing GP services and integrations.
- Validate representative Python scripts from earlier releases continue to execute successfully using the legacy path.

## Automation
<!-- slide 5 -->
- Verify existing automation for feature services continues to work with existing Location Referencing path.
- Update existing automation to point to new Linear Referencing path.

## Documentation
<!-- slide 6 -->
- Update product documentation to reference LinearReferencing as the supported toolbox name.
- Document LocationReferencingSolutions as a legacy compatibility alias.

## Assignment
### Estimation <!-- slide 7 -->
- Estimation -
- Dev Effort -
- PE Effort -
