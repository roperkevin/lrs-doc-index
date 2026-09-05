# Update Sample Server Sites

| Field | Value |
| --- | --- |
| **Doc** | 847 · User Story · Server |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [UpdateSampleServerSite.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Developers/UpdateSampleServerSite.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2019-12-09 20:27 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | sample server · roads and highways · pipeline referencing · https · service republishing |
| **Tools** | — |

## Summary

Update the sample server hosting Roads and Highways and Pipeline Referencing sample services and apps to version 10.8. Republish existing services and configure the site to support https. Verify functionality of services and sample apps after republishing and confirm https support.

## Related documents

<!-- related:begin -->
- [Update Pipeline Sample Site](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-pipeline-sample-site.md>) — similar text 0.30 · 1 title word · 2 filename words · same kind/surface <!-- rel:711 s=4.466 -->
- [REST: Station to Geometry User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-station-to-geometry.md>) — similar text 0.10 · same kind/surface <!-- rel:691 s=1.651 -->
- [Spike: Complete DMZ machine setup](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/complete-dmz-machine-setup.md>) — similar text 0.16 <!-- rel:632 s=0.822 -->
- [Roads and Highways and Pipeline Referencing 11.x Experience Builder Widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/rh-and-apr-11-x-exb-widgets.md>) — similar text 0.06 <!-- rel:397 s=0.516 -->
- [Add Point Event widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/24791-add-point-event-widget.md>) — similar text 0.04 <!-- rel:139 s=0.486 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html)
<!-- docs:end -->

---

## Story
### Update Sample Server Sites <!-- slide 1 -->
User Story

## Acceptance Criteria
### Sample Servers <!-- slide 2 -->
- Update the sample server that hosts our Roads and Highways/Pipeline Referencing sample services and apps to 10.8
  - https://roadsandhighwayssample.esri.com/roads/
  - https://pipelinesample.esri.com/pipeline/
- Republish the existing services
- Configure the site to work with https (the machine is already configured for those URLs to support https, but the current ~10.3.1 deployment doesn’t include https support)

## Testing
<!-- slide 3 -->
- Verify all services and sample apps work after republishing (both Roads and Highways and Pipeline Referencing)
- Verify https works

## Assignment
<!-- slide 4 -->
Story Points:
Dev:
