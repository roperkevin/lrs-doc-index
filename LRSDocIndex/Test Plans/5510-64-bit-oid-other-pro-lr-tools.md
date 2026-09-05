# 64 bit OID Other Pro LR Tools – Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 482 · Test Plan · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#5510](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5510) |
| **Source** | [64bitOIDLRSProTools_testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/64bitOIDLRSProTools_testplan.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE Claire Wang · dev Sharon |
| **Edited** | 2023-10-20 20:57 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | 64 bit oid · split centerline · locate route and measures · identify · translate · rename route · lrs hierarchy · attribute sets · event editing · feature classes |
| **Tools** | Split Centerline · Locate Route and Measures · Identify · Translate · Rename Route · LRS Hierarchy · Attribute Sets |

## Summary

Test plan for verifying that various LRS editing tools support 64-bit OID values in schema elements. Covers positive and negative test cases across multiple tools and network types, ensuring correct handling of 64-bit OIDs in feature classes and associated events.

## Related documents

<!-- related:begin -->
- [64 bit OID LRS Event Editing Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5507-64-bit-oid-lrs-event-editing-tools.md>) — similar text 0.56 · 3 title words · 3 filename words · same kind/surface/pe/dev/folder <!-- rel:481 s=7.917 -->
- [64-bit OID in other LRS Pro tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-other-lrs-pro-tools.md>) — similar text 0.54 · 5 title words · 3 filename words · same surface <!-- rel:501 s=7.846 -->
- [64 bit OID GP Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5509-64-bit-oid-gp.md>) — similar text 0.50 · 3 title words · 2 filename words · same kind/surface/pe/folder <!-- rel:467 s=6.913 -->
- [Spike: 64-bit OID in LRS GP and Pro Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-gp-and-pro-tools.md>) — similar text 0.44 · 4 title words · 1 filename word · same surface <!-- rel:518 s=5.536 -->
- [64-bit OID in LRS Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-route-editing-tools.md>) — similar text 0.46 · 3 title words · 2 filename words · same surface <!-- rel:502 s=5.45 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html) · [Locate route and measures](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/locate-route-and-measures.html) · [Rename a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/rename-a-route.html) · [View the LRS hierarchy](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-the-lrs-hierarchy.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [Identify](https://www.google.com/search?q=%22Identify%22+site%3Adoc.esri.com) · [Translate](https://www.google.com/search?q=%22Translate%22+site%3Adoc.esri.com) · [Attribute Sets](https://www.google.com/search?q=%22Attribute%20Sets%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — 64 bit OID Other Pro LR Tools – Test Plan <!-- slide 1 -->

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5510

PE: Claire Wang
Dev: Sharon

### Slide 2 <!-- slide 2 -->

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

### Slide 3 <!-- slide 3 -->

Verification

- Verify the tools can handle 64-bit OID values in any schema element that is read/updated
  - Centerline sequence table
  - Centerlines
  - Calibration points
  - Network feature classes
  - Event feature classes
- Verify the tools proceed correctly and the OID fields in associated features are intact

## Test Cases

### TC-N01 — Verify a couple errors <!-- src: S4 · slide 4 · Negative cases · 1 -->

## Other content

### Slide 4 — Positive cases <!-- slide 4 -->

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
