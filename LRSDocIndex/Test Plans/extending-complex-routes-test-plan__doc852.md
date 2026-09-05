# Extending Complex Routes Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [Extend_Complex_Routes_TestPlan1.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Extend_Complex_Routes_TestPlan1.pdf>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "Extending Complex Routes Test Plan"
source_file: "Extend_Complex_Routes_TestPlan1.pdf"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Extend_Complex_Routes_TestPlan1.pdf"
doc_id: 852
doc_kind: "Test Plan"
surface: "Pro"
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
keywords: ["complex route", "route extension", "test cases", "euclidian distance", "increment stepping", "looped route"]
tools: []
products: ["Roads & Highways"]
issues: []
related: [{"doc":564,"file":"append-routes-line-order-check-test-plan__doc564.md","s":2.628},{"doc":567,"file":"append-routes-load-routes-by-route-name-test-plan__doc567.md","s":2.566},{"doc":338,"file":"generate-lrs-data-product-create-mileage-report-for-line-networks__doc338.md","s":2.559},{"doc":571,"file":"identify-routes-with-vertex-spacing-issues-test-plan__doc571.md","s":2.396},{"doc":871,"file":"extend-route-tool-user-story__doc871.md","s":2.303}]
```
-->

## Summary

Test plan for extending complex routes using FS and RH data including Caltrans. Contains multiple test cases with left input and right output validation, including Euclidian distance and increment stepping tests. Ensures no looped routes are created as a result of the extension process.

## Related documents

<!-- related:begin -->
- [Append Routes: Line Order Check Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-routes-line-order-check-test-plan__doc564.md>) — similar text 0.06 · 1 title word · 1 filename word · same kind/surface <!-- rel:564 -->
- [Append Routes: Load Routes by Route Name Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-routes-load-routes-by-route-name-test-plan__doc567.md>) — similar text 0.03 · 1 title word · 1 filename word · same kind/surface <!-- rel:567 -->
- [Generate LRS Data Product: Create Mileage Report for Line Networks](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/generate-lrs-data-product-create-mileage-report-for-line-networks__doc338.md>) — similar text 0.10 · same kind/surface <!-- rel:338 -->
- [Identify Routes with Vertex Spacing Issues – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/identify-routes-with-vertex-spacing-issues-test-plan__doc571.md>) — similar text 0.07 · 1 title word · 1 filename word · same kind/surface <!-- rel:571 -->
- [Extend Route Tool User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/extend-route-tool-user-story__doc871.md>) — similar text 0.11 · 1 filename word · same surface/folder <!-- rel:871 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Complex scenarios for route calibration](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-scenarios-for-route-calibration.html) · [Event behavior for route extension](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-behavior-for-route-extension.html)
<!-- docs:end -->

---

                                 Extending complex routes

General

1. Data: FS mostly with RH data including Caltrans

2. Add more test cases once we hear back from DOTs

Testing: Left Input – Right Output

1

2

                                                            1
Testing

3

4

    5

          2
Testing

 6

7

          3
Testing

 8

 9

          4
Testing

     10

    11

          5
Testing

    12

  13

          14

               6
Testing

           15

          16

                7
Testing

          17

     18

               8
Testing

       19

  20

            9
Testing

  21

   22

          10
Testing

     23

    24

          11
Testing

 25

   26

   27

          12
Testing

     28

     29

          13
Testing

  30

  31

          14
Testing

    32

    33

          15
Testing

    34

          Euclidian Distance
          Z Different          Z and X-Y different
          Adding Increment
          Z Different          Z and X-Y different
          Stepping Increment
          Z Different          Z and X-Y different

           A looped route should not be
           created as a result

                                                     16
