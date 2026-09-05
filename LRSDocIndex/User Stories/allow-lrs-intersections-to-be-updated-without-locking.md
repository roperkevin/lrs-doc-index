# Allow LRS Intersections to be updated without locking intersecting routes

| Field | Value |
| --- | --- |
| **Doc** | 163 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Allow LRS Intersections to be updated without locking intersecting routes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Allow%20LRS%20Intersections%20to%20be%20updated%20without%20locking%20intersecting%20routes.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2025-05-16 22:13 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | intersections · route editing · conflict prevention · locks · lrs editor · update tool |
| **Tools** | LRS Intersections |

## Summary

This document describes a user story for updating LRS Intersections without locking intersecting routes, allowing multiple users to edit routes concurrently. It details a new optional parameter to ignore conflict prevention locks on intersecting routes, testing scenarios, automation updates, and documentation changes.

## Related documents

<!-- related:begin -->
- [Allow Append Events to Run When Locks Are Present on Impacted Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-append-events-to-run-when-locks-are-present.md>) — similar text 0.57 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:168 s=5.501 -->
- [Allow LRS Intersections to be updated without locking intersecting routes - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6758-allow-lrs-intersections-to-be-updated-without-locking.md>) — similar text 0.48 · 6 title words · same surface <!-- rel:155 s=4.845 -->
- [Allow LRS Events and Intersections in Update Measures from LRS tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-lrs-events-and-intersections-in-update-measures.md>) — similar text 0.25 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:393 s=4.275 -->
- [Generate Intersection at Self-Intersecting Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-intersection-at-self-intersecting-routes.md>) — similar text 0.23 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:509 s=4.16 -->
- [Generate Intersections at Route Endpoints](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-intersections-at-route-endpoints.md>) — similar text 0.23 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:267 s=3.666 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-lrs-intersection-properties.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html) · [Release locks with the Release Locks tool](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/release-locks.html)
<!-- docs:end -->

---

## Story
### Allow LRS Intersections to be updated without locking intersecting routes <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Editor, I need LRS intersections to be updated without locking intersecting routes, so that I can make additional route edits without blocking others from making route edits.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. When users make route edits and have LRS Intersections to be updated, we currently lock all the intersecting routes.  Users feedback has been that they want intersections to update without having to lock all the intersecting routes.  This story will remove that requirement.

## Acceptance Criteria
### LRS Intersections update without locking <!-- slide 3 -->
- Update the LRS Intersections tool with a new parameter “Ignore Conflict Prevention locks on intersecting routes”
- The parameter would be optional and only appear in the UI when conflict prevention is enabled on the LRS.  Default is unchecked.
- When disabled, the tool should work as it does today
- When enabled, continue to query locks for the intersecting routes, but do not acquire locks  on these intersecting routes when updating after a route edit
- The route that was edited must remain locked, but all the intersecting routes do not need to be locked (and can be locked by another user/version) to update the intersections
- If there are locks on intersecting routes, add a warning message to the GP output that alerts the user that there were intersecting routes that were locked (and provide the list of routeIDs)

## Testing
<!-- slide 4 -->
- Test with route edits when there is zero, one, and multiple intersecting routes
- Verify the tool still works as expected when conflict prevention is disabled and when the parameter is disabled
- Verify at least once in fgdb, dc, and fs
- Verify in Pro, python UI, python stand alone, and model builder

## Automation
<!-- slide 5 -->
- Update automation for the tool to account for this change

## Documentation
<!-- slide 6 -->
- Update documentation for the tool to mention how intersecting routes no longer need to be locked (and can be locked by another user/version) when this option is enabled and the tool will still run

## Assignment
<!-- slide 7 -->
Story Points:
Dev:  days
PE:  days
