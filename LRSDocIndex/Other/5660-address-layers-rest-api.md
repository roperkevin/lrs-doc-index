# Address Layers REST API

| Field | Value |
| --- | --- |
| **Doc** | 405 · Other · Server |
| **Product** | — |
| **Release** | 11.3 |
| **Issues** | [ArcGISPro/ps-location-referencing#5660](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5660) |
| **Source** | [5660_AddressingLayers.REST.API.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5660_AddressingLayers.REST.API.docx>) |
| **People** | author Michael Polkanov · PE — · dev — |
| **Edited** | 2024-03-14 22:39 by Ignacia Galvan |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | address layers · address range · site address · rest api · linear referencing geodatabase · feature class · json response |
| **Tools** | — |

## Summary

Documentation for the Address Layers REST API resource in a linear referencing geodatabase. Describes the Address Range and Site Address layers, their properties, request parameters, and JSON response format with examples.

## Related documents

<!-- related:begin -->
- [Pro 3.3 and 11.3 Iteration Issue Tracking](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Schedules/504-pro-3-3-and-11-3-iteration-issue-tracking.md>) — shared issue ArcGISPro/ps-location-referencing#5660 · similar text 0.01 · same folder <!-- rel:366 s=1000.751 -->
- [Manage Address and Roadway Characteristic Data Together](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/5646-manage-address-and-roadway-characteristic-data-together.md>) — similar text 0.06 · 1 title word · same kind/folder <!-- rel:400 s=2.115 -->
- [Manage Address and Roadway Characteristic Data Together](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/5930-manage-address-and-roadway-characteristic-data-together.md>) — similar text 0.06 · 1 title word · same kind/folder <!-- rel:327 s=2.112 -->
- [Manage Roads and Highways with Address Data Management](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/5646-manage-rh-with-address-data-management.md>) — similar text 0.05 · 1 title word · same kind/folder <!-- rel:403 s=2.1 -->
- [Configure Addressing Feature Classes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/5645-configure-addressing-feature-classes-lr.md>) — similar text 0.09 · 1 filename word · same kind <!-- rel:427 s=1.986 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View site address point properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-site-address-point-properties.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)
<!-- docs:end -->

---

## Address Layers
URL:
https://<LinearReferencingService-url>/addressLayers/<layerId>
Methods:
GET
Version Introduced:
11.3

### Description

###### Note
The ArcGIS Location Referencing license is required to use this resource.
This operation represents address layers in a linear referencing geodatabase. The Address Range layer contains polyline features, the Site Address layer contains point features.

### Request parameters

| Parameter | Details |
| --- | --- |
| f | Optional parameter to specify the response format. The default response format is html .<br>Values: html \| json \| pjson |

### Example usage
URL for addresslayer ID 4.
http://sampleserver/arcgis/rest/services/MyLRS/MapServer/exts/LRServer/addressLayers/4

### JSON Rresponse syntax
{
  "id": <layerId>,
  "name": "<layerName>",
  "type": "<layerType>",  // esriLRSAddressLayer
  "featureClassName": "< featureClassName>",  // the backing feature class name
  "isDataVersioned": <true | false>,
  "isBranchVersioned": <true | false>,
  "versionName": "<versionName>",
  "dateFormat": "<sqlDateFormat>",  // one of: esriLRSDateFormatStandard, esriLRSDateFormatFileGDB, esriLRSDateFormatOracle
  "lrs": {
    "id": "<id>",
    "name": "<name>"
  },
  "leftFromAddressFieldName": "<leftFromAddressFieldName>",  // optional, populated for only for the Address Range layer
  "leftToAddressFieldName": "<leftToAddressFieldName>",  // optional, populated for only for the Address Range layer
  "rightFromAddressFieldName": "<rightFromAddressFieldName>",  // optional, populated for only for the Address Range layer
  "rightFromAddressFieldName": "<rightFromAddressFieldName>",  // optional, populated for only for the Address Range layer
  "addressNumberFieldName": "<addressNumberFieldName>",  // optional, populated for only for the Site Address layer
  "fields": [
    {
      "name": "<fieldName1>",
      "type": "<fieldType1>",
      "alias": "<fieldAlias1>",
      "length": <length1>,
      "editable": <true | false>,
      "nullable": <true | false>,
      "defaultValue": <defaultValue1>,
      "domain": <domain1>

```
    },
    {
```

      "name": "<fieldName2>",
      "type": "<fieldType2>",
      "alias": "<fieldAlias2>",
      "length": <length2>,
      "editable": <true | false>,
      "nullable": <true | false>,
      "defaultValue": <defaultValue2>,
       "domain": <domain2>

```
    },
   ...
  ]
}
```

### JSON Rresponse example
{
 "id": 4,
 "name": "Centerline",
 "type": "esriLRSAddressLayer",
 "featureClassName": "ApplyEdits4ComplexEvents.DBO.Centerline",
 "isDataVersioned": true,
 "isBranchVersioned": true,
 "versionName": "sde.DEFAULT",
 "dateFormat": "esriLRSDateFormatStandard",
 "lrs": {
  "id": "2418B34D-1C14-455E-A326-E5278EE5189E",
  "name": "Alrs"
 },
 "leftFromAddressFieldName": "LF",
 "leftToAddressFieldName": "LT",
 "rightFromAddressFieldName": "RF",
 "rightToAddressFieldName": "RT",
 "fields": [
  {
   "name": "OBJECTID",
   "type": "esriFieldTypeOID",
   "alias": "OBJECTID",
   "editable": false,
   "nullable": false,
   "defaultValue": null,
   "domain": null

```
  },
  {
```

   "name": "CenterlineId",
   "type": "esriFieldTypeGUID",
   "alias": "CenterlineId",
   "length": 38,
   "editable": true,
   "nullable": true,
   "defaultValue": null,
   "domain": null

```
  },
  {
```

   "name": "GlobalID",
   "type": "esriFieldTypeGlobalID",
   "alias": "GlobalID",
   "length": 38,
   "editable": false,
   "nullable": false,
   "defaultValue": null,
   "domain": null

```
  },
  {
```

   "name": "created_user",
   "type": "esriFieldTypeString",
   "alias": "created_user",
   "length": 255,
   "editable": false,
   "nullable": true,
   "defaultValue": null,
   "domain": null

```
  },
  {
```

   "name": "created_date",
   "type": "esriFieldTypeDate",
   "alias": "created_date",
   "length": 8,
   "editable": false,
   "nullable": true,
   "defaultValue": null,
   "domain": null

```
  },
  {
```

   "name": "last_edited_user",
   "type": "esriFieldTypeString",
   "alias": "last_edited_user",
   "length": 255,
   "editable": false,
   "nullable": true,
   "defaultValue": null,
   "domain": null

```
  },
  {
```

   "name": "last_edited_date",
   "type": "esriFieldTypeDate",
   "alias": "last_edited_date",
   "length": 8,
   "editable": false,
   "nullable": true,
   "defaultValue": null,
   "domain": null

```
  },
  {
```

   "name": "SHAPE",
   "type": "esriFieldTypeGeometry",
   "alias": "SHAPE",
   "editable": true,
   "nullable": true,
   "domain": null

```
  },
  {
```

   "name": "SHAPE.STLength()",
   "type": "esriFieldTypeDouble",
   "alias": "SHAPE.STLength()",
   "editable": false,
   "nullable": true,
   "defaultValue": null,
   "domain": null

```
  },
  {
```

   "name": "LF",
   "type": "esriFieldTypeInteger",
   "alias": "LF",
   "editable": true,
   "nullable": true,
   "defaultValue": null,
   "domain": null

```
  },
  {
```

   "name": "LT",
   "type": "esriFieldTypeInteger",
   "alias": "LT",
   "editable": true,
   "nullable": true,
   "defaultValue": null,
   "domain": null

```
  },
  {
```

   "name": "RF",
   "type": "esriFieldTypeInteger",
   "alias": "RF",
   "editable": true,
   "nullable": true,
   "defaultValue": null,
   "domain": null

```
  },
  {
```

   "name": "RT",
   "type": "esriFieldTypeInteger",
   "alias": "RT",
   "editable": true,
   "nullable": true,
   "defaultValue": null,
   "domain": null

```
  }
 ]
}
```
