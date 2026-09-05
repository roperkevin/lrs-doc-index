# Spike: Runtime to support LRS REST operations

|   |   |
| --- | --- |
| **Kind** | Design Spike · Other |
| **Release** | — |
| **Source** | [Spike Runtime POC.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Runtime%20POC.pptx>) |
| **Edited** | 2020-05-10 23:57 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Runtime to support LRS REST operations"
source_file: "Spike Runtime POC.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Runtime%20POC.pptx"
doc_id: 807
doc_kind: "Design Spike"
surface: "Other"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2020-05-10T23:57:49Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["runtime", "geometry to measure", "measure to geometry", "measure interpolation", "time slicing", "lrs rest operations", "prototype"]
tools: []
products: []
issues: []
related: [{"doc":503,"file":"64-bit-oid-in-lrs-rest-operations__doc503.md","s":2.501},{"doc":824,"file":"spike-experience-builder__doc824.md","s":2.326},{"doc":389,"file":"spike-prototype-web-components-for-lrs__doc389.md","s":2.32},{"doc":520,"file":"spike-64-bit-oid-in-lrs-rest__doc520.md","s":2.23},{"doc":298,"file":"prototype-json-requests-and-returns-in-rest-for-relocate-events__doc298.md","s":2.144}]
```
-->

## Summary

This document investigates the use of Runtime to build Linear Referencing System (LRS) operations for potential mobile applications. It explores capabilities such as Geometry to Measure, Measure to Geometry, Measure Interpolation, integration with time slicing logic, and licensing considerations. A prototype runtime code sample is planned to demonstrate these operations without REST service connectivity.

## Related documents

<!-- related:begin -->
- [64-bit OID in LRS REST operations](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-rest-operations__doc503.md>) — similar text 0.09 · 2 title words · same kind/folder <!-- rel:503 -->
- [Spike: Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-experience-builder__doc824.md>) — similar text 0.31 · same kind/folder <!-- rel:824 -->
- [Spike Prototype: Web Components for LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/spike-prototype-web-components-for-lrs__doc389.md>) — similar text 0.09 · same kind/folder <!-- rel:389 -->
- [Spike: 64-bit OID in LRS REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-64-bit-oid-in-lrs-rest__doc520.md>) — similar text 0.13 · 1 title word · same kind/folder <!-- rel:520 -->
- [Prototype: JSON requests and returns in REST for Relocate Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/prototype-json-requests-and-returns-in-rest-for-relocate-events__doc298.md>) — similar text 0.12 · 1 title word · same kind/folder <!-- rel:298 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [geometry to measure](https://www.google.com/search?q=%22geometry%20to%20measure%22+site%3Adoc.esri.com) · [measure to geometry](https://www.google.com/search?q=%22measure%20to%20geometry%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Runtime to support LRS REST operations

Spike

## Slide 2 — Runtime to support LRS operations

Investigate Runtime and how to utilize it to build LRS operations that could eventually be used in mobile (either Collector or as a stand alone app)

  - Does runtime have the building blocks to support Geometry to Measure (a user clicking a location on a map and getting back a route and measure)?
  - Measure to Geometry (a user providing a route and measure and getting the location on the map where that is)?
  - Measure interpolation (being able to determine the measure along a route for storage in an LRS format)?
  - Can we integrate some of our logic related to time slicing with the runtime code?
  - Are there licensing considerations we need to make?
  - Are there other limitations we don’t know about?
Build a sample of runtime code that does the following without being connected to REST services:

  - Measure to Geometry
  - Geometry to Measure
  - Measure Interpolation

## Slide 3 — Testing

This is just a prototype, so testing can be deferred until we determine if we’re going to move forward

## Slide 4 — Assignment

Story Points:
Dev:
