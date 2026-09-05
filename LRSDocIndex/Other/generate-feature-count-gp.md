# Generate Feature Count Geoprocessing Tool

| Field | Value |
| --- | --- |
| **Doc** | 281 · Other · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Feature_Count_GP.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Feature_Count_GP.pdf>) |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | feature count · geoprocessing · route identifier · asset layers · summary fields · output file |
| **Tools** | Generate Feature Count |

## Summary

Document describes parameters and environment settings for the Generate Feature Count geoprocessing tool. It includes fields for network, route identifier, output file, effective date, and summary fields such as asset layers and attributes like county, signs, bridges, and pavement condition.

## Related documents

<!-- related:begin -->
- [Generate Length Summary Geoprocessing Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-length-summary-gp.md>) — similar text 0.45 · 3 title words · same kind/surface/folder <!-- rel:282 s=4.801 -->
- [Standalone GP – Generate Feature Count – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6205-standalone-gp-generate-feature-count.md>) — similar text 0.20 · 3 title words · 2 filename words · same surface <!-- rel:173 s=4.604 -->
- [Feature Count Support Generate Data GP Tool Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/feature-count-support-generate-data-gp.md>) — similar text 0.22 · 4 title words · 2 filename words · same surface <!-- rel:253 s=4.52 -->
- [LRS Data Template for Asset Count](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Data%20Templates/lrs-data-template-for-asset-count.md>) — similar text 0.41 · 1 title word · 2 filename words · same surface/folder <!-- rel:286 s=4.094 -->
- [Create a template for an LRS feature count data product](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/create-a-template-for-an-lrs-feature-count-data-product-rh.md>) — similar text 0.18 · 2 title words · 2 filename words · same kind/surface <!-- rel:196 s=4.065 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a template for an LRS feature count data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-feature-count-data-product.html)

_No page matched:_ [Generate Feature Count](https://www.google.com/search?q=%22Generate%20Feature%20Count%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

Geoprocessing                          Geoprocessing                              Geoprocessing

        Generate Feature Count                    Generate Feature Count                     Generate Feature Count

 Parameters       Environments          Parameters       Environments              Parameters       Environments

- Network                              * Network                                  * Network
                                                                                    Milepoint
                                                                                        Use the filtered records: 3
 Route identifier field                 Route identifier field
                                         Route_ID                                  Route identifier field
  Route_ID
                                                                                    Route_ID

- Output File                          * Output File
                                                                                  - Output File
                                                                                     IN_AC_2024_A4

- Effective Date                       * Effective Date
                                                                                  - Effective Date
                                                                                     12/31/2024
                                         Summary Fields
                                                                                    Summary Fields
                                          Layer
                                                                                     Layer
  Summary Fields                                                                      County
                                          Field
  Asset Layers                                                                       Field
                                                                                                                                      Search
                                                                                      Name
                                          Output field name
                                                                                                                                    Signs
                                                                                     Output field name
                                 Run
                                                                                      County                                        Bridges
                                                                    Add another
  Geoprocessing
                                                                                                                 Add another        Attenuator
                                          Asset Layers                                                                              Urban
                                                                                     Asset Layers
                                          Layer                                                                                     Speed_Limit

                                                                                                                                    Pavement_Condition
                                                                                     Layer    Signs
                                                                                                  Use the filtered records:         Lanes

                                                                                                                                    Median

                                                                            Run      Layer    Bridges
                                                                                                                                                  Add    Cancel
                                                                                                  Use the filtered records:
                                         Geoprocessing

                                                                                                                              Run

                                                                                    Geoprocessing
