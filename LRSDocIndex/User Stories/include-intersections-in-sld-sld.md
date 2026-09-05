# Include Intersections in Straight Line Diagram (SLD) User Story

| Field | Value |
| --- | --- |
| **Doc** | 183 · User Story · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [IncludeIntersectionsSLD_2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/IncludeIntersectionsSLD_2.pptx>) |
| **People** | author Praveen Kumar · PE — · dev — |
| **Edited** | 2025-04-23 15:39 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | straight line diagram · intersections · dynamic segmentation · event editor · gis analyst · experience builder · user story |
| **Tools** | Dynamic Segmentation |

## Summary

This document describes a user story for enabling visualization of intersections in the Straight Line Diagram (SLD) within the Dynamic Segmentation (DynSeg) widget. It covers user personas, configuration options for intersection layers, UI behavior, testing scenarios, and automation documentation related to intersection display in SLD without editing capabilities.

## Related documents

<!-- related:begin -->
- [Include Site Addresses Layer in Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/include-site-addresses-layer-in-sld.md>) — similar text 0.55 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:181 s=7.184 -->
- [Include Centerlines in Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/include-centerlines-in-sld.md>) — similar text 0.57 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:182 s=7.159 -->
- [Test Plan: Include Intersections in Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/include-intersections-in-sld.md>) — similar text 0.35 · 5 title words · 3 filename words · same surface <!-- rel:71 s=6.077 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget-sld-measure-range-filtering.md>) — similar text 0.12 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:13 s=4.644 -->
- [View only DynSeg and SLD User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/view-only-dynseg-and-sld.md>) — similar text 0.29 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:189 s=4.216 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html) · [View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-lrs-intersection-properties.html)
<!-- docs:end -->

---

## Story
### Include intersections in SLD <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an Event Editor, I need the ability to visualize intersections in SLD, so that I can retrieve relationships of the intersections with my asset data and properly location and orient myself for event editing and analysis in SLD. I don’t need to edit the intersections.
Persona
Typically located in different business units/departments than the LRS route editors, the following users have varied GIS experience, but a high level of knowledge about the characteristics they maintain/analyze (traffic control, safety, pavement, crashes, etc.)
Event Editor: These users are responsible for making edits to route characteristics and assets. They need to be able to visualize and retrieve intersection information on the route shown in SLD in preparation for event editing. They don’t edit intersection data.
GIS analyst: These users are responsible for exporting SLD to further retrieve information for route characteristics and assets analysis. They need intersection location and attribute information in their analysis. They don’t edit intersection data.
Sample workflow:
A GIS analyst wants to create a report of the frequency of crashes in a 0.1 mi radius of intersections vs. crashes that are not at an intersection.
An event editor needs to check and supplement missing signal information at intersections.

## Acceptance Criteria
### Timeline Notes <!-- slide 3 -->
- This user story will be implemented after having Express Mode in DynSeg widget, so the majority of designs will be shown in Express Mode, but they work the same in “traditional mode” aka Select layers.
- This user story requires some UI changes in DynSeg widget as it’s the first of multiple “include additional layers in SLD” user stories.
UI overview

![Figure 1 — Timeline Notes](../media/include-intersections-in-sld-sld/fig-01-slide-03-timeline-notes.png)

### Configuration <!-- slide 4 -->
Have a SLD settings section under Default settings

- If webmap doesn’t contain any intersections, SLD settings only has Diagram default scale and Show statistics
- If webmap has intersection layers, the first thing in SLD settings is a dropdown
  - Default state is Show intersection layers with all intersections layers checked below
    - To hide a particular intersection layer, uncheck it
    - If all intersection layers are unchecked, treat like B
  - The other value is Hide intersection layers. When this value is chosen, all checkboxes below are gone

![Figure 2 — Configuration](../media/include-intersections-in-sld-sld/fig-02-slide-04-configuration.png)
![Figure 3 — Configuration](../media/include-intersections-in-sld-sld/fig-03-slide-04-configuration.png)
![Figure 4 — Configuration](../media/include-intersections-in-sld-sld/fig-04-slide-04-configuration.png)
![Figure 5 — Configuration](../media/include-intersections-in-sld-sld/fig-05-slide-04-configuration.png)
![Figure 6 — Configuration](../media/include-intersections-in-sld-sld/fig-06-slide-04-configuration.png)

![Figure 7 — Configuration](../media/include-intersections-in-sld-sld/fig-07-slide-04-configuration.svg)

### Configuration – ctd . <!-- slide 5 -->
- Users can choose any non-editor tracking or system fields by selecting the intersection layer in the webmap layer list
- Even when “Line only” is chosen for showing events, we still show intersections in SLD ??
- If an intersection is unchecked in the Select layers pane (or removed in traditional mode), but checked in Show intersection layers in SLD settings, do not show in SLD. This is the same behavior as an event in the chosen attribute set is removed from Loaded layers.
OWNER.Engineering_Intersection

![Figure 8 — Configuration – ctd .](../media/include-intersections-in-sld-sld/fig-08-slide-05-configuration-ctd.png)
![Figure 9 — Configuration – ctd .](../media/include-intersections-in-sld-sld/fig-09-slide-05-configuration-ctd.png)
![Figure 10 — Configuration – ctd .](../media/include-intersections-in-sld-sld/fig-10-slide-05-configuration-ctd.png)
![Figure 4 — Configuration](../media/include-intersections-in-sld-sld/fig-04-slide-04-configuration.png)
![Figure 11 — Configuration – ctd .](../media/include-intersections-in-sld-sld/fig-11-slide-05-configuration-ctd.png)

![Figure 12 — Configuration – ctd .](../media/include-intersections-in-sld-sld/fig-12-slide-05-configuration-ctd.svg)

### SLD <!-- slide 6 -->
- No change in Dynseg table. Do not show intersections in table nor create new segmentation
- Place Intersections at the top rows of SLD
- Honor intersection symbology
- Hovering over an intersection shows Display field + Intersection ID, or Intersection ID itself if it is Display Field (like what we do today)
- After double clicking an intersection record, pop-up window shows 1 section called “Fields” that shows all fields. All fields are non-editable.
  - IntersectionID, IntersectionName, RouteID, FeatureID, FeatureClassName, FromDate, ToDate, Measure
- No statistics section

![Figure 13 — SLD](../media/include-intersections-in-sld-sld/fig-13-slide-06-sld.png)

![Figure 14 — SLD](../media/include-intersections-in-sld-sld/fig-14-slide-06-sld.svg)

## Testing
<!-- slide 7 -->
- Verify UI aligns with Experience Builder style
- Test SLD and sanity check Dynseg table does not show any intersection
- Test with nonline and line networks, with line and/or point event attribute sets
- Test the following scenarios:
  - Webmap does not contain any intersection
  - Webmap has multiple intersections but none/one/multiple intersection layers are checked in SLD settings
- Test route-route and route-polygon intersection layers
- Test different display fields
- Use different symbology for multiple intersection layers
- Verify intersection fields are not editable
- 508/i18n testing
- Test with different themes
- Test in Chrome and Firefox
- Test in different sizes (web, tab and mobile)

![Figure 15 — Testing](../media/include-intersections-in-sld-sld/fig-15-slide-07-testing.svg)

## Automation
### Automation Documentation <!-- slide 8 -->
If existing automation fails, fix it
Add cases for showing various intersection results
Add to existing Dynseg-SLD topic

![Figure 16 — Automation Documentation](../media/include-intersections-in-sld-sld/fig-16-slide-08-automation-documentation.svg)

## Assignment
<!-- slide 9 -->
Story Points:
Dev:
PE:

![Figure 17 — Assignment](../media/include-intersections-in-sld-sld/fig-17-slide-09-assignment.svg)
