# Automation Tasks Status and Development Overview

| Field | Value |
| --- | --- |
| **Doc** | 851 · Other · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [Automation_Tasks-status.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/Automation_Tasks-status.pptx>) |
| **People** | author Praveen Kumar · PE — · dev — |
| **Edited** | 2019-11-26 17:29 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | automation · event behavior · line network · editing · geoprocessing tools · rest api · testing · migration |
| **Tools** | Append Events · Append Routes · Apply Event Behaviors · Create LRS · Create LRS From Existing Dataset · Delete Routes · Derive Event Measures · Generate Calibration Points · Generate Events · Generate Routes · Overlay Events · Remove Overlapping Centerlines · Translate Event Measures · Update Measures From LRS |

## Summary

The document outlines the current status and development tasks related to automation for RH Desktop and APR edits and event behaviors, including REST and GP tools testing. It details completed, in-progress, and pending development activities, as well as updates and deprecated tests due to metadata upgrades. The focus is on migrating edits to ArcGIS Pro, fixing editing tool issues, and centralizing test results.

## Related documents

<!-- related:begin -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/regression-testing-task-list-v1.md>) — similar text 0.34 · same surface/folder <!-- rel:115 s=4.586 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/3147-lr-gp-error-messages.md>) — similar text 0.15 · same kind/surface <!-- rel:39 s=3.658 -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/arcgis-apr-an-introduction-apr-un.md>) — similar text 0.13 · same kind/surface <!-- rel:785 s=3.521 -->
- [Location Referencing for transportation across the ArcGIS Platform](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lr-for-transportation-across-the-arcgis-platform-rh-2020-07.md>) — similar text 0.11 · same kind/surface <!-- rel:787 s=3.41 -->
- [64 bit OID GP Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5509-64-bit-oid-gp.md>) — similar text 0.17 · same surface <!-- rel:467 s=3.018 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create and modify an LRS](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-and-modify-an-lrs.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/edit-feature-services.html)

_No page matched:_ [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com) · [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com) · [Apply Event Behaviors](https://www.google.com/search?q=%22Apply%20Event%20Behaviors%22+site%3Adoc.esri.com) · [Create LRS From Existing Dataset](https://www.google.com/search?q=%22Create%20LRS%20From%20Existing%20Dataset%22+site%3Adoc.esri.com) · [Delete Routes](https://www.google.com/search?q=%22Delete%20Routes%22+site%3Adoc.esri.com) · [Derive Event Measures](https://www.google.com/search?q=%22Derive%20Event%20Measures%22+site%3Adoc.esri.com) · [Generate Calibration Points](https://www.google.com/search?q=%22Generate%20Calibration%20Points%22+site%3Adoc.esri.com) · [Generate Events](https://www.google.com/search?q=%22Generate%20Events%22+site%3Adoc.esri.com) · [Generate Routes](https://www.google.com/search?q=%22Generate%20Routes%22+site%3Adoc.esri.com) · [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com) · [Remove Overlapping Centerlines](https://www.google.com/search?q=%22Remove%20Overlapping%20Centerlines%22+site%3Adoc.esri.com) · [Translate Event Measures](https://www.google.com/search?q=%22Translate%20Event%20Measures%22+site%3Adoc.esri.com) +1
<!-- docs:end -->

---

## Slide 1 — What is running

- RH Desktop Edits and Event Behaviors
- APR Line Edits and Event Behaviors (only for spanning routes)
- RH Pro Event Behaviors (Python)
- RH Pro Edits
- APR Edits
- REST Editing (SoapUI Tests)
- GP Tools Positive
- GP Tools Negative (Python)

## Slide 2 — APR Pro

| Edits (Line Network) | Event Behaviors (Line Network) | GP * | GP (Metadata) | REST (SoapUI) * |
| --- | --- | --- | --- | --- |
| Create | Extend | Configuration | Create LRS | Create |
| Extend | Retire | Append Events | Create LRS From Existing Dataset | Extend |
| Retire | Reassign | Append Routes | Modify LRS | Retire |
| Reassign | Realign | Update Measures From LRS | Create LRS Event | Reassign |
| Realign | Calibrate | Delete Routes | Create LRS Event From Existing Dataset | Realign |
| Calibrate | Carto Realignment | Derive Event Measures | Disable Derived Measure Fields | Calibrate |
| Split CL |  | Generate Calibration Points | Disable Referent Fields | Split CL |
| Carto Realignment |  | Generate Events | Enable Derived Measure Fields | Carto Realignment |
|  |  | Generate Routes | Enable Referent Fields | Apply Edits |
|  |  | Overlay Events | Modify Event Behavior Rules | concurrencies |
|  |  | Remove Overlapping Centerlines | Modify LRS Event | checkEvents |
|  |  | Translate Event Measures | Create LRS Network | geometryToMeasure |
|  |  |  | Create LRS Network From Existing Dataset | measureToGeometry |
|  |  |  | Modify LRS Network | translate |
|  |  |  | Remove LRS Entity | queryAttribteSet |
|  |  |  | Configure Lookup Table | generateRoutes |
|  |  |  | Modify Route ID Padding | applyEventBehaviors |
|  |  |  | Configure Utility Network Feature Class | deriveEventMeasures |
|  |  |  | Modify Gap Calibration Rules | appendRoutes |
|  |  |  |  | queryLookupTable |
|  |  |  |  | updateMeasuresFromLRS |
|  |  |  |  | generateEvents |
|  |  |  |  | appendEvents |
|  |  |  |  | removeOverlappingCenterlines |
|  |  |  |  | queryRouteAssociations |
|  |  |  |  | queryEditLog |

|  | Completed |
| --- | --- |
|  | In Progress |
| Text | Not developed |
| Text | Python Tests |
| Text | Test Complete |
| * | LR Team |

## Slide 3 — RH Pro

| Edits | Event Behaviors * | GP * | GP (Metadata) | REST (SoapUI) * |
| --- | --- | --- | --- | --- |
| Create | Extend | Append Events | Create LRS | Create |
| Extend | Retire | Append Routes | Create LRS From Existing Dataset | Extend |
| Retire | Reassign | Apply Event Behaviors | Modify LRS | Retire |
| Reassign | Realign | Delete Routes | Create LRS Event | Reassign |
| Realign | Calibrate | Derive Event Measures | Create LRS Event From Existing Dataset | Realign |
| Calibrate | Carto Realignment | Generate Calibration Points | Disable Derived Measure Fields | Calibrate |
| Split CL |  | Generate Events | Disable Referent Fields | Split CL |
| Carto Realignment |  | Generate Routes | Enable Derived Measure Fields | Carto Realignment |
|  |  | Overlay Events | Enable Referent Fields | Apply Edits |
|  |  | Remove Overlapping Centerlines | Modify Event Behavior Rules | concurrencies |
|  |  | Translate Event Measures | Modify LRS Event | checkEvents |
|  |  | Update Measures From LRS | Configure Lookup Table | geometryToMeasure |
|  |  |  | Create LRS Network | measureToGeometry |
|  |  |  | Create LRS Network From Existing Dataset | translate |
|  |  |  | Modify LRS Network | queryAttribteSet |
|  |  |  | Modify Route ID Padding | generateRoutes |
|  |  |  | Remove LRS Entity | applyEventBehaviors |
|  |  |  | Configure Utility Network Feature Class | deriveEventMeasures |
|  |  |  | Modify Gap Calibration Rules | appendRoutes |
|  |  |  |  | queryLookupTable |
|  |  |  |  | updateMeasuresFromLRS |
|  |  |  |  | generateEvents |
|  |  |  |  | appendEvents |
|  |  |  |  | removeOverlappingCenterlines |
|  |  |  |  | queryRouteAssociations |
|  |  |  |  | queryEditLog |

|  | Completed |
| --- | --- |
|  | In Progress |
| Text | Not developed |
| Text | Python Tests |
| Text | Test Complete |
| * | LR Team |

## Slide 4 — Current Development

- Migrating RH Desktop Edits and Event Behaviors to pro
- Fixing centerline selection for editing tools
- Update enterprise for next release

What needs to be developed

- Choosing Sanity tests from Edit activities
- Complete pending tasks in queue (PE)
- UN Edits, Event Behavior, GP tools
- Gap Route Edits, Event Behavior, GP tools (For all types of networks)
- Complex shape Edits, Event Behavior, GP tools (For all types of networks)
- Centralized location for all results

## Slide 5 — What needs to be updated

- Update all tests because of LRCD metadata upgrade
- Rename all tests based on edit activity (Ex : Extend at beginning)

What needs to be stopped

- Metadata Compare Tests
