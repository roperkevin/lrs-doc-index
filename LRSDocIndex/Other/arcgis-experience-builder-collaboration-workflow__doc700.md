# ArcGIS Experience Builder Collaboration Workflow

|   |   |
| --- | --- |
| **Kind** | Other · Experience Builder |
| **Release** | — |
| **Source** | [Experienc Builder Collaboration Workflow.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Developers/Experienc%20Builder%20Collaboration%20Workflow.docx>) |
| **Edited** | 2021-05-01 00:10 by Jianxia Song |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "ArcGIS Experience Builder Collaboration Workflow"
source_file: "Experienc Builder Collaboration Workflow.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Developers/Experienc%20Builder%20Collaboration%20Workflow.docx"
doc_id: 700
doc_kind: "Other"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: "Jianxia Song"
dev: "Junshan Liu"
author: "Jianxia Song"
last_edited_by: "Jianxia Song"
last_edited: "2021-05-01T00:10:00Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["experience builder", "widget development", "collaboration workflow", "qa process", "unit test", "automation"]
tools: []
products: []
issues: []
related: [{"doc":477,"file":"notes-for-experience-builder-setup__doc477.md","s":3.523},{"doc":824,"file":"spike-experience-builder__doc824.md","s":2.759},{"doc":186,"file":"add-line-events-unit-tests-in-experience-builder__doc186.md","s":2.353},{"doc":188,"file":"add-point-event-unit-tests-in-experience-builder__doc188.md","s":2.135},{"doc":297,"file":"unit-tests-in-experience-builder__doc297.md","s":2.036}]
```
-->

## Summary

Describes the collaboration workflow for Experience Builder widget development including initial contact, access requests, coding and UI/UX guidelines, testing, QA process, issue tracking, and release sign-off. Provides links to repositories, guidelines, and environments for development and testing. Specifies meeting scheduling considerations and team roles.

## Related documents

<!-- related:begin -->
- [Notes for Experience Builder Setup](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/notes-for-experience-builder-setup__doc477.md>) — similar text 0.17 · 2 title words · same kind/surface/folder <!-- rel:477 -->
- [Spike: Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-experience-builder__doc824.md>) — similar text 0.08 · 2 title words · 1 filename word · same surface <!-- rel:824 -->
- [Add Line Events Unit Tests in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-line-events-unit-tests-in-experience-builder__doc186.md>) — similar text 0.12 · 2 title words · same surface <!-- rel:186 -->
- [Add Point Event Unit Tests in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-point-event-unit-tests-in-experience-builder__doc188.md>) — similar text 0.12 · 2 title words · same surface <!-- rel:188 -->
- [Unit Tests in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/unit-tests-in-experience-builder__doc297.md>) — similar text 0.09 · 2 title words · same surface <!-- rel:297 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

ArcGIS Experience Builder Collaboration Workflow

- Start the Initial contact with Experience Builder team regarding the widget plan.
The Experience Builder (ExB) online edition release usually syncs up with the AGOL release and follows the AGOL string freeze date.

- Submit requests to access Experience Builder repos
- https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder/
- https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/
- Review the coding guideline
- https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder/blob/develop/doc/code-guideline.md
- Submit requests to access UI/UX guideline
- Create an account in figma, then submit the request.
- ExB Design system
- How to use figma
- Invited to the Experience Builder Teams channel
- Widget review meeting
There are 15 hours difference during the daylight-saving time and 16 hours for the rest of the year (based on PST). A meeting at or after 6 pm PST is recommended during the daylight-saving time and 5:30 pm PST for the rest of the year.

- Make sure the widget works in the latest release of Developer Edition.
- Folk the “develop” branch in devtopia and test the widget with the latest code. Submit pull requests to the “develop” branch.
- Go through the QA process on dev and qa environments before releases
  - https://experiencedev.arcgis.com
  - https://experienceqa.arcgis.com
- Write unit test, test cases, and test scripts for automation if available. Here are the unit test doc and example.
- Issues are assigned to the widget owners
- Create an issue related to the widget documentation/update in the repo and tag to the doc writer. See Query for the example documentation.
- Test and sign off the widget during each release.
- Share the widget enhancement plan before each release if applicable.

Initial contact: Jianxia Song (PM, Redlands)
Review: Junshan Liu, Dan Jiang, Tonghui Ming, Jingshun Guo (Dev Team, Beijing)
Documentation: Brandy Perkins (Writer, Redlands)
