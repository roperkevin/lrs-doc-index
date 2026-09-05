# Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Source** | [ExB - SLD Dual Network support 1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20SLD%20Dual%20Network%20support%201.pptx>) |
| **Edited** | 2026-06-30 18:09 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support"
source_file: "ExB - SLD Dual Network support 1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20SLD%20Dual%20Network%20support%201.pptx"
doc_id: 12
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2026-06-30T18:09:05Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["dual network", "dynamic segmentation", "straight line diagram", "event editing", "engineering measures", "continuous measures"]
tools: ["Dynamic Segmentation"]
products: []
issues: []
related: [{"doc":27,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc27.md","s":12.787},{"doc":13,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md","s":6.268},{"doc":15,"file":"spike-dual-lrs-measure-ruler-design__doc15.md","s":5.593},{"doc":25,"file":"dynamic-segmentation-sld-expression-display-support__doc25.md","s":5.093},{"doc":348,"file":"experience-builder-straight-line-diagram-event-attributes-on-hover-click__doc348.md","s":4.559}]
```
-->

## Summary

This document describes a user story for event editors to view both engineering and continuous measures on the ruler within the Dynamic Segmentation widget in Experience Builder. It includes acceptance criteria for ruler and network behavior, route and attribute display, testing plans, automation updates, and documentation requirements. The focus is on supporting dual network measure display and ensuring usability and error handling.

## Related documents

<!-- related:begin -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc27.md>) — similar text 0.97 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:27 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md>) — similar text 0.20 · 6 title words · 1 filename word · same kind/surface/folder <!-- rel:13 -->
- [Spike: Dual LRS Measure Ruler Design](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-dual-lrs-measure-ruler-design__doc15.md>) — similar text 0.38 · 2 title words · 1 filename word · same surface/folder <!-- rel:15 -->
- [Dynamic Segmentation SLD - Expression Display Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynamic-segmentation-sld-expression-display-support__doc25.md>) — similar text 0.23 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:25 -->
- [Experience Builder Straight Line Diagram Event Attributes on Hover/Click](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-straight-line-diagram-event-attributes-on-hover-click__doc348.md>) — similar text 0.10 · 5 title words · same kind/surface/folder <!-- rel:348 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)
<!-- docs:end -->

---

## Slide 1 — Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support

## Slide 2 — User Story, Personas, Workflow

As an event editor, I need to view both engineering and continuous measures on the ruler so that I can compare LRMs without switching contexts.
Persona: Event editors maintaining and validating events across LRMs.
Workflow: Launch dyn seg → select Engineering route → view dual ruler → inspect events → open attributes.

## Slide 3 — Acceptance Criteria (Ruler + Network Behavior)

Use the design from the prototype spike (will be completed before work begins on this story)
Continuous is reference-only and read-only
Dual display only when Engineering is primary
If Continuous network is selected → only Continuous is shown

## Slide 4 — Acceptance Criteria (Route + Attributes)

Display Continuous RouteID in SLD header when available
If missing: show message with tooltip and help link
Tooltip explains issue and suggests route calibration/regeneration
Double-click shows Engineering + Continuous measures (if available)
Both sets appear in read-only section

## Slide 5 — Testing

Validate dual ruler rendering and alignment
Verify Continuous RouteID display
Test fallback UX including tooltip and help link
Ensure no errors when mapping missing
Validate attribute panel behavior

## Slide 6 — Automation

Update existing UI automation for Dynamic Segmentation widget
Ensure coverage for dual ruler states (with/without continuous mapping)
Validate tooltip behavior and help link
Maintain consistency with existing widget automation patterns
Defer broader new automation beyond UI updates until SLD stabilizes

## Slide 7 — Documentation

Update dyn seg widget help for dual ruler
Document fallback behavior and tooltip guidance
Clarify Engineering vs Continuous roles
Add examples and troubleshooting guidance

## Slide 8 — Estimation

Estimation:
Dev Effort:
PE Effort:
