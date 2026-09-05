# Spike: LRS in ArcGIS Enterprise on Kubernetes

|   |   |
| --- | --- |
| **Kind** | Design Spike · Enterprise |
| **Release** | — |
| **Source** | [Spike LRS support in ArcGIS Enterprise on Kubernetes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20LRS%20support%20in%20ArcGIS%20Enterprise%20on%20Kubernetes.pptx>) |
| **Edited** | 2025-11-20 15:21 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: LRS in ArcGIS Enterprise on Kubernetes"
source_file: "Spike LRS support in ArcGIS Enterprise on Kubernetes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20LRS%20support%20in%20ArcGIS%20Enterprise%20on%20Kubernetes.pptx"
doc_id: 105
doc_kind: "Design Spike"
surface: "Enterprise"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2025-11-20T15:21:47Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["lrs", "kubernetes", "arcgis enterprise", "microservices", "deployment", "workflow verification"]
tools: ["ArcGIS Pro", "Geoprocessing", "REST", "Experience Builder"]
products: []
issues: []
related: [{"doc":581,"file":"location-referencing-support-in-arcgis-enterprise-for-kubernetes__doc581.md","s":4.931},{"doc":494,"file":"enterprise-installed-help-documentation-index__doc494.md","s":2.283},{"doc":632,"file":"spike-complete-dmz-machine-setup__doc632.md","s":2.276},{"doc":167,"file":"experience-builder-time-and-versioning-widget__doc167.md","s":1.736},{"doc":885,"file":"arcgis-pipeline-referencing-an-introduction__doc885.md","s":1.396}]
```
-->

## Summary

Evaluation of deploying Linear Referencing System (LRS) within ArcGIS Enterprise on Kubernetes. Includes verifying compatibility of Pro, GP, REST, and Experience Builder workflows in this environment and documenting supported and unsupported workflows. Deliverables include a team presentation/demo and documentation of findings to guide further development or bug fixes.

## Related documents

<!-- related:begin -->
- [Location Referencing support in ArcGIS Enterprise for Kubernetes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/location-referencing-support-in-arcgis-enterprise-for-kubernetes__doc581.md>) — similar text 0.26 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:581 -->
- [Enterprise Installed Help Documentation Index](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/enterprise-installed-help-documentation-index__doc494.md>) — similar text 0.02 · 1 title word · 2 filename words · same surface <!-- rel:494 -->
- [Spike: Complete DMZ machine setup](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-complete-dmz-machine-setup__doc632.md>) — similar text 0.09 · same kind/surface/folder <!-- rel:632 -->
- [Experience Builder Time and Versioning widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/experience-builder-time-and-versioning-widget__doc167.md>) — similar text 0.05 · 1 filename word · same folder <!-- rel:167 -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/arcgis-pipeline-referencing-an-introduction__doc885.md>) — similar text 0.08 · same folder <!-- rel:885 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [ArcGIS Pro](https://www.google.com/search?q=%22ArcGIS%20Pro%22+site%3Adoc.esri.com) · [Geoprocessing](https://www.google.com/search?q=%22Geoprocessing%22+site%3Adoc.esri.com) · [REST](https://www.google.com/search?q=%22REST%22+site%3Adoc.esri.com) · [Experience Builder](https://www.google.com/search?q=%22Experience%20Builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: LRS in ArcGIS Enterprise on Kubernetes

Spike

## Slide 2 — LRS in ArcGIS Enterprise on Kubernetes

As a IT Administrator, I want to deploy my LRS on Kubernetes, so that I can scale sharing LRS and other data rapidly in a microservices environment.
After discussion with the ArcGIS Enterprise on Kubernetes team, there shouldn’t be any remaining technical bottlenecks to deploying an LRS in this environment
Deploy ArcGIS Enterprise on Kubernetes
Publish LRS data on this environment
Walk through Pro, GP, REST, and Experience Builder workflows with this environment
Verify which workflows do/don’t work

Deliverables
Give a presentation/demo to the team of configuration and use of LRS on Kubernetes
Document what workflows do and do not work so we can determine whether we need a user story or can support via bug fixes

## Slide 3 — Resources

Resources for deploying/configuring ArcGIS Enterprise on Kubernetes
Video on deployment
Confluence wiki
Release clusters to utilize
Contact on this is Kritin Moondra
If you run into issues, the Kubernetes team said to reach out to them directly (Shreyas Shinde)

## Slide 4 — Assignment

Story Points:
