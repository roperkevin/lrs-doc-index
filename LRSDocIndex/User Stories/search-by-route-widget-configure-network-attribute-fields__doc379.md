# Search by Route widget – configure network attribute fields

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Source** | [SearchbyRoute_ConfigFields.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SearchbyRoute_ConfigFields.pptx>) |
| **Edited** | 2024-05-08 16:11 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Search by Route widget – configure network attribute fields"
source_file: "SearchbyRoute_ConfigFields.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SearchbyRoute_ConfigFields.pptx"
doc_id: 379
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Praveen Kumar"
last_edited_by: "Claire Wang"
last_edited: "2024-05-08T16:11:37Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["search by route", "network attribute fields", "nonLRS attributes", "event editor", "field display", "experience builder"]
tools: ["Search by Route"]
products: []
issues: []
related: [{"doc":378,"file":"search-by-route-widget-results-flow-into-table__doc378.md","s":5.689},{"doc":377,"file":"show-derived-network-information-in-search-by-route-widget__doc377.md","s":5.647},{"doc":380,"file":"search-by-line-and-measure-user-story__doc380.md","s":4.562},{"doc":490,"file":"search-by-station-experience-builder-widget-user-story__doc490.md","s":4.093},{"doc":476,"file":"search-by-referent-experience-builder-widget__doc476.md","s":4.035}]
```
-->

## Summary

This document describes a user story for the Search by Route widget focusing on configuring network attribute fields to show or hide nonLRS and LRS fields in search results. It details configuration options, user needs, testing scenarios, and automation documentation for the widget. The goal is to enhance event editors' ability to efficiently retrieve and display route information relevant to their analysis and editing tasks.

## Related documents

<!-- related:begin -->
- [Search by Route widget – results flow into table](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-route-widget-results-flow-into-table__doc378.md>) — similar text 0.37 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:378 -->
- [Show Derived Network Information in Search by Route Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/show-derived-network-information-in-search-by-route-widget__doc377.md>) — similar text 0.36 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:377 -->
- [Search by Line and Measure User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/search-by-line-and-measure-user-story__doc380.md>) — similar text 0.42 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:380 -->
- [Search by Station Experience Builder widget User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/search-by-station-experience-builder-widget-user-story__doc490.md>) — similar text 0.33 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:490 -->
- [Search by Referent Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-referent-experience-builder-widget__doc476.md>) — similar text 0.35 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:476 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Search by Route](https://www.google.com/search?q=%22Search%20by%20Route%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Search by Route widget – configure network attribute fields

User Story

## Slide 2 — User Story

As an Event Editor, I need the ability to show nonLRS attribute fields in search result. I also need the experience of configuring show/hide for all attribute fields, so that I can efficiently retrieve route information that is needed.

Persona
Event Editor: These users are responsible for analyzing route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.)  These users need the configuration of what network attribute fields are displayed or not, to orient themselves on the map in preparation for event editing.

## Slide 3

![Interface screenshot redrawn as a standardized wireframe: 2 panels, 9 buttons, 2 colour blocks, 3 row separators, 4 icons, 67 text rows. 45 of 67 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc586_slide3.svg)

Showing Derived fields user story should be implemented before this one

![image2.png](../media/doc586_image2.png)

## Slide 4 — Configuration

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 6 buttons, 1 colour block, 3 row separators, 2 icons, 39 text rows. 32 of 39 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc586_slide4.svg)

- Add a section “Advance field display” after result sorting
- Add the ability to show nonLRS fields in search result
- All fields are configurable to show/hide
- Advance field display is off by default. In this case, show fields in search result as we do today
- When turned on, 2 lists appear below. The fields that are shown by default are checked (e.g. LRS fields), and vice versa. User can further check or uncheck any field
  - Network fields are fields that are actually in network feature class. Except editor tracking and system fields
  - Additional fields are not directly in network feature class, e.g. measures and derived network fields
  - If derived network is not in webmap or is removed from Search widget, the checkboxes do not show
- Allow users to uncheck all fields
- Verify after checking and unchecking some fields, turning Advance field display off will still show default fields. Then, the last selection is remembered when turning Advance field display back on

![image3.png](../media/doc586_image3.png)

## Slide 5 — Search result

![Interface screenshot redrawn as a standardized wireframe: 3 panels, 4 row separators, 3 icons, 41 text rows. 24 of 41 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc586_slide5.svg)

- After setting up displayed fields, the route table in search result should honor configuration
- Field display does not affect search logic
  - E.g. Measure field is hidden but user searches for a measure. We should still point to and label that location on the route, despite not showing Measure in table
  - E.g. Route ID field is hidden but it’s configured as a sort field. We should still sort routes by Route ID, despite not showing Route ID field in table
- When all fields are hidden, the search result is a list of routes without route caret
- When fields are hidden, using data action to populate other widgets should still work

![image4.png](../media/doc586_image4.png)

## Slide 6 — Configure network attribute fields Testing

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc586_slide6.svg)

- Test with non-line and line network
  - In configuration, verify the fields get listed are correct (e.g. when network is non-line, there is no Line or Derived field checkbox)
- Test with networks that have and do not have business fields
- Verify the business fields show field alias in search result
- Verify the tool aligns with any other Experience Builder specifications/requirements
- Test both configuration and UI
  - Focus testing new functionality. Also verify field display does not affect search logic
- Test hiding all kinds of fields
- Test on a variety of route shapes
- Test time slices
- 508/l18n testing
- Test with different themes
- Test in Chrome and Firefox
- Test in different sizes (web, tab and mobile)

## Slide 7 — Configure network attribute fields Automation Documentation

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc586_slide7.svg)

Automate with “Search by Line” and “Display Derived fields in search result” so all capabilities are captured
Add the method to existing Search by Route widget topic

May include graphic examples in the doc

## Slide 8 — Configure network attribute fields Assignment

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc586_slide8.svg)

Story Points:
Dev:
PE:
