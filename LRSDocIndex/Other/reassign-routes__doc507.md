# Reassign Routes

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Source** | [Reassign_routes_Roads_trackChanges.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5420_ReassignRoutesRH/Reassign_routes_Roads_trackChanges.docx>) |
| **Edited** | 2023-09-05 23:40 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Reassign Routes"
source_file: "Reassign_routes_Roads_trackChanges.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5420_ReassignRoutesRH/Reassign_routes_Roads_trackChanges.docx"
doc_id: 507
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Rahul Rakshit"
last_edited_by: "Rahul Rakshit"
last_edited: "2023-09-05T23:40:00Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["route reassignment", "reassign route tool", "route merging", "route splitting", "route renaming", "calibration points", "downstream recalibration", "line network", "complex route shapes", "route transfer", "route attributes"]
tools: ["Reassign Route", "Rename", "Choose route from map", "Recalculate From Measure", "Recalculate To Measure"]
products: ["Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":508,"file":"reassign-routes__doc508.md","s":10.129},{"doc":894,"file":"reassigning-a-route__doc894.md","s":3.96},{"doc":523,"file":"event-behavior-for-route-reassignment-form-a-new-route-method__doc523.md","s":3.255},{"doc":119,"file":"realign-routes__doc119.md","s":3.157},{"doc":585,"file":"support-reassign-transfer-to-a-new-line-method-in-arcgis-pro__doc585.md","s":3.134}]
```
-->

## Summary

This document explains the Reassign Route tool used to move or reassign all or part of a route to another route or line, including scenarios such as merging, splitting, renaming routes, transferring calibration points, and downstream recalibration. It covers complex route shapes and line network operations, details parameters and attributes involved, and provides step-by-step instructions for performing route reassignment in ArcGIS Pro.

## Related documents

<!-- related:begin -->
- [Reassign Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/reassign-routes__doc508.md>) — similar text 0.91 · 2 title words · 4 filename words · same kind/surface <!-- rel:508 -->
- [Reassigning a Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/reassigning-a-route__doc894.md>) — similar text 0.48 · 1 filename word · same kind/surface <!-- rel:894 -->
- [Event Behavior for Route Reassignment – Form a New Route Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/event-behavior-for-route-reassignment-form-a-new-route-method__doc523.md>) — similar text 0.24 · 1 filename word · same kind/surface <!-- rel:523 -->
- [Realign Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/realign-routes__doc119.md>) — similar text 0.41 · 1 title word · 1 filename word · same kind/surface <!-- rel:119 -->
- [Support Reassign: Transfer to a New Line Method in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-transfer-to-a-new-line-method-in-arcgis-pro__doc585.md>) — similar text 0.24 · 1 title word · 1 filename word · same surface <!-- rel:585 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Rename a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/rename-a-route.html) · [Reassign by merging to an adjacent route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-by-merging-to-an-adjacent-route.html)

_No page matched:_ [Choose route from map](https://www.google.com/search?q=%22Choose%20route%20from%20map%22+site%3Adoc.esri.com) · [Recalculate From Measure](https://www.google.com/search?q=%22Recalculate%20From%20Measure%22+site%3Adoc.esri.com) · [Recalculate To Measure](https://www.google.com/search?q=%22Recalculate%20To%20Measure%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Reassign routes
Reassignment is the technique by which all or a portion of a route or line is moved, or reassigned, to the immediate upstream or downstream of another route or line. Another example is to redesignate a portion of a road that now falls on the other side of a boundary after administrative boundaries change.
In addition to route reassignment, the Reassign Route tool can update attribute fields and calibration points located along the reassigned route.
Scenarios that can be accomplished using the reassign activity are described below.
Note:
In the following scenarios, you can choose entire routes or partial routes:

### Merging routes to an existing route

RouteX and RouteY are adjoining routes. You can use the Reassign Route tool to merge RouteX with RouteY or vice versa. The existing RouteX and RouteY are retired. You can merge the reassigned portion to any immediate upstream or downstream route.

Before reassignment table:

| Source |  |
| --- | --- |

| Route ID | RouteX From Date | To Date |
| --- | --- | --- |
| From Measure RouteX | 0 1/1/2005 | <Null> |
| To Measure RouteY | 20 1/1/2005 | <Null> |

| Target |  |
| --- | --- |

Here are the inputs used for the Reassign Route tool.

| Method | Merge to adjacent route |  |  |
| --- | --- | --- | --- |
| Source |  |  |  |
| Route ID | RouteX |  |  |
| From Measure | 0 |  |  |
| To Measure | 20 |  |  |
| Target |  |  |  |
| Route ID |  | RouteY |  |
| From Measure |  | 0 |  |
| To Measure |  | 30 |  |

After reassignment table:

| Route ID | From Date | To Date |
| --- | --- | --- |
| RouteX | 1/1/2005 | 1/1/2010 |
| RouteY | 1/1/2005 | 1/1/2010 |
| RouteY | 1/1/2010 | <Null> |

### Splitting an existing route
Route XYZ has measures from 0 to 30. In the following example, the route is split in two: Route1 (which is a new route) and a new version of RouteXYZ. The existing RouteXYZ is retired as a result of this operation.

Before reassignment table:

| Route ID Source |  |  | From Date |  | To Date |  |
| --- | --- | --- | --- | --- | --- | --- |
| RouteXYZ | 1/1/2005 | <Null> |  |  |  |  |

Here are the inputs used for the Reassign Route tool.

| Method | Form a new route |  |  |
| --- | --- | --- | --- |
| Source |  |  |  |
| Route ID |  | RouteXYZ |  |
| From Measure |  | 0 |  |
| To Measure |  | 19 |  |
| Target |  |  |  |
| Route ID |  | Route1 (new) |  |
| From Measure |  | 0 |  |
| To Measure |  | 19 |  |

After reassignment table:

| Route ID | From Date | To Date |
| --- | --- | --- |
| RouteXYZ | 1/1/2005 | 1/1/2010 |
| RouteXYZ | 1/1/2010 | <Null> |
| Route1 | 1/1/2010 | <Null> |

### Renaming a route
You can rename an existing route and change its From and To measure values using the Reassign Route tool. RouteXYZ is renamed Route123, with new measures. The existing RouteXYZ is retired as a result of this operation.

Note:
If all route records across all time slices need to be renamed without generating any additional time slices, use the Rename tool.

Before reassignment table:

| Source Route ID |  |  | From Date | To Date |  |
| --- | --- | --- | --- | --- | --- |
| RouteXYZ | 1/1/2005 | <Null> |  |  |  |

Here are the inputs used for the Reassign Route tool.

| Method | Form a new route |  |  |
| --- | --- | --- | --- |
| Source |  |  |  |
| Route ID |  | RouteXYZ |  |
| From Measure |  | 0 |  |
| To Measure |  | 30 |  |
| Target |  |  |  |
| Route |  | Route123 |  |
| From Measure |  | 15 |  |
| To Measure |  | 45 |  |

After reassignment table:

| Route ID | From Date | To Date |
| --- | --- | --- |
| RouteXYZ | 1/1/2005 | 1/1/2010 |
| Route123 | 1/1/2010 | <Null> |

### Transferring calibration points to a target route
You can transfer calibration points to a target route on networks that have a user-created Route ID.
Note:
The option to transfer calibration points to a target route during reassignment is checked by default and is the preferred method to maintain established measures.

Before reassignment table:

| Route ID Source |  |  | From Date | To Date |  |
| --- | --- | --- | --- | --- | --- |
| RouteX | 1/1/2005 | <Null> |  |  |  |
| RouteY | 1/1/2005 | <Null> |  |  |  |

Here are the inputs used for the Reassign Route tool.

| Method | Merge to adjacent route |  |  |
| --- | --- | --- | --- |
| Source |  |  |  |
| Route ID |  | RouteX |  |
| From Measure |  | 0 |  |
| To Measure |  | 20 |  |
| Target |  |  |  |
| Route |  | RouteY |  |
| From Measure |  | 0 |  |
| To Measure |  | 30 |  |

After reassignment table:

| Route ID | From Date | To Date |
| --- | --- | --- |
| RouteX | 1/1/2005 | 1/1/2010 |
| RouteY | 1/1/2005 | 1/1/2010 |
| RouteY | 1/1/2010 | <Null> |

### Downstream recalibration
The examples below describe recalibrating downstream. You can reassign routes with the source route calibrated or not calibrated downstream.

#### Reassignment with the source route not calibrated downstream

RouteX is split into two routes: RouteX and Route1, which begins at the start of the old RouteX and ends at the middle of the old RouteX. The to measure value of the newly created Route1 has been changed to 3 instead of the suggested measure of 5. Since the Recalibrate route downstream check box is unchecked for the source route, the downstream route's (RouteX) measures remain intact.

Before reassignment table:

| Source Route ID |  |  |  |  | From Date | To Date |
| --- | --- | --- | --- | --- | --- | --- |
| RouteX | 1/1/2005 | <Null> |  |  |  |  |
| RouteY | 1/1/2005 | <Null> |  |  |  |  |

Here are the inputs used for the Reassign Route tool.

| Method | Form a new route |  |  |
| --- | --- | --- | --- |
| Source |  |  |  |
| From Route |  |  | RouteX |
| From Measure |  |  | 0 |
| To Route (option only for networks with lines) |  |  | RouteX |
| To Measure |  |  | 5 |
| Target |  |  |  |
| Route |  |  | Route1 (new) |
| From Measure |  |  | 0 |
| To Measure |  |  | 3 |

After reassignment table:

| Route ID | From Date | To Date |
| --- | --- | --- |
| RouteX | 1/1/2005 | 1/1/2010 |
| RouteY | 1/1/2005 | 1/1/2010 |
| RouteX | 1/1/2010 | <Null> |
| RouteY | 1/1/2010 | <Null> |
| Route1 | 1/1/2010 | <Null> |

#### Reassignment with the source route calibrated downstream
RouteX is split into two routes: RouteX and Route1, which starts at the beginning of the old RouteX and ends at the middle of the old RouteX. The to measure value of the newly created Route1 has been changed to 3 instead of the suggested measure of 5. If the Recalibrate route downstream check box is checked for the source route, the downstream route's (RouteX) measures change to the from measure value of 0 and to measure value of 5.

Before reassignment table:

| Source Route ID |  |  |  |  | From Date | To Date |
| --- | --- | --- | --- | --- | --- | --- |
| RouteX | 1/1/2005 | <Null> |  |  |  |  |
| RouteY | 1/1/2005 | <Null> |  |  |  |  |

Here are the inputs used for the Reassign Route tool.

| Method | Form a new route |  |  |
| --- | --- | --- | --- |
| Source |  |  |  |
| From Route |  |  | RouteX |
| From Measure |  |  | 0 |
| To Route (option only for networks with lines) |  |  | RouteX |
| To Measure |  |  | 5 |
| Target |  |  |  |
| Route |  |  | Route1 (new) |
| From Measure |  |  | 0 |
| To Measure |  |  | 3 |

After reassignment table:

| Route ID | From Date | To Date |
| --- | --- | --- |
| RouteX | 1/1/2005 | 1/1/2010 |
| RouteY | 1/1/2005 | 1/1/2010 |
| RouteX | 1/1/2010 | <Null> |
| RouteY | 1/1/2010 | <Null> |
| Route1 | 1/1/2010 | <Null> |

#### Reassignment with the target route calibrated downstream
A part of RouteX is merged with the adjoining route, RouteY. The reassignment takes place from the middle of RouteX on the downstream side. Since the Recalibrate route downstream check box is checked for the target route, the measure of RouteY downstream of the reassigned portion is recalibrated. The new version of RouteY now has a to measure value of 9.

Before reassignment table:

| Source Route ID |  |  | From Date | To Date |  |
| --- | --- | --- | --- | --- | --- |
| RouteX | 1/1/2005 | <Null> |  |  |  |
| RouteY | 1/1/2005 | <Null> |  |  |  |

Here are the inputs used for the Reassign Route tool.

| Method | Merge to adjacent route |  |  |
| --- | --- | --- | --- |
| Source |  |  |  |
| From Route |  | RouteX |  |
| From Measure |  | 5 |  |
| To Measure |  | 10 |  |
| Target |  |  |  |
| Route |  | RouteY |  |
| From Measure |  | 0 |  |
| To Measure |  | 9 |  |

After reassignment table:

| RouteX | 1/1/2005 | 1/1/2010 |
| --- | --- | --- |
| RouteY | 1/1/2005 | 1/1/2010 |
| RouteX | 1/1/2010 | <Null> |
| RouteY | 1/1/2010 | <Null> |

### Complex route reassignment scenarios
Complex route reassignment scenarios for complex routes and shapes, including loop, lollipop, branch, and barbell shapes are described below.

#### Reassignment resulting in a loop
In the following example, RouteX and RouteY are merged to create a loop route after reassignment. RouteX has measures 0 to 2 and RouteY has measures 2 to 4:

Here are the inputs used for the Reassign Route tool.

| Method | Merge to adjacent route |  |  |
| --- | --- | --- | --- |
| Source |  |  |  |
| From Route |  | RouteX |  |
| From Measure |  | 0 |  |
| To Measure |  | 2 |  |
| Recalibrate source route |  | No |  |
| Target |  |  |  |
| To Route |  | RouteY |  |
| From Measure |  | 0 |  |
| To Measure |  | 2 |  |
| Recalibrate target route |  | No |  |

After reassignment, a calibration point is added at measure 1, and RouteY is recalibrated with measures 0 to 4.

#### Splitting an existing loop
In the following example, RouteX, on a loop with measures 0 to 12, is split and the edit section is reassigned to a new route (RouteY):

Here are the inputs used for the Reassign Route tool.

| Method |  | Form a new route |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| Source |  |  |  |  |  |  |
| From Route |  | RouteX |  |  |  |  |
| From Measure |  | 0 |  |  |  |  |
| To Measure |  | 4 |  |  |  |  |
| Recalibrate source route |  | Yes |  |  |  |  |
| Target |  |  |  |  |  |  |
| To Route |  | RouteY |  |  |  |  |
| From Measure |  | 0 |  |  |  |  |
| To Measure |  | 4 |  |  |  |  |
| Recalibrate target route | No |  |  |  |  |  |

After reassignment, RouteY is created with measures 0 to 4. The calibration point formerly at 8 is updated to 4, and RouteX is recalibrated with measures 0 to 8.

#### Reassignment resulting in a lollipop
RouteX has measures 0 to 4 and RouteY has measures 0 to 1. In the following example, a loop route (RouteX) is merged with a simple route (RouteY) to create a lollipop route after reassignment:

Here are the inputs used for the Reassign Route tool.

| Method | Merge to adjacent route |  |  |
| --- | --- | --- | --- |
| Source |  |  |  |
| From Route |  | RouteX |  |
| From Measure |  | 0 |  |
| To Measure |  | 4 |  |
| Recalibrate source route |  | No |  |
| Target |  |  |  |
| To Route |  | RouteY |  |
| From Measure |  | 1 |  |
| To Measure |  | 5 |  |
| Recalibrate target route |  | Yes |  |

After reassignment, the resulting lollipop route (RouteY) has updated measures 0 to 5.

#### Splitting an existing lollipop
RouteX has measures 0 to 5 and RouteY has measures 0 to 1. In the following example, the stick portion of a lollipop route (RouteX) is split and reassigned to an existing route (RouteY):

Here are the inputs used for the Reassign Route tool.

| Method | Merge to adjacent route |  |  |
| --- | --- | --- | --- |
| Source |  |  |  |
| From Route |  | RouteX |  |
| From Measure |  | 0 |  |
| To Measure |  | 1 |  |
| Recalibrate source route |  | Yes |  |
| Target |  |  |  |
| To Route |  | RouteY |  |
| From Measure |  | 0 |  |
| To Measure |  | 1 |  |
| Recalibrate target route |  | Yes |  |

After reassignment, both routes are recalibrated. The updated simple route (RouteY) has measures 0 to 2, and the loop route (RouteX) has measures 0 to 4.

RouteX has measures 0 to 15. In the following example, part of a lollipop route (RouteX) is split and reassigned to a new route (RNew):

| Source |  |
| --- | --- |
| From Route | RouteX |
| From Measure | 4 |
| To Measure | 8 |
| Recalibrate source route | Yes |
| Target |  |
| To Route | RNew |

| From Measure |  |  | 0 |  |
| --- | --- | --- | --- | --- |
| To Measure | 4 |  |  |  |
| Recalibrate target route | No |  |  |  |

After reassignment, a simple route (RNew) created from the edit section has measures 0 to 4, and the branch route (RouteX) has measures 0 to 12.

#### Merging multiple routes to create a barbell
In the following example, a loop route (RouteX) with measures 0 to 4 is merged with a lollipop route (RouteY) that has measures from 0 to 5:

Here are the inputs used for the Reassign Route tool.

| Method | Merge to adjacent route |  |  |
| --- | --- | --- | --- |
| Source |  |  |  |
| From Route |  | RouteX |  |
| From Measure |  | 0 |  |
| To Measure |  | 4 |  |
| Recalibrate source route |  | No |  |
| Target |  |  |  |
| Target Route |  | RouteY |  |
| From Measure |  | 5 |  |
| To Measure |  | 9 |  |
| Recalibrate target route |  | Yes |  |

After reassignment, a new barbell route (RouteY) is created from the merged routes. RouteY has recalibrated measures from 0 to 9.

#### Merging simple routes to create a branch
In this example, a simple route (RouteY) is merged to another simple route (RouteX) to create a branch route after reassignment. RouteX has measures 0 to 6, while RouteY has measures from 5 to 10.

Here are the inputs used for the Reassign Route tool.

| Method | Merge to adjacent route |
| --- | --- |
| Source |  |
| From Route | RouteY |
| From Measure | 5 |
| To Measure | 10 |
| Recalibrate source route | No |
| Target |  |
| To Route | RouteX |
| From Measure | 6 |
| To Measure | 11 |
| Recalibrate target route | Yes |

After reassignment, RouteY is merged with RouteX to create a branch route with recalibrated measures 0 to 11.

#### Splitting an infinity route
In the following example, an existing infinity route (RouteX) with measures 0 to 24 is split to create an alpha route and a new simple route (RNew):

Here are the inputs used for the Reassign Route tool.

| Method | Form a new route |  |  |
| --- | --- | --- | --- |
| Source |  |  |  |
| From Route |  | RouteX |  |
| From Measure |  | 18 |  |
| To Measure |  | 24 |  |
| Recalibrate source route |  | Yes |  |
| Target |  |  |  |
| To Route |  | RNew |  |
| From Measure |  | 0 |  |
| To Measure |  | 6 |  |
| Recalibrate target route | No |  |  |

After reassignment, RouteX is an alpha route with measures 0 to 18, and RNew has measures 0 to 6.

### Reassign routes in a line network
Routes in a line network can be reassigned to new or existing routes as shown in the following examples.

### Merging multiple routes to a new route

RouteX, RouteY, and RouteZ are consecutive routes that belong to the same line Line1. You can use the Reassign Route tool to merge all of them together into a new route, RouteXYZ, that belongs to the same line.  The date of reassignment is 1/1/2010.
Before reassignment table:

| Route Name | Line Name | From Date | To Date | Line Order |
| --- | --- | --- | --- | --- |
| RouteX | Line1 | 1/1/2005 | <Null> | 100 |
| RouteY | Line1 | 1/1/2005 | <Null> | 200 |
| RouteZ | Line1 | 1/1/2005 | <Null> | 300 |

Here are the inputs used for the Reassign Route tool.

| Method | Form a new Route |  |  |
| --- | --- | --- | --- |
| Source |  |  |  |
| From Route | RouteX |  |  |
| From Measure | 10 |  |  |
| To Route | RouteZ |  |  |
| To Measure | 60 |  |  |
| Target |  |  |  |
| Route | RouteXYZ |  |  |
| From Measure |  |  | 0 |

| To Measure | 30 |
| --- | --- |

RouteXYZ gets the line order of 100. RouteX, RouteY, and RouteZ get retired as a result of this operation. You can choose new start and end measure values for RouteXYZ.
After reassignment table:

| Route Name | Line Name | From Date | To Date | Line Order |
| --- | --- | --- | --- | --- |
| RouteX | Line1 | 1/1/2005 | 1/1/2010 | 100 |
| RouteY | Line1 | 1/1/2005 | 1/1/2010 | 200 |
| RouteZ | Line1 | 1/1/2005 | 1/1/2010 | 300 |
| RouteXYZ | Line1 | 1/1/2010 | <Null> | 100 |

Note:

- Both the From Route and the To Route from Source can be partially reassigned.
- Line orders of the remaining routes in the source line may be recalculated as a result.

### Merging routes to an existing route

RouteX and RouteY are consecutive routes that belong to the same line Line1. You can use the Reassign Route tool to merge them together to an existing route RouteZ, which belongs to an adjoining line Line2. The date of reassignment is 1/1/2010.
Before reassignment table:

| Route Name | Line Name | From Date | To Date | Line Order |
| --- | --- | --- | --- | --- |
| RouteX | Line1 | 1/1/2005 | <Null> | 100 |
| RouteY | Line1 | 1/1/2005 | <Null> | 200 |
| RouteZ | Line2 | 1/1/2005 | <Null> | 100 |

Here are the inputs used for the Reassign Route tool.

| Method | Merge to adjacent route |
| --- | --- |
| Source |  |
| From Route | RouteX |
| From Measure | 10 |
| To Route | RouteY |
| To Measure | 40 |
| Target |  |
| Route | RouteZ |
| From Measure | 0 |
| To Measure | 20 |

 The target is recalibrated downstream.
RouteX, RouteY, and RouteZ get retired because of this operation. In this case, the reassign portion is from the start of RouteX to the end of RouteY.
After reassignment table:

| Route Name | Line Name | From Date | To Date | Line Order |
| --- | --- | --- | --- | --- |
| RouteX | Line1 | 1/1/2005 | 1/1/2010 | 100 |
| RouteY | Line1 | 1/1/2005 | 1/1/2010 | 200 |
| RouteZ | Line2 | 1/1/2005 | 1/1/2010 | 100 |
| RouteZ | Line2 | 1/1/2010 | <Null> | 100 |

Note:

- Any one of the From Route and the To Route from Source can be partially reassigned to any immediate upstream or downstream route.
- Line orders of the remaining routes in the source line may be recalculated as a result.
- Routes from one line can be merged to an adjoining route in another line. Either one of the Source From or To routes of one line should be touching either start or end of the target route in another line.
- Routes from a line can be merged to an existing adjoining route in the same line.

### Splitting Routes

RouteZ has measures from 40 to 60. As shown in this example, you can split the route into two: RouteY, which is a new route, and a new version of RouteZ.

Before reassignment table:

| Route Name | Line Name | From Date | To Date | Line Order |
| --- | --- | --- | --- | --- |
| RouteX | Line1 | 1/1/2005 | <Null> | 100 |
| RouteZ | Line1 | 1/1/2005 | <Null> | 200 |

Here are the inputs used for the Reassign Route tool.

| Method | Form a new route |
| --- | --- |
| Source |  |
| From Route | RouteZ |
| From Measure | 40 |
| To Route | RouteZ |
| To Measure | 50 |
| Target |  |
| Route | RouteY |
| From Measure | 30 |
| To Measure | 40 |

The source is not recalibrated downstream.
The existing RouteZ retires as a result of this operation. RouteY gets the line order of RouteZ, and the new version of RouteZ gets the next line order value.
After reassignment table:

| Route Name | Line Name | From Date | To Date | Line Order |
| --- | --- | --- | --- | --- |
| RouteX | Line1 | 1/1/2005 | <Null> | 100 |
| RouteZ | Line1 | 1/1/2005 | 1/1/2010 | 200 |
| RouteY | Line1 | 1/1/2010 | <Null> | 200 |
| RouteZ | Line1 | 1/1/2010 | <Null> | 300 |

Note:

- Choose the same From and To source route to split a single route.
- Line orders of the remaining routes in the source line may be recalculated as a result.

### Splitting and Merging Routes

RouteY has measures from 30 to 40. As shown in this example, you can split the route and then merge one of the parts to the adjoining route RouteZ.
Before reassignment table:

| Route Name | Line Name | From Date | To Date | Line Order |
| --- | --- | --- | --- | --- |
| RouteX | Line1 | 1/1/2005 | <Null> | 100 |
| RouteY | Line1 | 1/1/2005 | <Null> | 200 |
| RouteZ | Line1 | 1/1/2005 | <Null> | 300 |

Here are the inputs used for the Reassign Route tool.

| Method | Merge to adjacent route |
| --- | --- |
| Source |  |
| From Route | RouteY |
| From Measure | 35 |
| To Route | RouteY |
| To Measure | 40 |
| Target |  |
| Route | RouteZ |
| From Measure | 45 |
| To Measure | 50 |

The existing RouteY and RouteZ retire because of this operation. The new version of RouteY gets the same line order as the previous one. The other splitted part of RouteY gets merged to RouteZ.
After reassignment table:

| RouteX | Line1 | 1/1/2005 | <Null> | 100 |
| --- | --- | --- | --- | --- |
| RouteY | Line1 | 1/1/2005 | 1/1/2010 | 200 |
| RouteZ | Line1 | 1/1/2005 | 1/1/2010 | 300 |
| RouteY | Line1 | 1/1/2010 | <Null> | 200 |
| RouteZ | Line1 | 1/1/2010 | <Null> | 300 |

### Renaming a route

You can rename an existing route and change its start and end measure values with the help of the Reassign Route tool. RouteX is renamed to RouteX_New and with new measures. The line order remains the same. The existing RouteX retires because of this operation.

Before reassignment table:

| Route Name | Line Name | From Date | To Date | Line Order |
| --- | --- | --- | --- | --- |
| RouteX | Line1 | 1/1/2005 | <Null> | 100 |

Note:
If all route records across all time slices need to be renamed without generating any additional time slices, use the  https://pro.arcgis.com/en/pro-app/3.1/help/production/location-referencing-pipelines/rename-a-route.htm  \h Rename tool.

Here are the inputs used for the Reassign Route tool.

| Method | Form a new route |
| --- | --- |
| Source |  |
| From Route | RouteX |
| From Measure | 10 |
| To Route | RouteX |
| To Measure | 20 |
| Target |  |
| Route | RouteX_New |
| From Measure | 10.1 |
| To Measure | 20.1 |

After reassignment table:

| Route Name | Line Name | From Date | To Date | Line Order |
| --- | --- | --- | --- | --- |
| RouteX | Line1 | 1/1/2005 | 1/1/2010 | 100 |
| RouteX_New | Line1 | 1/1/2010 | <Null> | 100 |

### Transferring routes to an existing line

Routes can be transferred entirely or partially to an existing line. In this case, the reassign portion should be either on the upstream or downstream ends of the source line. As shown in the example RouteZ belongs to Line2. You can take RouteZ from Line2 and transfer it to an existing adjoining line Line1.

Before reassignment table:

| Route Name | Line Name | From Date | To Date | Line Order |
| --- | --- | --- | --- | --- |
| RouteX | Line1 | 1/1/2005 | <Null> | 100 |
| RouteY | Line1 | 1/1/2005 | <Null> | 200 |
| RouteZ | Line2 | 1/1/2005 | <Null> | 100 |

Here are the inputs used for the Reassign Route tool.

| Method | Transfer to another line |
| --- | --- |
| Source |  |
| From Route | RouteZ |
| From Measure | 50 |
| To Route | RouteZ |
| To Measure | 60 |
| Target |  |
| Line Name | Line1 |
| Route | RouteZ |
| From Measure | 50 |
| To Measure | 60 |

The original RouteZ is retired on the date of reassignment. RouteZ gets recreated on Line1 with the date of reassignment as its From Date and gets its line order updated.

After reassignment table:

| Route Name | Line Name | From Date | To Date | Line Order |
| --- | --- | --- | --- | --- |
| RouteX | Line1 | 1/1/2005 | <Null> | 100 |
| RouteY | Line1 | 1/1/2005 | <Null> | 200 |
| RouteZ | Line2 | 1/1/2005 | 1/1/2010 | 100 |
| RouteZ | Line1 | 1/1/2010 | <Null> | 300 |

Note:

- Multiple adjoining routes from a line can be transferred to an adjoining line.
- Line orders of the remaining routes in the source line may be recalculated as a result.
- Line orders of the existing routes in the target line may be recalculated as a result.
- If the source routes are transferred to another line in entirety, the original Route Names and Route IDs as well as their measurements can be preserved. Alternatively, you can choose a new route name and from and to measures for the transferred routes
- If a portion of the source routes are transferred to another line, the original Route Names cannot be preserved, and a new Route name must be selected for the transferred route.

### Transferring routes to a new line

Routes can be transferred entirely or partially to a new line. As shown in the example RouteZ belongs to Line1. You can transfer it to a new line Line2.

Before reassignment table:

| Route Name | Line Name | From Date | To Date | Line Order |
| --- | --- | --- | --- | --- |
| RouteX | Line1 | 1/1/2005 | <Null> | 100 |
| RouteY | Line1 | 1/1/2005 | <Null> | 200 |
| RouteZ | Line1 | 1/1/2005 | <Null> | 300 |

Here are the inputs used for the Reassign Route tool.

| Method | Transfer to another line |
| --- | --- |
| Source |  |
| From Route | RouteZ |
| From Measure | 50 |
| To Route | RouteZ |
| To Measure | 60 |
| Target |  |
| Line Name | Line2 |
| Route | RouteZ |
| From Measure | 50 |
| To Measure | 60 |

The original RouteZ is retired on the date of reassignment. RouteZ gets recreated on Line2 with the date of reassignment as its From Date and gets its line order updated.
After reassignment table:

| Route Name | Line Name | From Date | To Date | Line Order |
| --- | --- | --- | --- | --- |
| RouteX | Line1 | 1/1/2005 | <Null> | 100 |
| RouteY | Line1 | 1/1/2005 | <Null> | 200 |
| RouteZ | Line1 | 1/1/2005 | 1/1/2010 | 300 |
| RouteZ | Line2 | 1/1/2010 | <Null> | 100 |

Note:

- Multiple adjoining routes from a line can be transferred to a new line.
- Line orders of the remaining routes in the source line may be recalculated as a result.
- If the source routes are transferred to a new line in entirety, the original Route Names and Route IDs as well as their measurements can be preserved. Alternatively, you can choose a new route name and from and to measures for the transferred routes
- If a portion of the source routes are transferred to a new line, the original Route Names cannot be preserved, and a new Route name must be selected for the transferred route.

### Parameters in the networks
The following tables describe the parameters used in the Reassign Route tool:

##### Reassign with the source route not calibrated downstream

#### For continuous networks

| Parameter Variable | Description |
| --- | --- |
| Network | The network in which the continuous routes exist. |
| Effective Date | This is the date when the reassignment has taken place on the ground. |
| Source : Route : Route Name/ ID | The route where the reassignment takes place starts . |
| Source Route : From Measure | The measure on the source route where the reassignment starts , ; shown by the green dot. |
| Source Route : To Measure | The measure on the source route where the reassignment ends , ; shown by the red dot. |
| Target : Route : Route Name/ ID | The route to which the reassigned portion will be added. This can also be a new route. |
| Target Route : From Measure | The starting measure on the reassigned portion. |
| Target Route: To Measure | The ending measure on the reassigned portion. |

#### The following image shows the Reassign Route pane onFor a network that has a user-created, single-field supports linesRoute ID.

The

| Variable | Description |
| --- | --- |
| Network | The network that supports lines in which the routes exist. |
| Effective Date | This is the date when the reassignment has taken place on the ground. |
| Source: From Route Name | The route where the reassignment starts. |
| Source: From Measure | The measure on the source route where the reassignment starts; shown by the green dot. |
| Source: To Route Name | The route where the reassignment ends. For example, if the reassignment takes place on a single route, the source route and target route are the same. The source routes should belong to the same line. |
| Source: To Measure | The measure on the source route where the reassignment ends; shown by the red dot. |
| Target: Route Name | The route to which the reassigned portion will be added. This can also be a new route. |
| Target: From Measure | The starting measure on the reassigned portion. |
| Target: To Measure | The ending measure on the reassigned portion. |

Reassign Route pane on a network with a user-created, single-field Route ID is shown.

### The following image shows the Reassign Route pane on a route in a continuous network that has a user-created, multi-field Route ID.

The Reassign Route pane on a network that has a user-created, multifield Route ID is shown.

### Attributes

- If the network has attribute fields other than the system-defined fields, you can either transfer the existing values of the source route or provide new values in the Reassign Route pane. The existing values of the source route are populated by default.
This attribute section also supports domains, subtypes, contingent values, and attribute rules.
Note:
The field alias, not the field name, appears in the Reassign Route pane.
Note:
 https://pro.arcgis.com/en/pro-app/3.1/help/production/roads-highways/methods-for-calibrating-routes-with-physical-gaps.htm \h Gap calibration rules are followed when editing routes.

### Reassign a route
Complete the following steps to implement a reassignment:

- Add the network feature class to a map.
- Alternatively, open a map in which the network feature class is present.
- Note:
- Traditionally versioned networks must be edited through a direct connection to the geodatabase. Branch versioned networks, which include networks configured with a user-generated route ID, must be edited through a feature service.
- Zoom in to the location where you want to reassign the route.
- Click the Reassign button  on the Location Referencing tab.
- The Reassign Route pane appears.
- Click the Network drop-down arrow to choose the network in which you want to do route reassignment.
- Note:
- To edit using feature services, the LRS Network must be published with linear referencing and version management capabilities.
- Click the Effective Date drop-down arrow and choose a date for the edit.
- Tip:
- Optionally, provide the date in the Effective Date text box.
- Double-click the empty Effective Date text box to populate it with today's date.
- In the Source Route section, click the Choose route from map button  and click the route on the map to populate Route ID.
- Note:
- After clicking the Choose route from map button  or the Choose measure from map button , you can hover over the route to see the route and measure at the location of the pointer.
- If only one applicable route exists at the edit location on the map, click to select it. If multiple routes are applicable, click the location and choose one of the applicable routes from the Select Route dialog box.
- You can set map scale options for the display of route and measure information on the Options dialog box, on the Location Referencing tab.
- Provide a From measure value for the route by doing one of the following:
  - Provide a From measure value in the From Measure text box.
  - Click the Choose measure from map button  and click a measure on the map.
  - Check the Use route start measure check box.
- A green dot is placed at the location. The reassignment starts from this location.
- Provide a To Measure value using one of the following options:
  - Provide a To measure value in the To Measure text box.
  - Click the Choose measure from map button  and click a measure on the map.
  - Check the Use route end measure check box.
- A red dot is placed at the location. The reassignment takes place on the routes or the portions of routes that exist between the green and red dots. The routes that are intersected by the reassignment portion are retired.
- Choose whether to recalibrate the remainder of the reassigned route downstream of the reassigned portion.
  - Check the Recalibrate route downstream check box to recalibrate the remainder of the reassigned route downstream of the reassigned portion.
  - Uncheck the Recalibrate route downstream check box if you do not want to recalibrate the remainder of the reassigned route downstream of the reassigned portion.
- Choose whether to transfer the source calibration points to the target route using the Transfer calibration points to the target route option.
- The Transfer calibration points to the target route check box is checked by default and is the preferred method to maintain established measures between points.
- Note:
- All of the calibration points between and including the from measure and to measure values, even those spanning routes in between, are included in the transfer of calibration points to the target route.
- The Reassign Route pane is populated.
- Choose the method for reassignment:
      - Merge to adjacent route
      - Form a new route

#### Merge to adjacent route

- In the Target section, click the Choose route from map button and choose the target route from the map.
- Alternatively, type the name of an existing route.
- Provide a From measure value for the target route reassignment location by doing one of the following:
  - Provide a value in the From Measure text box.
  - Click the Recalculate From Measure button . The From measure value is calculated as the source measure length minus the To measure value.
- Note:
  - If you are filling a gap, this value is equal to the measure at the beginning of the gap.
  - If you are adding the reassigned route to the end of the target route, this value is equal to the end measure of the target route.
  - If you are creating a route or adding the reassigned portion to the beginning of the target route, this value is 0.
- Note:
- For the line network, the measures can be entered as station values in 00+00.00 or 00+00.000 format.
- Provide the to measure value of the target route reassignment location by doing one of the following:
  - Provide a to measure value in the To Measure text box.
  - Click the Recalculate To Measure button . The to measure value is calculated as the source measure length minus the from measure value.
- Note:
  - If you are filling a gap, this value is equal to the measure at the end of the gap.
  - If you are adding the reassigned route to the beginning of the target route, this value is equal to the total length in the linear referencing method (LRM) measure units of the reassigned portion.
  - If you are creating a route or adding the reassigned value to the end of the target route, this value is equal to the new end measure of the route.
- Choose whether to recalibrate the remainder of the reassignedtarget route downstream of the reassigned portion.
  - Check the Recalibrate route downstream check box to recalibrate the remainder of the reassigned route downstream of the reassigned portion.
  - Uncheck the Recalibrate route downstream check box if you do not want to recalibrate the remainder of the reassigned route downstream of the reassigned portion.
- Click Next
The reassign route pane opens

- If the network has attribute fields other than the system-defined fields, you can either transfer the existing values of the source route or provide new values in the Reassign Route pane. The existing values of the source route are populated by default.
This attribute section also supports domains, subtypes, contingent values, and attribute rules.
Note:
The field alias, not the field name, appears in the Reassign Route pane.

- Choose whether to transfer the source calibration points to the target route using the Transfer calibration points to the target route option.
- The Transfer calibration points to the target route check box is checked by default and is the preferred method to maintain established measures between points.
- Note:
- All of the calibration points between and including the from measure and to measure values, even those spanning routes in between, are included in the transfer of calibration points to the target route.
- The Reassign Route pane is populated.
- Click Run.
- Note:
  - If your route edit will result in the introduction of one or more physical gaps on the route, a prompt appears to alert you before the tool is run. If you don't plan to create a gapped route, answer No and edit the digitized centerlines so that no gaps result during route editing.
  - If the route being edited already had one or more physical gaps, and no more physical gaps were introduced by the edit, no prompt will appear.
  - You can prevent unplanned centerlines by  https://pro.arcgis.com/en/pro-app/3.1/help/editing/enable-snapping.htm \h enabling snapping in the active map, or by enabling snapping using the Edit tab, Snapping group, Snapping button .
  - You can disable this warning by unchecking the Warn before allowing route edits that can create physical gaps check box inon the  https://pro.arcgis.com/en/pro-app/3.1/help/production/roads-highwayslocation-referencing-pipelines/set-location-referencing-options.htm \h Location Referencing optionstab on the Options dialog box.
- The route is reassigned.
- Note:
- If a message regarding acquiring locks or reconciling appears,  https://pro.arcgis.com/en/pro-app/3.1/help/production/roads-highwayslocation-referencing-pipelines/conflict-prevention.htm \h conflict prevention is enabled.
- Note:
- In a combined Utility Network and Pipeline Referencing deployment, if the centerline is split because of this edit activity, the RouteID, From Measure, and To Measure fields are updated for the split centerlines.

### FormReassign routes in a line network
Routes in a line network can be reassigned to new or existing routes as shown in the following examples.

#### Reassign to a new route
In the following example, reassignment of the middle portion of RouteX

- In the Target section provide a new route name to reassign to a new route is shown.

##### Input

| Route ID | Line order |
| --- | --- |
| RouteX | 100 |
| RouteY | 200 |

After reassignment, RouteA is created from the reassigned middle portion. Line order has been updated with the new RouteA at 200 and RouteY moved to 300 in the line order.

##### Output

| Route ID | Line order |
| --- | --- |
| RouteX | 100 |
| RouteA | 200 |
| RouteY | 300 |

#### Reassign to an existing route
In the following example, the middle portion of a route will be assigned to an existing route.

##### Input

| Route ID | Line order |
| --- | --- |
| RouteX | 100 |
| RouteY | 200 |

The middle portion of RouteX will be reassigned to the existing route, RouteY.

##### Output

| Route ID | Line order |
| --- | --- |
| RouteX | 100 |
| RouteY | 200 |

- After reassignment, the middle portion of RouteX has been reassigned toProvide a From measure value for the target route reassignment location by doing one of the following:
  - Provide a value in the From Measure text box.
  - Click the Recalculate From Measure button . The From measure value is calculated as the source measure length minus the To measure value.
- Note:
If you are adding the existingreassigned route, RouteY.

#### Reassign to an existing route on an adjacent line
In the following example, end of the middle portion of a route will be reassigned to an existing route in an adjacent line.

##### Input

| Route ID | Line order | Line ID |
| --- | --- | --- |
| RouteX | 100 | LineA |
| RouteY | 100 | LineB |

 target route, this value is equal

  - The middle portion of RouteX on LineA will be reassigned to the existing route, RouteY, on an adjacent line, LineBend measure of the target route.

##### Output

| Route ID | Line order | Line ID |
| --- | --- | --- |
| RouteX | 100 | LineA |
| RouteY | 100 | LineB |

  - For the line network, the measures can be entered as station values in 00+00.00 or 00+00.000 format.
- Provide the to measure value of the target route reassignment location by doing one of the following:
  - Provide a to measure value in the To Measure text box.
  - Click the Recalculate To Measure button . The to measure value is calculated as the source measure length minus the from measure value.
- Click Next
The middle portionreassign route pane opens

- If the network has attribute fields other than the system-defined fields, you can either transfer the existing values of the source route or provide new values in the Reassign Route pane. The existing values of RouteX on LineA has beenthe source route are populated by default.
If the reassignment spans multiple routes, the values from the first from value of the route will be populated by default.
This attribute section also supports domains, subtypes, contingent values, and attribute rules.
Note:
The field alias, not the field name, appears in the Reassign Route pane.

- Click Run.
Note:

  - If your route edit will result in the introduction of one or more physical gaps on the route, a prompt appears to alert you before the tool is run. If you don't plan to create a gapped route, answer No and edit the digitized centerlines so that no gaps result during route editing.
  - If the route being edited already had one or more physical gaps, and no more physical gaps were introduced by the edit, no prompt will appear.
  - You can prevent unplanned centerlines by  https://pro.arcgis.com/en/pro-app/3.1/help/editing/enable-snapping.htm \h enabling snapping in the active map, or by enabling snapping using the Edit tab, Snapping group, Snapping button .
  - You can disable this warning by unchecking Warn before allowing route edits that can create physical gaps on the  https://pro.arcgis.com/en/pro-app/3.1/help/production/location-referencing-pipelines/set-location-referencing-options.htm \h Location Referencing tab on the Options dialog box.
- The route is reassigned.
- Note:
If a message regarding acquiring locks or reconciling appears,  https://pro.arcgis.com/en/pro-app/3.1/help/production/location-referencing-pipelines/conflict-prevention.htm \h conflict prevention is enabled.
Note:
In a combined Utility Network and Pipeline Referencing deployment, if the centerline is split because of this edit activity, the RouteID, From Measure, and To Measure fields are updated for the split centerlines.

#### Transfer to another line
This option is available only for networks that support lines.

- Add the network feature class to a map.
- Alternatively, open a map in which the network feature class is present.
- Note:
- Traditionally versioned networks must be edited through a direct connection to the geodatabase. Branch-versioned networks, including any network configured with a user-generated route ID, must be  https://pro.arcgis.com/en/pro-app/3.1/help/production/location-referencing-pipelines/edit-feature-services.htm \h edited through a feature service.
- Zoom in to the location where you want to reassign the route.
- Click the Reassign button  on the Location Referencing tab.
- The Reassign Route pane appears.
- Click the Network drop-down arrow and choose the network in which the route reassignment will take place.
- Note:
- To edit using feature services, the LRS Network must be published with the  https://pro.arcgis.com/en/pro-app/3.1/help/production/location-referencing-pipelines/share-web-layers-with-linear-referencing-capability.htm  \h linear referencing and version management capabilities.
- Click the Effective Date drop-down arrow and choose a date for the edit.
- Tip:
- Optionally, provide the date in the Effective Date text box.
- Double-click the empty Effective Date text box to populate it with today's date.
- In the Source section, click the Choose route from map button  and click the route on the map to populate From Route Name.
- Note:
- After clicking the Choose route from map button  or the Choose measure from map button , you can hover over the routes to see the route and measure at the location of the pointer.
- If only one applicable route exists at the edit location, click to select it. If multiple routes are applicable, click to choose one of the applicable routes using the Select Route dialog box.
- You can  https://pro.arcgis.com/en/pro-app/3.1/help/production/location-referencing-pipelines/set-location-referencing-options.htm \h set map scale options for display of route and measure information on the Options dialog box, on the Location Referencing tab.
- Provide a From measure value for the route by doing one of the following:
  - Provide a From measure value in the From Measure text box.
  - Click the Choose measure from map button  and click a measure on the map.
  - Check the Use route start measure check box.
- A green dot is placed at the location. The reassignment starts from this location.
- Click the Choose route from map button  and click the route on the map to populate To Route Name.
- Provide a To measure value by doing one of the following:
  - Provide a To measure value in the To Measure text box.
  - Click the Choose measure from map button  and click a measure on the map.
  - Check the Use route end measure check box.
- A red dot is placed at the location. The reassignment takes place on the routes or the portions of routes that exist between the green and red dots. The routes that are intersected by the reassignment portion are retired.
- Choose whether to recalibrate the remainder of the source reassigned route downstream of the reassigned portion.
  - Check the Recalibrate route downstream check box to recalibrate the remainder of the reassigned route downstream of the reassigned portion.
  - Uncheck the Recalibrate route downstream check box if you do not want to recalibrate the remainder of the reassigned to the existing route, RouteY, on an adjacentroute downstream of the reassigned portion.
- Choose whether to transfer the source calibration points to the target route using the Transfer calibration points to the target route option.
- The Transfer calibration points to the target route check box is checked by default and is the preferred method to maintain established measures between points.
- Note:
- All of the calibration points between and including the from measure and to measure values, even those spanning routes in between, are included in the transfer of calibration points to the target route.
- The Reassign Route pane is populated.
- Choose Transfer to another line as the method for reassignment:
- In the Target section, click the Choose line from map button and choose the target Line from the map.
The source will be transferred to this line.
Alternatively, provide a new Line name to reassign to transfer the source routes to.
Note: If the provided Line Name doesn’t exist in the database, then a new Line will be created, and the source routes will be transferred to this new line.

- Click Next
The list of routes that are going to be retired because of this operation shows up.
Note: This pane only shows up with Networks supporting lines

- Click Next
The reassign route pane opens

- The Route Name for each source routes are copied.
You can change the route name.

- The From Measure for each source routes is copied but you can provide a From measure value for the target route reassignment location by doing one of the following:
  - Type a value in the From Measure text box.
  - Click the Recalculate From Measure button . The From measure value is calculated as the source measure length minus the To measure value.
- Note:
- For the line, LineB network, the measures can be entered as station values in 00+00.00 or 00+00.000 format.
- The To Measure for each source routes is copied but you can provide the to measure value of the target route reassignment location by doing one of the following:
  - Provide a to measure value in the To Measure text box.
  - Click the Recalculate To Measure button . The to measure value is calculated as the source measure length minus the from measure value.
- If the network has attribute fields other than the system-defined fields, you can either transfer the existing values of the source route or provide new values in the Reassign Route pane. The existing values of the source route are populated by default.
This attribute section also supports domains, subtypes, contingent values, and attribute rules.

Note:
The field alias, not the field name, appears in the Reassign Route pane.

- Click Run.
Note:

  - If your route edit will result in the introduction of one or more physical gaps on the route, a prompt appears to alert you before the tool is run. If you don't plan to create a gapped route, answer No and edit the digitized centerlines so that no gaps result during route editing.
  - If the route being edited already had one or more physical gaps, and no more physical gaps were introduced by the edit, no prompt will appear.
  - You can prevent unplanned centerlines by  https://pro.arcgis.com/en/pro-app/3.1/help/editing/enable-snapping.htm \h enabling snapping in the active map, or by enabling snapping using the Edit tab, Snapping group, Snapping button .
  - You can disable this warning by unchecking Warn before allowing route edits that can create physical gaps on the  https://pro.arcgis.com/en/pro-app/3.1/help/production/location-referencing-pipelines/set-location-referencing-options.htm \h Location Referencing tab on the Options dialog box.
- The route is reassigned.
Note:
If a message regarding acquiring locks or reconciling appears,  https://pro.arcgis.com/en/pro-app/3.1/help/production/location-referencing-pipelines/conflict-prevention.htm \h conflict prevention is enabled.
Note:
In a combined Utility Network and Pipeline Referencing deployment, if the centerline is split because of this edit activity, the RouteID, From Measure, and To Measure fields are updated for the split centerlines.

![image2.png](../media/doc440_image2.png) ![image3.png](../media/doc440_image3.png) ![image4.png](../media/doc440_image4.png) ![image5.png](../media/doc440_image5.png) ![image6.png](../media/doc440_image6.png) ![image7.png](../media/doc440_image7.png) ![image8.png](../media/doc440_image8.png) ![image9.png](../media/doc440_image9.png) ![image10.png](../media/doc440_image10.png) ![image11.png](../media/doc440_image11.png) ![image12.png](../media/doc440_image12.png) ![image13.png](../media/doc440_image13.png)
