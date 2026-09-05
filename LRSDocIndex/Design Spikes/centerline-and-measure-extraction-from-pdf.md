# Spike: Centerline and Measure Extraction from PDF

| Field | Value |
| --- | --- |
| **Doc** | 142 · Design Spike · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike Centerline extraction from PDF.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Centerline%20extraction%20from%20PDF.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2025-08-13 15:56 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | centerline · measure extraction · pdf drawings · route editing · georeferencing · stationing |
| **Tools** | — |

## Summary

This spike investigates methods to extract centerline geometry and measure values from georeferenced PDF engineering drawings used by LRS editors. It explores handling centerline overshoots and undershoots and extracting measures, potentially in stationing format, for use in LRS route editing tool UIs. The deliverable includes an approach and a prototype for ArcGIS Pro tool integration if feasible.

## Related documents

<!-- related:begin -->
- [Spike: Civil3D Extraction to Create Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/civil3d-extraction-to-create-route.md>) — similar text 0.24 · 1 title word · same kind/surface/folder <!-- rel:517 s=2.771 -->
- [Investigate Line Order with Reverse Stationing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/investigate-line-order-with-reverse-stationing.md>) — similar text 0.06 · same surface/folder <!-- rel:629 s=1.56 -->
- [Demo Day Checklists](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/demo-day-checklists.md>) — similar text 0.00 · same folder <!-- rel:540 s=1.52 -->
- [Enhance Reverse Line Orders tool to create common time slice](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/enhance-reverse-line-orders-tool-to-create-common-time-slice.md>) — similar text 0.04 · same surface/folder <!-- rel:530 s=1.49 -->
- [Esri Roads and Highways Tutorial](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/esri-rh-tutorial.md>) — similar text 0.05 · same surface/folder <!-- rel:875 s=1.453 -->
<!-- related:end -->

---

## Slide 1 — Spike: Centerline and measure extraction from PDF

Spike

## Slide 2 — PDF centerline and measure extraction

- In the DoT community, many of the LRS editors get PDFs of engineering drawings as the source material for LRS route edits.  This spike focuses on how we can extract centerline geometry and measure values from these types of drawings.
- Investigate methods to be able to extract centerline geometry from pdf drawings. (Note there is a spike the Indoors team did around vector extraction and a python library they identified that might be an option)
- The PDFs should be georeferenced/georectified
- Centerlines should touch the existing centerline of a route, but don’t have to; investigate how to handle overshoots/undershoots
- If there are measures present on the PDFs, explore how to extract them and then use them in the LRS route editing tool UIs as suggested measures (Note that the measures might be in stationing format)
- Deliverable is an approach to support adding these capabilities to our tools in Pro; if this support is feasible, a prototype of the capabilities in action should be included

## Slide 3 — Assignment

Story Points:
Dev:
