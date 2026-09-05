# Retire Route – Pro AI Assistant Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 4 · Test Plan · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | 3.8 / 12.2 |
| **Issues** | [ArcGISPro/ps-location-referencing#7066](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/7066) |
| **Source** | [RetireRouteAIAssistant_TestPlan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/RetireRouteAIAssistant_TestPlan.pptx>) |
| **People** | author Karlie Murray · PE Karlie Murray · dev Sharon Lai |
| **Edited** | 2026-08-05 15:50 by Karlie Murray |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | retire route · intent recognition · parameter validation · date validation · route identification · measure validation · recalibrate downstream · error handling |
| **Tools** | Retire Route |

## Summary

This test plan verifies the ArcGIS Pro AI Assistant's Retire Route skill, covering intent recognition, parameter collection, validation, UI handoff, and error handling. It includes test cases for licensing, network parameters, date validation, route identification, measure validation, recalibration preferences, and route-specific scenarios. The plan ensures the assistant handles positive and negative paths with clear messages and proper UI behavior.

## Related documents

<!-- related:begin -->
- [Iteration Planning and Issue Tracking for Location Referencing 3.8/12.2](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Schedules/3040-iteration-planning-and-issue-tracking-for-lr-3-8-12-2.md>) — shared issue ArcGISPro/ps-location-referencing#7066 · similar text 0.05 · same surface/release 3.8 / 12.2 <!-- rel:2 s=1002.792 -->
- [Realign Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/7067-realign-route-ai-assistant-rh-apr-2026-02.md>) — similar text 0.23 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:51 s=5.588 -->
- [Reassign Route Subsequent Pane AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/7167-reassign-route-subsequent-pane-ai-assistant.md>) — similar text 0.23 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:11 s=5.144 -->
- [Reassign Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/7039-reassign-route-ai-assistant.md>) — similar text 0.30 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:34 s=5.097 -->
- [Realign Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/7067-realign-route-ai-assistant-rh-apr-v1.md>) — similar text 0.24 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:80 s=5.03 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/retire-routes.html)
<!-- docs:end -->

---

## Overview

### Slide 1 <!-- slide 1 -->

Retire Route – Pro AI Assistant
End-to-end verification of the ArcGIS Pro AI Assistant
Retire Route skill — prompt recognition, parameter
collection, validation, UI handoff, and negative paths.

Retire Route
AI Assistant Skill

ps-location-referencing #7066

Karlie Murray (PE)
Sharon Lai (Dev)

ArcGIS Pro 3.8
Enterprise 12.2

[figure: USER STORY · STORY / DEVTOPIA · OWNER · TARGET RELEASE]

![Figure 1 — Retire Route – Pro AI Assistant](../media/7066-retire-route-pro-ai-assistant/fig-01-slide-01-retire-route-pro-ai-assistant.svg)

### Slide 2 <!-- slide 2 -->

- Recognize retire intent from a flexible set of prompts (e.g., "retire a route", "retire the beginning of a road", "retire a pipeline segment").
- Verify Location Referencing licensing before proceeding.
- Walk the user through: Network → Retire Date → Route ID(s) → From/To Measures → Recalibrate Downstream.
- Confirm all inputs, then open a fully-populated Retire Route UI for the user to click Run.
- Provide clear error / cannot-complete messages on every failure path. Verify Retire Route only opens when no errors exist with the input parameters.

Test environment + Test data
ArcGIS Pro 3.8 with Pro AI Assistant add-on
ArcGIS Enterprise 12.2, Location Referencing configured

Simple & Complex routes: lollipop, loop, alpha, branch, infinity
Gapped & Multi-gapped routes

LRS Retire Route  ·  AI Assistant Test Plan
Feature Service Only

- RH Network with multi-field route Ids
- RH PostMile Network
- ADM RH Network
- APR Line Network
- UNAPR Line Network
- Network with z-values on 3D route
- Projected and unprojected data
- Spelling mistakes
- Different sentence structures and synonyms of retire
- I18n/L10n + A11y

[figure: Summary · CLIENT · SERVER · DATA · ROUTE TYPES · 2 / 21 · In-Scope]

![Figure 2 — Recognize retire intent from a flexible set of prompts (e.g., "retire a route", "retire the beginning of a road", "retire a pipeline segment").](../media/7066-retire-route-pro-ai-assistant/fig-02-slide-02-recognize-retire-intent-from-a-flexible.png)
![Figure 3 — Recognize retire intent from a flexible set of prompts (e.g., "retire a route", "retire the beginning of a road", "retire a pipeline segment").](../media/7066-retire-route-pro-ai-assistant/fig-03-slide-02-recognize-retire-intent-from-a-flexible.png)

![Figure 4 — Recognize retire intent from a flexible set of prompts (e.g., "retire a route", "retire the beginning of a road", "retire a pipeline segment").](../media/7066-retire-route-pro-ai-assistant/fig-04-slide-02-recognize-retire-intent-from-a-flexible.svg)

### Slide 3 — Flowchart Diagram <!-- slide 3 -->

LRS Retire Route  ·  AI Assistant Test Plan
3 / 21

![Figure 5 — Flowchart Diagram](../media/7066-retire-route-pro-ai-assistant/fig-05-slide-03-flowchart-diagram.png)

![Figure 6 — Flowchart Diagram](../media/7066-retire-route-pro-ai-assistant/fig-06-slide-03-flowchart-diagram.svg)

### Slide 4 <!-- slide 4 -->

Each stage below is a discrete checkpoint for testing. The assistant must confirm any values supplied in the initial prompt, gather anything missing, and produce a clear error when a stage fails.

Recognize retire intent; ask user to confirm before proceeding.

Verify Location Referencing license; link to docs on failure.

Confirm single network or prompt selection when multiple exist.

Validate against the route's valid time slice.

Verify route exists; ask for To route if line network.

Validate range and route extent; accept "entire route"/"all".

Capture user preference for downstream recalibration.

Confirm & hand off

Review all inputs; open populated Retire Route pane.

LRS Retire Route  ·  AI Assistant Test Plan
Assistant will be able to handle when a sentence has been structured with the above checkpoints (1, 3-7) out of order.

[figure: Workflow · 1 · Intent + Confirm · 2 · Licensing check · 3 · Network · 4 · Retire date · 5 · Route ID(s) · 6 · From/To measures · 7 · Recalibrate downstream · 8 · 4 /21]

![Figure 7 — Each stage below is a discrete checkpoint for testing. The assistant must confirm any values supplied in the initial prompt, gather anything missing, and produce a clear error when a stage fails.](../media/7066-retire-route-pro-ai-assistant/fig-07-slide-04-each-stage-below-is-a-discrete.svg)

## Test Cases

### TC-U01 — "I want to retire a route" <!-- src: S3 · slide 5 · table · 01-A -->

- **ID:** 01-A
- **Expected Result:** Retire skill is recognized; asks for network, route, measures
- **Notes:** Positive

### TC-U02 — "Retire the beginning of Road R1 from 0 to 3" <!-- src: S3 · slide 5 · table · 02-A -->

- **ID:** 02-A
- **Expected Result:** Retire skill is recognized; pre-fills route + measures; asks to confirm.
- **Notes:** Positive · initial prompt supplies params (RH data)

### TC-U03 — "Retire a pipeline segment on line network A" <!-- src: S3 · slide 5 · table · 03-A -->

- **ID:** 03-A
- **Expected Result:** Retire skill is recognized; pre-fills network; asks for measures
- **Notes:** Positive · (APR data)

### TC-U04 — “Retire a segment of route R1 " <!-- src: S3 · slide 5 · table · 04-A -->

- **ID:** 04-A
- **Expected Result:** Retire skill is recognized; pre-fills route (if one network)
- **Notes:** Positive

### TC-U05 — "Retire a section of a route" <!-- src: S3 · slide 5 · table · 05-A -->

- **ID:** 05-A
- **Expected Result:** Retire skill is recognized; asks for network, route, measures
- **Notes:** Positive

### TC-U06 — “Retire a portion of the pipeline" <!-- src: S3 · slide 5 · table · 06-A -->

- **ID:** 06-A
- **Expected Result:** Retire skill is recognized; asks for network, route, measures
- **Notes:** Positive · (APR data)

### TC-U07 — “Discontinue a route" <!-- src: S3 · slide 5 · table · 07-A -->

- **ID:** 07-A
- **Expected Result:** Retire skill is recognized; asks for network, route, measures
- **Notes:** Positive

### TC-U08 — "Decommission this section of pipe" <!-- src: S3 · slide 5 · table · 08-A -->

- **ID:** 08-A
- **Expected Result:** Retire skill is recognized; asks for network, route, measures
- **Notes:** Positive · (APR data)

### TC-U09 — “Remove a route" <!-- src: S3 · slide 5 · table · 09-A -->

- **ID:** 09-A
- **Expected Result:** Calls the delete route skill
- **Notes:** Negative (calls delete route)

### TC-U10 — “Deactivate route R1” <!-- src: S3 · slide 5 · table · 10-A -->

- **ID:** 10-A
- **Expected Result:** Retire skill is recognized; pre-fills route (if one network)
- **Notes:** Positive

### TC-U11 — “Terminate this pipeline segment" <!-- src: S3 · slide 5 · table · 11-A -->

- **ID:** 11-A
- **Expected Result:** Retire skill is recognized; asks for network, route, measures
- **Notes:** Positive · (APR data)

### TC-U12 — “Eliminate route R1” <!-- src: S3 · slide 5 · table · 12-A -->

- **ID:** 12-A
- **Expected Result:** Calls the delete route skill
- **Notes:** Negative

### TC-U13 — “I want to take route R1 out of service" <!-- src: S3 · slide 6 · table · 13-A -->

- **ID:** 13-A
- **Expected Result:** Retire skill is recognized; pre-fills route (if one network)
- **Notes:** Positive

### TC-U14 — “End roadway section on route R1.1" <!-- src: S3 · slide 6 · table · 14-A -->

- **ID:** 14-A
- **Expected Result:** Retire skill is recognized; asks for network, route, measures
- **Notes:** Positive · (RH data)

### TC-U15 — “I want to perform a retirement on route R1” <!-- src: S3 · slide 6 · table · 15-A -->

- **ID:** 15-A
- **Expected Result:** Retire skill is recognized; asks for network, route, measures
- **Notes:** Positive

### TC-U16 — "Delete route R1" <!-- src: S3 · slide 6 · table · 16-A -->

- **ID:** 16-A
- **Expected Result:** Calls the delete route skill
- **Notes:** Negative. Ambiguity handling

### TC-U17 — “Abandon a route" <!-- src: S3 · slide 6 · table · 17-A -->

- **ID:** 17-A
- **Expected Result:** Calls realign skill
- **Notes:** Negative. Ambiguity handling

### TC-U18 — Same prompt entered 3× in a row <!-- src: S3 · slide 6 · table · 18-A -->

- **ID:** 18-A
- **Expected Result:** Skill selection is stable across repeated attempts.
- **Notes:** Model determinism

### TC-U19 — LR license disabled <!-- src: S3 · slide 8 · table · 01-B -->

- **ID:** 01-B
- **Expected Result:** Assistant informs user LR license is required; does NOT open UI.
- **Notes:** Negative

