# Show left and right addresses in LRS Identify

| Field | Value |
| --- | --- |
| **Doc** | 141 · User Story · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExB - Show left and right addresses in LRS Identify.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Show%20left%20and%20right%20addresses%20in%20LRS%20Identify.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2025-08-13 15:58 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | address · route hover · proportional logic · left address · right address · location · event editing |
| **Tools** | LRS Identify · Overlay Events · ADM |

## Summary

This user story describes the need for LRS Editors to see left and right addresses alongside the measure at a location in the LRS Identify widget. It explains the use of proportional logic from Overlay Events and ADM to determine addresses and outlines testing and documentation updates required for this feature.

## Related documents

<!-- related:begin -->
- [Show left and right addresses in LRS Identify](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/show-left-and-right-addresses-in-lrs-identify-2025-08-2.md>) — similar text 0.90 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:144 s=12.893 -->
- [Show left and right addresses on route hover](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/show-left-and-right-addresses-on-route-hover.md>) — similar text 0.83 · 4 title words · 4 filename words · same kind/folder <!-- rel:166 s=11.391 -->
- [Include Site Addresses Layer in Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/include-site-addresses-layer-in-sld.md>) — similar text 0.27 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:181 s=3.442 -->
- [Experience Builder Straight Line Diagram Event Attributes on Hover/Click](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-sld-event-attributes-on-hover-click.md>) — similar text 0.12 · 1 filename word · same kind/surface/folder <!-- rel:348 s=2.803 -->
- [Add Event Intersection Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-event-intersection-offset-method.md>) — similar text 0.23 · same kind/folder <!-- rel:679 s=2.557 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View site address point properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-site-address-point-properties.html) · [Location errors](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/location-errors.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [LRS Identify](https://www.google.com/search?q=%22LRS%20Identify%22+site%3Adoc.esri.com) · [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com) · [ADM](https://www.google.com/search?q=%22ADM%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### ExB : Show left and right addresses in LRS Identify <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Editor, I need the ability to see not just the measure at a location but also the left and right address at that location, so that I can locate new events from the field that come in via this collection method.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. For editors at local governments, the location may be based on addresses instead of coordinates/route+measure.  The ADM tools place address points based on the route location so providing the left and right address alongside the measure at a location along the route will allow them to locate the address correctly along with route characteristics (events) in subsequent steps in the workflow.

## Acceptance Criteria
### Show left and right addresses in LRS Identify <!-- slide 3 -->
- Show the nearest left and right addresses on the route hover popup in LRS Identify
- This option would only be shown if addressing is configured with the LRS
- Utilize the same proportional logic that is used in Overlay Events (and ADM) to determine the left and right addresses at the location
  - Consider utilizing the ADM attribute rule that does this
  - Also remember that we can use the nearest upstream/downstream site address points as well instead of considering the entire block range on the centerline
- In the example to the right, the Right Address would be somewhere between 459 and 463 (most likely 461) the Left Address would be somewhere between 458 and 462 (most likely 460)
- Don’t show the information if the centerline (or event) that has the addressing range information isn’t in the map

![Figure 1 — Show left and right addresses in LRS Identify](../media/show-left-and-right-addresses-in-lrs-identify-2025-08/fig-01-slide-03-show-left-and-right-addresses-in-lrs.png)

## Testing
<!-- slide 4 -->
- Utilize the test plan for the Overlay Events nearest upstream/downstream user story as this scenario should produce the same results
- Utilize the Nashville and New Albany datasets for testing
- Verify results match the LRS Identify and route hover within ArcGIS Pro

## Automation
<!-- slide 5 -->
- No new automation

## Documentation
<!-- slide 6 -->
- Update documentation around addressing to mention this capability in support of editing workflows
- Also update the LRS Identify widget topic to mention this as a result/update screenshot if needed

## Assignment
<!-- slide 7 -->
Story Points:
Dev:  days
PE:  days
