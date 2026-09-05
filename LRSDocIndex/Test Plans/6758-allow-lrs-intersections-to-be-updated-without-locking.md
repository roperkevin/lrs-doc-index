# Allow LRS Intersections to be updated without locking intersecting routes - Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 155 · Test Plan · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#6758](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6758) |
| **Source** | [GenerateInts_OptionalConflictPreven.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/GenerateInts_OptionalConflictPreven.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE Lakshmi · dev Eric |
| **Edited** | 2025-07-11 14:44 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | intersections · conflict prevention · route locks · generate intersections · geoprocessing · versioning · warning message |
| **Tools** | Generate Intersections |

## Summary

Test plan for the generate intersections geoprocessing tool with an optional parameter to ignore conflict prevention route locks. Covers verification steps, test cases for various locking scenarios, automation, and documentation updates.

## Related documents

<!-- related:begin -->
- [Generate Intersections (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6758-generate-intersections-lr.md>) — shared issue ArcGISPro/ps-location-referencing#6758 · similar text 0.25 · 1 title word · same surface <!-- rel:130 s=1002.4 -->
- [11.5 Server Patch 2 and 3.5.6 Patch Issues](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6961-11-5-server-patch-2-and-3-5-6-patch-issues.md>) — shared issue ArcGISPro/ps-location-referencing#6758 · similar text 0.12 · same surface <!-- rel:81 s=1001.046 -->
- [Allow Append Events to Run When Locks Are Present - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/6640-allow-append-events-to-run-when-locks-are-present.md>) — similar text 0.58 · 1 title word · 2 filename words · same kind/surface/pe/dev/folder <!-- rel:156 s=7.517 -->
- [Allow LRS Intersections to be updated without locking intersecting routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-lrs-intersections-to-be-updated-without-locking.md>) — similar text 0.48 · 6 title words · same surface <!-- rel:163 s=4.845 -->
- [Allow Append Events to Run When Locks Are Present on Impacted Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-append-events-to-run-when-locks-are-present.md>) — similar text 0.33 · 2 title words · same surface <!-- rel:168 s=3.475 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-intersection-properties.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html)

_No page matched:_ [Generate Intersections](https://www.google.com/search?q=%22Generate%20Intersections%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Allow LRS Intersections to be updated without locking intersecting routes- Test Plan <!-- slide 1 -->

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6758

Test Plan Author: Lakshmi
PE:
Dev: Eric

### Slide 2 <!-- slide 2 -->

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

### Slide 3 <!-- slide 3 -->

Automation
Add automation for FS for this tool.
Do we have conflict prevention enabled tests in automation?
Documentation
Update the documentation for the gp tool to mention this option.
Test Cases
If the option  is “ignore conflict prevention route lock“ is enabled when the tool is run

## Test Cases

### TC-U01 — Run generate intersection with multiple routes where no routes are locked <!-- src: LLM · slide 3 · table row 1 -->
- **Group:** If the option  is “ignore conflict prevention route lock“ is enabled when the tool is run
- **Expected Result:** Intersection is created and no locks acquired

### TC-U02 — Generate intersection, only edited route locked by user A in same version <!-- src: LLM · slide 3 · table row 2 -->
- **Group:** If the option  is “ignore conflict prevention route lock“ is enabled when the tool is run
- **Case:** Run generate intersection as user A in version V1 where there are two routes , only edited route is locked by the user A in the same version
- **Expected Result:** Intersection is generated without any warning. No locks acquired.

### TC-U03 — Run generate intersection with multiple routes where all routes are locked <!-- src: LLM · slide 3 · table row 3 -->
- **Group:** If the option  is “ignore conflict prevention route lock“ is enabled when the tool is run
- **Expected Result:** Intersection is created and no new locks acquired .<br>A warning is provided stating that routes are locked which includes routeID, username and version

### TC-U04 — Generate intersection as user A where edited route is locked by user B <!-- src: LLM · slide 3 · table row 4 -->
- **Group:** If the option  is “ignore conflict prevention route lock“ is enabled when the tool is run
- **Case:** Run generate intersection as user A in version V1 for multiple routes. In the version V1 edited route alone is locked by user B.
- **Expected Result:** Intersection is generated and no new lock is acquired.<br>Warning is provided, lock will be not transferred to user A.

### TC-U05 — Update intersection where routes no longer intersect and all routes locked <!-- src: LLM · slide 4 · table row 5 -->
- **Group:** Test Cases – cntd .. If the option  is “ignore conflict prevention route lock“ is checked when the tool is run
- **Case:** Run generate intersection to update intersection for multiple routes where the routes no longer intersect and all the routes are locked
- **Expected Result:** Intersection is deleted and no new locks acquired.<br>A warning is provided stating that routes are locked with routeID, username and version are provided

### TC-U06 — Update intersection after route edit activities with some routes locked <!-- src: LLM · slide 4 · table row 6 -->
- **Group:** Test Cases – cntd .. If the option  is “ignore conflict prevention route lock“ is checked when the tool is run
- **Case:** Run generate intersection to update intersection for multiple routes where the routes are updated by route edit activities and some of the routes are locked
- **Expected Result:** Intersection is updated and no new locks acquired<br>A warning is provided stating that routes are locked with routeID, username and version are provided

### TC-U07 — After running GP tool hit cancel <!-- src: LLM · slide 4 · table row 7 -->
- **Group:** Test Cases – cntd .. If the option  is “ignore conflict prevention route lock“ is checked when the tool is run
- **Expected Result:** No change in locks and no intersection is generated

### TC-U08 — Run generate intersections in version V1 after editing default version <!-- src: LLM · slide 4 · table row 8 -->
- **Group:** Test Cases – cntd .. If the option  is “ignore conflict prevention route lock“ is checked when the tool is run
- **Case:** Create a version V1 and change to default version and edit default. Change to the version V1 and run generate intersections GP tool
- **Expected Result:** Current behavior is auto reconcile if there is no conflicts and tool will run. If there are any conflicts, show an error – the error message should not talk about acquiring locks.

### TC-U09 — Test in data where conflict prevention is not enabled <!-- src: LLM · slide 4 · table row 9 -->
- **Group:** Test Cases – cntd .. If the option  is “ignore conflict prevention route lock“ is checked when the tool is run
- **Expected Result:** This option should not show up

### TC-U10 — Under process edits make sure this option is exposed for the users to choose <!-- src: LLM · slide 4 · table row 10 -->
- **Group:** Test Cases – cntd .. If the option  is “ignore conflict prevention route lock“ is checked when the tool is run
- **Expected Result:** Test through process edits and ensure intersections are generated even if routes are locked upon choosing this option

### TC-U11 — Generate intersection with multiple routes and no routes locked <!-- src: LLM · slide 4 · table row 11 -->
- **Group:** If the option  is “ignore conflict prevention route lock“ is  not checked when the tool is run. ( sanity testing)
- **Expected Result:** Intersection is generated and all intersecting routes are locked

### TC-U12 — Update intersection with some routes locked by different users/versions <!-- src: LLM · slide 4 · table row 12 -->
- **Group:** If the option  is “ignore conflict prevention route lock“ is  not checked when the tool is run. ( sanity testing)
- **Case:** Update an intersection with multiple routes and some of the routes are locked by different users in different version
- **Expected Result:** Error out and provide the list of locks
