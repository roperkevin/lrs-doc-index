# Allow Locks to Transfer between Users in Location Referencing GP tools

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [AllowLockstoTransferBetweenUsersinGPTools.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AllowLockstoTransferBetweenUsersinGPTools.pptx>) |
| **Edited** | 2020-03-12 22:32 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Allow Locks to Transfer between Users in Location Referencing GP tools"
source_file: "AllowLockstoTransferBetweenUsersinGPTools.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AllowLockstoTransferBetweenUsersinGPTools.pptx"
doc_id: 828
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-03-12T22:32:38Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["lock transfer", "conflict prevention", "geoprocessing tools", "asynchronous execution", "route lock", "event lock", "location referencing"]
tools: []
products: []
issues: []
related: [{"doc":827,"file":"allow-locks-to-transfer-between-users-in-rest-and-editing-tools__doc827.md","s":8.79},{"doc":714,"file":"hide-lock-transfer-in-event-editor-for-pro-services__doc714.md","s":3.716},{"doc":168,"file":"allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md","s":3.68},{"doc":163,"file":"allow-lrs-intersections-to-be-updated-without-locking-intersecting-routes__doc163.md","s":3.383},{"doc":826,"file":"conflict-prevention-acquire-locks-when-creating-new-routes-in-create-extend__doc826.md","s":3.382}]
```
-->

## Summary

User story describing the need to transfer locks between users in Location Referencing geoprocessing tools to enable post editing tasks. It specifies conditions under which lock transfer is allowed asynchronously with conflict prevention enabled and outlines positive and negative test scenarios.

## Related documents

<!-- related:begin -->
- [Allow Locks to Transfer between Users in REST and Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-locks-to-transfer-between-users-in-rest-and-editing-tools__doc827.md>) — similar text 0.64 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:827 -->
- [Hide Lock Transfer in Event Editor for Pro Services](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/hide-lock-transfer-in-event-editor-for-pro-services__doc714.md>) — similar text 0.30 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:714 -->
- [Allow Append Events to Run When Locks Are Present on Impacted Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md>) — similar text 0.17 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:168 -->
- [Allow LRS Intersections to be updated without locking intersecting routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-lrs-intersections-to-be-updated-without-locking-intersecting-routes__doc163.md>) — similar text 0.19 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:163 -->
- [Conflict Prevention: Acquire Locks when creating new routes in Create, Extend, Realign, and Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-acquire-locks-when-creating-new-routes-in-create-extend__doc826.md>) — similar text 0.28 · 1 title word · same kind/surface/folder <!-- rel:826 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)
<!-- docs:end -->

---

## Slide 1 — Allow Locks to Transfer between Users in Location Referencing GP tools

User Story

## Slide 2 — User Story

As a Location Referencing user, I need to be able to transfer locks from one user to another, so that we can run post editing geoprocessing tasks before posting the edits.

## Slide 3 — Lock transfer in Async GP tools

Relax the restrictions on the Acquire Locks logic used in the Location Referencing GP tools that support conflict prevention when executed in an asynchronous manner to allow a user (U2) to acquire a route/line/event lock on route R1/event E1 that another user (U1) currently has if the following conditions are met:

  - Version U1.V1 is public
  - User U2 is making the request in the same version (U1.V1) that user U1 has the lock in
  - User U1 does not currently have an edit session open in version U1.V1
If the above conditions are met, update the existing lock with the new user who owns it
If any of these conditions aren’t met and a request is made by user U2 to acquire a route/line/event lock on R1/E1, fail to acquire the lock and give the same message we do today
This should only apply to Location Referencing GP tools run in an asynchronous manner from an LRS with Conflict Prevention enabled

## Slide 4 — Testing

Verify in all GP tools that support Conflict Prevention when executed asynchronously
Negative

  - Attempt to acquire using a different version than the lock already exists in
  - Attempt to acquire while user with existing lock has edit session open in the same version
Positive

  - Attempt to acquire while user with existing lock has no edit session open
  - Attempt to acquire while user with existing lock has an edit session open in a different version than the lock is in
  - Attempt to acquire while a third user has an edit session open in the version the lock is in
  - Verify tool isn’t impacted when Conflict Prevention isn’t enabled (automated tests will cover this for some tools)
  - Verify tool isn’t impacted when not run asynchronously (automated tests should handle this)

## Slide 5 — Assignment

Story Points:
Dev:
PE:
