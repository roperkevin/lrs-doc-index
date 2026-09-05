# Allow Append Events to Run When Locks Are Present - Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 156 · Test Plan · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#6640](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6640) |
| **Source** | [AllowAppendEvents_ConflictPreventionOptional_Testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/AllowAppendEvents_ConflictPreventionOptional_Testplan.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE Lakshmi · dev Eric |
| **Edited** | 2025-07-07 14:19 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | append events · conflict prevention · route locks · point event · line event · spanning line event · geoprocessing |
| **Tools** | Append Events |

## Summary

Test plan for the Append Events geoprocessing tool option to ignore conflict prevention route locks. Covers test cases for appending point, line, and spanning line events on locked and unlocked routes using various methods, verifying expected behaviors and warning messages. Includes automation and documentation update notes.

## Related documents

<!-- related:begin -->
- [Append Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6640-append-events-lr.md>) — shared issue ArcGISPro/ps-location-referencing#6640 · similar text 0.16 · 2 title words · 2 filename words · same surface <!-- rel:124 s=1003.366 -->
- [Allow LRS Intersections to be updated without locking intersecting routes - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6758-allow-lrs-intersections-to-be-updated-without-locking.md>) — similar text 0.58 · 1 title word · 2 filename words · same kind/surface/pe/dev/folder <!-- rel:155 s=7.881 -->
- [Allow Append Events to Run When Locks Are Present on Impacted Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-append-events-to-run-when-locks-are-present.md>) — similar text 0.33 · 6 title words · 3 filename words · same surface <!-- rel:168 s=7.146 -->
- [Consider Route Dominance in Append Events (add method) – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/1488-consider-route-dominance-in-append-events-add-method.md>) — similar text 0.23 · 2 title words · 3 filename words · same kind/surface/folder <!-- rel:279 s=5.654 -->
- [Consider Route Dominance in Append Events Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/3537-consider-route-dominance-in-append-events.md>) — similar text 0.24 · 2 title words · 3 filename words · same kind/pe/folder <!-- rel:278 s=5.434 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html)

_No page matched:_ [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Allow Append Events to run when locks are present on impacted routes - Test Plan

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6640

PE: Lakshmi
Dev: Eric

## Slide 2

Test Data

- Test with RH and APR data
- Test in dc and fs
- Test with point, spanning and non-spanning line events
- Test  with Add, Retire overlaps , Retire by EventID and Replace by EventID Methods
- Test in default and in version
- Test with input feature class and feature table
- Test in  pro, python UI , python standalone and model builder
Verification

- Verify that the optional parameter “Ignore Conflict Prevention route locks” is seen in the Append events GP tool
- Verify that this parameter shows up  in the UI only when the conflict prevention is enabled
- Verify upon checking this option, when the route is already locked  allow append events go through, and events are appended. Verify that a warning message to the GP output  is added that alerts the user that there were routes that were locked (and provide the list of routeIDs)
- Verify upon checking this option, when the route is not locked do not acquire new lock.
- Verify tabbing works for the option.

## Slide 3

Automation
 Add to UI automation
 Add to Append Events APR Python automation
Do we have conflict prevention enabled tests in automation?
Documentation
Update the documentation for the gp tool to mention this option.
Test Cases
If the option  is “ignore conflict prevention route lock“ is enabled when the tool is run

|  | Test Case | Expected Results |
| --- | --- | --- |
| Point Events |  |  |
| 1 | Append point event on already locked route - Add | Append events , warning message stating RID locked routes is provided |
| 2 | Append point event on already locked route - Retire by RID | Append events , warning message stating RID locked routes is provided |
| 3 | Append point event on already locked route – Replace by RID | Append events , warning message stating RID locked routes is provided |
| 4 | Append point event on unlocked route – any method | Append events, do not acquire lock |
| 5 | Append point event check add to dominant route , subordinate route only locked – any method(having concurrencies with time slices)<br>Time and location overlap scenario | Append events , no warning message provided |

## Slide 4

Test Cases – cntd ..
If the option  is “ignore conflict prevention route lock“ is enabled when the tool is run

|  | Test Case | Expected Results |
| --- | --- | --- |
| 6 | Append point event check add to dominant route , dominant route only locked – any method (having concurrencies with time slices) | Append events , warning message for dominant route is provided |
| Line Events |  |  |
| 7 | Append line event on already locked route - Add | Append events , warning message stating RID locked routes is provided |
| 8 | Append line event on already locked route - Retire by RID | Append events , warning message stating RID locked routes is provided |
| 9 | Append line event on already locked route - Replace by RID | Append events , warning message stating RID locked routes is provided |
| 10 | Append line event on already locked route – Retire Overlaps | Append events , warning message stating RID locked routes is provided |
| 11 | Append line event on unlocked route – any method | Append events, do not acquire lock |
| 12 | Append line event check add to dominant route , subordinate route only locked – any method (having concurrencies with time slices)<br>Time and location overlap scenario | Append events , no warning message provided |
| 13 | Append line event check add to dominant route , dominant route only locked – any method(having concurrencies with time slices)<br>Time and location overlap scenario | Append events , warning message for dominant route is provided |

## Slide 5

Test Cases – cntd ..
If the option  is “ignore conflict prevention route lock“ is checked when the tool is run

|  | Test Case | Expected Results |
| --- | --- | --- |
| Spanning Line Events |  |  |
| 14 | Append spanning line event on already locked route - Add | Append events , warning message stating LineID, RID of locked routes is provided. (Check whether LineID or RID is provided in the lock) |
| 15 | Append spanning line event on already locked route - Retire by RID | Append events , warning message stating LineID, RID of locked routes is provided |
| 16 | Append spanning line event on already locked route - Replace by RID | Append events , warning message stating LineID, RID of locked routes is provided |
| 17 | Append spanning line event on unlocked route – any method | Append events, do not acquire lock |
| 18 | Append spanning line event check add to dominant route , subordinate route only locked – any method (having concurrencies with time slices)<br>Time and location overlap scenario | Append events , no warning message provided |
| 19 | Append spanning line event check add to dominant route , dominant route only locked – any method<br>(having concurrencies with time slices)<br>Time and location overlap scenario | Append events , warning message for dominant route & line is provided |
| 20 | Add event to default version | Route lock and release should not happen |
| 21 | Add event as User A in version V1 when the route lock exists with User B in different version V2 | Append event and provide warning message of locked RID |

## Slide 6

Test Cases – cntd ..
If the option  is “ignore conflict prevention route lock“ is checked when the tool is run

|  | Test Case | Expected Results |
| --- | --- | --- |
| 22 | Add event as User A in version V1 when the route lock exists with User A in different version V2 | Append event and provide warning message of locked RID |
| 23 | Some of the appending events are locked and some do not have locks – retire / replace method | Append event and provide warning message of locked RID |
| 24 | Some of the routes of the appending events are locked – add method | Append event and provide warning message of locked RID |
| 25 | Create a version V1 and change to default version and edit default. Change to the version V1 and append events | Current behavior is auto reconcile if there is no conflicts and too will run. If there are any conflicts, show an error – the error message should not talk about acquiring locks. |
| 26 | After running GP tool hit cancel | No events appended. |
| 27 | Test in data where conflict prevention is not enabled | This option should not show up |

If the option  is “ignore conflict prevention route lock“ is  not checked when the tool is run

|  | Test Case | Expected Results |
| --- | --- | --- |
| 28 | Add point event on already locked route – any method | Do not append provide error message and list of locked RID |
| 29 | Add line event on already locked route – any method | Do not append provide error message and list of locked RID |
| 30 | Add spanning line event on already locked route – any method | Do not append provide error message and list of locked LineID & RID |

## Slide 7

Test Cases – cntd ..
If the option  is “ignore conflict prevention route lock“ is  not checked when the tool is run

|  | Test Case | Expected Results |
| --- | --- | --- |
| 31 | Add point event on unlocked route – any method | Acquire lock and append events. Show the message of acquiring lock |
| 32 | Add line event on unlocked route – any method | Acquire lock and append events<br>Show the message of acquiring lock |
| 33 | Add spanning line event on unlocked route – any method | Acquire lock and append events<br>Show the message of acquiring lock |
