# Search by Coordinate Experience Builder widget

| Field | Value |
| --- | --- |
| **Doc** | 487 · User Story · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExpBld SearchbyCoordinate.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExpBld%20SearchbyCoordinate.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2023-10-19 23:20 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | search by coordinate · route search · experience builder widget · event editor · spatial reference · coordinate search |
| **Tools** | Route Search |

## Summary

User story for adding a coordinate-based search method to the Route Search widget in Experience Builder. It enables event editors to locate routes by providing XY coordinates with optional Z, supporting multiple spatial references and returning routes or closest matches with distance information. The document includes configuration details, testing scenarios, automation plans, and documentation updates.

## Related documents

<!-- related:begin -->
- [Search by Station Experience Builder widget User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/search-by-station-exb-widget.md>) — similar text 0.60 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:490 s=7.377 -->
- [Search by Referent Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-referent-exb-widget.md>) — similar text 0.70 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:476 s=7.138 -->
- [Search by Line Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-line-exb-widget.md>) — similar text 0.60 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:464 s=6.967 -->
- [Search by Route and Measure Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-route-and-measure-exb-widget.md>) — similar text 0.44 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:529 s=6.495 -->
- [Experience Builder Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget.md>) — similar text 0.24 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:362 s=4.996 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Route Search](https://www.google.com/search?q=%22Route%20Search%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Search by Coordinate Experience Builder widget <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an Event Editor, I need the ability to search for a route via coordinates, so that I can properly locate and orient myself for LRS editing and analysis.

Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.)  These users need to be able to search for a route via coordinates to orient themselves on the map in preparation for event editing.

## Acceptance Criteria
### Search by Coordinates <!-- slide 3 -->
- Create another method in the Route Search widget called “Coordinates”
- Network should be whatever network was configured in the backstage configuration
- User can change the network in the UI to any valid LRS networks in the map
- User must provide the XY coordinates, the Z is optional
- Coordinate spatial reference is based on whatever is configured in the backstage of the widget (see slide 5)
- All mockups can be found at https://www.figma.com/file/dIN1OfZDxhT7i9pbefdoTj/LRS?type=design&node-id=506-130104&mode=design&t=gS2mLbqfZq6Pwoqa-0

![Figure 1 — Search by Coordinates](../media/search-by-coordinate-exb-widget/fig-01-slide-03-search-by-coordinates.png)

### Search by Coordinates <!-- slide 4 -->
- If the coordinates are invalid, provide a message that the coordinates provided aren’t valid
- When the user clicks search do the following:
  - Find all the routes/measures that are present at that coordinate and return them in the results
  - Transition the widget to a results pane that shows the route(s)/measure(s) that are returned by the search
  - If no route/measure is present at those exact coordinates, then return the closest route/measure to the coordinates and mention how far it is from the coordinates provided

![Figure 2 — Search by Coordinates](../media/search-by-coordinate-exb-widget/fig-02-slide-04-search-by-coordinates.png)

### Search by Coordinates <!-- slide 5 -->
- Experience Builder widgets provide a backstage to configure options on a given widget
- Since this is an existing widget, additional options need to be exposed in the widget
  - Add coordinates as one the methods (default is route and measure)
  - Allow the user to define the spatial reference being used (default is the map, but we should also expose the SR of the actual feature class in the db)

![Figure 1 — Search by Coordinates](../media/search-by-coordinate-exb-widget/fig-01-slide-03-search-by-coordinates.png)

## Testing
<!-- slide 6 -->
- Test with APR and RH data
- Test on a variety of route shapes
- Test on projected and unprojected data
- Test with a variety of spatial references
- Test coordinate locations exactly on a route as well as close but not on a route
- Also test coordinates where multiple routes exist (intersections and concurrencies)
- Verify the tool aligns with any other Experience Builder specifications/requirements
- 508/l18n testing
- Test with different themes

## Automation
<!-- slide 7 -->
- Add automation to the existing Route and Measure automation for this tool

## Documentation
<!-- slide 8 -->
- Add to the existing Route and Measure widget documentation that covers this new method

## Assignment
<!-- slide 9 -->
Story Points:
Dev:
PE:
