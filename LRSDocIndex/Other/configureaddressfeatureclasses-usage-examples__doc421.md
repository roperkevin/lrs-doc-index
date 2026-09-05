# ConfigureAddressFeatureClasses Usage Examples

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Issue** | [ArcGISPro/ps-location-referencing#5465](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5465) |
| **Source** | [5465-AddressingConfigGPTool_CodeExample.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5645_Configure_Addressing_Feature_Classes/5465-AddressingConfigGPTool_CodeExample.docx>) |
| **Edited** | 2024-02-28 23:19 by Ignacia Galvan |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "ConfigureAddressFeatureClasses Usage Examples"
source_file: "5465-AddressingConfigGPTool_CodeExample.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5645_Configure_Addressing_Feature_Classes/5465-AddressingConfigGPTool_CodeExample.docx"
doc_id: 421
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Ignacia Galvan"
last_edited: "2024-02-28T23:19:00Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["address feature classes", "geoprocessing tool", "python script", "location referencing", "linear referencing system"]
tools: ["ConfigureAddressFeatureClasses"]
products: []
issues: ["ArcGISPro/ps-location-referencing#5465"]
related: [{"doc":249,"file":"configure-address-feature-classes-location-referencing__doc249.md","s":6.572},{"doc":429,"file":"overview-of-the-configuration-toolset__doc429.md","s":4.544},{"doc":427,"file":"configure-addressing-feature-classes-location-referencing__doc427.md","s":4.39},{"doc":88,"file":"configureutilitynetworkfeatureclass-example-2-stand-alone-script__doc88.md","s":3.335},{"doc":85,"file":"configureutilitynetworkfeatureclass-python-example__doc85.md","s":2.942}]
```
-->

## Summary

This document provides example scripts demonstrating how to use the ConfigureAddressFeatureClasses geoprocessing tool in ArcGIS Location Referencing. It includes usage in both the Python window and as a stand-alone Python script to configure address feature classes for linear referencing systems.

## Related documents

<!-- related:begin -->
- [Configure Address Feature Classes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configure-address-feature-classes-location-referencing__doc249.md>) — similar text 0.76 · same kind/surface <!-- rel:249 -->
- [Overview of the Configuration Toolset](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overview-of-the-configuration-toolset__doc429.md>) — similar text 0.13 · 3 filename words · same kind/surface/folder <!-- rel:429 -->
- [Configure Addressing Feature Classes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configure-addressing-feature-classes-location-referencing__doc427.md>) — similar text 0.24 · 3 filename words · same kind/surface/folder <!-- rel:427 -->
- [ConfigureUtilityNetworkFeatureClass example 2 (stand-alone script)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configureutilitynetworkfeatureclass-example-2-stand-alone-script__doc88.md>) — similar text 0.38 · 1 filename word · same kind/surface <!-- rel:88 -->
- [ConfigureUtilityNetworkFeatureClass Python Example](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configureutilitynetworkfeatureclass-python-example__doc85.md>) — similar text 0.23 · 1 filename word · same kind/surface <!-- rel:85 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)
<!-- docs:end -->

---

ConfigureAddressFeatureClasses example 1 (Python window)
Demonstrates how to use the ConfigureAddressFeatureClasses geoprocessing toolfunction in a Python window.
\# Name: ConfigureAddressFeatureClasses_ex1.py
\# Description: Configure aAddress feature classes for use with a linear referencing system (LRS) in the Python window.
\# Requires: ArcGIS Location Referencing
\# Set current workspace
arcpy.env.workspace = r”C:\Data\AM_LR.gdb”
\# Set tool variables
in_address_range_feature_class = r”C:\Data\AM_LR.gdb\LRS\AddressRange”
left_from_address_field = “fromleft”
left_to_address_field = “toleft”
right_from_address_field = “fromright”
right_to_address_field = “toright”
in_site_address_feature_class = r”C:\Data\AM_LR.gdb\LRS\SiteAddress”
address_number_field = “addrnum”
\# Execute the tool
arcpy.locref.ConfigureAddressFeatureClasses(in_address_range_feature_class, left_from_address_field, left_to_address_field, right_from_address_field, right_to_address_field, in_site_address_feature_class, address_number_field)
ConfigureAddressFeatureClasses example 2 (stand-alone script)
Demonstrates how to use the ConfigureAddressFeatureClasses geoprocessing toolfunction as a stand-alone Python script.
\# Name: ConfigureAddressFeatureClasses_ex2.py
\# Description: Configure Address feature classes for use with a linear referencing system (LRS) in a stand-alone script.
\# Requires: ArcGIS Location Referencing
\# Import arcpy module
import arcpy
\# Check out the license
arcpy.CheckOutExtension(“LocationReferencing”)
\# Set current workspace
arcpy.env.workspace = r“C:\Data\AM_LRconnection.sde”
\# Set tool variables
in_address_range_feature_class = r”C:\Data\AM_LRconnection.sde\LRS\LRowner.AddressRange”
left_from_address_field = “fromleft”
left_to_address_field = “toleft”
right_from_address_field = “fromright”
right_to_address_field = “toright”
in_site_address_feature_class = r”C:\Data\AM_LRconnection.sde\LRS\LRowner.SiteAddress”
address_number_field = “addrnum”
\# Execute the tool
arcpy.locref.ConfigureAddressFeatureClasses(in_address_range_feature_class, left_from_address_field, left_to_address_field, right_from_address_field, right_to_address_field, in_site_address_feature_class, address_number_field)
\# Check in the license
arcpy.CheckInExtension(“LocationReferencing”)
