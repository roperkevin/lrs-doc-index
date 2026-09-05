# Enhance Reverse Line Orders tool to create common time slice

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [ReverseLineOrdersCommonTimeslice.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ReverseLineOrdersCommonTimeslice.pptx>) |
| **Edited** | 2023-07-31 18:19 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Enhance Reverse Line Orders tool to create common time slice"
source_file: "ReverseLineOrdersCommonTimeslice.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ReverseLineOrdersCommonTimeslice.pptx"
doc_id: 530
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2023-07-31T18:19:42Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["reverse line orders", "time slice", "route reversal", "derived routes", "centerline sequence table"]
tools: ["Reverse Line Orders"]
products: []
issues: []
related: [{"doc":576,"file":"reverse-line-orders-tool__doc576.md","s":6.764},{"doc":547,"file":"test-plan-reverse-line-orders-gp-tool__doc547.md","s":4.604},{"doc":629,"file":"investigate-line-order-with-reverse-stationing__doc629.md","s":4.069},{"doc":686,"file":"add-multiple-line-events-tool-in-arcgis-pro__doc686.md","s":3.498},{"doc":687,"file":"add-line-event-tool-in-arcgis-pro__doc687.md","s":3.483}]
```
-->

## Summary

This document describes a user story for enhancing the Reverse Line Orders tool to handle routes on a line with different time slices by creating common time slices before reversal. It includes the scenario, testing scope, automation notes, and documentation requirements for the tool update.

## Related documents

<!-- related:begin -->
- [Reverse Line Orders tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/reverse-line-orders-tool__doc576.md>) — similar text 0.54 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:576 -->
- [Test Plan: Reverse Line Orders GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/test-plan-reverse-line-orders-gp-tool__doc547.md>) — similar text 0.22 · 4 title words · 2 filename words · same surface <!-- rel:547 -->
- [Investigate Line Order with Reverse Stationing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/investigate-line-order-with-reverse-stationing__doc629.md>) — similar text 0.17 · 2 title words · 2 filename words · same surface/folder <!-- rel:629 -->
- [Add Multiple Line Events tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-multiple-line-events-tool-in-arcgis-pro__doc686.md>) — similar text 0.19 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:686 -->
- [Add Line Event tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-tool-in-arcgis-pro__doc687.md>) — similar text 0.18 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:687 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior for route reversal](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-behavior-for-route-reversal.html) · [View centerline sequence table properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-centerline-sequence-table-properties.html)

_No page matched:_ [Reverse Line Orders](https://www.google.com/search?q=%22Reverse%20Line%20Orders%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Enhance Reverse Line Orders tool to create common time slice

## Slide 2 — User Story

As an LRS editor, I need to be able to reverse the line order for the routes on a line, so I can ensure derived routes are created correctly in reverse stationing scenarios.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  In some scenarios, the line order for routes on a line may need to be reversed in order to build the derived route correctly (Buckeye is an example of a customer that needs this).

## Slide 3 — Reverse Line Orders tool

This is a result of scenarios uncovered in the initial user story testing where multiple routes on the same line don’t have common time slices and after reversal, their line orders are incorrect
Enhance the Reverse Line Orders tool to create common time slices of routes on a line before they’re reversed
When all the routes on the line have the same date ranges, the tool can continue to work as it does today
When there are different dates and time slice ranges on the routes on the line, all the routes need to be updated so that their time slices align (and can be reversed correctly)
As part of this update, the centerline sequence table will need to be updated to account for the new time slices of route(s)
Example scenario on the next page

## Slide 4

![Measured route diagram drawn from the slide's own shapes.](../media/doc410_slide4.svg)

| Route | From Date | To Date | Line Order |
| --- | --- | --- | --- |
| R1 | 1/1/00 | Null | 100 |
| R2 | 1/1/05 | 1/1/10 | 200 |
| R3 | 1/1/10 | 1/1/15 | 200 |
| R3 | 1/1/15 | Null | 200 |
| R4 | 1/1/17 | Null | 300 |
| R5 | 1/1/20 | Null | 400 |

| Route | From Date | To Date | Line Order |
| --- | --- | --- | --- |
| R1 | 1/1/00 | 1/1/05 | 100 |
| R1 | 1/1/05 | 1/1/10 | 200 |
| R1 | 1/1/10 | 1/1/15 | 200 |
| R1 | 1/1/15 | 1/1/17 | 200 |
| R1 | 1/1/17 | 1/1/20 | 300 |
| R1 | 1/1/20 | Null | 400 |
| R2 | 1/1/05 | 1/1/10 | 100 |
| R3 | 1/1/10 | 1/1/15 | 100 |
| R3 | 1/1/15 | 1/1/17 | 100 |
| R3 | 1/1/17 | 1/1/20 | 200 |
| R3 | 1/1/20 | Null | 300 |
| R4 | 1/1/17 | 1/1/20 | 100 |
| R4 | 1/1/20 | Null | 200 |
| R5 | 1/1/20 | Null | 100 |

Before Reversal					          After Reversal
00 – R1 created
05 – R2 created
10 – R2 reassigned to R3
15 – R3 extended
17 – R4 created
20 – R5 created

## Slide 5 — Testing

Test only the scenarios from the previous test plan that included multiple routes on a line with different from/to dates

## Slide 6 — Automation

These test cases should already be included in the automation from the previous user story for the tool

## Slide 7 — Documentation

Provide a usage note in the topic written for the tool that let’s the user know that routes with different time slices on the line being reversed will be time sliced as part of the process

## Slide 8 — Assignment

Story Points:
Dev:
PE:
