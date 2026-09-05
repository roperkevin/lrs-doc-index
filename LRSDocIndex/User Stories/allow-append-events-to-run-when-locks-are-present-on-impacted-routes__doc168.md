# Allow Append Events to Run When Locks Are Present on Impacted Routes

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Allow Append Events to run when locks are present on impacted routes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Allow%20Append%20Events%20to%20run%20when%20locks%20are%20present%20on%20impacted%20routes.pptx>) |
| **Edited** | 2025-05-16 22:16 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Allow Append Events to Run When Locks Are Present on Impacted Routes"
source_file: "Allow Append Events to run when locks are present on impacted routes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Allow%20Append%20Events%20to%20run%20when%20locks%20are%20present%20on%20impacted%20routes.pptx"
doc_id: 168
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2025-05-16T22:16:47Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["append events", "route locks", "conflict prevention", "bulk load", "event data", "lrs editor"]
tools: ["Append Events"]
products: []
issues: []
related: [{"doc":156,"file":"allow-append-events-to-run-when-locks-are-present-test-plan__doc156.md","s":6.665},{"doc":163,"file":"allow-lrs-intersections-to-be-updated-without-locking-intersecting-routes__doc163.md","s":5.501},{"doc":164,"file":"append-events-partial-loading-support__doc164.md","s":5.066},{"doc":579,"file":"append-routes-events-load-routes-events-by-route-name__doc579.md","s":4.891},{"doc":165,"file":"append-routes-partial-loading-support__doc165.md","s":4.766}]
```
-->

## Summary

This user story describes the need for an Append Events tool enhancement to allow bulk loading of event data even when locks exist on impacted routes. It introduces an optional parameter to override conflict prevention route locks, enabling the tool to append events without acquiring locks but with a warning message. Testing, automation, and documentation updates are planned to support this change.

## Related documents

<!-- related:begin -->
- [Allow Append Events to Run When Locks Are Present - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/allow-append-events-to-run-when-locks-are-present-test-plan__doc156.md>) — similar text 0.33 · 6 title words · 3 filename words · same surface <!-- rel:156 -->
- [Allow LRS Intersections to be updated without locking intersecting routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-lrs-intersections-to-be-updated-without-locking-intersecting-routes__doc163.md>) — similar text 0.57 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:163 -->
- [Append Events Partial Loading Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-events-partial-loading-support__doc164.md>) — similar text 0.40 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:164 -->
- [Append Routes/Events: Load Routes/Events by Route Name](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/append-routes-events-load-routes-events-by-route-name__doc579.md>) — similar text 0.20 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:579 -->
- [Append Routes Partial Loading Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-partial-loading-support__doc165.md>) — similar text 0.33 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:165 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html) · [Events data model](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/events-data-model.html)

_No page matched:_ [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Allow Append Events to run when locks are present on impacted routes

User Story

## Slide 2 — User Story

As an LRS Editor, I need to bulk load event data even when locks are present on any of the routes being loaded on, so that I can bulk load a large number of events without being stopped by a single lock.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. Users have cases where they have bulk events that need to be appended and there are 1-2 route locks that don’t impact the events being loaded.  They want an option to override conflict prevention in this case so events are appended.

## Slide 3 — Append Events locks override

Add a parameter to the Append Events tool called “Ignore Conflict Prevention route locks”
The parameter is optional.  It would only appear in the UI when Conflict Prevention is enabled on the LRS.  Default is unchecked.
When disabled, the tool works as it does today
When enabled, the tool should continue to query locks for the routes the events are being appended onto but not acquire them.
If there are locks on any of the routes the events are being appended onto, add a warning message to the GP output that alerts the user that there were routes that were locked (and provide the list of routeIDs)

## Slide 4 — Testing

Test with point and line events
Test with scenarios where there are no locks and existing locks on the routes
Verify the tool still works as expected when conflict prevention is disabled and when the parameter is disabled
Verify at least once in fgdb, dc, and fs
Verify in Pro, python UI, python stand alone, and model builder

## Slide 5 — Automation

Update automation for the tool to account for this change

## Slide 6 — Documentation

Update documentation for the tool to mention how existing locks on routes that events are being appended onto will be ignored when this option is enabled and the tool will still run

## Slide 7 — Assignment

Story Points:
Dev:  days
PE:  days
