# Allow LRS Intersections to be updated without locking intersecting routes

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Allow LRS Intersections to be updated without locking intersecting routes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Allow%20LRS%20Intersections%20to%20be%20updated%20without%20locking%20intersecting%20routes.pptx>) |
| **Edited** | 2025-05-16 22:13 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Allow LRS Intersections to be updated without locking intersecting routes"
source_file: "Allow LRS Intersections to be updated without locking intersecting routes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Allow%20LRS%20Intersections%20to%20be%20updated%20without%20locking%20intersecting%20routes.pptx"
doc_id: 163
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2025-05-16T22:13:28Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["intersections", "route editing", "conflict prevention", "locks", "lrs editor", "update tool"]
tools: ["LRS Intersections"]
products: []
issues: []
related: [{"doc":168,"file":"allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md","s":5.501},{"doc":155,"file":"allow-lrs-intersections-to-be-updated-without-locking-intersecting-routes-test__doc155.md","s":4.845},{"doc":393,"file":"allow-lrs-events-and-intersections-in-update-measures-from-lrs-tool__doc393.md","s":4.275},{"doc":509,"file":"generate-intersection-at-self-intersecting-routes__doc509.md","s":4.16},{"doc":267,"file":"generate-intersections-at-route-endpoints__doc267.md","s":3.666}]
```
-->

## Summary

This document describes a user story for updating LRS Intersections without locking intersecting routes, allowing multiple users to edit routes concurrently. It details a new optional parameter to ignore conflict prevention locks on intersecting routes, testing scenarios, automation updates, and documentation changes.

## Related documents

<!-- related:begin -->
- [Allow Append Events to Run When Locks Are Present on Impacted Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md>) — similar text 0.57 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:168 -->
- [Allow LRS Intersections to be updated without locking intersecting routes - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/allow-lrs-intersections-to-be-updated-without-locking-intersecting-routes-test__doc155.md>) — similar text 0.48 · 6 title words · same surface <!-- rel:155 -->
- [Allow LRS Events and Intersections in Update Measures from LRS tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-lrs-events-and-intersections-in-update-measures-from-lrs-tool__doc393.md>) — similar text 0.25 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:393 -->
- [Generate Intersection at Self-Intersecting Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-intersection-at-self-intersecting-routes__doc509.md>) — similar text 0.23 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:509 -->
- [Generate Intersections at Route Endpoints](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-intersections-at-route-endpoints__doc267.md>) — similar text 0.23 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:267 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-lrs-intersection-properties.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html) · [Release locks with the Release Locks tool](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/release-locks.html)
<!-- docs:end -->

---

## Slide 1 — Allow LRS Intersections to be updated without locking intersecting routes

User Story

## Slide 2 — User Story

As an LRS Editor, I need LRS intersections to be updated without locking intersecting routes, so that I can make additional route edits without blocking others from making route edits.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. When users make route edits and have LRS Intersections to be updated, we currently lock all the intersecting routes.  Users feedback has been that they want intersections to update without having to lock all the intersecting routes.  This story will remove that requirement.

## Slide 3 — LRS Intersections update without locking

Update the LRS Intersections tool with a new parameter “Ignore Conflict Prevention locks on intersecting routes”
The parameter would be optional and only appear in the UI when conflict prevention is enabled on the LRS.  Default is unchecked.
When disabled, the tool should work as it does today
When enabled, continue to query locks for the intersecting routes, but do not acquire locks  on these intersecting routes when updating after a route edit
The route that was edited must remain locked, but all the intersecting routes do not need to be locked (and can be locked by another user/version) to update the intersections
If there are locks on intersecting routes, add a warning message to the GP output that alerts the user that there were intersecting routes that were locked (and provide the list of routeIDs)

## Slide 4 — Testing

Test with route edits when there is zero, one, and multiple intersecting routes
Verify the tool still works as expected when conflict prevention is disabled and when the parameter is disabled
Verify at least once in fgdb, dc, and fs
Verify in Pro, python UI, python stand alone, and model builder

## Slide 5 — Automation

Update automation for the tool to account for this change

## Slide 6 — Documentation

Update documentation for the tool to mention how intersecting routes no longer need to be locked (and can be locked by another user/version) when this option is enabled and the tool will still run

## Slide 7 — Assignment

Story Points:
Dev:  days
PE:  days
