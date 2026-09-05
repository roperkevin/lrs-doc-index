# Configure External Event Behaviors With LRS

| Field | Value |
| --- | --- |
| **Doc** | 248 · Other · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [GP_Configure External Event Behaviors With LRS.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6268_ExternalEventConfiguration/GP_Configure%20External%20Event%20Behaviors%20With%20LRS.docx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2025-01-23 20:16 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | external event · event behavior · enterprise geodatabase · calibrate route · retire route · extend route · reassign route · realign route · reverse route · carto realign route · python |
| **Tools** | ConfigureExternalEventBehaviorWithLRS |

## Summary

Describes how to create and modify external events in an LRS within an enterprise geodatabase. Defines default event behavior rules for activities such as calibrate, retire, extend, reassign, realign, reverse, and cartographic realign. Provides usage details, parameters, and Python code examples for configuring external event behaviors using ArcGIS Location Referencing.

## Related documents

<!-- related:begin -->
- [Event behaviors in ArcGIS Pipeline Referencing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-in-arcgis-apr-apr-2024-10.md>) — similar text 0.22 · 2 title words · 2 filename words · same kind/surface <!-- rel:302 s=4.841 -->
- [Support External Event Configuration Without Connection File – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6159-support-external-event-configuration-without-connection-file.md>) — similar text 0.13 · 2 title words · 2 filename words · same surface <!-- rel:275 s=3.584 -->
- [Event behaviors in ArcGIS Pipeline Referencing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-in-arcgis-apr-apr-2024-10-2.md>) — similar text 0.26 · 2 title words · 2 filename words · same kind <!-- rel:862 s=3.302 -->
- [Configure Utility Network Feature Class (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configure-un-feature-class-lr.md>) — similar text 0.28 · 1 title word · 1 filename word · same kind/surface <!-- rel:84 s=2.853 -->
- [Configure Address Feature Classes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6267-configure-address-feature-classes-lr.md>) — similar text 0.26 · 1 title word · 1 filename word · same kind/surface <!-- rel:249 s=2.78 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [External event registration](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/external-event-registration.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/retire-routes.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/extend-a-route.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reassign-routes.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/realign-routes.html) · [Reverse routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reverse-routes.html)
<!-- docs:end -->

---

## Configure External Event Behaviors With LRS (Location Referencing)

### Summary
Creates an external event in an LRS without linking to an external event system.

### Usage

- The geodatabase where the external event is created and in which the LRS resides must be an enterprise geodatabase.
- This tool can also be used to modify the name, geometry type, and event behaviors of for the existing configured external events.
- The following event behavior rules are set by default:

| Activity | Rule |
| --- | --- |
| Calibrate Route | Stay Put |
| Retire Route | Stay Put |
| Extend Route | Stay Put |
| Reassign Route | Stay Put |
| Realign Route | Stay Put |
| Reverse Route | Stay Put |
| Carto Realign Route | Honor Route Measure |

- To update external events, provide required route and event information in the web service. Learn more about updating external events (add link to Relocate Event).

### Parameters

### Dialog

| Label | Explanation | Data Type |
| --- | --- | --- |
| LRS Event Name | The name of the external event or table that will be registered to the LRS. | String |
| Parent LRS Network | The LRS Network to which the event will be registered. | Feature Layer |
| Geometry Type<br>(Optional) | Specifies the geometry type of the external event or table.<br>Point— The geometry type of the event will be point. This is the default.<br>Line— The geometry type of the event will be polyline. | String |
| Calibrate Rule<br>(Optional) | Specifies the event behavior rule for the calibrate activity.<br>Stay put— The geographic location of the event will be preserved; measures may change. This is the default.<br>Retire—Both measure and geographic location will be preserved; the event will be retired.<br>Move—The measures of the event will be preserved; the geographic location may change. | String |
| Retire Rule<br>(Optional) | Specifies the event behavior rule for the retire activity.<br>Stay put— The geographic location of the event will be preserved; measures may change. This is the default.<br>Retire— Both measure and geographic location will be preserved; the event will be retired.<br>Move— The measures of the event will be preserved; the geographic location may change.<br>Snap—The geographic location of the event will be preserved by snapping the event to a concurrent route; measures may change. | String |
| Extend Rule<br>(Optional) | Specifies the event behavior rule for the extend activity.<br>Stay put— The geographic location of the event will be preserved; measures may change. This is the default.<br>Retire— Both measure and geographic location will be preserved; the event will be retired.<br>Move— The measures of the event will be preserved; the geographic location may change.<br>Cover—The geometric location and measure of a line event will be modified to include a new or newly modified section. | String |
| Reassign Rule<br>(Optional) | Specifies the event behavior rule for the reassign activity.<br>Stay put— The geographic location of the event will be preserved; measures may change. This is the default.<br>Retire— Both measure and geographic location will be preserved; the event will be retired.<br>Move— The measures of the event will be preserved; the geographic location may change.<br>Snap— The geographic location of the event will be preserved by snapping the event to a concurrent route; measures may change. | String |
| Realign Rule<br>(Optional) | Specifies the event behavior rule for the realign activity.<br>Stay put— The geographic location of the event will be preserved; measures may change. This is the default.<br>Retire— Both measure and geographic location will be preserved; the event will be retired.<br>Move— The measures of the event will be preserved; the geographic location may change.<br>Snap—The geographic location of the event will be preserved by snapping the event to a concurrent route; measures may change.<br>Cover—The geometric location and measure of a line event will be modified to include a new or newly modified section. | String |
| Reverse Rule<br>(Optional) | Specifies the event behavior rule for the reverse activity.<br>Stay put— The geographic location of the event will be preserved; measures may change. This is the default.<br>Retire— Both measure and geographic location will be preserved; the event will be retired.<br>Move— The measures of the event will be preserved; the geographic location may change. | String |
| Carto Realign Rule<br>(Optional) | Specifies the event behavior rule for the cartographic realign activity.<br>Honor Route Measure—The measure of the event will be preserved or changed proportionally to the route's measure change. This is the default. | String |

### Derived Output

| Label | Explanation | Data Type |
| --- | --- | --- |
| Updated LRS Workspace | The updated LRS w orkspace | Workspace |

### Python
arcpy.locref. ConfigureExternalEventBehaviorWithLRS(event_name, parent_network, {geometry_type}, {calibrate_rule}, {retire_rule}, {extend_rule}, {reassign_rule}, {realign_rule}, {reverse_rule}, {carto_realign_rule})     

| Name | Explanation | Data Type |
| --- | --- | --- |
| event_name | The name of the external event or table that will be registered to the LRS. | String |
| parent_network | The LRS Network to which the event will be registered. | Feature Layer |
| geometry_type<br>(Optional) | Specifies the geometry type of the external event or table.<br>POINT— The geometry type of the event will be point. This is the default.<br>LINE— The geometry type of the event will be polyline. | String |
| calibrate_rule<br>(Optional) | Specifies the event behavior rule for the calibrate activity.<br>STAY_PUT— The geographic location of the event will be preserved; measures may change. This is the default.<br>RETIRE—Both measure and geographic location will be preserved; the event will be retired.<br>MOVE—The measures of the event will be preserved; the geographic location may change. | String |
| retire_rule<br>(Optional) | Specifies the event behavior rule for the retire activity.<br>STAY_PUT— The geographic location of the event will be preserved; measures may change. This is the default.<br>RETIRE— Both measure and geographic location will be preserved; the event will be retired.<br>MOVE— The measures of the event will be preserved; the geographic location may change.<br>SNAP—The geographic location of the event will be preserved by snapping the event to a concurrent route; measures may change. | String |
| extend_rule<br>(Optional) | Specifies the event behavior rule for the extend activity.<br>STAY_PUT— The geographic location of the event will be preserved; measures may change. This is the default.<br>RETIRE— Both measure and geographic location will be preserved; the event will be retired.<br>MOVE— The measures of the event will be preserved; the geographic location may change.<br>COVER—The geometric location and measure of a line event will be modified to include a new or newly modified section. | String |
| reassign_rule<br>(Optional) | Specifies the event behavior rule for the reassign activity.<br>STAY_PUT— The geographic location of the event will be preserved; measures may change. This is the default.<br>RETIRE— Both measure and geographic location will be preserved; the event will be retired.<br>MOVE— The measures of the event will be preserved; the geographic location may change.<br>SNAP— The geographic location of the event will be preserved by snapping the event to a concurrent route; measures may change. | String |
| realign_rule<br>(Optional) | Specifies the event behavior rule for the realign activity.<br>STAY_PUT— The geographic location of the event will be preserved; measures may change. This is the default.<br>RETIRE— Both measure and geographic location will be preserved; the event will be retired.<br>MOVE— The measures of the event will be preserved; the geographic location may change.<br>SNAP—The geographic location of the event will be preserved by snapping the event to a concurrent route; measures may change.<br>COVER—The geometric location and measure of a line event will be modified to include a new or newly modified section. | String |
| reverse_rule<br>(Optional) | Specifies the event behavior rule for the reverse activity.<br>STAY_PUT— The geographic location of the event will be preserved; measures may change. This is the default.<br>RETIRE— Both measure and geographic location will be preserved; the event will be retired.<br>MOVE— The measures of the event will be preserved; the geographic location may change. | String |
| carto_realign_rule<br>(Optional) | Specifies the event behavior rule for the cartographic realign activity.<br>HONOR_ROUTE_MEASURE—The measure of the event will be preserved or changed proportionally to the route's measure change. This is the default. | String |

### Derived Output

| Label | Explanation | Data Type |
| --- | --- | --- |
| out_workspace | The updated LRS w orkspace | Workspace |

### Code sample
ConfigureExternalEventBehaviorsWithLRS example 1 (Python window)
The following script demonstrates how to use the ConfigureExternalEventBehaviorWithLRS function to configure an external point event in the Python window.
\# Name: Configure_Externaleventbehaviors_LRS_ex1.py
\# Description: Configure an external point event in an LRS Network in the Python window.
\# Requires: ArcGIS Location Referencing

\# Check out license
arcpy.CheckOutExtension("LocationReferencing")

#Tool variables
event_name = "PointEvent"
parent_network = "C:\\Networkdata.sde\\Network1"
geometry_type = "POINT"
calibrate_rule = "STAY_PUT"
retire_rule ="STAY_PUT"
extend_rule ="STAY_PUT"
reassign_rule ="STAY_PUT"
realign_rule ="STAY_PUT"
reverse_rule = "STAY_PUT"
carto_realign_rule = "HONOR_ROUTE_MEASURE"

\# set current workspace
\# arcpy.env.workspace = "C:\\Networkdata.sde"

\# execute the tool
arcpy.locref. ConfigureExternalEventBehaviorWithLRS(event_name, parent_network, geometry_type, calibrate_rule, retire_rule, extend_rule, reassign_rule, realign_rule, reverse_rule, carto_realign_rule)

\# Check in license
arcpy.CheckInExtension("LocationReferencing")

ConfigureExternalEventBehaviorsWithLRS example 2 (Python window)
The following script demonstrates how to use the ConfigureExternalEventBehaviorsWithLRS function to configure an external line event with different event behaviors in the Python window.
\# Name: Configure_Externaleventbehaviors_LRS_ex2.py
\# Description: Configure an external line event in an LRS Network in the Python window.
\# Requires: ArcGIS Location Referencing

\# Check out license
arcpy.CheckOutExtension("LocationReferencing")

\# Tool variables
event_name = "LineEvent"
parent_network = "C:\\Networkdata.sde\\Network1"
geometry_type = "LINE"
calibrate_rule = "STAY_PUT"
retire_rule ="RETIRE"
extend_rule ="COVER"
reassign_rule ="SNAP"
realign_rule ="COVER"
reverse_rule = "MOVE"
carto_realign_rule = "HONOR_ROUTE_MEASURE"

\# Set current workspace
arcpy.env.workspace = "C:\\Networkdata.sde"

\# Execute the tool
arcpy.locref. ConfigureExternalEventBehaviorsWithLRS(event_name, parent_network, geometry_type, calibrate_rule, retire_rule, extend_rule, reassign_rule, realign_rule, reverse_rule, carto_realign_rule)

\# Check in license
arcpy.CheckInExtension('LocationReferencing')

ConfigureExternalEventBehaviorsWithLRS example 3 (Python window)
The following script demonstrates how to use the ConfigureExternalEventBehaviorsWithLRS function to modify an existing external line event in the Python window.
\# Name: Configure_Externaleventbehaviors_LRS_ex3.py
\# Description: Modify an existing external line event in an LRS Network in the Python window. Event name and optional parameter fields are updated.
\# Requires: ArcGIS Location Referencing

\# Check out license
arcpy.CheckOutExtension("LocationReferencing")

\# Tool variables
event_name = "LineEvent"
parent_network = "C:\\Networkdata.sde\\Network1"
geometry_type = "LINE"
calibrate_rule = "RETIRE"
retire_rule ="RETIRE"
extend_rule ="RETIRE"
reassign_rule ="RETIRE"
realign_rule ="RETIRE"
reverse_rule = "STAY_PUT"
carto_realign_rule = "HONOR_ROUTE_MEASURE"

\# Set current workspace
arcpy.env.workspace = "C:\\Networkdata.sde"

\# Execute the tool
arcpy.locref. ConfigureExternalEventBehaviorWithLRS(event_name, parent_network, geometry_type, calibrate_rule, retire_rule, extend_rule, reassign_rule, realign_rule, reverse_rule, carto_realign_rule)

\# Check in license
arcpy.CheckInExtension("LocationReferencing")

ConfigureExternalEventBehaviorsWithLRS example 4 (stand-alone script)
The following stand-alone script demonstrates how to use the ConfigureExternalEventBehaviorsWithLRS function to configure an external line event that spannings routes in an LRS Network.
\# Name: Configure_Externaleventbehaviors_LRS_ex4.py
\# Description: Configure an external line event in an LRS Network using a stand-alone Python script.
\# Requires: ArcGIS Location Referencing

\# Import arcpy module
import arcpy

\# Check out license
arcpy.CheckOutExtension("LocationReferencing")

#Tool variables
event_name = "LineEvent"
parent_network = "C:\\Networkdata.sde\\Network1"
geometry_type = "LINE"
calibrate_rule = "STAY_PUT"
retire_rule ="STAY_PUT"
extend_rule ="STAY_PUT"
reassign_rule ="STAY_PUT"
realign_rule ="STAY_PUT"
reverse_rule = "STAY_PUT"
carto_realign_rule = "HONOR_ROUTE_MEASURE"

\# set current workspace
arcpy.env.workspace = "C:\\Networkdata.sde"

\# execute the tool
arcpy.locref. ConfigureExternalEventBehaviorWithLRS(event_name, parent_network, geometry_type, calibrate_rule, retire_rule, extend_rule, reassign_rule, realign_rule, reverse_rule, carto_realign_rule)

\# Check in license
arcpy.CheckInExtension("LocationReferencing")

ConfigureExternalEventBehaviorsWithLRS example 5 (stand-alone script)
The following stand-alone script demonstrates how to use the ConfigureExternalEventBehaviorsWithLRS function to modify an existing external point event in an LRS Network.
\# Name: Configure_Externalevent_LRS_ex5.py
\# Description: Modify an existing external point event of an LRS Network using a stand-alone Python script. Event name and optional parameter fields are updated.
\# Requires: ArcGIS Location Referencing

\# Import arcpy module
import arcpy

\# Check out license
arcpy.CheckOutExtension("LocationReferencing")

#Tool variables
event_name = "PointEvent"
parent_network = "C:\\Networkdata.sde\\Network1"
geometry_type = "POINT"
calibrate_rule = "RETIRE"
retire_rule = "RETIRE"
extend_rule = "RETIRE"
reassign_rule = "RETIRE"
realign_rule = "RETIRE"
reverse_rule = "STAY_PUT"
carto_realign_rule = "HONOR_ROUTE_MEASURE"

\# set current workspace
arcpy.env.workspace = "C:\\Networkdata.sde"

\# execute the tool
arcpy.locref. ConfigureExternalEventBehaviorWithLRS(event_name, parent_network, geometry_type, calibrate_rule, retire_rule, extend_rule, reassign_rule, realign_rule, reverse_rule, carto_realign_rule)

\# Check in license
arcpy.CheckInExtension("LocationReferencing")

### Environments
This tool does not use any geoprocessing environments.

### Licensing information

- Basic: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
