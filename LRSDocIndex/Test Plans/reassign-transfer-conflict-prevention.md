# Reassign Transfer Conflict Prevention Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 534 · Test Plan · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Reassign_Transfer_ConflictPrevention.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/Reassign_Transfer_ConflictPrevention.pptx>) |
| **People** | author Rahul Rakshit · PE — · dev — |
| **Edited** | 2023-07-21 19:51 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | lock acquisition · lock transfer · reassign tool · network engineering · route locking · conflict prevention |
| **Tools** | Reassign tool |

## Summary

Test plan for the Reassign tool focusing on lock acquisition and transfer scenarios in an engineering network. Covers cases including no existing locks, own locks, other users' locks in same or different versions, and concurrent route locks. Includes miscellaneous tests for lock acquisition behavior and REST endpoint testing.

## Related documents

<!-- related:begin -->
- [Conflict Prevention Reassign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-reassign-route.md>) — similar text 0.35 · 3 title words · 3 filename words · same surface <!-- rel:559 s=5.07 -->
- [Conflict Prevention for Event Editing in Pro – LR Event Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/conflict-prevention-for-event-editing-in-pro-lr-event-tools.md>) — similar text 0.26 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:666 s=4.706 -->
- [Conflict Prevention for Event Editing in Pro – Core Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/conflict-prevention-for-event-editing-in-pro-core-tools-v4.md>) — similar text 0.26 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:670 s=4.703 -->
- [Conflict Prevention for Event Editing in Pro – Core Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/conflict-prevention-for-event-editing-in-pro-core-tools-2022-04.md>) — similar text 0.25 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:671 s=4.685 -->
- [Test Plan for Conflict Prevention for Add Multiple Line Events Tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/for-conflict-prevention-for-add-multiple-line-events-tool.md>) — similar text 0.20 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:668 s=4.563 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html)

_No page matched:_ [Reassign tool](https://www.google.com/search?q=%22Reassign%20tool%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

## Slide 2

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

![Figure 1 — 2](../media/reassign-transfer-conflict-prevention/fig-01-slide-02-2.png)

![Figure 2 — 2](../media/reassign-transfer-conflict-prevention/fig-02-slide-02-2.svg)

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

![Figure 3 — 3](../media/reassign-transfer-conflict-prevention/fig-03-slide-03-3.png)

![Figure 4 — 3](../media/reassign-transfer-conflict-prevention/fig-04-slide-03-3.svg)

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

![Figure 3 — 3](../media/reassign-transfer-conflict-prevention/fig-03-slide-03-3.png)

![Figure 5 — 4](../media/reassign-transfer-conflict-prevention/fig-05-slide-04-4.svg)

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

![Figure 3 — 3](../media/reassign-transfer-conflict-prevention/fig-03-slide-03-3.png)

![Figure 6 — 5](../media/reassign-transfer-conflict-prevention/fig-06-slide-05-5.svg)

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

![Figure 3 — 3](../media/reassign-transfer-conflict-prevention/fig-03-slide-03-3.png)
![Figure 7 — 6](../media/reassign-transfer-conflict-prevention/fig-07-slide-06-6.png)

![Figure 8 — 6](../media/reassign-transfer-conflict-prevention/fig-08-slide-06-6.svg)

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

![Figure 3 — 3](../media/reassign-transfer-conflict-prevention/fig-03-slide-03-3.png)
![Figure 7 — 6](../media/reassign-transfer-conflict-prevention/fig-07-slide-06-6.png)

![Figure 9 — 7](../media/reassign-transfer-conflict-prevention/fig-09-slide-07-7.svg)

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

![Figure 7 — 6](../media/reassign-transfer-conflict-prevention/fig-07-slide-06-6.png)

![Figure 10 — 8](../media/reassign-transfer-conflict-prevention/fig-10-slide-08-8.svg)

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

![Figure 11 — 9](../media/reassign-transfer-conflict-prevention/fig-11-slide-09-9.png)

![Figure 12 — 9](../media/reassign-transfer-conflict-prevention/fig-12-slide-09-9.svg)

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

![Figure 11 — 9](../media/reassign-transfer-conflict-prevention/fig-11-slide-09-9.png)

![Figure 13 — 10](../media/reassign-transfer-conflict-prevention/fig-13-slide-10-10.svg)

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

![Figure 11 — 9](../media/reassign-transfer-conflict-prevention/fig-11-slide-09-9.png)

![Figure 14 — 11](../media/reassign-transfer-conflict-prevention/fig-14-slide-11-11.svg)

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

![Figure 3 — 3](../media/reassign-transfer-conflict-prevention/fig-03-slide-03-3.png)

![Figure 15 — 12](../media/reassign-transfer-conflict-prevention/fig-15-slide-12-12.svg)

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

![Figure 3 — 3](../media/reassign-transfer-conflict-prevention/fig-03-slide-03-3.png)

![Figure 16 — 13](../media/reassign-transfer-conflict-prevention/fig-16-slide-13-13.svg)

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

![Figure 3 — 3](../media/reassign-transfer-conflict-prevention/fig-03-slide-03-3.png)
![Figure 7 — 6](../media/reassign-transfer-conflict-prevention/fig-07-slide-06-6.png)

![Figure 17 — 14](../media/reassign-transfer-conflict-prevention/fig-17-slide-14-14.svg)

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

![Figure 7 — 6](../media/reassign-transfer-conflict-prevention/fig-07-slide-06-6.png)

![Figure 18 — 15](../media/reassign-transfer-conflict-prevention/fig-18-slide-15-15.svg)

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

![Figure 11 — 9](../media/reassign-transfer-conflict-prevention/fig-11-slide-09-9.png)

![Figure 19 — 16](../media/reassign-transfer-conflict-prevention/fig-19-slide-16-16.svg)

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

![Figure 11 — 9](../media/reassign-transfer-conflict-prevention/fig-11-slide-09-9.png)

![Figure 20 — 17](../media/reassign-transfer-conflict-prevention/fig-20-slide-17-17.svg)

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

![Figure 11 — 9](../media/reassign-transfer-conflict-prevention/fig-11-slide-09-9.png)

![Figure 21 — 18](../media/reassign-transfer-conflict-prevention/fig-21-slide-18-18.svg)

## Slide 19

| Test ID | 17 | Network Type | Engineering |
| --- | --- | --- | --- |
| Test | Miscellaneous cases |  |  |

Input

  - Confirm that we will acquire a lock if we type the name of a target Line for which all routes have already been retired and the reassignment date is today.
  - Test acquire locks REST endpoint.
  - Test with PoM data

Event lock will not result in showing a line lock in the locks table. But we will be unable to acquire a lock for the link as another user in that case. Confirm with Lakshmi.
