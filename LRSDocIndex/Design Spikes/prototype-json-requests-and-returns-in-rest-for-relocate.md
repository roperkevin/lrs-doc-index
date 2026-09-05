# Prototype: JSON requests and returns in REST for Relocate Events

| Field | Value |
| --- | --- |
| **Doc** | 298 · Design Spike · Server |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [PrototypeRelocateEventsviaJSON.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/PrototypeRelocateEventsviaJSON.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2024-10-23 21:53 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | relocate events · json · rest · prototype · feature limits · batching |
| **Tools** | — |

## Summary

This document describes a prototype for the Relocate Events operation using JSON input and output in REST. It aims to test the limits on the number of features handled in requests and responses to evaluate the viability of this approach versus batching. The prototype results will be shared with the team for further decision making.

## Related documents

<!-- related:begin -->
- [Relocate Event Support for External Event with No Connection File](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/relocate-event-support-for-external-event-with-no-connection.md>) — similar text 0.18 · 1 title word · 3 filename words · same kind/folder <!-- rel:287 s=4.126 -->
- [Relocate Events in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/relocate-events-in-pro.md>) — similar text 0.08 · 2 title words · 1 filename word · same kind/folder <!-- rel:812 s=3.015 -->
- [Relocate Events support for Reassign to a New Line](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/relocate-events-support-for-reassign-to-a-new-line.md>) — similar text 0.09 · 2 title words · 1 filename word · same folder <!-- rel:537 s=2.545 -->
- [Relocate Events Support for External Event with No Connection File - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5987-relocate-events-support-for-external-event-with-no.md>) — similar text 0.05 · 2 title words · 1 filename word <!-- rel:264 s=2.375 -->
- [Test Plan for Supporting JSON in Export Network](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/for-supporting-json-in-export-network.md>) — similar text 0.07 · 1 title word · 1 filename word · same surface <!-- rel:639 s=2.168 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [relocate event operation](https://www.google.com/search?q=%22relocate%20event%20operation%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Prototype: JSON requests and returns in REST

Spike

## Slide 2 — Prototype

- Build a prototype of the Relocate Events operation that takes JSON as the input and returns JSON in the response (not a zipped JSON file like we do today)
- Test the prototype to determine the upper limits on the number of features that could be included in a request and the number of features that could be returned in the response
- The goal of this prototype is to determine whether this will be a viable pattern for the updated Relocate Events operation or if we need to look at a batching approach
- Once this is complete, setup a meeting to showcase the prototype with the team and share the results of the limits to the number of records

## Slide 3 — Assignment

Story Points:
Dev:
