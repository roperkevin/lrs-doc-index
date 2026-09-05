# Spike: Elevation Profile widget interaction with Dynamic Segmentation/SLD

| Field | Value |
| --- | --- |
| **Doc** | 146 · Design Spike · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike Profile widget with SLD.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Profile%20widget%20with%20SLD.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2025-08-06 17:10 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | elevation profile · dynamic segmentation · straight line diagram · widget integration · pipeline industry |
| **Tools** | Straight Line Diagram · Dynamic Segmentation · Elevation Profile |

## Summary

Explores integration options for the elevation profile widget with the Dynamic Segmentation/Straight Line Diagram (SLD) widget. Investigates synchronized interaction among SLD, map, and elevation profile widgets and configuration enhancements for tighter integration. The deliverable includes answers to integration questions and a demo or prototype of the functionality.

## Related documents

<!-- related:begin -->
- [Spike: Oriented Imagery widget integration with Dynamic Segmentation/SLD](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/oriented-imagery-widget-integration-with-dynseg-sld.md>) — similar text 0.45 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:145 s=6.646 -->
- [Dynamic Segmentation widget integration with Oriented Imagery](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynseg-widget-integration-with-oriented-imagery.md>) — similar text 0.20 · 3 title words · 2 filename words · same surface/folder <!-- rel:76 s=4.813 -->
- [Experience Builder SLD Interaction with Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-sld-interaction-with-map.md>) — similar text 0.23 · 2 title words · 1 filename word · same surface/folder <!-- rel:191 s=3.478 -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/29871-dynseg-widget.md>) — similar text 0.15 · 3 title words · 1 filename word · same surface <!-- rel:57 s=3.215 -->
- [Experience Builder Dynamic Segmentation Widget Additional Options](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget-additional-options.md>) — similar text 0.08 · 3 title words · same surface/folder <!-- rel:361 s=2.887 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [Straight Line Diagram](https://www.google.com/search?q=%22Straight%20Line%20Diagram%22+site%3Adoc.esri.com) · [Elevation Profile](https://www.google.com/search?q=%22Elevation%20Profile%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Elevation Profile widget interaction with Dynamic Segmentation/SLD

Spike

## Slide 2 — Elevation Profile Widget

- Users in the pipeline industry have increasingly been asking about how they could integrate the elevation profile widget into the DynSeg/SLD widget
- Explore options for how we can integrate this widget with the SLD
- Can we use the route selection that is loaded into the SLD to also populate the elevation profile widget?
- Can we interact with the elevation profile in a similar way to the interaction with the map where a user can click a location on the SLD and have the elevation profile select that location?  Can we make all three widgets (SLD, map, elevation profile) stay in alignment when one of them changes?
- Can we add configuration options to the DynSeg widget to tighten this integration and always have the widgets talk to each other without needing data actions?
- Could we utilize the code from the elevation profile widget if we wanted to bring the profile into the SLD?
- Deliverable for this spike is answers to these questions and any demo/prototype of the functionality in action.

## Slide 3 — Assignment

Story Points:
Dev:
