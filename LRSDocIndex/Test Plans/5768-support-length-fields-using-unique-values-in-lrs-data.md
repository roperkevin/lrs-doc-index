# Support length fields using unique values in LRS Data Template wizard – Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 322 · Test Plan · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#5768](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5768) |
| **Source** | [5768_LengthUniqueValue_Testplan2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5768_LengthUniqueValue_Testplan2.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE — · dev Sharon |
| **Edited** | 2024-08-29 22:22 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | length field · unique values · data template · selection method · modal window · field name validation · canvas update |
| **Tools** | LRS Data Template wizard |

## Summary

Test plan for supporting the Unique Values option in the Selection Method of the LRS Data Template wizard. Covers UI verification, functionality verification, canvas behavior, and extensive testing scenarios including various databases, length layers, and unique value types. Includes positive and negative test cases with expected results and error message verification.

## Related documents

<!-- related:begin -->
- [Support multiple summary fields in LRS Data Template wizard – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5770-support-multiple-summary-fields-in-lrs-data-template-wizard.md>) — similar text 0.49 · 3 title words · 1 filename word · same kind/surface/dev/folder <!-- rel:323 s=6.026 -->
- [Support a single summary field in LRS Data Template wizard – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5774-support-a-single-summary-field-in-lrs-data-template-wizard.md>) — similar text 0.48 · 2 title words · 1 filename word · same kind/surface/dev/folder <!-- rel:347 s=5.804 -->
- [LRS Data Template Preview – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5814-lrs-data-template-preview.md>) — similar text 0.36 · 1 filename word · same kind/surface/dev/folder <!-- rel:355 s=4.814 -->
- [LRS Data Template wizard – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5882-lrs-data-template-wizard.md>) — similar text 0.36 · 1 title word · 1 filename word · same kind/surface/dev/folder <!-- rel:354 s=4.729 -->
- [User Story for LRS Data Product Template with Multiple Length Fields](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/for-lrs-data-product-template-with-multiple-length-fields.md>) — similar text 0.14 · 2 title words · 2 filename words · same surface <!-- rel:342 s=4.49 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a template for an LRS length data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-length-data-product.html)

_No page matched:_ [LRS Data Template wizard](https://www.google.com/search?q=%22LRS%20Data%20Template%20wizard%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Support length fields using unique values in LRS Data Template wizard – Test Plan <!-- slide 1 -->

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5768

Test Plan writer: Claire
PE: ?
Dev: Sharon

### Slide 2 <!-- slide 2 -->

UI verification

- Support Unique Values option in Selection Method in the 4th pane
- Verify parameters and texts are aligned

![Figure 1 — 2](../media/5768-support-length-fields-using-unique-values-in-lrs-data/fig-01-slide-02-2.png)
![Figure 2 — 2](../media/5768-support-length-fields-using-unique-values-in-lrs-data/fig-02-slide-02-2.png)
![Figure 3 — 2](../media/5768-support-length-fields-using-unique-values-in-lrs-data/fig-03-slide-02-2.png)
![Figure 4 — 2](../media/5768-support-length-fields-using-unique-values-in-lrs-data/fig-04-slide-02-2.png)
![Figure 5 — 2](../media/5768-support-length-fields-using-unique-values-in-lrs-data/fig-05-slide-02-2.png)
![Figure 6 — 2](../media/5768-support-length-fields-using-unique-values-in-lrs-data/fig-06-slide-02-2.png)
![Figure 7 — 2](../media/5768-support-length-fields-using-unique-values-in-lrs-data/fig-07-slide-02-2.png)

### Slide 3 <!-- slide 3 -->

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

![Figure 1 — 2](../media/5768-support-length-fields-using-unique-values-in-lrs-data/fig-01-slide-02-2.png)
![Figure 2 — 2](../media/5768-support-length-fields-using-unique-values-in-lrs-data/fig-02-slide-02-2.png)
![Figure 3 — 2](../media/5768-support-length-fields-using-unique-values-in-lrs-data/fig-03-slide-02-2.png)
![Figure 4 — 2](../media/5768-support-length-fields-using-unique-values-in-lrs-data/fig-04-slide-02-2.png)
![Figure 5 — 2](../media/5768-support-length-fields-using-unique-values-in-lrs-data/fig-05-slide-02-2.png)
![Figure 6 — 2](../media/5768-support-length-fields-using-unique-values-in-lrs-data/fig-06-slide-02-2.png)
![Figure 7 — 2](../media/5768-support-length-fields-using-unique-values-in-lrs-data/fig-07-slide-02-2.png)

### Slide 4 <!-- slide 4 -->

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

### Slide 5 <!-- slide 5 -->

Functionality Verification

- The canvas should continue to –
  - If the Canvas is open and a change is made, update the canvas upon losing focus from the updated parameter
    - When modal window is open and being edited, canvas does not dynamically update to the contents in modal window, until the fields are passed into the 4th pane
  - If the Canvas is not open and a change is made, show the updated the canvas upon clicking the preview button.

### Slide 6 <!-- slide 6 -->

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

### Slide 7 — Negative cases/Error message verification <!-- slide 7 -->

| No | Test | Expected Result | Error Message |
| --- | --- | --- | --- |
| 1 | Duplicate Field Name entered in modal window, in the 4 th pane, or both | Disabled Add and Red boxes, better with error message indicating duplicate is in modal window only, in the 4 th pane only, or both |  |
| 2 |  |  |  |
| 3 |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

– Developer provides error messages

## Test Cases

### TC-P01 — RH – summarize by county; pavement PSR as length fields <!-- src: S3 · slide 8 · table · 1 -->

- **ID:** 1
- **Expected Result:** Template generated with correct fields. Canvas shows correct information.

### TC-P02 — RH – summarize by county and city; length fields are speed limit <!-- src: S3 · slide 8 · table · 2 -->

- **ID:** 2
- **Case:** RH – summarize by county and city; length fields are speed limit, pavement’s PSR, and lane width
- **Expected Result:** Template generated with correct fields. Canvas shows correct information.

### TC-P03 — RH – no summary field; multiple length layers (pavement PSR, speed limit <!-- src: S3 · slide 8 · table · 3 -->

- **ID:** 3
- **Case:** RH – no summary field; multiple length layers (pavement PSR, speed limit, and network-jurisdiction); then, change some fields name/filter expression
- **Expected Result:** Template generated with correct fields. Canvas shows correct information.

### TC-P04 — RH – no summary field; lane width without filters <!-- src: S3 · slide 8 · table · 4 -->

- **ID:** 4
- **Expected Result:** Template generated with correct fields. Canvas shows correct information.

### TC-P05 — RH – summarize by a functional class Interstate and multiple length layers <!-- src: S3 · slide 8 · table · 5 -->

- **ID:** 5
- **Case:** RH – summarize by a functional class Interstate and multiple length layers (speed, access control, lane width)
- **Expected Result:** Template generated with correct fields. Canvas shows correct information.

### TC-P06 — APR Engineering – summarize by county and LineName ; DOT class as length field <!-- src: S3 · slide 8 · table · 6 -->

- **ID:** 6
- **Expected Result:** Template generated with correct fields. Canvas shows correct information.

### TC-P07 — APR Derived – no summary field; line IDs as length field <!-- src: S3 · slide 8 · table · 7 -->

- **ID:** 7
- **Expected Result:** Template generated with correct fields. Canvas shows correct information.

### TC-P08 — APR Engineering – summarize by county; multiple length layers (material <!-- src: S3 · slide 8 · table · 8 -->

- **ID:** 8
- **Case:** APR Engineering – summarize by county; multiple length layers (material; inline inspection; Centerline accuracy) ); then, change some fields name/filter expression
- **Expected Result:** Template generated with correct fields. Canvas shows correct information.

### TC-P09 — APR Engineering – no summary field, length field is centerline accuracy <!-- src: S3 · slide 8 · table · 9 -->

- **ID:** 9
- **Expected Result:** Template generated with correct fields. Canvas shows correct information.

### TC-P10 — PoM – summarize by polygon <!-- src: S3 · slide 8 · table · 10 -->

- **ID:** 10
- **Case:** PoM – summarize by polygon; length fields are network-city and network-Increase/Decrease
- **Expected Result:** Template generated with correct fields. Canvas shows correct information.

### TC-P11 — Open a template for RH and overwrite parameters <!-- src: S3 · slide 9 · table · 11 -->

- **ID:** 11
- **Expected Result:** Template is overwritten with changed inputs. Canvas shows correct information.

### TC-P12 — Open a template for APR-Engineering and overwrite parameters <!-- src: S3 · slide 9 · table · 12 -->

- **ID:** 12
- **Expected Result:** Template is overwritten with changed inputs. Canvas shows correct information.

### TC-P13 — Open a template for PoM and overwrite parameters <!-- src: S3 · slide 9 · table · 13 -->

- **ID:** 13
- **Expected Result:** Template is overwritten with changed inputs. Canvas shows correct information.

### TC-P14 — Switch map <!-- src: S3 · slide 9 · table · 14 -->

- **ID:** 14
- **Expected Result:** Wizard verifies if populated contents are still valid for the current map. If not, error out corresponding fields

## Other content

### Slide 8 — Positive cases (test various dbs /FSs) <!-- slide 8 -->

Make a folder of jsons and screenshots of canvas
Share with Michael and PE.
