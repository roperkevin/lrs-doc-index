# Support Conflict Prevention on LRS Explode Operation

| Field | Value |
| --- | --- |
| **Doc** | 815 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Support Conflict Prevention on LRS Explode.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20Conflict%20Prevention%20on%20LRS%20Explode.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2020-04-30 22:54 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | conflict prevention · explode operation · centerlines · locking · lrs editing |
| **Tools** | LRS Explode · Realign Route |

## Summary

This document describes a user story for supporting conflict prevention in the LRS Explode operation to avoid edit conflicts on exploded centerlines. It outlines locking behavior patterns, integration with LRS editing activities like Create, Extend, Realign, Reassign, and Retire, and testing scenarios for REST and ArcGIS Pro. It also includes documentation requirements for the tool and REST operation.

## Related documents

<!-- related:begin -->
- [Support updating CL/CLS when using explode operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-cl-cls-when-using-explode-operation.md>) — similar text 0.35 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:829 s=6.492 -->
- [Support LRS Explode Operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-lrs-explode-operation.md>) — similar text 0.37 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:813 s=6.388 -->
- [Explode multipart centerlines in editing activities and Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/explode-multipart-centerlines-in-editing-activities.md>) — similar text 0.56 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:817 s=6.196 -->
- [Conflict Prevention: Acquire Locks when creating new routes in Create, Extend, Realign, and Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-acquire-locks-when-creating-new-routes.md>) — similar text 0.23 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:826 s=4.335 -->
- [Conflict Prevention Reassign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-reassign-route.md>) — similar text 0.20 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:559 s=4.286 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html) · [Release locks with the Release Locks tool](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/release-locks.html)

_No page matched:_ [LRS Explode](https://www.google.com/search?q=%22LRS%20Explode%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support LRS explode operation <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing user, I need conflict prevention to work with the LRS explode operation, so that any centerlines that are exploded don’t cause conflicts with other users making edits in the system.

## Acceptance Criteria
### Conflict Prevention in LRS Explode <!-- slide 3 -->
- In the LRS Explode tool, support Conflict Prevention if enabled on the data in the service
- If Conflict Prevention is enabled on the data in the service, follow the same pattern for locking as we do in Split Centerline (listed below)
- If C1 is split, then lock L_A and allow the edit to proceed
- If C2 is edited then lock L_A and L_B and allow the edit to proceed
- If C3 is edited, then lock L_B and allow the edit to proceed
- If C4 is edited then lock L_B and L_C and allow the edit to proceed
- If C5 is edited, then lock L_C and allow the edit to proceed
If C2 is split and a lock a cannot be acquired on either of L_A or L_B, then do not proceed with the edit and provide a message about the locks and revert the split

Split Locations
style.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibility
![Figure 1 — Conflict Prevention in LRS Explode](../media/support-conflict-prevention-on-lrs-explode-operation/fig-01-slide-03-conflict-prevention-in-lrs-explode.png)

![Figure 2 — Conflict Prevention in LRS Explode](../media/support-conflict-prevention-on-lrs-explode-operation/fig-02-slide-03-conflict-prevention-in-lrs-explode.svg)

### Exploding in LRS editing activities <!-- slide 4 -->
- Confirm that as part of the following LRS editing activities (Create, Extend, Realign, Reassign, Retire) that any multipart centerline is exploded as part of the operation
  - Realign Route already supports this; other network editing activities might as well
  - Follow the same pattern as in Realign Route for any editing activities that need this explode operation implemented
  - Document in the devtopia issue which tools already had this support and which had it implemented as part of this story

## Testing
<!-- slide 5 -->
- Verify in REST and Pro
- Negative
  - Conflict Prevention not enabled (ensure no regression)
- Positive
  - One centerline is exploded that isn’t locked
  - Multiple centerlines exploded that aren’t locked
- See previous conflict prevention test plans for other scenarios to test

## Documentation
### Doc <!-- slide 6 -->
- Create a help topic for the tool that discusses its usage
- Document the new REST operation within the existing REST help for linear referencing operations

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
