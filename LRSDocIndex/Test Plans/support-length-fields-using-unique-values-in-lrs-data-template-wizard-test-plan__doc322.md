# Support length fields using unique values in LRS Data Template wizard – Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#5768](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5768) |
| **Source** | [5768_LengthUniqueValue_Testplan2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5768_LengthUniqueValue_Testplan2.pptx>) |
| **Edited** | 2024-08-29 22:22 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support length fields using unique values in LRS Data Template wizard – Test Plan"
source_file: "5768_LengthUniqueValue_Testplan2.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5768_LengthUniqueValue_Testplan2.pptx"
doc_id: 322
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: "Sharon"
author: "Lakshmi Ananthanarayanan"
last_edited_by: "Claire Wang"
last_edited: "2024-08-29T22:22:54Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["length field", "unique values", "data template", "selection method", "modal window", "field name validation", "canvas update"]
tools: ["LRS Data Template wizard"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#5768"]
related: [{"doc":323,"file":"support-multiple-summary-fields-in-lrs-data-template-wizard-test-plan__doc323.md","s":6.026},{"doc":347,"file":"support-a-single-summary-field-in-lrs-data-template-wizard-test-plan__doc347.md","s":5.804},{"doc":355,"file":"lrs-data-template-preview-test-plan__doc355.md","s":4.814},{"doc":354,"file":"lrs-data-template-wizard-test-plan__doc354.md","s":4.729},{"doc":342,"file":"user-story-for-lrs-data-product-template-with-multiple-length-fields__doc342.md","s":4.49}]
```
-->

## Summary

Test plan for supporting the Unique Values option in the Selection Method of the LRS Data Template wizard. Covers UI verification, functionality verification, canvas behavior, and extensive testing scenarios including various databases, length layers, and unique value types. Includes positive and negative test cases with expected results and error message verification.

## Related documents

<!-- related:begin -->
- [Support multiple summary fields in LRS Data Template wizard – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-multiple-summary-fields-in-lrs-data-template-wizard-test-plan__doc323.md>) — similar text 0.49 · 3 title words · 1 filename word · same kind/surface/dev/folder <!-- rel:323 -->
- [Support a single summary field in LRS Data Template wizard – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-a-single-summary-field-in-lrs-data-template-wizard-test-plan__doc347.md>) — similar text 0.48 · 2 title words · 1 filename word · same kind/surface/dev/folder <!-- rel:347 -->
- [LRS Data Template Preview – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/lrs-data-template-preview-test-plan__doc355.md>) — similar text 0.36 · 1 filename word · same kind/surface/dev/folder <!-- rel:355 -->
- [LRS Data Template wizard – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/lrs-data-template-wizard-test-plan__doc354.md>) — similar text 0.36 · 1 title word · 1 filename word · same kind/surface/dev/folder <!-- rel:354 -->
- [User Story for LRS Data Product Template with Multiple Length Fields](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/user-story-for-lrs-data-product-template-with-multiple-length-fields__doc342.md>) — similar text 0.14 · 2 title words · 2 filename words · same surface <!-- rel:342 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a template for an LRS length data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-length-data-product.html)

_No page matched:_ [LRS Data Template wizard](https://www.google.com/search?q=%22LRS%20Data%20Template%20wizard%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support length fields using unique values in LRS Data Template wizard – Test Plan

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5768

Test Plan writer: Claire
PE: ?
Dev: Sharon

## Slide 2

UI verification

- Support Unique Values option in Selection Method in the 4th pane
- Verify parameters and texts are aligned

![image2.png](../media/doc663_image2.png) ![image4.png](../media/doc663_image4.png) ![image6.png](../media/doc663_image6.png) ![image8.png](../media/doc663_image8.png) ![image10.png](../media/doc663_image10.png) ![image12.png](../media/doc663_image12.png) ![image14.png](../media/doc663_image14.png)

## Slide 3

Functionality Verification

- Selection Method is Single Value by default
- After a length layer is chosen, changing Selection Method to Unique Values will pop up a modal window
  - If length layer is not chosen yet, the Selection Method does not contain Unique Values option (disabled Single Value)
  - The modal window first shows an empty Field dropdown only. No table below “Select fields”.
  - After choosing a field from the dropdown, all unique values, excluding system fields, in the field (show all unique values for coded value domain even if not all values exist in map – moderate priority) (if there is a filter or time filter applies on the map that no record of this layer appears in the map, we should still be able to pull all the unique values) appear in Select Fields table
  - Select Fields table has 3 columns
    - The checkbox in header can select/unselect all. The individual checkboxes control each unique value
    - Value column shows the unique values in the selected field (code if domain/subtype)
    - Field Name initially is what is shown in Value column. Field names are editable
    - Field Name cannot exceed 50 characters
    - Do not allow duplicate Field Names (red box + disabled Add)
      - Validate and provide hover message for the red boxes indicating the duplicate is within modal window only, with a field in the 4th pane only, or both
  - When the content gets too long (e.g. many values), show a vertical scroll bar
  - When the content gets too wide (e.g. long field names), just resize and provide hover for long texts.

![image2.png](../media/doc663_image2.png) ![image4.png](../media/doc663_image4.png) ![image6.png](../media/doc663_image6.png) ![image8.png](../media/doc663_image8.png) ![image10.png](../media/doc663_image10.png) ![image12.png](../media/doc663_image12.png) ![image14.png](../media/doc663_image14.png)

## Slide 4

Functionality Verification

- When Add button in modal window is clicked, add each checked field as an individual length field in the length field table, and the modal window automatically closes
  - Field Names are the ones provided in modal window
- If the user clicks X in modal window without clicking Add, modal window closes without adding anything in the 4th pane
  - The selection method becomes single value again automatically, so when users need to pop up the unique values window again, they use the dropdown to select to pop it up
- Click to highlight and select a field in the Length fields table, and show corresponding parameters below
  - The selection method now becomes Single Value for this field
    - The dropdown does not contain Unique Values.
    - When I want to add another set of unique values, the only workflow is: Add, select length layer, and then select unique values without a Field Name and Filter expression put in
  - Create filter expression automatically for this field
- If a row is selected in the table and the “Add Fields” button is clicked, then deselect the row, clear out the Length Layer and Field Name in Table and Filter expression parameters for the user to enter new parameters
- There is no limitation of the total number of length fields added

## Slide 5

Functionality Verification

- The canvas should continue to –
  - If the Canvas is open and a change is made, update the canvas upon losing focus from the updated parameter
    - When modal window is open and being edited, canvas does not dynamically update to the contents in modal window, until the fields are passed into the 4th pane
  - If the Canvas is not open and a change is made, show the updated the canvas upon clicking the preview button.

## Slide 6

Testing

- Test in fgdb, egdb (oracle + sql), fs - default and child versions
- Test with nonline, Line, Derived network, PoM, and Addressing
- Test with different types of length layers (line events and networks)
- Test with different types of unique values (e.g. coded value domains vs. unique values from a regular field)
- Test adding a combination of single value and unique values
- Testing adding all unique values from modal window vs. a selection
- Test changing Field Name in modal window and in the 4th pane
- Test creating new template and opening and overwriting existing template
- The tool should recognize length layer when it is checked off (invisible) in map
- Test when Layer/Field does not exist in TOC (by removing the Layer from map or importing an existing json that has wrong information)
- Test filter expression – add/change/remove/etc after unique values are added
- Test adding lots of (20) length fields
- Test canvas behavior
- Test with dark and light theme
- 508 and i18n compliance
Automation: UI automation (2-3 for add/edit existing) + file compare for the json
Doc: N/A – Claire is writing the doc for the entire wizard

## Slide 7

| No | Test | Expected Result | Error Message |
| --- | --- | --- | --- |
| 1 | Duplicate Field Name entered in modal window, in the 4 th pane, or both | Disabled Add and Red boxes, better with error message indicating duplicate is in modal window only, in the 4 th pane only, or both |  |
| 2 |  |  |  |
| 3 |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

– Developer provides error messages
Negative cases/Error message verification

## Slide 8

| No. | Test case | Expected |
| --- | --- | --- |
| 1 | RH – summarize by county; pavement PSR as length fields | Template generated with correct fields. Canvas shows correct information. |
| 2 | RH – summarize by county and city; length fields are speed limit, pavement’s PSR, and lane width | Template generated with correct fields. Canvas shows correct information. |
| 3 | RH – no summary field; multiple length layers (pavement PSR, speed limit, and network-jurisdiction); then, change some fields name/filter expression | Template generated with correct fields. Canvas shows correct information. |
| 4 | RH – no summary field; lane width without filters | Template generated with correct fields. Canvas shows correct information. |
| 5 | RH – summarize by a functional class Interstate and multiple length layers (speed, access control, lane width) | Template generated with correct fields. Canvas shows correct information. |
| 6 | APR Engineering – summarize by county and LineName ; DOT class as length field | Template generated with correct fields. Canvas shows correct information. |
| 7 | APR Derived – no summary field; line IDs as length field | Template generated with correct fields. Canvas shows correct information. |
| 8 | APR Engineering – summarize by county; multiple length layers (material; inline inspection; Centerline accuracy) ); then, change some fields name/filter expression | Template generated with correct fields. Canvas shows correct information. |
| 9 | APR Engineering – no summary field, length field is centerline accuracy | Template generated with correct fields. Canvas shows correct information. |
| 10 | PoM – summarize by polygon; length fields are network-city and network-Increase/Decrease | Template generated with correct fields. Canvas shows correct information. |

Positive cases (test various dbs/FSs)
Make a folder of jsons and screenshots of canvas
Share with Michael and PE.

## Slide 9

| No. | Test case | Expected |
| --- | --- | --- |
| 11 | Open a template for RH and overwrite parameters | Template is overwritten with changed inputs. Canvas shows correct information. |
| 12 | Open a template for APR-Engineering and overwrite parameters | Template is overwritten with changed inputs. Canvas shows correct information. |
| 13 | Open a template for PoM and overwrite parameters | Template is overwritten with changed inputs. Canvas shows correct information. |
| 14 | Switch map | Wizard verifies if populated contents are still valid for the current map. If not, error out corresponding fields |
| 15 |  |  |

Positive cases (test various dbs/FSs)
