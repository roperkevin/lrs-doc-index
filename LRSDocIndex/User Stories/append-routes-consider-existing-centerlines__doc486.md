# Append Routes Consider Existing Centerlines

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Issue** | [ArcGISPro/ps-location-referencing#3004](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/3004) |
| **Source** | [Append Routes consider existing centerlines all LRS types.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Append%20Routes%20consider%20existing%20centerlines%20all%20LRS%20types.pptx>) |
| **Edited** | 2023-10-20 00:37 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Append Routes Consider Existing Centerlines"
source_file: "Append Routes consider existing centerlines all LRS types.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Append%20Routes%20consider%20existing%20centerlines%20all%20LRS%20types.pptx"
doc_id: 486
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2023-10-20T00:37:44Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["append routes", "centerlines", "route geometry", "geoprocessing tool", "data loading", "error handling"]
tools: ["Append Routes"]
products: ["Pipeline Referencing", "Utility Network"]
issues: ["ArcGISPro/ps-location-referencing#3004"]
related: [{"doc":469,"file":"append-routes-consider-existing-centerlines-test-plan__doc469.md","s":1004.552},{"doc":741,"file":"append-routes-with-existing-utility-network-centerlines__doc741.md","s":7.978},{"doc":709,"file":"consider-route-dominance-in-append-routes__doc709.md","s":5.9},{"doc":817,"file":"explode-multipart-centerlines-in-editing-activities-and-append-routes__doc817.md","s":4.931},{"doc":165,"file":"append-routes-partial-loading-support__doc165.md","s":4.53}]
```
-->

## Summary

This user story describes enhancing the Append Routes geoprocessing tool to consider existing centerline features when appending new or supplemental routes to a network. It includes requirements for matching route and centerline geometries, failure conditions, testing scenarios, automation updates, and documentation changes. The goal is to preserve centerline attributes and avoid running the Remove Overlapping Centerlines tool unnecessarily.

## Related documents

<!-- related:begin -->
- [Append Routes consider existing centerlines – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-routes-consider-existing-centerlines-test-plan__doc469.md>) — shared issue ArcGISPro/ps-location-referencing#3004 · similar text 0.28 · 5 title words · 1 filename word · same surface <!-- rel:469 -->
- [Append Routes with existing Utility Network centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-with-existing-utility-network-centerlines__doc741.md>) — similar text 0.70 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:741 -->
- [Consider Route Dominance in Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/consider-route-dominance-in-append-routes__doc709.md>) — similar text 0.32 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:709 -->
- [Explode multipart centerlines in editing activities and Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/explode-multipart-centerlines-in-editing-activities-and-append-routes__doc817.md>) — similar text 0.16 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:817 -->
- [Append Routes Partial Loading Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-partial-loading-support__doc165.md>) — similar text 0.31 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:165 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html)

_No page matched:_ [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Append Routes consider existing centerlines

User Story

## Slide 2 — User Story

As a LRS data loader, I want to be able to associate routes being appended to existing centerlines, so I can preserve centerline attributes and not have to run the Remove Overlapping Centerlines tool.

Persona
LRS data loader: This user is responsible for initial and supplemental bulk data loading in the LRS.  We already support considering existing centerlines when a UN is in place, however, we want to extend that out to support other use cases, such as local government with existing centerlines for addressing or supplemental data loading scenarios where running Remove Overlapping Centerlines would introduce slivers or other odd geometries.

## Slide 3 — Append Routes considering existing centerlines

Enhance the Append Routes GP tool to consider existing centerline features when appending in new/supplemental routes to a network
We should support this with an optional parameter called “Consider existing centerlines”.  This parameter would appear as an optional checkbox in the UI.
As part of this change, we should remove the UN check that was implemented in a previous user story.  This checkbox will now dictate whether we add new centerlines during append or look to consider existing centerlines.
When checked, use the existing logic that was implemented for the UN centerline user story (https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/3004):

  - Load the source routes into the network feature class like we do today
  - Perform any validations like we do today
  - Associate each newly appended route with existing centerline(s) by creating a centerline sequence record and CenterlineID GUID (see next slide for specifics)
  - Do this for each appended route
  - Note that multiple routes could share the same centerline (centerline sequence records would just need to reflect that)

## Slide 4 — Append Routes considering existing centerlines

There shouldn’t be a need to split centerlines since routes should begin/end where centerlines begin/end.  Don’t load the route feature if it would require a centerline split.  Instead have the tool fail, include an error message and additional info in the txt file output.
If a centerline is a partial match (part of the centerline matches the route but part of it is outside the XY tolerance), don’t load the route feature, have the tool fail, include an error message and additional info in the txt file output
If an appended route has one or more whole centerlines that match the geometry, but there are some locations where no centerlines exist, have the tool fail, provide an error message and additional info in the txt output
If there are no centerlines that match an appended route, have the tool fail, provide an error message and additional info in the txt output
If we encounter overlapping centerlines, have the tool fail, and provide an error message with additional info in the txt output
This should apply to all three methods for the tool (Add, Replace by RouteID, Retire by RouteID)
When we say the geometries should match, we mean XY and Z should match
When we say, “have the tool fail”, we should still go through and attempt to load all the routes in the source route feature class, but if 1 or more doesn’t match exactly as expected with the centerlines, we should not load any of the routes, have the tool fail, and provide an error message and information in the txt file (listing each route that doesn’t match centerline(s)) so they can make changes and run the tool again successfully

## Slide 5 — Testing

Test on line and non line networks
Verify that the tool still works with a UN (automation should cover this)
Test with the following centerline-route scenarios (not limited to)

  - Appended route has 1 centerline that is an exact geometry match
  - Appended route has more than one centerline that is an exact geometry match
  - Appended route has centerline(s) that match, but also requires at least 1 new centerline be added (should not load route and get message)
  - Appended route would cause a centerline to split (should not load route and get message)
  - Appended route has a partial geometry match with centerline (should not load route and get message)
The time to run this tool after making this change should be <= the total time to run Append Routes & Remove Overlapping Centerlines before making this change on a similar set of centerlines and routes

## Slide 6 — Automation

Create a new python tests for these scenarios where the centerlines exist when the tool is run
Update any existing tests for the tool that fail due to the new parameter/removal of UN check

## Slide 7 — Documentation

Add a usage note to the Append Routes GP tool mentioning this support

  - Outline the various centerline scenarios and the requirements for one or more centerlines to match exactly with the route for the tool to execute correctly
  - Remove/update any existing note concerning this support when the UN is present
Update the APR-UN loading workflow section to mention the need to check the box to consider existing centerlines when running the Append Routes tool

## Slide 8 — Assignment

Story Points:
Dev:
PE:
