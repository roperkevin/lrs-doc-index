# Fix Existing Automations for Reassign REST Signature Update

| Field | Value |
| --- | --- |
| **Doc** | 593 · User Story · Server |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [ReassignMethodsREST_fixrestautomation.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ReassignMethodsREST_fixrestautomation.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2023-03-14 22:13 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | reassign · rest endpoint · automation · line network · continuous network |
| **Tools** | — |

## Summary

This user story addresses fixing existing automations for Reassign methods due to changes in the REST signature requiring Reassign as a parameter. It covers updating automations for five existing methods in line and continuous networks to prevent failures after the REST update. No additional development effort is required.

## Related documents

<!-- related:begin -->
- [Reassign Methods in REST for Line Network with Route ID/Name Preservation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/reassign-methods-in-rest-for-line-network-with-route-id-name-preservation__doc594.md>) — similar text 0.18 · 2 title words · 3 filename words · same kind/surface/folder <!-- rel:594 s=4.899 -->
- [Reassign Methods in REST for Line Network](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/reassign-methods-in-rest-for-line-network__doc607.md>) — similar text 0.18 · 2 title words · 3 filename words · same kind/surface/folder <!-- rel:607 s=4.886 -->
- [Fix existing Reassign UI automations](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/fix-existing-reassign-ui-automations.md>) — similar text 0.31 · 4 title words · 1 filename word · same kind/folder <!-- rel:582 s=4.656 -->
- [Reassign UI Change to Dynamically Support Existing Reassign Methods - Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/reassign-ui-change-to-dynamically-support-existing-reassign.md>) — similar text 0.15 · 2 title words · 1 filename word · same kind/folder <!-- rel:586 s=3.084 -->
- [LRS in GCS: In-memory only Densification](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/5415-lrs-in-gcs-in-memory-only-densification.md>) — similar text 0.07 · same kind/folder <!-- rel:485 s=1.828 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)
<!-- docs:end -->

---

## Story
### Fix existing automations to run on new Reassign REST signature <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As Reassign method becomes a required parameter in REST and other parameters are likely to be modified, automations on existing Reassign methods will fail. This user story is to cover the fixing of Reassign automations after REST signature update is done.
No additional dev effort is needed for this user story.

## Acceptance Criteria
### Automation : Fixing existing automation due to Reassign REST signature change <!-- slide 3 -->
- Line network has 3 existing methods (excluding the 2 new ones); Continuous network has 2 existing methods.
- For these 5 methods, fix any automation (positive and negative cases) that is expected to break per the REST changes. Create issues when needed

## Documentation
<!-- slide 4 -->
N/A

## Assignment
<!-- slide 5 -->
Story Points:
Dev: N/A
PE:
