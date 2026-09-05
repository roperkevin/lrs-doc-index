# Location Referencing Window Overlay Events

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Source** | [Overlay.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Overlay.pdf>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "Location Referencing Window Overlay Events"
source_file: "Overlay.pdf"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Overlay.pdf"
doc_id: 659
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
keywords: ["overlay events", "location referencing window", "route", "measure", "event filter", "network fields"]
tools: []
products: []
issues: []
related: [{"doc":131,"file":"overlay-events-location-referencing__doc131.md","s":3.595},{"doc":75,"file":"overlay-events-location-referencing__doc75.md","s":3.456},{"doc":422,"file":"overlay-events-location-referencing__doc422.md","s":3.393},{"doc":675,"file":"merge-events-user-story__doc675.md","s":2.794},{"doc":461,"file":"support-centerline-as-input-in-queryattributeset-and-overlay-events-test-plan__doc461.md","s":2.457}]
```
-->

## Summary

Document describes the Location Referencing Window interface focused on overlay events selection and filtering by route, measure, date, and attributes. It includes network fields, event filters, and route selection tools for managing linear referencing data.

## Related documents

<!-- related:begin -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-location-referencing__doc131.md>) — similar text 0.04 · 2 title words · 1 filename word · same kind/surface <!-- rel:131 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-location-referencing__doc75.md>) — similar text 0.04 · 2 title words · 1 filename word · same kind/surface <!-- rel:75 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-location-referencing__doc422.md>) — similar text 0.02 · 2 title words · 1 filename word · same kind/surface <!-- rel:422 -->
- [Merge Events User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/merge-events-user-story__doc675.md>) — similar text 0.02 · 1 title word · same surface/folder <!-- rel:675 -->
- [Support Centerline as Input in queryAttributeSet and Overlay Events Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-centerline-as-input-in-queryattributeset-and-overlay-events-test-plan__doc461.md>) — similar text 0.03 · 2 title words · 1 filename word · same surface <!-- rel:461 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)

_No page matched:_ [overlay events](https://www.google.com/search?q=%22overlay%20events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

Location Referencing WindowName
                                   Location Referencing            
                                                                              Window Name         Location Referencing            
                                                                                                                                     

              Overlay Events                        Overlay Events                                                Overlay Events
                                             Make a selection                                                                             Route ID  From Measure  To Measure  From Date  To Date  Ev1.Attrb1  Ev1.Attrb2  Ev1.Attrb3  Ev2.Attrb1  Ev2.Attrb2  Ev3.Attrb1  Ev3.Attrb2  Ev3.Attrb3  Ev4.Attrb1  Ev5.Attrb1     Ev5.Attrb2  Ev5.Attrb3  Ev6.Attrb1  Ev6.Attrb2 
                                       
                                                                                                                                          Route1      0                        0.02        1/1/2000        Null    You         know   I've      always       felt         that         there       was            something   fundamentally   wrong      with         the          Universe
 Network                               Network                                                       Network
                                                                                                                                          Route1      0.02                     0.12        1/1/2000        Null    You         know   they      always       felt         that         there       was            something   fundamentally   wrong      with         the          Universe
                                       Milepoint                                                     Milepoint
                                                                                                                                          Route1      0.12                     0.41        1/1/2000        Null                       I've      always       felt         that         there       was            something   fundamentally   wrong      with         the          Universe
 Attribute Set                         Attribute Set                                                 Attribute Set
                        Tool
                                                              Tool
                                                                                                                            Tool
                                                                                                                                          Route1      0.41                     1.00        1/1/2000        Null                       I've      always       felt         that                                    something   fundamentally   awesome    with         the          Universe

 Events                               Events                                                       Events 
                                       Ev1                                                           Ev1
                                                                             Ev1
                                       Ev2                                                           Ev2
 Network Fields                                                             Ev2
 Route ID/Route Name                   Ev3                                   Ev3                    Ev3                                   Event Filter: Multiple Events                  Ev1            Ev2          Ev3

                                       Ev4                                   Ev4                    Ev4                                   Route ID  From Measure  To Measure  From Date  To Date  Ev1.Attrb1  Ev1.Attrb2  Ev1.Attrb3  Ev2.Attrb1  Ev2.Attrb2  Ev3.Attrb1  Ev3.Attrb2  Ev3.Attrb3 

                                                                             Ev5                                                          Route1         0                     0.02        1/1/2000        Null   You         know    I've      always       felt         that         there       was
                                       Ev5                                                           Ev5
      Select Routes
                                                                             Ev6                                                          Route1         0.02                  0.12        1/1/2000        Null   You         know    they      always       felt         that         there       was
                                       Ev6                                                           Ev6
                                                                                             Add                                          Route1         0.12                  0.41        1/1/2000        Null                       I've      always       felt         that         there       was

                                                                                                                                           Route1         0.41                  1.00        1/1/2000        Null                       I've      always       felt         that
                                       Network Fields                                               Network Fields 
                                       Route ID/Route Name                                           Route ID/Route Name
                                                                             Route ID
                                                                                                                                           Event Filter: Multiple Events
                                       County_Code                           County_Code            County_Code

                                       City_Code                             City_Code              City_Code                                                 Search Event
                                       Route_System                          Route_System           Route_System                                             Select All   Clear All
                                                                             Field4
                                                                             Field 5                                                                          Ev1
                                            Select Routes
                                                                                             Add         Select Routes                                       Ev2
                                                                                                                                                               Ev3
                                                                                                     Routes
                                                                                                                                                               Ev4
                                                                                                      12345                         x
                                                                                                                                                               Ev5
                                                                                                      12346                         x
                                                                                                                                                               Ev6
                                                                                                      12347                         x

                                                                                                      12348                         x

                                                                                                      12349                         x

                                Run                                   Run                                                           Run

  Location Referencing                  Location Referencing                                          Location Referencing
