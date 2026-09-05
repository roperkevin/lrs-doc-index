# 64 bit OID Other Pro LR Tools – Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#5510](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5510) |
| **Source** | [64bitOIDLRSProTools_testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/64bitOIDLRSProTools_testplan.pptx>) |
| **Edited** | 2023-10-20 20:57 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "64 bit OID Other Pro LR Tools – Test Plan"
source_file: "64bitOIDLRSProTools_testplan.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/64bitOIDLRSProTools_testplan.pptx"
doc_id: 482
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: "Claire Wang"
dev: "Sharon"
author: "Lakshmi Ananthanarayanan"
last_edited_by: "Claire Wang"
last_edited: "2023-10-20T20:57:04Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["64 bit oid", "split centerline", "locate route and measures", "identify", "translate", "rename route", "lrs hierarchy", "attribute sets", "event editing", "feature classes"]
tools: ["Split Centerline", "Locate Route and Measures", "Identify", "Translate", "Rename Route", "LRS Hierarchy", "Attribute Sets"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#5510"]
related: [{"doc":481,"file":"64-bit-oid-lrs-event-editing-tools-test-plan__doc481.md","s":7.917},{"doc":501,"file":"64-bit-oid-in-other-lrs-pro-tools__doc501.md","s":7.846},{"doc":467,"file":"64-bit-oid-gp-tools-test-plan__doc467.md","s":6.913},{"doc":518,"file":"spike-64-bit-oid-in-lrs-gp-and-pro-tools__doc518.md","s":5.536},{"doc":502,"file":"64-bit-oid-in-lrs-route-editing-tools__doc502.md","s":5.45}]
```
-->

## Summary

Test plan for verifying that various LRS editing tools support 64-bit OID values in schema elements. Covers positive and negative test cases across multiple tools and network types, ensuring correct handling of 64-bit OIDs in feature classes and associated events.

## Related documents

<!-- related:begin -->
- [64 bit OID LRS Event Editing Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/64-bit-oid-lrs-event-editing-tools-test-plan__doc481.md>) — similar text 0.56 · 3 title words · 3 filename words · same kind/surface/pe/dev/folder <!-- rel:481 -->
- [64-bit OID in other LRS Pro tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-other-lrs-pro-tools__doc501.md>) — similar text 0.54 · 5 title words · 3 filename words · same surface <!-- rel:501 -->
- [64 bit OID GP Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/64-bit-oid-gp-tools-test-plan__doc467.md>) — similar text 0.50 · 3 title words · 2 filename words · same kind/surface/pe/folder <!-- rel:467 -->
- [Spike: 64-bit OID in LRS GP and Pro Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-64-bit-oid-in-lrs-gp-and-pro-tools__doc518.md>) — similar text 0.44 · 4 title words · 1 filename word · same surface <!-- rel:518 -->
- [64-bit OID in LRS Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-route-editing-tools__doc502.md>) — similar text 0.46 · 3 title words · 2 filename words · same surface <!-- rel:502 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html) · [Locate route and measures](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/locate-route-and-measures.html) · [Rename a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/rename-a-route.html) · [View the LRS hierarchy](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-the-lrs-hierarchy.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [Identify](https://www.google.com/search?q=%22Identify%22+site%3Adoc.esri.com) · [Translate](https://www.google.com/search?q=%22Translate%22+site%3Adoc.esri.com) · [Attribute Sets](https://www.google.com/search?q=%22Attribute%20Sets%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — 64 bit OID Other Pro LR Tools – Test Plan

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5510

PE: Claire Wang
Dev: Sharon

## Slide 2

Data:
The scope of testing for this user story is to test everything on 64 bit OID.

- These LRS editing tools can support actual 64-bit values in the schema items updated by the tools
    - Split Centerline
    - Locate Route and Measures
    - Identify
    - Translate
    - Rename Route
    - LRS Hierarchy
    - Attribute Sets
- Test with line and non line networks (RH, APR, PoM, and APRUN (currently unavailable for 64 bit yet))
- Test on each tool (breadth, not depth)
- Ensure all schema elements impacted by each event edit has a 64-bit OID value
- Test with fgdb, egdb (branch), and FS in Pro
- Test with all layers and all records with 64 bit OID
Automation
Automate the tools that have been previously automated in a single test
Documentation
N/A

## Slide 3

Verification

- Verify the tools can handle 64-bit OID values in any schema element that is read/updated
  - Centerline sequence table
  - Centerlines
  - Calibration points
  - Network feature classes
  - Event feature classes
- Verify the tools proceed correctly and the OID fields in associated features are intact

## Slide 4 — Positive cases

Do the following tests for available features in RH, APR, PoM, and APRUN

- Split Centerline
- Locate Route and Measures
- Identify
  - A single route
  - Route with time slices
  - Concurrent route
  - Make sure the hover also shows the correct Route Name/ID
- Translate
  - Route/Line ID – Route/Line Name
  - Translate measures for coincident or intersecting routes
  - Translate measures between two networks
- Rename
  - Rename a route – also check associated events
  - Rename a line – also check associated routes and derived network
- LRS Hierarchy
  - Open and check layer property
  - Add layer to map, open its attribute table and see oids in 64 bit
- Attribute Sets
  - Publish attribute sets via CIM and confirm they work well in FS
  - Create new attribute sets in FS and confirm they work well
Negative cases

- Verify a couple errors
