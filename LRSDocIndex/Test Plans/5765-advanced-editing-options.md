# Advanced Editing Options Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 336 · Test Plan · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#5765](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5765) |
| **Source** | [5765-AdvancedTableEditingOptions_TestPlanV2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5765-AdvancedTableEditingOptions_TestPlanV2.pptx>) · rev V2 |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2024-08-16 15:21 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | attribute table editing · event editing · retire events · merge events · modify vertices · event attributes · non lrs attributes · lrs attributes · point event · line event · spanning line event · advanced editing options |
| **Tools** | — |

## Summary

Test plan for advanced editing options in attribute table editing for linear referencing system events, including retiring events as of a specific date and merging coincident events. Covers positive and negative UI tests, editing of LRS and nonLRS attributes, vertex modifications, and various scenarios of event retirement and merging across point, line, and spanning line events. Includes tests for different network configurations and modes such as dark and light modes, with accessibility and internationalization considerations.

## Related documents

<!-- related:begin -->
- [Advanced Table Editing Options in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/advanced-table-editing-options-in-pro.md>) — similar text 0.17 · 3 title words · 4 filename words · same surface <!-- rel:369 s=4.909 -->
- [Spike: Advanced Table Editing options in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/advanced-table-editing-options-in-pro.md>) — similar text 0.08 · 3 title words · 3 filename words · same surface <!-- rel:492 s=4.804 -->
- [64 bit OID LRS Event Editing Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5507-64-bit-oid-lrs-event-editing-tools.md>) — similar text 0.08 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:481 s=3.738 -->
- [Conflict Prevention for Event Editing in Pro – Core Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/conflict-prevention-for-event-editing-in-pro-core-tools-v4.md>) — similar text 0.06 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:670 s=3.555 -->
- [Point Events Dynamic Segmentation Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/point-events-dynseg.md>) — similar text 0.32 · same kind/surface/folder <!-- rel:365 s=3.044 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [Event behavior for route retirement](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-behavior-for-route-retirement.html)

_No page matched:_ [update vertices](https://www.google.com/search?q=%22update%20vertices%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Devtopia Issue <!-- slide 1 -->

Advanced Editing Options

**Notes**
- Add advanced options to attribute table editing, similar to the Event Editor experience, but also include these options for editing event attributes in the Attributes pane or with the Modify Vertices tool
- Add option for retiring edited events as of a specific date and another option for merging coincident events after an edit in the attribute table
- Add options related to this new functionality in the LR Pro options
- Test in FS only
- Test with nonline and line networks, including UNAPR and ADMRH configurations
- Test with point, line, and spanning line events
- Test in dark and light modes
- 508 and i18n
- Editing LRS or nonLRS attributes in an event Attribute Table or the Attributes Pane will prompt the advanced options pop-up when edits are applied (per table record)
- Modify Vertices will also prompt the advanced options pop-up, but only for event measure changes

![Figure 1 — Devtopia Issue](../media/5765-advanced-editing-options/fig-01-slide-01-devtopia-issue.png)
![Figure 2 — Devtopia Issue](../media/5765-advanced-editing-options/fig-02-slide-01-devtopia-issue.png)

## Test Cases

### TC-P01 — Checkboxes can be checked/unchecked <!-- src: S4 · slide 2 · Positive Tests: Pop-up UI · 1 -->

- **Group:** Pop-up UI

### TC-P02 — Clicking cancel performs the edit without the advanced LR options executing <!-- src: S4 · slide 2 · Positive Tests: Pop-up UI · 2 -->

- **Group:** Pop-up UI

### TC-P03 — Clicking Ok will perform the chosen options <!-- src: S4 · slide 2 · Positive Tests: Pop-up UI · 3 -->

- **Group:** Pop-up UI

### TC-P04 — Date text box can enter dates by typing or by choosing a date from the calendar <!-- src: S4 · slide 2 · Positive Tests: Pop-up UI · 4 -->

- **Group:** Pop-up UI
- **Case:** Date text box can enter dates by typing or by choosing a date from the calendar date picker

### TC-P05 — Clicking the red X to close the pop-up performs the edit without the advanced LR <!-- src: S4 · slide 2 · Positive Tests: Pop-up UI · 5 -->

- **Group:** Pop-up UI
- **Case:** Clicking the red X to close the pop-up performs the edit without the advanced LR options executing

### TC-P06 — Tab key can be used to move between elements of the UI <!-- src: S4 · slide 2 · Positive Tests: Pop-up UI · 6 -->

- **Group:** Pop-up UI

### TC-P07 — When the “Always use current system date” option is enabled <!-- src: S4 · slide 2 · Positive Tests: Pop-up UI · 7 -->

- **Group:** Pop-up UI
- **Case:** When the “Always use current system date” option is enabled, the effective date will auto-populate to the current date, but can be changed

### TC-P08 — Enable the above option and close/reopen the project the next day <!-- src: S4 · slide 2 · Positive Tests: Pop-up UI · 8 -->

- **Group:** Pop-up UI
- **Case:** Enable the above option and close/reopen the project the next day, ensuring that the effective date updates to the current system date

### TC-P09 — Checking the “Retire edited events and create new events effective” option sets <!-- src: S4 · slide 2 · Positive Tests: Advanced LR Pro Options · 1 -->

- **Group:** Advanced LR Pro Options
- **Case:** Checking the “Retire edited events and create new events effective” option sets the advanced editing options pop-up to the chosen date

### TC-P10 — Unchecking the above option will disable the advanced editing options pop-up <!-- src: S4 · slide 2 · Positive Tests: Advanced LR Pro Options · 2 -->

- **Group:** Advanced LR Pro Options

### TC-P11 — Checking the “Always use current system date” option will populate the pop-up <!-- src: S4 · slide 2 · Positive Tests: Advanced LR Pro Options · 3 -->

- **Group:** Advanced LR Pro Options
- **Case:** Checking the “Always use current system date” option will populate the pop-up effective date with the current system date

### TC-P12 — Unchecking the above option will populate the effective date <!-- src: S4 · slide 2 · Positive Tests: Advanced LR Pro Options · 4 -->

- **Group:** Advanced LR Pro Options
- **Case:** Unchecking the above option will populate the effective date to the user-specified date

### TC-P13 — Checking the “Merge coincident events that are edited in the attribute table” <!-- src: S4 · slide 2 · Positive Tests: Advanced LR Pro Options · 5 -->

- **Group:** Advanced LR Pro Options
- **Case:** Checking the “Merge coincident events that are edited in the attribute table” option will merge coincident events following an edit

### TC-P14 — Unchecking the above option will not merge coincident events that have been <!-- src: S4 · slide 2 · Positive Tests: Advanced LR Pro Options · 6 -->

- **Group:** Advanced LR Pro Options
- **Case:** Unchecking the above option will not merge coincident events that have been edited in an attribute table

### TC-P15 — Checking the “Automatically apply these options when editing in the attribute <!-- src: S4 · slide 2 · Positive Tests: Advanced LR Pro Options · 7 -->

- **Group:** Advanced LR Pro Options
- **Case:** Checking the “Automatically apply these options when editing in the attribute table and don’t prompt me” option will automatically apply the above settings without prompting the user

### TC-P16 — Unchecking the above option will not automatically apply the user’s chosen <!-- src: S4 · slide 2 · Positive Tests: Advanced LR Pro Options · 8 -->

- **Group:** Advanced LR Pro Options
- **Case:** Unchecking the above option will not automatically apply the user’s chosen settings

### TC-N01 — Clicking Ok without a populated effective date <!-- src: S4 · slide 2 · Negative Tests: UI · 1 -->

- **Group:** UI

### TC-N02 — Invalid characters entered in date text box <!-- src: S4 · slide 2 · Negative Tests: UI · 2 -->

- **Group:** UI

### TC-U01 — Edit Event nonLRS Attributes and Retire as of a chosen date (case 1) <!-- src: S2 · slide 3 · case 1 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 10 | Active | Good |

Before Edit:
Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 10 | Active | Poor |

Edits applied, original events retired as of 1/1/2010 and new record created:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2010 | 0 | 10 | Active | Good |
| Line | Line1 | Route1 | 1/1/2010 | <Null> | 0 | 10 | Active | Poor |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 4 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-04-slide-03-1-edit-event-nonlrs-attributes.svg)

### TC-U02 — Edit Event NonLRS Attributes and Retire and Merge as of a Chosen Date (case 2) <!-- src: S1 · slide 4 · case 2 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 5 | Active | Good |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 5 | 10 | Active | Poor |

Edit in Attribute Table (yellow highlight indicates edited attributes):
Edits applied, original events retired and merged as of 1/1/2010 and new record created:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2010 | 0 | 5 | Active | Good |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2010 | 5 | 10 | Active | Poor |
| Line | Line1 | Route1 | 1/1/2010 | <Null> | 0 | 10 | Active | Good |

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 5 | Active | Good |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 5 | 10 | Active | Good |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 5 — Before Edit:](../media/5765-advanced-editing-options/fig-05-slide-04-before-edit.svg)

### TC-U03 — Edit Event LRS Attributes and Retire and Merge as of a Chosen Date (case 3) <!-- src: S1 · slide 5 · case 3 -->

Edit in Attribute Table (yellow highlight indicates edited attributes):
Edits applied, original events retired and merged as of 1/1/2010 and new record created: :

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2010 | 0 | 5 | Active | Good |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2010 | 6 | 10 | Active | Good |
| Line | Line1 | Route1 | 1/1/2010 | <Null> | 0 | 10 | Active | Good |

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 5 | Active | Good |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 5 | 10 | Active | Good |

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 5 | Active | Good |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 6 | 10 | Active | Good |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 6 — Before Edit:](../media/5765-advanced-editing-options/fig-06-slide-05-before-edit.svg)

### TC-U04 — Edit Event LRS and NonLRS Attributes and Retire and Merge as of a Chosen Date (case 4) <!-- src: S1 · slide 6 · case 4 -->

- **Case:** Edit Event LRS and nonLRS Attributes and Retire and Merge as of a chosen date, option to choose date is overridden

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 5 | Active | Good |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 6 | 10 | Active | Poor |

Edit in Attribute Table (yellow highlight indicates edited attributes):
Edits applied, original events retired and merged as of 1/1/2010 and new record created:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2010 | 0 | 5 | Active | Good |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2010 | 6 | 10 | Active | Good |
| Line | Line1 | Route1 | 1/1/2010 | <Null> | 0 | 10 | Active | Good |

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 5 | Active | Good |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 5 | 10 | Active | Good |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 7 — Before Edit:](../media/5765-advanced-editing-options/fig-07-slide-06-before-edit.svg)

### TC-U05 — Edit Event LRS and NonLRS Attributes and Retire and Merge as of a Chosen Date (case 5) <!-- src: S1 · slide 7 · case 5 -->

- **Case:** Edit Event LRS and nonLRS Attributes and Retire and Merge as of a chosen date, edit middle event that will merge 3 total events

| Event<br>Layer | From<br>RouteID | To<br>RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Route1 | Line1 | 1/1/2000 | <Null> | 0 | 3 | Active | 450 |
| Line | Route1 | Route2 | LineA | 1/1/2000 | <Null> | 3 | 12 | Active | 400 |
| Line | Route2 | Route2 | Line2 | 1/1/2000 | <Null> | 12 | 15 | Active | 450 |

Edit in Attribute Table (yellow highlight indicates edited/new attributes):

| Event<br>Layer | From<br>RouteID | To<br>RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Route1 | Line1 | 1/1/2000 | <Null> | 0 | 3 | Active | 450 |
| Line | Route1 | Route2 | LineA | 1/1/2000 | <Null> | 3 | 12 | Active | 450 |
| Line | Route2 | Route2 | Line2 | 1/1/2000 | <Null> | 12 | 15 | Active | 450 |

Edits applied, original events retired and merged as of 1/1/2010 and new record created: :

| Event<br>Layer | From<br>RouteID | To<br>RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Route1 | Line1 | 1/1/2000 | 1/1/2010 | 0 | 3 | Active | 450 |
| Line | Route1 | Route2 | LineA | 1/1/2000 | 1/1/2010 | 3 | 12 | Active | 400 |
| Line | Route2 | Route2 | Line2 | 1/1/2000 | 1/1/2010 | 12 | 15 | Active | 450 |
| Line | Route1 | Route2 | Line1 | 1/1/2010 | <Null> | 0 | 15 | Active | 450 |

[figure: Route1 · Route2 · Before Edit:]

![Figure 8 — 7](../media/5765-advanced-editing-options/fig-08-slide-07-7.png)
![Figure 9 — 7](../media/5765-advanced-editing-options/fig-09-slide-07-7.png)

![Figure 10 — 7](../media/5765-advanced-editing-options/fig-10-slide-07-7.svg)

### TC-U06 — Edit Event LRS and NonLRS Attributes and Merge Coincident Only as of a Chosen (case 6) <!-- src: S1 · slide 8 · case 6 -->

- **Case:** Edit Event LRS and nonLRS Attributes and Merge coincident only as of a chosen date, edit middle event that will merge 3 total events

| Event<br>Layer | From<br>RouteID | To<br>RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Route1 | Line1 | 1/1/2000 | <Null> | 0 | 3 | Active | 450 |
| Line | Route1 | Route2 | LineA | 1/1/2000 | <Null> | 3 | 12 | Active | 400 |
| Line | Route2 | Route2 | Line2 | 1/1/2000 | <Null> | 12 | 15 | Active | 450 |

Edit in Attribute Table (yellow highlight indicates edited/new attributes):

| Event<br>Layer | From<br>RouteID | To<br>RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Route1 | Line1 | 1/1/2000 | <Null> | 0 | 3 | Active | 450 |
| Line | Route1 | Route2 | LineA | 1/1/2000 | <Null> | 3 | 12 | Active | 450 |
| Line | Route2 | Route2 | Line2 | 1/1/2000 | <Null> | 12 | 15 | Active | 450 |

Edits applied, events merged:

| Event<br>Layer | From<br>RouteID | To<br>RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Route1 | Line1 | 1/1/2000 | <Null> | 0 | 15 | Active | 450 |

[figure: Route1 · Route2 · Before Edit:]

![Figure 8 — 7](../media/5765-advanced-editing-options/fig-08-slide-07-7.png)
![Figure 9 — 7](../media/5765-advanced-editing-options/fig-09-slide-07-7.png)

![Figure 11 — 8](../media/5765-advanced-editing-options/fig-11-slide-08-8.svg)

### TC-U07 — Edit Event LRS and NonLRS Attributes and Retire Only as of a Chosen Date <!-- src: S1 · slide 9 · case 7 -->

- **Case:** Edit Event LRS and nonLRS Attributes and Retire only as of a chosen date, edit middle event that will not merge 3 total events

| Event<br>Layer | From<br>RouteID | To<br>RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Route1 | Line1 | 1/1/2000 | <Null> | 0 | 3 | Active | 450 |
| Line | Route1 | Route2 | LineA | 1/1/2000 | <Null> | 3 | 12 | Active | 400 |
| Line | Route2 | Route2 | Line2 | 1/1/2000 | <Null> | 12 | 15 | Active | 450 |

Edit in Attribute Table (yellow highlight indicates edited/new attributes):

| Event<br>Layer | From<br>RouteID | To<br>RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Route1 | Line1 | 1/1/2000 | <Null> | 0 | 3 | Active | 450 |
| Line | Route1 | Route2 | LineA | 1/1/2000 | <Null> | 3 | 12 | Active | 450 |
| Line | Route2 | Route2 | Line2 | 1/1/2000 | <Null> | 12 | 15 | Active | 450 |

Edits applied, original events retired as of 1/1/2010 and new record created: :

| Event<br>Layer | From<br>RouteID | To<br>RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Route1 | Line1 | 1/1/2000 | <Null> | 0 | 3 | Active | 450 |
| Line | Route1 | Route2 | LineA | 1/1/2000 | 1/1/2010 | 3 | 12 | Active | 400 |
| Line | Route2 | Route2 | Line2 | 1/1/2000 | <Null> | 12 | 15 | Active | 450 |
| Line | Route1 | Route2 | LineA | 1/1/2010 | <Null> | 3 | 12 | Active | 450 |

[figure: Route1 · Route2 · Before Edit:]

![Figure 8 — 7](../media/5765-advanced-editing-options/fig-08-slide-07-7.png)
![Figure 9 — 7](../media/5765-advanced-editing-options/fig-09-slide-07-7.png)

![Figure 12 — 9](../media/5765-advanced-editing-options/fig-12-slide-09-9.svg)

### TC-U08 — Edit Event LRS and NonLRS Attributes and Retire as of Event’s From Date <!-- src: S1 · slide 10 · case 8 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 10 | Active | Good |

Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 5 | Active | Poor |

Edits applied, original events retired as of 1/1/2000, new record replaces original:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 5 | Active | Poor |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 13 — Before Edit:](../media/5765-advanced-editing-options/fig-13-slide-10-before-edit.svg)

### TC-U09 — Edit Event LRS and NonLRS Attributes and Retire as of a Date Before the Event’s <!-- src: S1 · slide 11 · case 9 -->

- **Case:** Edit Event LRS and nonLRS Attributes and Retire as of a date before the event’s from date

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 10 | Active | Good |

Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 5 | Active | Poor |

Edits applied, original events “retired” as of 1/1/1990, new record replaces original:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/1990 | <Null> | 0 | 5 | Active | Poor |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 14 — Before Edit:](../media/5765-advanced-editing-options/fig-14-slide-11-before-edit.svg)

### TC-U10 — Edit Event LRS and NonLRS Attributes and Retire as of a Date Before the Route’s <!-- src: S1 · slide 12 · case 10 -->

- **Case:** Edit Event LRS and nonLRS Attributes and Retire as of a date before the route’s from date

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2015 | 0 | 10 | Active | Good |

Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2015 | 0 | 5 | Active | Poor |

Edits applied, original events retired as of 1/1/1990 but cannot be found on route:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Loc<br>Error | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/1990 | <Null> | 0 | 5 | Route Not Found | Active | Poor |

Route1 (1/1/2000-1/1/2015)
Route1 (1/1/2000-1/1/2015)

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

### TC-U11 — Edit Event LRS and NonLRS Attributes and Retire as of a Date After the Route’s <!-- src: S1 · slide 13 · case 11 -->

- **Case:** Edit Event LRS and nonLRS Attributes and Retire as of a date after the route’s to date

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2015 | 0 | 10 | Active | Good |

Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2015 | 0 | 5 | Active | Poor |

Edits applied, original events retired as of 1/1/2020 but cannot be found on route:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Loc<br>Error | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2020 | 0 | 10 | No Error | Active | Good |
| Line | Line1 | Route1 | 1/1/2020 | <Null> | 0 | 5 | Route Not Found | Active | Poor |

Route1 (1/1/2000-1/1/2015)
Route1 (1/1/2000-1/1/2015)

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

### TC-U12 — Edit Event LRS and NonLRS Attributes and Merge Coincident Only as of a Chosen (case 12) <!-- src: S1 · slide 14 · case 12 -->

- **Case:** Edit Event LRS and nonLRS Attributes and Merge coincident only as of a chosen date, edit middle event that will merge 3 total events

| Event<br>Layer | From<br>RouteID | To<br>RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Route1 | Line1 | 1/1/2000 | <Null> | 0 | 3 | Active | 450 |
| Line | Route1 | Route1 | LineA | 1/1/2000 | <Null> | 2 | 5 | Active | 400 |
| Line | Route2 | Route2 | Line2 | 1/1/2000 | <Null> | 12 | 15 | Active | 450 |

Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | From<br>RouteID | To<br>RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Route1 | Line1 | 1/1/2000 | <Null> | 0 | 3 | Active | 450 |
| Line | Route1 | Route2 | LineA | 1/1/2000 | <Null> | 3 | 12 | Active | 450 |
| Line | Route2 | Route2 | Line2 | 1/1/2000 | <Null> | 12 | 15 | Active | 450 |

Edits applied, events merged:

| Event<br>Layer | From<br>RouteID | To<br>RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Route1 | Line1 | 1/1/2000 | <Null> | 0 | 15 | Active | 450 |

[figure: Route1 · Route2 · Before Edit:]

![Figure 8 — 7](../media/5765-advanced-editing-options/fig-08-slide-07-7.png)
![Figure 9 — 7](../media/5765-advanced-editing-options/fig-09-slide-07-7.png)

![Figure 15 — 14](../media/5765-advanced-editing-options/fig-15-slide-14-14.svg)

### TC-U13 — Edit Event LRS and NonLRS Attributes and Merge Coincident Only as of a Chosen (case 13) <!-- src: S1 · slide 15 · case 13 -->

- **Case:** Edit Event LRS and nonLRS Attributes and Merge coincident only as of a chosen date

| Event<br>Layer | RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Line1 | 1/1/2000 | 1/1/2005 | 0 | 3 | Retired | 300 |
| Line | Route2 | Line2 | 1/1/2000 | <Null> | 12 | 15 | Active | 450 |

Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route2 | Line1 | 1/1/2000 | <Null> | 10 | 14 | Active | 450 |
| Line | Route2 | Line2 | 1/1/2000 | <Null> | 12 | 15 | Active | 450 |

Edits applied, events merged:

| Event<br>Layer | RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route2 | Line1 | 1/1/2000 | <Null> | 0 | 15 | Active | 450 |

[figure: Route1 · Route2 · Before Edit:]

![Figure 8 — 7](../media/5765-advanced-editing-options/fig-08-slide-07-7.png)
![Figure 9 — 7](../media/5765-advanced-editing-options/fig-09-slide-07-7.png)

![Figure 16 — 15](../media/5765-advanced-editing-options/fig-16-slide-15-15.svg)

### TC-U14 — Edit Event LRS Attributes and Retire and Merge as of a Chosen Date (case 14) <!-- src: S1 · slide 16 · case 14 -->

Edit in Attribute Table (yellow highlight indicates edited attributes):
Edits applied, original events retired and merged as of 1/1/2010 and new record created: :

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2010 | 0 | 5 | Active | Good |
| Line | Line1 | Route1 | 1/1/1990 | 1/1/2010 | 6 | 10 | Active | Good |
| Line | Line1 | Route1 | 1/1/2010 | <Null> | 0 | 10 | Active | Good |

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 5 | Active | Good |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 5 | 10 | Active | Good |

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 5 | Active | Good |
| Line | Line1 | Route1 | 1/1/1990 | 1/1/1995 | 6 | 10 | Active | Good |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 17 — Before Edit:](../media/5765-advanced-editing-options/fig-17-slide-16-before-edit.svg)

### TC-U15 — Edit Event NonLRS Attributes and Retire and Merge as of a Chosen Date (case 15) <!-- src: S1 · slide 17 · case 15 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 5 | Active | Good |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 5 | 10 | Active | Good |

Edit in Attribute Table (yellow highlight indicates edited attributes):
Edits applied, original events retired as of 1/1/2010 and new record created:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 5 | Active | Good |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2010 | 5 | 10 | Active | Good |
| Line | Line1 | Route1 | 1/1/2010 | <Null> | 0 | 10 | Active | Poor |

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 5 | Active | Good |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 5 | 10 | Active | Poor |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 18 — Before Edit:](../media/5765-advanced-editing-options/fig-18-slide-17-before-edit.svg)

### TC-U16 — Edit Event nonLRS Attributes and Retire as of a chosen date (case 1) <!-- src: S2 · slide 18 · case 1 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | <Null> | 2 | Active | Stop |

Before Edit:
Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | <Null> | 2 | Active | Flasher |

Edits applied, original events retired as of 1/1/2010 and new record created:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | 1/1/2010 | 2 | Active | Stop |
| Point | Point1 | Route1 | 1/1/2010 | <Null> | 2 | Active | Flasher |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 19 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-19-slide-18-1-edit-event-nonlrs-attributes.svg)

### TC-U17 — Edit Event LRS Attributes and Retire as of a chosen date <!-- src: S2 · slide 19 · case 2 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | <Null> | 2 | Active | Stop |

Before Edit:
Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | <Null> | 8 | Active | Stop |

Edits applied, original events retired as of 1/1/2010 and new record created:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | 1/1/2010 | 2 | Active | Stop |
| Point | Point1 | Route1 | 1/1/2010 | <Null> | 8 | Active | Stop |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 20 — 2. Edit Event LRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-20-slide-19-2-edit-event-lrs-attributes-and-retire.svg)

### TC-U18 — Edit Event LRS and NonLRS Attributes and Retire as of a Chosen Date (case 3) <!-- src: S1 · slide 20 · case 3 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | <Null> | 2 | Active | Stop |

Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | <Null> | 8 | Active | Flasher |

Edits applied, original events retired as of 1/1/2010 and new record created:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | 1/1/2010 | 2 | Active | Stop |
| Point | Point1 | Route1 | 1/1/2010 | <Null> | 8 | Active | Flasher |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 21 — Before Edit:](../media/5765-advanced-editing-options/fig-21-slide-20-before-edit.svg)

### TC-U19 — Edit Event LRS and NonLRS Attributes and Retire as of a Chosen Date (case 4) <!-- src: S1 · slide 21 · case 4 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | <Null> | 2 | Active | Stop |

Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route2 | 1/1/2000 | <Null> | 14 | Active | Flasher |

Edits applied, original events retired as of 1/1/2010 and new record created:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | 1/1/2010 | 2 | Active | Stop |
| Point | Point1 | Route2 | 1/1/2010 | <Null> | 14 | Active | Flasher |

[figure: Route1 · Route2 · Before Edit:]

![Figure 8 — 7](../media/5765-advanced-editing-options/fig-08-slide-07-7.png)
![Figure 9 — 7](../media/5765-advanced-editing-options/fig-09-slide-07-7.png)

![Figure 22 — 21](../media/5765-advanced-editing-options/fig-22-slide-21-21.svg)

### TC-U20 — Edit Event NonLRS Attributes and Retire as of a Chosen Date, Attempt To Merge (case 5) <!-- src: S1 · slide 22 · case 5 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | <Null> | 2 | Active | Stop |
| Point | Point2 | Route1 | 1/1/2000 | <Null> | 8 | Active | Flasher |

Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | <Null> | 2 | Active | Stop |
| Point | Point2 | Route1 | 1/1/2000 | <Null> | 2 | Active | Stop |

Edits applied, original events retired as of 1/1/2010 and :

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | <Null> | 2 | Active | Stop |
| Point | Point1 | Route1 | 1/1/2000 | 1/1/2010 | 8 | Active | Stop |
| Point | Point1 | Route1 | 1/1/2010 | <Null> | 2 | Active | Flasher |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 23 — Before Edit:](../media/5765-advanced-editing-options/fig-23-slide-22-before-edit.svg)

### TC-U21 — Edit Event vertices and Retire as of a chosen date (case 1) <!-- src: S2 · slide 23 · case 1 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 10 | Active | Good |

Before Edit:
Edit using Modify Vertices (yellow highlight indicates edited attribute(s) based on new vertex location):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 5 | 10 | Active | Good |

Edits applied, original events retired as of 1/1/2010 and new record created:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2010 | 0 | 10 | Active | Good |
| Line | Line1 | Route1 | 1/1/2010 | <Null> | 5 | 10 | Active | Good |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 24 — 1. Edit Event vertices and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-24-slide-23-1-edit-event-vertices-and-retire.svg)

### TC-U22 — Edit Event Vertices and Retire and Merge as of a Chosen Date <!-- src: S1 · slide 24 · case 2 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 3 | Active | Good |
| Line | Line2 | Route1 | 1/1/2000 | <Null> | 5 | 10 | Active | Good |

Edit using Modify Vertices (yellow highlight indicates edited attributes based on new vertex location):
Edits applied, original events retired as of 1/1/2010 and new record created:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2010 | 0 | 3 | Active | Good |
| Line | Line2 | Route1 | 1/1/2000 | 1/1/2010 | 5 | 10 | Active | Good |
| Line | Line1 | Route1 | 1/1/2010 | <Null> | 0 | 10 | Active | Good |

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 3 | Active | Good |
| Line | Line2 | Route1 | 1/1/2000 | <Null> | 3 | 10 | Active | Good |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 25 — Before Edit:](../media/5765-advanced-editing-options/fig-25-slide-24-before-edit.svg)

### TC-U23 — Edit multiple Event vertices and Retire as of a chosen date <!-- src: S2 · slide 25 · case 3 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 10 | Active | Good |

Before Edit:
Edit using Modify Vertices (yellow highlight indicates edited attributes based on new vertex location):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 1 | 6 | Active | Good |

Edits applied, original events retired as of 1/1/2010 and new record created:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2010 | 0 | 10 | Active | Good |
| Line | Line1 | Route1 | 1/1/2010 | <Null> | 1 | 6 | Active | Good |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 26 — 3. Edit multiple Event vertices and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-26-slide-25-3-edit-multiple-event-vertices.svg)

### TC-U24 — Edit multiple event vertices, Merge only of 3 records <!-- src: S2 · slide 26 · case 4 -->

| Event<br>Layer | From<br>RouteID | To<br>RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Route1 | Line1 | 1/1/2000 | <Null> | 0 | 3 | Active | 450 |
| Line | Route2 | Route2 | LineA | 1/1/2000 | <Null> | 10 | 14 | Active | 450 |
| Line | Route2 | Route2 | Line2 | 1/1/2000 | <Null> | 12 | 15 | Active | 450 |

Edit using Modify Vertices (yellow highlight indicates edited attributes based on new vertex location):

| Event<br>Layer | From<br>RouteID | To<br>RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Route1 | Line1 | 1/1/2000 | <Null> | 0 | 3 | Active | 450 |
| Line | Route1 | Route2 | LineA | 1/1/2000 | <Null> | 2 | 14 | Active | 450 |
| Line | Route2 | Route2 | Line2 | 1/1/2000 | <Null> | 12 | 15 | Active | 450 |

Edits applied, events merged:

| Event<br>Layer | From<br>RouteID | To<br>RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Route2 | Line1 | 1/1/2000 | <Null> | 0 | 15 | Active | 450 |

[figure: Route1 · Route2 · Before Edit:]

![Figure 8 — 7](../media/5765-advanced-editing-options/fig-08-slide-07-7.png)
![Figure 9 — 7](../media/5765-advanced-editing-options/fig-09-slide-07-7.png)

![Figure 27 — 4. Edit multiple event vertices, Merge only of 3 records](../media/5765-advanced-editing-options/fig-27-slide-26-4-edit-multiple-event-vertices-merge.svg)

### TC-U25 — Edit Multiple Event Vertices, Retire and Merge <!-- src: S1 · slide 27 · case 5 -->

- **Case:** Edit multiple event vertices, Retire and Merge, with new time slice on a new line/routes

| Event<br>Layer | From<br>RouteID | To<br>RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Route1 | Line1 | 1/1/2000 | <Null> | 0 | 3 | Active | 450 |
| Line | Route1A | Route1A | Line1A | 1/1/2000 | <Null> | 12 | 15 | Active | 450 |

Edit using Modify Vertices (yellow highlight indicates edited attributes based on new vertex location):

| Event<br>Layer | From<br>RouteID | To<br>RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Route1 | Line1 | 1/1/2000 | <Null> | 0 | 3 | Active | 450 |
| Line | Route1 | Route1 | Line1A | 1/1/2000 | <Null> | 0.5 | 5 | Active | 450 |

Edits applied as of 1/1/2010, events merged:

| Event<br>Layer | From<br>RouteID | To<br>RouteID | EventID | From<br>Date | To<br>Date | From<br>Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | Route1 | Line1 | 1/1/2000 | 1/1/2010 | 0 | 3 | Active | 450 |
| Line | Route1A | Route1A | Line1A | 1/1/2000 | 1/1/2010 | 12 | 15 | Active | 450 |
| Line | Route1 | Route1 | Line1 | 1/1/2010 | <Null> | 0 | 5 | Active | 450 |

[figure: Route1 · Route1A · Before Edit: · Route2]

![Figure 8 — 7](../media/5765-advanced-editing-options/fig-08-slide-07-7.png)
![Figure 9 — 7](../media/5765-advanced-editing-options/fig-09-slide-07-7.png)

![Figure 28 — 27](../media/5765-advanced-editing-options/fig-28-slide-27-27.svg)

### TC-U26 — Edit Event Vertices and Retire as of event’s from date <!-- src: S2 · slide 28 · case 6 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 10 | Active | Good |

Before Edit:
Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 5 | Active | Good |

Edits applied, original events retired as of 1/1/2000, new record replaces original:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 5 | Active | Good |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 29 — 6. Edit Event Vertices and Retire as of event’s from date](../media/5765-advanced-editing-options/fig-29-slide-28-6-edit-event-vertices-and-retire.svg)

### TC-U27 — Edit Event Vertices and Retire as of a Date Before the Event’s From Date <!-- src: S1 · slide 29 · case 7 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 10 | Active | Good |

Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | <Null> | 0 | 5 | Active | Good |

Edits applied, original events “retired” as of 1/1/1999, new record replaces original:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/1999 | <Null> | 0 | 5 | Active | Good |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 30 — Before Edit:](../media/5765-advanced-editing-options/fig-30-slide-29-before-edit.svg)

### TC-U28 — Edit Event Vertices and Retire as of a Date Before the Route’s From Date <!-- src: S1 · slide 30 · case 8 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2015 | 0 | 10 | Active | Good |

Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2015 | 0 | 5 | Active | Good |

Edits applied, original events retired as of 1/1/1999, new record replaces original:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Loc<br>Error | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/1999 | <Null> | 0 | 5 | Route not Found | Active | Good |

Route1 (1/1/2000-1/1/2015)
Route1 (1/1/2000-1/1/2015)
Route1 (1/1/2000-1/1/2015)

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 31 — Before Edit:](../media/5765-advanced-editing-options/fig-31-slide-30-before-edit.svg)

### TC-U29 — Edit Event Vertices and Retire as of a Date After the Route’s To Date <!-- src: S1 · slide 31 · case 9 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2015 | 0 | 10 | Active | Good |

Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2015 | 0 | 5 | Active | Good |

Edits applied, original event retired as of 1/1/2020, new record replaces original:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | From Measure | To<br>Measure | Loc<br>Error | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Line1 | Route1 | 1/1/2000 | 1/1/2020 | 0 | 10 | No Error | Active | Good |
| Line | Line1 | Route1 | 1/1/2020 | <Null> | 0 | 5 | Route not Found | Active | Good |

Route1 (1/1/2000-1/1/2015)
Route1 (1/1/2000-1/1/2015)
Route1 (1/1/2000-1/1/2015)

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 32 — Before Edit:](../media/5765-advanced-editing-options/fig-32-slide-31-before-edit.svg)

### TC-U30 — Edit Event vertices and Retire as of a chosen date (case 1) <!-- src: S2 · slide 32 · case 1 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | <Null> | 2 | Active | Stop |

Before Edit:
Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | <Null> | 6 | Active | Stop |

Edits applied, original events retired as of 1/1/2010 and new record created:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | 1/1/2010 | 2 | Active | Stop |
| Point | Point1 | Route1 | 1/1/2010 | <Null> | 6 | Active | Stop |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 33 — 1. Edit Event vertices and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-33-slide-32-1-edit-event-vertices-and-retire.svg)

### TC-U31 — Edit Event vertices and Retire as of a chosen date (case 2) <!-- src: S2 · slide 33 · case 2 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | <Null> | 2 | Active | Stop |

Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route2 | 1/1/2000 | <Null> | 14 | Active | Stop |

Edits applied, original events retired as of 1/1/2010 and new record created:

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | 1/1/2010 | 2 | Active | Stop |
| Point | Point1 | Route2 | 1/1/2010 | <Null> | 14 | Active | Stop |

[figure: Route1 · Route2 · Before Edit:]

![Figure 8 — 7](../media/5765-advanced-editing-options/fig-08-slide-07-7.png)
![Figure 9 — 7](../media/5765-advanced-editing-options/fig-09-slide-07-7.png)

![Figure 34 — 2. Edit Event vertices and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-34-slide-33-2-edit-event-vertices-and-retire.svg)

### TC-U32 — Edit Event NonLRS Attributes and Retire as of a Chosen Date, Attempt To Merge (case 3) <!-- src: S1 · slide 34 · case 3 -->

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | <Null> | 2 | Active | Stop |
| Point | Point2 | Route1 | 1/1/2000 | <Null> | 8 | Active | Stop |

Edit in Attribute Table (yellow highlight indicates edited attributes):

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | <Null> | 2 | Active | Stop |
| Point | Point2 | Route1 | 1/1/2000 | <Null> | 2 | Active | Stop |

Edits applied, original events retired as of 1/1/2010 and :

| Event<br>Layer | EventID | RouteID | From<br>Date | To<br>Date | Measure | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Point1 | Route1 | 1/1/2000 | <Null> | 2 | Active | Stop |
| Point | Point1 | Route1 | 1/1/2000 | 1/1/2010 | 8 | Active | Stop |
| Point | Point1 | Route1 | 1/1/2010 | <Null> | 2 | Active | Stop |

![Figure 3 — 1. Edit Event nonLRS Attributes and Retire as of a chosen date](../media/5765-advanced-editing-options/fig-03-slide-03-1-edit-event-nonlrs-attributes.png)

![Figure 35 — Before Edit:](../media/5765-advanced-editing-options/fig-35-slide-34-before-edit.svg)
