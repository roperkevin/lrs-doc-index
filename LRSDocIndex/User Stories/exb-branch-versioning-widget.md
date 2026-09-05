# Experience Builder Branch Versioning widget

| Field | Value |
| --- | --- |
| **Doc** | 101 · User Story · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExB - Branch Versioning Management & Editing widget.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Branch%20Versioning%20Management%20%26%20Editing%20widget.pptx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2025-12-05 01:00 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | branch versioning · version management · event editor · editing session · experience builder · arcgis enterprise |
| **Tools** | Branch Versioning |

## Summary

User story for a new Experience Builder widget to support branch versioning and branch versioned edits in ArcGIS Enterprise. The widget enables event editors to create, delete, select versions, and perform editing session operations such as undo, redo, save, discard, reconcile, and post. Configuration options allow enabling or disabling these capabilities.

## Related documents

<!-- related:begin -->
- [Experience Builder Time and Versioning widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/exb-time-and-versioning-widget.md>) — similar text 0.60 · 4 title words · 1 filename word · same kind/surface/folder <!-- rel:167 s=7.825 -->
- [Advanced Versioning Capabilities in LRS Configuration Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/26708-advanced-versioning-capabilities-in-lrs-configuration-widget.md>) — similar text 0.41 · 2 title words · 2 filename words · same surface <!-- rel:157 s=6.194 -->
- [Branch Version Editing widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/29868-branch-version-editing-widget.md>) — similar text 0.38 · 2 title words · 3 filename words · same surface <!-- rel:61 s=5.632 -->
- [Experience Builder Versioning Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/exb-versioning.md>) — similar text 0.37 · 3 title words · 1 filename word · same surface <!-- rel:73 s=5.075 -->
- [LRS Controller Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/26748-lrs-controller-widget.md>) — similar text 0.38 · 1 title word · 1 filename word · same surface <!-- rel:64 s=3.783 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Branch Versioning](https://www.google.com/search?q=%22Branch%20Versioning%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Experience Builder Branch Versioning widget <!-- slide 1 -->
User Story
ArcGIS Enterprise

### User Story <!-- slide 2 -->
As an event editor, I need the ability to manage branch versions and make branch versioned edits, so I can take advantage of complete editing workflows in the web without having to go to Pro or other applications.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). These users need the ability to configure, create, and delete branch versions in Experience Builder applications.  Additionally, these users want to be able to utilize versioned editing to not only edit in a version, but have an editing experience with save, discard, undo, and redo and the ability to reconcile and post data once the edit is complete.

## Acceptance Criteria
### Branch Versioning widget <!-- slide 3 -->
- Create a new Experience Builder widget to support branch versioning (called Branch Versioning that will replace the existing Branch Version Management widget)
- The widget should support the following operations:
  - Create a version
  - Delete a version
  - Select a version
  - Undo
  - Redo
  - Save
  - Discard
  - Reconcile
  - Post
- When enabled, this widget should apply to all layers in the map/app that are Version Management enabled
- Take advantage of the existing components built in the JavaScript 4.x API

### Branch Versioning widget <!-- slide 4 -->
- When creating a version, support the same capabilities as the Pro experience
  - Name
  - Public, Private, Protected
  - Allow user to immediately change to this version
- When selecting a version, change all VMS enabled layers to that version
- When in a version other than default, allow the user to have an editing session with save/discard and undo/redo
- Make the undo/redo stack all the edits in the session
- Save will close out the edit session and clear the undo/redo stack
- Discard will discard the edits, close the edit session, and clear the undo/redo stack
- Provide an option to reconcile only
- To post, a reconcile must be completed
- Utilize a user experience like that within ArcGIS Pro for the editing session operations
- Provide toast like notifications when operations are completed

### Configuration <!-- slide 5 -->
In the configuration for the tool, allow the user to configure the following

- Enable/disable reconcile/post (default is enabled)
- Enable/disable save/discard (default is enabled)
- Enable/disable undo/redo (default is enabled)  If enabled, then Save/Discard must also be enabled.
- Enable/disable whether they can create versions (default is enabled)
- Enable/disable whether they can delete versions (default is enabled)

## Testing
<!-- slide 6 -->
- Test with a mix of APR and RH data
- Test with UN dataset (with and without APR configured)
- Test with non LRS/UN data
- Verify all the versioning components work as expected

## Automation
<!-- slide 7 -->
- Automate this like the other ExB widgets

## Documentation
<!-- slide 8 -->
- Add a topic for this new widget
- Make sure to highlight the branch versioning capabilities supported
- Highlight what can/can’t be configured in the widget

## Assignment
### Story Points <!-- slide 9 -->
Story Points:
Dev:
PE:
