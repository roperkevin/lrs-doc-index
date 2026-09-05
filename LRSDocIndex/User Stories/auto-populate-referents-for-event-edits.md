# Auto-Populate Referents for Event Edits

| Field | Value |
| --- | --- |
| **Doc** | 1 · User Story · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExB - AutopopulateReferents.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20AutopopulateReferents.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2026-06-01 20:41 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | referent · event editing · dynamic segmentation · split events · merge events · measure edits |
| **Tools** | — |

## Summary

Describes a user story for automatically populating referent fields during event edits in LRS workflows. Covers acceptance criteria for add, split, merge, and dynamic segmentation event workflows, ensuring referent consistency with route and measure inputs. Includes testing, automation, and documentation plans for the feature.

## Related documents

<!-- related:begin -->
- [Auto-Populate Referents for Merge, Split, DynSeg, and Table Widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/auto-populate-referents-for-merge-split-dynseg-and-table.md>) — similar text 0.77 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:910 s=7.526 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget-sld-dual-network-measure-support-2026-06.md>) — similar text 0.23 · same kind/surface/folder <!-- rel:12 s=3.189 -->
- [Populate Route and Measure Referents When Adding/Updating LRS Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/populate-route-and-measure-referents-when-adding-updating.md>) — similar text 0.21 · 2 title words · 1 filename word · same kind/folder <!-- rel:631 s=3.168 -->
- [Dynamic Segmentation SLD - Expression Display Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynseg-sld-expression-display-support.md>) — similar text 0.22 · same kind/surface/folder <!-- rel:25 s=3.168 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget-sld-measure-range-filtering.md>) — similar text 0.21 · same kind/surface/folder <!-- rel:13 s=3.129 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Auto-Populate Referents for Event Edits <!-- slide 1 -->

### User Story, Personas, Workflow <!-- slide 2 -->
- As an Event Editor, I need referent fields to automatically populate when events are added or updated, so that referent information stays consistent with route and measure inputs without manual effort.
- Persona: Event Editor – Maintains LRS event data using Pro and Experience Builder tools and relies on consistent location referencing.
- Workflow: Add/Update/Split/Merge/Dynamic Seg/Attribute edit -> system evaluates route/measures -> if impacted update referents using configured settings, else preserve

## Acceptance Criteria
### Acceptance Criteria & Requirements (1) <!-- slide 3 -->
- Applies only when referents are configured
- Automatically executes for all point and line event add/edit workflows
- Add Point/Line:
  - Honor all input methods
  - Populate referents using existing referent configuration and inputs

### Acceptance Criteria & Requirements (2) <!-- slide 4 -->
- Split Events: Use route and measure for new referents below
  - Upstream event: Update To Referent
  - Downstream event: Update From Referent
- Merge Events: preserve referents
  - From Referent from upstream, To Referent from downstream

### Acceptance Criteria & Requirements (3) <!-- slide 5 -->
- Dynamic Segmentation & Attribute Table
  - If routeID or measures updated -> update referents
  - Only update impacted referent(s) when partial measure edits occur
  - If no measure change -> do NOT update referents
  - Attribute-only or date edits preserve referents

## Testing
<!-- slide 6 -->
- Test Add Point/Line with all input methods
- Validate referent updates for full and partial measure edits
- Validate only impacted referents update
- Validate no updates for attribute/date edits
- Test Split, Merge, Dynamic Seg workflows

## Automation
<!-- slide 7 -->
- Automate all edit pathways (Add, Update, Split, Merge, Dynamic Seg, Table)
- Validate impacted referent update logic
- Regression coverage for non-measure edits

## Documentation
<!-- slide 8 -->
- Document automatic referent population
- Clarify partial measure update behavior
- Document split and merge rules
- Update event editing documentation

## Other content
### Estimation & Assignment <!-- slide 9 -->
- Story Points:
- Dev Effort:  Days
- PE Effort:  Days
