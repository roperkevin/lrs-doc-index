# ConfigureUtilityNetworkFeatureClass example 2 (stand-alone script)

| Field | Value |
| --- | --- |
| **Doc** | 88 · Other · Pro |
| **Product** | Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [Py_example2_draft.txt](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro37_Ent121/7079_ConfigureUNFC_GP/Py_example2_draft.txt>) |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | utility network · feature class · python script · location referencing · route id · measure fields |
| **Tools** | ConfigureUtilityNetworkFeatureClass |

## Summary

This document demonstrates how to use the ConfigureUtilityNetworkFeatureClass function in a stand-alone Python script to configure utility network feature classes for use with a linear referencing system. It includes setting workspace, defining feature classes and fields, running the tool, and managing the Location Referencing license.

## Related documents

<!-- related:begin -->
- [ConfigureUtilityNetworkFeatureClass Python Example](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configureutilitynetworkfeatureclass-python-example.md>) — similar text 0.85 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:85 s=8.387 -->
- [Configure Utility Network Feature Class (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configure-un-feature-class-lr.md>) — similar text 0.57 · same kind/surface/folder <!-- rel:84 s=5.733 -->
- [ConfigureAddressFeatureClasses Usage Examples](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/5465-configureaddressfeatureclasses-usage-examples.md>) — similar text 0.38 · 1 filename word · same kind/surface <!-- rel:421 s=3.335 -->
- [Update Measures From LRS (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6189-update-measures-from-lrs-lr.md>) — similar text 0.20 · same kind/surface <!-- rel:204 s=2.961 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-lr.md>) — similar text 0.29 · same kind/surface <!-- rel:75 s=2.819 -->
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
