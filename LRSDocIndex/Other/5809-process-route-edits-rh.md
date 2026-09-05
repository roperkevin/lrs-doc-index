# Process Route Edits

| Field | Value |
| --- | --- |
| **Doc** | 306 · Other · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#5809](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5809) |
| **Source** | [5809_Process_route_edits.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5809_ProcessEdits/5809_Process_route_edits.docx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2024-09-20 18:44 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | route edits · process edits tool · derived network · event behavior · intersections · line network · nonline network · route retirement |
| **Tools** | Generate Intersections · Apply Event Behaviors · Generate Routes · Derive Event Measures · Process Edits |

## Summary

Describes the Process Edits tool in ArcGIS Roads and Highways which runs a sequence of geoprocessing tools to synchronize an LRS after route edits. Covers workflows for line networks with derived networks and nonline networks, detailing the update of intersections, event behaviors, routes, and derived event measures. Includes before and after examples of route retirement and the resulting updates to events and intersections.

## Related documents

<!-- related:begin -->
- [Process Route Edits](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/5809-process-route-edits-v4.md>) — shared issue ArcGISPro/ps-location-referencing#5809 · similar text 0.79 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:328 s=1008.145 -->
- [Pro 3.4 and 11.4 User Acceptance Issues and Documentation Updates](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Schedules/504-pro-3-4-and-11-4-user-acceptance-issues-and-documentation.md>) — shared issue ArcGISPro/ps-location-referencing#5809 · similar text 0.03 · same surface <!-- rel:194 s=1000.648 -->
- [Support Running AEB, Generate Routes, and Derive Event Measures as a Single Operation via the LR Pro Ribbon – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/5198-support-running-aeb-generate-routes-and-derive-event.md>) — similar text 0.22 · 2 filename words · same surface <!-- rel:453 s=3.246 -->
- [Event Behavior for Route Reassignment – Merge to Adjacent Route Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-route-reassignment-merge-to-adjacent-route-method.md>) — similar text 0.19 · 1 title word · 1 filename word · same kind/surface <!-- rel:522 s=3.211 -->
- [Event Behavior for Route Retirement](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-route-retirement-2024-02-2.md>) — similar text 0.24 · 1 title word · same kind/surface <!-- rel:425 s=2.891 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-intersection-properties.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/retire-routes.html)

_No page matched:_ [Generate Intersections](https://www.google.com/search?q=%22Generate%20Intersections%22+site%3Adoc.esri.com) · [Apply Event Behaviors](https://www.google.com/search?q=%22Apply%20Event%20Behaviors%22+site%3Adoc.esri.com) · [Generate Routes](https://www.google.com/search?q=%22Generate%20Routes%22+site%3Adoc.esri.com) · [Derive Event Measures](https://www.google.com/search?q=%22Derive%20Event%20Measures%22+site%3Adoc.esri.com) · [Process Edits](https://www.google.com/search?q=%22Process%20Edits%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Process route edits
In ArcGIS Roads and Highways, four geoprocessing tools must be run to fully synchronize an LRS following an LRS route editing operation. The geoprocessing tools include Generate Intersections, to update existing or generate new intersections, Apply Event Behaviors, to apply specific event behaviors to events on edited routes, Generate Routes, to regenerate the derived network following edits to a line network, and also Derive Event Measures, to update any event configured with derived measure information. The Process Edits tool  can streamline this process by running the four tools sequentially on the unprocessed edits in an LRS Networks.
You can use the Process Edits tool to run common post route editing tools. The tool is optimized to only update events and intersections impacted by LRS route edits, can be run within or outside an edit session, and supports undo and redo using the tools in ArcGIS Pro.
For a line network configured with a derived network, the following tools will run sequentially:

1. Generate Intersections—Creates or updates intersections based on routes that have been edited

1. Apply Event Behaviors—Applies event behaviors on routes that have been edited

1. Generate Routes—Generates the derived network based on routes that have been edited

1. Derive Event Measures—Updates the derived event measures on events whose parent route or routes have been edited

| Step in sequence: | Geoprocessing Tool: | Description |
| --- | --- | --- |
| 1. | https://prodev.arcgis.com/en/pro-app/3.4/tool-reference/location-referencing/generate-intersections.htm \h Generate Intersections | Creates or updates intersections based on routes that have been edited. |
| 2. | https://prodev.arcgis.com/en/pro-app/3.4/tool-reference/location-referencing/apply-event-behaviors.htm \h Apply Event Behaviors | Applies event behaviors on routes that have been edited. |
| 3. | https://prodev.arcgis.com/en/pro-app/3.4/tool-reference/location-referencing/generate-routes.htm \h Generate Routes | Generates the derived network based on routes that have been edited. |
| 4. | https://prodev.arcgis.com/en/pro-app/3.4/tool-reference/location-referencing/derive-event-measures.htm \h Derive Event Measures | Updates the derived event measures on events whose parent route or routes have been edited. |

For a nonline network or a line network configured without a derived network, only the Generate Intersections and Apply Event Behaviors tools will run.
For a nonline network or a line network configured without a derived network, the following tools run sequentially:

1. Generate Intersections—Creates or updates intersections based on routes that have been edited

1. Apply Event Behaviors—Applies event behaviors on routes that have been edited

### Processing eEdits processed on a line network
When using the Process Edits tool  on a line network, the Generate Intersections, Apply Event Behaviors, Generate Routes, and Derive Event Measures geoprocessing tools run sequentially on all routes in LRS Networks that have unprocessed edits.

#### Before route edit
In the following scenario, the last route on a line is about to be retired. There is a spanning line event, point event, and intersection along the line. The two event layers are both configured with the Stay Put event behavior for route retirement operations.
The following diagram shows the state of the LRS data before the route retirement.

The following table shows the route information before the route retirement:

| Network | Line Name | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| Line Network | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 20 |
| Line Network | Line1 | Route2 | 1/1/2000 | <Null> | 30 | 50 |
| Line Network | Line1 | Route3 | 1/1/2000 | <Null> | 70 | 90 |
| Derived Network | N/A | Line1 | 1/1/2000 | <Null> | 0 | 60 |

The following table shows the line event information before the route retirement:

| Event ID | From Route Name | To Route Name | From Date | To Date | From Measure | To Measure | Derived Route Name | Derived From Measure | Derived To Measure |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LineEvent1 | Route1 | Route3 | 1/1/2000 | <Null> | 0 | 90 | Line1 | 0 | 60 |

The following table shows the point event information before the route retirement:

| Event ID | Route Name | From Date | To Date | Measure | Derived Route Name | Derived Measure |
| --- | --- | --- | --- | --- | --- | --- |
| PointEvent1 | Route3 | 1/1/2000 | <Null> | 75 | Line1 | 45 |

The following table shows the intersection information before the route retirement:

| Intersection Name | Route Name | From Date | To Date | Measure |
| --- | --- | --- | --- | --- |
| Route3, Boundary1 | Route3 | 1/1/2000 | <Null> | 85 |

#### After route edit
Route3 was retired as of 1/1/2010. The line network has been updated, however the intersection, events, and derived network layers have not been updated.
The following diagram shows the updated routes after retirement:

The following table shows the route information after the route retirement:

| Network | Line Name | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| Line Network | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 20 |
| Line Network | Line1 | Route2 | 1/1/2000 | <Null> | 30 | 50 |
| Line Network | Line1 | Route3 | 1/1/2000 | 1/1/2010 | 70 | 90 |
| Derived Network | N/A | Line1 | 1/1/2000 | <Null> | 0 | 60 |

Note:
The intersection, events, and derived network have not updated following the route retirement.

#### After processeding edits
The Process Edits tool completes the LRS workflow by running the geoprocessing tools sequentially to make the following updates to the edited route:

- Update intersections
- Apply event behaviors
- Generate routes, including the derived network
- Update derived event measures
The following diagram shows the fully updated LRS after running the Process Edits tool:

The derived network has regenerated based on the route retirement. The following table shows the updated derived network information after running the Process Edits tool :

| Network | Line Name | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| Line Network | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 20 |
| Line Network | Line1 | Route2 | 1/1/2000 | <Null> | 30 | 50 |
| Line Network | Line1 | Route3 | 1/1/2000 | 1/1/2010 | 70 | 90 |
| Derived Network | N/A | Line1 | 1/1/2000 | 1/1/2010 | 0 | 60 |
| Derived Network | N/A | Line1 | 1/1/2010 | <Null> | 0 | 40 |

The line event layer performs the Stay Put event behavior and the derived measure information is updated based on the updated derived network. The following table shows the updated line event information after running the Process Edits tool :

| Event ID | From Route Name | To Route Name | From Date | To Date | From Measure | To Measure | Derived Route Name | Derived From Measure | Derived To Measure |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LineEvent1 | Route1 | Route3 | 1/1/2000 | 1/1/2010 | 0 | 90 | Line1 | 0 | 60 |
| LineEvent1 | Route1 | Route2 | 1/1/2010 | <Null> | 0 | 50 | Line1 | 0 | 40 |

The point event layer performs the Stay Put event behavior and the derived measure information is updated based on the updated derived network. The following table shows the point event information after running the Process Edits tool:

| Event ID | Route Name | From Date | To Date | Measure | Derived Route Name | Derived Measure |
| --- | --- | --- | --- | --- | --- | --- |
| PointEvent1 | Route3 | 1/1/2000 | 1/1/2010 | 85 | Line1 | 55 |

The intersections are regenerated, with the intersection retiring due to the route retirement. There are no longer any routes intersecting the boundary polygon along Line1. The following table shows the intersection information after running the Process Edits tool :

| Intersection Name | Route Name | From Date | To Date | Measure |
| --- | --- | --- | --- | --- |
| Route3, Boundary1 | Route3 | 1/1/2000 | 1/1/2010 | 85 |

### Processing eEdits processed on a nonline network
When using the Process Edits tool on a nonline network, only the Generate Intersections and Apply Event Behaviors geoprocessing tools are run sequentially on all routes in LRS Networks that have unprocessed edits.
Note:
The Generate Routes and Derive Event Measures tools are skipped because a nonline network cannot have a configured derived network.

#### Before route edit
In the following scenario, the second half of Route1 is about to be retired. There is a line event, point event, and intersection along the route. The two event layers are both configured with Stay Put event behavior for route retirement operations.
The following diagram shows the state of the LRS data before the route retirement.

The following table shows the route information before the route retirement:

| Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- |
| Route1 | 1/1/2000 | <Null> | 0 | 60 |
| RouteA | 1/1/2000 | <Null> | 0 | 10 |

The following table shows the line event information before the route retirement:

| Event ID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| LineEvent1 | Route1 | 1/1/2000 | <Null> | 0 | 60 |

The following table shows the point event information before the route retirement:

| Event ID | Route Name | From Date | To Date | Measure |
| --- | --- | --- | --- | --- |
| PointEvent1 | Route1 | 1/1/2000 | <Null> | 45 |

The following table shows the intersection information before the route retirement:

| Intersection Name | Route Name | From Date | To Date | Measure |
| --- | --- | --- | --- | --- |
| Route1, RouteA | Route1 | 1/1/2000 | <Null> | 55 |

#### After route edit
The second half of Route1 was retired as of 1/1/2010. The nonline network has been updated, however the intersection and events have not been updated.
The following diagram shows the updated routes after retirement:

The following table shows the route information after the route retirement:

| Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- |
| Route1 | 1/1/2000 | 1/1/2010 | 0 | 60 |
| Route1 | 1/1/2010 | <Null> | 0 | 30 |
| RouteA | 1/1/2000 | <Null> | 0 | 10 |

Note:
The intersection and event layers have not updated following the route retirement.

#### After processeding edits
The Process Edits  tool completes the LRS workflow by running the geoprocessing tools sequentially to make the following updates to the edited route:

- Intersections are updated
- Event behaviors are applied
The following diagram shows the fully updated LRS after running the Process Edits tool :

The line event layer performs the Stay Put event behavior. The following table shows the updated line event information after running the Process Edits tool :

| Event ID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| LineEvent1 | Route1 | 1/1/2000 | 1/1/2010 | 0 | 60 |
| LineEvent1 | Route1 | 1/1/2010 | <Null> | 0 | 30 |

The point event layer also performs the Stay Put event behavior. The following table shows the updated point event information after running the Process Edits tool :

| Event ID | Route Name | From Date | To Date | Measure |
| --- | --- | --- | --- | --- |
| PointEvent1 | Route1 | 1/1/2000 | 1/1/2010 | 45 |

The intersection is regenerated, with the intersection retiring due to the route retirement. Route1 no longer intersects RouteA. The following table shows the intersection information after run ning the Process Edits tool :

| Intersection Name | Route Name | From Date | To Date | Measure |
| --- | --- | --- | --- | --- |
| Route1, RouteA | Route1 | 1/1/2000 | 1/1/2010 | 55 |

Process edits
Complete the following steps to run the post route editing tools after you have finished a route edit such as realigning or extending routes.

1. On the Location Referencing tab, in the Tools group, click Process Edits .
A dialog box appears and shows the progress of the tools that are run. If you’re not in an edit session, it starts one so that you can undo or redo resulting changes from this process.

1. Click OK once the tools are finished processing.
If one of the tools in the process fails, you can undo the changes, fix the issues, and run the Process Edits tool again.

![Figure 1 — After processeding edits](../media/5809-process-route-edits-rh/fig-01-after-processeding-edits.png)
![Figure 2 — After processeding edits](../media/5809-process-route-edits-rh/fig-02-after-processeding-edits.png)
