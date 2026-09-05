# Cartographic Realignment Options with Snap To Vertex

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [Snaptovertex_Cartographicrealignment_RH.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5668_CartoRealignOptions/Snaptovertex_Cartographicrealignment_RH.docx>) |
| **Edited** | 2024-03-19 20:23 by Ignacia Galvan |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Cartographic Realignment Options with Snap To Vertex"
source_file: "Snaptovertex_Cartographicrealignment_RH.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5668_CartoRealignOptions/Snaptovertex_Cartographicrealignment_RH.docx"
doc_id: 401
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Lakshmi Ananthanarayanan"
last_edited_by: "Ignacia Galvan"
last_edited: "2024-03-19T20:23:00Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["cartographic realignment", "snap to vertex", "calibration points", "centerline", "generate routes", "update route measures"]
tools: ["Generate Routes", "Modify Network Calibration Rules"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":402,"file":"cartographic-realignment-options-in-location-referencing__doc402.md","s":7.392},{"doc":611,"file":"support-snap-to-vertex-option-for-calibration-points-impacted-by-cartographic__doc611.md","s":3.637},{"doc":729,"file":"support-snap-delete-and-ignore-options-for-calibration-points-in-cartographic__doc729.md","s":3.448},{"doc":383,"file":"event-behavior-for-cartographic-realignment__doc383.md","s":2.988},{"doc":382,"file":"event-behavior-for-cartographic-realignment__doc382.md","s":2.858}]
```
-->

## Summary

This document describes the cartographic realignment options available on the Location Referencing tab, including a new option called Snap To Vertex. It explains how calibration points behave under different realignment options and the conditions required for Snap To Vertex to function correctly. The document also clarifies the interaction with the update route measures setting during cartographic realignment.

## Related documents

<!-- related:begin -->
- [Cartographic Realignment Options in Location Referencing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/cartographic-realignment-options-in-location-referencing__doc402.md>) — similar text 0.72 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:402 -->
- [Support Snap to Vertex Option for Calibration Points Impacted by Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-to-vertex-option-for-calibration-points-impacted-by-cartographic__doc611.md>) — similar text 0.33 · 4 title words · same surface <!-- rel:611 -->
- [Support Snap, Delete, and Ignore Options for Calibration Points in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-delete-and-ignore-options-for-calibration-points-in-cartographic__doc729.md>) — similar text 0.30 · 4 title words · same surface <!-- rel:729 -->
- [Event behavior for cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/event-behavior-for-cartographic-realignment__doc383.md>) — similar text 0.22 · 2 title words · same kind/surface <!-- rel:383 -->
- [Event behavior for cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/event-behavior-for-cartographic-realignment__doc382.md>) — similar text 0.23 · 2 title words · same kind/surface <!-- rel:382 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-cartographic-realignment.html) · [Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html)

_No page matched:_ [Generate Routes](https://www.google.com/search?q=%22Generate%20Routes%22+site%3Adoc.esri.com) · [Modify Network Calibration Rules](https://www.google.com/search?q=%22Modify%20Network%20Calibration%20Rules%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

In
https://prodev.arcgis.com/en/pro-app/latest/help/production/roads-highways/set-cartographic-realignment-options.htm
Under the cartographic realignment options add the following as an option

Option:
Snap Tto vVertex (icon from pro)
Description:
Use this option to keep any calibration points on the cartographically realigned area snapped to the vertex of the centerline. By doing this,Setting Snap To Vertex  it will ensures that the calibration point, both before and after cartographic realignment, stays on the same vertex of the centerline.
Note:
Snap Tto vVertex option is only available only in feature services.
For this option to work as expected, the centerlines should have their vertex IDs enabled. Already eExisting centerlines associated with a network may not have their vertex IDs enabled.  To solve this, run the gGenerate rRoutes geoprocessing tool on the network.
This option will work only if the update route measures in cartographic realignment option is set as to No.
generate routes Geoprocessing tool – Provide link to generate routes GP tool.
update route measures in cartographic realignment – Provide link to update route measures in cartographic realignment.

Replace the current section under cartographic realignment as below.
Cartographic realignment options scenarios
The following scenario demonstrates the differing outcomes of a cartographic realignment for each of the four cartographic realignment options on the Location Referencing tab in the Carto-realignment group. The four options are the following:

- Proportional Snap
- Delete
- Ignore
- Snap Tto Vertex

Note:
If Update route measures in cartographic realignment is enabled for the LRS Network using the Modify Network Calibration Rules tool, the route length may change, in which case the measures are updated during cartographic realignment. If Update route measures in cartographic realignment is unavailabledisabled, the measures are not updated during cartographic realignment even if the route length changes.

For most examples in this section, The cartographic realignment options are demonstrated based on Update route measures in cartographic realignment is enabled for the LRS Network.; for the Snap To Vertex option, it is disabled.
Route1 has two intermediate calibration points at measure 10 and measure 20 that fall within the cartographic realignment section. Only calibration points in the edited section are updated using the configured option after cartographic realignment. The underlying centerline for Route1 is going to be modified as shown in the following image.

Proportional Snap option
                       If Proportionally Snap  is the configured cartographic realignment option before the route edit, the intermediate calibration points snap proportionally to the new location of their respective measures when the route edit occurs.

Ignore option
If Ignore  is the configured cartographic realignment option before the route edit, the intermediate calibration points do not move when the route edit occurs.

Delete option
If Delete  is the configured cartographic realignment option before the route edit, the intermediate calibration points are deleted when the route edit occurs.

Snap Tto Vertex option
            This is applicable only when the Uupdate route measures in cartographic realignment option is disabled (set to No)configured as ‘No’, meaning the measures are not updated during cartographic realignment even if the route length changes.
If Snap Tto vVertex (Icon) is the configured cartographic realignment option before the route edit, the intermediate calibration points snap to the vertex of the centerline when the route edit occurs.

![image1.png](../media/doc561_image1.png) ![image2.png](../media/doc561_image2.png) ![image3.png](../media/doc561_image3.png) ![image4.png](../media/doc561_image4.png) ![image5.png](../media/doc561_image5.png) ![image6.png](../media/doc561_image6.png) ![image7.png](../media/doc561_image7.png) ![image8.png](../media/doc561_image8.png) ![image9.png](../media/doc561_image9.png)
