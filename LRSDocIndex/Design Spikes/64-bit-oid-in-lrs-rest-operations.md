# 64-bit OID in LRS REST operations

| Field | Value |
| --- | --- |
| **Doc** | 503 · Design Spike · Server |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [64bitOIDLRSREST.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/64bitOIDLRSREST.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2023-09-07 23:18 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | 64 bit oid · rest operations · lrs editor · schema · testing · automation |
| **Tools** | — |

## Summary

This document addresses the need to support 64-bit values in the Object ID (OID) field within LRS REST operations. It outlines the removal of down casting for 64-bit OIDs in schema items updated by tools, specifies testing breadth across operations, and calls for automated testing of each REST operation with 64-bit OID values. Documentation updates are not required for this story.

## Related documents

<!-- related:begin -->
- [Spike: 64-bit OID in LRS REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-rest.md>) — similar text 0.44 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:520 s=6.334 -->
- [64-bit OID in other LRS Pro tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-other-lrs-pro-tools.md>) — similar text 0.81 · 2 title words · 1 filename word · same folder <!-- rel:501 s=5.602 -->
- [64-bit OID in LRS GP tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/64-bit-oid-in-lrs-gp.md>) — similar text 0.83 · 2 title words · 1 filename word · same folder <!-- rel:505 s=5.562 -->
- [64-bit OID in LRS Event Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-event-editing-tools.md>) — similar text 0.79 · 2 title words · 1 filename word · same folder <!-- rel:504 s=4.631 -->
- [64-bit OID in LRS Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-route-editing-tools.md>) — similar text 0.78 · 2 title words · 1 filename word · same folder <!-- rel:502 s=4.574 -->
<!-- related:end -->

---

## Slide 1 — 64-bit OID in LRS REST operations

Spike

## Slide 2 — User Story

As an LRS editor, I need to ensure 64-bit values in my OID field work in the LRS REST operations, so that I can continue to utilize these various operations in my LRS.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  As the size of the LRS and the number of edits grows over time, users will encounter 64-bit values for their OIDs.  We need to ensure the software correctly handles these in the LRS REST operations.

## Slide 3 — 64-bit OID LRS REST operations

- Remove any down casting implemented for 64bit OIDs in the LRS REST operations to support actual 64-bit values in the schema items updated by the tools
- Don’t worry about Server GP toolbox tools, that’s a different user story
- Don’t worry about LRS applyEdits as that will be covered by the Route Editing story
- Don’t worry about the versioning operations as they’ve been deprecated

## Slide 4 — Testing

- Test on each operation (breadth, not depth)
- Ensure all schema elements impacted by each operation has a 64-bit OID value

## Slide 5 — Automation

- Create an automated test (ex. 64-bit OID REST operation) that automates one test case for each REST operation

## Slide 6 — Documentation

- No documentation updates for this story

## Slide 7 — Assignment

Story Points:
Dev:
