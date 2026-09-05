# Experience Builder Support Multiple LRS Services in Web Map

| Field | Value |
| --- | --- |
| **Doc** | 178 · User Story · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExB - Support Multiple LRS Services in Web Map.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Support%20Multiple%20LRS%20Services%20in%20Web%20Map.pptx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2025-04-29 11:47 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | experience builder · web map · multiple services · event editor · lrs enabled service · lrs widgets · referent layers |
| **Tools** | Add Point Event · Add Line Event · Split Event · Merge Events · Search by Route · LRS Identify · DynSeg |

## Summary

This document describes a user story for supporting multiple LRS services within a single web map in Experience Builder. It outlines requirements for event editors to use multiple LRS-enabled and non-LRS-enabled services together for editing and referencing. It also covers testing and documentation updates related to this functionality.

## Related documents

<!-- related:begin -->
- [Experience Builder Time and Versioning widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/exb-time-and-versioning-widget.md>) — similar text 0.28 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:167 s=5.18 -->
- [Experience Builder Express Mode support for LRS widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-express-mode-support-for-lrs-widgets.md>) — similar text 0.28 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:184 s=4.635 -->
- [Experience Builder SLD Interaction with Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-sld-interaction-with-map.md>) — similar text 0.23 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:191 s=4.554 -->
- [Create single LRS picker for Experience Builder widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-single-lrs-picker-for-exb-widgets.md>) — similar text 0.34 · 2 title words · same kind/surface/folder <!-- rel:193 s=4.276 -->
- [Experience Builder Referent method in Add Point and Line widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-referent-method-in-add-point-and-line-widgets.md>) — similar text 0.37 · 2 title words · same kind/surface/folder <!-- rel:177 s=4.273 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Merge events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-events.html)

_No page matched:_ [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com) · [Split Event](https://www.google.com/search?q=%22Split%20Event%22+site%3Adoc.esri.com) · [Search by Route](https://www.google.com/search?q=%22Search%20by%20Route%22+site%3Adoc.esri.com) · [LRS Identify](https://www.google.com/search?q=%22LRS%20Identify%22+site%3Adoc.esri.com) · [DynSeg](https://www.google.com/search?q=%22DynSeg%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Experience Builder Support multiple services in the web map <!-- slide 1 -->
User Story
ArcGIS Enterprise

### User Story <!-- slide 2 -->
As an event editor, I need the ability to utilize multiple services within my web map, so that I can combine multiple LRSes and reference layers into a single application.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). Depending on the configuration of the LRS and the other layers that are utilized to help support event editing, these users might need to use a web map that has multiple services with LRS widgets in Experience Builder.

## Acceptance Criteria
### Multiple services in web map <!-- slide 3 -->
- For all LRS widgets, support a web map that has more than one service
  - This could be 1 LR enabled service and others that are not LR enabled OR
  - It could be multiple LR enabled services (from the same or different LRSes)
- When loading layers in a widget (in express mode or regular more), show all the layers from the web map
- Only layers coming from an LRS enabled service should be able to be used for LRS related editing operations like Add Point Event, Add Line Event, Split Event, and Merge Events
- In Search by Route, only networks from LRS enabled services can be searched, however, all layers from all services should be able to be used for referent layers (the same goes for referent methods in Add Point and Add Line widgets)
- In LRS Identify, search against any LRS Network from an LRS enabled service, however, the attribute sets can only come from the service the network came from
- In the DynSeg widget, allow layers from all LRS services, but the network can only be associated with attribute sets from the same service (no mix and match between services)

## Testing
<!-- slide 4 -->
- Test with all LRS widgets
- Verify the proper layers are loaded and the correct layers can be used for the various configuration options in the widgets
- Verify non LRS enabled service layers can’t be used for editing in LRS editing widgets

## Automation
<!-- slide 5 -->
- No automation updates

## Documentation
<!-- slide 6 -->
- Update existing documentation to mention support for multiple services within the web map

## Assignment
### Story Points <!-- slide 7 -->
Story Points:
Dev:
PE:
