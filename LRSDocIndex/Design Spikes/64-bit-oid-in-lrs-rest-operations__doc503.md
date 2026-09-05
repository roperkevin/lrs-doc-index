# 64-bit OID in LRS REST operations

|   |   |
| --- | --- |
| **Kind** | Design Spike · Server |
| **Release** | — |
| **Source** | [64bitOIDLRSREST.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/64bitOIDLRSREST.pptx>) |
| **Edited** | 2023-09-07 23:18 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "64-bit OID in LRS REST operations"
source_file: "64bitOIDLRSREST.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/64bitOIDLRSREST.pptx"
doc_id: 503
doc_kind: "Design Spike"
surface: "Server"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2023-09-07T23:18:32Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["64 bit oid", "rest operations", "lrs editor", "schema", "testing", "automation"]
tools: []
products: []
issues: []
related: [{"doc":520,"file":"spike-64-bit-oid-in-lrs-rest__doc520.md","s":6.334},{"doc":501,"file":"64-bit-oid-in-other-lrs-pro-tools__doc501.md","s":5.602},{"doc":505,"file":"64-bit-oid-in-lrs-gp-tools__doc505.md","s":5.562},{"doc":504,"file":"64-bit-oid-in-lrs-event-editing-tools__doc504.md","s":4.631},{"doc":502,"file":"64-bit-oid-in-lrs-route-editing-tools__doc502.md","s":4.574}]
```
-->

## Summary

This document addresses the need to support 64-bit values in the Object ID (OID) field within LRS REST operations. It outlines the removal of down casting for 64-bit OIDs in schema items updated by tools, specifies testing breadth across operations, and calls for automated testing of each REST operation with 64-bit OID values. Documentation updates are not required for this story.

## Related documents

<!-- related:begin -->
- [Spike: 64-bit OID in LRS REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-64-bit-oid-in-lrs-rest__doc520.md>) — similar text 0.44 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:520 -->
- [64-bit OID in other LRS Pro tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-other-lrs-pro-tools__doc501.md>) — similar text 0.81 · 2 title words · 1 filename word · same folder <!-- rel:501 -->
- [64-bit OID in LRS GP tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/64-bit-oid-in-lrs-gp-tools__doc505.md>) — similar text 0.83 · 2 title words · 1 filename word · same folder <!-- rel:505 -->
- [64-bit OID in LRS Event Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-event-editing-tools__doc504.md>) — similar text 0.79 · 2 title words · 1 filename word · same folder <!-- rel:504 -->
- [64-bit OID in LRS Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-route-editing-tools__doc502.md>) — similar text 0.78 · 2 title words · 1 filename word · same folder <!-- rel:502 -->
<!-- related:end -->

---

## Slide 1 — 64-bit OID in LRS REST operations

Spike

## Slide 2 — User Story

As an LRS editor, I need to ensure 64-bit values in my OID field work in the LRS REST operations, so that I can continue to utilize these various operations in my LRS.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  As the size of the LRS and the number of edits grows over time, users will encounter 64-bit values for their OIDs.  We need to ensure the software correctly handles these in the LRS REST operations.

## Slide 3 — 64-bit OID LRS REST operations

Remove any down casting implemented for 64bit OIDs in the LRS REST operations to support actual 64-bit values in the schema items updated by the tools
Don’t worry about Server GP toolbox tools, that’s a different user story
Don’t worry about LRS applyEdits as that will be covered by the Route Editing story
Don’t worry about the versioning operations as they’ve been deprecated

## Slide 4 — Testing

Test on each operation (breadth, not depth)
Ensure all schema elements impacted by each operation has a 64-bit OID value

## Slide 5 — Automation

Create an automated test (ex. 64-bit OID REST operation) that automates one test case for each REST operation

## Slide 6 — Documentation

No documentation updates for this story

## Slide 7 — Assignment

Story Points:
Dev:
