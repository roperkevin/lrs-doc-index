# 64 bit OID LRS Event Editing Tools – Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 481 · Test Plan · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#5507](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5507) |
| **Source** | [64bitOIDLRSEventEditingTools_testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/64bitOIDLRSEventEditingTools_testplan.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE Claire Wang · dev Sharon |
| **Edited** | 2023-10-20 20:57 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | 64 bit oid · event editing tools · point event · line event · spanning event · dynamic segmentation · core attribute table |
| **Tools** | Dynamic Segmentation table · Core attribute table · Core add feature · Update vertices · Move tools · Event Replacement |

## Summary

Test plan for verifying LRS event editing tools support 64-bit OID values across various event editing operations including adding, splitting, merging events, and dynamic segmentation. Covers positive and negative test cases on line and non-line networks with all event types and schema elements. Includes automation of test cases for each event edit tool.

## Related documents

<!-- related:begin -->
- [64-bit OID in LRS Event Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-event-editing-tools.md>) — similar text 0.56 · 5 title words · 4 filename words · same surface <!-- rel:504 s=8.331 -->
- [64 bit OID Other Pro LR Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5510-64-bit-oid-other-pro-lr-tools.md>) — similar text 0.56 · 3 title words · 3 filename words · same kind/surface/pe/dev/folder <!-- rel:482 s=7.917 -->
- [64 bit OID GP Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5509-64-bit-oid-gp.md>) — similar text 0.47 · 3 title words · 2 filename words · same kind/surface/pe/folder <!-- rel:467 s=6.233 -->
- [64-bit OID Support for Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5013-64-bit-oid-support-for-route-editing-tools.md>) — similar text 0.31 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:483 s=5.812 -->
- [64-bit OID in LRS Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-route-editing-tools.md>) — similar text 0.49 · 4 title words · 3 filename words · same surface <!-- rel:502 s=5.358 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [Dynamic Segmentation table](https://www.google.com/search?q=%22Dynamic%20Segmentation%20table%22+site%3Adoc.esri.com) · [Core attribute table](https://www.google.com/search?q=%22Core%20attribute%20table%22+site%3Adoc.esri.com) · [Core add feature](https://www.google.com/search?q=%22Core%20add%20feature%22+site%3Adoc.esri.com) · [Update vertices](https://www.google.com/search?q=%22Update%20vertices%22+site%3Adoc.esri.com) · [Move tools](https://www.google.com/search?q=%22Move%20tools%22+site%3Adoc.esri.com) · [Event Replacement](https://www.google.com/search?q=%22Event%20Replacement%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — 64 bit OID LRS Event Editing Tools – Test Plan <!-- slide 1 -->

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5507

PE: Claire Wang
Dev: Sharon

### Slide 2 <!-- slide 2 -->

Data:
The scope of testing for this user story is to test everything on 64 bit OID.

- These LRS event editing tools can support actual 64-bit values in the schema items updated by the tools
    - Add Single Pt
    - Add Multiple Pt
    - Add Single Ln
    - Add Multiple Ln
    - Split Event
    - Merge Events
    - Dynamic Segmentation table
    - Core attribute table
    - Core add feature/update vertices/move tools
    - Event Replacement
- Test with line and non line networks
- Test with all 3 event types (point, line, spanning)
- Test on each event editing operation (breadth, not depth)
- Ensure all schema elements impacted by each event edit has a 64-bit OID value
- Test with FS in Pro
- Test with all layers and all records with 64 bit OID
Automation
Create an automated test (ex. 64-bit OID event editing tools) that automates one test case for each event edit tool
Documentation
N/A

### Slide 3 <!-- slide 3 -->

Verification

- Verify the event editing tools can handle 64-bit OID values in any schema element that is read/updated
  - Network feature classes
  - Event feature classes
- Verify the tools proceed correctly and the OID fields in associated routes and events are intact

## Test Cases

### TC-P01 — Add single point event <!-- src: S4 · slide 4 · Positive cases · 1 -->

- Using Route and Measure and Intersection methods in Pro

### TC-P02 — Add multiple point events <!-- src: S4 · slide 4 · Positive cases · 2 -->

- Using Route and Measure and Intersection methods in Pro

### TC-P03 — Add single non-spanning line event <!-- src: S4 · slide 4 · Positive cases · 3 -->

- Using Route and Measure and Intersection methods in Pro

### TC-P04 — Add single spanning line event <!-- src: S4 · slide 4 · Positive cases · 4 -->

- Using Route and Measure and Intersection methods in Pro

### TC-P05 — Add multiple line events <!-- src: S4 · slide 4 · Positive cases · 5 -->

- Mix spanning and non-spanning
- Using Route and Measure and Intersection methods in Pro

### TC-P06 — Split non-spanning line event <!-- src: S4 · slide 4 · Positive cases · 6 -->

### TC-P07 — Split spanning line event <!-- src: S4 · slide 4 · Positive cases · 7 -->

### TC-P08 — Merge non-spanning line events <!-- src: S4 · slide 4 · Positive cases · 8 -->

### TC-P09 — Merge spanning line events <!-- src: S4 · slide 4 · Positive cases · 9 -->

### TC-P10 — DynSeg <!-- src: S4 · slide 4 · Positive cases · 10 -->

- Edit in DynSeg table

### TC-P11 — Event Replacement <!-- src: S4 · slide 4 · Positive cases · 11 -->

- All event types
- Using Route and Measure and Intersection methods in Pro

### TC-P12 — Core attribute table <!-- src: S4 · slide 4 · Positive cases · 12 -->

- Change event measure
- Change event non-lrs attribute

### TC-P13 — Core add events <!-- src: S4 · slide 4 · Positive cases · 13 -->

- Add point, non-spanning line, and spanning line events

### TC-P14 — Core edit vertices <!-- src: S4 · slide 4 · Positive cases · 14 -->

### TC-P15 — Core move <!-- src: S4 · slide 4 · Positive cases · 15 -->

## Other content

### Slide 5 — Negative cases <!-- slide 5 -->

Verify a couple errors

### Notes

Note for myself: prepare APRUN in 64 bit oid, but for route editing and GP; prepare postmile but for route editing. There is no event.