### TC-U20 — LR license enabled, no LRS network in map <!-- src: S3 · slide 8 · table · 02-B -->

- **ID:** 02-B
- **Expected Result:** Assistant informs user an LRS Network is required in the map; does NOT open UI.
- **Notes:** Negative

### TC-U21 — Local scene with LRS network <!-- src: S3 · slide 8 · table · 03-B -->

- **ID:** 03-B
- **Expected Result:** Retire skill works identically to Pro map view.
- **Notes:** Positive

### TC-U22 — Non-feature-service source (e.g., FGDB) <!-- src: S3 · slide 8 · table · 04-B -->

- **ID:** 04-B
- **Expected Result:** Out of scope
- **Notes:** Negative · out of scope for MVP

### TC-U23 — User does not have edit privileges <!-- src: S3 · slide 8 · table · 05-B -->

- **ID:** 05-B
- **Expected Result:** Assistant will not notify user. Error will occur in UI.
- **Notes:** Negative

### TC-U24 — Signed-out portal <!-- src: S3 · slide 8 · table · 06-B -->

- **ID:** 06-B
- **Expected Result:** Assistant reports no LRS Networks found in the map
- **Notes:** Negative

### TC-U25 — AI Assistant is not set to Complex option <!-- src: S3 · slide 8 · table · 07-B -->

- **ID:** 07-B
- **Expected Result:** Assistant does not recognize retire skill
- **Notes:** Negative

### TC-U26 — One network in map, no network in prompt <!-- src: S3 · slide 9 · table · 01-C -->

- **ID:** 01-C
- **Expected Result:** Assistant confirms the single network; does not ask to pick.
- **Notes:** Positive

### TC-U27 — Multiple networks in map, no network in prompt <!-- src: S3 · slide 9 · table · 02-C -->

- **ID:** 02-C
- **Expected Result:** Assistant lists networks and prompts the user to choose.
- **Notes:** Positive

### TC-U28 — Network specified in initial prompt (valid) <!-- src: S3 · slide 9 · table · 03-C -->

- **ID:** 03-C
- **Expected Result:** Assistant confirms specified network; no picker shown.
- **Notes:** Positive · confirmation

### TC-U29 — Network specified in initial prompt (invalid name) <!-- src: S3 · slide 9 · table · 04-C -->

- **ID:** 04-C
- **Expected Result:** Assistant reports the network is not found and asks the user to pick from available.
- **Notes:** Negative (invalid name must be not related to any data in map)

### TC-U30 — No LRS network in map <!-- src: S3 · slide 9 · table · 05-C -->

- **ID:** 05-C
- **Expected Result:** Same message as 02-B (precondition failure).
- **Notes:** Cross-check

### TC-U31 — APR Line Network <!-- src: S3 · slide 9 · table · 06-C -->

- **ID:** 06-C
- **Expected Result:** Assistant handles APR-specific fields correctly.
- **Notes:** Positive

### TC-U32 — Post Mile network <!-- src: S3 · slide 9 · table · 07-C -->

- **ID:** 07-C
- **Expected Result:** Retire completes with post-mile values.
- **Notes:** Positive

### TC-U33 — Non-line network <!-- src: S3 · slide 9 · table · 08-C -->

- **ID:** 08-C
- **Expected Result:** Assistant handles Non-line network fields correctly
- **Notes:** Positive

### TC-U34 — Derived network <!-- src: S3 · slide 9 · table · 09-C -->

- **ID:** 09-C
- **Expected Result:** Assistant reports network not available with this tool
- **Notes:** Negative

### TC-U35 — Valid retire date within route's time slice <!-- src: S3 · slide 11 · table · 01-D -->

- **ID:** 01-D
- **Expected Result:** Date accepted; assistant confirms and moves on.
- **Notes:** Positive

### TC-U36 — Line Network: Retire From Route = R1 (1/1/2026-Null), To Route = R2 (02-D) <!-- src: S3 · slide 11 · table · 02-D -->

- **ID:** 02-D
- **Case:** Line Network: Retire From Route = R1 (1/1/2026-Null), To Route = R2 (7/1/2026-Null) with Retire date = 8/1/2026
- **Expected Result:** Date accepted; assistant confirms and moves on. UI has correct from and to routes.
- **Notes:** Positive - retire date is within both routes’ time slice

### TC-U37 — Line Network: Retire From Route = R1 (1/1/2026-Null), To Route = R2 (03-D) <!-- src: S3 · slide 11 · table · 03-D -->

- **ID:** 03-D
- **Case:** Line Network: Retire From Route = R1 (1/1/2026-Null), To Route = R2 (7/1/2026-Null) with Retire date = 4/1/2026
- **Expected Result:** Assistant reports the date is outside valid time slice
- **Notes:** Negative – retire date is only within one route’s time slice

### TC-U38 — Date supplied in initial prompt <!-- src: S3 · slide 11 · table · 04-D -->

- **ID:** 04-D
- **Expected Result:** Assistant confirms the date and does not ask again.
- **Notes:** Positive

### TC-U39 — Date precedes the route start date <!-- src: S3 · slide 11 · table · 05-D -->

- **ID:** 05-D
- **Expected Result:** Assistant reports invalid date and requests a valid one.
- **Notes:** Negative

### TC-U40 — Date after the current route end date <!-- src: S3 · slide 11 · table · 06-D -->

- **ID:** 06-D
- **Expected Result:** Assistant reports the date is outside valid time slice
- **Notes:** Negative

### TC-U41 — Line Network: Retire From Route = R1 (1/1/2026-Null), To Route = R3 (7/1/2026 <!-- src: S3 · slide 11 · table · 07-D -->

- **ID:** 07-D
- **Case:** Line Network: Retire From Route = R1 (1/1/2026-Null), To Route = R3 (7/1/2026 - Null) with Retire date = 5/1/2026 when R2 is (4/1/2026 - Null)
- **Expected Result:** Assistant reports the date is outside valid time slice.
- **Notes:** Negative

### TC-U42 — Line Network: Retire From Route = R1 (1/1/2026-Null), To Route = R3 <!-- src: S3 · slide 11 · table · 08-D -->

- **ID:** 08-D
- **Case:** Line Network: Retire From Route = R1 (1/1/2026-Null), To Route = R3 (7/1/2026-Null) with Retire date = 8/1/2026 when R2 is (4/1/2026 - Null)
- **Expected Result:** Date accepted; assistant confirms and moves on. UI has correct from and to routes.
- **Notes:** Positive

### TC-U43 — Ambiguous natural-language date like today, tomorrow, yesterday <!-- src: S3 · slide 11 · table · 09-D -->

- **ID:** 09-D
- **Expected Result:** Correct date is entered when UI opens
- **Notes:** Positive - Ambiguity handling

### TC-U44 — Ambiguous natural-language date like next Friday, last Tuesday <!-- src: S3 · slide 11 · table · 10-D -->

- **ID:** 10-D
- **Expected Result:** Assistant will not accept dates like next Friday or last Tuesday
- **Notes:** Negative

### TC-U45 — Locale-specific date format (DD/MM/YYYY vs MM/DD/YYYY) <!-- src: S3 · slide 11 · table · 11-D -->

- **ID:** 11-D
- **Expected Result:** Assistant honors user locale and confirms explicit date.
- **Notes:** I18n

### TC-U46 — Empty / "no date" response <!-- src: S3 · slide 11 · table · 12-D -->

- **ID:** 12-D
- **Expected Result:** Date defaults to today

### TC-U47 — Date is given but year not specified <!-- src: S3 · slide 11 · table · 13-D -->

- **ID:** 13-D
- **Expected Result:** Assistant prompts for year specification
- **Notes:** Negative

### TC-U48 — Invalid date (e.g., “7/34/25”) <!-- src: S3 · slide 11 · table · 14-D -->

- **ID:** 14-D
- **Expected Result:** Assistant re-prompts
- **Notes:** Negative

### TC-U49 — Specified route is already retired and the retire date is not within route’s <!-- src: S3 · slide 11 · table · 15-D -->

- **ID:** 15-D
- **Case:** Specified route is already retired and the retire date is not within route’s time slice
- **Expected Result:** Assistant reports the date is outside valid time slice.
- **Notes:** Negative

### TC-U50 — Specified route is already retired and the retire date is within route’s time <!-- src: S3 · slide 11 · table · 16-D -->

- **ID:** 16-D
- **Case:** Specified route is already retired and the retire date is within route’s time slice
- **Expected Result:** Date accepted; assistant confirms and moves on.
- **Notes:** Positive

### TC-U51 — Existing route ID supplied in prompt <!-- src: S3 · slide 13 · table · 01-E -->

- **ID:** 01-E
- **Expected Result:** Assistant confirms; does not re-prompt.
- **Notes:** Positive

### TC-U52 — Route ID not found in selected network <!-- src: S3 · slide 13 · table · 02-E -->

- **ID:** 02-E
- **Expected Result:** Assistant reports route not found and requests a valid one.
- **Notes:** Negative

### TC-U53 — Route name used when RouteID is the route identifier <!-- src: S3 · slide 13 · table · 03-E -->

- **ID:** 03-E
- **Expected Result:** Assistant reports route not found and requests a valid one.
- **Notes:** Negative

### TC-U54 — Multi-field route ID — all fields supplied <!-- src: S3 · slide 13 · table · 04-E -->

- **ID:** 04-E
- **Expected Result:** Assistant confirms all field values and proceeds.
- **Notes:** Positive · multi-field

### TC-U55 — Multi-field route ID — one field missing <!-- src: S3 · slide 13 · table · 05-E -->

- **ID:** 05-E
- **Expected Result:** Assistant reports route not found and requests a valid one.
- **Notes:** Negative · multi-field

### TC-U56 — Multi-field route ID — extra unrelated field <!-- src: S3 · slide 13 · table · 06-E -->

- **ID:** 06-E
- **Expected Result:** Assistant reports route not found and requests a valid one.
- **Notes:** Negative · multi-field

### TC-U57 — Line network: From route only supplied <!-- src: S3 · slide 13 · table · 07-E -->

- **ID:** 07-E
- **Expected Result:** Assistant prompts for the To route.
- **Notes:** Positive · line network

### TC-U58 — Line network: From and To routes are not on same line <!-- src: S3 · slide 13 · table · 08-E -->

- **ID:** 08-E
- **Expected Result:** Assistant prompts for valid routes
- **Notes:** Negative · line network

### TC-U59 — Line network: From and To routes are on same line but not in increasing Line <!-- src: S3 · slide 13 · table · 09-E -->

- **ID:** 09-E
- **Case:** Line network: From and To routes are on same line but not in increasing Line Order
- **Expected Result:** Assistant accepts and in UI the route order is corrected
- **Notes:** Positive · line network

### TC-U60 — Line network: From and To routes are not adjacent but on same line <!-- src: S3 · slide 13 · table · 10-E -->

- **ID:** 10-E
- **Case:** Line network: From and To routes are not adjacent but on same line and in increasing Line Order
- **Expected Result:** Assistant confirms; does not re-prompt.
- **Notes:** Positive

### TC-U61 — Route ID with special characters /spaces (valid route id/name) <!-- src: S3 · slide 13 · table · 11-E -->

- **ID:** 11-E
- **Expected Result:** Assistant confirms; does not re-prompt.
- **Notes:** Positive - Robustness

### TC-U62 — Specified route has multiple time-slices <!-- src: S3 · slide 13 · table · 12-E -->

- **ID:** 12-E
- **Expected Result:** Assistant selects the active time-slice
- **Notes:** Positive (CDOT)

### TC-U63 — Specified route is locked <!-- src: S3 · slide 13 · table · 13-E -->

- **ID:** 13-E
- **Expected Result:** Not in scope of this user story
- **Notes:** Will be part of Conflict Prevention user story

### TC-U64 — From Measure and To Measure supplied, valid range within route extent <!-- src: S3 · slide 15 · table · 01-F -->

- **ID:** 01-F
- **Expected Result:** Assistant confirms measures and proceeds.
- **Notes:** Positive

### TC-U65 — "Entire route" / "all of the route" / "the whole route”/ “full length of route” <!-- src: S3 · slide 15 · table · 02-F -->

- **ID:** 02-F
- **Expected Result:** Assistant maps to full route extent and confirms From/To.
- **Notes:** Positive · terminology

### TC-U66 — From Measure › To Measure <!-- src: S3 · slide 15 · table · 03-F -->

- **ID:** 03-F
- **Expected Result:** Assistant confirms measures and proceeds
- **Notes:** Positive

### TC-U67 — From Measure = To Measure (unless spanning multiple routes in line network) <!-- src: S3 · slide 15 · table · 04-F -->

- **ID:** 04-F
- **Expected Result:** Assistant reports measures cannot be the same
- **Notes:** Negative

### TC-U68 — From Measure is less than route's minimum measure <!-- src: S3 · slide 15 · table · 05-F -->

- **ID:** 05-F
- **Expected Result:** Assistant reports out-of-extent and re-prompts.
- **Notes:** Negative

### TC-U69 — To Measure is greater than route's maximum measure <!-- src: S3 · slide 15 · table · 06-F -->

- **ID:** 06-F
- **Expected Result:** Assistant reports out-of-extent and re-prompts.
- **Notes:** Negative

### TC-U70 — Only From Measure provided <!-- src: S3 · slide 15 · table · 07-F -->

- **ID:** 07-F
- **Expected Result:** Assistant asks for To and confirms both.
- **Notes:** Positive · partial

### TC-U71 — Only To Measure provided <!-- src: S3 · slide 15 · table · 08-F -->

- **ID:** 08-F
- **Expected Result:** Assistant asks for From and confirms both.
- **Notes:** Positive · partial

### TC-U72 — Non-numeric measure input <!-- src: S3 · slide 15 · table · 09-F -->

- **ID:** 09-F
- **Expected Result:** Assistant asks for a numeric value.
- **Notes:** Negative

### TC-U73 — Post-mile network with non-decimal measures <!-- src: S3 · slide 15 · table · 10-F -->

- **ID:** 10-F
- **Expected Result:** Assistant handles post-mile format correctly.
- **Notes:** Negative · APR/Post Mile

### TC-U74 — User answers Yes to recalibrate downstream <!-- src: S3 · slide 17 · table · 01-G -->

- **ID:** 01-G
- **Expected Result:** Preference captured and reflected on confirmation & UI.
- **Notes:** Positive

### TC-U75 — User answers No to recalibrate downstream (line network) <!-- src: S3 · slide 17 · table · 02-G -->

- **ID:** 02-G
- **Expected Result:** Preference captured; UI checkbox unchecked.
- **Notes:** Positive (line network only)

### TC-U76 — User answers No to recalibrate downstream (non-line network) <!-- src: S3 · slide 17 · table · 03-G -->

- **ID:** 03-G
- **Expected Result:** Preference captured; UI checkbox unchecked
- **Notes:** Positive

### TC-U77 — User supplies preference in initial prompt <!-- src: S3 · slide 17 · table · 04-G -->

- **ID:** 04-G
- **Expected Result:** Assistant confirms; does not ask again.
- **Notes:** Positive · confirmation

### TC-U78 — User asks a clarifying question <!-- src: S3 · slide 17 · table · 05-G -->

- **ID:** 05-G
- **Expected Result:** Out of scope for MVP — assistant informs the user and asks again.
- **Notes:** Out of Scope

### TC-U79 — User edits one value after UI opens <!-- src: S3 · slide 17 · table · 06-G -->

- **ID:** 06-G
- **Expected Result:** Assistant updates that value and re-confirms without restart.
- **Notes:** Positive

### TC-U80 — User cancels at any time <!-- src: S3 · slide 17 · table · 07-G -->

- **ID:** 07-G
- **Expected Result:** Assistant closes gracefully; no partial changes; UI not opened.
- **Notes:** Positive

### TC-U81 — UI hand-off populated exactly with confirmed values <!-- src: S3 · slide 17 · table · 08-G -->

- **ID:** 08-G
- **Expected Result:** Retire Route pane opens on pane 1 with all values pre-filled; user clicks Run.
- **Notes:** Positive · critical

### TC-U82 — Assistant recovery mid-conversation (user rephrases) <!-- src: S3 · slide 17 · table · 09-G -->

- **ID:** 09-G
- **Expected Result:** Assistant preserves already-confirmed values.
- **Notes:** Non-functional

### TC-U83 — Retire the full length of a simple route <!-- src: S3 · slide 19 · table · 01-H -->

- **ID:** 01-H
- **Expected Result:** Assistant sends correct route & measures to UI
- **Notes:** Positive

### TC-U84 — Retire the beginning portion of a simple route <!-- src: S3 · slide 19 · table · 02-H -->

- **ID:** 02-H
- **Expected Result:** Assistant sends correct route & measures to UI
- **Notes:** Positive

### TC-U85 — Retire the middle portion of a simple route <!-- src: S3 · slide 19 · table · 03-H -->

- **ID:** 03-H
- **Expected Result:** Assistant sends correct route & measures to UI
- **Notes:** Positive

### TC-U86 — Retire the end portion of a simple route <!-- src: S3 · slide 19 · table · 04-H -->

- **ID:** 04-H
- **Expected Result:** Assistant sends correct route & measures to UI
- **Notes:** Positive

### TC-U87 — Retire a portion of a gapped route <!-- src: S3 · slide 19 · table · 05-H -->

- **ID:** 05-H
- **Expected Result:** Assistant sends correct route & measures to UI
- **Notes:** Positive

### TC-U88 — Retire the full length of a multi-gapped route <!-- src: S3 · slide 19 · table · 06-H -->

- **ID:** 06-H
- **Expected Result:** Assistant sends correct route & measures to UI
- **Notes:** Positive

### TC-U89 — Retire the full length of a branch route <!-- src: S3 · slide 19 · table · 07-H -->

- **ID:** 07-H
- **Expected Result:** Assistant sends correct route & measures to UI
- **Notes:** Positive

### TC-U90 — Retire a portion of a lollipop route in the middle of the route <!-- src: S3 · slide 19 · table · 08-H -->

- **ID:** 08-H
- **Expected Result:** Out of scope – Assistant will not catch retiring self-intersecting routes in the middle. Only UI will catch this.
- **Notes:** Out of scope

### TC-U91 — Retire the full length of a loop route <!-- src: S3 · slide 19 · table · 09-H -->

- **ID:** 09-H
- **Expected Result:** Assistant sends correct route & measures to UI
- **Notes:** Positive

### TC-U92 — Retire a portion of an alpha route <!-- src: S3 · slide 19 · table · 10-H -->

- **ID:** 10-H
- **Expected Result:** Assistant sends correct route & measures to UI
- **Notes:** Positive

### TC-U93 — Retire the beginning or ending portion of an infinity route <!-- src: S3 · slide 19 · table · 11-H -->

- **ID:** 11-H
- **Expected Result:** Assistant sends correct route & measures to UI
- **Notes:** Positive

### TC-U94 — Retire a route with a concurrent route present <!-- src: S3 · slide 19 · table · 12-H -->

- **ID:** 12-H
- **Expected Result:** Assistant sends correct route & measures to UI
- **Notes:** Positive

### TC-U95 — Retire route that has multiple time-slices <!-- src: S3 · slide 19 · table · 13-H -->

- **ID:** 13-H
- **Expected Result:** Assistant sends correct route, time-slice, & measures to UI
- **Notes:** Positive

### TC-U96 — “I want to perform a retirement on route R1 to route R2 in the Engineering <!-- src: S3 · slide 20 · table · 01-I -->

- **ID:** 01-I
- **Case:** “I want to perform a retirement on route R1 to route R2 in the Engineering Network between measures 0 and 10 and recalibrate downstream with retire date 01/01/2000.”
- **Expected Result:** Accepted and sent to UI
- **Notes:** Positive

### TC-U97 — “On 01/01/2000, retire the beginning of Road R1 from 0 to 3 in county log <!-- src: S3 · slide 20 · table · 02-I -->

- **ID:** 02-I
- **Case:** “On 01/01/2000, retire the beginning of Road R1 from 0 to 3 in county log network and recalibrate downstream."
- **Expected Result:** Accepted and sent to UI
- **Notes:** Positive

### TC-U98 — "Decommission a section of pipe as of January 1 st 2000 between R1 to R2 s <!-- src: S3 · slide 20 · table · 03-I -->

- **ID:** 03-I
- **Case:** "Decommission a section of pipe as of January 1 st 2000 between R1 to R2 s panning measures 0 to 10 and don’t update downstream in the engineering network. "
- **Expected Result:** Accepted and sent to UI
- **Notes:** Positive

### TC-U99 — “In the engineering network <!-- src: S3 · slide 20 · table · 04-I -->

- **ID:** 04-I
- **Case:** “In the engineering network, retire a portion of the pipeline spanning routes R1 to R2 with retire date = 01/01/2000 and From Measure = 0 To Measure = 10 do not refresh downstream."
- **Expected Result:** Accepted and sent to UI
- **Notes:** Positive

### TC-U100 — “I want to take the full length of route R1 in county log network out of service <!-- src: S3 · slide 20 · table · 05-I -->

- **ID:** 05-I
- **Case:** “I want to take the full length of route R1 in county log network out of service and recalibrate downstream today."
- **Expected Result:** Accepted and sent to UI
- **Notes:** Positive

### TC-U101 — “Without calibrating downstream <!-- src: S3 · slide 20 · table · 06-I -->

- **ID:** 06-I
- **Case:** “Without calibrating downstream, retire pipeline segment 0-10 on pipe R1 to R2 in the engineering line network as of today."
- **Expected Result:** Accepted and sent to UI
- **Notes:** Positive

### TC-U102 — “As of date 01-01-2000 <!-- src: S3 · slide 20 · table · 07-I -->

- **ID:** 07-I
- **Case:** “As of date 01-01-2000, I want to end the roadway section on routeid = R1 at measures 0-10 in the road network with the option to update measures downstream."
- **Expected Result:** Accepted and sent to UI
- **Notes:** Positive

### TC-U103 — “At measures 0 through 10 on R1 in the LRS Network <!-- src: S3 · slide 20 · table · 08-I -->

- **ID:** 08-I
- **Case:** “At measures 0 through 10 on R1 in the LRS Network, deactivate the route R1 as of 01/01/2000 and recalibrate downstream.”
- **Expected Result:** Accepted and sent to UI
- **Notes:** Positive

### TC-U104 — “From route R1 to route R2 in the engineering network <!-- src: S3 · slide 20 · table · 09-I -->

- **ID:** 09-I
- **Case:** “From route R1 to route R2 in the engineering network, discontinue the pipeline from measure 0 to 10 at date 01-01-2000 and don’t recalibrate downstream.”
- **Expected Result:** Accepted and sent to UI
- **Notes:** Positive

### TC-U105 — “Retire a segment of pipe in the engineering network for pipe R1 at measures 0 <!-- src: S3 · slide 20 · table · 10-I -->

- **ID:** 10-I
- **Case:** “Retire a segment of pipe in the engineering network for pipe R1 at measures 0 through 10 on January 1st, 2000 and recalibrate the downstream measures”
- **Expected Result:** Accepted and sent to UI
- **Notes:** Positive

### TC-U106 — “I want to decommission the entire route R1 in county log on 01-01-2000 <!-- src: S3 · slide 20 · table · 11-I -->

- **ID:** 11-I
- **Case:** “I want to decommission the entire route R1 in county log on 01-01-2000 and perform recalibration.”
- **Expected Result:** Accepted and sent to UI
- **Notes:** Positive

### TC-U107 — “Retire pipe R1 to R2 at measures 0 <!-- src: S3 · slide 20 · table · 12-I -->

- **ID:** 12-I
- **Case:** “Retire pipe R1 to R2 at measures 0 – 10 within the APR engineering network at date 01/01/2000 without recalibrating downstream”
- **Expected Result:** Accepted and sent to UI
- **Notes:** Positive

### TC-U108 — “Retire the start to the end of route = R1 in county log and recalibrate <!-- src: S3 · slide 20 · table · 13-I -->

- **ID:** 13-I
- **Case:** “Retire the start to the end of route = R1 in county log and recalibrate downstream on date = 01/01/2000”
- **Expected Result:** Accepted and sent to UI
- **Notes:** Positive

### TC-U109 — “I’d like to take the entire pipeline R1 out of service and retire it today <!-- src: S3 · slide 20 · table · 14-I -->

- **ID:** 14-I
- **Case:** “I’d like to take the entire pipeline R1 out of service and retire it today while not recalibrating downstream in the engineering network”
- **Expected Result:** Accepted and sent to UI
- **Notes:** Positive

### TC-U110 — “On January 1 st, 2000 <!-- src: S3 · slide 20 · table · 15-I -->

- **ID:** 15-I
- **Case:** “On January 1 st, 2000, deactivate road R1 between measures 0 and 10 in the network and update measures downstream.”
- **Expected Result:** Accepted and sent to UI
- **Notes:** Positive

## Other content

### Slide 5 — Intent recognition test cases <!-- slide 5 -->

Verify the assistant selects Retire Route for expected phrasings and does not steal traffic from adjacent skills.

LRS Retire Route  ·  AI Assistant Test Plan
5 / 21

![Figure 8 — Intent recognition test cases](../media/7066-retire-route-pro-ai-assistant/fig-08-slide-05-intent-recognition-test-cases.svg)

### Slide 6 — Intent recognition test cases (Continued) <!-- slide 6 -->

LRS Retire Route  ·  AI Assistant Test Plan
6 / 21

![Figure 9 — Intent recognition test cases (Continued)](../media/7066-retire-route-pro-ai-assistant/fig-09-slide-06-intent-recognition-test-cases-continued.svg)

### Slide 7 — Intent recognition test cases <!-- slide 7 -->

LRS Retire Route  ·  AI Assistant Test Plan
Take out of service
Section of a route
Portion of a route
Blue: Accepted
Red: Not accepted
Retire skill is recognized; asks for network, route, measures

[figure: Retire · Discontinue · Decommission · Remove · Deactivate · Eliminate · Terminate · Delete · Abandon · End · a/the/this/(blank) · Route · Pipeline · Road · Roadway · Pipe · Highway · Route segment · Pipeline segment · Section of pipeline · Portion of pipeline · Road segment · Section of road · Portion of road · …]

![Figure 10 — Intent recognition test cases](../media/7066-retire-route-pro-ai-assistant/fig-10-slide-07-intent-recognition-test-cases.svg)

### Slide 8 — Licensing & environment test cases <!-- slide 8 -->

Every negative path must return a clear, actionable message. No silent failures, no UI hand-off.

LRS Retire Route  ·  AI Assistant Test Plan
8 / 21

![Figure 11 — Licensing & environment test cases](../media/7066-retire-route-pro-ai-assistant/fig-11-slide-08-licensing-and-environment-test-cases.svg)

### Slide 9 — Network parameter test cases <!-- slide 9 -->

LRS Retire Route  ·  AI Assistant Test Plan
9 / 21

![Figure 12 — Network parameter test cases](../media/7066-retire-route-pro-ai-assistant/fig-12-slide-09-network-parameter-test-cases.svg)

### Slide 10 — Network parameter test cases <!-- slide 10 -->

Intent Recognition Test Cases

LRS Retire Route  ·  AI Assistant Test Plan
Blue: Accepted
Red: Not accepted
<Network does not exist>

[figure: In/within · Network · <Network Name> · Line Network · Road Network · APR Network · Pipeline Network · LRS Network · 10 / 21 · Derived Network · Engineering Network]

![Figure 13 — Network parameter test cases](../media/7066-retire-route-pro-ai-assistant/fig-13-slide-10-network-parameter-test-cases.svg)

### Slide 11 — Date validation test cases <!-- slide 11 -->

LRS Retire Route  ·  AI Assistant Test Plan
11/ 21

![Figure 14 — Date validation test cases](../media/7066-retire-route-pro-ai-assistant/fig-14-slide-11-date-validation-test-cases.svg)

### Slide 12 — Date validation test cases <!-- slide 12 -->

Intent Recognition Test Cases

LRS Retire Route  ·  AI Assistant Test Plan
Blue: Accepted
Red: Not accepted
January 1st, 2000
Network Parameter Test Cases
Retire Date = 01/01/2000
<date outside temporal range of route>

[figure: In/within · Date 01/01/2000 · 01/01/2000 · 01-01-2000 · January 1st · Today · Next Friday · On/with · 12 / 21 · 7/34/25]

![Figure 15 — Date validation test cases](../media/7066-retire-route-pro-ai-assistant/fig-15-slide-12-date-validation-test-cases.svg)

### Slide 13 — Route identification test cases <!-- slide 13 -->

LRS Retire Route  ·  AI Assistant Test Plan
13 / 21

![Figure 16 — Route identification test cases](../media/7066-retire-route-pro-ai-assistant/fig-16-slide-13-route-identification-test-cases.svg)

### Slide 14 — Route identification test cases <!-- slide 14 -->

Intent Recognition Test Cases

LRS Retire Route  ·  AI Assistant Test Plan
Blue: Accepted
Red: Not accepted
Network Parameter Test Cases
Date Validation Test Cases
<route does not exist in network>
Route name/route id used interchangeably
From RouteName R1 and To RouteName R2
From Route R1 to Route R2
Between R1 and R2
Spanning routes R1 to R2

[figure: In/within · RouteName R1 · RouteName = R1 · R1 · This route · <route not given> · On/with · For/on/with · 14/ 21 · Road R1 · Pipe R1]

![Figure 17 — Route identification test cases](../media/7066-retire-route-pro-ai-assistant/fig-17-slide-14-route-identification-test-cases.svg)

### Slide 15 — From / To measure validation test cases <!-- slide 15 -->

LRS Retire Route  ·  AI Assistant Test Plan
15 / 21

![Figure 18 — From / To measure validation test cases](../media/7066-retire-route-pro-ai-assistant/fig-18-slide-15-from-to-measure-validation-test-cases.svg)

### Slide 16 — From/To measure validation test cases <!-- slide 16 -->

Intent Recognition Test Cases

LRS Retire Route  ·  AI Assistant Test Plan
Blue: Accepted
Red: Not accepted
From Measure 0 To Measure 10
From Measure zero To Measure ten
Spanning measures 0 to 10
<measure not given>
Network Parameter Test Cases
Date Validation Test Cases
<measure does not exist on route>
Route IdentificationTest Cases
Measures 0 - 10
Spanning measures 0 through 10
Beginning/end/middle of route
The start to the end
Between measures 0 and 10
From Measure = 0 and To Measure = 10
Full length of route

[figure: In/within · Measure 10 · On/with · For/on/with · With/at · 0 -10 · Entire route · 16 / 21]

![Figure 19 — From/To measure validation test cases](../media/7066-retire-route-pro-ai-assistant/fig-19-slide-16-from-to-measure-validation-test-cases.svg)

### Slide 17 — Recalibrate downstream and confirmation cases <!-- slide 17 -->

LRS Retire Route  ·  AI Assistant Test Plan
17/ 21

![Figure 20 — Recalibrate downstream and confirmation cases](../media/7066-retire-route-pro-ai-assistant/fig-20-slide-17-recalibrate-downstream-and-confirmation.svg)

### Slide 18 — Recalibrate downstream and confirmation cases <!-- slide 18 -->

Intent Recognition Test Cases

LRS Retire Route  ·  AI Assistant Test Plan
Blue: Accepted
Red: Not accepted
Network Parameter Test Cases
Date Validation Test Cases
Route IdentificationTest Cases
Update measures downstream
Measure Validation Test Cases
And do/and do not

[figure: In/within · Recalibrate downstream · Update downstream · Refresh downstream · On/with · For/on/with · With/at · Calibrate downstream · 18 / 21 · Perform recalibration]

![Figure 21 — Recalibrate downstream and confirmation cases](../media/7066-retire-route-pro-ai-assistant/fig-21-slide-18-recalibrate-downstream-and-confirmation.svg)

### Slide 19 — Route specific test cases <!-- slide 19 -->

LRS Retire Route  ·  AI Assistant Test Plan
19/ 21

![Figure 22 — Route specific test cases](../media/7066-retire-route-pro-ai-assistant/fig-22-slide-19-route-specific-test-cases.svg)

### Slide 20 — Full prompt test cases <!-- slide 20 -->

LRS Retire Route  ·  AI Assistant Test Plan
20/ 21

![Figure 23 — Full prompt test cases](../media/7066-retire-route-pro-ai-assistant/fig-23-slide-20-full-prompt-test-cases.svg)

### Slide 21 <!-- slide 21 -->

Every failure below must return a clear, actionable message and must not open the Retire Route pane.

- No LRS license
- No LRS network in map
- Non-feature-service source
- No editing privileges
- Unknown network name in prompt
- Multi-network with no selection
- Line network without To route
- Before route start
- After route end
- Ambiguous natural-language
- Empty date
- Route ID not found
- Missing multi-field ID field
- Line-network endpoints not adjacent
- From > To
- From = To
- Out of route extent
- Non-numeric input
- AI service unavailable
- Skill selection instability
- Assistant timeout / no response

LRS Retire Route  ·  AI Assistant Test Plan

[figure: Error-handling matrix · PRECONDITIONS · NETWORK · DATE · ROUTE · MEASURES · SERVICE · 21/ 21]

![Figure 24 — Every failure below must return a clear, actionable message and must not open the Retire Route pane.](../media/7066-retire-route-pro-ai-assistant/fig-24-slide-21-every-failure-below-must-return-a-clear.svg)
