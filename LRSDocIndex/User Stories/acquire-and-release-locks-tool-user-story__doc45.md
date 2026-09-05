# Acquire and Release Locks tool User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Create tool AcquireReleaseLocks.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Create%20tool%20AcquireReleaseLocks.pptx>) |
| **Edited** | 2026-04-16 02:43 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Acquire and Release Locks tool User Story"
source_file: "Create tool AcquireReleaseLocks.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Create%20tool%20AcquireReleaseLocks.pptx"
doc_id: 45
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2026-04-16T02:43:18Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["locks", "route", "event", "lock acquisition", "lock release", "multi user editing", "versioned environment"]
tools: ["Acquire and Release Locks"]
products: []
issues: []
related: [{"doc":830,"file":"conflict-prevention-acquire-locks-in-create-route__doc830.md","s":4.456},{"doc":827,"file":"allow-locks-to-transfer-between-users-in-rest-and-editing-tools__doc827.md","s":4.323},{"doc":826,"file":"conflict-prevention-acquire-locks-when-creating-new-routes-in-create-extend__doc826.md","s":3.929},{"doc":168,"file":"allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md","s":3.572},{"doc":828,"file":"allow-locks-to-transfer-between-users-in-location-referencing-gp-tools__doc828.md","s":3.212}]
```
-->

## Summary

Describes a standalone tool for LRS Editors to acquire and release route or event locks based on selection sets to prevent edit conflicts in a multi-user, versioned LRS environment. Covers functional requirements, acceptance criteria, testing scenarios, automation, and documentation plans for the tool. The tool supports lock management scoped to the active version and user, with clear messaging and error handling.

## Related documents

<!-- related:begin -->
- [Conflict Prevention: Acquire Locks in Create Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-acquire-locks-in-create-route__doc830.md>) — similar text 0.23 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:830 -->
- [Allow Locks to Transfer between Users in REST and Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-locks-to-transfer-between-users-in-rest-and-editing-tools__doc827.md>) — similar text 0.24 · 1 title word · same kind/surface/folder <!-- rel:827 -->
- [Conflict Prevention: Acquire Locks when creating new routes in Create, Extend, Realign, and Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-acquire-locks-when-creating-new-routes-in-create-extend__doc826.md>) — similar text 0.22 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:826 -->
- [Allow Append Events to Run When Locks Are Present on Impacted Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md>) — similar text 0.20 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:168 -->
- [Allow Locks to Transfer between Users in Location Referencing GP tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-locks-to-transfer-between-users-in-location-referencing-gp-tools__doc828.md>) — similar text 0.20 · 1 title word · same kind/surface/folder <!-- rel:828 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Release locks with the Release Locks tool](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/release-locks.html)

_No page matched:_ [Acquire and Release Locks](https://www.google.com/search?q=%22Acquire%20and%20Release%20Locks%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Acquire and Release Locks tool

User Story

## Slide 2 — User Story

As an LRS Editor, I need a standalone tool to explicitly acquire/release route or event locks based on a selection set, so that I can prevent edit conflicts while performing complex or long‑running edits in a multi‑user, versioned LRS environment.
Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents.  When running non LRS geoprocessing tools that change attributes (like calculate field), these users need to bulk acquire and release locks in a programmatic way.

## Slide 3 — Acquire and Release Locks tool

Functional Requirements
Tool must operate as a standalone utility, independent of specific edit operations.
Tool requires a selection set to execute (similar pattern to Delete Routes tool)
Tool must support acquiring locks for:

  - Routes
  - Events
  - Mixed selections (routes + events)
Locks must be associated with:

  - The currently logged‑in user
  - The currently active version in the map.
Tool must support releasing locks based on:

  - The selected routes/events
  - The currently logged in user
  - The current active version in the map.
Tool must respect existing LRS locking rules and infrastructure.
Tool must fail gracefully if:

  - Selected entities are already locked by another user
  - User lacks edit privileges
  - Version does not support locking

## Slide 4 — Acquire and Release Locks tool

Acceptance Criteria
Given a valid selection set, the tool successfully acquires locks for all unlocked entities or removes locks for all locked entities.
Locks are visible and enforced immediately across concurrent sessions.
If any selected entity is already locked by another user, the tool reports which items failed and why.
Locks persist for the duration of the user’s editing session or until explicitly released.
Locks are scoped only to the active version and do not impact other versions.
Locks released are only in the active version for the active user.
Tool provides clear success, partial success, and failure messaging.
Tool parameters include:
LRS Network/Event (Feature Layer)
Acquire/Release (Boolean)

## Slide 5 — Testing

Acquire locks on:

  - Single route
  - Multiple routes in a single network
  - Single event
  - Multiple events in a single event layer
Verify lock enforcement across:

  - Multiple users
  - Multiple versions
Validate lock release based on:

  - Selected routes/events
  - The current version
  - The current user
Validate behavior when:

  - Selection includes already‑locked entities
  - No selection set
  - User lacks edit permissions
  - Version is read‑only
  - Regression testing with existing LRS edit tools to ensure no behavioral changes.
Python and Model Builder

## Slide 6 — Automation

Python‑based automation to:

  - Acquire/Release locks programmatically
  - Validate lock ownership and version scope
  - Attempt conflicting edits from a second user/session
  - Integration into existing LRS GP and editing automation pipelines.
Ensure automation covers partial‑success and failure scenarios.
Note automation will require calling a separate operation to make a selection set

## Slide 7 — Documentation

Create GP tool documentation using the established format
Include usage notes around how the tool can be used and the various types of locks that can be acquired and released

## Slide 8 — Assignment

Story Points:
Dev:  days
PE:  days
