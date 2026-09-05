# Support Reassign: Transfer as New Route(s) to Adjacent Line Method in ArcGIS Pro

| Field | Value |
| --- | --- |
| **Doc** | 583 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [ReassignUI_TransferToAdjacentLine.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ReassignUI_TransferToAdjacentLine.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2023-04-05 23:24 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | route reassignment · line network · route id · route name · calibration points · partial route · entire route · route attributes · adjacent line · transfer routes |
| **Tools** | Route Eyedropper · Reassign Tool |

## Summary

This document describes a user story and detailed workflow for reassigning routes in a line network to an adjacent line in ArcGIS Pro while maintaining original RouteID and Route Name combinations. It covers the tool pane interface, reassignment rules, calibration point transfer options, and testing scenarios including use of the Route Eyedropper tool. The document also outlines automation and documentation tasks related to this reassignment method.

## Related documents

<!-- related:begin -->
- [Support Reassign: Transfer to a New Line Method in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-transfer-to-a-new-line-method-in-pro.md>) — similar text 0.88 · 6 title words · 3 filename words · same kind/surface/folder <!-- rel:585 s=11.901 -->
- [Reassign Route Transfer to Another Line Method: Support Move Event Behavior Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5141-reassign-route-transfer-to-another-line-method-support-move.md>) — similar text 0.23 · 6 title words · 2 filename words · same surface <!-- rel:533 s=5.487 -->
- [Reassign UI Change to Dynamically Support Existing Reassign Methods - Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/reassign-ui-change-to-dynamically-support-existing-reassign.md>) — similar text 0.50 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:586 s=5.412 -->
- [Reassign to a New or Existing Line with Original Route ID/Name Maintained on the Target Line - REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/565-reassign-to-a-new-or-existing-line-with-original-route-id.md>) — similar text 0.50 · 3 title words · 1 filename word · same kind/folder <!-- rel:594 s=5.199 -->
- [Reassign to a new or existing line with original Route ID/Name maintained on the target line - REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/reassign-to-a-new-or-existing-line-with-original-route-id.md>) — similar text 0.50 · 3 title words · 1 filename word · same kind/folder <!-- rel:607 s=5.195 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reassign-routes.html)

_No page matched:_ [Route Eyedropper](https://www.google.com/search?q=%22Route%20Eyedropper%22+site%3Adoc.esri.com) · [Reassign Tool](https://www.google.com/search?q=%22Reassign%20Tool%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support Reassign: Transfer as new route(s) to adjacent line Method in Pro <!-- slide 1 -->
User Story

### User Story <!-- slide 3 -->
As a pipeline editor, I need the ability to reassign routes in a line network to another existing line with original RouteID-Route Name combo maintained, so that I can maintain the original attribution for the route as well as the updated version after reassignment.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents. Pipeline companies use the line as an administrative unit for a group of pipes that are under the same administrator/operator. A pipe needs to be moved to a different line from time to time due to a variety of factors including ownership change, jurisdiction boundary change, other classification change, or more accurate analysis and management.  In these scenarios, the RouteID-Route Name combo would stay the same, only the line name would change.

## Acceptance Criteria
### Transfer to adjacent line Context <!-- slide 2 -->
| Line Name | Route Name | Line Order | From Date | ToDate | FromM | ToM |
| --- | --- | --- | --- | --- | --- | --- |
| L1 | R1 | 100 | 1/1/2000 | null | 7 | 10 |
| L1 | R2 | 200 | 1/1/2000 | null | 0 | 70 |
| L2 | A | 100 | 1/1/2000 | null | 0 | 15 |

| Line Name | Route Name | Line Order | From Date | ToDate | FromM | ToM |
| --- | --- | --- | --- | --- | --- | --- |
| L1 | R1 | 100 | 1/1/2000 | 1/1/2005 | 7 | 10 |
| L1 | R2 | 200 | 1/1/2000 | 1/1/2005 | 0 | 70 |
| L2 | A | 100 | 1/1/2000 | 1/1/2005 | 0 | 15 |
| L1 | R1 | 100 | 1/1/2005 | null | 7 | 9.1 |
| L2 | R1_reassign | 100 | 1/1/2005 | null | 9.1 | 10 |
| L2 | R2 | 200 | 1/1/2005 | null | 0 | 70 |
| L2 | A | 300 | 1/1/2005 | null | 0 | 15 |

[figure: R1 · R2 · A · 7 · 9 · 10 · 0 · 44 · 66 · 70 · 15 · L1 · L2 · 100 · 200 · 9.1 · R1_reassign · 300]

![Figure 1 — Transfer to adjacent line Context](../media/support-reassign-transfer-as-new-route-s-to-adjacent-line/fig-01-slide-02-transfer-to-adjacent-line-context.svg)

### Reassign Methods in Pro – Tool pane <!-- slide 4 -->
- Transfer to another line is added to the method dropdown
- This is a method for Line network only
- It must support reassigning: a partial route, a single entire route, multiple entire routes, any combination of entire routes and up to two partial routes, and an entire line
- Provide a hover for this method in the dropdown that when users hover over a method name, the hover shows additional text and graphics to illustrate the method (Dev and PE design the text and graphics)
Once this method is chosen, Target section changes to show a Line name box and a line picker only
The target line name can be a non-existing line name in all time or an adjacent line. For this user story, line name should be an existing and adjacent line
Allow original Route ID/Name combination to exist on different lines in non-overlapping time slices using the new capability in REST

  - Unlike existing Reassign methods, routes are never merged as a result of reassignment in this method
- The retired time slice for source route(s) should have the to date populated but have no other line information changed. If route id and name are maintained, when the user queries the route, they should find the route existed on two different lines but not at the same time.
- If Transfer Calibration Points is checked, all calibration points are transferred to target routes. If not, only the first and last calibration points for each route are transferred (for complex shapes, follow the same requirement of keeping calibration points), and calibration points other than the required calibration points are deleted.
*Event behavior is a separate user story

Tree diagram and graphics are attached at the end.

![Figure 2 — Reassign Methods in Pro – Tool pane](../media/support-reassign-transfer-as-new-route-s-to-adjacent-line/fig-02-slide-04-reassign-methods-in-pro-tool-pane.png)
![Figure 3 — Reassign Methods in Pro – Tool pane](../media/support-reassign-transfer-as-new-route-s-to-adjacent-line/fig-03-slide-04-reassign-methods-in-pro-tool-pane.png)

### Reassign Methods in Pro – Tool pane <!-- slide 5 -->
- The 3rd pane has 2 tables for target route(s):
  - The first table contains the most important information regarding the reassigned routes: route name, from measure, and to measure.
    - routes are never merged in this method
    - By default, all entire routes being reassigned keep their original route name and route id; all partial routes get a “_reassign” attached to original route name and a new route id
    - All routes’ From measure defaults to 0 and To measure is calculated from 0
    - Route name, from measure, and to measure are editable for all target routes
  - The second table contains extra attributes for the routes and user can choose to edit the editable fields.
    - Target line name shows up in this table but it is not editable (grey out/disable)
    - By default, all these attributes inherit source route attributes.
  - If there are 1+ target routes, switch buttons appear above the tables for users to switch target routes, and an “Apply values to all routes” checkbox is added below the table (mimic realign). Checking this box will apply all Non-LRS attributes in the second table to all target routes
    - If this box is checked, all other routes will get the same attributes from the current table
    - Changing any attribute value for one route while this box is check will change the attributes for all other routes
    - If some routes must have different attributes, user has to uncheck this box after using this checkbox to apply uniform attributes, and manually adds/edits/deletes these particular attributes
- Tool pane shows a scrollbar when contents exceed pane length
- Make sure reassignment results are correct in terms of route attributes, line orders, and measures.
- Add a note in the 2nd pane below the retirement table: The route(s) will be retired on source line and transferred to target line without being merged.

![Figure 4 — Reassign Methods in Pro – Tool pane](../media/support-reassign-transfer-as-new-route-s-to-adjacent-line/fig-04-slide-05-reassign-methods-in-pro-tool-pane.png)

<!-- slide 6 -->
Transfer as new route(s) to adjacent line
Apply values to all routes

![Figure 5 — Transfer as new route(s) to adjacent line](../media/support-reassign-transfer-as-new-route-s-to-adjacent-line/fig-05-slide-06-transfer-as-new-route-s-to-adjacent-line.png)
![Figure 6 — Transfer as new route(s) to adjacent line](../media/support-reassign-transfer-as-new-route-s-to-adjacent-line/fig-06-slide-06-transfer-as-new-route-s-to-adjacent-line.png)
![Figure 7 — Transfer as new route(s) to adjacent line](../media/support-reassign-transfer-as-new-route-s-to-adjacent-line/fig-07-slide-06-transfer-as-new-route-s-to-adjacent-line.png)

## Testing
<!-- slide 7 -->
- Test on APR data with Feature Services (do 1-2 tests on fgdb/dc sde)
- Test in both projected and unprojected data
- Test PoM
- Test associated options (when applicable: transfer calibration points; recalibrate source route; change target route name; change target route measures)
- Test on a variety of route geometries (simple, gapped, loop, lollipop, alpha, branch, vertical)
- Test with partial routes, entire routes, and combinations
- Test routes that cover beginning-end, beginning-middle, and middle-end of a line
- Verify LRS attributes are not editable in the 2nd table in the 3rd pane. The unavailability is indicated (e.g. fields gray out)
- Verify Non-LRS attributes are editable in the 3rd pane, if there is any, and these attributes are applied to target route(s)’ new time slice
Negative cases – also validate error messages

- non-adjacent existing line name is tested in another user story
- For entire route, if user provides Route Name that belongs to other route than source route, return error
  - Whether time slices overlap or not does not matter. If route name of another existing route (not retired) is put in, it will error out because a route can’t stay on multiple lines at the same time. If a retired route name is put it, even though time slices don’t overlap, it will still error out because it’s a “reassignment to retired route” case, which is not allowed.
  - In a word, target route name must be source route name or brand new route name.
- For partial route, if user provides any existing Route Name, return error
- If user provides invalid measures in the 3rd pane (refer to existing requirements on measures) to any route, return error and indicate erroneous route(s)
- If user puts in a target line that can create “route-in-route” scenario for non-PoM, return error
- the target line must touch the immediate upstream or downstream (gap) of source route. If not, return error

![Figure 8 — Testing](../media/support-reassign-transfer-as-new-route-s-to-adjacent-line/fig-08-slide-07-testing.jpg)

## Automation
<!-- slide 9 -->
- Create UI automation

## Documentation
<!-- slide 10 -->
Add new sections to APR and RH. The structure should align with existing Reassign methods (existing methods also need to be updated and this is covered in a separate user story)

  - Document the flow, associate options, and expected results for this method. E.g. What method and options lead to routes being kept intact vs. routes being merged
  - Add tool UI screenshots
  - Mention hover

## Assignment
<!-- slide 11 -->
Story Points:
Dev:
PE:

## Other content
### Testing – Route Eyedropper tool <!-- slide 8 -->
- Test in Feature Service only.
- Test in APR
- Test in either projected or unprojected data
- Verify the Eyedropper tool appears in the 3rd pane. Refer to Eyedropper Tool for Routes User story and mimic a few cases from the Test Plan
  - Eyedropper tool only appears/enables when 1. a partial route is reassigned because the target partial route has to have a non-existing routeID/name and 2. user changes the default original route name to a new, valid route name for entire route (dev determines if eyedropper pops up in this case or enables from a greyed-out state). If user changes the new route name back to original route name, eyedropper tool disappears/disables.
  - Eyedropper and Copy all values checkbox can overwrite each other. The one comes last wins.
- Test with a network that contains non-LRS attributes with subtypes, coded value domains, range domains and contingent values
- Test with a network that contains non-LRS attributes with attribute rules – calculation , constraint and validation

### Notes

Projected and unprojected?

### Transfer to another line <!-- slide 12 -->
Transfer CP
Yes
No
No Recal Target Routes Option
- Method still have Recalibrate Source Routes Downstream Option
- Regardless of Rname/Lname being editable/edited or not, users can change target route’s non-LRS attributes. Changes are made to target route's new time slice only.
Rname (so as Rid) are kept intact in most cases
Rname (so as Rid) can be changed when users choose to

Only end CPs are transferred
Rname (so as Rid) are kept intact in most cases
Rname (so as Rid) can be changed when users choose to

Both intermediate and end CPs are transferred

![Figure 9 — Transfer to another line](../media/support-reassign-transfer-as-new-route-s-to-adjacent-line/fig-09-slide-12-transfer-to-another-line.svg)

<!-- slide 13 -->
|  | Recal Target | Trans CP | Result | Before | After |
| --- | --- | --- | --- | --- | --- |
| Transfer to another line (when an existing adjacent line name is entered) | N/A (parameter does no matter to results) | Yes | Do not merge . Rid and Rname kept intact (can be changed in attribute table). All CPs are transferred. |  |  |
|  | N/A (parameter does no matter to results) | No | Do not merge . Rid and Rname kept intact (can be changed in attribute table). Only required CPs are transferred. |  |  |

Transfer to adjacent line

[figure: 7 · R1 · R2 · A · 9 · 10 · 0 · 44 · 66 · 70 · 15 · 9.1 · R1_reassign · L1 · L2]

![Figure 10 — 13](../media/support-reassign-transfer-as-new-route-s-to-adjacent-line/fig-10-slide-13-13.png)

![Figure 11 — 13](../media/support-reassign-transfer-as-new-route-s-to-adjacent-line/fig-11-slide-13-13.svg)
