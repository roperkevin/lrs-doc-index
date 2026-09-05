# Append Calibration Points to LRS tool

| Field | Value |
| --- | --- |
| **Doc** | 40 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Append Calibration Points to LRS tool.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Append%20Calibration%20Points%20to%20LRS%20tool.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2026-05-04 21:47 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | calibration points · append · batch processing · error handling · route recalibration · field mapping |
| **Tools** | Append Calibration Points |

## Summary

User story for a new Append Calibration Points geoprocessing tool that enables bulk appending of calibration points into an existing LRS. The tool supports field mapping, batch loading to prevent failure, suspends calibration listener during load, and recalibrates affected routes after completion. It includes error handling for invalid data and aims to improve performance and validation feedback over current workflows.

## Related documents

<!-- related:begin -->
- [Append Calibration Points To LRS Tool 7203 Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-cp-to-lrs-tool-7203.md>) — similar text 0.31 · 4 title words · 4 filename words · same surface <!-- rel:22 s=6.723 -->
- [Generate Calibration Points Tool Feature Service Support User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/generate-cp-tool-feature-service-support.md>) — similar text 0.15 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:662 s=4.447 -->
- [Support Optional Date Field Mapping in Append Events Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-optional-date-field-mapping-in-append-events-tool.md>) — similar text 0.20 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:143 s=4.414 -->
- [Attribute Field Method in Generate Calibration Points](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/attribute-field-method-in-generate-cp.md>) — similar text 0.18 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:702 s=3.932 -->
- [Append Routes Partial Loading Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-partial-loading-support.md>) — similar text 0.23 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:165 s=3.927 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Append Calibration Points](https://www.google.com/search?q=%22Append%20Calibration%20Points%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Append Calibration Points to LRS tool <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Data Loader, I need the ability to append existing calibration points in bulk, so that I can successfully load points, have quality checks applied, and calibration updated on impacted routes in an efficient manner.

Persona
LRS Data Loader is responsible for initial and subsequent loading of data.  This includes existing calibration points from previous systems, which pipeline users almost always want to migrate when adopting the software (and acquiring new pipeline operators and needing to load new data).
Data Loaders need to load external or legacy calibration point datasets into an existing LRS
Current workflows:

- Route recalibration is trigger on every inserted CP
- Append tool fails/time outs on large datasets
- Append tool provides limited validation feedback (especially for non monotonic errors)
No scalable, batch-safe tool exists for appending calibration points

## Acceptance Criteria
### Append Calibration Points tool <!-- slide 3 -->
- Introduce a new Append Calibration Points geoprocessing tool that:
  - Appends calibration points into an existing LRS
  - Supports explicit field mapping
  - Suspends calibration listener during load
  - Loads records in batches to prevent failure
  - Recalibrates affected routes after completion
- Geoprocessing parameters include:
  - Source Calibration Points (feature layer)
  - Target LRS Calibration Points (feature layer)
  - LRS Network
  - Field Mapping (excluding the NetworkID)
- Acceptance Criteria
  - Valid calibration points are appended successfully
  - Calibration listener is suspended and resumed correctly
  - Large datasets load without timeout or failure
  - Routes are recalibrated using appended calibration points
  - Invalid records are skipped with actionable errors
  - Tool completes with partial success when needed
  - When complete, messages includes success and error counts and feature layer of CPs that failed to load is created

### Error Handling <!-- slide 4 -->
- Provide error messaging for the following scenarios:
  - Null or invalid RouteID
  - Invalid measure value
  - From/To Dates outside route temporal range
  - Calibration Point not located on route (with routeID of the point)
  - Non-monotonic route scenarios introduced
- Calibration points that can’t be loaded should be included in an output feature class for users to adjust/fix (follow the same pattern as in Append Routes)

## Testing
<!-- slide 5 -->
- Append valid calibration points
- Mixed valid and invalid datasets
- Large dataset performance testing
- Missing RouteID
- Invalid measures
- Temporal misalignment
- Off-route points
- Model Builder
- Python

## Automation
<!-- slide 6 -->
- Add GP tool automation coverage for:
  - Successful append workflows
  - Error handling scenarios
  - Batch processing behavior
- Ensure no regression to existing calibration workflows

## Documentation
<!-- slide 7 -->
- Create new GP topic for tool
- Add guidance for bulk calibration data migration in usage notes
- Update existing topics around data loading to highlight this tool in place of the current appending calibration points workflow

## Assignment
<!-- slide 8 -->
Story Points:
Dev:  days
PE:  days
