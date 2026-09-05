# Related Table for Intersection Measures

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [RelatedTableIntersectionMeasures.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RelatedTableIntersectionMeasures.pptx>) |
| **Edited** | 2022-02-21 22:32 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Related Table for Intersection Measures"
source_file: "RelatedTableIntersectionMeasures.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RelatedTableIntersectionMeasures.pptx"
doc_id: 678
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2022-02-21T22:32:02Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["intersection", "route measures", "related table", "temporal view", "python script", "lrs analyst"]
tools: ["Location Referencing toolbox"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":704,"file":"support-populating-route-name-in-update-measures-from-lrs-tool__doc704.md","s":4.041},{"doc":696,"file":"update-intersection-referent-tool-user-story__doc696.md","s":3.601},{"doc":266,"file":"support-events-spanning-routes-in-update-measures-from-lrs__doc266.md","s":3.473},{"doc":710,"file":"consider-concurrencies-in-update-measures-from-lrs__doc710.md","s":3.259},{"doc":509,"file":"generate-intersection-at-self-intersecting-routes__doc509.md","s":2.894}]
```
-->

## Summary

User story for creating a python script tool in ArcGIS Pro that generates a related table listing all routes and their measures at each LRS Intersection feature. The tool supports temporal filtering and outputs route measures with associated time slices for intersections, including self intersections. It is intended to help LRS analysts feed measure information into other systems.

## Related documents

<!-- related:begin -->
- [Support populating Route Name in Update Measures from LRS tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-populating-route-name-in-update-measures-from-lrs-tool__doc704.md>) — similar text 0.38 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:704 -->
- [Update Intersection Referent Tool User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-intersection-referent-tool-user-story__doc696.md>) — similar text 0.27 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:696 -->
- [Support Events Spanning Routes in Update Measures from LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-events-spanning-routes-in-update-measures-from-lrs__doc266.md>) — similar text 0.36 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:266 -->
- [Consider concurrencies in Update Measures from LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/consider-concurrencies-in-update-measures-from-lrs__doc710.md>) — similar text 0.29 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:710 -->
- [Generate Intersection at Self-Intersecting Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-intersection-at-self-intersecting-routes__doc509.md>) — similar text 0.23 · 1 title word · same kind/surface/folder <!-- rel:509 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-intersection-properties.html)

_No page matched:_ [Location Referencing toolbox](https://www.google.com/search?q=%22Location%20Referencing%20toolbox%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Related Table for Intersection Measures

User Story

## Slide 2 — User Story

As a LRS Analyst, I want the measures for all routes that are part of an LRS Intersection feature, so I can continue to feed this measure information into other systems that require all the route measures at a given location.
Persona
LRS Analyst: This user is responsible for analysis and reporting on LRS data.  This user may also have other titles/responsibilities within the organization, such as LRS editor or HPMS coordinator.  For the analyst role, this user utilizes other tools/capabilities within the Esri ecosystem as well as via home built and partner solutions. In this case, users need to have the measures for all the routes that compose an LRS Intersection feature to help with other 3rd party systems they have in their organization.  In ArcMap, we used to provide multiple points at a common location, so users had the ability to get this information.  With the new single point at each intersection model in Pro, users need a way to continue to get this information.

## Slide 3 — Related table with all intersecting route measures

Create a python script (that should still appear in the Location Referencing toolbox in Pro?) that creates a related table of all the routes and measures at each intersection location
Input layers include:

  - Intersection Feature Class (must be an LRS Intersection feature class in the Pro format; let’s only support a direct connect to the feature class for now)
  - Temporal View Date (optional, if populated only run against Intersections active during that date; if empty, run against all intersections)
  - Output Location Table (can be a new table or can overwrite an existing table; the table can be in the LRS gdb or another gdb)
The output table should include an IntersectionID (same field type and length as in Intersection FC), RouteID (same field type and length as in Network FC), Measure (double), From Date (date), and To Date (date)
Each route that is a part of the Intersection should have a separate row in the output table with the IntersectionID, the measure for the route at that intersection location, and the From and To Date for the route time slice
If the location of the intersection sits on a route at a self intersection/closing point, create records for all the valid measures on that route
If the Temporal View Date is not populated, there could be multiple time slices of a given intersection, which could have different route time slices in the output

![image1.png](../media/doc241_image1.png)

## Slide 4 — Testing

Test on one RH dataset and one APR dataset
Verify the tool only executes against the Pro intersection type
Test using intersections that are only routes as well as intersections of routes with other intersecting layers
Run against intersections that are at self intersection points on routes

## Slide 5 — Automation

Automate the tool in python following the established pattern for GP tools

## Slide 6 — Documentation

Document the tool with a new GP topic that follows the GP format
Add a note to the topic https://pro.arcgis.com/en/pro-app/latest/help/production/roads-highways/create-and-modify-lrs-intersections.htm (and the Pipeline Referencing version) that mentions the tool and that it will create an output table of all the routes at each intersection and their measure

## Slide 7 — Assignment

Story Points:
Dev:
PE:
