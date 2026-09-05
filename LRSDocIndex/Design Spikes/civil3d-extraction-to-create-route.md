# Spike: Civil3D Extraction to Create Route

| Field | Value |
| --- | --- |
| **Doc** | 517 · Design Spike · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike Civil3DExtractiontoCreateRoute.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Civil3DExtractiontoCreateRoute.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2023-08-28 19:24 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | civil3d extraction · centerline · create route · geometry · measures · prototype |
| **Tools** | Create Route |

## Summary

Investigates reading geometry and labeling information from Civil3D files for use in ArcGIS Pro. Prototypes reading centerline and measures from Civil3D files to integrate with the Create Route tool, enabling selectable centerlines and suggested measures.

## Related documents

<!-- related:begin -->
- [Create Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/create-route-ai-assistant.md>) — similar text 0.04 · 2 title words · 2 filename words · same surface <!-- rel:98 s=2.844 -->
- [Spike: Centerline and Measure Extraction from PDF](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/centerline-and-measure-extraction-from-pdf.md>) — similar text 0.24 · 1 title word · same kind/surface/folder <!-- rel:142 s=2.771 -->
- [Prototype: JSON requests and returns in REST for Relocate Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/prototype-json-requests-and-returns-in-rest-for-relocate.md>) — similar text 0.15 · same kind/folder <!-- rel:298 s=1.854 -->
- [Prototype for Discovering Missing Centerlines from Aerial Imagery](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/prototype-for-discovering-missing-centerlines-from-aerial.md>) — similar text 0.10 · same kind/folder <!-- rel:24 s=1.844 -->
- [Spike: Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/exb.md>) — similar text 0.10 · same kind/folder <!-- rel:824 s=1.828 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)
<!-- docs:end -->

---

## Slide 1 — Spike/Prototype: Civil3D extraction to Create Route

Spike

## Slide 2 — Civil3D extraction to Create Route

- Investigate how to read geometry and labeling information from a Civil3D for use in ArcGIS Pro (may need to speak with the CAD team to understand patterns with how to extract from AutoDesk products)
- Using a Civil3D file, prototype the following to the Create Route tool
  - Read the centerline from the C3D file and add it to the centerline feature class
  - Make that centerline selectable as a centerline in Create Route UI
  - Read the measures from the C3D file and use them as the suggested measures in the Create Route tool
- Create a prototype that shows the steps above in the Create Route tool in ArcGIS Pro

## Slide 3 — Assignment

Story Points:
Dev:
