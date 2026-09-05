# Definition of Done for User Story and Test Plan Processes

|   |   |
| --- | --- |
| **Kind** | Other · Other |
| **Release** | — |
| **Source** | [DefintionofDoneUpdated.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/DefintionofDoneUpdated.docx>) |
| **Edited** | 2026-08-06 17:49 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Definition of Done for User Story and Test Plan Processes"
source_file: "DefintionofDoneUpdated.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/DefintionofDoneUpdated.docx"
doc_id: 3
doc_kind: "Other"
surface: "Other"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Mac Christmas"
last_edited: "2026-08-06T17:49:00Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["user story", "test plan", "automation", "documentation", "iteration review", "testing", "scrum", "test cases"]
tools: []
products: []
issues: []
related: [{"doc":886,"file":"definition-of-done__doc886.md","s":6.209},{"doc":673,"file":"location-referencing-pro-3-0-iteration-4-retrospective__doc673.md","s":2.275},{"doc":488,"file":"location-referencing-team-structure__doc488.md","s":2.114},{"doc":59,"file":"iteration-planning-and-issue-tracking-for-esri-lrs-development__doc59.md","s":1.743},{"doc":366,"file":"pro3-3-and-11-3-iteration-issue-tracking-for-location-referencing__doc366.md","s":1.663}]
```
-->

## Summary

This document outlines the definition of done criteria for user story authoring, test planning, testing, documentation, and automation within an iteration. It includes guidelines for estimating, reviewing, and completing user stories, test plans, and associated documentation and automation tasks. It also covers team meeting schedules, testing responsibilities, and status reporting requirements.

## Related documents

<!-- related:begin -->
- [Definition of Done](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/definition-of-done__doc886.md>) — similar text 0.75 · 2 title words · 1 filename word · same kind/folder <!-- rel:886 -->
- [Location Referencing Pro 3.0 Iteration 4 Retrospective](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/location-referencing-pro-3-0-iteration-4-retrospective__doc673.md>) — similar text 0.24 · same kind <!-- rel:673 -->
- [Location Referencing Team Structure](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/location-referencing-team-structure__doc488.md>) — similar text 0.17 · same kind/surface <!-- rel:488 -->
- [Iteration Planning and Issue Tracking for Esri LRS Development](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Schedules/iteration-planning-and-issue-tracking-for-esri-lrs-development__doc59.md>) — similar text 0.25 <!-- rel:59 -->
- [Pro3.3 and 11.3 Iteration Issue Tracking for Location Referencing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Schedules/pro3-3-and-11-3-iteration-issue-tracking-for-location-referencing__doc366.md>) — similar text 0.18 <!-- rel:366 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

Definition of Done
User Story Authoring
-Take iteration 1 solidify the release scope, author and estimate all user stories for the release
Test Plan
-Test plan provided while development is happening if possible
-Developer continues to be present for test plan review and knows the test cases that are going to be tested
-If several test cases are not passing/acceptance criteria items are not completed, will return the user story back to the developer to be completed
-Once the test plan has been reviewed, update it and upload to TFS, Devtopia, and Teams
-Should have identified the data that will be used for testing by the time you do a test plan review
-Make sure test plans include before/after edit diagrams/images/description
-Limit test plan creation to 2 days or fewer
-PE will provide final estimate for number of days to complete user story (include testing, bug fixing, documentation, and automation) if the effort required was significantly different than what was estimated
	-Reach out to SM if estimation was majorly off from the actual time spent
-Hold an iteration review type meeting after a developer finishes work on the user story (either ad hoc scheduling as needed or standing meeting for the team on a certain day/time each week)
	-Hold meeting after Scrum only on week 2 of iteration on Thursday to go over the above
-Hold retrospective meetings every iteration (make sure Nathan is there)
	-Schedule as far in advance as possible
Testing
-No more sharing the testing responsibilities between PEs, it doesn’t work
-Whatever is in the final test plan after the review is expected to be the minimum number of tests cases executed (there might be additional exploratory testing on top of what is in the test plan)
-Send at least one team member to Pro Holistic Testing each month
Documentation
-Want a 2nd layer of review from a stakeholder (Rahul for Pro, Mac for Experience Builder)
-Author, review (if needed), and submit documentation (via issue in Devtopia) to doc liaison to consider documentation complete and the user story can be closed (as long as all other components are completed)
-Technical writer should have documentation into the CMS for PE review within the iteration
	-If doc is provided in last week of iteration, then it should be into CMS by second week of next iteration
	-If feedback comes back from UA Team, PE should provide feedback/clarification within 3 days
-Draw.io diagrams will be provided to the UA Team, they will enter them into CMS
Automation
-Every user story should have automation where defined in the automation slide of the user story
-Break each user story with an automation component into two user stories (one for the user story, one for automating the user story)
-Python tests need to be written, verified locally, and ok’d by Praveen before they are considered complete
-Test complete tests need to be written and ok’d by Rahul before they are considered complete (make sure to follow the requirements in the doc Rahul provided)
-REST API tests need to be written, verified locally, and provided to Praveen to be ok’d before they are considered complete (make sure to follow the requirements in the doc Rahul provided)
- Experience Builder tests need to be written, verified locally, and provided to Lakshmi to be ok’d before they are considered complete (make sure to follow the requirements in the doc Lakshmi provided)
-Keep a local copy of your tests, data, other related documents (should take a day or less to be able to have the tests running locally if needed)
Other
- At Scrum standup, statuses need to be more detailed, rather than “I’m working on my queue.”
  - This will help to identify impediments
- Checkboxes in user story issue in Devtopia MUST be checked as components of the user story are completed. Before a user story can close, all checkboxes must be checked.
	-Additional info can also be added by editing the original user story issue
- Have a central location for internal/external presentation slides, recording, etc. When a presentation is given either internally or externally, send it to Claire.
