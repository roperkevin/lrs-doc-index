# Create Route in Line Network and Multifield Network with Additional Attributes Pro AI Assistant Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [CreateRoute_AI_Assistant_LineNetwork_TestPlan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/CreateRoute_AI_Assistant_LineNetwork_TestPlan.pptx>) |
| **Edited** | 2025-12-30 19:27 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Create Route in Line Network and Multifield Network with Additional Attributes Pro AI Assistant Test Plan"
source_file: "CreateRoute_AI_Assistant_LineNetwork_TestPlan.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/CreateRoute_AI_Assistant_LineNetwork_TestPlan.pptx"
doc_id: 86
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Rahul Rakshit"
last_edited_by: "Praveen Kumar"
last_edited: "2025-12-30T19:27:31Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["route creation", "line network", "multifield network", "additional attributes", "create route form", "ai assistant", "complex routes"]
tools: ["Create Route"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":98,"file":"create-route-ai-assistant-test-plan__doc98.md","s":7.741},{"doc":51,"file":"realign-route-ai-assistant-test-plan__doc51.md","s":5.738},{"doc":80,"file":"realign-route-ai-assistant-test-plan__doc80.md","s":5.683},{"doc":4,"file":"retire-route-pro-ai-assistant-test-plan__doc4.md","s":4.876},{"doc":50,"file":"arcgis-pro-ai-assistant-realign-route-subsequent-panes-test-plan__doc50.md","s":4.682}]
```
-->

## Summary

Test plan for creating routes in line network and multifield network environments using the Pro AI Assistant. Covers scenarios with additional attributes, multiple centerlines, complex route shapes, and validation of input parameters. Includes workflows for handling missing information, mandatory fields, and versioned environments.

## Related documents

<!-- related:begin -->
- [Create Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/create-route-ai-assistant-test-plan__doc98.md>) — similar text 0.51 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:98 -->
- [Realign Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/realign-route-ai-assistant-test-plan__doc51.md>) — similar text 0.46 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:51 -->
- [Realign Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/realign-route-ai-assistant-test-plan__doc80.md>) — similar text 0.52 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:80 -->
- [Retire Route – Pro AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/retire-route-pro-ai-assistant-test-plan__doc4.md>) — similar text 0.21 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:4 -->
- [ArcGIS Pro AI Assistant: Realign Route Subsequent Panes Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/arcgis-pro-ai-assistant-realign-route-subsequent-panes-test-plan__doc50.md>) — similar text 0.18 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:50 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-new-route.html) · [Complex scenarios for route calibration](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-scenarios-for-route-calibration.html)
<!-- docs:end -->

---

## Slide 1

Create Route in Line Network and Multifield Network with additional attributes Pro AI Assistant Test plan

## Slide 2

![Interface screenshot redrawn as a standardized wireframe: 2 panels, 4 fields, 2 buttons, 8 row separators, 8 icons, 27 text rows. 25 of 27 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc943_slide2.svg)

Note

- Test only in feature services
- Test on RH data with multi field route id with and without additional attributes
- Test on APR Data with line network with and without additional attributes
- Test with PostMile Network with and without additional attributes
- Projected and unprojected data with 3D
- Use multiple centerlines to create a route
- Test with spelling mistakes
- Gapped and multiple gapped route creation
- Complex routes such as lollipops, loops, alpha, branch, infinity with all the variations using multiple centerlines and gaps
- Centerlines that are not always in the same direction
- Test with local scene
- Verify that the create route form only opens when no error exists in the input parameters
- Test with fields having domains, subtypes, attribute rules and contingent values

![image1.png](../media/doc943_image1.png) ![image2.png](../media/doc943_image2.png) ![image3.png](../media/doc943_image3.png)

## Slide 3

![Diagram drawn from the slide's own shapes: 13 nodes (Workflow for Network, Line Network, Network, Multifiled routeid Network), 14 connectors.](../media/doc943_slide3.svg)

Multifiled routeid Network
Is the linename provided
Has all the field  info
Open create route pane with info
Ask the user for linename
Open create route pane with info
Ask the user for missing field info
Mandatory additional attributes
Ask for the mandatory field info
Has all the info

## Slide 4

![Diagram drawn from the slide's own shapes: 46 nodes (Route, Road, Roadway, Highway), 7 connectors.](../media/doc943_slide4.svg)

Route Name, Centerlines Network*, Line Name and Date provided
Route Name = R1

<Network Name> Network
January 1st, 2000
Populate and open the Create Route form
Between 101 to 108
Between 101 - 108

## Slide 5

![Diagram drawn from the slide's own shapes: 42 nodes (Route, Road, Roadway, Highway), 6 connectors.](../media/doc943_slide5.svg)

Route Name, Centerlines, Network*, and Date provided but no line name
AI Assistant should ask for
Route Name = R1

<Network Name> Network
January 1st, 2000
Between 101 to 108
Between 101 - 108

## Slide 6

![Diagram drawn from the slide's own shapes: 41 nodes (Route, Road, Roadway, Highway), 6 connectors.](../media/doc943_slide6.svg)

Route Name, Centerlines Network*, Line Name and Date provided

<Network Name> Network
January 1st, 2000
Populate and open the Create Route form
Between 101 to 108
Between 101 - 108

- Multi field network

## Slide 7

![Diagram drawn from the slide's own shapes: 38 nodes (Route, Road, Roadway, Highway), 6 connectors.](../media/doc943_slide7.svg)

Route Name, Centerlines, Network*, and Date provided but no field info
AI Assistant should ask for

<Network Name> Network
January 1st, 2000
The missing field info
Between 101 to 108
Between 101 - 108

- Multi filed network

## Slide 8

![Diagram drawn from the slide's own shapes: 45 nodes (Route, Road, Roadway, Highway), 7 connectors.](../media/doc943_slide8.svg)

Route ID, Centerlines Network, additional attributes and Date provided
Route ID = R1

<Network Name> Network
January 1st, 2000
Populate and open the Create Route form
Between 101 to 108
Between 101 - 108

## Slide 9

![Diagram drawn from the slide's own shapes: 45 nodes (Route, Road, Roadway, Highway), 7 connectors.](../media/doc943_slide9.svg)

Route ID, Centerlines Network and Date provided with no additional attributes
AI Assistant should ask for
Route ID = R1

<Network Name> Network
January 1st, 2000
For mandatory additional attributes
Between 101 to 108
Between 101 - 108

Network has some mandatory additional attribute fields

## Slide 10

![Diagram drawn from the slide's own shapes: 50 nodes (Route, Road, Roadway, Highway), 8 connectors.](../media/doc943_slide10.svg)

Route Name, Centerlines Network*, Line Name and Date provided
Route Name = R1

<Network Name> Network
January 1st, 2000
Populate and open the Create Route form
Between 101 to 108
Between 101 - 108

- Line network with additional attributes

## Slide 11

![Diagram drawn from the slide's own shapes: 45 nodes (Route, Road, Roadway, Highway), 7 connectors.](../media/doc943_slide11.svg)

Route Name, Centerlines Network*, Line Name and Date provided

<Network Name> Network
January 1st, 2000
Populate and open the Create Route form
Between 101 to 108
Between 101 - 108

- Multi field network with additional attributes

## Slide 12

![Diagram drawn from the slide's own shapes: 51 nodes (Route, Road, Roadway, Highway), 8 connectors.](../media/doc943_slide12.svg)

Route ID, Centerlines, From and To Measures, Network and date provided but Route Name \ Line Name already exists for the provided date
Inform that the route already exists and a new route name \ line name should be provided
<Network Name> Network
Between 101 to 108
Between 101 - 108

From Measure 0 and to Measure 0.892
Spanning Measures 0  and 0.892
0 and 0.892 as measures
0 and 0.892 as From and To measures
January 1st, 2000
Route Name = R1

## Slide 13

Route ID, Centerlines, From and To Measures, Network, Field info, Line name and date provided
AI Assistant should
Populate and open the Create Route form

## Slide 14

- How do I access and activate the Create Route in the line network of pipeline Referencing?
- What are the prerequisite steps before creating a route in a line network?
- What are the prerequisite steps before creating a route in a multifield network ?
- What is line network?
- What is multi field network?
- Walk me through the full workflow of creating a route using the LRS Create Route tool for a line network.
- How are the start and end measures calculated for a route in the create route tool in line network?
- How do I create a route and change the order of the routes in the line network?
- How do I add additional attributes for the route when creating it?
- Can I copy ‘additional attributes’ from an existing route when creating a route?
- How to provide filed info for a multi filed network?
- How to provide a line name while creating a route?
- Guide me on the creating route workflow in line network in a versioned environment?
- Guide me on create route workflow with multifield routeid network ?
- Guide me on providing non lrs attributes while creating a route ?

Help Prompts
