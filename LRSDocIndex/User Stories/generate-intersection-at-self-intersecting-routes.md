# Generate Intersection at Self-Intersecting Routes

| Field | Value |
| --- | --- |
| **Doc** | 509 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [GenerateIntersectionsatselfintersectingRoutes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/GenerateIntersectionsatselfintersectingRoutes.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE — · dev — |
| **Edited** | 2023-09-01 16:36 by Lakshmi Ananthanarayanan |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | intersection · self intersecting route · route editing · generate intersection tool · cartographic realign · measure · conflict prevention |
| **Tools** | Generate Intersection |

## Summary

This document describes a user story for enhancing the generate intersection tool to create intersection points at locations where a route self-intersects in the LRS. It covers the behavior of intersection creation, updating, and retirement based on route edits and cartographic realignments. Testing scenarios include various database types, route shapes, conflict prevention, and measure calculations.

## Related documents

<!-- related:begin -->
- [Allow LRS Intersections to be updated without locking intersecting routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-lrs-intersections-to-be-updated-without-locking.md>) — similar text 0.23 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:163 s=4.16 -->
- [Generate Intersections at Route Endpoints](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-intersections-at-route-endpoints.md>) — similar text 0.24 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:267 s=4.055 -->
- [Support Complex Route Shapes in Generate Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-generate-routes.md>) — similar text 0.24 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:849 s=4.011 -->
- [Generate LRS Intersection GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-lrs-intersection-gp.md>) — similar text 0.23 · 2 title words · 1 filename word · same surface/folder <!-- rel:834 s=3.755 -->
- [Allow LRS Intersections to be updated without locking intersecting routes - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6758-allow-lrs-intersections-to-be-updated-without-locking.md>) — similar text 0.30 · 2 title words · 1 filename word · same surface <!-- rel:155 s=3.272 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-intersection-properties.html) · [Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-cartographic-realignment.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html)

_No page matched:_ [Generate Intersection](https://www.google.com/search?q=%22Generate%20Intersection%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Generate Intersection at self closing routes

User Story

![Figure 1 — Generate Intersection at self closing routes](../media/generate-intersection-at-self-intersecting-routes/fig-01-slide-01-generate-intersection-at-self-closing.svg)

## Slide 2 — User Story

As an LRS editor, I want to generate intersection points at the location where a route self closes.
This is a request from local government customers.
Persona
LRS Editor: This user is responsible for making edits to the LRS.
In Pro, Currently we do not support generation of intersections at the self intersecting location on the routes. We need to enhance the generate intersection tool to generate intersection points at these self intersecting locations.

![Figure 2 — User Story](../media/generate-intersection-at-self-intersecting-routes/fig-02-slide-02-user-story.svg)

## Slide 3 — Generate Intersection at the self intersecting location of a route

If the intersection layer is same as the parent LRS network for an intersection feature class, then generate intersection GP tool should generate intersection at the self intersecting locations of the route.
Since there will be more than one measure value at the intersection, the measure column can have any one of the value.
When updating the intersection

- If a self intersecting route is created due to edit activities, new intersection will be created.
- If the route do not self intersect anymore due to an edit activity, then the intersection is retired.
- If the self intersecting point moves due to cartographic realign, present intersection will be moved
- If the route is deleted or do not intersect anymore due to carto realign, then the intersection point is deleted

[figure: R1 · 0 · 3.6 · 2.3 · 1 · 5]

![Figure 3 — Generate Intersection at the self intersecting location of a route](../media/generate-intersection-at-self-intersecting-routes/fig-03-slide-03-generate-intersection-at-the-self.png)

![Figure 4 — Generate Intersection at the self intersecting location of a route](../media/generate-intersection-at-self-intersecting-routes/fig-04-slide-03-generate-intersection-at-the-self.svg)

## Slide 4 — Database Type

Testing

Test in  Fgdb, direct connect, Branch Versioned FS – default and in a version
Test in RH ,APR,  UN and PoM data
Test with the intersection combination : Route –Route (Same Network)
Test with complex route shapes
Test with intersection creation and updating after route edit activities
Test with & without conflict prevention enabled. If conflict prevention is enabled, then lock should be acquired for the route on which intersection is generated
While creating the LRS intersection feature class, if the option Z values are considered for intersection is checked or unchecked accordingly  self intersection is decided and intersection is generated. Have test cases to cover this scenario.
If the Only Create Intersections for Routes Edited by Me in the Current Version option is checked, while generating intersections, it should be honored
Run the GP tool Calculate Intersecting Route Measures for related Table with all intersecting route measures and verify records are created for all the valid measures on the self intersecting location of the route.

![Figure 5 — Database Type](../media/generate-intersection-at-self-intersecting-routes/fig-05-slide-04-database-type.svg)

## Slide 5 — Database Type

Documentation

Modify already existing usage note related to this user story as
“Intersections are generated at the self intersecting locations of the route”
Automation
To the automation of generate intersection GP tool add couple of  cases for self intersecting route scenario

![Figure 6 — Database Type](../media/generate-intersection-at-self-intersecting-routes/fig-06-slide-05-database-type.svg)

## Slide 6

Assignment

Story Points:
Dev:
PE:

![Figure 7 — Assignment](../media/generate-intersection-at-self-intersecting-routes/fig-07-slide-06-assignment.svg)
