# Spike: Partial Posting Impact on LRS

|   |   |
| --- | --- |
| **Kind** | Design Spike · Pro |
| **Release** | — |
| **Issue** | [ArcGISPro/geodatabase#1221](https://devtopia.esri.com/ArcGISPro/geodatabase/issues/1221) · [ArcGISPro/geodatabase#5762](https://devtopia.esri.com/ArcGISPro/geodatabase/issues/5762) · [ArcGISPro/geodatabase#5366](https://devtopia.esri.com/ArcGISPro/geodatabase/issues/5366) · [ArcGISPro/geodatabase#5362](https://devtopia.esri.com/ArcGISPro/geodatabase/issues/5362) |
| **Source** | [Spike Partial Posting.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Partial%20Posting.pptx>) |
| **Edited** | 2020-12-03 18:45 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Partial Posting Impact on LRS"
source_file: "Spike Partial Posting.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Partial%20Posting.pptx"
doc_id: 750
doc_kind: "Design Spike"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2020-12-03T18:45:46Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["partial posting", "linear referencing system", "referential integrity", "geodatabase", "conflict prevention", "centerline", "route", "versioning"]
tools: []
products: []
issues: ["ArcGISPro/geodatabase#1221", "ArcGISPro/geodatabase#5762", "ArcGISPro/geodatabase#5366", "ArcGISPro/geodatabase#5362"]
related: [{"doc":738,"file":"support-lrs-partial-posting__doc738.md","s":3.305},{"doc":875,"file":"esri-roads-and-highways-tutorial__doc875.md","s":2.103},{"doc":885,"file":"arcgis-pipeline-referencing-an-introduction__doc885.md","s":1.67},{"doc":276,"file":"manage-address-and-roadway-characteristic-data-together-with-roads-and-highways__doc276.md","s":1.664},{"doc":39,"file":"location-referencing-gp-error-messages__doc39.md","s":1.645}]
```
-->

## Summary

This spike document explores the new partial posting capability introduced in the geodatabase and its potential impact on the Linear Referencing System (LRS). It discusses the technical details of partial posting, its interaction with dataset extensions, and raises questions about maintaining LRS referential integrity during partial posts. The document aims to research and recommend whether partial posting should be supported or restricted for LRS data based on control over posted features.

## Related documents

<!-- related:begin -->
- [Support LRS Partial Posting](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-lrs-partial-posting__doc738.md>) — similar text 0.28 · 2 title words · 1 filename word · same folder <!-- rel:738 -->
- [Esri Roads and Highways Tutorial](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/esri-roads-and-highways-tutorial__doc875.md>) — similar text 0.08 · same surface/folder <!-- rel:875 -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/arcgis-pipeline-referencing-an-introduction__doc885.md>) — similar text 0.06 · same surface/folder <!-- rel:885 -->
- [Manage Address and Roadway Characteristic Data Together with Roads and Highways and Address Data Management Solution](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/manage-address-and-roadway-characteristic-data-together-with-roads-and-highways__doc276.md>) — similar text 0.08 · same surface <!-- rel:276 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/location-referencing-gp-error-messages__doc39.md>) — similar text 0.09 · same surface <!-- rel:39 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html)
<!-- docs:end -->

---

## Slide 1 — Spike: Partial posting impact on LRS

Spike

## Slide 2 — Partial posting

At 2.7, the geodatabase team has exposed the ability to do partial posting to developers.  The expectation is that they will expand this support into a user facing interface in future releases and partial posting will become common.
GDB is adding support for partial post via ArcGISPro/geodatabase#1221. Design details can be found in https://esriis.sharepoint.com/:p:/r/sites/Geodatabase577/_layouts/15/guestaccess.aspx?e=wahlyN&share=Ec9l8X9XIT1Hteaut7NQj14Bu3ydGlSLWtleM4wuwLYHzQ. The support is via SDK in the first release.
This is being supported via VMS (ArcGISPro/geodatabase#5362) and FSDB (ArcGISPro/geodatabase#5366). The doc issue is at ArcGISPro/geodatabase#5762.
Impact on Dataset Extensions
• IBranchImpl::get_IsInPartialPost will indicate if the branch is running a partial post.
• get_ModifiedClasses will return only those classes that are being posted.
• The difference sets on classes will list only those rows that will be posted.
• Querying the branch will continue to return all rows in the branch.
• If you write to a table in PrePost, call IBranchReconcileHelper::AddToPost so that I will know to post that table.
• If you write to a user table in PrePost, please let me know. I will need to provide you an API to indicate which rows to add to the post.
• For operations like regenerating dirty areas:
• PrePost should operate only rows to be posted. (This should happen automatically because the difference sets only list rows to be posted.)
• Should also be run in PostPost, to regenerate dirty areas on the features that remain in the branch

## Slide 3 — Partial posting

We need to understand how partial posting will work with our information model and Conflict Prevention.
If a user does partial posts with LRS data, then they can mess up their data, by say posting centerline and route updates in a version, but not the centerline sequence. We need to research about the effects of such an operation and decide whether we should error out in all such partial post operations if it involves LRS data, or if we can be smart and allow or deny based on LRS referential integrity being honored in a particular partial post.
Questions to answer:
How does partial posting work?  Does a user provide a series of OIDs of features being posted or some other method?  How is this information presented to us to determine what/if any action we would need to take?
If a partial post takes place and a user includes one or more of our schema items, can we ensure that we post the only the correct features/records in the related schema items (i.e. a user partial posts from the Network, can we make sure only the correct CP, CLS, CL, and related events are posted)?
If we can’t get this level of control to ensure our LRS items are posted correctly, can we prevent a partial post from taking place?
Based on what is discovered, recommend the best option moving forward.  Do we support partial posting (assuming we have the level of control needed) or do we prevent it all together because we can’t control the objects being posted at the level necessary.

## Slide 4 — Assignment

Story Points:
Dev:
