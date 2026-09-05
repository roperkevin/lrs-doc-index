# Densify Centerline Curves User Story

| Field | Value |
| --- | --- |
| **Doc** | 701 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [Densify centerline curves.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Densify%20centerline%20curves.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-07-15 23:49 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | centerline · curve · densify · polyline · route editing · arcgis pro |
| **Tools** | — |

## Summary

Describes the need for LRS editors to create centerlines as curve features in ArcGIS Pro, converting curves into densified polylines for linear referencing. Defines parameters for densification and outlines testing, automation, and documentation requirements.

## Related documents

<!-- related:begin -->
- [Auto-Densify LRS Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-densify-lrs-routes-rh-apr-un-2023-03.md>) — similar text 0.20 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:575 s=3.328 -->
- [Auto-Densify LRS Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-densify-lrs-routes-rh-apr-un-2023-05.md>) — similar text 0.19 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:570 s=3.313 -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/4613-flip-centerline-tool-in-memory-flip-rh-apr-un-2023-03.md>) — similar text 0.15 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:601 s=3.151 -->
- [LRS in GCS: In-memory only Densification](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/5415-lrs-in-gcs-in-memory-only-densification.md>) — similar text 0.13 · 1 filename word · same kind/surface/folder <!-- rel:485 s=3.012 -->
- [Update centerline measures when splitting UN pipelines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-centerline-measures-when-splitting-un-pipelines.md>) — similar text 0.18 · 1 title word · same kind/surface/folder <!-- rel:684 s=2.729 -->
<!-- related:end -->

---

## Story
### Densify centerline curves <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS editor, I need the option to create centerlines as curve features, so that features that are best represented as curves can have routes/events created on them while still being linear referenced.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  A scenario that can occur in some DoTs is the newly created/updated routes include one or more curve features.  Users want to be able to use the editing tools in Pro to create the centerlines for these new routes as curves.  Curves can’t be stored a linear referenced features (there are only two vertexes for the beginning/end of the curve), so we need to convert these curves into densified polylines so measures can be interpolated and events can be located on the route.

## Acceptance Criteria
### Densify centerline curves <!-- slide 3 -->
- When a user creates a new/updates an existing centerline to include any of the supported curve geometry types (Arcs, Bezier, Tangent, Spiral) in Pro, convert the curve into a densified polyline
  - Note that Spiral curves may already do this conversion automatically
- Add two options to LRS options in Pro under a section called “Parameters for densification of curves”
  - Max segment length – This is the maximum distance (in XY spatial reference unit of measures) between vertices in the densified polyline
  - Max deviation – This is the maximum distance (in XY spatial reference unit of measures) between the original location of the curve and the placement of each vertex on the densified polyline
  - Note that we shouldn’t create polylines that violate basic geometry rules (like vertices within tolerance, etc.)
- Use these parameters to determine how to densify the centerline
- Continue to prevent use of centerlines as curve features in any of the route editing tools
- Note this will just be applied to Pro, not REST

## Testing
<!-- slide 4 -->
- Test on the various types of curve features supported by ArcGIS Pro
- Test on centerline features that are partial polyline and partial curve
- Test on both Roads and Pipeline data (test at least one APR-UN scenario)

## Automation
<!-- slide 5 -->
Create UI test automation for these curve scenarios

## Documentation
<!-- slide 6 -->
Create a topic called Curves in Roads and Highways (in the Centerline editing section) that documents that centerlines created/edited as curves in Pro will become densified polylines.

Update the screenshot in https://pro.arcgis.com/en/pro-app/latest/help/production/roads-highways/set-location-referencing-options.htm to incorporate these new options

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
