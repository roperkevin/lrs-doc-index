# Experience Builder Branch Versioning widget

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Source** | [ExB - Branch Versioning Management & Editing widget.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Branch%20Versioning%20Management%20%26%20Editing%20widget.pptx>) |
| **Edited** | 2025-12-05 01:00 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Experience Builder Branch Versioning widget"
source_file: "ExB - Branch Versioning Management & Editing widget.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Branch%20Versioning%20Management%20%26%20Editing%20widget.pptx"
doc_id: 101
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: "Nathan Easley"
last_edited: "2025-12-05T01:00:21Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["branch versioning", "version management", "event editor", "editing session", "experience builder", "arcgis enterprise"]
tools: ["Branch Versioning"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":167,"file":"experience-builder-time-and-versioning-widget__doc167.md","s":7.825},{"doc":157,"file":"advanced-versioning-capabilities-in-lrs-configuration-widget__doc157.md","s":6.194},{"doc":61,"file":"branch-version-editing-widget__doc61.md","s":5.632},{"doc":73,"file":"experience-builder-versioning-test-plan__doc73.md","s":5.075},{"doc":64,"file":"lrs-controller-widget__doc64.md","s":3.783}]
```
-->

## Summary

User story for a new Experience Builder widget to support branch versioning and branch versioned edits in ArcGIS Enterprise. The widget enables event editors to create, delete, select versions, and perform editing session operations such as undo, redo, save, discard, reconcile, and post. Configuration options allow enabling or disabling these capabilities.

## Related documents

<!-- related:begin -->
- [Experience Builder Time and Versioning widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/experience-builder-time-and-versioning-widget__doc167.md>) — similar text 0.60 · 4 title words · 1 filename word · same kind/surface/folder <!-- rel:167 -->
- [Advanced Versioning Capabilities in LRS Configuration Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/advanced-versioning-capabilities-in-lrs-configuration-widget__doc157.md>) — similar text 0.41 · 2 title words · 2 filename words · same surface <!-- rel:157 -->
- [Branch Version Editing widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/branch-version-editing-widget__doc61.md>) — similar text 0.38 · 2 title words · 3 filename words · same surface <!-- rel:61 -->
- [Experience Builder Versioning Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/experience-builder-versioning-test-plan__doc73.md>) — similar text 0.37 · 3 title words · 1 filename word · same surface <!-- rel:73 -->
- [LRS Controller Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-controller-widget__doc64.md>) — similar text 0.38 · 1 title word · 1 filename word · same surface <!-- rel:64 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Branch Versioning](https://www.google.com/search?q=%22Branch%20Versioning%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Experience Builder Branch Versioning widget

User Story
ArcGIS Enterprise

## Slide 2 — User Story

As an event editor, I need the ability to manage branch versions and make branch versioned edits, so I can take advantage of complete editing workflows in the web without having to go to Pro or other applications.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). These users need the ability to configure, create, and delete branch versions in Experience Builder applications.  Additionally, these users want to be able to utilize versioned editing to not only edit in a version, but have an editing experience with save, discard, undo, and redo and the ability to reconcile and post data once the edit is complete.

## Slide 3 — Branch Versioning widget

Create a new Experience Builder widget to support branch versioning (called Branch Versioning that will replace the existing Branch Version Management widget)
The widget should support the following operations:

  - Create a version
  - Delete a version
  - Select a version
  - Undo
  - Redo
  - Save
  - Discard
  - Reconcile
  - Post
When enabled, this widget should apply to all layers in the map/app that are Version Management enabled
Take advantage of the existing components built in the JavaScript 4.x API

## Slide 4 — Branch Versioning widget

When creating a version, support the same capabilities as the Pro experience

  - Name
  - Public, Private, Protected
  - Allow user to immediately change to this version
When selecting a version, change all VMS enabled layers to that version
When in a version other than default, allow the user to have an editing session with save/discard and undo/redo
Make the undo/redo stack all the edits in the session
Save will close out the edit session and clear the undo/redo stack
Discard will discard the edits, close the edit session, and clear the undo/redo stack
Provide an option to reconcile only
To post, a reconcile must be completed
Utilize a user experience like that within ArcGIS Pro for the editing session operations
Provide toast like notifications when operations are completed

## Slide 5 — Configuration

In the configuration for the tool, allow the user to configure the following
Enable/disable reconcile/post (default is enabled)
Enable/disable save/discard (default is enabled)
Enable/disable undo/redo (default is enabled)  If enabled, then Save/Discard must also be enabled.
Enable/disable whether they can create versions (default is enabled)
Enable/disable whether they can delete versions (default is enabled)

## Slide 6 — Testing

Test with a mix of APR and RH data
Test with UN dataset (with and without APR configured)
Test with non LRS/UN data
Verify all the versioning components work as expected

## Slide 7 — Automation

Automate this like the other ExB widgets

## Slide 8 — Documentation

Add a topic for this new widget
Make sure to highlight the branch versioning capabilities supported
Highlight what can/can’t be configured in the widget

## Slide 9 — Story Points

Story Points:
Dev:
PE:
