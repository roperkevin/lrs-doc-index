# Extending Complex Routes Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 852 · Test Plan · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [Extend_Complex_Routes_TestPlan1.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Extend_Complex_Routes_TestPlan1.pdf>) |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | complex route · route extension · test cases · euclidian distance · increment stepping · looped route |
| **Tools** | — |

## Summary

Test plan for extending complex routes using FS and RH data including Caltrans. Contains multiple test cases with left input and right output validation, including Euclidian distance and increment stepping tests. Ensures no looped routes are created as a result of the extension process.

## Related documents

<!-- related:begin -->
- [Append Routes: Line Order Check Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4975-append-routes-line-order-check.md>) — similar text 0.06 · 1 title word · 1 filename word · same kind/surface <!-- rel:564 s=2.628 -->
- [Append Routes: Load Routes by Route Name Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4855-append-routes-load-routes-by-route-name.md>) — similar text 0.03 · 1 title word · 1 filename word · same kind/surface <!-- rel:567 s=2.566 -->
- [Generate LRS Data Product: Create Mileage Report for Line Networks](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5813-generate-lrs-data-product-create-mileage-report-for-line.md>) — similar text 0.10 · same kind/surface <!-- rel:338 s=2.559 -->
- [Identify Routes with Vertex Spacing Issues – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/identify-routes-with-vertex-spacing-issues.md>) — similar text 0.07 · 1 title word · 1 filename word · same kind/surface <!-- rel:571 s=2.396 -->
- [Extend Route Tool User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/extend-route-tool-user-story__doc871.md>) — similar text 0.11 · 1 filename word · same surface/folder <!-- rel:871 s=2.303 -->
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

A looped route should not be created as a result

                                                     16
