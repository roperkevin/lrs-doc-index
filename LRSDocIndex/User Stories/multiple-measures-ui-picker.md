# Multiple Measures UI Picker User Story

| Field | Value |
| --- | --- |
| **Doc** | 790 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [MultipleMeasuresUIPicker.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/MultipleMeasuresUIPicker.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-07-01 21:58 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | multiple measure picker · measure selection · route editing · complex shape route · user interface |
| **Tools** | — |

## Summary

User story describing a UI picker for selecting the correct measure at route locations with multiple measures in LRS route editing tools. The UI appears when a single route location has multiple measures, allowing users to select and populate the measure field in the editing tool. Accessibility, dark mode, and internationalization are required.

## Related documents

<!-- related:begin -->
- [Add Multiple Line Events tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-multiple-line-events-tool-in-pro.md>) — similar text 0.27 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:686 s=3.201 -->
- [Add Multiple Point Events tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-multiple-point-events-tool-in-pro.md>) — similar text 0.27 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:685 s=3.195 -->
- [LRS Addressing and Utility Network Properties User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-addressing-and-un-properties.md>) — similar text 0.24 · same kind/surface/folder <!-- rel:190 s=2.997 -->
- [LRS Intersection Properties User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-intersection-properties.md>) — similar text 0.24 · same kind/surface/folder <!-- rel:843 s=2.991 -->
- [Add Line Event tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-tool-in-pro.md>) — similar text 0.27 · same kind/surface/folder <!-- rel:687 s=2.984 -->
<!-- related:end -->

---

## Story
### Measure picker UI for multiple measures at a single location <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing user, I want to be able to interact with the map to select the correct measure at route locations with multiple measures, so I can make LRS route edits on complex shape route types.

## Acceptance Criteria
### Multiple Measure picker UI <!-- slide 3 -->
- In the LRS route editing tools, if a user selects the Select by Measure button on the tool and clicks a location on the map where a single route has two or more measures (the self intersection/closing point of a complex shape route for examples), open the multiple measure picker UI to allow the user to select the correct measure to be populated for the measure in the LRS tool
- The UI should show the RouteID and Measures and allow the user to select the measure they want populated in the measure parameter for the tool
- Consider using one of the existing picker UIs we have (multiple route picker would be a good one)
- If there is more than one route at the location where there are multiple measures, show only the RouteID/Measures for the route selected in the LRS tool
- Needs to be 508 compliant – A11y, Dark Mode, Tabbing
- Should be I18n ready

### Multiple Measure picker UI <!-- slide 4 -->
- UI should only appear when a location on a single route where there is more than one measure is clicked
- When the user selects one of the measures and clicks OK, populate the measure field in the LRS editing tool
- If the user clicks cancel, close the UI and don’t populate the measure field in the LRS editing tool

![Figure 1 — Multiple Measure picker UI](../media/multiple-measures-ui-picker/fig-01-slide-04-multiple-measure-picker-ui.png)

## Testing
<!-- slide 5 -->
- Test with various complex shapes
- Long values
- Tab, scroll, resize, hover
- Select and copy
- Dark and light theme
- L18N

## Documentation
<!-- slide 6 -->
- No doc updates for this as we don’t document the other picker options anywhere

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
