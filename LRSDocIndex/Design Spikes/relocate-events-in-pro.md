# Relocate Events in Pro

| Field | Value |
| --- | --- |
| **Doc** | 812 · Design Spike · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [Relocate Events in Pro.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Relocate%20Events%20in%20Pro.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2020-05-06 20:47 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | relocate events · geoprocessing tool · asynchronous gp tool · external system integration · event data · feature service · linear referencing · event measure behavior |
| **Tools** | Relocate Events |

## Summary

This document covers the relocation of events in ArcGIS Pro by migrating the existing Relocate Events geoprocessing tool from ArcGIS Server 10.x to ArcGIS Pro 11 as an asynchronous GP tool. It includes user story requirements, acceptance criteria, error handling, testing plans, automation, and documentation tasks related to the tool and its integration with external systems.

## Related documents

<!-- related:begin -->
- [Export Network in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/export-network-in-pro.md>) — similar text 0.45 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:806 s=5.122 -->
- [Relocate Events support for Reassign to a New Line](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/relocate-events-support-for-reassign-to-a-new-line.md>) — similar text 0.27 · 2 title words · 2 filename words · same surface/folder <!-- rel:537 s=4.141 -->
- [Relocate Event Support for External Event with No Connection File](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/relocate-event-support-for-external-event-with-no-connection.md>) — similar text 0.21 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:287 s=3.764 -->
- [Configure External Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/configure-external-events.md>) — similar text 0.22 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:811 s=3.614 -->
- [Generate Calibration Points Tool Feature Service Support User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/generate-cp-tool-feature-service-support.md>) — similar text 0.42 · same surface/folder <!-- rel:662 s=3.005 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Events data model](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/events-data-model.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/edit-feature-services.html) · [Multiple linear referencing methods](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/multiple-linear-referencing-methods.html)

_No page matched:_ [Relocate Events](https://www.google.com/search?q=%22Relocate%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Relocate Events in Pro

Spike

## Slide 2 — User Story

As a LRS external system data owner, I need the ability to sync and receive updates to my event data stored outside the LRS gdb, so that I can keep my external system data up to date with the authoritative LRS.

Cases

- External System integration

## Slide 3 — Relocate Events as an async GP tool

- Migrate the existing Relocate Events GP tool from ArcGIS Server 10.x to AO11
- See subsequent slides to see the original acceptance criteria, but note some of the original acceptance criteria was not implemented.  What the tool currently does in ArcMap should be what it does in AO11.
- Change the tool from being present in desktop and being published as a GP service in Server to an Asynchronous GP tool that automatically deploys in our toolbox in ArcGIS Server
- Require the inputs to the tool to be from a LR/VMS enabled service
- Expose the tool through a REST interface so users can populate the parameters to execute the tool
- Users should also be able to execute through python or another language for cases where calling the tool is scripted or written into a partner/external application
- Follow the same pattern as our other GP tools that provide an output link with a zip or other file (Generate Routes, Append Routes, etc.)

## Slide 4 — Original Acceptance Criteria

- See attached documents (Word doc is attached to the user story in devtopia)
- Implement the relocateEvents service for extend route workflow using the new "LRS_EDIT_LOG".
- For this iteration, do not implement "acknowledge"
- Also, do not bookkeep that the service was called by the client at this release.
- Build event measure behavior logic as a reusable library we can eventually port to the desktop workflows and GP workflows where we can remove (as an option) the execution of event behaviors from the thread of execution of the user
- Need to ensure that after a route is processed, if it needs to be processed again that the already processed events are used.
- ...need to persist processed events.
- ...in memory database (concern=large data volumes)?
- ...or FGDB (concern=read/write performance)?
- Should list of transactions be looked at and only routes that have more than one transaction have be processed from the copy?
- Should we just copy all the routes events for the processing to the copy to simplify business logic?
- Is it a GP service? Seems yes for asynchronous support
- only CSV

## Slide 5 — Original Acceptance Criteria continued

- Add support to output the results as a JSON file that holds a featureSet.
- Also add support to output the JSON with or without geometry of the events (shape should be derived from the new measures and the effectivity of them)
- Also add support to output a feature class of the result (shape should be derived from the new measures and the effectivity of them)
- Make sure to output the location error column if the result has a shape, as a string
- Put this tool into the toolbox
- Fix help so publishing doesn't force description entry for parameters
- Don't generate a zip file
- Don't include the parameters csv
- Output as another GP parameter the invoked time
- Include help for the parameters
- Include help topic on publishing this tool to support external systems getting measure behaviors
- swap 2 and 3 time parameters order in tool
- run by gp team the parameter out/in design

## Slide 6 — Error Conditions

An appropriate error should be reported if the Feature Service or Map Service with Linear Referencing capability:

  - Goes offline during processing
  - Runs out of available instances
  - Runs against an unlicensed Server
- If a layer from a Feature Service is provided without the Linear Referencing or Version Management capability, display error
- An error should be displayed if a Feature Service provided as an input does not have a required field published as visible (i.e. Event measure, from data, to date, etc.)
- If Location Referencing is not licensed on ArcGIS Server and a gp tool from the location referencing toolbox is executed with REST data sources, provide an error alerting the user that Location Referencing is not licensed.
- If the Location Referencing toolbox is shutting down when a request comes in, give an error message alerting the user that the service is busy, please try again.
- If a read/write lock exists on the version of the data being processed, give the user and error and alert them that another user is accessing the data in that version.
- If user does not have access to all the event layers that will be updated, give the same error message as we do today when there is a client-server connection.
- Write these errors into the Server Log.

## Slide 7 — Testing

- When testing feature services, make sure the user does not have permissions to access the feature classes directly.
- Verify the results match when the tool is run against an ArcMap published service on a Roads and Highways dataset, then on the same dataset with a Pro published service
- Verify the results of the tool vs running Apply Event Behaviors on an internal event with the same behaviors/records produce the same results
- Test with data with thousands of LRS edits in the edit log
- Test with Roads and Highways and Pipeline data
- Test with both line and non line networks
- Test on line and point events
- Test with events that do and do not span routes
- Test with all of the edit activities in the edit log (extend, retire, realign, reassign, calibrate, cartographic realignment)

## Slide 8 — Automation

- Automate the tool (FS only).

## Slide 9 — Documentation

- Create a GP topic for the new tool (can use the existing ArcMap topic as a guide)
- Create a topic related to external system integration process (Register External Event, use Relocate Events to get changes as often as needed)

## Slide 10 — Assignment

Story Points:
Dev:
PE:
