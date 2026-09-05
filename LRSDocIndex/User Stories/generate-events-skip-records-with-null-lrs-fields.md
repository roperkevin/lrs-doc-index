# Generate Events Skip Records with Null LRS Fields

| Field | Value |
| --- | --- |
| **Doc** | 104 · User Story · Pro |
| **Product** | Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [Generate Events Skip Records with null LRS fields.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Generate%20Events%20Skip%20Records%20with%20null%20LRS%20fields.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2025-11-20 15:40 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | generate events · pipe characteristics · null routeid · measure fields · event records · lrs editor · apr un |
| **Tools** | Generate Events |

## Summary

Describes a user story for LRS Editors to model pipe characteristics in a single feature class containing both linear referenced and non linear referenced pipes. Introduces an optional parameter in the Generate Events geoprocessing tool to ignore event records with null routeID and measure fields, preventing shape or attribute changes for non LRS data. Includes testing, automation, and documentation updates for this capability.

## Related documents

<!-- related:begin -->
- [Generate Events GP Tool Ignore Null Parameter Acceptance Tests](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/generate-events-gp-ignore-null-parameter.md>) — similar text 0.30 · 3 title words · 3 filename words · same surface <!-- rel:52 s=5.298 -->
- [Support Optional Date Field Mapping in Append Events Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-optional-date-field-mapping-in-append-events-tool.md>) — similar text 0.20 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:143 s=3.799 -->
- [Allow Append Events to Run When Locks Are Present on Impacted Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-append-events-to-run-when-locks-are-present.md>) — similar text 0.29 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:168 s=3.679 -->
- [Generate Intersections at Route Endpoints](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-intersections-at-route-endpoints.md>) — similar text 0.21 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:267 s=3.37 -->
- [Allow LRS Events and Intersections in Update Measures from LRS tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-lrs-events-and-intersections-in-update-measures.md>) — similar text 0.21 · 1 title word · same kind/surface/folder <!-- rel:393 s=2.941 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Generate Events](https://www.google.com/search?q=%22Generate%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Generate Events skip records with null LRS fields <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Editor, I need the ability to model pipe characteristics on both linear referenced and non linear referenced pipe in a single feature class, so that I can query and analyze this data without having to create views/temporary layers.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. For editors at organizations using both APR and the UN, they have some pipeline characteristics that exist on all pipe (both LRS and non LRS).  Instead of modeling these as two different feature classes (one as an LRS event and the other as a regular feature class), they want to put them all in a single feature class (the LRS event).  To support this, we need to add an option in Generate Events to skip/ignore records that have null routeID/measure columns since the non LRS data won’t have these fields populated and shouldn’t have its shape impacted or a loc error added when being run through the tool.

## Acceptance Criteria
### Ignore null routeID /measure fields option <!-- slide 3 -->
- In the Generate Events GP tool, add a new optional parameter called “Ignore events with null routeID and measure fields”
- Default is false/unchecked
- In the Pro UI, this option should only appear when an event in an LRS with the UN configured is selected
- When unchecked, the tool should work as it does today
- When checked, any event records that have null RouteID and Measure(s) fields should be ignored
- Ignored means we don’t make any changes to the shape or attributes of the feature
- Provide a list of OIDs of event records that were skipped in the text output file for the tool

## Testing
<!-- slide 4 -->
- Test using APR-UN datasets with both point and line events
- Use an APR only dataset to verify that the option isn’t available
- Split testing between FS, FGDB, and DC EGDB
- Verify in model builder and python as well

## Automation
<!-- slide 5 -->
- Add a few automation cases for this new capability to the existing python automation for this tool

## Documentation
<!-- slide 6 -->
- Update documentation for the topic to include this new parameter
- In the usage notes explain how this parameter is designed for combined APR-UN deployments when pipe characteristics exist on both linear referenced and non linear referenced pipes
- Consider finding a place to include this in the combined APR-UN topic we have in the APR help

## Assignment
<!-- slide 7 -->
Story Points:
Dev:  days
PE:  days
