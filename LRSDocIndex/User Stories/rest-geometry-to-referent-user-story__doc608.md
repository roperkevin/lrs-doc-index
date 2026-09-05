# REST: Geometry to Referent User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Server |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [REST Geometry to Referent.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/REST%20Geometry%20to%20Referent.pptx>) |
| **Edited** | 2023-02-10 23:01 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "REST: Geometry to Referent User Story"
source_file: "REST Geometry to Referent.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/REST%20Geometry%20to%20Referent.pptx"
doc_id: 608
doc_kind: "User Story"
surface: "Server"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2023-02-10T23:01:34Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["referent", "rest endpoint", "route measure", "coordinate conversion", "locating errors", "offset", "referent selection"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":614,"file":"rest-referent-to-geometry__doc614.md","s":9.772},{"doc":692,"file":"rest-geometry-to-station-user-story__doc692.md","s":6.652},{"doc":691,"file":"rest-station-to-geometry-user-story__doc691.md","s":5.836},{"doc":740,"file":"sort-results-by-distance-in-geometrytomeasure-rest-endpoint__doc740.md","s":3.636},{"doc":587,"file":"rest-geometry-to-referent-test-plan__doc587.md","s":3.548}]
```
-->

## Summary

User story for creating a REST endpoint that converts an XYZ coordinate or route/measure into a referent and offset using a referent point layer. The endpoint supports options for referent selection, tolerance, spatial references, and temporal view date, with error handling for invalid inputs. Testing and automation plans are included, along with documentation guidance.

## Related documents

<!-- related:begin -->
- [REST: Referent to Geometry](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/rest-referent-to-geometry__doc614.md>) — similar text 0.81 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:614 -->
- [REST: Geometry to Station User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-geometry-to-station-user-story__doc692.md>) — similar text 0.67 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:692 -->
- [REST: Station to Geometry User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/rest-station-to-geometry-user-story__doc691.md>) — similar text 0.64 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:691 -->
- [Sort results by distance in geometryToMeasure REST endpoint](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/sort-results-by-distance-in-geometrytomeasure-rest-endpoint__doc740.md>) — similar text 0.30 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:740 -->
- [REST Geometry to Referent Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/rest-geometry-to-referent-test-plan__doc587.md>) — similar text 0.21 · 3 title words · 1 filename word · same surface <!-- rel:587 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/storing-referent-and-offset-information-for-event-location.html)
<!-- docs:end -->

---

## Slide 1 — REST: Geometry to Referent

User Story

## Slide 2 — User Story

As a LRS Developer, I want to be able to convert a coordinate location (or route/measure) along a route into a referent and offset, so I can utilize this operation in custom applications my organization creates that involve converting back and forth between a coordinate/route/measure in the LRS system to a referent location from the field.
Persona
LRS Developer: This user is responsible for extending Roads and Highways/Pipeline Referencing utilizing the LRS REST endpoints and other SDKs provided within ArcGIS. For organizations that utilize referent locations in conjunction with their LRS, they need to be ability to convert between a referent location and coordinate (or route/measure) in a similar manner to how our geometryToMeasure endpoint works.

## Slide 3 — Geometry to Referent

Create a REST endpoint that will take an XYZ coordinate (or route and measure) and a referent layer (point) as the input and provide a referent and offset as the output
Users should be able to provide one or more coordinates/route+measure that will be converted into referent and offset
We should also provide an option in the tool to allow the user how they want the referent selected.

  - Closest – Select the closest referent in the layer irrespective of whether it’s upstream or downstream of the location
  - Nearest upstream – Select the closest referent downstream on the route from the location provided
Software Engineer that is assigned the story will create the signature and review with the team
Consider utilizing the existing geometryToMeasure endpoint as a guide
Input parameters for the tool include: Locations (layerID – required, coordinates – optional, route, measure – optional), Offset Units (in Esri units), Referent Selection (closest or nearest downstream), Tolerance (optional), the Temporal View Date (optional), Input Spatial Reference (optional), Output Spatial Reference (optional), and gdb Version (optional)
If both coordinates and route+measure are provided in a request, default to the coordinates and ignore the route+measure
If the tolerance is empty, use the XY and Z tolerance of the service for the search area.  If the tolerance is populated, it should be in the units of the service spatial reference.
If the tolerance would result in multiple locations on different routes, include the nearest location on each route that was within the search tolerance
If temporal view date is empty, return all the referent and offset locations across time
If the Input Spatial Reference is empty, return using the coordinates of the spatial reference the service was published with
If the Output Spatial Reference is empty, return using the coordinates of the spatial reference the service was published with
If the gdb Version is empty, use the version the service was published with
If the referent layer doesn’t exist, return an error about the layer not existing
If the referent layer isn’t a point layer, return an error about the layer not being a point feature
If there is no referent feature on the route, don’t return anything and give an error
If the coordinates/route+measure provided won’t return a referent and offset on that route, return an error alerting the user that it’s not able to locate
Utilize the existing Locating Errors for geometryToMeasure for scenarios where the geometry can’t be located

## Slide 4 — Testing

Test on a mix of RH and APR data
Test on a variety of route geometries (gapped, loop, lollipop, alpha, branch, vertical)
Validate all the locating errors
Test with a variety of LRS features and non LRS features as the referents
Test with different units as the offset from the LRS Network units

## Slide 5 — Automation

Automate the endpoint in a similar manner to the other REST endpoints we support

## Slide 6 — Documentation

Create a new topic in our REST API documentation
Software Engineer should work with Jim on this documentation topic
Use the existing 10.x endpoint topic as a guide for the description and example usage
We need to make sure to be clear that a user can provide either coordinates or a route+measure to get the referent (we should also mention what happens if they provide both in a request)

## Slide 7 — Assignment

Story Points:
Dev:
PE:
