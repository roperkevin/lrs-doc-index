# Reassign Route Subsequent Pane AI Assistant Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#7167](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/7167) |
| **Source** | [7167_ReassignRouteSubsequentPanesAIAssistant_TestPlan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/7167_ReassignRouteSubsequentPanesAIAssistant_TestPlan.pptx>) |
| **Edited** | 2026-08-12 17:51 by Kevin Roper |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Reassign Route Subsequent Pane AI Assistant Test Plan"
source_file: "7167_ReassignRouteSubsequentPanesAIAssistant_TestPlan.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/7167_ReassignRouteSubsequentPanesAIAssistant_TestPlan.pptx"
doc_id: 11
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: "Devtopia"
author: "PptxGenJS"
last_edited_by: "Kevin Roper"
last_edited: "2026-08-12T17:51:04Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["reassign route", "ai assistant", "subsequent pane", "attribute confirmation", "non line network", "line network", "multifield route id", "negative test case"]
tools: ["Reassign Route"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#7167"]
related: [{"doc":2,"file":"iteration-planning-and-issue-tracking-for-location-referencing-3-8-12-2__doc2.md","s":1002.199},{"doc":34,"file":"reassign-route-ai-assistant-test-plan__doc34.md","s":7.536},{"doc":51,"file":"realign-route-ai-assistant-test-plan__doc51.md","s":5.837},{"doc":4,"file":"retire-route-pro-ai-assistant-test-plan__doc4.md","s":5.144},{"doc":550,"file":"reassign-route-ui-dynamic-support-of-existing-methods-test-plan__doc550.md","s":5.067}]
```
-->

## Summary

Test plan and user story for the Pro AI Assistant skill extending the Reassign Route functionality to handle subsequent UI panes. Covers input gathering, attribute confirmation, pane pre-population, method cases for non-line and line networks, multifield route IDs, confirmation and amendment behaviors, and negative test cases for invalid or missing inputs.

## Related documents

<!-- related:begin -->
- [Iteration Planning and Issue Tracking for Location Referencing 3.8/12.2](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Schedules/iteration-planning-and-issue-tracking-for-location-referencing-3-8-12-2__doc2.md>) — shared issue ArcGISPro/ps-location-referencing#7167 · similar text 0.04 · same surface <!-- rel:2 -->
- [Reassign Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/reassign-route-ai-assistant-test-plan__doc34.md>) — similar text 0.33 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:34 -->
- [Realign Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/realign-route-ai-assistant-test-plan__doc51.md>) — similar text 0.17 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:51 -->
- [Retire Route – Pro AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/retire-route-pro-ai-assistant-test-plan__doc4.md>) — similar text 0.23 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:4 -->
- [Reassign Route UI: Dynamic Support of Existing Methods Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/reassign-route-ui-dynamic-support-of-existing-methods-test-plan__doc550.md>) — similar text 0.14 · 2 title words · 2 filename words · same kind/folder <!-- rel:550 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reassign-routes.html)
<!-- docs:end -->

---

## Slide 1

Pro AI Assistant Skill
Reassign Route — Subsequent (Second) Pane AI Assistant
AI Assistant Second Pane Reassign Route

Reassign Route · Second-Pane AI Assistant

[figure: TEST PLAN · USER STORY · DEVTOPIA ID · 7167 · 01 / 25]

![image1.png](../media/doc1011_image1.png)

### Notes

Reassign Route subsequent-pane assistant. Test and automation execution plan for the Pro AI Assistant skill.

## Slide 2

OVERVIEW
What this skill does
The existing Reassign Route AI Assistant skill already gathers the first UI pane. This story extends it to walk the user through the subsequent panes: gather and confirm the extra inputs those panes need, then pre-populate them so the user steps through a fully-filled UI.

New behavior: gather and confirm subsequent-pane inputs, then hand off to a pre-populated UI.

The first pane (network, date, source, measures, method) is treated as a precondition — already gathered before these steps.

The skill always opens the UI on pane 1; later panes fill in as the user clicks Next.

First-pane recognition, licensing, and parameter collection are out of scope for this plan.

Reassign Route · Second-Pane AI Assistant
02 / 25

### Notes

The existing skill gathers the first pane; this story extends it to walk subsequent panes and pre-populate them. First-pane recognition, licensing, parameter collection are out of scope.

## Slide 3

Which panes the assistant must populate
The New Route Attributes pane appears only when the network has non-LRS attributes.

First pane satisfied (network, date, source, measures, method confirmed)

Pane 1: Input parameters

Network has non-LRS attributes?

Pane 2: New Route Attributes (confirm/change if needed)

No attribute pane — straight to populated UI

Pane 1: Input parameters

Transfer to Another Line

Pane 1: Input parameters (+ target line name & measures for Transfer)

Pane 2: Routes to Retire (informational, tool-computed)

Network has non-LRS attributes?

Pane 3: New Route Attributes (confirm/change if needed)

No attribute pane — straight to populated UI

Confirm all inputs → open populated UI on Pane 1; panes pre-populated on Next

Reassign Route · Second-Pane AI Assistant

[figure: DECISION TREE · ◆ · Network type? · Non-line · Method? (non-line) · Merge or Form · Yes · No · Line · Method? (line) · 04 / 25]

### Notes

Top-down decision tree. The New Route Attributes pane appears only when the network has non-LRS attributes. Non-line and line networks split at the top; line adds a Routes to Retire pane.

## Slide 4

Test environment & data
All editing on feature services, in a child version, in Pro maps and local scenes.

New Route Attributes pane (domains, subtypes, contingent values, rules, aliases)

Straight-to-UI, no attribute pane

Routes to Retire (pane 2) + New Route Attributes (pane 3)

Routes to Retire present, no attribute pane

Per-field prompting on Form

RH (INDOT) line/non-line, APR, Postmile (line; no events), Engineering line network for transfer.

Reassign Route · Second-Pane AI Assistant

[figure: FIXTURES · Fixture · Network type · Non-LRS attributes · Exercises · AttrNet · Non-line · Yes · PlainNet · No · LineAttrNet · Line · LineNet · MultiNet · Either · n/a · Suggested datasets: · 05 / 25]

### Notes

All editing on feature services, in a child version, in Pro maps and local scenes. Five fixtures exercise the different pane combinations.

## Slide 5

METHOD CASE · P-NLF-01
Non-line · Form a New Route
Non-line (AttrNet, PlainNet)
First pane resolves to Form a New Route with source, source measures, target route, and target measures.
Prompt → assistant prompts for attributes → confirm → approve → Next → attribute pane pre-populated

›"Split RouteX from 0 to 10 to form Route1 with target measures 0 to 10 in AttrNet on 01/01/2025."
› Provide attributes when prompted (if not wanting to accept default values): "RouteClass Arterial, Owner County, speed limit 45."
›"Yes, open the tool."
▸Action: Click Next in the populated UI.

Assistant prompts for confirmation of the new route's additional attributes (does not skip the pane), then opens the populated UI on pane 1. On Next, the New Route Attributes pane is pre-populated with the confirmed values, shown via aliases.

Attribute confirmation prompted, confirmed, pre-populated.

No attribute confirmation prompt; straight to UI; no second pane on Next.

Reassign Route · Second-Pane AI Assistant

[figure: NETWORK · PRECONDITION · FLOW · prompt sequence · EXPECTED BEHAVIOR · Network · Expected difference · AttrNet (has attrs) · PlainNet (no attrs) · 07 / 25]

### Notes

P-NLF-01. Non-line Form. Assistant prompts for attributes, confirms, opens populated UI on pane 1; New Route Attributes pane pre-populated on Next. PlainNet has no attribute pane.

## Slide 6

METHOD CASE · P-NLF-02
Non-line Form — attributes up front / incremental changes
Non-line with non-LRS attributes (AttrNet)
Attributes provided through the prompt(s), not after a prompt from the assistant.

Assistant confirms the supplied attributes. In the incremental changes variant, it confirms the changes after the changes are made

up front · single turn

›"Split RouteX from 0 to 10 to form Route1 with target measures 0 to 10 in AttrNet on 01/01/2025. RouteClass Highway, Owner State, speed limit 65."

(1)"Split RouteX from 0 to 10 to form Route1 with target measures 0 to 10 in AttrNet on 01/01/2025."
(2)“Change RouteClass to Arterial."
(3)“Change Owner to County, speed limit to 45."

Reassign Route · Second-Pane AI Assistant

[figure: NETWORK · PRECONDITION · EXPECTED BEHAVIOR · incremental · multi-turn · 08 / 25]

### Notes

P-NLF-02. Attributes supplied through the prompts, not after an assistant prompt. Assistant confirms supplied attributes rather than re-asking; incremental variant retains the running set.

## Slide 7

METHOD CASE · P-NLM-01
Non-line · Merge to Adjacent Route
Non-line (AttrNet, PlainNet)
First pane resolves to Merge with source, source measures, existing target route, target measures, and the recalibrate-target toggle.
Prompt → assistant prompts for attribute changes → confirm → approve → Next → attribute pane pre-populated

›"Merge RouteX from 0 to 20 into RouteY with target measures 0 to 30 in AttrNet on 01/01/2025. Recalibrate target downstream."
›Change attributes when prompted: "RouteClass Arterial, Owner County, speed limit 45."
▸Action: Click Next in the UI.

Assistant prompts for the merged route's additional attributes, confirms them, then opens the populated UI. On Next, the New Route Attributes pane is pre-populated (aliases shown).

Attribute changes prompted, confirmed, pre-populated.

No attribute prompt; straight to UI; no second pane.

Reassign Route · Second-Pane AI Assistant

[figure: NETWORK · PRECONDITION · FLOW · prompt sequence · › "Yes." · EXPECTED BEHAVIOR · Network · Expected difference · AttrNet (has attrs) · PlainNet (no attrs) · 09 / 25]

### Notes

P-NLM-01. Non-line Merge. Assistant prompts for merged route's attributes, confirms, opens populated UI; New Route Attributes pre-populated on Next. PlainNet has no attribute pane.

## Slide 8

METHOD CASE · P-NLM-02
Non-line Merge — attributes up front
Non-line with non-LRS attributes (AttrNet)
Merge resolved in the first pane; attributes included in the opening prompt.

›"Merge RouteX from 0 to 20 into RouteY with target measures 0 to 30 in AttrNet on 01/01/2025. Recalibrate target downstream. RouteClass Arterial, Owner County, speed limit 45."

Assistant confirms the attributes with no redundant prompt.

Reassign Route · Second-Pane AI Assistant

[figure: NETWORK · PRECONDITION · prompt sequence · EXPECTED BEHAVIOR · 10 / 25]

### Notes

P-NLM-02. Merge resolved in first pane, attributes in the opening prompt. Assistant confirms the attributes with no redundant prompt.

## Slide 9

METHOD CASE · P-LF-01
Line · Form a New Route
Line (LineAttrNet, LineNet)
First pane resolves to Form with Source From route, Source To route, source measures, target route, and target measures.
Prompt → attributes (pane 3) → approve → Next to Routes to Retire → Next to attribute pane

›"Split RouteX from 0 to 10 to form Route1 with target measures 0 to 10 in LineAttrNet on 01/01/2025."
›Change attributes when prompted: "RouteClass Arterial, Owner County, speed limit 45."
▸Action: Click Next to Pane 2 (Routes to Retire), then Next to Pane 3.

Assistant prompts for the new route's attribute changes (Pane 3) and confirms; it does NOT ask the user to fill Routes to Retire (informational). Pane 2 shows routes to be retired with a FORM note (source-line routes form a single target route); Pane 3 is pre-populated.

Pane 3 prompted changes, confirmed, pre-populated; Routes to Retire shown.

No attribute prompt; Routes to Retire reached; no third pane.

Reassign Route · Second-Pane AI Assistant

[figure: NETWORK · PRECONDITION · FLOW · prompt sequence · › "Yes." · EXPECTED BEHAVIOR · Network · Expected difference · LineAttrNet (has attrs) · LineNet (no attrs) · 11 / 25]

### Notes

P-LF-01. Line Form. Assistant prompts for attributes (pane 3) and confirms; does not ask user to fill Routes to Retire (informational). Pane 2 shows FORM note; pane 3 pre-populated.

## Slide 10

METHOD CASE · P-LF-02
Line Form — attributes up front
Line with non-LRS attributes (LineAttrNet)
Form resolved in the first pane; attributes provided up front.

›"Split RouteX from 0 to 10 to form Route1 with target measures 0 to 10 in LineAttrNet on 01/01/2025. RouteClass Arterial, Owner County, speed limit 45."

Assistant confirms the attributes with no re-ask.

Reassign Route · Second-Pane AI Assistant

[figure: NETWORK · PRECONDITION · prompt sequence · EXPECTED BEHAVIOR · 12 / 25]

### Notes

P-LF-02. Form resolved in first pane; attributes provided up front. Assistant confirms with no re-ask.

## Slide 11

METHOD CASE · P-LM-01
Line · Merge to Adjacent Route
Line (LineAttrNet, LineNet)
Merge resolves with source from/to routes, source measures, target route, target measures, and recalibrate target.
Prompt → attributes (pane 3) → approve → Next to Routes to Retire → Next to attribute pane

›"Merge RouteX from 0 to 20 into RouteY with target measures 0 to 30 in LineAttrNet on 01/01/2025. Recalibrate target downstream."
›Change attributes when prompted: "RouteClass Arterial, Owner County, speed limit 45."
▸Action: Click Next to Pane 2 (Routes to Retire), then Next to Pane 3.

Assistant prompts for the merged route's attribute changes (Pane 3) and confirms. Pane 2 shows the correct routes with a MERGE note (source-line routes merged into the target route); Pane 3 is pre-populated.

Pane 3 prompted for attribute changes, confirmed, pre-populated; Routes to Retire shown.

No attribute prompt; Routes to Retire reached; no third pane.

Reassign Route · Second-Pane AI Assistant

[figure: NETWORK · PRECONDITION · FLOW · prompt sequence · › "Approve." · EXPECTED BEHAVIOR · Network · Expected difference · LineAttrNet (has attrs) · LineNet (no attrs) · 13 / 25]

### Notes

P-LM-01. Line Merge. Assistant prompts for merged route attributes (pane 3) and confirms. Pane 2 shows MERGE note; pane 3 pre-populated.

## Slide 12

METHOD CASE · P-LM-02
Line Merge — attributes up front
Line with non-LRS attributes (LineAttrNet)
Merge resolved in the first pane; attributes up front.

›"Merge RouteX from 0 to 20 into RouteY with target measures 0 to 30 in LineAttrNet on 01/01/2025. Recalibrate target downstream. RouteClass Arterial, Owner County, speed limit 45."

Assistant confirms the attributes.

Reassign Route · Second-Pane AI Assistant

[figure: NETWORK · PRECONDITION · prompt sequence · EXPECTED BEHAVIOR · 14 / 25]

### Notes

P-LM-02. Merge resolved in first pane; attributes up front. Assistant confirms the attributes.

## Slide 13

METHOD CASE · P-LT-01
Line · Transfer to Another Line

Most-expanded method — collects target route name, from, to, AND attributes.
Line (LineAttrNet, LineNet)
First pane resolves to Transfer with source route, source measures, and target line name. No target route name, target measures, or attributes given in initial prompt.

›"Reassign RouteZ from 50 to 60 to Line1 in LineAttrNet on 01/01/2025."
›Change items when prompted: name ("Call it RouteZ-A."), measures ("From 0 to 10."), attributes ("Arterial, County, 45.")
▸Action: Click Next through the populated UI.

Assistant prompts for each missing item in turn — target route name, from measure, to measure, then attributes — confirming each. After approval it opens the populated first pane; Routes to Retire and the New Route Attributes pane (plus name/measures) are pre-populated.

Attributes changed; attribute pane pre-populated.

Collects/confirms name + measures; no attribute prompt; no pane.

Reassign Route · Second-Pane AI Assistant

[figure: NETWORK · PRECONDITION · prompt sequence · › "Yes." · EXPECTED BEHAVIOR · Network · Expected difference · LineAttrNet (has attrs) · LineNet (no attrs) · 15 / 25]

### Notes

P-LT-01. Transfer to Another Line — the most expanded method. Assistant prompts for each missing item in turn: target route name, from, to, then attributes. After approval, panes pre-populated.

## Slide 14

METHOD CASE · P-LT-01
Line · Transfer to Another Line

Line (LineAttrNet, LineNet)
First pane resolves to Transfer with source routes, source measures, and target line name. Source routes include multiple routes on same line.

›"Reassign RouteX through RouteZ from 0 to 60 to NewLine1 in LineAttrNet on 01/01/2025.
RouteX will be renamed to RouteXA from 0 to 10 with attributes Owner: State, Jurisdiction: Local, Editor: John. RouteY will be renamed to RouteYA from 15 to 20 with attributes Owner: State, Jurisdiction: State, Editor: James. RouteZ will be renamed to RouteZA from 25 to 35 with attributes Owner: Local, Jurisdiction: Federal, Editor: John.
▸Action: Click Next through the populated UI.

Assistant opens the populated first pane; Routes to Retire and the New Route Attributes pane (plus name/measures) are pre-populated.

Attributes changed; attribute pane pre-populated.

Collects/confirms name + measures; no attribute prompt; no pane.

Reassign Route · Second-Pane AI Assistant

[figure: NETWORK · PRECONDITION · prompt sequence · EXPECTED BEHAVIOR · Network · Expected difference · LineAttrNet (has attrs) · LineNet (no attrs) · 15 / 25]

### Notes

P-LT-01. Transfer to Another Line — the most expanded method. Assistant prompts for each missing item in turn: target route name, from, to, then attributes. After approval, panes pre-populated.

## Slide 15

METHOD CASE · P-LT-01
Line · Transfer to Another Line

Line (LineAttrNet, LineNet)
First pane resolves to Transfer with source routes, source measures, and target line name. Source routes include multiple routes on same line in a Postmile LRS Network.

›"Reassign INY46.DLL through INY47.DLL from 0 to 60 to NewLine1 in LineAttrNet on 01/01/2025. Route INY46.DLL new RouteID will be County: Inyo, RouteNum: 46, RouteSuffix: S, PMPrefix: No Prefix, PMSuffix: No Suffix, and Alignment: Left with attributes Field1: Value1, Field2: Value2. Route INY47.DLL will be County: Inyo, RouteNum: 47, RouteSuffix: S, PMPrefix: No, PMSuffix: No Suffix, and Alignment: Left with attributes Field1: ValueA, Field2, ValueB.
▸Action: Click Next through the populated UI.

Assistant opens the populated first pane; Routes to Retire and the New Route Attributes pane (plus name/measures) are pre-populated.

Attributes changed; attribute pane pre-populated.

Collects/confirms name + measures; no attribute prompt; no pane.

Reassign Route · Second-Pane AI Assistant

[figure: NETWORK · PRECONDITION · prompt sequence · EXPECTED BEHAVIOR · Network · Expected difference · Postmile (has attrs) · Postmile (no attrs) · 15 / 25]

### Notes

P-LT-01. Transfer to Another Line — the most expanded method. Assistant prompts for each missing item in turn: target route name, from, to, then attributes. After approval, panes pre-populated.

## Slide 16

METHOD CASE · P-LT-02
Transfer — input channels
Network: Line with non-LRS attributes (LineAttrNet). Remaining inputs supplied through the prompt(s).

›"Reassign RouteZ from 50 to 60 to Line1 in LineAttrNet on 01/01/2025. Name it RouteZ-A spanning 0 to 10. RouteClass Arterial, Owner County, speed 45."

name + measures up front, attributes omitted

›"Reassign RouteZ from 50 to 60 to Line1 in LineAttrNet on 01/01/2025. Name it RouteZ-A from 0 to 10."

incremental · one item per turn

"From 0 to 10."

All-up-front: confirms everything in one step, no re-ask. Partial: confirms name + measures, prompts for attributes. Incremental: confirms the running set after each turn, prompts only for what's missing; nothing lost.

Reassign Route · Second-Pane AI Assistant

[figure: all up front · (1) · "…on 01/01/2025." · (2) · "Call it RouteZ-A." · (3) · (4) · "Arterial, County, 45." · EXPECTED BEHAVIOR · 16 / 25]

### Notes

P-LT-02. Three input channels: all up front, name+measures up front with attributes omitted, and incremental. Assistant confirms running set, prompts only for what's missing, loses nothing.

## Slide 17

METHOD CASE · P-MF-01
Multifield Route ID · Form
Multifield route ID network (MultiNet)
Form selected; user gives a composite target route value ("Route1").

›"Split RouteX from 0 to 10 to form Route1 with target measures 0 to 10 in MultiNet on 01/01/2025."

Assistant recognizes the multifield route ID and prompts for each field (RoutePrefix, RouteNumber, RouteSuffix ); the composite is NOT silently accepted for Form.

Reassign Route · Second-Pane AI Assistant

[figure: NETWORK · PRECONDITION · prompt sequence · EXPECTED BEHAVIOR · 17 / 25]

### Notes

P-MF-01. Multifield route ID. User gives a composite target value; assistant recognizes the multifield ID and prompts for each field. Composite is not silently accepted for Form.

## Slide 18

METHOD CASE · P-MF-02
Multifield Form — fields up front
Multifield route ID network (MultiNet)
User supplies each field value up front.

›"Split RouteX from 0 to 10 to form a new route in MultiNet on 01/01/2025 with RoutePrefix US, RouteNumber 50, RouteSuffix N, target measures 0 to 10."

Assistant confirms the per-field values; the populated UI reflects the per-field values on Next.

Reassign Route · Second-Pane AI Assistant

[figure: NETWORK · PRECONDITION · prompt sequence · EXPECTED BEHAVIOR · 18 / 25]

### Notes

P-MF-02. User supplies each field value up front. Assistant confirms the per-field values; the populated UI reflects them on Next.

## Slide 19

Confirmation, amendment & method-change behavior

"Actually make the speed limit 35." (after a confirmation summary, not yet approved)
Accepts the change, re-confirms SpeedLimit = 35, re-displays summary. Populated pane must show 35.

"Wait, do a transfer to Line1 instead." (after Form attributes gathered)
Re-derives the Transfer steps, discards the Form target, prompts for name + measures then attributes.

"Open the tool." (with required inputs still missing)
Does NOT transition with gaps; keeps prompting until inputs are confirmed/approved.

"Yes, open it." then navigate Back/Next
UI opens on pane 1 (never deep-links to pane 2/3); panes fill on Next; inputs maintained across pane switches.

Reassign Route · Second-Pane AI Assistant

[figure: BEHAVIOR CASES · P-CONF-01 · P-CONF-02 · P-CONF-03 · P-CONF-04 · 19 / 25]

### Notes

P-CONF cases: mid-confirmation amendment, method change, premature open with gaps, and pane navigation. Assistant accepts changes, re-derives steps, never transitions with gaps, opens on pane 1.

## NEGATIVE CASES · 1 OF 2 <!-- slide 20 -->

### New Line Name > 255 Characters

Invalid or missing inputs

Assistant must inform the user and prompt for a correction — not transition with bad data.

Transfer: From measure > To measure

States From must be < To; asks for a valid range; does not transition.

Transfer: target measures out of range

Informs user; asks for valid measures or a different target.

States the 255-char limit; asks for a shorter name.

Form target name = existing route

States a Form target must be new; asks for a new name or to switch to Merge.

Merge target not adjacent / missing

States Merge needs an existing adjacent route; asks to confirm or switch to Form.

Reassign Route · Second-Pane AI Assistant

[figure: ID · Pri · Scenario · Expected · N-01 · High · N-02 · Med · N-03 · N-04 · N-05 · 20 / 25]

### Notes

Negative cases part 1. Assistant must inform the user and prompt for a correction — not transition with bad data. Measures order, ranges, name length, Form vs Merge target rules.

## Slide 21

NEGATIVE CASES · 2 OF 2
Invalid or missing inputs

Attribute violates domain / contingent value / rule

States the value is invalid for that field; prompts for a valid value; never confirms invalid as final.

Composite value where per-field required (MultiNet)

States the network uses a multifield route ID; prompts per field.

User skips required Transfer inputs

Keeps prompting for the missing input; does not transition until provided.

Inputs would produce a non-monotonic edit

Contract case: likely transitions and lets the tool error on Run, unless it pre-checks. Record actual behavior; confirm intended contract with the team.

Reassign Route · Second-Pane AI Assistant

[figure: ID · Pri · Scenario · Expected · N-06 · High · N-07 · Med · N-08 · N-09 · Low · 21 / 25]

### Notes

Negative cases part 2. Domain/contingent/rule violations, composite vs per-field, skipped Transfer inputs, and the non-monotonic contract case N-09 needing team confirmation.
