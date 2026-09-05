# Extend Route Tool User Story and Testing

| Field | Value |
| --- | --- |
| **Doc** | 871 · User Story · Pro |
| **Product** | Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [Extend_No_New_Route_UserStory.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Extend_No_New_Route_UserStory.pptx>) |
| **People** | author Rahul Rakshit · PE — · dev — |
| **Edited** | 2019-11-20 16:53 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | extend route · route extension · equation point · line network · create route · user story · testing |
| **Tools** | Extend Route |

## Summary

This document describes a user story to restrict the Extend Route tool to only extend existing routes and prevent creating new routes when measures result in an equation point. It includes instructions for updating documentation and outlines testing requirements across different line network types and datasets, including UI and REST verification. Automation tests related to equation points in the Extend Route tool are to be removed.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-complex-route-shapes-in-extend-route.md>) — similar text 0.19 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:873 s=4.507 -->
- [Support Event Behaviors on Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-extend-route.md>) — similar text 0.18 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:839 s=4.205 -->
- [Conflict Prevention: Acquire Locks when creating new routes in Create, Extend, Realign, and Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-acquire-locks-when-creating-new-routes.md>) — similar text 0.14 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:826 s=3.995 -->
- [Support Event Behaviors on Vertical Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-extend-route.md>) — similar text 0.15 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:760 s=3.752 -->
- [Support Extend Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-extend-route-in-local-scenes-in-pro.md>) — similar text 0.14 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:775 s=3.695 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html) · [Event behavior for route extension](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-behavior-for-route-extension.html) · [Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html)
<!-- docs:end -->

---

## Story
### Do not allow creating a route in the Extend route tool <!-- slide 1 -->
Extend route to be used only for extending a route

## Acceptance Criteria
### Extending a route <!-- slide 2 -->
- Right Now: When the measures result in an equation point, a new route has to be created.
- User Story: When the measures result in an equation point:
  - Do not allow the extension to go through.
  - Provide the message as we show today for the equation point including the information on the forward and back stationing values.
  - Suggest to use Create route instead.
- For both DC and FS.
- Only for Line Networks.

## Testing
<!-- slide 4 -->
- Test with all types of line networks
- APR, UN and PoM datasets
- DC and FS
- Test on UI and REST
- Verify that the original extend route tool works as expected (without the create route part)
- Automation – Remove the equation point tests from Extend Route tests across the board

## Documentation
<!-- slide 3 -->
- Update the Pro doc for extend route for APR. This can be done by the tech writer. PE to verify.
- Remove this part of the note from the Create Route doc:

![Figure 1 — Documentation](../media/extend-route-tool-and-testing/fig-01-slide-03-documentation.png)

## Assignment
### Estimates <!-- slide 5 -->
