# Flip Centerline Tool In-Memory Flip User Story

| Field | Value |
| --- | --- |
| **Doc** | 602 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#4613](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4613) |
| **Source** | [Flip centerline tool does an in memory flip REST.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Flip%20centerline%20tool%20does%20an%20in%20memory%20flip%20REST.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2023-03-02 16:56 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | centerline · flip · in memory flip · reverse stationing · utility network · route editing |
| **Tools** | Create Route · Extend Route · Realign Route · lrsApplyEdits |

## Summary

Describes the user story for the flip centerline capability that flips centerlines only in memory to maintain Utility Network integrity and support reverse stationing. Details the approach for marking flipped centerlines in lrsApplyEdits REST calls and outlines testing, automation, and documentation updates.

## Related documents

<!-- related:begin -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/4613-flip-centerline-tool-in-memory-flip-rh-apr-un-2023-03.md>) — shared issue ArcGISPro/ps-location-referencing#4613 · similar text 0.68 · 4 title words · 5 filename words · same kind/surface/folder <!-- rel:601 s=1010.508 -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/4613-flip-centerline-tool-in-memory-flip-rh-apr-un-2023-02.md>) — shared issue ArcGISPro/ps-location-referencing#4613 · similar text 0.72 · 4 title words · 5 filename words · same kind/surface/folder <!-- rel:609 s=1010.366 -->
- [Flip Centerline Tool: In Memory Flip (UI) Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5042-flip-centerline-tool-in-memory-flip-ui.md>) — similar text 0.41 · 4 title words · 3 filename words · same surface <!-- rel:577 s=6.773 -->
- [LRS in GCS: In-memory only Densification](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/5415-lrs-in-gcs-in-memory-only-densification.md>) — similar text 0.15 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:485 s=3.899 -->
- [Update Centerline Measures When Splitting UN Pipelines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/update-centerline-measures-when-splitting-un-pipelines.md>) — similar text 0.18 · 1 title word · same kind/surface/folder <!-- rel:684 s=3.047 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-new-route.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/extend-a-route.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/realign-routes.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [lrsApplyEdits](https://www.google.com/search?q=%22lrsApplyEdits%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Flip centerline tool does an in-memory flip (REST) <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS editor, I need the flip centerline capability to only flip the centerline in memory, so that the integrity of the Utility Network is maintained in this scenario and reverse stationing is supported.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  When these editors are using the flip centerline capability in Create, Extend, and Realign Route tools, they need the centerline to only flip in memory (as opposed to the geometry permanently being flipped).  This is needed when the Utility Network is configured as it will prevent dirty areas from being created or subnetwork connectivity from being broken.  Additionally, to better support reverse stationing, the centerlines flip should only be in memory.

## Acceptance Criteria
### In memory centerline flip (REST) <!-- slide 3 -->
- In the Create, Extend, and Realign Route tools, when the flip geometry capability for centerline(s) is used, the centerline(s) should only flip in memory (the permanent geometry of the selected centerline(s)should stay the same)
- To support this in lrsApplyEdits, we’ll need a method to alert the endpoint which centerlines have been flipped from their permanent geometry
- Suggestion is to mark any flipped centerlines with a (-) in front of their OID when passed to lrsApplyEdits
- Ex. {
- "centerlineObjectIds" : 1132, -954, 8603 ...],
- If a centerline OID is negative, the endpoint would know the centerline has been flipped in memory and should use that flipped geometry when building the route

## Testing
<!-- slide 4 -->
- Test with APR and RH data (lean heavier to APR data)
- Test in reverse stationed scenarios (see https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4613 for more info)
- Test with both one or more than one centerlines being flipped

## Automation
<!-- slide 5 -->
Add 1-2 test cases to our existing ReadyAPI automation for Create, Extend, and Realign Route

## Documentation
<!-- slide 6 -->
Update the existing REST topic for lrsApplyEdits for these three operations to mention support for flipped centerlines by using a (-) in front of the OID

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
