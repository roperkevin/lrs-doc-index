# Regression Testing Task List V1

| Field | Value |
| --- | --- |
| **Doc** | 115 · Test Plan · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [Regression Testing Task List V1.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/Regression%20Testing%20Task%20List%20V1.docx>) · rev V1 |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2025-10-07 16:51 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | regression testing · widgets · route editing · calibration points · event behavior · carto realignment · geoprocessing tools · conflict prevention · event editing · network integration · rest services · adm rh integration · un apr integration |
| **Tools** | Add Line Event · Add Point Event · LRS Identify · Merge Events · Search by Route · Split Event · Split Centerline · Identify Routes · Locate Route and Measures · Enable Time · Set Time Filter · LRS Hierarchy · Translate · Rename · Locks Table · Release Locks · Append Events · Append Routes · Apply Event Behaviors · Calculate Intersecting Route Measures · Calculate Route Concurrencies · Delete Routes · Derive Event Measures · Generate Calibration Points · Generate Events · Generate Intersections · Generate Routes · Overlay Events · Remove Overlapping Centerlines · Reverse Line Orders · Translate Event Measures · Update Measures From LRS · Configure Address Feature Classes · Configure Utility Network Feature Class · Remove LRS Entity · Create LRS · Create LRS From Existing Dataset · Modify LRS · Configure External Event With LRS · Create LRS Event · Create LRS Event From Existing Dataset · Disable Derived Measure Fields · Disable Referent Fields · Disable Stationing Fields · Enable Derived Measure Fields · Enable Referent Fields · Enable Stationing Fields · Modify Event Behavior Rules · Modify LRS Event · Create LRS Intersection · Create LRS Intersection From Existing Dataset · Modify LRS Intersection · Configure Lookup Table · Configure Route Dominance Rules · Create LRS Network · Create LRS Network From Existing Dataset · Modify LRS Network · Modify Network Calibration Rules · Modify Route ID Padding · Acquire Locks · Address Layers · All Layers · Apply Edits · Calibration Point Layer · Centerline Layer · Centerline Sequence Table · Check Events · Concurrencies · Create Version · Delete Version · Event Layer · Export Network · Geometry to Measure · Geometry to Referent · Geometry to Station · Get Calibration Configuration · Get Cartographic Realignment Configuration · Intersection Layer · Locks · Measure to Geometry · Network Layer · Non-LRS Layer · Query Attribute Set · Query Edit Log · Query Locks · Query Lookup Table · Query Route Associations · Reconcile Version · Redline Layer · Referent to Geometry · Relocate Event · Set Calibration Configuration · Set Cartographic Realignment Configuration · Station to Geometry · Utility Network Layer |

## Summary

This document lists regression testing tasks for various Esri Linear Referencing System components across Pro, Experience Builder, Server, and integrations. It details widget functionalities, route editing operations, geoprocessing tools, configuration options, network-specific tests, REST services, and integration with ADM-RH and UN-APR. The focus is on testing features such as event editing, route management, calibration, conflict prevention, and data actions.

## Related documents

<!-- related:begin -->
- [64 bit OID GP Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5509-64-bit-oid-gp.md>) — similar text 0.26 · same kind/surface <!-- rel:467 s=8.818 -->
- [64-bit OID Values in REST Operations Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5508-64-bit-oid-values-in-rest-operations.md>) — similar text 0.14 · same kind <!-- rel:470 s=7.67 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/3147-lr-gp-error-messages.md>) — similar text 0.27 · same surface <!-- rel:39 s=6.299 -->
- [Support International Miles in LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-international-miles-in-lrs.md>) — similar text 0.22 · same kind/surface <!-- rel:271 s=5.517 -->
- [Verify External Events fail in LRS GP tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/verify-external-events-fail-in-lrs-gp.md>) — similar text 0.23 · same surface <!-- rel:809 s=5.514 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Merge events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-events.html) · [Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html) · [Locate route and measures](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/locate-route-and-measures.html) · [Set a time filter](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-a-time-filter.html) · [View the LRS hierarchy](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-the-lrs-hierarchy.html) · [Rename a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/rename-a-route.html) · [Release locks through the LRS Locks table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/lrs-locks-table.html) · [Release locks with the Release Locks tool](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/release-locks.html) · [Create and modify an LRS](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-and-modify-an-lrs.html) · [Create and modify LRS events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-and-modify-lrs-events.html) · [Create and modify LRS intersections](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-and-modify-lrs-intersections.html) · [Create and modify an LRS Network](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-and-modify-an-lrs-network.html) · [View centerline sequence table properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-centerline-sequence-table-properties.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-cartographic-realignment.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html)

_No page matched:_ [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com) · [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [LRS Identify](https://www.google.com/search?q=%22LRS%20Identify%22+site%3Adoc.esri.com) · [Search by Route](https://www.google.com/search?q=%22Search%20by%20Route%22+site%3Adoc.esri.com) · [Split Event](https://www.google.com/search?q=%22Split%20Event%22+site%3Adoc.esri.com) · [Identify Routes](https://www.google.com/search?q=%22Identify%20Routes%22+site%3Adoc.esri.com) · [Enable Time](https://www.google.com/search?q=%22Enable%20Time%22+site%3Adoc.esri.com) · [Translate](https://www.google.com/search?q=%22Translate%22+site%3Adoc.esri.com) · [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com) · [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com) · [Apply Event Behaviors](https://www.google.com/search?q=%22Apply%20Event%20Behaviors%22+site%3Adoc.esri.com) · [Calculate Intersecting Route Measures](https://www.google.com/search?q=%22Calculate%20Intersecting%20Route%20Measures%22+site%3Adoc.esri.com) +65
<!-- docs:end -->

---

## Overview

### Items to address each release

## Test Cases

### TC-U01 — Doc <!-- src: S5 · label Doc -->

**Steps:**
1. Pro X.X What’s New
2. Enterprise XX.X What’s New

## Other content

### Metadata:

- Update LRS Version in metadata

### REST:

- currentVersion updated in LRServer to current Enterprise release number

### Experience Builder:

- Widgets:
  - Add Line Event
    - Single
      - Merge coincident
      - Retire overlaps
    - Multiple
      - Merge coincident
      - Retire overlaps
  - Add Point Event
    - Single
    - Multiple
  - LRS Identify
  - Merge Events
  - Search by Route
    - Coordinates
    - Referent
    - Route and Measure
  - Split Event
- Data Actions
  - LRS Identify
  - Search by Route
  - Table

### Pro:

- Route Editing
  - Create
    - Centerline selection/editing
  - Realign
    - Centerline selection/editing
    - With and without abandonment and recalibration downstream
  - Extend
    - Centerline selection/editing
  - Retire
  - Reassign
    - Merge to adjacent route
    - Form a new route
    - Transfer to another line (line network only)
  - Reverse
  - Test Flip Centerline in Memory with any of Create, Realign, and Extend
- Calibration Points
  - Add
  - Edit
  - Delete
- Event Behavior for carto-realignment
  - Honor Route Measure
  - Honor Referent Location
- Carto-realignment
  - Proportionally Snap
  - Ignore
  - Delete
  - Snap to Vertex
- Tools
  - Split Centerline
    - By Point
    - By Measure
    - Into singlepart features
  - Identify Routes
  - Locate Route and Measures
  - Enable Time
    - Ensure -1 second offset is set and persists when publishing a Feature Service
  - Set Time Filter
    - Today’s date
    - Date range
    - Clear date range
  - LRS Hierarchy
  - Translate
    - Routes
    - Lines
    - Measures
  - Rename
- Conflict Prevention
  - Locks Table
  - Release Locks
- Event Editing
  - Add Point
    - Single
    - Multiple
  - Add Line
    - Single
      - Merge coincident
      - Retire overlaps
    - Multiple
      - Merge coincident
      - Retire overlaps
  - Split
  - Merge
  - DynSeg
    - Merge coincident events option
  - Replace
  - Configure Replacement
  - Attribute Sets
    - Publish attribute sets via CIM; save attribute sets as .rhas file
    - Use an attribute set from FS and from .rhas
  - Attribute Table editing
  - Stationing events
- Geoprocessing Tools
  - Append Events
    - Load Type
      - Add
      - Retire overlaps
      - Retire by Event ID
      - Replace by Event ID
    - Generate Event ID GUIDs for loaded events
    - Generate shapes
  - Append Routes
    - Load Type
      - Add
      - Retire by Route ID
      - Replace by Route ID
    - Load Field
      - RouteID
      - Route Name
    - Consider existing centerlines
  - Apply Event Behaviors
  - Calculate Intersecting Route Measures
  - Calculate Route Concurrencies
  - Delete Routes
    - Delete associated calibration points
    - Delete associated events
    - Delete associated centerlines
  - Derive Event Measures
  - Generate Calibration Points
    - Calibration Direction
      - Digitized direction
      - Measure direction
    - Calibration Method
      - Geometry length
      - M on route
      - Attribute fields
  - Generate Events
  - Generate Intersections
    - Only use routes edited by current user
  - Generate Routes
  - Overlay Events
  - Remove Overlapping Centerlines
  - Reverse Line Orders
  - Translate Event Measures
    - Concurrent Route Matching
      - Any concurrent route
      - Route with matching RouteID
      - All concurrent routes
  - Update Measures From LRS
  - Configuration
    - Configure Address Feature Classes
    - Configure Utility Network Feature Class
    - Remove LRS Entity
      - LRS
      - Network
      - Event
      - Intersection
      - Utility Network Feature Class
      - Address Feature Class
    - LRS
      - Create LRS
      - Create LRS From Existing Dataset
      - Modify LRS
        - ArcMap migration to Pro
        - Conflict Prevention
          - As is
          - Enable
          - Disable
        - Move required feature classes to feature dataset
    - LRS Event
      - Configure External Event With LRS
      - Create LRS Event
      - Create LRS Event From Existing Dataset
      - Disable Derived Measure Fields
      - Disable Referent Fields
      - Disable Stationing Fields
      - Enable Derived Measure Fields
      - Enable Referent Fields
      - Enable Stationing Fields
      - Modify Event Behavior Rules
      - Modify LRS Event
    - LRS Intersection
      - Create LRS Intersection
      - Create LRS Intersection From Existing Dataset
      - Modify LRS Intersection
    - LRS Network
      - Configure Lookup Table
      - Configure Route Dominance Rules
      - Create LRS Network
      - Create LRS Network From Existing Dataset
      - Modify LRS Network
      - Modify Network Calibration Rules
      - Modify Route ID Padding
- LRS Options
  - Keep centerlines chosen and selected
  - Automatically reconcile prior to obtaining locks
  - Warn before allowing route edits that can create physical gaps
  - Set LRS layers in maps to the current date and time when project is opened
  - Merge coincident events in the Dynamic Segmentation table
  - Display measures along route during cursor movement up to this scale
    - Default of 10000
  - Attribute Set Folder Location:
    - Default path
  - Replace Events Folder Location:
    - Default path
  - Preferred solution for documentation
    - Pipeline Referencing
    - Roads and Highways
- Network-specific tests
  - Nonline
  - PostMile
    - Routes within routes
      - Create
      - Reassign
  - Line
    - Spanning line events
    - Derived network
      - Event derived measure fields
  - UNAPR
    - Pipeline Line measure fields
      - Must have matching measure values where centerlines connect
    - Splitting Pipeline Line
  - ADMRH
    - Split Centerline
      - Route edits that split centerlines
        - Retire

### Server:

- REST
  - Acquire Locks
  - Address Layers
  - All Layers
  - Append Events
  - Append Routes
  - Apply Edits
  - Apply Event Behaviors
  - Calibration Point Layer
  - Centerline Layer
  - Centerline Sequence Table
  - Check Events
  - Concurrencies
  - Create Version
  - Delete Version
  - Derive Event Measures
  - Event Layer
  - Export Network
  - Generate Events
  - Generate Intersections
  - Generate Routes
  - Geometry to Measure
  - Geometry to Referent
  - Geometry to Station
  - Get Calibration Configuration
  - Get Cartographic Realignment Configuration
  - Intersection Layer
  - Locks
  - Measure to Geometry
  - Network Layer
  - Non-LRS Layer
  - Query Attribute Set
    - ADMRH/UNAPR centerline input
  - Query Edit Log
  - Query Locks
  - Query Lookup Table
  - Query Route Associations
  - Reconcile Version
  - Redline Layer
  - Referent to Geometry
  - Release Locks
  - Relocate Event
  - Remove Overlapping Centerlines
  - Set Calibration Configuration
  - Set Cartographic Realignment Configuration
  - Station to Geometry
  - Translate
  - Update Measures From LRS
  - Utility Network Layer

### Other

- ADM-RH Integration
  - Centerline or Line Event registered as Address Range feature class
- Unified Pipeline Tools Add-in
- UN-APR Integration
  - Pipeline Line registered as Centerline feature
