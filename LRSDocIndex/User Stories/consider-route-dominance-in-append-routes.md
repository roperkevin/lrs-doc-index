# Consider Route Dominance in Append Routes

| Field | Value |
| --- | --- |
| **Doc** | 709 · User Story · Pro |
| **Product** | Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [Consider Route Dominance in Append Routes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Consider%20Route%20Dominance%20in%20Append%20Routes.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-05-14 22:31 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | route dominance · append routes · concurrency · event splitting · centerlines · utility network · data loading |
| **Tools** | Append Events |

## Summary

This user story describes the need for a parameter in the Append Events tool to consider route dominance when appending events, ensuring events are appended to the dominant route in concurrent sections. It includes scenarios for handling events on single or multiple concurrent sections and outlines testing and documentation updates.

## Related documents

<!-- related:begin -->
- [Consider concurrencies in Update Measures from LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/consider-concurrencies-in-update-measures-from-lrs.md>) — similar text 0.66 · 1 title word · 3 filename words · same kind/surface/folder <!-- rel:710 s=5.994 -->
- [Append Routes Consider Existing Centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/3004-append-routes-consider-existing-centerlines.md>) — similar text 0.32 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:486 s=5.9 -->
- [Append Routes with existing Utility Network centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-with-existing-un-centerlines.md>) — similar text 0.42 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:741 s=5.218 -->
- [Allow Append Events to Run When Locks Are Present on Impacted Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-append-events-to-run-when-locks-are-present.md>) — similar text 0.28 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:168 s=4.255 -->
- [Consider Route Dominance in Append Events (add method) – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/1488-consider-route-dominance-in-append-events-add-method.md>) — similar text 0.23 · 4 title words · 1 filename word · same surface <!-- rel:279 s=4.009 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Consider Route Dominance in Append Routes <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a LRS data loader, I want to be able to load centerlines first then append routes without creating overlapping centerlines, so I can preserve centerline attributes for my Utility Network pipelines and not have to run the Remove Overlapping Centerlines tool.

Persona
LRS data loader: This user is responsible for initial and supplemental bulk data loading in the LRS.  When a user first adopts the software, they typically oversee or work with a partner to migrate their data into our information model.  Once their organization is in production, this user would be responsible for bulk loading new data as needed (for example a pipeline operator is acquired, or a new subdivision of roads are created). An enhancement users have requested is that we consider route dominance for events that are appended in the Append Events tool.  When data comes in from contractors and field workers, they might not have considered the dominant route when they did the collection.  Considering route dominance during appending will ensure that newly appended events always end up on the dominant route and don’t have to be revisited during preparation for reporting.

## Acceptance Criteria
### Calculate Route Concurrencies <!-- slide 3 -->
- Add a parameter to the Append Events tool to “Append events onto the dominant route where there are concurrencies”
- This parameter would be optional and placed last in the list of parameters for the tool
- If this option is enabled when the tool is run, all records being appended should be checked against the routes they’re being appended onto to ensure they’re on the dominant route
- If an event record is completely on a concurrent section and the RouteID/Measures are on the dominant route, append it
- If an event record is completely on a concurrent section and the RouteID/Measures are on the non-dominant route, determine what route/measure combo is the dominant route and append it onto that route.  Make sure the Route/Measure columns are updated in the target event and provide an info gp message letting the user know “The source event record with OID # was appended onto the dominant route (RouteID(s)/Measure(s)).”
- If the event record is not completely on a single concurrent section (multiple sections or a mix or concurrent/non concurrent sections), split the event at each concurrent section and apply the rules above to determine which route to append each section and provide an info gp message letting the user know “The source event record with OID # was split into # of sections appended onto the following dominant routes (list of RouteID(s)/Measure(s) for each section).”

## Testing
<!-- slide 4 -->
- Test on point, line, and spanning events
- It shouldn’t matter whether pipeline or roads data is used
- Test the following scenarios:
  - Source event is on a single concurrent section and the source RouteID is the dominant route
  - Source event is on a single concurrent section and the source RouteID is on a non-dominant route
  - Source event is not on a single concurrent section and the source RouteIDs are all on the dominant routes
  - Source event is not on a single concurrent section and the source RouteIDs are on a mix of dominant and non dominant routes
  - Source event is not on a mix of concurrent and non concurrent sections

## Automation
<!-- slide 5 -->
Add automation following the same pattern for other GP tools.

## Documentation
<!-- slide 6 -->
Update the documentation for the gp tool.  Add usage notes about what this parameter does and how it can result in splitting of source events.

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
