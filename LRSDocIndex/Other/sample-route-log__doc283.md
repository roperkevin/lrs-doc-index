# Sample Route Log

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Source** | [Sample_RouteLog1.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Sample_RouteLog1.pdf>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "Sample Route Log"
source_file: "Sample_RouteLog1.pdf"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Sample_RouteLog1.pdf"
doc_id: 283
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
keywords: ["route log", "route description", "measure", "functional class", "speed limit", "intersecting routes", "sign type"]
tools: []
products: []
issues: []
related: [{"doc":260,"file":"generate-a-route-log-using-the-glrsdp-gp-tool-test-plan__doc260.md","s":8.415},{"doc":284,"file":"lrs-data-template-and-route-log-configuration__doc284.md","s":4.374},{"doc":285,"file":"generate-route-log-geoprocessing-parameters__doc285.md","s":4.32},{"doc":150,"file":"generate-route-log-location-referencing__doc150.md","s":3.555},{"doc":255,"file":"generate-a-route-log-including-spanning-events-and-centerline-test-plan__doc255.md","s":3.424}]
```
-->

## Summary

This document provides a detailed route log including route descriptions, measures, lengths, counties, cities, sign types, intersecting routes, functional classes, and speed limits. It also includes a summary table of stop signs, speed limit signs, and bridges by county and route.

## Related documents

<!-- related:begin -->
- [Generate a Route Log using the GLRSDP GP Tool – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/generate-a-route-log-using-the-glrsdp-gp-tool-test-plan__doc260.md>) — similar text 0.69 · 2 title words · 2 filename words · same surface <!-- rel:260 -->
- [LRS Data Template and Route Log Configuration](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/lrs-data-template-and-route-log-configuration__doc284.md>) — similar text 0.20 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:284 -->
- [Generate Route Log Geoprocessing Parameters](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/generate-route-log-geoprocessing-parameters__doc285.md>) — similar text 0.16 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:285 -->
- [Generate Route Log (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-route-log-location-referencing__doc150.md>) — similar text 0.02 · 2 title words · 2 filename words · same kind/surface <!-- rel:150 -->
- [Generate a route Log including spanning events and centerline – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/generate-a-route-log-including-spanning-events-and-centerline-test-plan__doc255.md>) — similar text 0.14 · 2 title words · 2 filename words · same surface <!-- rel:255 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a template for an LRS route log data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-route-log-data-product.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)
<!-- docs:end -->

---

                                                                                                                             Interstate
                                                                                         Functional Class
                                                                                                                             Local
                                                                                                                             65 MPH
                                                                                                 Speed Limit
                                                                                                                             40 MPH

Route     Description           Measure   Length   County   City       Sign           Intersecting      Functional   Speed
ID                                                                     Type                             Class        Limit

RouteA    Begin                 0.000              Union    Titan                                       Interstate   65
          RouteA

RouteA    Intersecting          0.000              Union    Titan                     RouteA, Route 1   Interstate   65
          Route1

RouteA    Begin                 0.000              Union    Titan                                       Interstate   65
          Functional Class
          Interstate

Route A   Begin                 0.000              Union    Titan                                       Interstate   65
          Speed Limit
          65 MPH

RouteA    Sign                  0.000              Union    Titan      Intersection                     Interstate   65
          Intersection

RouteA    Sign                  1.400              Union    Titan      Speed Limit                      Interstate   65
          Speed Limit

RouteA    Sign                  2.000              Union    Titan      Intersection                     Interstate   65
          Intersection

RouteA    Sign                  2.500              Union    Titan      Stop                             Interstate   65
          Stop

RouteA    Intersecting          2.500              Union    Titan                     RouteA, Route2    Interstate   65
          Route2

RouteA    End                   3.500              Union    Titan                                       Interstate   65
          Titan City Limit

RouteA    Begin                 3.500              Union    Mega One                                    Interstate   65
          Mega One City Limit

RouteA    End                   4.000     21120    Union    Mega One                                    Interstate   65
          Functional Class
          Interstate

RouteA    Begin                 4.000              Union    Mega One                                    Local        65
          Functional Class
          Local

RouteA    End                   6.000     31680    Union    Mega One                                    Local        65
          Speed Limit
          65

RouteA    Begin                 6.000              Union    Mega One                                    Local        40
          Speed Limit
          40

RouteA    Sign                  7.500              Union    Mega One   Speed Limit                      Local        40
          Speed Limit
          40

RouteA    End                   10.000    21120    Union    Mega One                                    Local        40
          Speed Limit
          40

RouteA    End                   10.000    31680    Union    Mega One                                    Local        40
          Functional Class
          Local

RouteA    Sign                  10.000             Union    Mega One   Intersection                     Local        40
          Intersection

RouteA    Intersecting          10.000             Union    Mega One                  RouteA, Route3    Local        40
          Route3

RouteA    End                   10.000    52800    Union    Mega One                                    Local        40
          RouteA
                                                                                                                                      Interstate
                                                                                                   Functional Class
                                                                                                                                      Local
                                                                                                                                      65 MPH
                                                                                                        Speed Limit
                                                                                                                                      40 MPH

Route     Description        Measure   Length   Referent   Offset   County   City       Sign           Intersecting      Functional   Speed
ID                                                                                      Type                             Class        Limit

RouteA    Sign               0.000              Mile 0     0        Union    Titan      Milepost       RouteA, Route 1   Interstate   65
          Milepost

RouteA    Intersecting       0.000              Mile 0     0        Union    Titan      Milepost                         Interstate   65
          Route1

RouteA    Begin              0.000              Mile 0     0        Union    Titan                                       Interstate   65
          RouteA

RouteA    Begin              0.000              Mile 0     0        Union    Titan                                       Interstate   65
          Functional Class
          Interstate

Route A   Begin              0.000              Mile 0     0        Union    Titan                                       Interstate   65
          Speed Limit
          65

RouteA    Sign               0.000              Mile 0     0        Union    Titan      Intersection                     Interstate   65
          Intersection

RouteA    Sign               1.400              Mile 0     7392     Union    Titan      Speed Limit                      Interstate   65
          Speed Limit

RouteA    Sign               2.000              Mile 2     0        Union    Titan      Milepost                         Interstate   65
          Milepost

RouteA    Sign               2.000              Mile 2     0        Union    Titan      Intersection                     Interstate   65
          Intersection

RouteA    Sign               2.500              Mile 2     2640     Union    Titan      Stop                             Interstate   65
          Stop

RouteA    Intersecting       2.500              Mile 2     2640     Union    Titan                     RouteA, Route2    Interstate   65
          Route2

RouteA    End                3.500              Mile 2     7920     Union    Titan                                       Interstate   65
          Titan City Limit

RouteA    Begin              3.500              Mile 2     7920     Union    Mega One                                    Interstate   65
          Mega One City
          Limit

RouteA    End                4.000     0.500    Mile 2     10560    Union    Mega One                                    Interstate   65
          Functional Class
          Interstate

RouteA    Begin              4.000              Mile 2     10560    Union    Mega One                                    Local        65
          Functional Class
          Local

RouteA    Sign               6.000              Mile 6     0        Union    Mega One   Milepost                         Local        65
          Milepost

RouteA    End                6.000     2.000    Mile 6     0        Union    Mega One                                    Local        65
          Speed Limit
          65

RouteA    Begin              6.000              Mile 6     0        Union    Mega One                                    Local        40
          Speed Limit
          40

RouteA    Sign               7.500              Mile 6     7920     Union    Mega One   Speed Limit                      Local        40
          Speed Limit
          40

RouteA    Sign               8.000              Mile 8     0        Union    Mega One   Milepost                         Local        40
          Milepost

RouteA    Sign               10.000             Mile 10    0        Union    Mega One   Milepost                         Local        40
          Milepost

RouteA    End                10.000    4.000    Mile 10    0        Union    Mega One                                    Local        40
          Speed Limit
          40

RouteA    End                10.000    6.000    Mile 10    0        Union    Mega One                                    Local        40
          Functional Class
          Local

RouteA    Sign               10.000             Mile 10    0        Union    Mega One   Intersection                     Local        40
          Intersection

RouteA    Intersecting       10.000             Mile 10    0        Union    Mega One                  RouteA, Route3    Local        40
          Rute3

RouteA    End                10.000    10.000   Mile 10    0        Union    Mega One                                    Local        40
          RouteA
County   Route ID   Stop Signs   Speed Limit Signs   Bridges
Union    RouteA     2            4                   3
         RouteB     3            1                   2
Clark    RouteA     4            5                   12
         Route B    0            4                   1

Sussex   RouteX     3            8                   2
         RouteD     4            1                   0
