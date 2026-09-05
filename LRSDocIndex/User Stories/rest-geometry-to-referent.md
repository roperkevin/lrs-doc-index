# REST: Geometry to Referent User Story

| Field | Value |
| --- | --- |
| **Doc** | 608 · User Story · Server |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [REST Geometry to Referent.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/REST%20Geometry%20to%20Referent.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2023-02-10 23:01 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | referent · rest endpoint · route measure · coordinate conversion · locating errors · offset · referent selection |
| **Tools** | — |

## Summary

User story for creating a REST endpoint that converts an XYZ coordinate or route/measure into a referent and offset using a referent point layer. The endpoint supports options for referent selection, tolerance, spatial references, and temporal view date, with error handling for invalid inputs. Testing and automation plans are included, along with documentation guidance.

## Related documents

<!-- related:begin -->
- [REST: Referent to Geometry](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/rest-referent-to-geometry.md>) — similar text 0.81 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:614 s=9.772 -->
- [REST: Geometry to Station User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-geometry-to-station.md>) — similar text 0.67 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:692 s=6.652 -->
- [REST: Station to Geometry User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/rest-station-to-geometry.md>) — similar text 0.64 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:691 s=5.836 -->
- [Sort results by distance in geometryToMeasure REST endpoint](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/sort-results-by-distance-in-geometrytomeasure-rest-endpoint.md>) — similar text 0.30 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:740 s=3.636 -->
- [REST Geometry to Referent Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4211-rest-geometry-to-referent.md>) — similar text 0.21 · 3 title words · 1 filename word · same surface <!-- rel:587 s=3.548 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/storing-referent-and-offset-information-for-event-location.html)
<!-- docs:end -->

---

## Story
### REST: Geometry to Referent <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a LRS Developer, I want to be able to convert a coordinate location (or route/measure) along a route into a referent and offset, so I can utilize this operation in custom applications my organization creates that involve converting back and forth between a coordinate/route/measure in the LRS system to a referent location from the field.
Persona

- LRS Developer: This user is responsible for extending Roads and Highways/Pipeline Referencing utilizing the LRS REST endpoints and other SDKs provided within ArcGIS. For organizations that utilize referent locations in conjunction with their LRS, they need to be ability to convert between a referent location and coordinate (or route/measure) in a similar manner to how our geometryToMeasure endpoint works.

## Acceptance Criteria
### Geometry to Referent <!-- slide 3 -->
- Create a REST endpoint that will take an XYZ coordinate (or route and measure) and a referent layer (point) as the input and provide a referent and offset as the output
- Users should be able to provide one or more coordinates/route+measure that will be converted into referent and offset
- We should also provide an option in the tool to allow the user how they want the referent selected.
  - Closest – Select the closest referent in the layer irrespective of whether it’s upstream or downstream of the location
  - Nearest upstream – Select the closest referent downstream on the route from the location provided
- Software Engineer that is assigned the story will create the signature and review with the team
- Consider utilizing the existing geometryToMeasure endpoint as a guide
- Input parameters for the tool include: Locations (layerID – required, coordinates – optional, route, measure – optional), Offset Units (in Esri units), Referent Selection (closest or nearest downstream), Tolerance (optional), the Temporal View Date (optional), Input Spatial Reference (optional), Output Spatial Reference (optional), and gdb Version (optional)
- If both coordinates and route+measure are provided in a request, default to the coordinates and ignore the route+measure
- If the tolerance is empty, use the XY and Z tolerance of the service for the search area.  If the tolerance is populated, it should be in the units of the service spatial reference.
- If the tolerance would result in multiple locations on different routes, include the nearest location on each route that was within the search tolerance
- If temporal view date is empty, return all the referent and offset locations across time
- If the Input Spatial Reference is empty, return using the coordinates of the spatial reference the service was published with
- If the Output Spatial Reference is empty, return using the coordinates of the spatial reference the service was published with
- If the gdb Version is empty, use the version the service was published with
- If the referent layer doesn’t exist, return an error about the layer not existing
- If the referent layer isn’t a point layer, return an error about the layer not being a point feature
- If there is no referent feature on the route, don’t return anything and give an error
- If the coordinates/route+measure provided won’t return a referent and offset on that route, return an error alerting the user that it’s not able to locate
- Utilize the existing Locating Errors for geometryToMeasure for scenarios where the geometry can’t be located

## Testing
<!-- slide 4 -->
- Test on a mix of RH and APR data
- Test on a variety of route geometries (gapped, loop, lollipop, alpha, branch, vertical)
- Validate all the locating errors
- Test with a variety of LRS features and non LRS features as the referents
- Test with different units as the offset from the LRS Network units

## Automation
<!-- slide 5 -->
Automate the endpoint in a similar manner to the other REST endpoints we support

## Documentation
<!-- slide 6 -->
Create a new topic in our REST API documentation
Software Engineer should work with Jim on this documentation topic
Use the existing 10.x endpoint topic as a guide for the description and example usage
We need to make sure to be clear that a user can provide either coordinates or a route+measure to get the referent (we should also mention what happens if they provide both in a request)

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
