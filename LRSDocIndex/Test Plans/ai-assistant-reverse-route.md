# AI Assistant Reverse Route Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 32 · Test Plan · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [AI_Assistant_reverseroute_testplan_v1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/AI_Assistant_reverseroute_testplan_v1.pptx>) · rev V1 |
| **People** | author Praveen Kumar · PE — · dev — |
| **Edited** | 2026-05-15 18:28 by Kevin Roper |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | route reversal · reverse tool · route direction · route orientation · route calibration · roads and highways · pipeline referencing · feature services |
| **Tools** | Reverse tool |

## Summary

Test plan for the AI Assistant Reverse Route tool covering multiple scenarios of reversing route direction, orientation, and calibration in the 'countylog' network and other networks within Roads and Highways and Pipeline Referencing. Includes prompts for route reversal operations, help prompts for tool usage, and notes on testing conditions such as feature services, data types, and locale variations.

## Related documents

<!-- related:begin -->
- [Create Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/create-route-ai-assistant.md>) — similar text 0.25 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:98 s=4.389 -->
- [Pro AI Assistant Reverse Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-reverse-route.md>) — similar text 0.17 · 3 title words · 1 filename word · same surface <!-- rel:109 s=3.596 -->
- [Perform an action with the ArcGIS Pro Assistant (Beta)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/perform-an-action-with-the-pro-assistant-beta-2026-04.md>) — similar text 0.15 · 1 title word · 1 filename word · same surface <!-- rel:55 s=2.965 -->
- [Perform an action with the ArcGIS Pro Assistant (Beta)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/perform-an-action-with-the-pro-assistant-beta-2026-03.md>) — similar text 0.17 · 1 title word · 1 filename word · same surface <!-- rel:62 s=2.964 -->
- [Perform an action with the ArcGIS Pro Assistant (Beta)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/perform-an-action-with-the-pro-assistant-beta-rh-apr.md>) — similar text 0.17 · 1 title word · 1 filename word · same surface <!-- rel:907 s=2.96 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior for route reversal](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-behavior-for-route-reversal.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/edit-feature-services.html)

_No page matched:_ [Reverse tool](https://www.google.com/search?q=%22Reverse%20tool%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — AI Assistant – Reverse Route <!-- slide 1 -->

Scenario 1

## Test Cases

### TC-U01 — Apply Reverse tool to flip route "R1" direction from 01/01/2010 in 'countylog' <!-- src: S3 · slide 2 · table · 1 -->

- **ID:** 1
- **Case:** Apply Reverse tool to flip route "R1" direction from 01/01/2010 in 'countylog' network in Roads and highways

### TC-U02 — Change the route "R1" orientation from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 2 -->

- **ID:** 2

### TC-U03 — Change the route "R1" direction from 01/01/2010 in ' countylog ' network <!-- src: S3 · slide 2 · table · 3 -->

- **ID:** 3

### TC-U04 — Change the route "R1" from 01/01/2010 in ' countylog ' network to the opposite <!-- src: S3 · slide 2 · table · 4 -->

- **ID:** 4
- **Case:** Change the route "R1" from 01/01/2010 in ' countylog ' network to the opposite direction

### TC-U05 — Create a reversed route "R1" from 01/01/2010 in ' countylog ' network <!-- src: S3 · slide 2 · table · 5 -->

- **ID:** 5

### TC-U06 — Flip route "R1" calibration from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 6 -->

- **ID:** 6

### TC-U07 — Flip route "R1" calibration direction from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 7 -->

- **ID:** 7
- **Case:** Flip route "R1" calibration direction from 01/01/2010 in 'countylog' network in LRS.

### TC-U08 — Flip route "R1" orientation from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 8 -->

- **ID:** 8

### TC-U09 — Flip the calibration direction of a route "R1" from 01/01/2010 in ' countylog ' <!-- src: S3 · slide 2 · table · 9 -->

- **ID:** 9
- **Case:** Flip the calibration direction of a route "R1" from 01/01/2010 in ' countylog ' network in LRS

### TC-U10 — Flip the calibration direction of route "R1" from 01/01/2010 in 'countylog' <!-- src: S3 · slide 2 · table · 10 -->

- **ID:** 10
- **Case:** Flip the calibration direction of route "R1" from 01/01/2010 in 'countylog' network

### TC-U11 — Flip the route "R1" direction from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 11 -->

- **ID:** 11

### TC-U12 — Flip the route "R1" from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 12 -->

- **ID:** 12

### TC-U13 — Flip the route "R1" from 01/01/2010 in 'countylog' network from start to end. <!-- src: S3 · slide 2 · table · 13 -->

- **ID:** 13

### TC-U14 — Flip the route "R1" measures from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 14 -->

- **ID:** 14

### TC-U15 — Flip the route "R1" orientation from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 15 -->

- **ID:** 15

### TC-U16 — Perform route reversal on "R1" from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 16 -->

- **ID:** 16

### TC-U17 — Reverse route "R1" direction from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 17 -->

- **ID:** 17

### TC-U18 — Reverse route "R1" orientation from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 18 -->

- **ID:** 18

### TC-U19 — Reverse route "R1" calibration from 01/01/2010 in 'countylog' network for LRS <!-- src: S3 · slide 2 · table · 19 -->

- **ID:** 19

### TC-U20 — Reverse route "R1" direction from 01/01/2010 in 'countylog' network using <!-- src: S3 · slide 2 · table · 20 -->

- **ID:** 20
- **Case:** Reverse route "R1" direction from 01/01/2010 in 'countylog' network using the Reverse tool.

### TC-U21 — Reverse route "R1" from 01/01/2010 in ' countylog ' network <!-- src: S3 · slide 2 · table · 21 -->

- **ID:** 21

### TC-U22 — Reverse route "R1" from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 22 -->

- **ID:** 22

### TC-U23 — Reverse route "R1" measures from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 23 -->

- **ID:** 23

### TC-U24 — Reverse route calibration of "R1" from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 24 -->

- **ID:** 24

### TC-U25 — Reverse route geometry of "R1" from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 25 -->

- **ID:** 25

### TC-U26 — Reverse the route "R1" direction from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 26 -->

- **ID:** 26

### TC-U27 — Reverse the route "R1" layout from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 27 -->

- **ID:** 27

### TC-U28 — Reverse the route "R1" path from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 28 -->

- **ID:** 28

### TC-U29 — Reverse the route "R1" from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 29 -->

- **ID:** 29

### TC-U30 — Reverse the route "R1" from 01/01/2010 in 'countylog' network for correct <!-- src: S3 · slide 2 · table · 30 -->

- **ID:** 30
- **Case:** Reverse the route "R1" from 01/01/2010 in 'countylog' network for correct calibration.

### TC-U31 — Reverse the route "R1" from 01/01/2010 in 'countylog' network for proper <!-- src: S3 · slide 2 · table · 31 -->

- **ID:** 31
- **Case:** Reverse the route "R1" from 01/01/2010 in 'countylog' network for proper alignment.

### TC-U32 — Reverse the route "R1"geometry from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 32 -->

- **ID:** 32

### TC-U33 — route reversal "R1" from 01/01/2010 in 'countylog' <!-- src: S3 · slide 2 · table · 33 -->

- **ID:** 33

### TC-U34 — route reverse "R1" from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 34 -->

- **ID:** 34

### TC-U35 — Swap the route "R1" start from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 35 -->

- **ID:** 35

### TC-U36 — Switch the route direction "R1" from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 36 -->

- **ID:** 36

### TC-U37 — make the route "R1" from 01/01/2010 in 'countylog' network go backwards <!-- src: S3 · slide 2 · table · 37 -->

- **ID:** 37

### TC-U38 — inverse route direction of "R1" from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 38 -->

- **ID:** 38

### TC-U39 — make the route direction of "R1" from 01/01/2010 in ' countylog ' network <!-- src: S3 · slide 2 · table · 39 -->

- **ID:** 39
- **Case:** make the route direction of "R1" from 01/01/2010 in ' countylog ' network contrary to present

### TC-U40 — make the route "R1" from 01/01/2010 in 'countylog' network facing back <!-- src: S3 · slide 2 · table · 40 -->

- **ID:** 40

### TC-U41 — make the route "R1" from 01/01/2010 in 'countylog' network go opposing <!-- src: S3 · slide 2 · table · 41 -->

- **ID:** 41
- **Case:** make the route "R1" from 01/01/2010 in 'countylog' network go opposing to present direction

### TC-U42 — make the route "R1" from 01/01/2010 in 'countylog' network to flow in different <!-- src: S3 · slide 2 · table · 42 -->

- **ID:** 42
- **Case:** make the route "R1" from 01/01/2010 in 'countylog' network to flow in different direction

### TC-U43 — make the route direction of "R1" from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 43 -->

- **ID:** 43
- **Case:** make the route direction of "R1" from 01/01/2010 in 'countylog' network contradiction to present

### TC-U44 — turn the route "R1" from 01/01/2010 in 'countylog' network opposite way <!-- src: S3 · slide 2 · table · 44 -->

- **ID:** 44

### TC-U45 — change course fo the route "R1" from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 45 -->

- **ID:** 45

### TC-U46 — change path of the route "R1" from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 46 -->

- **ID:** 46

### TC-U47 — turn over the route "R1" from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 47 -->

- **ID:** 47

### TC-U48 — turn the route direction of "R1" from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 48 -->

- **ID:** 48

### TC-U49 — invert route calibration of "R1" from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 2 · table · 49 -->

- **ID:** 49

### TC-U50 — interchange the calibration of the route "R1" from 01/01/2010 in 'countylog' <!-- src: S3 · slide 2 · table · 50 -->

- **ID:** 50
- **Case:** interchange the calibration of the route "R1" from 01/01/2010 in 'countylog' network

### TC-U51 — Reverse the route "R1" and use from 01/01/2010 and select ' countylog ' network <!-- src: S3 · slide 2 · table · 51 -->

- **ID:** 51

### TC-U52 — Apply Reverse tool to flip route direction from 01/01/2010 in 'countylog' <!-- src: S3 · slide 4 · table · 1 -->

- **ID:** 1
- **Case:** Apply Reverse tool to flip route direction from 01/01/2010 in 'countylog' network in Roads and highways

### TC-U53 — Change the route orientation from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 2 -->

- **ID:** 2

### TC-U54 — Change the route direction from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 3 -->

- **ID:** 3

### TC-U55 — Change the route from 01/01/2010 in 'countylog' network to the opposite <!-- src: S3 · slide 4 · table · 4 -->

- **ID:** 4
- **Case:** Change the route from 01/01/2010 in 'countylog' network to the opposite direction

### TC-U56 — Create a reversed route from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 5 -->

- **ID:** 5

### TC-U57 — Flip route calibration from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 6 -->

- **ID:** 6

### TC-U58 — Flip route calibration direction from 01/01/2010 in 'countylog' network in LRS. <!-- src: S3 · slide 4 · table · 7 -->

- **ID:** 7

### TC-U59 — Flip route orientation from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 8 -->

- **ID:** 8

### TC-U60 — Flip the calibration direction of a route from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 9 -->

- **ID:** 9
- **Case:** Flip the calibration direction of a route from 01/01/2010 in 'countylog' network in LRS

### TC-U61 — Flip the calibration direction of route from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 10 -->

- **ID:** 10

### TC-U62 — Flip the route direction from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 11 -->

- **ID:** 11

### TC-U63 — Flip the route from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 12 -->

- **ID:** 12

### TC-U64 — Flip the route from 01/01/2010 in 'countylog' network from start to end. <!-- src: S3 · slide 4 · table · 13 -->

- **ID:** 13

### TC-U65 — Flip the route measures from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 14 -->

- **ID:** 14

### TC-U66 — Flip the route orientation from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 15 -->

- **ID:** 15

### TC-U67 — Perform route reversal on from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 16 -->

- **ID:** 16

### TC-U68 — Reverse route direction from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 17 -->

- **ID:** 17

### TC-U69 — Reverse route orientation from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 18 -->

- **ID:** 18

### TC-U70 — Reverse route calibration from 01/01/2010 in 'countylog' network for LRS <!-- src: S3 · slide 4 · table · 19 -->

- **ID:** 19

### TC-U71 — Reverse route direction from 01/01/2010 in 'countylog' network using the Reverse <!-- src: S3 · slide 4 · table · 20 -->

- **ID:** 20
- **Case:** Reverse route direction from 01/01/2010 in 'countylog' network using the Reverse tool.

### TC-U72 — Reverse route from 01/01/2010 in 'countylog' network (21) <!-- src: S3 · slide 4 · table · 21 -->

- **ID:** 21

### TC-U73 — Reverse route from 01/01/2010 in 'countylog' network (22) <!-- src: S3 · slide 4 · table · 22 -->

- **ID:** 22

### TC-U74 — Reverse route measures from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 23 -->

- **ID:** 23

### TC-U75 — Reverse route calibration of from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 24 -->

- **ID:** 24

### TC-U76 — Reverse route geometry of from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 25 -->

- **ID:** 25

### TC-U77 — Reverse the route direction from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 26 -->

- **ID:** 26

### TC-U78 — Reverse the route layout from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 27 -->

- **ID:** 27

### TC-U79 — Reverse the route path from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 28 -->

- **ID:** 28

### TC-U80 — Reverse the route from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 29 -->

- **ID:** 29

### TC-U81 — Reverse the route from 01/01/2010 in 'countylog' network for correct <!-- src: S3 · slide 4 · table · 30 -->

- **ID:** 30
- **Case:** Reverse the route from 01/01/2010 in 'countylog' network for correct calibration.

### TC-U82 — Reverse the route from 01/01/2010 in 'countylog' network for proper alignment. <!-- src: S3 · slide 4 · table · 31 -->

- **ID:** 31

### TC-U83 — Reverse the route geometry from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 32 -->

- **ID:** 32

### TC-U84 — route reversal from 01/01/2010 in 'countylog' <!-- src: S3 · slide 4 · table · 33 -->

- **ID:** 33

### TC-U85 — route reverse from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 34 -->

- **ID:** 34

### TC-U86 — Swap the route start from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 35 -->

- **ID:** 35

### TC-U87 — Switch the route direction from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 36 -->

- **ID:** 36

### TC-U88 — make the route from 01/01/2010 in 'countylog' network go backwards <!-- src: S3 · slide 4 · table · 37 -->

- **ID:** 37

### TC-U89 — inverse route direction of from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 38 -->

- **ID:** 38

### TC-U90 — make the route direction of from 01/01/2010 in 'countylog' network contrary <!-- src: S3 · slide 4 · table · 39 -->

- **ID:** 39
- **Case:** make the route direction of from 01/01/2010 in 'countylog' network contrary to present

### TC-U91 — make the route from 01/01/2010 in 'countylog' network facing back <!-- src: S3 · slide 4 · table · 40 -->

- **ID:** 40

### TC-U92 — make the route from 01/01/2010 in 'countylog' network go opposing to present <!-- src: S3 · slide 4 · table · 41 -->

- **ID:** 41
- **Case:** make the route from 01/01/2010 in 'countylog' network go opposing to present direction

### TC-U93 — make the route from 01/01/2010 in 'countylog' network to flow in different <!-- src: S3 · slide 4 · table · 42 -->

- **ID:** 42
- **Case:** make the route from 01/01/2010 in 'countylog' network to flow in different direction

### TC-U94 — make the route direction of from 01/01/2010 in 'countylog' network contradiction <!-- src: S3 · slide 4 · table · 43 -->

- **ID:** 43
- **Case:** make the route direction of from 01/01/2010 in 'countylog' network contradiction to present

### TC-U95 — turn the route from 01/01/2010 in 'countylog' network opposite way <!-- src: S3 · slide 4 · table · 44 -->

- **ID:** 44

### TC-U96 — change course fo the route from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 45 -->

- **ID:** 45

### TC-U97 — change path of the route from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 46 -->

- **ID:** 46

### TC-U98 — turn over the route from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 47 -->

- **ID:** 47

### TC-U99 — turn the route direction of from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 48 -->

- **ID:** 48

### TC-U100 — invert route calibration of from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 49 -->

- **ID:** 49

### TC-U101 — interchange the calibration of the route from 01/01/2010 in 'countylog' network <!-- src: S3 · slide 4 · table · 50 -->

- **ID:** 50

### TC-U102 — Reverse the route and use from 01/01/2010 and select ' countylog ' network <!-- src: S3 · slide 4 · table · 51 -->

- **ID:** 51

### TC-U103 — Apply Reverse tool to flip route direction in 'countylog' network in Roads <!-- src: S3 · slide 6 · table · 1 -->

- **ID:** 1
- **Case:** Apply Reverse tool to flip route direction in 'countylog' network in Roads and highways

### TC-U104 — Change the route orientation in 'countylog' network <!-- src: S3 · slide 6 · table · 2 -->

- **ID:** 2

### TC-U105 — Change the route direction in 'countylog' network <!-- src: S3 · slide 6 · table · 3 -->

- **ID:** 3

### TC-U106 — Change the route in 'countylog' network to the opposite direction <!-- src: S3 · slide 6 · table · 4 -->

- **ID:** 4

### TC-U107 — Create a reversed route in 'countylog' network <!-- src: S3 · slide 6 · table · 5 -->

- **ID:** 5

### TC-U108 — Flip route calibration in 'countylog' network <!-- src: S3 · slide 6 · table · 6 -->

- **ID:** 6

### TC-U109 — Flip route calibration direction in 'countylog' network in LRS. <!-- src: S3 · slide 6 · table · 7 -->

- **ID:** 7

### TC-U110 — Flip route orientation in 'countylog' network <!-- src: S3 · slide 6 · table · 8 -->

- **ID:** 8

### TC-U111 — Flip the calibration direction of a route in 'countylog' network in LRS <!-- src: S3 · slide 6 · table · 9 -->

- **ID:** 9

### TC-U112 — Flip the calibration direction of route in 'countylog' network <!-- src: S3 · slide 6 · table · 10 -->

- **ID:** 10

### TC-U113 — Flip the route direction in 'countylog' network <!-- src: S3 · slide 6 · table · 11 -->

- **ID:** 11

### TC-U114 — Flip the route in 'countylog' network <!-- src: S3 · slide 6 · table · 12 -->

- **ID:** 12

### TC-U115 — Flip the route in 'countylog' network from start to end. <!-- src: S3 · slide 6 · table · 13 -->

- **ID:** 13

### TC-U116 — Flip the route measures in 'countylog' network <!-- src: S3 · slide 6 · table · 14 -->

- **ID:** 14

### TC-U117 — Flip the route orientation in 'countylog' network <!-- src: S3 · slide 6 · table · 15 -->

- **ID:** 15

### TC-U118 — Perform route reversal on in 'countylog' network <!-- src: S3 · slide 6 · table · 16 -->

- **ID:** 16

### TC-U119 — Reverse route direction in 'countylog' network <!-- src: S3 · slide 6 · table · 17 -->

- **ID:** 17

### TC-U120 — Reverse route orientation in 'countylog' network <!-- src: S3 · slide 6 · table · 18 -->

- **ID:** 18

### TC-U121 — Reverse route calibration in 'countylog' network for LRS <!-- src: S3 · slide 6 · table · 19 -->

- **ID:** 19

### TC-U122 — Reverse route direction in 'countylog' network using the Reverse tool. <!-- src: S3 · slide 6 · table · 20 -->

- **ID:** 20

### TC-U123 — Reverse route in 'countylog' network (21) <!-- src: S3 · slide 6 · table · 21 -->

- **ID:** 21

### TC-U124 — Reverse route in 'countylog' network (22) <!-- src: S3 · slide 6 · table · 22 -->

- **ID:** 22

### TC-U125 — Reverse route measures in 'countylog' network <!-- src: S3 · slide 6 · table · 23 -->

- **ID:** 23

### TC-U126 — Reverse route calibration of in 'countylog' network <!-- src: S3 · slide 6 · table · 24 -->

- **ID:** 24

### TC-U127 — Reverse route geometry of in 'countylog' network <!-- src: S3 · slide 6 · table · 25 -->

- **ID:** 25

### TC-U128 — Reverse the route direction in 'countylog' network <!-- src: S3 · slide 6 · table · 26 -->

- **ID:** 26

### TC-U129 — Reverse the route layout in 'countylog' network <!-- src: S3 · slide 6 · table · 27 -->

- **ID:** 27

### TC-U130 — Reverse the route path in 'countylog' network <!-- src: S3 · slide 6 · table · 28 -->

- **ID:** 28

### TC-U131 — Reverse the route in 'countylog' network <!-- src: S3 · slide 6 · table · 29 -->

- **ID:** 29

### TC-U132 — Reverse the route in 'countylog' network for correct calibration. <!-- src: S3 · slide 6 · table · 30 -->

- **ID:** 30

### TC-U133 — Reverse the route in 'countylog' network for proper alignment. <!-- src: S3 · slide 6 · table · 31 -->

- **ID:** 31

### TC-U134 — Reverse the route geometry in 'countylog' network <!-- src: S3 · slide 6 · table · 32 -->

- **ID:** 32

### TC-U135 — route reversal in 'countylog' <!-- src: S3 · slide 6 · table · 33 -->

- **ID:** 33

### TC-U136 — route reverse in 'countylog' network <!-- src: S3 · slide 6 · table · 34 -->

- **ID:** 34

### TC-U137 — Swap the route start in 'countylog' network <!-- src: S3 · slide 6 · table · 35 -->

- **ID:** 35

### TC-U138 — Switch the route direction in 'countylog' network <!-- src: S3 · slide 6 · table · 36 -->

- **ID:** 36

### TC-U139 — make the route in 'countylog' network go backwards <!-- src: S3 · slide 6 · table · 37 -->

- **ID:** 37

### TC-U140 — inverse route direction of in 'countylog' network <!-- src: S3 · slide 6 · table · 38 -->

- **ID:** 38

### TC-U141 — make the route direction of in 'countylog' network contrary to present <!-- src: S3 · slide 6 · table · 39 -->

- **ID:** 39

### TC-U142 — make the route in 'countylog' network facing back <!-- src: S3 · slide 6 · table · 40 -->

- **ID:** 40

### TC-U143 — make the route in 'countylog' network go opposing to present direction <!-- src: S3 · slide 6 · table · 41 -->

- **ID:** 41

### TC-U144 — make the route in 'countylog' network to flow in different direction <!-- src: S3 · slide 6 · table · 42 -->

- **ID:** 42

### TC-U145 — make the route direction of in 'countylog' network contradiction to present <!-- src: S3 · slide 6 · table · 43 -->

- **ID:** 43

### TC-U146 — turn the route in 'countylog' network opposite way <!-- src: S3 · slide 6 · table · 44 -->

- **ID:** 44

### TC-U147 — change course fo the route in 'countylog' network <!-- src: S3 · slide 6 · table · 45 -->

- **ID:** 45

### TC-U148 — change path of the route in 'countylog' network <!-- src: S3 · slide 6 · table · 46 -->

- **ID:** 46

### TC-U149 — turn over the route in 'countylog' network <!-- src: S3 · slide 6 · table · 47 -->

- **ID:** 47

### TC-U150 — turn the route direction of in 'countylog' network <!-- src: S3 · slide 6 · table · 48 -->

- **ID:** 48

### TC-U151 — invert route calibration of in 'countylog' network <!-- src: S3 · slide 6 · table · 49 -->

- **ID:** 49

### TC-U152 — interchange the calibration of the route in 'countylog' network <!-- src: S3 · slide 6 · table · 50 -->

- **ID:** 50

### TC-U153 — Reverse the route and use and select ' countylog ' network <!-- src: S3 · slide 6 · table · 51 -->

- **ID:** 51

### TC-U154 — Apply Reverse tool to flip route "R1" direction in 'countylog' network in Roads <!-- src: S3 · slide 8 · table · 1 -->

- **ID:** 1
- **Case:** Apply Reverse tool to flip route "R1" direction in 'countylog' network in Roads and highways

### TC-U155 — Change the route "R1" orientation in 'countylog' network <!-- src: S3 · slide 8 · table · 2 -->

- **ID:** 2

### TC-U156 — Change the route "R1" direction in 'countylog' network <!-- src: S3 · slide 8 · table · 3 -->

- **ID:** 3

### TC-U157 — Change the route "R1" in 'countylog' network to the opposite direction <!-- src: S3 · slide 8 · table · 4 -->

- **ID:** 4

### TC-U158 — Create a reversed route "R1" in 'countylog' network <!-- src: S3 · slide 8 · table · 5 -->

- **ID:** 5

### TC-U159 — Flip route "R1" calibration in 'countylog' network <!-- src: S3 · slide 8 · table · 6 -->

- **ID:** 6

### TC-U160 — Flip route "R1" calibration direction in 'countylog' network in LRS. <!-- src: S3 · slide 8 · table · 7 -->

- **ID:** 7

### TC-U161 — Flip route "R1" orientation in 'countylog' network <!-- src: S3 · slide 8 · table · 8 -->

- **ID:** 8

### TC-U162 — Flip the calibration direction of a route "R1" in 'countylog' network in LRS <!-- src: S3 · slide 8 · table · 9 -->

- **ID:** 9

### TC-U163 — Flip the calibration direction of route "R1" in 'countylog' network <!-- src: S3 · slide 8 · table · 10 -->

- **ID:** 10

### TC-U164 — Flip the route "R1" direction in 'countylog' network <!-- src: S3 · slide 8 · table · 11 -->

- **ID:** 11

### TC-U165 — Flip the route "R1" in 'countylog' network <!-- src: S3 · slide 8 · table · 12 -->

- **ID:** 12

### TC-U166 — Flip the route "R1" in 'countylog' network from start to end. <!-- src: S3 · slide 8 · table · 13 -->

- **ID:** 13

### TC-U167 — Flip the route "R1" measures in ' countylog ' network <!-- src: S3 · slide 8 · table · 14 -->

- **ID:** 14

### TC-U168 — Flip the route "R1" orientation in 'countylog' network <!-- src: S3 · slide 8 · table · 15 -->

- **ID:** 15

### TC-U169 — Perform route reversal on "R1" in 'countylog' network <!-- src: S3 · slide 8 · table · 16 -->

- **ID:** 16

### TC-U170 — Reverse route "R1" direction in 'countylog' network <!-- src: S3 · slide 8 · table · 17 -->

- **ID:** 17

### TC-U171 — Reverse route "R1" orientation in 'countylog' network <!-- src: S3 · slide 8 · table · 18 -->

- **ID:** 18

### TC-U172 — Reverse route "R1" calibration in 'countylog' network for LRS <!-- src: S3 · slide 8 · table · 19 -->

- **ID:** 19

### TC-U173 — Reverse route "R1" direction in 'countylog' network using the Reverse tool. <!-- src: S3 · slide 8 · table · 20 -->

- **ID:** 20

### TC-U174 — Reverse route "R1" in 'countylog' network (21) <!-- src: S3 · slide 8 · table · 21 -->

- **ID:** 21

### TC-U175 — Reverse route "R1" in 'countylog' network (22) <!-- src: S3 · slide 8 · table · 22 -->

- **ID:** 22

### TC-U176 — Reverse route "R1" measures in 'countylog' network <!-- src: S3 · slide 8 · table · 23 -->

- **ID:** 23

### TC-U177 — Reverse route calibration of "R1" in 'countylog' network <!-- src: S3 · slide 8 · table · 24 -->

- **ID:** 24

### TC-U178 — Reverse route geometry of "R1" in 'countylog' network <!-- src: S3 · slide 8 · table · 25 -->

- **ID:** 25

### TC-U179 — Reverse the route "R1" direction in 'countylog' network <!-- src: S3 · slide 8 · table · 26 -->

- **ID:** 26

### TC-U180 — Reverse the route "R1" layout in 'countylog' network <!-- src: S3 · slide 8 · table · 27 -->

- **ID:** 27

### TC-U181 — Reverse the route "R1" path in 'countylog' network <!-- src: S3 · slide 8 · table · 28 -->

- **ID:** 28

### TC-U182 — Reverse the route "R1" in 'countylog' network <!-- src: S3 · slide 8 · table · 29 -->

- **ID:** 29

### TC-U183 — Reverse the route "R1" in 'countylog' network for correct calibration. <!-- src: S3 · slide 8 · table · 30 -->

- **ID:** 30

### TC-U184 — Reverse the route "R1" in 'countylog' network for proper alignment. <!-- src: S3 · slide 8 · table · 31 -->

- **ID:** 31

### TC-U185 — Reverse the route "R1"geometry in 'countylog' network <!-- src: S3 · slide 8 · table · 32 -->

- **ID:** 32

### TC-U186 — route reversal "R1" in 'countylog' <!-- src: S3 · slide 8 · table · 33 -->

- **ID:** 33

### TC-U187 — route reverse "R1" in 'countylog' network <!-- src: S3 · slide 8 · table · 34 -->

- **ID:** 34

### TC-U188 — Swap the route "R1" start in 'countylog' network <!-- src: S3 · slide 8 · table · 35 -->

- **ID:** 35

### TC-U189 — Switch the route direction "R1" in 'countylog' network <!-- src: S3 · slide 8 · table · 36 -->

- **ID:** 36

### TC-U190 — make the route "R1" in 'countylog' network go backwards <!-- src: S3 · slide 8 · table · 37 -->

- **ID:** 37

### TC-U191 — inverse route direction of "R1" in 'countylog' network <!-- src: S3 · slide 8 · table · 38 -->

- **ID:** 38

### TC-U192 — make the route direction of "R1" in 'countylog' network contrary to present <!-- src: S3 · slide 8 · table · 39 -->

- **ID:** 39

### TC-U193 — make the route "R1" in 'countylog' network facing back <!-- src: S3 · slide 8 · table · 40 -->

- **ID:** 40

### TC-U194 — make the route "R1" in 'countylog' network go opposing to present direction <!-- src: S3 · slide 8 · table · 41 -->

- **ID:** 41

### TC-U195 — make the route "R1" in 'countylog' network to flow in different direction <!-- src: S3 · slide 8 · table · 42 -->

- **ID:** 42

### TC-U196 — make the route direction of "R1" in 'countylog' network contradiction to present <!-- src: S3 · slide 8 · table · 43 -->

- **ID:** 43

### TC-U197 — turn the route "R1" in 'countylog' network opposite way <!-- src: S3 · slide 8 · table · 44 -->

- **ID:** 44

### TC-U198 — change course fo the route "R1" in 'countylog' network <!-- src: S3 · slide 8 · table · 45 -->

- **ID:** 45

### TC-U199 — change path of the route "R1" in 'countylog' network <!-- src: S3 · slide 8 · table · 46 -->

- **ID:** 46

### TC-U200 — turn over the route "R1" in 'countylog' network <!-- src: S3 · slide 8 · table · 47 -->

- **ID:** 47

### TC-U201 — turn the route direction of "R1" in 'countylog' network <!-- src: S3 · slide 8 · table · 48 -->

- **ID:** 48

### TC-U202 — invert route calibration of "R1" in 'countylog' network <!-- src: S3 · slide 8 · table · 49 -->

- **ID:** 49

### TC-U203 — interchange the calibration of the route "R1" in 'countylog' network <!-- src: S3 · slide 8 · table · 50 -->

- **ID:** 50

### TC-U204 — Reverse the route "R1" and use and select ' countylog ' network <!-- src: S3 · slide 8 · table · 51 -->

- **ID:** 51

### TC-U205 — Apply Reverse tool to flip route "R1" direction from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 1 -->

- **ID:** 1
- **Case:** Apply Reverse tool to flip route "R1" direction from 01/01/2010 in network in Roads and highways

### TC-U206 — Change the route "R1" orientation from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 2 -->

- **ID:** 2

### TC-U207 — Change the route "R1" direction from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 3 -->

- **ID:** 3

### TC-U208 — Change the route "R1" from 01/01/2010 in network to the opposite direction <!-- src: S3 · slide 10 · table · 4 -->

- **ID:** 4

### TC-U209 — Create a reversed route "R1" from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 5 -->

- **ID:** 5

### TC-U210 — Flip route "R1" calibration from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 6 -->

- **ID:** 6

### TC-U211 — Flip route "R1" calibration direction from 01/01/2010 in network in LRS. <!-- src: S3 · slide 10 · table · 7 -->

- **ID:** 7

### TC-U212 — Flip route "R1" orientation from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 8 -->

- **ID:** 8

### TC-U213 — Flip the calibration direction of a route "R1" from 01/01/2010 in network in LRS <!-- src: S3 · slide 10 · table · 9 -->

- **ID:** 9

### TC-U214 — Flip the calibration direction of route "R1" from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 10 -->

- **ID:** 10

### TC-U215 — Flip the route "R1" direction from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 11 -->

- **ID:** 11

### TC-U216 — Flip the route "R1" from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 12 -->

- **ID:** 12

### TC-U217 — Flip the route "R1" from 01/01/2010 in network from start to end. <!-- src: S3 · slide 10 · table · 13 -->

- **ID:** 13

### TC-U218 — Flip the route "R1" measures from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 14 -->

- **ID:** 14

### TC-U219 — Flip the route "R1" orientation from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 15 -->

- **ID:** 15

### TC-U220 — Perform route reversal on "R1" from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 16 -->

- **ID:** 16

### TC-U221 — Reverse route "R1" direction from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 17 -->

- **ID:** 17

### TC-U222 — Reverse route "R1" orientation from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 18 -->

- **ID:** 18

### TC-U223 — Reverse route "R1" calibration from 01/01/2010 in network for LRS <!-- src: S3 · slide 10 · table · 19 -->

- **ID:** 19

### TC-U224 — Reverse route "R1" direction from 01/01/2010 in network using the Reverse tool. <!-- src: S3 · slide 10 · table · 20 -->

- **ID:** 20

### TC-U225 — Reverse route "R1" from 01/01/2010 in network (21) <!-- src: S3 · slide 10 · table · 21 -->

- **ID:** 21

### TC-U226 — Reverse route "R1" from 01/01/2010 in network (22) <!-- src: S3 · slide 10 · table · 22 -->

- **ID:** 22

### TC-U227 — Reverse route "R1" measures from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 23 -->

- **ID:** 23

### TC-U228 — Reverse route calibration of "R1" from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 24 -->

- **ID:** 24

### TC-U229 — Reverse route geometry of "R1" from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 25 -->

- **ID:** 25

### TC-U230 — Reverse the route "R1" direction from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 26 -->

- **ID:** 26

### TC-U231 — Reverse the route "R1" layout from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 27 -->

- **ID:** 27

### TC-U232 — Reverse the route "R1" path from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 28 -->

- **ID:** 28

### TC-U233 — Reverse the route "R1" from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 29 -->

- **ID:** 29

### TC-U234 — Reverse the route "R1" from 01/01/2010 in network for correct calibration. <!-- src: S3 · slide 10 · table · 30 -->

- **ID:** 30

### TC-U235 — Reverse the route "R1" from 01/01/2010 in network for proper alignment. <!-- src: S3 · slide 10 · table · 31 -->

- **ID:** 31

### TC-U236 — Reverse the route "R1"geometry from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 32 -->

- **ID:** 32

### TC-U237 — route reversal "R1" from 01/01/2010 in <!-- src: S3 · slide 10 · table · 33 -->

- **ID:** 33

### TC-U238 — route reverse "R1" from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 34 -->

- **ID:** 34

### TC-U239 — Swap the route "R1" start from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 35 -->

- **ID:** 35

### TC-U240 — Switch the route direction "R1" from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 36 -->

- **ID:** 36

### TC-U241 — make the route "R1" from 01/01/2010 in network go backwards <!-- src: S3 · slide 10 · table · 37 -->

- **ID:** 37

### TC-U242 — inverse route direction of "R1" from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 38 -->

- **ID:** 38

### TC-U243 — make the route direction of "R1" from 01/01/2010 in network contrary to present <!-- src: S3 · slide 10 · table · 39 -->

- **ID:** 39

### TC-U244 — make the route "R1" from 01/01/2010 in network facing back <!-- src: S3 · slide 10 · table · 40 -->

- **ID:** 40

### TC-U245 — make the route "R1" from 01/01/2010 in network go opposing to present direction <!-- src: S3 · slide 10 · table · 41 -->

- **ID:** 41

### TC-U246 — make the route "R1" from 01/01/2010 in network to flow in different direction <!-- src: S3 · slide 10 · table · 42 -->

- **ID:** 42

### TC-U247 — make the route direction of "R1" from 01/01/2010 in network contradiction <!-- src: S3 · slide 10 · table · 43 -->

- **ID:** 43
- **Case:** make the route direction of "R1" from 01/01/2010 in network contradiction to present

### TC-U248 — turn the route "R1" from 01/01/2010 in network opposite way <!-- src: S3 · slide 10 · table · 44 -->

- **ID:** 44

### TC-U249 — change course fo the route "R1" from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 45 -->

- **ID:** 45

### TC-U250 — change path of the route "R1" from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 46 -->

- **ID:** 46

### TC-U251 — turn over the route "R1" from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 47 -->

- **ID:** 47

### TC-U252 — turn the route direction of "R1" from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 48 -->

- **ID:** 48

### TC-U253 — invert route calibration of "R1" from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 49 -->

- **ID:** 49

### TC-U254 — interchange the calibration of the route "R1" from 01/01/2010 in network <!-- src: S3 · slide 10 · table · 50 -->

- **ID:** 50

### TC-U255 — Reverse the route "R1" and use from 01/01/2010 and select network <!-- src: S3 · slide 10 · table · 51 -->

- **ID:** 51

### TC-U256 — Change direction of all connected pipeline routes between R1 and R10 from <!-- src: S3 · slide 11 · table · 1 -->

- **ID:** 1
- **Case:** Change direction of all connected pipeline routes between R1 and R10 from 01/01/2010 in this system

### TC-U257 — Change direction of all connected routes from 01/01/2010 that is between R1 <!-- src: S3 · slide 11 · table · 2 -->

- **ID:** 2
- **Case:** Change direction of all connected routes from 01/01/2010 that is between R1 and R10

### TC-U258 — Change direction of all connected routes from R1 and R10 and effective <!-- src: S3 · slide 11 · table · 3 -->

- **ID:** 3
- **Case:** Change direction of all connected routes from R1 and R10 and effective for the specified date range 01/01/2010

### TC-U259 — Change direction of all connected routes from R1 to R10 from 01/01/2010 <!-- src: S3 · slide 11 · table · 4 -->

- **ID:** 4
- **Case:** Change direction of all connected routes from R1 to R10 from 01/01/2010 in the current version of the LRS

### TC-U260 — Change direction of all connected routes in r1 and r10 from r1 to r10 <!-- src: S3 · slide 11 · table · 5 -->

- **ID:** 5
- **Case:** Change direction of all connected routes in r1 and r10 from r1 to r10, store the changes in a new time slice 01/01/2026

### TC-U261 — Change direction of all connected routes from r1 to r10 of the current LRS <!-- src: S3 · slide 11 · table · 6 -->

- **ID:** 6
- **Case:** Change direction of all connected routes from r1 to r10 of the current LRS network from 01/01/2010

### TC-U262 — Change direction of all contiguous routes r1 and r10 from 01/01/2010 <!-- src: S3 · slide 11 · table · 7 -->

- **ID:** 7

### TC-U263 — Change direction of all LRS routes r1 to r10 from 01/01/2010 <!-- src: S3 · slide 11 · table · 8 -->

- **ID:** 8
- **Case:** Change direction of all LRS routes r1 to r10 from 01/01/2010 that are topologically connected to the active route

### TC-U264 — Change direction of all routes between the chosen From and To route IDs R1 <!-- src: S3 · slide 11 · table · 9 -->

- **ID:** 9
- **Case:** Change direction of all routes between the chosen From and To route IDs R1 and R10 from 01/01/2010

### TC-U265 — Change direction of all routes on this r1 and r10 from 01/01/2010 between <!-- src: S3 · slide 11 · table · 10 -->

- **ID:** 10
- **Case:** Change direction of all routes on this r1 and r10 from 01/01/2010 between the specified R1 start and R10 end locations

### TC-U266 — Change direction of calibration for concurrent connected routes r1 to r10 from <!-- src: S3 · slide 11 · table · 11 -->

- **ID:** 11
- **Case:** Change direction of calibration for concurrent connected routes r1 to r10 from 01/01/2010 sharing geometry

### TC-U267 — Change direction of calibration for multiple connected routes r1 and r10 using <!-- src: S3 · slide 11 · table · 12 -->

- **ID:** 12
- **Case:** Change direction of calibration for multiple connected routes r1 and r10 using a single effective date 01/01/2010

### TC-U268 — Change direction of connected roadway routes from 01/01/2010 , r1, r10 <!-- src: S3 · slide 11 · table · 13 -->

- **ID:** 13

### TC-U269 — Change direction of connected routes first in r1 and r10 from 01/01/2010 <!-- src: S3 · slide 11 · table · 14 -->

- **ID:** 14

### TC-U270 — Change direction of connected routes in r1 and r10 from 01/01/2010 <!-- src: S3 · slide 11 · table · 15 -->

- **ID:** 15
- **Case:** Change direction of connected routes in r1 and r10 from 01/01/2010 in a published LRS feature service

### TC-U271 — Change direction of connected routes r1 and r10 from 01/01/2010 that were <!-- src: S3 · slide 11 · table · 16 -->

- **ID:** 16
- **Case:** Change direction of connected routes r1 and r10 from 01/01/2010 that were calibrated in the wrong direction

### TC-U272 — Change direction of corridor routes in r1 and r10 with a future effective date <!-- src: S3 · slide 11 · table · 17 -->

- **ID:** 17
- **Case:** Change direction of corridor routes in r1 and r10 with a future effective date of 01/01/2030

### TC-U273 — Change direction of direction for all connected routes within this r1 and r10 <!-- src: S3 · slide 11 · table · 18 -->

- **ID:** 18
- **Case:** Change direction of direction for all connected routes within this r1 and r10 from 01/01/2010

### TC-U274 — Change direction of direction for every route in r1 and r10 from 01/01/2010 <!-- src: S3 · slide 11 · table · 19 -->

- **ID:** 19
- **Case:** Change direction of direction for every route in r1 and r10 from 01/01/2010 in the LRS line network

### TC-U275 — Change direction of direction for multiple connected routes in r1 and r10 from <!-- src: S3 · slide 11 · table · 20 -->

- **ID:** 20
- **Case:** Change direction of direction for multiple connected routes in r1 and r10 from 01/01/2010 without altering route IDs

### TC-U276 — Change direction of direction of all connected routes in r1 and r10 from <!-- src: S3 · slide 11 · table · 21 -->

- **ID:** 21
- **Case:** Change direction of direction of all connected routes in r1 and r10 from 01/01/2010 in this LRS workspace

### TC-U277 — Change direction of direction of each connected route on the chosen r1 and r10 <!-- src: S3 · slide 11 · table · 22 -->

- **ID:** 22
- **Case:** Change direction of direction of each connected route on the chosen r1 and r10 from 01/01/2010

### TC-U278 — Change direction of multiple connected routes in r1 and r10 from 01/01/2010 (23) <!-- src: S3 · slide 11 · table · 23 -->

- **ID:** 23
- **Case:** Change direction of multiple connected routes in r1 and r10 from 01/01/2010 in a branch versioned network

### TC-U279 — Change direction of multiple connected routes in r1 and r10 from 01/01/2010 (24) <!-- src: S3 · slide 11 · table · 24 -->

- **ID:** 24
- **Case:** Change direction of multiple connected routes in r1 and r10 from 01/01/2010 in an editing session

### TC-U280 — Change direction of multiple connected routes in r1 and r10 from 01/01/2010 (25) <!-- src: S3 · slide 11 · table · 25 -->

- **ID:** 25
- **Case:** Change direction of multiple connected routes in r1 and r10 from 01/01/2010 while preserving their geometry locations

### TC-U281 — Change direction of multiple connected routes that share the same line name r1 <!-- src: S3 · slide 11 · table · 26 -->

- **ID:** 26
- **Case:** Change direction of multiple connected routes that share the same line name r1 and r10 from 01/01/2010

### TC-U282 — Change direction of multiple routes in r1 and r10 from 01/01/2010 from <!-- src: S3 · slide 11 · table · 27 -->

- **ID:** 27
- **Case:** Change direction of multiple routes in r1 and r10 from 01/01/2010 from the location referencing editing tools

### TC-U283 — Change direction of multiple routes r1 and r10 from 01/01/2010 using <!-- src: S3 · slide 11 · table · 28 -->

- **ID:** 28
- **Case:** Change direction of multiple routes r1 and r10 from 01/01/2010 using a back-dated effective date

### TC-U284 — Change direction of the calibration direction of every connected route on this <!-- src: S3 · slide 11 · table · 29 -->

- **ID:** 29
- **Case:** Change direction of the calibration direction of every connected route on this r1 and r10 from 01/01/2010

### TC-U285 — Flip all connected pipeline routes in r1 and r10 from 01/01/2010 in this system <!-- src: S3 · slide 11 · table · 30 -->

- **ID:** 30

### TC-U286 — Flip all connected routes from 01/01/2010 that belong to 'r1 and r10' <!-- src: S3 · slide 12 · table · 31 -->

- **ID:** 31

### TC-U287 — Flip all connected routes in r1 and r10 effective for the specified date range <!-- src: S3 · slide 12 · table · 32 -->

- **ID:** 32
- **Case:** Flip all connected routes in r1 and r10 effective for the specified date range 01/01/2010

### TC-U288 — Flip all connected routes in r1 and r10 from 01/01/2010 in the current version <!-- src: S3 · slide 12 · table · 33 -->

- **ID:** 33
- **Case:** Flip all connected routes in r1 and r10 from 01/01/2010 in the current version of the LRS

### TC-U289 — Flip all connected routes in r1 and r10 and store the changes in a new time <!-- src: S3 · slide 12 · table · 34 -->

- **ID:** 34
- **Case:** Flip all connected routes in r1 and r10 and store the changes in a new time slice 01/01/2026

### TC-U290 — Flip all connected routes in r1 and r10 from 01/01/2010 <!-- src: S3 · slide 12 · table · 35 -->

- **ID:** 35
- **Case:** Flip all connected routes in r1 and r10 from 01/01/2010, then run event behavior processing

### TC-U291 — Flip all connected routes in r1 and r10 of the current LRS network from <!-- src: S3 · slide 12 · table · 36 -->

- **ID:** 36
- **Case:** Flip all connected routes in r1 and r10 of the current LRS network from 01/01/2010

### TC-U292 — Flip all contiguous routes in the selected corridor r1 and r10 from 01/01/2010 <!-- src: S3 · slide 12 · table · 37 -->

- **ID:** 37

### TC-U293 — Flip all LRS routes in r1 and r10 from 01/01/2010 that are topologically <!-- src: S3 · slide 12 · table · 38 -->

- **ID:** 38
- **Case:** Flip all LRS routes in r1 and r10 from 01/01/2010 that are topologically connected to the active route

### TC-U294 — Flip all routes between the chosen From and To route IDs R1 and R10 from <!-- src: S3 · slide 12 · table · 39 -->

- **ID:** 39
- **Case:** Flip all routes between the chosen From and To route IDs R1 and R10 from 01/01/2010

### TC-U295 — Flip all routes in this r1 and r10 from 01/01/2010 while maintaining network <!-- src: S3 · slide 12 · table · 40 -->

- **ID:** 40
- **Case:** Flip all routes in this r1 and r10 from 01/01/2010 while maintaining network continuity

### TC-U296 — Flip calibration for concurrent connected routes in r1 and r10 from 01/01/2010 <!-- src: S3 · slide 12 · table · 41 -->

- **ID:** 41
- **Case:** Flip calibration for concurrent connected routes in r1 and r10 from 01/01/2010 sharing geometry

### TC-U297 — Flip calibration for every route in r1 and r10 from 01/01/2010 <!-- src: S3 · slide 12 · table · 42 -->

- **ID:** 42

### TC-U298 — Flip calibration for multiple connected routes in r1 and r10 using a single <!-- src: S3 · slide 12 · table · 43 -->

- **ID:** 43
- **Case:** Flip calibration for multiple connected routes in r1 and r10 using a single effective date 01/01/2010

### TC-U299 — Flip calibration for multiple routes that share a continuous r1 and r10 from <!-- src: S3 · slide 12 · table · 44 -->

- **ID:** 44
- **Case:** Flip calibration for multiple routes that share a continuous r1 and r10 from 01/01/2010

### TC-U300 — Flip connected routes in r1 and r10 from 01/01/2010 in a published LRS feature <!-- src: S3 · slide 12 · table · 45 -->

- **ID:** 45
- **Case:** Flip connected routes in r1 and r10 from 01/01/2010 in a published LRS feature service

### TC-U301 — Flip connected routes r1 and r10 from 01/01/2010 that were calibrated <!-- src: S3 · slide 12 · table · 46 -->

- **ID:** 46
- **Case:** Flip connected routes r1 and r10 from 01/01/2010 that were calibrated in the wrong direction

### TC-U302 — Flip corridor routes in r1 and r10 with a future effective date of 01/01/2030 <!-- src: S3 · slide 12 · table · 47 -->

- **ID:** 47

### TC-U303 — Flip direction for all connected routes within this r1 and r10 from 01/01/2010 <!-- src: S3 · slide 12 · table · 48 -->

- **ID:** 48

### TC-U304 — Flip direction for connected routes in r1 and r10 from 01/01/2010 <!-- src: S3 · slide 12 · table · 49 -->

- **ID:** 49
- **Case:** Flip direction for connected routes in r1 and r10 from 01/01/2010 in a multi-route corridor

### TC-U305 — Flip multiple connected routes in r1 and r10 from 01/01/2010 in a branch <!-- src: S3 · slide 12 · table · 50 -->

- **ID:** 50
- **Case:** Flip multiple connected routes in r1 and r10 from 01/01/2010 in a branch versioned network

### TC-U306 — Flip multiple connected routes in r1 and r10 from 01/01/2010 in an editing <!-- src: S3 · slide 12 · table · 51 -->

- **ID:** 51
- **Case:** Flip multiple connected routes in r1 and r10 from 01/01/2010 in an editing session

### TC-U307 — Flip multiple connected routes that share the same line name r1 and r10 from <!-- src: S3 · slide 12 · table · 52 -->

- **ID:** 52
- **Case:** Flip multiple connected routes that share the same line name r1 and r10 from 01/01/2010

### TC-U308 — Flip multiple routes along this pipeline in r1 and r10 from 01/01/2010 <!-- src: S3 · slide 12 · table · 53 -->

- **ID:** 53

### TC-U309 — Flip multiple routes in r1 and r10 from 01/01/2010 from the location referencing <!-- src: S3 · slide 12 · table · 54 -->

- **ID:** 54
- **Case:** Flip multiple routes in r1 and r10 from 01/01/2010 from the location referencing editing tools

### TC-U310 — Reverse all connected pipeline routes in r1 and r10 from 01/01/2010 in this <!-- src: S3 · slide 12 · table · 55 -->

- **ID:** 55
- **Case:** Reverse all connected pipeline routes in r1 and r10 from 01/01/2010 in this system

### TC-U311 — Reverse all connected routes from 01/01/2010 that belong to this line ID 'r1 <!-- src: S3 · slide 12 · table · 56 -->

- **ID:** 56
- **Case:** Reverse all connected routes from 01/01/2010 that belong to this line ID 'r1 and r10'

### TC-U312 — Reverse all connected routes in r1 and r10 effective for the specified date <!-- src: S3 · slide 12 · table · 57 -->

- **ID:** 57
- **Case:** Reverse all connected routes in r1 and r10 effective for the specified date range 01/01/2010

### TC-U313 — Reverse all connected routes in r1 and r10 from 01/01/2010 in the current <!-- src: S3 · slide 12 · table · 58 -->

- **ID:** 58
- **Case:** Reverse all connected routes in r1 and r10 from 01/01/2010 in the current version of the LRS

### TC-U314 — Reverse all connected routes in r1 and r10 and store the changes in a new time <!-- src: S3 · slide 12 · table · 59 -->

- **ID:** 59
- **Case:** Reverse all connected routes in r1 and r10 and store the changes in a new time slice 01/01/2026

### TC-U315 — Reverse all connected routes in r1 and r10 of the current LRS network from <!-- src: S3 · slide 12 · table · 60 -->

- **ID:** 60
- **Case:** Reverse all connected routes in r1 and r10 of the current LRS network from 01/01/2010

### TC-U316 — Reverse all contiguous routes in the selected corridor r1 and r10 from <!-- src: S3 · slide 12 · table · 61 -->

- **ID:** 61
- **Case:** Reverse all contiguous routes in the selected corridor r1 and r10 from 01/01/2010

### TC-U317 — Reverse all routes between the chosen From and To route IDs R1 and R10 from <!-- src: S3 · slide 12 · table · 62 -->

- **ID:** 62
- **Case:** Reverse all routes between the chosen From and To route IDs R1 and R10 from 01/01/2010

### TC-U318 — Reverse all routes in this r1 and r10 from 01/01/2010 while maintaining network <!-- src: S3 · slide 12 · table · 63 -->

- **ID:** 63
- **Case:** Reverse all routes in this r1 and r10 from 01/01/2010 while maintaining network continuity

### TC-U319 — Reverse calibration for concurrent connected routes in r1 and r10 from <!-- src: S3 · slide 12 · table · 64 -->

- **ID:** 64
- **Case:** Reverse calibration for concurrent connected routes in r1 and r10 from 01/01/2010 sharing geometry

### TC-U320 — Reverse calibration for every route in r1 and r10 from 01/01/2010 <!-- src: S3 · slide 12 · table · 65 -->

- **ID:** 65

### TC-U321 — Reverse calibration for multiple connected routes in r1 and r10 using a single <!-- src: S3 · slide 12 · table · 66 -->

- **ID:** 66
- **Case:** Reverse calibration for multiple connected routes in r1 and r10 using a single effective date 01/01/2010

### TC-U322 — Reverse calibration for multiple routes that share a continuous r1 and r10 from <!-- src: S3 · slide 12 · table · 67 -->

- **ID:** 67
- **Case:** Reverse calibration for multiple routes that share a continuous r1 and r10 from 01/01/2010

### TC-U323 — Reverse connected routes r1 and r10 from 01/01/2010 that were calibrated <!-- src: S3 · slide 12 · table · 68 -->

- **ID:** 68
- **Case:** Reverse connected routes r1 and r10 from 01/01/2010 that were calibrated in the wrong direction

### TC-U324 — Reverse corridor routes in r1 and r10 with a future effective date of 01/01/2030 <!-- src: S3 · slide 12 · table · 69 -->

- **ID:** 69

### TC-U325 — Reverse direction for all connected routes within this r1 and r10 from <!-- src: S3 · slide 12 · table · 70 -->

- **ID:** 70
- **Case:** Reverse direction for all connected routes within this r1 and r10 from 01/01/2010

### TC-U326 — Reverse direction for connected routes in r1 and r10 from 01/01/2010 <!-- src: S3 · slide 12 · table · 71 -->

- **ID:** 71
- **Case:** Reverse direction for connected routes in r1 and r10 from 01/01/2010 in a multi-route corridor

### TC-U327 — Reverse direction for every route in r1 and r10 from 01/01/2010 in the LRS line <!-- src: S3 · slide 12 · table · 72 -->

- **ID:** 72
- **Case:** Reverse direction for every route in r1 and r10 from 01/01/2010 in the LRS line network

### TC-U328 — Reverse direction of all connected routes in r1 and r10 from 01/01/2010 <!-- src: S3 · slide 12 · table · 73 -->

- **ID:** 73

### TC-U329 — Reverse direction of all connected routes in r1 and r10 from 01/01/2010 in this <!-- src: S3 · slide 12 · table · 74 -->

- **ID:** 74
- **Case:** Reverse direction of all connected routes in r1 and r10 from 01/01/2010 in this LRS workspace

### TC-U330 — Reverse direction of all selected routes in r1 and r10 from 01/01/2010 <!-- src: S3 · slide 12 · table · 75 -->

- **ID:** 75

### TC-U331 — Reverse direction of each connected route on the chosen r1 and r10 from <!-- src: S3 · slide 12 · table · 76 -->

- **ID:** 76
- **Case:** Reverse direction of each connected route on the chosen r1 and r10 from 01/01/2010

### TC-U332 — Reverse direction of every connected route in r1 and r10 from 01/01/2010 <!-- src: S3 · slide 12 · table · 77 -->

- **ID:** 77

### TC-U333 — Reverse multiple connected routes in r1 and r10 from 01/01/2010 in an editing <!-- src: S3 · slide 12 · table · 78 -->

- **ID:** 78
- **Case:** Reverse multiple connected routes in r1 and r10 from 01/01/2010 in an editing session

### TC-U334 — Reverse multiple routes in r1 and r10 from 01/01/2010 from the location <!-- src: S3 · slide 12 · table · 79 -->

- **ID:** 79
- **Case:** Reverse multiple routes in r1 and r10 from 01/01/2010 from the location referencing editing tools

## Other content

### Slide 3 <!-- slide 3 -->

Scenario 2

### Slide 5 — AI Assistant – Reverse Route <!-- slide 5 -->

Scenario 3

### Slide 7 <!-- slide 7 -->

Scenario 4

### Slide 9 <!-- slide 9 -->

Scenario 5

### Slide 11 <!-- slide 11 -->

Scenario 6

### Slide 13 — Help prompts <!-- slide 13 -->

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

### Slide 14 <!-- slide 14 -->

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
