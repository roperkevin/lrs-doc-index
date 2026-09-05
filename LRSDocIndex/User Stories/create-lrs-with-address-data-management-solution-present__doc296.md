# Create LRS with Address Data Management solution present

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [CreateLRSwithADMpresent.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/CreateLRSwithADMpresent.pptx>) |
| **Edited** | 2024-10-23 23:04 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Create LRS with Address Data Management solution present"
source_file: "CreateLRSwithADMpresent.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/CreateLRSwithADMpresent.pptx"
doc_id: 296
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Praveen Kumar"
last_edited_by: "Mac Christmas"
last_edited: "2024-10-23T23:04:29Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["address data management", "centerline", "calibration points", "centerline sequence", "redline", "python script", "geoprocessing tool"]
tools: ["Create LRS from Existing Dataset"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":274,"file":"create-lrs-in-address-data-management-solution__doc274.md","s":3.608},{"doc":276,"file":"manage-address-and-roadway-characteristic-data-together-with-roads-and-highways__doc276.md","s":3.499},{"doc":450,"file":"configure-addressing-feature-classes__doc450.md","s":3.064},{"doc":643,"file":"spike-address-management-schema-change-pattern__doc643.md","s":2.715},{"doc":327,"file":"manage-address-and-roadway-characteristic-data-together__doc327.md","s":2.67}]
```
-->

## Summary

User story for configuring an LRS from the Address Data Management solution when only the centerline is present. It involves creating a python script to add missing LRS schema items and packaging it as a geoprocessing tool for use in ArcGIS Pro. Testing and automation plans are included along with documentation requirements.

## Related documents

<!-- related:begin -->
- [Create LRS in Address Data Management solution](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/create-lrs-in-address-data-management-solution__doc274.md>) — similar text 0.23 · 4 title words · 1 filename word · same surface <!-- rel:274 -->
- [Manage Address and Roadway Characteristic Data Together with Roads and Highways and Address Data Management Solution](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/manage-address-and-roadway-characteristic-data-together-with-roads-and-highways__doc276.md>) — similar text 0.26 · 3 title words · same surface <!-- rel:276 -->
- [Configure Addressing Feature Classes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/configure-addressing-feature-classes__doc450.md>) — similar text 0.38 · same kind/surface/folder <!-- rel:450 -->
- [Spike: Address Management Schema Change Pattern](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-address-management-schema-change-pattern__doc643.md>) — similar text 0.30 · 2 title words · same surface/folder <!-- rel:643 -->
- [Manage Address and Roadway Characteristic Data Together](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/manage-address-and-roadway-characteristic-data-together__doc327.md>) — similar text 0.26 · 1 title word · same surface <!-- rel:327 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Manage address and roadway characteristic data together](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/manage-address-and-roadway-characteristic-data-together.html) · [Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html) · [View centerline sequence table properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-centerline-sequence-table-properties.html) · [View redline properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-redline-properties.html)

_No page matched:_ [Create LRS from Existing Dataset](https://www.google.com/search?q=%22Create%20LRS%20from%20Existing%20Dataset%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Create LRS with Address Data Management solution present

User Story

## Slide 2 — User Story

As an LRS data modeler/administrator, I need the ability to configure an LRS from the Address Data Management solution where only the centerline is present, so that all the required LRS schema are created correctly and the LRS is configured.

Persona:Data Modeler/Administrator: This user is responsible for doing the configuration, modeling, and even loading of the LRS.  For local government organizations that will be maintaining addressing information from the Address Data Management solution along with linear referencing in Roads and Highways, we need to configure the additional schema items (since centerline is already present) for the user as part of creating the LRS.  Since neither our Create LRS or Create LRS from Existing tools do this, we should create a python script to create the missing schema items with the correct fields then configure the LRS.

## Slide 3 — Acceptance Criteria

- Create a python script that can be run against the Address Data Management geodatabase, which has a centerline but none of the other LRS schema items
- The python script should do the following:
  - Create the other three LRS schema items, Calibration Points, Centerline Sequence, and Redline with the default field types (https://pro.arcgis.com/en/pro-app/latest/help/production/roads-highways/lrs-data-model.htm) so they’ll work with the centerline in the ADM solution
  - The feature classes should be created in the same feature dataset and have the same spatial reference, tolerance, and resolution values as the centerline
  - Run Create LRS from Existing Dataset tool and utilize the 3 schema items created above plus the centerline feature class
- Package the script up as a GP tool and in a GP toolbox that can be used within ArcGIS Pro
- Once complete, we need to make this script available for our users to download
- We should also investigate whether this can be included in the next update of ADM

## Slide 4 — Testing

Test with fgdb and egdb direct connect
Use the latest ADM solution
Verify you can complete the workflow for configuration/deployment after the script runs (LRS Network, LRS Events, Append Routes, Append Events)

## Slide 5 — Automation

Automate the tool like other GP tools we’ve built

## Slide 6 — Documentation

Include documentation with the toolbox/download that mimics the typical GP documentation topics

## Slide 7 — Story Points

Story Points:
Dev:
PE:
