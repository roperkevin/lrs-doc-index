# ConfigureUtilityNetworkFeatureClass example 2 (stand-alone script)

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Utility Network |
| **Source** | [Py_example2_draft.txt](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro37_Ent121/7079_ConfigureUNFC_GP/Py_example2_draft.txt>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "ConfigureUtilityNetworkFeatureClass example 2 (stand-alone script)"
source_file: "Py_example2_draft.txt"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro37_Ent121/7079_ConfigureUNFC_GP/Py_example2_draft.txt"
doc_id: 88
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
keywords: ["utility network", "feature class", "python script", "location referencing", "route id", "measure fields"]
tools: ["ConfigureUtilityNetworkFeatureClass"]
products: ["Utility Network"]
issues: []
related: [{"doc":85,"file":"configureutilitynetworkfeatureclass-python-example__doc85.md","s":8.387},{"doc":84,"file":"configure-utility-network-feature-class-location-referencing__doc84.md","s":5.733},{"doc":421,"file":"configureaddressfeatureclasses-usage-examples__doc421.md","s":3.335},{"doc":204,"file":"update-measures-from-lrs-location-referencing__doc204.md","s":2.961},{"doc":75,"file":"overlay-events-location-referencing__doc75.md","s":2.819}]
```
-->

## Summary

This document demonstrates how to use the ConfigureUtilityNetworkFeatureClass function in a stand-alone Python script to configure utility network feature classes for use with a linear referencing system. It includes setting workspace, defining feature classes and fields, running the tool, and managing the Location Referencing license.

## Related documents

<!-- related:begin -->
- [ConfigureUtilityNetworkFeatureClass Python Example](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configureutilitynetworkfeatureclass-python-example__doc85.md>) — similar text 0.85 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:85 -->
- [Configure Utility Network Feature Class (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configure-utility-network-feature-class-location-referencing__doc84.md>) — similar text 0.57 · same kind/surface/folder <!-- rel:84 -->
- [ConfigureAddressFeatureClasses Usage Examples](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configureaddressfeatureclasses-usage-examples__doc421.md>) — similar text 0.38 · 1 filename word · same kind/surface <!-- rel:421 -->
- [Update Measures From LRS (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/update-measures-from-lrs-location-referencing__doc204.md>) — similar text 0.20 · same kind/surface <!-- rel:204 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-location-referencing__doc75.md>) — similar text 0.29 · same kind/surface <!-- rel:75 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)
<!-- docs:end -->

---

ConfigureUtilityNetworkFeatureClass example 2 (stand-alone script)

Demonstrates how to use the ConfigureUtilityNetworkFeatureClass function as a stand-alone Python script.

# Name: ConfigureUtilityNetworkFeatureClass_ex2.py
# Description: Configure utility network feature classes for use with a linear referencing system (LRS) in a stand-alone script.
# Requires: ArcGIS Location Referencing

# Import arcpy module
import arcpy

# Check out the license
arcpy.CheckOutExtension("LocationReferencing")

# Set current workspace
arcpy.env.workspace = r"C:\Data\UN_LRconnection.sde"

# Set tool variables
in_feature_class = "PipelineLine"
route_id_field = "ROUTEID"
from_measure_field = "FROMMEASURE"
to_measure_field = "TOMEASURE"
in_device_features = "PipelineDevice"
device_route_id_field = "ENGROUTEID"
device_measure_field = "ENGMEASURE"
in_junction_features = "PipelineJunction"
junction_route_id_field = "ENGROUTEID"
junction_measure_field = "ENGMEASURE"

# Run the tool
arcpy.locref.ConfigureUtilityNetworkFeatureClass(in_feature_class, route_id_field, from_measure_field, to_measure_field, in_device_features, device_route_id_field, device_measure_field, in_junction_features, junction_route_id_field, junction_measure_field)

# Check in license
arcpy.CheckInExtension("LocationReferencing")
