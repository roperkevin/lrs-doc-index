# Create Route AI Assistant Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [CreateRoute_AI_Assistant_TestPlan1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/CreateRoute_AI_Assistant_TestPlan1.pptx>) |
| **Edited** | 2025-12-09 21:27 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Create Route AI Assistant Test Plan"
source_file: "CreateRoute_AI_Assistant_TestPlan1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/CreateRoute_AI_Assistant_TestPlan1.pptx"
doc_id: 98
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Rahul Rakshit"
last_edited_by: "Rahul Rakshit"
last_edited: "2025-12-09T21:27:14Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["create route", "route creation", "centerlines", "route id", "network", "date validation", "input validation", "error handling", "complex routes", "gapped routes", "route calibration", "location referencing"]
tools: ["Create Route"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":86,"file":"create-route-in-line-network-and-multifield-network-with-additional-attributes__doc86.md","s":7.741},{"doc":51,"file":"realign-route-ai-assistant-test-plan__doc51.md","s":5.581},{"doc":80,"file":"realign-route-ai-assistant-test-plan__doc80.md","s":5.363},{"doc":18,"file":"extend-route-ai-assistant-test-plan__doc18.md","s":5.081},{"doc":4,"file":"retire-route-pro-ai-assistant-test-plan__doc4.md","s":4.636}]
```
-->

## Summary

This document provides a detailed test plan for the Create Route tool in the Location Referencing system within ArcGIS Pro. It covers workflows, input validation, error handling, and user prompts for creating routes with various complexities including gapped and complex shapes. The plan also addresses multi-user editing, licensing, and integration considerations.

## Related documents

<!-- related:begin -->
- [Create Route in Line Network and Multifield Network with Additional Attributes Pro AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/create-route-in-line-network-and-multifield-network-with-additional-attributes__doc86.md>) — similar text 0.51 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:86 -->
- [Realign Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/realign-route-ai-assistant-test-plan__doc51.md>) — similar text 0.40 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:51 -->
- [Realign Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/realign-route-ai-assistant-test-plan__doc80.md>) — similar text 0.45 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:80 -->
- [Extend Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/extend-route-ai-assistant-test-plan__doc18.md>) — similar text 0.40 · 2 title words · same kind/surface/folder <!-- rel:18 -->
- [Retire Route – Pro AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/retire-route-pro-ai-assistant-test-plan__doc4.md>) — similar text 0.21 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:4 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-new-route.html) · [Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html) · [View LRS Network properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-network-properties.html) · [Complex scenarios for route calibration](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-scenarios-for-route-calibration.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-location-referencing-options.html)
<!-- docs:end -->

---

## Slide 1

## Slide 2

![Interface screenshot redrawn as a standardized wireframe: 3 panels, 8 icons, 48 text rows. 47 of 48 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc929_slide2_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 2 panels, 4 fields, 2 buttons, 8 row separators, 8 icons, 27 text rows. 25 of 27 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc929_slide2_fig2.svg)

Note

- Test only in feature services
- Test on RH data with single field route id
- Projected and unprojected data with 3D
- Use multiple centerlines to create a route
- Test with spelling mistakes
- Gapped and multiple gapped route creation
- Complex routes such as lollipops, loops, alpha, branch, infinity with all the variations using multiple centerlines and gaps
- Centerlines that are not always in the same direction
- Test with local scene
- Verify that the create route form only opens when no error exists in the input parameters

![image2.png](../media/doc929_image2.png) ![image3.png](../media/doc929_image3.png)

## Slide 3

![Interface screenshot redrawn as a standardized wireframe: 7 panels, 2 icons, 25 text rows. 15 of 25 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc929_slide3.svg)

Workflow for centerlines

![image4.png](../media/doc929_image4.png)

## Slide 4

![Diagram drawn from the slide's own shapes: 21 nodes (Route, Route Network, Network Route, Road Network), 1 connector.](../media/doc929_slide4.svg)

Centerlines
Network*
Route ID
AI Assistant should ask for
*When more than one network is present

## Slide 5

Centerlines
Network*
Route ID
AI Assistant should ask for
*When more than one network is present
No input provided

| Create a Route | Build a Datum | Form a new Road |
| --- | --- | --- |
| Create a Route Network | Build a Road Network | Form a new Network Route |
| Create a Highway | Build a Network | Form a new Roadway |
| Create a Road | Build new Route | Form a new Datum |
| Create a Network Route | Build new Route Network | Form a new Road Network |
| Create a Roadway | Build new Highway | Form a new Network |
| Create a Datum | Build new Road | Make a Route |
| Create a Road Network | Build new Network Route | Make a Route Network |
| Create a Network | Build new Roadway | Make a Highway |
| Create new Route | Build new Datum | Make a Road |
| Create new Route Network | Build new Road Network | Make a Network Route |
| Create new Highway | Build new Network | Make a Roadway |
| Create new Road | Generate a Route | Make a Datum |
| Create new Network Route | Generate a Route Network | Make a Road Network |
| Create new Roadway | Generate a Highway | Make a Network |
| Create new Datum | Generate a Road | Make new Route |
| Create new Road Network | Generate a Network Route | Make new Route Network |
| Create new Network | Generate a Roadway | Make new Highway |
| Produce a Route | Generate a Datum | Make new Road |
| Produce a Route Network | Generate a Road Network | Make new Network Route |
| Produce a Highway | Generate a Network | Make new Roadway |
| Produce a Road | Generate new Route | Make new Datum |
| Produce a Network Route | Generate new Route Network | Make new Road Network |
| Produce a Roadway | Generate new Highway | Make new Network |
| Produce a Datum | Generate new Road | Add a Route |
| Produce a Road Network | Generate new Network Route | Add a Route Network |
| Produce a Network | Generate new Roadway | Add a Highway |
| Produce new Route | Generate new Datum | Add a Road |
| Produce new Route Network | Generate new Road Network | Add a Network Route |
| Produce new Highway | Generate new Network | Add a Roadway |
| Produce new Road | Form a Route | Add a Datum |
| Produce new Network Route | Form a Route Network | Add a Road Network |
| Produce new Roadway | Form a Highway | Add a Network |
| Produce new Datum | Form a Road | Add new Route |

Prompts shown with red color should not open the create route tool

## Slide 6

Centerlines
Network*
Route ID
AI Assistant should ask for
*When more than one network is present
No input provided

| Produce new Road Network | Form a Network Route | Add new Route Network |
| --- | --- | --- |
| Produce new Network | Form a Roadway | Add new Highway |
| Build a Route | Form a Datum | Add new Road |
| Build a Route Network | Form a Road Network | Add new Network Route |
| Build a Highway | Form a Network | Add new Roadway |
| Build a Road | Form a new Route | Add new Datum |
| Build a Network Route | Form a new Route Network | Add new Road Network |
| Build a Roadway | Form a new Highway | Add new Network |
| Create Route for LRS | Build Road for LRS | Form a Datum for LRS |
| Create Route Network for LRS | Build Network Route for LRS | Form a Road Network for LRS |
| Create Highway for LRS | Build Roadway for LRS | Form a Network for LRS |
| Create Road for LRS | Build Datum for LRS | Make Route for LRS |
| Create Network Route for LRS | Build Road Network for LRS | Make Route Network for LRS |
| Create Roadway for LRS | Build Network for LRS | Make Highway for LRS |
| Create Datum for LRS | Generate Route for LRS | Make Road for LRS |
| Create Road Network for LRS | Generate Route Network for LRS | Make Network Route for LRS |
| Create Network for LRS | Generate Highway for LRS | Make Roadway for LRS |
| Produce Route for LRS | Generate Road for LRS | Make Datum for LRS |
| Produce Route Network for LRS | Generate Network Route for LRS | Make Road Network for LRS |
| Produce Highway for LRS | Generate Roadway for LRS | Make Network for LRS |
| Produce Road for LRS | Generate Datum for LRS | Add Route for LRS |
| Produce Network Route for LRS | Generate Road Network for LRS | Add Route Network for LRS |
| Produce Roadway for LRS | Generate Network for LRS | Add Highway for LRS |
| Produce Datum for LRS | Form a Route for LRS | Add Road for LRS |
| Produce Road Network for LRS | Form a Route Network for LRS | Add Network Route for LRS |
| Produce Network for LRS | Form a Highway for LRS | Add Roadway for LRS |
| Build Route for LRS | Form a Road for LRS | Add Datum for LRS |
| Build Route Network for LRS | Form a Network Route for LRS | Add Road Network for LRS |
| Build Highway for LRS | Form a Roadway for LRS | Add Network for LRS |
| Create an LRS Route | Make an LRS Network Route | Add LRS Route |
| Create an LRS Route Network | Make an LRS Roadway | Add LRS Route Network |
| Create an LRS Highway | Make an LRS Datum | Add LRS Highway |
| Create an LRS Road | Make a new LRS Route | Add LRS Road |
| Create an LRS Network Route | Make a new LRS Route Network | Add LRS Network Route |

Prompts shown with red color should not open the create route tool

## Slide 7

Centerlines
Network*
Route ID
AI Assistant should ask for
*When more than one network is present
No input provided

| Create an LRS Roadway | Make a new LRS Highway | Add LRS Roadway |
| --- | --- | --- |
| Create an LRS Datum | Make a new LRS Road | Add LRS Datum |
| Create a new LRS Route | Make a new LRS Network Route | Build a new LRS Datum |
| Create a new LRS Route Network | Make a new LRS Roadway | Build LRS Route |
| Create a new LRS Highway | Make a new LRS Datum | Build LRS Route Network |
| Create a new LRS Road | Make LRS Route | Build LRS Highway |
| Create a new LRS Network Route | Make LRS Route Network | Build LRS Road |
| Create a new LRS Roadway | Make LRS Highway | Build LRS Network Route |
| Create a new LRS Datum | Make LRS Road | Build LRS Roadway |
| Create LRS Route | Make LRS Network Route | Build LRS Datum |
| Create LRS Route Network | Make LRS Roadway | Form an LRS Route |
| Create LRS Highway | Make LRS Datum | Form an LRS Route Network |
| Create LRS Road | Add an LRS Route | Form an LRS Highway |
| Create LRS Network Route | Add an LRS Route Network | Form an LRS Road |
| Create LRS Roadway | Add an LRS Highway | Form an LRS Network Route |
| Create LRS Datum | Add an LRS Road | Make an LRS Route |
| Produce an LRS Route | Add an LRS Network Route | Make an LRS Route Network |
| Produce an LRS Route Network | Produce an LRS Roadway | Make an LRS Highway |
| Produce an LRS Highway | Produce an LRS Datum | Make an LRS Road |
| Produce an LRS Road | Produce a new LRS Route | Form an LRS Datum |
| Produce an LRS Network Route | Produce a new LRS Route Network | Form a new LRS Route |
| Build an LRS Route | Produce a new LRS Highway | Form a new LRS Route Network |
| Build an LRS Route Network | Produce a new LRS Road | Form a new LRS Highway |
| Build an LRS Highway | Produce a new LRS Network Route | Form a new LRS Road |
| Build an LRS Road | Produce a new LRS Roadway | Form a new LRS Network Route |
| Build an LRS Network Route | Produce a new LRS Datum | Form a new LRS Roadway |
| Build an LRS Roadway | Produce LRS Route | Form a new LRS Datum |
| Build an LRS Datum | Produce LRS Route Network | Add an LRS Roadway |
| Build a new LRS Route | Produce LRS Highway | Add an LRS Datum |
| Build a new LRS Route Network | Produce LRS Road | Add a new LRS Route |
| Build a new LRS Highway | Produce LRS Network Route | Add a new LRS Route Network |
| Build a new LRS Road | Produce LRS Roadway | Add a new LRS Highway |
| Build a new LRS Network Route | Produce LRS Datum | Add a new LRS Road |
| Build a new LRS Roadway | Form an LRS Roadway | Add a new LRS Network Route |
| Add a new LRS Roadway | Add a new LRS Datum |  |

Prompts shown with red color should not open the create route tool

## Slide 8

![Diagram drawn from the slide's own shapes: 21 nodes (Route, Route Network, Network Route, Road Network), 1 connector.](../media/doc929_slide8.svg)

Centerlines
Network*
Route ID

AI Assistant should ask for
*When only one network is present

## Slide 9

![Diagram drawn from the slide's own shapes: 19 nodes (Route, &lt;Network Name&gt;, Road, Datum), 1 connector.](../media/doc929_slide9.svg)

AI Assistant should ask for
<Network Name> Network

## Slide 10

![Diagram drawn from the slide's own shapes: 26 nodes (Route, Road, Datum, Roadway), 3 connectors.](../media/doc929_slide10.svg)

AI Assistant should ask for
Between 101 to 108
Between 101 - 108

## Slide 11

![Diagram drawn from the slide's own shapes: 24 nodes (Route, Road, Datum, Roadway), 2 connectors.](../media/doc929_slide11.svg)

Centerlines
Network*
Route ID
AI Assistant should ask for
January 1st, 2000
*When more than one network is present

## Slide 12

![Diagram drawn from the slide's own shapes: 22 nodes (Route, Road, Datum, Roadway), 2 connectors.](../media/doc929_slide12.svg)

Route ID is provided
AI Assistant should ask for
Route ID = R1

## Slide 13

![Diagram drawn from the slide's own shapes: 22 nodes (Route, Road, Datum, Roadway), 3 connectors.](../media/doc929_slide13.svg)

Route ID is provided
AI Assistant should ask for
Route ID = R1

If Route Name is not configured for the Network, then consider this as Route ID

## Slide 14

![Diagram drawn from the slide's own shapes: 25 nodes (Route, Road, Datum, Roadway), 2 connectors.](../media/doc929_slide14.svg)

Route ID and Network provided
AI Assistant should ask for
*When more than one network is present
Route ID = R1

<Network Name> Network

## Slide 15

![Diagram drawn from the slide's own shapes: 25 nodes (Route, Road, Datum, Roadway), 1 connector.](../media/doc929_slide15.svg)

Route ID and Network provided
AI Assistant should ask for
*When more than one network is present
Route ID = R1

<Network Name> Network

## Slide 16

![Diagram drawn from the slide's own shapes: 33 nodes (Route, Road, Datum, Roadway), 1 connector.](../media/doc929_slide16.svg)

Route ID, Network and Date provided
AI Assistant should ask for
*When more than one network is present
Route ID = R1

<Network Name> Network
January 1st, 2000

## Slide 17

![Diagram drawn from the slide's own shapes: 43 nodes (Route, Road, Datum, Roadway), 6 connectors.](../media/doc929_slide17.svg)

Route ID, Centerlines Network and Date provided
Route ID = R1

<Network Name> Network
January 1st, 2000
Populate and open the Create Route form
Between 101 to 108
Between 101 - 108

## Slide 18

![Diagram drawn from the slide's own shapes: 35 nodes (Route, Road, Datum, Roadway), 6 connectors.](../media/doc929_slide18.svg)

Route ID, Centerlines and Network provided
Route ID = R1

<Network Name> Network
Populate with today’s date and open the Create Route form
Between 101 to 108
Between 101 - 108

If Route Name is not configured for the Network, then consider this as Route ID

## Slide 19

![Diagram drawn from the slide's own shapes: 40 nodes (Route, Road, Datum, Roadway), 7 connectors.](../media/doc929_slide19.svg)

Route ID, Centerlines, From and To Measures and  Network provided
Route ID = R1

<Network Name> Network
Populate with today’s date and open the Create Route form
Between 101 to 108
Between 101 - 108

From Measure 0 and to Measure 0.892
Measures 0  and 0.892
0 and 0.892 as measures
0 and 0.892 as From and To measures

## Slide 20

![Diagram drawn from the slide's own shapes: 47 nodes (Route, Road, Datum, Roadway), 6 connectors.](../media/doc929_slide20.svg)

Route ID, Centerlines, From and To Measures, Network and date provided
Route ID = R1
<Network Name> Network
Populate and open the Create Route form
Between 101 to 108
Between 101 - 108

From Measure 0 and to Measure 0.892
Measures 0  and 0.892
0 and 0.892 as measures
0 and 0.892 as From and To measures
January 1st, 2000

## Slide 21

![Diagram drawn from the slide's own shapes: 48 nodes (Route, Road, Datum, Roadway), 7 connectors.](../media/doc929_slide21.svg)

Route ID, Centerlines, From and To Measures, Network and date provided
Route ID = R1
<Network Name> Network
Populate and open the Create Route form
Between 101 to 108
Between 101 - 108

From Measure 0 and to Measure 0.892
Spanning Measures 0  and 0.892
0 and 0.892 as measures
0 and 0.892 as From and To measures
January 1st, 2000

## Slide 22

Route ID, Centerlines, From and To Measures, Network and date provided
AI Assistant should
Populate and open the Create Route form

## Slide 23

Route ID, Centerlines, From and To Measures, Network and date provided
AI Assistant should
Populate and open the Create Route form

## Slide 24

![Diagram drawn from the slide's own shapes: 48 nodes (Route, Road, Datum, Roadway), 7 connectors.](../media/doc929_slide24.svg)

Route ID, Centerlines, From and To Measures, Network and date provided but LR license not available
Not show any info
Route ID = R1
<Network Name> Network
Between 101 to 108
Between 101 - 108

From Measure 0 and to Measure 0.892
Spanning Measures 0  and 0.892
0 and 0.892 as measures
0 and 0.892 as From and To measures
January 1st, 2000

## Slide 25

![Diagram drawn from the slide's own shapes: 48 nodes (Route, Road, Datum, Roadway), 7 connectors.](../media/doc929_slide25.svg)

Route ID, Centerlines, From and To Measures, Network and date provided but From Measure = To Measure, From Measure > Measure
Inform the user about the issue with the measures and ask them to provide valid measures
Route ID = R1
<Network Name> Network
Between 101 to 108
Between 101 - 108

From Measure 0 and to Measure 0.892
Spanning Measures 0  and 0.892
0 and 0.892 as measures
0 and 0.892 as From and To measures
January 1st, 2000

## Slide 26

![Diagram drawn from the slide's own shapes: 48 nodes (Route, Road, Datum, Roadway), 7 connectors.](../media/doc929_slide26.svg)

Route ID, Centerlines, From and To Measures, Network and date provided but centerlines OIDs are invalid (text, same ids, incorrect clause etc.)
Inform the user about the issue with the CL OIDs and ask them to provide valid IDs
Route ID = R1
<Network Name> Network
Between 101 to 108
Between 101 - 108

From Measure 0 and to Measure 0.892
Spanning Measures 0  and 0.892
0 and 0.892 as measures
0 and 0.892 as From and To measures
January 1st, 2000

## Slide 27

![Diagram drawn from the slide's own shapes: 48 nodes (Route, Road, Datum, Roadway), 7 connectors.](../media/doc929_slide27.svg)

Route ID, Centerlines, From and To Measures, Network and date provided but Route ID already exists for the provided date
Inform that the route already exists and a new route ID should be provided
Route ID = R1
<Network Name> Network
Between 101 to 108
Between 101 - 108

From Measure 0 and to Measure 0.892
Spanning Measures 0  and 0.892
0 and 0.892 as measures
0 and 0.892 as From and To measures
January 1st, 2000

## Slide 28

![Diagram drawn from the slide's own shapes: 35 nodes (Route, Road, Datum, Roadway), 5 connectors.](../media/doc929_slide28.svg)

Route ID, Centerlines and Network provided but the object IDs do not exist
Route ID = R1

<Network Name> Network
Provide a message that the object IDs do not exist
Between 101 to 108
Between 101 - 108

## Slide 29

![Diagram drawn from the slide's own shapes: 35 nodes (Route, Road, Datum, Roadway), 6 connectors.](../media/doc929_slide29.svg)

Route ID, Centerlines and Network provided but the object IDs cause non monotonic route
Route ID = R1

<Network Name> Network
Provide a message that chosen centerlines will result in a non monotonic route, so provide new centerlines
Between 101 to 108
Between 101 - 108

If Route Name is not configured for the Network, then consider this as Route ID

## Slide 30

![Diagram drawn from the slide's own shapes: 48 nodes (Route, Road, Datum, Roadway), 7 connectors.](../media/doc929_slide30.svg)

Route ID, Centerlines, From and To Measures, Network and date provided but the date has issues such as From Date is in incorrect format or typo that can’t be fixed by AI
Ask to provide a valid date
Route ID = R1
<Network Name> Network
Between 101 to 108
Between 101 - 108

From Measure 0 and to Measure 0.892
Spanning Measures 0  and 0.892
0 and 0.892 as measures
0 and 0.892 as From and To measures
January 1st, 2000

## Slide 31

![Diagram drawn from the slide's own shapes: 48 nodes (Route, Road, Datum, Roadway), 7 connectors.](../media/doc929_slide31.svg)

Route ID, Centerlines, From and To Measures, Network and date provided but more than one issue exists for the inputs
List all the issues that are causing errors in the create route form one at a time.
Route ID = R1
<Network Name> Network
Between 101 to 108
Between 101 - 108

From Measure 0 and to Measure 0.892
Spanning Measures 0  and 0.892
0 and 0.892 as measures
0 and 0.892 as From and To measures
January 1st, 2000

## Slide 32

![Diagram drawn from the slide's own shapes: 48 nodes (Route, Road, Datum, Roadway), 7 connectors.](../media/doc929_slide32.svg)

Route ID, Centerlines, From and To Measures, Network and date provided but Network and Centerline FC are not present in the map
Ask the user to add the Network and the Centerline FC to the map.
Route ID = R1
<Network Name> Network
Between 101 to 108
Between 101 - 108

From Measure 0 and to Measure 0.892
Spanning Measures 0  and 0.892
0 and 0.892 as measures
0 and 0.892 as From and To measures
January 1st, 2000

## Slide 33

![Interface screenshot redrawn as a standardized wireframe: 2 panels, 4 fields, 2 buttons, 8 row separators, 8 icons, 27 text rows. 25 of 27 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc929_slide33.svg)

- How do I access and activate the Create Route in the Location Referencing tab?
- What are the prerequisite steps before creating a route in an LRS network?
- Explain the difference between the ‘Create Route’ Geoprocessing and editing tools.
- What license is required to create a route in ArcGIS Pro?
- What feature classes must be present on the map before creating a route?
- What is the role of centerline features in route creation?
- Why is it important to ensure centerlines do not overlap in the LRS data model?
- How can centerline features be added to the centerline feature class?
- Where is the Create Route tool located in ArcGIS Pro?
- How does the direction of digitization affect route calibration?
- How is the To Measure value calculated by default?
- Walk me through the full workflow of creating a route using the LRS Create Route tool.
- How are the start and end measures calculated for a route in the create route tool?
- Can I provide my own from and to measures for the route in the create route tool?
- What is the use of the ‘Calculate’ buttons in the create route tool?
- How do I change the order of the centerlines in the create route tool?
- How do I add additional attributes for the route when creating it?
- Can I copy ‘additional attributes’ from an existing route when creating a route?
Help Prompts

- What does the ‘flip the direction of the centerlines’ tool do in the create route workflow?
- Is the flipped direction of the centerline permanent once the create route tool is run and edits saved?
- Troubleshoot: The Create Route tool is greyed out. What is preventing me from using it?
- How does the Create Route tool function in a branch-versioned enterprise environment?
- What capabilities must an LRS network be published with to allow route creation via feature services?
- Explain potential conflicts or errors that might arise during a route creation and how to resolve them.
- How does the LRS Create Route tool manage route time slices for historical route data?
- Explain the process for creating a route that has a complex shape such as a roundabout.
- Explain the process for creating a route that has a complex shape such as a lollipop.
- Explain the process for creating a route that has a complex shape such as an alpha.
- Explain the process for creating a route that has a complex shape such as an infinity.
- Explain the process for creating a route that has a complex shape such as a branch.
- What if I Create Route a route by mistake? How do I undo or correct the action?
- Provide the official documentation link for the LRS Create Route tool in ArcGIS Pro.
- What user role and permissions are necessary to execute the LRS Create Route tool in an enterprise geodatabase?
- How does the LRS Create Route tool handle routes that overlap temporally (have different time slices)?
- How does the LRS Create Route operation affect the underlying centerline geometry and its direction?

![image2.png](../media/doc929_image2.png)

## Slide 34

![Interface screenshot redrawn as a standardized wireframe: 2 panels, 4 fields, 2 buttons, 8 row separators, 8 icons, 27 text rows. 25 of 27 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc929_slide34.svg)

- Guide me on the reconcile and post workflow after an LRS create route edit in a versioned environment.
- What are common data integrity issues to check for after using the LRS Create Route tool?
- How does the Create Route tool affect routes that have equation points defined?
- Explain the core LRS data model concepts (routes, lines, networks) in the context of creating a route.
- How does the LRS Create Route tool impact external systems that integrate with the LRS data via feature services?
- How do I manage conflicts related to locking when the LRS Create Route tool is used in a multi-user environment?
- Explain the role of conflict prevention during an LRS route creation on branch-versioned data.
- What specific permissions are needed for an editor to use the Create Route tool in an enterprise geodatabase?
- What is the relationship between the centerline direction of digitization and the resulting LRS route direction?
- What are the considerations for 3D or vertical routes when creating a route?
- A warning appears if creating a route introduces physical gaps, and how can I disable it?
Help Prompts

- How can I verify the direction of a route in the LRS network before confirming the creation?
- Provide a checklist of all parameters in the Create Route pane and explain what each one does.
- Explain the significance of the ‘Start Date' field when using the LRS Create Route tool.
- How do I add an ‘End Date’ to the route I just created?
- How do I add centerlines when I do not have them in the centerline feature class when creating a route?
- How do I bring centerlines from a CAD drawing to create a route?
- How is the 3D length calculated when creating a route when the centerlines have z values?
- If the centerlines are in opposite direction when creating a route, then what is the direction of calibration of the resultant route that gets created?
- How do I create a route with gaps?
- Can I define the measures at the start and end points of a gap when creating a route?
- What is the impact of the gap calibration rules when creating a gapped route?

![image2.png](../media/doc929_image2.png)
