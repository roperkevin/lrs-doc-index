# Spike: Experience Builder

| Field | Value |
| --- | --- |
| **Doc** | 824 · Design Spike · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike Experience Builder.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Experience%20Builder.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2020-03-27 23:27 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | experience builder · widget development · linear referenced services · route and measure · agol · portal · prototype |
| **Tools** | — |

## Summary

Investigation of building widgets in Experience Builder that interact with linear referenced services. The document explores development patterns, sharing widgets with linear referencing users, licensing considerations, and template creation for AGOL/Portal. A sample widget prototype is described that allows users to add XY coordinates, search, and display the location on a map.

## Related documents

<!-- related:begin -->
- [Spike: Experience Builder UI](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/exb-ui.md>) — similar text 0.18 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:651 s=3.931 -->
- [Search by Coordinate Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-coordinate-exb-widget.md>) — similar text 0.13 · 2 title words · same surface/folder <!-- rel:487 s=3.34 -->
- [ArcGIS Experience Builder Collaboration Workflow](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/arcgis-exb-collaboration-workflow.md>) — similar text 0.08 · 2 title words · 1 filename word · same surface <!-- rel:700 s=2.759 -->
- [Experience Builder Support Multiple LRS Services in Web Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-support-multiple-lrs-services-in-web-map.md>) — similar text 0.16 · 2 title words · same surface/folder <!-- rel:178 s=2.562 -->
- [Spike Prototype: Web Components for LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/prototype-web-components-for-lrs.md>) — similar text 0.12 · same kind/surface/folder <!-- rel:389 s=2.337 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Experience Builder

Spike

## Slide 2 — Experience Builder

- Investigate Experience Builder and how we can build widgets that work with linear referenced services
  - What does the development pattern look like considering we can’t be “in the box”?
  - How can we share these widgets with linear referencing users if we build them?
  - Are there licensing considerations we need to make or will simply requiring the service to be LR enabled be enough?
  - How can we build a template to share in AGOL/Portal for users to “build” these widgets into an application?
  - Are there other limitations we don’t know about (will need to talk with the Experience Builder team about this most likely)?
- Build a sample widget that does the following:
  - Provide a UI for the user to add XY coordinates and search
  - Upon search, return a Route and Measure and zoom to that location on the map with some sort of marker/symbol to show the location of the coordinates.

## Slide 3 — Testing

- This is just a prototype, so testing can be deferred until we determine if we’re going to move forward

## Slide 4 — Assignment

Story Points:
Dev:
