# Generate LRS Intersection GP Tool

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Source** | [Generate_LRS_Intersection_GPTool1.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Generate_LRS_Intersection_GPTool1.pdf>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "Generate LRS Intersection GP Tool"
source_file: "Generate_LRS_Intersection_GPTool1.pdf"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Generate_LRS_Intersection_GPTool1.pdf"
doc_id: 834
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
keywords: ["intersection", "route locking", "editor tracking", "time slicing", "conflict prevention", "cartographic realignment", "feature class"]
tools: ["Generate LRS Intersection"]
products: []
issues: []
related: [{"doc":130,"file":"generate-intersections-location-referencing__doc130.md","s":3.991},{"doc":509,"file":"generate-intersection-at-self-intersecting-routes__doc509.md","s":3.755},{"doc":267,"file":"generate-intersections-at-route-endpoints__doc267.md","s":2.894},{"doc":260,"file":"generate-a-route-log-using-the-glrsdp-gp-tool-test-plan__doc260.md","s":2.729},{"doc":155,"file":"allow-lrs-intersections-to-be-updated-without-locking-intersecting-routes-test__doc155.md","s":2.436}]
```
-->

## Summary

This document describes a geoprocessing tool designed to generate and update intersection point features within an LRS network. It details the tool's behavior regarding route selection, locking mechanisms, time slicing, and handling of intersection updates including creation, retirement, and deletion. The document also covers user permissions, error handling, and progress reporting during the intersection generation process.

## Related documents

<!-- related:begin -->
- [Generate Intersections (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-intersections-location-referencing__doc130.md>) — similar text 0.20 · 1 title word · same kind/surface <!-- rel:130 -->
- [Generate Intersection at Self-Intersecting Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-intersection-at-self-intersecting-routes__doc509.md>) — similar text 0.23 · 2 title words · 1 filename word · same surface/folder <!-- rel:509 -->
- [Generate Intersections at Route Endpoints](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-intersections-at-route-endpoints__doc267.md>) — similar text 0.13 · 1 title word · 1 filename word · same surface/folder <!-- rel:267 -->
- [Generate a Route Log using the GLRSDP GP Tool – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/generate-a-route-log-using-the-glrsdp-gp-tool-test-plan__doc260.md>) — similar text 0.11 · 2 title words · 1 filename word · same surface <!-- rel:260 -->
- [Allow LRS Intersections to be updated without locking intersecting routes - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/allow-lrs-intersections-to-be-updated-without-locking-intersecting-routes-test__doc155.md>) — similar text 0.22 · 1 filename word · same surface <!-- rel:155 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-lrs-intersection-properties.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html) · [Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-cartographic-realignment.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [Generate LRS Intersection](https://www.google.com/search?q=%22Generate%20LRS%20Intersection%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

     Helps generate and update LRS intersection point features.
1. This tool should not require ArcGIS Advanced license.
2. The intersection FC is updated as the result of running this tool.
3. The Start Time is used to update route intersections and intersecting features that have
   been edited since this time. Use Editor Tracking to find out the routes that have been
   added/updated/Edited. If Editor tracking is not enabled in any one of the intersecting
   feature classes, then disregard this filter.
4. If this filter is not used, then calculate intersections across all times.
5. If the Only Create Intersections for Routes Edited by Me in the Current Version option is
   checked, only routes edited by the present user in the current version, as identified by
   Editor Tracking, will have intersections updated.
6. For a dataset in a file geodatabase, the intersections are updated for routes that are
   edited by the current Windows user. Editor Tracking must be enabled for the network

   feature class to use this functionality.
7. Consider z values for creating the intersections. The units for z tolerance should come
   from the z co-ordinate system.
• Remove Feature ID field from the original design
• Route ID is comma separated
• Order of name should match to that of the order of route ID in terms
  of comma separation
• Measure is optional field, measure is from the first route in the Route
  ID field which is the dominant route
• If dominance rules are not present or have a tie, then use alpha
  numeric order                                                                                1                         2              3:4:5
• When calculating intersection Name and Route ID list, use the same
  rule as above
• Do not generate intersections for self intersecting part of the route
• Do not allow editing or deleting the intersections manually
  Intersection ID   Intersection Name                 Route ID                               Feature Class Name   From Date   To Date    Measure

  1                 Main St & Park Ave                Main St, Park Ave                      Network1             1/1/2000    Null       10

  2                 Main St & Park Ave                Main St, Park Ave, State St, Ohio St   Network1             1/1/2000    Null       30
                    & State St & Ohio St
  3                 Main St & Park Ave                Main St, Park Ave, State St, Ohio St   Network1             1/1/2000    Null       50
                    & State St & Ohio St 1
  4                 Main St & Park Ave                Main St, Park Ave, State St, Ohio St   City Boundary        1/1/2000    Null       50
                    & State St & Ohio St & City 2 &
                    City 3
  5                 Main St & Park Ave                Main St, Park Ave, State St, Ohio St   County Boundary      1/1/2000    Null       50
                    & State St & Ohio St & County
                    X
1.   Consider the route selection or definition filter on the Network Layer to which the intersection layer is registered
     to. Use the logical intersection of the routes selected and in the Definition Filter to process intersections.
2.   If no routes are selected, all routes are considered selected. If a route is having its intersections calculated, they
     will be calculated against all other routes in the LRS Network irrespective of selection or “Definition Filter”
3.   The start-end time of the routes should be considered when calculating intersections. Time slice intersections
     per route definition.

                                                        1                               2:3

     Intersection    Intersection Name           Route ID               Feature Class         From Date    To Date      Measure
     ID                                                                 Name
     1               Main St & Park Ave          Main St, Park Ave      Network1              2010         Null         10

     2               Main St & Ohio St           Main St, Ohio St       Network1              2005         Null         40

     3               State St & Ohio St          State St, Ohio St      Network1              1990         2000         15
1. If Conflict Prevention is enabled, then the routes for which intersections are being
  calculated will be locked by the current user in the current version. In other words, only
  generate intersections for the routes that have been locked. Provide appropriate error
  messages.
E.g. - Prompt the user "To generate intersections, you must first acquire locks for all routes in
the<Network Name> network. One or more routes are locked by another user or locked in a
different version."
Provide a list of all the routes that are impeding their ability to create intersections. Include:
Network, Route ID, Event, User, Version, Date Locked (comma separated)
2. If Conflict Prevention is enabled, then the routes that are intersecting the routes for which
  intersections are being calculated will be locked by the current user in the current version.
  Provide appropriate error messages.
3. The tool should fail if locks are not available for all the routes and intersecting routes that
  are selected for intersection calculations.
4. If the tool’s run is unsuccessful or if the run is aborted, then release all the locks that have
  been acquired buy the tool in the present run.
5. If a reconcile is required then, do not allow the intersections to be created/updated.

…Auto-reconcile (if that option is checked) else, prompt the user to reconcile.

6. If the user does not have some of the route locks to create the intersections and
the routes are not already locked by another user or in a different version, then

…Acquire the lock for them automatically without a prompt.
….. Acquire the locks ONLY if the all the locks can be acquired for the routes needed
to generate the intersections.

7. If the user adds another network (network 2) from the same database as an
intersecting FC, then

....run the locking logic on both the networks.
......Acquire the locks only if all the routes on both the networks are lockable.
8. If the tool runs on the Default version, then the locks acquired as a result of running
this tools should be released after a successful run.
9. If the tool runs on a child version, then the locks acquired as a result of running this
tools should not be released after a successful run.
      When updating intersections, recalculate the locations of intersections.
      When doing this, there are 4 possible outcomes:

Existing intersections move                              • Maintain the intersection ID (do not change it)
                                                         • If a feature intersects the route at more than one location,
                                                           the rule for determining which one moved is to determine
                                                           which old intersection is the closest to the new intersection.
                                                         • Intersections may need to be retired.
                                                         • When dealing with time, intersections should be time sliced
                                                           by all route from/to date
                                                         • When retiring, ensure to update the location of the existing
                                                           feature and create a new record for the retired feature.
Existing intersections no longer exist                   Retire the intersection

New intersections are created

The intersections may not exist anymore is time due to   Delete the intersection
cartorealignment or by Deleting the routes
The routes to be processed for updating the intersections are chosen on the basis of the route
selection, route definition query, date selection, and the Only Calculate Intersections for Routes Edited
by Me in the Current Version option.

                                       Time doesn’t       Not edited in this                              Start time out
                                       match              version                Unselected               of range

                                           =3        =0        =0           =4    =3           = 17       =0         = 12      =0

                                  = Difference in elevation

                                               Unselected                                     Lock not                Elevation
                                                                       Unselected
                                                                                              available               difference out
                                                                                                                      of range
Before running the apply event behavior tool:
• Check if carto realignment edits are present and need to be run
• If any of the events have referents
• If carto realignment has honor referents configured
• Check if any of those events have intersections as referents

Then run generate intersection on that route (with carto realignment) and intersecting
routes.
                                        1                2              3

Intersection ID   Intersection Name         Route ID           Feature Class   From Date   To Date   Measure
                                                               Name
1                 Main St & Kirk St         Main St, Kirk St   Network1        1/1/2000    Null      10

2                 Main St & Kirk St 1       Main St, Kirk St   Network1        1/1/2000    Null      15

3                 Main St & Kirk St 2       Main St, Kirk St   Network1        1/1/2000    Null      30

       If a feature in one of the FCs intersects a route in more than one location...
       ...suffix the name with a number (i.e. 1, 2, 3, etc.)

       If a feature in one of the FCs shares a boundary, then...
       ...start and end of common boundary.
Provide progress bar:
- stage (intersection generation) and which layer its calculating
intersection for, the feature count and current feature.
- regenerating event shapes, which layer, and which feature.
One progress bar, with total progress...
