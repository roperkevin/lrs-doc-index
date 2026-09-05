# Dynamic Segmentation SLD - Expression Display Support

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Source** | [ExB - Custom Expressions in SLD.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Custom%20Expressions%20in%20SLD.pptx>) |
| **Edited** | 2026-06-01 19:19 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Dynamic Segmentation SLD - Expression Display Support"
source_file: "ExB - Custom Expressions in SLD.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Custom%20Expressions%20in%20SLD.pptx"
doc_id: 25
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2026-06-01T19:19:19Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["dynamic segmentation", "expression display", "arcade expressions", "concatenated fields", "sld rectangle labels", "experience builder"]
tools: ["Dynamic Segmentation"]
products: []
issues: []
related: [{"doc":21,"file":"dynamic-segmentation-expression-display-support__doc21.md","s":6.789},{"doc":12,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc12.md","s":5.093},{"doc":27,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc27.md","s":5.014},{"doc":13,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md","s":5.002},{"doc":23,"file":"enhancement-display-expanded-lrs-and-business-attributes-in-sld-hover-tooltip__doc23.md","s":4.564}]
```
-->

## Summary

This document describes the need for supporting concatenated fields and Arcade expressions in Straight Line Diagram (SLD) rectangle labels within Experience Builder. It outlines acceptance criteria, testing, automation, and documentation requirements to ensure expression-based labels align with enterprise display standards and inherit expressions from web maps or services.

## Related documents

<!-- related:begin -->
- [Dynamic Segmentation: Expression Display Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/dynamic-segmentation-expression-display-support__doc21.md>) — similar text 0.22 · 5 title words · 1 filename word · same surface <!-- rel:21 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc12.md>) — similar text 0.23 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:12 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc27.md>) — similar text 0.23 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:27 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md>) — similar text 0.24 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:13 -->
- [Enhancement: Display Expanded LRS and Business Attributes in SLD Hover Tooltip](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/enhancement-display-expanded-lrs-and-business-attributes-in-sld-hover-tooltip__doc23.md>) — similar text 0.19 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:23 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)
<!-- docs:end -->

---

## Slide 1 — Dynamic Segmentation SLD - Expression Display Support

## Slide 2 — I Need / Personas / Workflow

As an Event Editor, I need SLD rectangle labels to support concatenated fields and Arcade expressions defined in the web map/service, so that labels align with enterprise display standards.
Persona: Event Editor - maintains and analyzes LRS event data using SLD visualization to understand relationships across layers.
Persona: GIS Analyst - configures services/web maps including concatenation and Arcade expressions for standardized display.
Workflow: Configure expressions in service/web map -> load into Experience Builder -> select display field in widget config -> view SLD rectangles with expression-based labels

## Slide 3 — Acceptance Criteria & Requirements (1)

Support concatenated fields and Arcade expressions as display fields
Expressions must be inherited from service/web map
Expressions appear as selectable options in widget configuration
No creation or editing of expressions in widget

## Slide 4 — Acceptance Criteria & Requirements (2)

Applies only to SLD rectangle labels
Rendering must match service/web map output
Respect aliases, domains, and null handling
Evaluate expressions per event layer as configured

## Slide 5 — Acceptance Criteria & Requirements (3)

If expression unsupported, notify user
Fallback to default label field
Notification must not block workflow
No regression to existing field display behavior

## Slide 6 — Testing

Validate concatenated field rendering in SLD
Validate Arcade expression rendering in SLD
Verify expressions appear in configuration dropdown
Test unsupported expressions and fallback behavior
Test multiple layers and large datasets

## Slide 7 — Automation

Add automated tests for expression rendering
Validate configuration dropdown population
Regression coverage for existing labeling behavior
Compare expected vs rendered label output

## Slide 8 — Documentation

Update Dynamic Segmentation widget documentation
Document support for concatenated fields and Arcade expressions
Clarify expressions are inherited only
Document fallback and notification behavior

## Slide 9 — Estimation / Assignment

Story Points:
Dev Effort:  days
PE Effort:  days
