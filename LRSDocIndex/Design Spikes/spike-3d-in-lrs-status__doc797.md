# Spike: 3D in LRS status

|   |   |
| --- | --- |
| **Kind** | Design Spike · Pro |
| **Release** | — |
| **Source** | [Spike 3D in LRS status.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%203D%20in%20LRS%20status.pptx>) |
| **Edited** | 2020-05-11 00:51 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: 3D in LRS status"
source_file: "Spike 3D in LRS status.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%203D%20in%20LRS%20status.pptx"
doc_id: 797
doc_kind: "Design Spike"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2020-05-11T00:51:17Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["3d", "calibration points", "measure interpolation", "split centerlines", "realign", "reassign", "retire", "create", "extend"]
tools: ["Generate Calibration Points", "Update Measures from LRS"]
products: []
issues: []
related: [{"doc":515,"file":"spike-64-bit-oid-in-lrs-editing-tools__doc515.md","s":3.392},{"doc":502,"file":"64-bit-oid-in-lrs-route-editing-tools__doc502.md","s":2.542},{"doc":485,"file":"lrs-in-gcs-in-memory-only-densification__doc485.md","s":2.511},{"doc":628,"file":"investigate-negative-measures-for-lr-tools-in-pro-rest-ee__doc628.md","s":2.381},{"doc":684,"file":"update-centerline-measures-when-splitting-un-pipelines__doc684.md","s":2.36}]
```
-->

## Summary

Investigation of the current status of 3D support within LRS tools including edit tools, calibration routines, and geoprocessing tools such as Generate Calibration Points and Update Measures from LRS. The focus is on whether suggested measures and calculations are handled in 3D across various LRS functionalities.

## Related documents

<!-- related:begin -->
- [Spike: 64-bit OID in LRS Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-64-bit-oid-in-lrs-editing-tools__doc515.md>) — similar text 0.15 · same kind/surface/folder <!-- rel:515 -->
- [64-bit OID in LRS Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-route-editing-tools__doc502.md>) — similar text 0.09 · same surface/folder <!-- rel:502 -->
- [LRS in GCS: In-memory only Densification](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-in-gcs-in-memory-only-densification__doc485.md>) — similar text 0.10 · same surface/folder <!-- rel:485 -->
- [Investigate Negative Measures for LR Tools in Pro/REST/EE](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/investigate-negative-measures-for-lr-tools-in-pro-rest-ee__doc628.md>) — similar text 0.19 · same surface/folder <!-- rel:628 -->
- [Update centerline measures when splitting UN pipelines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-centerline-measures-when-splitting-un-pipelines__doc684.md>) — similar text 0.13 · same surface/folder <!-- rel:684 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html) · [Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html)

_No page matched:_ [Generate Calibration Points](https://www.google.com/search?q=%22Generate%20Calibration%20Points%22+site%3Adoc.esri.com) · [Update Measures from LRS](https://www.google.com/search?q=%22Update%20Measures%20from%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: 3D in LRS status

Spike

## Slide 2 — Current status of 3D in LRS

Investigate the current status of 3D within the LRS tools

  - In the LRS edit tools (are the suggested measures in 3D)
    - Create
    - Extend
    - Retire
    - Realign
    - Reassign
    - Add CPs
    - Split Centerlines by Measure
  - In the calibration routine/measure interpolation
  - In Generate Calibration Points GP tool
  - In Update Measures from LRS GP tool
  - Anywhere else in the code where calculations are being done
Gaurav may have some of this information from previous investigations

## Slide 3 — Assignment

Story Points:
Dev:
