# Experience Builder Flatten SLD Results and Make Ruler 10 tick marks

| Field | Value |
| --- | --- |
| **Doc** | 187 · User Story · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExB - Flatten SLD Results and Make Ruler 10 tick marks.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Flatten%20SLD%20Results%20and%20Make%20Ruler%2010%20tick%20marks.pptx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2025-04-17 19:29 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | dynamic segmentation · straight line diagram · ruler · tick marks · event editor · flatten layers · experience builder |
| **Tools** | Dynamic Segmentation |

## Summary

User story for improving the Dynamic Segmentation widget in the Straight Line Diagram (SLD) view by flattening the number of pixels per layer to reduce vertical scrolling and changing the ruler to have 10 tick marks with major ticks centered. Includes testing with various data types and scales, updating automation, and documentation changes.

## Related documents

<!-- related:begin -->
- [Flatten SLD results in rows and use 10 tick marks in ruler– test plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/24840-flatten-sld-results-in-rows-and-use-10-tick-marks-in-ruler.md>) — similar text 0.47 · 6 title words · 2 filename words · same surface/folder <!-- rel:171 s=7.897 -->
- [Experience Builder SLD Interaction with Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-sld-interaction-with-map.md>) — similar text 0.33 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:191 s=4.836 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget-sld-dual-network-measure-support-2026-06.md>) — similar text 0.14 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:12 s=4.304 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget-sld-dual-network-measure-support-2026-06-2.md>) — similar text 0.14 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:27 s=4.222 -->
- [Experience Builder Straight Line Diagram Symbology and Display Field](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-sld-symbology-and-display-field.md>) — similar text 0.19 · 2 title words · same kind/surface/folder <!-- rel:349 s=3.591 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html)
<!-- docs:end -->

---

## Story
### Experience Builder Flatten SLD Results and Make Ruler 10 tick marks <!-- slide 1 -->
User Story
ArcGIS Enterprise

### User Story <!-- slide 2 -->
As an event editor, I need the ability to see more layers in the SLD, so I can see the relationships between more events without needing to vertically scroll.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). In the SLD, we want to flatten the layers to use fewer pixels so they can see more event layers without needing to vertically scroll.

## Acceptance Criteria
### Dynamic Segmentation widget <!-- slide 3 -->
- In the SLD view of the Dynamic Segmentation widget, make the following changes:
  - Flatten the number of pixels used for each layer so that there is less need for vertical scrolling (software engineer and designer have researched and have a number of pixels to use)
  - Change the ruler from having 8 tick marks to 10 tick marks. Show the major tick marks at the middle of the value like on a metric ruler

## Testing
<!-- slide 4 -->
- Test with a mix of APR, RH data, Addressing, and Postmile data (sanity only)
- Test with many point and line layers
- Test with various scales
- Test changing the scale using the experience in the SLD

## Automation
<!-- slide 5 -->
- Update automation since it will break with this change.

## Documentation
<!-- slide 6 -->
- If there are any screenshots in the Dynamic Segmentation widget documentation, update them with these changes

## Assignment
### Story Points <!-- slide 7 -->
Story Points:
Dev:
PE:
