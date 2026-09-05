# Append Routes: Line Order Check User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#4975](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4975) |
| **Source** | [4975-AppendRoutesLineOrderCheck_UserStory_V2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/4975-AppendRoutesLineOrderCheck_UserStory_V2.pptx>) |
| **Edited** | 2023-04-07 14:22 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Append Routes: Line Order Check User Story"
source_file: "4975-AppendRoutesLineOrderCheck_UserStory_V2.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/4975-AppendRoutesLineOrderCheck_UserStory_V2.pptx"
doc_id: 578
doc_kind: "User Story"
surface: "Pro"
doc_revision: "V2"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2023-04-07T14:22:10Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["line order", "append routes", "route validation", "euler algorithm", "line network", "qaqc"]
tools: ["Append Routes"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#4975"]
related: [{"doc":564,"file":"append-routes-line-order-check-test-plan__doc564.md","s":1006.075},{"doc":741,"file":"append-routes-with-existing-utility-network-centerlines__doc741.md","s":4.23},{"doc":486,"file":"append-routes-consider-existing-centerlines__doc486.md","s":4.22},{"doc":579,"file":"append-routes-events-load-routes-events-by-route-name__doc579.md","s":4.137},{"doc":629,"file":"investigate-line-order-with-reverse-stationing__doc629.md","s":3.446}]
```
-->

## Summary

This user story describes the need for an Append Routes tool enhancement to validate Line Orders before appending routes to the LRS Network feature class. It includes checks using the Euler Algorithm and ensures Line Order values increment by 100, with invalid routes noted in an output text file. Testing, automation updates, and documentation revisions are planned to support this feature.

## Related documents

<!-- related:begin -->
- [Append Routes: Line Order Check Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/append-routes-line-order-check-test-plan__doc564.md>) — shared issue ArcGISPro/ps-location-referencing#4975 · similar text 0.21 · 5 title words · 5 filename words · same surface <!-- rel:564 -->
- [Append Routes with existing Utility Network centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-with-existing-utility-network-centerlines__doc741.md>) — similar text 0.21 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:741 -->
- [Append Routes Consider Existing Centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-consider-existing-centerlines__doc486.md>) — similar text 0.20 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:486 -->
- [Append Routes/Events: Load Routes/Events by Route Name](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/append-routes-events-load-routes-events-by-route-name__doc579.md>) — similar text 0.35 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:579 -->
- [Investigate Line Order with Reverse Stationing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/investigate-line-order-with-reverse-stationing__doc629.md>) — similar text 0.06 · 2 title words · 2 filename words · same surface/folder <!-- rel:629 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Append Routes: Line Order Check

User Story

## Slide 2 — User Story

As an LRS Editor, I need to ensure that route I append into my LRS Network have correct Line Orders so that I can prevent incorrect data input and save time with my QAQC efforts.
Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawings, FGDBs, etc.). The LRS Editor is constantly making changes to routes with new info provided from various sources that could not be up to data quality standards.  Because of this, the LRS Editor will need an extra check for Line Orders for added security that the data they are loading into their LRS Network is valid and correct.  Route(s) with invalid Line Orders can be caught before they are loaded into the LRS Network and fixed, potentially reducing the amount of time required for QAQC practices for fixing invalid data.

## Slide 3 — Append Routes: Line Order Check

Add check into Append Routes to ensure that Line Orders are valid before appending the routes to the LRS Network feature class

  - Check using the Euler Algorithm that Line Orders are correct
  - If Line Order is incorrect, append routes and in output .txt file note which routes have incorrect Line Order routes that need to be fixed
    - Pass with warning that some routes have issues that need to be fixed, see .txt file for more info.
  - Include a check that Line Order values are in increments of 100
    - If Line Order is not in increments of 100, note which routes have this in output .txt file
    - Ex: 100, 200, 300… not 1,2,3… or 10, 20, 30…

## Slide 4 — Testing

Test with RH and APR data, but lean heavier towards APR as this is only applicable for line networks
Append Routes with all incorrect Line Orders, check to make sure check catches the invalid routes and notes these routes in the output results .txt file
Append many routes, with most routes having a correct Line Order but have a decent amount of them having an incorrect Line Order.  Check that the incorrect routes are noted in output .txt file
Test appending in complex cases where routes may be out of order but have valid Line Orders

## Slide 5 — Automation

Update existing Python Append Routes automation
Update existing REST automation
Check existing automation still works as intended

## Slide 6 — Documentation

Update Append Routes GP Tool doc with info about this new check

  - Update script format and script examples if needed
Update Location Referencing Toolbox History doc if needed

## Slide 7 — Assignment

Story Points:
Dev:
PE:
