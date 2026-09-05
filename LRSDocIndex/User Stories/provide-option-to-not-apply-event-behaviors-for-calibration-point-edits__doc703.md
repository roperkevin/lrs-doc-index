# Provide option to not apply event behaviors for calibration point edits

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Source** | [Provide option for no event behaviors for calibration point edits.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Provide%20option%20for%20no%20event%20behaviors%20for%20calibration%20point%20edits.pptx>) |
| **Edited** | 2021-07-15 23:57 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Provide option to not apply event behaviors for calibration point edits"
source_file: "Provide option for no event behaviors for calibration point edits.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Provide%20option%20for%20no%20event%20behaviors%20for%20calibration%20point%20edits.pptx"
doc_id: 703
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2021-07-15T23:57:19Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["calibration point", "event behavior", "route recalibration", "manual edits", "location referencing", "edit log"]
tools: []
products: ["Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":728,"file":"support-reverse-route-event-behaviors__doc728.md","s":4.139},{"doc":760,"file":"support-event-behaviors-on-vertical-route-shapes-in-extend-route__doc760.md","s":4.038},{"doc":759,"file":"support-event-behaviors-on-vertical-route-shapes-in-calibrate-route__doc759.md","s":3.999},{"doc":611,"file":"support-snap-to-vertex-option-for-calibration-points-impacted-by-cartographic__doc611.md","s":3.96},{"doc":837,"file":"support-event-behaviors-on-complex-route-shapes-in-reassign-route__doc837.md","s":3.919}]
```
-->

## Summary

This user story describes adding an option in ArcGIS Pro to disable event behaviors when manual calibration point edits are made. The option allows LRS Editors to refine calibration on routes without triggering event behaviors, supporting workflows such as corrections after cartographic realignments. Testing includes various route shapes and data types, ensuring recalibration occurs without edit log records when the option is enabled.

## Related documents

<!-- related:begin -->
- [Support Reverse Route Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-event-behaviors__doc728.md>) — similar text 0.23 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:728 -->
- [Support Event Behaviors on Vertical Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-extend-route__doc760.md>) — similar text 0.16 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:760 -->
- [Support Event Behaviors on Vertical Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-calibrate-route__doc759.md>) — similar text 0.24 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:759 -->
- [Support Snap to Vertex Option for Calibration Points Impacted by Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-to-vertex-option-for-calibration-points-impacted-by-cartographic__doc611.md>) — similar text 0.33 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:611 -->
- [Support Event Behaviors on Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-reassign-route__doc837.md>) — similar text 0.18 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:837 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)

_No page matched:_ [calibration point layer](https://www.google.com/search?q=%22calibration%20point%20layer%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Provide option to not apply event behaviors for calibration point edits

User Story

## Slide 2 — User Story

As an LRS Editor, I want an option to not apply event behaviors for calibration point changes, so that I can refine calibration on a route without having event behaviors applied for those changes.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  At some DoTs, there is a need to move and edit calibration points after cartographic realignments or as part of the correct calibration of a route after loading/updates.  These users can use the core editing tools to add/edit/update calibration points in bulk, however, event behaviors are applied.  These users want the option to not have event behaviors applied when they make these types of edits as they consider them part of a correction workflow as opposed to the calibration changing from a previous view of the data.  Example states include Ohio and Colorado.

## Slide 3 — Do not apply event behavior for manual CP edits

Add a new option to the Location Referencing options (Advanced LRS options) in Pro called “Do not apply event behaviors for manual CP edits”
The option should be disabled by default
When enabled, do the following for any manual calibration point edits (i.e. edits completed using tools other than the Add, Edit, and Delete CP tools on the Location Referencing ribbon) such as adding a new CP using non LRS tools, moving an existing CP using non LRS tools, deleting an existing CP using non LRS tools, updating the measure/date attributes via the attribute table, bulk loading CPs using the core Append tool:

  - Recalibrate the Route(s) impacted
  - Do not write any records for the calibration into the Edit Log (so there will be no event behaviors)
  - Regenerate the event shapes for the routes impacted by the recalibration
Note that this option won’t be applied for any of the LRS editing activities or for requests made outside of Pro
Consider leveraging the approach used for the various CP options in Cartographic Realignment to determine whether the option is enabled/disabled
When disabled, calibrate the route and create calibration record(s) in the Edit Log for any manual calibration point edits (adding a new CP using non LRS tools, moving an existing CP using non LRS tools, deleting an existing CP using non LRS tools, updating the measure/date attributes via the attribute table, bulk loading CPs using the core Append tool) the same way we do today

## Slide 4 — Testing

Test on all route shapes (normal, gapped, complex, vertical)
Test on both Roads and Pipeline data (test at least one APR-UN scenario)
Test as part of a cartographic realignment with the ignore option for CPs
Test on individual CP edits as well as in bulk operations like Append
Verify the route is recalibrated and events have their shapes updated
Verify there is no edit log record written for calibration when the option is enabled

## Slide 5 — Automation

No automation

## Slide 6 — Documentation

Add a note about this option and how it would impact events to the calibration topic being created as part of the user story related to recalibrating a route when calibration points are moved/deleted using core tools
Do not add any note about this capability to the existing topics for add, edit, and delete CPs topics

## Slide 7 — Assignment

Story Points:
Dev:
PE:
