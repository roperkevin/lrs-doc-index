# REST: Referent to Geometry

| Field | Value |
| --- | --- |
| **Doc** | 614 · User Story · Server |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [REST Referent to Geometry.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/REST%20Referent%20to%20Geometry.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2023-02-10 00:07 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | referent · route · measure · coordinate · rest endpoint · location conversion |
| **Tools** | — |

## Summary

User story for creating a REST endpoint that converts a referent location along a route into a coordinate, route, and measure. The endpoint accepts referent layer, feature, offset, and units as inputs and returns all valid route/measure values at the location. It includes error handling for invalid layers, features, and locating errors, and supports optional temporal view date, spatial reference, and geodatabase version parameters.

## Related documents

<!-- related:begin -->
- [REST: Geometry to Referent User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-geometry-to-referent.md>) — similar text 0.80 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:608 s=9.775 -->
- [REST: Station to Geometry User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-station-to-geometry.md>) — similar text 0.68 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:691 s=5.982 -->
- [REST: Geometry to Station User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-geometry-to-station.md>) — similar text 0.60 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:692 s=5.459 -->
- [REST Geometry to Referent Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4211-rest-geometry-to-referent.md>) — similar text 0.16 · 3 title words · 1 filename word · same surface <!-- rel:587 s=3.421 -->
- [Test Plan for REST Referent To Geometry](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/for-rest-referent-to-geometry.md>) — similar text 0.15 · 3 title words · same surface <!-- rel:563 s=3.018 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/storing-referent-and-offset-information-for-event-location.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html)
<!-- docs:end -->

---

## Story
### REST: Referent to Geometry <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a LRS Developer, I want to be able to convert a referent location along a route into a coordinate (or route/measure), so I can utilize this operation in custom applications my organization creates that involve converting back and forth between a referent location from the field to a coordinate/route/measure in the LRS system.
Persona

- LRS Developer: This user is responsible for extending Roads and Highways/Pipeline Referencing utilizing the LRS REST endpoints and other SDKs provided within ArcGIS.  For organizations that utilize referent locations in conjunction with their LRS, they need to be ability to convert between a referent location and coordinate (or route/measure) in a similar manner to how our measureToGeometry endpoint works.

## Acceptance Criteria
### Referent to Geometry <!-- slide 3 -->
- Create a REST endpoint that will take a referent layer (point), referent feature, and offset, and offset units as the inputs and provides a coordinate, route and measure as the outputs
- Users should be able to provide one or more referent feature/offset values that will be converted into coordinates, route, and measure
- If there is more than one route/measure at the location returned, provide all valid values in the return
- Software Engineer that is assigned the story will create the signature and review with the team
- Consider utilizing existing measureToGeometry endpoint as a guide
- Input parameters for the tool include: Locations (required, should include layerID of referent layer, OID of referent feature, offset, and offset units), the Temporal View Date (optional), Output Spatial Reference (optional), and gdb Version (optional)
- For offset units, use the existing Esri units
- If the referent layer doesn’t exist, return an error about the layer not existing
- If the referent layer isn’t a point layer, return an error about the layer not being a point feature
- If the referent feature isn’t on a route (so no measure can be found), return an error alerting the user that it’s not located on a route in the LRS Network
- Utilize the existing Locating Errors for measureToGeometry for scenarios where the geometry can’t be located
- If temporal view date is empty, return all the coordinate/route&measure locations across time for the referent
- If the Output Spatial Reference is empty, return using the coordinates of the spatial reference the service was published with
- If the gdb Version is empty, use the version the service was published with

## Testing
<!-- slide 4 -->
- Test on a mix RH and APR data
- Test on a variety of route geometries (gapped, loop, lollipop, alpha, branch, vertical)
- Validate all the locating errors
- Test with both LRS features (intersections, events) and non LRS features (regular point feature classes) as referents
- Test with different units as the offset from the LRS Network units

## Automation
<!-- slide 5 -->
Automate the endpoint in a similar manner to the other REST endpoints we support

## Documentation
<!-- slide 6 -->
Create a new topic in our REST API documentation
Software Engineer should work with Jim on this documentation topic
Use the existing measureToGeometry endpoint is a guide for what to include (locating errors, etc.)

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
