# Spike: Browser Save Options

| Field | Value |
| --- | --- |
| **Doc** | 531 · Design Spike · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike BrowserSaveOptions.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20BrowserSaveOptions.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2023-07-31 21:21 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | browser save options · pending edits · unsaved edits · web application · experience builder · chrome · edge · firefox |
| **Tools** | — |

## Summary

Investigation of browser save options for handling pending edits in web applications, focusing on Experience Builder supported browsers Chrome, Edge, and Firefox. The study includes examining patterns used by other core web editing applications to manage unsaved edits and identifying applicable patterns for Experience Builder.

## Related documents

<!-- related:begin -->
- [Experience Builder Express Mode support for LRS widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-express-mode-support-for-lrs-widgets.md>) — similar text 0.10 · same surface/folder <!-- rel:184 s=2.397 -->
- [Spike: Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/exb.md>) — similar text 0.13 · same kind/surface/folder <!-- rel:824 s=1.987 -->
- [Spike: Experience Builder UI](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/exb-ui.md>) — similar text 0.10 · same kind/surface/folder <!-- rel:651 s=1.906 -->
- [Experience Builder Branch Versioning widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-branch-versioning-widget.md>) — similar text 0.12 · same surface/folder <!-- rel:101 s=1.891 -->
- [Experience Builder Time and Versioning widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/exb-time-and-versioning-widget.md>) — similar text 0.12 · same surface/folder <!-- rel:167 s=1.882 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Browser Save Options

Spike

## Slide 2 — Browser Save Options

- Investigate the current browser save options for when a user has pending edits in a web application and tries to close the browser without manually committing those edits
- Test with the latest 64-bit version of the 3 current browsers supported by Experience Builder
  - Chrome
  - Edge
  - Firefox
- Also investigate what the pending edits experience looks like when using a core editing application as this is a pattern we probably want to follow
- Report back with the following:
  - The pattern being used by other core web editing applications
  - Which Experience Builder supported browsers have a pattern we can utilize to handle unsaved edits

## Slide 3 — Assignment

Story Points:
Dev:
