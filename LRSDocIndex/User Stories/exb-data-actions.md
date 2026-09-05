# Experience Builder Data Actions User Story

| Field | Value |
| --- | --- |
| **Doc** | 430 · User Story · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExpBld DataActions.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExpBld%20DataActions.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2024-02-16 18:47 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | data actions · event editor · experience builder · event editing · route characteristics · workflow |
| **Tools** | Add Point · Add Line · Split Event · Merge Event · LRS Identify · Table |

## Summary

Describes a user story for enabling data actions between widgets in the Experience Builder Event Editor application to improve workflow efficiency and data accuracy. Details specific data actions supported between widgets such as LRS Search, Add Point, Add Line, Split Event, Merge Event, LRS Identify, and Table for network and event layers. Includes testing, automation, and documentation considerations.

## Related documents

<!-- related:begin -->
- [Experience Builder Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget.md>) — similar text 0.27 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:362 s=4.781 -->
- [Search by Route and Measure Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-route-and-measure-exb-widget.md>) — similar text 0.28 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:529 s=4.7 -->
- [Experience Builder Conflict Prevention User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-conflict-prevention.md>) — similar text 0.24 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:433 s=4.691 -->
- [LRS Identify widget User Story and Configuration](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/lrs-identify-widget-and-configuration.md>) — similar text 0.28 · 2 filename words · same kind/surface/folder <!-- rel:465 s=3.988 -->
- [Experience Builder Support Multiple LRS Services in Web Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-support-multiple-lrs-services-in-web-map.md>) — similar text 0.32 · 2 title words · same kind/surface/folder <!-- rel:178 s=3.884 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Add calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/add-calibration-points.html) · [Release locks through the LRS Locks table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/lrs-locks-table.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html)

_No page matched:_ [Add Line](https://www.google.com/search?q=%22Add%20Line%22+site%3Adoc.esri.com) · [Split Event](https://www.google.com/search?q=%22Split%20Event%22+site%3Adoc.esri.com) · [Merge Event](https://www.google.com/search?q=%22Merge%20Event%22+site%3Adoc.esri.com) · [LRS Identify](https://www.google.com/search?q=%22LRS%20Identify%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Experience Builder Data Actions <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an Event Editor, I need the ability to move between widgets in my Experience Builder Event Editor application without having to manually open them and copy data, so that my workflow can be completed efficiently and without data loss.

Personas
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.)  These users need to be able to complete multiple edits in an efficient and accurate manner.  Adding data actions between various LRS ExB widgets will help streamline their workflows and ensure accurate data is maintained.

## Acceptance Criteria
### Data Actions <!-- slide 3 -->
- Support the following data actions below (each action will be covered on a subsequent slide)

| LRS Search | Table, Add Point, Add Line |
| --- | --- |
| Add Point | Table |
| Add Line | Table |
| Split Event | Table |
| Merge Event | Table |
| LRS Identify | Add Point, Add Line, Table |
| Table (Network layer) | Add Point, Add Line |
| Table (Event layer) | Split Event, Merge Events |

### LRS Search <!-- slide 4 -->
- Add data actions to launch Add Point and Add Line (three different options)
- The table widget data action should already be covered as a configuration option
- For the Add Point data action, take the route and measure information for the selected result and populate it in the widget
- For the Add Line data action, take the route and measure information and populate it in the widget
  - If a single result is selected, allow the user to choose whether it will be the From or To Measure in the Add Line widget
  - If two results are selected, populate them as the From and To Measures in the Add Line widget

### Add Point/Add Line <!-- slide 5 -->
- Both widgets have configurable options to open the table
- If enabled, the table should open with a single new tab (single event) or in multiple tabs (multiple events)

### Split/Merge Events <!-- slide 6 -->
- Both widgets have configurable options to open the table
- If enabled, the table should open with a new tab unless the widget was launched from a selection in the table

### LRS Identify <!-- slide 7 -->
- Add data actions to launch Add Point ,Add Line (two different options), and Table (two different options)
- For the Add Point data action, take the route and measure information for the selected result and populate it in the widget
- For the Add Line data action, take the route and measure information and populate it in the widget, but give the user two options
  - Use the selected measure as the From Measure
  - Use the selected measure as the To Measure
- For the Table data action, there will be two options
  - Always show the option to open the Network layer in the table.  When selected, open the table with the route(s) that are selected in the Identify.  If there are more than one network being selected, open a different tab for each network and selected the route(s) in each tab.
  - If the LRS Identify is configured to show events, provide an option to open the Event layer(s) in the table.  When selected, open the table with a tab for each event layer in the Identify and select records that are present at the route/measure in the Identify.

### Table (Network) <!-- slide 8 -->
- When a user selects a network record in the table, give them the option to open Add Point or Add Line via data actions
- Only populate the routeID for the selected record in the widget that is opened
- If more than 1 record is selected, do not allow either of the actions to be initiated (this will change in the future once we build an experience to add events to multiple routes at once)

### Table (Event) <!-- slide 9 -->
- For a table with an LRS event, provide two data actions: Split Event and Merge Events
- If one event record is selected, allow the user to select the Split Event action.  Open the Split widget and include the information from the selected event
- If more than one event record is selected, allow the user to select the Merge Events action. (Should we do the date/measure adjacency check here or within the Merge Events widget?)

## Testing
<!-- slide 10 -->
- Test with a mix of APR, APRUN, RH, and Postmile data
- Verify the tool aligns with any other Experience Builder specifications/requirements
- 508/i18n
- Test with various themes

## Automation
<!-- slide 11 -->
- Can this be incorporated into the existing automation for the widgets we’re building?

## Documentation
<!-- slide 12 -->
- Update documentation for the LRS widgets to mention these available data actions and how they will copy data into the new widget being launched
- Update screenshots as needed

## Assignment
<!-- slide 13 -->
Story Points:
Dev:
PE:
