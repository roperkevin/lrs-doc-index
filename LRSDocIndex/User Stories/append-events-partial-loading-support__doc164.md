# Append Events Partial Loading Support

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Append Events partial loading support.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Append%20Events%20partial%20loading%20support.pptx>) |
| **Edited** | 2025-05-25 20:54 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Append Events Partial Loading Support"
source_file: "Append Events partial loading support.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Append%20Events%20partial%20loading%20support.pptx"
doc_id: 164
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2025-05-25T20:54:05Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["event loading", "partial loading", "append events", "bulk loading", "error handling", "output files"]
tools: ["Append Events"]
products: []
issues: []
related: [{"doc":165,"file":"append-routes-partial-loading-support__doc165.md","s":9.036},{"doc":143,"file":"support-optional-date-field-mapping-in-append-events-tool__doc143.md","s":5.657},{"doc":168,"file":"allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md","s":5.066},{"doc":579,"file":"append-routes-events-load-routes-events-by-route-name__doc579.md","s":4.213},{"doc":40,"file":"append-calibration-points-to-lrs-tool__doc40.md","s":3.718}]
```
-->

## Summary

User story describing the need for partial loading support in the Append Events tool to allow bulk event loading to continue despite some events failing. It includes details on the new optional parameter, expected behavior, output files for failed events, and testing and automation plans.

## Related documents

<!-- related:begin -->
- [Append Routes Partial Loading Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-partial-loading-support__doc165.md>) — similar text 0.90 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:165 -->
- [Support Optional Date Field Mapping in Append Events Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-optional-date-field-mapping-in-append-events-tool__doc143.md>) — similar text 0.29 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:143 -->
- [Allow Append Events to Run When Locks Are Present on Impacted Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md>) — similar text 0.40 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:168 -->
- [Append Routes/Events: Load Routes/Events by Route Name](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/append-routes-events-load-routes-events-by-route-name__doc579.md>) — similar text 0.17 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:579 -->
- [Append Calibration Points to LRS tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-calibration-points-to-lrs-tool__doc40.md>) — similar text 0.22 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:40 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Append Routes partial loading support

User Story

## Slide 2 — User Story

As an LRS Loader, I need the ability to have bulk event loading partially complete if there are issues, so that I can still get some events loaded while I revisit fixing events that failed to load.

Persona
LRS data loader: This user is responsible for initial and supplemental bulk data loading in the LRS.  When there are many events to be loaded and one or more have an issue, the entire batch of events fails to load.  To make the loading process easier, we should allow partial loading of the good events in this scenario and provide an output file of the events that don’t load correctly (with good explanation of how to fix them).

## Slide 3 — Append Events partial loading

Add a new parameter to the Append Events tool called “Allow partial loading of events”

  - Parameter would be optional
  - In the UI in Pro, it would be placed at the bottom of the tool
When disabled, the tool should work the same way it does today
When enabled, the tool should continue to load events as it does today, however, if any of the events have issues that would have caused the tool to fail in the past do the following:

  - Don’t load those events
  - Load all the other events without issues as expected (this includes events that can be loaded but have a loc error)
  - Have the tool complete and provide warning messages about some events not being able to be loaded
  - Provide two output files: 1. A feature class/table of all the events that didn’t load correctly (this can just be a copy of the input feature class/table with the records that didn’t load exactly as they were in the input and 2. A text file with a list of the events that couldn’t be loaded and good detailed explanation for why they weren’t able to be loaded (also include a list of events that had loc errors and provide explanation of how they can be fixed)
This may result in new error messages being added or existing error messages being detailed further
Note that conflict prevention locks can be ignored with an option being added from another user story.  If that option is enabled, honor it.  If it’s disabled and conflict prevention is the cause of a route(s) not being loaded, provide that route in the output file and information about conflict prevention locks as the cause in the text file

## Slide 4 — Testing

Test with a mix of roads and pipeline data
Test with point, non spanning, and spanning events
Test with Pro UI, python inline, python stand alone, and model builder

## Slide 5 — Automation

Add new automation cases in python for the tool
Note that the existing automation for the tool may fail and need updated to account for the new parameter

## Slide 6 — Documentation

Add new automation cases in python for the tool
Note that the existing automation for the tool may fail and need updated to account for the new parameter

## Slide 7 — Assignment

Story Points:
Dev:  days
PE:  days
