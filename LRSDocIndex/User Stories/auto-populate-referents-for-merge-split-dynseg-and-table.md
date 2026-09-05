# Auto-Populate Referents for Merge, Split, DynSeg, and Table Widgets

| Field | Value |
| --- | --- |
| **Doc** | 910 · User Story · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExB.-.AutopopulateReferentsMergeSplitDynSegTable.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB.-.AutopopulateReferentsMergeSplitDynSegTable.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2026-09-04 07:49 by Kevin Roper |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | referent · event editing · merge · split · dynamic segmentation · attribute table · experience builder |
| **Tools** | Merge · Split · Dynamic Segmentation · Table |

## Summary

Describes the user story for automatically populating referent fields when events are added or updated in merge, split, dynamic segmentation, and table widgets. Defines acceptance criteria for referent updates based on event edits and measure changes. Includes testing, automation, and documentation plans.

## Related documents

<!-- related:begin -->
- [Auto-Populate Referents for Event Edits](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-populate-referents-for-event-edits.md>) — similar text 0.77 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:1 s=7.281 -->
- [Merge coincident option in DynSeg tool in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/merge-coincident-option-in-dynseg-tool-in-pro.md>) — similar text 0.16 · 2 title words · 3 filename words · same kind/folder <!-- rel:604 s=4.237 -->
- [Populate Route and Measure Referents When Adding/Updating LRS Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/populate-route-and-measure-referents-when-adding-updating.md>) — similar text 0.24 · 2 title words · 1 filename word · same kind/folder <!-- rel:631 s=3.332 -->
- [Dynamic Segmentation SLD - Expression Display Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynseg-sld-expression-display-support.md>) — similar text 0.19 · same kind/surface/folder <!-- rel:25 s=3.132 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget-sld-measure-range-filtering.md>) — similar text 0.16 · same kind/surface/folder <!-- rel:13 s=3.113 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html) · [Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html) · [Release locks through the LRS Locks table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/lrs-locks-table.html) · [Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)
<!-- docs:end -->

---

## Story
### ExB : Auto-Populate Referents for Merge, Split, DynSeg , and Table widgets <!-- slide 1 -->

### User Story, Personas, Workflow <!-- slide 2 -->
- As an Event Editor, I need referent fields to automatically populate when events are added or updated, so that referent information stays consistent with route and measure inputs without manual effort.
- Persona: Event Editor – Maintains LRS event data using Pro and Experience Builder tools and relies on consistent location referencing.
- Workflow: Add/Update Point/Line events-> system captures referent and route/measures -> populate referents for events with those fields configured

## Acceptance Criteria
### Acceptance Criteria & Requirements ( 1 ) <!-- slide 3 -->
- Applies only when referents are configured
- Split Events: Use route and measure for new referents below
  - Upstream event: Update To Referent, Keep From Referent
  - Downstream event: Update From Referent, Keep To Referent
- Merge Events: preserve referents
  - From Referent from upstream event, To Referent from downstream event

### Acceptance Criteria & Requirements ( 2 ) <!-- slide 4 -->
- Dynamic Segmentation & Attribute Table
  - If routeID or measures updated -> update referents
  - Only update impacted referent(s) when partial measure edits occur
  - If no measure change -> do NOT update referents
  - Attribute-only or date edits preserve referents
  - Note that you can’t edit routes/measures in DynSeg so referents shouldn’t update for those edits

## Testing
<!-- slide 5 -->
- Test adding and updating events in all 4 widgets
- Validate referent updates for full and partial measure edits
- Validate only impacted referents update
- Validate no updates for attribute/date edits
- Should match the Pro tools actions

## Automation
<!-- slide 6 -->
- Update automation for all 4 tools to incorporate the referent cases

## Documentation
<!-- slide 7 -->
- Document automatic referent population in Split and Merge widgets
- Document split and merge rules for each scenario

## Other content
### Estimation & Assignment <!-- slide 8 -->
- Story Points: 5
- Dev Effort: 3 Days
- PE Effort: 3 Days
