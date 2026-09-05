# ConfigureUtilityNetworkFeatureClass Python Example

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Utility Network |
| **Source** | [Py_example1_draft.txt](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro37_Ent121/7079_ConfigureUNFC_GP/Py_example1_draft.txt>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "ConfigureUtilityNetworkFeatureClass Python Example"
source_file: "Py_example1_draft.txt"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro37_Ent121/7079_ConfigureUNFC_GP/Py_example1_draft.txt"
doc_id: 85
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
keywords: ["utility network", "feature class", "python example", "linear referencing system", "route id", "measure fields"]
tools: ["ConfigureUtilityNetworkFeatureClass"]
products: ["Utility Network"]
issues: []
related: [{"doc":88,"file":"configureutilitynetworkfeatureclass-example-2-stand-alone-script__doc88.md","s":8.387},{"doc":84,"file":"configure-utility-network-feature-class-location-referencing__doc84.md","s":5.944},{"doc":421,"file":"configureaddressfeatureclasses-usage-examples__doc421.md","s":2.942},{"doc":204,"file":"update-measures-from-lrs-location-referencing__doc204.md","s":2.772},{"doc":67,"file":"view-utility-network-feature-class-properties__doc67.md","s":2.57}]
```
-->

## Summary

Example demonstrating the use of the ConfigureUtilityNetworkFeatureClass function in the Python window to configure utility network feature classes for use with a linear referencing system. It sets workspace and tool variables, then runs the configuration tool with specified parameters for feature classes and measure fields.

## Related documents

<!-- related:begin -->
- [ConfigureUtilityNetworkFeatureClass example 2 (stand-alone script)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configureutilitynetworkfeatureclass-example-2-stand-alone-script__doc88.md>) — similar text 0.85 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:88 -->
- [Configure Utility Network Feature Class (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configure-utility-network-feature-class-location-referencing__doc84.md>) — similar text 0.48 · same kind/surface/folder <!-- rel:84 -->
- [ConfigureAddressFeatureClasses Usage Examples](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configureaddressfeatureclasses-usage-examples__doc421.md>) — similar text 0.23 · 1 filename word · same kind/surface <!-- rel:421 -->
- [Update Measures From LRS (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/update-measures-from-lrs-location-referencing__doc204.md>) — similar text 0.14 · same kind/surface <!-- rel:204 -->
- [View Utility Network Feature Class Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-utility-network-feature-class-properties__doc67.md>) — similar text 0.21 · same kind/surface <!-- rel:67 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)
<!-- docs:end -->

---

ConfigureUtilityNetworkFeatureClass example 1 (Python window)

Demonstrates how to use the ConfigureUtilityNetworkFeatureClass function in a Python window.

# Name: ConfigureUtilityNetworkFeatureClass_ex1.py
# Description: Configure utility network feature classes for use with a linear referencing system (LRS) in the Python window.
# Requires: ArcGIS Location Referencing

# Set current workspace
arcpy.env.workspace = r"C:\Data\UN_LR.gdb"

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
