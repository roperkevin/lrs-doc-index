# Retire Overlaps Option in Add Events tools in Pro

| Field | Value |
| --- | --- |
| **Doc** | 664 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [RetireOverlapsOptionEventEditingPro.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RetireOverlapsOptionEventEditingPro.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2022-06-01 16:31 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | retire overlaps · add events · event editing · overlapping events · route shapes · retireMeasureOverlap |
| **Tools** | Add Line · Add Multiple Line |

## Summary

Describes a user story for LRS Editors needing an option in the Add Events tools in ArcGIS Pro to automatically retire overlapping events when adding new events. The document outlines the feature, testing scenarios, and documentation updates required.

## Related documents

<!-- related:begin -->
- [Merge Coincident Option in Add Events tools in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/merge-coincident-option-in-add-events-tools-in-pro.md>) — similar text 0.47 · 5 title words · 4 filename words · same kind/surface/folder <!-- rel:663 s=7.904 -->
- [Add Line Event Tools: Retire Overlaps Option Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/3917-add-line-event-tools-retire-overlaps-option.md>) — similar text 0.16 · 5 title words · 3 filename words · same surface <!-- rel:621 s=5.443 -->
- [Conflict Prevention for Event Editing in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-for-event-editing-in-pro.md>) — similar text 0.23 · 1 title word · 3 filename words · same kind/surface/folder <!-- rel:683 s=4.302 -->
- [Add Multiple Line Events tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-multiple-line-events-tool-in-pro.md>) — similar text 0.27 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:686 s=4.213 -->
- [Add Multiple Point Events tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-multiple-point-events-tool-in-pro.md>) — similar text 0.27 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:685 s=4.073 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/retire-routes.html)

_No page matched:_ [Add Line](https://www.google.com/search?q=%22Add%20Line%22+site%3Adoc.esri.com) · [Add Multiple Line](https://www.google.com/search?q=%22Add%20Multiple%20Line%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Retire Overlaps Option in Add Events tools in Pro <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Editor, I need the capability for overlapping events to be retired in the Add Events tools in Pro, so that I can easily add new events without having to manually retire existing events.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. For many users, they need the ability to create new events but have any overlapping events be automatically retired so they don’t have to go manually retire any overlaps created.

## Acceptance Criteria
### Retire Overlaps Option <!-- slide 3 -->
- In the Add Line and Add Multiple Line tools, add an option to “Retire Overlaps”
- If the option is selected, for any new event(s) added via the tools, the “retireMeasureOverlap” parameter in LRS Apply Edits should be marked as true

![Figure 1 — Retire Overlaps Option](../media/retire-overlaps-option-in-add-events-tools-in-pro/fig-01-slide-03-retire-overlaps-option.png)

## Testing
<!-- slide 4 -->
- Test with a mix or RH and APR data
- Test with and without events that span routes
- Test with measure overlaps in the same time range as well as measure overlaps in different time ranges
- No need to test via REST, but do verify the REST request from the Pro UI has the parameter checked as true
- Test on a variety of route shapes to verify the existing events are retired correctly:
  - Normal
  - Gapped
  - Loop
  - Lollipops
  - Alpha
  - Branch
  - Vertical

## Automation
<!-- slide 5 -->
- No new automation

## Documentation
<!-- slide 6 -->
- Add steps related to this option in the topics for Add Line and Add Multiple Line
- Make sure to discuss what checking the option would do in related to existing events at the same location as the newly created event (feel free to use the Event Editor doc as a guide)

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
