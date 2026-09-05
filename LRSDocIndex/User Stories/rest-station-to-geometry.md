# REST: Station to Geometry User Story

| Field | Value |
| --- | --- |
| **Doc** | 691 · User Story · Server |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [REST Station to Geometry.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/REST%20Station%20to%20Geometry.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-11-17 00:15 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | rest endpoint · stationing measure · coordinates · route · xyzm · lrs developer · road and highways · pipeline referencing |
| **Tools** | — |

## Summary

User story for creating a REST endpoint that converts stationing measures to XYZM coordinates for routes. The endpoint accepts one or more RouteID/Station Measure inputs and returns coordinates, supporting optional temporal view date, spatial reference, and geodatabase version parameters. It includes error handling for missing stationing event types and follows the format of the existing 10.x LRS endpoints.

## Related documents

<!-- related:begin -->
- [REST: Geometry to Station User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-geometry-to-station.md>) — similar text 0.84 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:692 s=9.178 -->
- [REST: Referent to Geometry](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-referent-to-geometry.md>) — similar text 0.68 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:614 s=5.982 -->
- [REST: Geometry to Referent User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-geometry-to-referent.md>) — similar text 0.63 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:608 s=5.835 -->
- [Sort results by distance in geometryToMeasure REST endpoint](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/sort-results-by-distance-in-geometrytomeasure-rest-endpoint.md>) — similar text 0.18 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:740 s=3.964 -->
- [Support Reverse Route in REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-in-rest.md>) — similar text 0.18 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:742 s=2.937 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html)

_No page matched:_ [referent to geometry](https://www.google.com/search?q=%22referent%20to%20geometry%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### REST: Station to Geometry <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a LRS Developer, I want to be able to convert my stationing measure to coordinates, so I can utilize this operation in custom applications my organization creates that involve going back and forth between stationing measures and coordinates.
Persona

- LRS Developer: This user is responsible for extending Roads and Highways/Pipeline Referencing utilizing the LRS REST endpoints and other SDKs provided within ArcGIS.  For organizations that utilize our stationing event type, they need to be ability to convert between a station measure and the actual coordinates in a similar manner to how our measureToGeometry endpoint works.

## Acceptance Criteria
### Station to Geometry <!-- slide 3 -->
- Create a REST endpoint that will take a RouteID and Stationing Measure as the input and provide a XYZM coordinates as the output
- Users should be able to provide one or more RouteID/Stationing Measures that will be converted into coordinates
- For each RouteID/Stationing Measure, the endpoint should find where that location is on the route and determine the XYZM coordinates at that location to be returned
- Software Engineer that is assigned the story will create the signature and review with the team
- This endpoint exists in the 10.x version of the LRS endpoints, so try to follow the same format of that existing endpoint if possible (https://roadsandhighwayssample.esri.com/roads/api/index.html)
- Input parameters for the tool include: Locations (required, one or more RouteID/Station Measure combinations), the Temporal View Date (optional), Output Spatial Reference (optional), and gdb Version (optional)
- If temporal view date is empty, return all the coordinate locations across time for the RouteID/Station Measure
- If the Output Spatial Reference is empty, return using the coordinates of the spatial reference the service was published with
- If the gdb Version is empty, use the version the service was published with
- If the LRS the Network is a part of doesn’t have a stationing event type configured, the operation should fail, and we should return an error message letting the user know that no stationing event type exists for that Network
- Add any other error conditions that exist for the endpoint in the 10.x version of the endpoints

## Testing
<!-- slide 4 -->
- Test on both RH and APR data
- Test on data with and without a stationing event type configured
- Test on a variety of route geometries (gapped, loop, lollipop, alpha, branch, vertical)
- Utilize locations where there are downstream stations with and without a back station value

## Automation
<!-- slide 5 -->
Automate the endpoint in a similar manner to the other REST endpoints we support

## Documentation
<!-- slide 6 -->
Create a new topic in our REST API documentation
Software Engineer should work with Jim on this documentation topic
Use the existing 10.x endpoint topic as a guide for the description and example usage

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
