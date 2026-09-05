# Experience Builder Referent method in Add Point and Line widgets

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Source** | [ExB - Referent Offset method in Add Point and Line widgets.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Referent%20Offset%20method%20in%20Add%20Point%20and%20Line%20widgets.pptx>) |
| **Edited** | 2025-05-08 17:15 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Experience Builder Referent method in Add Point and Line widgets"
source_file: "ExB - Referent Offset method in Add Point and Line widgets.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Referent%20Offset%20method%20in%20Add%20Point%20and%20Line%20widgets.pptx"
doc_id: 177
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: "Nathan Easley"
last_edited: "2025-05-08T17:15:41Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["referent offset", "add point widget", "add line widget", "event editor", "location method"]
tools: ["Add Point", "Add Line", "Search by Route"]
products: []
issues: []
related: [{"doc":176,"file":"coordinate-method-in-add-point-and-line-widgets__doc176.md","s":9.138},{"doc":268,"file":"add-line-events-point-offset-method__doc268.md","s":6.662},{"doc":272,"file":"add-point-event-point-offset-method__doc272.md","s":5.76},{"doc":48,"file":"location-offset-method-in-add-point-and-add-line-widgets-test-plan__doc48.md","s":5.716},{"doc":269,"file":"add-line-event-length-method__doc269.md","s":5.283}]
```
-->

## Summary

This document describes a user story for adding referent and offset as a location method in the Add Point and Add Line Event widgets within ArcGIS Enterprise. It outlines the need for event editors to input event data via referent/offset without manual conversion to route/measure, configuration details, testing scenarios, automation plans, and documentation updates.

## Related documents

<!-- related:begin -->
- [Coordinate method in Add Point and Line widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/coordinate-method-in-add-point-and-line-widgets__doc176.md>) — similar text 0.70 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:176 -->
- [Add Line Events Point Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-events-point-offset-method__doc268.md>) — similar text 0.28 · 4 title words · 5 filename words · same kind/folder <!-- rel:268 -->
- [Add Point Event Point Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-event-point-offset-method__doc272.md>) — similar text 0.28 · 3 title words · 4 filename words · same kind/folder <!-- rel:272 -->
- [Location Offset Method in Add Point and Add Line Widgets Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/location-offset-method-in-add-point-and-add-line-widgets-test-plan__doc48.md>) — similar text 0.13 · 5 title words · 3 filename words · same surface <!-- rel:48 -->
- [Add Line Event Length Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-length-method__doc269.md>) — similar text 0.29 · 3 title words · 3 filename words · same kind/folder <!-- rel:269 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Add calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/add-calibration-points.html) · [Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html)

_No page matched:_ [Add Line](https://www.google.com/search?q=%22Add%20Line%22+site%3Adoc.esri.com) · [Search by Route](https://www.google.com/search?q=%22Search%20by%20Route%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Experience Builder Referent method in Add Point and Line widgets

User Story
ArcGIS Enterprise

## Slide 2 — User Story

As an event editor, I need the ability to input new event data via referent and offset, so I don’t have to translate the referent/offset to measures before adding them to the LRS.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). The event data that users are going to input to the LRS can come in a variety of formats.  For some users, this information arrives located via referent and offset.  Instead of forcing users to convert this data to route/measure, we should allow them to locate the input of the event via referent/offset and convert to route/measure for them.

## Slide 3 — Referent/Offset method in Add Point/Add Line

In the Add Point and Add Line Event widgets, add referent/offset as a location method
In the configuration, add Referent as a method (from and to method in Line).
Allow this method to be configured as the default for the widgets.
Add Default Referent and Default Offset Unit parameters to the tools.
Utilize the same referent logic we utilize in the Search by Route widget for these parameters
Consider any code cleanup to streamline the use of this method in the 3 widgets

## Slide 4 — Testing

Test with LRS point event and non-event layers as referents
Test with different units of measure for the offset
Test with positive and negative offset
Test with offsets that go off the route

## Slide 5 — Automation

Add automation cases for this input method to Add Point/Add Line

## Slide 6 — Documentation

Update existing documentation to mention support this new input method

## Slide 7 — Story Points

Story Points:
Dev:
PE:
