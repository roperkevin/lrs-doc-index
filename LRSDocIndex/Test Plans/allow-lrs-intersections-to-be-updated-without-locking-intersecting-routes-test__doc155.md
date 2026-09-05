# Allow LRS Intersections to be updated without locking intersecting routes - Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#6758](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6758) |
| **Source** | [GenerateInts_OptionalConflictPreven.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/GenerateInts_OptionalConflictPreven.pptx>) |
| **Edited** | 2025-07-11 14:44 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Allow LRS Intersections to be updated without locking intersecting routes - Test Plan"
source_file: "GenerateInts_OptionalConflictPreven.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/GenerateInts_OptionalConflictPreven.pptx"
doc_id: 155
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: "Lakshmi"
dev: "Eric"
author: "Lakshmi Ananthanarayanan"
last_edited_by: "Mac Christmas"
last_edited: "2025-07-11T14:44:03Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["intersections", "conflict prevention", "route locks", "generate intersections", "geoprocessing", "versioning", "warning message"]
tools: ["Generate Intersections"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#6758"]
related: [{"doc":130,"file":"generate-intersections-location-referencing__doc130.md","s":1002.4},{"doc":81,"file":"11-5-server-patch-2-and-3-5-6-patch-issues__doc81.md","s":1001.046},{"doc":156,"file":"allow-append-events-to-run-when-locks-are-present-test-plan__doc156.md","s":7.517},{"doc":163,"file":"allow-lrs-intersections-to-be-updated-without-locking-intersecting-routes__doc163.md","s":4.845},{"doc":168,"file":"allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md","s":3.475}]
```
-->

## Summary

Test plan for the generate intersections geoprocessing tool with an optional parameter to ignore conflict prevention route locks. Covers verification steps, test cases for various locking scenarios, automation, and documentation updates.

## Related documents

<!-- related:begin -->
- [Generate Intersections (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-intersections-location-referencing__doc130.md>) — shared issue ArcGISPro/ps-location-referencing#6758 · similar text 0.25 · 1 title word · same surface <!-- rel:130 -->
- [11.5 Server Patch 2 and 3.5.6 Patch Issues](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/11-5-server-patch-2-and-3-5-6-patch-issues__doc81.md>) — shared issue ArcGISPro/ps-location-referencing#6758 · similar text 0.12 · same surface <!-- rel:81 -->
- [Allow Append Events to Run When Locks Are Present - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/allow-append-events-to-run-when-locks-are-present-test-plan__doc156.md>) — similar text 0.58 · 1 title word · 2 filename words · same kind/surface/pe/dev/folder <!-- rel:156 -->
- [Allow LRS Intersections to be updated without locking intersecting routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-lrs-intersections-to-be-updated-without-locking-intersecting-routes__doc163.md>) — similar text 0.48 · 6 title words · same surface <!-- rel:163 -->
- [Allow Append Events to Run When Locks Are Present on Impacted Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md>) — similar text 0.33 · 2 title words · same surface <!-- rel:168 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-intersection-properties.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html)

_No page matched:_ [Generate Intersections](https://www.google.com/search?q=%22Generate%20Intersections%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Allow LRS Intersections to be updated without locking intersecting routes- Test Plan

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6758

Test Plan Author: Lakshmi
PE:
Dev: Eric

## Slide 2

Test Data

- Test with RH and APR data
- Test in  dc and fs
- Test in fgdb (sanity testing to make sure the tool works without conflict prevention)
- Test in default and in version
- Test in  pro, python UI , python standalone and model builder

Verification

- Verify that the optional parameter “Ignore Conflict Prevention route locks” is seen in the generate intersections GP tool
- Verify that this parameter shows up  in the UI only when the conflict prevention is enabled
- Verify upon checking this option,  new locks for the participating  intersecting routes  are not created
- Verify upon checking this option, already existing locks for the edited routes remain as is.
- Verify upon checking this option, if any of the intersecting routes are locked in any other version , continue generating intersections and add a warning message to the GP output that alerts the user that there were intersecting routes that were locked(and provide the list of routeIDs)
- Verify tabbing works for the option.
- Verify the log message in the text file.

## Slide 3

Automation
Add automation for FS for this tool.
Do we have conflict prevention enabled tests in automation?
Documentation
Update the documentation for the gp tool to mention this option.
Test Cases
If the option  is “ignore conflict prevention route lock“ is enabled when the tool is run

|  | Test Case | Expected Results |
| --- | --- | --- |
| 1 | Run generate intersection with multiple routes where no routes are locked | Intersection is created and no locks acquired |
| 2 | Run generate intersection as user A in version V1 where there are two routes , only edited route is locked by the user A in the same version | Intersection is generated without any warning. No locks acquired. |
| 3 | Run generate intersection with multiple routes where all routes are locked | Intersection is created and no new locks acquired . A warning is provided stating that routes are locked which includes routeID, username and version |
| 4 | Run generate intersection as user A in version V1 for multiple routes. In the version V1 edited route alone is locked by user B. | Intersection is generated and no new lock is acquired. Warning is provided, lock will be not transferred to user A. |

## Slide 4

Test Cases – cntd .. If the option  is “ignore conflict prevention route lock“ is checked when the tool is run

|  | Test Case | Expected Results |
| --- | --- | --- |
| 5 | Run generate intersection to update intersection for multiple routes where the routes no longer intersect and all the routes are locked | Intersection is deleted and no new locks acquired. A warning is provided stating that routes are locked with routeID, username and version are provided |
| 6 | Run generate intersection to update intersection for multiple routes where the routes are updated by route edit activities and some of the routes are locked | Intersection is updated and no new locks acquired A warning is provided stating that routes are locked with routeID, username and version are provided |
| 7 | After running GP tool hit cancel | No change in locks and no intersection is generated |
| 8 | Create a version V1 and change to default version and edit default. Change to the version V1 and run generate intersections GP tool | Current behavior is auto reconcile if there is no conflicts and tool will run. If there are any conflicts, show an error – the error message should not talk about acquiring locks. |
| 9 | Test in data where conflict prevention is not enabled | This option should not show up |
| 10 | Under process edits make sure this option is exposed for the users to choose | Test through process edits and ensure intersections are generated even if routes are locked upon choosing this option |

If the option  is “ignore conflict prevention route lock“ is  not checked when the tool is run. ( sanity testing)

|  | Test Case | Expected Results |
| --- | --- | --- |
| 11 | Generate intersection with multiple routes and no routes locked | Intersection is generated and all intersecting routes are locked |
| 12 | Update an intersection with multiple routes and some of the routes are locked by different users in different version | Error out and provide the list of locks |
