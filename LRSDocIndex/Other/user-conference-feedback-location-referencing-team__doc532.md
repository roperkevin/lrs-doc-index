# User Conference Feedback - Location Referencing Team

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Source** | [User Feedback.xlsx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/User%20Feedback.xlsx>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `workbookdump` |

<!-- metadata
```yaml
title: "User Conference Feedback - Location Referencing Team"
source_file: "User Feedback.xlsx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/User%20Feedback.xlsx"
doc_id: 532
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: "Claire Wang"
dev: ""
author: ""
last_edited_by: ""
last_edited: ""
extracted: 2026-09-04
extraction_lane: workbookdump
prompt_version: "v2.0.2"
keywords: ["user feedback", "location referencing", "event editing", "route management", "temporal data", "arcgis pro", "roads and highways"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":566,"file":"unified-pipeline-tools-add-in__doc566.md","s":2.309},{"doc":75,"file":"overlay-events-location-referencing__doc75.md","s":1.779},{"doc":560,"file":"time-aware-lrs__doc560.md","s":1.697},{"doc":422,"file":"overlay-events-location-referencing__doc422.md","s":1.627},{"doc":199,"file":"set-location-referencing-options__doc199.md","s":1.621}]
```
-->

## Summary

This document compiles user feedback collected by the Location Referencing team during various user conferences in 2023. It includes attendee information, organizational context, product interests (Roads and Highways or ArcGIS Pro), workflow issues, feature requests, and follow-up actions. The feedback covers topics such as event editing, route management, temporal data representation, and integration with external systems.

## Related documents

<!-- related:begin -->
- [Unified Pipeline Tools add-in](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/unified-pipeline-tools-add-in__doc566.md>) — similar text 0.06 · same kind/surface <!-- rel:566 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-location-referencing__doc75.md>) — similar text 0.06 · same kind/surface <!-- rel:75 -->
- [Time-aware LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/time-aware-lrs__doc560.md>) — similar text 0.09 · same kind/surface <!-- rel:560 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-location-referencing__doc422.md>) — similar text 0.07 · same kind/surface <!-- rel:422 -->
- [Set Location Referencing options](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/set-location-referencing-options__doc199.md>) — similar text 0.04 · same kind/surface <!-- rel:199 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-location-referencing-options.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)
<!-- docs:end -->

---

## Sheet: User Conference(s)
| User Conference 2023 - Location Referencing Team |  |  |  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |  |  |  |  |
| No. | LR team Member name  (collecting information) | Name of the UC Attendee | Email | Organization Name | Role | Product - RH or APR ? | Background Info or Work context including persona | Issue or Workflow including steps | Existing or New Feature? | Action Items | Responsible Party | Any other relavant details |
| 1 | Claire Wang | Praveen Raj |   | Pipeline company in India |   | APR | Has his own company, data, and tools. Just want to see if Pro 3D can benefit his company. Not a prospective user. |   |   | showed Scene  |  |  |
| 2 | Claire Wang | Mike Schug | mschug@spokanecity.org | City of Spokane | Senior business systems analyst  | APR | Sewer company in ArcMap. Currently does not have any extension/solution. Looking for products. | Wondered if APR had any sewer company users. NASCO PACP; Sewer pipeline inspection -- wants events to snap and register to network for inspectionm/monitoring/tracking purposes. Cares about inspection direction so he asked about reverse events that can show direction on route. | New - reverse events,  but I don't think we want to have a solution for him | Overviewed APR, event-route relationships, and event editing. |  |  |
| 3 | Claire Wang | Azra |   | Texas |   | APR | Company is still in Pro 2.2, and plans to update to 2.9 | Had trouble create route at beginning of a line (Is it impossible to do so in 2.2?) Does not want time slice update due to line order change (there won't be a solustion for now)  Really wants Rename and the combined ribbon, which are 3.1 features while the company only has plans for 2.9. | Existing | Not really any. May check 2.2 if needed. Mentioned off-route-events. |  |  |
| 4 | Claire Wang | Neil Woodhouse | linkedin.com/in/neil-woodhouse-5b84b59 | NetraDyne LLC | Principal researcher | RH | New to ESRI ecosystem. Looking for products for NetraDyne. Netradyne is a company using dashcam on vehicles to capture event data. The company is responsible to attach & update event data to routes, which are  external sources. However, they only have route geometry, but no Rid/name. REST will be ut… |   |   | Introduced Geometry to Measure and Generate Intersection in REST. (Need to run Create Intersection first, but not in REST.) Introduced Append Events (and update/retire options). Slightly interested in offline event collection. Want to record off-route-events and their true distance from the snapped … |  |  |
| 5 | Claire Wang | Keith SoRelle | keith.sorelle@gmail.com | City of Fort Worth, Texas | IT programmer analyst | RH | Migrating to Pro. His role focuses on QC (e.g. speed sign (point event) every 200 m along the route; traffic light must be on intersection; etc) |   |   | Directed to Eric and Mentioned Data Reviewer to him |  |  |
| 6 | Claire Wang | Caroline? Charlotte? |   | MassDOT |   | RH | Popped up when I happened to run out of cards. But she was talking to Nathan so Nathan might remember who she is. | Wanted to clarify "Add events by offset" definition as she was interested in off-route-events |   | Asked about off-route-events. Introduced XY to points + Append Events/Geometry to measure + Proximity to document off-route-events. |  |  |
| 7 | Claire Wang | Garrett Gee |   | Co. of Kauai, HI |   | RH | Organization is on 10.8.1. Uses Pro. No experience with LocRef but some exp with Linear Ref. Cares about temporal representation of data - the org wants to be able to store historical slices and see how everything changes across time. (so time slicing will be very helpful) Likes time slider. Asks qu… | Animation of the data's temporal view using Pro Time. |   | Introduced Cl sequence table, LRS schema and relationships, and tools to create and update events. Recommended 11.1/3.1 for event editing capabilities. |  |  |
| 8 | Claire Wang | Jeffrey Holden | https://www.linkedin.com/in/jeffreynholden/ | Washington State Department of Natural Resources | GIS developer | RH | Oracle db. He made an app for his org, but he thinks it's time to move to Pro as Event editing in Pro is more complete. 1 network with many events. Interested in getting route data/making route fields - interested in talking to Washington State DOT. | Importing and management of external event data. Might utilize FS to publish data region by region for mgmt purposes. | Had a suggestion on Move behavior: if route moves slightly, events move; if route shape greatly changes, event retire (tolerance might be customized) | Demoed many route editing and event editing tools. Introduced event behaviors which he was very interested in. |  |  |
| 9 | Claire Wang | Many prospective users of RH |   | smaller oranizations or orgs that require only simple capabilities: EV/truck companies; highway patrol; trace reporting; student researcher; natural resources |   | RH | They are new to RH/ESRI, and are looking to know products to manage their data, whch is often few linear features, or a single event (e.g. the noise wall exapmle). Some of them are Arcmap users with fgdb and shapefiles. | Append/configure external events to routes |   | Overviewed LocRef and introduced linear ref to most of them. A few of them mentioned off-route-events. Introduced XY to points + Append Events/Geometry to measure + Proximity to document off-route-events. |  |  |
| 10 | Lakshmi | Christopher P. Enright | christopher.Enright@nmgco.com | NewMexico Gas company | GIS Analyst | UN+APR |  Looking for working with gapped routes | Currently working in Pro 2.6/ Enterprise 10.8.1. In a line network customer was not able to create routes with gap in a single line. | Existing | Need to let the client know from which release gapped routes are supported and follow up with them for further questions. |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |
| 11 | Lakshmi | Jenny He | 81 |  | 76 |  | They are working with pipeline data and interested in UN and APR | Demoed UN+APR, showed them the solutions which can be downloaded and explored | Existing | 85 |  |  |
| 12 | Lakshmi | David Mcclemen | 87 |  | 18 |  | Gas company exploring APR | Demoed the capabilities |  |  |  |  |
| 13 | Lakshmi | William Taylor | 91 |  | GIS and Records Engineer | APR | 89 |  | Existing |  |  |  |
| 14 | Lakshmi | Yugi Nowa |  | Esri Japan |  | APR |  | Demoed the capabilities | Existing |  |  |  |
| 15 | Lakshmi | Alexsandra Sepetowska | 96 |  | 76 |  | Gas company exploring UN+ APR | Demoed the capabilities | Existing |  |  |  |
| 16 | Lakshmi | Malcolm Wade | malcolm.wade@state.mn.us | Minnesota DOT | 38 |  | 101 |  |  |  |  |  |
| 17 | Johum | N/A | N/A | Velero Energy Texas | GIS Analyst | APR | Gas company exploring UN+ APR | Overview of APR, Demoed the capabilities | Existing | Prospective customer |  |  |
| 18 | Johum | N/A | N/A | Duke Energy North Carolina | GIS Analyst | APR | Gas company exploring UN+ APR | Overview of APR, Demoed the capabilities | Existing | Prospective customer |  |  |
| 19 | Johum | Peter | N/A | Newzealand Highways | GIS Analyst | RH | Highways agency looking into RH solution | Overview of RH, Demoed the capabilities | Existing | Prospective customer |  |  |
| 20 | Johum | Zhenya Zhu | N/A | Caltrans | GIS Analyst | RH | Existing Customer | Support configuring events with potmile, Configuring related table or external table with Pom, Stationing offset from a route, finding route & m for station off the route, finding the closest point associated with the selected highway/route with given lat/long station | New | Existing Customer |  |  |
| 21 | Johum | N/A | N/A | Jamica Roads and Public Works | GIS Analyst | RH | Looking into RH for manging their RH data | Overview of RH, Demoed the capabilities | Existing | Prospective customer |  |  |
| 22 | Johum | Oriana | N/A | Florida DoT | GIS Coordinator | RH | Will soon be using RH | Overview of RH, Demoed the capabilities | Existing | Prospective customer |  |  |
| 23 | Johum | Andre | N/A | Amtrack | GIS Analyst | RH | Can they use RH license through ArcGIS online ? (viewer, editor) Will there be double billing for those licneses ? | Specific qustion related to licensing  | Existing | Existing Customer |  |  |
| 24 | Johum | N/A | N/A | Saudi Aramco | GIS Lead | APR | Was complining about APR + UN too dificult to deploy and understand despite of their team attending the online courses offered by esri | questions about data loading, data model, where to start after deploying the a basic schema | Exisitng  | Existing Customer |  |  |
| 25 | Johum | Hussein Nisaer | N/A | Esri UN team | Principal PE + PO for Arcade Expressions & Attribute rules | UN+APR | Existing Customers are complning that UN supports mobile gdb but APR doesnot.  | Suggested that we should support mobile gdbs as APR + UN customers want that. Also, they will be changing / updating BV and might contact our team to make sure that conflict prevention from our side is not broken with that BV change/update | New | Existing Customer |  |  |
| 26 | Nathan | 136 |  |  | CIO | RH | Used to work at Alaska DOT.  Looking at RH to support their couple of hundred miles of track throughout the state. | Different groups within the organization have different representations of their track.  PTC also keeps a representation.  Would like to have one representation as an authoritative LRS.  Recently put out an RFP for Asset Management that included an LRS component. | 140 |  |  |  |
| 27 | Nathan | Ken and Mike | 141 |  | GIS Manager and GIS Analyst | RH | Wants to manage a trails LRS.  Also seeing the borough growing so interested in RH to handle routes and characteristics. | Currentl uses Cartegraph product for everything and don't like the limited spatial aspect.  Interested in RH and potential intergration with external systems.  Also uses Local Government Addressing solution so interested in potential intergration. | 146 |  |  |  |
| 28 | Nathan | Martin | 148 |  | GIS Developer | APR | Currently manages group of 8 that are responsible for all aspects of APR | Asked for a tool to change dates on existing routes, requested tool to align ILI data with existing centerlines in bulk via cartographic realignment, asked for point event suport in dynamic segmentation.  Overall, very happy with the product and mentioned it's brought multiple efficiencies to the or… | Existing | All three requests already exist in backlog.  Have attached Interpipeline to list of customers requesting. |  |  |
| 29 | Nathan | 152 |  |  | Multiple editors | RH | Editors that current use the home built LRS product with questions about RH as the organization evaluates the product as they move to Pro | The company has been evaluating RH in Pro and had concerns about how their current workflows would fit into branch versioning restrictions of no grandchild versions.  Discussed conflict prevention (which they liked) but it seems like they would benefit from some way to reconcile between child versio… | New | Jeff Belhadj from GBD is coordinating follow up |  |  |
| 30 | Nathan | 157 |  |  | GIS Analyst | RH | Interested in steps to migrate from ArcMap to Pro | Currently using RH in ArcMap, was interested in how to move to Pro and any considerations they need to be aware of.  Shared a link to the migration guide for 3.1. | 159 |  |  |  |
| 31 | Nathan | Dan Brown, Devin Doring | 167 |  | GIS Manager and GIS Analyst | RH | Currently implementing RH with PS support | Interested in integration with Cityworks, wanted to understand the intergration options for address management (phase 2 of their project), requested a count option within any reporting tools created, also wants overlapping events supported in dynseg | Existing | Both requests have been added to backlog.  Jay and Nathan working with account manager to setup follow up to show addressing integration. |  |  |
| 32 | Nathan | Adam Miller | 166 |  | GIS Manager | RH | Interested in RH, especially with NE DOT also looking to implement | Is required to report mileage to NE DOT each year.  Interested in RH to support this.  Also has multiple centerline representations across the organization and would like to move to a single authoritative representation. | 146 |  |  |  |
| 33 | Nathan | Amy Ordaz | 172 |  | 173 |  | Want to understand upgrade process to add UN to APR |   | 175 |  |  |  |
| 34 | Nathan | Carl | 177 |  | GIS Manager for all products | RH | Meeting with field maintenance team at ITD (Idaho DOT) | Met with Field Maintenance lead for ITD.  Huge GIS advocate and was discussing the need to have a streamlined experience to collect asset information.  PS has built various for use applications, but customer is looking for one unified app.  They also don't care about LRS, so they would prefer that i… | 181 |  |  |  |
| 35 | Mac | Cameron Cole and another staff member  | 183 |  | GIS | RH | Manage data for all the counties in Washington State.  Currently in ArcMap and they have a very large number of EE instances (39 in total) deployed for each county to use and update.  The road edits that counties make come in individually and are very difficult for them to enter in. | Had an issue with their events not showing directly on their routes in EE.  Their events still work as intended, though.  They  | Existing | I let them know to check the tolerances of their LRS (they said they were extremely zoomed in, so I thought it was likely just a tolerance issue).  I also told them to check their EE web map's projection/coordinate systems to make sure it matched their underlying data. | 189 |  |
| 36 | Mac | Roy or Ray? | 248 |  | Assest Management | RH | He works with a lot of local governements in Washington State doing asset management. | They really want offset events | New Feature | 194 |  |  |
| 37 | Mac | 195 |  |  | GIS | APR | They are moving to UNAPR from SmallWorld GIS.  They had a training a while ago regarding the UN and APR, but they some users in their org that are reluctant to move to Pro and like how things are.   | They are interested in receiving APR training again | N/A | I let them know about requesting an APR instructor-led training.  I also gave them a demo of Pro with a UNAPR dataset. |  |  |
| 38 | Mac | 200 |  |  | GIS | APR | He mentioned that he is one of if not the only GIS person.  He was curious about APR and wanted a demo. | 20 |  | Gave him a general demo of Pro so that he could see how the software works |  |  |
| 39 | Mac | 203 |  |  | GIS | RH | He was interested in Pro and RH. | 202 |  |  |  |  |
| 40 | Mac | 94 |  |  | Distributor | APR | He worked for Esri Japan. Mentioned that some gas companies in Japan would likely be interested in APR | 206 |  |  |  |  |
| 41 | Mac | 208 |  |  | GIS | RH | He was interested in Pro and RH. | 202 |  |  |  |  |
| 42 | Mac | 209 |  |  | 18 |  | They were interested in seeing the UN more than they wanted to see APR.  I think the signage of the APR booth confused them, many users interested in the UN came by and were confused when we told them that we weren't part of the UN team.  They were very interested in our symbology from the UPDM solu… | 210 |  |  |  |  |
| 43 | Mac | 211 |  |  | GIS | APR | She was somewhat interested in APR, but more into the symbology than the actual solution.   | 214 |  |  |  |  |
| 44 | Mac | 212 |  |  | 18 |  | Two people came over to check out our booth, but didn't seem very interested in the solution.  One of them asked if we could do 3D and was very excited about the 3D aspects of GIS. | 216 |  |  |  |  |
| 45 | Mac | 217 |  |  | 38 |  | They are a not a tranportation company or a gas company, but a utility company that I think focuses on electric.  They were very interested in the time slicing capabilities of Location Referencing as a whole. | 219 |  |  | 220 |  |
| 46 | Mac | 222 |  |  | GIS | 223 |  | 224 |  |  |  |  |
| 47 | Mac | 244 |  |  | Professor | APR | Interested in teaching their students APR, currently there is only an electric program  | 246 |  |  |  |  |
| 48 | Rahul | Evert Vencer | Evert.vencer@libertyutilities.com | Liberty Utilities | Engineer1 | RH | CAD/Civil Engineer | 231 |  |  | Rahul |  |
| 49 | Rahul | Thomas Hoesli | Thomas.hoseli@lu.ch | Dept of planning and economy, Switzerland | Deputy director general | RH | Wanted to know what is RH | 237 |  |  | Rahul |  |
| 50 | Rahul | Malcom Wade | Malcom.wade.state.mn.us | Minnesota DOT | 38 |  | Not having lock root version is a problem to move to Pro | 243 |  |  | Rahul |  |

## Sheet: GIST
(empty)
