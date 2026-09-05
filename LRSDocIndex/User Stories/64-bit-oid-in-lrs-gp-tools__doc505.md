# 64-bit OID in LRS GP tools

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [64bitOIDLRSGP.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/64bitOIDLRSGP.pptx>) |
| **Edited** | 2023-09-07 23:31 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "64-bit OID in LRS GP tools"
source_file: "64bitOIDLRSGP.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/64bitOIDLRSGP.pptx"
doc_id: 505
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2023-09-07T23:31:37Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["64 bit oid", "gp tools", "lrs editor", "schema", "testing", "automation"]
tools: []
products: []
issues: []
related: [{"doc":501,"file":"64-bit-oid-in-other-lrs-pro-tools__doc501.md","s":6.66},{"doc":504,"file":"64-bit-oid-in-lrs-event-editing-tools__doc504.md","s":6.291},{"doc":502,"file":"64-bit-oid-in-lrs-route-editing-tools__doc502.md","s":6.077},{"doc":503,"file":"64-bit-oid-in-lrs-rest-operations__doc503.md","s":5.588},{"doc":518,"file":"spike-64-bit-oid-in-lrs-gp-and-pro-tools__doc518.md","s":5.112}]
```
-->

## Summary

This document describes a user story for ensuring 64-bit values in the Object ID (OID) field are supported in Linear Referencing System (LRS) geoprocessing (GP) tools. It outlines the need to remove down casting for 64-bit OIDs, testing requirements across tools and connection types, and plans for automated testing. No documentation updates are required.

## Related documents

<!-- related:begin -->
- [64-bit OID in other LRS Pro tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-other-lrs-pro-tools__doc501.md>) — similar text 0.87 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:501 -->
- [64-bit OID in LRS Event Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-event-editing-tools__doc504.md>) — similar text 0.88 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:504 -->
- [64-bit OID in LRS Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-route-editing-tools__doc502.md>) — similar text 0.86 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:502 -->
- [64-bit OID in LRS REST operations](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-rest-operations__doc503.md>) — similar text 0.83 · 2 title words · 1 filename word · same folder <!-- rel:503 -->
- [Spike: 64-bit OID in LRS GP and Pro Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-64-bit-oid-in-lrs-gp-and-pro-tools__doc518.md>) — similar text 0.40 · 3 title words · 2 filename words · same surface/folder <!-- rel:518 -->
<!-- related:end -->

---

## Slide 1 — 64-bit OID in LRS GP tools

Spike

## Slide 2 — User Story

As an LRS editor, I need to ensure 64-bit values in my OID field work in the LRS GP tools, so that I can continue to utilize these various operations in my LRS.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  As the size of the LRS and the number of edits grows over time, users will encounter 64-bit values for their OIDs.  We need to ensure the software correctly handles these in the LRS GP tools.

## Slide 3 — 64-bit OID LRS GP

Remove any down casting implemented for 64bit OIDs in the LRS GP tools to support actual 64-bit values in the schema items updated by the tools
Skip the configuration tools where we create the schema items (but do test the …from Existing Dataset tools)

## Slide 4 — Testing

Test on each tool (breadth, not depth)
Test tools that can be run against both direct connect and feature services both ways
Ensure all schema elements impacted by each operation has a 64-bit OID value

## Slide 5 — Automation

Create an automated test (ex. 64-bit OID GP tools) that automates one test case for each GP tool

## Slide 6 — Documentation

No documentation updates for this story

## Slide 7 — Assignment

Story Points:
Dev:
