# Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support

| Field | Value |
| --- | --- |
| **Doc** | 27 · User Story · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExB - SLD Dual Network support.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20SLD%20Dual%20Network%20support.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2026-06-01 18:16 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | dual network · dynamic segmentation · straight line diagram · engineering measures · continuous measures · event editing |
| **Tools** | Dynamic Segmentation |

## Summary

Describes a user story for event editors to view both engineering and continuous measures on a dual ruler in the Dynamic Segmentation widget. Covers acceptance criteria for ruler display, route attributes, testing, automation updates, and documentation for dual network measure support.

## Related documents

<!-- related:begin -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget-sld-dual-network-measure-support-2026-06.md>) — similar text 0.97 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:12 s=12.787 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget-sld-measure-range-filtering.md>) — similar text 0.19 · 6 title words · 1 filename word · same kind/surface/folder <!-- rel:13 s=6.094 -->
- [Spike: Dual LRS Measure Ruler Design](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/dual-lrs-measure-ruler-design.md>) — similar text 0.36 · 2 title words · 1 filename word · same surface/folder <!-- rel:15 s=5.369 -->
- [Support Overlapping Events in Experience Builder Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-overlapping-events-in-exb-sld.md>) — similar text 0.09 · 6 title words · 1 filename word · same kind/surface/folder <!-- rel:292 s=5.155 -->
- [Dynamic Segmentation SLD - Expression Display Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynseg-sld-expression-display-support.md>) — similar text 0.23 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:25 s=5.014 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)
<!-- docs:end -->

---

## Story
### Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support <!-- slide 1 -->

### User Story, Personas, Workflow <!-- slide 2 -->
- As an event editor, I need to view both engineering and continuous measures on the ruler so that I can compare LRMs without switching contexts.
- Persona: Event editors maintaining and validating events across LRMs.
- Workflow: Launch dyn seg → select Engineering route → view dual ruler → inspect events → open attributes.

## Acceptance Criteria
### Acceptance Criteria (Ruler + Network Behavior) <!-- slide 3 -->
- Single ruler with Engineering (top) and Continuous (bottom)
- Continuous is reference-only and read-only
- Dual display only when Engineering is primary
- If Continuous network is selected → only Continuous is shown
- Fallback: hide secondary ruler, show message with tooltip + help link

### Acceptance Criteria (Route + Attributes) <!-- slide 4 -->
- Display Continuous RouteID in SLD header when available
- If missing: show message with tooltip and help link
- Tooltip explains issue and suggests route calibration/regeneration
- Double-click shows Engineering + Continuous measures (if available)
- Both sets appear in read-only section

## Testing
<!-- slide 5 -->
- Validate dual ruler rendering and alignment
- Verify Continuous RouteID display
- Test fallback UX including tooltip and help link
- Ensure no errors when mapping missing
- Validate attribute panel behavior

## Automation
<!-- slide 6 -->
- Update existing UI automation for Dynamic Segmentation widget
- Ensure coverage for dual ruler states (with/without continuous mapping)
- Validate tooltip behavior and help link
- Maintain consistency with existing widget automation patterns
- Defer broader new automation beyond UI updates until SLD stabilizes

## Documentation
<!-- slide 7 -->
- Update dyn seg widget help for dual ruler
- Document fallback behavior and tooltip guidance
- Clarify Engineering vs Continuous roles
- Add examples and troubleshooting guidance

## Assignment
### Estimation <!-- slide 8 -->
- Estimation:
- Dev Effort:
- PE Effort:
