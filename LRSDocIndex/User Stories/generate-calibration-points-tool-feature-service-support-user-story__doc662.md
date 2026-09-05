# Generate Calibration Points Tool Feature Service Support User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [Generate Calibration Points using REST.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Generate%20Calibration%20Points%20using%20REST.pptx>) |
| **Edited** | 2022-06-01 20:01 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Generate Calibration Points Tool Feature Service Support User Story"
source_file: "Generate Calibration Points using REST.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Generate%20Calibration%20Points%20using%20REST.pptx"
doc_id: 662
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2022-06-01T20:01:59Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["calibration points", "feature service", "generate calibration points", "geoprocessing tool", "error handling", "testing"]
tools: ["Generate Calibration Points"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":702,"file":"attribute-field-method-in-generate-calibration-points__doc702.md","s":5.885},{"doc":733,"file":"recalibrate-route-when-moving-calibration-points-in-feature-services__doc733.md","s":3.641},{"doc":22,"file":"append-calibration-points-to-lrs-tool-7203-test-plan__doc22.md","s":3.513},{"doc":812,"file":"relocate-events-in-pro__doc812.md","s":3.013},{"doc":143,"file":"support-optional-date-field-mapping-in-append-events-tool__doc143.md","s":2.909}]
```
-->

## Summary

This document describes a user story to enable the Generate Calibration Points geoprocessing tool to support feature services as source and target layers. It details the feature service support requirements, error conditions, testing scenarios, automation updates, and documentation changes needed to implement this capability.

## Related documents

<!-- related:begin -->
- [Attribute Field Method in Generate Calibration Points](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/attribute-field-method-in-generate-calibration-points__doc702.md>) — similar text 0.40 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:702 -->
- [Recalibrate Route When Moving Calibration Points in Feature Services](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/recalibrate-route-when-moving-calibration-points-in-feature-services__doc733.md>) — similar text 0.14 · 3 title words · same kind/surface/folder <!-- rel:733 -->
- [Append Calibration Points To LRS Tool 7203 Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-calibration-points-to-lrs-tool-7203-test-plan__doc22.md>) — similar text 0.09 · 3 title words · 2 filename words · same surface <!-- rel:22 -->
- [Relocate Events in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/relocate-events-in-pro__doc812.md>) — similar text 0.42 · same surface/folder <!-- rel:812 -->
- [Support Optional Date Field Mapping in Append Events Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-optional-date-field-mapping-in-append-events-tool__doc143.md>) — similar text 0.20 · 2 title words · same kind/surface/folder <!-- rel:143 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/edit-feature-services.html)

_No page matched:_ [Generate Calibration Points](https://www.google.com/search?q=%22Generate%20Calibration%20Points%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Generate Calibration Points geoprocessing tool using REST data sources

## Slide 2 — User Story

As a LRS configurer/data loader, I want to be able to use feature services as the source and target layers in the Generate Calibration Points tool, so I can easily load additional calibration points from various sources without having to ask for them in a feature class format.
Persona
LRS configurer/data loader: This user is responsible for configuration/ongoing maintenance of the LRS along with initial and supplemental bulk data loading in the LRS. When a user first adopts Roads and Highways/Pipeline Referencing, they typically oversee or work with a partner to migrate their data into our information model and ensure the LRS is configured to meet their business rules. Once their organization is in production, this user would be responsible for bulk loading new data as needed (for example a pipeline operator is acquired) along with making any changes to configuration (such as changing an event behavior for an event). For some DoTs/Pipeline Operators, the data sources can come from a feature services.  In this case, they want to be able to utilize these feature services to load new/additional data.  The Generate Calibration Points tool currently is the only configuration tool that doesn’t support feature services as source/targets for data.  We should support that with this user story.

## Slide 3 — Feature Service Support

In the Generate Calibration Points tool, support feature services for the following layers:

  - Input Polyline features
  - Calibration Points
For the input polyline features, the service doesn’t need to have any additional capabilities enabled
For the calibration points, they should come from an LR enabled service so we can read the metadata and determine networks to provide in the LRS Network parameter
If the layers come from a feature service, we should execute the tool server side like our other tools that support feature services
Support executing this tool within an edit session
If there are scalability issues/cache refresh issues, try to address/support them (if notes in the doc are needed, let the PE know)

## Slide 4 — Error Conditions

An appropriate error should be reported if the Service hosting the layer:

  - Goes offline during processing
  - Runs out of available instances (if possible)
  - Runs against an unlicensed Server
If a Feature Service is provided for a calibration point layer that isn’t published with a Linear Referencing capability REST endpoint, display error “The feature service <service name or layer name> being used does not have the Linear Referencing capability enabled. To enable use of this layer for this tool, the Linear Referencing capability must be enabled in the published map service and the layer must be a event feature class in an LRS.”
An error should be displayed if a Feature Service provided as an input does not have a required field published as visible (i.e. Event measure, from data, to date, etc.)
If Location Referencing is not licensed on ArcGIS Server and a gp tool from the location referencing toolbox is executed with REST data sources, provide an error alerting the user that Location Referencing is not licensed.
If the Location Referencing toolbox is shutting down when a request comes in, give an error message alerting the user that the service is busy, please try again.
If a read/write lock exists on the version of the data being processed, give the user and error and alert them that another user is accessing the data in that version.
If user does not have access to all the event layers that will be updated, give the same error message as we do today when there is a client-server connection.
Write these errors into both the Server Log and the GP messages in ArcGIS Pro.

## Slide 5 — Testing

Use the existing test cases and test data for the tool to test with services
When testing feature services, make sure the user does not have permissions to access the feature classes directly.
Verify that results from feature class based execution produce exactly the results from feature services.
Test with very large datasets being loaded (>100k records).
Test where the input to the tool is a feature layer with a definition query, selection set, or time enabled on the map.
Test with model builder, python inline, and python stand alone with a feature service.
Test the cancel button, roll back all the updates upon cancellation.
Test cancel with default version.
After the tool updates, test the cache is updated.
Test combinations of client-server and feature service as source and target inputs.
Test with GP batch capabilities.

## Slide 6 — Automation

Take the existing Client Server automation for the tool and convert it into feature service automation for the tool

## Slide 7 — Assignment

Story Points:
Dev:
PE:

## Slide 8 — Documentation

Add note to this tool documentation that it will support feature services as the input (https://pro.arcgis.com/en/pro-app/latest/tool-reference/location-referencing/generate-calibration-points.htm)
Add Generate Calibration Points to the list of tools supporting feature services in the new REST endpoint documentation (https://pro.arcgis.com/en/pro-app/latest/tool-reference/location-referencing/location-referencing-toolbox-branch-versioning-support.htm)
