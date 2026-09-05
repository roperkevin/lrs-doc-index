# Caltrans Roads and Highways Migration Project

| Field | Value |
| --- | --- |
| **Doc** | 718 · Other · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#4246](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4246) |
| **Source** | [4246_6811_762003001618777852.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/4246_6811_762003001618777852.pdf>) |
| **People** | author — · PE Andy Richardson · dev Andréa Compton |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | postmile system · roads and highways · statewide migration · event conflation · arcgis pro · network migration · quality control |
| **Tools** | Data Reviewer · ModelBuilder · Data Interoperability · Translate Event Measures |

## Summary

Document covers the history, implementation, and migration process of Caltrans Roads and Highways linear referencing systems to Esri's Roads and Highways platform using ArcGIS Pro. It details the statewide migration, event conflation, quality control, challenges, and project status.

## Related documents

<!-- related:begin -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/arcgis-apr-an-introduction-rh-apr-un.md>) — similar text 0.09 · same kind/surface/folder <!-- rel:885 s=2.395 -->
- [Migrate LRS to New GDB Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/migrate-lrs-to-new-gdb-tool.md>) — similar text 0.05 · same surface/folder <!-- rel:569 s=2.381 -->
- [Deployment Guide: Ready-to-Use LRS Checks Attribute Rules](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/4843-deployment-guide-ready-to-use-lrs-checks-attribute-rules.md>) — similar text 0.06 · same kind/surface/folder <!-- rel:613 s=2.178 -->
- [Linear Referencing GP Toolbox Consolidation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-gp-toolbox-consolidation.md>) — similar text 0.06 · same surface/folder <!-- rel:43 s=2.028 -->
- [ADOT’s Multi-prong Approach to SafeGuard LRS Data Quality](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/2843-adots-multi-prong-approach-to-safeguard-lrs-data-quality.md>) — similar text 0.04 · same kind/folder <!-- rel:720 s=1.937 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)

_No page matched:_ [Data Reviewer](https://www.google.com/search?q=%22Data%20Reviewer%22+site%3Adoc.esri.com) · [ModelBuilder](https://www.google.com/search?q=%22ModelBuilder%22+site%3Adoc.esri.com) · [Data Interoperability](https://www.google.com/search?q=%22Data%20Interoperability%22+site%3Adoc.esri.com) · [Translate Event Measures](https://www.google.com/search?q=%22Translate%20Event%20Measures%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

                                                                         4/18/2021

Caltrans Roads and
Highways Migration
Project
ANDY RICHARDSON                             ANDRÉA COMPTON andy.richardson@dot.ca.gov                  andrea.compton@rizing.com

Overview

    Caltrans
      Lead up to Roads and Highways

 Roads and Highways Proof of Concept and Statewide Migration projects
      Status and retrospective

    Rizing Geospatial
      Statewide Migration

      Event Conflation

      Challenges

                                                                                1
                                                                                              4/18/2021

History of Caltrans Linear
Referencing Systems
   Caltrans Postmile System (1964)              ArcGIS Desktop (early 2000’s)
        Postmile Prefixes & Suffixes                 ArcSDE/Oracle
   Transportation System Network (TSN)               Introduced SOAP Postmile Web Service database (Oracle)                                 ArcMap Add-In geocoding tool
        Temporal, not geospatial                     Web-based Postmile Query Tool
        Highway inventory system of record      GeoMedia/Oracle (~2015)
   Workstation ArcInfo (early 1990’s)                To accommodate FHWA All Roads LRS
        Coverages, distributed data                   requirement
        AML/C Executable Dyn Seg tool                Data exported to ArcGIS to support
                                                       Postmile Web Service
   ArcView (late 1990’s)
                                                      Continue to use ArcMap Add-In & web-
        Coverages, distributed data                   based Postmile Query Tool
        Extension/Executable Dyn Seg tool

Roads and Highways Selection

   Business Case                                Roadmap
 GeoMedia was a stopgap solution              System Development Plan to meet FHWA All Roads Network of               Guiding plan for implementation
         Linear Referenced Data (ARNOLD)
         requirement                                Vendor demonstrations

                                                         Esri & Hexagon (GeoMedia)
 Allowed time to evaluate, plan and implement a “permanent” solution           Roads and Highways selection

                                                         Vote by Geospatial Governance
                                                          Board
 Informed by Department geospatial professionals

                                                                                                     2
                                                                                             4/18/2021

Roads and Highways
Implementation
    Proof of Concept Project (Transcend Spatial Solutions, July 2017 – April
     2019)
        Included AllRoads, Postmile, Odometer networks (LRMs)
        Included Functional Class, NHS, sample TSN, sample HPMS (Events)
        Two counties (of 58)
   Main purpose was to figure out how to model the Caltrans Postmile System and business data in Roads and Highways
    Statewide Migration Project (Rizing Geospatial, March 2020 –
     December 2020)
        Includes AllRoads, Postmile, Odometer (derived) networks
           Big data cleanup effort prior was well worth it

        Includes Functional Class, NHS, HPMS
        ArcGIS Pro

Unique Characteristics of the
Caltrans Postmile System
   Centerline-based system, with some Independent Alignments (of different lengths)
    Routes run West->East, South->North (five exceptions)
    Postmiles reset to 0.000 at County Boundaries
      Three decimal places

    Some (very few) routes have Suffix (U: Unrelinquished, S: Supplemental)
   Temporality (Realignments, realignments of realignments, route adoptions) handled using Postmile Prefixes
                                                                             CO RT   PM
                                                                            ALA 580  45.9
                                                                            ALA 880 R33.8
                                                                            ALA 880 R34.8R
                                                                            ALA 880 R34.8L
                                                                            ALA 880S 0.5R
                                                                            ALA 880S 0.5L

                                                                                                    3
                                                                                                                                                4/18/2021

    Modeling the Caltrans Postmile
    System in Roads and Highways
        SCL880...R (LineID 880._R)      ALA880.R.R (LineID 880._R)               ALA880...R (LineID 880._R)
                                                                                                                              Postmile Route
0                            10.502 0                         1.949   2.224                                        31.727

                                        Derived Odometer RouteID 880._R
                                                                                                                               Odometer Route
0                                                            (10.502 – 0) + (1.949 – 0) + (31.727 – 2.224) =          41.954

        All alpha components are stored in               { // syntax of a measure range spanning multiple routes
         Postmile RouteID                                   // to translate to a line geometry
                                                            // this is valid only for networks that support lines
        Odometer Routes “derived” from                     "routeId" : "SCL880...R",
                                                                                            ALA880.R.R
         Postmile Routes (based on LineID)                  "toRouteId" : "ALA880...R",
                                                            "fromMeasure" : 1.123,          County      ALA
    REST API “measureToGeometry”                       "toMeasure" : 15.678 },         Route       880 function supports RouteId and                                                                 Route Suffix       .
         ToRouteId                                                                                     Postmile Prefix    R
                                                                                                       Postmile Suffix    .
                                                                                                       Alignment          R

    Status of Roads and Highways
    Implementation
        Status                                                          Remaining work & challenges
            Went to production in December                                    Mastering network and event edits

 LRS staff has updated all SHS updates                             Properly managing event behavior accumulated from 10/2019 to 10/2020
                                                                               Esri software updates (improved &
            Functional Class and National Highway                              additional functionality)
              System staff have resumed updates
                                                                               Managing HPMS on new platform
            HPMS staff has embarked on entirely
                                                                               Dependent applications (REST API)
              new platform
                                                                               Roads and Highways administration

                                                                               Unknowns

                                                                                                                                                       4
                                                                                            4/18/2021

Challenges & Wins

   Challenges                                           Wins
     Caltrans Postmile System                             Transcend/Rizing Geospatial

     Nine month timeframe for Statewide                   Esri support & responsiveness
      Migration project
                                                           We are successfully in
 Rollout of ArcGIS Pro version of R&H (with            production with Roads and significantly different functionality) as the         Highways
      Statewide Migration project was starting
 Maturity of ArcGIS Pro version of R&H (waiting for releases/complete functionality)

     Statewide Migration

                                                                                                   5
                                                                                         4/18/2021

Iterative Approach

    Iteration 1: Converting the Proof of Concept desktop migration processes to
     ArcGIS Pro 2.5
    Iteration 2: Statewide Migration
      Conflated the 2018 business data to the 2019 routes

 Preformed full statewide routes migration and developed a migration process for all events
    Iteration 3: Final Statewide Migration in ArcGIS Pro 2.6
      Made updates to the conflation process based on findings in Iteration 2

      Made updates to migration process due to upgrading to 2.6

Migration Included

    3 Networks
      All Roads – geometry length network

      Postmile – line network

      Odometer – derived network from Postmile

    38 events

                                                                                                6
                                4/18/2021

Migration Process

    Network
 ArcGIS Pro provided the ability to script/model the R&H steps
    Events
      Data Interoperability,
ModelBuilder, and python scripts
      Conflation process

Network Migration

                                       7
                                                                                            4/18/2021

Event Conflation
   Conflated 2018 business data to 2019 All Roads
   Used multiple phases
      Located segments within a small tolerance to matching Route IDs

      Located segments with a larger tolerance allowing locating to a different Route ID

      Identified which segments were not located and a reason why

   Was able to locate 99.4% of over 1.2 million records

                            Unlocated
                                                    Located

Quality Control
   Used Data Reviewer for validating the networks
 Focusing on checks that would/could cause issues with calibrating the routes in R&H
   Performed mileage comparison on events to ensure mileage wasn’t lost and identified a reason if it was
   Created a gaps and overlaps event checks in
    ModelBuilder and python scripts
   Reviewed Location Errors across each step of the migration

                                                                                                   8
                                                                               4/18/2021

Challenges
   Magnitude of Caltrans data
        676,671 routes
        336,303 miles
   Changing from desktop to ArcGIS Pro 2.5 then to 2.6
        Esri added the support for stepping increments in 2.6
        Better support for complex route shapes
   Removal of the Detect geoprocessing tools from the Location
    Referencing toolbox
   Translate Event Measures geoprocessing tool
        At 2.5 discovered an error with using ROUTE_ID for Concurrent Route
         Matching
        At 2.6 requires the event to registered to a R&H network

    Questions
    THANK YOU

                                                                                      9
