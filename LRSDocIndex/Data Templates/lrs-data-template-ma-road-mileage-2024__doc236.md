# LRS Data Template - MA Road Mileage 2024

|   |   |
| --- | --- |
| **Kind** | Data Template · Pro |
| **Release** | — |
| **Source** | [Calculate_Fields2.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Calculate_Fields2.pdf>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "LRS Data Template - MA Road Mileage 2024"
source_file: "Calculate_Fields2.pdf"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Calculate_Fields2.pdf"
doc_id: 236
doc_kind: "Data Template"
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
keywords: ["length fields", "lane miles", "road mileage", "data template", "calculation formula", "route network"]
tools: []
products: []
issues: []
related: [{"doc":238,"file":"generate-lrs-data-product-gp-tool-support-database-tables__doc238.md","s":2.983},{"doc":286,"file":"lrs-data-template-for-asset-count__doc286.md","s":2.497},{"doc":284,"file":"lrs-data-template-and-data-products__doc284.md","s":2.473},{"doc":158,"file":"generate-length-summary-location-referencing__doc158.md","s":2.154},{"doc":317,"file":"create-a-template-for-an-lrs-length-data-product__doc317.md","s":2.151}]
```
-->

## Summary

This document describes an LRS data template for Massachusetts road mileage, including public road mileage, lane miles, and annual vehicle miles. It details length fields, calculation formulas, and selection methods for summarizing data by county. The template supports calculation of lane miles using length and lane count fields.

## Related documents

<!-- related:begin -->
- [Generate LRS Data Product GP Tool: Support Database Tables](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-lrs-data-product-gp-tool-support-database-tables__doc238.md>) — similar text 0.08 · same surface/folder <!-- rel:238 -->
- [LRS Data Template for Asset Count](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-data-template-for-asset-count__doc286.md>) — similar text 0.27 · same surface/folder <!-- rel:286 -->
- [LRS Data Template and Data Products](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/lrs-data-template-and-data-products__doc284.md>) — similar text 0.26 · same surface/folder <!-- rel:284 -->
- [Generate Length Summary (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-length-summary-location-referencing__doc158.md>) — similar text 0.11 · same surface <!-- rel:158 -->
- [Create a template for an LRS length data product](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Data Templates/create-a-template-for-an-lrs-length-data-product__doc317.md>) — similar text 0.10 · same kind/surface <!-- rel:317 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a template for an LRS length data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-length-data-product.html)
<!-- docs:end -->

---

                                                                                                                                                                                               Add a field named "Length". Internally, calculate
                                                                                          Data Product                                                                                         To Measure - From Measure when this field is
                                                                                                                                                              Show only numerical
                                                                                           Designer                                                                                            selected.
                                                                                                                                                              fields from the layer
                                                                                               LRS Data Template

                                                                                                                Length Fields
                                                                                                                                                                                      Calculate Field
  LRS Data Template - MA Road Mileage 2024

    Data Product Type: Length
                                                                                                    Length fields                                                                     Fields                      Helpers
                                                                                                                                                                                                                                         Show only numeric
    Route Network: Milepost
                                                                                                      Name                                                                             Item One
                                                                                                                                                                                        Length                     ABS()                 operators
                                                                                                                                                        Support Calculate Field        Item
                                                                                                                                                                                        FromTwo
                                                                                                                                                                                             Measure               CAST()
    Name: MA Road Mileage 2024                                                                                                 Add           Delete
                                                                                                                                                        for this user story            Item Three
                                                                                                                                                                                        To Measure                 CEILING()
    Description: This is an overview of the public road mileage, lane miles, and annual
                 vehicle miles in Massachusetts and the agencies that maintain and have                                                                                                Lane Width                  COS()
                 jurisdiction over them.
                                                                                                  Length Layer
                                                                                                                                                                                       No_Lanes_I                  EXTRACT()
                 This includes roads in the 352 incorporated cities and the unincorporated         Lanes
                 parts of the counties in Massachusetts.                                                                                                                               No_Lanes_D                  FLOOR()
                                                                                                                                                                                                                                            Show the list of unique
                                                                                                                                                                                       Number_Aux_Lanes            LOG()
                                                                                                  Selection Method                                                                                                                          values for the selected
                   Summarize by            Length fields                                           Calculate Field                                                                     Insert Values                                        field
                     County                                                                        Single Value
                                                                                                   Unique Values                                                                      Lane Miles=
                       Clark                                                                                                                               Open this modal             {Length x No_Lanes_I} + {Length x No_Lanes_D} +
                       Lewis                                                                      Name in Table                                            window upon the             {Length x No_Aux_Lanes}
                                                                                                                                                           selection of Calculate
                                                                                                                                                           Field option
                                                                                                    Filter Expression

                                                                                                     There is no expression defined.

                                                                                                            New expression                                                                                                        OK

                                                                                                                                             Apply

                                                                                                    Preview

                                                                                                Learn more about creating an LRS Data template
                                                                                                Page 4/4

                                                                                                 Previous         Next         Finish         Cancel

                                                                                                  Location Referencing   Geoprocessing

                                                                                    Data Product
                                                                                     Designer

                                                                                             LRS Data Template

                                                                                                             Length Fields

LRS Data Template - MA Road Mileage 2024
                                                                                               Length fields
 Data Product Type: Length
                                                                                                 Name
 Route Network: Milepost
                                                                                                 Lane Miles
 Name: MA Road Mileage 2024

 Description: This is an overview of the public road mileage, lane miles, and annual
                                                                                                                         Add             Delete
              vehicle miles in Massachusetts and the agencies that maintain and have
              jurisdiction over them.
              This includes roads in the 352 incorporated cities and the unincorporated
              parts of the counties in Massachusetts.
                                                                                               Length Layer
                                                                                                Lanes
                Summarize by            Length fields

                  County                 Lane Miles                                            Selection Method                                        Non editable
                                                                                                Calculate Field
                    Clark

                    Lewis
                                                                                                 Formula

                                                                                                    {Length x No_Lanes_I} +
                                                                                                    {Length x No_Lanes_D} +
                                                                                                    {Length x No_Aux_Lanes}

                                                                                                                                             Edit

                                                                                                 Name in Table
                                                                                                  Lane Miles

                                                                                                   Filter Expression
                                                                                                    There is no expression defined.

                                                                                                            New expression

                                                                                                                                            Apply

                                                                                                  Preview

                                                                                              Learn more about creating an LRS Data template
                                                                                              Page 4/4

                                                                                               Previous        Next         Finish          Cancel

                                                                                               Location Referencing   Geoprocessing
