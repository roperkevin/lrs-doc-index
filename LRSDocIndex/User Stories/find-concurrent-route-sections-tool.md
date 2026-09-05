# Find Concurrent Route Sections Tool

| Field | Value |
| --- | --- |
| **Doc** | 716 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [FindConcurrent_Route_Sections_UserStory.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/FindConcurrent_Route_Sections_UserStory.pdf>) |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | concurrent route · route sections · dominant route · subordinate route · concurrency · route editing · rest endpoint |
| **Tools** | — |

## Summary

Describes a tool for LRS Editors to identify and visualize concurrent route sections, showing dominant and subordinate routes. The tool integrates with the LR ribbon, uses the Concurrencies REST endpoint, and supports route selection with validation and map interaction. It includes display markers, concurrency tables, and zoom functionality for route sections.

## Related documents

<!-- related:begin -->
- [Cover Event Behavior in Realign Route with Concurrencies](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-eb-in-realign-route-with-concurrencies.md>) — similar text 0.15 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:715 s=3.432 -->
- [Configure Route Priority User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/configure-route-priority.md>) — similar text 0.20 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:723 s=3.421 -->
- [Consider Route Dominance in Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/consider-route-dominance-in-append-routes.md>) — similar text 0.21 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:709 s=3.229 -->
- [Consider concurrencies in Update Measures from LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/consider-concurrencies-in-update-measures-from-lrs.md>) — similar text 0.20 · 1 filename word · same kind/surface/folder <!-- rel:710 s=3.012 -->
- [Translate tool for ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/translate-tool-for-pro.md>) — similar text 0.20 · 1 title word · same kind/surface/folder <!-- rel:644 s=2.668 -->
<!-- related:end -->

---

Find Concurrent Route Sections Tool
As a LRS Editor, I want to be able to identify the concurrent sections along a route and to able to see the dominant and subordinate routes in that section.

Persona:
LRS Editor: This user is responsible for ongoing maintenance of the LRS along with supplemental bulk data loading in the LRS.

Once their organization is in production, this user would be responsible for bulk loading new data as needed and day to day editing tasks. Many DoTs have modeled their routes to have concurrencies (two or more routes that share a common piece of pavement/centerlines).

This proposed tool is designed to help the editor to able to identify and visualize the concurrent sections along a route and to able to see the dominant and subordinate routes in that section.

The identification and visualization of the dominant and subordinate routes can aide in planning of the future route and event editing activities.

                                                                                                                       16
2.814       12.72
        A

Choose one of the variants   17 from section A, B and C
                        Acceptance Criteria - 1
1.Create this tool in the tools section of LR ribbon
2.Can be used with FS only
3.Use the Concurrencies REST endpoint to do the calculations
4.The tool docks to the right side same as the LR editing tools.
5.Allow this tool to be opened at the same time as the LR editing tools.

Network:
1. In the drop-down list, show only LR Network FC that are present in the map

Date:
1. Date is a required parameter
2. This date should be part of the date range in the map for the chosen Network.
3. In case the date is out of the date range, then provide a warning
4. Use today’s date as the default

RouteID:
1. Empty by default
2. Use intellisense after 3 characters are typed.
3. If the provided value is not present, then show an error message
4. Provide a route picker from the map, in case more than one route is present at that location, then show the picker table in the map to choose one route
5. Do not show any results until and valid Route ID is provided
6. Once a valid Route ID is found, show all the sections where this Route ID is present irrespective of whether this Route is dominant for that section or not.
7. Show the label Route Name for Line, Route ID for no-line and PoM networks.
8. If the Route ID is too long, then use the …… trailing text
9. Pay special attention to the hover text on Route ID. Show the complete text upon hovering.   18
                       Acceptance Criteria - 2
Zoom to section:
1. Center zoom to the highlighted section from the section table on the left
2. In case, not routes are present to be zoomed to (Network is turned off, time filter or definition query applied), then show an error message.

Display Markers:
1. This is a toggle button to show 2 things on the highlighted section:
       • The section gets a halo and the section name is labeled cartographically.
• The start and end measures (for that section)of the dominant route are shown
• The start and end markers are shown with different colors and measure label that is placed cartographically. These markers should be snappable.
       • Make the symbology same to that of the Fix Route Dominance tool.
       • Remove the graphics if the tool is closed or the button is toggled off
       • If the tool is opened again, open it refreshed

Concurrency Table:
1. The dominant route is shown with the marker/bold/highlight in the top row.
2. Order and locate the sections on the basis of increasing calibration of the route
3. Show all the routes that are part of that concurrent section
4. Right-Click on the row will have the Flash, Zoom To and Pan To tools. These will work on sections.
5. All the cells are read only.
                                                                                         19
            Testing

Databases
1.DC and FS
2.Oracle and SQL Server

Networks
1.Non-line, line and PoM
2.Error if the FC is non Network

Error Messages
1.Validate the error messages developed specifically for this tool

                                          20
                                 Automation

1. No Automation for this tool

                                              21
                                                 Documentation

1. Write DOC that is specific for RH and APR domains

                                                                 22
          Estimates

Dev:
PE:
Points:

                      23
