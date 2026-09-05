# Notes for Experience Builder Setup

| Field | Value |
| --- | --- |
| **Doc** | 477 · Other · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Notes for ExB setup.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Developers/Notes%20for%20ExB%20setup.docx>) |
| **People** | author Sharon Lai · PE — · dev — |
| **Edited** | 2023-10-25 21:27 by Sharon Lai |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | experience builder · setup · node.js · widget development · custom widget · portal client id |
| **Tools** | — |

## Summary

Instructions and notes for setting up the Experience Builder development environment, including installing node.js, cloning repositories, installing dependencies, starting the developer edition, creating applications on the portal, and configuring custom widgets.

## Related documents

<!-- related:begin -->
- [ArcGIS Experience Builder Collaboration Workflow](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/arcgis-exb-collaboration-workflow.md>) — similar text 0.17 · 2 title words · same kind/surface/folder <!-- rel:700 s=3.538 -->
- [Developer Server Setup](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/developer-server-setup.md>) — similar text 0.19 · 1 title word · 1 filename word · same kind/folder <!-- rel:735 s=2.464 -->
- [Spike: Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/exb.md>) — similar text 0.06 · 2 title words · same surface <!-- rel:824 s=2.202 -->
- [SQL Server Setup Notes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/sql-server-setup-notes.md>) — similar text 0.16 · 1 title word · 1 filename word · same kind <!-- rel:228 s=1.91 -->
- [Experience Builder: Add Single Line Event Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/16340-exb-add-single-line-event-widget.md>) — similar text 0.16 · 2 title words · same surface <!-- rel:455 s=1.873 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

### Notes for ExB setup:

1. https://developers.arcgis.com/experience-builder/guide/install-guide/#create-client-id-using-arcgis-online-or-arcgis-enterprise

1. Check the checkbox when installing node.js:

1. https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder#clone-repo

  1. If Git Bash doesn’t work, use Git Desktop instead

  1. Sign in to GitHub Enterprise

  1. Choose clone from internet

  1. Can skip setting up self signed certificate.

  1. Do the same with https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions repo under client and rename the folder “ExperienceBuilder-Web-Extensions” to “extensions”.

1. Install dependencies in PowerShell as Admin:

  1. cd C:\ExperienceBuilder

  1. npm ci

1. Start up (Developer Edition)

1. Create application on portal to get the Client ID:

1. Copy the Client ID from above and paste here:

  1. https://localhost:3001

  1. Replace lvpc008 with your portal machine name.

1. Download Visual Studio Code https://code.visualstudio.com/download.

  1. Once launch, File -> Open Folder -> C:\ExperienceBuilder

1. To view the Select by Route widget under the Custom section in Experience Builder:

  1. Copy \\lrtest\c$\Widgets\search-by-route  and paste into C:\ExperienceBuilder\client\extensions\widgets\arcgis.

  1. Configure the map widget using webmap.

1. Use C:\ExperienceBuilder\client\extensions\widgets\samples\simple as a starting point to create your first widget.

![Figure 1 — Notes for ExB setup:](../media/notes-for-exb-setup/fig-01-notes-for-exb-setup.png)
![Figure 2 — Notes for ExB setup:](../media/notes-for-exb-setup/fig-02-notes-for-exb-setup.png)
![Figure 3 — Notes for ExB setup:](../media/notes-for-exb-setup/fig-03-notes-for-exb-setup.png)
![Figure 4 — Notes for ExB setup:](../media/notes-for-exb-setup/fig-04-notes-for-exb-setup.png)
![Figure 5 — Notes for ExB setup:](../media/notes-for-exb-setup/fig-05-notes-for-exb-setup.png)
![Figure 6 — Notes for ExB setup:](../media/notes-for-exb-setup/fig-06-notes-for-exb-setup.png)
![Figure 7 — Notes for ExB setup:](../media/notes-for-exb-setup/fig-07-notes-for-exb-setup.png)
![Figure 8 — Notes for ExB setup:](../media/notes-for-exb-setup/fig-08-notes-for-exb-setup.png)
![Figure 9 — Notes for ExB setup:](../media/notes-for-exb-setup/fig-09-notes-for-exb-setup.png)
![Figure 10 — Notes for ExB setup:](../media/notes-for-exb-setup/fig-10-notes-for-exb-setup.png)
![Figure 11 — Notes for ExB setup:](../media/notes-for-exb-setup/fig-11-notes-for-exb-setup.png)
![Figure 12 — Notes for ExB setup:](../media/notes-for-exb-setup/fig-12-notes-for-exb-setup.png)
