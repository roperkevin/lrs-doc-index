# Verify External Events fail in LRS GP tools

| Field | Value |
| --- | --- |
| **Doc** | 809 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Verify External Events fail in LRS GP tools.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Verify%20External%20Events%20fail%20in%20LRS%20GP%20tools.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2020-05-10 23:42 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | external event · geoprocessing tools · error handling · event measures · event behaviors · location referencing |
| **Tools** | Disable Derived Measure fields · Disable Referent fields · Enable Derived Measure fields · Enabled Referent fields · Modify LRS Events · Append Events · Apply Event Behaviors · Delete Routes · Derive Event Measures · Generate Events · Overlay Events · Translate Event Measures · Update Measures from LRS |

## Summary

User story describing the requirement that external event sources should not work with LRS geoprocessing tools, ensuring error messages and tool failure when external events are used as source or output. Lists specific tools affected and testing approaches including Pro UI, model builder, python, REST, and Client-Server.

## Related documents

<!-- related:begin -->
- [Configure External Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/configure-external-events.md>) — similar text 0.20 · 2 title words · 2 filename words · same surface/folder <!-- rel:811 s=4.106 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/regression-testing-task-list-v1.md>) — similar text 0.23 · same surface <!-- rel:115 s=3.899 -->
- [Support updating External Event configuration](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-external-event-configuration.md>) — similar text 0.17 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:744 s=3.492 -->
- [Create External Event with No Connection File](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-external-event-with-no-connection-file.md>) — similar text 0.17 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:288 s=3.471 -->
- [Support adding External Event to Pro map/local scene](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-adding-external-event-to-pro-map-local-scene.md>) — similar text 0.17 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:745 s=3.287 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create and modify LRS events](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-and-modify-lrs-events.html) · [External event registration](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/external-event-registration.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)

_No page matched:_ [Disable Derived Measure fields](https://www.google.com/search?q=%22Disable%20Derived%20Measure%20fields%22+site%3Adoc.esri.com) · [Disable Referent fields](https://www.google.com/search?q=%22Disable%20Referent%20fields%22+site%3Adoc.esri.com) · [Enable Derived Measure fields](https://www.google.com/search?q=%22Enable%20Derived%20Measure%20fields%22+site%3Adoc.esri.com) · [Enabled Referent fields](https://www.google.com/search?q=%22Enabled%20Referent%20fields%22+site%3Adoc.esri.com) · [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com) · [Apply Event Behaviors](https://www.google.com/search?q=%22Apply%20Event%20Behaviors%22+site%3Adoc.esri.com) · [Delete Routes](https://www.google.com/search?q=%22Delete%20Routes%22+site%3Adoc.esri.com) · [Derive Event Measures](https://www.google.com/search?q=%22Derive%20Event%20Measures%22+site%3Adoc.esri.com) · [Generate Events](https://www.google.com/search?q=%22Generate%20Events%22+site%3Adoc.esri.com) · [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com) · [Translate Event Measures](https://www.google.com/search?q=%22Translate%20Event%20Measures%22+site%3Adoc.esri.com) · [Update Measures from LRS](https://www.google.com/search?q=%22Update%20Measures%20from%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Verify External Events fail in LRS GP tools <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing user, I need external events sources to not work with LRS GP tools, so that I don’t try to update data that I don’t have create, update, or delete privileges.

## Acceptance Criteria
### External Events in LRS GP tools <!-- slide 3 -->
- External events shouldn’t work with LRS GP tools
- If an external event is the source or output in the following tools, give an error message and have the tool fail on execution:
  - Disable Derived Measure fields
  - Disable Referent fields
  - Enable Derived Measure fields
  - Enabled Referent fields
  - Modify LRS Events
  - Append Events
  - Apply Event Behaviors (make sure External Events are skipped)
  - Delete Routes (if delete events option is checked, make sure External Events are skipped)
  - Derive Event Measures
  - Generate Events
  - Overlay Events
  - Translate Event Measures
  - Update Measures from LRS

## Testing
<!-- slide 4 -->
- Verify in Pro UI, model builder, python (inline and stand alone) for both REST and Client-Server

## Assignment
<!-- slide 5 -->
Story Points:
Dev:
PE:
