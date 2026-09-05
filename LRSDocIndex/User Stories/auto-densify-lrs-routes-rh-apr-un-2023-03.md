# Auto-Densify LRS Routes

| Field | Value |
| --- | --- |
| **Doc** | 575 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [DensifyLRSRoutes (1).pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/DensifyLRSRoutes%20(1).pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2023-03-21 01:58 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | densify · routes · lrs administrator · geodesic densify · vertex spacing |
| **Tools** | — |

## Summary

This document describes a user story for creating a Python tool with a UI to automatically densify LRS routes geodetically. The tool targets LRS administrators needing to reduce vertex spacing in routes to support LRS operations, working with both projected and unprojected datasets. It includes requirements for testing, automation, and documentation.

## Related documents

<!-- related:begin -->
- [Auto-Densify LRS Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-densify-lrs-routes-rh-apr-un-2023-05.md>) — similar text 0.97 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:570 s=8.501 -->
- [Append Routes Sparse Vertex Check User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/5058-append-routes-sparse-vertex-check.md>) — similar text 0.44 · 1 title word · same kind/surface/folder <!-- rel:536 s=4.499 -->
- [Identify Routes with Vertex Spacing Issues](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/identify-routes-with-vertex-spacing-issues.md>) — similar text 0.45 · 1 title word · same kind/surface/folder <!-- rel:591 s=4.343 -->
- [Migrate LRS to New GDB Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/migrate-lrs-to-new-gdb-tool.md>) — similar text 0.43 · same kind/surface/folder <!-- rel:569 s=3.558 -->
- [Migrate LRS to New Geodatabase Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/migrate-lrs-to-new-geodatabase-tool.md>) — similar text 0.43 · same kind/surface/folder <!-- rel:574 s=3.398 -->
<!-- related:end -->

---

## Story
### Auto-Densify LRS Routes <!-- slide 1 -->

### User Story <!-- slide 2 -->
As an LRS administrator, I need to be able to densify my LRS routes, so that I can ensure the vertices are close enough together to work with all LRS operations.

Persona
LRS Administrator: This user is responsible for the initial configuration and ongoing changes to the configuration of the LRS.  For pipeline operators with unprojected data with very large distances between vertices, some of our operations aren’t working as expected.  One of the solutions is to densify their LRS routes in an unprojected dataset to ensure that there is not too much space between each vertex on the route.  Users have been reluctant to do this on their own, so building a tool that does it for them would be a better solution.

## Acceptance Criteria
### Auto-Densify LRS Routes <!-- slide 3 -->
- Create a python tool (needs to have a UI interface) to support automatically geodetically densify LRS routes
- The tool should work with Pro 3.1, but will not be released with any Pro release
- Follow the pattern of the ArcMap to Pro migration tools (Github repo, etc.)
- The parameters for the tool UI would be:
  - LRS Network
  - Densification Distance
- The Densification Distance should default to whatever is suggested based on the Spatial Reference of the LRS Network, but the user can change it to a different value if they want
- When executed, the tool would do the following:
  - Find routes in the LRS Network that have vertices spaced further apart than the Densification Distance provided
  - Run the Geodesic Densify on those routes with the densification distance from the input
  - Use the output of the Geodesic Densify to replace the existing routes (and centerlines associated with those routes as well)
  - Regenerate any LRS Events that are impacted by the updated routes

## Testing
<!-- slide 4 -->
- Test on at least one RH, APR, and APR-UN dataset
- Test on 1 projected dataset and the remaining cases on unprojected datasets
- Test with a mix of fgdb and sde (traditional and branch versioned) as the input
- Test with a variety of distances (suggested and user defined)

## Automation
<!-- slide 5 -->
Automate this via python

## Documentation
<!-- slide 6 -->
- The tool will be released independently of Pro; however, we should still document it in the same format as other GP tools within Pro
- When the tool is released via GitHub, we should include this documentation with the tool on the site

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
