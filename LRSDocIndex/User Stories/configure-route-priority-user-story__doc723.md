# Configure Route Priority User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [Configure_Route_Priority_UserStory.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Configure_Route_Priority_UserStory.pptx>) |
| **Edited** | 2021-04-12 18:52 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Configure Route Priority User Story"
source_file: "Configure_Route_Priority_UserStory.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Configure_Route_Priority_UserStory.pptx"
doc_id: 723
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Rahul Rakshit"
last_edited_by: "Rahul Rakshit"
last_edited: "2021-04-12T18:52:36Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["route dominance", "dominance rules", "route hierarchy", "concurrent routes", "route configuration", "geoprocessing tool", "route priority"]
tools: ["Configure Route Dominance Rules Geoprocessing Tool"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":715,"file":"cover-event-behavior-in-realign-route-with-concurrencies__doc715.md","s":3.459},{"doc":710,"file":"consider-concurrencies-in-update-measures-from-lrs__doc710.md","s":3.041},{"doc":882,"file":"create-lrs-intersection-geoprocessing-tool-user-story__doc882.md","s":2.729},{"doc":248,"file":"configure-external-event-behaviors-with-lrs__doc248.md","s":2.575},{"doc":878,"file":"modify-lrs-intersection-feature-class-geoprocessing-tool__doc878.md","s":2.197}]
```
-->

## Summary

Describes the need for a configuration tool to set rules determining route hierarchy and dominance in concurrent route sections within the LRS. Details user personas, acceptance criteria, interface elements, and testing considerations for the Route Dominance Rules geoprocessing tool. Covers configuration options, error handling, sorting and ordering rules, and automation plans.

## Related documents

<!-- related:begin -->
- [Cover Event Behavior in Realign Route with Concurrencies](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-event-behavior-in-realign-route-with-concurrencies__doc715.md>) — similar text 0.14 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:715 -->
- [Consider concurrencies in Update Measures from LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/consider-concurrencies-in-update-measures-from-lrs__doc710.md>) — similar text 0.13 · 1 filename word · same kind/surface/folder <!-- rel:710 -->
- [Create LRS Intersection Geoprocessing Tool User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-lrs-intersection-geoprocessing-tool-user-story__doc882.md>) — similar text 0.30 · same kind/surface/folder <!-- rel:882 -->
- [Configure External Event Behaviors With LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configure-external-event-behaviors-with-lrs__doc248.md>) — similar text 0.06 · 1 title word · 1 filename word · same surface <!-- rel:248 -->
- [Modify LRS Intersection Feature Class Geoprocessing Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/modify-lrs-intersection-feature-class-geoprocessing-tool__doc878.md>) — similar text 0.29 · same surface/folder <!-- rel:878 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Configure Route Dominance Rules Geoprocessing Tool](https://www.google.com/search?q=%22Configure%20Route%20Dominance%20Rules%20Geoprocessing%20Tool%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

![Diagram drawn from the slide's own shapes: 11 nodes, 2 connectors.](../media/doc194_slide1.svg)

| Section ID | Dominant Route | Dominance Error |
| --- | --- | --- |
| 1 | S4 |  |
| 2 | S4 |  |
| 3 | S4 |  |
| 4 | S4 |  |
| 5 | T1 |  |
| 6 | T1 |  |
| 7 | T1 |  |
| 8 | A2 | More than one route as per dominance rules |
| 9 | A2 | No values were present for the attributes used to calculate the dominant route |

| Code | Functional Class |
| --- | --- |
| 1 | Interstates |
| 2 | Freeways and Expressways |
| 3 | Principal Arterials |
| 4 | Minor Arterials |
| 5 | Collectors |
| 6 | Local Roads |

style.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibility

![image1.png](../media/doc194_image1.png)

## Slide 2

![Interface screenshot redrawn as a standardized wireframe: 4 panels, 9 text rows. 5 of 9 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc194_slide2.svg)

![image2.png](../media/doc194_image2.png)

## Slide 3

As a LRS configurer/data loader, I want to be able to configure a set of rules to determine the hierarchy of my routes, so I can ensure that the dominant route is identified where there are concurrent routes.
Persona:
LRS configurer/data loader: This user is responsible for configuration/ongoing maintenance of the LRS along with initial and supplemental bulk data loading in the LRS. When a user first adopts Roads and Highways, they typically oversee or work with a partner to migrate their data into our information model and ensure the LRS is configured to meet their business rules. Once their organization is in production, this user would be responsible for bulk loading new data as needed (for example a pipeline operator is acquired) along with making any changes to configuration (such as changing an event behavior for an event). Many DoTs have modeled their routes to have concurrencies (two or more routes that share a common piece of pavement/centerlines). These concurrent routes provide some challenges for users, including the need to have events only locate on a single route (the dominant one) in these concurrent sections. To ensure that Roads and Highways can determine which route is the dominant one in each concurrent section, we need to support the ability for users to configure rules to determine which route is dominant. These rules are based on fields in the LRS Network (or LRS Event) that can be compared to order the routes (an example is dominance rules based on higher route type and lower route number; Interstate 20 is dominant over Interstate 35 and US Highways 60 is dominant over State Road 15).
Configure Route Dominance Rules Geoprocessing Tool

## Slide 4

![Interface screenshot redrawn as a standardized wireframe: 2 panels, 3 buttons, 15 row separators, 3 icons, 25 text rows. 19 of 25 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc194_slide4_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 4 buttons, 1 colour block, 15 row separators, 3 icons, 27 text rows. 23 of 27 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc194_slide4_fig2.svg)

I10, I95, SR18, BR2, HR66
Route Type
            Number
style.visibilitystyle.visibilitystyle.visibilitystyle.visibility
![image3.png](../media/doc194_image3.png) ![image4.png](../media/doc194_image4.png) ![image5.png](../media/doc194_image5.png) ![image6.png](../media/doc194_image6.png) ![image7.png](../media/doc194_image7.png)

## Slide 5

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 5 buttons, 1 colour block, 16 row separators, 3 icons, 31 text rows. 25 of 31 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc194_slide5_fig2.svg)

If the dominant route cannot be determined using the first rule due to any of the error conditions, then the next rule is used until rules are exhausted. In that case, lesser and alpha-numeric from the first rule will be used to determine the dominant route.

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 4 buttons, 1 colour block, 15 row separators, 3 icons, 30 text rows. 25 of 30 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc194_slide5_fig1.svg)

| RouteID | Dominance Order |
| --- | --- |
| RouteZ1 | 1 |
| RouteA2 | 2 |
| RouteQ345 | 3 |
| RouteW | 4 |

style.visibilitystyle.visibilitystyle.visibility
![image8.png](../media/doc194_image8.png) ![image9.png](../media/doc194_image9.png)

## Slide 6

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 2 buttons, 1 colour block, 15 row separators, 4 icons, 30 text rows. 26 of 30 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc194_slide6_fig2.svg)

![Diagram drawn from the slide's own shapes: 11 nodes, 2 connectors.](../media/doc194_slide6_fig1.svg)

| Code | Functional Class |
| --- | --- |
| 1 | Interstates |
| 2 | Freeways and Expressways |
| 3 | Principal Arterials |
| 4 | Minor Arterials |
| 5 | Collectors |
| 6 | Local Roads |

![image1.png](../media/doc194_image1.png) ![image11.png](../media/doc194_image11.png)

## Slide 7

![Interface screenshot redrawn as a standardized wireframe: 2 panels, 1 field, 5 row separators, 3 icons, 17 text rows. 15 of 17 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc194_slide7_fig2.svg)

![Interface screenshot redrawn as a standardized wireframe: 2 panels, 1 field, 5 row separators, 3 icons, 37 text rows. 35 of 37 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc194_slide7_fig1.svg)

| RouteID | Dominance Order |
| --- | --- |
| RouteZ1 | 1 |
| RouteA2 | 2 |
| RouteQ345 | 3 |
| RouteW | 4 |

style.visibility
![image12.png](../media/doc194_image12.png) ![image13.png](../media/doc194_image13.png)

## Slide 8

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 4 buttons, 1 colour block, 15 row separators, 3 icons, 30 text rows. 25 of 30 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc194_slide8.svg)

- This GP tool will be used to configure and modify the Route Dominance Rules
- Tool to be located in the Configuration>Network toolset
- The information should be stored in the LR Metadata
- Can be used in DC only

Network:

- Only a valid LRS network can be used as an input

Arrangement:

- Defined and Custom options. Defined by default.

Layer:

- Any Line event that is registered to the Network selected above or the Network itself can be used. Only non-spanning line events for now.
- Show only the valid events and the network in the drop-down list. The events or the network don’t have to be on the TOC.
- This parameter can be populated only if the Network parameter is populated.

Fields:

- In the Field Name column, list all the attribute field aliases in the drop-down that are not LR, branch database fields, ObjectID, Shape and Shape Length
- List the fields alphabetically
- Make sure that the complete field alias is shown
- Do not allow adding the same field more than once
- If more than one field is added, then concatenate the fields in the order they appear in the list to determine the order
- Empty by default but error out if empty when running the tool
Acceptance Criteria - 1

![image9.png](../media/doc194_image9.png)

## Slide 9

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 4 buttons, 1 colour block, 15 row separators, 3 icons, 30 text rows. 25 of 30 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc194_slide9.svg)

Sorting:

- Lesser and Greater options
- Lesser by default

Ordering:

- Alpha Numeric and Numeric options
- Alpha Numeric by default
- If there is a single field and that field is numeric, then allow only Numeric ordering
- If there is a single field and that field is non-numeric, then allow only Alpha-Numeric ordering
- If there is more than one field and they are numeric, then allow only Numeric ordering
- If there is more than one field and they are non-numeric, then allow only Alpha-Numeric ordering
- If there is more than one field and they are a mix of numeric and non-numeric, then allow only Alpha-Numeric ordering

Exceptions:

- The exceptions can be listed separated by a comma
- The dominance is determined in the order they are listed
- Route IDs will be used for non-line networks and Route Names will be used for line networks
- Validate only for duplicate values. Error out in that case.
- Empty by default

Add Another:

- Another rule can be added
- The next rule can have a different type of arrangement

Acceptance Criteria - 2

![image9.png](../media/doc194_image9.png)

## Slide 10

![Interface screenshot redrawn as a standardized wireframe: 2 panels, 1 field, 5 row separators, 3 icons, 17 text rows. 15 of 17 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc194_slide10.svg)

Custom Arrangement:

- The custom arrangement can be listed separated by a comma
- The dominance is determined in the order they are listed
- Route IDs will be used for non-line networks and Route Names will be used for line networks
- Validate only for duplicate values. Error out in that case.
- Empty by default but error out if empty when running the tool

In addition:

- Get the tool ratified through the GP review process before being closed
- Dev to provide the new error messages (if any) to the PE
Acceptance Criteria - 3

![image12.png](../media/doc194_image12.png)

## Slide 11

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 4 buttons, 1 colour block, 15 row separators, 3 icons, 30 text rows. 25 of 30 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc194_slide11_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 2 panels, 1 field, 5 row separators, 3 icons, 17 text rows. 15 of 17 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc194_slide11_fig2.svg)

Testing
Databases

- DC and FS
- Oracle and SQL Server

Networks

- Non-line, line and PoM
- Error if the FC is non Network

Layers

- Networks, Non-spanning events
- PY – Error if the layer is not an event for the network or the same network

Error Messages

- Validate the error messages developed
    specifically for this tool

Python

- In-line and stand-alone

Model Builder

- Stand alone and chained

Rules

- Single rule and multiple rules
Fields

- Single field and multiple fields

![image9.png](../media/doc194_image9.png) ![image12.png](../media/doc194_image12.png)

## Slide 12

Automation
1. PY for negative cases
2. Test complete for positive cases that involves comparing the metadata

## Case 1 <!-- slide 13 -->

### GP Doc To Be Written by Jim

Documentation

## Slide 14

Estimates
Dev:
PE:
Points:
