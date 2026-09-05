# Relocate Event Support for External Event with No Connection File

| Field | Value |
| --- | --- |
| **Doc** | 287 · Design Spike · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [RelocateEventsviaJSON&NoConnectionFile.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RelocateEventsviaJSON%26NoConnectionFile.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2024-11-18 23:33 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | relocate events · external event · connection file · event behaviors · event update · error handling · ad hoc request |
| **Tools** | Relocate Events |

## Summary

This document describes a design spike to enhance the Relocate Events tool to support external event data updates without requiring a connection file. It outlines user stories, requirements, testing plans, automation updates, and documentation changes for this new capability. The enhancement aims to maintain backward compatibility while enabling ad-hoc event data requests and handling error scenarios.

## Related documents

<!-- related:begin -->
- [Create External Event with No Connection File](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-external-event-with-no-connection-file.md>) — similar text 0.47 · 3 title words · 1 filename word · same surface/folder <!-- rel:288 s=4.752 -->
- [Relocate Events in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/relocate-events-in-pro.md>) — similar text 0.21 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:812 s=3.764 -->
- [Prototype: JSON requests and returns in REST for Relocate Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/prototype-json-requests-and-returns-in-rest-for-relocate.md>) — similar text 0.19 · 1 title word · 3 filename words · same kind/folder <!-- rel:298 s=3.76 -->
- [Relocate Events Support for External Event with No Connection File - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5987-relocate-events-support-for-external-event-with-no.md>) — similar text 0.16 · 5 title words · 1 filename word <!-- rel:264 s=3.61 -->
- [Support updating External Event configuration](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-external-event-configuration.md>) — similar text 0.21 · 3 title words · same surface/folder <!-- rel:744 s=3.383 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[External event registration](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/external-event-registration.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)

_No page matched:_ [Relocate Events](https://www.google.com/search?q=%22Relocate%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Relocate Event support for external event with no connection file

Spike

## Slide 2 — User Story

As an external system integrator, I need to be able to get updates to external event data on demand without a connection file, so I can deploy my external data in any method without requiring a permanent connection to the LRS.
Persona
External System Integrator: These users are responsible for configuring and syncing external systems with the authoritative LRS (in Roads and Highways).  As they move their LRS to the cloud, the legacy connection file requirement for external events is causing issues.  They need the Relocate Events operation to allow them to send the event information in the request and no longer read from a read only connection to the external data.  This story will enhance Relocate Events to support the new external event type with no connection file as well as ad-hoc requests where there is no external event registered with the LRS.

## Slide 3 — Requirements

- Enhance the Relocate Events tool to support users who don’t have a connection file but want to get external event data updated
- Two new parameters will need to be added
  - Events (would include the RouteID, ToRouteID, Measure, To Measure, EventID, From Date, To Date).  All would be optional except for RouteID, Measure, ToRouteID and To Measure depending on the event type).  This parameter would be required for both new patterns where there is no connection file.
  - Event Behaviors (would include the event behavior for each edit activity type).  This parameter would be required if there is no external event registered with the LRS, otherwise it would be ignored if there is an external event registered.
- None of the event behavior logic in the tool should change with these additions to the tool
- Add error handling for scenarios where required parameters aren’t populated or are populated with incorrect inputs
- Determine a general limit on the number of records that can be processed without the tool failing
- Make sure the tool remains backwards compatible for the legacy pattern with connection files
- Share the updated signature with the other Software Engineers and Will for approval before beginning any development

## Slide 4 — Testing

- Verify the tool works with the legacy connection file external event
- Test with both new methods, external event with no connection file and ad hoc request with event behaviors included
- Test with many events to determine/verify the upper limits of number of records that can be processed successfully
- Test populating parameters that are not required to ensure they’re ignored
- Test not including required parameters
- Test with providing event behaviors that aren’t supported for the event type (cover for point events for example)
- Utilize the pattern in the original Relocate Events story to verify that the output of the tool is correct.  The focus here in the inputs and making sure they work, so there is no need to verify hundreds/thousand of event records for accuracy, a dozen or so would be fine since the underlying event behavior logic isn’t changing.

## Slide 5 — Automation

- Add additional cases to the existing automation for the tool for these new patterns

## Slide 6 — Documentation

- Update the Relocate Event documentation to account for these new parameters and their use
- Make sure to mention the upper limit of number of records that can be processed with the new patterns that don’t have a connection file
- Update the External System Integration with ArcGIS Roads and Highways topic to discuss these enhancements to the Relocate Events tool.  It would be good to mention the three patterns supported and provide examples of the output of the tool (showing a table of the results would be good)

## Slide 7 — Assignment

Story Points:
Dev:
