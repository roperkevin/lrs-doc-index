# Spike: Runtime to support LRS REST operations

| Field | Value |
| --- | --- |
| **Doc** | 807 · Design Spike · Other |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike Runtime POC.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Runtime%20POC.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2020-05-10 23:57 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | runtime · geometry to measure · measure to geometry · measure interpolation · time slicing · lrs rest operations · prototype |
| **Tools** | — |

## Summary

This document investigates the use of Runtime to build Linear Referencing System (LRS) operations for potential mobile applications. It explores capabilities such as Geometry to Measure, Measure to Geometry, Measure Interpolation, integration with time slicing logic, and licensing considerations. A prototype runtime code sample is planned to demonstrate these operations without REST service connectivity.

## Related documents

<!-- related:begin -->
- [64-bit OID in LRS REST operations](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-rest-operations.md>) — similar text 0.09 · 2 title words · same kind/folder <!-- rel:503 s=2.501 -->
- [Spike: Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/exb.md>) — similar text 0.31 · same kind/folder <!-- rel:824 s=2.326 -->
- [Spike Prototype: Web Components for LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/prototype-web-components-for-lrs.md>) — similar text 0.09 · same kind/folder <!-- rel:389 s=2.32 -->
- [Spike: 64-bit OID in LRS REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-rest.md>) — similar text 0.13 · 1 title word · same kind/folder <!-- rel:520 s=2.23 -->
- [Prototype: JSON requests and returns in REST for Relocate Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/prototype-json-requests-and-returns-in-rest-for-relocate.md>) — similar text 0.12 · 1 title word · same kind/folder <!-- rel:298 s=2.144 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [geometry to measure](https://www.google.com/search?q=%22geometry%20to%20measure%22+site%3Adoc.esri.com) · [measure to geometry](https://www.google.com/search?q=%22measure%20to%20geometry%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Runtime to support LRS REST operations

Spike

## Slide 2 — Runtime to support LRS operations

- Investigate Runtime and how to utilize it to build LRS operations that could eventually be used in mobile (either Collector or as a stand alone app)
  - Does runtime have the building blocks to support Geometry to Measure (a user clicking a location on a map and getting back a route and measure)?
  - Measure to Geometry (a user providing a route and measure and getting the location on the map where that is)?
  - Measure interpolation (being able to determine the measure along a route for storage in an LRS format)?
  - Can we integrate some of our logic related to time slicing with the runtime code?
  - Are there licensing considerations we need to make?
  - Are there other limitations we don’t know about?
- Build a sample of runtime code that does the following without being connected to REST services:
  - Measure to Geometry
  - Geometry to Measure
  - Measure Interpolation

## Slide 3 — Testing

- This is just a prototype, so testing can be deferred until we determine if we’re going to move forward

## Slide 4 — Assignment

Story Points:
Dev:
