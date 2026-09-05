# Generate Intersections (Location Referencing)

| Field | Value |
| --- | --- |
| **Doc** | 130 · Other · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#6758](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6758) |
| **Source** | [6758_GentIntGP.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6758_GentIntGP.docx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2025-08-26 18:03 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | intersections · lrs network · route · conflict prevention · editor tracking · feature class |
| **Tools** | Generate Intersections |

## Summary

Describes the Generate Intersections tool used to create and update intersections in an LRS Network. Explains parameters, usage scenarios, conflict prevention, and provides Python code examples for automation. Includes licensing and environment requirements for ArcGIS Location Referencing.

## Related documents

<!-- related:begin -->
- [Allow LRS Intersections to be updated without locking intersecting routes - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6758-allow-lrs-intersections-to-be-updated-without-locking.md>) — shared issue ArcGISPro/ps-location-referencing#6758 · similar text 0.25 · 1 title word · same surface <!-- rel:155 s=1002.4 -->
- [11.5 Server Patch 2 and 3.5.6 Patch Issues](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6961-11-5-server-patch-2-and-3-5-6-patch-issues.md>) — shared issue ArcGISPro/ps-location-referencing#6758 · similar text 0.09 · same kind/surface <!-- rel:81 s=1001.513 -->
- [Generate Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-events-lr.md>) — similar text 0.61 · 1 title word · same kind/surface <!-- rel:69 s=4.159 -->
- [Generate LRS Intersection GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-lrs-intersection-gp.md>) — similar text 0.20 · 1 title word · same kind/surface <!-- rel:834 s=3.991 -->
- [Generate Length Summary (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6748-generate-length-summary-lr.md>) — similar text 0.32 · 1 title word · same kind/surface/folder <!-- rel:158 s=3.332 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-intersection-properties.html) · [LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [Generate Intersections](https://www.google.com/search?q=%22Generate%20Intersections%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Generate Intersections (Location Referencing)

### Summary
Generates new intersections and updates existing intersections.
Learn more about generating and updating intersections in Pipeline Referencing or generating and updating intersections in Roads and Highways.

### Usage

- The Intersection Feature Class parameter value is a point feature class created by the Create LRS Intersection tool or the Create LRS Intersection From Existing Dataset tool that stores LRS intersection data. The LRS intersection feature class is updated as a result of running this tool.
- The Network Layer parameter value is a line feature class that stores the LRS Network data. You can select routes from this feature class to update their intersections. Routes in the network layer that share a common route ID with the selected routes across time are used to generate intersections. Definition filters on the network layer are also considered.
- The route selection or definition queries are only considered if the Network Layer parameter value is provided.
- The Start Date parameter is used to update intersections on the routes that have been edited since the defined date.
- You can enable editor tracking for the network layer. Editor tracking is used to find the added, updated, or edited features. Using editor tracking in conjunction with the Start Date parameter value, you can update only those intersections that have changed since the Start Date value provided by the user. This may result in faster performance.
- If the Only use routes edited by current user parameter is checked, only routes edited by the current user in the current version, as identified by editor tracking, will have intersections updated. For an LRS dataset in a file geodatabase, the intersections will be updated for routes that are edited by the current Microsoft Windows user. Editor tracking must be enabled for the network feature class to use this functionality.
- The routes to be processed for updating the intersections are identified based on the route selection, route definition query, date selection, and the Only use routes edited by current user parameter value. If you provide these values, only the routes that fulfill all four conditions will be processed for updating intersections.
- Intersections will not be generated at the self-intersecting locations of a route.
- This tool supports conflict prevention and will attempt to acquire and transfer locks.
- Learn more about conflict prevention in ArcGIS Pipeline Referencing or conflict prevention in ArcGIS Roads and Highways.
- When conflict prevention is enabled, the following is supported:
  - You can override existing locks on intersecting routes by checking the Ignore conflict prevention locks parameter, and the intersections will be updated.
  - If the Ignore conflict prevention locks Generate intersections even if there are conflict prevention locks parameter is checked, existing locks on the intersecting routes will be bypassed, and no new locks will be acquired as a result of running this tool., allowing you to perform additional route edits.

### Parameters

#### Dialog

| Label | Explanation | Data Type |
| --- | --- | --- |
| Intersection Feature Class | The input LRS intersection feature class or layer. | Feature Layer |
| Network Layer<br>(Optional) | The input LRS Network feature class or layer. | Feature Layer |
| Start Date<br>(Optional) | Filters routes that have been edited after a certain date so that intersections can be generated. | Date |
| Only use routes edited by current user<br>(Optional) | Specifies whether intersections will be generated only for routes edited and locked by the current user.<br>Checked—Intersections will be generated only for routes edited by the current user. This is the default.<br>Unchecked—Intersections will be generated for all edited routes. | Boolean |
| Ignore conflict prevention locks<br>Generate intersections even if there are conflict prevention locks<br>(Optional) | Specifies whether existing locks on the intersecting routes will be ignored.<br>Checked—The route locks will be ignored.<br>Unchecked—The route locks will not be ignored. This is the default.<br>This parameter is only available when conflict prevention is enabled on the LRS dataset. | Boolean |

#### Derived Output

| Label | Explanation | Data Type |
| --- | --- | --- |
| Updated Intersection Feature Class | The updated LRS intersection feature class or layer. | Feature Layer |
| Output Details File | A text file that details changes made by the tool.<br>Note:<br>Validation results for this tool are written to the ArcGIS Server directory. This file is automatically cleaned up in 10 minutes by default, which may not be enough time to process all of the validations and write them to your workstation that is running ArcGIS Pro . For larger data loads, it is recommended that you adjust the maximum file age to at least one hour. | Text File |

#### Python
arcpy.locref.GenerateIntersections(in_intersection_feature_class, {in_network_layer}, {start_date}, {edited_by_current_user}, {ignore_conflict_prevention})

| Name | Explanation | Data Type |
| --- | --- | --- |
| in_intersection_feature_class | The input LRS intersection feature class or layer. | Feature Layer |
| in_network_layer<br>(Optional) | The input LRS Network feature class or layer. | Feature Layer |
| start_date<br>(Optional) | Filters routes that have been edited after a certain date so that intersections can be generated. | Date |
| edited_by_current_user<br>(Optional) | Specifies whether intersections will be generated only for routes edited and locked by the current user.<br>CURRENT_USER—Intersections will be generated only for routes edited by the current user. This is the default.<br>ALL_USERS—Intersections will be generated for all edited routes. | Boolean |
| bypass _conflict_prevention<br>(Optional) | Specifies whether existing locks on the intersecting routes will be ignored.<br>BYPASS _CONFLICT_PREVENTION —The route locks will be ignored.<br>NO_ BYPASS _CONFLICT_PREVENTION —The route locks will not be ignored. This is the default.<br>This parameter is only available when conflict prevention is enabled on the LRS dataset. | Boolean |

#### Derived Output

| Name | Explanation | Data Type |
| --- | --- | --- |
| out_intersection_feature_class | The updated LRS intersection feature class or layer. | Feature Layer |
| out_details_file | A text file that details changes made by the tool.<br>Note:<br>Validation results for this tool are written to the ArcGIS Server directory. This file is automatically cleaned up in 10 minutes by default, which may not be enough time to process all of the validations and write them to your workstation that is running ArcGIS Pro . For larger data loads, it is recommended that you adjust the maximum file age to at least one hour. | Text File |

#### Code sample
GenerateIntersections example 1 (Python window)
The following script demonstrates how to use the GenerateIntersections function in the Python window.
\# Name: GenerateIntersections_ex1.py
\# Description: Generates and updates intersections for intersection features registered with an LRS Network.
\# Requires: ArcGIS Location Referencing

\# Set current workspace
arcpy.env.workspace = r"C:\Data\Demo.gdb"

\# Local variables
in_intersection_feature_class = "LRSI1"
in_network_layer = "NonLineNetwork"
start_date = "5/5/2020"
edited_by_current_user = "CURRENT_USER"
bypass_conflict_prevention = "NO_BYPASS_CONFLICT_PREVENTION"

\# Execute the tool
arcpy.locref.GenerateIntersections(in_intersection_feature_class, in_network_layer, start_date, edited_by_current_user, bypass_conflict_prevention)
GenerateIntersections example 2 (stand-alone script)
The following script demonstrates how to use the GenerateIntersections function in a stand-alone script.
\# Name: GenerateIntersections_ex2.py
\# Description: Generates and updates intersections for intersection features registered with an LRS Network.
\# Requires: ArcGIS Location Referencing

\# Import arcpy module
import arcpy

\# Check out license
arcpy.CheckOutExtension("LocationReferencing")

\# Set current workspace
arcpy.env.workspace = r"C:\Data\Demo.gdb"

\# Local variables
in_intersection_feature_class = r'C:\Data\Demo.gdb\LRS\LRSI1'
in_network_layer = r'C:\Data\Demo.gdb\LRS\NonLineNetwork'
start_date = "5/5/2020"
edited_by_current_user = "CURRENT_USER"
bypass_conflict_prevention = "NO_BYPASS_CONFLICT_PREVENTION"

\# Execute the tool
arcpy.locref.GenerateIntersections(in_intersection_feature_class, in_network_layer, start_date, edited_by_current_user, bypass_conflict_prevention)

\# Check in license
arcpy.CheckInExtension('LocationReferencing')
GenerateIntersections example 3 (stand-alone script)
The following script demonstrates how to use the GenerateIntersections function to add intersections to a feature service.
\# Name: GenerateIntersections_Pro_ex3_fs.py
\# Description: Generates and updates intersections in an existing feature service.
\# Requires: ArcGIS Location Referencing

\# Import arcpy module
import arcpy

\# Check out license
arcpy.CheckOutExtension("LocationReferencing")

\# Input LRS route network and intersection feature class are in feature service.  Signing in portal is required to access the feature service.
arcpy.SignInToPortal('https://yourdomain.com/portal', 'username', 'password')

\# Local variables
in_intersection_feature_class = r"https://yourdomain.com/server/rest/services/FeatureServiceName/FeatureServer/1"
in_network_layer = r"https://yourdomain.com/server/rest/services/FeatureServiceName/FeatureServer/2"
start_date = "5/5/2020"
edited_by_current_user = "CURRENT_USER"
bypass_conflict_prevention = "NO_BYPASS_CONFLICT_PREVENTION"

\# Execute the tool
arcpy.locref.GenerateIntersections(in_intersection_feature_class, in_network_layer, start_date, edited_by_current_user, bypass_conflict_prevention)

\# Check in license
arcpy.CheckInExtension('LocationReferencing')

### Environments
Current Workspace

### Licensing information

- Basic: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
