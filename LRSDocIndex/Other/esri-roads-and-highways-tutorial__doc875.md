# Esri Roads and Highways Tutorial

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [LocationReferencing_RoadsAndHighways_Tutorial (1).pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/LocationReferencing_RoadsAndHighways_Tutorial%20(1).pdf>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "Esri Roads and Highways Tutorial"
source_file: "LocationReferencing_RoadsAndHighways_Tutorial (1).pdf"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/LocationReferencing_RoadsAndHighways_Tutorial%20(1).pdf"
doc_id: 875
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
keywords: ["route", "event", "calibration point", "conflict prevention", "branch versioning", "attribute rules", "data review", "linear referencing system", "gapped route", "lrs network", "lrs event", "route editing", "event validation", "workflow manager", "arcgis pro", "location referencing", "versioning", "geoprocessing", "data loading", "centerline", "route retirement", "route realignment", "event behavior", "automated quality control"]
tools: ["Add Global IDs", "Enable Editor Tracking", "Create Route", "Retire Route", "Realign Route", "Apply Event Behavior", "Run Reviewer Rules", "Create LRS Network from Existing Dataset", "Modify Route ID Padding", "Create LRS Event", "Modify Event Behavior Rules", "Append Routes", "Generate Calibration Points", "Generate Routes", "Remove Overlapping Centerlines", "Append Events", "Modify LRS", "Retire Route", "Select By Attributes", "Identify Routes", "Add Calibration Point", "Edit Calibration Point", "Delete Calibration Point", "Locate Route and Measures", "Conflict Prevention", "LRS Locks", "Version Management"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":39,"file":"location-referencing-gp-error-messages__doc39.md","s":5.58},{"doc":566,"file":"unified-pipeline-tools-add-in__doc566.md","s":4.386},{"doc":115,"file":"regression-testing-task-list-v1__doc115.md","s":4.161},{"doc":885,"file":"arcgis-pipeline-referencing-an-introduction__doc885.md","s":4.097},{"doc":276,"file":"manage-address-and-roadway-characteristic-data-together-with-roads-and-highways__doc276.md","s":4.074}]
```
-->

## Summary

This tutorial covers exercises for preparing and publishing LRS data, creating and retiring routes, realigning routes, validating event data, creating data editing workflows, managing calibration points, editing gapped routes, configuring LRS networks and events, loading routes and events, and configuring conflict prevention in ArcGIS Pro using Roads and Highways.

## Related documents

<!-- related:begin -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/location-referencing-gp-error-messages__doc39.md>) — similar text 0.25 · same kind/surface <!-- rel:39 -->
- [Unified Pipeline Tools add-in](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/unified-pipeline-tools-add-in__doc566.md>) — similar text 0.16 · same kind/surface <!-- rel:566 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/regression-testing-task-list-v1__doc115.md>) — similar text 0.16 · same surface <!-- rel:115 -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/arcgis-pipeline-referencing-an-introduction__doc885.md>) — similar text 0.18 · same kind/surface/folder <!-- rel:885 -->
- [Manage Address and Roadway Characteristic Data Together with Roads and Highways and Address Data Management Solution](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/manage-address-and-roadway-characteristic-data-together-with-roads-and-highways__doc276.md>) — similar text 0.20 · 2 title words · same kind/surface <!-- rel:276 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-new-route.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/retire-routes.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/realign-routes.html) · [Create and modify LRS events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-and-modify-lrs-events.html) · [Add calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/add-calibration-points.html) · [Delete calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/delete-calibration-points.html) · [Locate route and measures](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/locate-route-and-measures.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html) · [Release locks through the LRS Locks table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/lrs-locks-table.html) · [View LRS Network properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-network-properties.html) · [View LRS event properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-event-properties.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-location-referencing-options.html) · [Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html)

_No page matched:_ [Add Global IDs](https://www.google.com/search?q=%22Add%20Global%20IDs%22+site%3Adoc.esri.com) · [Enable Editor Tracking](https://www.google.com/search?q=%22Enable%20Editor%20Tracking%22+site%3Adoc.esri.com) · [Apply Event Behavior](https://www.google.com/search?q=%22Apply%20Event%20Behavior%22+site%3Adoc.esri.com) · [Run Reviewer Rules](https://www.google.com/search?q=%22Run%20Reviewer%20Rules%22+site%3Adoc.esri.com) · [Create LRS Network from Existing Dataset](https://www.google.com/search?q=%22Create%20LRS%20Network%20from%20Existing%20Dataset%22+site%3Adoc.esri.com) · [Modify Route ID Padding](https://www.google.com/search?q=%22Modify%20Route%20ID%20Padding%22+site%3Adoc.esri.com) · [Modify Event Behavior Rules](https://www.google.com/search?q=%22Modify%20Event%20Behavior%20Rules%22+site%3Adoc.esri.com) · [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com) · [Generate Calibration Points](https://www.google.com/search?q=%22Generate%20Calibration%20Points%22+site%3Adoc.esri.com) · [Generate Routes](https://www.google.com/search?q=%22Generate%20Routes%22+site%3Adoc.esri.com) · [Remove Overlapping Centerlines](https://www.google.com/search?q=%22Remove%20Overlapping%20Centerlines%22+site%3Adoc.esri.com) · [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com) +5
<!-- docs:end -->

---

Esri Roads and
Highways Tutorial
Contents
Exercise 1: Prepare and Publish LRS data ........................................................................... 4
   Objective ......................................................................................................................... 4
   Data ................................................................................................................................. 4
   Prepare Branch Versioned Data...................................................................................... 4
   Implement Automated Data Review ............................................................................ 11
   Author Attribute (constraint) Rules .............................................................................. 11
   Author Attribute (validation) Rules .............................................................................. 13
   Sharing LRS features as services ................................................................................... 19
Exercise 2A: Create Route ................................................................................................. 27
   Objective ...................................................................................................................... 27

   Layers Needed ............................................................................................................ 27

   Methodology .............................................................................................................. 27
Exercise 2B: Retire Route .................................................................................................. 39
   Objective ....................................................................................................................... 39
   Layers Needed .............................................................................................................. 39
   Methodology................................................................................................................. 39
Exercise 3. Realign Route .................................................................................................. 41
   Objective ....................................................................................................................... 41
   Layers Needed .............................................................................................................. 41
   Methodology................................................................................................................. 41
Exercise 4: Validate Event Data ........................................................................................ 53
   Summary ....................................................................................................................... 53
   Open the project ........................................................................................................... 53
   Author a Reviewer rule in a map (Invalid Events)......................................................... 53
       Implement requirement ID 1 .................................................................................... 54
   Validate features ........................................................................................................... 56
       Validate features within the map extent .................................................................. 57
   Author a Reviewer rule in a map (Event on Event)....................................................... 62
       Implement requirement ID 2 .................................................................................... 62

                                                                   1
   Validate features ........................................................................................................... 64
      Validate features within the map extent .................................................................. 64
Exercise 5: Create a Simple Data Editing Workflow ......................................................... 70
   Goal ............................................................................................................................... 70
   Objective ....................................................................................................................... 70
   Information Needed ..................................................................................................... 70
   Methodology................................................................................................................. 70
Exercise 6: Add, Edit, and Delete Calibration Points ........................................................ 76
   Objective ....................................................................................................................... 76
   Data ............................................................................................................................... 76
   Methodology................................................................................................................. 76
   Adding Calibration Points ............................................................................................. 76
   Editing Calibration Points .............................................................................................. 81
   Deleting Calibration Points ........................................................................................... 83
   Attribute Constraint Rules ............................................................................................ 84
Exercise 7: Gapped Route Editing ..................................................................................... 87
   Objective ....................................................................................................................... 87
   Data ............................................................................................................................... 87
   Methodology................................................................................................................. 87
   Creating route with physical gap .................................................................................. 87
   Extending route to create physical gap ........................................................................ 89
   Retire a portion of a route to introduce a gap ............................................................. 93
Exercise 8: LRS Configuration tools................................................................................... 96
   Objective ....................................................................................................................... 96
   Data ............................................................................................................................... 96
   Methodology................................................................................................................. 96
   Create a new LRS Network ........................................................................................... 96
   Create an LRS Event .................................................................................................... 101
Exercise 9: Route and Event loading ............................................................................... 106
   Objective ..................................................................................................................... 106
   Data ............................................................................................................................. 106
                                                                   2
   Methodology............................................................................................................... 106
   Append Routes into an LRS Network .......................................................................... 106
       Remove Overlapping Centerline features .............................................................. 112
       Append Events ........................................................................................................ 115
Exercise 10: Conflict Prevention ..................................................................................... 117
   Objective ..................................................................................................................... 117
   Data ............................................................................................................................. 117
   Methodology............................................................................................................... 117
   Configure Conflict Prevention ..................................................................................... 117
   Acquiring and releasing route locks ............................................................................ 119
Exercise 11: Event Editor ................................................................................................ 123
   Objective ..................................................................................................................... 123
   Data ............................................................................................................................. 123
   Methodology............................................................................................................... 123
       Undo/Redo in Event Editor ..................................................................................... 123
       Event Replacement ................................................................................................. 124

                                                                   3
Exercise 1: Prepare and Publish LRS data
Prepare branch versioned data then publish as a service in ArcGIS Pro

Objective
In this exercise you will prepare data to be branch versioned, branch version the data in
a database, then publish a linear referencing enabled service to use for route and event
editing in ArcGIS Pro and Event Editor.

Data
 Database chosen from Holistic OneNote

Prepare Branch Versioned Data

1.    Open ArcGIS Pro.

2.    Create a new project.

3.    Do one of the following:

      •   If ArcGIS Pro isn’t connected to your Enterprise portal, go to step 4.

      •   If ArcGIS Pro is already connected to your Enterprise portal, skip to step 10.

4.    In the top right corner of ArcGIS Pro project find the green person icon with Not signed
      in next to it. Click the drop-down menu and choose Manage Portals.

                                                 4
5.    In the Portals window, click Add Portal.

6.    Type your portal URL and click OK. The portal will appear in the Portals list.

7.    Right-click the Portal and choose Set as Active Portal.

8.    Right-click the Portal again and Sign In with your credentials.

9.    Click the back button in the top right of the screen to return to your Pro project.

10.   Click the Catalog pane on the right-hand side of your project, then right-click Databases
      and choose New Database Connection.

11.   Populate the form with the database information for the database you selected from the
      Holistic OneNote.

                                                 5
Roads and Highways in ArcGIS         12.   Rename and expand the connection file you just created. You should see a feature dataset
Pro requires the Centerline,               called LRS along with a Centerline Sequence and the 4 LRS_ tables.
Calibration Point, and Redline
feature classes be in a feature
dataset. Networks, events, and
intersections can also reside in
the same feature dataset.

You can determine if a feature
class is part of an LRS by right
clicking it in the catalog window
or as a layer in the map and
selecting properties. Select the
Location Referencing tab on the
                                     13.   Expand the feature dataset and you’ll see the Centerline, Calibration Point, Redline,
left side of the UI that opens and         Network (AllRoutes and StateRoutes), and Event (Access Control, Functional Class, etc.)
see the LRS properties.                    feature classes. The minimum schema. LRS Networks, and LRS Events are already registered
                                           with an LRS and have data loaded into them.

                                     14.   Branch versioned data requires that Global IDs be present on feature classes and tables
                                           that will be versioned. To add Global IDs to your feature classes and tables, open the
                                           Geoprocessing tools. On the Analysis ribbon at the top of your Pro project, click Tools.

                                           The Geoprocessing pane opens on the right-hand side of your project.

                                                                                   6
15.   Using the search bar at the top of the geoprocessing pane, search Add Global IDs.

16.   Open the Add Global IDs tool in the results.

      The Add Global IDs geoprocessing tool appears.

17.   Choose the following feature dataset/feature class/table for the Input Datasets drop-
      downs: LRS feature dataset, Centerline Sequence table, and the LRS_Edit_Log table then
      run the tool.

                                              7
18.   The other requirement for branch versioning data is to have Editor Tracking enabled on all
      feature classes and tables that will be versioned. To enable editor tracking, search Enable
      Editor Tracking in the search bar of the geoprocessing pane.

19.   Open the Enable Editor Tracking tool and choose the LRS feature dataset from your
      geodatabase as the Input Dataset.

      Populate the other parameters to match those of the image below, then run the tool.

                                               8
20.   Repeat the process for the Centerline Sequence and LRS_Edit_Log tables.

      You’re now ready to begin branch versioning the feature classes and tables in your
      geodatabase.

21.   Right-click the connection file in the Catalog pane on the right-hand side of your ArcGIS
      Pro project and choose Geodatabase Connection Properties from the context menu.

      The Geodatabase Connection Properties dialog box appears.

                                              9
                                  22.   Click the Branch radio button in the Versioning Type section to change the versioning type
                                        from traditional and click OK.

                                  23.   Now that the connection file has been changed to branch versioning, you can version the
Many parts of ArcGIS Pro are
context based. When clicking on
                                        feature classes and tables. In the Catalog pane, right-click the LRS feature dataset, then
the map or on the table of              choose Manage >Register As Versioned.
contents different ribbons will
appear.

                                  You’ll see a progress bar appear below the feature dataset in catalog window.

                                                                                10
24.   Repeat the above steps for the Centerline Sequence and LRS_Edit_Log tables.

Your Roads and Highways data is now branch versioned and is ready to be published.

Implement Automated Data Review

In this section, you will implement automated quality control using ArcGIS Data Reviewer's
automated checks to ensure the integrity of your data during editing workflows.

Author Attribute (constraint) Rules

Attribute (constraint) rules ensure the integrity of features during editing workflows and
are based on specified data quality conditions. Constraint rules are used to assess a
feature's geometric integrity, spatial relationships with other features, and attribute
consistency.

The following table outlines a subset of data quality requirements that support linear event
editing workflows.

 ID   Requirement                         Check                   Participating features

 1    Calibration points must             Feature on Feature      Calibration Point
      intersect route features.
                                                                  State Routes

Perform the following steps to implement requirement ID 1 from the previous table.

Calibration points must intersect route features. This requirement will be implemented
using the Feature on Feature check to find calibration point features that do not
intersect route features.

1.    In the Catalog pane, expand the HolisticRH as SDE.sde database connection to
      display its contents.

2.    Expand the LRS feature dataset, right-click the CalibrationPoint feature class and click
      Design-Attribute Rules.

      The Attribute Rules pane and tab appear.

3.    On the Attribute Rules tab, in the Add Rules group, click the Ready to Use Rules
         button to display ArcGIS Data Reviewer automated checks.

4.    From the Ready to Use Rules gallery, in the Constraint group, click the Feature
      On Feature        button to add a new constraint rule.
                                             11
                                    5.    The new rule appears in the Attribute Rules view with a red row header, indicating
                                          that required parameters are missing from the rule configuration.

                                    6.    On the New Feature on Feature Rule pane, in the Check Parameters section,
The contents of the Ready to Use
Rules gallery will vary depending         configure the parameters that specify the error condition to be detected.
on the chosen data source.

                                         a.   Click the Features to Compare drop-down arrow and choose the
                                              StateRoutes feature class.

                                         b. Click the Spatial Relationship drop-down arrow and choose the Intersects
                                            relationship.

                                         c.   Click the Invert Relationship check-box to find calibration features that do not
                                              intersect route features.

                                    7.   In the Execution section, configure the parameter that controls how a feature is
                                         evaluated during an editing workflow.

                                         a.   In the Execution section, under Triggers, check the Insert check box to validate
                                              new features when they are created.

                                         b. In the Execution section, Triggers area, check the Update check box to validate
                                            existing features when they are edited.

                                    8.   In the Details section, configure the parameters that facilitate corrective workflows
                                         and rule management.

                                         a.   Type Calibration points must intersect route features in the Name text box.

                                                                                 12
      b. Type Calibration point does not intersect the route in the Description text box.

      c.     Type LRS 2019, spatial accuracy, and geometry in the Tags text box.

Author Attribute (validation) Rules

In this section, you will implement automated quality control using ArcGIS Data Reviewer
automated checks to ensure the integrity of existing data stored in your geodatabase.
Validation rules are used to assess a feature's geometric integrity, spatial relationships with
other features, and attribute consistency.

The following table outlines a subset of data quality requirements that support linear event
management workflows.

 ID        Requirement                           Check                Participating
                                                                      features

 1         Calibration points must intersect     Feature on Feature   Calibration Point
           route features.
                                                                      Routes

 2         From Date attribute must not be       Query Attributes     Calibration Point
           null.

 3         NetworkID attribute must not be       Query Attributes     Calibration Point
           null.

 4         RouteID attribute must not be null.   Query Attributes     Calibration Point

 5         IRI attribute must not be null.       Query Attributes     IRI

                                                 13
                                     ID        Requirement                            Check              Participating
                                                                                                         features

                                     6         IRI Year attribute must not be null.   Query Attributes   IRI

                                     7         Speed Limit attribute must not be      Query Attributes   Speed Limit
                                               null or 0.

                                    Perform the following steps to implement requirement ID 1 from the previous table.

                                    A Road centerline must split at an intersection. This requirement will be implemented using
                                    the Feature on Feature check to find road centerline features that cross other road
                                    centerline features.

                                    1.     On the Attribute Rules tab, in the Add Rules group, click the Ready to Use
                                           Rules   button to display ArcGIS Data Reviewer automated checks.

                                    2.     From the Ready to Use Rules gallery, in the Validation group, click the Feature

                                           On Feature            button to add a new validation rule.

                                    3.     The new rule appears in the Attribute Rules view with a red row header, indicating
                                           that required parameters are missing from the rule configuration.

The contents of the Ready to Use
                                    4.     On the New Feature on Feature Rule pane, in the Check Parameters section,
Rules gallery will vary depending          configure the parameters that specify the error condition to be detected.
on the chosen data source.

                                          a.     Click the Features to Compare drop-down arrow and choose the StateRoutes
                                                 feature class.

                                          b. Click the Spatial Relationship drop-down arrow and choose the Intersects
                                             relationship.

                                                                                      14
     c.   Check the Invert Relationship check-box to find calibration features that do not
          intersect route features.

5.    In the Details section, configure the parameters that facilitate corrective workflows
      and rule management.

     a.   Type Calibration point must intersect route feature in the Name text box.

     b. Type Calibration point does not intersect the route in the Description text box.

     c.   Choose 1 in the Severity drop-down menu to specify that the error is of high
          importance.

     d. Type LRS 2019, spatial accuracy, and geometry in the Tags text box.

      Perform the following steps to implement requirement ID 2 – 4 from the previous
      table.

      Attributes used in event management should not be empty. This requirement will be
      implemented using the Query Attributes check to find calibration point features
      that contain invalid attribute values.

6.    From the Ready to Use Rules gallery, in the Validation group, click the Query

      Attributes         button to add a new validation rule.

      The new rule appears in the Attribute Rules view with a red row header,
      indicating that required parameters are missing from the rule configuration.

                                             15
7.    On the New Query Attributes Rule pane, in the Check Parameters section,
      configure the parameters that specify the error condition to be detected.

      a. Configure the Search Goal by clicking the New Expression button and building
         the following query:

          i.    Field: FromDate

          ii.   Operator: is null

      b. Click Apply to set the parameter.

8.    In the Details section, configure the parameters that facilitate corrective workflows
      and rule management.

     a.   Type From Date must not be null in the Name text box.

     b. Type From Date must be populated in the Description text box.

     c.   Select 1 in the Severity drop-down menu to specify that the error is of high
          importance.

                                             16
      d. Type LRS 2019, thematic accuracy, and attributes in the Tags text box.

9.     Repeat steps 1 through 3 for Requirement ID 3 and ID 4.

10.    On the Attributes Rules tab, in the Attributes Rules group, click the Save button
          to save your new rules.

11.    Close the Attribute Rules pane to exit rule design for the CalibrationPoint feature
       class.

       Perform the following steps to implement requirement ID 5 – 6 from the previous
       table.

       Attributes used in event management should not be empty. These requirements will
       be implemented using the Query Attributes check to find IRI events that contain
       invalid attribute values.

12.    In the Catalog pane, expand the HolisticRH as SDE.sde database connection to
       display its contents.

13.    Expand the LRS feature dataset, right-click IRI feature class and click Design-
       Attribute Rules.

       The Attribute Rules pane and tab appear.

14.    On the Attribute Rules tab, in the Add Rules group, click the Ready to Use Rules
          button to display ArcGIS Data Reviewer automated checks.

15.    From the Ready to Use Rules gallery, in the Validation group, click the Query

       Attributes        button to add a new validation rule.

       The new rule appears in the Attribute Rules view with a red row header, indicating
       that required parameters are missing from the rule configuration.

                                             17
16.   On the New Query Attributes Rule pane, in the Check Parameters section,
      configure the parameters that specify the error condition to be detected.

      a.   Configure the Search Goal by clicking the New Expression button and building
           the following query:

           i.    Field: IRI

           ii.   Operator: is null

      b. Click Apply to set the parameter.

17.   In the Details section, configure the parameters that facilitate corrective workflows
      and rule management.

      a. Type IRI attribute must not be null in the Name text box.

      b. Type IRI must be populated in the Description text box.

      c. Select 1 in the Severity drop-down menu to specify that the error is of high
         importance.

                                             18
      d. Type LRS 2019, thematic accuracy, and attributes in the Tags text box.

18.   Repeat steps 4 through 6 for Requirement ID 6.

19.   On the Attributes Rules tab, in the Attributes Rules group, click the Save button
      to save your new rules.

20.   Close the Attribute Rules pane to exit rule design for the IRI feature class.

      Perform the following steps to implement requirement ID 7 from the previous table.

21.   Using your preferred workflow, implement requirement ID 7 from the previous table
      for the SpeedLimit feature class.

22.   Once completed, click the Save button          to save your new rule.

23.   Close the Attribute Rules pane to exist rule design for the SpeedLimit feature class.

Sharing LRS features as services

1.    In the Catalog pane, add all the layers in the LRS feature dataset to a map by right-clicking
      the selected layer or layers and choosing Add to New Map.

2.    In your new map, right-click and choose Add To Current Map and add
      ValidationLineErrors; then repeat to add each of the following:
      ValidationObjectErrors, ValidationPointErrors, and ValidationPolygonErrors.

3.    Optionally customize the symbology for the LRS feature layers before moving to the
      publishing step below.

      You can change symbology and labeling by clicking a layer in the Contents pane on the
      left-hand side of the Pro project, then choosing the Appearance or Labeling tabs that
      appear on the top of your project.

4.    Make sure to enable time on all your layers. You can do this for all your LRS layers by
      clicking the Enable Time button on the Location Referencing tab.

                                               19
5.   Once you’re comfortable with your symbology and labeling, click the Share tab in ArcGIS
     Pro, then click Web Layer > Publish Web Layer.

     The Share As Web Layer pane appears on the right.

                                            20
                                6.   Populate the Name, Summary, and Tags text boxes.

                                7.   In the Layer Type section, check Feature.

                                8.   In the Share with section, check ArcGIS Enterprise.

The Linear Referencing
                                9.   Click the Share As Web Layer > Configuration tab and check the Linear Referencing,
capability appears when you          Version Management and Validation check boxes.
have Roads and Highways data
in the map.

The Version Management
capability appears when you
have branch versioned data in
the map.

                                                                            21
10.   Click the icon with the three blue squares stacked on top of each other below the
      Configuration tab and in the Instance Type section, check the Dedicated Instance check
      box.

                                            22
11.   Click the Analyze button.

      A warning about fully qualified names being used as well as an error about the layer source
      not being registered with the server.

      You can fix the fully qualified warning by removing the database name and user from the
      names of the layers in the map in the table of contents.

12.   To fix the error message about the layers source not being registered with the server,
      expand the list of layers, right-click the first error listed, then choose Register Data Source
      With Server.

      The Add data store dialog box appears.

                                                23
13.   In the Add data store dialog box, populate the Name and Tags.

14.   In the Share With section, check the ArcGIS Enterprise check box, then click Create.

                                             24
15.   Once the Data Store is registered, click the Analyze button again. Only warnings about m-
      and z-awareness and about no feature template being set should remain.

16.   If no errors are present, click Publish to publish the service.

A progress bar will appear, and your service will publish.

                                                 25
17.   Once the service publishes successfully, choose the Portal tab in the Catalog pane.

      You should see the feature service, map service, and data store you just registered.

18.   Right-click the feature service (icon with the red marker on a yellow basemap) and choose
      Add to New Map.

      Your LRS enabled feature service has now been added to your project as a
      new map. Save your project.

                                               26
Exercise 2A: Create Route
Create a route in ArcGIS Pro

Objective
Create a route using multiple centerlines

Layers Needed

 Network

 Centerline

 Calibration point (optional)

Methodology

1. Open ArcGIS Pro

2. Click New > Map.

    The Create New Project pane appears.

3. Provide the Location and Name for the project

                                            27
4. In the Contents pane, right-click the Map node and choose Properties.

    The Map Properties dialog box appears.

5. In the General section, change the name of the map to Editing.

6. In the Catalog pane, click the Portal tab then double click the feature service you have
    previously published.

                                             28
7. Drag and drop these three layers into the map: StateRoutes, Centerline and
    CalibrationPoint.

8. In the Contents pane, click the List by Data Source button.

9. In the Contents pane, click sde.Default <your service name>.

10. Click the Versioning tab on the ArcGIS Pro ribbon.

11. Click the New Version button.

    The New Version dialog box appears.

                                             29
12. In the New Version dialog box, provide a version name of your choice, set the Access
    Permission to Public and check the Change to this new version check box.

    The Contents pane should look like the following:

13. In the Contents pane, click the List by Drawing Order button and order the layers as
    shown (drag up or down) and change their symbology as per your choice.

                                             30
14. In the Contents pane, right-click the Calibration Point layer and choose Properties.

    The Layer Properties dialog box appears.

                                               31
15. In the Layer Properties dialog box, click the Definition Query tab then click New
    definition query.

16. Create a definition query as shown below:

17. In the Contents pane, right click the Centerline layer and select Properties.

18. In the Display section, change the Display field to OBJECTID.

                                              32
19. In the Contents pane, click the Calibration Point layer, then click the Labeling tab on the
    ArcGIS Pro ribbon.

20. Click the Label button on the left then click the Expression button.

                                              33
21. In the Label Class section, write the expression as shown below and click Apply:

22. Label the StateRoutes layer with RouteID.

23. Click the Map tab at the top and click the Select by Attributes button:

                                             34
    Create a query as shown below on the Select Layer by Attribute pane on the right and
    click Run

24. Once the tool runs successfully, click the Zoom to Selected Features tool.

                                             35
25. Zoom out a bit so that the map extent looks like the following:

26. Click the Location Referencing tab on the ArcGIS Pro ribbon then click Create.

    The Create Route pane appears.

27. Bulk select the centerlines shown in blue below:

                                             36
28. In the Create Route pane, click the Allow choosing one or more centerlines button.

    The centerlines are ordered in the map and in the centerlines table in the Create Route
    pane.

                                            37
29. Provide values for the Create Route pane as shown below then click Run:

    The route gets created.

30. Click Save.

                                           38
Exercise 2B: Retire Route
Retire a route in ArcGIS Pro

Objective
Retiring a route

Layers Needed

   Network

   Calibration point (optional)

Methodology

1. Zoom to the route you created in the last exercise (PVR491).

2. Click the Location Referencing tab at the top of the ribbon and click the Retire button.

     The Retire Route pane appears.

3. In the Retire Route pane, enter the following inputs and click Run.

                                                  39
    The green and red dot represent the start and end locations of the retirement respectively.

4. To verify the retirement, click the time-slider at the top and move the dates beyond the date of
   retirement.

 The route is no longer visible since it’s now retired.

 Return the slider back to a pre-retirement date.

 The route reappears.

5. Save your edits to the map and close ArcGIS Pro.
                                                    40
Exercise 3: Realign Route
Realign a route in ArcGIS Pro

Objective
Realigning a route

Layers Needed

 Network

 Centerline

 Calibration point (optional)

Methodology

1. Open ArcGIS Pro and open the map that you worked on for the Retire Route exercise.

2. In the Catalog pane, Click Portal and double Click the feature service you have previously
   published.

                                                  41
                                    3. Drag and drop the selected Catalog pane layers shown below into the map.

                                    4. In the Contents pane, click the List by Data Source button and make sure that you are working on
Make sure that all the layers are
                                       a version you created earlier. If not, right-click the version name and choose your version instead.
from the same version.

                                                                                      42
                                 5. In the Contents pane, click the List by Drawing Order button and order the layers as shown (drag
Turn-on the AllRoutes layer as
                                    items up or down) and change their symbology as per your choice.
you are going to use that
network for realignment. Turn-
off the StateRoutes layer to
remove map clutter.

                                 6. Label the All Routes layer as RouteID.

                                 7. In the Contents pane, right click the Calibration Point layer and choose Properties.

                                     The Layer Properties dialog box appers.

                                                                                   43
                                       8. In the Layer Properties dialog box, click the Definition Query option, then click Edit definition
                                          query and edit the existing definition query as shown below:

                                       9. Click the Location Referencing tab and click the Locate Route and Measures drop-down menu to
Before realignment, you’ll use
                                          use the Locate Route dialog box.
this tool to locate the route first.

                                       10. Select the AllRoutes Network and type 131518600 in the Route ID box.

                                       11. Click the Zoom button.

                                                                                          44
                                       The route with RouteID = 1315186000 gets located.

                                   12. In the Locate Route dialog box, type 0.2550912 and 0.3906066 for the From and To measures
You’ll realign the route between
                                       respectively and Click the zoom button.
these two measures.

                                       The measures are now located on the route

                                                                                   45
13. Now, you’ll digitize a using the measures as the start and end points. Click the Edit tab at the top of
    the ribbon and make sure that Snapping is ON with at least Point and End options enabled.

14. On the ArcGIS Pro ribbon, Edit tab, click the Create button.

    The Create Features pane appears.

15. In the Create Features pane, click the line tool and digitize a centerline from the From measure to
    the To Measure markers using snapping.

                                                   46
16. Click Save to save your edits.

17. Click the top of the Locate Route and Measures button above the arrow to remove the selection
    and the markers.

18. Click the Realign button on the Location Referencing tab.

    The Realign Route pane appears.

                                                 47
19. Draw a bounding box on the newly-digitized centerline.

20. Click the Allow choosing one or more centerlines button in the Realign Route pane.

                                                48
21. Fill the parameters are shown below but do not click Run yet.

22. Move the time slider to a date beyond the effective date.

                                                 49
23. Click Run in the Realign Route pane. The route gets realigned.

24. Click Save to save your edits.

25. Turn on the event layers in the Contents pane by checking its check box.

    The events are still following the old version of the route. You should apply the event behaviors for
    the event to be located on the newly realigned route.

                                                  50
26. In the Contents pane, right-click an event layer then click Properties.

    The Layer Properties dialog box appears.

27. Click the Location Referencing tab in the dialog box then scroll to view Event Behavior Rules.

Find the event behavior rules for the following three events for Realign Route edits:

   Event Name                 Event Behavior Rule

   Structural Condition

   Route Type

   Functional Class

                                                   51
28. Click the Analysis tab on the ArcGIS Pro ribbon then click Tools.

    The Geoprocessing pane appears.

29. In the Geoprocessing pane, search for the Apply Event Behavior tool.

  Run the tool with the input shown below to apply the event behaviors.

  The event behaviors rules are now applied.

                                                  52
Exercise 4: Validate Event Data

Summary
In this exercise, you will implement automated quality control using ArcGIS Data
Reviewer automated checks to ensure the integrity of your data during editing
workflows.

Open the project
In this section, you will assume the role of a technical lead who needs to identify data
quality requirements and the workflows that implement them. You will do this by
implementing automated quality control using ArcGIS Data Reviewer validation checks
to assess the quality of features referenced in a map.

25. Start ArcGIS Pro and sign in if necessary.
26. On the start page, under your recent projects, click Open another project.
     Note:
     If you already have a project open, click Open    on the Quick Access Toolbar and
     go to step 4.

27. On the Open page, under Open, click Computer and click Browse          .
28. Browse to the Data_Reviewer\Exercise_LRS folder on the Open Project dialog
    box.
29. Click LRSMapRules.ppkx to open the project.

Author a Reviewer rule in a map (Invalid Events)
Reviewer rules are configured checks that validate features based on specific conditions.
They can include checks that validate spatial relationships, attribute consistency and
feature integrity. Reviewer rules can be authored and stored in a map that contains the
feature layers to be validated. Features in your map are validated using the Run
Reviewer Rules command.

                                           53
In this exercise, you will author a Reviewer rule for Invalid Events and apply it to
relevant layers in your map. The following table outlines a subset of data quality
requirements that support linear event management workflows.

 ID Requirement                                             Check       Participating
                                                                        layers

 1    Speed events must have invalid measures,              Invalid     Speed
      overlaps or gaps                                      Events

1.   Activate the LRS- Invalid Events map.

2.   Click the View tab.

3.   In the Windows group, click Reviewer Rules         .
The Reviewer Rules view appears.
Implement requirement ID 1

Perform the following steps to implement requirement ID 1 from the table above—
Speed events must have invalid measures, overlaps or gaps.

1.   On the Reviewer Rules tab, in the New Rule group, click Invalid Events            to add
     a new rule.

2.   The new rule appears in the Reviewer Rules view with a red row header, indicating
     that required parameters are missing from the rule configuration.

3.   On the Invalid Events check panel, in the Data Sources/Input Event Layers group,
     click the Speed check box.

     Note:
     The event layer property settings in the Check Parameters group should auto-
     populate after clicking the speed limit checkbox.
                                             54
4.   On the Input Route Layer dropdown, select CountyLog as the route network.

     Note:

     The Route Identifier setting in the Route Layer Properties group should auto-
     populate after clicking the speed limit checkbox.

5.   On the Search Goal group, click the Find invalid measures and Find overlaps check
     boxes

6.   Add a Measure Tolerance of 0.001

                                          55
7.    On the Invalid Events check panel, in the Result Details group, configure the
      properties that will be stored for each result that has features that fail validation.

     a. Type Speed Limit- Invalid Events in the Title text box.

     b. Type Identify Invalid measures and overlaps in the Notes text box.

     c. Click the Severity drop-down arrow and choose 2 to set the relative importance
        for results of this type compared to others.

     d. Type LRS, spatial accuracy, and Speed Limit in the Tags text box.

        Tip:
        Tags can be used to enable requirements traceability. Consider including the
        data model and version for which the rule is related or possibly including an
        HPMS data quality element.

8.    On the Quick Access Toolbar, click Save        to save the project.
      Tip:
      Rule configurations are not stored until the project is saved.

Validate features
In this section, you will assume the role of an editor who will be leveraging data quality
rules to identify features that do not meet quality requirements.

The Run Reviewer Rules command is used to identify features that do not meet data
quality requirements implemented using Reviewer rules. The features to be validated
can either be within a defined area or based on a selection set.

                                             56
Validate features within the map extent

Validating features using a map extent enables you to quickly assess many features
without the need to create a selection set.

To validate features in the current extent, follow these steps:

1.   Ensure to use the Event AOI bookmark in the Map tab to use the map extent that
     contains features that require validation.

2.   In the Catalog pane, ensure the Current Extent-Invalid Events reviewer session is
     set as default.

                                            57
3.   On the Edit tab, in the Data Reviewer group, click the Manage Quality command
     to activate the Manage Quality tab.

     Note:
     By default, only features that are visible in the map will be validated.

4.   On the Manage Quality tab, in the Automated Review group, click the Run
     Reviewer Rules button   to validate the features in the current extent.

     Note:
     Run Reviewer Rules       is unavailable when either of the following is true:

     •   The active map does not contain Reviewer rules. For more information, see
         Create Reviewer rules in a map.

     •   A default Reviewer results session has not been configured in the project, or
         the Reviewer Results pane is closed. For more information, see Access
         Reviewer error results.

5.   Two errors are found, click the message that appears on the top right of the
     project to open the Reviewer Results pane.

     Note:
     Error results are written to either the Reviewer session displayed in the active
     Reviewer Results pane or to the project's default session.

6.   With the Reviewer Results pane open, click the Symbolize button in the Manage
     Quality tab to show the errors in the map extent. The two captured errors should
     be shown in the center of the map.

                                            58
7.   Expand the errors in the Reviewer Results pane to looks at the error details.

8.   Select the first row for event ObjectID 73533 to automatically select the speed
     limit event in the map extent.

     ERROR: The error is captured because the event To Measure appears to be greater
     than the maximum measure (0.21) of the corresponding route (ObjectID -65435)

9.   With the speed limit event selected, in the ArcGIS Pro ribbon, Map tab, click the
     Attributes button to validate the To Measure field attribute. Notice that the field
     has a value (0.25) that is greater than the route’s maximum measure (0.21).

                                           59
10. Right-click the second row for event ObjectID 73537 to enable the context
    menu.

     ERROR: The error is captured because it appears to be an overlap between
     measures 0 and 0.7 for two speed limit events (ObjectID -73537 & 144000) that
     correspond to the same route (ObjectID -65431)

11. Click Zoom to Results.

     ArcGIS Pro zooms to the full extent of the event.

                                          60
12. Click the Select button in the map tab and ensure to use the select by rectangle to
    select the entire length of the event.

13. On the Map tab, click the Attributes button to see how many events are selected.

     Notice that there are two events listed as selected in the attributes pane: EventIDs
     5567 & 69647. Also notice that their measures overlap between 0 and 0.07.

                                           61
14. Close the LRS-Invalid Events map and make sure to click the LRS-Event on Event

     map to make it active.

In the previous exercise, you used the Run Reviewer Rules command to identify invalid
measures in speed limit event data.

Author a Reviewer rule in a map (Event on Event)
In the second part of this exercise, you will assume the role of a technical lead and
create a Reviewer rule for evaluating events against other events stored in your
database. You will do this by using the Event on Event check to validate event layers in
your map.

The following table outlines a subset of data quality requirements that support linear
event management workflows.

 ID Requirement                                       Check           Participating
                                                                      layers

 2   Local Roads must have a speed limit of 35        Event on        Speed Limit
     mph or less                                      Event
                                                                      Functional Class

1.   Activate the LRS-Event on Event map and click the View tab.

2.   In the Windows group, click Reviewer Rules        command.
     The Reviewer Rules view appears.

Implement requirement ID 2

Perform the following steps to implement requirement ID 2 from the table above—
Local Roads must have a speed limit of 35 mph or less.

1.   On the Reviewer Rules tab, in the New Rule group, click Event on Event           to
     add a new rule.
2.   The new rule appears in the Reviewer Rules view with a red row header, indicating
     that required parameters are missing from the rule configuration.

                                           62
3.   On the Event on Event check panel, in the Data Sources/Input Route Layers group,
     click the CountyLog check box.

     Note:

     The CountyLog additional settings in the Input Route Layers group will auto-
     populate      after clicking the CountyLog check box.

8.   On the Overlaying Event Layers group, select Speed and Functional_Class as the
     events to evaluate by the rule.

     Note:
     Additional settings for the two selected events should auto-populate      after
     clicking both check boxes.

9.   Under Search Goal, click the New Expression button and add the following query:
     Functional_Class.FUNCTIONAL_CLASS is greater than 5 (IMPORTANT: Value of "5"
     must be inserted, not searched)

                                          63
10. Click the Add Clause button to add another query: And Speed.SPEED_LIMIT is
    greater than 50 (IMPORTANT: Value of "50" must be inserted not searched).

11. Click the Apply button to add the query where clause to the rule.

12. Verify the inserted expression is valid by clicking the validate button. A
    notification below the expression should show the expression is valid

13. Add a title to the new rule Speed Limit Event on Event

14. Add Note as Find invalid combinations of speed limit and functional class events

15. Set Severity as 2

16. Add Tag as Event on Event Check

     Tip:
     Tags can be used to enable requirements traceability. Consider including the data
     model and version for which the rule is related or possibly including an HPMS data
     quality element.

17. On the Quick Access Toolbar, click Save        to save the project.

     Tip:
     Rule configurations are not stored until the project is saved.

Validate features
In this section, you will assume the role of an editor who will be leveraging data quality
rules to identify features that do not meet quality requirements.

The Run Reviewer Rules command is used to identify features that do not meet data
quality requirements implemented using Reviewer rules. The features to be validated
can either be within a defined area or based on a selection set.

Validate features within the map extent

Validating features using a map extent enables you to quickly assess many features
without the need to create a selection set.

To validate features in the current extent, follow these steps:
                                            64
1.   Ensure to use the Event AOI bookmark in the Map tab to use the map extent that
     contains features that require validation.

2.   In the Catalog pane, ensure the Current Extent-Event on Event reviewer session is
     set as default

3.   On the Edit tab, in the Data Reviewer group, click the Manage Quality command
     to activate the Manage Quality tab.

     Note:
     By default, only features that are visible in the map will be validated.

4.   On the Manage Quality tab, in the Automated Review group, click the Run
     Reviewer Rules button        to validate the features in the current extent.

     Note:
     Run Reviewer Rules        is unavailable when either of the following is true:

                                            65
     •   The active map does not contain Reviewer rules. For more information, see
         Create Reviewer rules in a map.
     •   A default Reviewer results session has not been configured in the project, or
         the Reviewer Results pane is closed. For more information, see Access
         Reviewer error results.

5.   Two errors are found, click the message that appears on the top right of the
     project to open the Reviewer Results pane.

     Note:
     Error results are written to either the Reviewer session displayed in the active
     Reviewer Results pane or to the project's default session.

6.   With the Reviewer Results pane open, click the Symbolize button in the Manage
     Quality tab to show the errors in the map extent. The two captured errors should
     be shown in the center of the map.

                                           66
7.   Expand the errors in the Reviewer Results pane to looks at the error details

8.   Right-click the first row for event ObjectID 65437 to enable the context menu

     ERROR: The error is captured because it appears that the speed limit event with a
     value of 50 or greater is overlaying a functional class event with a value of greater
     than 5 for local road. Local roads cannot have speed limit events of 55 mph.

9.   Click Zoom to Results.

                    ArcGIS Pro zooms to the full extent of the event.

                                           67
10.   On the Map tab, click the Select drop-down arrow then use Select By Rectangle to
      select the entire length of the event.

                                          68
11.   In the Map tab, click the Attributes button to see how many events are selected.
      Notice that there are two events listed as selected in the attributes pane. Speed
      EventID 69641 & Functional_Class EventID 69641. Also notice that the speed event
      has a speed limit value of 55 mph and the Functional_Class event has a functional
      road class set to Local. This is a wrong combination of event values.

12.   Optionally repeat steps 8-11 for the second result of event ObjectID 65505, this
      result has been captured due to the same wrong combination of event values
      (speed event with a speed limit value of 55 mph and a Functional_Class event with
      functional road class set to Local.)

13.   In the previous exercise, you used the Run Reviewer Rules command to identify
      invalid combinations of event data types.

                                           69
Exercise 5: Create a Simple Data Editing Workflow
Create a data editing workflow in the web app and in ArcGIS Pro

Goal
     In this exercise you will build a workflow diagram through the Workflow Manager NextGen web app
     to create a version, set a job location and run a mapping step that opens a map, repoints the version
     and takes the user to the job location automatically so that they may complete some data edits.

Objective
 Create a Workflow Diagram
 Create a Job Template
 Create a Job in ArcGIS Pro
 Run the job

Information Needed
      Feature Service URL and Map Name from previous R&H exercises
      Save the branch versioned Feature Service as a MapX within your project

Methodology
1. Open the Workflow Manager Web app and login https://
   pebl04.esri.com/portal/apps/workflowmanager

Note:
You will start with the Workflow Manager Coordinate page where Production Managers
in an organization can see the work in the system, create work, track progress and
status

2.     Click the Design tab at the top of the app

Click the Create New button to Create a New workflow diagram.

                                                    70
Note:
This will open the diagram editing page where you can build your business process as
automated and manual steps. On the left is the Step Library with types of steps
currently available for use, on the right are the Diagram Settings when the app opens.
3.    In the Diagram Setting section enter a name for your diagram.

     Note:
     Add your name or initials to the diagram name to avoid any confusion with other
     participants
4.    Below the Diagram Settings section under Spatial Data add the URL to your feature
      service data source that you created in the Roads and Highways exercises.

     Note:
     The data source is now available for use by the workflow steps
5.    Click Save at the bottom of the screen.

     Note:
     This will save a draft version of the diagram that is not active in the system yet.
3.    At this point you can build the diagram, the steps that will be required are Create
      Version, Define Location and Open Pro Project Items.

     Note:
     Steps can be connected by dragging and dropping them from the library to the
     desired place in the canvas. Paths can be connected by hovering on a step to see
     possible path ports and then dragging a path from one step to the next.
     A further shortcut is to drag a step onto the step you want to connect it to and then
     drop it on one of the blue arrows that appears to indicate the direction of where it
     will go
4.    Click the Create Version step, in the Step Details set the execution to Automatically
      execute. You can set the access permission to Public.
                                             71
5.   Click the Define the Location step and the Edit button in the Step Details. Type in
     the map name in your Pro project that you would like Workflow Manager to open
     to Define the job’s location

6.   Click the Open Pro Project Items step and the Edit button in the Step Details.

        a.   In the Start tab click Open New Item

        b.   Type the map name in your Pro Project you would like the Data Editor to
             use for editing.

        c.   Explore the other tabs and options available

     Note:
     In the future this step will be extended to manage importing items into Pro, setting
     the Pro Project to use on load, and be able to run a script on launch of the step and
     many other capabilities
7.   Explore the diagram, see if you can change the name and styling, look at the other
     step templates. When you’re ready to move on Click Activate to save the current
     diagram and activate it for use.

8.   Click Yes when prompted to create a job template

     Note:
     You are taken to the Job Template tab where a new job template has been created
     and the diagram you just authored is already set. The job template is where you
     set a lot of the default properties that represent project management or work
     order information that is wrapped around the diagram when used as a job.
9.   The job template name is set to the diagram name by default. Explore the
     properties shown and save any changes when done.

     Note:
     There will be a bonus exercise to create Extended Properties if you have time, so
     don’t spend too much time on that tab now.
     We will now transition to ArcGIS Pro and will try creating a job.

                                           72
10.   If your ArcGIS Pro Project isn’t already open, please open it now and ensure you
      are connected and logged in to the correct portal and have it active.

11.   Click the View tab -> Workflow Manager -> Workflow Server

      Note:
      ArcGIS Pro will access the Workflow Server automatically, and the Workflow Pane
      will open. It will show no jobs because none have been created for you yet. It is
      ordered using a simple philosophy of Searching, Filtering and Running work. For
      some users they can create their own work, for others work is only provided to
      them
12.   Click the Create Job button on the bottom of the right of the pane.

13.   Click Create Default in the tile of the Job template you created earlier in the
      exercise.

      Note:
      The job will be created, and the pane will filter to show the new job.
14.   Click the Play button to run the start step

                                             73
       Note:
       In the screenshot the shown step isn’t a Start step. 😊😊 The job will move to the
       Define Location step and you may not see Create Version having run, that is
       because it was set to run automatically, and the version is now created.
15.    Click the Play button to run the Define Location Step

       Note:
       The map you specified when configuring the step should open. A new tab for
       defining the location will appear
16.    Using the tools on the Define Location tab, draw or select a new job location.
       When complete, finish the step in the Workflow Pane or on the tab, the map will
       close.

17.    Click the Play button to run the mapping step.

       Note:
       The map you specified when configuring the step should open. It may be the same
       map you specified in step 19 for define location or a different map. The map
       should be zoomed into the job’s location, the data source should be repointed to
       the job’s version, if a Task was specified on the step config it will also open. This
       step would be run by a Data Editor in an organization to immediately asset with
       data and map prep and necessary job information they need to succeed.
Bonus Exercises

Advanced Tip: Start to set steps in your diagram as skippable as you play more with the
system. This will allow you to finish steps and move to the next one without having to
run each one each time you change your diagram.

•     Return to the Workflow Diagram in the web app and add a QC step (Open pro item),
      Question step and Clean Up step to the end of the workflow. Configure the paths coming

                                             74
    out of the question step to use their response to guide the workflow. Activate the
    changes and create another job in Pro to try them out.

•   In the web app open the Job Template you made and add an extended property
    table representing Work Order information. Add some properties to the new table
    like Workorder ID, description etc. Save the job template. Open the Diagram again
    and replace the Start Step with an Update Properties step (Hint: You can drag a new
    step over an existing one to replace its type). Configure it to update some of those
    Extended Properties. Activate the changes and try them out in Pro again.

•   In the web app explore the Coordinate page, select a job in the job grid to see the
    job panel.

•   Try the Open App step template and use it to open Event Editor or another app in
    your workflow. Create a job on the Coordinate page and run it on the Work page.

                                             75
                                   Exercise 6: Add, Edit, and Delete Calibration Points
                                   Add Calibration points at locations on a route to match measures from a survey in ArcGIS Pro

                                   Objective

                                   In this exercise you will add calibration points at various locations along a route to
                                   calibrate the route at those locations to match the measures coming in from a field
                                   survey, engineering drawings, or other sources.

                                   Data

                                    Pro project with service publishing in Exercise 1

                                   Methodology

                                   There may be cases where engineering records or field surveys arrive with precise measures at
                                   specific locations along a route. To refine the accuracy of measures on the routes, calibration
                                   points can be added to specify a measure at a given location. The route is then recalibrated,
                                   considering this specific measure at the location where a calibration point was added.

                                   Adding Calibration Points

                                   1.   Open your ArcGIS Pro project. Verify your service published in Exercise 1 is present in the
                                        map. If not, add the feature service to a new map in your project.

Roads and Highways in ArcGIS
                                   2.   Verify that the AllRoutes and CalibrationPoint layers are turned on in your map.
Pro requires the Centerline,
Calibration Point, and Redline
                                   3.   Change the version to a version other than Default.
feature classes be in a feature
dataset. Networks, events, and     4. In ArcGIS Pro, make sure snapping is enabled on the Edit tab or in the lower left
intersections can also reside in      corner of your map.
the same feature dataset.

                                                                                   76
5.   On the Map tab, click Select By Attributes

     The Select Layer By Attribute pane appears.

6.   Use the Select Layer by Attribute pane to select routeID 26333909000 in the AllRoutes
     network.

7.   Once selected, zoom to the route using the Zoom to Selected Feature tool on the Map
     tab.

                                             77
     Notice there are calibration points at the endpoints of each segment that makes up the map.
     A recent survey of the roads in the area has provided an exact measure at the location where
     route IDs 26333909000 and BSR8A-L NB intersect. To ensure the most accurate calibration
     on the route, a calibration point will be added to this location with this new measure.

8.   On the Location Referencing tab, click the Identify Routes button, then click the
     intersection of route IDs 26333909000 and BSR8A-L NB. Notice the current measure at the
     location is 0.2338322 miles.

9.   The survey received measured this location along the route as 0.241584 miles. To apply this
     measure at this location on the route, a calibration point can be added. Click Add Point on
     the Location Referencing tab.

                                               78
10. Click the location on the map where route IDs 26333909000 and BSR8A-L NB intersect.

    The Select a Route dialog box appears with the option to select the route from that location.

11. Select route ID 26333909000 and click OK.

    The Add Calibration Point dialog box appears.

12. The current measure at that location is populated. Change the measure to 0.241584 and
    click Run. The calibration point is added.

    13. On the Location Referencing tab, click the Identify Routes button and click the
        location on the map where the new calibration point was added. Notice the calibration

                                              79
for the route has already been updated without needing to run Apply Updates as was
done in Roads and Highways in ArcMap.

                                   80
Editing Calibration Points

1.   Zoom to the end of route ID 26333909000. Using the Identify Routes tool, click the location
     on the map with the calibration point at the end of the route.

     The survey also mentions the end measure of the route has changed to 1.737215. To make
     this change, the measure needs to be updated on the calibration point at the end of the
     route using the Edit Calibration Point tool.

2.    Click the Edit Point button on the Location Referencing tab.

2.   On the map, click the calibration point at the end of the route that needs to be edited.

     The Edit Calibration Point pane appears.

                                               81
3.   The current attributes for the calibration point are populated. Change the measure to
     1.737215 and click Run.

4.   Using the Identify Routes tool, click the location on the map where the update calibration
     point is located. Notice the measure at the location and end measure has been updated.

                                              82
Deleting Calibration Points

1.   Zoom to the location of the intersection of route ID 26333909000 and BSR8A-L NB where
     you recently added a new calibration point. To simplify the data within Roads and Highways,
     calibration points along routes are no longer needed and can be removed. To complete
     this, the Delete Calibration Point tool can be used.

2.   On the Location Referencing tab, click the Delete Point button.

3.   On the map, click the calibration point at the intersection of route ID 26333909000 and
     BSR8A-L NB that needs to be deleted.

     The Delete Calibration Point pane appears.

4.   Click Run. The calibration point is deleted.

                                               83
5.   Using the Identify Routes tool, click the location on the map where the calibration point was
     deleted. Notice the measure at the location and end measure has been updated.

Attribute Constraint Rules

     In exercise 1, you authored an attribute constraint rule requiring calibration points being
     located on routes in the StateRoutes network. In the steps below, you’ll place a calibration
     point using the Pro editing tools that isn’t on any StateRoutes network route that will violate
     this constraint rule.

1.   Turn off the AllRoutes layer and turn on the StateRoutes layer.

                                                84
2.   Using the select by attributes tool on the Map tab, select route ID BKR013    in the
     StateRoutes network.

3.   Zoom to the route.

4.   On the Edit tab, select the Create Features tool.

     The Create Features pane appears on the right-hand side of the Pro project.
                                                85
5.   Click Calibration Point.

6.   Add a calibration point near, but not on, the select route (or any other StateRoutes network
     route).

7.   An error should appear, and the calibration point won’t be added as it violates the Attribute
     Constraint Rule authored for this service in exercise 1.

8.   Discard your edits and close your Pro project.

                                               86
Exercise 7: Gapped Route Editing
Edit routes with physical gaps to see the various gap calibration methods supported in ArcGIS Pro

Objective

In this exercise you will introduce physicals gaps on routes using various editing activities. The
routes will be in different LRS Networks with different gap calibration methods being applied for
each edit.

Data

 Pro project with service publishing in Exercise 1

Methodology

Physically gapped routes are present in routes networks from DOTs around the country. Roads
and Highways calibrates these physically gapped routes using either a Step, Add, or Euclidean
distance method that can be configured for each LRS Network.

Creating route with physical gap

1.   Open your ArcGIS Pro project. Verify your service published in Exercise 1 is present in the
     map. If not, add the feature service to a new map in your project.

2.   Verify the StateRoutes, CalibrationPoint, and Centerline layers are turned on in your map.

3.   Change the version to a version other than Default.

4. Make sure snapping is enabled on the Edit tab or in the lower left corner of your
   map.

                                                 87
5. On the map tab, use the Select by Attributes tool to select centerline feature with
   centerlineID = {EAE41FA7-CE10-4A66-ADCF-AE6B6CFF4321}. This centerline will
   be used to create an alternate route for State Route 8.

6. Zoom to the centerline feature. Notice there is a gap in the middle of the
   centerline.

7. Keep the centerline selected and open the Create Route tool on the Location
   Referencing tab.

8. Use the selected centerline.

                                          88
9.   Choose the StateRoutes network, 1/1/2019 as the effective date, and populate SR for Route
     System, 8-Alt for Route Number, and Non-Numbered for Route Type. Take the default
     From and To Measures suggested.

10. Click Run. The route is created.

11. Zoom to the area where the physical gap exists. Use the Identify Routes tool from
    the Location Referencing tab to verify the correct gap calibration method was
    applied (Euclidean distance).

Extending route to create physical gap

1.   Turn off the StateRoutes layer and turn on the AllRoutes layer.

                                               89
2.   On the map tab, use the Select by Attribute tool to select routeID 599625700 in the
     AllRoutes network.

3.   Once selected, zoom to the route using the Zoom to Selected Feature tool on the Map
     tab.

4.   Pan the map to the left until you see the centerline that begins at the county boundary.

                                               90
                                      5.     Using the Split tool on the Edit tab, split the centerline where it meets route ID GN003
You could also use the Split
Centerline tool found on the
                                             (snapping at the calibration point).
Location Referencing ribbon as
well.

                                 6.        Select the centerline to the left of the split location.

                                 7.        On the Location Referencing tab, click Extend.

                                                                                           91
     The Extend Route pane appears.

8.   Use the selected centerline.

9.   Choose the AllRoutes network, 1/1/2019 as the effective date, and choose route ID 599625700
     on the map.

10. Select to extend at the beginning, take the suggested From and To Measures, and click Run.

11. The route is extended successfully.

                                               92
12. To verify the correct gap calibration method (step of 0.001) was applied correctly, use the
    Identify Routes tool to see the measures at both ends of the gap.

 Retire a portion of a route to introduce a gap

 1.   Now that the SR8-Alt route has been created, portions of SR8 NB and SR8 SB need to be
      retired. Stay zoomed in the area where you recently created route ID SR8-Alt.

 2.   On the Location Referencing tab, open the Retire Route tool.

                                              93
3.   Choose the StateRoutes network, 1/1/2019 as the effective date, and choose route ID SR_8
     NB on the map. Populate a From Measure of 30.0085423 and To Measure 31.9595036.

4.   Click Run. The section of the route is retired.

5.   Use the Identify Routes tool from the Location Referencing tab to verify the correct gap
     calibration method was applied (Euclidean distance).

                                                94
6.   Retire route ID SR_8 SB in the same area. Choose the same effective date of 1/1/2019 and
     route ID of SR_8 SB. Populate a From Measure of 34.6934439 and To Measure 36.6444051.

7.   Click Run. The portion of the route is retired.

8.   Use the Identify Routes tool on the Location Referencing tab to verify the correct gap
     calibration method was applied (Euclidean distance).

9.   Discard your edits and close your project.
                                                  95
Exercise 8: LRS Configuration tools
Configure a new LRS Network and LRS Event in ArcGIS Pro

Objective

In this exercise you will utilize the Configuration geoprocessing tools in the Location Referencing
toolbox to create and configure a new LRS Network and Event.

Data

 Pro project with service publishing in Exercise 1

Methodology

The configuration of an LRS, LRS Network, and LRS Events is completed using geoprocessing
tools in ArcGIS Pro. This allows the configuration process to be scripted or put into a model in
Model Builder in addition to being executed in ArcGIS Pro.

Create a new LRS Network

1.   Open your ArcGIS Pro project. Navigate to the Catalog pane and ensure the geodatabase
     used in Exercise 1 is present. If not, add the database.

2.   Add the geodatabase called Exercise_8_9.gdb.

                                               96
3.   Right-click the Milepost feature class and choose Copy.

4.   Right-click the feature dataset called LRS and paste the Milepost feature class.

5.   Open the geoprocessing tools by clicking Tools on the Analysis tab.

                                               97
                                  6.   Expand the Location Referencing toolbox, the Configuration toolset, and the LRS
Other geoprocessing tools you
might run after configuring the
                                       Network toolset.
LRS Network include Modifying
the Network settings and          7.   Open the Create LRS Network from Existing Dataset geoprocessing tool.
Configuring a Lookup Table.

                                  8.   Populate the following parameters.

                                       a.   LRS Network Feature Class – Navigate to the Milepost feature class that you copied
                                            into your enterprise geodatabase in step 3

                                       b.   LRS Name – Choose LRS from the drop down

                                       c.   Route ID Field – Choose RouteID from the drop down

                                       d.   From Date Field – Choose FromDate from the drop down

                                       e.   To Date Field – Chose ToDate from the drop down

                                       f.   Route ID Field Configuration – Choose Multi-Field Route ID

                                                                               98
       g.   Fields – Choose RouteNumber then PostDirection

9.   Click Run.

     The LRS Network is created and added to the map.

                                            99
10. Right-click the Milepost layer in the map and choose Properties.

    The Layer Properties dialog box appears.

11. Click the Location Referencing tab. This confirms the network was correctly associated
    with the LRS and shows the properties.

12. Open the Modify Route ID Padding geoprocessing tool.

13. Choose Milepost for the LRS Network Feature Class parameter. The current route ID fields
    appear.

                                            100
14. For the PostDirection field, check the Allow Null Values checkbox.

15. Click Run. The configuration is updated successfully.

Create an LRS Event

1.   Now that the Milepost network has been configured, events can be configured with the
     network as well.

                                             101
2.   In the Geoprocessing pane, expand the Location Referencing toolbox, Configuration
     toolset, and LRS Event toolset, then open the Create LRS Event geoprocessing tool.

3.   Populate the following parameters.

     a.   Parent LRS Network – Navigate to the Milepost network that was recently configured
          with the LRS.

     b.   Event Name – Type MilepostLocations

     c.   Geometry Type – Choose Point from the drop down

     d.   Event ID Field – Type Event ID

     e.   Route ID Field – Type Route ID

     f.   From Date Field – Type From Date

     g.   To Date Field – Type To Date

     h.   Location Error Field – Type Location Error

                                              102
     i.   Measure Field – Type Measure

4.   Click Run.

     The Event is created.

                                         103
5.   You can verify the Event is correctly associated with the LRS by right-clicking the
     MilepostLocations layer in the map, choosing Properties. When the Layer Properties
     dialog box appears, click the Location Referencing tab.

6.   In the LRS Event toolset, open the Modify Event Behavior Rules geoprocessing tool.

7.   Populate the following parameters.

     a.   Event Feature Class – Choose the MilepostLocations event that was just registered.

     b.   Calibrate Rule – Choose Retire in the drop down

     c.   Retire Rule – Choose Retire in the drop down

                                             104
     d.   Extend Rule – Choose Retire in the drop down

     e.   Reassign Rule – Choose Retire in the drop down

     f.   Realign Rule – Choose Retire in the drop down

8.   Click Run. The Event Behaviors are now updated for the MilepostLocations event.

Close your project. Don’t save changes.

                                            105
Exercise 9: Route and Event loading
Load Routes and Events in bulk in ArcGIS Pro

Objective

In this exercise you will utilize the Append Route, Append Events, and other loading tools to load new
routes and events into the LRS.

Data

Pro project with service publishing in Exercise 1

Methodology

The bulk loading of routes and events is completed using geoprocessing tools within ArcGIS
Pro. This allows the configuration process to be scripted or put into a model in Model Builder
in addition to being executed within ArcGIS Pro.

Append Routes into an LRS Network

12. Open your ArcGIS Pro project. Navigate to the Catalog window and ensure the
    geodatabase used in Exercise 1 in present. If not, add the database.

13. In the last exercise, the Milepost Network was associated with the LRS. The first batch of
    route features now need to be loaded into this network.

14. Add the SourceMilepostRoutes feature class in the Exercise_8_9.gdb to the map. Notice
    there are a handful of features that need to be loaded into the Milepost Network.

                                                106
                                 15. In the Geoprocessing pane, expand the Location Referencing toolbox and open the
                                     Append Routes geoprocessing tool.

                                 16. Populate the tool parameters with the values below.
You could also use the Append
Routes tool to do supplemental
loading using the Retire by
                                     a. Source Routes – Choose the SourceMilepostRoutes layer/feature class
RouteID and Replace by RouteID
options.                             b. LRS Network – Choose the Milepost Network configured last exercise

                                     c. Route ID Field – Choose RouteID from the drop down

                                     d. From Date Field – Choose FromDate from the drop down

                                     e. To Date Field – Choose ToDate from the drop down

                                                                           107
    f.   Field Map – All fields should automatically map

    g. Load Type – Choose Add from the drop down

17. Click Run.

    The routes are loaded into the network and centerlines are loaded into the centerline
    feature class.

18. Open the attribute table for the Milepost feature class. The records have been appended.

19. To calibrate these newly added routes, you can either load your own calibration points or
    use the Generate Calibration Points geoprocessing tool to create them.

                                            108
20. In the Location Referencing toolbox, open the Generate Calibration Points geoprocessing
    tool.

21. Populate the following parameters.

    a. Input Polyline Features – SourceMilepostRoutes feature class/layer

    b. Route ID Field – Select RouteID from the drop down

    c. From Date Field – Select From Date from the drop down

    d. To Date Field – Select To Date from the drop down

    e. Calibration Point Feature Class – Select the Calibration Point feature class from your
       connection file you used in Exercise 1

    f.   LRS Network – Select Milepost in the drop down

                                            109
    g. Calibration Direction – Select Digitized Direction in the drop down

    h. Calibration Method – Choose Geometry Length in the drop down

22. Click Run. The calibration points are created.

23. Verify the new calibration points were added, by opening the Select by Attributes tool and
    selecting NetworkID = Milepost.

                                             110
24. The routes have been loaded and calibration points have been created for those newly
    loaded routes. Choose the Identify Routes tool from the Location Referencing tab and
    click the newly loaded Milepost Network routes.

25. No calibration has been applied to the routes yet. To get the calibration from the new
    calibration points applied to the route, use the Generate Routes tool.

26. Open the Generate Routes tool in the Location Referencing toolbox.

                                          111
27. For the Input Route Features parameter, choose the Milepost Network.

28. Click Run. The routes are regenerated, and calibration is applied.

29. Click the Identify Routes tool on the Location Referencing tab to select a few routes in the
    Milepost Network.

    Calibration is now applied to the newly loaded routes.

Remove Overlapping Centerline features

9. The Append Routes tool that was executed in the previous section will load routes into
   the network. It will also load corresponding records into the Centerline feature class and
   the Centerline Sequence table.

10. In the Catalog pane, right click the Centerline feature class from the geodatabase used in
    Exercise 1 then choose it and add to a new map.

11. Zoom to the area where the routes were appended into the Milepost network in the
    previous section.

                                             112
12. Using the select tool, select one of the centerlines where a Milepost route was added.
    Notice there are two centerlines present that overlap. One was loaded with the AllRoutes
    network and the other was loaded with the Milepost network.

13. Roads and Highways expects only one centerline at any given location. To remove the
    overlaps in the centerline feature class, the Remove Overlapping Centerlines
    geoprocessing tool can be run.

14. Select all the centerlines in the area where the Milepost network routes were loaded.

                                            113
15. Open the Remove Overlapping Centerlines geoprocessing tool in the Location
    Referencing toolbox.

16. Choose the Centerline layer as the Input Centerline Features parameter.

17. Click Run. The tool is executed, and the overlapping centerlines are removed.

18. Select the same centerline as in step 4.

19. Notice only one centerline is present now.

                                               114
Append Events

1. Now that the routes and centerlines are loaded and configured correctly, event records
   can be appended into the MilepostLocations LRS Event.

2. The source event records are currently in a database table called SourceMilepostLoc in the
   Exercise_8_9.gdb.

3. Open the Append Events geoprocessing tool in the Location Referencing toolbox.

4. Populate the following parameters.

    a. Input Event – SourceMilePostLoc table from Exercise_8_9.gdb

    b. Target Event – MilepostLocations feature class that was configured as an LRS Event in
       exercise 8

    c. Field Mapping – Everything should map correctly

                                            115
                                     d. Load Type – Select Add from the drop down

You could also use the Append
Events tool to load events by
Retire Overlaps in time and
measure, Retire by EventID and
Replace by EventID options.

                                 5. Click Run. The event records are loaded into the MilepostLocations event.

                                 6. Add the MilepostLocations events to the map. The newly appended records are now
                                    present on the map.

                                 Close your project. Don’t save your changes.

                                                                            116
Exercise 10: Conflict Prevention
Configure Conflict Prevention and utilize it for route editing in ArcGIS Pro

Objective
In this exercise you will utilize the new Conflict Prevention capabilities within ArcGIS Pro for LRS
Route editing. You will also utilize the Version Management Service to create, edit, and delete
versions for editing.

Data
 Pro project with service publishing in Exercise 1

Methodology
Conflict Prevention is a capability available in Roads and Highways to all users. Enabling
Conflict Prevention allows multiple users to edit within an LRS without creating any
conflicting edits that might result in incorrect measures/shapes for routes and events.

Configure Conflict Prevention

30. Conflict Prevention is enabled/disabled via the Modify LRS geoprocessing tool. In order to
    make this change, all connections to the database, including services, must be turned off.

31. Turn off the service you published in Exercise 1. Log into ArcGIS Server Manager by going
    to https://pebl04.esri.com/server/manager and entering the credentials you used to
    publish your service in Exercise 1.

32. Find your service you published in Exercise 1 and turn it off by clicking the stop button on
    the right side.

33. Now that the service is stopped, Conflict Prevention can be reenabled.

                                                  117
34. In your ArcGIS Pro project, open the Modify LRS geoprocessing tool in the Location
    Referencing toolbox, Configuration toolset, LRS toolset.

35. Populate the following parameters.

    a. Input Workspace – Navigate to the geodatabase you used for publishing in Exercise 1

    b. Current LRS Name – Choose LRS from the drop down

    c. New LRS Name – Leave Blank

    d. Conflict Prevention – Choose Enable from the drop down

    e. Leave all other parameters as is

36. Click Run. The tool runs successfully, and Conflict Prevention is now enabled.

                                            118
37. Go back to the Server Manager and turn your service back on.

38. In your Pro project, close the other maps that are open then in the Catalog pane choose
    the Portal tab. Find your service and add it to a new map. Remember to get the feature
    service with the red point icon on a yellow background.

39. Once you map appears, go to the ArcGIS Pro ribbon, click the Location Referencing tab and
    notice that LRS Locks is no longer greyed out as Conflict Prevention is now enabled.

Acquiring and releasing route locks

20. Click the List by Data Source icon (the white cylinder) above the Contents pane on the left-
    hand side of your project, then click the version below your map name (the blue computer
    icon).

21. The Versioning tab appears on the Pro ribbon. Click Manage Versions.

22. Create 2 new versions that are public with the following format, your first name_last name
    initial_1 and _2.

23. Click Save to finish creating the versions and close the UI to return to your map.

24. Change your version to the _1 version you just created.

25. Turn on the AllRoutes network layer and turn off the StateRoutes network layer.

                                             119
26. Using the Select by Attributes tool, find the AllRoutes route with route ID = 11316310000.
    Zoom to the selected route.

27. On the Location Referencing tab, click the Retire button.

    The Retire Route pane appears.

28. Choose the AllRoutes network and select route ID 11316310000 from the map.

29. A notification in blue will appear at the top of the tool alerting you that a lock has been
    acquired.

30. Close the Retire Route pane.

31. On the Location Referencing tab, open the LRS Locks table. Notice the lock on route ID
    11316310000 is present.

                                             120
You could also release the lock    32. Notice the column on the far-right side called Releasable. This column alerts you to
by selecting the route on the          whether the lock can be released in its current state.
map and using the Release Locks
tool on the Location Referencing   33. Highlight the lock record in the table and click the Release Locks: Selected button.
ribbon.

                                   34. The lock is released.

                                   35. Open the Retire Route pane again and acquire the lock on route ID 11316310000. Retire
                                       the route from measure 0 to measure 0.1 on 1/1/2019.

                                   36. Refresh the locks table and notice the releasable status is now No.

                                   37. Save your edits and change the version to the yourname_2 version. You can do this by
                                       right clicking the current version in the Contents pane and choose Change Version.

                                                                                121
38. Open the Retire Route pane again. Select the AllRoutes network and try to select route ID
    11316310000 from the map.

39. Because the route is already locked in version _1, you can’t acquire the lock. To release
    the lock, you will need to reconcile and post version _1 or delete it.

40. Close your project and don’t save changes.

                                            122
Exercise 11: Event Editor
Use new capabilities in Event Editor like Undo/Redo and Event Replacement
in ArcGIS Pro

Objective
In this exercise you will use new capabilities within Event Editor including Undo/Redo and Event
Replacement.

Data
 Pro project with service publishing in Exercise 1

Methodology
With branch versioned data being supported in Roads and Highways, new capabilities are
available in Event Editor, including the ability to Undo/Redo edits. Additionally, new tools like
Event Replacement are now available in the application for both traditional and branch
versioned data.
Undo/Redo in Event Editor

1.   Open the Event Editor URL provided in the one note document.

2.   Create a new version with your name.

3.   Make sure that switch to this version is checked.

4.   Use the Add Linear Events add new events to one of the AllRoutes network routes.

5.   Notice there isn’t a save button on the second screen of the widget, but instead an apply
     button. This is because branch versioned services support editing sessions. Like in ArcMap
     and ArcGIS Pro, you can now undo/redo edits and must save edits to the database using
     the editing Save Edits tool.

                                               123
6.   As you make multiple edits, those edits are listed as able to be undone and redone.

7.   Continue to make edits using the Add Linear Events, Add Point Events, and Event
     Attribute table. Notice how the edits are listed and able to be undone.

8.   Undo and Redo some edits. Notice they change on the map and in the attribute table.

9.   When you’re finished editing and you can either Save or Discard your edits.

Event Replacement

1.   Another new capability in Event Editor is support for event replacement. Event replacement
     is designed to support bulk retirement/replacement of events when there is a change that
     doesn’t require an LRS edit. An example would be a repaving project where events like
     median or number of lanes changes for a segment of route, but there is no change to the
     shape or measures of the route in the network.

2.   Event replacement needs to be configured in a similar manner to how Attribute Sets are
     configured in Event Editor.

3.   On the edit tab, open Event Replacement configuration in the Edit Events section.

4.   The Event Replacement widget opens.

5.   For Retire Events at the top right side, select Crashes, Structural Condition, and IRI.

                                               124
6.   For Retire and Replace at the bottom right side, select Access Control, ADT, Functional
     Median Type, and Route Type.

7.   Click Save and close the UI.

8.   Open the Event Replacement tool from the Edit tab.

     This tool is similar to the Add Linear Event and Add Point Event widgets.

9.   Choose AllRoutes for the Network, and RouteID 6624900. Use the beginning of the route
     for the From Measure and end of the route for the To Measure.

10. Click Next. Populate attributes for the new events that will be added as replacements.

11. Click Apply.

12. Use the select tools to see how the old events were retired and the newly created events are
    not present in their place.

13. Feel free to utilize event replacement on other routes.

                                              125
