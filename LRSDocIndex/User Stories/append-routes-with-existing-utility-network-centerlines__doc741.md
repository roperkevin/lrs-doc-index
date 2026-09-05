# Append Routes with existing Utility Network centerlines

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Source** | [Append Routes with existing UN centerlines.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Append%20Routes%20with%20existing%20UN%20centerlines.pptx>) |
| **Edited** | 2021-01-05 22:00 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Append Routes with existing Utility Network centerlines"
source_file: "Append Routes with existing UN centerlines.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Append%20Routes%20with%20existing%20UN%20centerlines.pptx"
doc_id: 741
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2021-01-05T22:00:44Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["append routes", "utility network", "pipeline", "centerlines", "route loading", "validation", "geoprocessing tool"]
tools: ["Append Routes"]
products: ["Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":486,"file":"append-routes-consider-existing-centerlines__doc486.md","s":7.978},{"doc":709,"file":"consider-route-dominance-in-append-routes__doc709.md","s":5.218},{"doc":165,"file":"append-routes-partial-loading-support__doc165.md","s":4.791},{"doc":768,"file":"support-vertical-segments-in-append-routes__doc768.md","s":4.487},{"doc":168,"file":"allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md","s":4.029}]
```
-->

## Summary

User story describing enhancements to the Append Routes geoprocessing tool to consider existing Utility Network pipeline centerlines when appending routes. The tool should validate geometry matches, avoid overlapping centerlines, and fail with error messages if routes require centerline splits or partial matches outside tolerance. Testing and automation plans are included.

## Related documents

<!-- related:begin -->
- [Append Routes Consider Existing Centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-consider-existing-centerlines__doc486.md>) — similar text 0.70 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:486 -->
- [Consider Route Dominance in Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/consider-route-dominance-in-append-routes__doc709.md>) — similar text 0.42 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:709 -->
- [Append Routes Partial Loading Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-partial-loading-support__doc165.md>) — similar text 0.32 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:165 -->
- [Support Vertical Segments in Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-segments-in-append-routes__doc768.md>) — similar text 0.31 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:768 -->
- [Allow Append Events to Run When Locks Are Present on Impacted Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md>) — similar text 0.24 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:168 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html)

_No page matched:_ [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Consider Utility Network Pipeline/Centerline in Append Routes

User Story

## Slide 2 — User Story

As a LRS data loader, I want to be able to load centerlines first then append routes without creating overlapping centerlines, so I can preserve centerline attributes for my Utility Network pipelines and not have to run the Remove Overlapping Centerlines tool.

Persona
LRS data loader: This user is responsible for initial and supplemental bulk data loading in the LRS.  When a user first adopts APR, they typically oversee or work with a partner to migrate their data into our information model.  Once their organization is in production, this user would be responsible for bulk loading new data as needed (for example a pipeline operator is acquired).  When the Utility Network is also implemented, the user is responsible for creating the new pipes for the UN then appending routes and calibration points for the LRS.  We need to enhance the Append Routes tool to accommodate the pipes (centerlines) already being in place and the UN having rules about how those pipes can be updated.

## Slide 3 — Append Routes considering UN pipelines

Enhance the Append Routes GP tool to consider existing UN pipeline/centerline features when appending in new/supplemental routes to a network
When the tool is executed, check to see if there is a Utility Network configured with the LRS Network the routes are being loaded into

  - If no, then proceed with the tool the way it works today
  - If yes, have the tool consider existing centerlines when appending in routes
For cases where a UN is present, instead of loading the route and the corresponding centerline, instead we should:

  - Load the source routes into the network feature class like we do today
  - Perform any validations like we do today
  - Associate each newly appended route with existing centerline(s) by creating a centerline sequence record and CenterlineID GUID (see next slide for specifics)
  - Do this for each appended route

## Slide 4 — Append Routes considering UN pipelines (cont.)

There shouldn’t be a need to split centerlines since routes should begin/end where centerlines begin/end.  Don’t load the route feature if it would require a centerline split.  Instead have the tool fail, include an error message and additional info in the txt file output.
If a centerline is a partial match (part of the centerline matches the route but part of it is outside the XY tolerance), don’t load the route feature, have the tool fail, include an error message and additional info in the txt file output
If an appended route has one or more whole centerlines that match the geometry, but there are some locations where no centerlines exist, have the tool fail, provide an error message and addition info in the txt output
This should apply to all three methods for the tool (Add, Replace by RouteID, Retire by RouteID)

## Slide 5 — Testing

Test in line and non line networks
Verify that when no UN is configured the tool works the way it does today
Test with the following centerline-route scenarios

  - Appended route has 1 centerline that is an exact geometry match
  - Appended route has more than one centerline that is an exact geometry match
  - Appended route has centerline(s) that match, but also requires at least 1 new centerline be added
  - Appended route would cause a centerline to split (should not load route and get message)
  - Appended route has a partial geometry match with centerline (should not load route and get message)
Utilize the existing UN dataset that we have

## Slide 6 — Automation

Create a new python test to automate the tool for these UN scenarios

## Slide 7 — Documentation

Add a usage note to the Append Routes GP tool mentioning this support if the LRS is configured with a UN
Also mention this in the topic we have about configuring APR-UN together
Do we need to address that they shouldn’t need to run Remove Overlapping Centerlines as part of the route loading process in this APR-UN configuration?

## Slide 8 — Question

Should we expose this beyond just the UN case? (could be an optional check box in the tool)

## Slide 9 — Assignment

Story Points:
Dev:
PE:
