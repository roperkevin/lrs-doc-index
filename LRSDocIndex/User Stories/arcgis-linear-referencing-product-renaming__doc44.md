# ArcGIS Linear Referencing Product Renaming

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [ArcGIS Linear Referencing Product Renaming in Codebase.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ArcGIS%20Linear%20Referencing%20Product%20Renaming%20in%20Codebase.pptx>) |
| **Edited** | 2026-04-28 01:03 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "ArcGIS Linear Referencing Product Renaming"
source_file: "ArcGIS Linear Referencing Product Renaming in Codebase.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ArcGIS%20Linear%20Referencing%20Product%20Renaming%20in%20Codebase.pptx"
doc_id: 44
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2026-04-28T01:03:35Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["product renaming", "legacy references", "backward compatibility", "automation", "programmatic validation", "arcgis pro"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":43,"file":"linear-referencing-gp-toolbox-consolidation__doc43.md","s":6.186},{"doc":42,"file":"linear-referencing-ribbon-unified-experience__doc42.md","s":4.883},{"doc":6,"file":"linear-referencing-arcgis-server-toolbox-rename__doc6.md","s":4.205},{"doc":505,"file":"64-bit-oid-in-lrs-gp-tools__doc505.md","s":2.53},{"doc":662,"file":"generate-calibration-points-tool-feature-service-support-user-story__doc662.md","s":2.229}]
```
-->

## Summary

This document outlines the user story and requirements for renaming all references of Location Referencing, Roads and Highways, and Pipeline Referencing to ArcGIS Linear Referencing across the ArcGIS Pro UI, core codebase, geoprocessing tools, SDKs, and APIs. It emphasizes preserving backward compatibility, systematic renaming, and programmatic validation without changing functionality or data models.

## Related documents

<!-- related:begin -->
- [Linear Referencing GP Toolbox Consolidation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/linear-referencing-gp-toolbox-consolidation__doc43.md>) — similar text 0.25 · 1 title word · 3 filename words · same kind/surface/folder <!-- rel:43 -->
- [Linear Referencing Ribbon – Unified Experience](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/linear-referencing-ribbon-unified-experience__doc42.md>) — similar text 0.23 · 1 title word · 3 filename words · same kind/surface/folder <!-- rel:42 -->
- [Linear Referencing ArcGIS Server Toolbox Rename](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/linear-referencing-arcgis-server-toolbox-rename__doc6.md>) — similar text 0.19 · 1 title word · 2 filename words · same kind/folder <!-- rel:6 -->
- [64-bit OID in LRS GP tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/64-bit-oid-in-lrs-gp-tools__doc505.md>) — similar text 0.04 · same kind/surface/folder <!-- rel:505 -->
- [Generate Calibration Points Tool Feature Service Support User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/generate-calibration-points-tool-feature-service-support-user-story__doc662.md>) — similar text 0.05 · same kind/surface/folder <!-- rel:662 -->
<!-- related:end -->

---

## Slide 1 — ArcGIS Linear Referencing – Product Renaming

User Story (I Need): As a Pro user, developer, and integrator, I need all references to Location Referencing, Roads and Highways, and Pipeline Referencing to be unified as ArcGIS Linear Referencing so that the platform presents a single, coherent product identity.
Personas: LRS Analyst, SDK/Add‑in Developer, Enterprise Integrator, ArcGIS Pro Engineer
Workflow: Identify legacy references → Rename and consolidate → Preserve compatibility → Programmatic validation → Platform‑wide consistency

## Slide 2 — Requirements

Scope includes ArcGIS Pro UI, core codebase, GP tools, SDKs, and APIs
Renaming is systematic, auditable, and scriptable where possible
Backward compatibility preserved through aliases or redirects
No functional behavior changes beyond naming

## Slide 3 — Non‑Goals / Out of Scope

No new linear referencing functionality
No schema, data model, or network behavior changes
No packaging or entitlement changes
No comprehensive end‑user documentation rewrite

## Slide 4 — Testing

Validation performed programmatically by the implementing engineer
Pro successfully builds and automated test execution with no regressions
Sanity testing of all tools to verify

## Slide 5 — Automation

Scripted identification and replacement of legacy terminology
Leverage existing automated test infrastructure for validation
Automation reusable for future platform‑wide refactors

## Slide 6 — Documentation

No new end‑user documentation required in this story
Legacy references updated incrementally or in follow‑on doc work
Internal developer notes may be updated as needed

## Slide 7 — Estimation

Estimation –
Dev Effort –
PE Effort –
