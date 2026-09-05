# Export Network in Pro

| Field | Value |
| --- | --- |
| **Doc** | 806 · Design Spike · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [Export Network in Pro.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Export%20Network%20in%20Pro.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2020-05-10 23:23 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | export network · routes · concurrencies · gaps · asynchronous gp tool · rest api · external system integration |
| **Tools** | Export Network · Find Concurrencies |

## Summary

This document covers the design and user story for migrating the Export Network geoprocessing tool from ArcGIS Server 10.x to ArcGIS Pro 11 as an asynchronous GP tool. It details the tool's functionality to export LRS network data including routes, gaps, and concurrencies, integration with external systems, REST API exposure, error handling, and testing requirements.

## Related documents

<!-- related:begin -->
- [Relocate Events in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/relocate-events-in-pro.md>) — similar text 0.45 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:812 s=5.122 -->
- [Support line networks and JSON in Export Network](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-line-networks-and-json-in-export-network.md>) — similar text 0.38 · 2 title words · 2 filename words · same surface/folder <!-- rel:805 s=4.696 -->
- [Test Plan for Supporting JSON in Export Network](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/for-supporting-json-in-export-network.md>) — similar text 0.18 · 2 title words · 2 filename words <!-- rel:639 s=3.265 -->
- [Esri Roads and Highways and AgileAssets Integration Technical Specification](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/esri-rh-and-agileassets-integration-technical-specification.md>) — similar text 0.23 · same folder <!-- rel:810 s=2.095 -->
- [Append Routes with existing Utility Network centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-with-existing-un-centerlines.md>) — similar text 0.17 · 1 title word · same surface/folder <!-- rel:741 s=1.91 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Methods for calibrating routes with physical gaps](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/methods-for-calibrating-routes-with-physical-gaps.html)

_No page matched:_ [Export Network](https://www.google.com/search?q=%22Export%20Network%22+site%3Adoc.esri.com) · [Find Concurrencies](https://www.google.com/search?q=%22Find%20Concurrencies%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Export Network in Pro

Spike

## Slide 2 — User Story

As a LRS external system data owner, I need the ability to export my LRS Network and associated information like concurrencies and translations to external business systems outside the LRS gdb, so that I can keep my external system data up to date with the authoritative LRS.

Cases

- External System integration

## Slide 3 — Export Network as an async GP tool

- Migrate the existing Export Network GP tool from ArcGIS Server 10.x to AO11
- See subsequent slides to see the original acceptance criteria, but note some of the original acceptance criteria was not implemented.  What the tool currently does in ArcMap should be what it does in AO11.
- Change the tool from being present in desktop and being published as a GP service in Server to an Asynchronous GP tool that automatically deploys in our toolbox in ArcGIS Server
- Require the inputs to the tool to be from a LR/VMS enabled service
- Expose the tool through a REST interface so users can populate the parameters to execute the tool
- Users should also be able to execute through python or another language for cases where calling the tool is scripted or written into a partner/external application
- Follow the same pattern as our other GP tools that provide an output link with a zip or other file (Generate Routes, Append Routes, etc.)

## Slide 4 — Original Acceptance Criteria

- See attached document
- Implement export LRS network GP services
- Support exporting:  1. Routes  2. Gaps  3. Concurrencies
- (leave implementation of the transaction ID parameter for a future iteration)
- For concurrencies, assume there is no dominant route (should be a parameter in the existing tool to ignore route dominance)
- For this iteration, only export the FGDB option (save JSON, CSV, and shapefile for future iterations)
- LRM translation:
  - Multimatch: log situation and output GP message, choose one
  - No match: do not output record, but output a GP message and in log file
  - Partial match: create a record for the part that can be translated. log occurrence in GP and log file.
- Produce a log file (same as GP messages)

## Slide 5 — Original Acceptance Criteria continued

- Modify the REST API interface to align with changes that have taken place in the design since the initial user story to export the network.
- Add support for the following parameters: lrsTime, lastLrsTime, lastInvokedTime
- Defer support for priority routes for now until we have that fully implemented.
- Return routes and related information for:
  - route changes for the desired LRS time (start and end time on route)  that were editing between the last time of invokation and current time of invokation (LRS edit log edit time)
  - OR
  - routes that were edited before the last time of invokation (LRS edit log edit time)  but apply to a current LRS time and didn't apply to the previous LRS time (start and end time on route)

## Slide 6 — Original Acceptance Criteria continued

- Record supplemental load in the edit log, for loading.
- Do not apply event behaviors.
- Make a separate log entry for loading... a separate load type with a different activity number.
- The XML entry should seem homogenous when compared against the existing entries...
- Route ID column should be <null>
- Should not break measure behaviors, they should be ignored.
- Don't fail of someone deletes a route in the list.
- Do for initial data load as well.
- No need to distinguish replaced routes vs. new routes.
- Presently the export network tool when used with dates, does not return the supplement/additional loaded routes.
- Export routes loaded, concurrency and LRM translation for supplemental loaded route(s).
- Verify: Depending on what approach we take to implement this, verify the relocate events.

## Slide 7 — Original Acceptance Criteria continued (Concurrencies)

- This should already be implemented in the concurrency tool
- GP tool for FindConcurrencies is in RH toolbox
- GP tool supports gods view
- GP tool for now does not support intermediate CPs
- GP tool will support selection of routes and can either report all concurrencies with selected routes or all concurrencies for selected routes
- Implicitly honor RH dominance rules via Find Concurrencies tool in Export Network concurrencies table.
- Use logic developed as part of Find Concurrencies to output only records for the dominant route (as dominant) for a given concurrency.
- If 3 concurrent routes in a section, there should be 2 records. One for each subordinate route... with the dominate route marked as such. (within time range)
- Route measures should follow direction of dom. route. Dom route measurers should be such that From measure <= To measure.
- ...if subordinate route measures at that location do not follow From measure <= To measure ... that's OK. Report them the way they are.
- Update doc to reflect dominance output

## Slide 8 — Error Conditions

- If Location Referencing is not licensed on ArcGIS Server and a gp tool from the location referencing toolbox is executed with REST data sources, provide an error alerting the user that Location Referencing is not licensed.
- Write these errors into the Server Log.

## Slide 9 — Testing

- Verify the results match when the tool is run against an ArcMap published service on a Roads and Highways dataset, then on the same dataset with a Pro published service
- Test with a large dataset with concurrent routes, multiple networks, and gaps
- Test with Roads and Highways and Pipeline data
- Test with both line and non line networks
- Test through REST and whatever scriptable language is supported (python, javascript, etc.)

## Slide 10 — Automation

- Automate the tool (FS only).

## Slide 11 — Documentation

- Create a GP topic for the new tool (can use the existing ArcMap topic as a guide)
- Add to the topic related to external system integration process

## Slide 12 — Assignment

Story Points:
Dev:
PE:
