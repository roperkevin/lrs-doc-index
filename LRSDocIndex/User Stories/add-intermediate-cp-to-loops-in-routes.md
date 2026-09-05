# Add Intermediate Calibration Points to Loops in Routes

| Field | Value |
| --- | --- |
| **Doc** | 697 · User Story · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [AddIntermediateCPstoLoopsinRoutes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AddIntermediateCPstoLoopsinRoutes.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-09-20 15:47 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | calibration points · loops · routes · lrs network · arcgis pro · arcmap migration |
| **Tools** | — |

## Summary

User story describing the need for a tool to add intermediate calibration points to loop portions of routes in an LRS Network when migrating from ArcMap to ArcGIS Pro. The tool identifies routes with loops lacking sufficient calibration points, adds points at specified locations, and regenerates route shapes. Testing and documentation plans are included.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Generate Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-generate-routes.md>) — similar text 0.22 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:849 s=3.385 -->
- [Update Intersection Referent Tool User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-intersection-referent-tool.md>) — similar text 0.40 · same kind/surface/folder <!-- rel:696 s=3.082 -->
- [Support Snap to Vertex Option for Calibration Points Impacted by Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-to-vertex-option-for-cp-impacted.md>) — similar text 0.20 · 2 title words · same kind/surface/folder <!-- rel:611 s=2.998 -->
- [Routes with Less Than Two Calibration Points in Loops](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/routes-with-less-than-two-cp-in-loops.md>) — similar text 0.14 · 4 title words · same surface <!-- rel:764 s=2.992 -->
- [Recalibrate Route When Moving Calibration Points in Feature Services](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/recalibrate-route-when-moving-cp-in-feature-services.md>) — similar text 0.20 · 2 title words · same kind/surface/folder <!-- rel:733 s=2.992 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View LRS Network properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-network-properties.html)
<!-- docs:end -->

---

## Story
### Add Intermediate Calibration Points to loops <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a LRS Editor, I want to ensure my routes created in ArcMap that have loop portions have the required number of calibration points, so that I can edit and maintain those routes in ArcGIS Pro.
Persona

- LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  The routes that these users edit include those with complex shapes, such as loops, lollipops, alphas, and branches.  In ArcMap, loop and lollipop type routes were supported, however, there was no requirement for additional calibration points in the loop.  In Pro, these extra calibration points in the loop are expected; a tool needs to be built to add these calibration points when users migrate from ArcMap to Pro so they can edit and maintain these routes.

## Acceptance Criteria
### Add CPs to loop portion <!-- slide 3 -->
- Create a python script that users can execute against their LRS Network that does the following:
  - Identify any routes with loop portions
  - Determine if the loop portions of the routes have at least 2 calibration points within the loop portion
  - For any routes that don’t have at least 2 calibration points in the loop, add calibration points at the nearest vertex to 1/3rd and 2/3rd along the loop
  - Regenerate the shape of any routes with additional calibration points added
- The parameters for the tool should be the following:
  - LRS Network fc (needs to be in a gdb with the LRS Controller Dataset present)
  - Calibration Point fc (from the same gdb at the LRS Network)
- The tool should support only feature classes, not feature layers or layers from a service
- The LRS gdb with the network and cps can be a file gdb, traditional versioned sde, or branch versioned sde
- Note that alphas weren’t supported in ArcMap, but if we can detect and add the necessary CPs to other route shapes with loops, we should
- Create a text file when the tool completes that lists the OIDs of the routes that had new calibration points added
- Note this tool will be designed to be run after Modify LRS is run (LRS Controller Dataset is expected to be in place)
- The tool won’t be included with ArcGIS Pro, but instead will be released independent of Pro to support users making the transition from ArcMap to Pro

## Testing
<!-- slide 4 -->
- Test with Roads and Highways data from ArcMap (no controller dataset, tool should fail) and from ArcGIS Pro (with controller dataset, tool should run)
- Test on loop, lollipop, and alpha shapes types (note that loops and lollipops should have the CPs added, if we can add them for alphas and other loop shapes if possible)
- Test with routes with loops that have additional CPs already present (tool should run, but nothing will update) and routes with loops that don’t have additional CPs present
- Test with an LRS Network that doesn’t have any loops (tool should run, but nothing will update)

## Documentation
<!-- slide 5 -->
Once PE complete, work with Nathan to document the tool and get it released publicly to users
The tool will also need to be included in the ArcMap to Pro migration document

## Assignment
<!-- slide 6 -->
Story Points:
Dev:
PE:
