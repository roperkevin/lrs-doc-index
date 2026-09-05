# LRS in GCS: In-memory only Densification

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#5415](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5415) |
| **Source** | [5415-LRSinGCSInMemoryOnlyDensify_V2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/5415-LRSinGCSInMemoryOnlyDensify_V2.pptx>) |
| **Edited** | 2023-10-18 18:59 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "LRS in GCS: In-memory only Densification"
source_file: "5415-LRSinGCSInMemoryOnlyDensify_V2.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/5415-LRSinGCSInMemoryOnlyDensify_V2.pptx"
doc_id: 485
doc_kind: "User Story"
surface: "Pro"
doc_revision: "V2"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2023-10-18T18:59:49Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["densification", "gcs", "centerline", "route geometry", "calibration points", "rest endpoints", "in memory"]
tools: ["Create Route", "Retire", "Realign", "Extend", "Reassign", "Split Centerline by Measure", "Add Calibration Points", "Edit Calibration Points", "Delete Calibration Points", "Identify", "Update Measures From LRS", "Locate Route and Measure", "Cartorealignment", "geometryToMeasure", "measureToGeometry", "translate", "concurrenecies", "applyEdits", "queryAttributeSet", "deriveEventMeasures"]
products: ["Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#5415"]
related: [{"doc":602,"file":"flip-centerline-tool-in-memory-flip-user-story__doc602.md","s":4.048},{"doc":609,"file":"flip-centerline-tool-in-memory-flip-user-story__doc609.md","s":3.828},{"doc":115,"file":"regression-testing-task-list-v1__doc115.md","s":3.591},{"doc":601,"file":"flip-centerline-tool-in-memory-flip-user-story__doc601.md","s":3.483},{"doc":684,"file":"update-centerline-measures-when-splitting-un-pipelines__doc684.md","s":3.374}]
```
-->

## Summary

User story describing the need for LRS data in a geographic coordinate system (GCS) to support all LRS operations with sparse vertices by performing densification in-memory only, ensuring that centerline and route geometry match and revert to original state after edits. Includes acceptance criteria, testing scenarios for various LRS tools and REST endpoints, and automation plans for route editing.

## Related documents

<!-- related:begin -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/flip-centerline-tool-in-memory-flip-user-story__doc602.md>) — similar text 0.15 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:602 -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/flip-centerline-tool-in-memory-flip-user-story__doc609.md>) — similar text 0.14 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:609 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/regression-testing-task-list-v1__doc115.md>) — similar text 0.12 · same surface <!-- rel:115 -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/flip-centerline-tool-in-memory-flip-user-story__doc601.md>) — similar text 0.16 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:601 -->
- [Update centerline measures when splitting UN pipelines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-centerline-measures-when-splitting-un-pipelines__doc684.md>) — similar text 0.18 · same kind/surface/folder <!-- rel:684 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html) · [Add calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/add-calibration-points.html) · [Delete calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/delete-calibration-points.html) · [Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html)

_No page matched:_ [Edit Calibration Points](https://www.google.com/search?q=%22Edit%20Calibration%20Points%22+site%3Adoc.esri.com) · [Identify](https://www.google.com/search?q=%22Identify%22+site%3Adoc.esri.com) · [Update Measures From LRS](https://www.google.com/search?q=%22Update%20Measures%20From%20LRS%22+site%3Adoc.esri.com) · [Locate Route and Measure](https://www.google.com/search?q=%22Locate%20Route%20and%20Measure%22+site%3Adoc.esri.com) · [Cartorealignment](https://www.google.com/search?q=%22Cartorealignment%22+site%3Adoc.esri.com) · [geometryToMeasure](https://www.google.com/search?q=%22geometryToMeasure%22+site%3Adoc.esri.com) · [translate](https://www.google.com/search?q=%22translate%22+site%3Adoc.esri.com) · [concurrenecies](https://www.google.com/search?q=%22concurrenecies%22+site%3Adoc.esri.com) · [applyEdits](https://www.google.com/search?q=%22applyEdits%22+site%3Adoc.esri.com) · [queryAttributeSet](https://www.google.com/search?q=%22queryAttributeSet%22+site%3Adoc.esri.com) · [deriveEventMeasures](https://www.google.com/search?q=%22deriveEventMeasures%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — LRS in GCS: In-memory only Densification

User Story

## Slide 2 — User Story

As an LRS Editor, I need the ability for my LRS data in a GCS to work with all LRS operations when the data has sparse vertices that exceed the standard threshold for LRS tools to successfully execute, so that the LRS operations succeed, but the density and location of vertices do not change.
Persona
Persona:
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawings, FGDBs, etc.).  The LRS Editor is constantly making changes to routes and events with new information, and the current densification of routes with sparse vertices is causing a mismatch between my centerlines and routes.

## Slide 3 — Acceptance Criteria

Based on the GCS fix from last release

  - Verify measures are the same as the 3.2 densification fix
Densification for LRS calculations will be in-memory only

  - After the edit/calculation is performed, the geometry will revert to pre-analysis/edit state
Centerline and Route geometry must match

  - Input and output should always match
  - Only time we should be changing centerline/route geometry is when a vertex is added for CPs added on a route

## Slide 4 — Before Edit:

![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc460_slide4_fig1.svg)
![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc460_slide4_fig2.svg)

During Edit (In-memory Densification):
After Edit (Return to original state of only 2 vertices):

![image1.png](../media/doc460_image1.png) ![image2.png](../media/doc460_image2.png)

## Slide 5 — Testing

Test with APR GCS dataset
Test scenarios tested in original GCS issue and ensure that all tools work as intended:

  - Create Route (simple, vertical, 3D)
  - Retire
  - Realign
  - Extend
  - Reassign
  - Split Centerline by Measure
  - Add, Edit, Delete Calibration Points
  - Identify
  - Update Measures from LRS
  - Locate Route and Measure
  - Cartorealignment
  - REST:
    - geometryToMeasure
    - measureToGeometry
    - translate
    - concurrenecies
    - applyEdits
    - queryAttributeSet
    - deriveEventMeasures
After running tools, make sure that centerline and route geometry match

## Slide 6 — Automation

Add automation for GCS dataset

  - REST automate all route editing and key REST endpoints that were not working in the past before GCS fix

## Slide 7 — Documentation

No updates needed

## Slide 8 — Assignment

Story Points:
Dev:
PE:
