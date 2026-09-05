# Support Reverse Route Event Behaviors

| Field | Value |
| --- | --- |
| **Doc** | 739 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [SupportReverseRouteEventBehaviors.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportReverseRouteEventBehaviors.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-12-16 16:56 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | reverse route · event behavior · route calibration · lrs editor · event spanning · route direction · automation |
| **Tools** | — |

## Summary

This document describes the user story for enabling LRS editors to reverse route directions and apply event behaviors accordingly. It details the expected behavior for events spanning reversed routes, testing scenarios across different network types and shapes, automation via Python, and documentation updates. The goal is to ensure route calibration direction matches design expectations and events align properly after reversal.

## Related documents

<!-- related:begin -->
- [Support Reverse Route Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-eb-rh-apr-un-2021-03.md>) — similar text 0.63 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:728 s=8.768 -->
- [Support Reverse Route in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-in-pro.md>) — similar text 0.63 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:743 s=7.33 -->
- [Support Reverse Route in REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-in-rest.md>) — similar text 0.56 · 3 title words · 3 filename words · same kind/folder <!-- rel:742 s=5.927 -->
- [Support Snap Event Behavior in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-eb-in-realign-route.md>) — similar text 0.24 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:730 s=5.318 -->
- [Support Event Behaviors on Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-cartographic.md>) — similar text 0.24 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:838 s=5.124 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Reverse routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reverse-routes.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html)
<!-- docs:end -->

---

## Story
### Support Reverse Route Event Behaviors <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS editor, I need to be able to reverse routes and have event behaviors applied, so that the direction of calibration for the routes matches what is expected from design and engineering documents within the GIS and the events align as well.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these document.  A scenario that can occur is that the calibration direction of a route in the LRS is in the wrong direction.  Sometimes the route was calibrated incorrectly when added to the LRS and other times another edit that needs to be made in the LRS, like a realignment, requires the route calibration direction to be reversed.  When this occurs, the user will need to be able to reverse the route direction followed by having event behaviors applied to the route.

## Acceptance Criteria
### Reverse Route Event Behaviors <!-- slide 3 -->
- When executing Apply Event Behaviors and a Reverse Route record is encountered, process it and apply the behavior configured (use the ArcMap event behaviors as a guide)
- When the reverse is applied to an event spanning routes, do the following:
  - If the event is completely within the reversed section, reverse the event along in the same manner the routes were (the old From Route ID becomes the new To Route ID, the old To Route ID becomes the new From Route ID)
  - If the event extends beyond the reversed section, split the event at the boundary of the reverse then apply the rule above (similar to what we do for other event behaviors like realign/reassign for events spanning routes)
- Use the ArcMap Reverse Route event behaviors as a guide since they should be applied the same way for non line networks or line networks where the event is located on a single route

## Testing
<!-- slide 4 -->
- Test in both line and non line networks (mix in projected and unprojected data)
- Test on both Roads and Highways (focus on this) and Pipeline Referencing data (with the UN)
- Test on the following shapes:
  - Simple, gapped, loop, lollipop, alpha, branch, barbell, vertical
- Test with the following event configurations:
  - Entire Route, Beginning-Middle, Middle-Middle, Middle-End, Upstream of route-Middle, Middle-Beyond end of route
- Consider using the same test data as the Reverse Route edit activity story
- Utilize the Reverse Route test plan from ArcMap for any additional cases

## Automation
<!-- slide 5 -->
Automate Reverse Route event behaviors via python in the same manner as the other LRS edit activities today

## Documentation
<!-- slide 6 -->
Add Reverse Route event behaviors to the existing event behaviors topic we have today (will need both graphics and text)

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
