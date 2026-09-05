# Definition of Done

| Field | Value |
| --- | --- |
| **Doc** | 886 · Other · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [DefinitionofDone.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/DefinitionofDone.docx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2019-06-10 20:55 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | user story · test plan · automation · documentation · iteration review · test cases · pro holistic testing |
| **Tools** | — |

## Summary

Defines the criteria and processes for completing user stories, including authoring, test planning, testing, documentation, and automation. Emphasizes iteration reviews, test plan reviews, and automation requirements for user stories. Specifies roles and responsibilities for developers, PEs, and documentation stakeholders.

## Related documents

<!-- related:begin -->
- [Definition of Done for User Story and Test Plan Processes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/definition-of-done-for-user-story-and-test-plan-processes.md>) — similar text 0.75 · 2 title words · 1 filename word · same kind/folder <!-- rel:3 s=6.209 -->
- [Location Referencing Pro 3.0 Iteration 4 Retrospective](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lr-pro-3-0-iteration-4-retrospective.md>) — similar text 0.21 · same kind/surface <!-- rel:673 s=2.559 -->
- [Pro 3.3 and 11.3 Iteration Issue Tracking](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Schedules/504-pro-3-3-and-11-3-iteration-issue-tracking.md>) — similar text 0.10 · same surface <!-- rel:366 s=1.628 -->
- [Iteration Planning and Issue Tracking for Esri LRS Development](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Schedules/363-iteration-planning-and-issue-tracking-for-esri-lrs.md>) — similar text 0.21 · same surface <!-- rel:59 s=1.34 -->
- [Location Referencing Team Structure](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lr-team-structure.md>) — similar text 0.10 · same kind <!-- rel:488 s=1.336 -->
<!-- related:end -->

---

Definition of Done

### User Story Authoring
-Take iteration 1 solidify the release scope, author and estimate all user stories for the release

### Test Plan
-Test plan provided while development is happening
-Developer continues to be present for test plan review and knows the test cases that are going to be tested
-If several test cases are not passing/acceptance criteria items are not completed, will return the user story back to the developer to be completed
-Once the test plan has been reviewed, update it and upload to TFS and Devtopia (make sure to note any test cases that failed or did something other than what was expected)
-Should have identified the data that will be used for testing by the time you do a test plan review
-Make sure test plans include before/after edit diagrams/images/description
-Limit test plan creation to 3 days or fewer
-PE will provide final estimate for number of days to complete user story (include testing, bug fixing, documentation, and automation) if the effort required was significantly different than what was estimated
-Hold an iteration review type meeting after a developer finishes work on the user story (either ad hoc scheduling as needed or standing meeting for the team on a certain day/time each week)
-Hold retrospective meetings every iteration (and Will needs to be there)

### Testing
-No more sharing the testing responsibilities between PEs, it doesn’t work
-Whatever is in the final test plan after the review is expected to be the minimum number of tests cases executed (there might be additional exploratory testing on top of what is in the test plan)
-Send at least one team member to Pro Holistic Testing each week

### Documentation
-Want a 2nd layer of review from a stakeholder (Product Manager, industry SME, someone else?) before doc is published
-Author, review (if needed), and submit documentation (via issue in Devtopia) to doc liaison to consider documentation complete
-Technical writer should have documentation into the CMS for PE review within 2 weeks of receiving item

### Automation
-Every user story other than Event Editor should have automation
-Break each user story with an automation component into two user stories (one for the user story, one for automating the user story)
-Python tests need to be written, verified locally, and ok’d by Chandan (either in person meeting or email confirmation) before they are considered complete
-Test complete tests need to be written and ok’d by Chandan (either in person meeting or email confirmation) before they are considered complete (make sure to follow the requirements in the doc Rahul provided)
-REST API tests need to be written, verified locally, and provided to Chandan to be ok’d (either in person meeting or email confirmation) before they are considered complete (make sure to follow the requirements in the doc Rahul provided)
-Keep a local copy of your tests, data, other related documents (should take a day or less to be able to have the tests running locally if needed)
-Include one test case that could be added to the Pro holistic test suite for each Pro user story
