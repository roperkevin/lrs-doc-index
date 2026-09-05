# Modify Overlay Events Service Contract

|   |   |
| --- | --- |
| **Kind** | User Story · Server |
| **Release** | — |
| **Source** | [ModifyOverlayEventsServiceContract.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ModifyOverlayEventsServiceContract.pptx>) |
| **Edited** | 2024-10-29 23:52 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Modify Overlay Events Service Contract"
source_file: "ModifyOverlayEventsServiceContract.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ModifyOverlayEventsServiceContract.pptx"
doc_id: 295
doc_kind: "User Story"
surface: "Server"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Praveen Kumar"
last_edited_by: "Nathan Easley"
last_edited: "2024-10-29T23:52:24Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["overlay events", "service contract", "data reviewer", "quality control", "sqlite", "location referencing service", "dynamic segmentation"]
tools: []
products: []
issues: []
related: [{"doc":475,"file":"rest-gp-support-the-centerline-feature-class-like-an-event-in-query-attribute__doc475.md","s":3.427},{"doc":436,"file":"rest-gp-consider-centerline-direction-in-query-attribute-set-overlay-events__doc436.md","s":3.347},{"doc":765,"file":"support-vertical-route-segments-in-overlay-events-gp-tool__doc765.md","s":3.325},{"doc":799,"file":"support-complex-route-shapes-in-overlay-events-gp-tool__doc799.md","s":3.31},{"doc":461,"file":"support-centerline-as-input-in-queryattributeset-and-overlay-events-test-plan__doc461.md","s":2.245}]
```
-->

## Summary

User story for updating the LocationReferencingService to modify and add service contracts for overlay events to support Data Reviewer quality control checks on LRS data in multiple formats including fgdb, direct connect, and feature services. Includes integration of Data Reviewer changes, modifications to repositories and unit tests, and ensuring consistent behavior of overlay events.

## Related documents

<!-- related:begin -->
- [REST/GP: Support the centerline feature class like an event in Query Attribute Set/Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-gp-support-the-centerline-feature-class-like-an-event-in-query-attribute__doc475.md>) — similar text 0.08 · 2 title words · 2 filename words · same kind/folder <!-- rel:475 -->
- [REST/GP: Consider Centerline Direction in Query Attribute Set/Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-gp-consider-centerline-direction-in-query-attribute-set-overlay-events__doc436.md>) — similar text 0.05 · 2 title words · 2 filename words · same kind/folder <!-- rel:436 -->
- [Support Vertical Route Segments in Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-route-segments-in-overlay-events-gp-tool__doc765.md>) — similar text 0.05 · 2 title words · 2 filename words · same kind/folder <!-- rel:765 -->
- [Support Complex Route Shapes in Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-overlay-events-gp-tool__doc799.md>) — similar text 0.05 · 2 title words · 2 filename words · same kind/folder <!-- rel:799 -->
- [Support Centerline as Input in queryAttributeSet and Overlay Events Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-centerline-as-input-in-queryattributeset-and-overlay-events-test-plan__doc461.md>) — similar text 0.02 · 2 title words · 2 filename words <!-- rel:461 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [overlay events](https://www.google.com/search?q=%22overlay%20events%22+site%3Adoc.esri.com) · [query attribute set](https://www.google.com/search?q=%22query%20attribute%20set%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Modify Overlay Events Service Contract

User Story

## Slide 2 — User Story

As an LRS Analyst, I need the ability to perform Data Reviewer quality control checks on LRS data in all supported data formats, so that I can run LRS checks on my data in fgdb, direct connect, and feature services.

Persona
LRS Analyst: These users are responsible for doing analysis on LRS data throughout their organization. They might be part of LRS groups or other groups but are typically skilled in doing analysis on multiple datasets.  These users will also perform QA/QC on their LRS data and will utilize Data Reviewer LRS checks.  They need these checks to work on fgdb, direct connect, and feature services.  To make the LRS checks perform on all formats, the Data Reviewer team needs the service contract for dynamic segmentation updated in SQL Lite.

## Slide 3 — Acceptance Criteria

Data Reviewer previously copied all Overlay Events related code into the Data Reviewer folder under Core’s Geodatabase/GdbCoreLib and prefix all files with ReviewerLrs. They made significant changes to some of those files to meet the performance requirement for SQLite database. We need to integrate the changes they made into our codebase and provide them a service contract to call so they don’t need to worry about keeping those ReviewerLrs* files up to date.
We need to create a user story to make the following changes:
Modify existing LocationReferencingService to update the existing service contract and add a new service contract.
Update:
struct OverlayEventsNetworkInfoForSharedService
{
COMHANDLE pNetworkFeatureClass = NULL;
COMHANDLE pNetworkQueryFilter = NULL;
SAFEARRAY* pNetworkFieldNamesArray = NULL;
bool IncludesGeometry; <-- remove
BSTR networkTableName = NULL; // Network table name used in SQLite database

```
};
struct OverlayEventsEventInfoForSharedService
{
COMHANDLE pEventFeatureClass = NULL;
COMHANDLE pEventQueryFilter = NULL;
BSTR eventTableName = NULL; // Event table name used in SQLite database
};
```

STDMETHODIMP CLocationReferencingService::OverlayEvents(
OverlayEventsNetworkInfoForSharedService networkInfo,
OverlayEventsEventInfoForSharedService* pEventInfoArray,
int pEventInfoArraySize,
COMHANDLE pInMemoryWorkspace,
BSTR outputOverlayTableName,
bool includeGeometry)

## Slide 4 — Acceptance Criteria ( cont )

Add:
STDMETHODIMP CLocationReferencingService::SqliteOverlayEvents(
OverlayEventsNetworkInfoForSharedService networkInfo,
OverlayEventsEventInfoForSharedService* pEventInfoArray,
int pEventInfoArraySize,
BSTR outputOverlayTableName,
BSTR sqliteDatabasePath, // Path to the SQLite database that contains required tables with records that need to be overlay-ed.
bool includeGeometry)
Copy over Data Reviewer's Data Manager and SQLite Wrapper and make necessary changes.
Modify or create new GdbRepository, NetworkRouteRepository, CenterlineRepository, Lrs, Network, EventTable, GPOverlayRouteEvents, OverlayEvents, etc., to replace IFeatureClass, ITable, ICursor, IQueryFilter, IRow, esriFieldType, etc.
Modify existing Cpp unit tests in OverlayEventsTests and ServiceTests

## Slide 5 — Testing

Automation should catch any changes to the existing behavior of Overlay Events and Query Attribute Set
Do some sanity testing on the GP tool/REST operation to ensure the results are the same as before the service contract was modified

## Slide 6 — Automation

No need to update any automation

## Slide 7 — Documentation

Update any internal documentation about the service contract based on these changes

## Slide 8 — Story Points

Story Points:
Dev:
PE:
