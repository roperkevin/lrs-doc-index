# Generate Feature Count Geoprocessing Tool

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Source** | [Feature_Count_GP.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Feature_Count_GP.pdf>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "Generate Feature Count Geoprocessing Tool"
source_file: "Feature_Count_GP.pdf"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Feature_Count_GP.pdf"
doc_id: 281
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
keywords: ["feature count", "geoprocessing", "route identifier", "asset layers", "summary fields", "output file"]
tools: ["Generate Feature Count"]
products: []
issues: []
related: [{"doc":282,"file":"generate-length-summary-geoprocessing-tool__doc282.md","s":4.801},{"doc":173,"file":"standalone-gp-generate-feature-count-test-plan__doc173.md","s":4.604},{"doc":253,"file":"feature-count-support-generate-data-gp-tool-test-plan__doc253.md","s":4.52},{"doc":286,"file":"lrs-data-template-for-asset-count__doc286.md","s":4.094},{"doc":196,"file":"create-a-template-for-an-lrs-feature-count-data-product__doc196.md","s":4.065}]
```
-->

## Summary

Document describes parameters and environment settings for the Generate Feature Count geoprocessing tool. It includes fields for network, route identifier, output file, effective date, and summary fields such as asset layers and attributes like county, signs, bridges, and pavement condition.

## Related documents

<!-- related:begin -->
- [Generate Length Summary Geoprocessing Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-length-summary-geoprocessing-tool__doc282.md>) — similar text 0.45 · 3 title words · same kind/surface/folder <!-- rel:282 -->
- [Standalone GP – Generate Feature Count – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/standalone-gp-generate-feature-count-test-plan__doc173.md>) — similar text 0.20 · 3 title words · 2 filename words · same surface <!-- rel:173 -->
- [Feature Count Support Generate Data GP Tool Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/feature-count-support-generate-data-gp-tool-test-plan__doc253.md>) — similar text 0.22 · 4 title words · 2 filename words · same surface <!-- rel:253 -->
- [LRS Data Template for Asset Count](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Data%20Templates/lrs-data-template-for-asset-count__doc286.md>) — similar text 0.41 · 1 title word · 2 filename words · same surface/folder <!-- rel:286 -->
- [Create a template for an LRS feature count data product](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/create-a-template-for-an-lrs-feature-count-data-product__doc196.md>) — similar text 0.18 · 2 title words · 2 filename words · same kind/surface <!-- rel:196 -->
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
