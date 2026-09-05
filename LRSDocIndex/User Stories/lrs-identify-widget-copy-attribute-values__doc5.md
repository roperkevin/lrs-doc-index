# LRS Identify Widget - Copy Attribute Values

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [ExB - CopyAllAttributesLRSIdentify.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20CopyAllAttributesLRSIdentify.pptx>) |
| **Edited** | 2026-07-24 18:48 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "LRS Identify Widget - Copy Attribute Values"
source_file: "ExB - CopyAllAttributesLRSIdentify.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20CopyAllAttributesLRSIdentify.pptx"
doc_id: 5
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2026-07-24T18:48:09Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["copy attribute", "attribute value", "experience builder", "event attributes", "route attributes", "clipboard"]
tools: ["LRS Identify"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":26,"file":"lrs-identify-widget-configurable-coordinate-output__doc26.md","s":4.271},{"doc":465,"file":"lrs-identify-widget-user-story__doc465.md","s":3.955},{"doc":23,"file":"enhancement-display-expanded-lrs-and-business-attributes-in-sld-hover-tooltip__doc23.md","s":3.39},{"doc":13,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md","s":3.354},{"doc":905,"file":"lrs-identify-widget__doc905.md","s":3.181}]
```
-->

## Summary

User story for adding a copy-to-clipboard action for attribute values in the Experience Builder LRS Identify widget. Covers personas, workflow, acceptance criteria, testing, automation, and documentation updates to enable copying attribute values from route and event attributes efficiently and accessibly.

## Related documents

<!-- related:begin -->
- [LRS Identify Widget – Configurable Coordinate Output](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-identify-widget-configurable-coordinate-output__doc26.md>) — similar text 0.27 · 2 title words · same kind/surface/folder <!-- rel:26 -->
- [LRS Identify widget User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-identify-widget-user-story__doc465.md>) — similar text 0.25 · 2 title words · same kind/surface/folder <!-- rel:465 -->
- [Enhancement: Display Expanded LRS and Business Attributes in SLD Hover Tooltip](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/enhancement-display-expanded-lrs-and-business-attributes-in-sld-hover-tooltip__doc23.md>) — similar text 0.19 · same kind/surface/folder <!-- rel:23 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md>) — similar text 0.15 · 1 title word · same kind/surface/folder <!-- rel:13 -->
- [LRS Identify widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-identify-widget__doc905.md>) — similar text 0.16 · 2 title words · same surface <!-- rel:905 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html)

_No page matched:_ [LRS Identify](https://www.google.com/search?q=%22LRS%20Identify%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

LRS Identify Widget - Copy Attribute Values
User Story

### Notes

Generated user story deck.

[Sources]
- Template structure based on TemplateUserStory.pptx.
- LRS Identify context based on ExpBld LRS Identify.pptx and LRS_Identify_User_Story_Final_v4.pptx.

## Slide 2

I Need, Personas, Workflow
As an Event Editor, Field Technician, or GIS Analyst using the Experience Builder LRS Identify widget, I need the ability to copy the value from any displayed attribute row, so that I can quickly reuse LRS Identify information in other forms, tools, reports, or communications without manually selecting text.

Personas: Event Editor - maintains route characteristics and event attributes and needs fast reuse of route, measure, and event values. Field Technician - captures or validates information in the field and needs to transfer Identify values into downstream collection or response forms. GIS Analyst - investigates LRS results and needs to reuse individual attribute values for queries, QA/QC, and analysis.

Workflow: Enable LRS Identify -> Click route on map -> Review route/event attributes -> Hover over a specific attribute row -> Click copy button -> Attribute value is copied to clipboard -> Paste value into another workflow.

### Notes

[Sources]
- ExpBld LRS Identify.pptx states that users need to click a location on a route to get route/measure/event attribute information and capture it for additional queries or other forms/UI.
- ExpBld LRS Identify.pptx describes Event Editor and Field Technician personas.
- LRS_Identify_User_Story_Final_v4.pptx references copy/use results in the LRS Identify workflow.

## Slide 3

Acceptance Criteria & Requirements (1/2)

- Add a copy-to-clipboard action for every displayed attribute row in the LRS Identify results.
- The copy action copies only the attribute value, not the attribute name, alias, layer name, or row label.
- The copy button is context specific and appears only when the user hovers the mouse over the specific attribute row.
- The copy button is visually associated with the hovered row and must not appear for other rows at the same time.
- The action applies to route, measure, configured network attributes, non-LRS route attribute, and event attribute rows that are visible in the results.
- Copy behavior must work when results contain multiple routes, multiple time slices, and event sections expanded or collapsed.

### Notes

[Sources]
- ExpBld LRS Identify.pptx describes LRS Identify results including route, measure, route attributes, and event attributes.
- ExpBld LRS Identify.pptx describes multiple route and time slice scenarios.
- User clarified that the copied content should be attribute value only.

## Slide 4

Acceptance Criteria & Requirements (2/2)

- Clicking the copy button copies the current row value to the clipboard without changing the active result, selected route, time slice, accordion state, scroll position, or map marker.
- Show lightweight feedback after a successful copy, such as a copied tooltip or temporary status message.
- If clipboard access fails, show a non-blocking message and do not alter the Identify results.
- Support keyboard and assistive technology access by revealing the same row-specific copy action when an attribute row receives focus.
- The hover/focus copy action must meet 508 requirements, support localization, and work across light/dark Experience Builder themes.
- No regression to existing Identify workflows, paging, result display, event visibility, or current copying behavior for coordinates.

### Notes

[Sources]
- ExpBld LRS Identify.pptx includes 508/i18n and theme testing expectations.
- ExpBld LRS Identify.pptx describes existing paging, time slice, and event visibility behavior.
- LRS_Identify_User_Story_Final_v4.pptx includes no regression and copy-to-clipboard expectations.

## Slide 5

Testing

- Validate copy button visibility: hidden by default, visible only on hovered/focused attribute row, and hidden again when hover/focus leaves.
- Validate copied content for route ID/name, measure, configured network fields, non-LRS route attributes, and event attributes.
- Confirm only the value is copied for text, numeric, date, coded value/domain, null/empty, and long text values.
- Test multiple routes, multiple time slices, configured event sections, collapsed/expanded accordions, and scrollable result panels.
- Verify behavior in supported browsers, light/dark themes, keyboard navigation, screen reader labels, and localized UI.
- Regression test existing LRS Identify workflows, including Identify click behavior, result paging, event display, and coordinate copy if present.

### Notes

[Sources]
- ExpBld LRS Identify.pptx lists testing areas including APR/RH data, projections, multiple routes, multiple time slices, 508/i18n, themes, and Experience Builder requirements alignment.
- LRS_Identify_User_Story_Final_v4.pptx includes validating copy-to-clipboard format and regression testing.

## Slide 6

Automation
Add UI automation to the existing automation for the tool to highlight this functionality

### Notes

[Sources]
- ExpBld LRS Identify.pptx says automation should follow the process used to automate the other Experience Builder widgets.
- LRS_Identify_User_Story_Final_v4.pptx includes clipboard format validation and regression automation.

## Slide 7

Documentation
Update the LRS Identify widget documentation to describe row-level copy behavior in Identify results.  Document that:

- The copy action copies only the attribute value and does not include the field name, alias, or layer name.
- Where and when the copy button appears: on mouse hover or keyboard focus for a specific attribute row.

### Notes

[Sources]
- ExpBld LRS Identify.pptx states that widget documentation should follow the Experience Builder widget documentation format.
- LRS_Identify_User_Story_Final_v4.pptx includes documenting copy-to-clipboard behavior.

## Slide 8

Estimation
Story Points:
Dev Effort:
PE Effort:

### Notes

[Sources]
- TemplateUserStory.pptx includes an Estimation slide with estimation, dev effort, and PE effort placeholders.
