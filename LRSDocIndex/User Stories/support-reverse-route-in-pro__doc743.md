# Support Reverse Route in Pro

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Source** | [SupportReverseRoutePro.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportReverseRoutePro.pptx>) |
| **Edited** | 2020-12-16 16:53 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Reverse Route in Pro"
source_file: "SupportReverseRoutePro.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportReverseRoutePro.pptx"
doc_id: 743
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-12-16T16:53:54Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["reverse route", "route calibration", "route editing", "lrs editor", "route direction", "event behavior"]
tools: ["Reverse Route"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":739,"file":"support-reverse-route-event-behaviors__doc739.md","s":7.33},{"doc":728,"file":"support-reverse-route-event-behaviors__doc728.md","s":6.89},{"doc":742,"file":"support-reverse-route-in-rest__doc742.md","s":6.095},{"doc":109,"file":"pro-ai-assistant-reverse-route-user-story__doc109.md","s":4.801},{"doc":576,"file":"reverse-line-orders-tool__doc576.md","s":3.686}]
```
-->

## Summary

This document describes a user story for adding a Reverse Route capability to the LRS editing activities in ArcGIS Pro. It details the need for reversing route calibration direction to align with design and engineering documents, the inputs required, and the expected behavior of the tool. Testing, automation, and documentation plans are also outlined.

## Related documents

<!-- related:begin -->
- [Support Reverse Route Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-event-behaviors__doc739.md>) — similar text 0.63 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:739 -->
- [Support Reverse Route Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-event-behaviors__doc728.md>) — similar text 0.61 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:728 -->
- [Support Reverse Route in REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-in-rest__doc742.md>) — similar text 0.62 · 3 title words · 3 filename words · same kind/folder <!-- rel:742 -->
- [Pro AI Assistant Reverse Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-reverse-route-user-story__doc109.md>) — similar text 0.19 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:109 -->
- [Reverse Line Orders tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/reverse-line-orders-tool__doc576.md>) — similar text 0.31 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:576 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Reverse routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reverse-routes.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html)
<!-- docs:end -->

---

## Slide 1 — Support Reverse Route in Pro

User Story

## Slide 2 — User Story

As an LRS editor, I need to be able to reverse routes, so that the direction of calibration for the routes matches what is expected from design and engineering documents within the GIS.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these document.  A scenario that can occur is that the calibration direction of a route in the LRS is in the wrong direction.  Sometimes the route was calibrated incorrectly when added to the LRS and other times another edit that needs to be made in the LRS, like a realignment, requires the route calibration direction to be reversed.  When this occurs, the user will need to be able to reverse the route direction followed by having event behaviors applied to the route.

## Slide 3 — Reverse Route Pro

Add Reverse Route to the editing activities on the LRS ribbon in Pro
Work with graphics to create an icon
The inputs for Reverse Route are as follows:

  - Network (only show those coming from LR/VMS enabled services; if there are none, then leave the drop down either empty or greyed out)
  - Effective Date
  - (From) Route ID
  - To Route ID (should on appear if the network selected supports lines)
When a route is reversed, we should do the following:

  - Send the request via Reverse Route in LRS Apply Edits
  - Update the map via the result of the operation executing successfully
  - Follow the same pattern we do for the other LRS editing activities in Pro
Use the ArcMap Reverse Route as a guide

![image1.png](../media/doc175_image1.png)

## Slide 4 — Testing

Test in both line and non line networks (projected and unprojected data)
Test with both Roads and Highways (focus on this) and Pipeline Referencing data (with the UN)
Should work on the following route shapes: simple, gapped, complex (loop, lollipop, alpha, branch, barbell), vertical
Use the same data and test cases as the Reverse Route REST user story

## Slide 5 — Automation

Create automation via TestComplete for the Reverse Route UI in Pro

## Slide 6 — Documentation

Reverse Route doc should be created from the Reverse Route REST user story

## Slide 7 — Assignment

Story Points:
Dev:
PE:
