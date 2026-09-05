# Allow LRS Events and Intersections in Update Measures from LRS tool

| Field | Value |
| --- | --- |
| **Doc** | 393 · User Story · Pro |
| **Product** | Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [AllowLRSEvents&IntersectionsinUpdateMeasuresfromLRS.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AllowLRSEvents%26IntersectionsinUpdateMeasuresfromLRS.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2024-03-22 23:57 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | lrs event · lrs intersection · update measures · route · measure · event editing |
| **Tools** | Update Measures from LRS |

## Summary

This user story describes the need for the Update Measures from LRS tool in ArcGIS Pro to support LRS Events and LRS Intersection feature classes as inputs for updating measures. It outlines requirements to restrict certain field mappings when these inputs are used and specifies testing and automation plans to ensure correct functionality across different LRS data types and environments.

## Related documents

<!-- related:begin -->
- [Allow LRS Intersections to be updated without locking intersecting routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-lrs-intersections-to-be-updated-without-locking.md>) — similar text 0.25 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:163 s=4.275 -->
- [Support Vertical Route Segments/3D Interpolation in Update Measures from LRS GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-vertical-route-segments-3d-interpolation-in-update.md>) — similar text 0.23 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:746 s=4.138 -->
- [Allow Append Events to Run When Locks Are Present on Impacted Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-append-events-to-run-when-locks-are-present.md>) — similar text 0.24 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:168 s=3.793 -->
- [Support Complex Route Shapes in Update Measures from LRS GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-update-measures-from-lrs-gp.md>) — similar text 0.20 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:779 s=3.751 -->
- [Support Search Tolerance Parameter in Update Measures from LRS Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-search-tolerance-parameter-in-update-measures.md>) — similar text 0.17 · 2 title words · same kind/surface/folder <!-- rel:273 s=3.73 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View LRS event properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-lrs-event-properties.html) · [View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-lrs-intersection-properties.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [Update Measures from LRS](https://www.google.com/search?q=%22Update%20Measures%20from%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Allow LRS Events and Intersections in Update Measures from LRS tool <!-- slide 1 -->
User Story
ArcGIS Pro

### User Story <!-- slide 2 -->
As an LRS data editor, I need to be able to get additional route and measure information from the LRS onto events and intersections, so that I can maintain measures from multiple LRMs on a single feature.
Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  In pipeline organizations, we’re seeing them support more LRMs than just a line and derived network (example is an odometer network) and need to use the Update Measures from LRS tool to update these additional LRS routes/measures onto events and intersections.

## Acceptance Criteria
### Requirements <!-- slide 3 -->
- In the Update Measures from LRS tool, allow LRS Events and LRS Intersection feature classes/layers to be inputs to be updated
- If an LRS Event or Intersection is the input to the Update Measures from LRS tool, do not allow users to map the fields configured for routeID, measure(s), derived routeID, or derived measure(s) as the routeID, From Measure, or To Measure fields in the Update Measures from LRS tool
- Continue to enforce the same requirements/validations around fields that are mapped as the routeID and measure(s) fields in the Update Measures from LRS tool

## Testing
<!-- slide 4 -->
- Test with APR and APR-UN data
- Test with a mix of LRSes (Line Network and Non-Line Network combination & Line, Derived, and Non-Line Network combination)
- Test with events that do and do not span
- Verify existing automation continues to produce correct results for existing test cases
- Test in Pro, python inline, python stand alone, and model builder

## Automation
<!-- slide 5 -->
- Add to the existing python automation for this tool

## Documentation
<!-- slide 6 -->
- Update the existing documentation GP topic and mention that LRS Events and Intersections are supported as inputs to be updated, but that the existing fields configured with the LRS can’t be the inputs in those scenarios

## Assignment
### Story Points <!-- slide 7 -->
Story Points:
Dev:
PE:
