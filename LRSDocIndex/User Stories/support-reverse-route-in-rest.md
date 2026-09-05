# Support Reverse Route in REST

| Field | Value |
| --- | --- |
| **Doc** | 742 · User Story · Server |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [SupportReverseRouteREST.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportReverseRouteREST.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-12-16 16:52 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | reverse route · route calibration · rest api · line network · route editing |
| **Tools** | Apply Edits REST endpoint |

## Summary

Describes the user story for adding a Reverse Route operation to the LRS Apply Edits REST endpoint. It covers the need for reversing route calibration direction, inputs required, expected behavior, testing scenarios, automation plans, and documentation updates.

## Related documents

<!-- related:begin -->
- [Support Reverse Route in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-in-pro.md>) — similar text 0.62 · 3 title words · 3 filename words · same kind/folder <!-- rel:743 s=6.095 -->
- [Support Reverse Route Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-eb-rh-apr-un-2020-12.md>) — similar text 0.56 · 3 title words · 3 filename words · same kind/folder <!-- rel:739 s=5.927 -->
- [Support Reverse Route Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-eb-rh-apr-un-2021-03.md>) — similar text 0.56 · 3 title words · 3 filename words · same kind/folder <!-- rel:728 s=5.924 -->
- [Reverse Line Orders tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/reverse-line-orders-tool.md>) — similar text 0.35 · 1 title word · 1 filename word · same kind/folder <!-- rel:576 s=3.64 -->
- [Support Complex Route Shapes in Apply Edits](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-apply-edits.md>) — similar text 0.22 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:845 s=3.466 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Reverse routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reverse-routes.html)

_No page matched:_ [Apply Edits REST endpoint](https://www.google.com/search?q=%22Apply%20Edits%20REST%20endpoint%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support Reverse Route in REST <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS editor, I need to be able to reverse routes, so that the direction of calibration for the routes matches what is expected from design and engineering documents within the GIS.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these document.  A scenario that can occur is that the calibration direction of a route in the LRS is in the wrong direction.  Sometimes the route was calibrated incorrectly when added to the LRS and other times another edit that needs to be made in the LRS, like a realignment, requires the route calibration direction to be reversed.  When this occurs, the user will need to be able to reverse the route direction followed by having event behaviors applied to the route.

## Acceptance Criteria
### Reverse Route REST <!-- slide 3 -->
- Add Reverse Route to the LRS Apply Edits REST endpoint
- The inputs for Reverse Route are as follows:
  - Network
  - Effective Date
  - (From)Route ID
  - To Route ID (if a line network)
- When a route is reversed, we should do the following:
  - Take the existing shape of the route and reverse it for the new time slice
  - Time slice based on the effective data
  - Create new calibration points with the effective date in the reversed locations from the original route
  - Add a record to the edit log for the reverse (follow the format we already have for a reverse route in the ArcMap experience)
- The dev should make sure that the editing module that is going to be created is unit testable. they can follow what is done with CPUpdaterForCartoRealignment and its interaction with CartoRealignment::Apply.
- For line networks where more than one route is selected, we should reverse the From and To RouteID selected as well as any routes with Line Orders between the From and To (note that in Postmile this might include portions of routes upsteam/downstream of the spatial area where the From/To Route IDs begin/end)
- Use the ArcMap Reverse Route as a guide
- Review the REST signature with the developers on the team before finalizing

## Testing
<!-- slide 4 -->
- Test in both line and non line networks (projected and unprojected data)
- Test with both Roads and Highways (focus on this) and Pipeline Referencing data (with the UN)
- Should work on the following route shapes: simple, gapped, complex (loop, lollipop, alpha, branch, barbell), vertical

## Automation
<!-- slide 5 -->
Create automation via ReadyAPI for the Reverse Route REST operation

## Documentation
<!-- slide 6 -->
Dev: Add to the existing REST API documentation for the Reverse Route operation within Apply Edits
PE: Create a Reverse Route topic under the Route Editing section of the Roads and Highways and Pipeline Refencing help (each should get their own topic)

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
