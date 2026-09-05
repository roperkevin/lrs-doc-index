# Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Source** | [ExB - SLD Dual Network support.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20SLD%20Dual%20Network%20support.pptx>) |
| **Edited** | 2026-06-01 18:16 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support"
source_file: "ExB - SLD Dual Network support.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20SLD%20Dual%20Network%20support.pptx"
doc_id: 27
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2026-06-01T18:16:01Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["dual network", "dynamic segmentation", "straight line diagram", "engineering measures", "continuous measures", "event editing"]
tools: ["Dynamic Segmentation"]
products: []
issues: []
related: [{"doc":12,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc12.md","s":12.787},{"doc":13,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md","s":6.094},{"doc":15,"file":"spike-dual-lrs-measure-ruler-design__doc15.md","s":5.369},{"doc":292,"file":"support-overlapping-events-in-experience-builder-straight-line-diagram__doc292.md","s":5.155},{"doc":25,"file":"dynamic-segmentation-sld-expression-display-support__doc25.md","s":5.014}]
```
-->

## Summary

Describes a user story for event editors to view both engineering and continuous measures on a dual ruler in the Dynamic Segmentation widget. Covers acceptance criteria for ruler display, route attributes, testing, automation updates, and documentation for dual network measure support.

## Related documents

<!-- related:begin -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc12.md>) — similar text 0.97 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:12 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md>) — similar text 0.19 · 6 title words · 1 filename word · same kind/surface/folder <!-- rel:13 -->
- [Spike: Dual LRS Measure Ruler Design](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-dual-lrs-measure-ruler-design__doc15.md>) — similar text 0.36 · 2 title words · 1 filename word · same surface/folder <!-- rel:15 -->
- [Support Overlapping Events in Experience Builder Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-overlapping-events-in-experience-builder-straight-line-diagram__doc292.md>) — similar text 0.09 · 6 title words · 1 filename word · same kind/surface/folder <!-- rel:292 -->
- [Dynamic Segmentation SLD - Expression Display Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynamic-segmentation-sld-expression-display-support__doc25.md>) — similar text 0.23 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:25 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)
<!-- docs:end -->

---

## Slide 1 — Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support

## Slide 2 — User Story, Personas, Workflow

As an event editor, I need to view both engineering and continuous measures on the ruler so that I can compare LRMs without switching contexts.
Persona: Event editors maintaining and validating events across LRMs.
Workflow: Launch dyn seg → select Engineering route → view dual ruler → inspect events → open attributes.

## Slide 3 — Acceptance Criteria (Ruler + Network Behavior)

Single ruler with Engineering (top) and Continuous (bottom)
Continuous is reference-only and read-only
Dual display only when Engineering is primary
If Continuous network is selected → only Continuous is shown
Fallback: hide secondary ruler, show message with tooltip + help link

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
