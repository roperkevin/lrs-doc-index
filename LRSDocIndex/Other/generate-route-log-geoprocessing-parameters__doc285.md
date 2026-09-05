# Generate Route Log Geoprocessing Parameters

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Source** | [RouteLog_GP.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RouteLog_GP.pdf>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "Generate Route Log Geoprocessing Parameters"
source_file: "RouteLog_GP.pdf"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RouteLog_GP.pdf"
doc_id: 285
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
keywords: ["route log", "geoprocessing", "referent fields", "location fields", "merge coincident events", "network", "effective date"]
tools: ["Generate Route Log"]
products: []
issues: []
related: [{"doc":150,"file":"generate-route-log-location-referencing__doc150.md","s":6.261},{"doc":284,"file":"lrs-data-template-and-route-log-configuration__doc284.md","s":5.065},{"doc":255,"file":"generate-a-route-log-including-spanning-events-and-centerline-test-plan__doc255.md","s":5.049},{"doc":260,"file":"generate-a-route-log-using-the-glrsdp-gp-tool-test-plan__doc260.md","s":4.635},{"doc":283,"file":"sample-route-log__doc283.md","s":4.578}]
```
-->

## Summary

Document detailing the parameters and environment settings for the Generate Route Log geoprocessing tool. It includes configuration for network selection, output files, effective dates, log fields, location fields, referent fields, and options for merging coincident events across various layers such as CountyLog, Speed Limit Event, Functional Class Event, Sign Event, Intersection, County Boundary, and Milepost points.

## Related documents

<!-- related:begin -->
- [Generate Route Log (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-route-log-location-referencing__doc150.md>) — similar text 0.26 · 3 title words · 2 filename words · same kind/surface <!-- rel:150 -->
- [LRS Data Template and Route Log Configuration](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-data-template-and-route-log-configuration__doc284.md>) — similar text 0.29 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:284 -->
- [Generate a route Log including spanning events and centerline – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/generate-a-route-log-including-spanning-events-and-centerline-test-plan__doc255.md>) — similar text 0.13 · 3 title words · 2 filename words · same surface <!-- rel:255 -->
- [Generate a Route Log using the GLRSDP GP Tool – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/generate-a-route-log-using-the-glrsdp-gp-tool-test-plan__doc260.md>) — similar text 0.21 · 3 title words · 2 filename words · same surface <!-- rel:260 -->
- [Sample Route Log](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/sample-route-log__doc283.md>) — similar text 0.16 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:283 -->
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
