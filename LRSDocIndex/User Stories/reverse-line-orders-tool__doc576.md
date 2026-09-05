# Reverse Line Orders tool

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing |
| **Source** | [ReverseLineOrderstool.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ReverseLineOrderstool.pptx>) |
| **Edited** | 2023-04-06 23:42 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Reverse Line Orders tool"
source_file: "ReverseLineOrderstool.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ReverseLineOrderstool.pptx"
doc_id: 576
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2023-04-06T23:42:11Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["reverse line order", "routes", "line network", "derived route", "time slices", "geoprocessing tool"]
tools: ["Reverse Line Orders"]
products: ["Pipeline Referencing"]
issues: []
related: [{"doc":530,"file":"enhance-reverse-line-orders-tool-to-create-common-time-slice__doc530.md","s":6.764},{"doc":547,"file":"test-plan-reverse-line-orders-gp-tool__doc547.md","s":4.867},{"doc":629,"file":"investigate-line-order-with-reverse-stationing__doc629.md","s":3.966},{"doc":728,"file":"support-reverse-route-event-behaviors__doc728.md","s":3.701},{"doc":743,"file":"support-reverse-route-in-pro__doc743.md","s":3.686}]
```
-->

## Summary

This document describes a user story for creating a geoprocessing tool that reverses the line order for routes on a line in a linear referencing system. It details the tool's inputs, expected behavior with time slices, and testing scenarios. It also includes plans for automation via Python and documentation creation.

## Related documents

<!-- related:begin -->
- [Enhance Reverse Line Orders tool to create common time slice](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/enhance-reverse-line-orders-tool-to-create-common-time-slice__doc530.md>) — similar text 0.54 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:530 -->
- [Test Plan: Reverse Line Orders GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/test-plan-reverse-line-orders-gp-tool__doc547.md>) — similar text 0.19 · 4 title words · 3 filename words · same surface <!-- rel:547 -->
- [Investigate Line Order with Reverse Stationing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/investigate-line-order-with-reverse-stationing__doc629.md>) — similar text 0.21 · 2 title words · 2 filename words · same surface/folder <!-- rel:629 -->
- [Support Reverse Route Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-event-behaviors__doc728.md>) — similar text 0.31 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:728 -->
- [Support Reverse Route in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-in-pro__doc743.md>) — similar text 0.31 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:743 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Reverse Line Orders](https://www.google.com/search?q=%22Reverse%20Line%20Orders%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Reverse Line Orders tool

## Slide 2 — User Story

As an LRS editor, I need to be able to reverse the line order for the routes on a line, so I can ensure derived routes are created correctly in reverse stationing scenarios.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  In some scenarios, the line order for routes on a line may need to be reversed in order to build the derived route correctly (Buckeye is an example of a customer that needs this).

## Slide 3 — Reverse Line Orders tool

Create a GP tool that will allow users to reverse the line orders for the routes on a line
Inputs to the tool would be:

  - Network feature class (with a selection set)
The network selected must be a line network (don’t support Postmile Networks)
The tool should require a selection set on the network feature class, otherwise it should fail with an error message about selection being required (like the Delete Routes tool)
If one route on a line is selected, all the routes on the line should be considered selected and reversed (like the Delete Routes tool) to ensure the line orders continue to make sense for the purpose of creating a derived route
Time slices of routes should be honored (i.e., if there are two time slices of route A/line 1 and only the recent time slice is selected, only the routes on line 1 during that time slice should be updated)

## Slide 4 — Testing

Test on APR line network data
Test scenarios where all the routes on the line are in a single direction along with scenarios where there are reverse stationed routes throughout the line
Test selecting a single route as well as multiple routes being selected
Test with multiple time slices of a route

## Slide 5 — Automation

Automate this via python like other GP tools

## Slide 6 — Documentation

Create a new GP topic for this tool
PE to provide the sample scripts for the topic

## Slide 7 — Assignment

Story Points:
Dev:
PE:
