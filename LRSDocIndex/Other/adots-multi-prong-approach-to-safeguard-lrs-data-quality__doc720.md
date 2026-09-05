# ADOT’s Multi-prong Approach to SafeGuard LRS Data Quality

|   |   |
| --- | --- |
| **Kind** | Other · Enterprise |
| **Release** | — |
| **Issue** | [ArcGISPro/ps-location-referencing#2843](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/2843) |
| **Source** | [2843_5848_533865001618280159.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/2843_5848_533865001618280159.pdf>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "ADOT’s Multi-prong Approach to SafeGuard LRS Data Quality"
source_file: "2843_5848_533865001618280159.pdf"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/2843_5848_533865001618280159.pdf"
doc_id: 720
doc_kind: "Other"
surface: "Enterprise"
doc_revision: ""
target_release: ""
pe: "James Meyer"
dev: "Bo Guo"
author: ""
last_edited_by: ""
last_edited: ""
extracted: 2026-09-04
extraction_lane: plaintext
prompt_version: "v2.0.2"
keywords: ["data quality", "linear referencing system", "data quality index", "r&h pathology", "event management", "visualization"]
tools: ["Data Quality Index", "FME QC Processes", "Data Reviewer", "Dashboards"]
products: []
issues: ["ArcGISPro/ps-location-referencing#2843"]
related: [{"doc":719,"file":"anchoring-data-in-time-space-adots-journey-in-harnessing-lrs-spatiotemporality__doc719.md","s":2.733},{"doc":718,"file":"caltrans-roads-and-highways-migration-project__doc718.md","s":1.937},{"doc":810,"file":"esri-roads-and-highways-and-agileassets-integration-technical-specification__doc810.md","s":1.676},{"doc":613,"file":"deployment-guide-ready-to-use-lrs-checks-attribute-rules__doc613.md","s":1.6},{"doc":295,"file":"modify-overlay-events-service-contract__doc295.md","s":1.193}]
```
-->

## Summary

The document describes Arizona DOT's multi-prong approach to safeguarding Linear Referencing System (LRS) data quality through data review, visualization, and quality control processes. It covers components such as Data Quality Index (DQI), R&H pathology issues, and enhanced LRS event management. The approach includes dashboards, SQL datamarts, FME QC processes, and defensive editing techniques to improve data integrity and visualization.

## Related documents

<!-- related:begin -->
- [Anchoring Data in Time & Space: ADOT’s Journey in Harnessing LRS Spatiotemporality](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/anchoring-data-in-time-space-adots-journey-in-harnessing-lrs-spatiotemporality__doc719.md>) — similar text 0.19 · 1 title word · same kind/dev/folder <!-- rel:719 -->
- [Caltrans Roads and Highways Migration Project](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/caltrans-roads-and-highways-migration-project__doc718.md>) — similar text 0.04 · same kind/folder <!-- rel:718 -->
- [Esri Roads and Highways and AgileAssets Integration Technical Specification](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/esri-roads-and-highways-and-agileassets-integration-technical-specification__doc810.md>) — similar text 0.05 · same kind/folder <!-- rel:810 -->
- [Deployment Guide: Ready-to-Use LRS Checks Attribute Rules](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/deployment-guide-ready-to-use-lrs-checks-attribute-rules__doc613.md>) — similar text 0.03 · same kind/folder <!-- rel:613 -->
- [Modify Overlay Events Service Contract](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/modify-overlay-events-service-contract__doc295.md>) — similar text 0.02 · same folder <!-- rel:295 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Data Quality Index](https://www.google.com/search?q=%22Data%20Quality%20Index%22+site%3Adoc.esri.com) · [FME QC Processes](https://www.google.com/search?q=%22FME%20QC%20Processes%22+site%3Adoc.esri.com) · [Data Reviewer](https://www.google.com/search?q=%22Data%20Reviewer%22+site%3Adoc.esri.com) · [Dashboards](https://www.google.com/search?q=%22Dashboards%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

                     Discover, Assess, Expose, Fix, Immunize

                           ADOT’s Multi-prong
                    Approach to SafeGuard LRS
                                   Data Quality

James Meyer, GISP
Arizona DOT

Bo Guo, PhD, PE
Gistic Research
Data Review &
Visualization Project
                                                                                       The Silo
Bridge            HPMS      Pavements          P2P         Traffic            Safety     Story

                         Linear Referencing System (LRS)

                                   DataViz
Roads & Highway                   Dashboards                         SQL Datamart
Dashboards
                                        R&H Processes

 Reports /                     QC
Dashboards                   Database

                                            FME QC
                                           Processes

                         Y
R&H Editing /                  R&H
                QC’ed?
  Loading                    Database

                    N
                                               Data
                                             Reviewer

                              Ad Hoc
                               QC
                                                      Research

Funded by ADOT DataViz Project

   1. Data Quality Index -
   2. R&H Pathology - Funded by the DataViz Project

Funded by Gistic LinearBench Project

   1. Enhanced LRS Event Management
Data Quality Index (DQI)

Section   Component Description   Score Type              Assessed                     Calculated

          Source Data Location      Qual                     1, 0                            -

 Source   Update Notification       Qual                     1, 0                            -

          Up-to-date                Quan         0 - Unknown, 1 - No, 2 - Yes                -

          Maintenance Schedule      Qual                     1, 0                            -
Process
          Maintenance Tool          Quan       0 - Unknown, 1 - tool1, 2 - tool2             -

          Key Integrity (%)         Qual                       -                     If exists 1 else 0

Quality   Overlap (%)                                                                     0: > 1%
                                    Quan                       -                   1: >=0.001% & <= 1%
          Route Extent (%)                                                              2: < 0.001%
DQI

      DQI Formula
DQI in Metadata Dashboards
R&H Pathology

                1. From Measure Larger Than To Measure
                2. Authoritative Source: Event LRS vs Event
                  Shape
                3. Multi-part Event Shape
                4. Domain Violations
                5. Phantom Events
                6. Overlapping Events
Better Mouse-trap?

                     Enhance LRS Visual Discovery

                         ○ Time-space diagram (TSD)
                         ○ 3D TSD

                     Practise Defensive Edit

                         ○ Edit-time error checking
                         ○ Pathology Filter

                     Implement Reference-Offset LRM

                         ○ LRM for Humans

                     Support R&H
Questions

James Meyer, GISP
 jmeyer@azdot.gov

 Bo Guo, PhD, PE
bo.guo@gisticinc.com
