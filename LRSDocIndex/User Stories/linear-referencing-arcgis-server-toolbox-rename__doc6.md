# Linear Referencing ArcGIS Server Toolbox Rename

|   |   |
| --- | --- |
| **Kind** | User Story · Server |
| **Release** | — |
| **Source** | [LinearReferencing_ArcGISServer_Toolbox_Rename.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/LinearReferencing_ArcGISServer_Toolbox_Rename.pptx>) |
| **Edited** | 2026-07-23 23:53 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Linear Referencing ArcGIS Server Toolbox Rename"
source_file: "LinearReferencing_ArcGISServer_Toolbox_Rename.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/LinearReferencing_ArcGISServer_Toolbox_Rename.pptx"
doc_id: 6
doc_kind: "User Story"
surface: "Server"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2026-07-23T23:53:05Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["arcgis server", "toolbox rename", "legacy alias", "locationreferencingsolutions", "linearreferencing", "user story"]
tools: ["LinearReferencing"]
products: []
issues: []
related: [{"doc":43,"file":"linear-referencing-gp-toolbox-consolidation__doc43.md","s":5.866},{"doc":44,"file":"arcgis-linear-referencing-product-renaming__doc44.md","s":4.205},{"doc":898,"file":"unfederating-arcgis-server-when-all-else-fails__doc898.md","s":2.52},{"doc":593,"file":"fix-existing-automations-for-reassign-rest-signature-update__doc593.md","s":2.014},{"doc":3,"file":"definition-of-done-for-user-story-and-test-plan-processes__doc3.md","s":1.61}]
```
-->

## Summary

This document describes the renaming of the ArcGIS Server toolbox from LocationReferencingSolutions to LinearReferencing to provide a consistent linear referencing experience. It ensures backward compatibility by maintaining the legacy alias as hidden and non-discoverable, allowing existing scripts and integrations to function without modification. Acceptance criteria, testing, automation updates, and documentation changes are outlined to support this transition.

## Related documents

<!-- related:begin -->
- [Linear Referencing GP Toolbox Consolidation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/linear-referencing-gp-toolbox-consolidation__doc43.md>) — similar text 0.28 · 2 title words · 3 filename words · same kind/folder <!-- rel:43 -->
- [ArcGIS Linear Referencing Product Renaming](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/arcgis-linear-referencing-product-renaming__doc44.md>) — similar text 0.19 · 1 title word · 2 filename words · same kind/folder <!-- rel:44 -->
- [Unfederating ArcGIS Server when all else fails](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/unfederating-arcgis-server-when-all-else-fails__doc898.md>) — similar text 0.06 · 1 title word · 1 filename word · same surface/folder <!-- rel:898 -->
- [Fix Existing Automations for Reassign REST Signature Update](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/fix-existing-automations-for-reassign-rest-signature-update__doc593.md>) — similar text 0.03 · same kind/surface/folder <!-- rel:593 -->
- [Definition of Done for User Story and Test Plan Processes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/definition-of-done-for-user-story-and-test-plan-processes__doc3.md>) — similar text 0.04 <!-- rel:3 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Lines](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-a-line.html) · [Location errors](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/location-errors.html)
<!-- docs:end -->

---

## Slide 1 — Linear Referencing ArcGIS Server Toolbox Rename

User Story

## Slide 2 — I Need Statement, Personas, Workflow

As an LRS administrator or developer, I need the ArcGIS Server toolbox currently exposed as LocationReferencingSolutions to be renamed to LinearReferencing, so that ArcGIS Server presents a consistent Linear Referencing experience while existing scripts and applications continue to function without modification.

Personas:
LRS Administrator: Configures and manages Location Referencing deployments in ArcGIS Enterprise and needs consistent naming across ArcGIS Server surfaces.

Workflow:
Discover LinearReferencing toolbox in ArcGIS Server -> Execute tools using the new LinearReferencing path -> Existing scripts continue to execute through the hidden LocationReferencingSolutions alias -> No functional differences are observed between the new and legacy paths.

## Slide 3 — Acceptance Criteria & Requirements

LinearReferencing is the only discoverable toolbox name exposed in ArcGIS Server.
All ArcGIS Server locations, endpoints, REST resources, and UI surfaces previously exposing LocationReferencingSolutions now expose LinearReferencing.
LocationReferencingSolutions remains available as a hidden, non-discoverable compatibility alias.
Existing Python scripts, REST clients, models, and integrations referencing LocationReferencingSolutions continue to function without modification.
No warnings or informational messages are returned when the legacy alias is used.
No changes are made to tool behavior, parameters, outputs, aliases, security, licensing, or execution logic.
Legacy alias support is maintained for this release and will be deprecated in a future release through documented migration guidance.

## Slide 4 — Testing

Verify only LinearReferencing appears in ArcGIS Server Manager, REST discovery pages, and related user-facing surfaces.
Validate execution of representative tools using the LinearReferencing toolbox path.
Validate execution of the same tools using the hidden LocationReferencingSolutions path.
Confirm tool messages, outputs, and behavior are identical from both entry points.
Execute regression testing against existing GP services and integrations.
Validate representative Python scripts from earlier releases continue to execute successfully using the legacy path.

## Slide 5 — Automation

Verify existing automation for feature services continues to work with existing Location Referencing path.
Update existing automation to point to new Linear Referencing path.

## Slide 6 — Documentation

Update product documentation to reference LinearReferencing as the supported toolbox name.
Document LocationReferencingSolutions as a legacy compatibility alias.

## Slide 7 — Estimation

Estimation -
Dev Effort -
PE Effort -
