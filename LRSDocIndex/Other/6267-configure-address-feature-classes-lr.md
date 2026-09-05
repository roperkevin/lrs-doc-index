# Configure Address Feature Classes (Location Referencing)

| Field | Value |
| --- | --- |
| **Doc** | 249 · Other · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#6267](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6267) |
| **Source** | [6267-GP_ConfigureAddressFeatureClassesUpdate.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6267_OverlayEvents/6267-GP_ConfigureAddressFeatureClassesUpdate.docx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2025-01-22 19:05 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | address feature class · address range · site address · address data management · linear referencing system · arcgis roads and highways · feature dataset |
| **Tools** | ConfigureAddressFeatureClasses |

## Summary

Configures the Address Range and Site Address feature classes from the Address Data Management solution for use with a linear referencing system (LRS) and the ArcGIS Roads and Highways extension. Provides parameters and usage details for setting up address feature classes in the same feature dataset as LRS layers. Includes Python code samples demonstrating tool usage in ArcGIS Pro and stand-alone scripts.

## Related documents

<!-- related:begin -->
- [Manage Address and Roadway Characteristic Data Together](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6267-manage-address-and-roadway-characteristic-data-together.md>) — shared issue ArcGISPro/ps-location-referencing#6267 · similar text 0.30 · 1 title word · same kind/surface/folder <!-- rel:250 s=1003.892 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6267-overlay-events-lr.md>) — shared issue ArcGISPro/ps-location-referencing#6267 · similar text 0.32 · same kind/surface/folder <!-- rel:251 s=1002.787 -->
- [Configure Addressing Feature Classes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/5645-configure-addressing-feature-classes-lr.md>) — similar text 0.50 · 3 title words · same kind/surface <!-- rel:427 s=5.615 -->
- [ConfigureAddressFeatureClasses Usage Examples](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/5465-configureaddressfeatureclasses-usage-examples.md>) — similar text 0.77 · same kind/surface <!-- rel:421 s=5.117 -->
- [Configure Addressing Feature Classes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/configure-addressing-feature-classes.md>) — similar text 0.21 · 3 title words · 3 filename words · same surface <!-- rel:450 s=4.774 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [View site address point properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-site-address-point-properties.html) · [Manage address and roadway characteristic data together](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/manage-address-and-roadway-characteristic-data-together.html) · [Create a template for an LRS feature count data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-feature-count-data-product.html)
<!-- docs:end -->

---

## Configure Address Feature Classes (Location Referencing)

### Summary
Configures the Address Range and Site Address feature classes from the Address Data Management solution for use with a linear referencing system (LRS) withand the ArcGIS Roads and Highways extension.

### Usage

- You must provide an LRS centerline feature class or an LRS line event that includes addressing information for the Input Address Range Feature Layer parameter.
- Learn more about the LRS data model in Roads and Highways and the Address Data Management solution in ArcGIS Enterprise.
- The Left From Address Field, Left To Address Field, Right From Address Field, and Right To Address Field parameter values must be short or long field types.
- You must provide a point feature class for the Input Site Address Feature Layer parameter.
- The Address Number Field parameter value must be a short, long, or text field type.
- The Site Address Road Name parameter value must be a text field type.
- The feature classes that you use for the Input Address Range Feature Layer and Input Site Address Feature Layer parameters must be in the same feature dataset as the LRS layers.
- This tool supports data from requires a file geodatabase,or an enterprise geodatabase (branch versioned enterprise geodatabase connection), or traditionally versioned enterprise geodatabase connection.
- Learn more about versioning in ArcGIS Pro
- This tool does not support data from a is not supported in feature services.

### Parameters
Dialog:

| Label | Explanation | Data Type |
| --- | --- | --- |
| Address Range Road Name Field | The field in the Address Range feature class that contains information for the name of a roadway. | Field |
| Site Address Road Name Field | The field in the Site Address feature class that contains information for the name of the a roadway. | Field |

Python:
arcpy.locref.ConfigureAddressFeatureClasses(in_address_range_features, left_from_address_field, left_to_address_field, right_from_address_field, right_to_address_field, in_site_address_features, address_number_field, address_range_road_name_field, site_address_road_name)

| Name | Explanation | Data Type |
| --- | --- | --- |
| add ress_range_road_name _field | The field in the Address Range feature class that contains information for the name of a roadway. | Field |
| site_address_road_name | The field in the Site Address feature class that contains information for the name of a roadway. | Field |

Code samples:
Example 1:
\# Name: ConfigureAddressFeatureClasses_ex1.py
\# Description: Configure address feature classes for use with a linear referencing system (LRS) in the Python window.
\# Requires: ArcGIS Location Referencing

\# Set current workspace
arcpy.env.workspace= r"C:\Data\AM_LR.gdb"

\# Set tool variables
in_address_range_features = r"C:\Data\AM_LR.gdb\LRS\AddressRange"
left_from_address_field = "fromleft"
left_to_address_field = "toleft"
right_from_address_field = "fromright"
right_to_address_field = "toright"
in_site_address_features = r"C:\Data\AM_LR.gdb\LRS\SiteAddress"
address_number_field = "addrnum"
address_range_road_name_field = “fullroadname”
site_address_road_name = “addroadname”

\# Run the tool
arcpy.locref.ConfigureAddressFeatureClasses(in_address_range_features, left_from_address_field, left_to_address_field, right_from_address_field, right_to_address_field, in_site_address_features, address_number_field, address_range_road_name_field, site_address_road_name)
Example 2:
\# Name: ConfigureAddressFeatureClasses_ex2.py
\# Description: Configure address feature classes for use with a linear referencing system (LRS) in a stand-alone script.
\# Requires: ArcGIS Location Referencing

\# Import arcpy module
import arcpy

\# Check out the license
arcpy.CheckOutExtension("LocationReferencing")

\# Set current workspace
arcpy.env.workspace = r"C:\Data\AM_LRconnection.sde"

\# Set tool variables
in_address_range_features = r"C:\Data\AM_LRconnection.sde\LRS\LRowner.AddressRange"
left_from_address_field = "fromleft"
left_to_address_field = "toleft"
right_from_address_field = "fromright"
right_to_address_field = "toright"
in_site_address_features = r"C:\Data\AM_LRconnection.sde\LRS\LRowner.SiteAddress"
address_number_field = "addrnum"
address_range_road_name_field = “fullroadname”
site_address_road_name = “addroadname”

\# Run the tool
arcpy.locref.ConfigureAddressFeatureClasses(in_address_range_features, left_from_address_field, left_to_address_field, right_from_address_field, right_to_address_field, in_site_address_features, address_number_field, address_range_road_name_field, site_address_road_name)

\# Check in the license
arcpy.CheckInExtension("LocationReferencing")

### Environments
This tool does not use any geoprocessing environments.

### Licensing information

- Basic: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
