# Update Intersection Referent Tool User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [UpdateIntersectionReferents.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/UpdateIntersectionReferents.pptx>) |
| **Edited** | 2021-09-03 15:00 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Update Intersection Referent Tool User Story"
source_file: "UpdateIntersectionReferents.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/UpdateIntersectionReferents.pptx"
doc_id: 696
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2021-09-03T15:00:47Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["intersection", "referent", "event", "update intersection", "referent method", "lrs event", "python script"]
tools: []
products: ["Roads & Highways"]
issues: []
related: [{"doc":843,"file":"lrs-intersection-properties-user-story__doc843.md","s":3.742},{"doc":678,"file":"related-table-for-intersection-measures__doc678.md","s":3.601},{"doc":697,"file":"add-intermediate-calibration-points-to-loops-in-routes__doc697.md","s":3.082},{"doc":393,"file":"allow-lrs-events-and-intersections-in-update-measures-from-lrs-tool__doc393.md","s":2.863},{"doc":737,"file":"support-honoring-referents-event-behavior-for-cartographic-realignment__doc737.md","s":2.851}]
```
-->

## Summary

This document describes a user story for a tool to update intersectionIDs for referents on LRS events to maintain honor referent event behavior in ArcGIS Pro. It outlines the requirements for a Python script to update referent methods and locations from old to new LRS Intersection feature classes, including parameters, error handling, and output reporting. Testing scenarios and documentation plans are also included.

## Related documents

<!-- related:begin -->
- [LRS Intersection Properties User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-intersection-properties-user-story__doc843.md>) — similar text 0.11 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:843 -->
- [Related Table for Intersection Measures](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/related-table-for-intersection-measures__doc678.md>) — similar text 0.27 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:678 -->
- [Add Intermediate Calibration Points to Loops in Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-intermediate-calibration-points-to-loops-in-routes__doc697.md>) — similar text 0.40 · same kind/surface/folder <!-- rel:697 -->
- [Allow LRS Events and Intersections in Update Measures from LRS tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-lrs-events-and-intersections-in-update-measures-from-lrs-tool__doc393.md>) — similar text 0.18 · 1 title word · same kind/surface/folder <!-- rel:393 -->
- [Support honoring referents event behavior for cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-honoring-referents-event-behavior-for-cartographic-realignment__doc737.md>) — similar text 0.29 · same kind/surface/folder <!-- rel:737 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-intersection-properties.html) · [Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/storing-referent-and-offset-information-for-event-location.html) · [View LRS event properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-event-properties.html)
<!-- docs:end -->

---

## Slide 1 — Update intersection referent tool

User Story

## Slide 2 — User Story

As a LRS Editor, I want to update the intersectionID for any referents on LRS events, so that I can continue to utilize the honor referent event behavior in ArcGIS Pro.
Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  For some DoTs, they have modeled referents on their LRS events and utilize intersections as those referents for the event records.  When migrating from ArcMap to Pro, these DoTs will need to recreate their intersections which will result in a new intersectionID. They need a tool to update the intersectionIDs in their referents, so they can continue to use them for the honor referent event behavior in Pro.

## Slide 3 — Update Intersection Referents

Create a python script that users can execute to update their referents on events that are intersections:

  - Identify any event records with a Referent Method as the old LRS Intersection feature class
  - For each record with an old LRS Intersection as the Referent Method, use the old IntersectionID to find the new LRS Intersection present at the same location
  - For the event record, update the Referent Method to the new LRS Intersection feature class and the Referent Location to the new IntersectionID
The parameters for the tool should be the following:

  - Old LRS Intersection feature class (should be populated and in the LRS gdb and still associated with the LRS, otherwise throw an error)
  - New LRS Intersection feature class (should be populated and in the LRS gdb and associated with the LRS, otherwise throw an error)
  - LRS Event feature classes (should support being able to select more than one feature class to be updated; each feature class selected should be an LRS event in the LRS gdb of the intersections and have referents enabled, otherwise throw an error)
The tool should support only feature classes, not feature layers or layers from a service
The LRS gdb with the intersections and events can be a file gdb, traditional versioned sde, or branch versioned sde, but must have the LRS Controller Dataset present
Note this tool will be designed to be run after Modify LRS is run, the new LRS Intersections have been registered and generated, but before the old LRS Intersections are removed from being part of the LRS
Provide a text file that lets users know the OIDs of the event features in each LRS event that are updated.  Include the old IntersectionID and the new IntersectionID in case the user wants to spot check what was updated.
Include the OIDs of any event records that couldn’t be updated that had Intersections as the Referent Method in the text file
The tool won’t be included with ArcGIS Pro, but instead will be released independent of Pro to support users making the transition from ArcMap to Pro

## Slide 4 — Testing

Test with Roads and Highways data from ArcMap (no controller dataset) (tool should fail)
Test with Roads and Highways data ArcGIS Pro (with controller dataset)
Test with old and new LRS Intersection feature classes that aren’t part of the LRS (tool should fail)
Test with LRS events that don’t have referents (tool should fail)
Test with LRS events that have referents, but none of the referents use LRS Intersections as the method (tool should run, but nothing will be updated)
Test a case where there is an intersection in the Referent Location that exists in the old intersection feature class but doesn’t have a corresponding intersection in the new intersection feature class (tool should run and message will be provided in text file output)

## Slide 5 — Documentation

Once PE complete, work with Nathan to document the tool and get it released publicly to users
The tool will also need to be included in the ArcMap to Pro migration document

## Slide 6 — Assignment

Story Points:
Dev:
PE:
