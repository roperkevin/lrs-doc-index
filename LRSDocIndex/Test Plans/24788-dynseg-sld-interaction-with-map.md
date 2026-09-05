# Dynamic Segmentation: SLD Interaction with Map Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 175 · Test Plan · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#24788](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/24788) |
| **Source** | [24788-SLDInteractionwithMap_TestPlanV2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/24788-SLDInteractionwithMap_TestPlanV2.pptx>) · rev V2 |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2025-05-13 22:22 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | dynamic segmentation · straight line diagram · sld · map interaction · sync · route · zoom · measure |
| **Tools** | — |

## Summary

Test plan for the interaction between the Straight Line Diagram (SLD) component of Dynamic Segmentation and the map widget. It covers positive test cases for synchronization of scale, zoom, markers, and navigation between the SLD and map, including handling of complex route shapes and accessibility considerations.

## Related documents

<!-- related:begin -->
- [Experience Builder SLD Interaction with Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-sld-interaction-with-map.md>) — similar text 0.35 · 3 title words · 1 filename word · same surface <!-- rel:191 s=4.601 -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/26266-dynseg-widget.md>) — similar text 0.18 · 2 title words · 1 filename word · same surface <!-- rel:151 s=3.261 -->
- [Dynamic Segmentation widget integration with Oriented Imagery](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynseg-widget-integration-with-oriented-imagery.md>) — similar text 0.15 · 2 title words · same surface <!-- rel:76 s=3.189 -->
- [Dynamic Segmentation – Straight Line Diagram Support - ExB](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/20594-dynseg-sld-support-exb.md>) — similar text 0.21 · 2 title words · same kind/surface <!-- rel:346 s=2.97 -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/29871-dynseg-widget.md>) — similar text 0.18 · 2 title words · same surface <!-- rel:57 s=2.776 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html)
<!-- docs:end -->

---

## Test Cases

### TC-P01 — When toggling the sync button on/off <!-- src: S4 · slide 1 · Positive Tests: SLD Interaction w/ Map Widget · 1 -->

- **Group:** SLD Interaction W / Map Widget
- **Case:** When toggling the sync button on/off, always honor the range in the SLD and update the map appropriately

### TC-P02 — If ruler is single clicked <!-- src: S4 · slide 1 · Positive Tests: SLD Interaction w/ Map Widget · 2 -->

- **Group:** SLD Interaction W / Map Widget
- **Case:** If ruler is single clicked, show a marker on the map that is at the same measure as the ruler location. Ensure the drill down is present. If drill down is active, we will keep the marker active in the map

### TC-P03 — When user clicks off the ruler, remove the point on the map <!-- src: S4 · slide 1 · Positive Tests: SLD Interaction w/ Map Widget · 3 -->

- **Group:** SLD Interaction W / Map Widget

### TC-P04 — If scale is changed, zoom in/out in the map to match the SLD scale <!-- src: S4 · slide 1 · Positive Tests: SLD Interaction w/ Map Widget · 4 -->

- **Group:** SLD Interaction W / Map Widget

### TC-P05 — If horizontal scroll bar is used to navigate within the SLD <!-- src: S4 · slide 1 · Positive Tests: SLD Interaction w/ Map Widget · 5 -->

- **Group:** SLD Interaction W / Map Widget
- **Case:** If horizontal scroll bar is used to navigate within the SLD, wait 1 second then move around in the map to reflect the new SLD view

### TC-P06 — When sync is enabled <!-- src: S4 · slide 1 · Positive Tests: SLD Interaction w/ Map Widget · 6 -->

- **Group:** SLD Interaction W / Map Widget
- **Case:** When sync is enabled, show markers for the ends of events within the SLD in the map

### TC-P07 — When sync is enabled, ensure zoom level of map is not too zoomed in <!-- src: S4 · slide 1 · Positive Tests: SLD Interaction w/ Map Widget · 7 -->

- **Group:** SLD Interaction W / Map Widget

### TC-P08 — Toggle button follows existing SLD style <!-- src: S4 · slide 1 · Positive Tests: SLD Table UI · 1 -->

- **Group:** SLD Table UI

### TC-P09 — Toggle button can be updated with out-of-the-box themes <!-- src: S4 · slide 1 · Positive Tests: SLD Table UI · 2 -->

- **Group:** SLD Table UI

### TC-P10 — Toggle button reflects active vs. non active state <!-- src: S4 · slide 1 · Positive Tests: SLD Table UI · 3 -->

- **Group:** SLD Table UI

### TC-P11 — Toggle button is on by default <!-- src: S4 · slide 1 · Positive Tests: SLD Table UI · 4 -->

- **Group:** SLD Table UI

### TC-P12 — Toggle button is accessible by keyboard navigation <!-- src: S4 · slide 1 · Positive Tests: SLD Table UI · 5 -->

- **Group:** SLD Table UI

### TC-P13 — SLD displaying only portion of route (1) <!-- src: S4 · slide 2 · Positive Tests · 1 -->

- **Case:** SLD displaying only portion of route, map shows only the portion displayed in SLD

### TC-P14 — Map widget zoomed out past extent of route, SLD shows the full extent <!-- src: S4 · slide 2 · Positive Tests · 2 -->

### TC-P15 — Map widget zoomed in greatly on route, SLD shows zoomed extent (1) <!-- src: S4 · slide 2 · Positive Tests · 3 -->

### TC-P16 — Map widget displaying area near route (1) <!-- src: S4 · slide 2 · Positive Tests · 4 -->

- **Case:** Map widget displaying area near route, last available display of SLD is shown in SLD. User re-toggles the sync option, map updates to zoom to portion of route displayed in SLD

### TC-P17 — 5. Map widget displayed complex shape with self-intersecting measures. SLD <!-- src: S4 · slide 2 · Positive Tests · 5 -->

- **Case:** 5. Map widget displayed complex shape with self-intersecting measures. SLD displays the full range of measures displayed in the map

### TC-P18 — When moving around in the map <!-- src: S4 · slide 2 · Positive Tests: Map Widget Interaction w/ SLD · 1 -->

- **Group:** Map Widget Interaction W / SLD
- **Case:** When moving around in the map, the SLD view will shift to match the displayed extent on the map

### TC-P19 — When zooming in/out in the map <!-- src: S4 · slide 2 · Positive Tests: Map Widget Interaction w/ SLD · 2 -->

- **Group:** Map Widget Interaction W / SLD
- **Case:** When zooming in/out in the map, the SLD scale will change to reflect the measure range displayed in the map

### TC-P20 — If the map is navigated to a location where the chosen route is no longer <!-- src: S4 · slide 2 · Positive Tests: Map Widget Interaction w/ SLD · 3 -->

- **Group:** Map Widget Interaction W / SLD
- **Case:** If the map is navigated to a location where the chosen route is no longer in view, keep the SLD at the last location that it can capture before the map is out of range

### TC-P21 — 3a. After user has toggled the sync button off/on after zooming to a location <!-- src: S4 · slide 2 · Positive Tests: Map Widget Interaction w/ SLD · 4 -->

- **Group:** Map Widget Interaction W / SLD
- **Case:** 3a. After user has toggled the sync button off/on after zooming to a location off the route, ensure the map zooms back in to the displayed route measures at an appropriate scale

### TC-P22 — If the map zoom extent is greater than the max zoom of the SLD <!-- src: S4 · slide 2 · Positive Tests: Map Widget Interaction w/ SLD · 5 -->

- **Group:** Map Widget Interaction W / SLD
- **Case:** If the map zoom extent is greater than the max zoom of the SLD, update the SLD to zoom out to the max scale

### TC-P23 — Test all supported operations for map interaction, including mouse navigation <!-- src: S4 · slide 2 · Positive Tests: Map Widget Interaction w/ SLD · 6 -->

- **Group:** Map Widget Interaction W / SLD
- **Case:** Test all supported operations for map interaction, including mouse navigation (including map rotation w/ right click), keyboard navigation (arrow keys and A + S keys to rotate map), Default View button, Previous/Next extent buttons, Find my location button, Zoom In/Out buttons, Compass button, etc.

### TC-P24 — Turn off Map widget’s Enable scroll zooming configuration option <!-- src: S4 · slide 2 · Positive Tests: Map Widget Interaction w/ SLD · 7 -->

- **Group:** Map Widget Interaction W / SLD
- **Case:** Turn off Map widget’s Enable scroll zooming configuration option, ensure SLD interaction continues to work

### TC-U01 — SLD Displaying Only Portion of Route (case 1) <!-- src: S1 · slide 3 · case 1 -->

- **Case:** SLD displaying only portion of route, map shows only the portion displayed in SLD

Portion of route displayed in SLD

Route start displayed in SLD
Route end displayed in SLD

[figure: Map · 0 · 10 · 2 · SLD · 1 · 3–9 · Clicked ruler location]

![Figure 1 — Zoom level on map](../media/24788-dynseg-sld-interaction-with-map/fig-01-slide-03-zoom-level-on-map.svg)

### TC-U02 — Map Widget Zoomed Out Far Past Extent of Route, SLD Shows Whole Route <!-- src: S1 · slide 4 · case 2 -->

Full extent of route displayed in SLD

[figure: Map · 0 · 10 · 2 · SLD · 1 · 3–9]

![Figure 2 — Zoom level on map](../media/24788-dynseg-sld-interaction-with-map/fig-02-slide-04-zoom-level-on-map.png)

![Figure 3 — Zoom level on map](../media/24788-dynseg-sld-interaction-with-map/fig-03-slide-04-zoom-level-on-map.svg)

### TC-U03 — Map widget zoomed in greatly on route, SLD shows zoomed extent (case 3) <!-- src: S2 · slide 5 · case 3 -->

Highlighted portion of route
Portion of route displayed in SLD, there is a threshold for zooming in, but the SLD will zoom in to the furthest it can

Zoom level on map

[figure: Map · 0 · 10 · 2 · SLD · 1 · 3–9]

![Figure 4 — 3. Map widget zoomed in greatly on route, SLD shows zoomed extent](../media/24788-dynseg-sld-interaction-with-map/fig-04-slide-05-3-map-widget-zoomed-in-greatly-on-route.svg)

### TC-U04 — Map Widget Displaying Area Near Route (case 4) <!-- src: S1 · slide 6 · case 4 -->

- **Case:** Map widget displaying area near route, last available display of SLD is shown in SLD. User re-toggles the sync option, map updates to zoom to portion of route displayed in SLD

Portion of route displayed in SLD

Zoom level on map
Button is toggled back on

[figure: Map · 0 · 10 · 2 · SLD · 1 · 3–9]

![Figure 5 — Zoom level on map](../media/24788-dynseg-sld-interaction-with-map/fig-05-slide-06-zoom-level-on-map.svg)

### TC-U05 — Map Widget Displayed Complex Shape with Self-intersecting Measures. SLD Displays <!-- src: S1 · slide 7 · case 5 -->

- **Case:** Map widget displayed complex shape with self-intersecting measures. SLD displays the full range of measures displayed in the map

Portion of route displayed in SLD

[figure: 0 · 10 · 2 · SLD · 1 · 3–9]

![Figure 6 — 7](../media/24788-dynseg-sld-interaction-with-map/fig-06-slide-07-7.png)

![Figure 7 — 7](../media/24788-dynseg-sld-interaction-with-map/fig-07-slide-07-7.svg)

## Other content

### Slide 1 — Devtopia Issue <!-- slide 1 -->

Dynamic Segmentation: SLD Interaction with Map

**Notes**
- Add functionality to Dynamic Segmentation’s SLD component to interact with the map
- No new configuration options, a toggle button will be added to the SLD to turn sync with the map on/off
- Test with APR, UNAPR, and RH data
- Sanity test ADMRH and PoM data
- Test with PCS vs. GCS data
- Test with complex route shapes (loop, lollipop, barbell, alpha, branch, etc.)
- Test with routes with different direction orientations (horizontal moving West vs. East, Vertical moving North vs. South, diagonal moving NE vs. NW vs. SE vs. SW, multi-directional, etc.)
- Test SLD with dozens of layers to ensure performance is acceptable
- I18n and 508. Reach out to Chandan for 508 accessibility web app testing.
