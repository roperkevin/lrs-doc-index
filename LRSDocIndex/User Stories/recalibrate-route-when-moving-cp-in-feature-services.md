# Recalibrate Route When Moving Calibration Points in Feature Services

| Field | Value |
| --- | --- |
| **Doc** | 733 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [RecalibrateRoutewhenMovingCPs.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RecalibrateRoutewhenMovingCPs.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-02-11 23:48 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | calibration point · route recalibration · feature service editing · edit log · non monotonic route · conflict prevention · core editing tools |
| **Tools** | Apply Edits |

## Summary

Describes a user story for LRS editors to update route measures automatically when moving calibration points using core editing tools in feature services. Covers workflows to simplify calibration point relocation, including handling non-monotonic routes and conflict prevention. Includes testing scenarios, automation plans, and documentation updates.

## Related documents

<!-- related:begin -->
- [Provide option to not apply event behaviors for calibration point edits](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/provide-option-to-not-apply-eb-for-cp-edits.md>) — similar text 0.40 · 1 title word · same kind/surface/folder <!-- rel:703 s=3.776 -->
- [Support Snap, Delete, and Ignore Options for Calibration Points in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-delete-and-ignore-options-for-cp.md>) — similar text 0.38 · 2 title words · same kind/surface/folder <!-- rel:729 s=3.592 -->
- [Support Snap to Vertex Option for Calibration Points Impacted by Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-to-vertex-option-for-cp-impacted.md>) — similar text 0.31 · 2 title words · same kind/surface/folder <!-- rel:611 s=3.4 -->
- [Support updating measures option in cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-measures-option-in-cartographic-realignment.md>) — similar text 0.29 · same kind/surface/folder <!-- rel:736 s=2.722 -->
- [Conflict Prevention for Event Editing in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-for-event-editing-in-pro.md>) — similar text 0.23 · same kind/surface/folder <!-- rel:683 s=2.652 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/edit-feature-services.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html)

_No page matched:_ [Apply Edits](https://www.google.com/search?q=%22Apply%20Edits%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Recalibrate route when moving CPs (in Feature Services) <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS editor, I need to have routes get measures updated when I move a calibration point, so that I can move calibration points with the correct measures to the correct location when they were initially mis-located.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  One workflow they need support for is when a calibration point has the correct measure but is at the wrong location.  The current workflow to support this would be delete the existing CP and create a new one at the correct location.  This workflow can be simplified by being able to listen to when a CP is moved using core editing tools and apply the calibration changes to the routes/events as if they were using the LRS calibration point editing tools.  An additional workflow this will support is for DoTs that don’t like the current options we provide for CPs that are impacted by a cartographic realignment (Colorado and Ohio are good examples).  In this case, the best option is to leave the calibration points where they are and let the user move them to the desired location after the cartographic realignment is complete.  Leaving the CPs alone in this scenario is coming in a separate user story.

## Acceptance Criteria
### Recalibrate route when CPs are moved <!-- slide 3 -->
- This is for feature service editing only
- When a user uses the core editing tools (via core applyEdits) to move a Calibration Point, we should capture this edit (using the controller dataset) and treat it the same way as if a user had added/updated/deleted a CP using our CP tools in Pro/LRS applyEdits.
  - Recalibrate the impacted route
  - Add a calibrate record(s) to the edit log
- If multiple calibration points are moved in a single edit, capture each CP change individually and recalibrate the route/write edit log records between each CP being processed
- If the CP change would result in a non-monotonic route, reverse/disallow the move and give the user the LRS error we have in place about creating a non-monotonic route (do this in the Pro UI and REST if possible)
- If conflict prevention is enabled, we should be enforcing locking the same way we would for Add/Edit/Delete CP tools

## Testing
<!-- slide 4 -->
- Test moving calibration points in both line and non line networks (projected and unprojected data)
- Test with both Roads and Highways and Pipeline Referencing data
- Test with and without conflict prevention
- Should work on the following route shapes: simple, gapped, complex (loop, lollipop, alpha, branch, barbell), vertical
- Make sure to have a scenario where a non-monotonic route would result
- Test with changes in X, Y, and Z
- Verify calibrate route record is added to the edit log
- Run Apply Event Behaviors for one test case to make sure they still process correctly
- Test only for REST, no need to worry about direct connect

## Automation
<!-- slide 5 -->
Create automation in both ReadyAPI (REST) and WinAppDriver (UI) for these scenarios.  Majority of tests cases should be captured in ReadyAPI.  Limit WinAppDriver to 5 tests or less.
Consider using fiddler or some other web traffic monitoring app to capture the applyEdits call for the calibration point move to simplify the automation effort in ReadyAPI

## Documentation
<!-- slide 6 -->
In the calibration point editing section of the doc (both RH and APR), add a new topic called moving calibration points.  Document support for this workflow in this new topic.  Follow the existing Add, Edit, Delete CP topics in format as much as possible.

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
