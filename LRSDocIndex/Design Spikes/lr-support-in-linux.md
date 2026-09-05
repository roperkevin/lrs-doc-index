# Spike: Location Referencing support in Linux

| Field | Value |
| --- | --- |
| **Doc** | 519 · Design Spike · Enterprise |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike LocRef Linux.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20LocRef%20Linux.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2023-08-31 22:11 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | location referencing · linux · enterprise · lr enabled services · event editor · architecture |
| **Tools** | — |

## Summary

Investigation into the feasibility of supporting Location Referencing in a Linux environment for Enterprise. The document explores publishing LR enabled services, tool compatibility with LR services from Linux, deployment scenarios for Event Editor, architectural changes, testing and certification impacts, and unique requirements or challenges.

## Related documents

<!-- related:begin -->
- [Location Referencing support in ArcGIS Enterprise for Kubernetes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/lr-support-in-arcgis-enterprise-for-kubernetes.md>) — similar text 0.37 · 1 title word · 2 filename words · same kind/surface/folder <!-- rel:581 s=5.185 -->
- [Spike: Complete DMZ machine setup](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/complete-dmz-machine-setup.md>) — similar text 0.15 · same kind/surface/folder <!-- rel:632 s=2.042 -->
- [Spike: Support LRS Apply Edits Running Asynchronously](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/support-lrs-apply-edits-running-asynchronously.md>) — similar text 0.15 · 1 title word · same kind/folder <!-- rel:471 s=1.864 -->
- [Spike: Advanced Table Editing options in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/advanced-table-editing-options-in-pro.md>) — similar text 0.24 · same kind/folder <!-- rel:492 s=1.811 -->
- [Enterprise Installed Help Documentation Index](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/enterprise-installed-help-documentation-index.md>) — similar text 0.01 · same surface <!-- rel:494 s=1.544 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)
<!-- docs:end -->

---

## Slide 1 — Spike: Location Referencing support in Linux

Spike

## Slide 2 — Location Referencing in Linux

- Investigate the feasibility of Location Referencing being supported in a Linux environment for Enterprise
  - Can we publish LR enabled services
  - Do our tools in Pro work with an LR published service from a Linux machine
  - Will it work with Event Editor (with Event Editor deployed on a separate non-Linux server machine or Event Editor deployed on the Linux machine)
- What does it take to get the software supported?
- Are there changes to our architecture needed (for example, are federated servers supported)?
- What, if any, impact is there to the testing and certification process besides needing to deploy on a Linux machine?
- Are there any additional gotchas or unique requirements we should be aware of?
- Deliverable is a write up answering these questions to be shared with the team

## Slide 3 — Assignment

Story Points:
Dev:
