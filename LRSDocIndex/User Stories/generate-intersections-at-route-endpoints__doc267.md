# Generate Intersections at Route Endpoints

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Source** | [GenerateIntersectionsRouteEndpoints.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/GenerateIntersectionsRouteEndpoints.pptx>) |
| **Edited** | 2024-12-19 00:52 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Generate Intersections at Route Endpoints"
source_file: "GenerateIntersectionsRouteEndpoints.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/GenerateIntersectionsRouteEndpoints.pptx"
doc_id: 267
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2024-12-19T00:52:04Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["route endpoints", "intersections", "route edits", "cartographic realignment", "route retirement"]
tools: ["Create LRS Intersection", "Create LRS Intersections from Existing Dataset", "Generate Intersection"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":509,"file":"generate-intersection-at-self-intersecting-routes__doc509.md","s":4.055},{"doc":163,"file":"allow-lrs-intersections-to-be-updated-without-locking-intersecting-routes__doc163.md","s":3.666},{"doc":260,"file":"generate-a-route-log-using-the-glrsdp-gp-tool-test-plan__doc260.md","s":3.248},{"doc":268,"file":"add-line-events-point-offset-method__doc268.md","s":3.072},{"doc":393,"file":"allow-lrs-events-and-intersections-in-update-measures-from-lrs-tool__doc393.md","s":3.053}]
```
-->

## Summary

This document describes a user story for adding intersection points at route endpoints in the LRS to facilitate locating new events from field data. It specifies a new optional parameter for intersection creation tools to generate intersections at route endpoints and outlines expected behaviors during route edits and retirements. Testing, automation updates, and documentation changes related to this feature are also detailed.

## Related documents

<!-- related:begin -->
- [Generate Intersection at Self-Intersecting Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-intersection-at-self-intersecting-routes__doc509.md>) — similar text 0.24 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:509 -->
- [Allow LRS Intersections to be updated without locking intersecting routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-lrs-intersections-to-be-updated-without-locking-intersecting-routes__doc163.md>) — similar text 0.23 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:163 -->
- [Generate a Route Log using the GLRSDP GP Tool – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/generate-a-route-log-using-the-glrsdp-gp-tool-test-plan__doc260.md>) — similar text 0.08 · 2 title words · 2 filename words · same surface <!-- rel:260 -->
- [Add Line Events Point Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-events-point-offset-method__doc268.md>) — similar text 0.30 · same kind/surface/folder <!-- rel:268 -->
- [Allow LRS Events and Intersections in Update Measures from LRS tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-lrs-events-and-intersections-in-update-measures-from-lrs-tool__doc393.md>) — similar text 0.23 · 1 title word · same kind/surface/folder <!-- rel:393 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create and modify LRS intersections](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-and-modify-lrs-intersections.html) · [View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-intersection-properties.html) · [Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-cartographic-realignment.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/retire-routes.html)

_No page matched:_ [Create LRS Intersections from Existing Dataset](https://www.google.com/search?q=%22Create%20LRS%20Intersections%20from%20Existing%20Dataset%22+site%3Adoc.esri.com) · [Generate Intersection](https://www.google.com/search?q=%22Generate%20Intersection%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Generate Intersections at Route Endpoints

User Story

## Slide 2 — User Story

As an LRS Editor, I need intersection points to be added at route endpoints, so that I can locate new events from the field that come in via this collection method.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. For some users, their event data comes in via offsets from the beginning or end of a route. Users want to be able to locate events by entering this information via intersections and store the referent information.

## Slide 3 — Generate Intersections at Route Endpoints

Add an optional parameter that is a Boolean/checkbox to the Create LRS Intersection and Create LRS Intersections from Existing Dataset tools called “Generate Intersections at Route Endpoints”
If unchecked, the tool should work the same way it does today
If checked, and the intersection layer is same as the parent LRS network for an intersection feature class, then the Generate Intersection GP tool should generate intersection at the endpoints (beginning and end) of each route.
It should not generate intersections at the ends of physical gaps on routes
When updating the intersection:

  - If a new route is created or the endpoints of a route change, retire the old and update the new intersections.
  - If a route is retired, retire the intersections.
  - If the ends of a route change via cartographic realignment, move the intersection to the new location

## Slide 4 — Testing

Test with fgdb, direct connect (traditional and branch), and feature service (in a mix of default and versions)
Test with RH, APR, APR-UN, Addressing, and Postmile Data
Test with Route-Route intersection combinations
Test on a few complex route shapes (loop, lollipop, alpha)
Test as part of route edits that change the route endpoints

## Slide 5 — Automation

Add a few python automation cases to Create LRS Intersections, Create LRS Intersections from Existing, and Generate Intersections
Existing automation may break with new parameters, update as needed

## Slide 6 — Documentation

Update the two Create LRS Intersection topics to discuss this new parameter
Add a usage note to Generate Intersections discussing when these endpoint intersections would be created

## Slide 7 — Assignment

Story Points:
Dev:
PE:
