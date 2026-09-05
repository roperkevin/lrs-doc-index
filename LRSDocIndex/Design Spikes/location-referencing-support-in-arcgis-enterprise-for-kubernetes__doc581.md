# Location Referencing support in ArcGIS Enterprise for Kubernetes

|   |   |
| --- | --- |
| **Kind** | Design Spike · Enterprise |
| **Release** | — |
| **Source** | [SpikeLocRefKubernetes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SpikeLocRefKubernetes.pptx>) |
| **Edited** | 2023-04-07 00:52 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Location Referencing support in ArcGIS Enterprise for Kubernetes"
source_file: "SpikeLocRefKubernetes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SpikeLocRefKubernetes.pptx"
doc_id: 581
doc_kind: "Design Spike"
surface: "Enterprise"
doc_revision: ""
target_release: ""
pe: ""
dev: "Shreyas"
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2023-04-07T00:52:21Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["location referencing", "arcgis enterprise", "kubernetes", "architecture", "testing", "code management"]
tools: []
products: []
issues: []
related: [{"doc":519,"file":"spike-location-referencing-support-in-linux__doc519.md","s":5.19},{"doc":105,"file":"spike-lrs-in-arcgis-enterprise-on-kubernetes__doc105.md","s":4.955},{"doc":632,"file":"spike-complete-dmz-machine-setup__doc632.md","s":2.038},{"doc":812,"file":"relocate-events-in-pro__doc812.md","s":1.356},{"doc":885,"file":"arcgis-pipeline-referencing-an-introduction__doc885.md","s":0.977}]
```
-->

## Summary

This spike investigates the feasibility and requirements for supporting Location Referencing in ArcGIS Enterprise deployed on Kubernetes. It explores architectural changes, code management, testing impacts, and unique considerations for this environment.

## Related documents

<!-- related:begin -->
- [Spike: Location Referencing support in Linux](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-location-referencing-support-in-linux__doc519.md>) — similar text 0.37 · 1 title word · 2 filename words · same kind/surface/folder <!-- rel:519 -->
- [Spike: LRS in ArcGIS Enterprise on Kubernetes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-lrs-in-arcgis-enterprise-on-kubernetes__doc105.md>) — similar text 0.27 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:105 -->
- [Spike: Complete DMZ machine setup](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-complete-dmz-machine-setup__doc632.md>) — similar text 0.07 · same kind/surface/folder <!-- rel:632 -->
- [Relocate Events in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/relocate-events-in-pro__doc812.md>) — similar text 0.05 · same kind/folder <!-- rel:812 -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/arcgis-pipeline-referencing-an-introduction__doc885.md>) — similar text 0.05 · same folder <!-- rel:885 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)
<!-- docs:end -->

---

## Slide 1 — Spike: Location Referencing support in ArcGIS Enterprise for Kubernetes

Spike

## Slide 2 — Location Referencing in ArcGIS Enterprise for Kubernetes

Investigate the feasibility of Location Referencing being supported in ArcGIS Enterprise for Kubernetes
What does it take to get the software supported?
Are there changes to our architecture needed (for example, are federated servers supported)?
Are there any changes to how we manage code/check-ins/builds?
What, if any, impact is there to the testing and certification process?
Are there any additional gotchas or unique requirements we should be aware of?
Whichever SE is assigned the spike, touch base with Nathan as he can connect you with Eva Mui and Shreyas (the lead dev) to help with getting many of these questions answered

## Slide 3 — Assignment

Story Points:
Dev:
