# ArcGIS Experience Builder Collaboration Workflow

| Field | Value |
| --- | --- |
| **Doc** | 700 · Other · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Experienc Builder Collaboration Workflow.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Developers/Experienc%20Builder%20Collaboration%20Workflow.docx>) |
| **People** | author Jianxia Song · PE Jianxia Song · dev Junshan Liu |
| **Edited** | 2021-05-01 00:10 by Jianxia Song |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | experience builder · widget development · collaboration workflow · qa process · unit test · automation |
| **Tools** | — |

## Summary

Describes the collaboration workflow for Experience Builder widget development including initial contact, access requests, coding and UI/UX guidelines, testing, QA process, issue tracking, and release sign-off. Provides links to repositories, guidelines, and environments for development and testing. Specifies meeting scheduling considerations and team roles.

## Related documents

<!-- related:begin -->
- [Notes for Experience Builder Setup](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/notes-for-exb-setup.md>) — similar text 0.17 · 2 title words · same kind/surface/folder <!-- rel:477 s=3.523 -->
- [Spike: Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/exb.md>) — similar text 0.08 · 2 title words · 1 filename word · same surface <!-- rel:824 s=2.759 -->
- [Add Line Events Unit Tests in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-line-events-unit-tests-in-exb.md>) — similar text 0.12 · 2 title words · same surface <!-- rel:186 s=2.353 -->
- [Add Point Event Unit Tests in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-point-event-unit-tests-in-exb.md>) — similar text 0.12 · 2 title words · same surface <!-- rel:188 s=2.135 -->
- [Unit Tests in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/unit-tests-in-exb.md>) — similar text 0.09 · 2 title words · same surface <!-- rel:297 s=2.036 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

### ArcGIS Experience Builder Collaboration Workflow

1. Start the Initial contact with Experience Builder team regarding the widget plan.
The Experience Builder (ExB) online edition release usually syncs up with the AGOL release and follows the AGOL string freeze date.

1. Submit requests to access Experience Builder repos

- https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder/
- https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/

1. Review the coding guideline

- https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder/blob/develop/doc/code-guideline.md

1. Submit requests to access UI/UX guideline

- Create an account in figma, then submit the request.
- ExB Design system
- How to use figma

1. Invited to the Experience Builder Teams channel

1. Widget review meeting
There are 15 hours difference during the daylight-saving time and 16 hours for the rest of the year (based on PST). A meeting at or after 6 pm PST is recommended during the daylight-saving time and 5:30 pm PST for the rest of the year.

1. Make sure the widget works in the latest release of Developer Edition.

1. Folk the “develop” branch in devtopia and test the widget with the latest code. Submit pull requests to the “develop” branch.

1. Go through the QA process on dev and qa environments before releases

  - https://experiencedev.arcgis.com
  - https://experienceqa.arcgis.com

1. Write unit test, test cases, and test scripts for automation if available. Here are the unit test doc and example.

1. Issues are assigned to the widget owners

1. Create an issue related to the widget documentation/update in the repo and tag to the doc writer. See Query for the example documentation.

1. Test and sign off the widget during each release.

1. Share the widget enhancement plan before each release if applicable.

Initial contact: Jianxia Song (PM, Redlands)
Review: Junshan Liu, Dan Jiang, Tonghui Ming, Jingshun Guo (Dev Team, Beijing)
Documentation: Brandy Perkins (Writer, Redlands)
