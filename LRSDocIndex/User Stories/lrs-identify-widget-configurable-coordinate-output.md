# LRS Identify Widget – Configurable Coordinate Output

| Field | Value |
| --- | --- |
| **Doc** | 26 · User Story · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExB - Include Coordinates in LRS Identify.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Include%20Coordinates%20in%20LRS%20Identify.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2026-06-01 22:41 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | coordinate output · identify widget · spatial reference · precision · copy to clipboard · event editor · gis analyst |
| **Tools** | LRS Identify |

## Summary

Describes the need for configurable coordinate output in the LRS Identify widget to support accurate location interpretation and reuse. Specifies acceptance criteria including toggle for coordinate inclusion, precision and spatial reference configuration, copy-to-clipboard functionality, and no regression or performance impact. Includes testing, automation, and documentation requirements.

## Related documents

<!-- related:begin -->
- [LRS Identify: Show Coordinates in Results Experience Builder Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/26618-lrs-identify-show-coordinates-in-results-exb-widget.md>) — similar text 0.29 · 2 title words · 2 filename words · same surface <!-- rel:859 s=5.082 -->
- [LRS Identify Widget - Copy Attribute Values](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/lrs-identify-widget-copy-attribute-values.md>) — similar text 0.27 · 2 title words · same kind/surface/folder <!-- rel:5 s=4.081 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget-sld-measure-range-filtering.md>) — similar text 0.17 · 1 title word · same kind/surface/folder <!-- rel:13 s=3.54 -->
- [Dynamic Segmentation SLD - Expression Display Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynseg-sld-expression-display-support.md>) — similar text 0.21 · same kind/surface/folder <!-- rel:25 s=3.254 -->
- [LRS Identify widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-identify-widget.md>) — similar text 0.18 · 2 title words · 1 filename word · same surface <!-- rel:905 s=3.168 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [LRS Identify](https://www.google.com/search?q=%22LRS%20Identify%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### LRS Identify Widget – Configurable Coordinate Output <!-- slide 1 -->

## Acceptance Criteria
### I Need, Personas, Workflow <!-- slide 2 -->
- As an LRS event editor or analyst, I need configurable coordinate output in the LRS Identify widget so that I can interpret and reuse location information accurately across systems.
- Personas: Event Editor and GIS Analyst responsible for validation and configuration.
- Workflow: Click map → Identify → Apply config (toggle, precision, spatial reference) to output→ View coordinates → Copy/use results

### Acceptance Criteria & Requirements (1/3) <!-- slide 3 -->
- Add a configuration toggle to the LRS Identify widget: 'Include coordinates in results' (default OFF)
- When enabled, coordinates appear in Identify results
- Add a precision option that is configurable (default = service precision)
- Coordinates returned are derived from LRS result location

### Acceptance Criteria & Requirements (2/3) <!-- slide 4 -->
- User can configure output spatial reference
- Default spatial reference = LRS spatial reference
- Follow Add Point/Add Line Event widget configuration pattern

### Acceptance Criteria & Requirements (3/3) <!-- slide 5 -->
- Copied format must be: 'X,Y' or 'Coordinate1, Coordinate2'
- Clearly label spatial reference in the results
- Clearly communicate differences from web map projection (if they’re different)
- Provide copy-to-clipboard capability for coordinate results in the widget
- No regression to Identify workflows
- No performance degradation

## Testing
<!-- slide 6 -->
- Validate toggle behavior
- Validate precision configuration
- Validate spatial reference default and override
- Validate copy-to-clipboard format and accuracy
- Regression testing

## Automation
<!-- slide 7 -->
- Add to existing UI automation for LRS Identify
  - Automate toggle persistence
  - Automate precision validation
  - Automate spatial reference selection
  - Automate clipboard format validation
- Verify no regression to existing automation

## Documentation
<!-- slide 8 -->
- Document new toggle, precision, spatial reference configuration options
- Explain default = LRS spatial reference
- Explain differences vs web map
- Document copy-to-clipboard behavior and format (X,Y)

## Assignment
### Estimation <!-- slide 9 -->
- Story Points:
- Dev Effort: days
- PE Effort: days
