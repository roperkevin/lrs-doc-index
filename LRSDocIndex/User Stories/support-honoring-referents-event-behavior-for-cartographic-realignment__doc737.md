# Support honoring referents event behavior for cartographic realignment

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [SupportHonorReferentsinCartoRealign.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportHonorReferentsinCartoRealign.pptx>) |
| **Edited** | 2021-01-26 01:31 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support honoring referents event behavior for cartographic realignment"
source_file: "SupportHonorReferentsinCartoRealign.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportHonorReferentsinCartoRealign.pptx"
doc_id: 737
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2021-01-26T01:31:49Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["cartographic realignment", "referent", "event behavior", "route geometry", "lrs editor"]
tools: ["Modify Event Behaviors", "Configure External Events with LRS"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":736,"file":"support-updating-measures-option-in-cartographic-realignment__doc736.md","s":5.92},{"doc":729,"file":"support-snap-delete-and-ignore-options-for-calibration-points-in-cartographic__doc729.md","s":5.78},{"doc":611,"file":"support-snap-to-vertex-option-for-calibration-points-impacted-by-cartographic__doc611.md","s":5.557},{"doc":762,"file":"support-event-behaviors-on-vertical-route-shapes-in-cartographic-realignment__doc762.md","s":5.517},{"doc":838,"file":"support-event-behaviors-on-complex-route-shapes-in-cartographic-realignment__doc838.md","s":5.395}]
```
-->

## Summary

This document describes a user story for enabling events to honor their referent location during cartographic realignment in the LRS, preventing events from shifting incorrectly when route geometry changes. It details the configuration of a new event behavior parameter called 'Cartographic Realignment Rule' with options to honor route and measure or referent location, including tool updates and testing requirements. The document also covers automation and documentation updates related to this feature.

## Related documents

<!-- related:begin -->
- [Support updating measures option in cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-measures-option-in-cartographic-realignment__doc736.md>) — similar text 0.51 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:736 -->
- [Support Snap, Delete, and Ignore Options for Calibration Points in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-delete-and-ignore-options-for-calibration-points-in-cartographic__doc729.md>) — similar text 0.41 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:729 -->
- [Support Snap to Vertex Option for Calibration Points Impacted by Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-to-vertex-option-for-calibration-points-impacted-by-cartographic__doc611.md>) — similar text 0.39 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:611 -->
- [Support Event Behaviors on Vertical Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-cartographic-realignment__doc762.md>) — similar text 0.30 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:762 -->
- [Support Event Behaviors on Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-cartographic-realignment__doc838.md>) — similar text 0.31 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:838 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-cartographic-realignment.html) · [Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/storing-referent-and-offset-information-for-event-location.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html)

_No page matched:_ [Modify Event Behaviors](https://www.google.com/search?q=%22Modify%20Event%20Behaviors%22+site%3Adoc.esri.com) · [Configure External Events with LRS](https://www.google.com/search?q=%22Configure%20External%20Events%20with%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support honoring referents event behavior for cartographic realignment

User Story

## Slide 2 — User Story

As an LRS editor, I need to be able have events honor their referent location when the underlying route is cartographically realigned, so that those events don’t shift when the underlying route geometry would change the location of the event.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  A scenario that can occur in some DoTs is that they find the geometry of their existing routes in the LRS doesn’t match their location in real life.  A cartographic realignment would allow for this update to be made.  For some DoTs, their events are collected based on their referent location from another location (100 E of Intersection of Main St and 1st Ave for example).  When they do a cartographic realignment, those events would honor the route and measure would could result in them moving out of alignment with the referent information with how they were collected/input into the LRS.  This is the reason they want a second method for how event behaviors are applied for a cartographic realignment, called Honor Referent Location.  When Honor Referent Location is configured, the event will use the referent(s) to determine where to place the event and keep the event at that location (with the RouteID and Measure being updated) instead of using the existing RouteID and Measure to provide the location.  This is useful when events are modeled against specific locations like intersection to intersection as they can be tied to that referent and not move from it.

## Slide 3 — Honor Referent Location

In the “Modify Event Behaviors” and “Configure External Events with LRS” geoprocessing tools, provide another parameter called “Cartographic Realignment Rule”.
In Modify Event Behaviors, the parameter should have two drop down options, “Honor Route and Measure” and “Honor Referent Location”.
In Configure External Events with LRS, the parameter should only have “Honor Route and Measure”.
Honor Route and Measure is the default value.
For a user to configure Honor Referent Location, the event must have referents configured for the event.  If no referents are configured, only allow the user to choose Honor Route and Measure.
In the LRS Event Properties, add this parameter to the list of Event Behaviors as well.
For existing ArcMap users that migrate/upgrade to Pro, we should ensure the correct behaviors continue to be configured after running Modify LRS to add the controller dataset.

The event behaviors for cartographic realignments need should not be applied during the cartographic realignment, they would be applied during Apply Event Behaviors
When Honor Referent Location is configured and a cartographic realignment takes place that would impact that event, ignore the RouteID and Measure(s) to determine where the event will be located and instead determine the location of the event via the referent(s)
If the referents are null or invalid (not formatted correctly, partially populated, dReferentMethod domain entry doesn’t exist), default back to Route and Measure and make sure to mention that the event couldn’t be located by referent in a message in Apply Event Measures.
Use the existing ArcMap behaviors as a guide since the behavior should work the same way in Pro

## Slide 4 — Testing

Test cartorealignments on centerlines with both line and non line networks (projected and unprojected data)
Test with both Roads and Highways (focus on this) and Pipeline Referencing data
Should work on the following route shapes: simple, gapped, complex (loop, lollipop, alpha, branch, barbell), vertical
Verify with a variety of types of referents (intersections, coordinates, stationing, offset from points, etc.)
Make sure to verify with a dataset created in ArcMap and migrated/updated in Pro to ensure the correct behaviors continue to be configured
Verify that Honor Route and Measure method didn’t regress (via automation)

## Slide 5 — Automation

Create automation in both ReadyAPI and TestComplete for these scenarios

## Slide 6 — Documentation

Update the Event Behavior for Cartographic Realignment topic to include this additional option with graphics and explanation (in both the APR https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/event-behavior-for-cartographic-realignment.htm and RH https://pro.arcgis.com/en/pro-app/latest/help/production/roads-highways/event-behavior-for-cartographic-realignment.htm versions of the topic)
Update the Modify Event Behavior Rules (https://pro.arcgis.com/en/pro-app/latest/tool-reference/location-referencing/modify-event-behavior-rules.htm) and Configure External Events GP topics to include the new parameter and options

## Slide 7 — Assignment

Story Points:
Dev:
PE:
