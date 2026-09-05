# Dynamic Segmentation: Expression Display Support

|   |   |
| --- | --- |
| **Kind** | Test Plan · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Issue** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#31520](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/31520) |
| **Source** | [31520-SupportAdvancedLabelinSLD_TestPlan1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/31520-SupportAdvancedLabelinSLD_TestPlan1.pptx>) |
| **Edited** | 2026-06-18 20:24 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Dynamic Segmentation: Expression Display Support"
source_file: "31520-SupportAdvancedLabelinSLD_TestPlan1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/31520-SupportAdvancedLabelinSLD_TestPlan1.pptx"
doc_id: 21
doc_kind: "Test Plan"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2026-06-18T20:24:52Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["dynamic segmentation", "arcade expressions", "expression display", "labeling", "experience builder", "pipeline devices", "centerline", "feature geometry", "stationing", "attribute fetching", "related record", "date time", "slope calculation", "pipe volume"]
tools: ["Dynamic Segmentation"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: ["Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#31520"]
related: [{"doc":2,"file":"iteration-planning-and-issue-tracking-for-location-referencing-3-8-12-2__doc2.md","s":1001.316},{"doc":25,"file":"dynamic-segmentation-sld-expression-display-support__doc25.md","s":6.789},{"doc":908,"file":"test-plan-display-expanded-lrs-and-business-attributes-in-the-sld-hover-tooltip__doc908.md","s":4.044},{"doc":73,"file":"experience-builder-versioning-test-plan__doc73.md","s":2.761},{"doc":98,"file":"create-route-ai-assistant-test-plan__doc98.md","s":2.623}]
```
-->

## Summary

Test plan for advanced label display support in the Dynamic Segmentation widget using Arcade expressions and concatenated fields. Covers positive tests for expression evaluation, configuration, and fallback behavior with various data types and layers. Includes example Arcade scripts for concatenation, geometry fetching, stationing calculation, attribute fetching, date/time handling, slope calculation, and pipe volume/area calculation.

## Related documents

<!-- related:begin -->
- [Iteration Planning and Issue Tracking for Location Referencing 3.8/12.2](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Schedules/iteration-planning-and-issue-tracking-for-location-referencing-3-8-12-2__doc2.md>) — shared issue Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#31520 · similar text 0.06 <!-- rel:2 -->
- [Dynamic Segmentation SLD - Expression Display Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynamic-segmentation-sld-expression-display-support__doc25.md>) — similar text 0.22 · 5 title words · 1 filename word · same surface <!-- rel:25 -->
- [Test Plan: Display Expanded LRS and Business Attributes in the SLD Hover Tooltip](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/test-plan-display-expanded-lrs-and-business-attributes-in-the-sld-hover-tooltip__doc908.md>) — similar text 0.09 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:908 -->
- [Experience Builder Versioning Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/experience-builder-versioning-test-plan__doc73.md>) — similar text 0.03 · same kind/surface/folder <!-- rel:73 -->
- [Create Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/create-route-ai-assistant-test-plan__doc98.md>) — similar text 0.04 · same kind/folder <!-- rel:98 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html)
<!-- docs:end -->

---

## Slide 1

Dynamic Segmentation: Expression Display Support

| Positive Tests: Invalid expression, fallback to default label |
| --- |
| Invalid expression, fallback to default label field Field not included in Attribute Set included in expression, fallback to default label field Related record not included in Feature Service/Web Map when script calls for related record, fallback to default label field |

| Notes |
| --- |
| Add support for advanced label display in SLD using Arcade expressions and/or concatenated fields Custom Display Field will only appear in SLD when configured. It will appear in the hover, drill down, and label. Expressions will be inherited from the Feature Service/configured Web Map layer’s Display Field. Creation/editing of expressions will not be supported within the Dynamic Segmentation widget Expressions will be evaluated per layer If expression is invalid/unsupported, label will fallback to default label field Test with UNAPR, RH, ADMRH, and PoM data Test with point/line events, Pipeline Devices/Junctions, and centerline layers (where applicable) Test with expressions configured for multiple layers within large datasets Run Allyhawk tests to ensure accessibility issues are not introduced Numerous scripts can be found at https://github.com/Esri/arcade-expressions for use in Display Field UN layers in the sample dataset from the Gas and Pipeline Referencing Utility Network Foundation ArcGIS Solution have custom Display Fields. Test publishing this dataset and using it in Experience Builder Focus on test cases that have scripts that grab only from the input layer. Test cases for multi-layer expressions will not be focus Ensure expressions give same result between Pro and Experience Builder |

Devtopia Issue

| Positive Tests: Configuration |
| --- |
| Configured expression from Feature Service/Web Map appear as a configurable display field drop down Configured expression only appear in the display field list for their respective layers Underlying expression appears as tooltip when hovering over custom expression |

| Positive Tests |
| --- |
| Arcade script that concatenates fields in a single layer Arcade script that concatenates fields across intersecting layers Arcade script that fetches feature geometry (x, y, z) Arcade script that calculates stationing measure value Arcade script that fetches attributes from a nearby feature Arcade script that fetches attributes from a related record Arcade script that fetches current date and/or time Arcade script that calculates slope of line feature based on start and end vertex Z values Arcade script that calculates surface area/volume of a pipe |

## Case 1 <!-- slide 2 -->

### Arcade Script That Concatenates Fields in a Single Layer

Input expression/expected output:

- `$feature.Depth + $feature.Width  /  10`
- `$feature.FunctionalClass + ‘, ’ + $feature.SegmentLength  /  Class 1, 10`
- `$feature.Width * $feature.Length  /  10`
- `$feature.Measure + $feature.Depth * $feature.width  /  10`
- `$feature.County + ‘, ‘ + $feature.City + ‘, ‘ + $feature.Jurisdiction  /  Shasta, Redding, Local`
- `$feature.Mass ÷ $feature.Volume  /  10`
- …

## Case 2 <!-- slide 3 -->

### Arcade Script That Concatenates Fields Across Intersecting

Input (yellow highlight denotes values that will need to be updated for use across multiple layers):

```arcade
// Primary feature (point or line)
var field1 = DefaultValue($feature.FIELD1, "Unknown");

// Polygon layer
var polygons = FeatureSetByName(
    $map,
```

    “POLYGONLAYER_NAME",
    [“FIELD_NAME"],
    true

```arcade
);

// Find intersecting polygon
var polygon = First(Intersects($feature, polygons));

// Build label
return Concatenate([
    name,
    DefaultValue(polygon[“FIELD_NAME"], "No polygon")
], " | ");
```

Example outputs:

- Crash | Shasta County
- Class 1 | Leased
- 450 psi | Easement
- 45 mph | State
- …

**Arcade script that concatenates fields across intersecting layers**

## Case 3 <!-- slide 4 -->

### Arcade Script That Fetches Feature Geometry (x, Y, Z)

Input expression/expected output:

- `Geometry($feature).x  /  418,419.5445000`
- `Geometry($feature).y  /  4,327,760.3565000`
- `Geometry($feature).z  / 15`
- `Geometry($feature).x + ‘, ‘ + Geometry($feature).y + ‘, ‘ + Geometry($feature).z  / 418,419.5445000, 4,327,760.3565000, 15`
- …

## Case 4 <!-- slide 5 -->

### Arcade Script That Calculates Stationing Measure Value

Input expression:

```arcade
var station = $feature.MEASURE

var IsNegative = 0 //tracks +/- values
var Type = 'Feet' //"Meters" Switch type as needed

if (station < 0) {
  //convert all negative stations to positive and append back the - at the end
  station = station * -1
  IsNegative = 1
}

//##00+00.0 or ##0+000.0 - These functions will provide this format regardless the length of the field
//formatting with decimals after the + sign - if there is not

if (Type == 'Feet') var StationlbR = Text(station, '00.0')
if (Type == 'Meters') var StationlbR = Text(station, '000.0')

//Getting rid of the two initial character dividing by 100 or 1000. formatting result with 2 zeros and room for more characters
//using the Split function to extract from the second character from the left of the decimal point
if (Type == 'Feet')
  var StationlbL = Text(First(Split(station / 100, '.', 1)), '###00')
if (Type == 'Meters')
  var StationlbL = Text(First(Split(station / 1000, '.', 1)), '###000')

var Stationlb = Concatenate([StationlbL, StationlbR], '+')
if (IsNegative == 1) Stationlb = '-' + Stationlb

return Stationlb
```

Example outputs:

- 1008+76.6
- 40+5
- 30+03
- …

## Case 5 <!-- slide 6 -->

### Arcade Script That Fetches Attributes From a Nearby Feature

```arcade
// CONFIGURATION (update only these)
var targetLayerName = "TARGET_LAYER";        // Layer to search
var outputFields = ["FIELD_1", "FIELD_2"];   // Fields to return
var bufferDistance = 100;                    // Buffer distance
var bufferUnits = "feet";                    // Units ('feet', 'meters', etc.)

// Validate geometry
if (IsEmpty(Geometry($feature))) {
    return null;
}

// Get target layer
var targetFS = FeatureSetByName(
    $map,
```

    targetLayerName,
    outputFields,
    true

```arcade
);

// Find nearby/intersecting features
var bufferedGeom = Buffer($feature, bufferDistance, bufferUnits);
var candidates = Intersects(targetFS, bufferedGeom);

// Build array of features + distances
var featuresWithDistances = [];

for (var f in candidates) {
    Push(featuresWithDistances, {
        'distance': Distance($feature, f, bufferUnits),
        'feature': f
    });
}

// Sort by distance
function sortByDistance(a, b) {
    return a.distance - b.distance;
}

var sorted = Sort(featuresWithDistances, sortByDistance);

// Get closest feature
var closest = First(sorted);

if (IsEmpty(closest)) {
    return null;
}

// Build dynamic label from fields
var resultParts = [];

for (var fieldName in outputFields) {
```

    Push(
        resultParts,

```
        DefaultValue(closest.feature[outputFields[fieldName]], "")
    );
}

// Return concatenated result (stacked optional)
return Concatenate(resultParts, " , ");
```

``
Example outputs:

- Class 1, 450 psi
- Major Collector, 45 MPH
- Yield, Full Access
- ...

## Case 6 <!-- slide 7 -->

### Arcade Script That Fetches Attributes From a Related Record

Input expression:

```arcade
// CONFIGURATION (update only these)
var relationshipName = "RELATIONSHIP_NAME";   // Relationship name
var sourceField = "SOURCE_FIELD";             // Field from current layer
var relatedField = "RELATED_FIELD";           // Field from related layer

// Get current feature value
var sourceValue = DefaultValue($feature[sourceField], "");

// Get related feature
var relatedFeature = First(
    FeatureSetByRelationshipName(
        $feature,
```

        relationshipName,
        [relatedField],
        false

```
    )
);

// Get related value safely
var relatedValue = "";

if (!IsEmpty(relatedFeature)) {
    relatedValue = DefaultValue(relatedFeature[relatedField], "");
}

// Build output
return Concatenate([
```

    sourceValue,
    relatedValue
], “ , ");
Expected outputs:

- Class 1, 001
- 45 MPH, 002
- Dent, Work Order 003
- …

## Case 7 <!-- slide 8 -->

### Arcade Script That Fetches Date and / or Time

**Arcade script that fetches date and/or time**

- Input expression/expected output:
- Now()  /  Jun 15, 2026, 12:14:01 PM Pacific Daylight Time
- Time()  /  12:14:21.781
- Now() + ‘, ‘ + Time()  /  2026-06-15T12:14:50.272-07:00, 12:14:50.272
- Year(Now())  /  2026
- `$feature.FromDate, + ‘  –  ‘ + $feature.ToDate  /  1/1/2000 – 1/1/2010`
- `TimeZone($feature.FromDate)  /  America/Los_Angeles`
- `var startDate = Date($feature.FromDate)`

```arcade
var endDate = Date($feature.ToDate)
var age = DateDiff(endDate, startDate, ‘years’);
return age;
```

10

- …

## Case 8 <!-- slide 9 -->

### Arcade Script That Calculates Slope of Line Feature Based on

**Arcade script that calculates slope of line feature based on start and end vertex Z values**

```arcade
if (IsEmpty(Geometry($feature)) || Length(Geometry($feature)) == 0)
{
  return $feature.slope;
}
// get the paths of the line
var paths = Geometry($feature)['paths'];

// Get the First and Last vertex, and select the lowest of the two
down_elevation = min(paths[0][0]['z'], paths[-1][-1]['z'])

// Get the First and Last vertex, and select the highest of the two
up_elevation = max(paths[0][0]['z'], paths[-1][-1]['z'])

// Calc the slope
return ABS((up_elevation - down_elevation)/Length(Geometry($feature)))
```

## Case 9 <!-- slide 10 -->

### Arcade Script That Calculates Surface Area / Volume of a Pipe

**Arcade script that calculates surface area/volume of a pipe**

```arcade
// This rule is designed to return the volume or surface area of a pipe
// If you model outside diameter, use this field and set thickness to 0
var diameter = $feature.NOMINALDIAMETER;
// If the diameter is the nominal diameter, set the wall thickness
var thickness = 0; //$feature.WALLTHICKNESS
if (IsEmpty(diameter) || diameter == 0)
{
    return 0;
}
// Convert Diameter to the units of length, in this example, diameter is in inches, length is in feer
diameter = diameter * 0.0833333;

// Get the length of the feature, use LengthGeodetic if not using a projected coordinate system
// var len = LengthGeodetic($feature, 'feet');
var len = Length($feature, 'feet');
if (IsEmpty(len) || len == 0)
{
    return 0;
}
// Surface Area = PI x L x D
var surface_area =  PI * len * diameter;
if (thickness != 0){
surface_area = surface_area * (2 * thickness);
}
// Volume = PI * (R^2) * L
var volume = PI * POW((diameter/2), 2) * len;

// Select the value you want of a pipe
// return ROUND(surface_area, 6);
return ROUND(volume, 6);
```
