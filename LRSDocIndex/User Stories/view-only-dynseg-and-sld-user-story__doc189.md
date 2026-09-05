# View only DynSeg and SLD User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Source** | [UneditableDynSegSLD.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/UneditableDynSegSLD.pptx>) |
| **Edited** | 2025-04-17 15:43 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "View only DynSeg and SLD User Story"
source_file: "UneditableDynSegSLD.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/UneditableDynSegSLD.pptx"
doc_id: 189
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Praveen Kumar"
last_edited_by: "Claire Wang"
last_edited: "2025-04-17T15:43:11Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["dynamic segmentation", "straight line diagram", "view only", "event editing", "experience builder", "configuration", "user story"]
tools: ["DynSeg", "Straight Line Diagram"]
products: []
issues: []
related: [{"doc":161,"file":"view-only-non-editable-dynseg-sld-in-experience-builder-test-plan__doc161.md","s":6.139},{"doc":183,"file":"include-intersections-in-straight-line-diagram-sld-user-story__doc183.md","s":4.142},{"doc":181,"file":"include-site-addresses-layer-in-straight-line-diagram__doc181.md","s":3.568},{"doc":182,"file":"include-centerlines-in-straight-line-diagram__doc182.md","s":3.502},{"doc":191,"file":"experience-builder-sld-interaction-with-map__doc191.md","s":3.484}]
```
-->

## Summary

Describes a user story for configuring a view only option in the DynSeg/SLD widget to restrict editing of LRS event results to authorized editors. Covers configuration details, expected widget behavior when view only is enabled, and testing requirements across different networks, attribute sets, and platforms.

## Related documents

<!-- related:begin -->
- [View-only (non editable) DynSeg / SLD in Experience Builder – test plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/view-only-non-editable-dynseg-sld-in-experience-builder-test-plan__doc161.md>) — similar text 0.47 · 4 title words · 2 filename words · same surface <!-- rel:161 -->
- [Include Intersections in Straight Line Diagram (SLD) User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/include-intersections-in-straight-line-diagram-sld-user-story__doc183.md>) — similar text 0.30 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:183 -->
- [Include Site Addresses Layer in Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/include-site-addresses-layer-in-straight-line-diagram__doc181.md>) — similar text 0.31 · 1 filename word · same kind/surface/folder <!-- rel:181 -->
- [Include Centerlines in Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/include-centerlines-in-straight-line-diagram__doc182.md>) — similar text 0.32 · 1 filename word · same kind/surface/folder <!-- rel:182 -->
- [Experience Builder SLD Interaction with Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-sld-interaction-with-map__doc191.md>) — similar text 0.15 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:191 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [DynSeg](https://www.google.com/search?q=%22DynSeg%22+site%3Adoc.esri.com) · [Straight Line Diagram](https://www.google.com/search?q=%22Straight%20Line%20Diagram%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — View only DynSeg and SLD

User Story

## Slide 2 — User Story

As a data administrator, I need the ability to configure editability of the results in DynSeg/SLD widget, so that only LRS event editors can edit those results.
Persona
Data administrator: They create experiences and configure widgets for users in their organization. Those users include event editors, contributors that edit only non-LRS data, QA/QC engineers and viewers, located in different business units/departments than the LRS route editors.

Data admins need to be able to configure a “view only” option in DynSeg/SLD widget, so DynSeg/SLD results are still available for viewing but not editing in the experiences created for those users without LRS editing responsibilities.
Sample workflow:

- A contributor does not have permission to edit LRS data but they retrieve information from SLD results to help update non-LRS data

## Slide 3 — Configuration

- Add toggle option above Merge coincident events called “View only”
  - Default is off
  - When it’s on, Dynseg table and SLD become non-editable as described in the next two pages.
  - When it’s on, merge coincident event option can also be on but it won’t have any effect as editing is disabled

![image2.png](../media/doc810_image2.png)

## Slide 4 — DynSeg table

- Disable the Save, Discard, and Field Calculator buttons
- Double clicking a field does not enable editing.
  - Use the same cell color and behavior that we already support (e.g. the geometry Type cell; point event fields in the row of Line type)

![image3.png](../media/doc810_image3.png)

## Slide 5 — SLD

- After double clicking an event record, pop-up window does not distinguish Editable Fields vs. Non-Editable Fields.
- Show 1 section called “Fields” that shows all fields.
- All fields behave like the current “Non-Editable Fields”
- No change to Statistics section.

![image4.png](../media/doc810_image4.png)

## Slide 6 — Testing

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc810_slide6.svg)

- Verify the option aligns with Experience Builder style
- Test Dynseg table and SLD
- Verify the tool works like today when View only is off
- Test with nonline and line networks, with line and/or point events
- Test different attribute sets
- 508/i18n testing
- Test with different themes
- Test in Chrome and Firefox
- Test in different sizes (web, tab and mobile)

## Slide 7 — Automation Documentation

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc810_slide7.svg)

Existing automation will fail if it has a configuration part. Fix it.
Add cases when results are view only
Add to existing Dynseg/SLD topics

## Slide 8 — Assignment

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc810_slide8.svg)

Story Points:
Dev:
PE:
