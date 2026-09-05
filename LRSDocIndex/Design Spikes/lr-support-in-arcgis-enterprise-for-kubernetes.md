# Location Referencing support in ArcGIS Enterprise for Kubernetes

| Field | Value |
| --- | --- |
| **Doc** | 581 · Design Spike · Enterprise |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [SpikeLocRefKubernetes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SpikeLocRefKubernetes.pptx>) |
| **People** | author Nathan Easley · PE — · dev Shreyas |
| **Edited** | 2023-04-07 00:52 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | location referencing · arcgis enterprise · kubernetes · architecture · testing · code management |
| **Tools** | — |

## Summary

This spike investigates the feasibility and requirements for supporting Location Referencing in ArcGIS Enterprise deployed on Kubernetes. It explores architectural changes, code management, testing impacts, and unique considerations for this environment.

## Related documents

<!-- related:begin -->
- [Spike: Location Referencing support in Linux](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/lr-support-in-linux.md>) — similar text 0.37 · 1 title word · 2 filename words · same kind/surface/folder <!-- rel:519 s=5.19 -->
- [Spike: LRS in ArcGIS Enterprise on Kubernetes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/lrs-in-arcgis-enterprise-on-kubernetes.md>) — similar text 0.27 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:105 s=4.955 -->
- [Spike: Complete DMZ machine setup](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/complete-dmz-machine-setup.md>) — similar text 0.07 · same kind/surface/folder <!-- rel:632 s=2.038 -->
- [Relocate Events in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/relocate-events-in-pro.md>) — similar text 0.05 · same kind/folder <!-- rel:812 s=1.356 -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/arcgis-apr-an-introduction-rh-apr-un.md>) — similar text 0.05 · same folder <!-- rel:885 s=0.977 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)
<!-- docs:end -->

---

## Slide 1 — Spike: Location Referencing support in ArcGIS Enterprise for Kubernetes

Spike

## Slide 2 — Location Referencing in ArcGIS Enterprise for Kubernetes

- Investigate the feasibility of Location Referencing being supported in ArcGIS Enterprise for Kubernetes
- What does it take to get the software supported?
- Are there changes to our architecture needed (for example, are federated servers supported)?
- Are there any changes to how we manage code/check-ins/builds?
- What, if any, impact is there to the testing and certification process?
- Are there any additional gotchas or unique requirements we should be aware of?
- Whichever SE is assigned the spike, touch base with Nathan as he can connect you with Eva Mui and Shreyas (the lead dev) to help with getting many of these questions answered

## Slide 3 — Assignment

Story Points:
Dev:
