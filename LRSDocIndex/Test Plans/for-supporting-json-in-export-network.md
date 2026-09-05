# Test Plan for Supporting JSON in Export Network

| Field | Value |
| --- | --- |
| **Doc** | 639 · Test Plan · Server |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExportNetwork_Json.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/ExportNetwork_Json.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE — · dev — |
| **Edited** | 2022-08-05 23:46 by Lakshmi Ananthanarayanan |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | export network · json output · rest endpoint · feature compare · network concurrency · lrm translations · test plan |
| **Tools** | Feature compare · JSON to features conversion |

## Summary

This document outlines a test plan for verifying JSON support in the Export Network REST endpoint. It covers verification of JSON output format compliance with geoJSON, output file handling including large files, and support for GET and POST requests. Test cases include various parameter scenarios and network types such as Nonline, Line, and PoM networks.

## Related documents

<!-- related:begin -->
- [Support line networks and JSON in Export Network](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-line-networks-and-json-in-export-network.md>) — similar text 0.27 · 3 title words · 3 filename words <!-- rel:805 s=5.111 -->
- [Export Network in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/export-network-in-pro.md>) — similar text 0.18 · 2 title words · 2 filename words <!-- rel:806 s=3.265 -->
- [Prototype: JSON requests and returns in REST for Relocate Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/prototype-json-requests-and-returns-in-rest-for-relocate.md>) — similar text 0.07 · 1 title word · 1 filename word · same surface <!-- rel:298 s=2.162 -->
- [Support Search Tolerance Parameter in Update Measures from LRS Tool – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4100-support-search-tolerance-parameter-in-update-measures.md>) — similar text 0.11 · same kind/folder <!-- rel:229 s=2.116 -->
- [Generate a route Log including spanning events and centerline – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6240-generate-a-route-log-including-spanning-events.md>) — similar text 0.05 · same kind/folder <!-- rel:255 s=2.104 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Feature compare](https://www.google.com/search?q=%22Feature%20compare%22+site%3Adoc.esri.com) · [JSON to features conversion](https://www.google.com/search?q=%22JSON%20to%20features%20conversion%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Test plan for supporting JSON in Export Network

Verification Workflow
Same test cases are run for each network separately  to create Fgdb as output and to create Json as output and then they will be compared.

Fgdb/
Json
Query the Export network rest end point
Fgdb output
Json output
Convert it into Fgdb using JSON to features conversion tool GP tool

Feature compare  using Feature compare GP tool
Results should be same.

![Figure 1 — Test plan for supporting JSON in Export Network](../media/for-supporting-json-in-export-network/fig-01-slide-01-test-plan-for-supporting-json-in-export.svg)
[connections: (flowChartProcess 37) → (flowChartProcess 42) · (flowChartProcess 41) → Fgdb/ Json · (flowChartProcess 42) → (flowChartProcess 43) · Fgdb/ Json → (flowChartProcess 38) · (flowChartProcess 38) → (flowChartProcess 31) · (flowChartProcess 31) → (flowChartProcess 42)]

## Slide 2

Data

- RH data
- APR+UN data
- Caltrans data
Edit log data should contain edits related to all activity type and edits should include gapped routes. Data should contain overlapping routes for the same network and between the networks for concurrencies and lrm translations. For LRM translations do a couple of edits where the network exist (in the INDOT data). Ensure output data can be directly used as an input and does not need any data conversions for its usage.
Verification

- Verify that there is support for JSON as an output format for this tool
- Verify the obtained JSON format match geoJSON  - Route
- Output should have one JSON file for each– Concurrency, LRM Translations,  Gap, Networks, export details.
- Verify for a larger output (greater than 250mb), Zip file is created.
- Verify by utilizing the JSON output by scripting in python, JavaScript.
- Verify that the export to Json is supported by both GET and POST request.

Test Cases

- No time parameter provided
- Providing all the three parameters last invoked time, LRS time and last LRS time.
- No time parameter with lrm translations
Networks

- Nonline Network
- Line Network
- PoM Network

![Figure 2 — Data](../media/for-supporting-json-in-export-network/fig-02-slide-02-data.png)

## Slide 3

[figure: 1–4]

![Figure 3](../media/for-supporting-json-in-export-network/fig-03-slide-03.png)
![Figure 4](../media/for-supporting-json-in-export-network/fig-04-slide-03.png)
![Figure 5](../media/for-supporting-json-in-export-network/fig-05-slide-03.png)
![Figure 6](../media/for-supporting-json-in-export-network/fig-06-slide-03.png)
![Figure 7](../media/for-supporting-json-in-export-network/fig-07-slide-03.png)
![Figure 8](../media/for-supporting-json-in-export-network/fig-08-slide-03.png)
![Figure 9](../media/for-supporting-json-in-export-network/fig-09-slide-03.png)
![Figure 10](../media/for-supporting-json-in-export-network/fig-10-slide-03.png)
![Figure 11](../media/for-supporting-json-in-export-network/fig-11-slide-03.png)

## Slide 4

![Figure 12](../media/for-supporting-json-in-export-network/fig-12-slide-04.png)
