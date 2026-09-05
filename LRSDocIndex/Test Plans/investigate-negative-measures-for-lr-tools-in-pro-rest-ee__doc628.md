# Investigate Negative Measures for LR Tools in Pro/REST/EE

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Source** | [Negative_M_LR_Tools.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Negative_M_LR_Tools.pdf>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "Investigate Negative Measures for LR Tools in Pro/REST/EE"
source_file: "Negative_M_LR_Tools.pdf"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Negative_M_LR_Tools.pdf"
doc_id: 628
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: "Ayan"
dev: ""
author: ""
last_edited_by: ""
last_edited: ""
extracted: 2026-09-04
extraction_lane: plaintext
prompt_version: "v2.0.2"
keywords: ["negative measures", "from measure", "to measure", "route editing", "event editing", "reassign route", "linear referencing tools"]
tools: ["Create Route", "Extend Route", "Realign Route", "Retire Route", "Reassign Route", "Add Calibration Point", "Edit Calibration Point", "Add Single Line Event", "Add Multiple Line Events", "Add Single Point Event", "Add Multiple Point Events", "Split Event", "Merge Events", "Event Replacement", "Locate Route and Measures", "Edit Attribute Table for Events", "Append Routes", "Generate Routes", "Generate CP", "Apply Edits", "Add Point Event", "Add Line Event", "Edit Event"]
products: []
issues: []
related: [{"doc":515,"file":"spike-64-bit-oid-in-lrs-editing-tools__doc515.md","s":3.77},{"doc":481,"file":"64-bit-oid-lrs-event-editing-tools-test-plan__doc481.md","s":3.688},{"doc":867,"file":"help-id-mapping-for-lrs-tools-and-ui-elements__doc867.md","s":3.679},{"doc":629,"file":"investigate-line-order-with-reverse-stationing__doc629.md","s":3.573},{"doc":566,"file":"unified-pipeline-tools-add-in__doc566.md","s":3.513}]
```
-->

## Summary

This document verifies support for negative measures in linear referencing tools across ArcGIS Pro, REST API, and Enterprise Edition. It tests various tools for handling from and to measures, including route creation, event editing, and route reassignment. Special attention is given to editing routes with negative start and end measures and the requirement that from measure must be smaller than to measure except in retire route tool.

## Related documents

<!-- related:begin -->
- [Spike: 64-bit OID in LRS Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-64-bit-oid-in-lrs-editing-tools__doc515.md>) — similar text 0.17 · 1 title word · 1 filename word · same surface/folder <!-- rel:515 -->
- [64 bit OID LRS Event Editing Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/64-bit-oid-lrs-event-editing-tools-test-plan__doc481.md>) — similar text 0.18 · 1 title word · 1 filename word · same kind/surface <!-- rel:481 -->
- [Help ID Mapping for LRS Tools and UI Elements](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/help-id-mapping-for-lrs-tools-and-ui-elements__doc867.md>) — similar text 0.09 · 1 title word · same surface <!-- rel:867 -->
- [Investigate Line Order with Reverse Stationing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/investigate-line-order-with-reverse-stationing__doc629.md>) — similar text 0.25 · 1 title word · same surface/pe/folder <!-- rel:629 -->
- [Unified Pipeline Tools add-in](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/unified-pipeline-tools-add-in__doc566.md>) — similar text 0.10 · 1 title word · same surface <!-- rel:566 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Add calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/add-calibration-points.html) · [Add multiple line events](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/add-multiple-line-events.html) · [Add multiple point events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/add-multiple-point-events.html) · [Merge events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-events.html) · [Locate route and measures](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/locate-route-and-measures.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)

_No page matched:_ [Edit Calibration Point](https://www.google.com/search?q=%22Edit%20Calibration%20Point%22+site%3Adoc.esri.com) · [Add Single Line Event](https://www.google.com/search?q=%22Add%20Single%20Line%20Event%22+site%3Adoc.esri.com) · [Add Single Point Event](https://www.google.com/search?q=%22Add%20Single%20Point%20Event%22+site%3Adoc.esri.com) · [Split Event](https://www.google.com/search?q=%22Split%20Event%22+site%3Adoc.esri.com) · [Event Replacement](https://www.google.com/search?q=%22Event%20Replacement%22+site%3Adoc.esri.com) · [Edit Attribute Table for Events](https://www.google.com/search?q=%22Edit%20Attribute%20Table%20for%20Events%22+site%3Adoc.esri.com) · [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com) · [Generate Routes](https://www.google.com/search?q=%22Generate%20Routes%22+site%3Adoc.esri.com) · [Generate CP](https://www.google.com/search?q=%22Generate%20CP%22+site%3Adoc.esri.com) · [Apply Edits](https://www.google.com/search?q=%22Apply%20Edits%22+site%3Adoc.esri.com) · [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

          Investigate Negative Measures for LR tools in Pro/REST/EE

 Verify if the LR tools in Pro/REST/EE support negative measures for:
 • From Measure
 • To Measure
 • From and To Measures

 Report the findings for each tool.

Pro                                      Event Editor                              REST
• Create Route
                                         • Add Single Line Event                   • Apply Edits
• Extend Route
                                         • Add Multiple Line Events                   • Add Point Event
• Realign Route
                                         • Add Single Point Event                     • Add Line Event
• Retire Route
                                         • Split Event                                • Edit Event
• Reassign Route
                                         • Merge Events                               • Create Route
• Add Calibration Point
                                         • Event Replacement                          • Realign Route
• Edit Calibration Point
                                         • Edit Attribute Table for Events            • Reassign Route
• Add Single Line Event
• Add Multiple Line Events                                                            • Retire Route
• Add Single Point Event                                                              • Extend Route
• Add Multiple Point Events                                                           • Add Calibration Point
• Split Event                                                                         • Edit Calibration Point
• Merge Events
• Event Replacement
• Locate Route and Measures
• Edit Attribute Table for Events
• Append Routes>Generate
  Routes>Generate CP

   Additionally, test with routes that have their from and to measures in negative and perform the edit activities
   that uses the start and/or the end of the routes.

   Ayan specifically mentioned to test Reassign with starting negative measure.

   The From M must be smaller than the To M (except for the Retire Route tool)

                                                                                                                     831
