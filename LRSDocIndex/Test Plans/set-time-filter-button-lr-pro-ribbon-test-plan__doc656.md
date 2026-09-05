# Set Time Filter Button LR Pro Ribbon: Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Issue** | [ArcGISPro/ps-location-referencing#4138](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4138) |
| **Source** | [4138-SetTimeFilter_TestPlan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4138-SetTimeFilter_TestPlan.pptx>) |
| **Edited** | 2022-07-05 20:52 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Set Time Filter Button LR Pro Ribbon: Test Plan"
source_file: "4138-SetTimeFilter_TestPlan.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4138-SetTimeFilter_TestPlan.pptx"
doc_id: 656
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2022-07-05T20:52:48Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["time filter", "set time filter", "linear referencing ribbon", "feature service", "time enabled layers", "date range", "map time settings"]
tools: []
products: []
issues: ["ArcGISPro/ps-location-referencing#4138"]
related: [{"doc":596,"file":"create-combined-apr-un-pro-ribbon-add-in-test-plan__doc596.md","s":2.893},{"doc":20,"file":"unified-ribbon-test-plan__doc20.md","s":2.565},{"doc":633,"file":"spike-combined-apr-un-pro-ribbon__doc633.md","s":2.506},{"doc":620,"file":"support-translation-between-routeid-and-routename-and-between-lrs-networks-test__doc620.md","s":2.187},{"doc":42,"file":"linear-referencing-ribbon-unified-experience__doc42.md","s":2.152}]
```
-->

## Summary

Test plan for the Set Time Filter button on the Linear Referencing ribbon in ArcGIS Pro. Covers positive and negative test cases related to enabling, disabling, and updating time filters on maps with various time-enabled layers and feature services. Includes behavior verification for date range settings, interaction with Location Referencing Options, and multi-map scenarios.

## Related documents

<!-- related:begin -->
- [Create combined APR-UN Pro ribbon add-in – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/create-combined-apr-un-pro-ribbon-add-in-test-plan__doc596.md>) — similar text 0.08 · 2 title words · same kind/surface/folder <!-- rel:596 -->
- [Unified Ribbon Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/unified-ribbon-test-plan__doc20.md>) — similar text 0.10 · 1 title word · same kind/surface/folder <!-- rel:20 -->
- [Spike: Combined APR-UN Pro Ribbon](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-combined-apr-un-pro-ribbon__doc633.md>) — similar text 0.07 · 2 title words · same surface <!-- rel:633 -->
- [Support Translation Between RouteID and RouteName (and Between LRS Networks) Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-translation-between-routeid-and-routename-and-between-lrs-networks-test__doc620.md>) — similar text 0.23 · same kind/surface/folder <!-- rel:620 -->
- [Linear Referencing Ribbon – Unified Experience](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/linear-referencing-ribbon-unified-experience__doc42.md>) — similar text 0.08 · 1 title word · same surface <!-- rel:42 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Set a time filter](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-a-time-filter.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/edit-feature-services.html)
<!-- docs:end -->

---

## Slide 1

Set Time Filter Button LR Pro Ribbon: Test Plan

| Positive tests: Button is disabled |
| --- |
| Time is disabled. No LRS Data within map. FS without time enabled. Button should not be available if time is not enabled on the feature service. Only one layer has time enabled, time is then disabled for this layer. Button should become disabled. |

| Positive Tests |
| --- |
| Same start and end date. Different start and end dates. Dates are cleared when the clear date range option is selected and apply is clicked. If “Set LRS layers in maps to the current date and time when project is opened” is selected within the Location Referencing Options, ensure that closing Pro Project and reopening on a different date updates the time filter to the current date. Verify updating the Set Time Filter within the LR Ribbon updates values within the Time Ribbon. By default, the “Use current system date and time” radio button is selected. |

| Notes |
| --- |
| Test on FGDB, SDE, and FS. Button sets time for map; however, the Time Ribbon and Time Slider can also be used to adjust time settings. User wants similar experience to time filtration within ArcMap. |

| Negative tests: Error |
| --- |
| Empty start date, end date is populated. Empty end date, start date is populated. Start and/or end date are outside the extent of the Time Slider. |

## Slide 2

![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc271_slide2.svg)

| Positive Tests |
| --- |
| If time is disabled for one layer within Layer Properties on a map with all other layer's time enabled, the time filter should not be altered. Set Time Filter only affects current Map even with multiple Maps open within a Pro project. Set start date, end date should be auto-populated to the same date. Set end date, start date should be auto-populated to the same date. Once the start/end date is auto-populated, changing either the start or end date should not change the other date value. Set Time Filter button is enabled/disabled correctly when switching through multiple maps with and without time enabled. For FGDB and SDE, all layers have time disabled, then one layer solely becomes time enabled. Button should become available once this single layer has become time enabled. When reopening a map that was closed with a time filter set, if “Set LRS layers in maps to the current date and time when project is opened” is selected within the Location Referencing Options, ensure that the time filter is reset to the current date and time. This option within Location Referencing Options supersedes the Set Time Filter button. |

![image1.png](../media/doc271_image1.png)
