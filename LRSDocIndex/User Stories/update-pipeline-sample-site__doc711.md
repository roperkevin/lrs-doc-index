# Update Pipeline Sample Site

|   |   |
| --- | --- |
| **Kind** | User Story · Server |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [Update Pipeline Sample Site.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Update%20Pipeline%20Sample%20Site.pptx>) |
| **Edited** | 2021-05-14 21:54 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Update Pipeline Sample Site"
source_file: "Update Pipeline Sample Site.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Update%20Pipeline%20Sample%20Site.pptx"
doc_id: 711
doc_kind: "User Story"
surface: "Server"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2021-05-14T21:54:44Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["pipeline referencing", "lrs rest api", "branch versioning", "sample site", "vms", "service republishing"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":847,"file":"update-sample-server-sites__doc847.md","s":4.466},{"doc":238,"file":"generate-lrs-data-product-gp-tool-support-database-tables__doc238.md","s":2.133},{"doc":101,"file":"experience-builder-branch-versioning-widget__doc101.md","s":1.997},{"doc":74,"file":"manage-pipeline-referencing-and-a-utility-network-together__doc74.md","s":1.599},{"doc":875,"file":"esri-roads-and-highways-tutorial__doc875.md","s":1.203}]
```
-->

## Summary

User story for updating the Pipeline Referencing sample site to remove ArcMap LRS REST API doc link, update sample server to version 10.9, branch version sample data, and republish services with LRS and VMS. Includes updating sample apps to work with new services and verifying samples work with LRS/VMS service.

## Related documents

<!-- related:begin -->
- [Update Sample Server Sites](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-sample-server-sites__doc847.md>) — similar text 0.30 · 1 title word · 2 filename words · same kind/surface <!-- rel:847 -->
- [Generate LRS Data Product GP Tool: Support Database Tables](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-lrs-data-product-gp-tool-support-database-tables__doc238.md>) — similar text 0.04 · same kind/folder <!-- rel:238 -->
- [Experience Builder Branch Versioning widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-branch-versioning-widget__doc101.md>) — similar text 0.16 · same kind/folder <!-- rel:101 -->
- [Manage Pipeline Referencing and a Utility Network Together](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/manage-pipeline-referencing-and-a-utility-network-together__doc74.md>) — similar text 0.04 · 1 title word · 1 filename word <!-- rel:74 -->
- [Esri Roads and Highways Tutorial](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/esri-roads-and-highways-tutorial__doc875.md>) — similar text 0.06 · same folder <!-- rel:875 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html)
<!-- docs:end -->

---

## Slide 1 — Update Pipeline Sample Site

User Story

## Slide 2 — User Story

As a Location Referencing developer, I want to be able to access LRS REST and app samples on the sample site, so that I can use them as a guide for any development.

Persona
Location Referencing developers utilize the LRS REST API along with other Esri developer resources (Javascript API, SDK, etc.) to build add ins, web apps, and other supplemental applications that leverage LRS data.  With the move to branch versioning and a service-oriented architecture in Pro, we should update our REST samples and sample apps to reflect branch versioning.

## Slide 3 — Pipeline Sample Site

On the pipeline sample site, remove the link to the ArcMap version of the LRS REST API doc
Update the sample server to version 10.9
Update the sample data to be branch versioned and republish the service(s) with LRS and VMS
Update all the sample apps to work with the newly republished service(s)
Only do this for the Pipeline Referencing site (we’ll update the Roads and Highways sample site later in a different user story)

## Slide 4 — Testing

Verify all the samples work with the LRS/VMS service

## Slide 5 — Assignment

Story Points:
Dev:
PE:
