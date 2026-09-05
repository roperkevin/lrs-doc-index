# Build Configuration Options for Server Zips

| Field | Value |
| --- | --- |
| **Doc** | 900 · Other · Server |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [options.txt](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Developers/options.txt>) |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | build configuration · server · zip files · file retrieval · local build folder |
| **Tools** | — |

## Summary

Configuration settings for building server zip files including paths, file retrieval options, and local build folder location. Specifies parameters for pulling libraries and object files during the build process.

## Related documents

<!-- related:begin -->
- [Spike: Pro, Server, and Controller Dataset collaboration for Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/pro-server-and-controller-dataset-collaboration.md>) — 1 title word <!-- rel:727 s=1.4 -->
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
