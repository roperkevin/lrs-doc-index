# Build Configuration Options for Server Zips

|   |   |
| --- | --- |
| **Kind** | Other · Server |
| **Release** | — |
| **Source** | [options.txt](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Developers/options.txt>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "Build Configuration Options for Server Zips"
source_file: "options.txt"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Developers/options.txt"
doc_id: 900
doc_kind: "Other"
surface: "Server"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: ""
extracted: 2026-09-04
extraction_lane: plaintext
prompt_version: "v2.0.2"
keywords: ["build configuration", "server", "zip files", "file retrieval", "local build folder"]
tools: []
products: []
issues: []
related: [{"doc":727,"file":"spike-pro-server-and-controller-dataset-collaboration-for-cartographic__doc727.md","s":1.4}]
```
-->

## Summary

Configuration settings for building server zip files including paths, file retrieval options, and local build folder location. Specifies parameters for pulling libraries and object files during the build process.

## Related documents

<!-- related:begin -->
- [Spike: Pro, Server, and Controller Dataset collaboration for Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-pro-server-and-controller-dataset-collaboration-for-cartographic__doc727.md>) — 1 title word <!-- rel:727 -->
<!-- related:end -->

---

BuildZipsServer=\\archive2\ProZips\master
PullFromVersion=
CopyAlways=False
GetPDBFiles=True
GetOnlyBinFiles=False
LocalBuildFolder=c:\ArcGIS
pullBothLibs=True
pullObj=False
