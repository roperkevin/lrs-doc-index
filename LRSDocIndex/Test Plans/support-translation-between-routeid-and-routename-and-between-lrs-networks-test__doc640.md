# Support Translation Between RouteID and RouteName (and Between LRS Networks) Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Issue** | [ArcGISPro/ps-location-referencing#4483](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4483) |
| **Source** | [4483-SupportTranslationBetweekRouteIdandRouteName_TestPlan_V1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/4483-SupportTranslationBetweekRouteIdandRouteName_TestPlan_V1.pptx>) |
| **Edited** | 2022-08-24 16:01 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Translation Between RouteID and RouteName (and Between LRS Networks) Test Plan"
source_file: "4483-SupportTranslationBetweekRouteIdandRouteName_TestPlan_V1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/4483-SupportTranslationBetweekRouteIdandRouteName_TestPlan_V1.pptx"
doc_id: 640
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: "V1"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2022-08-24T16:01:48Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["route identification", "route name", "route id", "line name", "line id", "measure translation", "network", "translation", "test plan"]
tools: []
products: []
issues: ["ArcGISPro/ps-location-referencing#4483"]
related: [{"doc":620,"file":"support-translation-between-routeid-and-routename-and-between-lrs-networks-test__doc620.md","s":1010.193},{"doc":644,"file":"translate-tool-for-arcgis-pro__doc644.md","s":3.435},{"doc":637,"file":"change-route-line-name-test-plan__doc637.md","s":3.055},{"doc":256,"file":"route-log-data-product-template-test-plan__doc256.md","s":2.573},{"doc":255,"file":"generate-a-route-log-including-spanning-events-and-centerline-test-plan__doc255.md","s":2.221}]
```
-->

## Summary

Test plan for the translation between RouteID and RouteName and between LRS networks, including line, non-line, and PoM networks. Covers positive and negative tests for route and measure translation components with various network types and ensures compliance with accessibility and internationalization standards. Includes UI behavior tests such as copying, resetting, selecting routes from map, and handling multiple time slices.

## Related documents

<!-- related:begin -->
- [Support Translation Between RouteID and RouteName (and Between LRS Networks) Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-translation-between-routeid-and-routename-and-between-lrs-networks-test__doc620.md>) — shared issue ArcGISPro/ps-location-referencing#4483 · similar text 0.95 · 6 title words · 5 filename words · same kind/surface <!-- rel:620 -->
- [Translate tool for ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/translate-tool-for-arcgis-pro__doc644.md>) — similar text 0.49 · same surface <!-- rel:644 -->
- [Change Route/Line Name Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/change-route-line-name-test-plan__doc637.md>) — similar text 0.16 · 2 filename words · same kind/surface <!-- rel:637 -->
- [Route Log data product template – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/route-log-data-product-template-test-plan__doc256.md>) — similar text 0.15 · 1 filename word · same kind/surface <!-- rel:256 -->
- [Generate a route Log including spanning events and centerline – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/generate-a-route-log-including-spanning-events-and-centerline-test-plan__doc255.md>) — similar text 0.05 · 1 filename word · same kind/surface <!-- rel:255 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Lines](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-a-line.html) · [LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html)

_No page matched:_ [translate](https://www.google.com/search?q=%22translate%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

Support Translation Between RouteID and RouteName (and Between LRS Networks) Test Plan

| Notes |
| --- |
| Test with line, non-line, and PoM networks. Test with EGDB DC and FS (default and other versions) for RouteID/Name and Line translation components. Translate Measures component will be tested with DC, FC, and FGDB. Ensure 508 and i18n compliance. Common workflow will be copy/paste of RouteID and RouteName into other tools and translating Route and Measure between networks. |

![Interface screenshot redrawn as a standardized wireframe: 2 panels, 6 fields, 19 icons, 25 text rows. 23 of 25 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc289_slide1.svg)

| Positive Tests: All Components |
| --- |
| Clicking the reset button will reset the tool to its initial form. Clicking the copy button will copy the corresponding information (RouteName, RouteID, LineName, LineID, or measure value) to the user’s clipboard. Clicking the minimize button will minimize the form. Upon closing and reopening the tool, information within the form will remain intact until the Pro session is closed. Using the Select Route from Map tool selects the corresponding route/line within the map. If multiple lines/routes are present when using Select Route from Map tool is used, a modal window will appear with a table showing these fields: Network, LineID or RouteID, Line Name or Route Name, From Date, and To Date. Ensure long LineName/RouteName and LineID/RouteID appear correctly. |

Devtopia Issue Link

![image1.png](../media/doc289_image1.png)

## Slide 2

| Positive Tests: Translate RouteID and Route Name |
| --- |
| Component works only with networks from FS and EGDB DC. Routes radio button is disabled when network’s Route Name is not configured. If the network layer is turned off, then the Routes radio button will be disabled. If the network layer is turned back on, then the Routes radio button will become enabled. |

| Positive Tests: All Components (Continued) |
| --- |
| Typing the LineID/LineName or RouteID/RouteName and hitting the ENTER key/losing focus will select the route/line within the map. If there are multiple time slices of a route when a RouteName/RouteID or LineName/LineID is typed, then a modal window will appear with a table showing these fields: Network, RouteID or LineID, Route Name or LineName, From Date, and To Date. Upon successful selection of a line/route, flash the line/route 3 times on the map. The RouteName/RouteID and LineName/LineID will always be in sync. Entering the name will always update the ID and vice versa. When using Select Route from Map tool, the RouteName/RouteID and measure are shown when hovering. Tool is readable and usable both in light and dark mode. Tool will open correctly along the ribbon. |

| Positive Tests: Translate LineID and Line Name |
| --- |
| Component works only with networks from FS and EGDB DC. Lines radio button is disabled when network’s Line Name is not configured. If the network layer is turned off, then the Lines radio button will be disabled. If the network layer is turned back on, then the Lines radio button will become enabled. |

| Positive Tests: Translate Measures |
| --- |
| Component works with FS, EGDB DC, and FGDB. Select From and To Networks, then enter a RouteName/RouteID in either the From or To Network section and the translated RouteName/RouteID will populate. Type the RouteName/RouteID in the From Network section and upon losing focus or hitting ENTER the RouteName/RouteID of the To Network section will populate and vice versa. The RouteName/RouteID of the From/To Network sections will always be in sync. From and To Network are same network, allowing for measure translation between overlapping routes. From and To Network are different networks with different measurement units. |

## Slide 3

| Negative Tests |
| --- |
| Route Name is invalid. RouteID is invalid LineName is invalid. LineID is invalid. |
