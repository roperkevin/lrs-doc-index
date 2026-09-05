# Support line networks and JSON in Export Network

| Field | Value |
| --- | --- |
| **Doc** | 805 · User Story · Pro |
| **Product** | Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [Support line networks and JSON in Export Network.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20line%20networks%20and%20JSON%20in%20Export%20Network.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2020-05-12 22:32 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | line network · export network · json output · concurrency · translations · pipeline referencing |
| **Tools** | Export Network |

## Summary

This document describes the user story and requirements for adding support for line networks and JSON output format in the Export Network asynchronous tool. It includes details on handling line IDs, line order, gaps, concurrencies, and translations, as well as testing and automation plans. The goal is to enable exporting LRS network data to external business systems and support scripting through REST and Python.

## Related documents

<!-- related:begin -->
- [Test Plan for Supporting JSON in Export Network](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/for-supporting-json-in-export-network.md>) — similar text 0.27 · 3 title words · 3 filename words <!-- rel:639 s=5.52 -->
- [Export Network in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/export-network-in-pro.md>) — similar text 0.38 · 2 title words · 2 filename words · same surface/folder <!-- rel:806 s=4.702 -->
- [Relocate Events support for Reassign to a New Line](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/relocate-events-support-for-reassign-to-a-new-line.md>) — similar text 0.22 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:537 s=3.454 -->
- [Generate LRS Data Product: Create Mileage Report for Line Networks](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5813-generate-lrs-data-product-create-mileage-report-for-line.md>) — similar text 0.02 · 2 title words · 1 filename word · same surface <!-- rel:338 s=3.013 -->
- [Support adding External Event to Pro map/local scene](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-adding-external-event-to-pro-map-local-scene.md>) — similar text 0.17 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:745 s=2.922 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html)

_No page matched:_ [Export Network](https://www.google.com/search?q=%22Export%20Network%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support line networks in Export Network <!-- slide 1 -->
Spike

### User Story <!-- slide 2 -->
As a LRS external system data owner, I need the ability to export my LRS Network and associated information like concurrencies and translations to external business systems outside the LRS gdb, so that I can keep my external system data up to date with the authoritative LRS.

Cases

- External System integration

## Acceptance Criteria
### Line Networks in Export Network <!-- slide 3 -->
- Add support to the Export Network async tool for Line Networks
  - In the Routes feature class, add the Line ID and Line Order fields
  - In the Gaps table, only consider gaps within a route at this time (gaps between routes on a line can be addressed in the future if asked for)
  - In the Concurrency table, only consider concurrencies on a route by route basis (not for a line)
  - In the Translations table, add a Line ID column to the output
  - In the Translations table, only consider translations from route to route (ignore any merging between routes on the same line, we can address in the future if asked for)

### JSON as an output format <!-- slide 4 -->
- Add support for JSON as an output format for the tool
- Do we want to return a raw JSON response or zip it up like we do for FGDB?

## Testing
<!-- slide 5 -->
- Verify non line networks still work (a single run of the tool would be sufficient)
- Test on line networks
- Test using Pipeline Referencing data
- Test through REST and whatever scriptable language is supported (python, javascript, etc.)
- Users should also be able to execute through python for cases where calling the tool is scripted or written into a partner/external application

## Automation
<!-- slide 6 -->
- Automate the tool (FS only).
- Automate in python.  Use that python script as a sample we can provide our end user/business partners.

## Documentation
<!-- slide 7 -->
- Add to the existing REST and GP documentation

## Assignment
<!-- slide 8 -->
Story Points:
Dev:
PE:
