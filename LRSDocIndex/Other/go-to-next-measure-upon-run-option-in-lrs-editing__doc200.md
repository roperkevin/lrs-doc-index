# Go to Next Measure Upon Run Option in LRS Editing

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Source** | [Note_to_add.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6463_Go%20to%20next%20measure%20upon%20run/Note_to_add.docx>) |
| **Edited** | 2025-03-10 21:19 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Go to Next Measure Upon Run Option in LRS Editing"
source_file: "Note_to_add.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6463_Go%20to%20next%20measure%20upon%20run/Note_to_add.docx"
doc_id: 200
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Kyle Chin"
last_edited_by: ""
last_edited: "2025-03-10T21:19:22.2275989Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["measure", "edit", "line event", "from method", "to method", "location offset", "coordinates"]
tools: []
products: []
issues: []
related: [{"doc":214,"file":"add-line-event-tools-continue-from-previous-measure-option-test-plan__doc214.md","s":3.883},{"doc":225,"file":"add-line-event-tools-continue-from-previous-measure-option-test-plan__doc225.md","s":3.882},{"doc":270,"file":"add-line-event-go-to-next-measure-on-save-option__doc270.md","s":3.587},{"doc":123,"file":"replace-events__doc123.md","s":2.845},{"doc":122,"file":"replace-events__doc122.md","s":2.8}]
```
-->

## Summary

Describes the functionality of the 'Go to next measure upon run' option in linear referencing editing. This option allows the next edit to start at the end measure location of the previous edit, carrying over the To Method information as the From Method for the next edit. An example illustrates how coordinate methods are transferred between edits when adding line events.

## Related documents

<!-- related:begin -->
- [Add Line Event Tools: Continue from Previous Measure Option Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-line-event-tools-continue-from-previous-measure-option-test-plan__doc214.md>) — similar text 0.30 · 2 title words · same surface <!-- rel:214 -->
- [Add Line Event Tools: Continue from Previous Measure Option Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-line-event-tools-continue-from-previous-measure-option-test-plan__doc225.md>) — similar text 0.30 · 2 title words · same surface <!-- rel:225 -->
- [Add Line Event Go To Next Measure on Save option](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-go-to-next-measure-on-save-option__doc270.md>) — similar text 0.29 · 3 title words · 1 filename word · same surface <!-- rel:270 -->
- [Replace Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/replace-events__doc123.md>) — similar text 0.15 · same kind/surface <!-- rel:123 -->
- [Replace Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/replace-events__doc122.md>) — similar text 0.13 · same kind/surface <!-- rel:122 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/edit-feature-services.html) · [Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html)
<!-- docs:end -->

---

Note:
Enable the Go to next measure upon run option to start your next edit at the To Location end measure location of the previous edit. The To Method and its populated information from the previous edit will carry over into the next edit as the From Method and its populated information.

For example, if you use a From Method of Location Offset and a To Method of Coordinates to add a line event, enabling this option would start your next edit with a From and To Method of Coordinates with the Ccoordinates information from the previous edit in the From: Coordinates section.
