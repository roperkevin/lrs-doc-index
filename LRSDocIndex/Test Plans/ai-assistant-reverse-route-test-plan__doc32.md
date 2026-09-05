# AI Assistant Reverse Route Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [AI_Assistant_reverseroute_testplan_v1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/AI_Assistant_reverseroute_testplan_v1.pptx>) |
| **Edited** | 2026-05-15 18:28 by Kevin Roper |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "AI Assistant Reverse Route Test Plan"
source_file: "AI_Assistant_reverseroute_testplan_v1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/AI_Assistant_reverseroute_testplan_v1.pptx"
doc_id: 32
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: "V1"
target_release: ""
pe: ""
dev: ""
author: "Praveen Kumar"
last_edited_by: "Kevin Roper"
last_edited: "2026-05-15T18:28:16Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["route reversal", "reverse tool", "route direction", "route orientation", "route calibration", "roads and highways", "pipeline referencing", "feature services"]
tools: ["Reverse tool"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":98,"file":"create-route-ai-assistant-test-plan__doc98.md","s":4.389},{"doc":109,"file":"pro-ai-assistant-reverse-route-user-story__doc109.md","s":3.596},{"doc":55,"file":"perform-an-action-with-the-arcgis-pro-assistant-beta__doc55.md","s":2.965},{"doc":62,"file":"perform-an-action-with-the-arcgis-pro-assistant-beta__doc62.md","s":2.964},{"doc":907,"file":"perform-an-action-with-the-arcgis-pro-assistant-beta__doc907.md","s":2.96}]
```
-->

## Summary

Test plan for the AI Assistant Reverse Route tool covering multiple scenarios of reversing route direction, orientation, and calibration in the 'countylog' network and other networks within Roads and Highways and Pipeline Referencing. Includes prompts for route reversal operations, help prompts for tool usage, and notes on testing conditions such as feature services, data types, and locale variations.

## Related documents

<!-- related:begin -->
- [Create Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/create-route-ai-assistant-test-plan__doc98.md>) — similar text 0.25 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:98 -->
- [Pro AI Assistant Reverse Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-reverse-route-user-story__doc109.md>) — similar text 0.17 · 3 title words · 1 filename word · same surface <!-- rel:109 -->
- [Perform an action with the ArcGIS Pro Assistant (Beta)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/perform-an-action-with-the-arcgis-pro-assistant-beta__doc55.md>) — similar text 0.15 · 1 title word · 1 filename word · same surface <!-- rel:55 -->
- [Perform an action with the ArcGIS Pro Assistant (Beta)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/perform-an-action-with-the-arcgis-pro-assistant-beta__doc62.md>) — similar text 0.17 · 1 title word · 1 filename word · same surface <!-- rel:62 -->
- [Perform an action with the ArcGIS Pro Assistant (Beta)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/perform-an-action-with-the-arcgis-pro-assistant-beta__doc907.md>) — similar text 0.17 · 1 title word · 1 filename word · same surface <!-- rel:907 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior for route reversal](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-behavior-for-route-reversal.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/edit-feature-services.html)

_No page matched:_ [Reverse tool](https://www.google.com/search?q=%22Reverse%20tool%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

AI Assistant – Reverse Route
Scenario 1

## Slide 2

| No | Prompt |
| --- | --- |
| 1 | Apply Reverse tool to flip route "R1" direction from 01/01/2010 in 'countylog' network in Roads and highways |
| 2 | Change the route "R1" orientation from 01/01/2010 in 'countylog' network |
| 3 | Change the route "R1" direction from 01/01/2010 in ' countylog ' network |
| 4 | Change the route "R1" from 01/01/2010 in ' countylog ' network to the opposite direction |
| 5 | Create a reversed route "R1" from 01/01/2010 in ' countylog ' network |
| 6 | Flip route "R1" calibration from 01/01/2010 in 'countylog' network |
| 7 | Flip route "R1" calibration direction from 01/01/2010 in 'countylog' network in LRS. |
| 8 | Flip route "R1" orientation from 01/01/2010 in 'countylog' network |
| 9 | Flip the calibration direction of a route "R1" from 01/01/2010 in ' countylog ' network in LRS |
| 10 | Flip the calibration direction of route "R1" from 01/01/2010 in 'countylog' network |
| 11 | Flip the route "R1" direction from 01/01/2010 in 'countylog' network |
| 12 | Flip the route "R1" from 01/01/2010 in 'countylog' network |
| 13 | Flip the route "R1" from 01/01/2010 in 'countylog' network from start to end. |
| 14 | Flip the route "R1" measures from 01/01/2010 in 'countylog' network |
| 15 | Flip the route "R1" orientation from 01/01/2010 in 'countylog' network |
| 16 | Perform route reversal on "R1" from 01/01/2010 in 'countylog' network |
| 17 | Reverse route "R1" direction from 01/01/2010 in 'countylog' network |
| 18 | Reverse route "R1" orientation from 01/01/2010 in 'countylog' network |
| 19 | Reverse route "R1" calibration from 01/01/2010 in 'countylog' network for LRS |
| 20 | Reverse route "R1" direction from 01/01/2010 in 'countylog' network using the Reverse tool. |
| 21 | Reverse route "R1" from 01/01/2010 in ' countylog ' network |
| 22 | Reverse route "R1" from 01/01/2010 in 'countylog' network |
| 23 | Reverse route "R1" measures from 01/01/2010 in 'countylog' network |
| 24 | Reverse route calibration of "R1" from 01/01/2010 in 'countylog' network |
| 25 | Reverse route geometry of "R1" from 01/01/2010 in 'countylog' network |
| 26 | Reverse the route "R1" direction from 01/01/2010 in 'countylog' network |
| 27 | Reverse the route "R1" layout from 01/01/2010 in 'countylog' network |
| 28 | Reverse the route "R1" path from 01/01/2010 in 'countylog' network |
| 29 | Reverse the route "R1" from 01/01/2010 in 'countylog' network |
| 30 | Reverse the route "R1" from 01/01/2010 in 'countylog' network for correct calibration. |
| 31 | Reverse the route "R1" from 01/01/2010 in 'countylog' network for proper alignment. |
| 32 | Reverse the route "R1"geometry from 01/01/2010 in 'countylog' network |
| 33 | route reversal "R1" from 01/01/2010 in 'countylog' |
| 34 | route reverse "R1" from 01/01/2010 in 'countylog' network |
| 35 | Swap the route "R1" start from 01/01/2010 in 'countylog' network |
| 36 | Switch the route direction "R1" from 01/01/2010 in 'countylog' network |
| 37 | make the route "R1" from 01/01/2010 in 'countylog' network go backwards |
| 38 | inverse route direction of "R1" from 01/01/2010 in 'countylog' network |
| 39 | make the route direction of "R1" from 01/01/2010 in ' countylog ' network contrary to present |
| 40 | make the route "R1" from 01/01/2010 in 'countylog' network facing back |
| 41 | make the route "R1" from 01/01/2010 in 'countylog' network go opposing to present direction |
| 42 | make the route "R1" from 01/01/2010 in 'countylog' network to flow in different direction |
| 43 | make the route direction of "R1" from 01/01/2010 in 'countylog' network contradiction to present |
| 44 | turn the route "R1" from 01/01/2010 in 'countylog' network opposite way |
| 45 | change course fo the route "R1" from 01/01/2010 in 'countylog' network |
| 46 | change path of the route "R1" from 01/01/2010 in 'countylog' network |
| 47 | turn over the route "R1" from 01/01/2010 in 'countylog' network |
| 48 | turn the route direction of "R1" from 01/01/2010 in 'countylog' network |
| 49 | invert route calibration of "R1" from 01/01/2010 in 'countylog' network |
| 50 | interchange the calibration of the route "R1" from 01/01/2010 in 'countylog' network |
| 51 | Reverse the route "R1" and use from 01/01/2010 and select ' countylog ' network |

## Slide 3

Scenario 2

## Slide 4

| No | Prompt |
| --- | --- |
| 1 | Apply Reverse tool to flip route direction from 01/01/2010 in 'countylog' network in Roads and highways |
| 2 | Change the route orientation from 01/01/2010 in 'countylog' network |
| 3 | Change the route direction from 01/01/2010 in 'countylog' network |
| 4 | Change the route from 01/01/2010 in 'countylog' network to the opposite direction |
| 5 | Create a reversed route from 01/01/2010 in 'countylog' network |
| 6 | Flip route calibration from 01/01/2010 in 'countylog' network |
| 7 | Flip route calibration direction from 01/01/2010 in 'countylog' network in LRS. |
| 8 | Flip route orientation from 01/01/2010 in 'countylog' network |
| 9 | Flip the calibration direction of a route from 01/01/2010 in 'countylog' network in LRS |
| 10 | Flip the calibration direction of route from 01/01/2010 in 'countylog' network |
| 11 | Flip the route direction from 01/01/2010 in 'countylog' network |
| 12 | Flip the route from 01/01/2010 in 'countylog' network |
| 13 | Flip the route from 01/01/2010 in 'countylog' network from start to end. |
| 14 | Flip the route measures from 01/01/2010 in 'countylog' network |
| 15 | Flip the route orientation from 01/01/2010 in 'countylog' network |
| 16 | Perform route reversal on from 01/01/2010 in 'countylog' network |
| 17 | Reverse route direction from 01/01/2010 in 'countylog' network |
| 18 | Reverse route orientation from 01/01/2010 in 'countylog' network |
| 19 | Reverse route calibration from 01/01/2010 in 'countylog' network for LRS |
| 20 | Reverse route direction from 01/01/2010 in 'countylog' network using the Reverse tool. |
| 21 | Reverse route from 01/01/2010 in 'countylog' network |
| 22 | Reverse route from 01/01/2010 in 'countylog' network |
| 23 | Reverse route measures from 01/01/2010 in 'countylog' network |
| 24 | Reverse route calibration of from 01/01/2010 in 'countylog' network |
| 25 | Reverse route geometry of from 01/01/2010 in 'countylog' network |
| 26 | Reverse the route direction from 01/01/2010 in 'countylog' network |
| 27 | Reverse the route layout from 01/01/2010 in 'countylog' network |
| 28 | Reverse the route path from 01/01/2010 in 'countylog' network |
| 29 | Reverse the route from 01/01/2010 in 'countylog' network |
| 30 | Reverse the route from 01/01/2010 in 'countylog' network for correct calibration. |
| 31 | Reverse the route from 01/01/2010 in 'countylog' network for proper alignment. |
| 32 | Reverse the route geometry from 01/01/2010 in 'countylog' network |
| 33 | route reversal from 01/01/2010 in 'countylog' |
| 34 | route reverse from 01/01/2010 in 'countylog' network |
| 35 | Swap the route start from 01/01/2010 in 'countylog' network |
| 36 | Switch the route direction from 01/01/2010 in 'countylog' network |
| 37 | make the route from 01/01/2010 in 'countylog' network go backwards |
| 38 | inverse route direction of from 01/01/2010 in 'countylog' network |
| 39 | make the route direction of from 01/01/2010 in 'countylog' network contrary to present |
| 40 | make the route from 01/01/2010 in 'countylog' network facing back |
| 41 | make the route from 01/01/2010 in 'countylog' network go opposing to present direction |
| 42 | make the route from 01/01/2010 in 'countylog' network to flow in different direction |
| 43 | make the route direction of from 01/01/2010 in 'countylog' network contradiction to present |
| 44 | turn the route from 01/01/2010 in 'countylog' network opposite way |
| 45 | change course fo the route from 01/01/2010 in 'countylog' network |
| 46 | change path of the route from 01/01/2010 in 'countylog' network |
| 47 | turn over the route from 01/01/2010 in 'countylog' network |
| 48 | turn the route direction of from 01/01/2010 in 'countylog' network |
| 49 | invert route calibration of from 01/01/2010 in 'countylog' network |
| 50 | interchange the calibration of the route from 01/01/2010 in 'countylog' network |
| 51 | Reverse the route and use from 01/01/2010 and select ' countylog ' network |

## Slide 5

AI Assistant – Reverse Route
Scenario 3

## Slide 6

| No | Prompt |
| --- | --- |
| 1 | Apply Reverse tool to flip route direction in 'countylog' network in Roads and highways |
| 2 | Change the route orientation in 'countylog' network |
| 3 | Change the route direction in 'countylog' network |
| 4 | Change the route in 'countylog' network to the opposite direction |
| 5 | Create a reversed route in 'countylog' network |
| 6 | Flip route calibration in 'countylog' network |
| 7 | Flip route calibration direction in 'countylog' network in LRS. |
| 8 | Flip route orientation in 'countylog' network |
| 9 | Flip the calibration direction of a route in 'countylog' network in LRS |
| 10 | Flip the calibration direction of route in 'countylog' network |
| 11 | Flip the route direction in 'countylog' network |
| 12 | Flip the route in 'countylog' network |
| 13 | Flip the route in 'countylog' network from start to end. |
| 14 | Flip the route measures in 'countylog' network |
| 15 | Flip the route orientation in 'countylog' network |
| 16 | Perform route reversal on in 'countylog' network |
| 17 | Reverse route direction in 'countylog' network |
| 18 | Reverse route orientation in 'countylog' network |
| 19 | Reverse route calibration in 'countylog' network for LRS |
| 20 | Reverse route direction in 'countylog' network using the Reverse tool. |
| 21 | Reverse route in 'countylog' network |
| 22 | Reverse route in 'countylog' network |
| 23 | Reverse route measures in 'countylog' network |
| 24 | Reverse route calibration of in 'countylog' network |
| 25 | Reverse route geometry of in 'countylog' network |
| 26 | Reverse the route direction in 'countylog' network |
| 27 | Reverse the route layout in 'countylog' network |
| 28 | Reverse the route path in 'countylog' network |
| 29 | Reverse the route in 'countylog' network |
| 30 | Reverse the route in 'countylog' network for correct calibration. |
| 31 | Reverse the route in 'countylog' network for proper alignment. |
| 32 | Reverse the route geometry in 'countylog' network |
| 33 | route reversal in 'countylog' |
| 34 | route reverse in 'countylog' network |
| 35 | Swap the route start in 'countylog' network |
| 36 | Switch the route direction in 'countylog' network |
| 37 | make the route in 'countylog' network go backwards |
| 38 | inverse route direction of in 'countylog' network |
| 39 | make the route direction of in 'countylog' network contrary to present |
| 40 | make the route in 'countylog' network facing back |
| 41 | make the route in 'countylog' network go opposing to present direction |
| 42 | make the route in 'countylog' network to flow in different direction |
| 43 | make the route direction of in 'countylog' network contradiction to present |
| 44 | turn the route in 'countylog' network opposite way |
| 45 | change course fo the route in 'countylog' network |
| 46 | change path of the route in 'countylog' network |
| 47 | turn over the route in 'countylog' network |
| 48 | turn the route direction of in 'countylog' network |
| 49 | invert route calibration of in 'countylog' network |
| 50 | interchange the calibration of the route in 'countylog' network |
| 51 | Reverse the route and use and select ' countylog ' network |

## Slide 7

Scenario 4

## Slide 8

| No | Prompt |
| --- | --- |
| 1 | Apply Reverse tool to flip route "R1" direction in 'countylog' network in Roads and highways |
| 2 | Change the route "R1" orientation in 'countylog' network |
| 3 | Change the route "R1" direction in 'countylog' network |
| 4 | Change the route "R1" in 'countylog' network to the opposite direction |
| 5 | Create a reversed route "R1" in 'countylog' network |
| 6 | Flip route "R1" calibration in 'countylog' network |
| 7 | Flip route "R1" calibration direction in 'countylog' network in LRS. |
| 8 | Flip route "R1" orientation in 'countylog' network |
| 9 | Flip the calibration direction of a route "R1" in 'countylog' network in LRS |
| 10 | Flip the calibration direction of route "R1" in 'countylog' network |
| 11 | Flip the route "R1" direction in 'countylog' network |
| 12 | Flip the route "R1" in 'countylog' network |
| 13 | Flip the route "R1" in 'countylog' network from start to end. |
| 14 | Flip the route "R1" measures in ' countylog ' network |
| 15 | Flip the route "R1" orientation in 'countylog' network |
| 16 | Perform route reversal on "R1" in 'countylog' network |
| 17 | Reverse route "R1" direction in 'countylog' network |
| 18 | Reverse route "R1" orientation in 'countylog' network |
| 19 | Reverse route "R1" calibration in 'countylog' network for LRS |
| 20 | Reverse route "R1" direction in 'countylog' network using the Reverse tool. |
| 21 | Reverse route "R1" in 'countylog' network |
| 22 | Reverse route "R1" in 'countylog' network |
| 23 | Reverse route "R1" measures in 'countylog' network |
| 24 | Reverse route calibration of "R1" in 'countylog' network |
| 25 | Reverse route geometry of "R1" in 'countylog' network |
| 26 | Reverse the route "R1" direction in 'countylog' network |
| 27 | Reverse the route "R1" layout in 'countylog' network |
| 28 | Reverse the route "R1" path in 'countylog' network |
| 29 | Reverse the route "R1" in 'countylog' network |
| 30 | Reverse the route "R1" in 'countylog' network for correct calibration. |
| 31 | Reverse the route "R1" in 'countylog' network for proper alignment. |
| 32 | Reverse the route "R1"geometry in 'countylog' network |
| 33 | route reversal "R1" in 'countylog' |
| 34 | route reverse "R1" in 'countylog' network |
| 35 | Swap the route "R1" start in 'countylog' network |
| 36 | Switch the route direction "R1" in 'countylog' network |
| 37 | make the route "R1" in 'countylog' network go backwards |
| 38 | inverse route direction of "R1" in 'countylog' network |
| 39 | make the route direction of "R1" in 'countylog' network contrary to present |
| 40 | make the route "R1" in 'countylog' network facing back |
| 41 | make the route "R1" in 'countylog' network go opposing to present direction |
| 42 | make the route "R1" in 'countylog' network to flow in different direction |
| 43 | make the route direction of "R1" in 'countylog' network contradiction to present |
| 44 | turn the route "R1" in 'countylog' network opposite way |
| 45 | change course fo the route "R1" in 'countylog' network |
| 46 | change path of the route "R1" in 'countylog' network |
| 47 | turn over the route "R1" in 'countylog' network |
| 48 | turn the route direction of "R1" in 'countylog' network |
| 49 | invert route calibration of "R1" in 'countylog' network |
| 50 | interchange the calibration of the route "R1" in 'countylog' network |
| 51 | Reverse the route "R1" and use and select ' countylog ' network |

## Slide 9

Scenario 5

## Slide 10

| No | Prompt |
| --- | --- |
| 1 | Apply Reverse tool to flip route "R1" direction from 01/01/2010 in network in Roads and highways |
| 2 | Change the route "R1" orientation from 01/01/2010 in network |
| 3 | Change the route "R1" direction from 01/01/2010 in network |
| 4 | Change the route "R1" from 01/01/2010 in network to the opposite direction |
| 5 | Create a reversed route "R1" from 01/01/2010 in network |
| 6 | Flip route "R1" calibration from 01/01/2010 in network |
| 7 | Flip route "R1" calibration direction from 01/01/2010 in network in LRS. |
| 8 | Flip route "R1" orientation from 01/01/2010 in network |
| 9 | Flip the calibration direction of a route "R1" from 01/01/2010 in network in LRS |
| 10 | Flip the calibration direction of route "R1" from 01/01/2010 in network |
| 11 | Flip the route "R1" direction from 01/01/2010 in network |
| 12 | Flip the route "R1" from 01/01/2010 in network |
| 13 | Flip the route "R1" from 01/01/2010 in network from start to end. |
| 14 | Flip the route "R1" measures from 01/01/2010 in network |
| 15 | Flip the route "R1" orientation from 01/01/2010 in network |
| 16 | Perform route reversal on "R1" from 01/01/2010 in network |
| 17 | Reverse route "R1" direction from 01/01/2010 in network |
| 18 | Reverse route "R1" orientation from 01/01/2010 in network |
| 19 | Reverse route "R1" calibration from 01/01/2010 in network for LRS |
| 20 | Reverse route "R1" direction from 01/01/2010 in network using the Reverse tool. |
| 21 | Reverse route "R1" from 01/01/2010 in network |
| 22 | Reverse route "R1" from 01/01/2010 in network |
| 23 | Reverse route "R1" measures from 01/01/2010 in network |
| 24 | Reverse route calibration of "R1" from 01/01/2010 in network |
| 25 | Reverse route geometry of "R1" from 01/01/2010 in network |
| 26 | Reverse the route "R1" direction from 01/01/2010 in network |
| 27 | Reverse the route "R1" layout from 01/01/2010 in network |
| 28 | Reverse the route "R1" path from 01/01/2010 in network |
| 29 | Reverse the route "R1" from 01/01/2010 in network |
| 30 | Reverse the route "R1" from 01/01/2010 in network for correct calibration. |
| 31 | Reverse the route "R1" from 01/01/2010 in network for proper alignment. |
| 32 | Reverse the route "R1"geometry from 01/01/2010 in network |
| 33 | route reversal "R1" from 01/01/2010 in |
| 34 | route reverse "R1" from 01/01/2010 in network |
| 35 | Swap the route "R1" start from 01/01/2010 in network |
| 36 | Switch the route direction "R1" from 01/01/2010 in network |
| 37 | make the route "R1" from 01/01/2010 in network go backwards |
| 38 | inverse route direction of "R1" from 01/01/2010 in network |
| 39 | make the route direction of "R1" from 01/01/2010 in network contrary to present |
| 40 | make the route "R1" from 01/01/2010 in network facing back |
| 41 | make the route "R1" from 01/01/2010 in network go opposing to present direction |
| 42 | make the route "R1" from 01/01/2010 in network to flow in different direction |
| 43 | make the route direction of "R1" from 01/01/2010 in network contradiction to present |
| 44 | turn the route "R1" from 01/01/2010 in network opposite way |
| 45 | change course fo the route "R1" from 01/01/2010 in network |
| 46 | change path of the route "R1" from 01/01/2010 in network |
| 47 | turn over the route "R1" from 01/01/2010 in network |
| 48 | turn the route direction of "R1" from 01/01/2010 in network |
| 49 | invert route calibration of "R1" from 01/01/2010 in network |
| 50 | interchange the calibration of the route "R1" from 01/01/2010 in network |
| 51 | Reverse the route "R1" and use from 01/01/2010 and select network |

## Slide 11

Scenario 6

| No | Prompt |
| --- | --- |
| 1 | Change direction of all connected pipeline routes between R1 and R10 from 01/01/2010 in this system |
| 2 | Change direction of all connected routes from 01/01/2010 that is between R1 and R10 |
| 3 | Change direction of all connected routes from R1 and R10 and effective for the specified date range 01/01/2010 |
| 4 | Change direction of all connected routes from R1 to R10 from 01/01/2010 in the current version of the LRS |
| 5 | Change direction of all connected routes in r1 and r10 from r1 to r10, store the changes in a new time slice 01/01/2026 |
| 6 | Change direction of all connected routes from r1 to r10 of the current LRS network from 01/01/2010 |
| 7 | Change direction of all contiguous routes r1 and r10 from 01/01/2010 |
| 8 | Change direction of all LRS routes r1 to r10 from 01/01/2010 that are topologically connected to the active route |
| 9 | Change direction of all routes between the chosen From and To route IDs R1 and R10 from 01/01/2010 |
| 10 | Change direction of all routes on this r1 and r10 from 01/01/2010 between the specified R1 start and R10 end locations |
| 11 | Change direction of calibration for concurrent connected routes r1 to r10 from 01/01/2010 sharing geometry |
| 12 | Change direction of calibration for multiple connected routes r1 and r10 using a single effective date 01/01/2010 |
| 13 | Change direction of connected roadway routes from 01/01/2010 , r1, r10 |
| 14 | Change direction of connected routes first in r1 and r10 from 01/01/2010 |
| 15 | Change direction of connected routes in r1 and r10 from 01/01/2010 in a published LRS feature service |
| 16 | Change direction of connected routes r1 and r10 from 01/01/2010 that were calibrated in the wrong direction |
| 17 | Change direction of corridor routes in r1 and r10 with a future effective date of 01/01/2030 |
| 18 | Change direction of direction for all connected routes within this r1 and r10 from 01/01/2010 |
| 19 | Change direction of direction for every route in r1 and r10 from 01/01/2010 in the LRS line network |
| 20 | Change direction of direction for multiple connected routes in r1 and r10 from 01/01/2010 without altering route IDs |
| 21 | Change direction of direction of all connected routes in r1 and r10 from 01/01/2010 in this LRS workspace |
| 22 | Change direction of direction of each connected route on the chosen r1 and r10 from 01/01/2010 |
| 23 | Change direction of multiple connected routes in r1 and r10 from 01/01/2010 in a branch versioned network |
| 24 | Change direction of multiple connected routes in r1 and r10 from 01/01/2010 in an editing session |
| 25 | Change direction of multiple connected routes in r1 and r10 from 01/01/2010 while preserving their geometry locations |
| 26 | Change direction of multiple connected routes that share the same line name r1 and r10 from 01/01/2010 |
| 27 | Change direction of multiple routes in r1 and r10 from 01/01/2010 from the location referencing editing tools |
| 28 | Change direction of multiple routes r1 and r10 from 01/01/2010 using a back-dated effective date |
| 29 | Change direction of the calibration direction of every connected route on this r1 and r10 from 01/01/2010 |
| 30 | Flip all connected pipeline routes in r1 and r10 from 01/01/2010 in this system |

## Slide 12

| No | Prompt |
| --- | --- |
| 31 | Flip all connected routes from 01/01/2010 that belong to 'r1 and r10' |
| 32 | Flip all connected routes in r1 and r10 effective for the specified date range 01/01/2010 |
| 33 | Flip all connected routes in r1 and r10 from 01/01/2010 in the current version of the LRS |
| 34 | Flip all connected routes in r1 and r10 and store the changes in a new time slice 01/01/2026 |
| 35 | Flip all connected routes in r1 and r10 from 01/01/2010, then run event behavior processing |
| 36 | Flip all connected routes in r1 and r10 of the current LRS network from 01/01/2010 |
| 37 | Flip all contiguous routes in the selected corridor r1 and r10 from 01/01/2010 |
| 38 | Flip all LRS routes in r1 and r10 from 01/01/2010 that are topologically connected to the active route |
| 39 | Flip all routes between the chosen From and To route IDs R1 and R10 from 01/01/2010 |
| 40 | Flip all routes in this r1 and r10 from 01/01/2010 while maintaining network continuity |
| 41 | Flip calibration for concurrent connected routes in r1 and r10 from 01/01/2010 sharing geometry |
| 42 | Flip calibration for every route in r1 and r10 from 01/01/2010 |
| 43 | Flip calibration for multiple connected routes in r1 and r10 using a single effective date 01/01/2010 |
| 44 | Flip calibration for multiple routes that share a continuous r1 and r10 from 01/01/2010 |
| 45 | Flip connected routes in r1 and r10 from 01/01/2010 in a published LRS feature service |
| 46 | Flip connected routes r1 and r10 from 01/01/2010 that were calibrated in the wrong direction |
| 47 | Flip corridor routes in r1 and r10 with a future effective date of 01/01/2030 |
| 48 | Flip direction for all connected routes within this r1 and r10 from 01/01/2010 |
| 49 | Flip direction for connected routes in r1 and r10 from 01/01/2010 in a multi-route corridor |
| 50 | Flip multiple connected routes in r1 and r10 from 01/01/2010 in a branch versioned network |
| 51 | Flip multiple connected routes in r1 and r10 from 01/01/2010 in an editing session |
| 52 | Flip multiple connected routes that share the same line name r1 and r10 from 01/01/2010 |
| 53 | Flip multiple routes along this pipeline in r1 and r10 from 01/01/2010 |
| 54 | Flip multiple routes in r1 and r10 from 01/01/2010 from the location referencing editing tools |
| 55 | Reverse all connected pipeline routes in r1 and r10 from 01/01/2010 in this system |
| 56 | Reverse all connected routes from 01/01/2010 that belong to this line ID 'r1 and r10' |
| 57 | Reverse all connected routes in r1 and r10 effective for the specified date range 01/01/2010 |
| 58 | Reverse all connected routes in r1 and r10 from 01/01/2010 in the current version of the LRS |
| 59 | Reverse all connected routes in r1 and r10 and store the changes in a new time slice 01/01/2026 |
| 60 | Reverse all connected routes in r1 and r10 of the current LRS network from 01/01/2010 |
| 61 | Reverse all contiguous routes in the selected corridor r1 and r10 from 01/01/2010 |
| 62 | Reverse all routes between the chosen From and To route IDs R1 and R10 from 01/01/2010 |
| 63 | Reverse all routes in this r1 and r10 from 01/01/2010 while maintaining network continuity |
| 64 | Reverse calibration for concurrent connected routes in r1 and r10 from 01/01/2010 sharing geometry |
| 65 | Reverse calibration for every route in r1 and r10 from 01/01/2010 |
| 66 | Reverse calibration for multiple connected routes in r1 and r10 using a single effective date 01/01/2010 |
| 67 | Reverse calibration for multiple routes that share a continuous r1 and r10 from 01/01/2010 |
| 68 | Reverse connected routes r1 and r10 from 01/01/2010 that were calibrated in the wrong direction |
| 69 | Reverse corridor routes in r1 and r10 with a future effective date of 01/01/2030 |
| 70 | Reverse direction for all connected routes within this r1 and r10 from 01/01/2010 |
| 71 | Reverse direction for connected routes in r1 and r10 from 01/01/2010 in a multi-route corridor |
| 72 | Reverse direction for every route in r1 and r10 from 01/01/2010 in the LRS line network |
| 73 | Reverse direction of all connected routes in r1 and r10 from 01/01/2010 |
| 74 | Reverse direction of all connected routes in r1 and r10 from 01/01/2010 in this LRS workspace |
| 75 | Reverse direction of all selected routes in r1 and r10 from 01/01/2010 |
| 76 | Reverse direction of each connected route on the chosen r1 and r10 from 01/01/2010 |
| 77 | Reverse direction of every connected route in r1 and r10 from 01/01/2010 |
| 78 | Reverse multiple connected routes in r1 and r10 from 01/01/2010 in an editing session |
| 79 | Reverse multiple routes in r1 and r10 from 01/01/2010 from the location referencing editing tools |

## Slide 13

Help prompts

- "How do I access and activate the LRS Reverse tool in the Location Referencing tab?"
- "What are the prerequisite steps before reversing a route in an LRS network?"
- "Explain the difference between the standard 'Reverse Direction' editing tool and the specialized LRS Reverse tool
- "Walk me through the full workflow of reversing a single route using the LRS Reverse tool
- "How can I verify the direction of a route in the LRS network before confirming the reversal?"
- "Provide a checklist of all parameters in the Reverse Route pane and what each one does
- "Explain the significance of the 'Effective Date' field when using the LRS Reverse tool
- "Show me how to select a route directly on the map for reversal using the LRS tools
- "How do I use the 'Route' dropdown list in the Reverse Route pane if my routes have similar names?"
- What happens to the start and end measures of a route after the LRS Reverse operation is complete?
- Provide a Python script example for automating the reversal of multiple specified routes in an LRS network.
- "Troubleshoot: The Reverse tool is greyed out.  What is preventing me from using it?"
- "How does the Reverse tool function in a branch-versioned enterprise environment?"
- "What capabilities must an LRS network be published with to allow route reversal via feature services?"
- "Explain potential conflicts or errors that might arise during a route reversal and how to resolve them
- "How does the LRS Reverse tool manage route time slices for historical route data?"
- "Can I use the LRS Reverse tool on multiple routes simultaneously (batch reversal)?"
- "What if I reverse a route by mistake? How do I undo or correct the action?"
- "Explain how to handle nonline LRS networks when using the Reverse Route pane
- "Provide the official documentation link for the LRS Reverse tool in ArcGIS Pro
- "How does a route reversal impact Linear Referencing REST services?"
- "Explain the difference in the workflow for ArcGIS Roads and Highways vs  ArcGIS Pipeline Referencing when reversing a route
- "When would I choose to use the LRS Reverse tool over recalibrating the route entirely?"
- "Guide me through reversing a route that has complex overlapping events
- "How does the LRS network topology react to a route direction change?"
- "What is the expected output log from running the Reverse tool?"
- "Explain the 'Route must be in a Linear Referencing System network' error message
- "What effect does the 'Recalculate COGO attributes' setting have within the LRS context?"
- "Provide best practices for QA/QC after performing route reversal edits
- "Can I reverse a route that is currently undergoing realignment edits?"
- "How does the LRS identify and manage potential new conflicts created by the reversal?"
- "Explain the purpose of reversing a route direction in preparation for a realignment project
- "Show a practical example of a 'wrong direction calibration' scenario that requires this tool
- "What user role and permissions are necessary to execute the LRS Reverse tool in an enterprise geodatabase?"
- "How does the LRS Reverse tool handle routes that overlap temporally (have different time slices)?"
- "Explain the process for reversing a route that is part of a complex, non-line LRS network
- "How does the LRS Reverse operation affect the underlying centerline geometry and its direction?"
- "Guide me through reversing a route that has disproportionate or non-equidistant intermediate calibration points
- "What should I do if the LRS Reverse tool produces unexpected results regarding my events' spatial locations?"
- "Explain the concept of 'Stay Put' event behavior and how it applies during a route reversal
- "How does the LRS handle measure continuity when reversing a single segment of a larger, continuous network?"
- "Provide an example scenario where a route must be reversed in preparation for a subsequent realignment
- "How does the LRS Reverse tool impact external systems that integrate with the LRS data via feature services?"
- "What are the specific differences in the Reverse Route pane interface for a Roads and Highways network versus a Pipeline Referencing network?"
- "How do I manage conflicts related to locking when the LRS Reverse tool is used in a multi-user environment?"
- "Explain the role of conflict prevention during an LRS route reversal on branch-versioned data
- "What specific permissions are needed for an editor to use the Reverse tool in an enterprise geodatabase?"
- "How do I use the 'Transfer Locks' functionality when performing a route reversal with the LRS tool?"
- "Explain the required publishing capabilities (Linear Referencing and Version Management) needed for web editing via the Reverse tool
- "Guide me on the reconcile and post workflow after an LRS route reversal edit in a versioned environment
- "What are common data integrity issues to check for after using the LRS Reverse tool?"
- "How does the Reverse tool affect routes that have equation points defined?"
- "Explain the core LRS data model concepts (routes, lines, networks) in the context of route reversal
- "Describe the difference between reversing route direction (LRS tool) and flipping geometry (standard editor tool)
- "What is the relationship between the centerline direction of digitization and the resulting LRS route direction?"
- "How to combine the LRS Reverse tool with the Reassign Route workflow
- "What are the considerations for 3D or vertical routes when performing a reversal?"
- "How to use the LRS Reverse tool as part of a larger data migration project from ArcMap to ArcGIS Pro

## Slide 14

Note

- Test only in Feature services
- Test on RH and Pipeline data
- Continuous networks ( autogenerated RouteID and user generated RouteID), Line Networks, Postmile
- Projected and unprojected data
- Multiple centerlines in a route
- Test in New conversation of AI assistant
- Test with spelling mistakes
- Test with invalid routeid \ route name
- Test with invalid date
- Test with invalid network name
- Verify that the form is populated with the information provided in the prompt
- Test I18
- Test in different locale
- Test date values as ‘today’, ‘tomorrow’ and ‘yesterday’
- Test same prompts with different word orders
- Test with lot of logical groups in the prompt
- Test with filters in the map where the route does not exist
- Test the zoom level when the form the populated
