# Spike: 64-bit OID in LRS REST

|   |   |
| --- | --- |
| **Kind** | Design Spike · Server |
| **Release** | — |
| **Source** | [Spike 64bitOIDLRSREST.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%2064bitOIDLRSREST.pptx>) |
| **Edited** | 2023-08-01 16:57 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: 64-bit OID in LRS REST"
source_file: "Spike 64bitOIDLRSREST.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%2064bitOIDLRSREST.pptx"
doc_id: 520
doc_kind: "Design Spike"
surface: "Server"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2023-08-01T16:57:03Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["64 bit oid", "lrs rest", "feature class", "rest operations"]
tools: []
products: []
issues: []
related: [{"doc":503,"file":"64-bit-oid-in-lrs-rest-operations__doc503.md","s":6.334},{"doc":518,"file":"spike-64-bit-oid-in-lrs-gp-and-pro-tools__doc518.md","s":5.264},{"doc":515,"file":"spike-64-bit-oid-in-lrs-editing-tools__doc515.md","s":4.973},{"doc":501,"file":"64-bit-oid-in-other-lrs-pro-tools__doc501.md","s":3.615},{"doc":470,"file":"64-bit-oid-values-in-rest-operations-test-plan__doc470.md","s":3.455}]
```
-->

## Summary

Investigation of LRS REST operations handling 64-bit OID values in feature classes or tables. Testing focuses on identifying which LRS REST tools fail with 64-bit OID values, excluding Server GP toolbox tools.

## Related documents

<!-- related:begin -->
- [64-bit OID in LRS REST operations](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-rest-operations__doc503.md>) — similar text 0.44 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:503 -->
- [Spike: 64-bit OID in LRS GP and Pro Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-64-bit-oid-in-lrs-gp-and-pro-tools__doc518.md>) — similar text 0.83 · 2 title words · 1 filename word · same kind/folder <!-- rel:518 -->
- [Spike: 64-bit OID in LRS Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-64-bit-oid-in-lrs-editing-tools__doc515.md>) — similar text 0.80 · 2 title words · 1 filename word · same kind/folder <!-- rel:515 -->
- [64-bit OID in other LRS Pro tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-other-lrs-pro-tools__doc501.md>) — similar text 0.38 · 2 title words · 1 filename word · same folder <!-- rel:501 -->
- [64-bit OID Values in REST Operations Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/64-bit-oid-values-in-rest-operations-test-plan__doc470.md>) — similar text 0.18 · 3 title words · 1 filename word · same surface <!-- rel:470 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)
<!-- docs:end -->

---

## Slide 1 — Spike: 64-bit OID in LRS REST

Spike

## Slide 2 — 64-bit OID LRS REST

Investigate the LRS REST operations that don’t work as expected when encountering a 64-bit OID value (not just configured as 64-bit, but a 64-bit value)
Test on LRS REST operations (but not the Server GP toolbox tools, that’s a different spike) with a 64-bit OID value for the feature class/table being utilized in the tool
Report back with the following:

  - Which, if any, LRS tools don’t work when encountering a feature with a 64-bit OID

## Slide 3 — Assignment

Story Points:
Dev:
