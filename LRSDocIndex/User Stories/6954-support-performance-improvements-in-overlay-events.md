# Support performance improvements in Overlay Events

| Field | Value |
| --- | --- |
| **Doc** | 99 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#6954](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6954) |
| **Source** | [OverlayEventsPerformanceImprovements.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/OverlayEventsPerformanceImprovements.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2025-12-08 19:07 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | overlay events · dynamic segmentation · performance improvements · event editor · adm datasets |
| **Tools** | Overlay Events |

## Summary

This user story addresses performance improvements for the Overlay Events geoprocessing tool to enable dynamic segmentation operations on large datasets without timing out. It targets Event Editors who require efficient processing across file geodatabases, direct connect, and feature services. Testing focuses on ADM datasets to benchmark performance before and after enhancements, with automation added if missing.

## Related documents

<!-- related:begin -->
- [Iteration Planning and Issue Tracking for Esri LRS Development](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Schedules/363-iteration-planning-and-issue-tracking-for-esri-lrs.md>) — shared issue ArcGISPro/ps-location-referencing#6954 · similar text 0.12 · same surface/folder <!-- rel:59 s=1002.079 -->
- [Use Async GP tool in Overlay Events for Feature Services](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/use-async-gp-in-overlay-events-for-feature-services.md>) — similar text 0.49 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:179 s=5.512 -->
- [Overlay Event Performance Improvements using Async tool and parallel processing – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6379-overlay-event-performance-improvements-using-async-tool.md>) — similar text 0.14 · 3 title words · 3 filename words · same surface <!-- rel:160 s=4.487 -->
- [Spike Benchmark Overlay Events in GP vs API](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/benchmark-overlay-events-in-gp-vs-api.md>) — similar text 0.21 · 2 title words · 2 filename words · same surface/folder <!-- rel:185 s=4.086 -->
- [Spike: Profile Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/profile-overlay-events-gp.md>) — similar text 0.18 · 2 title words · 2 filename words · same surface/folder <!-- rel:110 s=4.076 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support performance improvements in Overlay Events <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an Event Editor, I want to be to run dynamic segmentation operations on large datasets that don’t time out, so I can run the operations often without delay or the need to move data to file geodatabase.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.).  These users will often run dynamic segmentation operations on the data and need to have the operations perform as quickly as possible, no matter whether in fgdb, direct connect, or feature services.

## Acceptance Criteria
### Overlay Events performance improvements <!-- slide 3 -->
- In the Overlay Events GP tool, implement the ADM configured recommendations from the spike around performance improvements
- See https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6954#issuecomment-5922889 and https://devtopia.esri.com/ArcGISPro/PS-Products/pull/10950 for information about the improvements
- Will we get these performance improvements in Query Attribute Set as well?

## Testing
<!-- slide 4 -->
- Test the tool with fgdb, direct connect, and fs to benchmark performance before and after the enhancements
- Focus testing on the ADM datasets we have as that’s where the performance improvements should be seen
- Run 1-2 tests on non-ADM datasets just to ensure no issues are introduced
- Verify automation results once the changes are checked in to ensure no changes to results logic are implemented

## Automation
<!-- slide 5 -->
If we don’t have automation for the tool with ADM, we should add it with this story

## Documentation
<!-- slide 6 -->
No documentation updates for this story

## Assignment
<!-- slide 7 -->
Story Points:
Dev:  days
PE:  days
