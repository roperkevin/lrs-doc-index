# Spike: LRS in ArcGIS Enterprise on Kubernetes

| Field | Value |
| --- | --- |
| **Doc** | 105 · Design Spike · Enterprise |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike LRS support in ArcGIS Enterprise on Kubernetes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20LRS%20support%20in%20ArcGIS%20Enterprise%20on%20Kubernetes.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2025-11-20 15:21 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | lrs · kubernetes · arcgis enterprise · microservices · deployment · workflow verification |
| **Tools** | ArcGIS Pro · Geoprocessing · REST · Experience Builder |

## Summary

Evaluation of deploying Linear Referencing System (LRS) within ArcGIS Enterprise on Kubernetes. Includes verifying compatibility of Pro, GP, REST, and Experience Builder workflows in this environment and documenting supported and unsupported workflows. Deliverables include a team presentation/demo and documentation of findings to guide further development or bug fixes.

## Related documents

<!-- related:begin -->
- [Location Referencing support in ArcGIS Enterprise for Kubernetes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/lr-support-in-arcgis-enterprise-for-kubernetes.md>) — similar text 0.26 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:581 s=4.931 -->
- [Enterprise Installed Help Documentation Index](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/enterprise-installed-help-documentation-index.md>) — similar text 0.02 · 1 title word · 2 filename words · same surface <!-- rel:494 s=2.283 -->
- [Spike: Complete DMZ machine setup](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/complete-dmz-machine-setup.md>) — similar text 0.09 · same kind/surface/folder <!-- rel:632 s=2.276 -->
- [Experience Builder Time and Versioning widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/exb-time-and-versioning-widget.md>) — similar text 0.05 · 1 filename word · same folder <!-- rel:167 s=1.736 -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/arcgis-apr-an-introduction-rh-apr-un.md>) — similar text 0.08 · same folder <!-- rel:885 s=1.396 -->
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

- After discussion with the ArcGIS Enterprise on Kubernetes team, there shouldn’t be any remaining technical bottlenecks to deploying an LRS in this environment
- Deploy ArcGIS Enterprise on Kubernetes
- Publish LRS data on this environment
- Walk through Pro, GP, REST, and Experience Builder workflows with this environment
- Verify which workflows do/don’t work

Deliverables

- Give a presentation/demo to the team of configuration and use of LRS on Kubernetes
- Document what workflows do and do not work so we can determine whether we need a user story or can support via bug fixes

## Slide 3 — Resources

Resources for deploying/configuring ArcGIS Enterprise on Kubernetes

- Video on deployment
- Confluence wiki
- Release clusters to utilize
- Contact on this is Kritin Moondra
- If you run into issues, the Kubernetes team said to reach out to them directly (Shreyas Shinde)

## Slide 4 — Assignment

Story Points:
