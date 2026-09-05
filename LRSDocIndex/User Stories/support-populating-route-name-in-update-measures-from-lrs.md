# Support populating Route Name in Update Measures from LRS tool

| Field | Value |
| --- | --- |
| **Doc** | 704 · User Story · Pro |
| **Product** | Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [Support populating Route Name in Update Measures from LRS.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20populating%20Route%20Name%20in%20Update%20Measures%20from%20LRS.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-07-15 23:54 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | route name · update measures · user story · lrs analyst · pipeline |
| **Tools** | Update Measures from LRS |

## Summary

This user story describes adding an optional Route Name parameter to the Update Measures from LRS tool to populate the route name field in the output. It covers the parameter's behavior in the UI, conditions for its availability, and testing requirements across different data types and interfaces. It also includes automation and documentation updates related to this new parameter.

## Related documents

<!-- related:begin -->
- [Support Events Spanning Routes in Update Measures from LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-events-spanning-routes-in-update-measures-from-lrs.md>) — similar text 0.61 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:266 s=5.543 -->
- [Support Search Tolerance Parameter in Update Measures from LRS Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-search-tolerance-parameter-in-update-measures.md>) — similar text 0.17 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:273 s=4.651 -->
- [Consider concurrencies in Update Measures from LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/consider-concurrencies-in-update-measures-from-lrs.md>) — similar text 0.42 · 1 title word · 2 filename words · same kind/surface/folder <!-- rel:710 s=4.364 -->
- [Related Table for Intersection Measures](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/related-table-for-intersection-measures.md>) — similar text 0.38 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:678 s=4.041 -->
- [Update Measures From LRS: Populate Route Name Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/3439-update-measures-from-lrs-populate-route-name.md>) — similar text 0.08 · 3 title words · 2 filename words · same surface <!-- rel:280 s=3.553 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html)

_No page matched:_ [Update Measures from LRS](https://www.google.com/search?q=%22Update%20Measures%20from%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support populating Route Name in Update Measures from LRS tool <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a LRS Analyst, I want the route name field populated when running Update Measures from LRS tool, so I can easily see the human readable/colloquial name for the route in the output of the tool.
Persona

- LRS Analyst: This user is responsible for analysis and reporting on LRS data.  This user may also have other titles/responsibilities within the organization, such as LRS editor or HPMS coordinator.  For the analyst role, this user utilizes other tools/capabilities within the Esri ecosystem as well as via home built and partner solutions. These users may have features that aren’t managed by the LRS that they need to get the route and measure via the Update Measures from LRS tool.  For users in an organization that utilizes the Route Name field in their network, they will want that field populated in the output for the Update Measures from LRS tool (whether that’s the UN pipeline line, another UN feature, or some other feature they want to be linear referenced).  In many pipeline operators, they use the Route Name field more commonly within the organization than the route ID field.

## Acceptance Criteria
### Route Name in Update Measures from LRS <!-- slide 3 -->
- Add an optional parameter to the Update Measures from LRS tool called Route Name
- This parameter would appear in the UI once a network with the route name configured is selected in the tool, but will remain optional
- If a network without route name configured is selected, the parameter shouldn’t appear in the UI
- If no route name is present in the network selected, the parameter shouldn’t be active and should fail in python if populated
- The parameter UI dropdown in Pro should include any fields in the Input Features layer that meet the field type/length of the route name field in the LRS Network layer in the tool
- If the parameter is populated, we should populate the route name from the LRS Network for each record in the Input Features layer that is updated when the tool is executed

## Testing
<!-- slide 4 -->
- Test on both UN and non-UN data
- Test with both UN and non-UN feature classes as the input layer to be updated
- Verify in UI, model builder, and python (inline and stand alone)

## Automation
<!-- slide 5 -->
Update existing automation for the tool (only if this change causes existing tests to fail).
Create new tests for the tool that incorporate this parameter.

## Documentation
<!-- slide 6 -->
Update the tool documentation for the new parameter.  Add a usage note about when the parameter would/wouldn’t appear.

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
