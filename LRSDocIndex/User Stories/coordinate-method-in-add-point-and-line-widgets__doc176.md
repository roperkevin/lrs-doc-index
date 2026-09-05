# Coordinate method in Add Point and Line widgets

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Source** | [ExB - Coordinate method in Add Point and Line widgets.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Coordinate%20method%20in%20Add%20Point%20and%20Line%20widgets.pptx>) |
| **Edited** | 2025-05-08 17:14 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Coordinate method in Add Point and Line widgets"
source_file: "ExB - Coordinate method in Add Point and Line widgets.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Coordinate%20method%20in%20Add%20Point%20and%20Line%20widgets.pptx"
doc_id: 176
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: "Nathan Easley"
last_edited: "2025-05-08T17:14:42Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["coordinate method", "event editor", "add point widget", "add line widget", "search radius", "route measure"]
tools: ["Add Point", "Add Line", "Search by Route"]
products: []
issues: []
related: [{"doc":177,"file":"experience-builder-referent-method-in-add-point-and-line-widgets__doc177.md","s":9.138},{"doc":49,"file":"coordinates-method-in-add-point-and-add-line-widgets-test-plan__doc49.md","s":5.414},{"doc":139,"file":"add-point-event-widget__doc139.md","s":4.278},{"doc":138,"file":"add-line-event-widget__doc138.md","s":4.239},{"doc":906,"file":"exb-auto-populate-referents-for-add-point-and-add-line-widgets-test-plan__doc906.md","s":4.136}]
```
-->

## Summary

This document describes a user story for adding a coordinate input method to the Add Point and Add Line Event widgets in ArcGIS Enterprise. It covers the need for event editors to input event data via coordinates directly, configuration options for this method, testing scenarios, automation, and documentation updates.

## Related documents

<!-- related:begin -->
- [Experience Builder Referent method in Add Point and Line widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-referent-method-in-add-point-and-line-widgets__doc177.md>) — similar text 0.70 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:177 -->
- [Coordinates Method in Add Point and Add Line Widgets Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/coordinates-method-in-add-point-and-add-line-widgets-test-plan__doc49.md>) — similar text 0.13 · 5 title words · 2 filename words · same surface <!-- rel:49 -->
- [Add Point Event widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/add-point-event-widget__doc139.md>) — similar text 0.18 · 2 title words · 3 filename words · same surface <!-- rel:139 -->
- [Add Line Event widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/add-line-event-widget__doc138.md>) — similar text 0.17 · 2 title words · 3 filename words · same surface <!-- rel:138 -->
- [ExB: Auto-Populate Referents for Add Point and Add Line widgets Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/exb-auto-populate-referents-for-add-point-and-add-line-widgets-test-plan__doc906.md>) — similar text 0.06 · 4 title words · 2 filename words · same surface <!-- rel:906 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Add calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/add-calibration-points.html)

_No page matched:_ [Add Line](https://www.google.com/search?q=%22Add%20Line%22+site%3Adoc.esri.com) · [Search by Route](https://www.google.com/search?q=%22Search%20by%20Route%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Experience Builder Coordinate method in Add Point and Line widgets

User Story
ArcGIS Enterprise

## Slide 2 — User Story

As an event editor, I need the ability to input new event data via coordinates, so I don’t have to translate the coordinates to measures before adding them to the LRS.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). The event data that users are going to input to the LRS can come in a variety of formats.  For some users, this information arrives located via coordinates.  Instead of forcing users to convert this data to route/measure, we should allow them to locate the input of the event via coordinates and convert to route/measure for them.

## Slide 3 — Coordinate method in Add Point/Add Line

In the Add Point and Add Line Event widgets, add coordinate as a location method
In the configuration, add Coordinate as a method (from and to method in Line).
Allow this method to be configured as the default for the widgets.
Also add a search radius for returning results for coordinates that are off the route.  Use the same default as in Search by Route.
Utilize the same coordinate logic we utilize in the Search by Route widget
Allow a user to provide coordinates that are off the route and provide the closest route/measure and let the user know the distance from the route
Consider any code cleanup to streamline the use of this method in the 3 widgets

## Slide 4 — Testing

Test with XY and XYZ coordinates
Test with coordinates on the route and off the route and outside the search tolerance
Add a test case where the coordinates are equally located from two different routes, two different measures on the same route, and at the intersection of two routes
Verify the same results are returned in Add Point/Add Line and Search by Route

## Slide 5 — Automation

Add automation cases for this input method to Add Point/Add Line

## Slide 6 — Documentation

Update existing documentation to mention support this new input method

## Slide 7 — Story Points

Story Points:
Dev:
PE:
