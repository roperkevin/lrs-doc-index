# LRS Identify Widget – Configurable Coordinate Output

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Source** | [ExB - Include Coordinates in LRS Identify.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Include%20Coordinates%20in%20LRS%20Identify.pptx>) |
| **Edited** | 2026-06-01 22:41 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "LRS Identify Widget – Configurable Coordinate Output"
source_file: "ExB - Include Coordinates in LRS Identify.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Include%20Coordinates%20in%20LRS%20Identify.pptx"
doc_id: 26
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2026-06-01T22:41:36Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["coordinate output", "identify widget", "spatial reference", "precision", "copy to clipboard", "event editor", "gis analyst"]
tools: ["LRS Identify"]
products: []
issues: []
related: [{"doc":859,"file":"lrs-identify-show-coordinates-in-results-experience-builder-widget-test-plan__doc859.md","s":5.082},{"doc":5,"file":"lrs-identify-widget-copy-attribute-values__doc5.md","s":4.081},{"doc":13,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md","s":3.54},{"doc":25,"file":"dynamic-segmentation-sld-expression-display-support__doc25.md","s":3.254},{"doc":905,"file":"lrs-identify-widget__doc905.md","s":3.168}]
```
-->

## Summary

Describes the need for configurable coordinate output in the LRS Identify widget to support accurate location interpretation and reuse. Specifies acceptance criteria including toggle for coordinate inclusion, precision and spatial reference configuration, copy-to-clipboard functionality, and no regression or performance impact. Includes testing, automation, and documentation requirements.

## Related documents

<!-- related:begin -->
- [LRS Identify: Show Coordinates in Results Experience Builder Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/lrs-identify-show-coordinates-in-results-experience-builder-widget-test-plan__doc859.md>) — similar text 0.29 · 2 title words · 2 filename words · same surface <!-- rel:859 -->
- [LRS Identify Widget - Copy Attribute Values](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/lrs-identify-widget-copy-attribute-values__doc5.md>) — similar text 0.27 · 2 title words · same kind/surface/folder <!-- rel:5 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md>) — similar text 0.17 · 1 title word · same kind/surface/folder <!-- rel:13 -->
- [Dynamic Segmentation SLD - Expression Display Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynamic-segmentation-sld-expression-display-support__doc25.md>) — similar text 0.21 · same kind/surface/folder <!-- rel:25 -->
- [LRS Identify widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-identify-widget__doc905.md>) — similar text 0.18 · 2 title words · 1 filename word · same surface <!-- rel:905 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [LRS Identify](https://www.google.com/search?q=%22LRS%20Identify%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — LRS Identify Widget – Configurable Coordinate Output

## Slide 2 — I Need, Personas, Workflow

As an LRS event editor or analyst, I need configurable coordinate output in the LRS Identify widget so that I can interpret and reuse location information accurately across systems.
Personas: Event Editor and GIS Analyst responsible for validation and configuration.
Workflow: Click map → Identify → Apply config (toggle, precision, spatial reference) to output→ View coordinates → Copy/use results

## Slide 3 — Acceptance Criteria & Requirements (1/3)

Add a configuration toggle to the LRS Identify widget: 'Include coordinates in results' (default OFF)
When enabled, coordinates appear in Identify results
Add a precision option that is configurable (default = service precision)
Coordinates returned are derived from LRS result location

## Slide 4 — Acceptance Criteria & Requirements (2/3)

User can configure output spatial reference
Default spatial reference = LRS spatial reference
Follow Add Point/Add Line Event widget configuration pattern

## Slide 5 — Acceptance Criteria & Requirements (3/3)

Copied format must be: 'X,Y' or 'Coordinate1, Coordinate2'
Clearly label spatial reference in the results
Clearly communicate differences from web map projection (if they’re different)
Provide copy-to-clipboard capability for coordinate results in the widget
No regression to Identify workflows
No performance degradation

## Slide 6 — Testing

Validate toggle behavior
Validate precision configuration
Validate spatial reference default and override
Validate copy-to-clipboard format and accuracy
Regression testing

## Slide 7 — Automation

Add to existing UI automation for LRS Identify

  - Automate toggle persistence
  - Automate precision validation
  - Automate spatial reference selection
  - Automate clipboard format validation
Verify no regression to existing automation

## Slide 8 — Documentation

Document new toggle, precision, spatial reference configuration options
Explain default = LRS spatial reference
Explain differences vs web map
Document copy-to-clipboard behavior and format (X,Y)

## Slide 9 — Estimation

Story Points:
Dev Effort: days
PE Effort: days
