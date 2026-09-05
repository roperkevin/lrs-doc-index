# Consider concurrencies in Update Measures from LRS

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Consider route dominance in Update Measures from LRS.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Consider%20route%20dominance%20in%20Update%20Measures%20from%20LRS.pptx>) |
| **Edited** | 2021-05-14 22:36 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Consider concurrencies in Update Measures from LRS"
source_file: "Consider route dominance in Update Measures from LRS.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Consider%20route%20dominance%20in%20Update%20Measures%20from%20LRS.pptx"
doc_id: 710
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2021-05-14T22:36:22Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["route dominance", "concurrency", "update measures", "event splitting", "dominant route"]
tools: ["Update Measures from LRS"]
products: []
issues: []
related: [{"doc":709,"file":"consider-route-dominance-in-append-routes__doc709.md","s":5.994},{"doc":704,"file":"support-populating-route-name-in-update-measures-from-lrs-tool__doc704.md","s":4.364},{"doc":715,"file":"cover-event-behavior-in-realign-route-with-concurrencies__doc715.md","s":4.083},{"doc":266,"file":"support-events-spanning-routes-in-update-measures-from-lrs__doc266.md","s":3.906},{"doc":726,"file":"cover-event-behavior-in-extend-route-with-concurrencies__doc726.md","s":3.611}]
```
-->

## Summary

This user story describes the need for the Update Measures from LRS tool to consider route dominance when features are located on concurrent routes. It specifies adding an optional parameter to select the dominant route for concurrencies and outlines expected behavior for event records on concurrent sections. Testing scenarios and documentation updates are also included.

## Related documents

<!-- related:begin -->
- [Consider Route Dominance in Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/consider-route-dominance-in-append-routes__doc709.md>) — similar text 0.66 · 1 title word · 3 filename words · same kind/surface/folder <!-- rel:709 -->
- [Support populating Route Name in Update Measures from LRS tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-populating-route-name-in-update-measures-from-lrs-tool__doc704.md>) — similar text 0.42 · 1 title word · 2 filename words · same kind/surface/folder <!-- rel:704 -->
- [Cover Event Behavior in Realign Route with Concurrencies](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-event-behavior-in-realign-route-with-concurrencies__doc715.md>) — similar text 0.28 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:715 -->
- [Support Events Spanning Routes in Update Measures from LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-events-spanning-routes-in-update-measures-from-lrs__doc266.md>) — similar text 0.43 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:266 -->
- [Cover Event Behavior in Extend Route with Concurrencies](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-event-behavior-in-extend-route-with-concurrencies__doc726.md>) — similar text 0.27 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:726 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)

_No page matched:_ [Update Measures from LRS](https://www.google.com/search?q=%22Update%20Measures%20from%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Consider concurrencies in Update Measures from LRS

User Story

## Slide 2 — User Story

As a LRS Analyst, I want to have concurrent routes considered when I’m trying to get the route and measure for a feature, so I can ensure the dominant route and measure is selected for features that I want to linear reference.
Persona
LRS Analyst: This user is responsible for analysis and reporting on LRS data.  This user may also have other titles/responsibilities within the organization, such as LRS editor or HPMS coordinator.  For the analyst role, this user utilizes other tools/capabilities within the Esri ecosystem as well as via home built and partner solutions.  One of the tools this user will utilize is a tool to determine where there are concurrency routes within their network.  These users may have features that aren’t managed by the LRS that they need to get the route and measure via the Update Measures from LRS tool.  When they use this tool, they want us to consider route dominance rules when a feature is placed on a location where there is concurrent routes.

## Slide 3 — Concurrencies in Update Measures from LRS

Add a parameter to the Update Measures from LRS tool to “Choose the dominant route for concurrencies”
This parameter would be optional and placed last in the list of parameters for the tool
If this option is enabled when the tool is run, any input record that is getting a route/measure added should have the route/measure of the dominant route if the location falls where there are concurrencies
If an event record is completely on a concurrent section and the RouteID/Measures are on the dominant route, append it
If an event record is completely on a concurrent section and the RouteID/Measures are on the non-dominant route, determine what route/measure combo is the dominant route and append it onto that route.  Make sure the Route/Measure columns are updated in the target event and provide an info gp message letting the user know “The source event record with OID # was appended onto the dominant route (RouteID(s)/Measure(s)).”
If the event record is not completely on a single concurrent section (multiple sections or a mix or concurrent/non concurrent sections), split the event at each concurrent section and apply the rules above to determine which route to append each section and provide an info gp message letting the user know “The source event record with OID # was split into # of sections appended onto the following dominant routes (list of RouteID(s)/Measure(s) for each section).”

## Slide 4 — Testing

Test on point and line events
It shouldn’t matter whether pipeline or roads data is used
Test the following scenarios:

  - Source event is on a single concurrent section and the source RouteID is the dominant route
  - Source event is on a single concurrent section and the source RouteID is on a non-dominant route
  - Source event is not on a single concurrent section and the source RouteIDs are all on the dominant routes
  - Source event is not on a single concurrent section and the source RouteIDs are on a mix of dominant and non dominant routes
  - Source event is not on a mix of concurrent and non concurrent sections

## Slide 5 — Automation

Add automation following the same pattern for other GP tools.

## Slide 6 — Documentation

Update the documentation for the gp tool.  Add usage notes about what this parameter does and how it will choose the route/measure of the dominant route when there is a concurrency.

## Slide 7 — Assignment

Story Points:
Dev:
PE:
