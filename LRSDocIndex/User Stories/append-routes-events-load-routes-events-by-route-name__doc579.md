# Append Routes/Events: Load Routes/Events by Route Name

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#4855](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4855) |
| **Source** | [4855-AppendRoutesandEventsLoadbyRouteName_UserStory_V1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/4855-AppendRoutesandEventsLoadbyRouteName_UserStory_V1.pptx>) |
| **Edited** | 2023-04-10 17:56 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Append Routes/Events: Load Routes/Events by Route Name"
source_file: "4855-AppendRoutesandEventsLoadbyRouteName_UserStory_V1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/4855-AppendRoutesandEventsLoadbyRouteName_UserStory_V1.pptx"
doc_id: 579
doc_kind: "User Story"
surface: "Pro"
doc_revision: "V1"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2023-04-10T17:56:28Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["append routes", "append events", "route name", "route id", "lrs editor", "load routes", "load events"]
tools: ["Append Routes", "Append Events"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#4855"]
related: [{"doc":567,"file":"append-routes-load-routes-by-route-name-test-plan__doc567.md","s":1004.662},{"doc":549,"file":"append-events-load-events-by-routename-test-plan__doc549.md","s":6.75},{"doc":168,"file":"allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md","s":4.7},{"doc":164,"file":"append-events-partial-loading-support__doc164.md","s":4.652},{"doc":143,"file":"support-optional-date-field-mapping-in-append-events-tool__doc143.md","s":4.604}]
```
-->

## Summary

This user story describes the need for LRS Editors to load routes and events by Route Name instead of Route ID when using Append Routes and Append Events tools. It outlines the expected behavior when Route ID is null or conflicting with Route Name, and the testing, automation, and documentation updates required to support this functionality.

## Related documents

<!-- related:begin -->
- [Append Routes: Load Routes by Route Name Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-routes-load-routes-by-route-name-test-plan__doc567.md>) — shared issue ArcGISPro/ps-location-referencing#4855 · similar text 0.19 · 5 title words · 1 filename word · same surface <!-- rel:567 -->
- [Append Events: Load Events by RouteName Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-events-load-events-by-routename-test-plan__doc549.md>) — similar text 0.18 · 3 title words · 5 filename words · same surface <!-- rel:549 -->
- [Allow Append Events to Run When Locks Are Present on Impacted Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md>) — similar text 0.20 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:168 -->
- [Append Events Partial Loading Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-events-partial-loading-support__doc164.md>) — similar text 0.16 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:164 -->
- [Support Optional Date Field Mapping in Append Events Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-optional-date-field-mapping-in-append-events-tool__doc143.md>) — similar text 0.15 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:143 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com) · [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Append Routes/Events: Load Routes/Events by Route Name

User Story

## Slide 2 — User Story

As an LRS Editor, I need the ability to load routes and events by Route Name instead of Route ID when using Append Routes and Append Events so that I can load routes and events into my LRS Network based on Route Name which is my business’s main route identifier, not Route ID.
Persona:
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawings, FGDBs, etc.).  The LRS Editor is constantly making changes to routes and events with new info, and their business practices may focus solely on Route Name for LRS Network routes.  Because of this, appending routes and events can be more labor intensive as these tools append by Route ID, causing the append process to be much more complex.

## Slide 3 — Append Routes/Events: Load Routes/Events by Route Name

Append Routes:

  - Add ability to load routes by Route Name instead of Route ID
  - If Route ID field is Null, automatically generate a GUID for the record
    - Possibly another approach?

Append Events

  - Add ability to load events by Route Name instead of Route ID
  - If Route ID field is Null, use the Route Name field to load routes and once loaded generate the Route ID based on a route query
    - Similar to cases when Route ID is populated but Route Name is empty, we get the Route Name based on a route query
  - If Route ID and Route Name are both populated and conflicting, default to whichever field was chosen to load routes.
    - Repopulate the corresponding field with the correct Route ID or Route Name based on a route query.

## Slide 4 — Testing

Test with RH and APR, but lean heavier towards APR as this is more applicable for APR
Ensure that all load types work correctly when Route ID is Null
Append Routes and Append Events with all input record’s Route ID Null
Append Routes and Append Events with some Route ID’s Null and the rest populated correctly
Append Routes and Events with Route ID populated incorrectly but Route Name is populated correctly

## Slide 5 — Automation

Update and add cases to Append Routes Python and REST automation
Update and add cases to Append Events Python and REST automation
Ensure existing automation cases continue to work as intended

## Slide 6 — Documentation

Update Append Routes and Append Events GP Tool documentation

  - Update script format and script samples if needed
Update Location Referencing Toolbox History doc if needed

## Slide 7 — Assignment

Story Points:
Dev:
PE:
