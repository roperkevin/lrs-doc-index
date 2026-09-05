# Location Referencing Pro 3.0 Iteration 4 Retrospective

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Utility Network |
| **Source** | [Location Referencing Pro 3.0 Iteration 4 Retrospective.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Location%20Referencing%20Pro%203.0%20Iteration%204%20Retrospective.pdf>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "Location Referencing Pro 3.0 Iteration 4 Retrospective"
source_file: "Location Referencing Pro 3.0 Iteration 4 Retrospective.pdf"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Location%20Referencing%20Pro%203.0%20Iteration%204%20Retrospective.pdf"
doc_id: 673
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: ""
extracted: 2026-09-04
extraction_lane: plaintext
prompt_version: "v2.0.2"
keywords: ["location referencing", "iteration review", "user story", "test plan", "docker container", "unit tests", "retrospective"]
tools: []
products: ["Utility Network"]
issues: []
related: [{"doc":366,"file":"pro-3-3-and-11-3-iteration-issue-tracking__doc366.md","s":3.479},{"doc":59,"file":"iteration-planning-and-issue-tracking-for-esri-lrs-development__doc59.md","s":2.67},{"doc":886,"file":"definition-of-done__doc886.md","s":2.559},{"doc":677,"file":"split-events-in-arcgis-pro__doc677.md","s":2.486},{"doc":109,"file":"pro-ai-assistant-reverse-route-user-story__doc109.md","s":2.257}]
```
-->

## Summary

This document summarizes the retrospective review of the Location Referencing Pro 3.0 Iteration 4, including participant feedback, issues encountered, recognition, and action items for improvement. It covers team challenges such as workload management, issue tracking, user story completeness, testing depth, and suggestions for process enhancements like Docker container setup and unit testing.

## Related documents

<!-- related:begin -->
- [Pro 3.3 and 11.3 Iteration Issue Tracking](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Schedules/pro-3-3-and-11-3-iteration-issue-tracking__doc366.md>) — similar text 0.09 · 2 title words · 2 filename words · same surface <!-- rel:366 -->
- [Iteration Planning and Issue Tracking for Esri LRS Development](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Schedules/iteration-planning-and-issue-tracking-for-esri-lrs-development__doc59.md>) — similar text 0.18 · 1 title word · 1 filename word · same surface/folder <!-- rel:59 -->
- [Definition of Done](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/definition-of-done__doc886.md>) — similar text 0.21 · same kind/surface <!-- rel:886 -->
- [Split Events in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/split-events-in-arcgis-pro__doc677.md>) — similar text 0.07 · 1 title word · 1 filename word · same surface/folder <!-- rel:677 -->
- [Pro AI Assistant Reverse Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-reverse-route-user-story__doc109.md>) — similar text 0.08 · 1 title word · same surface/folder <!-- rel:109 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)
<!-- docs:end -->

---

Created by EasyRetro.io

Location Referencing
Pro 3.0 Iteration 4 Retrospective
23 February 2022

Retrospective summary:
  11 Participants
  33 Cards - 8 Comments
  9 Voted - 45 Votes

Ø=ÜMThumbs up

  • The Pro UI event user stories had very few issues. (1 votes)

  • Awesome work by Johum to shield the PEs from Godzilla.

  • Great work by Eric and Praveen on the UN patch issues.

Ø=ÜNThumbs down

  • The team is taking on more work than they can realistically do in a single
  iteration. Issues keep flowing over from one iteration to the next, and aren't
  often being re-estimated considering the amount of time they stay on the
  board. (7 votes)

     Comments
    - This has been brought up again and again and still remains an issue.

  • Some issues were logged without a link to the original user story or related issue. (1
  votes)

  • Should not 'fake' closing user stories. (4 votes)

  • PEs don't always attach to the issue the connection file and project that was used to
  publish data.
     Comments
    - It would save some time from adding portal or switching to different portal, finding layers
     to add (with duplicate/similar names or group layers), adding layers to project (takes longer
     with non-local SDE), changing symbology, etc.
    - Why is the project required?
    - our team members have the required knowledge to create project and publish
 • Several user stories are missing necessary details. This is causing long design
 discussions in test plan reviews. The developers have to come back repeatedly to the
 PE for clarifications. This issue has been identified previously too. This extends
 timelines. (7 votes)

 • We are not doing enough testing in depth, and leading to issues found by stakeholders.
 (1 votes)

 • Only PEs are always under pressure to close the issues whereas other parts of the
 team such as dev-ops and documentation gets more time.

 Everyone should get fair time. (3 votes)

 • Need tighter follow up with core. Issues such as opening the attribute pane upon
 geometric editing of an event were discussed but are not present in the software yet.

Ø=Ü¡New Ideas

 • Create a separate issue for Test Plan. Any updates/questions/feedbacks
 should be posted in the comments so everyone is on the same page to
 avoid redoing the work or repeating feedback. Set up the meeting only
 after all the updates/questions/feedbacks are done. Any
 questions/feedbacks should be provided within 2 days after the latest test
 plan is posted. (2 votes)

 • We should create Docker containers for previous versions of ArcGIS Enterprise that
 PEs and devs can spin up whenever they need to. Configuring older versions of
 Enterprise/Pro/ArcMap on a single VM can turn into an all-day ordeal.
   Comments
  - https://github.com/worksofindustry/dev-arcgis-docker
  - Gaurav already worked on this.

 • A user story should be closed only when the documentation is completed. (3 votes)

 • If possible let us have the iteration review meeting first and then stakeholders meeting
 which will help to present the user story in a better way (2 votes)

 • Provide a table of action items discussed with dates and a comment if they are
 implemented or not. (2 votes)

 • Doc items should be estimated as something other than 0.5 (1 votes)
   Comments
  - Agree. The new estimate should be added to the user story. Also, the Doc estimate
   should be updated upon every review. The product engineer's effort should be captured
   too.
 • Create new tools that combine workflows and save clicks. Need to move beyond the 7
 editing tools that are present since forever.

 • Share the training course with the team.

 • Unit tests should be part of closing a user story.

 • Allocate 90-120 minutes for the iteration review meeting and another 90-120 minutes
 for the iteration retrospective meeting. (1 votes)

Ø<ßÆRecognition

 • Kudos to Eric and Rahul for presenting in the Dev Summit. (5 votes)

 • Kudos to Dan for working on Add line events user story (4 votes)

 • Thanks to Michael, Eric for fixing the patch + Export Network issues and to Rahul as
 well for verifying - everyone's patience is appreciated ! (1 votes)
   Comments
  - Export network issues are the hard ones

Action Items

 • Provide all the details in user stories including the workflows + diagrams
 with input /output. Design discussion should not happen during the test plan
 meeting. Every necessary detail should be outlined in the user story.

 • Provide feed back on test plan with in 2 days of sending the TP. If it is not possible then
 let the PE know.

 • Set up docker container with various version of enterprise / pro / arcmap.

 • Start related user story doc issues with 1 point.

 • Share the link to training courses: https://www.esri.com/training/catalog/621ea031a538
 18015ee38b4e/arcgis-roads-and-highways%3A-introduction-to-modeling-and-data-mana
 gement-in-a-desktop-environment/

 • (Where ever we can) Write unit tests for the user stories. If it is not possible to write the
 unit tests because of time constraints - log a bug to work on it later.

 • Keep 90 min. for each Iteration review and retro. meeting

 • Schedule retro and review meetings well in advance - ideally before the stake holders
 review meetings.

 • Reach out to Sharon / Nathan to discuss opening the attribute pane upon geom.
 editing and log a bug (if necessary)
