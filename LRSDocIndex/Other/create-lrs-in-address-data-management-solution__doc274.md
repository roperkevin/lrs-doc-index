# Create LRS in Address Data Management solution

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#6186](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6186) |
| **Source** | [6186_CreateLRS_ADM.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6186_CreateLRS_ADM.docx>) |
| **Edited** | 2024-12-06 19:42 by Kyle Chin |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Create LRS in Address Data Management solution"
source_file: "6186_CreateLRS_ADM.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6186_CreateLRS_ADM.docx"
doc_id: 274
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: "Kyle Chin"
last_edited: "2024-12-06T19:42:50Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["address data management", "road centerline", "linear referencing system", "lrs workspace", "feature dataset", "arcgis roads and highways"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#6186"]
related: [{"doc":249,"file":"configure-address-feature-classes-location-referencing__doc249.md","s":4.393},{"doc":276,"file":"manage-address-and-roadway-characteristic-data-together-with-roads-and-highways__doc276.md","s":3.836},{"doc":296,"file":"create-lrs-with-address-data-management-solution-present__doc296.md","s":3.608},{"doc":403,"file":"manage-roads-and-highways-with-address-data-management__doc403.md","s":2.823},{"doc":427,"file":"configure-addressing-feature-classes-location-referencing__doc427.md","s":2.71}]
```
-->

## Summary

Describes the creation of a linear referencing system (LRS) in an Address Data Management geodatabase using an existing Road Centerline feature class. Specifies schema requirements and configuration details for the LRS. Includes licensing requirements for different ArcGIS levels.

## Related documents

<!-- related:begin -->
- [Configure Address Feature Classes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configure-address-feature-classes-location-referencing__doc249.md>) — similar text 0.36 · 1 title word · same kind/surface <!-- rel:249 -->
- [Manage Address and Roadway Characteristic Data Together with Roads and Highways and Address Data Management Solution](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/manage-address-and-roadway-characteristic-data-together-with-roads-and-highways__doc276.md>) — similar text 0.20 · 3 title words · same kind/surface/folder <!-- rel:276 -->
- [Create LRS with Address Data Management solution present](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-lrs-with-address-data-management-solution-present__doc296.md>) — similar text 0.23 · 4 title words · 1 filename word · same surface <!-- rel:296 -->
- [Manage Roads and Highways with Address Data Management](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/manage-roads-and-highways-with-address-data-management__doc403.md>) — similar text 0.18 · 2 title words · same kind/surface <!-- rel:403 -->
- [Configure Addressing Feature Classes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configure-addressing-feature-classes-location-referencing__doc427.md>) — similar text 0.41 · same kind/surface <!-- rel:427 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Manage address and roadway characteristic data together](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/manage-address-and-roadway-characteristic-data-together.html) · [Create a template for an LRS feature count data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-feature-count-data-product.html)
<!-- docs:end -->

---

## Create LRS in Address Data Management solution

### Summary
Creates a linear referencing system (LRS) in an Address Data Management geodatabase that contains an existing Road Centerline feature class.

### Usage

- The minimum schema items created will have default fields, data type, and field length that adhere to the ArcGIS Roads and Highways LRS data model.
- The existing Road Centerline feature class will be configured as the Centerline feature class in the LRS.
- The existing Road Centerline feature class must not be renamed.

### Parameters

| Label | Explanation | Data Type |
| --- | --- | --- |
| Feature Dataset | The feature dataset that contains an existing Road Centerline feature class. | Feature Dataset |
| LRS Name | The name of the output LRS . | String |

#### Derived Output

| Label | Explanation | Data Type |
| --- | --- | --- |
| LRS Workspace | The updated LRS workspace. | Workspace |

### Licensing information

- Basic: No
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
