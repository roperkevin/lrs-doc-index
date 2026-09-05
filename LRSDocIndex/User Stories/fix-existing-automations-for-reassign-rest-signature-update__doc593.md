# Fix Existing Automations for Reassign REST Signature Update

|   |   |
| --- | --- |
| **Kind** | User Story · Server |
| **Release** | — |
| **Source** | [ReassignMethodsREST_fixrestautomation.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ReassignMethodsREST_fixrestautomation.pptx>) |
| **Edited** | 2023-03-14 22:13 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Fix Existing Automations for Reassign REST Signature Update"
source_file: "ReassignMethodsREST_fixrestautomation.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ReassignMethodsREST_fixrestautomation.pptx"
doc_id: 593
doc_kind: "User Story"
surface: "Server"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Claire Wang"
last_edited: "2023-03-14T22:13:56Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["reassign", "rest endpoint", "automation", "line network", "continuous network"]
tools: []
products: []
issues: []
related: [{"doc":594,"file":"reassign-methods-in-rest-for-line-network-with-route-id-name-preservation__doc594.md","s":4.899},{"doc":607,"file":"reassign-methods-in-rest-for-line-network__doc607.md","s":4.886},{"doc":582,"file":"fix-existing-reassign-ui-automations__doc582.md","s":4.656},{"doc":586,"file":"reassign-ui-change-to-dynamically-support-existing-reassign-methods-pro__doc586.md","s":3.084},{"doc":485,"file":"lrs-in-gcs-in-memory-only-densification__doc485.md","s":1.828}]
```
-->

## Summary

This user story addresses fixing existing automations for Reassign methods due to changes in the REST signature requiring Reassign as a parameter. It covers updating automations for five existing methods in line and continuous networks to prevent failures after the REST update. No additional development effort is required.

## Related documents

<!-- related:begin -->
- [Reassign Methods in REST for Line Network with Route ID/Name Preservation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/reassign-methods-in-rest-for-line-network-with-route-id-name-preservation__doc594.md>) — similar text 0.18 · 2 title words · 3 filename words · same kind/surface/folder <!-- rel:594 -->
- [Reassign Methods in REST for Line Network](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/reassign-methods-in-rest-for-line-network__doc607.md>) — similar text 0.18 · 2 title words · 3 filename words · same kind/surface/folder <!-- rel:607 -->
- [Fix existing Reassign UI automations](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/fix-existing-reassign-ui-automations__doc582.md>) — similar text 0.31 · 4 title words · 1 filename word · same kind/folder <!-- rel:582 -->
- [Reassign UI Change to Dynamically Support Existing Reassign Methods - Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/reassign-ui-change-to-dynamically-support-existing-reassign-methods-pro__doc586.md>) — similar text 0.15 · 2 title words · 1 filename word · same kind/folder <!-- rel:586 -->
- [LRS in GCS: In-memory only Densification](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-in-gcs-in-memory-only-densification__doc485.md>) — similar text 0.07 · same kind/folder <!-- rel:485 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)
<!-- docs:end -->

---

## Slide 1 — Fix existing automations to run on new Reassign REST signature

User Story

## Slide 2 — User Story

As Reassign method becomes a required parameter in REST and other parameters are likely to be modified, automations on existing Reassign methods will fail. This user story is to cover the fixing of Reassign automations after REST signature update is done.
No additional dev effort is needed for this user story.

## Slide 3 — Automation : Fixing existing automation due to Reassign REST signature change

Line network has 3 existing methods (excluding the 2 new ones); Continuous network has 2 existing methods.
For these 5 methods, fix any automation (positive and negative cases) that is expected to break per the REST changes. Create issues when needed

## Slide 4 — Documentation

N/A

## Slide 5 — Assignment

Story Points:
Dev: N/A
PE:
