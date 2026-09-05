# REST: Geometry to Station User Story

| Field | Value |
| --- | --- |
| **Doc** | 692 · User Story · Server |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [REST Geometry to Station.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/REST%20Geometry%20to%20Station.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-11-17 01:33 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | rest endpoint · route · station measure · coordinate conversion · stationing event · lrs developer · geometry to station |
| **Tools** | — |

## Summary

User story for creating a REST endpoint that converts XYZ coordinates into routeID and stationing measures for use in custom applications. The endpoint supports multiple coordinates, optional parameters like tolerance and spatial references, and returns all matching route/station measures at a location. It must handle error conditions such as missing stationing event types in the LRS network.

## Related documents

<!-- related:begin -->
- [REST: Station to Geometry User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/rest-station-to-geometry.md>) — similar text 0.84 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:691 s=8.339 -->
- [REST: Geometry to Referent User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-geometry-to-referent.md>) — similar text 0.67 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:608 s=6.652 -->
- [REST: Referent to Geometry](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/rest-referent-to-geometry.md>) — similar text 0.61 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:614 s=5.463 -->
- [Sort results by distance in geometryToMeasure REST endpoint](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/sort-results-by-distance-in-geometrytomeasure-rest-endpoint.md>) — similar text 0.21 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:740 s=4.034 -->
- [Reassign to a New or Existing Line with Original Route ID/Name Maintained on the Target Line - REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/565-reassign-to-a-new-or-existing-line-with-original-route-id.md>) — similar text 0.13 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:594 s=3.29 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [geometry to station](https://www.google.com/search?q=%22geometry%20to%20station%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### REST: Geometry to Station <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a LRS Developer, I want to be able to convert a coordinate into a route and stationing measure, so I can utilize this operation in custom applications my organization creates that involve going back and forth between stationing measures and coordinates.
Persona

- LRS Developer: This user is responsible for extending Roads and Highways/Pipeline Referencing utilizing the LRS REST endpoints and other SDKs provided within ArcGIS.  For organizations that utilize our stationing event type, they need to be ability to convert between a coordinate and a route and station measure in a similar manner to how our geometryToMeasure endpoint works.

## Acceptance Criteria
### Geometry to Station <!-- slide 3 -->
- Create a REST endpoint that will take an XYZ coordinate as the input and provide a routeID and station measure as the output
- Users should be able to provide one or more coordinates that will be converted into routeID/station measures
- For coordinate, the endpoint should find the routeID (s) and stationing measure(s) at that location to be returned (note if there is more than one route/measure at the location, we should return all matching route/station measures at that location)
- Software Engineer that is assigned the story will create the signature and review with the team
- This endpoint exists in the 10.x version of the LRS endpoints, so try to follow the same format of that existing endpoint if possible (https://roadsandhighwayssample.esri.com/roads/api/index.html)
- Input parameters for the tool include: Locations (required, one or more coordinate combinations), Tolerance (optional), the Temporal View Date (optional), Input Spatial Reference (optional), Output Spatial Reference (optional), and gdb Version (optional)
- If the tolerance is empty, use the XY and Z tolerance of the service for the search area.  If the tolerance is populated, it should be in the units of the service spatial reference.
- If temporal view date is empty, return all the coordinate locations across time for the RouteID/Station Measure
- If the Output Spatial Reference is empty, return using the coordinates of the spatial reference the service was published with
- If the gdb Version is empty, use the version the service was published with
- If the LRS the Network is a part of doesn’t have a stationing event type configured, the operation should fail, and we should return an error message letting the user know that no stationing event type exists for that Network
- Add any other error conditions that exist for the endpoint in the 10.x version of the endpoints

### Geometry to Station conversions <!-- slide 4 -->
- Note that stationing units of measure can be different from the LRS Network units of measure.  We need to consider this conversion factor when determining the station measure to return.
- For example, a user clicks directly between the nearest upstream and downstream station.  The upstream station has a measure of 130+00 and the downstream station has a measure of 140+00.  The route measure at the upstream station location is 139 and the measure at the downstream station is 140.  Before doing any conversions, the difference in measure range between the stationing measures and the route measures needs to be reconciled so that we don’t provide a stationing value that would be incorrect when considering the upstream or downstream stationing point..  This will ensure the measure that is returned in 135+00 instead of 139+99.50.

    0		        10                         20			    40
15+00                    30+00
22+50
15

![Figure 1 — Geometry to Station conversions](../media/rest-geometry-to-station/fig-01-slide-04-geometry-to-station-conversions.svg)

## Testing
<!-- slide 5 -->
- Test on both RH and APR data
- Test on data with and without a stationing event type configured
- Test on a variety of route geometries (gapped, loop, lollipop, alpha, branch, vertical)
- Utilize locations where there are downstream stations with and without a back station value

## Automation
<!-- slide 6 -->
Automate the endpoint in a similar manner to the other REST endpoints we support

## Documentation
<!-- slide 7 -->
Create a new topic in our REST API documentation
Software Engineer should work with Jim on this documentation topic
Use the existing 10.x endpoint topic as a guide for the description and example usage

## Assignment
<!-- slide 8 -->
Story Points:
Dev:
PE:
