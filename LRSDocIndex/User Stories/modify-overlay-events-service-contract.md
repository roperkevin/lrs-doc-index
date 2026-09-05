# Modify Overlay Events Service Contract

| Field | Value |
| --- | --- |
| **Doc** | 295 · User Story · Server |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [ModifyOverlayEventsServiceContract.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ModifyOverlayEventsServiceContract.pptx>) |
| **People** | author Praveen Kumar · PE — · dev — |
| **Edited** | 2024-10-29 23:52 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | overlay events · service contract · data reviewer · quality control · sqlite · location referencing service · dynamic segmentation |
| **Tools** | — |

## Summary

User story for updating the LocationReferencingService to modify and add service contracts for overlay events to support Data Reviewer quality control checks on LRS data in multiple formats including fgdb, direct connect, and feature services. Includes integration of Data Reviewer changes, modifications to repositories and unit tests, and ensuring consistent behavior of overlay events.

## Related documents

<!-- related:begin -->
- [REST/GP: Support the centerline feature class like an event in Query Attribute Set/Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-gp-support-the-centerline-feature-class-like-an-event.md>) — similar text 0.08 · 2 title words · 2 filename words · same kind/folder <!-- rel:475 s=3.427 -->
- [REST/GP: Consider Centerline Direction in Query Attribute Set/Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-gp-consider-centerline-direction-in-query-attribute-set.md>) — similar text 0.05 · 2 title words · 2 filename words · same kind/folder <!-- rel:436 s=3.347 -->
- [Support Vertical Route Segments in Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-route-segments-in-overlay-events-gp.md>) — similar text 0.05 · 2 title words · 2 filename words · same kind/folder <!-- rel:765 s=3.325 -->
- [Support Complex Route Shapes in Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-overlay-events-gp.md>) — similar text 0.05 · 2 title words · 2 filename words · same kind/folder <!-- rel:799 s=3.31 -->
- [Support Centerline as Input in queryAttributeSet and Overlay Events Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5196-support-centerline-as-input-in-queryattributeset-and-overlay.md>) — similar text 0.02 · 2 title words · 2 filename words <!-- rel:461 s=2.245 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [overlay events](https://www.google.com/search?q=%22overlay%20events%22+site%3Adoc.esri.com) · [query attribute set](https://www.google.com/search?q=%22query%20attribute%20set%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Modify Overlay Events Service Contract <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Analyst, I need the ability to perform Data Reviewer quality control checks on LRS data in all supported data formats, so that I can run LRS checks on my data in fgdb, direct connect, and feature services.

Persona
LRS Analyst: These users are responsible for doing analysis on LRS data throughout their organization. They might be part of LRS groups or other groups but are typically skilled in doing analysis on multiple datasets.  These users will also perform QA/QC on their LRS data and will utilize Data Reviewer LRS checks.  They need these checks to work on fgdb, direct connect, and feature services.  To make the LRS checks perform on all formats, the Data Reviewer team needs the service contract for dynamic segmentation updated in SQL Lite.

## Acceptance Criteria
<!-- slide 3 -->
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

### Acceptance Criteria ( cont ) <!-- slide 4 -->
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

## Testing
<!-- slide 5 -->
- Automation should catch any changes to the existing behavior of Overlay Events and Query Attribute Set
- Do some sanity testing on the GP tool/REST operation to ensure the results are the same as before the service contract was modified

## Automation
<!-- slide 6 -->
- No need to update any automation

## Documentation
<!-- slide 7 -->
- Update any internal documentation about the service contract based on these changes

## Assignment
### Story Points <!-- slide 8 -->
Story Points:
Dev:
PE:
