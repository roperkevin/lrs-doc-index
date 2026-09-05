# Update Sample Server Sites

|   |   |
| --- | --- |
| **Kind** | User Story · Server |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [UpdateSampleServerSite.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Developers/UpdateSampleServerSite.pptx>) |
| **Edited** | 2019-12-09 20:27 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Update Sample Server Sites"
source_file: "UpdateSampleServerSite.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Developers/UpdateSampleServerSite.pptx"
doc_id: 847
doc_kind: "User Story"
surface: "Server"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2019-12-09T20:27:38Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["sample server", "roads and highways", "pipeline referencing", "https", "service republishing"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":711,"file":"update-pipeline-sample-site__doc711.md","s":4.466},{"doc":691,"file":"rest-station-to-geometry-user-story__doc691.md","s":1.651},{"doc":632,"file":"spike-complete-dmz-machine-setup__doc632.md","s":0.822},{"doc":397,"file":"roads-and-highways-and-pipeline-referencing-11-x-experience-builder-widgets__doc397.md","s":0.516},{"doc":139,"file":"add-point-event-widget__doc139.md","s":0.486}]
```
-->

## Summary

Update the sample server hosting Roads and Highways and Pipeline Referencing sample services and apps to version 10.8. Republish existing services and configure the site to support https. Verify functionality of services and sample apps after republishing and confirm https support.

## Related documents

<!-- related:begin -->
- [Update Pipeline Sample Site](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-pipeline-sample-site__doc711.md>) — similar text 0.30 · 1 title word · 2 filename words · same kind/surface <!-- rel:711 -->
- [REST: Station to Geometry User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-station-to-geometry-user-story__doc691.md>) — similar text 0.10 · same kind/surface <!-- rel:691 -->
- [Spike: Complete DMZ machine setup](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-complete-dmz-machine-setup__doc632.md>) — similar text 0.16 <!-- rel:632 -->
- [Roads and Highways and Pipeline Referencing 11.x Experience Builder Widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/roads-and-highways-and-pipeline-referencing-11-x-experience-builder-widgets__doc397.md>) — similar text 0.06 <!-- rel:397 -->
- [Add Point Event widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/add-point-event-widget__doc139.md>) — similar text 0.04 <!-- rel:139 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html)
<!-- docs:end -->

---

## Slide 1 — Update Sample Server Sites

User Story

## Slide 2 — Sample Servers

Update the sample server that hosts our Roads and Highways/Pipeline Referencing sample services and apps to 10.8

  - https://roadsandhighwayssample.esri.com/roads/
  - https://pipelinesample.esri.com/pipeline/
Republish the existing services
Configure the site to work with https (the machine is already configured for those URLs to support https, but the current ~10.3.1 deployment doesn’t include https support)

## Slide 3 — Testing

Verify all services and sample apps work after republishing (both Roads and Highways and Pipeline Referencing)
Verify https works

## Slide 4 — Assignment

Story Points:
Dev:
