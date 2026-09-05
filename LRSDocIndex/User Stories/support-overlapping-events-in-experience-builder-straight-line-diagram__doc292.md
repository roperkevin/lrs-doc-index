# Support Overlapping Events in Experience Builder Straight Line Diagram

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [SupportOverlappingEvents_ExBSLD.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportOverlappingEvents_ExBSLD.pptx>) |
| **Edited** | 2024-11-18 21:35 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Overlapping Events in Experience Builder Straight Line Diagram"
source_file: "SupportOverlappingEvents_ExBSLD.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportOverlappingEvents_ExBSLD.pptx"
doc_id: 292
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Claire Wang"
last_edited: "2024-11-18T21:35:43Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["overlapping events", "dynamic segmentation", "straight line diagram", "event editing", "experience builder", "event pop up", "event attributes"]
tools: ["Dynamic Segmentation"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":291,"file":"support-overlapping-events-in-experience-builder-dynamic-segmentation-table__doc291.md","s":7.018},{"doc":289,"file":"support-overlapping-events-in-dynseg-tool__doc289.md","s":5.906},{"doc":290,"file":"support-overlapping-events-in-query-attribute-set-and-overlay-events-gp-tool__doc290.md","s":5.252},{"doc":348,"file":"experience-builder-straight-line-diagram-event-attributes-on-hover-click__doc348.md","s":5.227},{"doc":349,"file":"experience-builder-straight-line-diagram-symbology-and-display-field__doc349.md","s":4.89}]
```
-->

## Summary

This document describes a user story for enabling dynamic segmentation and editing of overlapping events within the Experience Builder Straight Line Diagram (SLD). It covers configuration options, acceptance criteria for event display and editing, testing scenarios, automation considerations, and documentation updates related to overlapping events support.

## Related documents

<!-- related:begin -->
- [Support Overlapping Events in Experience Builder Dynamic Segmentation Table](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-overlapping-events-in-experience-builder-dynamic-segmentation-table__doc291.md>) — similar text 0.40 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:291 -->
- [Support Overlapping Events in DynSeg Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-overlapping-events-in-dynseg-tool__doc289.md>) — similar text 0.29 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:289 -->
- [Support Overlapping Events in Query Attribute Set and Overlay Events GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-overlapping-events-in-query-attribute-set-and-overlay-events-gp-tool__doc290.md>) — similar text 0.27 · 3 title words · 3 filename words · same kind/folder <!-- rel:290 -->
- [Experience Builder Straight Line Diagram Event Attributes on Hover/Click](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-straight-line-diagram-event-attributes-on-hover-click__doc348.md>) — similar text 0.22 · 5 title words · same kind/surface/folder <!-- rel:348 -->
- [Experience Builder Straight Line Diagram Symbology and Display Field](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-straight-line-diagram-symbology-and-display-field__doc349.md>) — similar text 0.21 · 5 title words · same kind/surface/folder <!-- rel:349 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html)
<!-- docs:end -->

---

## Slide 1 — Support overlapping events in ExB SLD

User Story

## Slide 2

User Story
As an event editor, I need the ability to dynamically segment overlapping events from the same event layer and retrieve information for each event in a straight line diagram, in order to support measure-and-event based editing for my data.

Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). One workflow editors will utilize is to navigate and view the results of dynamic segmentation of LRS events in SLD and then edit the attributes. In LRS data, there could be overlapping events such as lane information for different lanes on the route, and point locations where crash often occurs. We supported dynamically segmenting overlapping events in Pro with editing capability and we want to support it within Experience Builder.

## Slide 3 — Configuration

In DynSeg configuration, add a toggle “Exclude Overlapping Events” above Merge coincident events.

- Default is off and if so, the tool runs considering all overlapping events
- To run without overlapping events, toggle it on
- Both table and SLD honor this configuration. Table is covered in another user story

![image1.png](../media/doc695_image1.png)

## Slide 4 — Acceptance Criteria (SLD Functionality 1)

![Diagram drawn from the slide's own shapes: 6 nodes (Express Lane, Highway lane, ramp, Express Lane), 1 connector.](../media/doc695_slide4.svg)

When there is no overlapping event, no matter if the option is checked, the result will be the same
When there are overlapping events but they are not included, do what we do today.
When overlapping events are included (see examples in slide 7), we should also return all event silvers in SLD

  - Stack additional silvers within the same event row (aka no grey gridline separation)
    - Verify silvers are arranged using the least space
  - All silvers show display field value
  - Each event silver continues to use their corresponding symbology if the event layer has different symbology for multiple values

![image2.png](../media/doc695_image2.png) ![image4.png](../media/doc695_image4.png)

## Slide 5 — Acceptance Criteria (SLD Functionality 2)

Continue to support line and point events
Continue to support Event Editing Pop-up.

  - It should already work without or with little code change since what it does is displaying information for the clicked event silver
  - When a value is edited, we should be able to find the corresponding event and pass the new value back to event table for this event only
  - Verify statistics are calculated using overlapping events no matter if overlapping events show in SLD or not
Continue to support hover

  - Hovering over an event silver should already work without or with little code change
  - When clicking a measure on measure bar, show the Measure and all the Display Field attributes for that cross section (both point and line events) and stack overlapping events in their own color (see example next slide)

## Slide 6

![Diagram drawn from the slide's own shapes: 25 nodes (Crash, Sign, Lanes, Speed Limit), 8 connectors.](../media/doc695_slide6.svg)

LaneType: Express Lane

![image6.png](../media/doc695_image6.png) ![image7.png](../media/doc695_image7.png) ![image9.png](../media/doc695_image9.png) ![image11.png](../media/doc695_image11.png) ![image13.jpeg](../media/doc695_image13.jpeg)

## Slide 7 — Testing

Test with RH and APR data
Test with and without overlapping events. When there are overlapping events, test with and without including them
Test editing event attributes in event pop up
Test hovering experiences
Test clicking experiences
Test the navigation buttons and verify all events are shown well
Test when multiple event layers have overlapping events
Test with overlapping events covering different portions of the route
Test different search ranges
Test with overlapping point and line events – spanning and non-spanning
Test routes with complex shapes

## Slide 8 — Automation

Existing automation might break. If so, update them by setting to Exclude.
Add new automation cases where overlapping events are included. Overall, there should be cases for including and excluding overlapping events.

## Slide 9 — Documentation

Add language to existing DynSeg widget topic about overlapping events support.

## Slide 10 — Assignment

Story Points:
Dev:
PE:
