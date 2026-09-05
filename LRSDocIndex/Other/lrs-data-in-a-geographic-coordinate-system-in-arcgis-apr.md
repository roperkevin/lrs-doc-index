# LRS Data in a Geographic Coordinate System in ArcGIS Pipeline Referencing

| Field | Value |
| --- | --- |
| **Doc** | 590 · Other · Pro |
| **Product** | Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [Esri_APR_GCSdata.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Esri_APR_GCSdata.pdf>) |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | pipeline referencing · geographic coordinate system · vertex spacing · xy tolerance · z tolerance · densification · measure interpolation · centerline |
| **Tools** | Densify · Geodetic Densify · Generate Routes · Generate Events |

## Summary

This document explains how ArcGIS Pipeline Referencing supports linear referencing with data in a Geographic Coordinate System (GCS). It covers the importance of vertex spacing on polylines, the impact of XY and Z tolerances on linear referencing accuracy, and provides formulas and recommendations for densifying route data to ensure accurate measure interpolation and editing operations.

## Related documents

<!-- related:begin -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/arcgis-apr-an-introduction-rh-apr-un.md>) — similar text 0.13 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:885 s=3.412 -->
- [Auto-Densify LRS Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-densify-lrs-routes-rh-apr-un-2023-05.md>) — similar text 0.24 · same surface/folder <!-- rel:570 s=3.085 -->
- [Auto-Densify LRS Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/auto-densify-lrs-routes-rh-apr-un-2023-03.md>) — similar text 0.22 · same surface/folder <!-- rel:575 s=3.031 -->
- [Append Routes Sparse Vertex Check User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/5058-append-routes-sparse-vertex-check.md>) — similar text 0.21 · same surface/folder <!-- rel:536 s=2.361 -->
- [Pipeline Referencing Across the ArcGIS Platform](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/apr-across-the-arcgis-platform.md>) — similar text 0.08 · 1 title word · 1 filename word · same kind <!-- rel:784 s=2.22 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [Tolerance and resolution settings for the LRS](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/tolerance-and-resolution-settings-for-the-lrs.html) · [Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html)

_No page matched:_ [Densify](https://www.google.com/search?q=%22Densify%22+site%3Adoc.esri.com) · [Geodetic Densify](https://www.google.com/search?q=%22Geodetic%20Densify%22+site%3Adoc.esri.com) · [Generate Routes](https://www.google.com/search?q=%22Generate%20Routes%22+site%3Adoc.esri.com) · [Generate Events](https://www.google.com/search?q=%22Generate%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

NOVEMBER 2021

LRS data in a
Geographic
Coordinate System in ArcGIS Pipeline
Referencing
Copyright © 2021 Esri
All rights reserved.
Printed in the United States of America.

The information contained in this document is the exclusive property of Esri. This work is protected under United States copyright law and other international copyright treaties and conventions. No part of this work may be reproduced or transmitted in any form or by any means, electronic or mechanical, including photocopying and recording, or by any information storage or retrieval system, except as expressly permitted in writing by Esri. All requests should be sent to Attention: Contracts and Legal Services Manager, Esri, 380 New York Street,
Redlands, CA 92373-8100 USA.

The information contained in this document is subject to change without notice.

Esri, the Esri globe logo, The Science of Where, ArcGIS, esri.com, and @esri.com are trademarks, service marks, or registered marks of Esri in the United States, the European Community, or certain other jurisdictions. Other companies and products or services mentioned herein may be trademarks, service marks, or registered marks of their respective mark owners.
Pipeline Referencing data in a Geographic Coordinate System
ArcGIS Pipeline Referencing supports both projected and unprojected data throughout the tools and capabilities in the extension. Minimum schema items, LRS Networks, and LRS Events are all modeled as feature classes, which supports utilization of other tools beyond Pipeline
Referencing throughout ArcGIS Pro and other parts of the Esri system, such as ArcGIS Server.
Users should remember, however, that Pipeline Referencing is first and foremost, a linear referencing extension, rooted in ArcGIS Pro and ArcGIS Server. Linear referencing at its core involves calculations related to length and distance; these calculations are most accurate when completed on data that is planar.
To facilitate being able to linear reference unprojected data with a high level of accuracy, the data needs to be transformed from a Geographic Coordinate System (GCS) to a Planar
Coordinate System (PCS). Pipeline Referencing automatically executes the necessary transformations (behind the scenes) throughout the software, like measure interpolation, with a high level of accuracy.

                                Figure 1: Example of a planar and geodesic line.

For a high level of accuracy on distance and length-based calculations, there are some data considerations for Pipeline Referencing users to ensure all tools and capabilities within the software work as expected. Users should consider the XY and Z tolerance and resolution values associated with their data and should also be aware of distances between vertices on the polylines that will serve as the centerline geometry (and be utilized to build the routes in their
LRS Networks).

How does the distance between vertices on routes impact LRS data in a Geographic Coordinate System?
When a polyline in a Geographic Coordinate System that is part of a route in Pipeline
Referencing is utilized for editing tools, such as Realign Route, and other linear referencing operations, like measure interpolation, users should be aware of the distance between vertices on the polyline. Since polylines are converted from geodesic segments into planar (straight line)
segments for linear refencing calculations, sparsely populated vertices on long polylines can

November 2021                                                                               Page 3 of 9 result in error when attempting to interpolate measures and get intermediate locations (XYZ coordinates) on the polylines. The larger the distance between two vertices or points on a polyline, the more variability that is introduced to these calculations. This variability can result in errors in tools in the software as the necessary calculations to execute the tool aren’t possible.
To ensure vertices are at a distance that allows tools and calculations to be completed in linear referenced data managed by Pipeline Referencing, users should reference the formula provided in the section below. This formula will allow users to calculate the maximum distance between vertices in their data while considering the XY and Z tolerances configured for their feature classes.

How does the XY and Z tolerance impact LRS data in a
Geographic Coordinate System?
As mentioned in the section above, the XY and Z tolerances configured for feature classes with a Geographic Coordinate System that are managed by Pipeline Referencing will impact the maximum distance between vertices that will still allow for linear referencing and other calculations to be completed.
Pipeline Referencing has requirements for how the XY, Z, and M tolerance and resolution values should be configured for feature classes that are managed by the extension. When the feature classes are configured with a GCS, these values are utilized throughout many of the tools, including to determine whether polylines and points touch. For instance, during the
Realign Route operation, when a new centerline is digitized, users expect the polyline to snap to the existing route to represent where the new pipe is cut into the existing pipe. To determine if the polyline is touching the route, the user configured XY and Z tolerances are considered.
As mentioned previously, having data in a GCS will involve behind the scenes transformations into planar segments to complete the calculations. Having very small tolerance values provides a smaller area where the centerline can begin/end and be touching the existing route polyline.
There is a relationship between the segment lengths of the centerline and the tolerance values that need to be preserved to avoid errors during LRS editing. The larger the distance between two vertices on a polyline, the more error that can be introduced during calculations, which would require a larger tolerance value to ensure the polyline is touching the route.
The image below shows the factors that contribute to calculating a reasonable maximum length between point A and C (segment AC) for data in a GCS. In the image below, this length (L)
between points A and C is impacted by the average radius (R) and the height (h), which is represented by the XY and Z tolerances. B is a point on the surface of the Earth which you want to consider to be coincident with the segment AC (such as the endpoints of a new centerline utilized for realignment), but due to the GCS-to-PCS conversion, it may be interpreted to be at a distance h from the segment.

November 2021                                                                                Page 4 of 9
                                       Figure 2: Calculation of segment length of AC.

Users can utilize the formula below to determine the maximum length between two vertices on a polyline or polyline segment to successfully have linear referencing calculations executed on the data.

R = the average radius or the lesser of two radii (for example in WGS 1984 R =
6,367,444.657)
h = the smallest of the XY and Z tolerances of the feature class (for example in WGS 1984
H = 0.001 m for the default tolerances)
These values will depend on each user’s selected GCS and the XY and Z tolerances they configure. Users can find the h and R values for their data by viewing the source section of the properties within ArcGIS Pro for their centerline feature class.

    Figure 3: Example source properties for features class in ArcGIS Pro. R would equal the value for the Semiminor Axis.

November 2021                                                                                                     Page 5 of 9
For example, if a user has their data in WGS 1984 and takes the default XY and Z tolerances of
0.001 m, the calculation would be:
L = 2 * √6367444.6572 – (6367444.657 – 0.001)2
L = 225.697 m
The 225.697 meters represent the maximum length between two points (vertices) on the polyline that would allow for calculations to be successfully completed by the software. A segment length beyond this value could cause parts of the software to interpret point B and segment AC shown in the graphic above to not touch when the user would expect the polylines to be touching.
It is worth noting that the above calculation is an approximation because the Earth is not a sphere and the geodesic segment is not a circular arc. It is recommended that while setting up data for Pipeline Referencing as described below, a value smaller by 10-20% than the maximum length should be considered. In other words, instead of 225.697 meters the users may want to use 200 meters for densification.

GCS               Minimum XYZ            Radius “R”          Max Length “L”      Densification tolerance “h”                                                  Distance
 WGS 1984          0.001 m                6367444.657         225.697 m           200 m
 NAD 1983          0.01 m                 6356752.314         713.120 m           630 m

What options do I have to make my LRS data in a Geographic
Coordinate System work within ArcGIS Pipeline Referencing?
For Pipeline Referencing users that will utilize a GCS for their linear referenced data, it is recommended that you perform the calculation above to determine the maximum length between vertices expected by the software. Because the formula incorporates the XY and Z tolerances of the feature classes, users have flexibility to set these tolerance values, along with the desired distance between vertices, that align best with their business rules.
For users that are in the process of modeling their schema and loading data in preparation to adopt Pipeline Referencing, they can select XY and Z tolerances that will produce a maximum distance between vertices that matches their data expectations.
For example, if a user will model their data in WGS 1984 and the polylines that represent their routes are densified to 400 m or less between vertices, they could utilize the formula above to determine that an XY and Z tolerance of 0.00314 m or larger should be used when modeling the feature classes that are managed by Pipeline Referencing.
For users with a set XY and Z tolerance or the inability to change tolerances because the feature classes have already been created that need to ensure their source routes have a specific distance between vertices, they can utilize one of the two geoprocessing tools that will densify centerline data, Densify or Geodetic Densify. These tools allow users to provide a source polyline feature class and specify the pre-determined maximum distance between vertices that are acceptable during the densification process. While users can utilize either tool

November 2021                                                                             Page 6 of 9 to densify their source routes to a specific distance, the tools do have some differences. The
Geodetic Densify tool will produce an entirely new feature class when executed, while the
Densify tool will update the existing feature class based on the parameters populated in the tool.

 Figure 4: Example of Densify tool parameters.     Figure 5: Example of Geodetic Densify tool parameters.

For users that have already loaded their data and are utilizing Pipeline Referencing, densifying their data within the feature classes managed by the extension will be the only option as tolerances can’t be changed once a feature class has been created. These users will have the option to densify their centerlines and routes, if needed, for either all routes or on a route by route basis.
For users that want to densify all their features at a single time, it is recommended users densify the centerline feature class. Once the densification is complete, users should execute the
Generate Routes geoprocessing tool on any LRS Networks to ensure route features get the new densified geometry followed by executing the Generate Events geoprocessing tool, so event geometry is updated as well. Centerlines provide the geometry for routes in LRS
Networks (and for LRS Events associated with those routes), so densifying centerlines will allow the operation to be run a single time and then propagated to those routes and events.
Note this densification will result in additional vertices being added to centerlines, routes, and events, which will result in the measure interpolation being more accurate. This higher accuracy in interpolation could shift the existing measures on routes and the events that are linear referenced on those routes.
It is recommended that users revisit and QC their route calibration after this densification in case any additional calibration points are required or events need their measures updated to reflect the more accurate interpolation on the routes.
For users that want to densify only certain features, the process above can be followed with selection sets utilized to only select the specific centerlines to be densified.
Once densification is complete, users should continue to be aware of the distance requirements within their data as they digitize or import additional centerlines as the routes in their LRS

November 2021                                                                                       Page 7 of 9 changes. It is recommended that users educate their editors about these requirements and ensure they are aware of the maximum length for their data as they make edits to routes utilizing new centerlines.
User should also note that if their data is in a GCS and they have not run into any errors in
Pipeline Referencing tools, there may not be any densification needed in their data. Even if existing data is already densified to the required value for their data, they should be aware of the required densification when creating or importing new centerlines.

Last Updated: 11/2021

November 2021                                                                            Page 8 of 9
For more information, visit http://esriurl.com/.
