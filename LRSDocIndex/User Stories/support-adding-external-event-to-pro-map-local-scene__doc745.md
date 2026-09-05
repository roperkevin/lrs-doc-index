# Support adding External Event to Pro map/local scene

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [Support adding External Event to Pro mapscene.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20adding%20External%20Event%20to%20Pro%20mapscene.pptx>) |
| **Edited** | 2020-12-16 00:43 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support adding External Event to Pro map/local scene"
source_file: "Support adding External Event to Pro mapscene.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20adding%20External%20Event%20to%20Pro%20mapscene.pptx"
doc_id: 745
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2020-12-16T00:43:24Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["external event", "map", "local scene", "route", "measure", "read only", "visualization"]
tools: ["LRS Identify", "Relocate Events"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":744,"file":"support-updating-external-event-configuration__doc744.md","s":6.905},{"doc":288,"file":"create-external-event-with-no-connection-file__doc288.md","s":4.349},{"doc":774,"file":"support-calibrate-route-in-local-scenes-in-pro__doc774.md","s":4.243},{"doc":778,"file":"support-create-route-in-local-scenes-in-pro__doc778.md","s":4.143},{"doc":770,"file":"support-retire-route-in-local-scenes-in-pro__doc770.md","s":4.062}]
```
-->

## Summary

Describes the need for LRS external system data owners to add external events to ArcGIS Pro maps or local scenes for visualization. Specifies supported operations on external event layers and restrictions such as read-only access and no publishing. Includes testing scenarios for adding external events and preventing publishing or adding to global scenes.

## Related documents

<!-- related:begin -->
- [Support updating External Event configuration](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-external-event-configuration__doc744.md>) — similar text 0.64 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:744 -->
- [Create External Event with No Connection File](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-external-event-with-no-connection-file__doc288.md>) — similar text 0.22 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:288 -->
- [Support Calibrate Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-calibrate-route-in-local-scenes-in-pro__doc774.md>) — similar text 0.20 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:774 -->
- [Support Create Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-create-route-in-local-scenes-in-pro__doc778.md>) — similar text 0.21 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:778 -->
- [Support Retire Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-retire-route-in-local-scenes-in-pro__doc770.md>) — similar text 0.19 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:770 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[External event registration](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/external-event-registration.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html)

_No page matched:_ [LRS Identify](https://www.google.com/search?q=%22LRS%20Identify%22+site%3Adoc.esri.com) · [Relocate Events](https://www.google.com/search?q=%22Relocate%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support adding External Event to Pro map/local scene

User Story

## Slide 2 — User Story

As a LRS external system data owner, I need the ability to add an external event to a map/scene, so that the external event data can be visualized.

Persona
LRS external system data owners are typically IT or other managers that work in different departments within a DOT (and pipeline operator) than the LRS editors/group.  These may be members of groups such as safety, road inventory, planning, bridge, or pavement that manage data that needs to be linear referenced but can’t be moved into the same geodatabase as the LRS.  Instead, they store/manage their event attribute data (either spatial or non spatial) in databases that are outside of the LRS geodatabase.  In order to keep their LRS attributes (route and measure) up to date with the authoritative LRS for the organization (Roads and Highways gdb), they need to be able to periodically request updates based on the LRS edits that have taken place.  This sync process is completed via the Relocate Events tool.

## Slide 3 — Add External Event to map/local scene

Support being able to add an external event to a map/local scene in Pro (if added to a global scene, we shouldn’t build the shapes)
This can be accomplished by adding from the LRS Hierarchy
Once the external event is added to the map, we should utilize the route and measure fields to build shapes
We should allow users to do the following LRS operations to the external event layer:

  - Select the records in the map/attribute table
  - Identify the feature(s) in the map using the LRS Identify tool
  - Export the layer as a feature class/table using the core map exploration capabilities in Pro
We should prevent users from doing the following:

  - Making edits (since we only have a read only connection to the data)
  - Publishing as part of a service

## Slide 4 — Testing

Negative

  - Attempt to publish a map that has an external event
  - Attempt to add the external event to a global scene
Positive

  - Add event to map
  - Add event to local scene
Test with Oracle and SQL Server for the input event
Test adding both tables and feature classes that are external events

## Slide 5 — Documentation

Add a note in the external event topic that they can be added to a map/local scene in Pro

## Slide 6 — Assignment

Story Points:
Dev:
PE:
