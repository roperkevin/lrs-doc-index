# Spike Investigate Portal Token in Experience Builder

|   |   |
| --- | --- |
| **Kind** | Design Spike · Experience Builder |
| **Release** | — |
| **Source** | [Spike Investigate Portal Token in ExB.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Investigate%20Portal%20Token%20in%20ExB.pptx>) |
| **Edited** | 2025-04-16 15:32 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike Investigate Portal Token in Experience Builder"
source_file: "Spike Investigate Portal Token in ExB.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Investigate%20Portal%20Token%20in%20ExB.pptx"
doc_id: 192
doc_kind: "Design Spike"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2025-04-16T15:32:11Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["portal token", "experience builder", "lrs widget", "token issues", "application errors"]
tools: []
products: []
issues: []
related: [{"doc":193,"file":"create-single-lrs-picker-for-experience-builder-widgets__doc193.md","s":3.52},{"doc":178,"file":"experience-builder-support-multiple-lrs-services-in-web-map__doc178.md","s":3.1},{"doc":184,"file":"experience-builder-express-mode-support-for-lrs-widgets__doc184.md","s":2.819},{"doc":476,"file":"search-by-referent-experience-builder-widget__doc476.md","s":2.222},{"doc":174,"file":"experience-builder-express-mode-support-for-lrs-widgets-test-plan__doc174.md","s":2.157}]
```
-->

## Summary

This spike investigates the utilization of Portal tokens in Experience Builder (ExB) for LRS widgets. It explores whether Portal tokens can replace current tokens, potential issues when LRS widgets are deployed alongside non-LRS widgets, and other possible concerns. The deliverable is a recommendation report including pros, cons, and implementation effort estimates.

## Related documents

<!-- related:begin -->
- [Create single LRS picker for Experience Builder widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-single-lrs-picker-for-experience-builder-widgets__doc193.md>) — similar text 0.14 · 2 title words · same surface/folder <!-- rel:193 -->
- [Experience Builder Support Multiple LRS Services in Web Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-support-multiple-lrs-services-in-web-map__doc178.md>) — similar text 0.07 · 2 title words · same surface/folder <!-- rel:178 -->
- [Experience Builder Express Mode support for LRS widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-express-mode-support-for-lrs-widgets__doc184.md>) — similar text 0.12 · 2 title words · same surface/folder <!-- rel:184 -->
- [Search by Referent Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-referent-experience-builder-widget__doc476.md>) — similar text 0.04 · 2 title words · same surface/folder <!-- rel:476 -->
- [Experience Builder Express Mode support for LRS widgets – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/experience-builder-express-mode-support-for-lrs-widgets-test-plan__doc174.md>) — similar text 0.07 · 2 title words · same surface <!-- rel:174 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Investigate utilization of Portal token in ExB

Spike

## Slide 2 — Portal token

As more LRS widgets are built in Experience Builder, scenarios are occurring where the token used in ExB widget for apps are causing issues and errors.
This spike will investigate the use of the Portal token with LRS widgets in ExB to ensure a consistent experience for users and no unexpected errors in applications deployed.
Explore the use of Portal tokens with LRS ExB widgets

  - Can they be used in place of the tokens we use today?
  - Are there issues when LRS widgets are deployed with other non LRS ExB widgets?
  - Are there any other potential issues if we used this approach?
Deliverable for the spike is to report back with a recommendation of whether to use Portal tokens and why.  Include any Pros and Cons of the approach and estimated effort to implement if that is the decision made.

## Slide 3 — Assignment

Story Points:
Dev:
