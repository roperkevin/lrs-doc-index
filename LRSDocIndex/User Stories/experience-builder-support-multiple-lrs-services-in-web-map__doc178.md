# Experience Builder Support Multiple LRS Services in Web Map

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Source** | [ExB - Support Multiple LRS Services in Web Map.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Support%20Multiple%20LRS%20Services%20in%20Web%20Map.pptx>) |
| **Edited** | 2025-04-29 11:47 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Experience Builder Support Multiple LRS Services in Web Map"
source_file: "ExB - Support Multiple LRS Services in Web Map.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Support%20Multiple%20LRS%20Services%20in%20Web%20Map.pptx"
doc_id: 178
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: "Nathan Easley"
last_edited: "2025-04-29T11:47:16Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["experience builder", "web map", "multiple services", "event editor", "lrs enabled service", "lrs widgets", "referent layers"]
tools: ["Add Point Event", "Add Line Event", "Split Event", "Merge Events", "Search by Route", "LRS Identify", "DynSeg"]
products: []
issues: []
related: [{"doc":167,"file":"experience-builder-time-and-versioning-widget__doc167.md","s":5.18},{"doc":184,"file":"experience-builder-express-mode-support-for-lrs-widgets__doc184.md","s":4.635},{"doc":191,"file":"experience-builder-sld-interaction-with-map__doc191.md","s":4.554},{"doc":193,"file":"create-single-lrs-picker-for-experience-builder-widgets__doc193.md","s":4.276},{"doc":177,"file":"experience-builder-referent-method-in-add-point-and-line-widgets__doc177.md","s":4.273}]
```
-->

## Summary

This document describes a user story for supporting multiple LRS services within a single web map in Experience Builder. It outlines requirements for event editors to use multiple LRS-enabled and non-LRS-enabled services together for editing and referencing. It also covers testing and documentation updates related to this functionality.

## Related documents

<!-- related:begin -->
- [Experience Builder Time and Versioning widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/experience-builder-time-and-versioning-widget__doc167.md>) — similar text 0.28 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:167 -->
- [Experience Builder Express Mode support for LRS widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-express-mode-support-for-lrs-widgets__doc184.md>) — similar text 0.28 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:184 -->
- [Experience Builder SLD Interaction with Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-sld-interaction-with-map__doc191.md>) — similar text 0.23 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:191 -->
- [Create single LRS picker for Experience Builder widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-single-lrs-picker-for-experience-builder-widgets__doc193.md>) — similar text 0.34 · 2 title words · same kind/surface/folder <!-- rel:193 -->
- [Experience Builder Referent method in Add Point and Line widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-referent-method-in-add-point-and-line-widgets__doc177.md>) — similar text 0.37 · 2 title words · same kind/surface/folder <!-- rel:177 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Merge events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-events.html)

_No page matched:_ [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com) · [Split Event](https://www.google.com/search?q=%22Split%20Event%22+site%3Adoc.esri.com) · [Search by Route](https://www.google.com/search?q=%22Search%20by%20Route%22+site%3Adoc.esri.com) · [LRS Identify](https://www.google.com/search?q=%22LRS%20Identify%22+site%3Adoc.esri.com) · [DynSeg](https://www.google.com/search?q=%22DynSeg%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Experience Builder Support multiple services in the web map

User Story
ArcGIS Enterprise

## Slide 2 — User Story

As an event editor, I need the ability to utilize multiple services within my web map, so that I can combine multiple LRSes and reference layers into a single application.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). Depending on the configuration of the LRS and the other layers that are utilized to help support event editing, these users might need to use a web map that has multiple services with LRS widgets in Experience Builder.

## Slide 3 — Multiple services in web map

For all LRS widgets, support a web map that has more than one service

  - This could be 1 LR enabled service and others that are not LR enabled OR
  - It could be multiple LR enabled services (from the same or different LRSes)
When loading layers in a widget (in express mode or regular more), show all the layers from the web map
Only layers coming from an LRS enabled service should be able to be used for LRS related editing operations like Add Point Event, Add Line Event, Split Event, and Merge Events
In Search by Route, only networks from LRS enabled services can be searched, however, all layers from all services should be able to be used for referent layers (the same goes for referent methods in Add Point and Add Line widgets)
In LRS Identify, search against any LRS Network from an LRS enabled service, however, the attribute sets can only come from the service the network came from
In the DynSeg widget, allow layers from all LRS services, but the network can only be associated with attribute sets from the same service (no mix and match between services)

## Slide 4 — Testing

Test with all LRS widgets
Verify the proper layers are loaded and the correct layers can be used for the various configuration options in the widgets
Verify non LRS enabled service layers can’t be used for editing in LRS editing widgets

## Slide 5 — Automation

No automation updates

## Slide 6 — Documentation

Update existing documentation to mention support for multiple services within the web map

## Slide 7 — Story Points

Story Points:
Dev:
PE:
