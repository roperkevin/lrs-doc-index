# Relocate Events support for Reassign to a New Line

| Field | Value |
| --- | --- |
| **Doc** | 537 · User Story · Pro |
| **Product** | Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [RelocateEventsReassigntoNewLine.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RelocateEventsReassigntoNewLine.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2023-07-17 22:34 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | reassign to new line · relocate events · external system data · route reassignment · event data · apr dataset · apr-un dataset |
| **Tools** | Relocate Events · Apply Event Behaviors |

## Summary

Describes the need for the Relocate Events tool to support reassignment of routes to a new line for external system data owners. It outlines the expected output format enhancements, testing approach using APR and APR-UN datasets, and automation updates via ReadyAPI. No documentation changes are required.

## Related documents

<!-- related:begin -->
- [Relocate Events in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/relocate-events-in-pro.md>) — similar text 0.27 · 2 title words · 2 filename words · same surface/folder <!-- rel:812 s=4.141 -->
- [Support line networks and JSON in Export Network](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-line-networks-and-json-in-export-network.md>) — similar text 0.22 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:805 s=3.457 -->
- [Relocate Event Support for External Event with No Connection File](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/relocate-event-support-for-external-event-with-no-connection.md>) — similar text 0.29 · 2 title words · 1 filename word · same surface/folder <!-- rel:287 s=3.344 -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-reassign-route.md>) — similar text 0.18 · 2 title words · same kind/surface/folder <!-- rel:758 s=3.169 -->
- [Support updating External Event configuration](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-external-event-configuration.md>) — similar text 0.33 · 1 title word · same kind/surface/folder <!-- rel:744 s=3.04 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Events data model](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/events-data-model.html)

_No page matched:_ [Relocate Events](https://www.google.com/search?q=%22Relocate%20Events%22+site%3Adoc.esri.com) · [Apply Event Behaviors](https://www.google.com/search?q=%22Apply%20Event%20Behaviors%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Relocate Events support for Reassign to a New Line <!-- slide 1 -->

### User Story <!-- slide 2 -->
As a LRS external system data owner, I need the ability to include reassignment to a new line as part of the updates to my event data stored outside the LRS gdb, so that I can keep my external system data up to date with the authoritative LRS.

Persona
LRS external system data owner: This user is the owner of the external system data, such as pavement, bridges, assets, etc.  With support for reassigning a route to a new line, we need to make sure these changes are shared to these external systems when they call the Relocate Events tool.

## Acceptance Criteria
### Relocate Events Reassign to a New Line <!-- slide 3 -->
- Enhance the output of Relocate Events to report the new Reassign Route scenarios supported when reassigning to a new line  (This appears to be already supported and might just be test only)
- Follow the existing format of the tool to show the before and after for the edits including the RouteID, Route Name, Dates, and Measures (Line Name isn’t included in the output of the tool currently)
- Results should continue to match those as if the event was an internal event that was processed by the Apply Event Behaviors tool

## Testing
<!-- slide 4 -->
- Test on a mix of APR and APR-UN dataset
- Use the same event data that was used to test the Reassign to a New Line event behavior user stories as the same results should appear when it’s an external event with the same route edits

## Automation
<!-- slide 5 -->
Add cases to the existing automation for the tool (via ReadyAPI)

## Documentation
<!-- slide 6 -->
- No updates needed to documentation

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
