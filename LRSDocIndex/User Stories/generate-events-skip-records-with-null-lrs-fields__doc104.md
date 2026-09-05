# Generate Events Skip Records with Null LRS Fields

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Source** | [Generate Events Skip Records with null LRS fields.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Generate%20Events%20Skip%20Records%20with%20null%20LRS%20fields.pptx>) |
| **Edited** | 2025-11-20 15:40 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Generate Events Skip Records with Null LRS Fields"
source_file: "Generate Events Skip Records with null LRS fields.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Generate%20Events%20Skip%20Records%20with%20null%20LRS%20fields.pptx"
doc_id: 104
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2025-11-20T15:40:34Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["generate events", "pipe characteristics", "null routeid", "measure fields", "event records", "lrs editor", "apr un"]
tools: ["Generate Events"]
products: ["Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":52,"file":"generate-events-gp-tool-ignore-null-parameter-acceptance-tests__doc52.md","s":5.298},{"doc":143,"file":"support-optional-date-field-mapping-in-append-events-tool__doc143.md","s":3.799},{"doc":168,"file":"allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md","s":3.679},{"doc":267,"file":"generate-intersections-at-route-endpoints__doc267.md","s":3.37},{"doc":393,"file":"allow-lrs-events-and-intersections-in-update-measures-from-lrs-tool__doc393.md","s":2.941}]
```
-->

## Summary

Describes a user story for LRS Editors to model pipe characteristics in a single feature class containing both linear referenced and non linear referenced pipes. Introduces an optional parameter in the Generate Events geoprocessing tool to ignore event records with null routeID and measure fields, preventing shape or attribute changes for non LRS data. Includes testing, automation, and documentation updates for this capability.

## Related documents

<!-- related:begin -->
- [Generate Events GP Tool Ignore Null Parameter Acceptance Tests](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/generate-events-gp-tool-ignore-null-parameter-acceptance-tests__doc52.md>) — similar text 0.30 · 3 title words · 3 filename words · same surface <!-- rel:52 -->
- [Support Optional Date Field Mapping in Append Events Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-optional-date-field-mapping-in-append-events-tool__doc143.md>) — similar text 0.20 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:143 -->
- [Allow Append Events to Run When Locks Are Present on Impacted Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md>) — similar text 0.29 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:168 -->
- [Generate Intersections at Route Endpoints](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-intersections-at-route-endpoints__doc267.md>) — similar text 0.21 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:267 -->
- [Allow LRS Events and Intersections in Update Measures from LRS tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-lrs-events-and-intersections-in-update-measures-from-lrs-tool__doc393.md>) — similar text 0.21 · 1 title word · same kind/surface/folder <!-- rel:393 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Generate Events](https://www.google.com/search?q=%22Generate%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Generate Events skip records with null LRS fields

User Story

## Slide 2 — User Story

As an LRS Editor, I need the ability to model pipe characteristics on both linear referenced and non linear referenced pipe in a single feature class, so that I can query and analyze this data without having to create views/temporary layers.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. For editors at organizations using both APR and the UN, they have some pipeline characteristics that exist on all pipe (both LRS and non LRS).  Instead of modeling these as two different feature classes (one as an LRS event and the other as a regular feature class), they want to put them all in a single feature class (the LRS event).  To support this, we need to add an option in Generate Events to skip/ignore records that have null routeID/measure columns since the non LRS data won’t have these fields populated and shouldn’t have its shape impacted or a loc error added when being run through the tool.

## Slide 3 — Ignore null routeID /measure fields option

In the Generate Events GP tool, add a new optional parameter called “Ignore events with null routeID and measure fields”
Default is false/unchecked
In the Pro UI, this option should only appear when an event in an LRS with the UN configured is selected
When unchecked, the tool should work as it does today
When checked, any event records that have null RouteID and Measure(s) fields should be ignored
Ignored means we don’t make any changes to the shape or attributes of the feature
Provide a list of OIDs of event records that were skipped in the text output file for the tool

## Slide 4 — Testing

Test using APR-UN datasets with both point and line events
Use an APR only dataset to verify that the option isn’t available
Split testing between FS, FGDB, and DC EGDB
Verify in model builder and python as well

## Slide 5 — Automation

Add a few automation cases for this new capability to the existing python automation for this tool

## Slide 6 — Documentation

Update documentation for the topic to include this new parameter
In the usage notes explain how this parameter is designed for combined APR-UN deployments when pipe characteristics exist on both linear referenced and non linear referenced pipes
Consider finding a place to include this in the combined APR-UN topic we have in the APR help

## Slide 7 — Assignment

Story Points:
Dev:  days
PE:  days
