# Spike: Pro, Server, and Controller Dataset collaboration for Cartographic Realignment

| Field | Value |
| --- | --- |
| **Doc** | 727 · Design Spike · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike Pro Server ControllerDataset collaboration CartographicRealignment.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Pro%20Server%20ControllerDataset%20collaboration%20CartographicRealignment.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2021-03-12 00:03 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | cartographic realignment · calibration points · controller dataset · apply edits · location referencing ribbon · arcgis pro · server |
| **Tools** | — |

## Summary

Explores approaches to handle user-selected methods for Calibration Points impacted by Cartographic Realignment. Focuses on persisting user options in ArcGIS Pro and integrating these selections with Server and Controller Dataset during applyEdits transactions.

## Related documents

<!-- related:begin -->
- [Spike: Advanced Table Editing options in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/advanced-table-editing-options-in-pro.md>) — similar text 0.11 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:492 s=3.224 -->
- [Support Snap, Delete, and Ignore Options for Calibration Points in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-delete-and-ignore-options-for-cp.md>) — similar text 0.25 · 2 title words · same surface/folder <!-- rel:729 s=2.834 -->
- [Support Snap to Vertex Option for Calibration Points Impacted by Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-to-vertex-option-for-cp-impacted.md>) — similar text 0.21 · 2 title words · same surface/folder <!-- rel:611 s=2.723 -->
- [Support updating measures option in cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-measures-option-in-cartographic-realignment.md>) — similar text 0.18 · 2 title words · same surface/folder <!-- rel:736 s=2.633 -->
- [Support Event Behaviors on Vertical Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-cartographic.md>) — similar text 0.19 · 2 title words · same surface/folder <!-- rel:762 s=2.58 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-cartographic-realignment.html)

_No page matched:_ [apply edits](https://www.google.com/search?q=%22apply%20edits%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Pro, Server, and Controller Dataset collaboration for Cartographic Realignment

Spike

## Slide 2 — Pro, Server, and Controller Dataset in CartoRealign

In order to implement allowing users to choose how Calibration Points that are impacted by a Cartographic Realignment are handled by the software, two questions/approaches need to be answered.

- Determine how we can persist the selected method from the Location Referencing ribbon, so they don’t have to reset it each time they open Pro.  Can we store the option selected by the user in the Pro project? As a machine setting? Somewhere else?
- Determine how we can connect the selected option on the Location Referencing ribbon in Pro with Server/Controller Dataset.  Cartographic Realignments come server side as a core applyEdits call.  How do we make sure that when that transaction is executed that we apply the user selected option for calibration points?

## Slide 3 — Assignment

Story Points:
Dev:
