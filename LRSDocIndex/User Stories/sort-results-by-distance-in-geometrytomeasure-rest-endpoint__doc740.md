# Sort results by distance in geometryToMeasure REST endpoint

|   |   |
| --- | --- |
| **Kind** | User Story · Server |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [SortbyDistance_geometryToMeasure.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SortbyDistance_geometryToMeasure.pptx>) |
| **Edited** | 2021-01-05 20:57 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Sort results by distance in geometryToMeasure REST endpoint"
source_file: "SortbyDistance_geometryToMeasure.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SortbyDistance_geometryToMeasure.pptx"
doc_id: 740
doc_kind: "User Story"
surface: "Server"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2021-01-05T20:57:09Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["geometry to measure", "rest endpoint", "distance sorting", "route id", "measure", "lrs developer"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":692,"file":"rest-geometry-to-station-user-story__doc692.md","s":4.034},{"doc":691,"file":"rest-station-to-geometry-user-story__doc691.md","s":3.947},{"doc":608,"file":"rest-geometry-to-referent-user-story__doc608.md","s":3.636},{"doc":614,"file":"rest-referent-to-geometry__doc614.md","s":3.18},{"doc":485,"file":"lrs-in-gcs-in-memory-only-densification__doc485.md","s":1.684}]
```
-->

## Summary

Enhance the geometryToMeasure REST endpoint to sort results by distance from provided XYZ coordinates, ordering closest to furthest. Tie-breaking rules apply based on route ID and measure values. Testing includes various network types and data projections. Documentation and test automation updates are planned.

## Related documents

<!-- related:begin -->
- [REST: Geometry to Station User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-geometry-to-station-user-story__doc692.md>) — similar text 0.21 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:692 -->
- [REST: Station to Geometry User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/rest-station-to-geometry-user-story__doc691.md>) — similar text 0.18 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:691 -->
- [REST: Geometry to Referent User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-geometry-to-referent-user-story__doc608.md>) — similar text 0.30 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:608 -->
- [REST: Referent to Geometry](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/rest-referent-to-geometry__doc614.md>) — similar text 0.14 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:614 -->
- [LRS in GCS: In-memory only Densification](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-in-gcs-in-memory-only-densification__doc485.md>) — similar text 0.08 · same kind/folder <!-- rel:485 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html)

_No page matched:_ [geometry to measure](https://www.google.com/search?q=%22geometry%20to%20measure%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Sort results by distance in geometryToMeasure REST endpoint

User Story

## Slide 2 — User Story

As an LRS developer, I need the results from geometryToMeasure to be sorted by distance, so that in cases where there are multiple matches for my request, I can quickly determine which is closest.

Persona
LRS Developer: This user is responsible for developing tools and applications that extend the use of LRS data that is managed by Roads and Highways/Pipeline Referencing.  This user may work for a business partner or in house for a user such as a DoT or Pipeline Operator.  These developers will leverage our REST endpoints in order to query our data for a variety of operations.  The geometryToMeasure endpoint is utilized by our users for a variety of applications.  A consistent request from them is when they have multiple results for a given route (or routes) that we sort them based on shortest distance from the XYZ geometry provided since they usually want the closest result.

## Slide 3 — geometryToMeasure REST

Enhance the results from the geometryToMeasure REST endpoint to sort the results from closest to furthest from the XYZ coordinates provided in the request
If two or more results are equidistant from the XYZ coordinates in the request, use the following to determine how to order them:

  - If the records all have the same route ID, the lowest measure should go first, followed by the next lowest measure
  - If the records have different route IDs, sort alphanumerically by route ID to determine which order to follow (lowest alphanumeric value to highest).  If there are still any records with the same distance and the same route ID, follow the rule above with the lowest measure to break the tie and order the records
This should be done whether the results include one or more than one route ID
This should only be done for the AO11 version of the endpoint

## Slide 4 — Testing

Test with line/non-line networks
Test with projected and unprojected data
Test with and without Route ID and Tolerance parameter populated

## Slide 5 — Automation

May need to update the existing ReadyAPI tests for the endpoint as the results may change once this is implemented

## Slide 6 — Documentation

Dev: Add to the existing geometryToMeasure topic to mention that results are returned closest to furthest from the route

## Slide 7 — Assignment

Story Points:
Dev:
PE:
