# Support Reverse Route Event Behaviors

| Field | Value |
| --- | --- |
| **Doc** | 728 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [SupportConfiguringReverseRouteEventBehaviors.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportConfiguringReverseRouteEventBehaviors.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-03-08 18:03 by Jim Gardner |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | reverse route · event behavior · route calibration · lrs editor · retire route · stay put · move |
| **Tools** | Configure Event Behaviors · Configure External Event |

## Summary

This document describes the user story for supporting reverse route event behaviors in the LRS. It covers the need for LRS editors to reverse route directions and apply event behaviors such as Stay Put, Move, and Retire. It also includes testing, automation, and documentation updates related to reverse route event behaviors.

## Related documents

<!-- related:begin -->
- [Support Reverse Route Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-eb-rh-apr-un-2020-12.md>) — similar text 0.63 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:739 s=8.768 -->
- [Support Reverse Route in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-in-pro.md>) — similar text 0.61 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:743 s=6.89 -->
- [Support Reverse Route in REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-in-rest.md>) — similar text 0.56 · 3 title words · 3 filename words · same kind/folder <!-- rel:742 s=5.924 -->
- [Support Snap Event Behavior in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-eb-in-realign-route.md>) — similar text 0.20 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:730 s=5.196 -->
- [Support Event Behaviors on Vertical Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-calibrate-route.md>) — similar text 0.19 · 4 title words · 1 filename word · same kind/surface/folder <!-- rel:759 s=5.107 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Reverse routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reverse-routes.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/retire-routes.html)

_No page matched:_ [Configure Event Behaviors](https://www.google.com/search?q=%22Configure%20Event%20Behaviors%22+site%3Adoc.esri.com) · [Configure External Event](https://www.google.com/search?q=%22Configure%20External%20Event%22+site%3Adoc.esri.com)
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
### Configure Reverse Route Event Behaviors <!-- slide 3 -->
- Support configuration of Reverse Route Event Behaviors in the Configure Event Behaviors and Configure External Event geoprocessing tools
  - Support being able to configure Stay Put, Move, and Retire for Retire Route
- Add Reverse Route event behaviors to the LRS Event Properties

## Testing
<!-- slide 4 -->
- Test in both line and non line networks (mix in projected and unprojected data)
- Test on both Roads and Highways (focus on this) and Pipeline Referencing data (with the UN)

## Automation
<!-- slide 5 -->
Add Reverse Route cases to the existing Configure Event Behaviors GP/Configure External Event GP automation

## Documentation
<!-- slide 6 -->
Update all existing locations in the documentation where we list the event behaviors that can be configured to add Reverse Route
Includes the following topics: Configure Event Behaviors GP tool, Configure External Event GP tool, and the Event Behaviors topic (and possibly the Event Data Model topic as well)

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
