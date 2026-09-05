# Identify Routes with Vertex Spacing Issues

| Field | Value |
| --- | --- |
| **Doc** | 591 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [IdentifyRouteswithVertexSpacingIssues.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/IdentifyRouteswithVertexSpacingIssues.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2023-03-20 20:32 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | vertex spacing · routes · python tool · unprojected data · tolerance · feature class |
| **Tools** | — |

## Summary

This document describes a user story for creating a Python tool with a UI to identify routes with vertex spacing issues in unprojected data within the LRS. The tool will analyze route segments for vertex spacing too wide for spatial reference tolerances and output feature classes and summary tables for LRS administrators to address. Testing and documentation plans are also outlined.

## Related documents

<!-- related:begin -->
- [Identify Routes with Vertex Spacing Issues – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/identify-routes-with-vertex-spacing-issues.md>) — similar text 0.28 · 5 title words · 4 filename words · same surface <!-- rel:571 s=6.065 -->
- [Append Routes Sparse Vertex Check User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/5058-append-routes-sparse-vertex-check.md>) — similar text 0.44 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:536 s=4.86 -->
- [Auto-Densify LRS Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-densify-lrs-routes-rh-apr-un-2023-03.md>) — similar text 0.45 · 1 title word · same kind/surface/folder <!-- rel:575 s=4.343 -->
- [Auto-Densify LRS Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-densify-lrs-routes-rh-apr-un-2023-05.md>) — similar text 0.45 · 1 title word · same kind/surface/folder <!-- rel:570 s=4.331 -->
- [Migrate LRS to New Geodatabase Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/migrate-lrs-to-new-geodatabase-tool.md>) — similar text 0.43 · same kind/surface/folder <!-- rel:574 s=4.136 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Tolerance and resolution settings for the LRS](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/tolerance-and-resolution-settings-for-the-lrs.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)
<!-- docs:end -->

---

## Story
### Identify Routes with Vertex Spacing Issues <!-- slide 1 -->

### User Story <!-- slide 2 -->
As an LRS administrator, I need to be able to identify routes with vertex spacing issues, so I can modify those routes, so they work as expected within the LRS.

Persona
LRS Administrator: This user is responsible for the initial configuration and ongoing changes to the configuration of the LRS.  For pipeline operators with unprojected data with very large distances between vertices, some of our operations aren’t working as expected.  To assist these users with determining how widespread this vertex spacing issue is in their data, we need to build a python tool that will identify these routes and provide a useable output for the LRS admin to act on to fix the problem routes (either via densification or changing the tolerance/resolution for the LRS).

## Acceptance Criteria
### Identify Routes with Vertex Spacing Issues <!-- slide 3 -->
- Create a python tool (needs to have a UI interface) to support identifying routes that have vertex spacing issues
- The tool should work with Pro 3.1, but will not be released with any Pro release
- Follow the pattern of the ArcMap to Pro migration tools (Github repo, etc.)
- The parameters for the tool UI would be:
  - Input Routes (can either be an LRS Network or source routes, but must be a feature class)
- When executed, the tool would do the following:
  - Iterate through the input routes feature class and find all route segments that have vertex spacing too wide for the spatial reference/tolerance/resolution
  - Determine which of these segments would also be too sparse at the following tolerance values: 1cm, 2cm, 3cm, and 10cm
- The output from the tool would be:
  - A feature class which contains a record for each route with at least one segment with vertices that are too sparse (if a route has more than one segment, show a record for each segment that is too spaced) along with the attributes from the original feature
  - A text file (or table) which lists the number and percentage of routes with at least one segment that is too spaced apart at each of the tolerances listed above (1cm, 2cm, 3cm, and 10cm)
- The tool shouldn’t execute if the input routes feature class is projected as this tool should only run against unprojected data

## Testing
<!-- slide 4 -->
- Test on at least one RH, APR, and APR-UN dataset
- Test on 1 projected dataset (should fail) and the remaining cases on unprojected datasets
- Test with a mix of fgdb and sde (traditional and branch versioned) for the source route
- Test with a mix of LRS Network fc as the input as well as non LRS Network fc as the input

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
