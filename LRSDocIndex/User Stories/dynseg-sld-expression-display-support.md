# Dynamic Segmentation SLD - Expression Display Support

| Field | Value |
| --- | --- |
| **Doc** | 25 · User Story · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExB - Custom Expressions in SLD.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Custom%20Expressions%20in%20SLD.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2026-06-01 19:19 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | dynamic segmentation · expression display · arcade expressions · concatenated fields · sld rectangle labels · experience builder |
| **Tools** | Dynamic Segmentation |

## Summary

This document describes the need for supporting concatenated fields and Arcade expressions in Straight Line Diagram (SLD) rectangle labels within Experience Builder. It outlines acceptance criteria, testing, automation, and documentation requirements to ensure expression-based labels align with enterprise display standards and inherit expressions from web maps or services.

## Related documents

<!-- related:begin -->
- [Dynamic Segmentation: Expression Display Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/31520-dynseg-expression-display-support.md>) — similar text 0.22 · 5 title words · 1 filename word · same surface <!-- rel:21 s=6.789 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget-sld-dual-network-measure-support-2026-06.md>) — similar text 0.23 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:12 s=5.093 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget-sld-dual-network-measure-support-2026-06-2.md>) — similar text 0.23 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:27 s=5.014 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget-sld-measure-range-filtering.md>) — similar text 0.24 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:13 s=5.002 -->
- [Enhancement: Display Expanded LRS and Business Attributes in SLD Hover Tooltip](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/enhancement-display-expanded-lrs-and-business-attributes.md>) — similar text 0.19 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:23 s=4.564 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)
<!-- docs:end -->

---

## Story
### Dynamic Segmentation SLD - Expression Display Support <!-- slide 1 -->

## Acceptance Criteria
### I Need / Personas / Workflow <!-- slide 2 -->
- As an Event Editor, I need SLD rectangle labels to support concatenated fields and Arcade expressions defined in the web map/service, so that labels align with enterprise display standards.
- Persona: Event Editor - maintains and analyzes LRS event data using SLD visualization to understand relationships across layers.
- Persona: GIS Analyst - configures services/web maps including concatenation and Arcade expressions for standardized display.
- Workflow: Configure expressions in service/web map -> load into Experience Builder -> select display field in widget config -> view SLD rectangles with expression-based labels

### Acceptance Criteria & Requirements (1) <!-- slide 3 -->
- Support concatenated fields and Arcade expressions as display fields
- Expressions must be inherited from service/web map
- Expressions appear as selectable options in widget configuration
- No creation or editing of expressions in widget

### Acceptance Criteria & Requirements (2) <!-- slide 4 -->
- Applies only to SLD rectangle labels
- Rendering must match service/web map output
- Respect aliases, domains, and null handling
- Evaluate expressions per event layer as configured

### Acceptance Criteria & Requirements (3) <!-- slide 5 -->
- If expression unsupported, notify user
- Fallback to default label field
- Notification must not block workflow
- No regression to existing field display behavior

## Testing
<!-- slide 6 -->
- Validate concatenated field rendering in SLD
- Validate Arcade expression rendering in SLD
- Verify expressions appear in configuration dropdown
- Test unsupported expressions and fallback behavior
- Test multiple layers and large datasets

## Automation
<!-- slide 7 -->
- Add automated tests for expression rendering
- Validate configuration dropdown population
- Regression coverage for existing labeling behavior
- Compare expected vs rendered label output

## Documentation
<!-- slide 8 -->
- Update Dynamic Segmentation widget documentation
- Document support for concatenated fields and Arcade expressions
- Clarify expressions are inherited only
- Document fallback and notification behavior

## Other content
### Estimation / Assignment <!-- slide 9 -->
- Story Points:
- Dev Effort:  days
- PE Effort:  days
