# Flatten SLD results in rows and use 10 tick marks in ruler– test plan

| Field | Value |
| --- | --- |
| **Doc** | 171 · Test Plan · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#24840](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/24840) |
| **Source** | [FlattenSLD_10tickmarks_testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/FlattenSLD_10tickmarks_testplan.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE — · dev 1 |
| **Edited** | 2025-05-22 22:14 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | straight line diagram · tick marks · flatten rows · experience builder · event attributes · automation · testing |
| **Tools** | Dynamic Segmentation |

## Summary

Test plan for flattening the number of pixels used per layer in rows of the Straight Line Diagram (SLD) to make rows more compact and changing the ruler from 8 to 10 tick marks with major ticks centered. Includes verification of display fields, hovering and clicking on measures, and testing across various data types, scales, browsers, and accessibility requirements. Also covers updating automation and documentation to reflect these changes.

## Related documents

<!-- related:begin -->
- [Experience Builder Flatten SLD Results and Make Ruler 10 tick marks](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-flatten-sld-results-and-make-ruler-10-tick-marks.md>) — similar text 0.47 · 6 title words · 2 filename words · same surface/folder <!-- rel:187 s=7.897 -->
- [View-only (non editable) DynSeg / SLD in Experience Builder – test plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/20071-view-only-non-editable-dynseg-sld-in-exb.md>) — similar text 0.19 · 1 title word · 2 filename words · same kind/surface/dev <!-- rel:161 s=4.605 -->
- [Include Intersections in Straight Line Diagram (SLD) User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/include-intersections-in-sld-sld.md>) — similar text 0.21 · 1 title word · 1 filename word · same surface/folder <!-- rel:183 s=3.189 -->
- [Include Site Addresses Layer in Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/include-site-addresses-layer-in-sld.md>) — similar text 0.33 · 1 filename word · same surface/folder <!-- rel:181 s=3.143 -->
- [SLD Devices and Junctions Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/29867-sld-devices-and-junctions.md>) — similar text 0.22 · 1 title word · 1 filename word · same kind/surface <!-- rel:28 s=3 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html)
<!-- docs:end -->

---

## Overview

### Slide 1 — Flatten SLD results in rows and use 10 tick marks in ruler– test plan <!-- slide 1 -->

https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/24840

PE:
Dev:

## Test Cases

### TC-U01 — In SLD <!-- src: S5 · slide 2 · label In SLD -->

**Steps:**
1. Flatten the number of pixels used for each layer in each row – aka the symbology used for events is shorter in height so the rows are more compact
   - Software engineer and designer have researched and have a number of pixels to use
   - Verify the display field shows fine
2. Change the ruler from having 8 tick marks to 10 tick marks. Show the major tick marks at the middle of the value like on a metric ruler
   - Verify hovering and clicking on a measure still show the correct value/results

## Other content

### Slide 2 <!-- slide 2 -->

Verification
No change in configuration

Full Address Number: 1703
Road Centerline ID: {AB840-28304-…
Type: Conceptual
Note: Other

Full Address Number: 1703
Road Centerline ID: {AB840-28304-…
Type: Conceptual
Note: Other

Route Name: R1_NWS Line A2
View Date: 4/22/2025 Measure Range: 0 – 122791.314 Feet (US Survey)

[figure: Road Centerlines · Left Site Addresses · Right Site Addresses · IntersectionName · IntersectionName_2 · OperatingPressure · Field_track · Other]

![Figure 1 — 2](../media/24840-flatten-sld-results-in-rows-and-use-10-tick-marks-in-ruler/fig-01-slide-02-2.png)
![Figure 2 — 2](../media/24840-flatten-sld-results-in-rows-and-use-10-tick-marks-in-ruler/fig-02-slide-02-2.png)
![Figure 3 — 2](../media/24840-flatten-sld-results-in-rows-and-use-10-tick-marks-in-ruler/fig-03-slide-02-2.png)
![Figure 4 — 2](../media/24840-flatten-sld-results-in-rows-and-use-10-tick-marks-in-ruler/fig-04-slide-02-2.png)
![Figure 5 — 2](../media/24840-flatten-sld-results-in-rows-and-use-10-tick-marks-in-ruler/fig-05-slide-02-2.png)
![Figure 6 — 2](../media/24840-flatten-sld-results-in-rows-and-use-10-tick-marks-in-ruler/fig-06-slide-02-2.png)

![Figure 7 — 2](../media/24840-flatten-sld-results-in-rows-and-use-10-tick-marks-in-ruler/fig-07-slide-02-2.svg)

### Slide 3 <!-- slide 3 -->

Test

- Test SLD only
- Test with a mix of APR, RH data, Addressing, and Postmile data (sanity only)
  - Consider using automation case from \\lrtest\C$\ExperienceBuilder_Automation\11.5\Sanity Testing\SLD
  - Create more cases for data that is not covered in automation using 3 and 4 below
  - Do a brief sanity check that the tool results are the same as before
- Test with many point (intersections and events) and line layers, and centerlines and site addresses for corresponding networks. Make sure rows are flattened in height.
- Test All events attribute sets and customized attribute sets
- Test with various scales
- Test changing the scale using the experience in the SLD
- Test hovering and clicking on event records and measures
- Verify the tool aligns with any other Experience Builder specifications/requirements
- 508/i18n
- Test in different browsers (chrome and firefox) and layouts

### Slide 4 <!-- slide 4 -->

Automation
Update automation since it will break with this change.

Documentation
If there are any screenshots in the Dynamic Segmentation widget documentation, update them with these changes
