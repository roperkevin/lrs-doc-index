# A Mobile Solution for Parallel Geospatial Asset & LRS Collection

| Field | Value |
| --- | --- |
| **Doc** | 717 · Other · Other |
| **Product** | — |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#2440](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/2440) |
| **Source** | [2440_8172_153610001619027263.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/2440_8172_153610001619027263.pdf>) |
| **People** | author — · PE Gregory Ciparelli · dev Jesse Day |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | geospatial asset collection · roadway data · mavric · omnispatial · field data collection · linear referencing system · data integration |
| **Tools** | MAVRIC · OmniSpatial · ArcGIS Server · Leaflet · Google Maps · Straight Line Diagram |

## Summary

The document presents CTDOT's development and implementation of a mobile solution for roadway and asset data collection using a geospatial linear referencing system. It describes the MAVRIC system's features, data flow, and CTDOT's implementation, followed by an introduction to OmniSpatial, a progressive web application integrating multiple data sources for field and office data collection. The document includes diagrams, system components, and demonstrations related to geospatial asset collection and LRS data management.

## Related documents

<!-- related:begin -->
- [GDOT’s Roadway Data & Roads and Highways: Then and Now](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/4242-gdots-roadway-data-and-rh-then-and-now.md>) — similar text 0.08 · same kind/surface/folder <!-- rel:721 s=2.232 -->
- [LRS Data Template and Route Log Configuration](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/lrs-data-template-and-route-log-configuration.md>) — similar text 0.09 · same kind/folder <!-- rel:284 s=1.756 -->
- [LRS Data Template for Asset Count](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Data%20Templates/lrs-data-template-for-asset-count.md>) — similar text 0.09 · 1 title word · same folder <!-- rel:286 s=1.677 -->
- [Support Conflict Prevention in Sync Service](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-conflict-prevention-in-sync-service.md>) — similar text 0.10 · same folder <!-- rel:645 s=1.638 -->
- [Unfederating ArcGIS Server when all else fails](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/unfederating-arcgis-server-when-all-else-fails.md>) — similar text 0.02 · same kind/folder <!-- rel:898 s=1.5 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Manage address and roadway characteristic data together](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/manage-address-and-roadway-characteristic-data-together.html)

_No page matched:_ [MAVRIC](https://www.google.com/search?q=%22MAVRIC%22+site%3Adoc.esri.com) · [OmniSpatial](https://www.google.com/search?q=%22OmniSpatial%22+site%3Adoc.esri.com) · [ArcGIS Server](https://www.google.com/search?q=%22ArcGIS%20Server%22+site%3Adoc.esri.com) · [Leaflet](https://www.google.com/search?q=%22Leaflet%22+site%3Adoc.esri.com) · [Google Maps](https://www.google.com/search?q=%22Google%20Maps%22+site%3Adoc.esri.com) · [Straight Line Diagram](https://www.google.com/search?q=%22Straight%20Line%20Diagram%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

                                                                                    4/21/2021

     A Mobile Solution for Parallel
       Geospatial Asset & LRS
              Collection
       Gregory Ciparelli – CTDOT                    Jesse Day – Rizing Geospatial

Presentation Agenda
       • CTDOT LRS Data Development
          • LRS & Data Development/Implementation
          • Expanded Data Model
          • Field Data Collection
       • MAVRIC as a Solution
          • Features & Functionality
          • Data Flow Diagrams
          • CTDOT’s Implementation
       • Live Application Demonstration
          • CTDOT Demo
       • Next Steps for MAVRIC - OmniSpatial
          • Rizing Geospatial PPT

                                                                                           1
                                                                                 4/21/2021

CTDOT LRS & Data Development
     3,732 miles
 State Routes/Roads

      17,407 miles
      Local Roads

       423 miles
      State Ramps

CTDOT LRS & Data Development
 Roadway Data Assets
 Intersections                Facility Type               Highway Type
 Intersection Approaches      Functional Classification   Maintenance VIP
 Interchanges                 Legislative Names           No Thru Trucks
Pavement Configuration       National Highway System     Parkway Designations (Lanes, Medians, Shoulder)   Ownership                   Passing Zones
 Overlaps                     Road Life/On System Year    Highway Use
 Exits                        STRAHNET                    Restrictions
 Runaway Truck Ramps          Scenic Roadways             AADT
 Urban Area                   Borough Limits              Rumble Strips
 Access Control               Bridge Structures           HPMS
                              Rumble Strips               Speed Limits

                                                                                        2
                                                                                    4/21/2021

Expanded Data Model
            MIRE
  Model Inventory of Roadway Elements

 205 elements that comprise MIRE
 Version 2.0.
The MIRE elements are divided among three broad categories:
           Roadway Segments
           Roadway Alignment
           Roadway Junctions

Each category is then broken down further into subcategories that identify the associated data item types.

Field Data Collection
No geospatial component to Access application – strictly driven LRS based

                   Limited attribution – character limits
                Wouldn’t support expanded asset attribution
              Limited access – Whole route & all assets locked
              Roadway Inventory Personnel were only editors

Disconnected systems - all integration of data required time consuming post processing

Aspects of the methodology were sound, but the technology was extremely limiting.

 Keep the methods, upgrade the technology

                                                                                           3
                                                                                                                                       4/21/2021

Features & Functionality
A browser-based roadway and asset data field collection web application that works in connected or disconnected environment, caches data locally within the browser, is GPS tracking enabled, and supports parallel (e.g. multiple asset simultaneous)
data collection efforts for creating or modifying road network and asset data in a simple interactive user interface

Features & Functionality
    Utilize the Geospatial LRS of Record
         • Ability to load current LRS roadway geometry for asset and attribute referencing
         • Snap attribution and/or assets to appropriate route – use GPS tracking for location purposes
         • Ensures continuity in data collection and location referencing
         • QA/QC process before integration back to system of record

    Review/Collect Multiple Assets Concurrently (Parallel Collection)
         • Singular Asset/Attribute collection requires time consuming repeat reviews
         • Planning data has expanded with MIRE to cover a wide variety roadway characteristics
• Need for possible expansion of collectable data elements – build for asset type (e.g. point, line, polygon) as opposed to specific assets

    Integrated Visual Display of Data Elements & Attributes
         • Real time visual interaction with collected/modified assets and attribution
         • Simplified heads up, asset-based, visual display that is touch screen enabled
         • Multiple views of data depending on collection type (e.g. Map View, Road View, SLD View)

                                                                                                                                              4
                                                                                                                                             4/21/2021

Data Flow Diagram
MAVRIC System Component Diagram
                             SQL Server DB Translator                             Upload Data
                                      App Module                                                                    MAVRIC Client
 Data Store                                                                                                         Mobile/Web App
 SQL Server DB                     CSV Translator                               Download Data
                                      App Module
                                             MAVRIC Web Services (CORE)
                                                    Web Application

                                                                            Map Service
 Exor/AWLRS
                                                                ArcGIS Server, Leaflet, Google Maps, etc.
  Oracle Data
                      MAVRIC Web                Exor Translation
                                                                            MAVRIC Client                   Map Service
                       Services                     Module
                 • Transportation Data        • GeoJSON to CSV – SQL     • Browser-based             • User Determined
                   Server (TDS)                 Server Data Warehouse      Application               • ArcGIS Default –
                 • Server-Side Application    • CSV creator - CTDOT      • Platform Agnostic           Google, Bing, Mapbox

Data Flow Diagram
   MAVRIC                                      Exor/AWLRS
                                                                                                                          MAVRIC
                 MAVRIC                                                                        Exor Schema                via TDS
ETL                       MAVRIC Database (Nightly)

                                                Exor Schema                                                               GeoJSON
AssetWise
                                   Data populated by ETL process from Exor

Exor/AWLRS                          Field Data Collection Tool (FDCT) Schema
                                        Data uploaded from the field tool                  FDCT Schema
                                                                                                                          MAVRIC

                  Exor/AWLRS                                                                                              Field Data
CSV File           Formatting                                                                                             Collector
                                                    MAVRIC
                                                    Loader                                                         Road
                                                                                                                               Road Assets
                                                                                                                  Network

                                                                                                                                                    5
                                                                                                                               4/21/2021

CTDOT Implementation
 ARNOLD Network, HPMS, & MIRE Attribution
    • Collecting new network segments and mileage
    • Expanding assets and attributes on developing assets – scalable
    • Following guidance of Traffic Safety & FHWA

 Additional LRS Assets/Events
                                                                                      Annual Photolog Imagery
    • Being used as an office editing tool with accompanying roadway imagery
    • Other offices using MAVRIC to edit LRS events outside Roadway Inventory

 Expanding Networks as LRS
    • Bus Route Network
    • Trails of Regional & Statewide Significance

                                                                                “Real Time” Project Based Imagery Collection

Live Application Demonstration

  MAVRIC 1.0
   CTDOT

 What’s next?

Rizing Geospatial

                                                                                                                                      6
                                                                                                                              4/21/2021

    Introducing OmniSpatial!!

    •         Field data collection using GPS location and touch screen
    •         Office data capture and updates from imagery or LiDAR
    •         Progressive web application, browser-based (Windows, Android, iOS HTML 5 browsers)
    •         Works in connected or disconnected mode
•         Integrates various data sources through web services oLeverages Esri map or feature services oRaster Services (WMS, WFS, etc.)
oVector Tile Services oGeneral web services (non-spatial data)
    •           File-based data integration (Google KML, GeoJSON, Esri Shapefile, CSV, etc.)
    •           Synchronizes updated data to server when back online using REST service calls
    •           Integrates other data/systems through deep linked URLs
    © 2019 Rizing LLC or a Rizing LLC affiliate company. All rights reserved.
                                                                                                                   1
                                                                                                                   3

    OmniSpatial - Several data sources in one view
Sign List (Oracle Table)

  Left Side of Road
Inventory Items                                                                                    Right Side of Road (Field/Office Collect)                                                                                  Inventory Items (Field/Office Collect)

                                                                                                       City Border Data
     Esri R&H                                                                                        (Google Maps - KML)
 (Feature Service)

                                                                                Google Street View
    © 2019 Rizing LLC or a Rizing LLC affiliate company. All rights reserved.
                                                                                or Video Log Data                  1
                                                                                                                   4

                                                                                                                                     7
                                                                                                                       4/21/2021

OmniSpatial – Network Collection with Measures

                                                                            GPS Points

                                                                                                           0.029

                                                                                                           0.027

                                                                                         Driven Distance
                                                                                         Measure Values

                                                                                                           0.025

© 2019 Rizing LLC or a Rizing LLC affiliate company. All rights reserved.
                                                                                                                   1
                                                                                                                   5

OmniSpatial – Video Log Integration

© 2019 Rizing LLC or a Rizing LLC affiliate company. All rights reserved.
                                                                                                                   1
                                                                                                                   6

                                                                                                                              8
                                                                                                             4/21/2021

OmniSpatial – Straight Line Diagramming Integration

© 2019 Rizing LLC or a Rizing LLC affiliate company. All rights reserved.
                                                                                                         1
                                                                                                         7

  Questions
     ?

                                                 Gregory Ciparelli – CTDOT   Jesse Day – Rizing Geospatial

                                                                                                                    9
