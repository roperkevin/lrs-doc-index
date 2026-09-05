# Reassign Transfer Conflict Prevention Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Source** | [Reassign_Transfer_ConflictPrevention.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/Reassign_Transfer_ConflictPrevention.pptx>) |
| **Edited** | 2023-07-21 19:51 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Reassign Transfer Conflict Prevention Test Plan"
source_file: "Reassign_Transfer_ConflictPrevention.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/Reassign_Transfer_ConflictPrevention.pptx"
doc_id: 534
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Rahul Rakshit"
last_edited_by: "Rahul Rakshit"
last_edited: "2023-07-21T19:51:52Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["lock acquisition", "lock transfer", "reassign tool", "network engineering", "route locking", "conflict prevention"]
tools: ["Reassign tool"]
products: []
issues: []
related: [{"doc":559,"file":"conflict-prevention-reassign-route-user-story__doc559.md","s":5.07},{"doc":666,"file":"conflict-prevention-for-event-editing-in-pro-lr-event-tools__doc666.md","s":4.706},{"doc":670,"file":"conflict-prevention-for-event-editing-in-pro-core-tools__doc670.md","s":4.703},{"doc":671,"file":"conflict-prevention-for-event-editing-in-pro-core-tools__doc671.md","s":4.685},{"doc":668,"file":"test-plan-for-conflict-prevention-for-add-multiple-line-events-tool-in-arcgis__doc668.md","s":4.563}]
```
-->

## Summary

Test plan for the Reassign tool focusing on lock acquisition and transfer scenarios in an engineering network. Covers cases including no existing locks, own locks, other users' locks in same or different versions, and concurrent route locks. Includes miscellaneous tests for lock acquisition behavior and REST endpoint testing.

## Related documents

<!-- related:begin -->
- [Conflict Prevention Reassign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-reassign-route-user-story__doc559.md>) — similar text 0.35 · 3 title words · 3 filename words · same surface <!-- rel:559 -->
- [Conflict Prevention for Event Editing in Pro – LR Event Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/conflict-prevention-for-event-editing-in-pro-lr-event-tools__doc666.md>) — similar text 0.26 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:666 -->
- [Conflict Prevention for Event Editing in Pro – Core Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/conflict-prevention-for-event-editing-in-pro-core-tools__doc670.md>) — similar text 0.26 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:670 -->
- [Conflict Prevention for Event Editing in Pro – Core Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/conflict-prevention-for-event-editing-in-pro-core-tools__doc671.md>) — similar text 0.25 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:671 -->
- [Test Plan for Conflict Prevention for Add Multiple Line Events Tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/test-plan-for-conflict-prevention-for-add-multiple-line-events-tool-in-arcgis__doc668.md>) — similar text 0.20 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:668 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html)

_No page matched:_ [Reassign tool](https://www.google.com/search?q=%22Reassign%20tool%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 2 fields, 4 buttons, 3 colour blocks, 1 row separator, 17 icons, 38 text rows. 18 of 38 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc408_slide1.svg)

## Slide 2

![Interface screenshot redrawn as a standardized wireframe: 2 panels, 4 fields, 3 buttons, 2 colour blocks, 1 row separator, 7 icons, 70 text rows. 59 of 70 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc408_slide2.svg)

| Test ID | 0 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | When is the lock acquired? |  |  |

Lock acquired 1
Lock acquired 2
Verify

- Releasable status will remain ‘yes’ if the Reassign tool is not run or reassign tool fails!
- If no lock is acquired by the tool, then releasable status will remain as is.
- Acquire lock if user selects another route / line on map or Types the name in the text box.
- Locks will be acquired and auto released in default version upon successful execution of the tool.

![image2.png](../media/doc408_image2.png)

## Slide 3

| Test ID | 1 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | Reassign to existing Line: No lock exists for source or target lines |  |  |

| Expected | Both Source and target lines locked |
| --- | --- |
| Edit | Goes through |
| Messages | Lock acquired for L1; Lock acquired for L2 |
| Releasable status | No |

[figure: L1 · L2 · Source · Target · Input · Output]

![image3.png](../media/doc408_image3.png)

## Slide 4

| Test ID | 2 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | Reassign to existing Line: Own lock in the same version exists for Source Line |  |  |

| Expected | Target line gets locked |
| --- | --- |
| Edit | Goes through |
| Messages | Lock acquired for L2 |
| Releasable status | No |

[figure: L1 · L2 · Source · Target · Input · Output]

![image3.png](../media/doc408_image3.png)

## Slide 5

| Test ID | 3 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | Reassign to existing Line: Own lock in the same version exists for Source and Target Lines |  |  |

| Expected | No new lock acquired |
| --- | --- |
| Edit | Goes through |
| Messages |  |
| Releasable status | No |

[figure: L1 · L2 · Source · Target · Input · Output]

![image3.png](../media/doc408_image3.png)

## Slide 6

| Test ID | 4 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | Reassign to existing Line: Another user’s lock in the same version exists for Source Line. Version not in edit mode. |  |  |

| Expected | Lock for L1 gets transferred, Lock acquired for L2 |
| --- | --- |
| Edit | Goes through |
| Messages | Lock acquired for L2 |
| Releasable status | No |

[figure: L1 · L2 · Source · Target · Input · Output]

![image3.png](../media/doc408_image3.png) ![image5.png](../media/doc408_image5.png)

## Slide 7

| Test ID | 5 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | Reassign to existing Line: Another user’s lock in the same version exists for Source and Target Lines. Version not in edit mode. |  |  |

| Expected | Locks for L1 and L2 gets transferred |
| --- | --- |
| Edit | Goes through |
| Messages |  |
| Releasable status | No |

[figure: L1 · L2 · Source · Target · Input · Output]

![image3.png](../media/doc408_image3.png) ![image5.png](../media/doc408_image5.png)

## Slide 8

| Test ID | 6 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | Reassign to existing Line: Another user’s lock in the same version exists for Source and Target Lines. Version in edit mode. |  |  |

| Expected | No locks acquired |
| --- | --- |
| Edit | Does not go through |
| Messages | Unable to acquire lock on Line L1 |
| Releasable status | No change |

[figure: L1 · L2 · Source · Target · Input · Output]

![image5.png](../media/doc408_image5.png)

## Slide 9

| Test ID | 7 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | Reassign to existing Line: Another user’s lock in another version exists for Source Line. |  |  |

| Expected | No Locks acquired |
| --- | --- |
| Edit | Does not go through |
| Messages | Unable to acquire lock for Line L1 |
| Releasable status | No change |

[figure: L1 · L2 · Source · Target · Input · Output]

![image7.png](../media/doc408_image7.png)

## Slide 10

| Test ID | 8 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | Reassign to existing Line: Another user’s lock in another version exists for Target Line. |  |  |

| Expected | Lock acquired for Line L1 |
| --- | --- |
| Edit | Does not go through |
| Messages | Lock acquired for Line L1 |
| Releasable status | No |

[figure: L1 · L2 · Source · Target · Input · Output]

![image7.png](../media/doc408_image7.png)

## Slide 11

| Test ID | 9 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | Reassign to existing Line: Another user’s lock in another version exists for Source and Target Lines. |  |  |

| Expected | No locks acquired |
| --- | --- |
| Edit | Does not go through |
| Messages | Unable to acquire lock on Line L1 |
| Releasable status | No change |

[figure: L1 · L2 · Source · Target · Input · Output]

![image7.png](../media/doc408_image7.png)

## Slide 12

| Test ID | 10 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | Reassign to new Line: No lock exists for source Line |  |  |

| Expected | Only source Line gets locked |
| --- | --- |
| Edit | Goes through |
| Messages | Lock acquired for L1 |
| Releasable status | No |

[figure: L1 · Source · L2 · Target · Input · Output]

![image3.png](../media/doc408_image3.png)

## Slide 13

| Test ID | 11 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | Reassign to new Line: Own lock in the same version exists for Source Line |  |  |

| Expected | No line gets locked |
| --- | --- |
| Edit | Goes through |
| Messages |  |
| Releasable status | No |

[figure: L1 · Source · L2 · Target · Input · Output]

![image3.png](../media/doc408_image3.png)

## Slide 14

| Test ID | 12 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | Reassign to new Line: Another user’s lock in the same version exists for Source Line. Version not in edit mode. |  |  |

| Expected | Lock for L1 gets transferred |
| --- | --- |
| Edit | Goes through |
| Messages |  |
| Releasable status | No |

[figure: L1 · Source · L2 · Target · Input · Output]

![image3.png](../media/doc408_image3.png) ![image5.png](../media/doc408_image5.png)

## Slide 15

| Test ID | 13 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | Reassign to new Line: Another user’s lock in the same version exists for Source Line. Version in edit mode. |  |  |

| Expected | No locks acquired |
| --- | --- |
| Edit | Does not go through |
| Messages | Unable to acquire lock on Line L1 |
| Releasable status | No change |

[figure: L1 · Source · Input · Output]

![image5.png](../media/doc408_image5.png)

## Slide 16

| Test ID | 14 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | Reassign to new Line: Another user’s lock in another version exists for Source Line. |  |  |

| Expected | No Locks acquired |
| --- | --- |
| Edit | Does not go through |
| Messages | Unable to acquire lock for Line L1 |
| Releasable status | No change |

[figure: L1 · Source · Input · Output]

![image7.png](../media/doc408_image7.png)

## Slide 17

| Test ID | 15 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | Reassign to new Line: Concurrent route on another line is locked by another user in another version for Source Line. |  |  |

| Expected | No Locks acquired |
| --- | --- |
| Edit | Does not go through |
| Messages | Unable to acquire lock for Line L1 |
| Releasable status | No change |

[figure: L1 · Source · Input · Output · Concurrent Route]

![image7.png](../media/doc408_image7.png)

## Slide 18

| Test ID | 16 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | Reassign to existing Line: Concurrent route on another line is locked by another user in another version for Target Line. |  |  |

| Expected | No Locks acquired |
| --- | --- |
| Edit | Does not go through |
| Messages | Unable to acquire lock for Line L1 |
| Releasable status | No change |

[figure: L1 · L2 · Source · Target · Input · Output · Concurrent Route]

![image7.png](../media/doc408_image7.png)

## Slide 19

| Test ID | 17 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | Miscellaneous cases |  |  |

Input

  - Confirm that we will acquire a lock if we type the name of a target Line for which all routes have already been retired and the reassignment date is today.
  - Test acquire locks REST endpoint.
  - Test with PoM data

Event lock will not result in showing a line lock in the locks table. But we will be unable to acquire a lock for the link as another user in that case. Confirm with Lakshmi.
