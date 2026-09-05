# LRS Data Template Preview – Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 355 · Test Plan · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#5814](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5814) |
| **Source** | [TemplatePreview_Testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/TemplatePreview_Testplan.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE Claire · dev Sharon |
| **Edited** | 2024-07-02 19:25 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | data template · preview window · template wizard · geodatabase · network layer · error handling · template creation |
| **Tools** | — |

## Summary

Test plan for the LRS Data Template preview feature in the Location Referencing wizard. Covers verification of preview button behavior, modeless window content updates, error handling, and testing across different geodatabases and network configurations. Includes positive and negative test cases for template creation, overwriting, and map interactions.

## Related documents

<!-- related:begin -->
- [LRS Data Template wizard – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5882-lrs-data-template-wizard.md>) — similar text 0.49 · 1 filename word · same kind/surface/pe/dev/folder <!-- rel:354 s=6.113 -->
- [Route Log data product template – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6203-route-log-data-product-template.md>) — similar text 0.31 · 1 filename word · same kind/surface/pe/dev/folder <!-- rel:256 s=6.039 -->
- [Support a single summary field in LRS Data Template wizard – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5774-support-a-single-summary-field-in-lrs-data-template-wizard.md>) — similar text 0.42 · 1 filename word · same kind/surface/pe/dev/folder <!-- rel:347 s=5.917 -->
- [Support multiple summary fields in LRS Data Template wizard – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5770-support-multiple-summary-fields-in-lrs-data-template-wizard.md>) — similar text 0.35 · 1 filename word · same kind/surface/pe/dev/folder <!-- rel:323 s=5.526 -->
- [Support length fields using unique values in LRS Data Template wizard – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5768-support-length-fields-using-unique-values-in-lrs-data.md>) — similar text 0.36 · 1 filename word · same kind/surface/dev/folder <!-- rel:322 s=4.814 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a template for an LRS length data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-length-data-product.html)

_No page matched:_ [transform lrs data](https://www.google.com/search?q=%22transform%20lrs%20data%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — LRS Data Template Preview – Test Plan <!-- slide 1 -->

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5814

PE: Claire
Dev: Sharon

### Slide 2 <!-- slide 2 -->

Verification

- A preview button is on all pages in the LRS Data Template wizard
- Clicking on preview button opens a modeless window of the template
- The modeless window can be closed by clicking on the close button at the top
- Preview closes when the wizard closes
- If the map is closed, the wizard pane do not close, but empty out with the blue banner. Preview button can either be gone or disabled, with the modeless window closed
- The modeless window's contents are dynamically linked to the wizard
  - If the Canvas is open and a change is made, update the canvas upon losing focus from the updated parameter
  - If the Canvas is not open and a change is made, show the updated canvas upon clicking the preview button.
  - Disable the preview button if Canvas is already opened
- The contents of the modeless window are non editable
- When navigating between the wizard's pages, don't alter the contents of the modeless window. The window always displays the most recent information across all of the wizard's pages

![Figure 1 — 2](../media/5814-lrs-data-template-preview/fig-01-slide-02-2.png)

### Slide 3 <!-- slide 3 -->

Testing

- Test in fgdb, egdb (oracle + sql), fs - default and child versions
- Test with nonline, Line, Derived network, and Addressing (sanity)
- Test when there are multiple networks in TOC
- Test creating new template and opening and overwriting existing template
- The tool should recognize network layer when it is checked off (invisible) in map
- If there is error in wizard, the field corresponding to that error is empty in the canvas. Canvas can still open.
- Test with different Name and Description
- Test closing wizard – preview should stay open if it’s already opened (After clicking Finish, wizard closes immediately regardless of preview behavior.)
- Test closing map and there is no map at all – the wizard pane do not close, but empty out with the blue banner. Canvas becomes empty. Preview is still enabled but will open up an empty canvas
- Test switching maps – when the network does not exist for the new map, the wizard will error out, canvas is still open but the fields with errors become empty
- Test with dark and light theme
- 508 and i18n compliance
Automation: not yet
Doc: not yet

## Test Cases

### TC-N01 — User selects the wrong file that has invalid fields (or everything is invalid) <!-- src: S3 · slide 4 · table · 1 -->

- **ID:** 1
- **Expected Result:** Canvas shows empty fields

### TC-N02 — User selects an existing template json but it’s for a different network <!-- src: S3 · slide 4 · table · 2 -->

- **ID:** 2
- **Expected Result:** Canvas shows empty network field

### TC-P01 — Create a template for RH. Save it. Run in Transform LRS Data tool. <!-- src: S3 · slide 5 · table · 1 -->

- **ID:** 1
- **Expected Result:** Preview shows the correct Route Identifier, name and description.

### TC-P02 — Create a template for APR – engineering when 2 networks exist in map. <!-- src: S3 · slide 5 · table · 2 -->

- **ID:** 2
- **Expected Result:** Preview shows the correct Route Identifier, name and description.

### TC-P03 — Create a template for APR – continuous when 2 networks exist in map. <!-- src: S3 · slide 5 · table · 3 -->

- **ID:** 3
- **Expected Result:** Preview shows the correct Route Identifier, name and description.

### TC-P04 — Create a template for PoM when multiple networks exist in map. <!-- src: S3 · slide 5 · table · 4 -->

- **ID:** 4
- **Expected Result:** Preview shows the correct Route Identifier, name and description.

### TC-P05 — Create a template for AM. Save it. Run in Transform LRS Data tool. <!-- src: S3 · slide 5 · table · 5 -->

- **ID:** 5
- **Expected Result:** Preview shows the correct Route Identifier, name and description.

### TC-P06 — Open a template for RH and overwrite it. <!-- src: S3 · slide 5 · table · 6 -->

- **ID:** 6
- **Expected Result:** Preview shows the correct, updated Route Identifier, name and description.

### TC-P07 — Open a template for APR-engineering and overwrite it. Run in Transform LRS Data <!-- src: S3 · slide 5 · table · 7 -->

- **ID:** 7
- **Case:** Open a template for APR-engineering and overwrite it. Run in Transform LRS Data tool.
- **Expected Result:** Preview shows the correct, updated Route Identifier, name and description.

### TC-P08 — Open a template for PoM and overwrite it. <!-- src: S3 · slide 5 · table · 8 -->

- **ID:** 8
- **Expected Result:** Preview shows the correct, updated Route Identifier, name and description.

### TC-P09 — Close wizard or it’s closed by clicking on finish <!-- src: S3 · slide 6 · table · 9 -->

- **ID:** 9
- **Expected Result:** Preview should stay open if it’s already opened.

### TC-P10 — Close map and there is no map left <!-- src: S3 · slide 6 · table · 10 -->

- **ID:** 10
- **Expected Result:** the wizard pane do not close, but empty out with the blue banner. Canvas becomes empty if it’s opened. If it’s closed, preview is still enabled but will open up an empty canvas

### TC-P11 — Switch map (or close current map but there are other maps) <!-- src: S3 · slide 6 · table · 11. -->

- **ID:** 11.
- **Case:** Switch map (or close current map but there are other maps) – wizard will verify contents in the new map.
- **Expected Result:** If everything is good, canvas is updated. If any field errors out, the corresponding field in canvas is empty.

## Other content

### Slide 4 — Negative cases <!-- slide 4 -->

– The following cases should already have an error in wizard. Here testing is for the preview window behavior: preview button is disabled whenever there is an error in wizard

### Slide 6 <!-- slide 6 -->

|  |  |  |  |
