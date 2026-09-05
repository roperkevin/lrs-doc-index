# Use Async GP tool in Overlay Events for Feature Services

| Field | Value |
| --- | --- |
| **Doc** | 179 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Use AsyncGP tool in Overlay Events.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Use%20AsyncGP%20tool%20in%20Overlay%20Events.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2025-04-29 12:02 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | dynamic segmentation · overlay events · async tool · feature service · parallel processing · event editor |
| **Tools** | Overlay Events |

## Summary

This user story describes the need for an Event Editor to run dynamic segmentation operations on feature services without timeouts, improving performance by using an asynchronous tool and parallel processing. It includes testing plans to benchmark performance improvements and documentation updates to reflect these changes.

## Related documents

<!-- related:begin -->
- [Overlay Event Performance Improvements using Async tool and parallel processing – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6379-overlay-event-performance-improvements-using-async-tool.md>) — similar text 0.33 · 3 title words · 3 filename words · same surface <!-- rel:160 s=6.179 -->
- [Support performance improvements in Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/6954-support-performance-improvements-in-overlay-events.md>) — similar text 0.49 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:99 s=5.512 -->
- [Support Parallel Processing in Overlay Events GP Tool Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/support-parallel-processing-in-overlay-events-gp-2026-02-2.md>) — similar text 0.35 · 3 title words · 2 filename words · same surface <!-- rel:54 s=4.468 -->
- [Support Parallel Processing in Overlay Events GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-parallel-processing-in-overlay-events-gp-2026-02.md>) — similar text 0.35 · 3 title words · 2 filename words · same surface <!-- rel:53 s=4.468 -->
- [Spike: Performance improvement to Overlay Events/Query Attribute Set](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/performance-improvement-to-overlay-events-query-attribute.md>) — similar text 0.17 · 2 title words · 2 filename words · same surface/folder <!-- rel:227 s=4.203 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/edit-feature-services.html)

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Use Async GP tool in Overlay Events for Feature Services <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an Event Editor, I want to be to run dynamic segmentation operations that don’t time out on feature services, so I can run the operations often without delay or the need to restart services.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.).  These users will often run dynamic segmentation operations on the data and need to have the operations perform as quickly as possible, no matter whether in fgdb, direct connect, or feature services.

## Acceptance Criteria
### Overlay Events async tool <!-- slide 3 -->
- To improve performance, use the async tool when executing Overlay Events via a feature service instead of the Query Attribute Set operation we use today
- Also add support for parallel processing in the tool when run fgdb, direct connect, and via feature services to improve performance
- Also, as part of this story, utilize the new tool attributes for all the GP tools within the Location Referencing toolbox

## Testing
<!-- slide 4 -->
- Test the tool with fgdb, direct connect, and fs to benchmark performance before and after the enhancements (use the INDOT dataset with 10+ event layers and all the routes in the state)
- Test with and without parallel processing (we should see enhanced performance without parallel processing compared to before the changes and even faster performance with it enabled)
- Compare the benchmarks with the results from the spike completed by Sharon
- No need to test the actual results of the dynseg as the tool is automated

## Automation
<!-- slide 5 -->
No automation updates

## Documentation
<!-- slide 6 -->
Update the tool documentation to mention utilization of parallel processing to improve performance

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
