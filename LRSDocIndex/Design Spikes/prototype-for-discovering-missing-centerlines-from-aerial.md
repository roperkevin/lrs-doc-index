# Prototype for Discovering Missing Centerlines from Aerial Imagery

| Field | Value |
| --- | --- |
| **Doc** | 24 · Design Spike · Other |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [SpikeAerialImageryCenterlineExtractionPOC.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SpikeAerialImageryCenterlineExtractionPOC.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2026-06-01 23:32 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | centerline · aerial imagery · road extraction · computer vision · candidate centerlines · connectivity enforcement · prototype |
| **Tools** | — |

## Summary

This document describes a proof-of-concept workflow to identify missing road centerlines in an LRS using georeferenced aerial imagery and existing centerline data. It outlines acceptance criteria, testing procedures, and documentation requirements for a prototype that outputs candidate centerlines connected to the existing network. The prototype runs outside ArcGIS Pro and aims to reduce manual centerline discovery through computer vision techniques.

## Related documents

<!-- related:begin -->
- [Spike: Centerline and Measure Extraction from PDF](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/centerline-and-measure-extraction-from-pdf.md>) — similar text 0.10 · 2 filename words · same kind/folder <!-- rel:142 s=3.682 -->
- [Spike: Runtime to support LRS REST operations](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/runtime-to-support-lrs-rest-operations.md>) — similar text 0.07 · 1 filename word · same kind/surface/folder <!-- rel:807 s=2.597 -->
- [Prototype: JSON requests and returns in REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/prototype-json-requests-and-returns-in-rest__doc298.md>) — similar text 0.10 · 1 title word · same kind/folder <!-- rel:298 s=2.16 -->
- [Spike: Civil3D Extraction to Create Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/civil3d-extraction-to-create-route.md>) — similar text 0.10 · same kind/folder <!-- rel:517 s=1.842 -->
- [Spike Web Components](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/spike-web-components__doc389.md>) — similar text 0.07 · same kind/folder <!-- rel:389 s=1.626 -->
<!-- related:end -->

---

## Slide 1 — Spike: Prototype for Discovering Missing Centerlines from Aerial Imagery

## Slide 2 — Proof of Concept Workflow

- As an LRS Editor, I need a proof-of-concept workflow that uses georeferenced aerial/satellite imagery plus the existing centerline feature class to identify candidate road centerlines that are missing from the LRS, so that I can evaluate whether computer vision can reduce manual centerline discovery work.
- Personas:
- LRS Editor — Maintains centerlines, derived routes, and event integrity in an enterprise LRS. This user already relies on imagery during editing and needs a faster way to find unmapped roadway geometry while ensuring connectivity with the existing network.
- Workflow:
- 1. Provide an area of interest, georeferenced imagery, and the current centerline feature class (or exported vectors).
- 2. Convert detected road geometry into candidate centerlines and compare against the existing centerline feature class, keeping only segments not already represented.
- 3. Require each candidate centerline to connect to an existing centerline at one or both endpoints before it is kept.

## Slide 3 — Acceptance Criteria & Requirements

- Choose and document one reasonable approach for the prototype (recommended: segmentation-based road extraction followed by centerline derivation).
- Do not perform a model comparison or bake-off unless required to unblock the workflow.
- Prototype must run outside ArcGIS Pro (no Pro SDK or .NET required).
- Prototype must accept aerial imagery and existing centerline feature class (or exported copy) as inputs.
- Prototype must output candidate centerlines that are not already represented in the existing data.
- Each retained candidate must connect to an existing centerline at one or both endpoints (hard requirement).
- Disconnected candidates must be rejected or written to a separate review layer.
- Deliverables must include working code, runnable demo, and sample outputs.

## Slide 4 — Testing

- Test using at least one dataset with imagery, existing centerlines, and known missing-road examples.
- Verify existing centerlines are not duplicated in outputs.
- Verify all retained candidates connect to existing centerlines at one or two endpoints.
- Review outputs for failure cases such as driveways, parking lots, and shadows.
- Demonstrate full workflow: inputs, execution, outputs, and limitations.

## Slide 5 — Documentation & Deliverables

- Document the chosen approach, needed libraries, and inputs/outputs.
- Document the full workflow including centerline derivation and duplicate filtering.
- Document connectivity enforcement and handling of rejected candidates.
- Provide setup steps, working code, demo instructions, and known limitations for reproducibility.

## Slide 6 — Estimation

- Estimation -
