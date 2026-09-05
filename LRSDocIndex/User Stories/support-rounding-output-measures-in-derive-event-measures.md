# Support rounding output measures in Derive Event Measures tool

| Field | Value |
| --- | --- |
| **Doc** | 823 · User Story · Pro |
| **Product** | Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [Support rounding output measures in Derive Event Measures.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20rounding%20output%20measures%20in%20Derive%20Event%20Measures.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2020-04-01 19:17 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | derive event measures · rounding · m tolerance · pipeline referencing · geoprocessing tool |
| **Tools** | Derive Event Measures |

## Summary

User story for adding an optional parameter to the Derive Event Measures geoprocessing tool to support rounding of output measures based on M tolerance. Includes testing requirements to verify correct rounding behavior and updates to automated tests and documentation.

## Related documents

<!-- related:begin -->
- [Support Search Tolerance Parameter in Update Measures from LRS Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-search-tolerance-parameter-in-update-measures.md>) — similar text 0.16 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:273 s=4.327 -->
- [Create LRS Intersection From Existing Feature Class Geoprocessing Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-lrs-intersection-from-existing-feature-class-gp.md>) — similar text 0.06 · 1 title word · same kind/surface/folder <!-- rel:881 s=2.878 -->
- [Verify External Events fail in LRS GP tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/verify-external-events-fail-in-lrs-gp.md>) — similar text 0.10 · same kind/surface/folder <!-- rel:809 s=2.258 -->
- [Linear Referencing Ribbon – Unified Experience](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-ribbon-unified-experience.md>) — similar text 0.04 · same kind/surface/folder <!-- rel:42 s=2.248 -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/arcgis-apr-an-introduction-rh-apr-un.md>) — similar text 0.03 · same surface/folder <!-- rel:885 s=1.437 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Tolerance and resolution settings for the LRS](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/tolerance-and-resolution-settings-for-the-lrs.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html)

_No page matched:_ [Derive Event Measures](https://www.google.com/search?q=%22Derive%20Event%20Measures%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support rounding output measures in Derive Event Measures tool <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Pipeline Referencing user, I need the Derive Event Measures tool to support rounding measures, so that my derived events always begin/end without decimals beyond the significant digits.

## Acceptance Criteria
### Rounding measures in Derive Event Measures <!-- slide 3 -->
- Add an optional parameter to the Derive Event Measures GP tool called “Round measures to remove extraneous decimals”
- When unchecked, run the tool exactly as we do today
- When checked, we need to round the derived event measures from the tool no more than the M tolerance to remove any extraneous decimals
  - Example: 0.00000018 would change to 0 when the M tolerance is 0.0003
  - Example: 0.00000018 would remain to 0.00000018 when the M tolerance is 0.00000003
  - Example: 11.49999991 would change to 11.5 when the M tolerance is 0.00001
  - Example: 11.49999991 would remain to 11. 49999991 when the M tolerance is 0.000000001
  - Example: 107.6529993 would change to 107.653 when the M tolerance is 0.000005
  - Example: 107.6529993 would remain to 107.6529993 when the M tolerance is 0.0000005
- Store the values for the record in the database (instead of just rounding them in the Pro display)

## Testing
<!-- slide 4 -->
- Verify both CS and FS
- Run without the parameter checked to ensure nothing changes
- Run with the parameter checked and verify decimals smaller than M tolerance round correctly
- Run with parameter checked and verify decimals larger than M tolerance do not round more than the M tolerance

## Automation
<!-- slide 5 -->
- Update the existing Derive Event Measures automated tests

## Documentation
### Doc <!-- slide 6 -->
- Update the existing GP topic for the new parameter

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
