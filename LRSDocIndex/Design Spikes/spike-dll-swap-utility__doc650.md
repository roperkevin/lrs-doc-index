# Spike: DLL Swap Utility

|   |   |
| --- | --- |
| **Kind** | Design Spike · Pro |
| **Release** | — |
| **Product** | Utility Network |
| **Source** | [Spike DLL Swap Utility.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20DLL%20Swap%20Utility.pptx>) |
| **Edited** | 2022-07-29 23:12 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: DLL Swap Utility"
source_file: "Spike DLL Swap Utility.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20DLL%20Swap%20Utility.pptx"
doc_id: 650
doc_kind: "Design Spike"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2022-07-29T23:12:58Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["dll swap utility", "dll swapping", "pro dll swapping", "server dll swapping", "testing tools", "devtopia"]
tools: []
products: ["Utility Network"]
issues: []
related: [{"doc":518,"file":"spike-64-bit-oid-in-lrs-gp-and-pro-tools__doc518.md","s":1.956},{"doc":391,"file":"spike-performance-improvement-prioritization__doc391.md","s":1.917},{"doc":501,"file":"64-bit-oid-in-other-lrs-pro-tools__doc501.md","s":1.378},{"doc":568,"file":"fixing-tools-and-functionalities-affected-by-releasing-unique-rid-name-check-in__doc568.md","s":1.333},{"doc":43,"file":"linear-referencing-gp-toolbox-consolidation__doc43.md","s":1.324}]
```
-->

## Summary

Evaluation of two DLL Swap Utility tools from the Utility Network and Topo teams to determine the best fit for Pro and Server DLL swapping in testing. The goal is to adapt and convert the preferred tool for Server DLL swapping and provide a demonstration and process guidance for team adoption within Devtopia.

## Related documents

<!-- related:begin -->
- [Spike: 64-bit OID in LRS GP and Pro Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-64-bit-oid-in-lrs-gp-and-pro-tools__doc518.md>) — similar text 0.06 · same kind/surface/folder <!-- rel:518 -->
- [Spike: Performance Improvement Prioritization](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-performance-improvement-prioritization__doc391.md>) — similar text 0.04 · same kind/surface/folder <!-- rel:391 -->
- [64-bit OID in other LRS Pro tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-other-lrs-pro-tools__doc501.md>) — similar text 0.03 · same surface/folder <!-- rel:501 -->
- [Fixing Tools and Functionalities Affected by Releasing Unique Rid/Name Check in Reassign](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/fixing-tools-and-functionalities-affected-by-releasing-unique-rid-name-check-in__doc568.md>) — similar text 0.02 · same surface/folder <!-- rel:568 -->
- [Linear Referencing GP Toolbox Consolidation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/linear-referencing-gp-toolbox-consolidation__doc43.md>) — similar text 0.01 · same surface/folder <!-- rel:43 -->
<!-- related:end -->

---

## Slide 1 — Spike: DLL Swap Utility

Spike

## Slide 2 — DLL Swap Utility

Investigate the two different DLL Swap Utility tools provided to the team (one from the Utility Network team and the other from the Topo team)
Determine which utility will work best for the team when we adopt Pro DLL swapping for testing
Also determine which of the tools can best be adapted to work with Server DLL swapping for testing
Convert whichever tools works best to support Server DLL swapping
Provide a demo to the team that shows how to swap DLLs (both Pro and Server) for a given issue
Provide any process changes needed to support utilizing this tool(s) within Devtopia (ex. Do we need to put the DLLs in a certain location, provide some sort of keyword in a comment, etc.)

## Slide 3 — Assignment

Story Points:
Dev:
