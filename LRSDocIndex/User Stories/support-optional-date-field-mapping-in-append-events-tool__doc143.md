# Support Optional Date Field Mapping in Append Events Tool

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Support optional date field mapping in Append Events tool.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20optional%20date%20field%20mapping%20in%20Append%20Events%20tool.pptx>) |
| **Edited** | 2025-08-06 15:26 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Optional Date Field Mapping in Append Events Tool"
source_file: "Support optional date field mapping in Append Events tool.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20optional%20date%20field%20mapping%20in%20Append%20Events%20tool.pptx"
doc_id: 143
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2025-08-06T15:26:03Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["append events", "date fields", "event loading", "time slices", "route", "event records"]
tools: ["Append Events"]
products: []
issues: []
related: [{"doc":126,"file":"append-events-date-optional-test-plan__doc126.md","s":6.224},{"doc":164,"file":"append-events-partial-loading-support__doc164.md","s":5.657},{"doc":165,"file":"append-routes-partial-loading-support__doc165.md","s":4.772},{"doc":168,"file":"allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md","s":4.641},{"doc":40,"file":"append-calibration-points-to-lrs-tool__doc40.md","s":4.414}]
```
-->

## Summary

This user story describes the enhancement to the Append Events geoprocessing tool to support optional From and To Date fields. It outlines the desired behavior for loading event records without date fields, handling of null dates, and constraints on mapping these fields. Testing, automation updates, and documentation changes are also specified.

## Related documents

<!-- related:begin -->
- [Append Events Date Optional Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-events-date-optional-test-plan__doc126.md>) — similar text 0.26 · 4 title words · 4 filename words · same surface <!-- rel:126 -->
- [Append Events Partial Loading Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-events-partial-loading-support__doc164.md>) — similar text 0.29 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:164 -->
- [Append Routes Partial Loading Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-partial-loading-support__doc165.md>) — similar text 0.29 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:165 -->
- [Allow Append Events to Run When Locks Are Present on Impacted Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md>) — similar text 0.23 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:168 -->
- [Append Calibration Points to LRS tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-calibration-points-to-lrs-tool__doc40.md>) — similar text 0.20 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:40 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support date fields as optional in Append Events

User Story

## Slide 2 — User Story

As an LRS Data Loader, I want to be able to bulk load LRS event records without populating the dates, so I can easily script the loading of data that comes from vendors that do not include or consider time during their collection.
Persona
LRS Data Loader – These users are responsible for loading data (routes and events) into the LRS.  This includes both initial data loading/migration, but also supplemental data loading of data collected in the field or via other collection means.  This data is often not collected with date fields as it’s representative of a current state or snapshot of the characteristic(s).  These users want to be able to load the event data without having to add date fields and simply have it load to the current version of the route.

## Slide 3 — Append Events optional date fields

In the Append Events geoprocessing tool, make the From and To Date Fields optional
Note that these fields may need to be reordered in the python signature since they’re now optional.  We should not change their order in the tool UI (other than showing them as optional now)
If the To Date field is not mapped, populate Null as the value for this field when loading the data (note that this might result in time slices of events if there are multiple time slices of the route they’re being linear referenced against)
If the From Date field is not mapped, populate the From Date of the current time slice of the route with the routeID matching the route
For events that span route, determine the most recent (or current) From Date of all the routes on the line and use that for the From Date of the record being loaded
If there is no active time slice of the route, populate a Null From Date and To Date on the event and provide a warning message in the output alerting the user that there was no active time slice of the route to associate the event with (the event should end up with multiple time slices and the associated Location Errors since the event spans across all time)
Do not allow the To Date field to be mapped unless the From Date field is also mapped

## Slide 4 — Testing

Test the tool with a mix of fgdb, direct connect, and feature services
Test with a mix of From and To Dates on the routes being loaded against
Test with dates with and without time
Test scenarios where the route doesn’t exist in the current time range
Test at least one scenario with conflict prevention

## Slide 5 — Automation

Update existing automation for the tool in both fgdb and fs to add these test cases

## Slide 6 — Documentation

Update the tool documentation to reflect these fields being optional.
Add usage notes that explain how events are handled when the From and To Dates are not mapped as well as when the To Date is not mapped

## Slide 7 — Assignment

Story Points:
Dev:  days
PE:  days
