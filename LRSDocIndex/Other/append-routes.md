# Append Routes

| Field | Value |
| --- | --- |
| **Doc** | 111 · Other · Server |
| **Product** | — |
| **Release** | 10.7 |
| **Issues** | — |
| **Source** | [lr_append_routes_allowPartialLoading.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/lr_append_routes_allowPartialLoading.docx>) |
| **People** | author Kyle Chin · PE — · dev — |
| **Edited** | 2025-10-30 17:44 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | append routes · route · lrs network · rest api · polyline · validation · geodatabase |
| **Tools** | — |

## Summary

Documentation for the Append Routes operation in the ArcGIS Location Referencing service. It describes the REST API endpoint, required parameters, usage notes, and response formats for appending routes from an input polyline into an LRS Network.

## Related documents

<!-- related:begin -->
- [Append Routes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6380-append-routes-lr.md>) — similar text 0.26 · 2 title words · 2 filename words · same kind/folder <!-- rel:128 s=4.396 -->
- [Append Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6640-append-events-lr.md>) — similar text 0.19 · 1 title word · 1 filename word · same kind/folder <!-- rel:124 s=2.714 -->
- [Append Routes Consider Existing Centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/3004-append-routes-consider-existing-centerlines.md>) — similar text 0.09 · 2 title words · 2 filename words <!-- rel:486 s=2.658 -->
- [Append Routes: Allow Partial Loading Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6380-append-routes-allow-partial-loading.md>) — similar text 0.07 · 2 title words · 1 filename word <!-- rel:137 s=2.449 -->
- [Append Calibration Points To LRS Tool 7203 Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-cp-to-lrs-tool-7203.md>) — similar text 0.07 · 1 title word · 1 filename word <!-- rel:22 s=2.123 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html)
<!-- docs:end -->

---

### Append Routes
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

### Note
Validation results for this tool are written to the ArcGIS Server directory. This file is automatically cleaned up using default 10 minute intervals, which may not be enough time to process all of the validations and write them to the workstation that is running ArcGIS Pro. For larger data loads, it is recommended that you adjust the maximum file age to at least one hour.
Request parameters

| Parameter | Details |
| --- | --- |
| f<br>(Optional) | Specifies the response format. The default response format is html.<br>Values: html \| json \| pjson |
| uploadItemId | The item ID of the uploaded source feature class. The item ID is generated when the source is uploaded to the server . The file geodatabase must be zipped before upload and must contain only one source feature class.<br>The following hierarchy must be maintained in the .zip archive:<br>\|--<filename>.zip<br>\|--<filename >. gdb<br>\|--Source feature class<br>Syntax:<br>uploadItemId =< guid ><br>Example:<br>uploadItemId ="idec5bf57-1649-44ce-bac1-19bd0872a026" |
| routeIdFieldName | The field in the input polyline feature class that will be mapped to the LRS Network route ID. The field type must match the RouteID field type of the target LRS Network and must either be a string or GUID field type. If it is a text field, the field length must be shorter than or equal to the length of the target RouteID field.<br>Syntax:<br>routeIdFieldName ="<field name>"<br>Example:<br>routeIdFieldName =" routeId " |
| routeNameFieldName | The field in the input polyline feature class that will be mapped as the LRS Network route name. The field must be a string field, and the field length must be shorter than or equal to the length of the target route name field.<br>Syntax:<br>routeNameFieldName ="<field name>"<br>Example:<br>routeNameFieldName =" routeName " |
| fromDateFieldName | A date field in the input polyline feature class that will be mapped as the LRS Network from date.<br>Syntax:<br>fromDateFieldName ="<field name>"<br>Example:<br>fromDateFieldName =" fromDate " |
| toDateFieldName | A date field in the input polyline feature class that will be mapped as the LRS Network to date.<br>Syntax:<br>toDateFieldName ="<field name>"<br>Example:<br>toDateFieldName =" toDate " |
| lineIdFieldName<br>(Optional) | The input polyline feature class that will be mapped as the LRS Network line ID. This parameter is only used if the target is an LRS line network. The field type must match the RouteID field type of the centerline sequence table and must either be a string of exactly 38 characters or a GUID field type.<br>Syntax:<br>lineIdFieldName ="<field name>"<br>Example:<br>lineIdFieldName =" lineId " |
| lineNameFieldName<br>(Optional) | The input polyline feature class that will be mapped as the LRS Network line ID. This parameter is only used if the target is an LRS line network. The field type must match the RouteID field type of the centerline sequence table and must either be a string of exactly 38 characters or a GUID field type.<br>Syntax:<br>lineNameFieldName ="<field name>"<br>Example:<br>lineNameFieldName =" lineName " |
| lineOrderFieldName<br>(Optional) | Long integer field in the input polyline feature class that will be mapped as the LRS Network line order. This parameter is only used if the target is an LRS line network.<br>Syntax:<br>lineOrderFieldName ="<field name>"<br>Example:<br>lineOrderFieldName =" lineOrder " |
| fieldMap | Controls how the attribute information in the fields of the source is transferred to the target layer.<br>Syntax:<br>fieldMap =[{" sourceField ":"<field name>"," targetField ":"<field name>"},{" sourceField ":"<field name>"," targetField ":"<field name>"}, ...]<br>Example:<br>fieldMap=[{"sourceField":"SourceFieldName1","targetField":"TargetFieldName1"},{"sourceField":"SourceFieldName1","targetField":"TargetFieldName1"}, ... ] |
| loadType | Specifies how appended routes with measure or temporality overlap with identical route IDs as target network records are loaded into the network feature class.<br>add—Appends the input routes into the target LRS Network.<br>retireByRouteId —Appends the input routes into the target LRS Network and retires any routes in the target LRS Network that have the same route ID and temporality overlap as the appended routes.<br>replaceByRouteId —Appends the input routes into the target LRS Network and deletes any routes in the target LRS Network with the same route ID as the appended routes.<br>Syntax:<br>loadType =<type><br>Values: add \| retireByRouteId \| replaceByRouteId |
| loadField | Specifies whether route ID or route name will be used as target network records are loaded into the network feature class. This parameter will be ignored and default to use routeId when the network does not support route name or the loadType value is retireByRouteId or replaceByRouteId .<br>routeId —Loads by the route ID field.<br>routeName —Loads by the route name field.<br>Syntax:<br>loadField =<field><br>Values: routeId \| routeName |
| considerExistingCenterlines<br>(Optional) | Specifies whether routes will be appended using existing centerline or if new centerlines will be created for the appended routes. This value is set to false by default.<br>Syntax:<br>considerExistingCenterlines ="<value>"<br>Values: true \| false |
| allowPartialLoading (Optional) | Specifies whether routes with no issues will be appended instead of rolling back the entire transaction. This value is set to false by default.<br>Syntax:<br>allowPartialLoading ="<value>"<br>Values: true \| false |
| gdbVersion<br>(Optional) | Specifies the geodatabase version to use. If this parameter is not specified, the published map's version is used.<br>Syntax:<br>gdbVersion =<version><br>Example:<br>gdbVersion ="user1.version1" |
| sessionId<br>(Optional) | Set by a client during long transaction editing on a branch version. The sessionId parameter value is a GUID that clients establish at the beginning and use throughout the edit session. The sessonId parameter ensures isolation during the edit session.<br>Syntax:<br>sessionId =< guid ><br>Example:<br>sessionId ="{E81C2E2D-C6A7-40CB-BF61-FB499E53DD1D}" |
| returnEditMoment<br>(Optional) | Specifies whether the response reports the time edits that were applied. If returnEditMoment is set to true, the server returns the time edits that were applied in the response's editMoment key. The default value is false.<br>Values: true \| false |
| returnServiceEditsOption<br>(Optional) | Returns features edited due to the geodatabase behavior that results from applying the edits. For example, if a feature is deleted and it is the origin in a composite relationship, the destination feature is automatically deleted from the geodatabase. If returnServiceEditsOption is set to originalAndCurrentFeatures , the deleted destination feature is returned along with a reference to the deleted original feature in the response. Note that, even for deletions, the geometry and attributes of the edited feature are returned.<br>Results returned from applyEdits are organized layer by layer. If returnServiceEditsOption is set to originalAndCurrentFeatures , each layer can have edited features returned in an editedFeatures object.<br>Service-level applyEdits response structure:<br>[<br>{<br>id<br>addResults<br>updateResults<br>deleteResults<br>attachments: {<br>addResults<br>updateReults<br>deleteResults<br>}<br>editMoment<br>editedFeatures<br>exceededTransferLimit<br>},<br>{<br>...<br>}<br>]<br>The editedFeatures object returns full features, including the original features prior to deletion, the original and current features for updates, and the current rows for inserts that can contain implicit changes (for example, as a result of a calculation rule).<br>editedFeatures response structure:<br>{<br>" editedFeatures ": [<br>{<br>"adds": [ <feature1>, <feature2>], // current features<br>"updates": [[<originalFeature3>, < currentFeature3>], [<originalFeature4>, < currentFeature4>]],<br>"deletes": [ <feature5>, <feature6>] // original features<br>},<br>]<br>}<br>The response includes no editedFeatures values and exceededTransferLimit as true if the count of edited features to return is more than the maxRecordCount value. If clients are using this parameter to maintain a cache, they should invalidate the cache when exceededTransferLimit is returned as true. If the server encounters an error when generating the list of edits in the response, exceededTransferLimit is returned as true.<br>Edited features are returned in the spatial reference of the feature service as defined by the services spatialReference object or by the spatialReference value of the layers extent object.<br>The default value is none, which does not include editedFeatures values.<br>Values: none \| originalAndCurrentFeatures |

Example usage
The following is a sample URL for adding route records.
URL for adding route records in the target network from the source feature class:

### Note
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

### Append Routes Response
The following is an example of a successful response:

```
{
  "statusURL": "https://organization.example.com/server/sampleserver/arcgis/rest/services/LRSService/MapServer/exts/LRServer/jobs/j1e84dac5934d44c4a52d0b6d4b22de09"
}
```

### Job Result Response
If certain routes fail validation, a zipped file and a text file will be provided. The zipped file includes a file geodatabase with the Skipped Routes feature class, which contains all input route records that were not loaded. The zip file is returned only if allowPartialLoading  is true and one or more input routes are not loaded. The text file contains messages on how to correct the route records that were not loaded. In this scenario, the following JSON response is returned:
