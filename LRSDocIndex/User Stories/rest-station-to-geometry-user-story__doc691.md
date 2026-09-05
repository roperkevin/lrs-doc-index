# REST: Station to Geometry User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Server |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [REST Station to Geometry.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/REST%20Station%20to%20Geometry.pptx>) |
| **Edited** | 2021-11-17 00:15 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "REST: Station to Geometry User Story"
source_file: "REST Station to Geometry.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/REST%20Station%20to%20Geometry.pptx"
doc_id: 691
doc_kind: "User Story"
surface: "Server"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2021-11-17T00:15:37Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["rest endpoint", "stationing measure", "coordinates", "route", "xyzm", "lrs developer", "road and highways", "pipeline referencing"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":692,"file":"rest-geometry-to-station-user-story__doc692.md","s":9.178},{"doc":614,"file":"rest-referent-to-geometry__doc614.md","s":5.982},{"doc":608,"file":"rest-geometry-to-referent-user-story__doc608.md","s":5.835},{"doc":740,"file":"sort-results-by-distance-in-geometrytomeasure-rest-endpoint__doc740.md","s":3.964},{"doc":742,"file":"support-reverse-route-in-rest__doc742.md","s":2.937}]
```
-->

## Summary

User story for creating a REST endpoint that converts stationing measures to XYZM coordinates for routes. The endpoint accepts one or more RouteID/Station Measure inputs and returns coordinates, supporting optional temporal view date, spatial reference, and geodatabase version parameters. It includes error handling for missing stationing event types and follows the format of the existing 10.x LRS endpoints.

## Related documents

<!-- related:begin -->
- [REST: Geometry to Station User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-geometry-to-station-user-story__doc692.md>) — similar text 0.84 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:692 -->
- [REST: Referent to Geometry](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-referent-to-geometry__doc614.md>) — similar text 0.68 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:614 -->
- [REST: Geometry to Referent User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-geometry-to-referent-user-story__doc608.md>) — similar text 0.63 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:608 -->
- [Sort results by distance in geometryToMeasure REST endpoint](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/sort-results-by-distance-in-geometrytomeasure-rest-endpoint__doc740.md>) — similar text 0.18 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:740 -->
- [Support Reverse Route in REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-in-rest__doc742.md>) — similar text 0.18 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:742 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html)

_No page matched:_ [referent to geometry](https://www.google.com/search?q=%22referent%20to%20geometry%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — REST: Station to Geometry

User Story

## Slide 2 — User Story

As a LRS Developer, I want to be able to convert my stationing measure to coordinates, so I can utilize this operation in custom applications my organization creates that involve going back and forth between stationing measures and coordinates.
Persona
LRS Developer: This user is responsible for extending Roads and Highways/Pipeline Referencing utilizing the LRS REST endpoints and other SDKs provided within ArcGIS.  For organizations that utilize our stationing event type, they need to be ability to convert between a station measure and the actual coordinates in a similar manner to how our measureToGeometry endpoint works.

## Slide 3 — Station to Geometry

Create a REST endpoint that will take a RouteID and Stationing Measure as the input and provide a XYZM coordinates as the output
Users should be able to provide one or more RouteID/Stationing Measures that will be converted into coordinates
For each RouteID/Stationing Measure, the endpoint should find where that location is on the route and determine the XYZM coordinates at that location to be returned
Software Engineer that is assigned the story will create the signature and review with the team
This endpoint exists in the 10.x version of the LRS endpoints, so try to follow the same format of that existing endpoint if possible (https://roadsandhighwayssample.esri.com/roads/api/index.html)
Input parameters for the tool include: Locations (required, one or more RouteID/Station Measure combinations), the Temporal View Date (optional), Output Spatial Reference (optional), and gdb Version (optional)
If temporal view date is empty, return all the coordinate locations across time for the RouteID/Station Measure
If the Output Spatial Reference is empty, return using the coordinates of the spatial reference the service was published with
If the gdb Version is empty, use the version the service was published with
If the LRS the Network is a part of doesn’t have a stationing event type configured, the operation should fail, and we should return an error message letting the user know that no stationing event type exists for that Network
Add any other error conditions that exist for the endpoint in the 10.x version of the endpoints

## Slide 4 — Testing

Test on both RH and APR data
Test on data with and without a stationing event type configured
Test on a variety of route geometries (gapped, loop, lollipop, alpha, branch, vertical)
Utilize locations where there are downstream stations with and without a back station value

## Slide 5 — Automation

Automate the endpoint in a similar manner to the other REST endpoints we support

## Slide 6 — Documentation

Create a new topic in our REST API documentation
Software Engineer should work with Jim on this documentation topic
Use the existing 10.x endpoint topic as a guide for the description and example usage

## Slide 7 — Assignment

Story Points:
Dev:
PE:
