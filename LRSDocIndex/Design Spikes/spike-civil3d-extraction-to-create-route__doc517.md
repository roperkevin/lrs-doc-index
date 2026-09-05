# Spike: Civil3D Extraction to Create Route

|   |   |
| --- | --- |
| **Kind** | Design Spike · Pro |
| **Release** | — |
| **Source** | [Spike Civil3DExtractiontoCreateRoute.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Civil3DExtractiontoCreateRoute.pptx>) |
| **Edited** | 2023-08-28 19:24 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Civil3D Extraction to Create Route"
source_file: "Spike Civil3DExtractiontoCreateRoute.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Civil3DExtractiontoCreateRoute.pptx"
doc_id: 517
doc_kind: "Design Spike"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2023-08-28T19:24:38Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["civil3d extraction", "centerline", "create route", "geometry", "measures", "prototype"]
tools: ["Create Route"]
products: []
issues: []
related: [{"doc":98,"file":"create-route-ai-assistant-test-plan__doc98.md","s":2.844},{"doc":142,"file":"spike-centerline-and-measure-extraction-from-pdf__doc142.md","s":2.771},{"doc":298,"file":"prototype-json-requests-and-returns-in-rest-for-relocate-events__doc298.md","s":1.854},{"doc":24,"file":"prototype-for-discovering-missing-centerlines-from-aerial-imagery__doc24.md","s":1.844},{"doc":824,"file":"spike-experience-builder__doc824.md","s":1.828}]
```
-->

## Summary

Investigates reading geometry and labeling information from Civil3D files for use in ArcGIS Pro. Prototypes reading centerline and measures from Civil3D files to integrate with the Create Route tool, enabling selectable centerlines and suggested measures.

## Related documents

<!-- related:begin -->
- [Create Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/create-route-ai-assistant-test-plan__doc98.md>) — similar text 0.04 · 2 title words · 2 filename words · same surface <!-- rel:98 -->
- [Spike: Centerline and Measure Extraction from PDF](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-centerline-and-measure-extraction-from-pdf__doc142.md>) — similar text 0.24 · 1 title word · same kind/surface/folder <!-- rel:142 -->
- [Prototype: JSON requests and returns in REST for Relocate Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/prototype-json-requests-and-returns-in-rest-for-relocate-events__doc298.md>) — similar text 0.15 · same kind/folder <!-- rel:298 -->
- [Prototype for Discovering Missing Centerlines from Aerial Imagery](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/prototype-for-discovering-missing-centerlines-from-aerial-imagery__doc24.md>) — similar text 0.10 · same kind/folder <!-- rel:24 -->
- [Spike: Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-experience-builder__doc824.md>) — similar text 0.10 · same kind/folder <!-- rel:824 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)
<!-- docs:end -->

---

## Slide 1 — Spike/Prototype: Civil3D extraction to Create Route

Spike

## Slide 2 — Civil3D extraction to Create Route

Investigate how to read geometry and labeling information from a Civil3D for use in ArcGIS Pro (may need to speak with the CAD team to understand patterns with how to extract from AutoDesk products)
Using a Civil3D file, prototype the following to the Create Route tool

  - Read the centerline from the C3D file and add it to the centerline feature class
  - Make that centerline selectable as a centerline in Create Route UI
  - Read the measures from the C3D file and use them as the suggested measures in the Create Route tool
Create a prototype that shows the steps above in the Create Route tool in ArcGIS Pro

## Slide 3 — Assignment

Story Points:
Dev:
