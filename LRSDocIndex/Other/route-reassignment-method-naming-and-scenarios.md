# Route Reassignment Method Naming and Scenarios

| Field | Value |
| --- | --- |
| **Doc** | 580 · Other · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [MethodNames.xlsx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/MethodNames.xlsx>) |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane workbookdump · format 3.0 · prompt v2.0.2 |
| **Keywords** | route reassignment · merge · transfer · method naming · line network · non line network · route scenarios |
| **Tools** | — |

## Summary

This document presents a comparison and discussion of method names for route reassignment operations within a linear referencing system. It includes scenarios involving merging, transferring, and forming new routes on the same or adjacent lines, with considerations for naming consistency and user interface clarity. The document also outlines scenarios to consider for method naming and summarizes conclusions on method categorization and naming preferences.

## Related documents

<!-- related:begin -->
- [Reassign UI Change to Dynamically Support Existing Reassign Methods - Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/reassign-ui-change-to-dynamically-support-existing-reassign.md>) — similar text 0.23 · same surface/folder <!-- rel:586 s=3.203 -->
- [Reassign Route AI Assistant Overview](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/reassign-route-ai-assistant-overview.md>) — similar text 0.10 · 1 title word · same kind/surface <!-- rel:35 s=3.186 -->
- [Support Reassign: Transfer as New Route(s) to Adjacent Line Method in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-transfer-as-new-route-s-to-adjacent-line.md>) — similar text 0.22 · 2 title words · same surface/folder <!-- rel:583 s=2.8 -->
- [Reassign Route Tool User Guide](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/reassign-route-tool-user-guide.md>) — similar text 0.16 · 1 title word · same kind/surface/folder <!-- rel:595 s=2.558 -->
- [Reassign Method Hovers User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/reassign-method-hovers.md>) — similar text 0.15 · 1 title word · same surface/folder <!-- rel:584 s=2.542 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html) · [Complex scenarios for route calibration](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/complex-scenarios-for-route-calibration.html)
<!-- docs:end -->

---

## Sheet: Sheet1
| Original | Ayan | Amit | Combo1 | Combo2 | Combo3 | Combo4 | Mac Lakshmi Johum like Reassign | Having merge/split in names can be confused with other tools |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line Network | 10 |  |  |  |  |  |  |  |
| Merge to existing route on the same line | Merge to adjacent route | Reassign to existing route on the same line | Merge to adjacent route | Merge route(s) to adjacent route | Reassign to adjacent route | Reassign route(s) to adjacent route | Rahul doesn't like to have Reassign to happen 7 times in all methods |  |
| Merge as a new route on the same line | Transfer as new route | Reassign as a new route on the same line | Form a new route | Form a new route | Reassign as a new route | Reassign as a new route |  |  |
| Merge to existing route on another line | Merge to adjacent line | Reassign to existing route on another line | Merge to route on adjacent line | Merge route(s) to route on adjacent line | Reassign to route on adjacent line | Reassign route(s) to route on adjacent line |  |  |
| Transfer as new route(s) on another line | Transfer to adjacent line | Reassign as new route(s) on another line | Transfer to adjacent line | Transfer route(s) to adjacent line | Reassign to adjacent line | Reassign route(s) to adjacent line |  |  |
| Transfer to a new line | Transfer to new line | Reassign to a new line | Transfer to new line | Transfer route(s) to new line | Reassign to new line | Reassign route(s) to new line |  |  |
| Non-line network |  |  |  |  |  |  |  |  |
| Merge to an existing route | Merge to adjacent route | Reassign to an existing route | Merge to adjacent route | Merge route to adjacent route | Reassign to adjacent route | Reassign route to adjacent route |  |  |
| Merge as a new route | Transfer as new route | Reassign as a new route | Form a new route | Form a new route | Reassign as a new route | Reassign as a new route |  |  |
|  |  |  |  |  |  |  |  |  |
| Note | Note | Note | Note | Note | Note | Note |  |  |
| the original names determined in Reassign UI mockups meeting | Ayan wants consistency in names, so that there are only Merge and Transfer | Amit wants the scenarios (split merge rename transfer) to colloquially be in the context of each unique interaction (maybe we can put in hover) but to always refer to the product capability/method as Reassign. Amit does not mention text length so I guess we can reduce length | “Form” includes split merge and rename. But Ayan dislikes adding this additional "form" other than  Merge and Transfer. | “Form” includes split merge and rename. Plus we indicate # of source route possible in method names. But Ayan dislikes adding this additional "form" other than  Merge and Transfer. | All methods start with Reassign and have reduced text length | All methods start with Reassign and include a bit more details about # of source route possible |  |  |
|  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |
| Scenarios to consider (to include in method name) |  |  |  |  |  |  |  |  |
| adjacent (existing) route/line; new route/line |  |  |  |  |  |  |  |  |
| merge/split/rename/transfer |  |  |  |  |  |  |  |  |
| partial route/single route/multiple routes |  |  |  |  |  |  |  |  |

## Sheet: Conclusion
| Source is 0.5 route | Source is 1 route | Source is 1.5 routes | Source is n routes | If 7 methods (5 for line) |  | 3 methods (line) | 2 methods for non-line |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Split and Form a new route on the same line | Form (Rename) a new route on the same line | Split R1 and Form (Merge) a new route on the same line | Form (Merge) a new route on the same line | Merge to adjacent route on the same line |  | Merge to adjacent route | Merge to adjacent route |
| Split and Transfer to a new line | Transfer to a new line with original Rid/name kept; can also have a new Rid/Name | Split R1 and Transfer to a new line with R2 keeping its original Rid/name kept; R2 can also have a new Rid/name | Transfer to a new line with original Rid/name kept; can also have a new Rid/Name | Merge to adjacent route on adjacent line |  | Form a new route | Form a new route |
| Split and Merge to adjacent route on the same line | Merge to adjacent route on the same line | Split R1 and Merge to adjacent route on the same line | Merge to adjacent route on the same line | Form a new route on the same line |  | Transfer to another line |  |
| Split and Merge to adjacent route on adjacent line | Merge to adjacent route on adjacent line | Split R1 and Merge to adjacent route on adjacent line | Merge to adjacent route on adjacent line | Transfer to adjacent line |  |  |  |
| Split and Transfer as a new route on adjacent line | Transfer as a new route on adjacent line with original Rid/name kept; can also have a new Rid/Name | Split R1 and Transfer as new routes on adjacent line with R2 keeping its original Rid/name kept; R2 can also have a new Rid/name | Transfer  as new routes on adjacent line with original Rid/name kept; can also have a new Rid/Name | Transfer to a new line |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  | 2 for non-line |  |  |  |
|  |  | 1 | Transfer should not be used in ambiguity. Transfer means the RID and Rname is transferred to another line. | Merge to adjacent route |  |  |  |
|  |  | 2 | Please confirm that the UI of the merged names are same. Please show the hover text in the UI slides. | Form a new route |  |  |  |
|  |  | 3 | Form is again a derivtaive of Create. Let's not use Form. |  |  |  |  |
|  |  | 4 | Overall there are 3 themes for target (don't consider source): Create New, Merge and Transfer. Can we try to reduce to these 3 methods. |  |  |  |  |
