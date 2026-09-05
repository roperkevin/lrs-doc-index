# Spike: Experience Builder

|   |   |
| --- | --- |
| **Kind** | Design Spike · Experience Builder |
| **Release** | — |
| **Source** | [Spike Experience Builder.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Experience%20Builder.pptx>) |
| **Edited** | 2020-03-27 23:27 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Experience Builder"
source_file: "Spike Experience Builder.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Experience%20Builder.pptx"
doc_id: 824
doc_kind: "Design Spike"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2020-03-27T23:27:56Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["experience builder", "widget development", "linear referenced services", "route and measure", "agol", "portal", "prototype"]
tools: []
products: []
issues: []
related: [{"doc":651,"file":"spike-experience-builder-ui__doc651.md","s":3.931},{"doc":487,"file":"search-by-coordinate-experience-builder-widget__doc487.md","s":3.34},{"doc":700,"file":"arcgis-experience-builder-collaboration-workflow__doc700.md","s":2.759},{"doc":178,"file":"experience-builder-support-multiple-lrs-services-in-web-map__doc178.md","s":2.562},{"doc":389,"file":"spike-prototype-web-components-for-lrs__doc389.md","s":2.337}]
```
-->

## Summary

Investigation of building widgets in Experience Builder that interact with linear referenced services. The document explores development patterns, sharing widgets with linear referencing users, licensing considerations, and template creation for AGOL/Portal. A sample widget prototype is described that allows users to add XY coordinates, search, and display the location on a map.

## Related documents

<!-- related:begin -->
- [Spike: Experience Builder UI](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/spike-experience-builder-ui__doc651.md>) — similar text 0.18 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:651 -->
- [Search by Coordinate Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-coordinate-experience-builder-widget__doc487.md>) — similar text 0.13 · 2 title words · same surface/folder <!-- rel:487 -->
- [ArcGIS Experience Builder Collaboration Workflow](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/arcgis-experience-builder-collaboration-workflow__doc700.md>) — similar text 0.08 · 2 title words · 1 filename word · same surface <!-- rel:700 -->
- [Experience Builder Support Multiple LRS Services in Web Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-support-multiple-lrs-services-in-web-map__doc178.md>) — similar text 0.16 · 2 title words · same surface/folder <!-- rel:178 -->
- [Spike Prototype: Web Components for LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/spike-prototype-web-components-for-lrs__doc389.md>) — similar text 0.12 · same kind/surface/folder <!-- rel:389 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Experience Builder

Spike

## Slide 2 — Experience Builder

Investigate Experience Builder and how we can build widgets that work with linear referenced services

  - What does the development pattern look like considering we can’t be “in the box”?
  - How can we share these widgets with linear referencing users if we build them?
  - Are there licensing considerations we need to make or will simply requiring the service to be LR enabled be enough?
  - How can we build a template to share in AGOL/Portal for users to “build” these widgets into an application?
  - Are there other limitations we don’t know about (will need to talk with the Experience Builder team about this most likely)?
Build a sample widget that does the following:

  - Provide a UI for the user to add XY coordinates and search
  - Upon search, return a Route and Measure and zoom to that location on the map with some sort of marker/symbol to show the location of the coordinates.

## Slide 3 — Testing

This is just a prototype, so testing can be deferred until we determine if we’re going to move forward

## Slide 4 — Assignment

Story Points:
Dev:
