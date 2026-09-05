# Experience Builder Express Mode support for LRS widgets

| Field | Value |
| --- | --- |
| **Doc** | 184 · User Story · Experience Builder |
| **Product** | Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExB - Support Express Mode.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Support%20Express%20Mode.pptx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2025-04-22 21:26 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | express mode · experience builder · lrs widgets · web app administrator · layer configuration |
| **Tools** | — |

## Summary

This document describes the user story for supporting Express Mode in all LRS widgets within ArcGIS Experience Builder. It covers the need for quick configuration by web app administrators, the default behaviors and layer organization in Express Mode, and testing and documentation requirements.

## Related documents

<!-- related:begin -->
- [Experience Builder Express Mode support for LRS widgets – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/24773-exb-express-mode-support-for-lrs-widgets.md>) — similar text 0.45 · 6 title words · 2 filename words · same surface <!-- rel:174 s=6.4 -->
- [Experience Builder Support Multiple LRS Services in Web Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-support-multiple-lrs-services-in-web-map.md>) — similar text 0.28 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:178 s=4.635 -->
- [Experience Builder Time and Versioning widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/exb-time-and-versioning-widget.md>) — similar text 0.18 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:167 s=4.008 -->
- [Create single LRS picker for Experience Builder widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-single-lrs-picker-for-exb-widgets.md>) — similar text 0.21 · 3 title words · same kind/surface/folder <!-- rel:193 s=3.761 -->
- [Update LRS Templates in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-lrs-templates-in-exb.md>) — similar text 0.25 · 2 title words · same kind/surface/folder <!-- rel:77 s=3.497 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Experience Builder Express Mode support for LRS widgets <!-- slide 1 -->
User Story
ArcGIS Enterprise

### User Story <!-- slide 2 -->
As a web app administrator, I need the ability to quickly configure LRS widgets within Experience Builder, so I can reduce the amount of time needed to deploy custom applications using LRS widgets.
Persona
Web App Administrator: This could be a GIS Manager, an IT professional, or a GIS or Business Unit user who is responsible for configuring and administering web applications.  These users want to easily deploy Experience Builder widgets into applications and Express Mode is the supported approach to do this.  We need to make our LRS widgets support Express Mode as well to make deployment easier for LRS related applications.

## Acceptance Criteria
### Express Mode for LRS widgets <!-- slide 3 -->
- Support ExB Express Mode for all LRS widgets
- Default option is to interact with the map widget in each LRS widget
- By default, enable all layers
- Continue to allow users to choose layers that can be disabled/enabled (follow the table widget example)
- Organize the layers in this view by type (LRS Minimum Schema, LRS Network, LRS Event, LRS Intersection, Non-LRS layers). Continue to exclude tables.  Also denote any layers that are part of Utility Network or Addressing.
- Continue to honor defaults for all other options in each widget
- When express mode is not selected, instead of showing a large list of layers that are loaded, show an accordion that can be expanded/collapsed that shows all the layers
- Technical detail: refactor code to a common configuration experience between all LRS widgets

## Testing
<!-- slide 4 -->
- Test all widgets in express mode and non express mode
- Test removing/disabling layers
- Verify other configuration options continue to work as expected

## Automation
<!-- slide 5 -->
- This is all configuration, so no automation

## Documentation
<!-- slide 6 -->
- For each LRS widget, document that Express Mode configuration is supported and is the default.  Explain what the user experience will be like with Express Mode for each individual widget.

## Assignment
### Story Points <!-- slide 7 -->
Story Points:
Dev:
PE:
