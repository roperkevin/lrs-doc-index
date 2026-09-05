# Standalone GP – Generate Feature Count – Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#6205](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6205) |
| **Source** | [6205_StandaloneGP_FeatureCount_Testplan (1).pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/6205_StandaloneGP_FeatureCount_Testplan%20(1).pptx>) |
| **Edited** | 2025-05-07 23:01 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Standalone GP – Generate Feature Count – Test Plan"
source_file: "6205_StandaloneGP_FeatureCount_Testplan (1).pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/6205_StandaloneGP_FeatureCount_Testplan%20(1).pptx"
doc_id: 173
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: "Mac"
dev: "Michael"
author: "Lakshmi Ananthanarayanan"
last_edited_by: "Claire Wang"
last_edited: "2025-05-07T23:01:27Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["feature count", "geoprocessing", "summary fields", "feature count layers", "route filtering", "output format", "error handling"]
tools: ["Generate Feature Count"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#6205"]
related: [{"doc":253,"file":"feature-count-support-generate-data-gp-tool-test-plan__doc253.md","s":6.465},{"doc":255,"file":"generate-a-route-log-including-spanning-events-and-centerline-test-plan__doc255.md","s":4.718},{"doc":172,"file":"generatelengthsummary-test-plan__doc172.md","s":4.658},{"doc":281,"file":"generate-feature-count-geoprocessing-tool__doc281.md","s":4.604},{"doc":254,"file":"feature-count-template-test-plan__doc254.md","s":4.412}]
```
-->

## Summary

Test plan for the Generate Feature Count geoprocessing tool covering UI verification, functionality verification, documentation, automation, and extensive testing scenarios including positive and negative cases. It verifies tool parameters, network support, summary and feature count layers, output formats, and error handling. The plan includes tests for various route types, filters, overlapping layers, and output validation in different environments.

## Related documents

<!-- related:begin -->
- [Feature Count Support Generate Data GP Tool Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/feature-count-support-generate-data-gp-tool-test-plan__doc253.md>) — similar text 0.55 · 3 title words · 2 filename words · same kind/surface <!-- rel:253 -->
- [Generate a route Log including spanning events and centerline – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/generate-a-route-log-including-spanning-events-and-centerline-test-plan__doc255.md>) — similar text 0.25 · 1 title word · 1 filename word · same kind/surface/dev <!-- rel:255 -->
- [GenerateLengthSummary – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/generatelengthsummary-test-plan__doc172.md>) — similar text 0.31 · 1 filename word · same kind/surface/dev/folder <!-- rel:172 -->
- [Generate Feature Count Geoprocessing Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-feature-count-geoprocessing-tool__doc281.md>) — similar text 0.20 · 3 title words · 2 filename words · same surface <!-- rel:281 -->
- [Feature Count Template Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/feature-count-template-test-plan__doc254.md>) — similar text 0.34 · 2 title words · 2 filename words · same kind/surface <!-- rel:254 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a template for an LRS feature count data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-feature-count-data-product.html)

_No page matched:_ [Generate Feature Count](https://www.google.com/search?q=%22Generate%20Feature%20Count%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Standalone GP – Generate Feature Count – Test Plan

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6205

PE: Mac
Dev: Michael

## Slide 2

![Interface screenshot redrawn as a standardized wireframe: 3 panels, 2 buttons, 2 colour blocks, 10 row separators, 15 icons, 61 text rows. 57 of 61 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc835_slide2.svg)

UI Verification

- Verify tool name “Generate Feature Count”
- Create a toolset “Data Products” that includes the first GP tool and all standalone GP tools --- will not be ready for testing as it needs to be checked in
- Verify tool parameters on the right
  - The style aligns with other GP tools
  - Required and optional parameters
  - Summary Fields has an accordion to add multiple Summary Fields
  - Feature Count Layers has a multi-selection button. Users have at least 1 feature count layer and can add more
Functionality Verification

- Tool outputs a feature count data product
- Tool supports fgdb, dc, and fs input
- Network
  - Dropdown lists all layers, error out when a non-network layer is chosen. The same applies to using the browser button.
  - Support non-line, line, derived, and PoM networks
    - In the output, use Route Name and Line Name for line network; use Route ID for the other 3
  - Support selection sets, time filter and definition queries on the routes
    - Routes selected in a line network: Data product created for the all the routes in the line to which the selected route belongs to. If any routes in the lines are uncalibrated, return 1 row for this route with all entries being null, just like what we did for route log

## Slide 3

![Interface screenshot redrawn as a standardized wireframe: 3 panels, 2 buttons, 2 colour blocks, 10 row separators, 15 icons, 61 text rows. 57 of 61 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc835_slide3.svg)

Functionality Verification

- Effective date
  - Default to today’s date
  - The routes that are present on this date will be used for calculation, including filters, if any
  - No routes exist on the selected date: Empty output is generated with a warning
  - PY: Incorrect date format. Show error message.
  - Test with a route that does not have a 00:00:00 timestamp and check if there is a difference in the output
- Output format can be table or CSV
- Output file location is project folder by default for csv, and default.fgdb by default for table. Users can browse to and provide a different location.
  - CSV can be overwritten in UI and python
  - PY: Cannot overwrite an existing file. Show error message.
  - PY: Provide an invalid path/name. Show error message.

## Slide 4

![Interface screenshot redrawn as a standardized wireframe: 3 panels, 2 buttons, 2 colour blocks, 10 row separators, 15 icons, 61 text rows. 57 of 61 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc835_slide4.svg)

Functionality Verification

- Summary Fields
  - Layer
  - Dropdown lists all layers, error out when an invalid layer is chosen. The same applies to using the browser button.
  - Eligible layers: only Polygons and line events registered to the network; Must be in the same database/fs as the Network; Must have the same projection system as the Network
  - No limit of # of layers (for testing, add 4 at most)
  - Support selection sets, time filter and definition query
  - Field
  - List non-system fields in dropdown. This field’s value will be used to summarize
  - Name in table
  - By default, the same value as Field. Users can change it
  - If users leave it empty, error out
- If no location layer is intersecting the selected routes, then it’s value in the output is “Unclassified”.
- Users can have none, single, or multiple Summary fields by using the multi-selection button. (see 13 on next page for details)
- Double count when feature exists in overlapping polygons

## Slide 5

![Interface screenshot redrawn as a standardized wireframe: 3 panels, 2 buttons, 2 colour blocks, 10 row separators, 15 icons, 61 text rows. 57 of 61 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc835_slide5.svg)

Functionality Verification

- Feature Count Layers
  - Layer
  - Dropdown lists all layers, error out when an invalid layer is chosen. The same applies to using the browser button.
  - Eligible layers: only intersections, line and point events that are present in the same database/fs as the Network and registered with the network with the same projection
  - No limit of layers added
  - Support selection sets, time filter and definition query
  - Name in table
  - By default, the layer name. Users can change it
  - If users leave it empty, error out
- Users can have none, single, or multiple feature count layers by using the multi-selection Button – It will pop up a pane with all layers. Users can delete a feature count layer. Validate when layers are added.
  - Take Merge gp tool as an example for the multi-selection button. e.g. every time the button opens a pane, all layers are unchecked and selectable, so users are able to add duplicate layers but this results in an error
- Count overlapping events
- Count intersection for each intersecting route
- The feature count fields in the output are placed in the order they were added in the tool

## Slide 6

![Interface screenshot redrawn as a standardized wireframe: 3 panels, 2 buttons, 2 colour blocks, 10 row separators, 14 icons, 61 text rows. 57 of 61 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc835_slide6.svg)

Functionality Verification

- Exclude null summary rows is checked by default. If all the feature count fields in a row have a value of 0, then exclude that row from the output
- Automatically, provide the column totals in the output
- Users can cancel the tool run
- Show a progress bar when the tool is running
- Test with layers that have , in Name in table (for summary and feature count layers), and make sure output does not have indentation issues

Documentation
New GP doc
Mention in related topics – existing GP & Feature Count Template

Automation
New GP automation

## Slide 7

Testing

- Test in fgdb, egdb (oracle + sql), fs - default and versions
- Focus testing with RH, APR, APRUN (GCS) and ADM
- Test with these routes: Types of Routes: Normal, Gapped, Multi-gapped, Self intersecting, Having z values, overlapping
- Test with everything (spanning and non spanning line events, point events and intersections)
- Test with polygon and line summary layers and combinations
- Test the case where the route does not intersect any summary layer
- Test without summary fields
- Test with and without route selection, time filter and definition query on the network, summary layer and feature count layers
- Test a few cases with overlapping count layers
- Test few case with overlapping and gapped summary layers
- Test with all the line and point events and intersection present in the longest route of the dataset
- Test with python and model builder

## Slide 8

Negative cases

- Network is invalid (UI and py)
- Output format is invalid/empty (py only)
- Output file is invalid/empty (py only)
- Cannot overwrite output file (py only)
- Effective date is invalid (py only) if empty in py, default to today’s date
- Summary layer is invalid (py only)
- Summary layer (line) is not registered as a line event to the selected network (UI and py)
- Summary field is empty (UI)
- Summary field is invalid (py only)
- Summary field name in table is empty (UI and py)
- Summary field name in table is invalid (py only)
- No Feature Count layer is configured (UI and py)
- Feature Count layer is not registered to the network (UI and py)
- Feature Count layer is invalid (py only)
- Feature Count layer field name in table is empty (UI and py)
- Feature Count layer field name in table is invalid (py only)
- Exclude null Boolean parameter is invalid (py only)
- Duplicate layers selected as summary layer (UI and py)
- Duplicate layers selected as feature count layer (UI and py)

## Slide 9 — Positive test cases

Use the same data for testing Feature Count in Generate LRS Data Product GP tools. Make sure you yield the same, correct results.

The basic test cases and additional test scenarios are copied from the first Feature Count user story with minor modifications.

## Slide 10

![Diagram drawn from the slide's own shapes: 15 nodes (Map, Event, Route, Template), 2 connectors.](../media/doc835_slide10.svg)

| Route ID | Event ID | From Date | To Date | Measure | Speed Sign | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | 1 | 1/1/2000 | Null | 5 | 45 | No error |
| R1 | 2 | 1/1/2000 | Null | 10 | 65 | No error |
| R1 | 3 | 1/1/2000 | Null | 35 | 65 | No error |
| R1 | 4 | 1/1/2000 | Null | 40 | 65 | No error |
| R1 | 5 | 1/1/2020 | Null | 55 | 45 | No error |
| R2 | 6 | 1/1/2010 | Null | 8 | 40 | No error |

| Route ID | From Date | To Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |
| R2 | 1/1/2010 | Null |

| Input Route Features |  |
| --- | --- |
| Effective date | 1/3/2025 |
| Summary |  |

| Summary Layers | City |  |
| --- | --- | --- |
| Count Layers | Signs | Filter Sign Type = Speed Limit |

| City | Route ID | Speed Signs |
| --- | --- | --- |
| City1 | R1 | 2 |
| City2 | R1 | 2 |
| Unclassified | R1 | 1 |
| City1 | R2 | 1 |

Basic Test: Summary from Template

## Slide 11

![Diagram drawn from the slide's own shapes: 15 nodes (Map, Event, Route, Template), 2 connectors.](../media/doc835_slide11.svg)

| Route ID | Event ID | From Date | To Date | Measure | Speed Sign | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | 1 | 1/1/2000 | Null | 5 | 45 | No error |
| R1 | 2 | 1/1/2000 | Null | 10 | 65 | No error |
| R1 | 3 | 1/1/2000 | Null | 35 | 65 | No error |
| R1 | 4 | 1/1/2000 | Null | 40 | 65 | No error |
| R1 | 5 | 1/1/2020 | Null | 55 | 45 | No error |
| R2 | 6 | 1/1/2010 | Null | 8 | 40 | No error |

| Route ID | From Date | To Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |
| R2 | 1/1/2010 | Null |

| Input Route Features |  |
| --- | --- |
| Effective date | 1/3/2025 |
| Summary | City |

| Count Layers | Signs | Filter Sign Type = Speed Limit |
| --- | --- | --- |

| City | Route ID | Speed Signs |
| --- | --- | --- |
| City1 | R1 | 2 |
| City2 | R1 | 2 |
| Unclassified | R1 | 1 |
| City1 | R2 | 1 |

Basic Test: Summary from GP tool

## Slide 12

![Diagram drawn from the slide's own shapes: 15 nodes (Map, Event, Route, Template), 2 connectors.](../media/doc835_slide12.svg)

| Route ID | Event ID | From Date | To Date | Measure | Speed Sign | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | 1 | 1/1/2000 | Null | 5 | 45 | No error |
| R1 | 2 | 1/1/2000 | Null | 10 | 65 | No error |
| R1 | 3 | 1/1/2000 | Null | 35 | 65 | No error |
| R1 | 4 | 1/1/2000 | Null | 40 | 65 | No error |
| R1 | 5 | 1/1/2020 | Null | 55 | 45 | No error |
| R2 | 6 | 1/1/2010 | Null | 8 | 40 | No error |

| Route ID | From Date | To Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |
| R2 | 1/1/2010 | Null |

| Input Route Features |  |
| --- | --- |
| Effective date | 1/3/2025 |
| Summary |  |

| Summary Layers |  |  |
| --- | --- | --- |
| Count Layers | Signs | Filter Sign Type = Speed Limit |

| Route ID | Speed Signs |
| --- | --- |
| R1 | 5 |
| R2 | 1 |

No summary layer used in template or GP

## Slide 13

![Diagram drawn from the slide's own shapes: 15 nodes (Map, Event, Route, Template), 2 connectors.](../media/doc835_slide13.svg)

| Route ID | Event ID | From Date | To Date | Measure | Speed Sign | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | 1 | 1/1/2000 | Null | 5 | 45 | No error |
| R1 | 2 | 1/1/2000 | Null | 10 | 65 | No error |
| R1 | 3 | 1/1/2000 | Null | 35 | 65 | No error |
| R1 | 4 | 1/1/2000 | Null | 40 | 65 | No error |
| R1 | 5 | 1/1/2020 | Null | 55 | 45 | No error |
| R2 | 6 | 1/1/2010 | Null | 8 | 40 | No error |

| Route ID | From Date | To Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |
| R2 | 1/1/2010 | Null |

| Input Route Features |  |
| --- | --- |
| Effective date | 1/3/2025 |
| Summary |  |

| Summary Layers | City |  |
| --- | --- | --- |
| Count Layers | Signs | Filter Sign Type = Speed Limit AND Sign TEXT = “65” |

| City | Route ID | Speed Signs |
| --- | --- | --- |
| City1 | R1 | 1 |
| City2 | R1 | 2 |

Multi field filter in the template for the count layer

## Slide 14

![Diagram drawn from the slide's own shapes: 15 nodes (Map, Event, Route, Template), 2 connectors.](../media/doc835_slide14.svg)

| Route ID | Event ID | From Date | To Date | Measure | Speed Sign | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | 1 | 1/1/2000 | Null | 5 | 45 | No error |
| R1 | 2 | 1/1/2000 | Null | 10 | 65 | No error |
| R1 | 3 | 1/1/2000 | Null | 35 | 65 | No error |
| R1 | 4 | 1/1/2000 | Null | 40 | 65 | No error |
| R1 | 5 | 1/1/2020 | Null | 55 | 45 | No error |
| R2 | 6 | 1/1/2010 | Null | 8 | 40 | No error |

| Route ID | From Date | To Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |
| R2 | 1/1/2010 | Null |

| Input Route Features | Filter Route ID = R2 |
| --- | --- |
| Effective date | 1/3/2025 |

| Summary Layers | City |  |
| --- | --- | --- |
| Count Layers | Signs | Filter Sign Type = Speed Limit |

| City | Route ID | Speed Signs |
| --- | --- | --- |
| City1 | R2 | 1 |

Filtering routes in the GP tool

## Slide 15

![Diagram drawn from the slide's own shapes: 15 nodes (Map, Event, Route, Template), 2 connectors.](../media/doc835_slide15.svg)

| Route ID | Event ID | From Date | To Date | Measure | Speed Sign | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | 1 | 1/1/2000 | Null | 5 | 45 | No error |
| R1 | 2 | 1/1/2000 | Null | 10 | 65 | No error |
| R1 | 3 | 1/1/2000 | Null | 35 | 65 | No error |
| R1 | 4 | 1/1/2000 | Null | 40 | 65 | No error |
| R1 | 5 | 1/1/2020 | Null | 55 | 45 | No error |
| R2 | 6 | 1/1/2010 | Null | 8 | 40 | No error |

| Route ID | From Date | To Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |
| R2 | 1/1/2010 | Null |

| Input Route Features |  |
| --- | --- |
| Effective date | 1/3/2025 |

| Summary Layers | City | Filter City Name= City1 |
| --- | --- | --- |
| Count Layers | Signs | Filter Sign Type = Speed Limit |

| City | Route ID | Speed Signs |
| --- | --- | --- |
| City1 | R1 | 2 |
| City1 | R2 | 1 |

Using a filter for summary layer in template

## Slide 16

![Diagram drawn from the slide's own shapes: 14 nodes (Map, Event, Route, Template), 2 connectors.](../media/doc835_slide16.svg)

| Route ID | Event ID | From Date | To Date | Measure | Speed Sign | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | 1 | 1/1/2000 | Null | 5 | 45 | No error |
| R1 | 2 | 1/1/2000 | Null | 10 | 65 | No error |
| R1 | 3 | 1/1/2000 | Null | 35 | 65 | No error |
| R1 | 4 | 1/1/2000 | 12/31/2005 | 40 | 65 | No error |
| R1 | 5 | 1/1/2020 | Null | 55 | 45 | No error |
| R2 | 6 | 1/1/2010 | Null | 8 | 40 | No error |

| Route ID | From Date | To Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |
| R2 | 1/1/2010 | Null |

| Input Route Features |  |
| --- | --- |
| Effective date | 1/3/2025 |
| Summary |  |

| Summary Layers | City |  |
| --- | --- | --- |
| Count Layers | Signs | Filter Sign Type = Speed Limit |

| City | Route ID | Speed Signs |
| --- | --- | --- |
| City1 | R1 | 2 |
| City2 | R1 | 1 |
| Unclassified | R1 | 1 |
| City1 | R2 | 1 |

Testing with a time slice: Retired event not included in count

## Slide 17

![Diagram drawn from the slide's own shapes: 12 nodes (Event, Route, Template, GP), 1 connector.](../media/doc835_slide17.svg)

| Route ID | Event ID | From Date | To Date | From Measure | To Measure | Functional Class | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1 | 1/1/2000 | Null | 5 | 15 | Local | No error |
| R1 | 2 | 1/1/2000 | Null | 15 | 34 | Arterial | No error |
| R1 | 3 | 1/1/2000 | Null | 46 | 51 | Local | No error |

| Route ID | From Date | To Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |

| Input Route Features |  |
| --- | --- |
| Effective date | 12/31/2022 |
| Summary |  |

| Summary Layers | City |
| --- | --- |
| Count Layers | Functional Class |

| City | Route ID | Speed Signs |
| --- | --- | --- |
| City1 | R1 | 2 |
| City2 | R1 | 1 |
| Unclassified | R1 | 1 |

## Slide 18

Other Tests

## Slide 19

![Diagram drawn from the slide's own shapes: 4 connectors, 4 freeform paths.](../media/doc835_slide19.svg)

Other Tests -2
Overlapping layers
What if a point event/intersection is located at the boundary of two summary polygons or overlapping polygons: Double count
Count overlapping events
Count intersections for each intersecting route
Test with complete dataset – do not test only a few routes
