# Attribute Field Method in Generate Calibration Points

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Source** | [Attribute Field method in Generate Calibration Points.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Attribute%20Field%20method%20in%20Generate%20Calibration%20Points.pptx>) |
| **Edited** | 2021-06-30 20:16 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Attribute Field Method in Generate Calibration Points"
source_file: "Attribute Field method in Generate Calibration Points.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Attribute%20Field%20method%20in%20Generate%20Calibration%20Points.pptx"
doc_id: 702
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2021-06-30T20:16:11Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["calibration points", "attribute field", "generate calibration points", "from measure", "to measure", "route shapes", "interpolation"]
tools: ["Generate Calibration Points"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":662,"file":"generate-calibration-points-tool-feature-service-support-user-story__doc662.md","s":5.635},{"doc":294,"file":"update-address-range-via-address-points-in-overlay-events-and-query-attribute__doc294.md","s":3.679},{"doc":143,"file":"support-optional-date-field-mapping-in-append-events-tool__doc143.md","s":3.358},{"doc":703,"file":"provide-option-to-not-apply-event-behaviors-for-calibration-point-edits__doc703.md","s":3.173},{"doc":781,"file":"split-events-spanning-gap-on-branched-routes__doc781.md","s":3.155}]
```
-->

## Summary

Describes a user story for adding an Attribute Field method to the Generate Calibration Points geoprocessing tool. This method allows using attribute field values from source routes to generate calibration points with measures applied. It includes parameter requirements, behavior for complex routes, and error handling for null or non-monotonic measures. Testing, automation, and documentation updates are also outlined.

## Related documents

<!-- related:begin -->
- [Generate Calibration Points Tool Feature Service Support User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/generate-calibration-points-tool-feature-service-support-user-story__doc662.md>) — similar text 0.40 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:662 -->
- [Update Address Range via Address Points in Overlay Events and Query Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/update-address-range-via-address-points-in-overlay-events-and-query-attribute__doc294.md>) — similar text 0.13 · 2 title words · same kind/surface/folder <!-- rel:294 -->
- [Support Optional Date Field Mapping in Append Events Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-optional-date-field-mapping-in-append-events-tool__doc143.md>) — similar text 0.22 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:143 -->
- [Provide option to not apply event behaviors for calibration point edits](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/provide-option-to-not-apply-event-behaviors-for-calibration-point-edits__doc703.md>) — similar text 0.23 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:703 -->
- [Split Events Spanning Gap on Branched Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/split-events-spanning-gap-on-branched-routes__doc781.md>) — similar text 0.13 · same kind/surface/folder <!-- rel:781 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html)

_No page matched:_ [Generate Calibration Points](https://www.google.com/search?q=%22Generate%20Calibration%20Points%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Attribute Field method in Generate Calibration Points

User Story

## Slide 2 — User Story

As a LRS configurer/data loader, I want to be able to use the attribute field values on my source routes for newly generated calibration points, so I can ensure the source data measures are applied to my newly loaded routes in the LRS.

Persona
LRS configurer/data loader: This user is responsible for configuration/ongoing maintenance of the LRS along with initial and supplemental bulk data loading in the LRS. When a user first adopts Roads and Highways, they typically oversee or work with a partner to migrate their data into our information model and ensure the LRS is configured to meet their business rules. Once their organization is in production, this user would be responsible for bulk loading new data as needed (for example a pipeline operator is acquired) along with making any changes to configuration (such as changing an event behavior for an event). For many DoTs/Pipeline Operators, the M values on their source data are stored as attribute fields that they want to use within the LRS.  Currently there isn’t a way to get these measures onto Calibration Points in bulk via the Generate Calibration Points tool.

## Slide 3 — Attribute Field method

Add a new value to the Calibration Method parameter in the Generate Calibration Points GP tool called Attribute Fields
When this method is selected, two new optional parameters should appear/be active

  - From Measure, To Measure
  - These fields are required when the Attribute Fields method is selected
When this method is selected, use the From and To Measure fields selected on the input polyline features to get the calibration points at the beginning/end of the route
For a route that requires more than 2 calibration points (gapped, complex, etc.), create the beginning/end of route calibration points from the attribute fields, then create any necessary intermediate points based on interpolation from the end calibration points and include a message in the output of the tool
If the From/To Measure field value for any of the routes is Null, don’t create any of the calibration points on that route and include a message in the output of the tool
If the resulting calibration points would create a non-monotonic route, don’t create any of the calibration points on that route and include a message in the output of the tool

## Slide 4 — Testing

Test on all route shapes (normal, gapped, complex, vertical)
Test on both Roads and Pipeline data (test at least one APR-UN scenario)
Use the test plan/data from the original user story as a guide

## Slide 5 — Automation

Add to the existing automation for the tool using the same pattern of using python.

## Slide 6 — Documentation

Update the existing documentation for the tool to mention this additional parameter and how it is used.

## Slide 7 — Assignment

Story Points:
Dev:
PE:
