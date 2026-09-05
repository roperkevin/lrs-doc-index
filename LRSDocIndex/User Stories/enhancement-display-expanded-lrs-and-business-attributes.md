# Enhancement: Display Expanded LRS and Business Attributes in SLD Hover Tooltip

| Field | Value |
| --- | --- |
| **Doc** | 23 · User Story · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExB - SLD AllAttributesonHover.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20SLD%20AllAttributesonHover.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2026-06-01 18:43 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | hover tooltip · lrs attributes · business attributes · event editor · lrs analyst |
| **Tools** | Straight Line Diagram |

## Summary

This document describes a user story to enhance the Straight Line Diagram (SLD) hover tooltip to display LRS attributes first followed by business attributes using display names. It includes acceptance criteria, testing plans, automation updates, and documentation requirements for the tooltip behavior enhancement.

## Related documents

<!-- related:begin -->
- [Test Plan: Display Expanded LRS and Business Attributes in the SLD Hover Tooltip](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/24784-display-expanded-lrs-and-business-attributes-in-the-sld.md>) — similar text 0.44 · 6 title words · 2 filename words · same surface <!-- rel:908 s=7.571 -->
- [Dynamic Segmentation SLD - Expression Display Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynseg-sld-expression-display-support.md>) — similar text 0.19 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:25 s=4.564 -->
- [Experience Builder Straight Line Diagram Event Attributes on Hover/Click](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-sld-event-attributes-on-hover-click.md>) — similar text 0.14 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:348 s=4.236 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget-sld-dual-network-measure-support-2026-06.md>) — similar text 0.22 · 1 filename word · same kind/surface/folder <!-- rel:12 s=3.875 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget-sld-dual-network-measure-support-2026-06-2.md>) — similar text 0.22 · 1 filename word · same kind/surface/folder <!-- rel:27 s=3.784 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Straight Line Diagram](https://www.google.com/search?q=%22Straight%20Line%20Diagram%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Enhancement: Display Expanded LRS and Business Attributes in SLD Hover Tooltip <!-- slide 1 -->

## Acceptance Criteria
### I Need, Personas, Workflow <!-- slide 2 -->
- As an event editor or LRS analyst, I need to view LRS attributes (Route ID(s), Measure(s), Dates, Event ID) followed by business attributes in the SLD hover tooltip using display names, so that I can quickly understand event context without opening additional dialogs.
- Personas: Event Editor, LRS Analyst
- Workflow: Hover over event → Tooltip shows LRS attributes first → Business attributes next → Continue analysis

### Acceptance Criteria (1/2) <!-- slide 3 -->
- Enhance existing hover tooltip
- Show LRS attributes first: Route ID(s), Measure(s), Dates, Event ID
- Use alias/display names
- Show business attributes after LRS attributes
- Exclude ObjectID, Shape, Shape Length

### Acceptance Criteria (2/2) <!-- slide 4 -->
- Show LRS attributes first followed by business attributes
- Inline tooltip only
- Show max attributes fitting UI (truncate overflow)
- Maintain performance
- Respect attribute sets
- No change to click/double-click behavior

## Testing
<!-- slide 5 -->
- - Validate ordering and alias names
- - Validate point vs line measures
- - Verify excluded fields
- - Test large datasets and truncation behavior
- - Ensure no regression to highlight and popup behavior

## Automation
<!-- slide 6 -->
- Update existing UI automation to validate tooltip behavior
- Validate ordering (LRS first)
- Validate excluded fields
- Extend tests for large attribute sets
- Regression checks for hover performance

## Documentation
<!-- slide 7 -->
- Update widget docs for tooltip behavior
- Document ordering and alias usage
- List excluded fields
- Add examples and screenshots

## Assignment
### Estimation <!-- slide 8 -->
- Story Points:
- Dev:
- PE:
