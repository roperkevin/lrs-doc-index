# Spike: Oriented Imagery widget integration with Dynamic Segmentation/SLD

|   |   |
| --- | --- |
| **Kind** | Design Spike · Experience Builder |
| **Release** | — |
| **Source** | [Spike OI widget with SLD.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20OI%20widget%20with%20SLD.pptx>) |
| **Edited** | 2025-08-06 17:13 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Oriented Imagery widget integration with Dynamic Segmentation/SLD"
source_file: "Spike OI widget with SLD.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20OI%20widget%20with%20SLD.pptx"
doc_id: 145
doc_kind: "Design Spike"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2025-08-06T17:13:52Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["oriented imagery", "dynamic segmentation", "straight line diagram", "widget integration", "photo orientation", "configuration options"]
tools: ["Dynamic Segmentation", "Straight Line Diagram", "Oriented Imagery"]
products: []
issues: []
related: [{"doc":76,"file":"dynamic-segmentation-widget-integration-with-oriented-imagery__doc76.md","s":6.766},{"doc":146,"file":"spike-elevation-profile-widget-interaction-with-dynamic-segmentation-sld__doc146.md","s":6.646},{"doc":63,"file":"sld-oi-widget-test-plan__doc63.md","s":4.594},{"doc":57,"file":"dynamic-segmentation-widget__doc57.md","s":4.313},{"doc":191,"file":"experience-builder-sld-interaction-with-map__doc191.md","s":3.016}]
```
-->

## Summary

This spike investigates options to formalize and strengthen the integration of the Oriented Imagery widget with the Straight Line Diagram (SLD) in Experience Builder. It explores interaction methods between the OI widget and SLD, ensuring correct photo orientation, and adding configuration options to the Dynamic Segmentation widget for tighter integration.

## Related documents

<!-- related:begin -->
- [Dynamic Segmentation widget integration with Oriented Imagery](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynamic-segmentation-widget-integration-with-oriented-imagery__doc76.md>) — similar text 0.26 · 6 title words · 2 filename words · same surface/folder <!-- rel:76 -->
- [Spike: Elevation Profile widget interaction with Dynamic Segmentation/SLD](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-elevation-profile-widget-interaction-with-dynamic-segmentation-sld__doc146.md>) — similar text 0.45 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:146 -->
- [SLD OI Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/sld-oi-widget-test-plan__doc63.md>) — similar text 0.17 · 2 title words · 1 filename word · same surface <!-- rel:63 -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/dynamic-segmentation-widget__doc57.md>) — similar text 0.20 · 3 title words · 1 filename word · same surface <!-- rel:57 -->
- [Experience Builder SLD Interaction with Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-sld-interaction-with-map__doc191.md>) — similar text 0.18 · 1 title word · 1 filename word · same surface/folder <!-- rel:191 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [Straight Line Diagram](https://www.google.com/search?q=%22Straight%20Line%20Diagram%22+site%3Adoc.esri.com) · [Oriented Imagery](https://www.google.com/search?q=%22Oriented%20Imagery%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Oriented Imagery widget integration with Dynamic Segmentation/SLD

Spike

## Slide 2 — Orientated Imagery Widget

The transportation industry has made a push for integrating the new Orientated Imagery widget into the SLD.  They have a demo that is a bit clunky but function.  This spike will investigate options to formalize and strengthen the integration of the OI widget with the SLD.
Explore options for how we can integrate this widget with the SLD
Can we interact with the OI widget in a similar way to interacting with the map in the SLD where a user can click an image on the map and have the OI widget show the image, the SLD show that location, and have the map center (along with the scenario where the SLD is clicked at a location)?
How/can we ensure the OI photo orientation is correct (i.e., pointing forward/downstream)?
Can we add configuration options to the DynSeg widget to tighten this integration and always have the widgets talk to each other without needing data actions?
Deliverable for this spike is answers to these questions and any demo/prototype of the functionality in action.

## Slide 3 — Assignment

Story Points:
Dev:
