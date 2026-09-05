# Flip Centerline Tool In-Memory Flip User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Issue** | [ArcGISPro/ps-location-referencing#4613](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4613) |
| **Source** | [Flip centerline tool does an in memory flip UI.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Flip%20centerline%20tool%20does%20an%20in%20memory%20flip%20UI.pptx>) |
| **Edited** | 2023-03-02 16:57 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Flip Centerline Tool In-Memory Flip User Story"
source_file: "Flip centerline tool does an in memory flip UI.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Flip%20centerline%20tool%20does%20an%20in%20memory%20flip%20UI.pptx"
doc_id: 601
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2023-03-02T16:57:32Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["centerline", "flip", "in memory flip", "utility network", "reverse stationing", "route editing"]
tools: ["Create Route", "Extend Route", "Realign Route"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: ["ArcGISPro/ps-location-referencing#4613"]
related: [{"doc":609,"file":"flip-centerline-tool-in-memory-flip-user-story__doc609.md","s":1010.301},{"doc":602,"file":"flip-centerline-tool-in-memory-flip-user-story__doc602.md","s":1010.191},{"doc":577,"file":"flip-centerline-tool-in-memory-flip-ui-test-plan__doc577.md","s":6.974},{"doc":605,"file":"eyedropper-tool-for-attribute-copying-in-route-editing-tools__doc605.md","s":3.557},{"doc":684,"file":"update-centerline-measures-when-splitting-un-pipelines__doc684.md","s":3.525}]
```
-->

## Summary

Describes the user story for the flip centerline capability that flips centerlines only in memory within the Create, Extend, and Realign Route tools to maintain Utility Network integrity and support reverse stationing. It outlines the behavior differences from previous implementations, testing scenarios, and documentation updates required.

## Related documents

<!-- related:begin -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/flip-centerline-tool-in-memory-flip-user-story__doc609.md>) — shared issue ArcGISPro/ps-location-referencing#4613 · similar text 0.93 · 4 title words · 5 filename words · same kind/surface/folder <!-- rel:609 -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/flip-centerline-tool-in-memory-flip-user-story__doc602.md>) — shared issue ArcGISPro/ps-location-referencing#4613 · similar text 0.69 · 4 title words · 5 filename words · same kind/surface/folder <!-- rel:602 -->
- [Flip Centerline Tool: In Memory Flip (UI) Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/flip-centerline-tool-in-memory-flip-ui-test-plan__doc577.md>) — similar text 0.46 · 4 title words · 3 filename words · same surface <!-- rel:577 -->
- [Eyedropper Tool for Attribute Copying in Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/eyedropper-tool-for-attribute-copying-in-route-editing-tools__doc605.md>) — similar text 0.23 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:605 -->
- [Update centerline measures when splitting UN pipelines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-centerline-measures-when-splitting-un-pipelines__doc684.md>) — similar text 0.32 · 1 title word · same kind/surface/folder <!-- rel:684 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-new-route.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/extend-a-route.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/realign-routes.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)
<!-- docs:end -->

---

## Slide 1 — Flip centerline tool does an in-memory flip (UI)

User Story

## Slide 2 — User Story

As an LRS editor, I need the flip centerline capability to only flip the centerline in memory, so that the integrity of the Utility Network is maintained in this scenario and reverse stationing is supported.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  When these editors are using the flip centerline capability in Create, Extend, and Realign Route tools, they need the centerline to only flip in memory (as opposed to the geometry permanently being flipped).  This is needed when the Utility Network is configured as it will prevent dirty areas from being created or subnetwork connectivity from being broken.  Additionally, to better support reverse stationing, the centerlines flip should only be in memory.

## Slide 3 — In memory centerline flip (UI)

In the Create, Extend, and Realign Route tools, when the flip geometry capability for centerline(s) is used, the centerline(s) should only flip in memory (the permanent geometry of the selected centerline(s)should stay the same)
This is different than how the tool worked in ArcMap, but is necessary to support the UN correctly
This change should also result in no dirty areas being created in a combined APR-UN environment
If a user has measures populated on the centerline to be read as the measures for the route editing tool, we should continue to use the original geometry direction to determine the from/to measures in the tool.  Flipping the centerline shouldn’t change the checks we make against the original centerline geometry for measure continuity between the centerlines that will be part of the edit.
If the user doesn’t have measures, the direction of the centerline won’t matter for the route editing operation as Update Measures from LRS would populate those measures after the route edit is complete

## Slide 4 — Testing

Test with APR and RH data (lean heavier to APR data)
Test in an APR-UN environment (verify no dirty areas are created and connectivity is maintained in the UN tracing tools)
Also test in reverse stationed scenarios (see https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4613 for more info)
Test with both single and multiple centerlines being flipped

## Slide 5 — Automation

No automation

## Slide 6 — Documentation

Update the “Tools available in the centerlines table” section for Flip Centerline Direction to mention these flips are not permanent in the following topics:
https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/create-a-new-route.htm
https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/extend-a-route.htm
https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/realign-routes.htm
And the Roads and Highways versions as well

## Slide 7 — Assignment

Story Points:
Dev:
PE:
