# Support Complex Route Shapes in Generate Events

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [ComplexRouteShapesGenerateEvents.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesGenerateEvents.pptx>) |
| **Edited** | 2019-12-06 17:20 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Complex Route Shapes in Generate Events"
source_file: "ComplexRouteShapesGenerateEvents.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesGenerateEvents.pptx"
doc_id: 848
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2019-12-06T17:20:32Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["complex route", "generate events", "euler algorithm", "calibration points", "loops", "lollipops", "alpha route", "branched route", "line network", "non line network"]
tools: ["Generate Events"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":849,"file":"support-complex-route-shapes-in-generate-routes__doc849.md","s":10.147},{"doc":844,"file":"support-complex-route-shapes-in-append-events__doc844.md","s":9.311},{"doc":872,"file":"support-complex-route-shapes-in-retire-route__doc872.md","s":8.792},{"doc":854,"file":"support-complex-route-shapes-in-realign-route__doc854.md","s":8.572},{"doc":855,"file":"support-complex-route-shapes-in-reassign-route__doc855.md","s":8.379}]
```
-->

## Summary

This user story describes the need for Roads and Highways users to generate or regenerate event shapes on complex routes such as loops, lollipops, alpha, and branched routes for analysis and reporting. The Generate Events geoprocessing tool uses the Euler algorithm to correctly locate events on complex routes, honoring splitting rules and considering Z values for self intersections. It supports various input types and both line and non-line networks, with error handling for calibration issues.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Generate Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-generate-routes__doc849.md>) — similar text 0.86 · 5 title words · 4 filename words · same kind/surface/folder <!-- rel:849 -->
- [Support Complex Route Shapes in Append Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-append-events__doc844.md>) — similar text 0.71 · 5 title words · 4 filename words · same kind/surface/folder <!-- rel:844 -->
- [Support Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-retire-route__doc872.md>) — similar text 0.62 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:872 -->
- [Support Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-realign-route__doc854.md>) — similar text 0.61 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:854 -->
- [Support Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-reassign-route__doc855.md>) — similar text 0.63 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:855 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Complex scenarios for route calibration](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-scenarios-for-route-calibration.html)

_No page matched:_ [Generate Events](https://www.google.com/search?q=%22Generate%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support Complex Route Shapes in Generate Events

User Story

## Slide 2 — User Story

As a Roads and Highways user, I need to be able to generate/regenerate event shapes location on complex route in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so the events can be used for analysis, reporting, and other needs.

## Slide 3 — Generate Events

Works with inputs as fgdb, direct connect (traditional or branch), and services
In the Generate Events GP tool, utilize the Euler algorithm as needed to ensure events that will be located on a complex route get the correct beginning/end points and the correct shape
Honor the existing rules for splitting events (split at gaps with measure difference greater than 0)
Should work for any complex route shape (see the sample shapes used in Generate Calibration Points story)
Consider Z values on the route to determine if there is a self intersection/closing
Works in both non line and line networks
Provide an error message if:

  - The complex route the event will be located on is not calibrated correctly
  - The complex route the event will be located on doesn’t have the required calibration points in the required locations

## Slide 4 — Testing

Positive (Generating Events on a)

  - Loop
  - Lollipop
  - Alpha
  - Branch
  - Barbell
  - Complex shape with gap
  - Non Line Network (focus on this)
  - Line Network (events spanning routes)
  - Caltrans
  - With/without Z values (only for considering self intersection)

Negative

  - Calibration points not in correct locations to calibrate complex shape
  - Underlying route not calibrated
Automation

  - Python (Add to the existing Generate Events automated tests)
  - Feature Services as input

## Slide 5 — Documentation

Add a usage note to the existing GP tool topic about support for generating events on complex route shapes

## Slide 6 — Assignment

Story Points:
Dev:
Test Plan PE:
