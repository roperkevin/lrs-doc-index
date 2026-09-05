# Route Edit Log Blob Values Comparison

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Source** | [CompareResult_Lrs_Edit_Log_BlobValues.txt](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/CompareResult_Lrs_Edit_Log_BlobValues.txt>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "Route Edit Log Blob Values Comparison"
source_file: "CompareResult_Lrs_Edit_Log_BlobValues.txt"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/CompareResult_Lrs_Edit_Log_BlobValues.txt"
doc_id: 804
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: ""
extracted: 2026-09-04
extraction_lane: plaintext
prompt_version: "v2.0.2"
keywords: ["route edit", "blob data", "carto realign", "route state", "centerline", "realigned portions"]
tools: []
products: []
issues: []
related: [{"doc":573,"file":"global-check-for-unprocessed-edit-log-records-before-allowing-event-edit-within__doc573.md","s":3.309},{"doc":513,"file":"export-network-reassign-transfer-test-plan-v1__doc513.md","s":2.508},{"doc":502,"file":"64-bit-oid-in-lrs-route-editing-tools__doc502.md","s":1.901},{"doc":705,"file":"support-automatic-deselection-of-centerlines__doc705.md","s":1.651},{"doc":515,"file":"spike-64-bit-oid-in-lrs-editing-tools__doc515.md","s":1.51}]
```
-->

## Summary

The document contains a comparison of expected and observed blob data values representing route edit models in XML format. It highlights differences in the realigned portions of a route, specifically the presence of Z coordinate values.

## Related documents

<!-- related:begin -->
- [Global Check for Unprocessed Edit Log Records Before Allowing Event Edit Within a Version](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/global-check-for-unprocessed-edit-log-records-before-allowing-event-edit-within__doc573.md>) — similar text 0.00 · 2 title words · 2 filename words · same surface/folder <!-- rel:573 -->
- [Export Network Reassign Transfer Test Plan V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/export-network-reassign-transfer-test-plan-v1__doc513.md>) — similar text 0.34 · same surface <!-- rel:513 -->
- [64-bit OID in LRS Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-route-editing-tools__doc502.md>) — 1 title word · same surface/folder <!-- rel:502 -->
- [Support automatic deselection of centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-automatic-deselection-of-centerlines__doc705.md>) — same surface/folder <!-- rel:705 -->
- [Spike: 64-bit OID in LRS Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-64-bit-oid-in-lrs-editing-tools__doc515.md>) — similar text 0.00 · same surface/folder <!-- rel:515 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-cartographic-realignment.html)
<!-- docs:end -->

---

Expected BlobDataValue No.0 : b'<RouteEditModel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" SchemaVersion="3"><RouteEditActivity DoNotApplyEventBehaviors="false" OperationTime="2020-05-12T00:00:00" RouteId="Route2" xsi:type="CartoRealignRouteInfo"><RouteStates><RouteState FirstM="0" FromDate="2000-01-01T00:00:00" IsReversed="false" LastM="10" LineOrder="0" RouteId="Route2" /></RouteStates><ModifiedCenterlineId>4673A698-72B1-46D9-B980-C3FBDC2DEC89</ModifiedCenterlineId><RealignedPortions FromX="-4610725.001201599836349" FromY="4272351.40052630007267" ToX="-4597445.261201597750187" ToY="4272583.595526300370693" /></RouteEditActivity></RouteEditModel>'

Observed BlobDataValue No.0 : b'<RouteEditModel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" SchemaVersion="3"><RouteEditActivity DoNotApplyEventBehaviors="false" OperationTime="2020-05-12T00:00:00" RouteId="Route2" xsi:type="CartoRealignRouteInfo"><RouteStates><RouteState FirstM="0" FromDate="2000-01-01T00:00:00" IsReversed="false" LastM="10" LineOrder="0" RouteId="Route2" /></RouteStates><ModifiedCenterlineId>4673A698-72B1-46D9-B980-C3FBDC2DEC89</ModifiedCenterlineId><RealignedPortions FromX="-4610725.001201599836349" FromY="4272351.40052630007267" FromZ="NaN" ToX="-4597445.261201597750187" ToY="4272583.595526300370693" ToZ="0" /></RouteEditActivity></RouteEditModel>'
