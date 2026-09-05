# Generate Length Summary Geoprocessing Tool

| Field | Value |
| --- | --- |
| **Doc** | 282 · Other · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Generate_LengthSummaryGP.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Generate_LengthSummaryGP.pdf>) |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | length summary · geoprocessing · network · output file · effective date · units · summary fields · functional class event |
| **Tools** | Generate Length Summary |

## Summary

This document details the parameters and environment settings for the Generate Length Summary geoprocessing tool. It includes configuration for network selection, output file naming, effective date, units, and summary fields with options to exclude null summary rows. The tool processes length fields across various layers such as State Boundary and Functional Class Event with specific output field names.

## Related documents

<!-- related:begin -->
- [Generate Length Summary (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6748-generate-length-summary-lr.md>) — similar text 0.21 · 3 title words · 3 filename words · same kind/surface <!-- rel:158 s=5.584 -->
- [Generate LRS Data Product Support Summary and Length](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/generate-lrs-data-product-support-summary-and-length.md>) — similar text 0.15 · 3 title words · 3 filename words · same surface/folder <!-- rel:357 s=4.848 -->
- [Generate Feature Count Geoprocessing Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-feature-count-gp.md>) — similar text 0.45 · 3 title words · same kind/surface/folder <!-- rel:281 s=4.801 -->
- [Generate Route Log Geoprocessing Parameters](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/generate-route-log-gp-parameters.md>) — similar text 0.52 · 2 title words · same kind/surface/folder <!-- rel:285 s=4.5 -->
- [GenerateLengthSummary – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6202-generatelengthsummary.md>) — similar text 0.29 · 3 filename words · same surface <!-- rel:172 s=4.416 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html)

_No page matched:_ [Generate Length Summary](https://www.google.com/search?q=%22Generate%20Length%20Summary%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

Geoprocessing                          Geoprocessing                             Geoprocessing
     Generate Length Summary                Generate Length Summary                   Generate Length Summary
 Parameters       Environments          Parameters       Environments
                                                                                  Parameters       Environments

- Network                              * Network                                 * Network
                                                                                   Milepoint
                                                                                       Use the filtered records: 30
- Output File                          * Output File
                                                                                - Output File
                                                                                   LengthTable1
- Effective Date                       * Effective Date
                                                                                - Effective Date
                                                                                    12/31/2024
- Units                                * Units
  Miles                                  Miles                                   * Units
                                                                                    Miles
                                        Summary Fields
   Summary Fields
                                         Layer                                    Summary Fields
   Length Fields
                                                                                    Layer
                                                                                    State_Boundary
                                         Field
    Exclude null summary rows
                                                                                                 Use the filtered records: 50

                                 Run     Output field name                          Field
                                                                                    Name
  Geoprocessing
                                                                  Add another      Output field name
                                                                                    State
                                         Length Fields

                                         Layer                                     Layer
                                                                                    Urban_Code

                                                                                                  Use the filtered records: 5
                                         Output field name
                                                                                   Field
                                                                                    Type
                                                                   Add another

                                                                                   Output field name
                                                                                    Type
                                           Exclude null summary rows
                                                                                                               Add another

                                                                          Run      Length Fields

                                         Geoprocessing                             Layer
                                                                                   Functional Class Event

                                                                                                Use the filtered records: 75

                                                                                   Field
                                                                                   Functional_Class

                                                                                   Output field name
                                                                                   Interstate

                                                                                   Layer
                                                                                    Functional Class Event

                                                                                             Use the filtered records: 1800

                                                                                   Field
                                                                                    Functional_Class

                                                                                   Output field name
                                                                                   Other Freeways and Expressways

                                                                                   Layer
                                                                                    Functional Class Event

                                                                                                 Use the filtered records: 28

                                                                                   Field
                                                                                    Functional_Class

                                                                                   Output field name
                                                                                   Other Principal Arterial

                                                                                   Layer
                                                                                    Functional Class Event

                                                                                             Use the filtered records: 4792

                                                                                   Field
                                                                                    Functional_Class

                                                                                   Output field name
                                                                                   Minor Arterial

                                                                                   Layer
                                                                                    Functional Class Event

                                                                                                 Use the filtered records: 75

                                                                                   Field
                                                                                    Functional_Class

                                                                                   Output field name
                                                                                   Major Collector

                                                                                    Layer
                                                                                    Functional Class Event

                                                                                                Use the filtered records: 1828

                                                                                    Field
                                                                                    Functional_Class

                                                                                    Output field name
                                                                                    Minor Collector

                                                                                    Layer
                                                                                    Functional Class Event

                                                                                                Use the filtered records: 7539

                                                                                    Field
                                                                                    Functional_Class

                                                                                    Output field name
                                                                                    Local

                                                                                                                  Add another

                                                                                     Exclude null summary rows

                                                                                                                          Run

                                                                                   Geoprocessing
