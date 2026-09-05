# Split Events Spanning Gap on Branched Routes

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [SplitEventsSpanningGaponBranchRoutes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SplitEventsSpanningGaponBranchRoutes.pptx>) |
| **Edited** | 2020-07-17 20:14 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Split Events Spanning Gap on Branched Routes"
source_file: "SplitEventsSpanningGaponBranchRoutes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SplitEventsSpanningGaponBranchRoutes.pptx"
doc_id: 781
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-07-17T20:14:56Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["branch route", "event splitting", "gap", "apply edits", "rest call", "road and highways", "pipeline line event"]
tools: []
products: ["Roads & Highways"]
issues: []
related: [{"doc":777,"file":"split-multi-part-events-spanning-gap-with-different-measures__doc777.md","s":7.893},{"doc":844,"file":"support-complex-route-shapes-in-append-events__doc844.md","s":3.633},{"doc":702,"file":"attribute-field-method-in-generate-calibration-points__doc702.md","s":3.155},{"doc":837,"file":"support-event-behaviors-on-complex-route-shapes-in-reassign-route__doc837.md","s":3.089},{"doc":269,"file":"add-line-event-length-method__doc269.md","s":3.015}]
```
-->

## Summary

Describes the need to split events that span gaps on branch routes to ensure correct event behaviors and operations in LRS software. Covers event loading, apply edits REST calls, and testing scenarios including Roads and Highways and Pipeline line events on line and non-line networks.

## Related documents

<!-- related:begin -->
- [Split Multi Part Events Spanning Gap with Different Measures](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/split-multi-part-events-spanning-gap-with-different-measures__doc777.md>) — similar text 0.50 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:777 -->
- [Support Complex Route Shapes in Append Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-append-events__doc844.md>) — similar text 0.21 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:844 -->
- [Attribute Field Method in Generate Calibration Points](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/attribute-field-method-in-generate-calibration-points__doc702.md>) — similar text 0.13 · same kind/surface/folder <!-- rel:702 -->
- [Support Event Behaviors on Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-reassign-route__doc837.md>) — similar text 0.25 · same kind/surface/folder <!-- rel:837 -->
- [Add Line Event Length Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-length-method__doc269.md>) — similar text 0.13 · same kind/surface/folder <!-- rel:269 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Methods for calibrating routes with physical gaps](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/methods-for-calibrating-routes-with-physical-gaps.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)

_No page matched:_ [apply edits](https://www.google.com/search?q=%22apply%20edits%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Split events spanning gap on branched routes

User Story

## Slide 2 — User Story

As an LRS data loader, I need events that span the gap on a branch route to be split at the gap, so that event behaviors and other LRS event operations are handled correctly throughout the software.

Cases
LRS data loader that appends events that span the gap on a branch route

## Slide 3 — Append Events

If an event that spans the gap on a branched route is included in the source event, split the event at the gap
If the event doesn’t span the gap, load it the same way it does today
If the From Measure of the event is on the gap measure, the event shape should begin on the downstream part of the gap
If the To Measure of the event is on the gap measures, the event shape should end on the upstream part of the gap

## Slide 4 — Apply Edits

If the REST call for Apply Edits creates a new event that spans the gap on a branch route, split the event at the gap
If the REST call for Apply Edits modifies an existing event so that is would now span a gap on a branch route, split the event at the gap
If the From Measure of the event is on the gap measure, the event shape should begin on the downstream part of the gap
If the To Measure of the event is on the gap measures, the event shape should end on the upstream part of the gap

## Slide 5 — Testing

Only on branch routes
Test with Roads and Highways and Pipeline line events
Test on line and non line networks
Test with events that do and do not span routes
Verify the correct Z value is populated onto events
Test cases where the From/To Measure for the event falls on the gap location

## Slide 6 — Documentation

Add this as a usage note for the GP tool documentation

## Slide 7 — Assignment

Story Points:
Dev:
PE:
