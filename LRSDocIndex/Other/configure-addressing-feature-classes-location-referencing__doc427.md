# Configure Addressing Feature Classes (Location Referencing)

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#5645](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5645) |
| **Source** | [5645-AddressingConfigGPTool_V2.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5645_Configure_Addressing_Feature_Classes/5645-AddressingConfigGPTool_V2.docx>) |
| **Edited** | 2024-02-21 20:37 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Configure Addressing Feature Classes (Location Referencing)"
source_file: "5645-AddressingConfigGPTool_V2.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5645_Configure_Addressing_Feature_Classes/5645-AddressingConfigGPTool_V2.docx"
doc_id: 427
doc_kind: "Other"
surface: "Pro"
doc_revision: "V2"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: ""
last_edited: "2024-02-21T20:37:41.8082383Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["address range", "site address", "feature class", "address data management", "location referencing", "linear referencing system", "addressing"]
tools: ["Configure Addressing Feature Classes"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#5645"]
related: [{"doc":429,"file":"overview-of-the-configuration-toolset__doc429.md","s":1004.716},{"doc":366,"file":"pro-3-3-and-11-3-iteration-issue-tracking__doc366.md","s":1000.758},{"doc":424,"file":"configure-addressing-feature-classes-gp-tool-test-plan__doc424.md","s":5.759},{"doc":249,"file":"configure-address-feature-classes-location-referencing__doc249.md","s":5.615},{"doc":450,"file":"configure-addressing-feature-classes__doc450.md","s":4.366}]
```
-->

## Summary

Configures Address Data Management solution Address Range and Site Address feature classes for use with a linear referencing system (LRS). Describes required parameters, data types, and licensing information for the tool. Provides links to related documentation and usage guidelines.

## Related documents

<!-- related:begin -->
- [Overview of the Configuration Toolset](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overview-of-the-configuration-toolset__doc429.md>) — shared issue ArcGISPro/ps-location-referencing#5645 · similar text 0.35 · 3 filename words · same kind/surface/folder <!-- rel:429 -->
- [Pro 3.3 and 11.3 Iteration Issue Tracking](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Schedules/pro-3-3-and-11-3-iteration-issue-tracking__doc366.md>) — shared issue ArcGISPro/ps-location-referencing#5645 · similar text 0.02 · same surface <!-- rel:366 -->
- [Configure Addressing Feature Classes GP Tool Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/configure-addressing-feature-classes-gp-tool-test-plan__doc424.md>) — similar text 0.34 · 4 title words · 3 filename words · same surface <!-- rel:424 -->
- [Configure Address Feature Classes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configure-address-feature-classes-location-referencing__doc249.md>) — similar text 0.50 · 3 title words · same kind/surface <!-- rel:249 -->
- [Configure Addressing Feature Classes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/configure-addressing-feature-classes__doc450.md>) — similar text 0.27 · 4 title words · 1 filename word · same surface <!-- rel:450 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View site address point properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-site-address-point-properties.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [Manage address and roadway characteristic data together](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/manage-address-and-roadway-characteristic-data-together.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-location-referencing-options.html)

_No page matched:_ [Configure Addressing Feature Classes](https://www.google.com/search?q=%22Configure%20Addressing%20Feature%20Classes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Configure Addressing Feature Classes (Location Referencing)

### Summary
Configures Address Data Management sSolution Address Range and Site Address feature classes for use with a linear referencing system (LRS).

### Usage

- You must choose an LRS centerline feature class or an LRS line event that includes addressing information for Tthe Address Range Feature Class Layer parametermust be the LRS centerline feature class or an LRS line event that includes addressing information.
https://prodev.arcgis.com/en/pro-app/latest/help/production/roads-highways/lrs-data-model.htm \hLearn more about the LRS data model in ArcGIS Roads and Highways or Pipeline Referencing, and the Address Data Management solution.
https://doc.arcgis.com/en/arcgis-solutions/11.2/reference/introduction-to-address-data-management.htmLearn more about the Address Data Management Solution

- The Left From Address field, Left To Address field, Right From Address field, and Right To Address field parameter values must be Short or Long field types.
- You must choose a point feature class for Tthe Site Address Feature Class Layer parametermust be a point feature class.
- The Address Full Number field parameter value must be a Short, Long, or Text field types.
- The feature classes that you choose for the Address Range Feature Class Layer and Site Address Feature Class Layer parameters feature classes must be in the same feature dataset as the LRS layers.
- This tool requires a file geodatabase, branch versioned enterprise geodatabase connection, or traditionally versioned enterprise geodatabase connection.
Learn more about versioning in ArcGIS Pro

- This tool is not supported in feature services.

### Parameters

| Label | Explanation | Data Type |
| --- | --- | --- |
| Address Range Feature Layer | The input LRS centerline or LRS line event feature class that is the Address Management Address Range feature class. | Feature Layer |
| Left From Address field | The field in the Address Range feature class that contains information for the first address on the left side of a roadway. | Field |
| Left To Address field | The field in the Address Range feature class that contains information for the last address on the left side of a roadway. | Field |
| Right From Address field | The field in the Address Range feature class that contains information for the first address on the right side of a roadway. | Field |
| Right To Address field | The field in the Address Range feature class that contains information for the last address on the right side of a roadway. | Field |
| Site Address Feature Layer | The input point feature class that is the Address Management Site Address feature class. | Feature Layer |
| Address Full Number | The field in the Site Address feature class that contains information for the site address number. | Feature Layer |

#### Derived Output

| Label | Explanation | Data Type |
| --- | --- | --- |
| Output Address Range Features | The update d Address Ran ge feature class . | Feature Layer |
| Output Site Address Features | The updated Site Address feature class . | Feature Layer |

### Parameters (Python)
arcpy.locref.ConfigureAddressingFeatureClasses(in_address_range_feature_class, left_from_address_field, left_to_address_field, right_from_address_field, right_to_address_field, in_site_address_feature_class, address_number_field)

| Label | Explanation | Data Type |
| --- | --- | --- |
| in_address_range_feature_class | The input LRS centerline or LRS line event feature class that is the Address Management Address Range feature class. | Feature Layer |
| left_from_address_field | The field in the Address Range feature class that contains information for the first address on the left side of a roadway. | Field |
| left_to_address_field | The field in the Address Range feature class that contains information for the last address on the left side of a roadway. | Field |
| right_from_address_field | The field in the Address Range feature class that contains information for the first address on the right side of a roadway. | Field |
| right_to_address_field | The field in the Address Range feature class that contains information for the last address on the right side of a roadway. | Field |
| in_site_address_feature_class | The input point feature class that is the Address Management Site Address feature class. | Feature Layer |
| address_number_field | The field in the Site Address feature class that contains information for the site address number. | Feature Layer |

#### Derived Output (Python)

| Label | Explanation | Data Type |
| --- | --- | --- |
| out_address_range_feature_class | The updated Address Range feature class. | Feature Layer |
| out_site_address_feature_class | The updated Site Address feature class. | Feature Layer |

### Code Sample
(Code sample will be added to the doc after the code is checked in)

### Environments
This tool does not use any geoprocessing environments.

### Licensing information

- Basic: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)

#### Related topics

- https://prodev.arcgis.com/en/pro-app/3.3/tool-reference/location-referencing/an-overview-of-the-location-referencing-toolbox.htm \hAn overview of the Location Referencing toolbox
- Find a geoprocessing tool
