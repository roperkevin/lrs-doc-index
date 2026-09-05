# Support populating Route Name in Update Measures from LRS tool

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Utility Network |
| **Source** | [Support populating Route Name in Update Measures from LRS.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20populating%20Route%20Name%20in%20Update%20Measures%20from%20LRS.pptx>) |
| **Edited** | 2021-07-15 23:54 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support populating Route Name in Update Measures from LRS tool"
source_file: "Support populating Route Name in Update Measures from LRS.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20populating%20Route%20Name%20in%20Update%20Measures%20from%20LRS.pptx"
doc_id: 704
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2021-07-15T23:54:24Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["route name", "update measures", "user story", "lrs analyst", "pipeline"]
tools: ["Update Measures from LRS"]
products: ["Utility Network"]
issues: []
related: [{"doc":266,"file":"support-events-spanning-routes-in-update-measures-from-lrs__doc266.md","s":5.543},{"doc":273,"file":"support-search-tolerance-parameter-in-update-measures-from-lrs-tool__doc273.md","s":4.651},{"doc":710,"file":"consider-concurrencies-in-update-measures-from-lrs__doc710.md","s":4.364},{"doc":678,"file":"related-table-for-intersection-measures__doc678.md","s":4.041},{"doc":280,"file":"update-measures-from-lrs-populate-route-name-test-plan__doc280.md","s":3.553}]
```
-->

## Summary

This user story describes adding an optional Route Name parameter to the Update Measures from LRS tool to populate the route name field in the output. It covers the parameter's behavior in the UI, conditions for its availability, and testing requirements across different data types and interfaces. It also includes automation and documentation updates related to this new parameter.

## Related documents

<!-- related:begin -->
- [Support Events Spanning Routes in Update Measures from LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-events-spanning-routes-in-update-measures-from-lrs__doc266.md>) — similar text 0.61 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:266 -->
- [Support Search Tolerance Parameter in Update Measures from LRS Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-search-tolerance-parameter-in-update-measures-from-lrs-tool__doc273.md>) — similar text 0.17 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:273 -->
- [Consider concurrencies in Update Measures from LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/consider-concurrencies-in-update-measures-from-lrs__doc710.md>) — similar text 0.42 · 1 title word · 2 filename words · same kind/surface/folder <!-- rel:710 -->
- [Related Table for Intersection Measures](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/related-table-for-intersection-measures__doc678.md>) — similar text 0.38 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:678 -->
- [Update Measures From LRS: Populate Route Name Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/update-measures-from-lrs-populate-route-name-test-plan__doc280.md>) — similar text 0.08 · 3 title words · 2 filename words · same surface <!-- rel:280 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html)

_No page matched:_ [Update Measures from LRS](https://www.google.com/search?q=%22Update%20Measures%20from%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support populating Route Name in Update Measures from LRS tool

User Story

## Slide 2 — User Story

As a LRS Analyst, I want the route name field populated when running Update Measures from LRS tool, so I can easily see the human readable/colloquial name for the route in the output of the tool.
Persona
LRS Analyst: This user is responsible for analysis and reporting on LRS data.  This user may also have other titles/responsibilities within the organization, such as LRS editor or HPMS coordinator.  For the analyst role, this user utilizes other tools/capabilities within the Esri ecosystem as well as via home built and partner solutions. These users may have features that aren’t managed by the LRS that they need to get the route and measure via the Update Measures from LRS tool.  For users in an organization that utilizes the Route Name field in their network, they will want that field populated in the output for the Update Measures from LRS tool (whether that’s the UN pipeline line, another UN feature, or some other feature they want to be linear referenced).  In many pipeline operators, they use the Route Name field more commonly within the organization than the route ID field.

## Slide 3 — Route Name in Update Measures from LRS

Add an optional parameter to the Update Measures from LRS tool called Route Name
This parameter would appear in the UI once a network with the route name configured is selected in the tool, but will remain optional
If a network without route name configured is selected, the parameter shouldn’t appear in the UI
If no route name is present in the network selected, the parameter shouldn’t be active and should fail in python if populated
The parameter UI dropdown in Pro should include any fields in the Input Features layer that meet the field type/length of the route name field in the LRS Network layer in the tool
If the parameter is populated, we should populate the route name from the LRS Network for each record in the Input Features layer that is updated when the tool is executed

## Slide 4 — Testing

Test on both UN and non-UN data
Test with both UN and non-UN feature classes as the input layer to be updated
Verify in UI, model builder, and python (inline and stand alone)

## Slide 5 — Automation

Update existing automation for the tool (only if this change causes existing tests to fail).
Create new tests for the tool that incorporate this parameter.

## Slide 6 — Documentation

Update the tool documentation for the new parameter.  Add a usage note about when the parameter would/wouldn’t appear.

## Slide 7 — Assignment

Story Points:
Dev:
PE:
