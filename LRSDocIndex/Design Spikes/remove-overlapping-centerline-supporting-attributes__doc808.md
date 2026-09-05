# Remove Overlapping Centerline Supporting Attributes

|   |   |
| --- | --- |
| **Kind** | Design Spike · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Source** | [Remove Overlapping Centerlines supporting attributes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Remove%20Overlapping%20Centerlines%20supporting%20attributes.pptx>) |
| **Edited** | 2020-05-11 00:48 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Remove Overlapping Centerline Supporting Attributes"
source_file: "Remove Overlapping Centerlines supporting attributes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Remove%20Overlapping%20Centerlines%20supporting%20attributes.pptx"
doc_id: 808
doc_kind: "Design Spike"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2020-05-11T00:48:02Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["centerlines", "attributes", "remove overlapping centerlines", "apr un integration", "geoprocessing tool", "attribute merging"]
tools: ["Remove Overlapping Centerlines", "Append Routes"]
products: ["Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":747,"file":"remove-overlapping-centerlines-3d-support__doc747.md","s":4.858},{"doc":776,"file":"support-complex-route-shapes-in-remove-overlapping-centerlines-gp-tool__doc776.md","s":4.764},{"doc":741,"file":"append-routes-with-existing-utility-network-centerlines__doc741.md","s":3.252},{"doc":486,"file":"append-routes-consider-existing-centerlines__doc486.md","s":3.186},{"doc":115,"file":"regression-testing-task-list-v1__doc115.md","s":2.352}]
```
-->

## Summary

This document describes enhancing the Remove Overlapping Centerlines geoprocessing tool to support and respect attributes during execution, especially in an APR-UN integrated environment. It outlines attribute handling rules when overlapping centerlines exist and details testing scenarios to verify correct behavior. It also mentions updating automation and documentation accordingly.

## Related documents

<!-- related:begin -->
- [Remove Overlapping Centerlines 3D support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/remove-overlapping-centerlines-3d-support__doc747.md>) — similar text 0.17 · 2 title words · 3 filename words · same surface/folder <!-- rel:747 -->
- [Support Complex Route Shapes in Remove Overlapping Centerlines GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-remove-overlapping-centerlines-gp-tool__doc776.md>) — similar text 0.20 · 2 title words · 3 filename words · same surface/folder <!-- rel:776 -->
- [Append Routes with existing Utility Network centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-with-existing-utility-network-centerlines__doc741.md>) — similar text 0.26 · 1 filename word · same surface/folder <!-- rel:741 -->
- [Append Routes Consider Existing Centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-consider-existing-centerlines__doc486.md>) — similar text 0.24 · 1 filename word · same surface/folder <!-- rel:486 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/regression-testing-task-list-v1__doc115.md>) — similar text 0.12 · same surface <!-- rel:115 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [Remove Overlapping Centerlines](https://www.google.com/search?q=%22Remove%20Overlapping%20Centerlines%22+site%3Adoc.esri.com) · [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Remove Overlapping Centerline supporting attributes

Spike

## Slide 2 — User Story

As a LRS data loader, I need the Remove Overlapping Centerlines tool to support attributes, so that I don’t lose existing attributes from the UN when running the tool.

Cases
APR-UN integration

## Slide 3 — Remove Overlapping Centerlines supporting attributes

Enhance the Remove Overlapping Centerlines GP tool to support and respect attributes
Note this may cause us to not delete existing centerlines, but instead find an effective way to merge them
If an existing centerline has attributes, respect those when the tool is executed
If there is only one centerline at the location, nothing should change
If there are two or more centerlines at the location, compare the existing attributes

  - If one is populated and the other is null, keep the populated attribute (note there may be the need to mix and match attributes between the overlapping centerlines)
  - If both are populated, pick one to keep and alert the user in the output file that there might have been lost attributes (this includes the Centerline ID field)
  - Exclude system fields like Editor Tracking, Global IDs, OIDs, etc.
Keep Global IDs intact when possible to prevent issues with UN integration

## Slide 4 — Testing

Test the tool in a combined APR-UN environment
Test creating a centerline with UN attributes, then using the Append Routes tool to load a route onto the same location as the existing centerline
Test with no overlapping centerlines to verify nothing changes
Test with overlapping centerlines where only one has populated attributes
Test with overlapping centerlines where one centerline has only CenterlineID populated and the other centerline has all other attributes besides CenterlineID populated
Test with overlapping centerlines where multiple centerlines have populated attributes that clash

## Slide 5 — Automation

Update/Add to the existing automation for the tool.

## Slide 6 — Documentation

Add a note to the existing topic mentioning attributes being respected.

## Slide 7 — Assignment

Story Points:
Dev:
PE:
