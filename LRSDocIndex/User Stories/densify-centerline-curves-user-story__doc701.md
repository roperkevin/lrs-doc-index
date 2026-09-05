# Densify Centerline Curves User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Source** | [Densify centerline curves.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Densify%20centerline%20curves.pptx>) |
| **Edited** | 2021-07-15 23:49 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Densify Centerline Curves User Story"
source_file: "Densify centerline curves.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Densify%20centerline%20curves.pptx"
doc_id: 701
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2021-07-15T23:49:28Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["centerline", "curve", "densify", "polyline", "route editing", "arcgis pro"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":575,"file":"auto-densify-lrs-routes__doc575.md","s":3.328},{"doc":570,"file":"auto-densify-lrs-routes__doc570.md","s":3.313},{"doc":601,"file":"flip-centerline-tool-in-memory-flip-user-story__doc601.md","s":3.151},{"doc":485,"file":"lrs-in-gcs-in-memory-only-densification__doc485.md","s":3.012},{"doc":684,"file":"update-centerline-measures-when-splitting-un-pipelines__doc684.md","s":2.729}]
```
-->

## Summary

Describes the need for LRS editors to create centerlines as curve features in ArcGIS Pro, converting curves into densified polylines for linear referencing. Defines parameters for densification and outlines testing, automation, and documentation requirements.

## Related documents

<!-- related:begin -->
- [Auto-Densify LRS Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-densify-lrs-routes__doc575.md>) — similar text 0.20 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:575 -->
- [Auto-Densify LRS Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-densify-lrs-routes__doc570.md>) — similar text 0.19 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:570 -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/flip-centerline-tool-in-memory-flip-user-story__doc601.md>) — similar text 0.15 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:601 -->
- [LRS in GCS: In-memory only Densification](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-in-gcs-in-memory-only-densification__doc485.md>) — similar text 0.13 · 1 filename word · same kind/surface/folder <!-- rel:485 -->
- [Update centerline measures when splitting UN pipelines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-centerline-measures-when-splitting-un-pipelines__doc684.md>) — similar text 0.18 · 1 title word · same kind/surface/folder <!-- rel:684 -->
<!-- related:end -->

---

## Slide 1 — Densify centerline curves

User Story

## Slide 2 — User Story

As an LRS editor, I need the option to create centerlines as curve features, so that features that are best represented as curves can have routes/events created on them while still being linear referenced.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  A scenario that can occur in some DoTs is the newly created/updated routes include one or more curve features.  Users want to be able to use the editing tools in Pro to create the centerlines for these new routes as curves.  Curves can’t be stored a linear referenced features (there are only two vertexes for the beginning/end of the curve), so we need to convert these curves into densified polylines so measures can be interpolated and events can be located on the route.

## Slide 3 — Densify centerline curves

When a user creates a new/updates an existing centerline to include any of the supported curve geometry types (Arcs, Bezier, Tangent, Spiral) in Pro, convert the curve into a densified polyline

  - Note that Spiral curves may already do this conversion automatically
Add two options to LRS options in Pro under a section called “Parameters for densification of curves”

  - Max segment length – This is the maximum distance (in XY spatial reference unit of measures) between vertices in the densified polyline
  - Max deviation – This is the maximum distance (in XY spatial reference unit of measures) between the original location of the curve and the placement of each vertex on the densified polyline
  - Note that we shouldn’t create polylines that violate basic geometry rules (like vertices within tolerance, etc.)
Use these parameters to determine how to densify the centerline
Continue to prevent use of centerlines as curve features in any of the route editing tools
Note this will just be applied to Pro, not REST

## Slide 4 — Testing

Test on the various types of curve features supported by ArcGIS Pro
Test on centerline features that are partial polyline and partial curve
Test on both Roads and Pipeline data (test at least one APR-UN scenario)

## Slide 5 — Automation

Create UI test automation for these curve scenarios

## Slide 6 — Documentation

Create a topic called Curves in Roads and Highways (in the Centerline editing section) that documents that centerlines created/edited as curves in Pro will become densified polylines.

Update the screenshot in https://pro.arcgis.com/en/pro-app/latest/help/production/roads-highways/set-location-referencing-options.htm to incorporate these new options

## Slide 7 — Assignment

Story Points:
Dev:
PE:
