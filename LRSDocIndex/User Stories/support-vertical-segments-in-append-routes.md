# Support Vertical Segments in Append Routes

| Field | Value |
| --- | --- |
| **Doc** | 768 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [AppendRoutesVerticalRoutes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AppendRoutesVerticalRoutes.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-08-06 23:29 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | vertical segment · vertical gap · append routes · route shape · centerline |
| **Tools** | Append Routes |

## Summary

This document describes a user story for enabling the Append Routes tool to support routes with vertical pipe segments and vertical gaps. It outlines the requirements for correct appending of such routes, testing scenarios including line and non-line networks, and automation updates. It also mentions documentation updates to reflect the new capability and removal of obsolete error messages.

## Related documents

<!-- related:begin -->
- [Support Vertical Route Segments in Translate Events GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-route-segments-in-translate-events-gp.md>) — similar text 0.40 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:767 s=5.884 -->
- [Support Vertical Route Segments in Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-route-segments-in-overlay-events-gp.md>) — similar text 0.40 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:765 s=5.878 -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-reassign-route.md>) — similar text 0.33 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:758 s=4.646 -->
- [Support Vertical Route Segments/3D Interpolation in Update Measures from LRS GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-vertical-route-segments-3d-interpolation-in-update.md>) — similar text 0.34 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:746 s=4.573 -->
- [Append Routes with existing Utility Network centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-with-existing-un-centerlines.md>) — similar text 0.31 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:741 s=4.487 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support Vertical Segments in Append Routes <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS editor, I need to be able to append routes that include vertical pipe segments, so that I can properly load these routes as part of the LRS.

## Acceptance Criteria
### Append Routes <!-- slide 3 -->
- In the Append Routes tool, any source routes with vertical segments should be appended correctly
- The route shape should include the vertical segment(s)
- The centerline(s) with the vertical segment(s) should also be loaded
- Should also include being able to append routes with vertical gaps
- Currently these tools fail with an error message which should be removed and not appear when appending routes with vertical segments

## Testing
<!-- slide 4 -->
- Test in both line and non line networks
- Test with projected and unprojected data
- Test all load methods (add, replace by RouteID, retire by RouteID)
- Test with the following scenarios:
  - Route that is entirely vertical
  - Route that includes a vertical segment
  - Route that has a vertical gap
- No need to test other scenarios as they’re already supported/automated

## Automation
<!-- slide 5 -->
Add a few cases with vertical pipes to the existing python automation for Append Routes

## Documentation
<!-- slide 6 -->
Add a usage note to the Append Routes topics to mention it supports the loading vertical segments
Do we need to remove any error messages that are no longer valid?

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
