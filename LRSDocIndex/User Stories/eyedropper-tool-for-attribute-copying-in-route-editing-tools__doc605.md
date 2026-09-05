# Eyedropper Tool for Attribute Copying in Route Editing Tools

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [Eyedropper tool for Create Route.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Eyedropper%20tool%20for%20Create%20Route.pptx>) |
| **Edited** | 2023-03-01 00:16 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Eyedropper Tool for Attribute Copying in Route Editing Tools"
source_file: "Eyedropper tool for Create Route.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Eyedropper%20tool%20for%20Create%20Route.pptx"
doc_id: 605
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2023-03-01T00:16:40Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["eyedropper tool", "attribute copying", "route editing", "non lrs attributes", "create route", "realign route", "reassign route"]
tools: ["Create Route", "Realign Route", "Reassign Route"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":657,"file":"eyedropper-for-event-tools-user-story__doc657.md","s":4.259},{"doc":609,"file":"flip-centerline-tool-in-memory-flip-user-story__doc609.md","s":3.565},{"doc":601,"file":"flip-centerline-tool-in-memory-flip-user-story__doc601.md","s":3.557},{"doc":826,"file":"conflict-prevention-acquire-locks-when-creating-new-routes-in-create-extend__doc826.md","s":3.342},{"doc":604,"file":"merge-coincident-option-in-dynseg-tool-in-pro__doc604.md","s":3.304}]
```
-->

## Summary

This document describes a user story for adding an eyedropper tool to route editing tools in the LRS. The tool enables LRS editors to quickly copy non-LRS attributes from existing routes to newly created routes in Create, Realign, and Reassign Route tools. It includes testing and automation plans and references documentation for usage.

## Related documents

<!-- related:begin -->
- [Eyedropper for Event tools User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/eyedropper-for-event-tools-user-story__doc657.md>) — similar text 0.20 · 2 title words · 1 filename word · same kind/folder <!-- rel:657 -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/flip-centerline-tool-in-memory-flip-user-story__doc609.md>) — similar text 0.23 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:609 -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/flip-centerline-tool-in-memory-flip-user-story__doc601.md>) — similar text 0.23 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:601 -->
- [Conflict Prevention: Acquire Locks when creating new routes in Create, Extend, Realign, and Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-acquire-locks-when-creating-new-routes-in-create-extend__doc826.md>) — similar text 0.11 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:826 -->
- [Merge coincident option in DynSeg tool in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/merge-coincident-option-in-dynseg-tool-in-pro__doc604.md>) — similar text 0.30 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:604 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-new-route.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/realign-routes.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reassign-routes.html)
<!-- docs:end -->

---

## Slide 1 — Eyedropper tool for attribute copying in route editing tools

User Story

## Slide 2 — User Story

As an LRS editor, I need the ability to quickly copy attributes from existing routes, so that I can quickly and efficiently populate dozens of non LRS attributes on newly created routes.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  As our users in both the transportation and pipeline space begin to model additional non LRS attributes on their LRS Networks, it makes sense to make it simple for them to populate dozens of attributes in as efficient a manner as possible.  Adding the eyedropper tool to Create, Realign, and Reassign Route when new routes are created will allow users to quickly populate the majority of their attributes in a single operation.

## Slide 3 — Eyedropper tool in route editing tools

Add an eyedropper tool to the attributes section for newly created routes in Create, Realign, and Reassign Route tools
The eyedropper should work the same as in the Add Events tools.  When a user clicks the eyedropper, they can click any route on the network and the non-LRS attributes will be copied from the clicked route to the attributes table of the soon to be created route
Follow Pro design standards to place the eyedropper tool in the best location in relation to the Attributes section of the tools

![image1.png](../media/doc331_image1.png)

## Slide 4 — Testing

Test with a mix of APR and RH data
Test with UPDM
Verify the all field types work as well as coded value domains, range domains, and contingent values

## Slide 5 — Automation

Create a UI automation test for each tool

## Slide 6 — Documentation

Mention this button as an option for populating additional field attributes in the Create, Realign, and Reassign Route tool topics
https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/create-a-new-route.htm
https://pro.arcgis.com/en/pro-app/latest/help/production/roads-highways/create-a-new-route.htm
https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/realign-routes.htm
https://pro.arcgis.com/en/pro-app/latest/help/production/roads-highways/realign-routes.htm
https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/reassign-routes.htm
https://pro.arcgis.com/en/pro-app/latest/help/production/roads-highways/reassign-routes.htm

## Slide 7 — Assignment

Story Points:
Dev:
PE:
