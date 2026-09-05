# Reassign Route Tool User Guide

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Source** | [Icons_fin2_pdf.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Icons_fin2_pdf.pdf>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "Reassign Route Tool User Guide"
source_file: "Icons_fin2_pdf.pdf"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Icons_fin2_pdf.pdf"
doc_id: 595
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
keywords: ["route reassignment", "calibration points", "recalibrate route", "route attributes", "network", "location referencing", "route retirement", "route creation"]
tools: ["Reassign Route"]
products: []
issues: []
related: [{"doc":100,"file":"pro-ai-assistant-reassign-route-user-story__doc100.md","s":3.612},{"doc":583,"file":"support-reassign-transfer-as-new-route-s-to-adjacent-line-method-in-arcgis-pro__doc583.md","s":3.446},{"doc":507,"file":"reassign-routes__doc507.md","s":3.317},{"doc":508,"file":"reassign-routes__doc508.md","s":3.196},{"doc":758,"file":"support-event-behaviors-on-vertical-route-shapes-in-reassign-route__doc758.md","s":3.17}]
```
-->

## Summary

This document describes the Reassign Route tool used in Location Referencing for managing route reassignment scenarios. It covers options for transferring calibration points, recalibrating routes, and handling route attributes when reassigning routes to new or existing lines across different network types. The document includes interface descriptions, method selections, and expected results for various reassignment cases.

## Related documents

<!-- related:begin -->
- [Pro AI Assistant Reassign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-reassign-route-user-story__doc100.md>) — similar text 0.12 · 2 title words · same surface/folder <!-- rel:100 -->
- [Support Reassign: Transfer as New Route(s) to Adjacent Line Method in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-transfer-as-new-route-s-to-adjacent-line-method-in-arcgis-pro__doc583.md>) — similar text 0.23 · 2 title words · same surface/folder <!-- rel:583 -->
- [Reassign Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/reassign-routes__doc507.md>) — similar text 0.21 · 1 title word · same kind/surface <!-- rel:507 -->
- [Reassign Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/reassign-routes__doc508.md>) — similar text 0.22 · 1 title word · same kind/surface <!-- rel:508 -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-reassign-route__doc758.md>) — similar text 0.15 · 2 title words · same surface/folder <!-- rel:758 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html)
<!-- docs:end -->

---

                                              Reassign to a new line                                                                                          CP transferred = routes kept intact and all CPs are transferred
                                                                                                                                                                Location Referencing                                  Location Referencing                              
 Location Referencing                         Location Referencing                                  
                                                                                                                                                                                  Reassign Route                                               Reassign Route               
                   Reassign Route                                    Reassign Route                     
                                                                                                                                                                 This reassignment will result in the retirement of       This reassignment will result in the creation of the
  Network                                         Network
                                                                                                                                                                 the following routes within the reassigned portion.      following routes. When necessary, edit route
                                                   Engineering_Network                                                                                                                                                    attributes in the following table(s).
                                                                                                                                                                 Route Name        From Measure         To Measure
  Effective Date                                  Effective Date                                                                                                 R2                50                   70                                      New route
                                                                                                                                                                                                                                            Line Name: LineB
                                                  1/1/2020                                              
                                                                                                                                                                 R3                80                   96                 Route 1 of 2  
                                                                                                                                                                                                                          Route Name                     R2_reassign
                  Source                                              Source
                                                                                                                                                                                                                                                                                   Since the routes are not
      From Route Name                                 From Route Name                                                                                                                                                     From Measure                   50
                                                                                                                                                                                                                                                                                   merged, the user has the
   (Choose route from map)                        R2
      From Measure (in feet)
                                                                                                                                                                                                                          To Measure                     70                        ability to change/keep route
                                                      From Measure (in feet)
  
                                                                                                                                                                                                                                                                                   names.
                                                   50                                                                                                                                                                    Line Name                  LineB
        Use route start measure                         Use route start measure                                                                                                                                           Route ID                   {A92373-92505-0161
      To Route Name                                   To Route Name
   (Choose route from map)                                                                                                                                                                                               Stationing Direction       Ascending
                                                   R3
      To Measure (in feet)                            To Measure (in feet)                                                                                                                                                Unique Identifier          PipeXYZ
                                                  96                                                                                                                                                                    Description                good
        Use route end measure                           Use route end measure
        Recalibrate route downstream                    Recalibrate route downstream                                                                                                                                      Alternative Route Nam
        Transfer calibration points                     Transfer calibration points                                                                                                                                       Status                     active

                       Method                                         Method                                                                                                                                            Comment

                                                                                                                  Logic to decide whether to transfer or                                                               Town
                       Target                                                                                       not transfer intermediate calibration
                                                    to existing route   as new route(s)   to existing route                                                                                                               County
                                                    on same line        on same line      on another line            points.
                                                                                                                                                                                                                          State
                                                                                                                                                                                                                        ZipCode
                                                    as new route(s)      to a new line
                                                    on another line                                                                                                                                                       Direction
                                                                                                                                                                                                                               Apply attributes to all routes
                                                                       Target
                                                       Line name
                                                        LineB
                                                                                                                                                                                                        Back    Next                                               Back    Run
                                       Next                                                            Next

                                                                                                                                                               This is the second pane.                                   This is the third pane.
This is how the tool looks upon launch.          This is the first pane.
                                                                                                                                                                  • no change from the current                               • the first table contains the most important
                                                    • The user selects the network,
                                                                                                                                                                     experience                                                 information regarding the reassigned routes that
                                                       date, and the source routes and
                                                                                                                                                                  • the routes that are going to retire                         are: route name, from measure, and to measure. The
                                                       measures.
                                                                                                                                                                     show up in the list                                        user can edit these values. The original route
                                                    • Then, they need to choose a
                                                                                                                                                                                                                                name and route id can be retained with the new
                                                       method.
                                                                                                                                                                                                                                line.
                                                    • Once they have chosen a method,
                                                                                                                                                                                                                             • the second table contains extra attributes for
                                                       the target parameters show up on
                                                                                                                                                                                                                                the routes.
                                                       the basis of the selected method.

                                                                                                                                                                                                                                                          Result
                                                                                                                                                                                                                                           Do not merge. Route id and Route
                                                                                                                                                                                                                                           name kept intact (can be changed
                                                                                                                                                                                                                                            in attribute table). All calibration
                                                                                                                                                                                                                                                  points are transferred

                                                                                                                                                                                                                                                       

                                               CP not transferred = routes are kept intact and only calibration points on ends of routes are transferred

                                                       Location Referencing                                    
                                                                             Reassign Route                     
                                                                                                                                                                 Location Referencing                                 Location Referencing                               
                                                         Network
                                                          Engineering_Network                                                                                                          Reassign Route                                          Reassign Route               
                                                         Effective Date                                                                                            This reassignment will result in the retirement of      This reassignment will result in the creation of the
                                                          1/1/2020                                                                                                 the following routes within the reassigned portion.     following routes. When necessary, edit route
                                                                                                                                                                                                                          attributes in the following table(s).
                                                                                                                                                                   Route Name          From Measure      To Measure
                                                                                                                                                                                                                                                New route
                                                                              Source                                                                              R2                  50                70
                                                                                                                                                                                                                                             Line Name: LineB

                                                             From Route Name                                                                                       R3                  80                96                 Route 1 of 2  
                                                          R2                                                                                                                                                              Route Name                     R2_reassign
                                                             From Measure (in feet)
                                                                                                                                                                                                                           From Measure                   50
                                                          50
                                                                Use route start measure                                                                                                                                    To Measure                     70

                                                             To Route Name
                                                                                                                                                                                                                           Line Name                  LineB
                                                          R3
                                                             To Measure (in feet)                                                                                                                                          Route ID                   {A92373-92505-0161
                                                          96                                                                                                                                                              Stationing Direction       Ascending
                                                                Use route end measure
                                                                                                                                                                                                                           Unique Identifier          PipeXYZ
                                                                Recalibrate route downstream
                                                                Transfer calibration points                                                                                                                                Description                good

                                                                              Method                                                                                                                                      Alternative Route Nam

                                                                                                                                                                                                                        Status                     active

                                                           to existing route   as new route(s)   to existing route                                                                                                         Comment
                                                           on same line        on same line      on another line
                                                                                                                                                                                                                           Town
                                                                                                                                                                                                                         County
                                                           as new route(s)      to a new line
                                                           on another line                                                                                                                                                 State

                                                                              Target                                                                                                                                      ZipCode

                                                              Line name                                                                                                                                                    Direction
                                                                LineB                                                                                                                                                             Apply attributes to all routes

                                                                                                              Next

                                                                                                                                                                                                         Back    Next                                              Back     Run

                                                                                                                                                                                                                                                Result
                                                                                                                                                                                                                               Do not merge. Route id and Route
                                                                                                                                                                                                                               name kept intact (can be changed
                                                                                                                                                                                                                                  in attribute table). Only end
                                                                                                                                                                                                                                calibration points are transferred

                                                                                                                                                                                                                                                    
To an existing rt same line
                         CP transferred; recal target                                   CP transferred; no recal target                                    CP not transferred; recal target                                CP not transferred; no recal target
                        Location Referencing                                            Location Referencing                                         Location Referencing                                           Location Referencing                                         Location Referencing                                Location Referencing                                 
                                              Reassign Route                                                    Reassign Route                                                 Reassign Route                                                   Reassign Route                                             Reassign Route                                        Reassign Route                     
                         Network                                                            Network                                                         Network                                                           Network                                                         This reassignment will result in the retirement of     This reassignment will result in the creation of the
                          Engineering_Network                                                Engineering_Network                                             Engineering_Network                                               Engineering_Network                                            the following routes within the reassigned portion.    following routes. When necessary, edit route
                                                                                                                                                                                                                                                                                                                                                     attributes in the following table(s).
                                                                                            Effective Date                                                  Effective Date                                                    Effective Date                                                  Route Name        From Measure      To Measure
                         Effective Date
                                                                                                                                                                                                                                                                                              R1                7                 10                                       Route: R3
                          1/1/2020                                                          1/1/2020                                                       1/1/2020                                                         1/1/2020                                                                                                                             Line Name: Line A
                                                                                                                                                                                                                                                                                              R2                10                15
                                                                                                                                                                                                                                                                                                                                                     Route Name                                    R3
                                               Source                                                            Source                                                         Source                                                           Source
                           From Route Name                                                    From Route Name                                                 From Route Name                                                   From Route Name                                                                                                      From Measure                                  7
                          R1                                                                R1                                                             R1                                                               R1
                                                                                                                                                                                                                                                                                                                                                     To Measure                                    20
                             From Measure (in feet)                                             From Measure (in feet)                                          From Measure (in feet)                                            From Measure (in feet)

                          7                                                                 7                                                              7                                                                7                                                                                                                    Line Name                  LineA
                                  Use route start measure                                            Use route start measure                                         Use route start measure                                           Use route start measure
                                                                                                                                                                                                                                                                                                                                                     Route ID                   {A92373-92505-0161
                             To Route Name                                                      To Route Name                                                   To Route Name                                                     To Route Name
                                                                                                                                                                                                                                                                                                                                                     Stationing Direction       Ascending
                          R2                                                                R2                                                             R2                                                               R2
                             To Measure (in feet)                                               To Measure (in feet)                                            To Measure (in feet)                                              To Measure (in feet)                                                                                               Unique Identifier          PipeXYZ
                          15                                                                15                                                             15                                                               15
                                                                                                                                                                                                                                                                                                                                                     Description                good
                                  Use route end measure                                              Use route end measure                                           Use route end measure                                             Use route end measure
                                  Recalibrate route downstream                                       Recalibrate route downstream                                    Recalibrate route downstream                                      Recalibrate route downstream                                                                                  Alternative Route Nam
                                  Transfer calibration points                                        Transfer calibration points                                     Transfer calibration points                                       Transfer calibration points                                                                                   Status                     active

                                              Method                                                            Method                                                         Method                                                           Method                                                                                           Comment

                                                                                                                                                                                                                                                                                                                                                     Town
                                                                                                                                                                                                                                                                
                                                                                             to existing route   as new route(s)   to existing route         to existing route   as new route(s)   to existing route           to existing route   as new route(s)   to existing route
                                                                                                                                                                                                                                                                                                                                                     County
                          to existing route   as new route(s)   to existing route
                          on same line        on same line      on another line              on same line        on same line      on another line           on same line        on same line      on another line             on same line        on same line      on another line
                                                                                                                                                                                                                                                                                                                                                     State
                                                                                                                                                                                                                                                                                                                                             ZipCode
                          as new route(s)      to a new line                                 as new route(s)      to a new line                              as new route(s)      to a new line                                as new route(s)      to a new line
                          on another line                                                    on another line                                                 on another line                                                   on another line                                                                                                       Direction

                                              Target                                                            Target                                                         Target                                                           Target
                             Route Name                                                         Route Name                                                      Route Name                                                        Route Name
                          R3                                                                R3                                                             R3                                                               R3
                             From Measure (in feet)                                             From Measure (in feet)                                          From Measure (in feet)                                            From Measure (in feet)
                             7                                                                 7                                                              7                                                                7                                                      
                             To Measure (in feet)                                               To Measure (in feet)                                            To Measure (in feet)                                              To Measure (in feet)
                             15                                                                15                                                             15                                                               15                                                     
                                  Recalibrate route downstream                                       Recalibrate route downstream                                    Recalibrate route downstream                                      Recalibrate route downstream

                                                                              Next                                                               Next                                                            Next                                                              Next                                           Back      Next                                            Back        Run

                                                                                                                  Result                                                                                                                              Result
                                                  Result                                                                                                                                     Result                                         Monotonicity is checked:
                                                                                                        Monotonicity is checked:
                                                                                                                                                                                  Merge source and target –                                 Non-monotonic error or
                                      Merge source and target –                                         Non-monotonic error or
                                                                                                                                                                                     proportion not kept                                    merge without proportion
                                           proportion kept                                               merge with proportion

                                                                                                                                                                                                                                                      
                                                                                             Non-monotonic error or                                                                                                            Non-monotonic error or
                                                                                             same as previous                                                                                                                  same as previous
To new rt same line
                  CP transfered; no recal target option CP not transfered; no recal target option
                      Location Referencing                                       Location Referencing                                       Location Referencing                                Location Referencing                            
                                            Reassign Route                                               Reassign Route                                           Reassign Route                                         Reassign Route
                                                                                                                                                                                                                                                         
                       Network                                                       Network
                                                                                                                                                   This reassignment will result in the retirement of     This reassignment will result in the creation of the
                        Engineering_Network                                           Engineering_Network                                          the following routes within the reassigned portion.    following routes. When necessary, edit route
                                                                                                                                                                                                          attributes in the following table(s).
                       Effective Date                                                Effective Date                                                Route Name        From Measure      To Measure
                                                                                                                                                 R1                7                 10                                       New Route
                                                                                                                                                                                                                          Line Name: Line A
                                                                                                                                                   R2                10                15
                                             Source                                                       Source                                                                                        Route Name                             Rnew
                           From Route Name                                               From Route Name                                                                                                  From Measure                           7
                        R1                                                           R1
                           From Measure (in feet)                                        From Measure (in feet)                                                                                           To Measure                             15

                                                                                                                                                                                                        Line Name                 LineA
                                Use route start measure                                       Use route start measure
                                                                                                                                                                                                          Route ID                  {A92373-92505-0161
                           To Route Name                                                 To Route Name
                        R2                                                           R2                                                                                                                 Stationing Direction      Ascending
                           To Measure (in feet)                                          To Measure (in feet)
                                                                                                                                                                                                          Unique Identifier         PipeXYZ
                                                                                    
                                                                                                                                                                                                          Description               good
                                Use route end measure                                         Use route end measure
                                Recalibrate route downstream                                  Recalibrate route downstream                                                                                Alternative Route Nam
                                Transfer calibration points                                   Transfer calibration points
                                                                                                                                                                                                          Status                    active

                                            Method                                                       Method                                                                                         Comment

                                                                                                                                                                                                    Town

                        to existing route    as new route(s)   to existing route      to existing route    as new route(s)   to existing route                                                            County
                        on same line         on same line      on another line        on same line         on same line      on another line
                                                                                                                                                                                                          State
                                                                                                                                                                                                      ZipCode
                        as new route(s)       to a new line                           as new route(s)       to a new line
                        on another line                                               on another line                                                                                                     Direction

                                            Target                                                       Target
                           Route Name                                                    Route Name
                         Rnew                                                         Rnew
                           From Measure (in feet)                                        From Measure (in feet)
                            7                                                            7                                                  
                           To Measure (in feet)                                          To Measure (in feet)
                            15                                                           15                                                 

                                                                             Next                                                          Next                                       Back      Next                                            Back    Run

                                            Result                                                               Result
                                 Merge source and target –                                           Merge source and target –
                                      proportion kept                                                   proportion not kept

                                                                                                                    
To an existing route on another line
                          CP transferred; recal target                               CP transferred; no recal target                                CP not transferred; recal target                                CP not transferred; no recal target
                    Location Referencing                                         Location Referencing                                         Location Referencing                                          Location Referencing                                         Location Referencing                                Location Referencing                                
                                          Reassign Route                                                 Reassign Route                                                 Reassign Route                                                  Reassign Route                                             Reassign Route                                        Reassign Route                      
                     Network                                                         Network                                                         Network                                                          Network                                                         This reassignment will result in the retirement of     This reassignment will result in the creation of the
                      Engineering_Network                                             Engineering_Network                                             Engineering_Network                                              Engineering_Network                                            the following routes within the reassigned portion.    following routes. When necessary, edit route
                                                                                                                                                                                                                                                                                                                                             attributes in the following table(s).
                     Effective Date                                                  Effective Date                                                  Effective Date                                                   Effective Date                                                  Route Name        From Measure      To Measure
                                                                                                                                                                                                                                                                                                                                                                   Route: A
                      1/1/2020                                                       1/1/2020                                                       1/1/2020                                                        1/1/2020                                                      R1                9.1               10
                                                                                                                                                                                                                                                                                                                                                             Line Name: LineB

                                                                                                                                                                                                                                                                                      R2                0                 70                 Route Name                                    A
                                           Source                                                         Source                                                         Source                                                          Source
                       From Route Name                                                 From Route Name                                                 From Route Name                                                  From Route Name                                                                                                      From Measure                                  9.1

                      R1                                                             R1                                                             R1                                                              R1                                                                                                                   To Measure                                    95
                         From Measure (in feet)                                          From Measure (in feet)                                          From Measure (in feet)                                           From Measure (in feet)

                      9.1                                                            9.1                                                            9.1                                                             9.1                                                                                                                  Line Name                  LineB

                            Use route start measure                                         Use route start measure                                         Use route start measure                                          Use route start measure                                                                                         Route ID                   {A92373-92505-0161
                         To Route Name                                                   To Route Name                                                   To Route Name                                                    To Route Name
                                                                                                                                                                                                                                                                                                                                             Stationing Direction       Ascending
                      R2                                                             R2                                                             R2                                                              R2
                         To Measure (in feet)                                            To Measure (in feet)                                            To Measure (in feet)                                             To Measure (in feet)                                                                                               Unique Identifier          PipeXYZ

                      70                                                             70                                                             70                                                              70                                                                                                                   Description                good
                            Use route end measure                                           Use route end measure                                           Use route end measure                                            Use route end measure
                                                                                                                                                                                                                                                                                                                                             Alternative Route Nam
                            Recalibrate route downstream                                    Recalibrate route downstream                                    Recalibrate route downstream                                     Recalibrate route downstream
                            Transfer calibration points                                     Transfer calibration points                                     Transfer calibration points                                      Transfer calibration points                                                                                     Status                     active

                                                                                                                                                                                                                                                                                                                                         Comment
                                           Method                                                          Method                                                          Method                                                           Method
                                                                                                                                                                                                                                                                                                                                             Town
                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                             County
                      to existing route   as new route(s)   to existing route         to existing route   as new route(s)   to existing route         to existing route   as new route(s)   to existing route          to existing route   as new route(s)   to existing route
                      on same line        on same line      on another line           on same line        on same line      on another line           on same line        on same line      on another line            on same line        on same line      on another line
                                                                                                                                                                                                                                                                                                                                             State

                                                                                                                                                                                                                                                                                                                                     ZipCode
                      as new route(s)      to a new line                              as new route(s)      to a new line                              as new route(s)      to a new line                               as new route(s)      to a new line
                      on another line                                                 on another line                                                 on another line                                                  on another line
                                                                                                                                                                                                                                                                                                                                             Direction

                                          Target                                                         Target                                                         Target                                                          Target
                         Route Name                                                      Route Name                                                      Route Name                                                       Route Name
                     A                                                              A                                                              A                                                               A
                         From Measure (in feet)                                          From Measure (in feet)                                          From Measure (in feet)                                           From Measure (in feet)
                         9.1                                                            9.1                                                            9.1                                                             9.1                                                    
                         To Measure (in feet)                                            To Measure (in feet)                                            To Measure (in feet)                                             To Measure (in feet)
                         80                                                             80                                                             80                                                              80                                                     
                            Recalibrate route downstream                                    Recalibrate route downstream                                    Recalibrate route downstream                                     Recalibrate route downstream

                                                                          Next                                                            Next                                                            Next                                                             Next                                           Back      Next                                            Back         Run

                                              Result                                                      Result                                                              Result                                                        Result
                                   Merge source and target –                                   Monotonicity is checked:                                            Merge source and target –                                     Monotonicity is checked:
                                        proportion kept                                        Non-monotonic error or                                                 proportion not kept                                        Non-monotonic error or
                                                                                                merge with proportion                                                                                                            merge without proportion

                                                                                                                                                                                                                                           
                                                                                     Non-monotonic error or                                                                                                          Non-monotonic error or
                                                                                     same as previous                                                                                                                same as previous
To new rt another line CP transferred = routes kept intact and all CPs are transferred                                                                                           CP not transferred = routes are kept intact and only calibration points on ends of routes are transferred
     Location Referencing                                      Location Referencing                                Location Referencing                                  Location Referencing                                      Location Referencing                                Location Referencing                            
                          Reassign Route                                           Reassign Route                                         Reassign Route                                            Reassign Route                                           Reassign Route                                        Reassign Route                 
      Network                                                      This reassignment will result in the retirement of     This reassignment will result in the creation of the     Network                                                      This reassignment will result in the retirement of     This reassignment will result in the creation of the
       Engineering_Network                                         the following routes within the reassigned portion.    following routes. When necessary, edit route              Engineering_Network                                         the following routes within the reassigned portion.    following routes. When necessary, edit route
                                                                                                                          attributes in the following table(s).                                                                                                                                        attributes in the following table(s).
      Effective Date                                               Route Name        From Measure      To Measure                                                                  Effective Date                                               Route Name        From Measure      To Measure
                                                                                                                                                New route                                                                                                                                                                    New route
       1/1/2020                                                   R1                9.1               10                                  Line Name: Line B                        1/1/2020                                                   R1                9.1               10
                                                                                                                                                                                                                                                                                                                        Line Name: Line B
                                                                   R2                0                 70                  Route 1 of 2                                                                                                     R2                0                 70                  Route 1 of 2  
                           Source                                                                                        Route Name                    R1_reassign                                     Source
                                                                                                                                                                                                                                                                                                       Route Name                     R1_reassign
                                                                                                                                                                                       From Route Name
          From Route Name
                                                                                                                          From Measure                  9.1                         R1                                                                                                                From Measure                   9.1
       R1                                                                                                                                                                             From Measure (in feet)
          From Measure (in feet)                                                                                          To Measure                    10                                                                                                                                             To Measure                     10
                                                                                                                                                                                    9.1
       9.1
                                                                                                                          Line Name                 LineB                                 Use route start measure                                                                                      Line Name                  LineB
             Use route start measure
                                                                                                                          Route ID                  {A92373-92505-0161                 To Route Name
          To Route Name                                                                                                                                                                                                                                                                                Route ID                   {A92373-92505-0161
                                                                                                                                                                                    R2
       R2                                                                                                                Stationing Direction      Ascending                          To Measure (in feet)                                                                                            Stationing Direction       Ascending
          To Measure (in feet)
                                                                                                                          Unique Identifier         PipeXYZ                         70                                                                                                                Unique Identifier          PipeXYZ
       70
                                                                                                                          Description               good                                  Use route end measure
             Use route end measure                                                                                                                                                                                                                                                                     Description                good
                                                                                                                                                                                          Recalibrate route downstream
             Recalibrate route downstream
                                                                                                                          Alternative Route Nam                                           Transfer calibration points                                                                                  Alternative Route Nam
             Transfer calibration points
                                                                                                                          Status                    active                                              Method                                                                                        Status                     active
                           Method
                                                                                                                          Comment
                                                                                                                                                                                                                                                                                                 Comment

                                                                                                                          Town                                                                                                                                                                         Town
                                                                                                                                                                                     to existing route   as new route(s)   to existing route
        to existing route   as new route(s)   to existing route                                                                                                                      on same line        on same line      on another line
        on same line        on same line      on another line                                                             County                                                                                                                                                                       County

                                                                                                                        State                                                                                                                                                                      State
                                                                                                                                                                                     as new route(s)      to a new line
        as new route(s)      to a new line                                                                                ZipCode                                                    on another line                                                                                                   ZipCode
        on another line
                                                                                                                          Direction                                                                                                                                                                    Direction
                           Target                                                                                             Apply attributes to all routes                                           Target                                                                                             Apply attributes to all routes
          Line name                                                                                                                                                                    Line name

       LineB                                                                                                                                                                       LineB
                                                                                                                                                                                                                                                                                                                                            Back    Next
                                                           Next                                        Back      Next                                           Back     Run                                                            Next                                       Back      Next                                              Back    Run

                                                                                                                                                Result                                                                                                                                                                   Result
                                                                                                                                        Do not merge. Rid and                                                                                                                                                     Do not merge. Rid and
                                                                                                                                      Rname kept intact (can be                                                                                                                                                 Rname kept intact (can be
                                                                                                                                      changed in attribute table).                                                                                                                                              changed in attribute table).
                                                                                                                                        All CPs are transferred.                                                                                                                                                    Only end CPs are
                                                                                                                                                                                                                                                                                                                       transferred.

                                                                                                                                                                                                                                                                                                                                   
To an existing rt - continuous network
                         CP transferred; recal target                         CP transferred; no recal target                    CP not transferred; recal target                        CP not transferred; no recal target
                       Location Referencing                                 Location Referencing                            Location Referencing                                Location Referencing                               Location Referencing                                Location Referencing                                 
                                             Reassign Route                                       Reassign Route                                    Reassign Route                                         Reassign Route                                    Reassign Route                                        Reassign Route                     
                        Network                                                 Network                                            Network                                                Network                                               This reassignment will result in the retirement of     This reassignment will result in the creation of the
                         Continuous_Network                                      Continuous_Network                                 Continuous_Network                                     Continuous_Network                                   the following routes within the reassigned portion.    following routes. When necessary, edit route
                                                                                                                                                                                                                                                                                                       attributes in the following table(s).
                        Effective Date                                          Effective Date                                     Effective Date                                         Effective Date                                        Route Name        From Measure      To Measure
                         1/1/2020                                               1/1/2020                                          1/1/2020                                              1/1/2020                                            R2                12                15                                       Route: R3

                                                                                                                                                                                                                                                                                                       Route Name                                    R3
                                              Source                                                Source                                            Source                                                 Source                                                                                From Measure                                  12
                            From Route Name                                         From Route Name                                    From Route Name                                        From Route Name
                         R2                                                     R2                                                R2                                                    R2                                                                                                         To Measure                                    20
                            From Measure (in feet)                                  From Measure (in feet)                             From Measure (in feet)                                 From Measure (in feet)
                                                                                                                                                                                                                                                                                                       Route ID                   {A92373-92505-0161
                         12                                                     12                                                12                                                    12
                                 Use route start measure                                 Use route start measure                            Use route start measure                                Use route start measure                                                                             Stationing Direction       Ascending

                            To Measure (in feet)                                    To Measure (in feet)                               To Measure (in feet)                                   To Measure (in feet)                                                                                     Unique Identifier          PipeXYZ
                         15                                                     15                                                15                                                    15                                                                                                         Description                good
                                 Use route end measure                                   Use route end measure                              Use route end measure                                  Use route end measure
                                 Recalibrate route downstream                            Recalibrate route downstream                       Recalibrate route downstream                           Recalibrate route downstream                                                                        Alternative Route Nam
                                 Transfer calibration points                             Transfer calibration points                        Transfer calibration points                            Transfer calibration points                                                                         Status                     active

                                                                                                                                                                                                                                                                                                   Comment
                                              Method                                                  Method                                             Method                                                 Method
                                                                                                                                                                                                                                                                                                       Town
                                                                                                                                                                                                             
                                                                                                                                                                                                                                                                                                       County
                          to an existing      as a new route                      to an existing    as a new route                   to an existing    as a new route                       to an existing     as a new route
                          route                                                   route                                              route                                                  route
                                                                                                                                                                                                                                                                                                       State

                                              Target                                                Target                                            Target                                                Target                                                                                 ZipCode

                            Route name                                              Route name                                         Route name                                             Route name                                                                                               Direction
                         R3                                                     R3                                                R3                                                    R3
                                                                                                                                                                                                                                                                                                       Parcel
                            From Measure (in feet)                                  From Measure (in feet)                             From Measure (in feet)                                 From Measure (in feet)
                            12                                                     12                                                12                                                    12                                         
                            To Measure (in feet)                                    To Measure (in feet)                               To Measure (in feet)                                   To Measure (in feet)
                            15                                                     15                                                15                                                    15                                         
                                 Recalibrate route downstream                            Recalibrate route downstream                       Recalibrate route downstream                           Recalibrate route downstream
                                                                                                                                                                                                                                                                                    Back      Next                                            Back        Run
                                                                       Next                                               Next                                                    Next                                                  Next

                                                                                                        Result                                                                                                      Result
                                                    Result                                     Monotonicity is checked:
                                                                                                                                                               Result                                        Monotonicity is checked:
                                           Merge source and target –                           Non-monotonic error or                                 Merge source and target –                              Non-monotonic error or
                                                proportion kept                                 merge with proportion                                    proportion not kept                                 merge without proportion

                                                                                                                                                                                                                     
                                                                                    Non-monotonic error or                                                                                     Non-monotonic error or
                                                                                    same as previous                                                                                           same as previous
To new rt - continuous
                     CP transfered; no recal target option CP not transfered; no recal target option
                         Location Referencing                         Location Referencing                                Location Referencing                                Location Referencing                           
                                             Reassign Route                                  Reassign Route                                     Reassign Route                                        Reassign Route                 
                          Network                                         Network                                                This reassignment will result in the retirement of     This reassignment will result in the creation of the
                                                                                                                                 the following routes within the reassigned portion.    following routes. When necessary, edit route
                           Continuous_Network                              Continuous_Network
                                                                                                                                                                                        attributes in the following table(s).
                                                                                                                                 Route Name        From Measure      To Measure
                          Effective Date                                  Effective Date                                                                                                                      New Route
                           1/1/2020                                        1/1/2020                                              R2                12                15
                                                                                                                                                                                      Route Name                            Rnew

                                               Source                                          Source                                                                                 From Measure                          0
                              From Route Name                                 From Route Name                                                                                           To Measure                            5
                           R2                                             R2
                              From Measure (in feet)                          From Measure (in feet)                                                                                    Route ID                  {A92373-92505-0161
                           12                                             12                                                                                                          Stationing Direction      Ascending
                                  Use route start measure                         Use route start measure
                                                                                                                                                                                        Unique Identifier         PipeXYZ
                              To Measure (in feet)                            To Measure (in feet)
                           15                                             15                                                                                                          Description               good

                                  Use route end measure                           Use route end measure                                                                                 Alternative Route Nam
                                  Recalibrate route downstream                    Recalibrate route downstream
                                                                                                                                                                                        Status                    active
                                  Transfer calibration points                     Transfer calibration points
                                                                                                                                                                                        Comment
                                               Method                                         Method                                                                                  Town

                                                                                                                                                                                    County
                            to an existing   as a new route                 to an existing     as a new route
                                                                                                                                                                                        State
                            route                                           route

                                                                                                                                                                                        ZipCode
                                               Target                                         Target
                                                                                                                                                                                        Direction
                              Route name                                      Route name
                              Rnew                                            Rnew                                                                                                      Parcel

                              From Measure (in feet)                          From Measure (in feet)
                              0                                              0                                           
                              To Measure (in feet)                            To Measure (in feet)
                              5                                              5                                           

                                                                  Next                                                   Next                                        Back      Next                                           Back     Run

                                                 Result                                               Result
                                      Merge source and target –                              Merge source and target –
                                           proportion kept                                      proportion not kept

                                                                                                        
