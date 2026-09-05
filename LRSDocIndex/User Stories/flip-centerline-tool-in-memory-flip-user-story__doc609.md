# Flip Centerline Tool In-Memory Flip User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Issue** | [ArcGISPro/ps-location-referencing#4613](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4613) |
| **Source** | [Flip centerline tool does an in memory flip.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Flip%20centerline%20tool%20does%20an%20in%20memory%20flip.pptx>) |
| **Edited** | 2023-02-22 00:46 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Flip Centerline Tool In-Memory Flip User Story"
source_file: "Flip centerline tool does an in memory flip.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Flip%20centerline%20tool%20does%20an%20in%20memory%20flip.pptx"
doc_id: 609
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2023-02-22T00:46:09Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["centerline", "flip", "in memory", "utility network", "reverse stationing", "route editing"]
tools: ["Create Route", "Extend Route", "Realign Route"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: ["ArcGISPro/ps-location-referencing#4613"]
related: [{"doc":601,"file":"flip-centerline-tool-in-memory-flip-user-story__doc601.md","s":1010.301},{"doc":602,"file":"flip-centerline-tool-in-memory-flip-user-story__doc602.md","s":1010.046},{"doc":577,"file":"flip-centerline-tool-in-memory-flip-ui-test-plan__doc577.md","s":6.364},{"doc":485,"file":"lrs-in-gcs-in-memory-only-densification__doc485.md","s":3.828},{"doc":605,"file":"eyedropper-tool-for-attribute-copying-in-route-editing-tools__doc605.md","s":3.565}]
```
-->

## Summary

Describes the user story for the flip centerline capability that flips centerlines only in memory within Create, Extend, and Realign Route tools to maintain Utility Network integrity and support reverse stationing. It includes testing scenarios with APR and APR-UN data and documentation update requirements.

## Related documents

<!-- related:begin -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/flip-centerline-tool-in-memory-flip-user-story__doc601.md>) — shared issue ArcGISPro/ps-location-referencing#4613 · similar text 0.93 · 4 title words · 5 filename words · same kind/surface/folder <!-- rel:601 -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/flip-centerline-tool-in-memory-flip-user-story__doc602.md>) — shared issue ArcGISPro/ps-location-referencing#4613 · similar text 0.72 · 4 title words · 5 filename words · same kind/surface/folder <!-- rel:602 -->
- [Flip Centerline Tool: In Memory Flip (UI) Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/flip-centerline-tool-in-memory-flip-ui-test-plan__doc577.md>) — similar text 0.46 · 4 title words · 3 filename words · same surface <!-- rel:577 -->
- [LRS in GCS: In-memory only Densification](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-in-gcs-in-memory-only-densification__doc485.md>) — similar text 0.14 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:485 -->
- [Eyedropper Tool for Attribute Copying in Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/eyedropper-tool-for-attribute-copying-in-route-editing-tools__doc605.md>) — similar text 0.23 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:605 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-new-route.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/extend-a-route.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/realign-routes.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)
<!-- docs:end -->

---

## Slide 1 — Flip centerline tool does an in-memory flip

User Story

## Slide 2 — User Story

As an LRS editor, I need the flip centerline capability to only flip the centerline in memory, so that the integrity of the Utility Network is maintained in this scenario and reverse stationing is supported.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  When these editors are using the flip centerline capability in Create, Extend, and Realign Route tools, they need the centerline to only flip in memory (as opposed to the geometry permanently being flipped).  This is needed when the Utility Network is configured as it will prevent dirty areas from being created or subnetwork connectivity from being broken.  Additionally, to better support reverse stationing, the centerlines flip should only be in memory.

## Slide 3 — In memory centerline flip

In the Create, Extend, and Realign Route tools, when the flip geometry capability for centerline(s) is used, the centerline(s) should only flip in memory (the permanent geometry of the selected centerline(s)should stay the same)
This keeps the tool in alignment with how it worked in ArcMap
This change should also result in no dirty areas being created in a combined APR-UN environment

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
