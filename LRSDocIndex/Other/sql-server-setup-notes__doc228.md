# SQL Server Setup Notes

|   |   |
| --- | --- |
| **Kind** | Other · Other |
| **Release** | — |
| **Source** | [SQL Server Setup Notes.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SQL%20Server%20Setup%20Notes.docx>) |
| **Edited** | 2025-02-21 17:23 by Sharon Lai |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "SQL Server Setup Notes"
source_file: "SQL Server Setup Notes.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SQL%20Server%20Setup%20Notes.docx"
doc_id: 228
doc_kind: "Other"
surface: "Other"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Sharon Lai"
last_edited_by: "Sharon Lai"
last_edited: "2025-02-21T17:23:00Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["sql server", "database setup", "user login", "password management", "sa user", "sde user"]
tools: ["SQL Server Management Studio"]
products: []
issues: []
related: [{"doc":632,"file":"spike-complete-dmz-machine-setup__doc632.md","s":3.046},{"doc":477,"file":"notes-for-experience-builder-setup__doc477.md","s":1.91},{"doc":39,"file":"location-referencing-gp-error-messages__doc39.md","s":1.688},{"doc":432,"file":"portal-projects-test-plan__doc432.md","s":1.595},{"doc":238,"file":"generate-lrs-data-product-gp-tool-support-database-tables__doc238.md","s":1.197}]
```
-->

## Summary

Notes on setting up Microsoft SQL Server 2022 Enterprise edition including downloading and using SQL Server Management Studio for database management. Instructions include enabling login for the 'sa' user and setting passwords for users such as 'sde' and 'sa'.

## Related documents

<!-- related:begin -->
- [Spike: Complete DMZ machine setup](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-complete-dmz-machine-setup__doc632.md>) — similar text 0.09 · 1 title word · 1 filename word · same folder <!-- rel:632 -->
- [Notes for Experience Builder Setup](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/notes-for-experience-builder-setup__doc477.md>) — similar text 0.16 · 1 title word · 1 filename word · same kind <!-- rel:477 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/location-referencing-gp-error-messages__doc39.md>) — similar text 0.02 · same kind <!-- rel:39 -->
- [Portal Projects Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/portal-projects-test-plan__doc432.md>) — similar text 0.05 <!-- rel:432 -->
- [Generate LRS Data Product GP Tool: Support Database Tables](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-lrs-data-product-gp-tool-support-database-tables__doc238.md>) — similar text 0.07 · same folder <!-- rel:238 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [SQL Server Management Studio](https://www.google.com/search?q=%22SQL%20Server%20Management%20Studio%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

SQL Server Setup Notes
\\esri.com\software\Database\Microsoft\SQLServer\2022\Enterprise\Core
Click setup:

Setup. After you run setup, download SQL Server Management Studio also to manage the DB's https://learn.microsoft.com/en-us/ssms/download-sql-server-management-studio-ssms

This is where you might need SQL server management studio to set the passwords for users: sde, sa

Enable login on user sa to fix the red x.

![image1.png](../media/doc767_image1.png) ![image2.png](../media/doc767_image2.png) ![image3.png](../media/doc767_image3.png) ![image4.png](../media/doc767_image4.png) ![image5.png](../media/doc767_image5.png) ![image6.png](../media/doc767_image6.png) ![image7.png](../media/doc767_image7.png) ![image8.png](../media/doc767_image8.png) ![image9.png](../media/doc767_image9.png) ![image10.png](../media/doc767_image10.png) ![image11.png](../media/doc767_image11.png) ![image12.png](../media/doc767_image12.png)
