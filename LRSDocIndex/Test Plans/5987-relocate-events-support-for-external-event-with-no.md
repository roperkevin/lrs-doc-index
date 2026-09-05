# Relocate Events Support for External Event with No Connection File - Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 264 · Test Plan · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#5987](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5987) |
| **Source** | [RelocateEvents_supportExternalEventswithNoconnectionfile_Testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/RelocateEvents_supportExternalEventswithNoconnectionfile_Testplan.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE Lakshmi · dev Eric |
| **Edited** | 2024-12-18 19:30 by Lakshmi Ananthanarayanan |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | external event · event relocation · event behavior · event location · test cases · dynamic segmentation · experience builder |
| **Tools** | ArcGIS Experience Builder |

## Summary

Test plan for relocating events supporting external events without a connection file. It includes verification of parameters EventLocation and EventBehavior, various test cases for external events with and without connection files, and expected results for different input scenarios. The document covers syntax details, behavior rules, and output format validations.

## Related documents

<!-- related:begin -->
- [Support External Event Configuration Without Connection File – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6159-support-external-event-configuration-without-connection-file.md>) — similar text 0.10 · 4 title words · 3 filename words · same kind/dev/folder <!-- rel:275 s=5.942 -->
- [Relocate Event Support for External Event with No Connection File](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/relocate-event-support-for-external-event-with-no-connection.md>) — similar text 0.16 · 5 title words · 1 filename word <!-- rel:287 s=3.61 -->
- [Migrate Attribute Sets to Map CIM/Service – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5102-migrate-attribute-sets-to-map-cim-service.md>) — similar text 0.06 · 1 filename word · same kind/dev/folder <!-- rel:562 s=3.383 -->
- [Point Events Dynamic Segmentation Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/point-events-dynseg.md>) — similar text 0.16 · 1 title word · 1 filename word · same kind/folder <!-- rel:365 s=2.847 -->
- [Dynamic Segmentation Table: Consider Point Events in DynSeg Table](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynseg-table-consider-point-events-in-dynseg-table.md>) — similar text 0.12 · 1 title word · 2 filename words <!-- rel:394 s=2.365 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[External event registration](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/external-event-registration.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html) · [Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [ArcGIS Experience Builder](https://www.google.com/search?q=%22ArcGIS%20Experience%20Builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Relocate Events support for external event with no connection file - Test Plan <!-- slide 1 -->

User story: 5987
Developer: Eric
PE : Lakshmi

### Slide 2 <!-- slide 2 -->

  - Existing Data
  - Existing Test cases
  - Export the existing event layers
  - Register as external events
  - registered events without configuration file
  - Unregistered events
  - Perform Route Edits
  - Run AEB
  - Compare internal and external events

[figure: Data · External events · Route edits · Run Relocate Events · Relocate Events · Compare Events · Plan]

![Figure 1 — 2](../media/5987-relocate-events-support-for-external-event-with-no/fig-01-slide-02-2.svg)

## Test Cases

### TC-U01 — Verify the Two Parameters EventLocation and EventBehavior( Both Optional) <!-- src: S1 · slide 3 · case 1 -->

- **Case:** Verify the two parameters EventLocation and EventBehavior( both optional) are added.

Data
Include Nonline network and Line network
Include Point Event , Line Event (including spanning event)

Verification

Syntax for EventLocation:
[

```
  {
    // syntax of a point event to be relocated
```

    "routeId": "<routeId1>",
    "measure": <measure1>,
     "eventId": <eventId1>,           
     "fromDate": <fromDate1>,    // optional date value
     "toDate": <toDate1>                 // optional date value

```
  },
  {
    // syntax of a line event to be relocated
```

    "routeId": "<routeId2>",
    "fromMeasure": <measure2a>,
    "toMeasure": <measure2b>,
     "eventId": <eventId2>,            
     "fromDate": <fromDate2>,    // optional date value
     "toDate": <toDate2>                 // optional date value

```
  },
  {
     // syntax of a line event that spans multiple routes. This is valid only for networks that support lines
```

    "routeId": "<routeId3a>",
    "toRouteId": "<routeId3b>",
    "fromMeasure": <measure3a>,
    "toMeasure": <measure3b>,
    "eventId": <eventId3>,             
    "fromDate": <fromDate3>,     // optional date value
     "toDate": <toDate3>                 // optional date value

```
  },
  ...
]
```

Syntax for EventBehavior:

![Figure 2 — 3](../media/5987-relocate-events-support-for-external-event-with-no/fig-02-slide-03-3.png)

### TC-U02 — Provide only EventName, no EventLocation and EventBehavior <!-- src: S3 · slide 5 · table · 1a -->

- **ID:** 1a
- **Expected Result:** Event location and EB are read from Event name and output is generated

### TC-U03 — Provide EventName, along with EventLocation and Event behavior parameter <!-- src: S3 · slide 5 · table · 1b -->

- **ID:** 1b
- **Expected Result:** Event location and EB are read from Event name and output is generated, ( Event location and EB parameter are ignored)

### TC-U04 — Provide Event name (no features ) <!-- src: S3 · slide 5 · table · 1c -->

- **ID:** 1c
- **Case:** Provide Event name (no features ) , along with Event Location parameter. No Event behavior parameter
- **Expected Result:** Empty output will be generated

### TC-U05 — Provide EventName , EventBehavior parameter and no EventLocation parameter <!-- src: S3 · slide 5 · table · 1d -->

- **ID:** 1d
- **Expected Result:** Event location and EB are read from Event name and output is generated, (EB parameter is ignored)

### TC-U06 — Provide only EventName, no EventLocation and no EventBehavior <!-- src: S3 · slide 5 · table · 2a -->

- **ID:** 2a
- **Expected Result:** Error out.

### TC-U07 — Provide Event Name, along with EventLocation and EventBehavior parameter <!-- src: S3 · slide 5 · table · 2b -->

- **ID:** 2b
- **Expected Result:** EB is read from the EventName parameter and Event Location parameter is used to generate output( EventBehavior parameter is ignored)

### TC-U08 — Provide EventName and EventBehavior, no EventLocation <!-- src: S3 · slide 5 · table · 2c -->

- **ID:** 2c
- **Expected Result:** Error out

### TC-U09 — No EventName , Provide EventLocation parameter and EventBehavior parameter <!-- src: S3 · slide 5 · table · 3a -->

- **ID:** 3a
- **Expected Result:** Event location and EB parameter are utilized for output generation

### TC-U10 — No EventName, provide only EventLocation and No EventBehavior <!-- src: S3 · slide 5 · table · 3b -->

- **ID:** 3b
- **Expected Result:** Error

### TC-U11 — No EventName, No EventLocation , Provide only EventBehavior <!-- src: S3 · slide 5 · table · 3c -->

- **ID:** 3c
- **Expected Result:** Error

### TC-U12 — Provide the syntax for point event and line event in Event Location parameter <!-- src: S3 · slide 6 · table · 4a -->

- **ID:** 4a
- **Case:** Provide the syntax for point event and line event in Event Location parameter and provide Event Behavior parameter
- **Expected Result:** point event and line event cannot be combined together and given as an input - Error

### TC-U13 — Provide the syntax for spanning and non spanning line Event Location parameter <!-- src: S3 · slide 6 · table · 4ai) -->

- **ID:** 4ai)
- **Case:** Provide the syntax for spanning and non spanning line Event Location parameter and provide Event Behavior parameter
- **Expected Result:** Should work together.

### TC-U14 — Provide point event in the EventLocation parameter and provide cover event <!-- src: S3 · slide 6 · table · 4b -->

- **ID:** 4b
- **Case:** Provide point event in the EventLocation parameter and provide cover event behavior in Event Behavior parameter
- **Expected Result:** Error

### TC-U15 — In the EventLocation parameter do not provide Event ID <!-- src: S3 · slide 6 · table · 4c -->

- **ID:** 4c
- **Case:** In the EventLocation parameter do not provide Event ID, Provide Event Behavior parameter
- **Expected Result:** Error

### TC-U16 — In the EventLocation parameter <!-- src: S3 · slide 6 · table · 4d -->

- **ID:** 4d
- **Case:** In the EventLocation parameter – provided routeID is not present in the chosen network, Event behavior parameter is provided
- **Expected Result:** Not included in the output

### TC-U17 — EventLocation parameter is provided <!-- src: S3 · slide 6 · table · 4e -->

- **ID:** 4e
- **Case:** EventLocation parameter is provided, Event behavior parameter is with incorrect values
- **Expected Result:** Error

### TC-U18 — In the EventLocation parameter From date is not provided and To date is not <!-- src: S3 · slide 6 · table · 4f -->

- **ID:** 4f
- **Case:** In the EventLocation parameter From date is not provided and To date is not provided, Event Behavior parameter provided
- **Expected Result:** Events will be relocated considering From Date as null and To date as null.

### TC-U19 — In the EventLocation parameter provide syntax exceeding the general limit <!-- src: S3 · slide 6 · table · 4g -->

- **ID:** 4g
- **Case:** In the EventLocation parameter provide syntax exceeding the general limit (Get the limit from Eric)
- **Expected Result:** There is no such general limit as such. Provide a large number of events and check the results. Document the result generally to give an idea to users.

### TC-U20 — In the EventLocation parameter provided measure not in route <!-- src: S3 · slide 6 · table · 4h -->

- **ID:** 4h
- **Case:** In the EventLocation parameter provided measure not in route, EventBehavior parameter provided
- **Expected Result:** Empty output will be generated

### TC-U21 — No Event Name, In the Event Location parameter provided route is not edited <!-- src: S3 · slide 6 · table · 4i -->

- **ID:** 4i
- **Case:** No Event Name, In the Event Location parameter provided route is not edited, Event Behavior parameter provided
- **Expected Result:** Empty output will be generated

### TC-U22 — No Event Name, In the Event Location parameter for a line Event do not provide <!-- src: S3 · slide 6 · table · 4j -->

- **ID:** 4j
- **Case:** No Event Name, In the Event Location parameter for a line Event do not provide To Measure
- **Expected Result:** Error

### TC-U23 — In a nonline network <!-- src: S3 · slide 6 · table · 4k -->

- **ID:** 4k
- **Case:** In a nonline network, provide the syntax for spanning line event in EventLocation Parameter
- **Expected Result:** Error

### TC-U24 — Provide wrong values in the syntax for EventLocation <!-- src: S3 · slide 6 · table · 4l -->

- **ID:** 4l
- **Expected Result:** Error

### TC-U25 — Provide wrong values in the syntax for EventBehavior <!-- src: S3 · slide 6 · table · 4m -->

- **ID:** 4m
- **Expected Result:** Error

## Other content

### Slide 4 <!-- slide 4 -->

Syntax for EventBehavior:
{
     "calibrateRule": "<calibrationRule>",                     // esriStayPut, esriRetire, esriMove
     "retireRule": "<retireRule>",                                        // esriStayPut, esriRetire, esriMove, esriSnap
     "reassignRule": "<reassignRule>",                           // esriStayPut, esriRetire, esriMove, esriSnap
     "extendRule": "<extendRule>",                                  // esriStayPut, esriRetire, esriMove, esriCover
     "realignRule": "<realignRule>",                                   // esriStayPut, esriRetire, esriMove, esriSnap, esriCover
     "reverseRule": "<reverseRule>",                               // esriStayPut, esriRetire, esriMove
     "cartoRealignRule": "<cartoRealignRule>",        // esriHonorRouteMeasure
}

| External event type | Event Name | Event Location | Event behavior |
| --- | --- | --- | --- |
| Event with connection file registered with LRS | Required | Optional | Optional |
| External event with no connection file – registered with LRS | Provided | Required | Optional /ignored |
| External event with no connection file – registered with LRS | Not provided | Required | Required |
| External event with no connection – not registered with LRS | Optional /ignored | Required | Required |

2. Verify the rest end point works with all the following scenarios and verify the results
3. Verify by including and excluding the geometries in the output
4. Verify in both output formats Json, CSV and fgdb
5. Verify the various response formats (html| json | pjson)
6. Verify  by providing lastInvoked time only
7. Verify  by providing lastInvoked time, LRStime and lastLRS time
8. Verify by providing  a specific gdb version to use

![Figure 2 — 3](../media/5987-relocate-events-support-for-external-event-with-no/fig-02-slide-03-3.png)

### Slide 5 — Test Cases <!-- slide 5 -->

- External Event with connection File

2.  External Event without  connection File

3.    No External event name parameter is provided

![Figure 2 — 3](../media/5987-relocate-events-support-for-external-event-with-no/fig-02-slide-03-3.png)

### Slide 6 — Test Cases <!-- slide 6 -->

4.   Other test cases – No EventName parameter is provided/ External event without connection file is used as EventName.

![Figure 2 — 3](../media/5987-relocate-events-support-for-external-event-with-no/fig-02-slide-03-3.png)
