# Spike: Dual LRS Measure Ruler Design

| Field | Value |
| --- | --- |
| **Doc** | 15 · Design Spike · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [SpikeDualLRSMeasureDesign.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SpikeDualLRSMeasureDesign.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2026-06-30 18:30 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | dual measure · measure ruler · event editor · engineering network · continuous network |
| **Tools** | Dynamic Segmentation · Straight Line Diagram |

## Summary

Evaluation of design options for displaying dual LRS network measures in the Straight Line Diagram to aid event editors in interpreting and comparing event locations across Engineering and Continuous networks. Includes creation of static UI prototypes and mockups with various layout options for dual measures. Provides documentation with pros and cons and recommendations for implementation.

## Related documents

<!-- related:begin -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget-sld-dual-network-measure-support-2026-06.md>) — similar text 0.38 · 2 title words · 1 filename word · same surface/folder <!-- rel:12 s=5.593 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget-sld-dual-network-measure-support-2026-06-2.md>) — similar text 0.36 · 2 title words · 1 filename word · same surface/folder <!-- rel:27 s=5.369 -->
- [Experience Builder Flatten SLD Results and Make Ruler 10 tick marks](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-flatten-sld-results-and-make-ruler-10-tick-marks.md>) — similar text 0.13 · 1 title word · same surface/folder <!-- rel:187 s=2.877 -->
- [Flatten SLD results in rows and use 10 tick marks in ruler– test plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/24840-flatten-sld-results-in-rows-and-use-10-tick-marks-in-ruler.md>) — similar text 0.09 · 1 title word · same surface/folder <!-- rel:171 s=2.756 -->
- [SLD Devices and Junctions Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/29867-sld-devices-and-junctions.md>) — similar text 0.08 · same surface <!-- rel:28 s=2.682 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)

_No page matched:_ [Straight Line Diagram](https://www.google.com/search?q=%22Straight%20Line%20Diagram%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Dual LRS Measure Ruler Design

## Slide 2 — Dual LRS Measure Ruler Design

I Need
As an event editor, I need to evaluate ruler design options for displaying dual LRS network measures so that I can clearly interpret and compare event locations across networks without confusion.

Personas
Event Editor: Event editors are responsible for maintaining and validating LRS event data and rely on the Straight Line Diagram to understand event placement along a route. They frequently work across multiple networks (Engineering and Continuous) and need a clear, consistent way to interpret and compare measures to avoid misalignment or incorrect edits.

Workflow

- Launch Dynamic Segmentation widget
- Select Engineering network route
- Open Straight Line Diagram (SLD)
- View ruler displaying measures
- Evaluate different layout options for dual measures
- Compare clarity, readability, and usability across designs

## Slide 3 — Acceptance Criteria & Requirements

- Create static Experience Builder UI prototypes for dual-measure ruler
- Include:Engineering (primary) measuresContinuous (reference) measures
- Prototype the following design options:
  - Both measures displayed above the ruler
  - Both measures displayed below the ruler
  - One measure above and one below the ruler
  - Color-coded inline measures
  - Dual-track ruler (parallel ruler lines)
- Produce mockups for each design option

## Slide 4 — Documentation & Deliverables

- Document each design option with mockups
- Provide a pros/cons list of each option (both from development and user experience) and recommended design
- Deliver output for follow-on implementation user story

## Slide 5 — Estimation

- Estimation -
