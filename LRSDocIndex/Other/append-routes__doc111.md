# Append Routes

|   |   |
| --- | --- |
| **Kind** | Other · Server |
| **Release** | 10.7 |
| **Source** | [lr_append_routes_allowPartialLoading.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/lr_append_routes_allowPartialLoading.docx>) |
| **Edited** | 2025-10-30 17:44 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Append Routes"
source_file: "lr_append_routes_allowPartialLoading.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/lr_append_routes_allowPartialLoading.docx"
doc_id: 111
doc_kind: "Other"
surface: "Server"
doc_revision: ""
target_release: "10.7"
pe: ""
dev: ""
author: "Kyle Chin"
last_edited_by: ""
last_edited: "2025-10-30T17:44:24.3589182Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["append routes", "route", "lrs network", "rest api", "polyline", "validation", "geodatabase"]
tools: []
products: []
issues: []
related: [{"doc":128,"file":"append-routes-location-referencing__doc128.md","s":4.396},{"doc":124,"file":"append-events-location-referencing__doc124.md","s":2.714},{"doc":486,"file":"append-routes-consider-existing-centerlines__doc486.md","s":2.658},{"doc":137,"file":"append-routes-allow-partial-loading-test-plan__doc137.md","s":2.449},{"doc":22,"file":"append-calibration-points-to-lrs-tool-7203-test-plan__doc22.md","s":2.123}]
```
-->

## Summary

Documentation for the Append Routes operation in the ArcGIS Location Referencing service. It describes the REST API endpoint, required parameters, usage notes, and response formats for appending routes from an input polyline into an LRS Network.

## Related documents

<!-- related:begin -->
- [Append Routes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-routes-location-referencing__doc128.md>) — similar text 0.26 · 2 title words · 2 filename words · same kind/folder <!-- rel:128 -->
- [Append Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-events-location-referencing__doc124.md>) — similar text 0.19 · 1 title word · 1 filename word · same kind/folder <!-- rel:124 -->
- [Append Routes Consider Existing Centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-consider-existing-centerlines__doc486.md>) — similar text 0.09 · 2 title words · 2 filename words <!-- rel:486 -->
- [Append Routes: Allow Partial Loading Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-routes-allow-partial-loading-test-plan__doc137.md>) — similar text 0.07 · 2 title words · 1 filename word <!-- rel:137 -->
- [Append Calibration Points To LRS Tool 7203 Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-calibration-points-to-lrs-tool-7203-test-plan__doc22.md>) — similar text 0.07 · 1 title word · 1 filename word <!-- rel:22 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html)
<!-- docs:end -->

---

Append Routes
URL:
https://<network-layer-url>/appendRoutes
Methods:
GET
Required Capability:
The ArcGIS Location Referencing license is required to use this resource.
Version Introduced:
10.7
Description
This operation appends routes from an input polyline into an LRS Network.
Note
Validation results for this tool are written to the ArcGIS Server directory. This file is automatically cleaned up using default 10 minute intervals, which may not be enough time to process all of the validations and write them to the workstation that is running ArcGIS Pro. For larger data loads, it is recommended that you adjust the maximum file age to at least one hour.
Request parameters

| Parameter | Details |
| --- | --- |
| f (Optional) | Specifies the response format. The default response format is html. Values: html \| json \| pjson |
| uploadItemId | The item ID of the uploaded source feature class. The item ID is generated when the source is uploaded to the server . The file geodatabase must be zipped before upload and must contain only one source feature class. The following hierarchy must be maintained in the .zip archive: \|--<filename>.zip \|--<filename >. gdb \|--Source feature class Syntax: uploadItemId =< guid > Example: uploadItemId ="idec5bf57-1649-44ce-bac1-19bd0872a026" |
| routeIdFieldName | The field in the input polyline feature class that will be mapped to the LRS Network route ID. The field type must match the RouteID field type of the target LRS Network and must either be a string or GUID field type. If it is a text field, the field length must be shorter than or equal to the length of the target RouteID field. Syntax: routeIdFieldName ="<field name>" Example: routeIdFieldName =" routeId " |
| routeNameFieldName | The field in the input polyline feature class that will be mapped as the LRS Network route name. The field must be a string field, and the field length must be shorter than or equal to the length of the target route name field. Syntax: routeNameFieldName ="<field name>" Example: routeNameFieldName =" routeName " |
| fromDateFieldName | A date field in the input polyline feature class that will be mapped as the LRS Network from date. Syntax: fromDateFieldName ="<field name>" Example: fromDateFieldName =" fromDate " |
| toDateFieldName | A date field in the input polyline feature class that will be mapped as the LRS Network to date. Syntax: toDateFieldName ="<field name>" Example: toDateFieldName =" toDate " |
| lineIdFieldName (Optional) | The input polyline feature class that will be mapped as the LRS Network line ID. This parameter is only used if the target is an LRS line network. The field type must match the RouteID field type of the centerline sequence table and must either be a string of exactly 38 characters or a GUID field type. Syntax: lineIdFieldName ="<field name>" Example: lineIdFieldName =" lineId " |
| lineNameFieldName (Optional) | The input polyline feature class that will be mapped as the LRS Network line ID. This parameter is only used if the target is an LRS line network. The field type must match the RouteID field type of the centerline sequence table and must either be a string of exactly 38 characters or a GUID field type. Syntax: lineNameFieldName ="<field name>" Example: lineNameFieldName =" lineName " |
| lineOrderFieldName (Optional) | Long integer field in the input polyline feature class that will be mapped as the LRS Network line order. This parameter is only used if the target is an LRS line network. Syntax: lineOrderFieldName ="<field name>" Example: lineOrderFieldName =" lineOrder " |
| fieldMap | Controls how the attribute information in the fields of the source is transferred to the target layer. Syntax: fieldMap =[{" sourceField ":"<field name>"," targetField ":"<field name>"},{" sourceField ":"<field name>"," targetField ":"<field name>"}, ...] Example: fieldMap=[{"sourceField":"SourceFieldName1","targetField":"TargetFieldName1"},{"sourceField":"SourceFieldName1","targetField":"TargetFieldName1"}, ... ] |
| loadType | Specifies how appended routes with measure or temporality overlap with identical route IDs as target network records are loaded into the network feature class. add—Appends the input routes into the target LRS Network. retireByRouteId —Appends the input routes into the target LRS Network and retires any routes in the target LRS Network that have the same route ID and temporality overlap as the appended routes. replaceByRouteId —Appends the input routes into the target LRS Network and deletes any routes in the target LRS Network with the same route ID as the appended routes. Syntax: loadType =<type> Values: add \| retireByRouteId \| replaceByRouteId |
| loadField | Specifies whether route ID or route name will be used as target network records are loaded into the network feature class. This parameter will be ignored and default to use routeId when the network does not support route name or the loadType value is retireByRouteId or replaceByRouteId . routeId —Loads by the route ID field. routeName —Loads by the route name field. Syntax: loadField =<field> Values: routeId \| routeName |
| considerExistingCenterlines (Optional) | Specifies whether routes will be appended using existing centerline or if new centerlines will be created for the appended routes. This value is set to false by default. Syntax: considerExistingCenterlines ="<value>" Values: true \| false |
| allowPartialLoading (Optional) | Specifies whether routes with no issues will be appended instead of rolling back the entire transaction. This value is set to false by default. Syntax: allowPartialLoading ="<value>" Values: true \| false |
| gdbVersion (Optional) | Specifies the geodatabase version to use. If this parameter is not specified, the published map's version is used. Syntax: gdbVersion =<version> Example: gdbVersion ="user1.version1" |
| sessionId (Optional) | Set by a client during long transaction editing on a branch version. The sessionId parameter value is a GUID that clients establish at the beginning and use throughout the edit session. The sessonId parameter ensures isolation during the edit session. Syntax: sessionId =< guid > Example: sessionId ="{E81C2E2D-C6A7-40CB-BF61-FB499E53DD1D}" |
| returnEditMoment (Optional) | Specifies whether the response reports the time edits that were applied. If returnEditMoment is set to true, the server returns the time edits that were applied in the response's editMoment key. The default value is false. Values: true \| false |
| returnServiceEditsOption (Optional) | Returns features edited due to the geodatabase behavior that results from applying the edits. For example, if a feature is deleted and it is the origin in a composite relationship, the destination feature is automatically deleted from the geodatabase. If returnServiceEditsOption is set to originalAndCurrentFeatures , the deleted destination feature is returned along with a reference to the deleted original feature in the response. Note that, even for deletions, the geometry and attributes of the edited feature are returned. Results returned from applyEdits are organized layer by layer. If returnServiceEditsOption is set to originalAndCurrentFeatures , each layer can have edited features returned in an editedFeatures object. Service-level applyEdits response structure: [ { id addResults updateResults deleteResults attachments: { addResults updateReults deleteResults } editMoment editedFeatures exceededTransferLimit }, { ... } ] The editedFeatures object returns full features, including the original features prior to deletion, the original and current features for updates, and the current rows for inserts that can contain implicit changes (for example, as a result of a calculation rule). editedFeatures response structure: { " editedFeatures ": [ { "adds": [ <feature1>, <feature2>], // current features "updates": [[<originalFeature3>, < currentFeature3>], [<originalFeature4>, < currentFeature4>]], "deletes": [ <feature5>, <feature6>] // original features }, ] } The response includes no editedFeatures values and exceededTransferLimit as true if the count of edited features to return is more than the maxRecordCount value. If clients are using this parameter to maintain a cache, they should invalidate the cache when exceededTransferLimit is returned as true. If the server encounters an error when generating the list of edits in the response, exceededTransferLimit is returned as true. Edited features are returned in the spatial reference of the feature service as defined by the services spatialReference object or by the spatialReference value of the layers extent object. The default value is none, which does not include editedFeatures values. Values: none \| originalAndCurrentFeatures |

Example usage
The following is a sample URL for adding route records.
URL for adding route records in the target network from the source feature class:
Note
Special characters in the URL path must be encoded when using the ArcGIS REST API.
https://sampleserverorganization.example.com/server/rest/services/LRSService/MapServer/exts/LRServer/networkLayers/1/appendRoutes?returnServiceEditsOption=originalAndCurrentFeatures&returnEditMoment=true&uploadItemId=idec5bf57-1649-44ce-bac1-19bd0872a026&fieldMap=[{"sourceField":"SourceFieldName1","targetField":"TargetFieldName1"},{"sourceField":"SourceFieldName1","targetField":"TargetFieldName1"}]&loadType=add&loadField=routeId&considerExistingCenterlines=false&routeIdFieldName=ROUTEID&routeNameFieldName=ROUTENAME&fromDateFieldName=FROMDATE&toDateFieldName=TODATE&lineIdFieldName=LINEID&lineNameFieldName=LINENAME&lineOrderFieldName=ORDERID&f=json&gdbVersion=sde.DEFAULT&sessionId={FA6E2656-AD4E-4FDD-A484-80479C53F231}
JSON Response syntax
Query this job URL to get progress updates and results of the operation.

```
{
  "statusURL": "<jobIdURL>"
}
```

JSON Response example
The tabbed sections below contain example responses.
Append Routes Response
The following is an example of a successful response:

```
{
  "statusURL": "https://organization.example.com/server/sampleserver/arcgis/rest/services/LRSService/MapServer/exts/LRServer/jobs/j1e84dac5934d44c4a52d0b6d4b22de09"
}
```

Job Result Response
If certain routes fail validation, a zipped file and a text file will be provided. The zipped file includes a file geodatabase with the Skipped Routes feature class, which contains all input route records that were not loaded. The zip file is returned only if allowPartialLoading  is true and one or more input routes are not loaded. The text file contains messages on how to correct the route records that were not loaded. In this scenario, the following JSON response is returned:
