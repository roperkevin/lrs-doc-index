# Enhancement: Display Expanded LRS and Business Attributes in SLD Hover Tooltip

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Source** | [ExB - SLD AllAttributesonHover.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20SLD%20AllAttributesonHover.pptx>) |
| **Edited** | 2026-06-01 18:43 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Enhancement: Display Expanded LRS and Business Attributes in SLD Hover Tooltip"
source_file: "ExB - SLD AllAttributesonHover.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20SLD%20AllAttributesonHover.pptx"
doc_id: 23
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2026-06-01T18:43:46Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["hover tooltip", "lrs attributes", "business attributes", "event editor", "lrs analyst"]
tools: ["Straight Line Diagram"]
products: []
issues: []
related: [{"doc":908,"file":"test-plan-display-expanded-lrs-and-business-attributes-in-the-sld-hover-tooltip__doc908.md","s":7.571},{"doc":25,"file":"dynamic-segmentation-sld-expression-display-support__doc25.md","s":4.564},{"doc":348,"file":"experience-builder-straight-line-diagram-event-attributes-on-hover-click__doc348.md","s":4.236},{"doc":12,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc12.md","s":3.875},{"doc":27,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc27.md","s":3.784}]
```
-->

## Summary

This document describes a user story to enhance the Straight Line Diagram (SLD) hover tooltip to display LRS attributes first followed by business attributes using display names. It includes acceptance criteria, testing plans, automation updates, and documentation requirements for the tooltip behavior enhancement.

## Related documents

<!-- related:begin -->
- [Test Plan: Display Expanded LRS and Business Attributes in the SLD Hover Tooltip](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/test-plan-display-expanded-lrs-and-business-attributes-in-the-sld-hover-tooltip__doc908.md>) — similar text 0.44 · 6 title words · 2 filename words · same surface <!-- rel:908 -->
- [Dynamic Segmentation SLD - Expression Display Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynamic-segmentation-sld-expression-display-support__doc25.md>) — similar text 0.19 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:25 -->
- [Experience Builder Straight Line Diagram Event Attributes on Hover/Click](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-straight-line-diagram-event-attributes-on-hover-click__doc348.md>) — similar text 0.14 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:348 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc12.md>) — similar text 0.22 · 1 filename word · same kind/surface/folder <!-- rel:12 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc27.md>) — similar text 0.22 · 1 filename word · same kind/surface/folder <!-- rel:27 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Straight Line Diagram](https://www.google.com/search?q=%22Straight%20Line%20Diagram%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Enhancement: Display Expanded LRS and Business Attributes in SLD Hover Tooltip

## Slide 2 — I Need, Personas, Workflow

As an event editor or LRS analyst, I need to view LRS attributes (Route ID(s), Measure(s), Dates, Event ID) followed by business attributes in the SLD hover tooltip using display names, so that I can quickly understand event context without opening additional dialogs.

Personas: Event Editor, LRS Analyst

Workflow: Hover over event → Tooltip shows LRS attributes first → Business attributes next → Continue analysis

## Slide 3 — Acceptance Criteria (1/2)

Enhance existing hover tooltip
Show LRS attributes first: Route ID(s), Measure(s), Dates, Event ID
Use alias/display names
Show business attributes after LRS attributes
Exclude ObjectID, Shape, Shape Length

## Slide 4 — Acceptance Criteria (2/2)

Show LRS attributes first followed by business attributes
Inline tooltip only
Show max attributes fitting UI (truncate overflow)
Maintain performance
Respect attribute sets
No change to click/double-click behavior

## Slide 5 — Testing

- Validate ordering and alias names
- Validate point vs line measures
- Verify excluded fields
- Test large datasets and truncation behavior
- Ensure no regression to highlight and popup behavior

## Slide 6 — Automation

Update existing UI automation to validate tooltip behavior
Validate ordering (LRS first)
Validate excluded fields
Extend tests for large attribute sets
Regression checks for hover performance

## Slide 7 — Documentation

Update widget docs for tooltip behavior
Document ordering and alias usage
List excluded fields
Add examples and screenshots

## Slide 8 — Estimation

Story Points:
Dev:
PE:
