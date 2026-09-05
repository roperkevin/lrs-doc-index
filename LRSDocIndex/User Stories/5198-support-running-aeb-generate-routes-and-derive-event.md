# Support Running AEB, Generate Routes, and Derive Event Measures as a Single Operation via the LR Pro Ribbon

| Field | Value |
| --- | --- |
| **Doc** | 506 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#5198](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5198) |
| **Source** | [5198-ProRibbonTooltoRunAEBGenRoutesandDeriveEventMeas_V3.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/5198-ProRibbonTooltoRunAEBGenRoutesandDeriveEventMeas_V3.pptx>) · rev V3 |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2023-09-05 17:27 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | derived measure · event editing · route editing · apply event behaviors · generate routes · derive event measures · lrs editor |
| **Tools** | Apply Event Behaviors · Generate Routes · Derive Event Measures |

## Summary

This user story describes a tool for LRS Editors to update events with derived measure fields enabled using a single operation on the LR Pro Ribbon. The tool runs Apply Event Behaviors, Generate Routes, and Derive Event Measures sequentially on selected networks with events. It includes UI features such as a network selector dropdown and remembers the last chosen network for streamlined workflows.

## Related documents

<!-- related:begin -->
- [Support Running AEB, Generate Routes, and Derive Event Measures as a Single Operation via the LR Pro Ribbon – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/5198-support-running-aeb-generate-routes-and-derive-event.md>) — shared issue ArcGISPro/ps-location-referencing#5198 · similar text 0.37 · 6 title words · same surface <!-- rel:453 s=1004.545 -->
- [Add Single Point Event tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-single-point-event-tool-in-pro.md>) — similar text 0.21 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:688 s=4.007 -->
- [Conflict Prevention for Event Editing in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-for-event-editing-in-pro.md>) — similar text 0.17 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:683 s=3.888 -->
- [Support Reverse Route in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-in-pro.md>) — similar text 0.18 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:743 s=3.653 -->
- [Add Line Event tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-tool-in-pro.md>) — similar text 0.18 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:687 s=3.505 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html)

_No page matched:_ [Apply Event Behaviors](https://www.google.com/search?q=%22Apply%20Event%20Behaviors%22+site%3Adoc.esri.com) · [Generate Routes](https://www.google.com/search?q=%22Generate%20Routes%22+site%3Adoc.esri.com) · [Derive Event Measures](https://www.google.com/search?q=%22Derive%20Event%20Measures%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support Running AEB, Generate Routes, and Derive Event Measures as a single operation via the LR Pro Ribbon <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Editor, I need the ability to quickly update events with derived measure fields enabled using a single tool on the LR Pro Ribbon, rather than individually running multiple geoprocessing tools.
Persona
Persona:
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawings, FGDBs, etc.).  The LRS Editor is constantly making changes to routes and events with new information, and the current workflow for updating event’s derived measures is too time consuming. Having a singular tool to update event’s derived measures will greatly streamline editing workflows.

## Acceptance Criteria
<!-- slide 3 -->
- When clicked, the tool will:
  - Run Apply Event Behaviors on the input network
  - Determine routes that have been edited or have had events updated on them based on running AEB
  - Run Generate Routes on these specific routes (this will update the line and its derived network or a nonline network if the input network is not a line network with events)
  - Select all events on the generated routes and run Derive Event Measures on them
- We will likely need to reach out to the Graphics team to get an icon for the new tool
- If one step of the tool fails, then fail the whole tool
- Run AEB step even if the user doesn’t have a line network with a derived network with events with derived event measure fields enabled in the map. If the input network has events, then run the tool
  - Also run even if no route edits have occurred
- Provide similar experience to how we did this in ArcMap
- Use the same experience as the event editing tools, but when the down arrow is clicked it will show a list of networks in the map to run the tool against (see next slide for mockup)
- Once a network is chosen remember the choice and whenever the tool’s icon is clicked run the tool
- Two clickable parts of tool, the icon and the drop-down arrow (similar to CP editing tools)
  - When the icon is clicked, the tool will run
  - When the drop-down arrow is clicked, network selection combo box appears
- Only networks with events can be chosen to run the tool
  - If no networks with events in the map, disable the tool on the ribbon
- Tool still needs a name, what should we call it?

<!-- slide 4 -->
- Clicking the tool icon will run the tool
- Clicking the drop down arrow will open drop down network selector. Select a network and then click the tool icon to run the tool
- Tool will remember network choice, when icon is clicked it will run against the previously chosen network
- Upon opening Pro, tool will default to no selected network
- If the icon is clicked with no network selected, have a pop-up window letting the user know that they need to choose a network before running the tool

![Figure 1 — Clicking the tool icon will run the tool](../media/5198-support-running-aeb-generate-routes-and-derive-event/fig-01-slide-04-clicking-the-tool-icon-will-run-the-tool.png)

## Testing
<!-- slide 5 -->
- Test with RH and APR data
- Make edits to routes and then run tool. Run tool, verify:
  - AEB is ran correctly based on edited routes
  - Generate Routes is ran correctly on these routes for both the line and derived network
  - Derive Event Measures is ran with only the generated routes as a selection subset and the events found on the routes are the only input event layers that also have a selection subset
- Verify the tool is greyed out if there are no LRS networks with events in the map
- Verify the tool will run against nonline networks with events, also. In this case only AEB and Generate Routes will run
- Test with events that have derived measure fields
- Test with events that do not have derived measure fields
- Test conflict prevention works as expected upon the execution of the above GP tools
- Verify AEB is ran correctly
- Verify Generate Routes is ran correctly
- Verify Derive Event Measures is ran correctly
  - Verify new derived measures are correct
- Verify the tool runs the above GP tools in a correct sequence
- Test UI of tool works as intended

## Automation
<!-- slide 6 -->
- Automate a few UI test cases

## Documentation
<!-- slide 7 -->
- Add new doc topic for the tool in the Prepare the LRS for editing section after the Rename a route topic
  - We will want to include use cases, workflows, screenshots of tool UI, and graphics/tables
  - Provide links to the specific GP tools that are ran when the tool is executed for more info about what each individual GP tool does

## Assignment
<!-- slide 8 -->
Story Points:
Dev:
PE:
