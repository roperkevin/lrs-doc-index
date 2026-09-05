# Perform Event Replacement User Story

| Field | Value |
| --- | --- |
| **Doc** | 660 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [Event_Replacement_UserStory12.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Event_Replacement_UserStory12.pdf>) |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | event replacement · event editing · route · measure · conflict prevention · field validation |
| **Tools** | Event Replacement |

## Summary

This user story describes the need for an Event Replacement tool that allows LRS Editors to replace multiple events in a single editing operation within ArcGIS Pro. It includes requirements for supporting various route and measure selection methods, networks with or without lines, conflict prevention, and compliance with accessibility and internationalization standards. Testing and automation plans focus on APR and RH environments with spanning and non-spanning events.

## Related documents

<!-- related:begin -->
- [Configure Event Replacement User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/configure-event-replacement.md>) — similar text 0.30 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:661 s=4.783 -->
- [Event Editor Stationing Method User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/event-editor-stationing-method.md>) — similar text 0.18 · 1 title word · 1 filename word · same kind/folder <!-- rel:682 s=3.169 -->
- [Add Line Event tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-tool-in-pro.md>) — similar text 0.15 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:687 s=3.138 -->
- [Add Point Event Tools: Coordinate Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-event-tools-coordinate-offset-method.md>) — similar text 0.10 · 1 title word · same kind/surface/folder <!-- rel:658 s=2.958 -->
- [Add Line Event Tools: Coordinate Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-tools-coordinate-offset-method.md>) — similar text 0.10 · 1 title word · same kind/surface/folder <!-- rel:648 s=2.913 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html)

_No page matched:_ [Event Replacement](https://www.google.com/search?q=%22Event%20Replacement%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

Perform Event Replacement
As an LRS Editor, I want so be able to configure a grouping of events layers in a single location, so that I can perform event replacement in a single editing operation. This user story is to perform the event replacement.

Persona
LRS Editor: This user is responsible for making edits to the LRS. The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs). The
LRS Editor can also be responsible for editing events associated with the routes in the LRS. They want to be able to replace multiple events by retiring some events and adding new events in a single editing operation. This can be done in Event Editor, but we also need to support Event
Replacement within Pro.
Clicking this button opens the Event
Replacement tool.

                                Replace
                                Events

                                          16
0                        EV1                        10   Event ID   From M   To M   From D   To D   Class
                                                         EV1        0        10     2000     Null   1

              Date of replacement: 2018
                                                         Event ID   From M   To M   From D   To D   Class

    EV2   2            EV3                8   EV4
                                                         EV1        0        10     2000     2018   1
                                                         EV2        0        2      2018     Null   1
0                     EV1                           10
                                                         EV3        2        8      2018     Null   X
                                                         EV4        8        10     2018     Null   1

                                                                                                            17
•   Add a new button “Replace Events”
•   Support all route and measure selection methods that the add linear event tools support
•   Support networks with and without lines and with and without route name
•   Split events across gaps in routes like the add linear events tools
•   Save referent information like the add linear events tools
•   Support conflict prevention
•   508 and i18n compliant
•   All field validation that add linear events widget supports should be supported, for example:
    subtypes, range domains, contingent vales, attribute rules, coded value domains, etc.
•   If the new event completely eclipses the old events’ dates, then delete that old event
                                                                                                    18
When this section is empty

             19
Testing
• Focus testing on APR (but do at least a few test scenarios with an RH environment to ensure it works correctly)
• Test with both spanning and non-spanning events
• Test with both line and non-line networks
• Test in both Light and Dark mode
Automation
• Automate 2-3 cases with Test Complete
• Automate all the cases with Ready API
Documentation
• Place in the event editing section
• Create a workflow topic that discusses how to perform Event Replacement using
  ArcGIS Pro. Use separate examples for RH and APR. Use the EE doc as a guide.
• Get examples from the SMEs.
Assignment
Story Points:
Dev:
PE:
