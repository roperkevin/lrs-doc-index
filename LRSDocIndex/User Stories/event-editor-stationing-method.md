# Event Editor Stationing Method User Story

| Field | Value |
| --- | --- |
| **Doc** | 682 · User Story · Enterprise |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [Event Editor Stationing.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Event%20Editor%20Stationing.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2022-02-01 00:26 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | event editor · stationing · route · measure · event creation · location method · lrs editor |
| **Tools** | Add Point Event · Add Linear Event · Event Replacement |

## Summary

Describes a user story for LRS Editors to utilize stationing as a location method when creating new events in the Event Editor. It specifies support for stationing in Add Point Event, Add Linear Event, and Event Replacement tools, compatibility with LRServer endpoints and Pro published services, and validation of stationing event records. Testing scenarios include various route shapes and measure formats.

## Related documents

<!-- related:begin -->
- [Add Line Event Length Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-length-method.md>) — similar text 0.25 · 2 title words · 1 filename word · same kind/folder <!-- rel:269 s=3.745 -->
- [Contingent Values in Event Editor User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/contingent-values-in-event-editor.md>) — similar text 0.20 · 2 title words · same kind/surface/folder <!-- rel:674 s=3.544 -->
- [Add Point Event Point Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-event-point-offset-method.md>) — similar text 0.22 · 2 title words · 1 filename word · same kind/folder <!-- rel:272 s=3.52 -->
- [Add Multiple Point Events tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-multiple-point-events-tool-in-pro.md>) — similar text 0.21 · 1 filename word · same kind/folder <!-- rel:685 s=3.276 -->
- [Add Line Event tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-tool-in-pro.md>) — similar text 0.21 · 1 title word · 1 filename word · same kind/folder <!-- rel:687 s=3.155 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html)

_No page matched:_ [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [Add Linear Event](https://www.google.com/search?q=%22Add%20Linear%20Event%22+site%3Adoc.esri.com) · [Event Replacement](https://www.google.com/search?q=%22Event%20Replacement%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Event Editor stationing method <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Editor, I want to be able to utilize stationing as a location method when I create new events, so that I don’t have to do any translation to get stationing into route and measure.
Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. When these edits come in a stationing format, the event editor wants to utilize stationing as a method in the Add Point/Line widgets within Event Editor utilizing the stationing event points they have in their LRS.

## Acceptance Criteria
### Event Editor Stationing method <!-- slide 3 -->
- In the Add Point Event, Add Linear Event, and Event Replacement tools in Event Editor, support stationing as a method
- Note this method already works with our 10.x endpoints and ArcMap published services, we need to make it also work with our LRServer endpoints and services published using Pro (feel free to use the ArcMap published services as a guide for the Pro published services)
- This method would only appear if a stationing event layer is configured with the LRS
- When this method is selected, a user should select a route then type a stationing measure (we can use the REST endpoints to determine the route and measure)
- We should support measures in station and non station format (ex. 23+45 or 2345)
- Continue to show a marker on the map for the location
- Do support measure translations
- If there is no stationing event record on the route selected, provide an error that the measure is invalid and do not show a marker on the map or let the user complete the edit

## Testing
<!-- slide 4 -->
- Test on two datasets, one with a stationing event configured and one without (for the negative test cases)
- Test with Add Point, Line, and Event Replacement
- Test with both measure formats (with and without stationing +)
- Test by typing the measure and using the measure picker
- Test on the following route shapes
  - Normal
  - Gapped
  - Loop
  - Lollipop
  - Alpha
  - Branch
- No need to worry about other parts of the widget like time, prevent measures not on route, loc errors, etc.

## Automation
<!-- slide 5 -->
No automation

## Documentation
<!-- slide 6 -->
These topics are already documented in our Roads and Highways Enterprise help.  It would be worth revisiting the introduction sections in https://enterprise.arcgis.com/en/roads-highways/latest/event-editor/adding-point-events-by-station-measures.htm and https://enterprise.arcgis.com/en/roads-highways/latest/event-editor/adding-linear-events-by-station-measures.htm to make sure they’re still accurate

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
