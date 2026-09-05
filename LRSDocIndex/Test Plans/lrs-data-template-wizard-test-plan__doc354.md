# LRS Data Template wizard – Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#5882](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5882) |
| **Source** | [LRSDataTemplate_Testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/LRSDataTemplate_Testplan.pptx>) |
| **Edited** | 2024-07-02 19:25 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "LRS Data Template wizard – Test Plan"
source_file: "LRSDataTemplate_Testplan.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/LRSDataTemplate_Testplan.pptx"
doc_id: 354
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: "Claire"
dev: "Sharon"
author: "Lakshmi Ananthanarayanan"
last_edited_by: "Claire Wang"
last_edited: "2024-07-02T19:25:45Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["data template", "template creation", "route identifier", "mileage", "network layer", "template validation", "error handling"]
tools: ["LRS Data Template"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#5882"]
related: [{"doc":347,"file":"support-a-single-summary-field-in-lrs-data-template-wizard-test-plan__doc347.md","s":6.302},{"doc":355,"file":"lrs-data-template-preview-test-plan__doc355.md","s":6.113},{"doc":323,"file":"support-multiple-summary-fields-in-lrs-data-template-wizard-test-plan__doc323.md","s":5.636},{"doc":256,"file":"route-log-data-product-template-test-plan__doc256.md","s":5.081},{"doc":322,"file":"support-length-fields-using-unique-values-in-lrs-data-template-wizard-test-plan__doc322.md","s":4.729}]
```
-->

## Summary

Test plan for the LRS Data Template tool added to the Location Referencing ribbon in ArcGIS Pro. Covers UI verification, functionality checks, error handling, and positive and negative test cases across different database types and network configurations. Includes tests for template creation, overwriting, and validation of parameters such as network selection, template name, and description length.

## Related documents

<!-- related:begin -->
- [Support a single summary field in LRS Data Template wizard – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-a-single-summary-field-in-lrs-data-template-wizard-test-plan__doc347.md>) — similar text 0.50 · 1 title word · 1 filename word · same kind/surface/pe/dev/folder <!-- rel:347 -->
- [LRS Data Template Preview – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/lrs-data-template-preview-test-plan__doc355.md>) — similar text 0.49 · 1 filename word · same kind/surface/pe/dev/folder <!-- rel:355 -->
- [Support multiple summary fields in LRS Data Template wizard – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-multiple-summary-fields-in-lrs-data-template-wizard-test-plan__doc323.md>) — similar text 0.42 · 1 title word · 1 filename word · same kind/surface/pe/dev/folder <!-- rel:323 -->
- [Route Log data product template – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/route-log-data-product-template-test-plan__doc256.md>) — similar text 0.33 · 1 filename word · same kind/surface/pe/dev/folder <!-- rel:256 -->
- [Support length fields using unique values in LRS Data Template wizard – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-length-fields-using-unique-values-in-lrs-data-template-wizard-test-plan__doc322.md>) — similar text 0.36 · 1 title word · 1 filename word · same kind/surface/dev/folder <!-- rel:322 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a template for an LRS length data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-length-data-product.html)
<!-- docs:end -->

---

## Slide 1 — LRS Data Template wizard – Test Plan

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5882

PE: Claire
Dev: Sharon

## Slide 2

LR tool:

- Add a tool “LRS Data Template” in LRS Data Products group in LR ribbon
- Needs location referencing license to use tool
UI verification

- Clicking on this tool opens LRS Data Template pane in LRS Data Products tab
- Verify parameters and texts are aligned in LRS Data Template pane
  - The first pane has Data Product Type and instructions – also verify contents
  - The second pane has Network, template Name, and Description inputs
- Verify the first 2 pages only
- Verify the paging experience

![image1.png](../media/doc615_image1.png)

## Slide 3

Functionality Verification

- Verify only Length is available for type for now
- Verify only LRS network layer in the map can be used in Network
  - Auto-populate the only/first network in TOC
  - List only networks in dropdown
  - If Network is missing from the TOC. Dropdown is disabled and Finish is disabled, and a blue banner shows up at the top “Add a network layer to the map”
  - If the map is closed, the wizard pane do not close, but empty out with the blue banner
- Provide a valid Name as template file name
- Can also browse to location and import an existing template
  - Network, name and description are populated based on the existing template
  - If the Network configured in the existing template is missing from the TOC. An error shows up in the wizard and users cannot save
- Verify description cannot exceed 300 characters
- Verify the 4 pagination buttons work. Finish creates/overwrites the template.json. For now, only 2 fields can be configured: Route Identifier and Mileage.
  - Verify the RID (for network that is not configured with Rname) or RName (when it’s configured for the network) is saved correctly for the specified network
  - Verify mileagefield is length
- Saved to the project directory by default. Can save to another directory.

No bigger box
Name, title and description (the steps) will look different
After entering, character count will update

![image2.png](../media/doc615_image2.png)

## Slide 4

Testing

- Test in fgdb, egdb (oracle + sql), fs - default and child versions
- Test with nonline, Line, Derived network, PoM, and Addressing (sanity)
- Test when there are multiple networks in TOC
- Test creating new template and opening and overwriting existing template
- The tool should recognize network layer when it is checked off (invisible) in map
  - Test when Network does not exist in TOC (for creating new and overwriting existing (Step 2 & 4) from previous page)
- Test with different Name and Description
- Test closing map – the wizard pane do not close, but empty out with the blue banner
- Test with dark and light theme
- 508 and i18n compliance
Automation: not yet
Doc: not yet

## Slide 5

| No | Test | Expected Result | Error Message |
| --- | --- | --- | --- |
| 1 | User provides invalid Description that exceeds 300 characters | Cannot type after 300 |  |
| 2 | If there are duplicate field tags in existing template, go with the first one | go with the first one |  |
| 3 | User selects an existing template json and changes parameters | Warning of overwriting existing file |  |
| 4 | User selects an existing template json but it’s for a different network, or it does not have a valid network | Error + red box |  |

– Developer provides error messages
Negative cases/Error message verification

## Slide 6

| No. | Test case | Expected | Observed |
| --- | --- | --- | --- |
| 1 | Create a template for RH. | Template generated with correct RID and mileage fields. |  |
| 2 | Create a template for APR – engineering when 2 networks exist in map. | Template generated with correct RID and mileage fields. |  |
| 3 | Create a template for APR – continuous when 2 networks exist in map. | Template generated with correct RID and mileage fields. |  |
| 4 | Create a template for PoM when multiple networks exist in map. | Template generated with correct RID and mileage fields. |  |
| 5 | Create a template for AM. | Template generated with correct RID and mileage fields. |  |
| 6 | Open a template for RH and overwrite it. | Template shown with correct RID and mileage fields. Template is overwritten with changed inputs. |  |
| 7 | Open a template for APR-engineering and overwrite it. | Template shown with correct RID and mileage fields. Template is overwritten with changed inputs. |  |
| 8 | Open a template for PoM and overwrite it. | Template shown with correct RID and mileage fields. Template is overwritten with changed inputs. |  |

Positive cases (test various dbs/FSs)

## Slide 7

| No. | Test case | Expected | Observed |
| --- | --- | --- | --- |
| 9 | Close map before saving anything | Wizard is not closed but emptied. Nothing is saved or overwritten |  |
| 10 | Switch map | Wizard verifies if populated contents are still valid for the current map. If not, error out corresponding (only network in this user story) fields |  |
| 11 | Bring in existing file, description exceeds 300 characters | No error. Description shows the first 300 characters. Save will overwrite and save only these 300 characters |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

Positive cases
