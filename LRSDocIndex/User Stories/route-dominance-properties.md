# Route Dominance Properties User Story

| Field | Value |
| --- | --- |
| **Doc** | 699 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [RouteDominanceProperties.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RouteDominanceProperties.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-08-13 19:41 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | route dominance · lrs network · location referencing · route dominance properties · lrs controller dataset · user story |
| **Tools** | — |

## Summary

Describes the user story for viewing route dominance properties in LRS Networks to verify configured rules and understand dominant routes in various scenarios. Specifies access methods, data sources, UI requirements including accessibility and internationalization, and testing considerations across different data sources and licenses. Includes documentation update instructions for related help topics.

## Related documents

<!-- related:begin -->
- [LRS Intersection Properties User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-intersection-properties.md>) — similar text 0.66 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:843 s=6.536 -->
- [LRS and Gap Calibration Properties User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-and-gap-calibration-properties.md>) — similar text 0.58 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:842 s=4.479 -->
- [LRS Addressing and Utility Network Properties User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-addressing-and-un-properties.md>) — similar text 0.36 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:190 s=4.465 -->
- [Pro AI Assistant Reverse Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-reverse-route.md>) — similar text 0.08 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:109 s=3.382 -->
- [Multiple Measures UI Picker User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/multiple-measures-ui-picker.md>) — similar text 0.21 · same kind/surface/folder <!-- rel:790 s=2.907 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-location-referencing-options.html)
<!-- docs:end -->

---

## Story
### Route Dominance Properties <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing user, I need to be able to see the route dominance properties for each LRS Network, so I can verify the rules  configured and understand which route should be dominant in different scenarios.

Persona: Location Referencing users includes any administrator, data loader, LRS editors, or other user of the software.  For administrators and data loaders that do the initial configuration of the software, being able to see the route dominance properties will allow them to confirm they’re configured correctly before editors begin to use the software.  For LRS editors, they want to be able to see the properties so they can validate what they see when events snap to routes and when determining which route is dominant in different editing scenarios.

## Acceptance Criteria
### Route Dominance Properties <!-- slide 3 -->
- Should apply to all LRS Networks
- Should be able to be accessed in these three ways:
  - In the Catalog window, navigate to the FC/table, right click, select properties, and navigate to LocationReferencing tab.
  - In the LRS Hierarchy, right click the FC, select properties, and navigate to LocationReferencing tab.
  - In the map, navigate to the contents window, right click the FC/table, select properties, and navigate to LocationReferencing tab.
- Should be available via fgdb (catalog and layer), egdb (catalog and layer), and feature service (layer)
- Should appear if Location Referencing (RH or APR) is not licensed (Pro pattern)
- Information should be pulled from the LRS Controller Dataset (not the LRS Metadata table)
- Accordion should be closed by default like other Pro accordions
- Needs to be 508 compliant – A11y, Dark Mode, Tabbing
- Should be I18n ready
- Green text at bottom should link to page that describes the property window

### Route Dominance (LRS Networks) <!-- slide 4 -->
- Add a new section called Route Dominance Properties
- When expanded we should have a subsection for each rule (the rules should be in order that they were created to reflect the order we would process them to determine the dominant route)
- Field should not be editable, but should be selectable and copiable
- If the value or field name is very long, size it according to the window and provide hover content
- In both Fields and Exceptions, use either a comma or semicolon to delineate each value (if there is more than one)

![Figure 1 — Route Dominance (LRS Networks)](../media/route-dominance-properties/fig-01-slide-04-route-dominance-lrs-networks.png)

## Testing
<!-- slide 5 -->
- Test with and without Location Referencing license
- FGDB, EGDB (traditional and branch), Services
- Layers and Feature Classes/Tables
- No Metadata table present
- Change version
- Make change in Configure Route Dominance tool
- Long values
- Tab, scroll, resize, hover
- Select and copy
  - Dark and light theme
  - L18N
  - Switch maps
  - Click properties link

## Documentation
<!-- slide 6 -->
- Add information related to route dominance properties in View LRS Network properties topic.  Follow the pattern used for the other sections in the topic.
- https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/view-lrs-network-properties.htm and https://pro.arcgis.com/en/pro-app/latest/help/production/roads-highways/view-lrs-network-properties.htm

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
