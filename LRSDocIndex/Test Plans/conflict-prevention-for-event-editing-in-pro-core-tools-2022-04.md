# Conflict Prevention for Event Editing in Pro – Core Tools

| Field | Value |
| --- | --- |
| **Doc** | 671 · Test Plan · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [TestPlan_Conflict Prevention for Event Editing in Pro_Core_V3 (1).docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/TestPlan_Conflict%20Prevention%20for%20Event%20Editing%20in%20Pro_Core_V3%20(1).docx>) |
| **People** | author Rahul Rakshit · PE — · dev — |
| **Edited** | 2022-04-06 20:52 by Johum Khushk |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | conflict prevention · event editing · core tools · lock acquisition · event lock · route lock · spanning event · non spanning event · reconcile · rest endpoint |
| **Tools** | Core Editing Tools · Pro Attribute Table · Append GP tool |

## Summary

This document details test cases and workflows for conflict prevention during event editing in ArcGIS Pro core tools. It covers scenarios for creating and editing point and line events on line and non-line networks, including lock acquisition, lock conflicts, and reconcile prompts. The document also includes REST endpoint testing for event lock validation and error handling.

## Related documents

<!-- related:begin -->
- [Conflict Prevention for Event Editing in Pro – Core Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/conflict-prevention-for-event-editing-in-pro-core-tools-v4.md>) — similar text 0.96 · 6 title words · 6 filename words · same kind/surface/folder <!-- rel:670 s=12.02 -->
- [Conflict Prevention for Event Editing in Pro – LR Event Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/conflict-prevention-for-event-editing-in-pro-lr-event-tools.md>) — similar text 0.83 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:666 s=9.772 -->
- [Conflict Prevention for Event Editing in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-for-event-editing-in-pro.md>) — similar text 0.23 · 5 title words · 5 filename words · same surface <!-- rel:683 s=6.973 -->
- [Conflict Prevention for Event Editing in Pro – Add Multiple Point Events Tool Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/conflict-prevention-for-event-editing-in-pro-add-multiple.md>) — similar text 0.37 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:667 s=6.594 -->
- [Test Plan for Conflict Prevention for Add Multiple Line Events Tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/for-conflict-prevention-for-add-multiple-line-events-tool.md>) — similar text 0.32 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:668 s=5.571 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [Core Editing Tools](https://www.google.com/search?q=%22Core%20Editing%20Tools%22+site%3Adoc.esri.com) · [Pro Attribute Table](https://www.google.com/search?q=%22Pro%20Attribute%20Table%22+site%3Adoc.esri.com) · [Append GP tool](https://www.google.com/search?q=%22Append%20GP%20tool%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Conflict Prevention for Event Editing in Pro – Core Tools

### Notes:

- Conflict prevention for event editing is applicable to following tools:
  - Creating new event via core editing tools
  - Creating new event via Pro Attribute table
  - Editing event via core editing tools
  - Editing event via Pro Attribute table
- Test on branched version service data with conflict prevention enabled
- Events spanning, Events not spanning, Point & Stationing Events registered to Line Network + Nonline Network
- Point and line attribute sets have at least three events
- N1: Line Network, N2: Non-Line Network
- User A has: VersionA1 & VersionA2   |   User B has: VersionB1
- In case of non-line network, only event belonging to a route will be locked. While, locking an event should lock the event layer for all the routes in a line (Line ID and line name in the locks table will be inserted when spanning event gets locked)
- For updating an event, both source and target route/line id will be locked. If either of them couldn't be acquired, edit will fail.

[figure: User selects one LR event tools & tries to add an event on a route · Yes · User reconciles · Feature will be created · on map · Default version: Locks are released automatically · User version: Locks persist in locks table · Lock transfer by another use / lock got deleted / lock acquired by another user · F · ill in the attributes · in table / pane · Validate again if route / event lock is still present · Revert the edit on map · / table · M · essage · displayed: · lock not acquired · Route or Event lock is present (another user / version) · No event lock needed · Route lock is present (same user / version) · Acquire event lock for single event layer for that route, · no confirmation / indication for acquiring lock · No Route / event lock present · Reconcile needed · User selects core tool & clicks on a route · to create a point / line event OR edit an existing event on map · Check for reconcile · if option isn’t selected · Auto reconcile · if option is selected · Prompt user to reconcile · Check if there is route or event lock present · Reconcile not needed · No · User creates a record in event table or tries to edit an existing record]

[figure: Conflict Prevention Workflow for Event · Creation / · Editing]

| [figure: A- Create · event · using core tools · - Core Create point, Create line · - Verify in both default and user version (100% testing in user version, 10% in default) · - All cases will be tested with · both · tools]<br>Event Type | Test Case | L1 |  |  | RX |  |  | E1 |  |  | E2 |  | E3 |  | Reconcile needed |  | Result |  | Message/s |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Point event,<br>Spanning,<br>non- spanning event | 1.No locks exist |  |  |  |  |  |  |  |  |  |  |  |  |  | No | Event l ock can be acquired |  | No Message for acquiring locks. |  |  |
|  | 2 . No locks exist |  |  |  |  |  |  |  |  |  |  |  |  |  | Yes | Reconcile prompt or auto reconcile and lock acquired |  | Auto reconcile not selected: Reconcile this version with Default to acquire locks. |  |  |
| Point event,<br>Spanning,<br>non- spanning event | 3 . Line / Route already locked by the same user in the same version | Locked | UserA in<br>VersionA1 |  |  |  |  |  |  |  |  |  |  |  | No | No additional lock needed |  | No Messages |  |  |
| Point event,<br>non- spanning event ,<br>For spanning events that user is going to add:<br>- From route locked<br>- T o route locked<br>- Both from / to routes are locked | 4 . Line / route already locked by another user in another version | Locked | UserB in<br>VersionB1 |  |  |  |  |  |  |  |  |  |  |  | No | Cannot acquire locks |  | Error message in middle of screen: Unable to add event. The Line /route L1 is already locked by UserB in VersionB1 > click ok ><br>Edit Failed message on core tool pane in upper right corner |  |  |
| Point event,<br>Spanning,<br>non- spanning event | 4 . 1 Line / route already locked by another user B in another version . Version not being used. User A transfers the lock and try to make an edit | Locked | UserB in<br>VersionB1 |  |  |  |  |  |  |  |  |  |  |  | No | Locks can be acquired |  | No Message for acquiring locks. |  |  |
| Point event,<br>Spanning,<br>non- spanning event | 5 . Concurrent route on another network is locked by the same user in the same version – verify this case with another user |  |  | Locked |  | UserA in<br>VersionA1 |  |  |  |  |  |  |  |  | No | Lock can be acquired |  | No Message for acquiring locks |  |  |
| Point event,<br>non- spanning event ,<br>For spanning events that user is going to add:<br>- From route locked<br>- To route locked<br>- Both from / to routes are locked | 6 . Same user has a line / route lock in another version | Locked | UserA in<br>VersionA2 |  |  |  |  |  |  |  |  |  |  |  | No | Cannot acquire locks |  | Error message in middle of screen: Unable to add event. The Line/route L1 is already locked by UserA in VersionA2 > click ok ><br>Edit Failed message on core tool pane in upper right corner |  |  |
| Point event,<br>Spanning,<br>non- spanning event | 7 . Another user has a lock (for that line / route ) on another event layer on the same route in another version | Locked | UserB in<br>VersionB1 |  |  |  |  |  |  | Locked |  | UserB in<br>VersionB1 |  |  | No | Lock /s can be acquired |  | No Message for acquiring locks |  |  |
|  | 7.1 Another user B has a lock (for that line / route ) on another event layer on the same route in another version . Version not being used. User A transfers the lock and try to make an edit | Locked | UserB in<br>VersionB1 |  |  |  |  |  |  | Locked |  | UserB in<br>VersionB1 |  |  | No | Lock /s can be acquired |  | No Message for acquiring locks |  |  |
|  | 8. Same user has a lock (for that line / route ) on another event layer on the same route in another version | Locked | UserA in<br>VersionA2 |  |  |  |  |  |  | Locked |  | UserA in<br>VersionA2 |  |  | No | Lock /s can be acquired |  | No Message for acquiring locks |  |  |
| Point event,<br>non- spanning event ,<br>For spanning events that user is going to add:<br>- From route locked<br>- To route locked<br>- Both from / to routes are locked | 9. Event layer already locked (for that line /route ) by the same user in another version | Locked | UserA in Version A2 |  |  |  | Locked |  | UserA in Version A2 |  |  |  |  |  | No | Cannot acquire locks |  | Error message in middle of screen:<br>Cannot acquire locks because UserA has the lock in version UserA.VersionA1 > click ok ><br>Edit Failed message on core tool pane in upper right corner |  |  |
|  | 10. Event layer already locked (for that line / route ) by another user in another version | Locked | UserB in Version B1 |  |  |  | Locked |  | UserB in Version B1 |  |  |  |  |  | No | Cannot acquire locks |  | Error message in middle of screen:<br>Cannot acquire locks because UserB has the lock in version UserB.VersionB1<br>Edit Failed message on core tool pane in upper right corner |  |  |
|  | 1 1. User has lock on all the event layers for that line /route in another version | Locked | UserA in<br>VersionA2 |  |  |  | Locked |  | UserA in<br>VersionA2 | Locked |  | UserA in<br>VersionA2 |  |  | Yes | Reconcile but cannot acquire locks |  | Auto reconcile not selected: Reconcile this version with Default to acquire locks.<br>Error message in middle of screen:<br>Cannot acquire locks because UserA has the lock in version UserA.VersionA2 > click ok ><br>Edit Failed message on core tool pane in upper right corner |  |  |
| Point event,<br>non- spanning event ,<br>For spanning events that user is going to add:<br>- From route locked<br>- To route locked<br>- Both from / to routes are locked | 1 2 . User has lock on some events, another user has lock on other events | Locked | UserB in<br>VersionB1 |  |  |  | Locked |  | UserB in<br>VersionB1 | Locked |  | UserA in<br>VersionA1 |  |  | No | Cannot acquire locks |  | Error message in middle of screen:<br>Cannot acquire locks because UserA has the lock in version UserA.VersionA1<br>+Text file enlisting all events that are locked by other user/s with the version/s info.<br>Edit Failed message on core tool pane in upper right corner |  |  |
|  | 1 3 . User has lock on some events, another user has lock on other events . Try to edit all the events. | Locked | UserA in<br>VersionA2 |  |  |  | Locked |  | UserA in<br>VersionA2 | Locked |  | UserB in<br>VersionB1 |  |  | No | Cannot acquire locks |  | Error message in middle of screen:<br>Cannot acquire locks because UserA has the lock in version UserA.VersionA1<br>+Text file enlisting all events that are locked by other user/s with the version/s info.<br>Edit Failed message on core tool pane in upper right corner |  |  |
|  | 14 . Same user has a route / line lock and a lock (for that line /route ) on another event layer in the same version | Locked | UserA in<br>VersionA1 |  |  |  |  |  |  | Locked |  | UserA in<br>VersionA1 |  |  | No | Lock can be acquired |  | No message for acquiring locks |  |  |
| Point event,<br>Spanning,<br>non- spanning event | 1 5 . Concurrent route on another network and another event of that route are locked by the same user in the same version |  |  | Locked |  | UserA in<br>VersionA1 |  |  |  |  |  |  | Locked | UserA in<br>VersionA1 | No | Lock can be acquired |  | No message for acquiring locks |  |  |
|  | 1 6 . Line /route and another event layer on that line / route are locked by the same user in the same version | Locked | UserA in<br>VersionA1 |  |  |  | Locked |  | UserA in<br>VersionA1 |  |  |  |  |  | No | Lock can be acquired |  | No message for acquiring locks |  |  |

| [figure: B · - · Edit · event · using core tools · - Move & Edit vertices tools · - Verify in both default and user version (100% testing in user version, 10% in default) · - All cases will be tested with both tools]<br>Event Type | Test Case | L1 |  |  | RX |  |  | E1 |  |  | E2 |  | E3 |  | Reconcile needed |  | Result |  | Message/s |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Point event,<br>Spanning,<br>non- spanning event | 1.No locks exist |  |  |  |  |  |  |  |  |  |  |  |  |  | No | Event l ock can be acquired |  | No Message for acquiring locks. |  |  |
|  | 2 . No locks exist |  |  |  |  |  |  |  |  |  |  |  |  |  | Yes | Reconcile prompt or auto reconcile and lock acquired |  | Auto reconcile not selected: Reconcile this version with Default to acquire locks. |  |  |
| Point event,<br>Spanning,<br>non- spanning event | 3 . Line / Route already locked by the same user in the same version | Locked | UserA in<br>VersionA1 |  |  |  |  |  |  |  |  |  |  |  | No | No additional lock needed |  | No Messages |  |  |
| For point, spanning and non-spanning events that user is going to edit:<br>- Source line / route locked<br>- Target line / route locked<br>- Both source and target line / route are locked | 4 . Line / route already locked by another user in another version | Locked | UserB in<br>VersionB1 |  |  |  |  |  |  |  |  |  |  |  | No | Cannot acquire locks |  | Error message in middle of screen: Unable to add event. The Line /route L1 is already locked by UserB in VersionB1 > click ok ><br>Edit Failed message on core tool pane in upper right corner |  |  |
| Point event,<br>Spanning,<br>non- spanning event | 4 . 1 Line / route already locked by another user B in another version . Version not being used. User A transfers the lock and try to make an edit | Locked | UserB in<br>VersionB1 |  |  |  |  |  |  |  |  |  |  |  | No | Locks can be acquired |  | No Message for acquiring locks. |  |  |
| Point event,<br>Spanning,<br>non- spanning event | 5 . Concurrent route on another network is locked by the same user in the same version – verify this case with another user |  |  | Locked |  | UserA in<br>VersionA1 |  |  |  |  |  |  |  |  | No | Lock can be acquired |  | No Message for acquiring locks |  |  |
| For point, spanning and non-spanning events that user is going to edit:<br>- From line / route locked<br>- To line / route locked<br>- Both from / to line / route are locked | 6 . Same user has a line / route lock in another version | Locked | UserA in<br>VersionA2 |  |  |  |  |  |  |  |  |  |  |  | No | Cannot acquire locks |  | Error message in middle of screen: Unable to add event. The Line/route L1 is already locked by UserA in VersionA2 > click ok ><br>Edit Failed message on core tool pane in upper right corner |  |  |
| Point event,<br>Spanning,<br>non- spanning event | 7 . Another user has a lock (for that line / route ) on another event layer on the same route in another version | Locked | UserB in<br>VersionB1 |  |  |  |  |  |  | Locked |  | UserB in<br>VersionB1 |  |  | No | Lock /s can be acquired |  | No Message for acquiring locks |  |  |
|  | 7.1 Another user B has a lock (for that line / route ) on another event layer on the same route in another version . Version not being used. User A transfers the lock and try to make an edit | Locked | UserB in<br>VersionB1 |  |  |  |  |  |  | Locked |  | UserB in<br>VersionB1 |  |  | No | Lock /s can be acquired |  | No Message for acquiring locks |  |  |
|  | 8. Same user has a lock (for that line / route ) on another event layer on the same route in another version | Locked | UserA in<br>VersionA2 |  |  |  |  |  |  | Locked |  | UserA in<br>VersionA2 |  |  | No | Lock /s can be acquired |  | No Message for acquiring locks |  |  |
| For point, spanning and non-spanning events that user is going to edit:<br>- Source line / route locked<br>- Target line / route locked<br>- Both source and target line / route are locked | 9. Event layer already locked (for that line /route ) by the same user in another version | Locked | UserA in Version A2 |  |  |  | Locked |  | UserA in Version A2 |  |  |  |  |  | No | Cannot acquire locks |  | Error message in middle of screen:<br>Cannot acquire locks because UserA has the lock in version UserA.VersionA1 > click ok ><br>Edit Failed message on core tool pane in upper right corner |  |  |
|  | 10. Event layer already locked (for that line / route ) by another user in another version | Locked | UserB in Version B1 |  |  |  | Locked |  | UserB in Version B1 |  |  |  |  |  | No | Cannot acquire locks |  | Error message in middle of screen:<br>Cannot acquire locks because UserB has the lock in version UserB.VersionB1<br>Edit Failed message on core tool pane in upper right corner |  |  |
|  | 1 1. User has lock on all the event layers for that line /route in another version | Locked | UserA in<br>VersionA2 |  |  |  | Locked |  | UserA in<br>VersionA2 | Locked |  | UserA in<br>VersionA2 |  |  | Yes | Reconcile but cannot acquire locks |  | Auto reconcile not selected: Reconcile this version with Default to acquire locks.<br>Error message in middle of screen:<br>Cannot acquire locks because UserA has the lock in version UserA.VersionA2 > click ok ><br>Edit Failed message on core tool pane in upper right corner |  |  |
| For point, spanning and non-spanning events that user is going to edit:<br>- Source line / route locked<br>- Target line / route locked<br>- Both source and target line / route are locked | 1 2 . User has lock on some events, another user has lock on other events | Locked | UserB in<br>VersionB1 |  |  |  | Locked |  | UserB in<br>VersionB1 | Locked |  | UserA in<br>VersionA1 |  |  | No | Cannot acquire locks |  | Error message in middle of screen:<br>Cannot acquire locks because UserA has the lock in version UserA.VersionA1<br>+Text file enlisting all events that are locked by other user/s with the version/s info.<br>Edit Failed message on core tool pane in upper right corner |  |  |
|  | 1 3 . User has lock on some events, another user has lock on other events . Try to edit all the events. | Locked | UserA in<br>VersionA2 |  |  |  | Locked |  | UserA in<br>VersionA2 | Locked |  | UserB in<br>VersionB1 |  |  | No | Cannot acquire locks |  | Error message in middle of screen:<br>Cannot acquire locks because UserA has the lock in version UserA.VersionA1<br>+Text file enlisting all events that are locked by other user/s with the version/s info.<br>Edit Failed message on core tool pane in upper right corner |  |  |
|  | 14 . Same user has a route / line lock and a lock (for that line /route ) on another event layer in the same version | Locked | UserA in<br>VersionA1 |  |  |  |  |  |  | Locked |  | UserA in<br>VersionA1 |  |  | No | Lock can be acquired |  | No message for acquiring locks |  |  |
| Point event,<br>Spanning,<br>non- spanning event | 1 5 . Concurrent route on another network and another event of that route are locked by the same user in the same version |  |  | Locked |  | UserA in<br>VersionA1 |  |  |  |  |  |  | Locked | UserA in<br>VersionA1 | No | Lock can be acquired |  | No message for acquiring locks |  |  |
|  | 1 6 . Line /route and another event layer on that line / route are locked by the same user in the same version | Locked | UserA in<br>VersionA1 |  |  |  | Locked |  | UserA in<br>VersionA1 |  |  |  |  |  | No | Lock can be acquired |  | No message for acquiring locks |  |  |

### Common cases for core tools (A&B)

1. Lock acquired; lock removed (using locks table in db) before clicking “Apply” – should re acquire a lock

1. Acquire lock on a previous time slice – should succeed

1. No lock and no auto reconcile, click cancel when prompted to acquire locks - No locks will be acquired

1. Verify lock can be acquired with protected/private versions

1. Verify release locks only when using default version - should release automatically

1. Where locks are acquired make sure lock is displayed in locks table and identify tool.

## Test Cases

### TC-U01 — Point event,; Spanning,; non- spanning event (1.No locks exist) <!-- src: S3 · table · 1.No locks exist -->

- **ID:** 1.No locks exist
- **Reconcile needed:** No

### TC-U02 — For point, spanning and non-spanning events that user is going to edit (3 . Line / Route already locked by the same user in the same version) <!-- src: S3 · table · 3 . Line / Route already locked by the same user in the same version -->

- **ID:** 3 . Line / Route already locked by the same user in the same version
- **Case:** For point, spanning and non-spanning events that user is going to edit: ; - Source route / line locked; - Target route / line locked; - Both source and target route s / lines are locked
- **L1:** Locked
- **Reconcile needed:** No

### TC-U03 — Point event,; Spanning,; non- spanning event (4 . 1 Line / route already locked by another user B in another version . Version not being used. User A transfers the lock and try to make an edit) <!-- src: S3 · table · 4 . 1 Line / route already locked by another user B in another version . Version not being used. User A transfers the lock and try to make an edit -->

- **ID:** 4 . 1 Line / route already locked by another user B in another version . Version not being used. User A transfers the lock and try to make an edit
- **L1:** Locked
- **Reconcile needed:** No

### TC-U04 — Point event,; Spanning,; non- spanning event (5 . Concurrent route on another network is locked by the same user in the same version – verify this case with another user) <!-- src: S3 · table · 5 . Concurrent route on another network is locked by the same user in the same version – verify this case with another user -->

- **ID:** 5 . Concurrent route on another network is locked by the same user in the same version – verify this case with another user
- **Reconcile needed:** No

### TC-U05 — For point, spanning and non-spanning events that user is going to edit (6 . Same user has a line / route lock in another version) <!-- src: S3 · table · 6 . Same user has a line / route lock in another version -->

- **ID:** 6 . Same user has a line / route lock in another version
- **Case:** For point, spanning and non-spanning events that user is going to edit: ; - Source route / line locked; - Target route / line locked; - Both source and target routes / lines are locked
- **L1:** Locked
- **Reconcile needed:** No

### TC-U06 — Point event,; Spanning,; non- spanning event (7 . Another user has a lock (for that line / route ) on another event layer on the same route in another version) <!-- src: S3 · table · 7 . Another user has a lock (for that line / route ) on another event layer on the same route in another version -->

- **ID:** 7 . Another user has a lock (for that line / route ) on another event layer on the same route in another version
- **L1:** Locked
- **Reconcile needed:** No

### TC-U07 — For point, spanning and non-spanning events that user is going to edit (9. Event layer already locked (for that line /route ) by the same user in another version) <!-- src: S3 · table · 9. Event layer already locked (for that line /route ) by the same user in another version -->

- **ID:** 9. Event layer already locked (for that line /route ) by the same user in another version
- **Case:** For point, spanning and non-spanning events that user is going to edit: ; - Source route / line locked; - Target route / line locked; - Both source and target routes / lines are locked
- **L1:** Locked
- **Reconcile needed:** No

### TC-U08 — For point, spanning and non-spanning events that user is going to edit (1 2 . User has lock on some events, another user has lock on other events) <!-- src: S3 · table · 1 2 . User has lock on some events, another user has lock on other events -->

- **ID:** 1 2 . User has lock on some events, another user has lock on other events
- **Case:** For point, spanning and non-spanning events that user is going to edit: ; - Source route / line locked; - Target route / line locked; - Both source and target routes / lines are locked
- **L1:** Locked
- **Reconcile needed:** No

### TC-U09 — Point event,; Spanning,; non- spanning event (1 5 . Concurrent route on another network and another event of that route are locked by the same user in the same version) <!-- src: S3 · table · 1 5 . Concurrent route on another network and another event of that route are locked by the same user in the same version -->

- **ID:** 1 5 . Concurrent route on another network and another event of that route are locked by the same user in the same version
- **E3:** Locked
- **Reconcile needed:** No

## Other content

### C- Create or Edit events via Attribute Table

[figure: User creates a record in event table · Once the user changes · any existing event fields · and hits enter. · (user defined or schema fields) · Once the user has fill out all the minimum schema event fields and hits enter · Try to acquire lock · Error displayed, edit not saved and field reverted to original attribute · Lock/s acquire · d – no msg will be displayed · User tries to edit an existing record in event table]

[figure: - Verify in both default and user version (100% testing in user version, 10% in default) · - All cases will be tested with · Create · and · Edit events via Attribute Table]

Event features from other feature classes are copied: Should create new events after locks are acquired.

1. Features from other FC’s are copied into the event FC using the Append GP tool: Should create new events after locks are acquired.

1. Features from other FC’s are copied into the event FC using the copy, calculate field, delete rows: Should create new events after locks are acquired.

1. Lock acquired; lock removed (using locks table in db) before clicking Save

1. Acquire lock on a previous time slice – should succeed

1. No lock, click cancel when prompted to acquire locks

1. Verify lock can be acquired with protected/private versions

1. Verify release locks only when using default version

1. Where locks are acquired make sure lock is displayed in locks table and identify.

### D- REST end point testing – will only return error if missing or unavailable locks

| Test Cases |  |
| --- | --- |
| T ry to add event on a cont route that already has an event lock for another event layer | Event lock will be added |
| T ry to add event on a line that already has an event lock for another event layer | Event lock will be added |
| T ry to add event when locks are not available ( missing) for any of the event layer/s | Error |
| Try to add multiple event s - for at least one event layer lock cannot be acquired | None will be acq uired |
| Try to add an evnet when an event lock is held by a different user | Error |
| Try to add an event when an event lock is held by a different version (same user) | Error |
| Try to add an event without being logged in | Error |
| Try to add an event as a data reader (Portal User) | Error |
| T ry to add event when locks are already present | Edit should go through |
|  |  |

![Figure 1 — D- REST end point testing – will only return error if missing or unavailable locks](../media/conflict-prevention-for-event-editing-in-pro-core-tools-2022-04/fig-01-d-rest-end-point-testing-will-only.png)
