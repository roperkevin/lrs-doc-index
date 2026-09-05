# Split Events Spanning Gap on Branched Routes

| Field | Value |
| --- | --- |
| **Doc** | 781 · User Story · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [SplitEventsSpanningGaponBranchRoutes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SplitEventsSpanningGaponBranchRoutes.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-07-17 20:14 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | branch route · event splitting · gap · apply edits · rest call · road and highways · pipeline line event |
| **Tools** | — |

## Summary

Describes the need to split events that span gaps on branch routes to ensure correct event behaviors and operations in LRS software. Covers event loading, apply edits REST calls, and testing scenarios including Roads and Highways and Pipeline line events on line and non-line networks.

## Related documents

<!-- related:begin -->
- [Split Multi Part Events Spanning Gap with Different Measures](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/1452-split-multi-part-events-spanning-gap-with-different-measures.md>) — similar text 0.50 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:777 s=7.893 -->
- [Support Complex Route Shapes in Append Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-append-events.md>) — similar text 0.21 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:844 s=3.633 -->
- [Attribute Field Method in Generate Calibration Points](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/attribute-field-method-in-generate-cp.md>) — similar text 0.13 · same kind/surface/folder <!-- rel:702 s=3.155 -->
- [Support Event Behaviors on Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-reassign-route.md>) — similar text 0.25 · same kind/surface/folder <!-- rel:837 s=3.089 -->
- [Add Line Event Length Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-length-method.md>) — similar text 0.13 · same kind/surface/folder <!-- rel:269 s=3.015 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Methods for calibrating routes with physical gaps](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/methods-for-calibrating-routes-with-physical-gaps.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)

_No page matched:_ [apply edits](https://www.google.com/search?q=%22apply%20edits%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Split events spanning gap on branched routes <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS data loader, I need events that span the gap on a branch route to be split at the gap, so that event behaviors and other LRS event operations are handled correctly throughout the software.

Cases

- LRS data loader that appends events that span the gap on a branch route

## Acceptance Criteria
### Append Events <!-- slide 3 -->
- If an event that spans the gap on a branched route is included in the source event, split the event at the gap
- If the event doesn’t span the gap, load it the same way it does today
- If the From Measure of the event is on the gap measure, the event shape should begin on the downstream part of the gap
- If the To Measure of the event is on the gap measures, the event shape should end on the upstream part of the gap

### Apply Edits <!-- slide 4 -->
- If the REST call for Apply Edits creates a new event that spans the gap on a branch route, split the event at the gap
- If the REST call for Apply Edits modifies an existing event so that is would now span a gap on a branch route, split the event at the gap
- If the From Measure of the event is on the gap measure, the event shape should begin on the downstream part of the gap
- If the To Measure of the event is on the gap measures, the event shape should end on the upstream part of the gap

## Testing
<!-- slide 5 -->
- Only on branch routes
- Test with Roads and Highways and Pipeline line events
- Test on line and non line networks
- Test with events that do and do not span routes
- Verify the correct Z value is populated onto events
- Test cases where the From/To Measure for the event falls on the gap location

## Documentation
<!-- slide 6 -->
- Add this as a usage note for the GP tool documentation

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
