# Append Routes Partial Loading Support

| Field | Value |
| --- | --- |
| **Doc** | 165 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Append Routes partial loading support.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Append%20Routes%20partial%20loading%20support.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2025-05-25 20:30 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | append routes · partial loading · route loading · error handling · output files · bulk loading |
| **Tools** | Append Routes |

## Summary

This document describes a user story for enhancing the Append Routes tool to support partial loading of routes when some routes fail to load. It specifies adding an optional parameter to allow loading of valid routes while skipping problematic ones, generating output files for failed routes with explanations. Testing, automation, and documentation updates are also outlined.

## Related documents

<!-- related:begin -->
- [Append Events Partial Loading Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-events-partial-loading-support.md>) — similar text 0.90 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:164 s=9.036 -->
- [Append Routes with existing Utility Network centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-with-existing-un-centerlines.md>) — similar text 0.32 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:741 s=4.791 -->
- [Support Optional Date Field Mapping in Append Events Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-optional-date-field-mapping-in-append-events-tool.md>) — similar text 0.29 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:143 s=4.772 -->
- [Allow Append Events to Run When Locks Are Present on Impacted Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-append-events-to-run-when-locks-are-present.md>) — similar text 0.33 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:168 s=4.766 -->
- [Append Routes Consider Existing Centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/3004-append-routes-consider-existing-centerlines.md>) — similar text 0.31 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:486 s=4.53 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Append Routes partial loading support <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Loader, I need the ability to have bulk route loading partially complete if there are issues, so that I can still get some routes loaded while I revisit fixing routes that failed to load.

Persona
LRS data loader: This user is responsible for initial and supplemental bulk data loading in the LRS.  When there are many routes to be loaded and one or more have an issue, the entire batch of routes fails to load.  To make the loading process easier, we should allow partial loading of the good routes in this scenario and provide an output file of the routes that don’t load correctly (with good explanation of how to fix them).

## Acceptance Criteria
### Append Routes partial loading <!-- slide 3 -->
- Add a new parameter to the Append Routes tool called “Allow partial loading of routes”
  - Parameter would be optional
  - In the UI in Pro, it would be placed at the bottom of the tool
- When disabled, the tool should work the same way it does today
- When enabled, the tool should continue to load routes as it does today, however, if any of the routes have issues that would have caused the tool to fail in the past do the following:
  - Don’t load those routes (or corresponding centerlines/centerline sequence records)
  - Load all the other routes without issues as expected
  - Have the tool complete and provide warning messages about some routes not being able to be loaded
  - Provide two output files: 1. A feature class of all the routes that didn’t load correctly (this can just be a copy of the input feature class with the records that didn’t load exactly as they were in the input and 2. A text file with a list of the routes that couldn’t be loaded and good detailed explanation for why they weren’t able to be loaded
- This will result in new error messages being added or existing error messages being detailed further

## Testing
<!-- slide 4 -->
- Test with a mix of roads and pipeline data
- Test with line, non line, and postmile networks
- Test with and without the existing centerline option
- Test with Pro UI, python inline, python stand alone, and model builder

## Automation
<!-- slide 5 -->
- Add new automation cases in python for the tool
- Note that the existing automation for the tool may fail and need updated to account for the new parameter

## Documentation
<!-- slide 6 -->
- Update the usage notes of the GP topic for the tool to mention this new option and its usage
- Make sure to mention the output files and how they can use them to fix the routes that didn’t get loaded

## Assignment
<!-- slide 7 -->
Story Points:
Dev:  days
PE:  days
