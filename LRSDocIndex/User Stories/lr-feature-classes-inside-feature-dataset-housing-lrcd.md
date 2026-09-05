# LR Feature Classes Inside Feature Dataset Housing LRCD User Story

| Field | Value |
| --- | --- |
| **Doc** | 870 · User Story · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [LRFC_LRCD_UserStory.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/LRFC_LRCD_UserStory.pptx>) |
| **People** | author Rahul Rakshit · PE — · dev — |
| **Edited** | 2019-11-20 18:51 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | feature dataset · lr feature class · lr network · linear referencing · gp tool · editing tool · dataset version · branch versioned · traditionally versioned |
| **Tools** | Modify LRS · Create From Existing · Create LRS · Create LRS from existing dataset · Event Editor |

## Summary

This document describes a user story to enforce that all linear referencing feature classes reside within the feature dataset containing the LRCD. It outlines requirements for legacy and new users, error handling during tool execution and map operations, and testing scenarios across different dataset types and versions. Documentation and estimation notes are also included.

## Related documents

<!-- related:begin -->
- [Create LRS Intersection From Existing Feature Class Geoprocessing Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-lrs-intersection-from-existing-feature-class-gp.md>) — similar text 0.18 · 1 title word · same kind/surface/folder <!-- rel:881 s=2.617 -->
- [64-bit OID in LRS GP tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-gp.md>) — similar text 0.10 · same kind/surface/folder <!-- rel:505 s=2.59 -->
- [Configure Addressing Feature Classes GP Tool Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5572-configure-addressing-feature-classes-gp.md>) — similar text 0.12 · 2 title words · same surface <!-- rel:424 s=2.512 -->
- [Create LRS Intersection Geoprocessing Tool User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/create-lrs-intersection-gp.md>) — similar text 0.16 · same kind/surface/folder <!-- rel:882 s=2.278 -->
- [Configure Address Feature Classes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6267-configure-address-feature-classes-lr.md>) — similar text 0.06 · 2 title words · same surface <!-- rel:249 s=2.229 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a template for an LRS feature count data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-feature-count-data-product.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [View LRS Network properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-network-properties.html) · [Multiple linear referencing methods](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/multiple-linear-referencing-methods.html)

_No page matched:_ [Modify LRS](https://www.google.com/search?q=%22Modify%20LRS%22+site%3Adoc.esri.com) · [Create From Existing](https://www.google.com/search?q=%22Create%20From%20Existing%22+site%3Adoc.esri.com) · [Create LRS](https://www.google.com/search?q=%22Create%20LRS%22+site%3Adoc.esri.com) · [Create LRS from existing dataset](https://www.google.com/search?q=%22Create%20LRS%20from%20existing%20dataset%22+site%3Adoc.esri.com) · [Event Editor](https://www.google.com/search?q=%22Event%20Editor%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### LR feature classes should be part of the feature dataset that houses the LRCD <!-- slide 1 -->

### User story <!-- slide 3 -->
When using and LR GP tool or editing tool, make it mandatory to have the Networks, Events and intersections parts of the FD that has the LRCD.
Legacy Users
Upon running any LR GP tool or editing tool, check if the LR FC’s involved or impacted by those tools are inside the FD:
	If YES: Allow to run the tool.
	In NO: Do not allow to run the tool.
	             Provide a message to place all the FCs inside the FD and run the Modify LRS tool.
New Users

- All the Configuration GP tools should create the FCs inside the FD
- Allow running the “Create From Existing..” GP tools only if the FCs are inside the FD
- When running the Create LRS or Create LRS from existing dataset GP tools, check if an LRS already exists in that database:
    - If YES: Do not allow to run the tool
    - If NO: Allow to run the tool

## Acceptance Criteria
<!-- slide 2 -->
We wish that all the LR entities to reside under the feature dataset (FD) that contains the LRCD.

The next step towards that goal is to have all the LR FCs inside the feature dataset that houses the LRCD.

![Figure 1 — We wish that all the LR entities to reside under the feature dataset (FD) that contains the LRCD.](../media/lr-feature-classes-inside-feature-dataset-housing-lrcd/fig-01-slide-02-we-wish-that-all-the-lr-entities.png)

### Additionally…. <!-- slide 4 -->
- To be implemented for both DC and FS.
- Support both traditional and branch versioned datasets.
- Do not make any changes to the RH Desktop code. RH desktop does not support the LRCD. Some of the Pro code is used by ArcMap, please keep that in mind. Desktop RH should not be affected by this change.

### Enforcing the implementation <!-- slide 5 -->
If the FD does not contain all the LR FCs, then error out when:

- Publishing as a service by creating a new analyzer check.
- Using the editing tools in Pro, PY and REST including Event Editor.
- Using the GP tools in Pro, PY and REST.
- Adding LRS layers to a new map. Info message.
- Opening a map that contains LRS layers. Info message.
- The error messages will be provided by the PE

### Testing - 1 <!-- slide 6 -->
| Create a New Dataset | DC | FGDB | GP | PY |
| --- | --- | --- | --- | --- |
|  |  |  |  | UI |
|  |  |  | Route Editing | PY |
|  |  |  |  | UI |
|  |  | Traditionally Versioned | GP | UI |
|  |  |  |  | PY |
|  |  |  |  | REST |
|  |  |  | Route Editing | UI |
|  |  |  |  | PY |
|  |  |  |  | REST |
|  |  |  | Event Editing | UI |
|  |  |  |  | PY |
|  |  |  |  | REST |
|  | FS | Branch Versioned | GP | UI |
|  |  |  |  | PY |
|  |  |  |  | REST |
|  |  |  | Route Editing | UI |
|  |  |  |  | PY |
|  |  |  |  | REST |
|  |  |  | Event Editing | UI |
|  |  |  |  | PY |
|  |  |  |  | REST |

Run each tool once under these combinations

### Testing - 2 <!-- slide 7 -->
| Use a dataset created < Pro 2.6 | DC | FGDB | GP | PY |
| --- | --- | --- | --- | --- |
|  |  |  |  | UI |
|  |  |  | Route Editing | PY |
|  |  |  |  | UI |
|  |  | Traditionally Versioned | GP | UI |
|  |  |  |  | PY |
|  |  |  |  | REST |
|  |  |  | Route Editing | UI |
|  |  |  |  | PY |
|  |  |  |  | REST |
|  |  |  | Event Editing | UI |
|  |  |  |  | PY |
|  |  |  |  | REST |
|  | FS | Branch Versioned | GP | UI |
|  |  |  |  | PY |
|  |  |  |  | REST |
|  |  |  | Route Editing | UI |
|  |  |  |  | PY |
|  |  |  |  | REST |
|  |  |  | Event Editing | UI |
|  |  |  |  | PY |
|  |  |  |  | REST |

Run each tool once under these combinations

### Testing - 3 <!-- slide 8 -->
- Verify all the error conditions. Dev to provide the details on the depth and breadth of testing.
- Check the Event and Network properties
Automated tests update
Need to update all the input and expected data for all the automated tests not limited to:
  - REST
  - PY
  - Test Complete
  - Unit Tests
style.visibilitystyle.visibility

## Documentation
<!-- slide 9 -->
- Add a point in the ‘What’s New’ topic for Pro and Enterprise telling the Pre 2.6 users to move FCs, run the Modify LRS GP tool and to republish/restart (verify this) their services.
- Update the white paper: Nathan
- Data modeling topic needs to discuss how to place the LRS entities inside the feature dataset.

## Assignment
### Estimation <!-- slide 10 -->
Story Points:
Test plan PE:
Dev:
