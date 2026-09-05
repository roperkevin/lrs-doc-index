# Generate Route Log Geoprocessing Parameters

| Field | Value |
| --- | --- |
| **Doc** | 285 · Other · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [RouteLog_GP.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RouteLog_GP.pdf>) |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | route log · geoprocessing · referent fields · location fields · merge coincident events · network · effective date |
| **Tools** | Generate Route Log |

## Summary

Document detailing the parameters and environment settings for the Generate Route Log geoprocessing tool. It includes configuration for network selection, output files, effective dates, log fields, location fields, referent fields, and options for merging coincident events across various layers such as CountyLog, Speed Limit Event, Functional Class Event, Sign Event, Intersection, County Boundary, and Milepost points.

## Related documents

<!-- related:begin -->
- [Generate Route Log (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6354-generate-route-log-lr.md>) — similar text 0.26 · 3 title words · 2 filename words · same kind/surface <!-- rel:150 s=6.261 -->
- [LRS Data Template and Route Log Configuration](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-data-template-and-route-log-configuration.md>) — similar text 0.29 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:284 s=5.065 -->
- [Generate a route Log including spanning events and centerline – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6240-generate-a-route-log-including-spanning-events.md>) — similar text 0.13 · 3 title words · 2 filename words · same surface <!-- rel:255 s=5.049 -->
- [Generate a Route Log using the GLRSDP GP Tool – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6209-generate-a-route-log-using-the-glrsdp-gp.md>) — similar text 0.21 · 3 title words · 2 filename words · same surface <!-- rel:260 s=4.635 -->
- [Sample Route Log](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/sample-route-log.md>) — similar text 0.16 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:283 s=4.578 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a template for an LRS route log data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-route-log-data-product.html) · [LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html)

_No page matched:_ [Generate Route Log](https://www.google.com/search?q=%22Generate%20Route%20Log%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

Geoprocessing                          Geoprocessing                             Geoprocessing

         Generate Route Log                      Generate Route Log                         Generate Route Log

 Parameters       Environments          Parameters       Environments             Parameters        Environments

- Network                              * Network                                 * Network
                                                                                   CountyLog
                                                                                       Use the filtered records: 3

- Output File                          * Output File                             * Output File
                                                                                   LengthTable1

- Effective Date                       * Effective Date                          * Effective Date
                                                                                    12/31/2024

 Log Fields                             Log Fields                                Route Log Fields
                                         Layer
                                                                                   Layer
 Location Fields                                                                   CountyLog

                                         Field                                                     Use the filtered records: 1
 Referent Fields
                                                                                   Field
                                                                   Add another     Route_ID

                                        Location Fields

                                 Run                                               Layer
                                                                                   Speed_Limit_Event
                                         Field
  Geoprocessing
                                                                                                 Use the filtered records:

                                                                   Add another     Field
                                                                                   Speed_Limit

                                        Referent Fields
                                                                                      Merge coincident events

                                        Referent located at
                                         Nearest upstream
                                                                                   Layer

                                        Layer                                      Functional_Class_Event

                                                                                                 Use the filtered records:

                                        Field                                      Field
                                                                                   Functional Class

                                        Offset Units                                  Merge coincident events
                                         Feet

                                                                                   Layer
                                                                                   Sign Event
                                                                           Run
                                                                                                 Use the filtered records:
                                         Geoprocessing
                                                                                   Field
                                                                                   Sign_Type

                                                                                   Layer
                                                                                   Intersection

                                                                                                 Use the filtered records:

                                                                                   Field
                                                                                   Intersection_Name

                                                                                                                 Add another

                                                                                   Location Fields

                                                                                    Layer
                                                                                    County_Boundary

                                                                                                   Use the filtered records: 6

                                                                                    Field
                                                                                    Name

                                                                                                                Add another

                                                                                   Referent Fields

                                                                                  Referent located at
                                                                                   Nearest Upstream
                                                                                   Nearest

                                                                                  Layer
                                                                                   Milepost points

                                                                                  Field
                                                                                   Name

                                                                                  Offset Units
                                                                                   Feet

                                                                                                                                 Run

                                                                                   Geoprocessing
