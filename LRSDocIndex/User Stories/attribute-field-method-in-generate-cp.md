# Attribute Field Method in Generate Calibration Points

| Field | Value |
| --- | --- |
| **Doc** | 702 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [Attribute Field method in Generate Calibration Points.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Attribute%20Field%20method%20in%20Generate%20Calibration%20Points.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-06-30 20:16 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | calibration points · attribute field · generate calibration points · from measure · to measure · route shapes · interpolation |
| **Tools** | Generate Calibration Points |

## Summary

Describes a user story for adding an Attribute Field method to the Generate Calibration Points geoprocessing tool. This method allows using attribute field values from source routes to generate calibration points with measures applied. It includes parameter requirements, behavior for complex routes, and error handling for null or non-monotonic measures. Testing, automation, and documentation updates are also outlined.

## Related documents

<!-- related:begin -->
- [Generate Calibration Points Tool Feature Service Support User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/generate-cp-tool-feature-service-support.md>) — similar text 0.40 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:662 s=5.635 -->
- [Update Address Range via Address Points in Overlay Events and Query Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/update-address-range-via-address-points-in-overlay-events.md>) — similar text 0.13 · 2 title words · same kind/surface/folder <!-- rel:294 s=3.679 -->
- [Support Optional Date Field Mapping in Append Events Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-optional-date-field-mapping-in-append-events-tool.md>) — similar text 0.22 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:143 s=3.358 -->
- [Provide option to not apply event behaviors for calibration point edits](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/provide-option-to-not-apply-eb-for-cp-edits.md>) — similar text 0.23 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:703 s=3.173 -->
- [Split Events Spanning Gap on Branched Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/split-events-spanning-gap-on-branched-routes.md>) — similar text 0.13 · same kind/surface/folder <!-- rel:781 s=3.155 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html)

_No page matched:_ [Generate Calibration Points](https://www.google.com/search?q=%22Generate%20Calibration%20Points%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Attribute Field method in Generate Calibration Points <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a LRS configurer/data loader, I want to be able to use the attribute field values on my source routes for newly generated calibration points, so I can ensure the source data measures are applied to my newly loaded routes in the LRS.

Persona

- LRS configurer/data loader: This user is responsible for configuration/ongoing maintenance of the LRS along with initial and supplemental bulk data loading in the LRS. When a user first adopts Roads and Highways, they typically oversee or work with a partner to migrate their data into our information model and ensure the LRS is configured to meet their business rules. Once their organization is in production, this user would be responsible for bulk loading new data as needed (for example a pipeline operator is acquired) along with making any changes to configuration (such as changing an event behavior for an event). For many DoTs/Pipeline Operators, the M values on their source data are stored as attribute fields that they want to use within the LRS.  Currently there isn’t a way to get these measures onto Calibration Points in bulk via the Generate Calibration Points tool.

## Acceptance Criteria
### Attribute Field method <!-- slide 3 -->
- Add a new value to the Calibration Method parameter in the Generate Calibration Points GP tool called Attribute Fields
- When this method is selected, two new optional parameters should appear/be active
  - From Measure, To Measure
  - These fields are required when the Attribute Fields method is selected
- When this method is selected, use the From and To Measure fields selected on the input polyline features to get the calibration points at the beginning/end of the route
- For a route that requires more than 2 calibration points (gapped, complex, etc.), create the beginning/end of route calibration points from the attribute fields, then create any necessary intermediate points based on interpolation from the end calibration points and include a message in the output of the tool
- If the From/To Measure field value for any of the routes is Null, don’t create any of the calibration points on that route and include a message in the output of the tool
- If the resulting calibration points would create a non-monotonic route, don’t create any of the calibration points on that route and include a message in the output of the tool

## Testing
<!-- slide 4 -->
- Test on all route shapes (normal, gapped, complex, vertical)
- Test on both Roads and Pipeline data (test at least one APR-UN scenario)
- Use the test plan/data from the original user story as a guide

## Automation
<!-- slide 5 -->
Add to the existing automation for the tool using the same pattern of using python.

## Documentation
<!-- slide 6 -->
Update the existing documentation for the tool to mention this additional parameter and how it is used.

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
