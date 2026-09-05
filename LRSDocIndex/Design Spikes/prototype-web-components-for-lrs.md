# Spike Prototype: Web Components for LRS

| Field | Value |
| --- | --- |
| **Doc** | 389 · Design Spike · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike WebComponents.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20WebComponents.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2024-03-26 16:31 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | web component · experience builder widget · geometry to measure · lrs identify · rest operations · prototype |
| **Tools** | — |

## Summary

Research and prototype web components to leverage existing Experience Builder operations and capabilities for use in multiple Esri web applications. Evaluate whether to convert REST operations or larger widget functionalities into reusable components, focusing on the LRS Identify widget's geometryToMeasure capability.

## Related documents

<!-- related:begin -->
- [Spike: Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/exb.md>) — similar text 0.12 · same kind/surface/folder <!-- rel:824 s=2.332 -->
- [Spike: Runtime to support LRS REST operations](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/runtime-to-support-lrs-rest-operations.md>) — similar text 0.09 · same kind/folder <!-- rel:807 s=2.32 -->
- [Experience Builder Time and Versioning widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-time-and-versioning-widget.md>) — similar text 0.13 · same surface/folder <!-- rel:167 s=1.97 -->
- [Experience Builder Data Actions User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-data-actions.md>) — similar text 0.08 · same surface/folder <!-- rel:430 s=1.794 -->
- [LRS Identify widget User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-identify-widget-user-story__doc465.md>) — similar text 0.06 · same surface/folder <!-- rel:465 s=1.72 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com) · [geometry to measure](https://www.google.com/search?q=%22geometry%20to%20measure%22+site%3Adoc.esri.com) · [identify](https://www.google.com/search?q=%22identify%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike/Prototype: Web Components

Spike

## Slide 2 — Spike

- Research the web component approach teams are taking around functionality for multiple Esri web apps https://esriis-my.sharepoint.com/:v:/g/personal/oma12722_esri_com/EWr3iZtZlDtIu18BGX6zv6IBn1D8zFX_clcept-BDAeDZQ
https://qawebgis.esri.com/arcgis-components/?path=/docs/welcome--docs
Use the charts team as an example.

- Research the feasibility and best approach to create components so we can utilize many of the operations/capabilities we’ve built into Experience Builder in other apps being built across Esri (web editor, field maps, etc.)
- Determine which approach would be best for us to follow as we create components:
  - Should REST operations such as geometyToMeasure and Translate each be turned into a component?
  - Should we take larger chunks of functionality like LRS Experience Builder widget components such as Search by Route and LRS Identify and convert them into components?
- After the best approach is determined, build a prototype of component(s) that would best leverage the capabilities within the LRS Identify widget (mainly the geometryToMeasure portion) in Experience Builder

## Slide 3 — Assignment

Story Points:
Dev:
