# Create LRS with Address Data Management solution present

| Field | Value |
| --- | --- |
| **Doc** | 296 · User Story · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [CreateLRSwithADMpresent.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/CreateLRSwithADMpresent.pptx>) |
| **People** | author Praveen Kumar · PE — · dev — |
| **Edited** | 2024-10-23 23:04 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | address data management · centerline · calibration points · centerline sequence · redline · python script · geoprocessing tool |
| **Tools** | Create LRS from Existing Dataset |

## Summary

User story for configuring an LRS from the Address Data Management solution when only the centerline is present. It involves creating a python script to add missing LRS schema items and packaging it as a geoprocessing tool for use in ArcGIS Pro. Testing and automation plans are included along with documentation requirements.

## Related documents

<!-- related:begin -->
- [Create LRS in Address Data Management solution](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6186-create-lrs-in-address-data-management-solution.md>) — similar text 0.23 · 4 title words · 1 filename word · same surface <!-- rel:274 s=3.608 -->
- [Manage Address and Roadway Characteristic Data Together with Roads and Highways and Address Data Management Solution](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/5783-manage-address-and-roadway-characteristic-data-together.md>) — similar text 0.26 · 3 title words · same surface <!-- rel:276 s=3.499 -->
- [Configure Addressing Feature Classes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/configure-addressing-feature-classes.md>) — similar text 0.38 · same kind/surface/folder <!-- rel:450 s=3.064 -->
- [Spike: Address Management Schema Change Pattern](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/4417-address-management-schema-change-pattern.md>) — similar text 0.30 · 2 title words · same surface/folder <!-- rel:643 s=2.715 -->
- [Manage Address and Roadway Characteristic Data Together](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/5930-manage-address-and-roadway-characteristic-data-together.md>) — similar text 0.26 · 1 title word · same surface <!-- rel:327 s=2.67 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Manage address and roadway characteristic data together](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/manage-address-and-roadway-characteristic-data-together.html) · [Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html) · [View centerline sequence table properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-centerline-sequence-table-properties.html) · [View redline properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-redline-properties.html)

_No page matched:_ [Create LRS from Existing Dataset](https://www.google.com/search?q=%22Create%20LRS%20from%20Existing%20Dataset%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Create LRS with Address Data Management solution present <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS data modeler/administrator, I need the ability to configure an LRS from the Address Data Management solution where only the centerline is present, so that all the required LRS schema are created correctly and the LRS is configured.

Persona:Data Modeler/Administrator: This user is responsible for doing the configuration, modeling, and even loading of the LRS.  For local government organizations that will be maintaining addressing information from the Address Data Management solution along with linear referencing in Roads and Highways, we need to configure the additional schema items (since centerline is already present) for the user as part of creating the LRS.  Since neither our Create LRS or Create LRS from Existing tools do this, we should create a python script to create the missing schema items with the correct fields then configure the LRS.

## Acceptance Criteria
<!-- slide 3 -->
- Create a python script that can be run against the Address Data Management geodatabase, which has a centerline but none of the other LRS schema items
- The python script should do the following:
  - Create the other three LRS schema items, Calibration Points, Centerline Sequence, and Redline with the default field types (https://pro.arcgis.com/en/pro-app/latest/help/production/roads-highways/lrs-data-model.htm) so they’ll work with the centerline in the ADM solution
  - The feature classes should be created in the same feature dataset and have the same spatial reference, tolerance, and resolution values as the centerline
  - Run Create LRS from Existing Dataset tool and utilize the 3 schema items created above plus the centerline feature class
- Package the script up as a GP tool and in a GP toolbox that can be used within ArcGIS Pro
- Once complete, we need to make this script available for our users to download
- We should also investigate whether this can be included in the next update of ADM

## Testing
<!-- slide 4 -->
- Test with fgdb and egdb direct connect
- Use the latest ADM solution
- Verify you can complete the workflow for configuration/deployment after the script runs (LRS Network, LRS Events, Append Routes, Append Events)

## Automation
<!-- slide 5 -->
- Automate the tool like other GP tools we’ve built

## Documentation
<!-- slide 6 -->
- Include documentation with the toolbox/download that mimics the typical GP documentation topics

## Assignment
### Story Points <!-- slide 7 -->
Story Points:
Dev:
PE:
