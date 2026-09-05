# Create combined APR-UN Pro ribbon add-in – Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 596 · Test Plan · Pro |
| **Product** | Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#4958](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4958) |
| **Source** | [APRUN_ribbon_testplanv1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/APRUN_ribbon_testplanv1.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE Claire Wang · dev 1 |
| **Edited** | 2023-03-10 18:31 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | pipeline referencing · utility network · pro ribbon · add-in · tool launch · ui verification · license handling |
| **Tools** | Unified Pipeline Tools |

## Summary

Test plan for the combined APR-UN add-in on the ArcGIS Pro ribbon called Unified Pipeline Tools. Covers installation, UI verification, tool launch tests, positive and negative scenarios including data and license availability. Includes documentation update notes and verification of tool grouping and usability in different modes.

## Related documents

<!-- related:begin -->
- [Combined APR-UN Ribbon User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/4958-combined-apr-un-ribbon.md>) — shared issue ArcGISPro/ps-location-referencing#4958 · similar text 0.33 · 3 title words · same surface <!-- rel:606 s=1004.417 -->
- [Spike: Combined APR-UN Pro Ribbon](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/combined-apr-un-pro-ribbon.md>) — similar text 0.14 · 4 title words · 1 filename word · same surface <!-- rel:633 s=3.749 -->
- [Unified Pipeline Tools add-in](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/5048-unified-pipeline-tools-add.md>) — similar text 0.14 · 1 title word · same surface <!-- rel:566 s=3.704 -->
- [Set Time Filter Button LR Pro Ribbon: Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4138-set-time-filter-button-lr-pro-ribbon.md>) — similar text 0.08 · 2 title words · same kind/surface/folder <!-- rel:656 s=2.893 -->
- [Realign Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/7067-realign-route-ai-assistant-rh-apr-2026-02.md>) — similar text 0.04 · same kind/surface/folder <!-- rel:51 s=2.182 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [Add calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/add-calibration-points.html)

_No page matched:_ [Unified Pipeline Tools](https://www.google.com/search?q=%22Unified%20Pipeline%20Tools%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Create combined APR-UN Pro ribbon add-in – Test Plan <!-- slide 1 -->

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4958

PE: Claire Wang
Dev:

### Slide 2 <!-- slide 2 -->

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

## Test Cases

### TC-P01 — Pan and zoom to centerlines, select centerlines and create routes <!-- src: S4 · slide 3 · Positive (sampled these tools to fully run) · 1 -->

- **Group:** Sampled These Tools To Fully Run

### TC-P02 — Realign routes with events and run AEB <!-- src: S4 · slide 3 · Positive (sampled these tools to fully run) · 2 -->

- **Group:** Sampled These Tools To Fully Run

### TC-P03 — Add multiple line and point events on routes <!-- src: S4 · slide 3 · Positive (sampled these tools to fully run) · 3 -->

- **Group:** Sampled These Tools To Fully Run

### TC-P04 — Merge events and run DynSeg <!-- src: S4 · slide 3 · Positive (sampled these tools to fully run) · 4 -->

- **Group:** Sampled These Tools To Fully Run

### TC-P05 — Split a centerline, create routes <!-- src: S4 · slide 3 · Positive (sampled these tools to fully run) · 5 -->

- **Group:** Sampled These Tools To Fully Run
- **Case:** Split a centerline, create routes, and choose 1 UN tools that is available in the Unified Pipeline Tools ribbon. If splitting a centerline in UN is not achievable, discard this bullet point
- --- For UN tools, tester can choose to refer to solutions in UPDM solution template as helpdoc ---

### TC-P06 — Validate <!-- src: S4 · slide 3 · Positive (sampled these tools to fully run) · 6 -->

- **Group:** Sampled These Tools To Fully Run

### TC-P07 — Trace locations <!-- src: S4 · slide 3 · Positive (sampled these tools to fully run) · 7 -->

- **Group:** Sampled These Tools To Fully Run

### TC-N01 — APR and UN data not available <!-- src: S4 · slide 3 · Negative · 1 -->

### TC-N02 — Only UN data not available <!-- src: S4 · slide 3 · Negative · 2 -->

### TC-N03 — APR and UN licenses not available (test with both Pro and Portal licenses) <!-- src: S4 · slide 3 · Negative · 3 -->

### TC-N04 — APR license not available (test with both Pro and Portal licenses) <!-- src: S4 · slide 3 · Negative · 4 -->

### TC-N05 — UN license not available (test with both Pro and Portal licenses) <!-- src: S4 · slide 3 · Negative · 5 -->

## Other content

### Slide 3 <!-- slide 3 -->

Positive (tool launch)
All tools should launch with the correct UI
