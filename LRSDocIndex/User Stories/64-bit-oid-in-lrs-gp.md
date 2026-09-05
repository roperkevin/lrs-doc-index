# 64-bit OID in LRS GP tools

| Field | Value |
| --- | --- |
| **Doc** | 505 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [64bitOIDLRSGP.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/64bitOIDLRSGP.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2023-09-07 23:31 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | 64 bit oid · gp tools · lrs editor · schema · testing · automation |
| **Tools** | — |

## Summary

This document describes a user story for ensuring 64-bit values in the Object ID (OID) field are supported in Linear Referencing System (LRS) geoprocessing (GP) tools. It outlines the need to remove down casting for 64-bit OIDs, testing requirements across tools and connection types, and plans for automated testing. No documentation updates are required.

## Related documents

<!-- related:begin -->
- [64-bit OID in other LRS Pro tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-other-lrs-pro-tools.md>) — similar text 0.87 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:501 s=6.66 -->
- [64-bit OID in LRS Event Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-event-editing-tools.md>) — similar text 0.88 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:504 s=6.291 -->
- [64-bit OID in LRS Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-route-editing-tools.md>) — similar text 0.86 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:502 s=6.077 -->
- [64-bit OID in LRS REST operations](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-rest-operations.md>) — similar text 0.83 · 2 title words · 1 filename word · same folder <!-- rel:503 s=5.588 -->
- [Spike: 64-bit OID in LRS GP and Pro Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-gp-and-pro-tools.md>) — similar text 0.40 · 3 title words · 2 filename words · same surface/folder <!-- rel:518 s=5.112 -->
<!-- related:end -->

---

## Story
### 64-bit OID in LRS GP tools <!-- slide 1 -->
Spike

### User Story <!-- slide 2 -->
As an LRS editor, I need to ensure 64-bit values in my OID field work in the LRS GP tools, so that I can continue to utilize these various operations in my LRS.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  As the size of the LRS and the number of edits grows over time, users will encounter 64-bit values for their OIDs.  We need to ensure the software correctly handles these in the LRS GP tools.

## Acceptance Criteria
### 64-bit OID LRS GP <!-- slide 3 -->
- Remove any down casting implemented for 64bit OIDs in the LRS GP tools to support actual 64-bit values in the schema items updated by the tools
- Skip the configuration tools where we create the schema items (but do test the …from Existing Dataset tools)

## Testing
<!-- slide 4 -->
- Test on each tool (breadth, not depth)
- Test tools that can be run against both direct connect and feature services both ways
- Ensure all schema elements impacted by each operation has a 64-bit OID value

## Automation
<!-- slide 5 -->
- Create an automated test (ex. 64-bit OID GP tools) that automates one test case for each GP tool

## Documentation
<!-- slide 6 -->
- No documentation updates for this story

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
