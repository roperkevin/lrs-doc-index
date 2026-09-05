# Support LRS Partial Posting

| Field | Value |
| --- | --- |
| **Doc** | 738 · User Story · Enterprise |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [SupportLRSPartialPosting.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportLRSPartialPosting.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-01-14 00:53 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | partial posting · version editing · route edits · event edits · conflict prevention · validation · lrs feature classes |
| **Tools** | — |

## Summary

Describes the need for partial posting of edits in LRS versions to allow some edits to be posted while others remain unposted, supporting long-running transactions. Details validation requirements to maintain integrity across related LRS feature classes and tables during partial posts. Includes testing scenarios and automation considerations for partial posting functionality.

## Related documents

<!-- related:begin -->
- [Spike: Partial Posting Impact on LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/1221-partial-posting-impact-on-lrs.md>) — similar text 0.28 · 2 title words · 1 filename word · same folder <!-- rel:750 s=3.305 -->
- [Support Conflict Prevention in Route Editing skills in Pro AI Assistant](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-conflict-prevention-in-route-editing-skills-in-pro.md>) — similar text 0.16 · 1 title word · 1 filename word · same kind/folder <!-- rel:94 s=2.697 -->
- [Support Snap, Delete, and Ignore Options for Calibration Points in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-delete-and-ignore-options-for-cp.md>) — similar text 0.16 · 1 title word · 1 filename word · same kind/folder <!-- rel:729 s=2.538 -->
- [Hide Lock Transfer in Event Editor for Pro Services](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/753-hide-lock-transfer-in-event-editor-for-pro-services.md>) — similar text 0.14 · same kind/folder <!-- rel:714 s=1.918 -->
- [REST/GP: Support the centerline feature class like an event in Query Attribute Set/Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-gp-support-the-centerline-feature-class-like-an-event.md>) — similar text 0.17 · 1 title word · same kind/folder <!-- rel:475 s=1.916 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html)

_No page matched:_ [apply edits](https://www.google.com/search?q=%22apply%20edits%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support LRS Partial Posting <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS editor, I need to be able to post some edits made in a version (but not all), so that those edits are reflected when other LRS editors made additional edits/event editors can add/update events on the partially posted edits.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these document.  A scenario that can occur (especially in the pipeline/utility space) that impacts these editors is they might need to keep a version alive for a long period of time (long running transactions) due to one or two routes.  In order to support keeping these versions alive for a long period of time but continue to allow other users to see edits made, partial posting will allow these users to post some of their edits while keeping others in their versions for long period of time.  We need to support this partial posting concept for these users so they can post some of the route/event edits for a version, while not posting other edits.

## Acceptance Criteria
### LRS partial posting <!-- slide 3 -->
- When a partial post is made, check to see if any of the layers where the partial post is taking place are part of an LRS (min schema, networks, events, intersections, edit log table, and locks table)
- If any of the LRS items are included in the partial post, we need to evaluate the partially posted features and determine if the partial post will maintain the integrity across all the impacted LRS feature classes/tables
- If the partial post includes all the necessary records across the related LRS items, then we should let the partial post go through
- If the partial post doesn’t include all the necessary records across the related LRS items, we need to fail
- An example would be if a user partially posts a retirement to part of RouteA on the Network feature class.  We would need to verify that the correct records for this edit to RouteA are in the following places:
  - Centerline (centerline split)
  - Centerline Sequence (centerline split and time slicing of old records)
  - Calibration Point (retirement of old CPs, creation of new CPs)
  - Edit Log (record of the retirement)
  - Locks (if conflict prevention is enabled, we need to verify the lock exists on the record so it can be removed)
  - All registered Events (behaviors applied)

### LRS partial posting <!-- slide 4 -->
The developer that works on the story can determine the most efficient way to implement this.  The information below is a potential approach that came out of the partial posting spike.

We can do something like grouping edits by route / line ID (we do something similar in Query Locks for determining releasable status):

- Get the LRS classes that are included in the partial post.
- Gather route / line IDs from the edits in these classes which are going to be partially posted.
- Make sure that no edit that happened in the same version and references the same route / line IDs are excluded from this partial post, i.e. all edits related to a particular route / line would need to be posted together in the partial post. Users can leave behind edits for other route / line IDs to be posted later.
- This needs to be a validation, instead of our code adding the need-to-be-posted rows to the partial post during runtime (as mentioned in the spike PPT).

## Testing
<!-- slide 5 -->
- Test on a variety of LRS edits (Create, Retire, Extend, Realign, Reassign, Cartorealign, Calibrate)
- Test partially posting records from various LRS items (min schema, Network, Events, Intersections)
- Positive test would be to partially post everything needed (the edit should go through in this case)
- Test with and without Conflict Prevention enabled
- Doesn’t matter what network types, event types, spatial references, route shape types are edited as this should apply to any LRS edit to LRS feature classes/tables

## Automation
<!-- slide 6 -->
Add automation for these partial posting cases (LRS applyEdits endpoint)

## Documentation
<!-- slide 7 -->
We should document that we support partial posting, but also make sure to mention that we will only allow the post to go through when all the related LRS items are also included in the post operation request (providing an example would be helpful)

## Assignment
<!-- slide 8 -->
Story Points:
Dev:
PE:
