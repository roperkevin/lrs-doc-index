# Fixing Tools and Functionalities Affected by Releasing Unique Rid/Name Check in Reassign

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [Reassign_FixingTools.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Reassign_FixingTools.pptx>) |
| **Edited** | 2023-04-28 20:42 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Fixing Tools and Functionalities Affected by Releasing Unique Rid/Name Check in Reassign"
source_file: "Reassign_FixingTools.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Reassign_FixingTools.pptx"
doc_id: 568
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Claire Wang"
last_edited: "2023-04-28T20:42:13Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["reassign", "rid name combination", "route", "time slice", "error message", "conflict prevention"]
tools: ["Create Route", "Realign", "Append Routes", "Append Events", "Generate Routes", "Generate Events", "Generate Intersections", "Generate Calibration Points", "Carto-realign", "Rename"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":585,"file":"support-reassign-transfer-to-a-new-line-method-in-arcgis-pro__doc585.md","s":3.264},{"doc":594,"file":"reassign-to-a-new-or-existing-line-with-original-route-id-name-maintained-on__doc594.md","s":3.241},{"doc":583,"file":"support-reassign-transfer-as-new-route-s-to-adjacent-line-method-in-arcgis-pro__doc583.md","s":3.219},{"doc":826,"file":"conflict-prevention-acquire-locks-when-creating-new-routes-in-create-extend__doc826.md","s":3.082},{"doc":607,"file":"reassign-to-a-new-or-existing-line-with-original-route-id-name-maintained-on__doc607.md","s":3.082}]
```
-->

## Summary

This document describes the user story for fixing multiple tools and functionalities affected by the removal of the unique Rid/name combination restriction on a single line. It lists affected tools, required code changes, testing approaches including negative cases, automation updates, and documentation revisions. The goal is to ensure these tools work correctly when the same Rid/name combo appears on different lines in non-overlapping time slices.

## Related documents

<!-- related:begin -->
- [Support Reassign: Transfer to a New Line Method in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-transfer-to-a-new-line-method-in-arcgis-pro__doc585.md>) — similar text 0.18 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:585 -->
- [Reassign to a New or Existing Line with Original Route ID/Name Maintained on the Target Line - REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/reassign-to-a-new-or-existing-line-with-original-route-id-name-maintained-on__doc594.md>) — similar text 0.16 · 2 title words · 1 filename word · same kind/folder <!-- rel:594 -->
- [Support Reassign: Transfer as New Route(s) to Adjacent Line Method in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-transfer-as-new-route-s-to-adjacent-line-method-in-arcgis-pro__doc583.md>) — similar text 0.16 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:583 -->
- [Conflict Prevention: Acquire Locks when creating new routes in Create, Extend, Realign, and Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-acquire-locks-when-creating-new-routes-in-create-extend__doc826.md>) — similar text 0.09 · 1 title word · same kind/surface/folder <!-- rel:826 -->
- [Reassign to a new or existing line with original Route ID/Name maintained on the target line - REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/reassign-to-a-new-or-existing-line-with-original-route-id-name-maintained-on__doc607.md>) — similar text 0.15 · 2 title words · 1 filename word · same kind/folder <!-- rel:607 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-new-route.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/realign-routes.html) · [Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-cartographic-realignment.html) · [Rename a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/rename-a-route.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reassign-routes.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html)

_No page matched:_ [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com) · [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com) · [Generate Routes](https://www.google.com/search?q=%22Generate%20Routes%22+site%3Adoc.esri.com) · [Generate Events](https://www.google.com/search?q=%22Generate%20Events%22+site%3Adoc.esri.com) · [Generate Intersections](https://www.google.com/search?q=%22Generate%20Intersections%22+site%3Adoc.esri.com) · [Generate Calibration Points](https://www.google.com/search?q=%22Generate%20Calibration%20Points%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Fixing tools and functionalities that are affected by releasing the unique Rid/name check in Reassign

User Story

## Slide 2 — User Story

The restraint in limiting unique Rid/name combination on one line only is released for implementing the new Reassign method. As multiple tools and functionality have this check in codebase, they will break or malfunction.
These tools and functionality need to be fixed and to work normally with the released check (scenario that a Rid/name combo appears on different lines in non-overlapping time slices – hereafter referred as “the scenario”).

## Slide 3 — Fixing affected tools and functionalities

Tools/functionalities that may be affected:
Create
Realign
Append routes
Append events
Generate routes
Generate events
Generate intersections
Generate Calibration Points
Carto-realign (affects shape of all time slices)
Rename (affects route name/id of all time slices)
Conflict Prevention (will be covered in a separate user story)
Developers may add more onto this list by searching codebase and checking automation status
Make code change to these tools/functionalities that

  - Running on data that contains the scenario, these tools/functionalities will not return error. E.g. Realign, Append Routes, Generate Routes, and Generate Calibration Points from source table
  - Some of these tools/functionalities can be used to created the scenario. E.g. Create Route

Developer will create new error messages for having a Rid/name combo on different lines in overlapping time slices if needed
R1 (LineA)
2000-null
A (LineB)
2000-null
R1 (LineB)
2005-null (2000-2005 on LineA is retired)
A (LineB)
2000-null
Create Route

## Slide 4 — Testing – sample testing

Test with APR and RH data in Feature Services (do 1-2 tests on fgdb/dc sde)
Sample test all tools/functionalities listed (automation covers the majority)
Test negative cases and validate new error message(s) (if any):

  - Use Create Route tool to create routes with same Rid/name combo on different lines, but overlapping time slices
  - Have the error scenario above in source data (e.g. table; polyline feature) and use the tools/functionalities listed

### Notes

Projected and unprojected?

## Slide 5 — Automation

Fix existing automation

## Slide 6 — Documentation

Check if documentation of any of the tools/functionalities in the list mentions the requirement of limiting unique Rid/name combination on one line only. If so, remove associated text.

## Slide 7 — Assignment

Story Points:
Dev:
PE:
