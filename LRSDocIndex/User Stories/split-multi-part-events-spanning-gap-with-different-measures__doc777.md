# Split Multi Part Events Spanning Gap with Different Measures

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Issue** | [ArcGISPro/ps-location-referencing#1452](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/1452) |
| **Source** | [SplitMultiPartEventsSpanningNonZeroGap.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SplitMultiPartEventsSpanningNonZeroGap.pptx>) |
| **Edited** | 2020-07-21 16:26 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Split Multi Part Events Spanning Gap with Different Measures"
source_file: "SplitMultiPartEventsSpanningNonZeroGap.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SplitMultiPartEventsSpanningNonZeroGap.pptx"
doc_id: 777
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-07-21T16:26:39Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["multipart event", "gap spanning", "branch route", "event splitting", "append events", "apply edits", "z value"]
tools: ["Append Events", "Apply Edits"]
products: ["Roads & Highways"]
issues: ["ArcGISPro/ps-location-referencing#1452"]
related: [{"doc":781,"file":"split-events-spanning-gap-on-branched-routes__doc781.md","s":7.893},{"doc":844,"file":"support-complex-route-shapes-in-append-events__doc844.md","s":3.738},{"doc":836,"file":"support-event-behaviors-on-complex-route-shapes-in-realign-route__doc836.md","s":2.693},{"doc":837,"file":"support-event-behaviors-on-complex-route-shapes-in-reassign-route__doc837.md","s":2.672},{"doc":839,"file":"support-event-behaviors-on-complex-route-shapes-in-extend-route__doc839.md","s":2.669}]
```
-->

## Summary

Describes the need for splitting multipart events that span gaps on branch routes to ensure correct event behavior in LRS operations. Details conditions for keeping or splitting multipart events during Append Events and Apply Edits operations. Includes testing focus on branch routes with Roads and Highways and Pipeline line events, and documentation update instructions.

## Related documents

<!-- related:begin -->
- [Split Events Spanning Gap on Branched Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/split-events-spanning-gap-on-branched-routes__doc781.md>) — similar text 0.50 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:781 -->
- [Support Complex Route Shapes in Append Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-append-events__doc844.md>) — similar text 0.21 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:844 -->
- [Support Event Behaviors on Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-realign-route__doc836.md>) — similar text 0.21 · same kind/surface/folder <!-- rel:836 -->
- [Support Event Behaviors on Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-reassign-route__doc837.md>) — similar text 0.20 · same kind/surface/folder <!-- rel:837 -->
- [Support Event Behaviors on Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-extend-route__doc839.md>) — similar text 0.20 · same kind/surface/folder <!-- rel:839 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com) · [Apply Edits](https://www.google.com/search?q=%22Apply%20Edits%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Split multi part events spanning gap with different measures

User Story

## Slide 2 — User Story

As an LRS data loader, I need events that span the gap on a branch route to be split at the gap, so that event behaviors and other LRS event operations are handled correctly throughout the software.

Cases
LRS data loader that appends events that span the gap on a branch route

## Slide 3 — Append Events

If an event that is being appended using Append Events is multipart, compare the XYZM of the beginning/end of each part

  - If the XYZM of each part is the same, keep the event multipart
  - If the XYZ of each part is different, but the Ms are the same, keep the event multipart
  - If the XYZM of each part is different, split the event
Note that this will impact how events are located on branch routes across their imaginary edges as well as for events spanning a physically gapped route
If the From Measure of the event is on the gap measure, the event shape should begin on the downstream part of the gap
If the To Measure of the event is on the gap measures, the event shape should end on the upstream part of the gap

## Slide 4 — Apply Edits

If an event that is being added/modified using Apply Edits is multipart, compare the XYZM of the beginning/end of each part

  - If the XYZM of each part is the same, keep the event multipart
  - If the XYZ of each part is different, but the Ms are the same, keep the event multipart
  - If the XYZM of each part is different, split the event
If the From Measure of the event is on the gap measure, the event shape should begin on the downstream part of the gap
If the To Measure of the event is on the gap measures, the event shape should end on the upstream part of the gap

## Slide 5 — Testing

Focus on branch routes
Test with Roads and Highways and Pipeline line events
Test on line and non line networks
Test with events that do and do not span routes, both point and line
Verify the correct Z value is populated onto events
Test cases where the From/To Measure for the event falls on the gap location
Rerun Append Events on the data from the splitting events spanning a non zero difference gap story to verify no regression for gaps (https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/1452, Lakshmi has the test plan and data)

## Slide 6 — Documentation

Add this as a usage note for the GP tool documentation

## Slide 7 — Assignment

Story Points:
Dev:
PE:
