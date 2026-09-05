# Create single LRS picker for Experience Builder widgets

| Field | Value |
| --- | --- |
| **Doc** | 193 · User Story · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExB - Create a single picker for all widgets.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Create%20a%20single%20picker%20for%20all%20widgets.pptx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2025-04-16 16:25 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | picker · experience builder widget · event editor · lrs widget · map interaction |
| **Tools** | — |

## Summary

User story to create a single consistent picker button/experience for all LRS widgets in Experience Builder to ensure uniform map interactions for event editors. The picker will maintain current functionality but use common code for consistency across widgets. Testing involves verifying picker consistency across various LRS widgets and data types.

## Related documents

<!-- related:begin -->
- [Experience Builder Referent method in Add Point and Line widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-referent-method-in-add-point-and-line-widgets.md>) — similar text 0.36 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:177 s=4.493 -->
- [All LRS Widgets: Create a Single Route Picker](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/24843-all-lrs-widgets-create-a-single-route-picker.md>) — similar text 0.30 · 4 title words · 2 filename words · same surface <!-- rel:180 s=4.427 -->
- [Experience Builder Support Multiple LRS Services in Web Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-support-multiple-lrs-services-in-web-map.md>) — similar text 0.34 · 2 title words · same kind/surface/folder <!-- rel:178 s=4.276 -->
- [Experience Builder SLD Interaction with Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-sld-interaction-with-map.md>) — similar text 0.27 · 2 title words · same kind/surface/folder <!-- rel:191 s=4.001 -->
- [Experience Builder Time and Versioning widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/exb-time-and-versioning-widget.md>) — similar text 0.26 · 2 title words · same kind/surface/folder <!-- rel:167 s=3.79 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html)

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Create single LRS picker for Experience Builder widgets <!-- slide 1 -->
User Story
ArcGIS Enterprise

### User Story <!-- slide 2 -->
As an event editor, I need a consistent picker experience in LRS widgets when interacting with the map, so that all map interactions are the same and don’t require learning different workflows.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). As Experience Builder applications are built using LRS widgets, users will utilize the map picker in each of these widgets.  They should have a consistent experience so that users always know one way to utilize the button no matter which widget they’re using.

## Acceptance Criteria
### Single picker for LRS widgets <!-- slide 3 -->
- Create a single picker button/experience to be used within all the LRS widgets that support the experience today
- The picker should continue to work as it does today, but utilizing a common piece of code to ensure consistency in the experience using the picker between the widgets for end users

## Testing
<!-- slide 4 -->
- Test with all the LRS widgets that have a picker widget
- Test with a mix of APR, RH data, and Postmile data
- Verify consistency between the pickers in all widgets

## Automation
<!-- slide 5 -->
- No automation

## Documentation
<!-- slide 6 -->
- No documentation changes

## Assignment
### Story Points <!-- slide 7 -->
Story Points:
Dev:
PE:
