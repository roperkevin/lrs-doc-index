# Anchoring Data in Time & Space: ADOT’s Journey in Harnessing LRS Spatiotemporality

| Field | Value |
| --- | --- |
| **Doc** | 719 · Other · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#2200](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/2200) |
| **Source** | [2200_5106_376863001618777410.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/2200_5106_376863001618777410.pdf>) |
| **People** | author — · PE Patrick Whiteford · dev Bo Guo |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | spatiotemporality · temporal lrs · referent lrm · route measure · temporal topology · event editing · data profiling |
| **Tools** | — |

## Summary

The document discusses the evolution and challenges of linear referencing systems (LRS) with a focus on temporal aspects in the Arizona Department of Transportation (ADOT). It covers temporal versioning models, spatiotemporal topology challenges, and the need for improved event editing and data maintenance approaches. The presentation also highlights ADOT's journey in integrating temporal referent LRM and spatiotemporal exploration for GIS-T applications.

## Related documents

<!-- related:begin -->
- [ADOT’s Multi-prong Approach to SafeGuard LRS Data Quality](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/2843-adots-multi-prong-approach-to-safeguard-lrs-data-quality.md>) — similar text 0.19 · 1 title word · same kind/dev/folder <!-- rel:720 s=2.733 -->
- [LRS Data Template and Route Log Configuration](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/lrs-data-template-and-route-log-configuration.md>) — similar text 0.03 · same kind/surface/folder <!-- rel:284 s=2.141 -->
- [Update Intersection Referent Tool User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-intersection-referent-tool.md>) — similar text 0.03 · same surface/folder <!-- rel:696 s=1.822 -->
- [Event Editing Using the Attribute Table](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/event-editing-using-the-attribute-table.md>) — similar text 0.05 · same kind/surface <!-- rel:318 s=1.684 -->
- [Event Editing Using Feature Edits](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/event-editing-using-feature-edits.md>) — similar text 0.05 · same kind/surface <!-- rel:319 s=1.675 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)
<!-- docs:end -->

---

                                                             4/18/2021

                             GIS-T 2021

         Anchoring Data in Time & Space:
                  ADOT’s Journey in Harnessing LRS
                        Spatiotemporality

                                     Patrick Whiteford, GISP &
                                              Bo Guo, PhD, PE

           Multimodal Planning
❑ Federal Reporting (HPMS, MIRE, ARNOLD)
❑ Data Owner (RCI/LRS)
❑ Perform Agency Wide GIS Analysis
❑ Map and Data Creation

                                                                    1
                                                                                          4/18/2021

                                                                            1970s Mainframe

                        1994 Esri ArcINFO/ArcGIS -
                             LRM: Route Referent

                       2014 Esri R&H -
                    LRM: Route Measure

                                                              ADOT LRS

GIS Temporal Versioning Models
                2019
     2017
                                                        2017 - 2019
         2018

  Snapshot Model                                     Composite Model row-
Dataset/table-level                                level Versioning versioning

                                                                                                 2
                                                                          4/18/2021

         Two Time Axes - in ADOT R&H
Valid time - denoting the life-span of an event or geometry object, maintained by user

          FromDate
          ToDate
          Temporal resolution: day

Transaction time - denoting the time database entries are posted, mostly maintained automatically to the precision of system clock

          Open to Traffic dates
          Temporal resolution: day

     Route Measure vs. Referent LRM
Route Measure LRM
- Most fundamental LRM but has challenges
- Lack of human understanding
- Event measure cascading change challenges

Route Referent Offset LRMs
- Milepost + Offset
- Intersection + Offset

ADOT business reasons...

                                                                                 3
                                                                                              4/18/2021

               Spatiotemporal Topology
 LRS Topology Challenges                              Reference LRM Challenges

                           Event Beyond Route

                           Event Overlaps

                           Event Gaps

           New LRS Challenges Emerge
              Route                                             Events
Time                                            Time

                                                                   ?             ?    ?

  T                                               T
  2                                               2

  T                                               T
  1                                               1

Measur                                               Measur e                                                    e

                                                                                                     4
                                                   4/18/2021

           Rise to the Challenges
❑ Understand and visualize temporal deficiencies
❑ Review data maintenance processes
❑ Research on better maintenance approaches
❑ Restore reference-offset LRM
❑ AEGIST Pooled Fund Model

                                                          5
                                                                                                    4/18/2021

                                 A Temporal LRS Primer

   Temporal LRS Segment Definition
Time
               Linear                  Point Period
               Period

                                                Observe Date

                 Point Instant
Valid time resolution of “day” is considered adequate for most GIS-T
Linear Instant events

Measur e

  A Temporal LRS Primer

        Segment
        Topology
The Cardinal LRS rules

 1. No Event exists beyond its route extent
 2. No Intra-event Overlap not allowed

                                                                                                           6
                                                                  4/18/2021

               A Temporal LRS Primer

       A Temporal Segment Operation
1 - Split time                    time
                                                     2 - Retire
                                       3
                                                     3 - Add
                               1

                                   2

              measure                      measure

  Temporal
Referent LRM

                                                                         7
                                      4/18/2021

In Search of an LRS Event Editor...
- Spatiotemporal Exploration
- Referent LRM Support
- Map and Graphics based Editing
- On-the-fly QC

                                             8
                                                                           4/18/2021

      Data Challenges and Opportunities
     ❑ Data profiling & cleansing
     ❑ Systems integration
     ❑ Route network as a Service
     ❑ Temporal topology
     ❑ Temporal nuances
     ❑ Intersection tables

                                                               1970s Mainframe

                              1994 Esri ArcINFO/ArcGIS -
                                          LRM: Referent

                              2014 Esri R&H -
                           LRM: Route Measure
2021 & Beyond Esri R&H -
 LRM: Temporal Referent

                                                           ADOT LRS

                                                                                  9
                                       4/18/2021

                          Questions?
❑ Patrick Whiteford, GISP pwhiteford@azdot.gov
   602.712.8591

❑ Bo Guo, PhD, PE bo.guo@gisticinc.com
   480.656.9962

                                             10
