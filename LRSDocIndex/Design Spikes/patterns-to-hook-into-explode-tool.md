# Spike: Patterns to hook into Explode tool

| Field | Value |
| --- | --- |
| **Doc** | 825 · Design Spike · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike Patterns to hook into Explode.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Patterns%20to%20hook%20into%20Explode.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2020-04-01 16:30 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | explode · centerline · centerline sequence · apply edits · hooking pattern |
| **Tools** | Explode |

## Summary

Investigation of the explode tool's request pattern through core Apply Edits to determine if it follows the same pattern as the split tool for hooking into requests. The goal is to find the best method to implement logic for updating centerline and centerline sequence when the explode tool is called, including whether coordination with the editing team is needed.

## Related documents

<!-- related:begin -->
- [Support updating CL/CLS when using explode operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-cl-cls-when-using-explode-operation.md>) — similar text 0.32 · 1 title word · 1 filename word · same surface/folder <!-- rel:829 s=3.448 -->
- [Support LRS Explode Operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-lrs-explode-operation.md>) — similar text 0.31 · 1 title word · 1 filename word · same surface/folder <!-- rel:813 s=3.412 -->
- [Support Conflict Prevention on LRS Explode Operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-conflict-prevention-on-lrs-explode-operation.md>) — similar text 0.20 · 1 title word · 1 filename word · same surface/folder <!-- rel:815 s=3.245 -->
- [Explode multipart centerlines in editing activities and Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/explode-multipart-centerlines-in-editing-activities.md>) — similar text 0.21 · 1 title word · 1 filename word · same surface/folder <!-- rel:817 s=3.115 -->
- [LRS in GCS: In-memory only Densification](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/5415-lrs-in-gcs-in-memory-only-densification.md>) — similar text 0.03 · same surface/folder <!-- rel:485 s=1.552 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View centerline sequence table properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-centerline-sequence-table-properties.html)

_No page matched:_ [Explode](https://www.google.com/search?q=%22Explode%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Patterns to hook into Explode tool

Spike

## Slide 2 — Hook into the explode tool

- Investigate the explode tool and how the request is sent through core Apply Edits
  - Does it follow the same pattern as the split where we can see the request was made and hook into it?
  - Does it follow a different pattern (add, update, delete with no hint about explode for example)?  If so, can we hook into it so we can add out logic to update centerline/centerline sequence when the tool is called?
  - Will we need to make a request to the editing, or other, team to get a better hook like we did for split?
- Provide your findings with a suggestion for the best method to implement our logic to update centerline/centerline sequence.

## Slide 3 — Assignment

Story Points:
Dev:
