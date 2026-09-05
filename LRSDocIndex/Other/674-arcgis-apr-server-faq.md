# ArcGIS Pipeline Referencing Server FAQ

| Field | Value |
| --- | --- |
| **Doc** | 396 · Other · Server |
| **Product** | Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#674](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/674) |
| **Source** | [674_APRServerFAQ.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/674_APRServerFAQ.docx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2024-03-22 23:54 by Ignacia Galvan |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | pipeline referencing · lrs upgrade · system requirements · arcgis server · event editor · geoprocessing tools · event editing · service publishing · config.json |
| **Tools** | Modify LRS · Location Referencing toolbox · Event Editor |

## Summary

This document provides general questions and troubleshooting information related to ArcGIS Pipeline Referencing on ArcGIS Server. It covers topics such as upgrading the LRS, system requirements, accessing geoprocessing tools, Event Editor capabilities, supported browsers, and common errors during service publishing and editing.

## Related documents

<!-- related:begin -->
- [Unfederating ArcGIS Server when all else fails](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/unfederating-arcgis-server-when-all-else-fails.md>) — similar text 0.07 · 1 title word · same kind/surface <!-- rel:898 s=2.547 -->
- [ArcGIS Roads and Highways Experience Builder Widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/667-arcgis-rh-exb-widgets.md>) — similar text 0.19 · same kind <!-- rel:398 s=2.166 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/3147-lr-gp-error-messages.md>) — similar text 0.14 · same kind/folder <!-- rel:39 s=1.985 -->
- [ArcGIS Pipeline Referencing Experience Builder Widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/667-arcgis-apr-exb-widgets.md>) — similar text 0.20 · 1 title word · same kind <!-- rel:399 s=1.765 -->
- [Pipeline Referencing and Roads and Highways Enhancements in Location Referencing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/apr-and-rh-enhancements-in-lr.md>) — similar text 0.09 · 1 title word · same kind <!-- rel:58 s=1.717 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create and modify an LRS](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-and-modify-an-lrs.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [Location Referencing toolbox](https://www.google.com/search?q=%22Location%20Referencing%20toolbox%22+site%3Adoc.esri.com) · [Event Editor](https://www.google.com/search?q=%22Event%20Editor%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

General questions
How do I upgrade my LRS when moving to a newer version of ArcGIS Pipeline Referencing?
View the LRS hierarchy from the Location Referencing tab in the Contents pane or from the geodatabase node in the Catalog pane. If the LRS needs an upgrade, the (Upgrade) text appears next to it in the LRS hierarchy. Run the Modify LRS tool to upgrade the LRS. The operation can take several minutes. Find the version of the LRS Dataset to verify that the LRS has been upgraded.
What are the minimum system requirements for Pipeline Referencing?
The system requirements for Pipeline Referencing include the system requirements for ArcGIS Server; however, Pipeline Referencing is only supported on Windows Server platforms (not Linux or UNIX).
The memory (RAM), disk space, and processor power need to be adjusted based on the data volumes being worked with. In addition, the number of machines in the eEnterprise implementation need to be scaled to handle the number of concurrent requests being requested from the deployment.
For working with linear referencing data in Pipeline Referencing, it is recommended that you at least double the minimum RAM requirements specified by ArcGIS Server. toThis allows for some of the memory requirements needed by the ArcGIS event feature layer, if you are publishing external event tables in your map services.
Learn more about ArcGIS Server system requirements
Is it possible to access the Pipeline Referencing geoprocessing tools on ArcGIS Server?
Yes. The Location Referencing toolbox automatically deploys with ArcGIS Server with most of the tools found in ArcGIS Pro.  You can findRefer to the list of tools that deploy with ArcGIS Server https://pro.arcgis.com/en/pro-app/latest/tool-reference/location-referencing/location-referencing-toolbox-branch-versioning-support.htmhere.  You can also continue to publish geoprocessing tools as a geoprocessing service via through ArcGIS Pro.
ArcGIS Event Editor questions
Is it possible to edit external events in the Event Editor?
Not directly. Event Editor was developed to edit the event data modeled in the geodatabase registered with Pipeline Referencing. The only way external event tables that are not modeled in the geodatabase can be edited within the Event Editor is to create equivalent event feature classes in the geodatabase and register them with Pipeline Referencing. Event data could then be edited, but a process would need to be developed to move edited data from those event feature classes into the external event tables to provide the updates to the external system.  You could also ustilize the Relocate Events REST operation to send updates to external events on regular intervals if creating copies within the geodatabase isn’t an option.
What browsers does the Event Editor support?

- Firefox
- Google Chrome
Why can't I edit certain records or attributes in the Event Editor?
The Event ID, LocError, and ST_length fields are not editable.
Why does n/a show up for the Version in Event Editor?
Event Editor can't determine the single version name to display if you have at least one of the layers in map service that was not versioned or if you have layers from multiple versions in a map service.
Troubleshooting
Why do I get errors when publishing my service with the lLinear rReferencing capability?
Ensure that any Pipeline Referencing and ArcGIS Server licenses haven’t expired.
My web map, referencing a service with the lLinear Rreferencing capability, will not load in Event Editor. What should I do?

### There could be several causes. Ensure the following:

- Ensure tThat the user has access to the web map.
- Ensure That the service with the lLinear rReferencing capability is running on ArcGIS Server.
- Ensure That Pipeline Referencing is installed on all machines in ArcGIS Enterprise hosting the services with the lLinear rReferencing capability.
- Ensure That the Event Editor config.json file is properly formatted (compare it in a file compare tool with the original version to ensure the JSON syntax didn’t get correctedcorrupted).
- Ensure That the web map configuration in the config.json file points to the correct web map.
Why doesn't editing a redline route work in Event Editor?
Ensure that services with the lLinear rReferencing capability also have the Ffeature Accessservice capability enabled.
