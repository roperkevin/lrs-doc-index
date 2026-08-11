# DocIndexSweep v1.9 — provenance baseline

This is the pre-v2.0 definition (byte-identical to the
`DocIndexSweep_v1_9.zip` payload), kept for provenance. It sat at
`flow/definition.json` until review round r2 (RL-3) moved it here so
the oldest artifact in the tree no longer reads as the current one.
Release notes for v1.9 predate the per-version CHANGES convention; see
`review/REVIEW.md` (the F1–F12 round) for its production review.

---

**Addendum (2026-08-11, r2 PV-1):** the sibling import zip was re-cut
with the connection `displayName` (a personal work email) scrubbed
from its `manifest.json`. The `definition.json` payload is
byte-identical to the pre-scrub zip; only the manifest changed, so
the zip is no longer the byte-exact export artifact (git history
holds the original). Import behavior is unaffected — connections are
re-mapped at import time.
