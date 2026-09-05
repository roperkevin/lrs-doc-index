# Allow Locks to Transfer between Users in REST and Editing Tools

| Field | Value |
| --- | --- |
| **Doc** | 827 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [AllowLockstoTransferBetweenUsersinRESTandEditingTools.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AllowLockstoTransferBetweenUsersinRESTandEditingTools.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-03-12 22:34 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | lock transfer · route lock · event lock · edit session · conflict prevention · multi user editing |
| **Tools** | Acquire Locks REST endpoint · Event Editor · ArcGIS Pro editing tools |

## Summary

Describes a user story for enabling lock transfer between users in REST endpoints and editing tools to support multi-step workflows requiring multiple users to edit before posting. Details conditions for lock transfer in REST and behavior in ArcGIS Pro and Event Editor tools. Includes testing scenarios and automation plans.

## Related documents

<!-- related:begin -->
- [Allow Locks to Transfer between Users in Location Referencing GP tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-locks-to-transfer-between-users-in-lr-gp.md>) — similar text 0.64 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:828 s=8.79 -->
- [Acquire and Release Locks tool User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/acquire-and-release-locks-tool.md>) — similar text 0.24 · 1 title word · same kind/surface/folder <!-- rel:45 s=4.323 -->
- [Conflict Prevention for Event Editing in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-for-event-editing-in-pro.md>) — similar text 0.27 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:683 s=4.261 -->
- [Hide Lock Transfer in Event Editor for Pro Services](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/753-hide-lock-transfer-in-event-editor-for-pro-services.md>) — similar text 0.31 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:714 s=3.81 -->
- [Conflict Prevention: Acquire Locks when creating new routes in Create, Extend, Realign, and Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-acquire-locks-when-creating-new-routes.md>) — similar text 0.36 · 1 title word · same kind/surface/folder <!-- rel:826 s=3.625 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html)

_No page matched:_ [Acquire Locks REST endpoint](https://www.google.com/search?q=%22Acquire%20Locks%20REST%20endpoint%22+site%3Adoc.esri.com) · [Event Editor](https://www.google.com/search?q=%22Event%20Editor%22+site%3Adoc.esri.com) · [ArcGIS Pro editing tools](https://www.google.com/search?q=%22ArcGIS%20Pro%20editing%20tools%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Allow Locks to Transfer between Users in REST and Editing tools <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing user, I need to be able to transfer locks from one user to another, so that we can complete multi step workflows where more than one user needs to make edits before posting.

## Acceptance Criteria
### Lock transfer in REST <!-- slide 3 -->
- Relax the restrictions on the Acquire Locks REST endpoint to allow a user (U2) to acquire a route/line lock on route R1 that another user (U1) currently has if the following conditions are met:
  - Version U1.V1 is public
  - User U2 is making the request in the same version (U1.V1) that user U1 has the lock in
  - User U1 does not currently have an edit session open in version U1.V1
- If the above conditions are met, update the existing lock(s) with the new user who owns it(them)
- If any of these conditions aren’t met and a request is made by user U2 to acquire a route/line lock on R1, fail to acquire the lock and give the same message we do today

### Lock transfer in Pro/EE editing tools <!-- slide 4 -->
- In ArcGIS Pro, if a user attempts to acquire a line/route lock on route R1 using any of the editing tools that acquire locks (Create, Extend, Retire, Realign, Reassign, Calibrate, Cartographic Realignment), make the request to the Acquire Locks REST endpoint the same way we do today
- If the lock is able to be transferred to the new user, give the acquire lock messaging we do today in the UI and acquire the lock (note if the existing lock is an event lock, it should be changed to a route/line lock)
- If the lock is unable to be transferred to the new user, give the unable to acquire lock messaging we do today in the tool UI
- In Event Editor, if a user attempts to acquire an event lock on an event on route R1 using any of the tools/widgets that acquire locks (Add Linear Events, Add Point Events, Event Attribute table, Attribute Set table, Split Events, Merge Events), make the request to the Acquire Locks REST endpoint the same way we do today
- If the lock is able to be transferred to the new user, give the acquire lock messaging we do today in the UI and acquire the lock (note if the existing lock is a route/line lock, make the new lock the same type of lock)
- If the lock is unable to be transferred to the new user, give the unable to acquire lock messaging we do today in the tool UI

## Testing
<!-- slide 5 -->
- Verify in REST, Pro, and Event Editor
- Negative
  - Attempt to acquire using a different version than the lock already exists in
  - Attempt to acquire while user with existing lock has edit session open in the same version
- Positive
  - Attempt to acquire while user with existing lock has no edit session open
  - Attempt to acquire while user with existing lock has an edit session open in a different version than the lock is in
  - Attempt to acquire while a third user has an edit session open in the version the lock is in
  - Verify existing locking using ArcMap published services is not impacted/changed

## Automation
<!-- slide 6 -->
- Automate in REST by adding specific cases to the existing tests
- Automate in Pro using TestComplete by adding to the existing conflict prevention test cases
- Note that some of the existing negative test cases may be positive cases now

## Documentation
### Doc <!-- slide 7 -->
- Update existing conflict prevention topics for both Pro and Event Editor (both Pipeline Referencing and Roads and Highways) to mention support for these workflows (for Roads and Highways, will need to mention it’s only for services publishing using ArcGIS Pro/Version Management Service capability)

## Assignment
<!-- slide 8 -->
Story Points:
Dev:
PE:
