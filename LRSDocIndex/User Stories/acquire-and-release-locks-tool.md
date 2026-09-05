# Acquire and Release Locks tool User Story

| Field | Value |
| --- | --- |
| **Doc** | 45 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Create tool AcquireReleaseLocks.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Create%20tool%20AcquireReleaseLocks.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2026-04-16 02:43 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | locks · route · event · lock acquisition · lock release · multi user editing · versioned environment |
| **Tools** | Acquire and Release Locks |

## Summary

Describes a standalone tool for LRS Editors to acquire and release route or event locks based on selection sets to prevent edit conflicts in a multi-user, versioned LRS environment. Covers functional requirements, acceptance criteria, testing scenarios, automation, and documentation plans for the tool. The tool supports lock management scoped to the active version and user, with clear messaging and error handling.

## Related documents

<!-- related:begin -->
- [Conflict Prevention: Acquire Locks in Create Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-acquire-locks-in-create-route.md>) — similar text 0.23 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:830 s=4.456 -->
- [Allow Locks to Transfer between Users in REST and Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-locks-to-transfer-between-users-in-rest-and-editing.md>) — similar text 0.24 · 1 title word · same kind/surface/folder <!-- rel:827 s=4.323 -->
- [Conflict Prevention: Acquire Locks when creating new routes in Create, Extend, Realign, and Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-acquire-locks-when-creating-new-routes.md>) — similar text 0.22 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:826 s=3.929 -->
- [Allow Append Events to Run When Locks Are Present on Impacted Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-append-events-to-run-when-locks-are-present.md>) — similar text 0.20 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:168 s=3.572 -->
- [Allow Locks to Transfer between Users in Location Referencing GP tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-locks-to-transfer-between-users-in-lr-gp.md>) — similar text 0.20 · 1 title word · same kind/surface/folder <!-- rel:828 s=3.212 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Release locks with the Release Locks tool](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/release-locks.html)

_No page matched:_ [Acquire and Release Locks](https://www.google.com/search?q=%22Acquire%20and%20Release%20Locks%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Acquire and Release Locks tool <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Editor, I need a standalone tool to explicitly acquire/release route or event locks based on a selection set, so that I can prevent edit conflicts while performing complex or long‑running edits in a multi‑user, versioned LRS environment.
Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents.  When running non LRS geoprocessing tools that change attributes (like calculate field), these users need to bulk acquire and release locks in a programmatic way.

## Acceptance Criteria
### Acquire and Release Locks tool <!-- slide 3 -->
Functional Requirements

- Tool must operate as a standalone utility, independent of specific edit operations.
- Tool requires a selection set to execute (similar pattern to Delete Routes tool)
- Tool must support acquiring locks for:
  - Routes
  - Events
  - Mixed selections (routes + events)
- Locks must be associated with:
  - The currently logged‑in user
  - The currently active version in the map.
- Tool must support releasing locks based on:
  - The selected routes/events
  - The currently logged in user
  - The current active version in the map.
- Tool must respect existing LRS locking rules and infrastructure.
- Tool must fail gracefully if:
  - Selected entities are already locked by another user
  - User lacks edit privileges
  - Version does not support locking

### Acquire and Release Locks tool <!-- slide 4 -->
Acceptance Criteria

- Given a valid selection set, the tool successfully acquires locks for all unlocked entities or removes locks for all locked entities.
- Locks are visible and enforced immediately across concurrent sessions.
- If any selected entity is already locked by another user, the tool reports which items failed and why.
- Locks persist for the duration of the user’s editing session or until explicitly released.
- Locks are scoped only to the active version and do not impact other versions.
- Locks released are only in the active version for the active user.
- Tool provides clear success, partial success, and failure messaging.
Tool parameters include:

- LRS Network/Event (Feature Layer)
- Acquire/Release (Boolean)

## Testing
<!-- slide 5 -->
- Acquire locks on:
  - Single route
  - Multiple routes in a single network
  - Single event
  - Multiple events in a single event layer
- Verify lock enforcement across:
  - Multiple users
  - Multiple versions
- Validate lock release based on:
  - Selected routes/events
  - The current version
  - The current user
- Validate behavior when:
  - Selection includes already‑locked entities
  - No selection set
  - User lacks edit permissions
  - Version is read‑only
  - Regression testing with existing LRS edit tools to ensure no behavioral changes.
- Python and Model Builder

## Automation
<!-- slide 6 -->
- Python‑based automation to:
  - Acquire/Release locks programmatically
  - Validate lock ownership and version scope
  - Attempt conflicting edits from a second user/session
  - Integration into existing LRS GP and editing automation pipelines.
- Ensure automation covers partial‑success and failure scenarios.
- Note automation will require calling a separate operation to make a selection set

## Documentation
<!-- slide 7 -->
- Create GP tool documentation using the established format
- Include usage notes around how the tool can be used and the various types of locks that can be acquired and released

## Assignment
<!-- slide 8 -->
Story Points:
Dev:  days
PE:  days
