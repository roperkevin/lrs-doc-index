# Add LRS Container to Catalog Window

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [AddLRSContainertoCatalogWindow.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AddLRSContainertoCatalogWindow.pptx>) |
| **Edited** | 2020-02-04 16:31 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Add LRS Container to Catalog Window"
source_file: "AddLRSContainertoCatalogWindow.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AddLRSContainertoCatalogWindow.pptx"
doc_id: 833
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-02-04T16:31:54Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["lrs container", "lrs hierarchy", "feature dataset", "catalog window", "context menu", "location referencing tab", "network properties", "event properties", "intersection properties"]
tools: []
products: []
issues: []
related: [{"doc":843,"file":"lrs-intersection-properties-user-story__doc843.md","s":3.77},{"doc":42,"file":"linear-referencing-ribbon-unified-experience__doc42.md","s":2.894},{"doc":190,"file":"lrs-addressing-and-utility-network-properties-user-story__doc190.md","s":2.801},{"doc":842,"file":"lrs-and-gap-calibration-properties-user-story__doc842.md","s":2.537},{"doc":569,"file":"migrate-lrs-to-new-gdb-tool__doc569.md","s":2.45}]
```
-->

## Summary

Describes a user story for adding an LRS Container to the Catalog Window in ArcGIS Pro to view the hierarchy of the LRS and associated networks and events. Details the container behavior, context menu options for LRS components, and testing and documentation requirements.

## Related documents

<!-- related:begin -->
- [LRS Intersection Properties User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-intersection-properties-user-story__doc843.md>) — similar text 0.25 · same kind/surface/folder <!-- rel:843 -->
- [Linear Referencing Ribbon – Unified Experience](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/linear-referencing-ribbon-unified-experience__doc42.md>) — similar text 0.07 · same kind/surface/folder <!-- rel:42 -->
- [LRS Addressing and Utility Network Properties User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-addressing-and-utility-network-properties-user-story__doc190.md>) — similar text 0.19 · same kind/surface/folder <!-- rel:190 -->
- [LRS and Gap Calibration Properties User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-and-gap-calibration-properties-user-story__doc842.md>) — similar text 0.20 · same kind/surface/folder <!-- rel:842 -->
- [Migrate LRS to New GDB Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/migrate-lrs-to-new-gdb-tool__doc569.md>) — similar text 0.08 · same kind/surface/folder <!-- rel:569 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View the LRS hierarchy](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-the-lrs-hierarchy.html) · [Create a template for an LRS feature count data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-feature-count-data-product.html) · [View LRS Network properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-lrs-network-properties.html) · [View LRS event properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-lrs-event-properties.html) · [View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-lrs-intersection-properties.html)
<!-- docs:end -->

---

## Slide 1 — Add LRS Container to Catalog Window

User Story

## Slide 2 — User Story

As a Location Referencing user in Pro, I need to be able to view the hierarchy of the LRS, so I can determine which types of networks exist and which events are associated with each network without having to leave ArcGIS Pro.

## Slide 3 — LRS Container/LRS Hierarchy

Create an LRS Container that appears within the Feature Dataset when an LRS and LRS Controller Dataset are present
Do not show if the Controller Dataset isn’t present
The container will show the name of the LRS and the same icon as used in ArcMap
When a user double clicks or right clicks the container, open the LRS Hierarchy window
This window should open in the same manner as the Catalog, GP, or LRS Editing panes
It should be dock able, non-modal, and remain open until a user closes it
It should open expanded, but users should be able to collapse the LRS and Networks
Use our existing icons from ArcMap as a guide, work with Graphics to get new ones created that are in the Pro style
Consult with the UI/UX team then take the design through integration with the Pro team.

![image1.png](../media/doc71_image1.png) ![image2.png](../media/doc71_image2.png)

## Slide 4 — LRS Container

When a user right clicks the LRS, Networks, Events, or Intersections, open the right click context menu.

  - For LRS, show the CP, CL, CLS, and Redline properties.  When any of them are selected, open the Feature Class/Table properties opened to the Location Referencing tab.
  - For the Network, show three options: Network properties, Add Network to Map, and Add Network and associated Events/Intersections to Map.  When properties is selected, open the Network FC properties opened to the Location Referencing tab.  When Add Network to Map is selected, add the Network FC to the map.  When Add Network and associated Events/Intersections to Map, add the Network and associated Events/Intersections to the map.
  - For the Event, show two options: Event properties, Add Event to Map.  When properties is selected, open the Event FC properties opened to the Location Referencing tab.  When Add Event to Map is selected, add the Event FC to the map.
  - For the Intersection, show two options: Intersection properties, Add Intersection to Map.  When properties is selected, open the Intersection FC properties opened to the Location Referencing tab.  When Add Intersection to Map is selected, add the Intersection FC to the map.
  - Add to the selected map.  If no map is open, add to a new map.  If a layer is already in a map, add it again.

![image3.png](../media/doc71_image3.png)

## Slide 5 — Testing

Verify the container only appears when an LRS Controller Dataset is present
Verify the correct properties for a fc/table are launched to the Loc Ref tab
Verify the correct layers are added to the map when selected
Verify the hierarchy docks in the same manner as the LRS Editing window
Verify the hierarchy doesn’t close or prevent other tools from opening/being executed

## Slide 6 — Documentation

Create a topic about being able to see the hierarchy
Mention being able to launch the properties as well as being able to add to the map
Update any screenshots in existing topics that show the catalog window with the new Catalog icon

## Slide 7 — Assignment

Story Points:
Dev:
