# Experience Builder Straight Line Diagram Event Attributes/Editing on Click

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [ExpBld StraightLineDiagramPopupAttributesforEditingClick.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExpBld%20StraightLineDiagramPopupAttributesforEditingClick.pptx>) |
| **Edited** | 2024-07-30 17:37 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Experience Builder Straight Line Diagram Event Attributes/Editing on Click"
source_file: "ExpBld StraightLineDiagramPopupAttributesforEditingClick.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExpBld%20StraightLineDiagramPopupAttributesforEditingClick.pptx"
doc_id: 345
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: "Nathan Easley"
last_edited: "2024-07-30T17:37:21Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["straight line diagram", "event attributes", "editing", "derived fields", "export", "event layers", "experience builder"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":348,"file":"experience-builder-straight-line-diagram-event-attributes-on-hover-click__doc348.md","s":8.755},{"doc":349,"file":"experience-builder-straight-line-diagram-symbology-and-display-field__doc349.md","s":8.318},{"doc":464,"file":"search-by-line-experience-builder-widget__doc464.md","s":5.178},{"doc":361,"file":"experience-builder-dynamic-segmentation-widget-additional-options__doc361.md","s":5.066},{"doc":362,"file":"experience-builder-dynamic-segmentation-widget__doc362.md","s":4.972}]
```
-->

## Summary

This user story describes the need for event editors to view and edit multiple LRS event attributes visualized in a straight line diagram based on measures along a route. It includes requirements for editable and non-editable fields, derived field calculations, UI behavior, export functionality, and configuration options for event layers. Testing scenarios and documentation updates are also outlined.

## Related documents

<!-- related:begin -->
- [Experience Builder Straight Line Diagram Event Attributes on Hover/Click](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-straight-line-diagram-event-attributes-on-hover-click__doc348.md>) — similar text 0.58 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:348 -->
- [Experience Builder Straight Line Diagram Symbology and Display Field](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-straight-line-diagram-symbology-and-display-field__doc349.md>) — similar text 0.52 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:349 -->
- [Search by Line Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-line-experience-builder-widget__doc464.md>) — similar text 0.29 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:464 -->
- [Experience Builder Dynamic Segmentation Widget Additional Options](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-additional-options__doc361.md>) — similar text 0.35 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:361 -->
- [Experience Builder Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget__doc362.md>) — similar text 0.32 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:362 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/edit-feature-services.html)

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Experience Builder Straight Line Diagram Event Attributes/Editing on click

User Story
ArcGIS Enterprise

## Slide 2 — User Story

As an event editor, I need the ability to view and edit multiple LRS event attributes visualized in a diagram based on measures along the route, so I can view the relationships between different data layers attributes while editing.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). One workflow editors will utilize is to view event data in a straight-line diagram view where the layers are visualized, and gaps and overlaps can easily be identified.  In addition to being used for editing, this diagram will be utilized by many users throughout the organization as it will provide a visualization of event layers and how they align spatially along a route with each other.

## Slide 3 — Straight Line Diagram

![image1.png](../media/doc625_image1.png)

## Slide 4 — Straight Line Diagram

![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc625_slide4.svg)

In the SLD, when a user clicks a record (rectangle), show a pop up that shows the editable fields, the non editable fields, and calculated fields (if configured for the layer)
The editable fields will include the non LRS attributes (speed limit, etc.) and some LRS attributes (From Date, To Date, Measure(s)) that users can change for the selected event
The non editable fields will include the other LRS and system fields (RouteID, EventID, OID, etc.)
The derived fields (first, last, min, max, average, median, mean) will need to be calculated when the user clicks on the record.  These calculations need to occur for this measure range across all time (note that the EventID may be different at this location across time)
Users will need to click apply for these changes to be applied and for the UI to close
They can also close the UI by clicking an X button.  If they close and there are unsaved changes, prompt the user whether they want to apply the changes or not.
Support being able to export all this information using an export button (export the results as a CSV)

![image2.png](../media/doc625_image2.png)

## Slide 5 — Straight Line Diagram

![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc625_slide5.svg)

Fit the pop up at up to 50% of the vertical space.  If it exceeds this number, provide a scrolling experience.
If the location being clicked is at the beginning/end of two events, choose the upstream event and show its attribute(s)
Highlight the event on the map when clicked; also highlight the record in the SLD so the user can see it selected
Note that the click experience should work in both desktop and mobile
To see the designs as reference, see https://www.figma.com/design/dIN1OfZDxhT7i9pbefdoTj/LRS?node-id=506-130104&t=wxNbCEfAcfChEXKx-0

![image2.png](../media/doc625_image2.png)

## Slide 6 — Configuration

Add the following configuration options to this story

  - For each event layer that is included in the SLD, provide an option to configure whether derived fields will be included (default is disabled for all fields)

## Slide 7 — Testing

Test with a mix of APR, RH data (INDOT cracking layer as one of the layers in the dynseg)
Test with a mix or point, line, and spanning events
Test a variety of non LRS attributes types configured (domains, ranges, contingent values, etc.)
Test with derived fields for both point and line events
Test with a number of different records over time in the same measure range to ensure derived fields are calculated correctly

## Slide 8 — Automation

Don’t automate the widget yet as this is the first of multiple user stories for this widget.

## Slide 9 — Documentation

Add to the existing topic created in the previous user story
Focus specifically on this click option and what capabilities will be available to users (editing, export, derived fields)

## Slide 10 — Story Points

Story Points:
Dev:
PE:
