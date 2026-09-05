# Support rounding output measures in Derive Event Measures tool

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing |
| **Source** | [Support rounding output measures in Derive Event Measures.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20rounding%20output%20measures%20in%20Derive%20Event%20Measures.pptx>) |
| **Edited** | 2020-04-01 19:17 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support rounding output measures in Derive Event Measures tool"
source_file: "Support rounding output measures in Derive Event Measures.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20rounding%20output%20measures%20in%20Derive%20Event%20Measures.pptx"
doc_id: 823
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2020-04-01T19:17:17Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["derive event measures", "rounding", "m tolerance", "pipeline referencing", "geoprocessing tool"]
tools: ["Derive Event Measures"]
products: ["Pipeline Referencing"]
issues: []
related: [{"doc":273,"file":"support-search-tolerance-parameter-in-update-measures-from-lrs-tool__doc273.md","s":4.327},{"doc":881,"file":"create-lrs-intersection-from-existing-feature-class-geoprocessing-tool__doc881.md","s":2.878},{"doc":809,"file":"verify-external-events-fail-in-lrs-gp-tools__doc809.md","s":2.258},{"doc":42,"file":"linear-referencing-ribbon-unified-experience__doc42.md","s":2.248},{"doc":885,"file":"arcgis-pipeline-referencing-an-introduction__doc885.md","s":1.437}]
```
-->

## Summary

User story for adding an optional parameter to the Derive Event Measures geoprocessing tool to support rounding of output measures based on M tolerance. Includes testing requirements to verify correct rounding behavior and updates to automated tests and documentation.

## Related documents

<!-- related:begin -->
- [Support Search Tolerance Parameter in Update Measures from LRS Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-search-tolerance-parameter-in-update-measures-from-lrs-tool__doc273.md>) — similar text 0.16 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:273 -->
- [Create LRS Intersection From Existing Feature Class Geoprocessing Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-lrs-intersection-from-existing-feature-class-geoprocessing-tool__doc881.md>) — similar text 0.06 · 1 title word · same kind/surface/folder <!-- rel:881 -->
- [Verify External Events fail in LRS GP tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/verify-external-events-fail-in-lrs-gp-tools__doc809.md>) — similar text 0.10 · same kind/surface/folder <!-- rel:809 -->
- [Linear Referencing Ribbon – Unified Experience](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/linear-referencing-ribbon-unified-experience__doc42.md>) — similar text 0.04 · same kind/surface/folder <!-- rel:42 -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/arcgis-pipeline-referencing-an-introduction__doc885.md>) — similar text 0.03 · same surface/folder <!-- rel:885 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Tolerance and resolution settings for the LRS](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/tolerance-and-resolution-settings-for-the-lrs.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html)

_No page matched:_ [Derive Event Measures](https://www.google.com/search?q=%22Derive%20Event%20Measures%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support rounding output measures in Derive Event Measures tool

User Story

## Slide 2 — User Story

As a Pipeline Referencing user, I need the Derive Event Measures tool to support rounding measures, so that my derived events always begin/end without decimals beyond the significant digits.

## Slide 3 — Rounding measures in Derive Event Measures

Add an optional parameter to the Derive Event Measures GP tool called “Round measures to remove extraneous decimals”
When unchecked, run the tool exactly as we do today
When checked, we need to round the derived event measures from the tool no more than the M tolerance to remove any extraneous decimals

  - Example: 0.00000018 would change to 0 when the M tolerance is 0.0003
  - Example: 0.00000018 would remain to 0.00000018 when the M tolerance is 0.00000003
  - Example: 11.49999991 would change to 11.5 when the M tolerance is 0.00001
  - Example: 11.49999991 would remain to 11. 49999991 when the M tolerance is 0.000000001
  - Example: 107.6529993 would change to 107.653 when the M tolerance is 0.000005
  - Example: 107.6529993 would remain to 107.6529993 when the M tolerance is 0.0000005
Store the values for the record in the database (instead of just rounding them in the Pro display)

## Slide 4 — Testing

Verify both CS and FS
Run without the parameter checked to ensure nothing changes
Run with the parameter checked and verify decimals smaller than M tolerance round correctly
Run with parameter checked and verify decimals larger than M tolerance do not round more than the M tolerance

## Slide 5 — Automation

Update the existing Derive Event Measures automated tests

## Slide 6 — Doc

Update the existing GP topic for the new parameter

## Slide 7 — Assignment

Story Points:
Dev:
PE:
