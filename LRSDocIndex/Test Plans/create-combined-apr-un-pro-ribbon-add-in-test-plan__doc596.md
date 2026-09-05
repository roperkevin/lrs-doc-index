# Create combined APR-UN Pro ribbon add-in – Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Issue** | [ArcGISPro/ps-location-referencing#4958](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4958) |
| **Source** | [APRUN_ribbon_testplanv1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/APRUN_ribbon_testplanv1.pptx>) |
| **Edited** | 2023-03-10 18:31 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Create combined APR-UN Pro ribbon add-in – Test Plan"
source_file: "APRUN_ribbon_testplanv1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/APRUN_ribbon_testplanv1.pptx"
doc_id: 596
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: "Claire Wang"
dev: "1"
author: "Lakshmi Ananthanarayanan"
last_edited_by: "Claire Wang"
last_edited: "2023-03-10T18:31:30Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["pipeline referencing", "utility network", "pro ribbon", "add-in", "tool launch", "ui verification", "license handling"]
tools: ["Unified Pipeline Tools"]
products: ["Pipeline Referencing", "Utility Network"]
issues: ["ArcGISPro/ps-location-referencing#4958"]
related: [{"doc":606,"file":"combined-apr-un-ribbon-user-story__doc606.md","s":1004.417},{"doc":633,"file":"spike-combined-apr-un-pro-ribbon__doc633.md","s":3.749},{"doc":566,"file":"unified-pipeline-tools-add-in__doc566.md","s":3.704},{"doc":656,"file":"set-time-filter-button-lr-pro-ribbon-test-plan__doc656.md","s":2.893},{"doc":51,"file":"realign-route-ai-assistant-test-plan__doc51.md","s":2.182}]
```
-->

## Summary

Test plan for the combined APR-UN add-in on the ArcGIS Pro ribbon called Unified Pipeline Tools. Covers installation, UI verification, tool launch tests, positive and negative scenarios including data and license availability. Includes documentation update notes and verification of tool grouping and usability in different modes.

## Related documents

<!-- related:begin -->
- [Combined APR-UN Ribbon User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/combined-apr-un-ribbon-user-story__doc606.md>) — shared issue ArcGISPro/ps-location-referencing#4958 · similar text 0.33 · 3 title words · same surface <!-- rel:606 -->
- [Spike: Combined APR-UN Pro Ribbon](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-combined-apr-un-pro-ribbon__doc633.md>) — similar text 0.14 · 4 title words · 1 filename word · same surface <!-- rel:633 -->
- [Unified Pipeline Tools add-in](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/unified-pipeline-tools-add-in__doc566.md>) — similar text 0.14 · 1 title word · same surface <!-- rel:566 -->
- [Set Time Filter Button LR Pro Ribbon: Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/set-time-filter-button-lr-pro-ribbon-test-plan__doc656.md>) — similar text 0.08 · 2 title words · same kind/surface/folder <!-- rel:656 -->
- [Realign Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/realign-route-ai-assistant-test-plan__doc51.md>) — similar text 0.04 · same kind/surface/folder <!-- rel:51 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [Add calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/add-calibration-points.html)

_No page matched:_ [Unified Pipeline Tools](https://www.google.com/search?q=%22Unified%20Pipeline%20Tools%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Create combined APR-UN Pro ribbon add-in – Test Plan

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4958

PE: Claire Wang
Dev:

## Slide 2

Data:

- Use APR_UN data for testing
- Installing the Add-In from solution zip folder adds a new tab called Unified Pipeline Tools to Pro ribbon
- The ribbon can be further customized
- Installing the Add-In does not overwrite any existing ribbon customizations and the quick-access toolbar
- Uninstalling the Add-In removes the Unified Pipeline Tools tab and existing ribbon customizations stay intact
- Not having LRS/UN data does not affect tab expansion.
  - If data is missing, related tools are disabled, and hovering on the disabled tools will display a tooltip about missing data
  - If license is missing, related tools follow their existing behaviors that LR tools are grayed out with a tooltip about missing license and UN tools are not grayed out but showing an error upon tool launch
  - Tools are enabled when data is added to map and/or license is installed
- Upon tab expansion, ensure all tools are organized in an efficient manner for common workflows
  - Tool buttons have different sizes
  - Tools are grouped by functionalities (map; edit; LR; UN) and group names are labeled at the bottom of ribbon
- Resizing Pro window will not affect the usability of the new tab. Tools may collapse to a drop-down
- Test all tools to ensure they launch and do small, random sampling to run tools from each section
- Test dark and light mode

Documentation
Include note in APR “Manage Pipeline Referencing and a utility network together” about the add in here

  - Add new header and section to the doc
  - Since UPDM solution is not necessary to use the Add-in, if user has both APR and UN in use, they can still use the Add-in
Verification
General UI verification
Verify the tab is arranged in a way similar to the mock-up

Verify each tool UI is intact

## Slide 3

Positive (tool launch)
All tools should launch with the correct UI

Positive (sampled these tools to fully run)

- Pan and zoom to centerlines, select centerlines and create routes
- Realign routes with events and run AEB
- Add multiple line and point events on routes
- Merge events and run DynSeg
- Split a centerline, create routes, and choose 1 UN tools that is available in the Unified Pipeline Tools ribbon. If splitting a centerline in UN is not achievable, discard this bullet point
  - --- For UN tools, tester can choose to refer to solutions in UPDM solution template as helpdoc ---
- Validate
- Trace locations

Negative

- APR and UN data not available
- Only UN data not available
- APR and UN licenses not available (test with both Pro and Portal licenses)
- APR license not available (test with both Pro and Portal licenses)
- UN license not available (test with both Pro and Portal licenses)
