# Experience Builder Referent method in Add Point and Line widgets

| Field | Value |
| --- | --- |
| **Doc** | 177 · User Story · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExB - Referent Offset method in Add Point and Line widgets.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Referent%20Offset%20method%20in%20Add%20Point%20and%20Line%20widgets.pptx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2025-05-08 17:15 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | referent offset · add point widget · add line widget · event editor · location method |
| **Tools** | Add Point · Add Line · Search by Route |

## Summary

This document describes a user story for adding referent and offset as a location method in the Add Point and Add Line Event widgets within ArcGIS Enterprise. It outlines the need for event editors to input event data via referent/offset without manual conversion to route/measure, configuration details, testing scenarios, automation plans, and documentation updates.

## Related documents

<!-- related:begin -->
- [Coordinate method in Add Point and Line widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/coordinate-method-in-add-point-and-line-widgets.md>) — similar text 0.70 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:176 s=9.138 -->
- [Add Line Events Point Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-events-point-offset-method.md>) — similar text 0.28 · 4 title words · 5 filename words · same kind/folder <!-- rel:268 s=6.662 -->
- [Add Point Event Point Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-event-point-offset-method.md>) — similar text 0.28 · 3 title words · 4 filename words · same kind/folder <!-- rel:272 s=5.76 -->
- [Location Offset Method in Add Point and Add Line Widgets Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/24790-location-offset-method-in-add-point-and-add-line-widgets.md>) — similar text 0.13 · 5 title words · 3 filename words · same surface <!-- rel:48 s=5.716 -->
- [Add Line Event Length Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-length-method.md>) — similar text 0.29 · 3 title words · 3 filename words · same kind/folder <!-- rel:269 s=5.283 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Add calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/add-calibration-points.html) · [Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html)

_No page matched:_ [Add Line](https://www.google.com/search?q=%22Add%20Line%22+site%3Adoc.esri.com) · [Search by Route](https://www.google.com/search?q=%22Search%20by%20Route%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Experience Builder Referent method in Add Point and Line widgets <!-- slide 1 -->
User Story
ArcGIS Enterprise

### User Story <!-- slide 2 -->
As an event editor, I need the ability to input new event data via referent and offset, so I don’t have to translate the referent/offset to measures before adding them to the LRS.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). The event data that users are going to input to the LRS can come in a variety of formats.  For some users, this information arrives located via referent and offset.  Instead of forcing users to convert this data to route/measure, we should allow them to locate the input of the event via referent/offset and convert to route/measure for them.

## Acceptance Criteria
### Referent/Offset method in Add Point/Add Line <!-- slide 3 -->
- In the Add Point and Add Line Event widgets, add referent/offset as a location method
- In the configuration, add Referent as a method (from and to method in Line).
- Allow this method to be configured as the default for the widgets.
- Add Default Referent and Default Offset Unit parameters to the tools.
- Utilize the same referent logic we utilize in the Search by Route widget for these parameters
- Consider any code cleanup to streamline the use of this method in the 3 widgets

## Testing
<!-- slide 4 -->
- Test with LRS point event and non-event layers as referents
- Test with different units of measure for the offset
- Test with positive and negative offset
- Test with offsets that go off the route

## Automation
<!-- slide 5 -->
- Add automation cases for this input method to Add Point/Add Line

## Documentation
<!-- slide 6 -->
- Update existing documentation to mention support this new input method

## Assignment
### Story Points <!-- slide 7 -->
Story Points:
Dev:
PE:
