# Merge Coincident Option in Add Events tools in Pro

| Field | Value |
| --- | --- |
| **Doc** | 663 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [MergeCoincidentOptionEventEditingPro.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/MergeCoincidentOptionEventEditingPro.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2022-06-01 16:31 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | event editing · merge coincident events · add events tools · measure overlap · time range · event segmentation · lrs editor |
| **Tools** | Add Line · Add Multiple Line · LRS Apply Edits |

## Summary

Describes a user story for LRS Editors needing the capability to merge newly created coincident events in the Add Events tools in ArcGIS Pro to reduce excessive segmentation in event layers. Details the merge option behavior considering measure and time overlaps, testing scenarios, automation additions, and documentation updates.

## Related documents

<!-- related:begin -->
- [Retire Overlaps Option in Add Events tools in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/retire-overlaps-option-in-add-events-tools-in-pro.md>) — similar text 0.47 · 5 title words · 4 filename words · same kind/surface/folder <!-- rel:664 s=7.904 -->
- [Merge coincident option in DynSeg tool in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/merge-coincident-option-in-dynseg-tool-in-pro.md>) — similar text 0.39 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:604 s=6.186 -->
- [Add Event Intersection Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-event-intersection-offset-method.md>) — similar text 0.18 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:679 s=4.481 -->
- [Add Multiple Line Events tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-multiple-line-events-tool-in-pro.md>) — similar text 0.23 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:686 s=4.284 -->
- [Add Multiple Point Events tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-multiple-point-events-tool-in-pro.md>) — similar text 0.22 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:685 s=4.117 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html)

_No page matched:_ [Add Line](https://www.google.com/search?q=%22Add%20Line%22+site%3Adoc.esri.com) · [Add Multiple Line](https://www.google.com/search?q=%22Add%20Multiple%20Line%22+site%3Adoc.esri.com) · [LRS Apply Edits](https://www.google.com/search?q=%22LRS%20Apply%20Edits%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Merge Coincident Option in Add Events tools in Pro <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Editor, I need the capability for coincident events to newly created events to be merged in the Add Events tools in Pro, so that I don’t have excessive segmentation within any event layer.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. For many users, they need the ability for newly created events to merge with any existing coincident events to ensure there isn’t unnecessary segmentation on any of their event layers.  This also keeps the number of event records to a minimum.

## Acceptance Criteria
### Merge Coincident Option <!-- slide 3 -->
- In the Add Line and Add Multiple Line tools, add an option to “Merge Coincident Events”
- If the option is selected, for any new event(s) added via the tools, mark the allowMerge option in the LRS Apply Edits endpoint to true
- Enhance the allowMerge option in the endpoint to not only consider measures and non-LRS attributes, but also consider time ranges when determining whether to merge or not (next slide has example scenarios to consider).
- If there is a time overlap, then the merge should go through.
- If the time range of the new event and the event to be merged don’t overlap, then don’t merge them.

![Figure 1 — Merge Coincident Option](../media/merge-coincident-option-in-add-events-tools-in-pro/fig-01-slide-03-merge-coincident-option.png)

### Merge Coincident Option <!-- slide 4 -->
| Event | From Measure | To Measure | From Date | To Date | Non LRS attribute |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 5 | 2000 | 2010 | True |
| 2 | 10 | 15 | 2015 | null | True |

Existing Events

| Event | From Measure | To Measure | From Date | To Date | Non LRS attribute |
| --- | --- | --- | --- | --- | --- |
| 3 | 5 | 10 | 2015 | null | True |

Newly Added Event

| Event | From Measure | To Measure | From Date | To Date | Non LRS attribute |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 5 | 2000 | 2010 | True |
| 4 | 5 | 15 | 2015 | null | True |

After New Event is Added

### Merge Coincident Option <!-- slide 5 -->
| Event | From Measure | To Measure | From Date | To Date | Non LRS attribute |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 5 | 2000 | 2010 | True |
| 2 | 10 | 15 | 2015 | null | True |

Existing Events

| Event | From Measure | To Measure | From Date | To Date | Non LRS attribute |
| --- | --- | --- | --- | --- | --- |
| 3 | 15 | 20 | 2010 | null | True |

Newly Added Event

| Event | From Measure | To Measure | From Date | To Date | Non LRS attribute |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 5 | 2000 | 2010 | True |
| 4 | 15 | 20 | 2010 | 2015 | True |
| 5 | 10 | 20 | 2015 | null | True |

After New Event is Added

## Testing
<!-- slide 6 -->
- Test with a mix or RH and APR data
- Test with and without events that span routes
- Test with measure overlaps in the same time range as well as measure overlaps in different time ranges
- Test with at least one scenario where there are coincident events both upstream and downstream of the newly created event (both should merge)
- Verify in both REST (since the parameter enhanced) as well as in the UI
- Test on a variety of route shapes to verify the events are merged correctly:
  - Normal
  - Gapped
  - Loop
  - Lollipops
  - Alpha
  - Branch
  - Vertical

## Automation
<!-- slide 7 -->
- Add 1-2 new cases to the existing automation in LRS Apply Edits to cover the time overlaps scenarios

## Documentation
<!-- slide 8 -->
- Add steps related to this option in the topics for Add Line and Add Multiple Line
- Make sure to discuss what checking the option would do in related to existing events being merged with the newly created event (feel free to use the Event Editor doc as a guide)

## Assignment
<!-- slide 9 -->
Story Points:
Dev:
PE:
