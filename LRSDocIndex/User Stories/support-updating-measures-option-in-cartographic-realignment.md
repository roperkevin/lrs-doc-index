# Support updating measures option in cartographic realignment

| Field | Value |
| --- | --- |
| **Doc** | 736 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [SupportUpdateMeasuresinCartoRealign.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportUpdateMeasuresinCartoRealign.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-01-26 22:33 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | cartographic realignment · route measures · calibration point · centerline · network calibration · route length · recalibration |
| **Tools** | Modify Network Calibration Rules |

## Summary

Describes a user story for updating route measures when route length changes due to cartographic realignment. Details the addition of a new parameter in the Modify Network Calibration Rules tool to enable recalibration of route measures based on shape length changes. Includes testing scenarios and documentation updates related to this functionality.

## Related documents

<!-- related:begin -->
- [Support Snap to Vertex Option for Calibration Points Impacted by Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-to-vertex-option-for-cp-impacted.md>) — similar text 0.46 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:611 s=6.485 -->
- [Support Snap, Delete, and Ignore Options for Calibration Points in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-delete-and-ignore-options-for-cp.md>) — similar text 0.46 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:729 s=6.088 -->
- [Support honoring referents event behavior for cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-honoring-referents-eb-for-cartographic-realignment.md>) — similar text 0.51 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:737 s=5.92 -->
- [Support Event Behaviors on Vertical Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-cartographic.md>) — similar text 0.26 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:762 s=4.951 -->
- [Support Event Behaviors on Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-cartographic.md>) — similar text 0.27 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:838 s=4.845 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-cartographic-realignment.html)

_No page matched:_ [Modify Network Calibration Rules](https://www.google.com/search?q=%22Modify%20Network%20Calibration%20Rules%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support updating measures option in cartographic realignment <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS editor, I need to have routes get measures updated when the length of the route is changed via cartographic realignment, so that the mileage for the route continues to be accurate when I utilize this data for reporting and other analysis operations.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  A scenario that can occur in some DoTs is that they find the geometry of their existing routes in the LRS doesn’t match their location in real life.  A cartographic realignment would allow for this update to be made.  For some DoTs, the geometric length of their routes (via centerlines) is the driver for the measures that are placed on the routes (as opposed to having predetermined measures from driving the road and counting the mileage like some other DoTs have).  When a cartographic realignment is completed and the length of the centerline is changed, the users need the change in length to be reflected on the measure on the route(s) that were impacted by the centerline change since the geometric length of their polylines is the method they use to calibrate their network.

## Acceptance Criteria
### Update Measure in Cartographic Realignment <!-- slide 3 -->
- In the “Modify Network Calibration Rules” geoprocessing tool, add a new parameter called “Recalibrate route measures based on shape length change in cartographic realignment” (this parameter is where we will expose the configuration option that was in the ArcMap Create LRS Network wizard)
- This option should already be stored in our metadata as it existed in ArcMap
- The parameter should be a drop down with three options (Enabled, Disabled, As-Is)
- Disabled is the default
- When this parameter is enabled, we should continue to store that in the metadata and update the measures for a route(s) that are impacted when a centerline has a cartographic realignment
- In the LRS Network Properties, add this parameter to the Fields and Network properties section.
- For existing ArcMap users that migrate/upgrade to Pro, we should ensure the correct behaviors continue to be configured after running Modify LRS to add the controller dataset.

### Update Measure in Cartographic Realignment <!-- slide 4 -->
- When a cartographic realignment takes place that results in the length of the centerline changing, we should do the following:
  - Determine the nearest upstream vertex on the route that was not impacted by the cartographic realignment, and place a calibration point at that location to lock in the measure
  - Add the delta in measure change to the downstream calibration points from the cartorealigned section
  - Reinterpolate the measures between the newly added CP upstream of the cartorealigned section and the next downstream CP from the cartorealigned section (which could be in the middle or end of the route)
  - Continue to write a cartographic realignment record into the edit log like we do today, but also write a calibration record into the edit log as well for the change in calibration
  - Note that for now, we’ll delete any CPs in the cartorealigned section as we need to address those scenarios in a different user story
- Use the existing experience in ArcMap as a guide

<!-- slide 5 -->
Before
After

![Figure 1 — Before](../media/support-updating-measures-option-in-cartographic-realignment/fig-01-slide-05-before.png)
![Figure 2 — Before](../media/support-updating-measures-option-in-cartographic-realignment/fig-02-slide-05-before.png)

## Testing
<!-- slide 6 -->
- Test cartorealignments on centerlines with both line and non line networks (projected and unprojected data)
- Test with both Roads and Highways (focus on this) and Pipeline Referencing data
- Should work on the following route shapes: simple, gapped, complex (loop, lollipop, alpha, branch, barbell), vertical
- Make sure to verify with a dataset created in ArcMap and migrated/updated in Pro to ensure the correct behaviors continue to be configured
- Verify correct records are added to the edit log
- Verify method of cartorealignment where measures don’t change didn’t regress (via automation)

## Automation
<!-- slide 7 -->
Create automation in both ReadyAPI and TestComplete for these scenarios

## Documentation
<!-- slide 8 -->
Add information about this method and how it would impact a cartographic realignment in https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/apply-cartographic-realignment.htm and https://pro.arcgis.com/en/pro-app/latest/help/production/roads-highways/apply-cartographic-realignment.htm
Add the new parameter and information about the two methods in the usage notes for https://pro.arcgis.com/en/pro-app/latest/tool-reference/location-referencing/modify-network-calibration-rules.htm

## Assignment
<!-- slide 9 -->
Story Points:
Dev:
PE:
