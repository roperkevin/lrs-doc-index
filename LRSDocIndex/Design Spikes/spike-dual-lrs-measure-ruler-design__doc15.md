# Spike: Dual LRS Measure Ruler Design

|   |   |
| --- | --- |
| **Kind** | Design Spike · Experience Builder |
| **Release** | — |
| **Source** | [SpikeDualLRSMeasureDesign.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SpikeDualLRSMeasureDesign.pptx>) |
| **Edited** | 2026-06-30 18:30 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Dual LRS Measure Ruler Design"
source_file: "SpikeDualLRSMeasureDesign.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SpikeDualLRSMeasureDesign.pptx"
doc_id: 15
doc_kind: "Design Spike"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2026-06-30T18:30:30Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["dual measure", "measure ruler", "event editor", "engineering network", "continuous network"]
tools: ["Dynamic Segmentation", "Straight Line Diagram"]
products: []
issues: []
related: [{"doc":12,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc12.md","s":5.593},{"doc":27,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc27.md","s":5.369},{"doc":187,"file":"experience-builder-flatten-sld-results-and-make-ruler-10-tick-marks__doc187.md","s":2.877},{"doc":171,"file":"flatten-sld-results-in-rows-and-use-10-tick-marks-in-ruler-test-plan__doc171.md","s":2.756},{"doc":28,"file":"sld-devices-and-junctions-test-plan__doc28.md","s":2.682}]
```
-->

## Summary

Evaluation of design options for displaying dual LRS network measures in the Straight Line Diagram to aid event editors in interpreting and comparing event locations across Engineering and Continuous networks. Includes creation of static UI prototypes and mockups with various layout options for dual measures. Provides documentation with pros and cons and recommendations for implementation.

## Related documents

<!-- related:begin -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc12.md>) — similar text 0.38 · 2 title words · 1 filename word · same surface/folder <!-- rel:12 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc27.md>) — similar text 0.36 · 2 title words · 1 filename word · same surface/folder <!-- rel:27 -->
- [Experience Builder Flatten SLD Results and Make Ruler 10 tick marks](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-flatten-sld-results-and-make-ruler-10-tick-marks__doc187.md>) — similar text 0.13 · 1 title word · same surface/folder <!-- rel:187 -->
- [Flatten SLD results in rows and use 10 tick marks in ruler– test plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/flatten-sld-results-in-rows-and-use-10-tick-marks-in-ruler-test-plan__doc171.md>) — similar text 0.09 · 1 title word · same surface/folder <!-- rel:171 -->
- [SLD Devices and Junctions Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/sld-devices-and-junctions-test-plan__doc28.md>) — similar text 0.08 · same surface <!-- rel:28 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)

_No page matched:_ [Straight Line Diagram](https://www.google.com/search?q=%22Straight%20Line%20Diagram%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Dual LRS Measure Ruler Design

## Slide 2 — Dual LRS Measure Ruler Design

I Need
As an event editor, I need to evaluate ruler design options for displaying dual LRS network measures so that I can clearly interpret and compare event locations across networks without confusion.

Personas
Event Editor: Event editors are responsible for maintaining and validating LRS event data and rely on the Straight Line Diagram to understand event placement along a route. They frequently work across multiple networks (Engineering and Continuous) and need a clear, consistent way to interpret and compare measures to avoid misalignment or incorrect edits.

Workflow

- Launch Dynamic Segmentation widget
- Select Engineering network route
- Open Straight Line Diagram (SLD)
- View ruler displaying measures
- Evaluate different layout options for dual measures
- Compare clarity, readability, and usability across designs

## Slide 3 — Acceptance Criteria & Requirements

Create static Experience Builder UI prototypes for dual-measure ruler
Include:Engineering (primary) measuresContinuous (reference) measures
Prototype the following design options:

  - Both measures displayed above the ruler
  - Both measures displayed below the ruler
  - One measure above and one below the ruler
  - Color-coded inline measures
  - Dual-track ruler (parallel ruler lines)
Produce mockups for each design option

## Slide 4 — Documentation & Deliverables

Document each design option with mockups
Provide a pros/cons list of each option (both from development and user experience) and recommended design
Deliver output for follow-on implementation user story

## Slide 5 — Estimation

Estimation -
