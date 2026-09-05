# Rename Tool for ArcGIS Pro

| Field | Value |
| --- | --- |
| **Doc** | 649 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Renaming_Routes_Lines_UserStories.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Renaming_Routes_Lines_UserStories.pdf>) |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | route renaming · line renaming · route name · line name · line lock · route lock · event layers · network validation |
| **Tools** | Rename Route tool · Rename Line tool |

## Summary

This document describes user stories and acceptance criteria for renaming Routes and Lines within ArcGIS Pro. It covers workflows, validation, conflict prevention, error handling, testing, documentation, and automation related to renaming operations in linear referencing networks. The tool supports both dynamic and feature services and includes UI elements such as drop-down menus and side tabs.

## Related documents

<!-- related:begin -->
- [Translate tool for ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/translate-tool-for-pro.md>) — similar text 0.39 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:644 s=4.732 -->
- [Allow Locks to Transfer between Users in REST and Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-locks-to-transfer-between-users-in-rest-and-editing.md>) — similar text 0.15 · same kind/surface/folder <!-- rel:827 s=3.332 -->
- [Conflict Prevention for Event Editing in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-for-event-editing-in-pro.md>) — similar text 0.17 · 1 title word · same kind/surface/folder <!-- rel:683 s=2.966 -->
- [Dynamic Segmentation User Story for ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynseg-for-pro.md>) — similar text 0.21 · 1 title word · same kind/surface/folder <!-- rel:653 s=2.89 -->
- [Change Route/Line Name Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/837-change-route-line-name.md>) — similar text 0.23 · same surface <!-- rel:637 s=2.738 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Rename Route tool](https://www.google.com/search?q=%22Rename%20Route%20tool%22+site%3Adoc.esri.com) · [Rename Line tool](https://www.google.com/search?q=%22Rename%20Line%20tool%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

                                      Rename tool for ArcGIS Pro

         Acceptance Criteria

As an LRS Editor, I want to be able to rename Routes or Lines in ArcGIS Pro.

Persona
LRS Editor: This user is responsible for making edits to the LRS. The LRS Editor is responsible for making the route and event edits based on these documents. One workflow editors will utilize is to change the Route Name or a Line Name for error correction.

User Story

1.   Provide the ability to change a route name or a line name in ArcGIS Pro.

2.   Create a drop-down menu in the Tools section of the LR ribbon for the two rename options.

3.   Get new icons for these tools.

4.   Open a tab on the right-side of the Pro window upon clicking the tool

                                                                                                 801
Renaming a Route

            Rename
           Route tool

           Line Lock        Error Out
           Available?

Route Name is unique across      Error Out time?

          Change Route
            Name in
           Network FC

Events registered with   End process
          Route Name?

Change Route name in Event FC

          End process

                                         802
Renaming a Route

1.   Renaming a route should change the Route Name across time slices

2.   Only valid for networks that supports Route Name

3.   Supported for both DC and FS

Network

1.   List the Networks available in the TOC in the order that are present

2.   If there is only one supported Network available in the map, then select it by default

Existing Route Name

1.   The Route Name can be typed or can be selected from the map

2.   Verify the validity of the Route name (from the selected Network) when the focus moves away from the

     text input box

3.   When using the route picker, if there exists multiple routes at a location, then show the route selection

     modal window with a table that shows: Route Name, Route ID, From Date and To Date

4.   Flash the Route 3 times

New Route Name

1.   The New Route Name can be only typed

2.   Verify the validity of the Route name when the focus moves away from the text input box, or the Run

     button is clicked

3.   The new Route Name should be unique across time

Changing Parameters

1.   If the Network is changed, then clear the form

2.   If the Existing Route Name is changed, then validate it

3.   If the New Route Name is changed, then validate it

                                                                                                                 803
Running the Tool

1.   Update the Route Name across all time slices

2.   Update the Route Name in any event layers (registered to the selected Network) that have Route Name

     enabled

3.   Update the Route Name in the Map (Labels)

Conflict Prevention

1.   Acquire a Line Lock (for a Network Supporting Lines) or a Route Lock upon successful validation of the

     Existing Route Name

2.   Reconfirm the lock before running the tool

3.   Release the lock upon a successful run when using the Default version

Error Conditions

1.   No LRS Network with Route Name configured available in the TOC

2.   Lock not available

3.   Route Name not unique

Testing

1.   Test with any Network that supports Route Name
2.   Test with Default and other versions and DC
3.   Dark and Light Mode
4.   508 and i18n

Documentation

1.   Create a new document for Renaming Routes outlining the use cases

Automation

1.   Create 2-3 UI automation cases

Estimate

1.   Story Points:
                                                                                                              804
Renaming a Line

                  805
Renaming a Line

1.   Renaming a Line should change the Line Name across time slices

2.   Only valid for networks that support Lines

3.   Supported for both DC and FS

Network

1.   List the Networks available in the TOC in the order that are present

2.   If there is only one supported Network available in the map, then select it by default

Exiting Line Name

1.   The Line Name can be typed or can be selected from the map

2.   Verify the validity of the Line name (from the selected Network) when the focus moves away from the text

     input box

3.   When using the line picker, if there exists multiple lines at a location, then show the line selection modal

     window with a table that shows: Line Name, Line ID

4.   Flash the entire line 3 times

New Line Name

1.   The New Line Name can be typed only

2.   Verify the validity of the Line name when the focus moves away from the text input box, or the Run button

     is clicked

3.   The new Line Name should be unique across time

Changing Parameters

1.   If the Network is changed, then clear the form

2.   If the Existing Line Name is changed, then validate it

3.   If the New Line Name is changed, then validate it

                                                                                                                    806
Running the Tool

1.   Update the Line Name for all the routes in the line across all time slices

2.   Update the Derived Route Name in any event layers that have the Derived Event measures enabled

3.   Update the Route Name in the Derived Network

4.   Update the Line Name in the Map (Labels)

Conflict Prevention

1.   Acquire a Line Lock upon successful validation of the Existing Line Name

2.   Reconfirm the lock before running the tool

3.   Release the lock upon a successful run when using the Default version

Error Conditions

1.   No LRS Network with Lines configured available in the TOC

2.   Lock not available

3.   Line Name not unique

Testing

1.   Test with any Network that supports Lines
2.   Test with Default and other versions and DC
3.   Dark and Light Mode
4.   508 and i18n

Documentation

1.   Create a new document for Renaming Line outlining the use cases

Automation

1.   Create 2-3 UI automation cases

Estimate

1.   Story Points:

                                                                                                      807
