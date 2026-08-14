# Online docs v1.0 — curated online-documentation fetch and cache

First release of the online-docs component: a curated SharePoint list
(**Online Docs**) mapping keywords to Esri public documentation
pages, and a weekly Power Automate flow, **OnlineDocFetch**, that
fetches each mapped page over HTTPS, converts the HTML to clean text
with the new `HtmlToText` Office Script, and caches the text as a
markdown file in the LRS Doc Index library. Consumers ship
separately: the sweep's v2.9 match/surface pass (story sidecars gain
an `online_docs:` yaml line and an `## Online references` section)
and TestPlanGen v2.14 (cached text becomes the `OnlineDocText`
grounding lane in prompt v1.6). This component is inert standalone —
deploy it first; nothing reads the caches until those versions land.

| Piece | Version | Where |
|---|---|---|
| Online Docs list schema | v1.0 | `schemas/SPList_OnlineDocs.csv` |
| Seed catalog (format examples) | v1.0 | `onlinedocs/OnlineDocs_Seed.csv` |
| Build + deploy guide | v1.0 | `onlinedocs/OnlineDocs_Setup.md` |
| OnlineDocFetch flow (authored, not exported) | v1.0 | `onlinedocs/flow/v1_0/definition.json` |
| HtmlToText script | v1.0 | `scripts/HtmlToText.ts` (authored as `review/patches/HtmlToText_v1_0.ts`, gated by `check_htmltotext.py` / r7) |
| Sweep / TestPlanGen consumers | shipped separately | `flow/v2_9/CHANGES.md`, `testplangen/CHANGES.md` v2.14 |

## What shipped

- **The Online Docs list** — ten columns; ownership invariant:
  curators write `Title`/`Url`/`UrlKey`/`Summary`/`MatchKeywords`/
  `SurfaceScope`, the flow writes ONLY `CachedTextUrl`/`LastFetched`/
  `FetchStatus`/`LastError` via field-scoped MERGE. `MatchKeywords`
  is '; '-joined lowercase, canonical keyword PLUS aliases (alias
  folding is a curation convention — the guide §1 spells it out).
- **The flow** — Sunday 08:00 Mountain (curation holds Saturday, the
  sweep 17:00 daily): one `$top MaxDocsPerRun` list fetch, in-memory
  due-ness (`FetchStatus`/`RefreshDays 13`), a host allowlist guard
  (`AllowedHosts` — pro/enterprise/developers/doc.arcgis.com), the
  premium HTTP GET, `HtmlToText` conversion capped at `TextCap
  60000`, a `thin-extract` tripwire that routes JS-rendered shells
  to `FetchStatus = Error` instead of caching menu soup, idempotent
  fixed-name cache writes (`{title-slug}__od{ID}.md`, plain header —
  deliberately not the sidecar yaml frame), per-row Try/Row_failed
  isolation, the curation-pattern Catch, and an F11-style
  `Od_summary` (`rows= fetched= errors= skipped=`).
- **The cache location** — `/LRS Doc Index/Online Docs`: never swept
  (the sweep walks the source Documents library), Q&A-agent-visible
  by deliberate choice (official documentation as Q&A knowledge; the
  guide §2 documents the Shared Documents fallback if that choice is
  ever reversed).
- **The script** — `HtmlToText.ts` v1.0: regex pipeline (no DOM in
  Office Scripts), chrome strip (`script`/`style`/`noscript`/`nav`/
  `header`/`footer`/`aside`), heading/list/table structure kept as
  markdown, entity decode, `maxChars` cap, `{title, text, chars,
  truncated, note}` result with `thin-extract` under 500 chars.
  Fixture-free suite `review/harness/check_htmltotext.py` (44
  checks), wired into CI; gated with the r7 batch.

## The authored definition, honestly

`flow/v1_0/definition.json` is transcribed from the guide §4, not
exported from the tenant (the curation v1.1 precedent, same
caveats): the `Run_htmltotext.scriptId` is a placeholder — re-pick
the script in the designer — and `Config_od.OnlineDocsList` (and the
`Get_od_rows` table) carry `REPLACE-WITH-ONLINEDOCS-LIST-GUID` until
the list is created and its GUID recorded in
`docs/SP_Adaptation_Notes.md`. No package zip is fabricated; cut it
from the first tenant export and diff RL-4-style.

## Install order

`onlinedocs/OnlineDocs_Setup.md` §§0–6 in order: DLP check for the
HTTP connector FIRST (the one genuinely new dependency — no
fallback exists if it's blocked) → list + seed → cache folder →
script paste → flow → views → smoke suite. This whole component
before sweep v2.9 and TestPlanGen v2.14.

## Verification record

Local harness: `check_htmltotext.py` PASS (44 ok / 0 FAIL,
2026-08-14, part of the r7 gate — see `review/harness/README.md`).
Corpus-neutral otherwise: no sweep flow change, no sidecar format
change in THIS component (the format change is sweep v2.9's and
carries its own gate legs).

Live-tenant smoke run (fill in at deployment; suite =
`onlinedocs/OnlineDocs_Setup.md` §6):

| Date | Tenant | Steps passed (of 6) | OnlineDocsFetchVersion |
|---|---|---|---|
| — | — | — | v1.0 |
