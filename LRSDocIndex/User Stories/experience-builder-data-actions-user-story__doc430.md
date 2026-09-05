# Experience Builder Data Actions User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [ExpBld DataActions.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExpBld%20DataActions.pptx>) |
| **Edited** | 2024-02-16 18:47 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Experience Builder Data Actions User Story"
source_file: "ExpBld DataActions.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExpBld%20DataActions.pptx"
doc_id: 430
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2024-02-16T18:47:34Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["data actions", "event editor", "experience builder", "event editing", "route characteristics", "workflow"]
tools: ["Add Point", "Add Line", "Split Event", "Merge Event", "LRS Identify", "Table"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":362,"file":"experience-builder-dynamic-segmentation-widget__doc362.md","s":4.781},{"doc":529,"file":"search-by-route-and-measure-experience-builder-widget__doc529.md","s":4.7},{"doc":433,"file":"experience-builder-conflict-prevention-user-story__doc433.md","s":4.691},{"doc":465,"file":"lrs-identify-widget-user-story-and-configuration__doc465.md","s":3.988},{"doc":178,"file":"experience-builder-support-multiple-lrs-services-in-web-map__doc178.md","s":3.884}]
```
-->

## Summary

Describes a user story for enabling data actions between widgets in the Experience Builder Event Editor application to improve workflow efficiency and data accuracy. Details specific data actions supported between widgets such as LRS Search, Add Point, Add Line, Split Event, Merge Event, LRS Identify, and Table for network and event layers. Includes testing, automation, and documentation considerations.

## Related documents

<!-- related:begin -->
- [Experience Builder Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget__doc362.md>) — similar text 0.27 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:362 -->
- [Search by Route and Measure Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-route-and-measure-experience-builder-widget__doc529.md>) — similar text 0.28 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:529 -->
- [Experience Builder Conflict Prevention User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-conflict-prevention-user-story__doc433.md>) — similar text 0.24 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:433 -->
- [LRS Identify widget User Story and Configuration](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/lrs-identify-widget-user-story-and-configuration__doc465.md>) — similar text 0.28 · 2 filename words · same kind/surface/folder <!-- rel:465 -->
- [Experience Builder Support Multiple LRS Services in Web Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-support-multiple-lrs-services-in-web-map__doc178.md>) — similar text 0.32 · 2 title words · same kind/surface/folder <!-- rel:178 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Add calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/add-calibration-points.html) · [Release locks through the LRS Locks table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/lrs-locks-table.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html)

_No page matched:_ [Add Line](https://www.google.com/search?q=%22Add%20Line%22+site%3Adoc.esri.com) · [Split Event](https://www.google.com/search?q=%22Split%20Event%22+site%3Adoc.esri.com) · [Merge Event](https://www.google.com/search?q=%22Merge%20Event%22+site%3Adoc.esri.com) · [LRS Identify](https://www.google.com/search?q=%22LRS%20Identify%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Experience Builder Data Actions

User Story

## Slide 2 — User Story

As an Event Editor, I need the ability to move between widgets in my Experience Builder Event Editor application without having to manually open them and copy data, so that my workflow can be completed efficiently and without data loss.

Personas
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.)  These users need to be able to complete multiple edits in an efficient and accurate manner.  Adding data actions between various LRS ExB widgets will help streamline their workflows and ensure accurate data is maintained.

## Slide 3 — Data Actions

Support the following data actions below (each action will be covered on a subsequent slide)

| LRS Search | Table, Add Point, Add Line |
| --- | --- |
| Add Point | Table |
| Add Line | Table |
| Split Event | Table |
| Merge Event | Table |
| LRS Identify | Add Point, Add Line, Table |
| Table (Network layer) | Add Point, Add Line |
| Table (Event layer) | Split Event, Merge Events |

## Slide 4 — LRS Search

Add data actions to launch Add Point and Add Line (three different options)
The table widget data action should already be covered as a configuration option
For the Add Point data action, take the route and measure information for the selected result and populate it in the widget
For the Add Line data action, take the route and measure information and populate it in the widget

  - If a single result is selected, allow the user to choose whether it will be the From or To Measure in the Add Line widget
  - If two results are selected, populate them as the From and To Measures in the Add Line widget

## Slide 5 — Add Point/Add Line

Both widgets have configurable options to open the table
If enabled, the table should open with a single new tab (single event) or in multiple tabs (multiple events)

## Slide 6 — Split/Merge Events

Both widgets have configurable options to open the table
If enabled, the table should open with a new tab unless the widget was launched from a selection in the table

## Slide 7 — LRS Identify

Add data actions to launch Add Point ,Add Line (two different options), and Table (two different options)
For the Add Point data action, take the route and measure information for the selected result and populate it in the widget
For the Add Line data action, take the route and measure information and populate it in the widget, but give the user two options

  - Use the selected measure as the From Measure
  - Use the selected measure as the To Measure
For the Table data action, there will be two options

  - Always show the option to open the Network layer in the table.  When selected, open the table with the route(s) that are selected in the Identify.  If there are more than one network being selected, open a different tab for each network and selected the route(s) in each tab.
  - If the LRS Identify is configured to show events, provide an option to open the Event layer(s) in the table.  When selected, open the table with a tab for each event layer in the Identify and select records that are present at the route/measure in the Identify.

## Slide 8 — Table (Network)

When a user selects a network record in the table, give them the option to open Add Point or Add Line via data actions
Only populate the routeID for the selected record in the widget that is opened
If more than 1 record is selected, do not allow either of the actions to be initiated (this will change in the future once we build an experience to add events to multiple routes at once)

## Slide 9 — Table (Event)

For a table with an LRS event, provide two data actions: Split Event and Merge Events
If one event record is selected, allow the user to select the Split Event action.  Open the Split widget and include the information from the selected event
If more than one event record is selected, allow the user to select the Merge Events action. (Should we do the date/measure adjacency check here or within the Merge Events widget?)

## Slide 10 — Testing

Test with a mix of APR, APRUN, RH, and Postmile data
Verify the tool aligns with any other Experience Builder specifications/requirements
508/i18n
Test with various themes

## Slide 11 — Automation

Can this be incorporated into the existing automation for the widgets we’re building?

## Slide 12 — Documentation

Update documentation for the LRS widgets to mention these available data actions and how they will copy data into the new widget being launched
Update screenshots as needed

## Slide 13 — Assignment

Story Points:
Dev:
PE:
