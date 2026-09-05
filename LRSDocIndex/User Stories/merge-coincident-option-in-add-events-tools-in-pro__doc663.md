# Merge Coincident Option in Add Events tools in Pro

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [MergeCoincidentOptionEventEditingPro.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/MergeCoincidentOptionEventEditingPro.pptx>) |
| **Edited** | 2022-06-01 16:31 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Merge Coincident Option in Add Events tools in Pro"
source_file: "MergeCoincidentOptionEventEditingPro.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/MergeCoincidentOptionEventEditingPro.pptx"
doc_id: 663
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2022-06-01T16:31:18Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["event editing", "merge coincident events", "add events tools", "measure overlap", "time range", "event segmentation", "lrs editor"]
tools: ["Add Line", "Add Multiple Line", "LRS Apply Edits"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":664,"file":"retire-overlaps-option-in-add-events-tools-in-pro__doc664.md","s":7.904},{"doc":604,"file":"merge-coincident-option-in-dynseg-tool-in-pro__doc604.md","s":6.186},{"doc":679,"file":"add-event-intersection-offset-method__doc679.md","s":4.481},{"doc":686,"file":"add-multiple-line-events-tool-in-arcgis-pro__doc686.md","s":4.284},{"doc":685,"file":"add-multiple-point-events-tool-in-arcgis-pro__doc685.md","s":4.117}]
```
-->

## Summary

Describes a user story for LRS Editors needing the capability to merge newly created coincident events in the Add Events tools in ArcGIS Pro to reduce excessive segmentation in event layers. Details the merge option behavior considering measure and time overlaps, testing scenarios, automation additions, and documentation updates.

## Related documents

<!-- related:begin -->
- [Retire Overlaps Option in Add Events tools in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/retire-overlaps-option-in-add-events-tools-in-pro__doc664.md>) — similar text 0.47 · 5 title words · 4 filename words · same kind/surface/folder <!-- rel:664 -->
- [Merge coincident option in DynSeg tool in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/merge-coincident-option-in-dynseg-tool-in-pro__doc604.md>) — similar text 0.39 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:604 -->
- [Add Event Intersection Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-event-intersection-offset-method__doc679.md>) — similar text 0.18 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:679 -->
- [Add Multiple Line Events tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-multiple-line-events-tool-in-arcgis-pro__doc686.md>) — similar text 0.23 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:686 -->
- [Add Multiple Point Events tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-multiple-point-events-tool-in-arcgis-pro__doc685.md>) — similar text 0.22 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:685 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html)

_No page matched:_ [Add Line](https://www.google.com/search?q=%22Add%20Line%22+site%3Adoc.esri.com) · [Add Multiple Line](https://www.google.com/search?q=%22Add%20Multiple%20Line%22+site%3Adoc.esri.com) · [LRS Apply Edits](https://www.google.com/search?q=%22LRS%20Apply%20Edits%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Merge Coincident Option in Add Events tools in Pro

User Story

## Slide 2 — User Story

As an LRS Editor, I need the capability for coincident events to newly created events to be merged in the Add Events tools in Pro, so that I don’t have excessive segmentation within any event layer.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. For many users, they need the ability for newly created events to merge with any existing coincident events to ensure there isn’t unnecessary segmentation on any of their event layers.  This also keeps the number of event records to a minimum.

## Slide 3 — Merge Coincident Option

![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc244_slide3.svg)

In the Add Line and Add Multiple Line tools, add an option to “Merge Coincident Events”
If the option is selected, for any new event(s) added via the tools, mark the allowMerge option in the LRS Apply Edits endpoint to true
Enhance the allowMerge option in the endpoint to not only consider measures and non-LRS attributes, but also consider time ranges when determining whether to merge or not (next slide has example scenarios to consider).
If there is a time overlap, then the merge should go through.
If the time range of the new event and the event to be merged don’t overlap, then don’t merge them.

![image1.png](../media/doc244_image1.png)

## Slide 4 — Merge Coincident Option

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 2.5: event E1 as 0–2.5 and 2.5–5.](../media/doc244_slide4_fig2.svg)

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 0 to 5, before the split at measure 2.5.](../media/doc244_slide4_fig1.svg)

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

## Slide 5 — Merge Coincident Option

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 2.5: event E1 as 0–2.5 and 2.5–5.](../media/doc244_slide5_fig2.svg)

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 0 to 5, before the split at measure 2.5.](../media/doc244_slide5_fig1.svg)

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

## Slide 6 — Testing

Test with a mix or RH and APR data
Test with and without events that span routes
Test with measure overlaps in the same time range as well as measure overlaps in different time ranges
Test with at least one scenario where there are coincident events both upstream and downstream of the newly created event (both should merge)
Verify in both REST (since the parameter enhanced) as well as in the UI
Test on a variety of route shapes to verify the events are merged correctly:

  - Normal
  - Gapped
  - Loop
  - Lollipops
  - Alpha
  - Branch
  - Vertical

## Slide 7 — Automation

Add 1-2 new cases to the existing automation in LRS Apply Edits to cover the time overlaps scenarios

## Slide 8 — Documentation

Add steps related to this option in the topics for Add Line and Add Multiple Line
Make sure to discuss what checking the option would do in related to existing events being merged with the newly created event (feel free to use the Event Editor doc as a guide)

## Slide 9 — Assignment

Story Points:
Dev:
PE:
