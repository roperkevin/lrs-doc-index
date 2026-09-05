# Dynamic Segmentation: Expression Display Support

| Field | Value |
| --- | --- |
| **Doc** | 21 · Test Plan · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#31520](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/31520) |
| **Source** | [31520-SupportAdvancedLabelinSLD_TestPlan1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/31520-SupportAdvancedLabelinSLD_TestPlan1.pptx>) |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2026-06-18 20:24 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | dynamic segmentation · arcade expressions · expression display · labeling · experience builder · pipeline devices · centerline · feature geometry · stationing · attribute fetching · related record · date time · slope calculation · pipe volume |
| **Tools** | Dynamic Segmentation |

## Summary

Test plan for advanced label display support in the Dynamic Segmentation widget using Arcade expressions and concatenated fields. Covers positive tests for expression evaluation, configuration, and fallback behavior with various data types and layers. Includes example Arcade scripts for concatenation, geometry fetching, stationing calculation, attribute fetching, date/time handling, slope calculation, and pipe volume/area calculation.

## Related documents

<!-- related:begin -->
- [Iteration Planning and Issue Tracking for Location Referencing 3.8/12.2](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Schedules/3040-iteration-planning-and-issue-tracking-for-lr-3-8-12-2.md>) — shared issue Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#31520 · similar text 0.06 <!-- rel:2 s=1001.316 -->
- [Dynamic Segmentation SLD - Expression Display Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynseg-sld-expression-display-support.md>) — similar text 0.22 · 5 title words · 1 filename word · same surface <!-- rel:25 s=6.789 -->
- [Test Plan: Display Expanded LRS and Business Attributes in the SLD Hover Tooltip](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/24784-display-expanded-lrs-and-business-attributes-in-the-sld.md>) — similar text 0.09 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:908 s=4.044 -->
- [Experience Builder Versioning Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/exb-versioning.md>) — similar text 0.03 · same kind/surface/folder <!-- rel:73 s=2.761 -->
- [Create Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/create-route-ai-assistant.md>) — similar text 0.04 · same kind/folder <!-- rel:98 s=2.623 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html)
<!-- docs:end -->

---

## Test Cases

### TC-P01 — Invalid expression, fallback to default label field <!-- src: S4 · slide 1 · Positive Tests: Invalid expression, fallback to default label · 1 -->

- **Group:** Invalid Expression, Fallback To Default Label

### TC-P02 — Field not included in Attribute Set included in expression <!-- src: S4 · slide 1 · Positive Tests: Invalid expression, fallback to default label · 2 -->

- **Group:** Invalid Expression, Fallback To Default Label
- **Case:** Field not included in Attribute Set included in expression, fallback to default label field

### TC-P03 — Related record not included in Feature Service/Web Map when script calls <!-- src: S4 · slide 1 · Positive Tests: Invalid expression, fallback to default label · 3 -->

- **Group:** Invalid Expression, Fallback To Default Label
- **Case:** Related record not included in Feature Service/Web Map when script calls for related record, fallback to default label field

### TC-P04 — Configured expression from Feature Service/Web Map appear as a configurable <!-- src: S4 · slide 1 · Positive Tests: Configuration · 1 -->

- **Group:** Configuration
- **Case:** Configured expression from Feature Service/Web Map appear as a configurable display field drop down

### TC-P05 — Configured expression only appear in the display field list for their respective <!-- src: S4 · slide 1 · Positive Tests: Configuration · 2 -->

- **Group:** Configuration
- **Case:** Configured expression only appear in the display field list for their respective layers

### TC-P06 — Underlying expression appears as tooltip when hovering over custom expression <!-- src: S4 · slide 1 · Positive Tests: Configuration · 3 -->

- **Group:** Configuration

### TC-P07 — Arcade script that concatenates fields in a single layer (1) <!-- src: S4 · slide 1 · Positive Tests · 1 -->

### TC-P08 — Arcade script that concatenates fields across intersecting layers (1) <!-- src: S4 · slide 1 · Positive Tests · 2 -->

### TC-P09 — Arcade script that fetches feature geometry (x, y, z) (1) <!-- src: S4 · slide 1 · Positive Tests · 3 -->

### TC-P10 — Arcade script that calculates stationing measure value (1) <!-- src: S4 · slide 1 · Positive Tests · 4 -->

### TC-P11 — Arcade script that fetches attributes from a nearby feature (1) <!-- src: S4 · slide 1 · Positive Tests · 5 -->

### TC-P12 — Arcade script that fetches attributes from a related record (1) <!-- src: S4 · slide 1 · Positive Tests · 6 -->

### TC-P13 — Arcade script that fetches current date and/or time <!-- src: S4 · slide 1 · Positive Tests · 7 -->

### TC-P14 — Arcade script that calculates slope of line feature based on start and end (1) <!-- src: S4 · slide 1 · Positive Tests · 8 -->

- **Case:** Arcade script that calculates slope of line feature based on start and end vertex Z values

### TC-P15 — Arcade script that calculates surface area/volume of a pipe (1) <!-- src: S4 · slide 1 · Positive Tests · 9 -->

### TC-U01 — Arcade script that concatenates fields in a single layer (case 1) <!-- src: S2 · slide 2 · case 1 -->

Input expression/expected output:

- `$feature.Depth + $feature.Width  /  10`
- `$feature.FunctionalClass + ‘, ’ + $feature.SegmentLength  /  Class 1, 10`
- `$feature.Width * $feature.Length  /  10`
- `$feature.Measure + $feature.Depth * $feature.width  /  10`
- `$feature.County + ‘, ‘ + $feature.City + ‘, ‘ + $feature.Jurisdiction  /  Shasta, Redding, Local`
- `$feature.Mass ÷ $feature.Volume  /  10`
- …

### TC-U02 — Arcade script that concatenates fields across intersecting layers (case 2) <!-- src: S2 · slide 3 · case 2 -->

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

### TC-U03 — Arcade script that fetches feature geometry (x, y, z) (case 3) <!-- src: S2 · slide 4 · case 3 -->

Input expression/expected output:

- `Geometry($feature).x  /  418,419.5445000`
- `Geometry($feature).y  /  4,327,760.3565000`
- `Geometry($feature).z  / 15`
- `Geometry($feature).x + ‘, ‘ + Geometry($feature).y + ‘, ‘ + Geometry($feature).z  / 418,419.5445000, 4,327,760.3565000, 15`
- …

### TC-U04 — Arcade script that calculates stationing measure value (case 4) <!-- src: S2 · slide 5 · case 4 -->

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

### TC-U05 — Arcade script that fetches attributes from a nearby feature (case 5) <!-- src: S2 · slide 6 · case 5 -->

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

### TC-U06 — Arcade script that fetches attributes from a related record (case 6) <!-- src: S2 · slide 7 · case 6 -->

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

### TC-U07 — Arcade script that fetches date and/or time <!-- src: S2 · slide 8 · case 7 -->

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

### TC-U08 — Arcade Script That Calculates Slope of Line Feature Based on Start and End (case 8) <!-- src: S1 · slide 9 · case 8 -->

- **Case:** Arcade script that calculates slope of line feature based on start and end vertex Z values

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

### TC-U09 — Arcade script that calculates surface area/volume of a pipe (case 9) <!-- src: S2 · slide 10 · case 9 -->

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

## Other content

### Slide 1 — Devtopia Issue <!-- slide 1 -->

Dynamic Segmentation: Expression Display Support

**Notes**
- Add support for advanced label display in SLD using Arcade expressions and/or concatenated fields
- Custom Display Field will only appear in SLD when configured. It will appear in the hover, drill down, and label.
- Expressions will be inherited from the Feature Service/configured Web Map layer’s Display Field. Creation/editing of expressions will not be supported within the Dynamic Segmentation widget
- Expressions will be evaluated per layer
- If expression is invalid/unsupported, label will fallback to default label field
- Test with UNAPR, RH, ADMRH, and PoM data
- Test with point/line events, Pipeline Devices/Junctions, and centerline layers (where applicable)
- Test with expressions configured for multiple layers within large datasets
- Run Allyhawk tests to ensure accessibility issues are not introduced
- Numerous scripts can be found at https://github.com/Esri/arcade-expressions for use in Display Field
- UN layers in the sample dataset from the Gas and Pipeline Referencing Utility Network Foundation ArcGIS Solution have custom Display Fields. Test publishing this dataset and using it in Experience Builder
- Focus on test cases that have scripts that grab only from the input layer. Test cases for multi-layer expressions will not be focus
- Ensure expressions give same result between Pro and Experience Builder
