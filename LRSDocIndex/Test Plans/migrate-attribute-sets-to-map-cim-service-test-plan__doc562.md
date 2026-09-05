# Migrate Attribute Sets to Map CIM/Service – Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#5102](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5102) |
| **Source** | [AttributeSetsCIM_testplan2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/AttributeSetsCIM_testplan2.pptx>) |
| **Edited** | 2023-05-22 22:40 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Migrate Attribute Sets to Map CIM/Service – Test Plan"
source_file: "AttributeSetsCIM_testplan2.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/AttributeSetsCIM_testplan2.pptx"
doc_id: 562
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: "Claire Wang"
dev: "Eric"
author: "Lakshmi Ananthanarayanan"
last_edited_by: "Claire Wang"
last_edited: "2023-05-22T22:40:12Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["attribute set", "map cim", "rhas", "direct connect", "file share", "enterprise edition", "line event", "point event", "rest endpoint", "import", "export", "dynamic segmentation", "event editor", "service", "testing"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#5102"]
related: [{"doc":680,"file":"import-existing-attribute-sets-from-event-editor__doc680.md","s":3.875},{"doc":482,"file":"64-bit-oid-other-pro-lr-tools-test-plan__doc482.md","s":3.548},{"doc":264,"file":"relocate-events-support-for-external-event-with-no-connection-file-test-plan__doc264.md","s":3.383},{"doc":689,"file":"managing-attribute-sets-user-story__doc689.md","s":3.017},{"doc":555,"file":"configure-attribute-sets__doc555.md","s":2.927}]
```
-->

## Summary

Test plan for migrating attribute sets to Map CIM and service environments including Direct Connect (DC), File Share (FS), and Enterprise Edition (EE). Covers testing of create, import, save, delete operations on attribute sets, verification of REST usage, UI behavior, and handling of line and point events with RH and APR data. Includes positive and negative test cases and documentation updates.

## Related documents

<!-- related:begin -->
- [Import Existing Attribute Sets from Event Editor](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/import-existing-attribute-sets-from-event-editor__doc680.md>) — similar text 0.28 · 2 title words · 2 filename words · same surface <!-- rel:680 -->
- [64 bit OID Other Pro LR Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/64-bit-oid-other-pro-lr-tools-test-plan__doc482.md>) — similar text 0.18 · 1 filename word · same kind/surface/pe/folder <!-- rel:482 -->
- [Relocate Events Support for External Event with No Connection File - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/relocate-events-support-for-external-event-with-no-connection-file-test-plan__doc264.md>) — similar text 0.06 · 1 filename word · same kind/dev/folder <!-- rel:264 -->
- [Managing Attribute Sets User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/managing-attribute-sets-user-story__doc689.md>) — similar text 0.16 · 2 title words · 2 filename words · same surface <!-- rel:689 -->
- [Configure Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configure-attribute-sets__doc555.md>) — similar text 0.38 · 2 title words · same surface <!-- rel:555 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/edit-feature-services.html)

_No page matched:_ [map](https://www.google.com/search?q=%22map%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Migrate Attribute Sets to Map CIM/Service – Test Plan

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5102

PE: Claire Wang
Dev: Eric

## Slide 2

Data:

- Test in DC, FS, and EE
  - DC: open/create/edit/import/save/delete attribute sets to Map CIM
  - FS: create/import/save/delete .rhas attribute; attribute sets read from server can be opened to use but cannot be edited/deleted
  - EE: create/import/save/delete .rhas attribute; attribute sets read from server can be opened to use but cannot be edited/deleted
- Test with line and point events
- Test with a mix of RH and APR data
- Sample test a few cases for additional workflows like add events and dynseg
Documentation

- Update Pro documentation (and screenshots) to reflect:
  - The new import option
  - The enhancement of storing attribute sets in Map CIM if working in direct connect before publishing. This is what users have to for attribute sets to publish along with map
  - The new paradigm for how attribute sets follow the map/service (providing example workflows like outlined in the first acceptance criteria slide would be good)
- Update Event Editor documentation to reflect:
  - The new paradigm for how attribute sets follow the map/service (providing example workflows like outlined in the first acceptance criteria slide would be good)
  - How to get existing RHAS files into this new attribute set storage paradigm
Automation
N/A

## Slide 3

Verification

- Verify REST is being utilized when in a service and not in DC
- Verify attribute sets are stored in Map CIM
- Verify the ability to see attribute sets in both the application and in REST when configured with the CIM/service, and they match
- Verify a REST endpoint is created to read attribute sets to the service
- Verify attribute sets and their settings in service are exposed via LRServer
- Verify an import button is created in Pro attribute set UI to support importing RHAS files (mimic the button in EE) and this button imports existing attribute sets
- Verify users accessing FS cannot edit or delete attribute sets that are read from service
- Verify all except all line/point events attribute sets can be deleted from CIM in DC
- Make sure service honors the default attribute set that is set in dc. This isthe first attribute set users see in UI.
- Verify only RHAS attribute sets can be deleted in service

## Slide 4

Verification
UI:
In dc, all attribute sets (except all point/line events) have a X button and can be deleted.
In fs, all .rhas attribute sets will have a X button and can be deleted. Attribute sets from server do not have X at all and cannot be deleted

![image1.png](../media/doc377_image1.png)

## Slide 5 — Positive cases - DC

- Open default (all line/point events) attribute set
- Create an attribute set with multiple line events and all the events’ attributes with default values and save to Map CIM
- Create an attribute set with multiple line events and some of the events’ attributes with customized values and save to Map CIM
- Create an attribute set with multiple point events and all the events’ attributes with default values and save to Map CIM
- Create an attribute set with multiple point events and some of the events’ attributes with customized values and save to Map CIM
- Open an attribute set from Map CIM that is created just now
- Edit a non-default line event attribute set from Map CIM, save to Map CIM, and set as default
- Edit a non-default point event attribute set from Map CIM, save to Map CIM, and set as default
- Import a .rhas attribute set that contains the events in map using import button and save as an attribute set to Map CIM
- Import a .rhas that does not contain the events in map using import button and save as an attribute set to Map CIM
- Search for an attribute set when there are multiple in Map CIM and .rhas
- Remove an attribute set from Map CIM before publishing data
- Remove an attribute set from Map CIM after publishing data (service and attribute sets in service are not impacted at all)
- Publish data and verify all attribute sets in MAP CIM are published to service, too
- Change project name and/or map name, and see if attribute sets still exist in Map CIM (they should)
- Have multiple different maps with different attribute sets saved to CIM. After publishing one of the maps, only attribute sets saved to this Map CIM should publish.
- Have multiple different maps in a project before publishing, and make all maps have different attribute sets with the same name. Publishing all maps to different services should carry over all these different attribute sets with the same name (confirm with Eric)
Cases that will not work - DC

- Remove all line events attribute set (if a user-created attribute set is set to default, it can be removed, and default will bounce back to be all line/point events. So it’s not “default” attribute set cannot be removed, it’s all line/point events cannot be removed)

## Slide 6 — Positive cases - FS

- Open default (all line/point events) attribute set that is read from service
- Open non-default attribute set that is read from service
- Create an attribute set with multiple line events and all the events’ attributes with default values and save the .rhas
- Create an attribute set with multiple line events and some of the events’ attributes with customized values and save the .rhas
- Create an attribute set with multiple point events and all the events’ attributes with default values and save the .rhas
- Create an attribute set with multiple point events and some of the events’ attributes with customized values and save the .rhas
- Edit a .rhas line event attribute set, save as a new .rhas, and set as default. This will be the first attribute set shown in UI the next time Pro opens.
- Edit a .rhas point event attribute set, save, and set as default. This will be the first attribute set shown in UI the next time Pro opens.
- Import a .rhas that does not contain the events in map using import button – a yellow warning button is shown
- Import a .rhas that contains the events that are not in map using import button – a yellow warning button is shown
- Save an attribute set from server as a .rhas file
- Search for an attribute set when there are multiple in Map CIM and .rhas
- Remove a .rhas attribute set
- Add multiple line events using an attribute set read from service
- Add multiple line events using a .rhas
- Add multiple point events using an attribute set read from service
Cases that will not work/work properly- FS

- Remove/edit (add/remove/edit layers/change values in attribute sets) attribute sets from service and verify the behavior that prevents the operations
- Import a .rhas attribute set that has the same name as an attribute set from service, and verify a message pops up about the duplicate name, but nothing else is created and that service attribute set is not affected Remove an attribute set that is read from service
- Use a .rhas that does not contain the events in service to add events
- Use a .rhas that contains events that are not in map to add events
Verify the behavior when users remove/edit (add/remove/edit layers/change values in attribute sets) attribute sets from service. We are expecting an error message saying something like “not editable” + suggest “save as and edit there”

Inspiration from editing all line/point events

What we don’t want is to show the error message upon clicking save. Show it as soon as users do the operations above.

## Slide 7 — Positive cases - EE

- Open default attribute set (all line/point events) that is read from service
- Open non-default attribute set that is read from service
- Create an attribute set with multiple line events and all the events’ attributes with default values and save the .rhas
- Create an attribute set with multiple line events and some of the events’ attributes with customized values and save the .rhas
- Edit a .rhas line event attribute set, save as a new .rhas, and set as default
- Edit a .rhas point event attribute set, save, and set as default
- Import a .rhas that does not contain the events in map using import button
- Search for an attribute set when there are multiple in Map CIM and .rhas
- Remove a .rhas attribute set
- Add multiple line events using an attribute set read from service
- Add multiple line events using a .rhas
- DynSeg using an attribute set read from service
- DynSeg using a .rhas

Cases that will not work/work properly - EE

- Remove/edit (add/remove/edit layers/change values in attribute sets) attribute sets from service and verify the behavior that prevents the operations
- Remove an attribute set that is read from service
- Use a .rhas that does not contain the events in service to add events
