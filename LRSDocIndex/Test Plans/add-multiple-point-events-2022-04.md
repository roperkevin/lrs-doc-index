# Add Multiple Point Events

| Field | Value |
| --- | --- |
| **Doc** | 672 · Test Plan · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [AddMulitiplePoint_Events_Pro.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/AddMulitiplePoint_Events_Pro.pptx>) |
| **People** | author Rahul Rakshit · PE — · dev — |
| **Edited** | 2022-04-06 18:32 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | point event · route · measure · attribute set · feature service · error handling · event dates |
| **Tools** | — |

## Summary

Test plan for adding multiple point events in ArcGIS Pro feature services. It includes tests for route and measure selection, attribute sets, error handling, unit validation, and event date management across different network configurations and event types.

## Related documents

<!-- related:begin -->
- [Add Multiple Point Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-multiple-point-events-2024-01.md>) — similar text 0.82 · 4 title words · 4 filename words · same kind/folder <!-- rel:434 s=8.352 -->
- [Add Point Event tool/ Add Multipoint Events tool Coordinate offset method – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/3905-add-point-event-tool-add-multipoint-events-tool-coordinate.md>) — similar text 0.22 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:638 s=5.793 -->
- [Create multiple line events: Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/create-multiple-line-events.md>) — similar text 0.30 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:669 s=5.351 -->
- [Experience Builder: Add Single Point Event Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/exb-add-single-point-event-widget.md>) — similar text 0.31 · 2 title words · 2 filename words · same kind/folder <!-- rel:463 s=4.595 -->
- [Add Multiple Point Events tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-multiple-point-events-tool-in-pro.md>) — similar text 0.15 · 4 title words · 2 filename words · same surface <!-- rel:685 s=4.147 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/edit-feature-services.html)
<!-- docs:end -->

---

## Overview

### Slide 1 — Add Multiple Point Events <!-- slide 1 -->

- Test in Feature Service only.
- Test in Line and Non-line Network.
- Test with different Attribute sets (default and custom).
- Verify that the Network dropdown contains only the networks available in the map.
- Verify that the No Network is selected initially.
- Verify the route flashes 3 times, Once it is chosen on the map using the route picker
- Verify the ‘Route Name” is displayed instead of route id for the events configured with route name
- RouteID / Route Name and Measure should be empty until the user types or select using the picker tools.
- Verify that the route selector UI is shown when the user clicks a location with the route picker that has more than one route at that location
- Verify that the route selector UI is shown when the user types in a RouteId/Name which has more than one timeslices.
- Click at a location where no route exists using the picker tools and verify that route name is not populated.
- Verify the route and measure are displayed on hover when the user selects either the Route or Measure pickers to interact with the map.
- Verify that the measure picker is shown when the user picks a location where we have multiple measures.
- Verify that the measures can be typed in.
- Provide a measure with 20 decimal places where only 7 decimal places are allowed and verify that the measure is truncated properly.
- Verify the snapping with route and measure picker.
- Using measure picker click on a route which is not provided and ensure that the measure is not populated.
- Verify that the measure units are set to the network units.
- Provide some measures in stationing format.
- Before selecting the route name or measure, change the units to meters and pick the route and measure values and ensure that the measures units are not changed.
- Wrt the test above change the units to miles, do not change the measure value and validate the value on the units of miles.
- Verify the green/red dot at the location, when a measure on a route is selected on the map using the measure picker.
- Verify that the Effective Date text box is populated with the current date.
- By default, End Date should be empty.
- Test with and without additional attributes for the event fields
- 508 / i18n testing.
- Make sure coded value domains, range domains, subtypes, non nullable fields, and default values for any fields where applicable are honored.
- Test with Contingent values.
- Test with different Attribute rules.

![Figure 1 — Add Multiple Point Events](../media/add-multiple-point-events-2022-04/fig-01-slide-01-add-multiple-point-events.png)
![Figure 2 — Add Multiple Point Events](../media/add-multiple-point-events-2022-04/fig-02-slide-01-add-multiple-point-events.png)

## Test Cases

### TC-U01 — Type a route which is not available in the network and verify the error message. <!-- src: S3 · slide 2 · table · 1 -->

- **ID:** 1
- **Expected Result:** Provide an error
- **Error Message:** The Route ID could not be validated.

### TC-U02 — Provide invalid measures and verify the error message. <!-- src: S3 · slide 2 · table · 2 -->

- **ID:** 2
- **Expected Result:** Provide an error
- **Error Message:** Invalid measure.

### TC-U03 — Verify proper error message is displayed if the user provides only end date. <!-- src: S3 · slide 2 · table · 3 -->

- **ID:** 3
- **Expected Result:** Provide an error
- **Error Message:** Please enter a start date.

### TC-U04 — Verify proper error message is displayed if the user do not provide any dates. <!-- src: S3 · slide 2 · table · 4 -->

- **ID:** 4
- **Expected Result:** Provide an error
- **Error Message:** Please enter a start date.

### TC-U05 — Verify proper error message is displayed if the user clicks on without providing <!-- src: S3 · slide 2 · table · 5 -->

- **ID:** 5
- **Case:** Verify proper error message is displayed if the user clicks on without providing any values.
- **Expected Result:** Provide an error
- **Error Message:** Please enter the Route Name.

## Other content

### Slide 2 — Error message verification <!-- slide 2 -->

| Attribute set Type | Contains Events from | Network in second pane | Result |
| --- | --- | --- | --- |
| Point | Single Network (N1) | Same Network (N1) | Add Events |
| Point | Single Network (N1) | Different Network (N2) | No Events to add - error message |
| Point | Multiple Networks (N1,N2) | Network (N1) | Add Events for layers registered with N1 only |
| Point | Multiple Networks (N1,N2) | Network (N2) | Add Events for layers registered with N2 only |
| Point | Single Network (N1) – Only one Event layer in the attribute set | Same Network (N1) | Add Events |
|  |  |  |  |
|  |  |  |  |

Network and attribute set combination tests

### Slide 3 — Simple Route Point Events <!-- slide 3 -->

| Event Layer | RouteId | EventId | FromDate | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| Layer1 | PR1 | E1 | 1/1/2000 |  | 8 | No Error |
| Layer2 | PR1 | E2 | 1/1/2000 |  | 8 | No Error |
| Layer3 | PR1 | E3 | 1/1/2000 |  | 8 | No Error |

[figure: 0 · 10 · E1 · E2 · E3 · PR1]

![Figure 3 — Simple Route Point Events](../media/add-multiple-point-events-2022-04/fig-03-slide-03-simple-route-point-events.svg)

### Slide 4 — Gap Route Point Events <!-- slide 4 -->

| Event Layer | RouteId | EventId | FromDate | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| Layer1 | PR11 | E11 | 1/1/2000 |  | 4 | No Error |
| Layer2 | PR11 | E12 | 1/1/2000 |  | 4 | No Error |
| Layer3 | PR11 | E13 | 1/1/2000 |  | 4 | No Error |
| Layer1 | PR11 | E14 | 1/1/2000 |  | 4.1 | No Error |
| Layer2 | PR11 | E15 | 1/1/2000 |  | 4.1 | No Error |
| Layer3 | PR11 | E16 | 1/1/2000 |  | 4.1 | No Error |
| Layer1 | PR11 | E17 | 1/1/2000 |  | 6 | No Error |
| Layer2 | PR11 | E18 | 1/1/2000 |  | 6 | No Error |
| Layer3 | PR11 | E19 | 1/1/2000 |  | 6 | No Error |

[figure: 8.1 · 0 · 4.1 · 4 · E11 · PR11 · E12 · E13 · E14 · E15 · E18 · E19 · E16]

![Figure 4 — Gap Route Point Events](../media/add-multiple-point-events-2022-04/fig-04-slide-04-gap-route-point-events.svg)

### Slide 5 — Loop Route Point Events <!-- slide 5 -->

| Event Layer | RouteId | EventId | FromDate | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| Layer1 | PR21 | E21 | 1/1/2000 |  | 4 | No Error |
| Layer2 | PR21 | E22 | 1/1/2000 |  | 4 | No Error |
| Layer3 | PR21 | E23 | 1/1/2000 |  | 4 | No Error |
| Layer1 | PR21 | E24 | 1/1/2000 |  | 2.5 | No Error |
| Layer2 | PR21 | E25 | 1/1/2000 |  | 2.5 | No Error |
| Layer3 | PR21 | E26 | 1/1/2000 |  | 2.5 | No Error |

[figure: 0 · 4 · 1.33 · 2.67 · E21 · PR21 · E22 · E23]

![Figure 5 — Loop Route Point Events](../media/add-multiple-point-events-2022-04/fig-05-slide-05-loop-route-point-events.svg)

### Slide 6 <!-- slide 6 -->

| Event Layer | RouteId | EventId | FromDate | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| Layer1 | PR31 | E31 | 1/1/2000 |  | 6 | No Error |
| Layer2 | PR31 | E32 | 1/1/2000 |  | 6 | No Error |
| Layer3 | PR31 | E33 | 1/1/2000 |  | 6 | No Error |

[figure: Branch Point Events · 6 · 4 · 0 · PR31 · E33 · E31 · E32]

![Figure 6 — 6](../media/add-multiple-point-events-2022-04/fig-06-slide-06-6.svg)

### Slide 7 <!-- slide 7 -->

| Event Layer | RouteId | EventId | FromDate | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| Layer1 | PR41 | E41 | 1/1/2000 |  | 6 | No Error |
| Layer2 | PR41 | E42 | 1/1/2000 |  | 6 | No Error |
| Layer3 | PR41 | E43 | 1/1/2000 |  | 6 | No Error |

[figure: 0 · 8 · 4.33 · 5.67 · 1.5 · 7.5 · Infinity Point Events · PR41 · E42 · E41 · E43]

![Figure 7](../media/add-multiple-point-events-2022-04/fig-07-slide-07.svg)

### Slide 8 — Vertical Gap Route Point Events <!-- slide 8 -->

| Event Layer | RouteId | EventId | FromDate | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| Layer1 | PR51 | E51 | 1/1/2000 |  | 2 | No Error |
| Layer2 | PR51 | E52 | 1/1/2000 |  | 2 | No Error |
| Layer3 | PR51 | E53 | 1/1/2000 |  | 2 | No Error |
| Layer1 | PR51 | E54 | 1/1/2000 |  | 9 | No Error |
| Layer2 | PR51 | E55 | 1/1/2000 |  | 9 | No Error |
| Layer3 | PR51 | E56 | 1/1/2000 |  | 9 | No Error |

[figure: PR51 · E51 · E52 · E53 · E54 · E55 · E56]

![Figure 8 — Vertical Gap Route Point Events](../media/add-multiple-point-events-2022-04/fig-08-slide-08-vertical-gap-route-point-events.png)

![Figure 9 — Vertical Gap Route Point Events](../media/add-multiple-point-events-2022-04/fig-09-slide-08-vertical-gap-route-point-events.svg)

### Slide 9 — Line Network Point Events <!-- slide 9 -->

| Event Layer | RouteId | EventId | FromDate | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| Layer1 | R24L2 | E91 | 1/1/2000 |  | 15 | No Error |
| Layer2 | R24L2 | E92 | 1/1/2000 |  | 15 | No Error |
| Layer3 | R24L2 | E93 | 1/1/2000 |  | 15 | No Error |
| Layer1 | R25L2 | E94 | 1/1/2000 |  | 2 | No Error |
| Layer2 | R25L2 | E95 | 1/1/2000 |  | 2 | No Error |
| Layer3 | R25L2 | E96 | 1/1/2000 |  | 2 | No Error |

[figure: R23L2 · 1 · 2 · 15 · 20 · R24L2 · R25L2 · 0 · E91 · E94 · E92 · E93 · E95 · E96]

![Figure 10 — Line Network Point Events](../media/add-multiple-point-events-2022-04/fig-10-slide-09-line-network-point-events.svg)

### Slide 10 — Point Events – Timeslice <!-- slide 10 -->

| Event Layer | RouteId | EventId | FromDate | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| Layer1 | PR101 | E101 | 1/1/2000 | 1/1/2010 | 16 | No Error |
| Layer2 | PR101 | E102 | 1/1/2000 | 1/1/2010 | 16 | No Error |
| Layer3 | PR101 | E103 | 1/1/2010 | 1/1/2010 | 16 | No Error |
| Layer1 | PR101 | E101 | 1/1/2000 | 1/1/2015 | 16 | No Error |
| Layer2 | PR101 | E102 | 1/1/2000 | 1/1/2015 | 16 | No Error |
| Layer3 | PR101 | E103 | 1/1/2010 | 1/1/2015 | 16 | No Error |

Event dates from 1/1/2000 to 1/1/2015

[figure: 18 · 10 · 14.1 · 14 · E101 · PR101 · 18.1 · 22 · 1/1/2000 · 1/1/2020 · 1/1/2010 · E102 · E103]

![Figure 11 — Point Events – Timeslice](../media/add-multiple-point-events-2022-04/fig-11-slide-10-point-events-timeslice.svg)
