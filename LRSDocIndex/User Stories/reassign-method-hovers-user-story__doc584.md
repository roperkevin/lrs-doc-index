# Reassign Method Hovers User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [ReassignUI_MethodsHover.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ReassignUI_MethodsHover.pptx>) |
| **Edited** | 2023-04-05 23:29 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Reassign Method Hovers User Story"
source_file: "ReassignUI_MethodsHover.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ReassignUI_MethodsHover.pptx"
doc_id: 584
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Claire Wang"
last_edited_by: "Claire Wang"
last_edited: "2023-04-05T23:29:38Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["reassign method", "hover", "tooltip", "dropdown", "route editing", "lrs editor", "pro"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":586,"file":"reassign-ui-update-to-support-new-reassign-methods-in-arcgis-pro__doc586.md","s":4.302},{"doc":583,"file":"support-reassign-transfer-as-new-route-s-to-adjacent-line-method-in-arcgis-pro__doc583.md","s":4.149},{"doc":585,"file":"support-reassign-transfer-to-a-new-line-method-in-arcgis-pro__doc585.md","s":4.112},{"doc":100,"file":"pro-ai-assistant-reassign-route-user-story__doc100.md","s":3.714},{"doc":533,"file":"reassign-route-transfer-to-another-line-method-support-move-event-behavior-test__doc533.md","s":3.184}]
```
-->

## Summary

This document describes a user story for adding hover tool-tips to each Reassign method in a dropdown menu within the Pro interface. The hover provides text and optional graphics explaining scenarios achievable by each method to assist LRS editors in selecting the correct method. It includes design notes, testing instructions, and documentation updates.

## Related documents

<!-- related:begin -->
- [Reassign UI Update to Support New Reassign Methods in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/reassign-ui-update-to-support-new-reassign-methods-in-arcgis-pro__doc586.md>) — similar text 0.32 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:586 -->
- [Support Reassign: Transfer as New Route(s) to Adjacent Line Method in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-transfer-as-new-route-s-to-adjacent-line-method-in-arcgis-pro__doc583.md>) — similar text 0.25 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:583 -->
- [Support Reassign: Transfer to a New Line Method in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-transfer-to-a-new-line-method-in-arcgis-pro__doc585.md>) — similar text 0.26 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:585 -->
- [Pro AI Assistant Reassign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-reassign-route-user-story__doc100.md>) — similar text 0.12 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:100 -->
- [Reassign Route Transfer to Another Line Method: Support Move Event Behavior Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/reassign-route-transfer-to-another-line-method-support-move-event-behavior-test__doc533.md>) — similar text 0.13 · 2 title words · 1 filename word · same surface <!-- rel:533 -->
<!-- related:end -->

---

## Slide 1 — Add a hover to each Reassign method in the dropdown (Pro)

User Story

## Slide 2 — User Story

As a LRS editor, I need more details about what can be done in each Reassign method as the method names in the dropdown is generic. I would like to have a hover that contains both text and graphic about the method, that when I hover my cursor on any of the method in the dropdown, I can verify if this method is what I want.

Persona
LRS Editor: This user is responsible for reassigning route(s).  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs). The LRS Editor is responsible for making the route edits based on these documents. As reassign methods are located in a dropdown box and the method names are in relatively short-generic texts, the user eagers more details in a hover about the method without going to look in webhelp. The hover should contain text information about what scenarios can be achieved (any from merge/split/rename/transfer) and associated graphic examples.

## Slide 3 — Reassign method hovers

- Add a tool-tip in a hover format to each Reassign method (5 methods in total)
- Add an icon to each method in the dropdown that links to the corresponding method section in documentation
- When cursor is placed on the method in the dropdown, text and graphics are shown in the hover of the method
  - text lists and briefly explains scenarios can be achieved (any from merge/split/rename/transfer): e.g. what portion of source route(s) are retired; what does target route(s) look like; for the new method, original Rid/name can maintain or not
  - Dev and PE decide the text and graphics
  - Graphics - optional: Dev checks if graphics are allowed in this tool-tip. If so, provide one or many graphics that help explain the scenario(s).
- When cursor is placed on the method name outside of the dropdown, hover box does not show (?)
- Pro window size does not affect hover visibility
- Refer to explore tooltip and the Raster Layer dropdown in Weighted Sum Properties

(an example)

![image1.png](../media/doc358_image1.png) ![image2.png](../media/doc358_image2.png) ![image3.png](../media/doc358_image3.png) ![image4.png](../media/doc358_image4.png) ![image6.jpeg](../media/doc358_image6.jpeg) ![image7.png](../media/doc358_image7.png)

## Slide 4

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 9 fields, 1 row separator, 2 icons, 32 text rows. 17 of 32 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc358_slide4_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 2 panels, 6 fields, 3 row separators, 6 icons, 41 text rows. 26 of 41 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc358_slide4_fig2.svg)

When Line network is chosen
When Continuous network is chosen,
Provide a tooltip (hover) to each method. When user hovers cursor on the method in the dropdown, text and graphics are shown in the hover of the method. Dev and PE design the text and graphics
Provide a tooltip (hover) to each method. When user hovers cursor on the method in the dropdown, text and graphics are shown in the hover of the method. Dev and PE design the text and graphics
7 hovers in total

![image9.png](../media/doc358_image9.png) ![image10.png](../media/doc358_image10.png) ![image11.png](../media/doc358_image11.png) ![image12.png](../media/doc358_image12.png) ![image3.png](../media/doc358_image3.png) ![image4.png](../media/doc358_image4.png)

## Slide 5 — Testing

Test both network types in either APR or RH
Verify the contents in each hover are correct

## Slide 6 — Automation

N/A

## Slide 7 — Documentation

Add a note about the hovered tool-tips for the methods to APR and RH.

  - The note should state the contents in the hover (help links; text explaining scenarios; graphics (if any))
  - Add a sample screenshot in the note

## Slide 8 — Assignment

Story Points:
Dev:
PE:
