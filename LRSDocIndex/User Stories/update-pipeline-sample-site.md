# Update Pipeline Sample Site

| Field | Value |
| --- | --- |
| **Doc** | 711 · User Story · Server |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [Update Pipeline Sample Site.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Update%20Pipeline%20Sample%20Site.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-05-14 21:54 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | pipeline referencing · lrs rest api · branch versioning · sample site · vms · service republishing |
| **Tools** | — |

## Summary

User story for updating the Pipeline Referencing sample site to remove ArcMap LRS REST API doc link, update sample server to version 10.9, branch version sample data, and republish services with LRS and VMS. Includes updating sample apps to work with new services and verifying samples work with LRS/VMS service.

## Related documents

<!-- related:begin -->
- [Update Sample Server Sites](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-sample-server-sites.md>) — similar text 0.30 · 1 title word · 2 filename words · same kind/surface <!-- rel:847 s=4.466 -->
- [Generate LRS Data Product GP Tool: Support Database Tables](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-lrs-data-product-gp-support-database-tables.md>) — similar text 0.04 · same kind/folder <!-- rel:238 s=2.133 -->
- [Experience Builder Branch Versioning widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-branch-versioning-widget.md>) — similar text 0.16 · same kind/folder <!-- rel:101 s=1.997 -->
- [Manage Pipeline Referencing and a Utility Network Together](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/manage-apr-and-a-un-together.md>) — similar text 0.04 · 1 title word · 1 filename word <!-- rel:74 s=1.599 -->
- [Esri Roads and Highways Tutorial](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/esri-rh-tutorial.md>) — similar text 0.06 · same folder <!-- rel:875 s=1.203 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html)
<!-- docs:end -->

---

## Story
### Update Pipeline Sample Site <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing developer, I want to be able to access LRS REST and app samples on the sample site, so that I can use them as a guide for any development.

Persona
Location Referencing developers utilize the LRS REST API along with other Esri developer resources (Javascript API, SDK, etc.) to build add ins, web apps, and other supplemental applications that leverage LRS data.  With the move to branch versioning and a service-oriented architecture in Pro, we should update our REST samples and sample apps to reflect branch versioning.

## Acceptance Criteria
### Pipeline Sample Site <!-- slide 3 -->
- On the pipeline sample site, remove the link to the ArcMap version of the LRS REST API doc
- Update the sample server to version 10.9
- Update the sample data to be branch versioned and republish the service(s) with LRS and VMS
- Update all the sample apps to work with the newly republished service(s)
- Only do this for the Pipeline Referencing site (we’ll update the Roads and Highways sample site later in a different user story)

## Testing
<!-- slide 4 -->
- Verify all the samples work with the LRS/VMS service

## Assignment
<!-- slide 5 -->
Story Points:
Dev:
PE:
