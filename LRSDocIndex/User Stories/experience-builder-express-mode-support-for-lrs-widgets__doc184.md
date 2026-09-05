# Experience Builder Express Mode support for LRS widgets

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Product** | Utility Network |
| **Source** | [ExB - Support Express Mode.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Support%20Express%20Mode.pptx>) |
| **Edited** | 2025-04-22 21:26 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Experience Builder Express Mode support for LRS widgets"
source_file: "ExB - Support Express Mode.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Support%20Express%20Mode.pptx"
doc_id: 184
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: "Nathan Easley"
last_edited: "2025-04-22T21:26:49Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["express mode", "experience builder", "lrs widgets", "web app administrator", "layer configuration"]
tools: []
products: ["Utility Network"]
issues: []
related: [{"doc":174,"file":"experience-builder-express-mode-support-for-lrs-widgets-test-plan__doc174.md","s":6.4},{"doc":178,"file":"experience-builder-support-multiple-lrs-services-in-web-map__doc178.md","s":4.635},{"doc":167,"file":"experience-builder-time-and-versioning-widget__doc167.md","s":4.008},{"doc":193,"file":"create-single-lrs-picker-for-experience-builder-widgets__doc193.md","s":3.761},{"doc":77,"file":"update-lrs-templates-in-experience-builder__doc77.md","s":3.497}]
```
-->

## Summary

This document describes the user story for supporting Express Mode in all LRS widgets within ArcGIS Experience Builder. It covers the need for quick configuration by web app administrators, the default behaviors and layer organization in Express Mode, and testing and documentation requirements.

## Related documents

<!-- related:begin -->
- [Experience Builder Express Mode support for LRS widgets – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/experience-builder-express-mode-support-for-lrs-widgets-test-plan__doc174.md>) — similar text 0.45 · 6 title words · 2 filename words · same surface <!-- rel:174 -->
- [Experience Builder Support Multiple LRS Services in Web Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-support-multiple-lrs-services-in-web-map__doc178.md>) — similar text 0.28 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:178 -->
- [Experience Builder Time and Versioning widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/experience-builder-time-and-versioning-widget__doc167.md>) — similar text 0.18 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:167 -->
- [Create single LRS picker for Experience Builder widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-single-lrs-picker-for-experience-builder-widgets__doc193.md>) — similar text 0.21 · 3 title words · same kind/surface/folder <!-- rel:193 -->
- [Update LRS Templates in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-lrs-templates-in-experience-builder__doc77.md>) — similar text 0.25 · 2 title words · same kind/surface/folder <!-- rel:77 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Experience Builder Express Mode support for LRS widgets

User Story
ArcGIS Enterprise

## Slide 2 — User Story

As a web app administrator, I need the ability to quickly configure LRS widgets within Experience Builder, so I can reduce the amount of time needed to deploy custom applications using LRS widgets.
Persona
Web App Administrator: This could be a GIS Manager, an IT professional, or a GIS or Business Unit user who is responsible for configuring and administering web applications.  These users want to easily deploy Experience Builder widgets into applications and Express Mode is the supported approach to do this.  We need to make our LRS widgets support Express Mode as well to make deployment easier for LRS related applications.

## Slide 3 — Express Mode for LRS widgets

Support ExB Express Mode for all LRS widgets
Default option is to interact with the map widget in each LRS widget
By default, enable all layers
Continue to allow users to choose layers that can be disabled/enabled (follow the table widget example)
Organize the layers in this view by type (LRS Minimum Schema, LRS Network, LRS Event, LRS Intersection, Non-LRS layers). Continue to exclude tables.  Also denote any layers that are part of Utility Network or Addressing.
Continue to honor defaults for all other options in each widget
When express mode is not selected, instead of showing a large list of layers that are loaded, show an accordion that can be expanded/collapsed that shows all the layers
Technical detail: refactor code to a common configuration experience between all LRS widgets

## Slide 4 — Testing

Test all widgets in express mode and non express mode
Test removing/disabling layers
Verify other configuration options continue to work as expected

## Slide 5 — Automation

This is all configuration, so no automation

## Slide 6 — Documentation

For each LRS widget, document that Express Mode configuration is supported and is the default.  Explain what the user experience will be like with Express Mode for each individual widget.

## Slide 7 — Story Points

Story Points:
Dev:
PE:
