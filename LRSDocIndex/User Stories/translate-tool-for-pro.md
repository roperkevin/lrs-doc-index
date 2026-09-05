# Translate tool for ArcGIS Pro

| Field | Value |
| --- | --- |
| **Doc** | 644 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Translate_Routes_UserStory1.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Translate_Routes_UserStory1.pdf>) |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | route · line · measure · translate tool · route id · route name · network · lrs editor |
| **Tools** | — |

## Summary

User story for a Translate tool in ArcGIS Pro that enables LRS Editors to translate Routes, Lines, or Measures between RouteID and Route Name, and between networks. The tool includes features such as syncing Route Name and ID, selecting routes from the map, handling multiple routes or time slices, flashing selected routes, and form controls like reset, copy, and minimize. Error conditions and testing criteria are also specified.

## Related documents

<!-- related:begin -->
- [Rename Tool for ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rename-tool-for-pro.md>) — similar text 0.39 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:649 s=4.732 -->
- [Support Translation Between RouteID and RouteName (and Between LRS Networks) Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4483-support-translation-between-routeid-and-routename-v3.md>) — similar text 0.49 · same surface <!-- rel:620 s=3.892 -->
- [Add Line Event tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-tool-in-pro.md>) — similar text 0.13 · 2 title words · same kind/surface/folder <!-- rel:687 s=3.65 -->
- [Support Translation Between RouteID and RouteName (and Between LRS Networks) Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/4483-support-translation-between-routeid-and-routename-v1.md>) — similar text 0.48 · same surface <!-- rel:640 s=3.389 -->
- [Translate Events: Support translation of an event to a network with Postmile routes within routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/1958-translate-events-support-translation-of-an-event.md>) — similar text 0.15 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:831 s=2.997 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Lines](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-a-line.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html) · [LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html)

_No page matched:_ [translate](https://www.google.com/search?q=%22translate%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

                                     Translate tool for ArcGIS Pro

                                             Acceptance Criteria
As an LRS Editor, I want to be able to translate Routes, Lines or Measures in ArcGIS Pro.

Persona
LRS Editor: This user is responsible for making edits to the LRS. One workflow editors will utilize is to be able to easily translate back and forth between RouteID and Route Name and the ability to copy and paste the outputs for use in other tools. Another requirement is the ability to translate back and forth between Route/Measure between the networks.

User Story

1.   Provide the ability to translate Routes, Lines or Measures in ArcGIS Pro

2.   Create a new tool in the Tools section of the LR ribbon.

3.   Figure out the name of the tool.

4.   Get a new icon for this tool.

5.   This tool open along the ribbon.

                                                                                                                        810
                                    Translate Route Name/Route ID
                               User Story

                               1.    Works for Networks in the TOC that are from a FS or DC

                               2.    Works only on the Networks where Route Name is configured

                               3.    Type the Route Name and upon losing focus or hitting ENTER, the Route ID gets

                                     populated and vice versa

                               4.    The Select Route from Map tool can also be used to get the Route Name/Route ID

User Story

5.   Provide a tool to reset the form

6.   Provide a tool to copy text

7.   Provide a tool to minimize the form

8.   If the form is populated and is minimized, then open the form as-is upon clicking tool. Keep this state intact

     until the Pro session is closed.

9.   If there exists multiple routes at a location where the Select Route from Map tool is used, then show a modal

     window with a table including the following fields: Network, Route ID, Route Name, From Date, To Date

10. If there exists multiple time slices of a routes when a Route Name/Route ID is typed , then show a modal

     window with a table including the following fields: Network, Route ID, Route Name, From Date, To Date

11. Upon successful selection of a Route Name/Route ID, flash the route 3 times

12. The Route Name/Route ID should always be in sync i.e., if the Route ID is changed and is valid then change the

     Route Name and vice versa.

13. If the Route Name/Route ID is too long for the text box, then show trailing…..and show the full text upon

     hovering

14. Use intellisense after 3 characters

15. Route Name/ID and measure upon hovering should show up when using the Select Route from Map tool.

                                                                                                                      811
 Translate Route Name/Route ID
Error Conditions

1.   Route Name is not valid

2.   Route ID is not valid

3.   Select Route from Map tool is used on a Network that doesn’t support route

     name

                                                                                  812
                                        Translate Line Name/Line ID
                               User Story

                               1.   Works for Networks in the TOC that are from a FS or DC

                               2.   Works only on the Networks where Line is configured

                               3.   Type the Line Name and upon losing focus or hitting ENTER, the Line ID gets

                                    populated and vice versa

                               4.   The Select Line from Map tool can also be used to get the Line Name/Line ID

User Story

6.   If the form is populated and is minimized, then open the form as-is upon clicking tool. Keep this state intact

     until the Pro session is closed.

7.   If there exists multiple Lines at a location where the Select Line from Map tool is used, then show a modal

     window with a table including the following fields: Network, Line ID, Line Name, From Date, To Date

8.   If there exists multiple time slices of a Lines when a Line Name/Line ID is typed , then show a modal window

     with a table including the following fields: Network, Line ID, Line Name, From Date, To Date

9.   Upon successful selection of a Line Name/Line ID, flash the Line 3 times

10. The Line Name/Line ID should always be in sync i.e., if the Line ID is changed and is valid then change the Line

     Name and vice versa.

11. If the Line Name/Line ID is too long for the text box, then show trailing…..and show the full text upon hovering

12. Route Name/ID and measure upon hovering should show up when using the Select Route from Map tool.

Error Conditions

1.   Line Name is not valid

2.   Line ID is not valid

3.   Select Line from Map tool is used on a Network that doesn’t support Line name

                                                                                                                      813
                                           Translate Measures

                                                             User Story

                                                             1.   Works with all types of Networks
2.   Select the From Network and To Network, then upon populating a Route Name/Route ID in either
                                                                  From or To section, the translated Route
                                                                  Name/Route ID gets populated
3.   Type the Route Name/ID in the From section and upon losing focus or hitting ENTER, the
RouteName/ID for the To section gets populated and vice versa
4.   The Route Name/ID of the From and To sections should always be in sync i.e., if one changes, then the other changes.

User Story

1.   The Select Route from Map tool can also be used to get the RouteName/ID

5.   If the form is populated and is minimized, then open the form as-is upon clicking tool. Keep this state intact

     until the Pro session is closed.

6.   If there exists multiple Routes at a location where the Select Route from Map tool is used, then show a modal

     window with a table including the following fields: Network, Route Name/ID, From Date, To Date

7.   If there exists multiple time slices of a Lines when a Route Name/ID is typed , then show a modal window with

     a table including the following fields: Network, Route ID/Name, From Date, To Date

8.   Upon successful selection of a Route Name/ID, flash the Route 3 times

9.   If the Route Name/ID is too long for the text box, then show trailing…..and show the full text upon hovering

10. Allow the same network for From and To sections. That way, overlapping routes in the same network can be

     translated.

11. Route Name/ID and measure upon hovering should show up when using the Select Route from Map tool.

                                                                                                                      814
                                         Translate Measures
Error Conditions

1.   Route Name/ID is not valid

                                             All three tools

Testing

1.   Test with all types of Networks
2.   Test with Default and other versions and DC
3.   Dark and Light Mode
4.   508 and i18n

Documentation

1.   Create a new document for translating Routes, Lines and Measures outlining the use cases. Workflow

     document with line diagrams.

Automation

1.   No automation

Estimate

1.   Story Points:

                                                                                                          815
