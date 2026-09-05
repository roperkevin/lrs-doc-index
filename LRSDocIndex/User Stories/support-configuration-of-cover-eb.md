# Support configuration of Cover event behavior

| Field | Value |
| --- | --- |
| **Doc** | 732 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [Support Configuration of Cover Event Behavior.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20Configuration%20of%20Cover%20Event%20Behavior.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-02-23 21:45 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | cover event behavior · event behavior · realign route · extend route · event configuration · event testing · automation |
| **Tools** | Modify Event Behavior · Configure External Event · Modify LRS |

## Summary

This document describes a user story for configuring the Cover event behavior in LRS event management. It details the configuration options for Cover and Snap behaviors in Extend Route and Realign Route event behaviors, migration considerations from ArcMap to Pro, testing scenarios, automation plans, and documentation updates. The goal is to ensure full coverage of events on routes and proper behavior configuration during route extensions and realignments.

## Related documents

<!-- related:begin -->
- [Cover Event Behavior in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-eb-in-realign-route.md>) — similar text 0.43 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:725 s=6.957 -->
- [Cover Event Behavior in Realign Route with Concurrencies](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-eb-in-realign-route-with-concurrencies.md>) — similar text 0.32 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:715 s=6.636 -->
- [Cover Event Behavior in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-eb-in-extend-route.md>) — similar text 0.52 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:731 s=6.627 -->
- [Cover Event Behavior in Extend Route with Concurrencies](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-eb-in-extend-route-with-concurrencies.md>) — similar text 0.36 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:726 s=5.674 -->
- [Support Snap Event Behavior in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-eb-in-realign-route.md>) — similar text 0.30 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:730 s=5.285 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create and modify an LRS](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-and-modify-an-lrs.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/realign-routes.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/extend-a-route.html)

_No page matched:_ [Modify Event Behavior](https://www.google.com/search?q=%22Modify%20Event%20Behavior%22+site%3Adoc.esri.com) · [Configure External Event](https://www.google.com/search?q=%22Configure%20External%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support configuration of Cover event behavior <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a LRS data loader, I want to be able to configure “cover” behavior for my LRS event, so I can have an event behavior rule that guarantees full coverage on the entirety of a route.

Persona
LRS data loader: This user is responsible for initial and supplemental bulk data loading in the LRS.  When a user first adopts Roads and Highways, they typically oversee or work with a partner to migrate their data into our information model.  Once their organization is in production, this user would be responsible for bulk loading new data as needed (for example a pipeline operator is acquired).  Many DoTs have events that should be “full coverage” for each route in the network.  An example is functional class.  Typically, the functional class for each route doesn’t change over time across the entire route (i.e. if the functional class for a route is state road, it’s going to be state road across the entire route and only have one event record for the entire route).  Cover event behavior provides a way for users to have these events continue to provide full coverage on a route even when it’s extended or realigned.

## Acceptance Criteria
### Cover behavior configuration <!-- slide 3 -->
- In Modify Event Behavior and Configure External Event GP tools:
  - In the Extend Route and Realign Route event behaviors, support the option for Cover as a behavior that can be configured.
  - In Realign Route event behaviors, support the option for Snap as a behavior that can be configured.
  - Note that Realign Overlaps is not going to be a supported option any longer, which is why Snap needs supported in Realign Route.

### Cover behavior configuration <!-- slide 4 -->
- For existing ArcMap Roads and Highways users who migrate to Pro, check the behaviors for Realign Route and Realign Overlaps in Modify LRS and do the following:

|  | Stay Put | Move | Retire | Cover | Snap |
| --- | --- | --- | --- | --- | --- |
| Stay Put | Set as Stay Put for realign | Set as Stay Put for realign, provide warning | Set as Stay Put for realign, provide warning | Set as Stay Put for realign, provide warning | Set as snap for realign, provide warning |
| Move | Set as Move for realign, provide warning | Set as Move for realign | Set as Move for realign, provide warning | Set as Move for realign, provide warning | Set as snap for realign, provide warning |
| Retire | Set as Retire for realign, provide warning | Set as Retire for realign, provide warning | Set as Retire for realign | Set as Retire for realign, provide warning | Set as snap for realign, provide warning |
| Cover | Set as Cover for realign, provide warning | Set as Retire for realign, provide warning | Set as Retire for realign, provide warning | Set as Cover for realign | Set as snap for realign, provide warning |

Realign Behavior
Realign Overlaps Behavior

## Testing
<!-- slide 5 -->
- Test in the following scenarios:
  - A new event created in Pro
  - An existing event created in Pro
  - An existing event created in ArcMap that is migrated via Modify LRS
- Verify the correct behaviors are configured in the metadata
- Make sure to test all the scenarios from the table for Modify LRS
- Test on all three event types (point, line, spanning), but no need to test every scenario for each event type (mix and match)
- Shouldn’t matter whether it’s Roads and Highways or Pipeline data, but mix and match testing with each type of dataset (but no need to test each scenario for each type)

## Automation
<!-- slide 6 -->
- Create new python automated tests for Modify Event Behaviors, Configure External Event, and Modify LRS

## Documentation
<!-- slide 7 -->
- In Modify Event Behaviors, add Cover as options for Extend event behaviors and Cover and Snap as Realign event behaviors (Both RH and APR)
- In Configure External Event, add Cover as options for Extend event behaviors and Cover and Snap as Realign event behaviors (Both RH and APR)
- In Modify LRS, add usage notes that outline how the tool will check for conflicting behaviors between Realign and Realign Overlaps for datasets created in ArcMap.  Explain that users will get warnings for mismatches and how we will defer to the Realign behavior configured except for when Snap is configured for Realign Overlaps. (RH only)

## Assignment
<!-- slide 8 -->
Story Points:
Dev:
PE:
