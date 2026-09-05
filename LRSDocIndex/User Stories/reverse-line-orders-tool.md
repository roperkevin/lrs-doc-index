# Reverse Line Orders tool

| Field | Value |
| --- | --- |
| **Doc** | 576 · User Story · Pro |
| **Product** | Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [ReverseLineOrderstool.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ReverseLineOrderstool.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2023-04-06 23:42 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | reverse line order · routes · line network · derived route · time slices · geoprocessing tool |
| **Tools** | Reverse Line Orders |

## Summary

This document describes a user story for creating a geoprocessing tool that reverses the line order for routes on a line in a linear referencing system. It details the tool's inputs, expected behavior with time slices, and testing scenarios. It also includes plans for automation via Python and documentation creation.

## Related documents

<!-- related:begin -->
- [Enhance Reverse Line Orders tool to create common time slice](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/enhance-reverse-line-orders-tool-to-create-common-time-slice.md>) — similar text 0.54 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:530 s=6.764 -->
- [Test Plan: Reverse Line Orders GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4983-reverse-line-orders-gp.md>) — similar text 0.19 · 4 title words · 3 filename words · same surface <!-- rel:547 s=4.867 -->
- [Investigate Line Order with Reverse Stationing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/investigate-line-order-with-reverse-stationing.md>) — similar text 0.21 · 2 title words · 2 filename words · same surface/folder <!-- rel:629 s=3.966 -->
- [Support Reverse Route Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-eb-rh-apr-un-2021-03.md>) — similar text 0.31 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:728 s=3.701 -->
- [Support Reverse Route in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-in-pro.md>) — similar text 0.31 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:743 s=3.686 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Reverse Line Orders](https://www.google.com/search?q=%22Reverse%20Line%20Orders%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Reverse Line Orders tool <!-- slide 1 -->

### User Story <!-- slide 2 -->
As an LRS editor, I need to be able to reverse the line order for the routes on a line, so I can ensure derived routes are created correctly in reverse stationing scenarios.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  In some scenarios, the line order for routes on a line may need to be reversed in order to build the derived route correctly (Buckeye is an example of a customer that needs this).

## Acceptance Criteria
### Reverse Line Orders tool <!-- slide 3 -->
- Create a GP tool that will allow users to reverse the line orders for the routes on a line
- Inputs to the tool would be:
  - Network feature class (with a selection set)
- The network selected must be a line network (don’t support Postmile Networks)
- The tool should require a selection set on the network feature class, otherwise it should fail with an error message about selection being required (like the Delete Routes tool)
- If one route on a line is selected, all the routes on the line should be considered selected and reversed (like the Delete Routes tool) to ensure the line orders continue to make sense for the purpose of creating a derived route
- Time slices of routes should be honored (i.e., if there are two time slices of route A/line 1 and only the recent time slice is selected, only the routes on line 1 during that time slice should be updated)

## Testing
<!-- slide 4 -->
- Test on APR line network data
- Test scenarios where all the routes on the line are in a single direction along with scenarios where there are reverse stationed routes throughout the line
- Test selecting a single route as well as multiple routes being selected
- Test with multiple time slices of a route

## Automation
<!-- slide 5 -->
Automate this via python like other GP tools

## Documentation
<!-- slide 6 -->
- Create a new GP topic for this tool
- PE to provide the sample scripts for the topic

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
