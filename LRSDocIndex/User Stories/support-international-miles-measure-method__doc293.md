# Support International Miles Measure Method

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [InternationalMilesMeasureUnit.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/InternationalMilesMeasureUnit.pptx>) |
| **Edited** | 2024-11-13 16:00 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support International Miles Measure Method"
source_file: "InternationalMilesMeasureUnit.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/InternationalMilesMeasureUnit.pptx"
doc_id: 293
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: "Nathan Easley"
last_edited: "2024-11-13T16:00:05Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["international miles", "measure method", "lrs network", "spatial reference units", "location referencing ribbon", "geoprocessing", "experience builder", "event editing"]
tools: ["Create LRS", "Create LRS Network", "Create LRS Network from Existing Dataset", "Enable Referent Fields", "Enable Stationing Fields", "Search by Route", "Identify Routes", "Add Point Event", "Add Line Event", "Split Event", "Merge Event"]
products: []
issues: []
related: [{"doc":271,"file":"support-international-miles-in-lrs__doc271.md","s":7.391},{"doc":115,"file":"regression-testing-task-list-v1__doc115.md","s":3.618},{"doc":178,"file":"experience-builder-support-multiple-lrs-services-in-web-map__doc178.md","s":3.199},{"doc":269,"file":"add-line-event-length-method__doc269.md","s":3.176},{"doc":268,"file":"add-line-events-point-offset-method__doc268.md","s":3.059}]
```
-->

## Summary

This document describes the user story and requirements for supporting International Miles as a measurement method in the Linear Referencing System (LRS). It covers configuration needs across ArcGIS Pro, geoprocessing tools, REST operations, and Experience Builder widgets, as well as testing, automation, and documentation updates.

## Related documents

<!-- related:begin -->
- [Support International Miles in LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-international-miles-in-lrs__doc271.md>) — similar text 0.54 · 3 title words · 2 filename words · same surface <!-- rel:271 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/regression-testing-task-list-v1__doc115.md>) — similar text 0.15 · same surface <!-- rel:115 -->
- [Experience Builder Support Multiple LRS Services in Web Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-support-multiple-lrs-services-in-web-map__doc178.md>) — similar text 0.16 · 1 title word · same kind/folder <!-- rel:178 -->
- [Add Line Event Length Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-length-method__doc269.md>) — similar text 0.22 · 1 title word · same kind/surface/folder <!-- rel:269 -->
- [Add Line Events Point Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-events-point-offset-method__doc268.md>) — similar text 0.18 · 1 title word · same kind/surface/folder <!-- rel:268 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create and modify an LRS](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-and-modify-an-lrs.html) · [Create and modify an LRS Network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-and-modify-an-lrs-network.html) · [LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [Create LRS Network from Existing Dataset](https://www.google.com/search?q=%22Create%20LRS%20Network%20from%20Existing%20Dataset%22+site%3Adoc.esri.com) · [Enable Referent Fields](https://www.google.com/search?q=%22Enable%20Referent%20Fields%22+site%3Adoc.esri.com) · [Enable Stationing Fields](https://www.google.com/search?q=%22Enable%20Stationing%20Fields%22+site%3Adoc.esri.com) · [Search by Route](https://www.google.com/search?q=%22Search%20by%20Route%22+site%3Adoc.esri.com) · [Identify Routes](https://www.google.com/search?q=%22Identify%20Routes%22+site%3Adoc.esri.com) · [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com) · [Split Event](https://www.google.com/search?q=%22Split%20Event%22+site%3Adoc.esri.com) · [Merge Event](https://www.google.com/search?q=%22Merge%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support International Miles measure method

User Story
ArcGIS Pro

## Slide 2 — User Story

As an LRS data modeler/administrator, I need international miles as a supported measurement method, so that I can use the measure method utilized throughout my organization.

Persona: Data Modeler/Administrator: This user is responsible for doing the configuration, modeling, and even loading of the LRS.  For a few of our state DoT customers, they’re moving from US Survey Miles to International Miles as the measurement method utilized throughout their organizations.  We need to support this as a measurement method for the LRS as well.

## Slide 3 — Requirements

Support International Miles as a measure method in the LRS
Allow users to configure this as a spatial reference units of measure along with LRS Network unit of measure
Honor the unit of measure in all the tools/operations below where we expose measure
In Pro Location Referencing ribbon

  - LRS Properties for LRS Network and Events
  - LRS Route, calibration, and centerline editing tools (as the measure for the From/To Measure parameters)
  - Locate Route and Measures, Translate Measures
  - LRS Event editing tools (drop downs for measures)
In GP

  - Create LRS (spatial reference units of measure)
  - Create LRS Network (measure unit)
  - Create LRS Network from Existing Dataset (validate correct units)
  - Enable Referent Fields (offset units)
  - Enable Stationing Fields (station measure units)

## Slide 4 — Requirements

In REST

  - No specific endpoint that needs the parameter added, but any operation using measure should honor International Miles as the measure method for the LRS Network
In Experience Builder

  - Search by Route (Measure for Route and Measure method, Offset for Referent method)  For offset in referent method, we should also add International feet.
  - Identify Routes (Measure in the results)
  - Add Point Event (Measure for Route and Measure input method)
  - Add Line Event (Measure for Route and Measure input method)
  - Split Event (Measure for Route and Measure input method)
  - Merge Event (Measure for Route and Measure input method)

## Slide 5 — Testing

Test all the tools in the requirements slides
Test with a mix of line and non line networks
Test with a mix of spanning and non spanning events
Verify labels are consistent with other methods
508/i18n

## Slide 6 — Automation

Add a test case to the GP configuration tools to support this new method

## Slide 7 — Documentation

Update the GP and REST documentation where we have parameters that specifically mention the support measure methods
Update any other topics that discuss supported measure methods
Update any screenshots that show the supported measure methods drop down (not sure if we have this in the doc anywhere)

## Slide 8 — Story Points

Story Points:
Dev:
PE:
