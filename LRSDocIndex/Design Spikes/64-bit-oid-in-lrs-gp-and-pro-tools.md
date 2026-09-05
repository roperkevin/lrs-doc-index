# Spike: 64-bit OID in LRS GP and Pro Tools

| Field | Value |
| --- | --- |
| **Doc** | 518 · Design Spike · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike 64bitOIDLRSGP&Protools.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%2064bitOIDLRSGP%26Protools.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2023-08-01 16:29 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | 64 bit oid · lrs tools · geoprocessing · feature class · pro tools |
| **Tools** | Split Centerline · Identify · Locate Route and Measures · Translate · Rename · LRS Hierarchy |

## Summary

Investigation of LRS editing tools' behavior when handling 64-bit OID values in feature classes or tables. Testing includes LRS geoprocessing tools and other Pro tools such as split centerline, Identify, Locate Route and Measures, Translate, Rename, and LRS Hierarchy. The goal is to identify which tools fail or do not work as expected with 64-bit OID values.

## Related documents

<!-- related:begin -->
- [64-bit OID in other LRS Pro tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-other-lrs-pro-tools.md>) — similar text 0.46 · 4 title words · 1 filename word · same surface/folder <!-- rel:501 s=6.179 -->
- [Spike: 64-bit OID in LRS Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-editing-tools.md>) — similar text 0.74 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:515 s=5.889 -->
- [64 bit OID Other Pro LR Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5510-64-bit-oid-other-pro-lr-tools.md>) — similar text 0.44 · 4 title words · 1 filename word · same surface <!-- rel:482 s=5.536 -->
- [Spike: 64-bit OID in LRS REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-rest.md>) — similar text 0.83 · 2 title words · 1 filename word · same kind/folder <!-- rel:520 s=5.264 -->
- [64-bit OID in LRS GP tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/64-bit-oid-in-lrs-gp.md>) — similar text 0.40 · 3 title words · 2 filename words · same surface/folder <!-- rel:505 s=4.989 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html) · [Locate route and measures](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/locate-route-and-measures.html) · [Rename a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/rename-a-route.html) · [View the LRS hierarchy](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-the-lrs-hierarchy.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [Identify](https://www.google.com/search?q=%22Identify%22+site%3Adoc.esri.com) · [Translate](https://www.google.com/search?q=%22Translate%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: 64-bit OID in LRS GP and other Pro tools

Spike

## Slide 2 — 64-bit OID LRS GP and other Pro tools

- Investigate the LRS editing tools that don’t work as expected when encountering a 64-bit OID value (not just configured as 64-bit, but a 64-bit value)
- Test on LRS GP tools (configuration and others) with a 64-bit OID value for the feature class/table being utilized in the tool (the Create tools where we create the schema items can be skipped)
- Test on other LRS tools in Pro (split CL, Identify, Locate Route and Measures, Translate, Rename, LRS Hierarchy) with a 64-bit OID value for the feature class/table being utilized in the tool
- Report back with the following:
  - Which, if any, LRS tools don’t work when encountering a feature with a 64-bit OID

## Slide 3 — Assignment

Story Points:
Dev:
