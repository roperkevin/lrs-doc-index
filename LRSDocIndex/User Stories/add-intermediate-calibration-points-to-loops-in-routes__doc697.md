# Add Intermediate Calibration Points to Loops in Routes

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [AddIntermediateCPstoLoopsinRoutes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AddIntermediateCPstoLoopsinRoutes.pptx>) |
| **Edited** | 2021-09-20 15:47 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Add Intermediate Calibration Points to Loops in Routes"
source_file: "AddIntermediateCPstoLoopsinRoutes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AddIntermediateCPstoLoopsinRoutes.pptx"
doc_id: 697
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2021-09-20T15:47:44Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["calibration points", "loops", "routes", "lrs network", "arcgis pro", "arcmap migration"]
tools: []
products: ["Roads & Highways"]
issues: []
related: [{"doc":849,"file":"support-complex-route-shapes-in-generate-routes__doc849.md","s":3.385},{"doc":696,"file":"update-intersection-referent-tool-user-story__doc696.md","s":3.082},{"doc":611,"file":"support-snap-to-vertex-option-for-calibration-points-impacted-by-cartographic__doc611.md","s":2.998},{"doc":764,"file":"routes-with-less-than-two-calibration-points-in-loops__doc764.md","s":2.992},{"doc":733,"file":"recalibrate-route-when-moving-calibration-points-in-feature-services__doc733.md","s":2.992}]
```
-->

## Summary

User story describing the need for a tool to add intermediate calibration points to loop portions of routes in an LRS Network when migrating from ArcMap to ArcGIS Pro. The tool identifies routes with loops lacking sufficient calibration points, adds points at specified locations, and regenerates route shapes. Testing and documentation plans are included.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Generate Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-generate-routes__doc849.md>) — similar text 0.22 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:849 -->
- [Update Intersection Referent Tool User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-intersection-referent-tool-user-story__doc696.md>) — similar text 0.40 · same kind/surface/folder <!-- rel:696 -->
- [Support Snap to Vertex Option for Calibration Points Impacted by Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-to-vertex-option-for-calibration-points-impacted-by-cartographic__doc611.md>) — similar text 0.20 · 2 title words · same kind/surface/folder <!-- rel:611 -->
- [Routes with Less Than Two Calibration Points in Loops](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/routes-with-less-than-two-calibration-points-in-loops__doc764.md>) — similar text 0.14 · 4 title words · same surface <!-- rel:764 -->
- [Recalibrate Route When Moving Calibration Points in Feature Services](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/recalibrate-route-when-moving-calibration-points-in-feature-services__doc733.md>) — similar text 0.20 · 2 title words · same kind/surface/folder <!-- rel:733 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View LRS Network properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-network-properties.html)
<!-- docs:end -->

---

## Slide 1 — Add Intermediate Calibration Points to loops

User Story

## Slide 2 — User Story

As a LRS Editor, I want to ensure my routes created in ArcMap that have loop portions have the required number of calibration points, so that I can edit and maintain those routes in ArcGIS Pro.
Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  The routes that these users edit include those with complex shapes, such as loops, lollipops, alphas, and branches.  In ArcMap, loop and lollipop type routes were supported, however, there was no requirement for additional calibration points in the loop.  In Pro, these extra calibration points in the loop are expected; a tool needs to be built to add these calibration points when users migrate from ArcMap to Pro so they can edit and maintain these routes.

## Slide 3 — Add CPs to loop portion

Create a python script that users can execute against their LRS Network that does the following:

  - Identify any routes with loop portions
  - Determine if the loop portions of the routes have at least 2 calibration points within the loop portion
  - For any routes that don’t have at least 2 calibration points in the loop, add calibration points at the nearest vertex to 1/3rd and 2/3rd along the loop
  - Regenerate the shape of any routes with additional calibration points added
The parameters for the tool should be the following:

  - LRS Network fc (needs to be in a gdb with the LRS Controller Dataset present)
  - Calibration Point fc (from the same gdb at the LRS Network)
The tool should support only feature classes, not feature layers or layers from a service
The LRS gdb with the network and cps can be a file gdb, traditional versioned sde, or branch versioned sde
Note that alphas weren’t supported in ArcMap, but if we can detect and add the necessary CPs to other route shapes with loops, we should
Create a text file when the tool completes that lists the OIDs of the routes that had new calibration points added
Note this tool will be designed to be run after Modify LRS is run (LRS Controller Dataset is expected to be in place)
The tool won’t be included with ArcGIS Pro, but instead will be released independent of Pro to support users making the transition from ArcMap to Pro

## Slide 4 — Testing

Test with Roads and Highways data from ArcMap (no controller dataset, tool should fail) and from ArcGIS Pro (with controller dataset, tool should run)
Test on loop, lollipop, and alpha shapes types (note that loops and lollipops should have the CPs added, if we can add them for alphas and other loop shapes if possible)
Test with routes with loops that have additional CPs already present (tool should run, but nothing will update) and routes with loops that don’t have additional CPs present
Test with an LRS Network that doesn’t have any loops (tool should run, but nothing will update)

## Slide 5 — Documentation

Once PE complete, work with Nathan to document the tool and get it released publicly to users
The tool will also need to be included in the ArcMap to Pro migration document

## Slide 6 — Assignment

Story Points:
Dev:
PE:
