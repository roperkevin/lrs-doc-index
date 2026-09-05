# Producing Attribute Sets

|   |   |
| --- | --- |
| **Kind** | Other · Enterprise |
| **Release** | — |
| **Product** | Pipeline Referencing |
| **Source** | [APR_EEattset_produce.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5102_AttributeSetsInCIM/APR_EEattset_produce.docx>) |
| **Edited** | 2023-06-07 17:51 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Producing Attribute Sets"
source_file: "APR_EEattset_produce.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5102_AttributeSetsInCIM/APR_EEattset_produce.docx"
doc_id: 552
doc_kind: "Other"
surface: "Enterprise"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: "Claire Wang"
last_edited: "2023-06-07T17:51:00Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["attribute set", "event layer", "add linear events", "event editor", "enterprise geodatabase", "config.json", "rhas file"]
tools: ["Add Linear Events"]
products: ["Pipeline Referencing"]
issues: []
related: [{"doc":551,"file":"producing-attribute-sets__doc551.md","s":7.53},{"doc":554,"file":"configuring-attribute-sets__doc554.md","s":5.228},{"doc":553,"file":"configuring-attribute-sets__doc553.md","s":4.674},{"doc":556,"file":"configure-attribute-sets__doc556.md","s":4.159},{"doc":555,"file":"configure-attribute-sets__doc555.md","s":3.671}]
```
-->

## Summary

This document explains the creation, modification, export, and management of attribute sets used in the ArcGIS Event Editor for designating event layer attributes in the Add Linear Events widget. It covers the use of preconfigured attribute sets in enterprise geodatabases, local browser-stored sets, and configuration changes via the config.json file. The document also details the export process of attribute sets to .rhas files and their deployment for shared access.

## Related documents

<!-- related:begin -->
- [Producing Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/producing-attribute-sets__doc551.md>) — similar text 0.87 · 3 title words · 2 filename words · same kind/folder <!-- rel:551 -->
- [Configuring Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configuring-attribute-sets__doc554.md>) — similar text 0.61 · 2 title words · 2 filename words · same kind/folder <!-- rel:554 -->
- [Configuring Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configuring-attribute-sets__doc553.md>) — similar text 0.59 · 2 title words · 1 filename word · same kind/folder <!-- rel:553 -->
- [Configure Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/configure-attribute-sets__doc556.md>) — similar text 0.36 · 2 title words · 1 filename word · same kind/folder <!-- rel:556 -->
- [Configure Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configure-attribute-sets__doc555.md>) — similar text 0.36 · 2 title words · same kind/folder <!-- rel:555 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Add Linear Events](https://www.google.com/search?q=%22Add%20Linear%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Producing attribute sets
Attribute sets provide the functionality to designate selected attributes for inputs. They are used to designate the event layers and columns in the layers for which values are provided in the Add Linear Events widget. In enterprise geodatabase, the administrator can create preconfigured attribute sets that can be accessed by any person using the ArcGIS Event Editor. These preconfigured attribute sets are published to service along with other data in the map, and they cannot be modified by other people in Event Editor. A person can create attribute sets that are stored in the web browser for local access or import attribute sets created by other persons.
Learn more about configuring attribute sets and adding linear events by route and measure.

The attribute sets are useful in limiting the number of record input fields while using the Add Linear Events widget. Editors can enter records only in the fields provided by the attribute sets.

| Button | Name | Description |
| --- | --- | --- |
|  | Expand All | Shows all the attribute fields present in each event layer. |
|  | Collapse All | Hides the attribute fields to show only the event layers. |
|  | Copy Selected Attribute Set | Copies all the attribute fields present in an event from the left panel to the attribute group in the right panel. The copy is made permanent only when you click the Save button. |
|  | New Attribute Set | Creates an attribute set. The attribute sets created by using this button are saved in the browser. Therefore, these attribute sets are available only to the user's browser. |
|  | Remove Selected Attribute Set | Removes the selected attribute set from the widget. The administrator-configured attribute sets cannot be removed using this button. |
|  | New Group | Creates a group in the right panel. A group contains event attribute fields. An attribute set is made up of one or more groups. The group is saved permanently by clicking the Save button. |
|  | Remove Selected Group, Layer, or Attribute | Removes a selected group, layer, or attribute from the right panel. The removal is made permanent by clicking the Save button. |
|  | Default Settings | Allows configuration of default settings for attribute sets. These settings include the default network, from method, from measure units, to method, and to measure units for the Add Linear Events widget. |

- Note:
- You cannot modify or remove a preconfigured attribute set that is read from service or from the default Attribute Set folder in Event Editor. You can modify or remove an attribute set that is stored in the web browser for local access or imported from an .rhas file.

### Modifying the attributeSets folder
By default, the Event Editor is configured to use the attributeSets folder. You can modify the configuration to use a different folder for your attribute sets by editing the config.json file of Event Editor.

- In the Event Editor folder, rename the attributeSets folder or create a folder in which attribute sets will be stored.
- Open the config.json file in a text editor such as Notepad.
- Learn more about using the config.json file to configure the ArcGIS Event Editor web app
- In the config.json file, browse to the attributeSets section.
- Browse to the subsection titled folder.
- Here, you can modify the default attributeSets folder by changing the folder name.
- Replace the default attributeSets with the name of the folder where you will store your .rhas files.

### Exporting a set
You can export an attribute set using the following steps:

- In the Event Editor, click the Edit tab.
- Click the Modify Attribute Sets button .
- The Attribute Sets dialog box appears.
- Create an attribute set.
- Note:
- Alternatively, you can import and modify existing attribute sets shared with you by another person.
- Click Export.
- The Export Attribute Sets dialog box appears.
- Select the attribute sets you want to export.
- To select all attribute sets, click Select All.
- To clear selected attribute sets, click Clear Selection.
- When you are ready to export, click OK.
- Your attribute sets will be exported to an attribute set (.rhas) file.
- Note:
- If you have multiple Event Editor configured in one deployment, you may need to provide a separate attribute sets folder for each configuration. If not, the same attribute sets will be visible across all configurations.
- Browse to the location of the Event Editor folder and open the attributeSets subfolder. Alternatively, if you specified a different attributeSets folder using the config.json file, open that folder.
- Note:
- The attributeSets folder is created upon installation of ArcGIS Pipeline Referencing
- Add the .rhas file you exported in step 6 to the attributeSets folder.
- Your attribute sets can now be accessed by any person using the Event Editor.
- In a web browser, browse to the Event Editor web app.
- Click the Edit tab, and click the Add Line Events button .
The preconfigured attribute set can be used to record attributes in this widget.

- https://enterprise.arcgis.com/en/ \h Home
- Portal
- Server
- Data Stores
- Cloud
- Apps
- Documentation

###### ArcGIS

- ArcGIS Online
- ArcGIS Pro
- ArcGIS Enterprise
- ArcGIS
- ArcGIS Developer
- ArcGIS Solutions
- ArcGIS Marketplace

###### About Esri

- About Us
- Careers
- Esri Blog
- User Conference
- Developer Summit

Copyright © 2023 Esri. All rights reserved. | Privacy | Manage Cookies | Legal

![image1.png](../media/doc388_image1.png) ![image2.png](../media/doc388_image2.png) ![image3.png](../media/doc388_image3.png) ![image4.png](../media/doc388_image4.png) ![image5.png](../media/doc388_image5.png) ![image6.png](../media/doc388_image6.png) ![image7.png](../media/doc388_image7.png) ![image8.png](../media/doc388_image8.png) ![image9.png](../media/doc388_image9.png) ![image10.png](../media/doc388_image10.png) ![image11.png](../media/doc388_image11.png) ![image12.png](../media/doc388_image12.png)
