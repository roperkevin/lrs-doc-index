# Delete Attribute Sets User Story

| Field | Value |
| --- | --- |
| **Doc** | 676 · User Story · Enterprise |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [DeleteAttributeSets.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/DeleteAttributeSets.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2022-03-14 17:57 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | attribute sets · delete attribute sets · lrs administrator · controller dataset · manage attributes |
| **Tools** | — |

## Summary

This user story describes the need for a tool to delete attribute sets in the Linear Referencing System (LRS) to help administrators manage the number of attribute sets. It specifies UI changes to show attribute sets not associated with the current map service and allow deletion of these sets without impacting current users. Testing involves various attribute sets from different sources, and no automation is planned. Documentation will be updated to reflect these changes.

## Related documents

<!-- related:begin -->
- [Managing Attribute Sets User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/managing-attribute-sets.md>) — similar text 0.15 · 2 title words · 2 filename words · same kind/folder <!-- rel:689 s=4.423 -->
- [Import Existing Attribute Sets from Event Editor](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/import-existing-attribute-sets-from-event-editor.md>) — similar text 0.26 · 2 title words · 2 filename words · same kind/folder <!-- rel:680 s=4.39 -->
- [Migrate Attribute Sets to Map CIM/Service – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5102-migrate-attribute-sets-to-map-cim-service.md>) — similar text 0.20 · 2 title words · 2 filename words <!-- rel:562 s=2.588 -->
- [Producing Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/producing-attribute-sets-apr.md>) — similar text 0.16 · 2 title words · same surface <!-- rel:552 s=2.375 -->
- [Configure Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configure-attribute-sets-rh.md>) — similar text 0.22 · 2 title words <!-- rel:555 s=2.073 -->
<!-- related:end -->

---

## Story
<!-- slide 1 -->
User Story
Click to add text

### User Story <!-- slide 2 -->
As a LRS Administrator, I want to be able to delete attribute sets, so I can keep the list of attribute sets available to editors at a manageable size.
Persona

- LRS Administrator: This user is responsible for administration of the LRS.  Typically, they have administrator rights to make changes to the LRS such as event behaviors.  This user also does other tasks such as service publishing and other maintenance of the LRS gdb.  With attribute sets now being stored centrally within the LRS, there is the possibility of the number of attribute sets growing to a large number over time.  Creating a tool to delete attribute sets would allow this user to keep the number of attribute sets to a manageable number for their organization.

## Acceptance Criteria
### Delete Attribute Sets <!-- slide 3 -->
- In the manage attributes section of the existing Attribute Sets UI, show a third section called “Other Attribute Sets”
- Show all the other attribute sets that are part of the LRS, but not associated with the service in the map
- If a user selects any of these attribute sets, only allow them to Delete them
- Support being able to shift click or ctrl click to select multiple
- For any attribute sets that are deleted, remove them from the controller dataset and don’t show them in the list of available attribute sets any longer
- Note: As discussed during the first estimation, deleting the attribute sets shouldn’t impact any users that are currently using them.  They should see them disappear during the next refresh (map, attribute set UI, etc.)

![Figure 1 — Delete Attribute Sets](../media/delete-attribute-sets/fig-01-slide-03-delete-attribute-sets.png)

## Testing
<!-- slide 4 -->
- Test with a variety of attribute sets that have been created in Pro, EE, and imported from the old rhas format
- Test a combination of deleting attribute sets in the current service in the map as well as those in other services not in the map

## Automation
<!-- slide 5 -->
No automation

## Documentation
<!-- slide 6 -->
Add some additional context to the topic related to modifying attribute sets that this section will show the attribute sets not in the current service/map and that a user can delete them along with those attribute sets that are part of the current map/service

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
