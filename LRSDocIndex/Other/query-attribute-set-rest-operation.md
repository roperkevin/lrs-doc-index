# Query Attribute Set REST Operation

| Field | Value |
| --- | --- |
| **Doc** | 395 · Other · Server |
| **Product** | Utility Network |
| **Release** | 10.6 |
| **Issues** | — |
| **Source** | [webgis_669_QueryAttributeSetsREST.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/webgis_669_QueryAttributeSetsREST.docx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2024-03-25 18:44 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | query attribute set · rest operation · event layers · route · measure · attribute set · feature set · utility network · pipeline layer · address block range |
| **Tools** | — |

## Summary

Describes the Query Attribute Set REST operation introduced in version 10.6, which segments event layers for selected routes based on measure changes across attribute sets. The operation returns a feature set including route IDs, measures, and geometry for queried linear event layers or configured utility network pipeline layers.

## Related documents

<!-- related:begin -->
- [64-bit OID Values in REST Operations Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5508-64-bit-oid-values-in-rest-operations.md>) — similar text 0.06 · 1 title word · 1 filename word · same surface <!-- rel:470 s=2.34 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/3147-lr-gp-error-messages.md>) — similar text 0.10 · same kind/folder <!-- rel:39 s=2.249 -->
- [Update Address Range via Address Points in Overlay Events and Query Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/update-address-range-via-address-points-in-overlay-events.md>) — similar text 0.12 · 2 title words <!-- rel:294 s=2.075 -->
- [Manage Pipeline Referencing and a Utility Network Together](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/5048-manage-apr-and-a-un-together.md>) — similar text 0.08 · same kind/folder <!-- rel:565 s=2.044 -->
- [Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-routes.md>) — similar text 0.16 · same kind/surface <!-- rel:111 s=1.85 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [query attribute set](https://www.google.com/search?q=%22query%20attribute%20set%22+site%3Adoc.esri.com) · [configure utility network feature class](https://www.google.com/search?q=%22configure%20utility%20network%20feature%20class%22+site%3Adoc.esri.com) · [configure address feature classes](https://www.google.com/search?q=%22configure%20address%20feature%20classes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Query Attribute Set

- URL:https://<network-layer-url>/queryAttributeSet
- Version Introduced:10.6

### Description
License:
The ArcGIS Location Referencing license is required to use this resource.
This operation segments event layers for selected routes where any measures change across the attribute set based on different measures or measure ranges. The result of this operation is a feature set that contains the values for the fields included in an attribute set and some additional fields that contain the route ID and measures from the network on which the query is performed. The geometry of each feature is also returned in the feature set.

### Request parameters

| Parameter | Details |
| --- | --- |
| f | Optional parameter to specify the response format. The default response format is html .<br>Values: html \| json |
| locations | Required<br>Description: A list of routes and measure values used to segment event layers. The list can be either all single measures or all measure ranges; it can't mix single measures and measure ranges. Each route can have one or more different measures. If only a routeId is provided, the entire route is returned.<br>Syntax:<br>[<br>{ // syntax of a single measure<br>" routeId " : "<routeId1>",<br>"measure" : <measure1><br>},<br>{<br>" routeId " : "<routeId1>",<br>"measure" : <measure2><br>}<br>...<br>]<br>or<br>[<br>{ // syntax of a measure range<br>" routeId " : "<routeId1>",<br>" fromMeasure " : <measure1>,<br>" toMeasure " : <measure2><br>},<br>{<br>" routeId " : "<routeId1>",<br>" fromMeasure " : <measure3>,<br>" toMeasure " : <measure4><br>}<br>...<br>]<br>or<br>[<br>{ // syntax to return the entire route<br>" routeId " : "<routeId1>"<br>},<br>{<br>" routeId " : "<routeId2>"<br>}<br>...<br>] |
| attributeSet | Description: An attribute set that contains the linear event layers to query and fields to include in the result. The linear event layer can also be a Utility Network pipeline layer that has been configured as an LRS centerline using the Configure Utility Network Feature Class geoprocessing tool , or an address block range layer that has been configured as an LRS centerline using the Configure Address Feature Classes geoprocessing tool. When the centerline layer is an Address feature, t h e centerline direction is honored in the output. The object ID field for each layer specified will always be included in the results. If a field name already exists across all layers, it is renamed.<br>Syntax:<br>[<br>{<br>" layerId " : "<layerId1>",<br>"fields" : [ "<field1>", "<field2>", "<field3>", ... ]<br>},<br>{<br>" layerId " : "<layerId2>",<br>"fields" : [ "<field1>", "<field2>", ... ]<br>},<br>...<br>] |
