# REST: Referent to Geometry

|   |   |
| --- | --- |
| **Kind** | User Story · Server |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [REST Referent to Geometry.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/REST%20Referent%20to%20Geometry.pptx>) |
| **Edited** | 2023-02-10 00:07 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "REST: Referent to Geometry"
source_file: "REST Referent to Geometry.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/REST%20Referent%20to%20Geometry.pptx"
doc_id: 614
doc_kind: "User Story"
surface: "Server"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2023-02-10T00:07:12Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["referent", "route", "measure", "coordinate", "rest endpoint", "location conversion"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":608,"file":"rest-geometry-to-referent-user-story__doc608.md","s":9.775},{"doc":691,"file":"rest-station-to-geometry-user-story__doc691.md","s":5.982},{"doc":692,"file":"rest-geometry-to-station-user-story__doc692.md","s":5.459},{"doc":587,"file":"rest-geometry-to-referent-test-plan__doc587.md","s":3.421},{"doc":563,"file":"test-plan-for-rest-referent-to-geometry__doc563.md","s":3.018}]
```
-->

## Summary

User story for creating a REST endpoint that converts a referent location along a route into a coordinate, route, and measure. The endpoint accepts referent layer, feature, offset, and units as inputs and returns all valid route/measure values at the location. It includes error handling for invalid layers, features, and locating errors, and supports optional temporal view date, spatial reference, and geodatabase version parameters.

## Related documents

<!-- related:begin -->
- [REST: Geometry to Referent User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-geometry-to-referent-user-story__doc608.md>) — similar text 0.80 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:608 -->
- [REST: Station to Geometry User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-station-to-geometry-user-story__doc691.md>) — similar text 0.68 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:691 -->
- [REST: Geometry to Station User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-geometry-to-station-user-story__doc692.md>) — similar text 0.60 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:692 -->
- [REST Geometry to Referent Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/rest-geometry-to-referent-test-plan__doc587.md>) — similar text 0.16 · 3 title words · 1 filename word · same surface <!-- rel:587 -->
- [Test Plan for REST Referent To Geometry](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/test-plan-for-rest-referent-to-geometry__doc563.md>) — similar text 0.15 · 3 title words · same surface <!-- rel:563 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/storing-referent-and-offset-information-for-event-location.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html)
<!-- docs:end -->

---

## Slide 1 — REST: Referent to Geometry

User Story

## Slide 2 — User Story

As a LRS Developer, I want to be able to convert a referent location along a route into a coordinate (or route/measure), so I can utilize this operation in custom applications my organization creates that involve converting back and forth between a referent location from the field to a coordinate/route/measure in the LRS system.
Persona
LRS Developer: This user is responsible for extending Roads and Highways/Pipeline Referencing utilizing the LRS REST endpoints and other SDKs provided within ArcGIS.  For organizations that utilize referent locations in conjunction with their LRS, they need to be ability to convert between a referent location and coordinate (or route/measure) in a similar manner to how our measureToGeometry endpoint works.

## Slide 3 — Referent to Geometry

Create a REST endpoint that will take a referent layer (point), referent feature, and offset, and offset units as the inputs and provides a coordinate, route and measure as the outputs
Users should be able to provide one or more referent feature/offset values that will be converted into coordinates, route, and measure
If there is more than one route/measure at the location returned, provide all valid values in the return
Software Engineer that is assigned the story will create the signature and review with the team
Consider utilizing existing measureToGeometry endpoint as a guide
Input parameters for the tool include: Locations (required, should include layerID of referent layer, OID of referent feature, offset, and offset units), the Temporal View Date (optional), Output Spatial Reference (optional), and gdb Version (optional)
For offset units, use the existing Esri units
If the referent layer doesn’t exist, return an error about the layer not existing
If the referent layer isn’t a point layer, return an error about the layer not being a point feature
If the referent feature isn’t on a route (so no measure can be found), return an error alerting the user that it’s not located on a route in the LRS Network
Utilize the existing Locating Errors for measureToGeometry for scenarios where the geometry can’t be located
If temporal view date is empty, return all the coordinate/route&measure locations across time for the referent
If the Output Spatial Reference is empty, return using the coordinates of the spatial reference the service was published with
If the gdb Version is empty, use the version the service was published with

## Slide 4 — Testing

Test on a mix RH and APR data
Test on a variety of route geometries (gapped, loop, lollipop, alpha, branch, vertical)
Validate all the locating errors
Test with both LRS features (intersections, events) and non LRS features (regular point feature classes) as referents
Test with different units as the offset from the LRS Network units

## Slide 5 — Automation

Automate the endpoint in a similar manner to the other REST endpoints we support

## Slide 6 — Documentation

Create a new topic in our REST API documentation
Software Engineer should work with Jim on this documentation topic
Use the existing measureToGeometry endpoint is a guide for what to include (locating errors, etc.)

## Slide 7 — Assignment

Story Points:
Dev:
PE:
