# Online Docs Setup — build and deploy

Current component version: **v1.0** (see `CHANGES.md`).

A new, separate Power Automate flow, **OnlineDocFetch**: weekly, walks
the curated **Online Docs** list (keyword → Esri public documentation
URL mappings), fetches each page over HTTPS, converts the HTML to
clean text with the `HtmlToText` Office Script, and caches the text
as a markdown file in the LRS Doc Index library. The sweep (v2.9+)
matches each document's keywords against this list and surfaces the
top matches in the sidecar; TestPlanGen (v2.14+) feeds the cached
text into the generation prompt as grounding. This flow NEVER decides
what is relevant — relevance is the curators' `MatchKeywords` column
and the sweep's match; this flow only keeps the caches fresh.

Like the curation component, this ships primarily as a build guide,
with an authored `onlinedocs/flow/v1_0/definition.json` transcribed
from §4 (not exported from the tenant): use it as a structural
reference or an import starting point, but designer-verify against
this guide, and re-pick the `HtmlToText` script binding (its
`scriptId` is a placeholder — a tenant-minted id this repo cannot
know). No import zip is fabricated — a brand-new flow has no exported
package skeleton; when the built flow is eventually exported, diff it
against the authored definition and cut the zip from the export.

All expressions are pure WDL. The Online Docs list GUID is minted at
list creation — record it in `docs/SP_Adaptation_Notes.md` and paste
it into `Config_od` (and into the sweep's and TestPlanGen's Config
when those components take their v2.9 / v2.14 updates).

---

## 0 — Prerequisites

- Maker access to the environment holding DocIndexSweep, the same
  SharePoint connection, and the Excel Online (Business) connection
  the sweep uses for its scripts.
- **The HTTP connector is allowed by the environment's DLP policy.**
  This is the one genuinely new dependency: the fetch uses the native
  premium HTTP action (Office Scripts invoked from Power Automate
  cannot make external calls, so there is no script fallback).
  Licensing is already covered — AI Builder use implies premium — but
  DLP can still block the connector class. Check BEFORE building:
  create a throwaway flow with a single HTTP GET to
  `https://pro.arcgis.com/` and run it. If DLP blocks it, stop and
  resolve with the environment admin; nothing below works without it.
- The sweep is at v2.9+ before you expect sidecar surfacing, and
  TestPlanGen at v2.14+ before you expect drafts to ground on the
  caches — but this component is inert standalone and can (should) be
  built first.

## 1 — The Online Docs list

Create list **Online Docs** from `schemas/SPList_OnlineDocs.csv`,
internal names first (first-created name = internal name, forever).
Index `UrlKey`. Choice defaults: `SurfaceScope` → `Any`,
`FetchStatus` → `Pending`.

Column ownership, the invariant everything below relies on: humans
(curators) write `Title` / `Url` / `UrlKey` / `Summary` /
`MatchKeywords` / `SurfaceScope`; this flow writes ONLY
`CachedTextUrl` / `LastFetched` / `FetchStatus` / `LastError`, via
field-scoped MERGE. Disjoint writers — no coordination needed.

Seed from `onlinedocs/OnlineDocs_Seed.csv` (verify each URL resolves
in a browser first — the seed rows are format examples, not gospel).

Curation rules (record keepers, read this):

- **MatchKeywords carries the canonical keyword PLUS its common
  aliases**, lowercase, `'; '`-joined. Alias folding is social, not
  code: the sweep matches raw prompt keywords/tools/products against
  this column, so a page mapped only to `conflict prevention` will
  not match a story whose prompt emitted `locks`. The Keywords list
  (CanonicalRef column) shows which aliases exist.
- **Summary is 1–2 sentences, plain text, no quotes or pipes** — it
  renders verbatim inside a one-line sidecar bullet.
- **SurfaceScope discipline**: leave `Any` unless the page is truly
  surface-specific; a `Pro` row never matches an Experience Builder
  doc.
- **Url host must be on the AllowedHosts list** (`Config_od` below);
  anything else is marked Error by the flow, never fetched.

Check: the usual signed-in REST fields query returns the ten columns
with the exact internal names from the schema CSV.

## 2 — The cache folder

Create folder **`Online Docs`** at the root of the **LRS Doc Index**
library (full server-relative path
`/LRS Doc Index/Online Docs`). Two deliberate placement consequences,
both to state out loud:

- **Never swept**: the sweep walks the source Documents library, not
  LRS Doc Index, so caches are never indexed as documents (no rows,
  no keywords, no related-edges minted from them).
- **Q&A-visible**: the Q&A agent grounds on the entire LRS Doc Index
  library (`agent/QA_Agent_Setup.md` §2), so cached Esri help pages
  BECOME part of its knowledge. That is judged a feature — official
  product documentation answering product questions — but it is a
  grounding-scope change. If the team ever wants the Q&A agent
  doc-free, move `CacheFolder` to `/Shared Documents/Online Docs`
  (the curation-digest posture) and re-run the fetch flow; the list
  rows repoint on the next pass.

## 3 — The HtmlToText script

Paste `scripts/HtmlToText.ts` into a new Office Script named
**HtmlToText** in the same `Scripts.xlsx` workbook the sweep's
scripts live in (Automate tab → New script → paste → rename → save).

Check: run it in the editor with `html` =
`<html><title>T</title><body><nav>menu</nav><h1>H</h1><p>body</p></body></html>`,
`maxChars` = 1000 → `result.title` is `T`, `result.text` contains
`# H` and `body` but not `menu`, `note` is `thin-extract` (under 500
chars — expected for a toy page).

## 4 — Build the flow

New flow **OnlineDocFetch**, same environment and connections as the
sweep. Actions in order (names exactly as written — later expressions
reference them):

**Trigger — Recurrence**: Week, `Sunday`, 08:00,
`US Mountain Standard Time`. Rationale: the curation flow holds
Saturday, the sweep runs daily at 17:00 Mountain — Sunday morning
keeps all three apart, and freshly cached pages are in place before
Monday's sweep matches them.

**D1 — `Config_od`** (Compose):

```json
{
  "SiteUrl": "https://esriis.sharepoint.com/sites/lrsworkspace",
  "OnlineDocsList": "REPLACE-WITH-ONLINEDOCS-LIST-GUID",
  "CacheFolder": "/LRS Doc Index/Online Docs",
  "TextCap": 60000,
  "RefreshDays": 13,
  "MaxDocsPerRun": 50,
  "AllowedHosts": "pro.arcgis.com; enterprise.arcgis.com; developers.arcgis.com; doc.arcgis.com",
  "OnlineDocsFetchVersion": "v1.0"
}
```

`RefreshDays 13` = weekly cadence plus slack, so a page refreshes
every second run rather than every run (Esri help topics move
slowly). `TextCap 60000` is the cache-file ceiling, NOT the prompt
budget — TestPlanGen applies its own `OnlineDocCap` at read time.

**D2 — Initialize variables** (three): `FetchedCount` /
`ErrorCount` / `SkippedCount` (Integer, 0).

**D3 — `Try_od`** (Scope) containing:

**D4 — `Get_od_rows`** (Get items, Online Docs list, Top Count
`@{outputs('Config_od')?['MaxDocsPerRun']}`, no filter — due-ness is
decided in memory).

**D5 — `For_each_od_row`** (Apply to each over
`@body('Get_od_rows')?['value']`, concurrency 1):

- **`If_due`** (Condition, advanced mode):

  ```
  @or(not(equals(coalesce(items('For_each_od_row')?['FetchStatus']?['Value'], ''), 'Fetched')), less(ticks(coalesce(items('For_each_od_row')?['LastFetched'], '1900-01-01T00:00:00Z')), ticks(addDays(utcNow(), mul(-1, int(outputs('Config_od')?['RefreshDays']))))))
  ```

  > Designer-verify (the curation C2 caution): confirm on a raw
  > `Get_od_rows` output that the choice column surfaces as
  > `FetchStatus.Value` on your tenant; if it surfaces as a bare
  > string, drop the `?['Value']`.

  **No branch**: **`Inc_skipped`** — Increment `SkippedCount` by 1.

  **Yes branch** — two scopes, per-row isolation so one bad page
  never kills the run (the sweep's per-file Try/Catch posture,
  trimmed):

  **`Try_row`** (Scope):
  - **`Url_value`** (Compose):
    `@{coalesce(items('For_each_od_row')?['Url']?['Url'], '')}`
    > Designer-verify: hyperlink columns surface as `{Description,
    > Url}` objects; if yours surfaces as a bare string, drop the
    > trailing `?['Url']`.
  - **`Host_value`** (Compose):
    `@{toLower(coalesce(split(outputs('Url_value'), '/')?[2], ''))}`
  - **`If_host_ok`** (Condition):
    `@contains(split(outputs('Config_od')?['AllowedHosts'], '; '), outputs('Host_value'))`
    — the allowlist guard: curators, not row data, decide which hosts
    this flow will ever talk to.

    **No branch**:
    - **`Body_row_blocked`** (Compose):

      ```json
      {
        "FetchStatus": "Error",
        "LastError": "If_host_ok: URL host not in AllowedHosts — @{outputs('Host_value')}"
      }
      ```

    - **`Update_row_blocked`** — Send an HTTP request to SharePoint
      (`HttpRequest`, the curation `Clear_state` MERGE shape). Site
      `Config_od.SiteUrl`, method `POST`, uri:

      ```
      _api/web/lists(guid'@{outputs('Config_od')?['OnlineDocsList']}')/items(@{items('For_each_od_row')?['ID']})
      ```

      Headers: `Accept` and `Content-Type` both
      `application/json;odata=nometadata`, `IF-MATCH` `*`,
      `X-HTTP-Method` `MERGE`. Body:
      `@{string(outputs('Body_row_blocked'))}`.
    - **`Inc_error_blocked`** — Increment `ErrorCount` by 1.

    **Yes branch**:
    - **`Fetch_page`** (**HTTP** — the premium action): method `GET`,
      URI `@{outputs('Url_value')}`, header `Accept`:
      `text/html,application/xhtml+xml`.
    - **`Run_htmltotext`** (Excel Online (Business) — Run script):
      the sweep's `Scripts.xlsx` workbook, script **HtmlToText**;
      `html` = `@{string(body('Fetch_page'))}`, `maxChars` =
      `@{outputs('Config_od')?['TextCap']}`.
    - **`Od_result`** (Compose): `@body('Run_htmltotext')?['result']`
    - **`If_extract_ok`** (Condition, advanced mode):

      ```
      @and(equals(coalesce(outputs('Od_result')?['note'], ''), ''), greater(int(coalesce(outputs('Od_result')?['chars'], 0)), 0))
      ```

      `truncated` is fine; a `note` is not — `thin-extract` (page
      likely JS-rendered, text under 500 chars) and `empty-input`
      both land in the No branch so the flow never caches menu soup.

      **Yes branch**:
      - **`Cache_name`** (Compose) — the `Sidecar_name` fallback
        slug chain, `__od{ID}` suffix:

        ```
        @concat(toLower(replace(replace(replace(replace(coalesce(items('For_each_od_row')?['Title'], 'untitled'), ' ', '-'), '#', ''), '%', ''), '/', '-')), '__od', items('For_each_od_row')?['ID'], '.md')
        ```

      - **`Cache_body`** (Compose) — plain header, deliberately NOT
        the sidecar yaml frame (caches are not sidecars and are never
        swept):

        ```
        @concat('# ', coalesce(outputs('Od_result')?['title'], items('For_each_od_row')?['Title']), decodeUriComponent('%0A%0A'), 'Source: <', outputs('Url_value'), '>', decodeUriComponent('%0A'), 'Fetched: ', utcNow(), '  ·  OnlineDocsFetchVersion: ', outputs('Config_od')?['OnlineDocsFetchVersion'], decodeUriComponent('%0A%0A'), '---', decodeUriComponent('%0A%0A'), outputs('Od_result')?['text'])
        ```

      - **`Save_cache`** (Create file — the `Save_sidecar` shape):
        site `Config_od.SiteUrl`, folder
        `@{outputs('Config_od')?['CacheFolder']}`, name
        `@{outputs('Cache_name')}`, content
        `@{outputs('Cache_body')}`. Fixed name per row = idempotent
        overwrite.
      - **`Cache_url`** (Compose — the sweep's `Text_file_url`
        pattern):
        `@concat(outputs('Config_od')?['SiteUrl'], outputs('Config_od')?['CacheFolder'], '/', outputs('Cache_name'))`
      - **`Body_row_ok`** (Compose):

        ```json
        {
          "CachedTextUrl": {
            "Description": "@{replace(coalesce(items('For_each_od_row')?['Title'], ''), '\"', '')}",
            "Url": "@{outputs('Cache_url')}"
          },
          "LastFetched": "@{utcNow()}",
          "FetchStatus": "Fetched",
          "LastError": null
        }
        ```

        > Designer-verify: hyperlink MERGE with `odata=nometadata`
        > takes the `{Description, Url}` object form above; if your
        > tenant rejects it, fall back to `odata=verbose` with
        > `__metadata: {"type": "SP.FieldUrlValue"}` on that field.
      - **`Update_row_ok`** — HttpRequest MERGE, identical shape to
        `Update_row_blocked`, body `@{string(outputs('Body_row_ok'))}`.
      - **`Inc_fetched`** — Increment `FetchedCount` by 1.

      **No branch**:
      - **`Body_row_thin`** (Compose):

        ```json
        {
          "FetchStatus": "Error",
          "LastError": "Run_htmltotext: @{coalesce(outputs('Od_result')?['note'], 'no result')} — chars=@{coalesce(outputs('Od_result')?['chars'], 0)}; page likely JS-rendered or empty; cache NOT written"
        }
        ```

      - **`Update_row_thin`** — HttpRequest MERGE, same shape, body
        `@{string(outputs('Body_row_thin'))}`.
      - **`Inc_error_thin`** — Increment `ErrorCount` by 1.

  **`Row_failed`** (Scope, run after `Try_row` has **Failed, Timed
  out**):
  - **`Filter_failed_row`** (Filter array): from
    `@result('Try_row')`, where
    `@or(equals(item()?['status'], 'Failed'), equals(item()?['status'], 'TimedOut'))`
  - **`Err_detail_row`** (Compose) — quotes and newlines stripped
    before the value lands in a list column (the curation
    `Why_capped` posture):

    ```
    @take(replace(replace(concat(coalesce(first(body('Filter_failed_row'))?['name'], 'unknown-action'), ': ', string(coalesce(first(body('Filter_failed_row'))?['error'], first(body('Filter_failed_row'))?['outputs'], ''))), '"', ''), decodeUriComponent('%0A'), ' '), 3800)
    ```

  - **`Body_row_err`** (Compose):

    ```json
    {
      "FetchStatus": "Error",
      "LastError": "@{outputs('Err_detail_row')}"
    }
    ```

  - **`Update_row_err`** — HttpRequest MERGE, same shape, body
    `@{string(outputs('Body_row_err'))}`.
  - **`Inc_error_row`** — Increment `ErrorCount` by 1.

**D6 — `Catch_od`** (Scope, run after `Try_od` has **Failed, Timed
out** — the curation Catch, verbatim):
- **`Filter_failed_od`** (Filter array): from `@result('Try_od')`,
  where
  `@or(equals(item()?['status'], 'Failed'), equals(item()?['status'], 'TimedOut'))`
- **`Err_detail_od`** (Compose):
  `@take(concat(coalesce(first(body('Filter_failed_od'))?['name'], 'unknown-action'), ': ', string(coalesce(first(body('Filter_failed_od'))?['error'], first(body('Filter_failed_od'))?['outputs'], ''))), 4000)`
- **`Terminate_failed_od`** (Terminate, status Failed, message
  `@{outputs('Err_detail_od')}`). Row-level failures never reach
  here (`Row_failed` absorbs them); this catches structural failures
  — the list fetch itself, a dead connection. Next Sunday retries
  from scratch; the run is idempotent (fixed cache names overwrite,
  MERGE re-writes converge).

**D7 — `Od_summary`** (Compose, run after `Try_od` [Succeeded]):

```
@{concat('rows=', length(body('Get_od_rows')?['value']), ' fetched=', variables('FetchedCount'), ' errors=', variables('ErrorCount'), ' skipped=', variables('SkippedCount'))}
```

`errors` trending nonzero = curators pasted a JS-heavy or off-list
URL, or a page moved — the Fetch errors view (§5) has the row-level
verdicts in `LastError`.

**Cost**: 1 trigger + ~5 fixed actions + ~2/skipped row +
~10/fetched row, weekly, `MaxDocsPerRun` capped at 50 ≈ **≤ 520
actions + zero AI calls, weekly** — noise next to the sweep's
~2,500/day. HTTP egress is the only novel resource.

Check (after building): flow saves with no expression errors; the
Run script action shows **HtmlToText** bound against `Scripts.xlsx`
(designer-verify the binding — the authored definition ships a
placeholder scriptId).

## 5 — Views

Online Docs list → create view **Fetch errors**: filter
`FetchStatus` is equal to `Error`; columns Title, Url, LastError,
LastFetched, Modified; sort Modified descending. Optional second
view **Stale caches** (`LastFetched` older than 30 days).

Check: hand-set `FetchStatus = Error` on any row → it appears in the
view; clear it → gone.

## 6 — Smoke suite (run before trusting the schedule)

1. **Seed** the list from `OnlineDocs_Seed.csv` (browser-verify each
   URL first), plus one deliberate bad row: Title `zz-test blocked`,
   Url `https://example.com/nope`, MatchKeywords `zz-test`.
2. **Manual run** (Test → Manually). Check: every good row flips to
   `FetchStatus = Fetched` with `CachedTextUrl` set and `LastFetched`
   fresh; the `zz-test blocked` row flips to `Error` with
   `LastError` naming `If_host_ok`; `Od_summary` counts add up
   (`rows=5 fetched=4 errors=1 skipped=0` for the four-row seed).
3. **Spot-check one cache per host**: open each `CachedTextUrl` —
   the .md starts with `# <title>` + `Source:` + `Fetched:` header,
   the body reads as article text (headings, paragraphs, bullets),
   and there is no nav-menu or cookie-banner residue. A cache full
   of link soup = that host needs `HtmlToText` tuning; a near-empty
   cache should NOT exist (thin-extract routes to Error instead —
   if one slipped through, check the 500-char tripwire).
4. **Refresh skip**: immediately re-run. Check: all good rows
   `skipped` (`RefreshDays` gate), the Error row retries.
5. **Row isolation**: temporarily point one row's Url at an
   allowed-host URL returning 404
   (`https://pro.arcgis.com/zz-test-404.htm`), re-run → that row
   flips Error with the HTTP failure in `LastError`, every other row
   unaffected, run status Succeeded. Revert the Url.
6. **Cleanup**: delete the `zz-test blocked` row; fix or keep the
   seed rows as the starting catalog.

Record the run in `onlinedocs/CHANGES.md` (date, tenant, steps
passed).

## Known limits (v1.0)

- **No delta detection**: a page is refetched on the `RefreshDays`
  clock whether or not it changed (no ETag/Last-Modified use). Cheap
  at ≤50 rows; revisit only if the catalog grows an order of
  magnitude.
- **Rendered-page blindness**: pages that build their content in
  client-side JS cache as `thin-extract` Errors. Known likelier on
  developers.arcgis.com than the Pro/Enterprise help. The fix is
  curatorial: prefer the static help-site URL for the same topic.
- **MatchKeywords drift**: nothing lints `MatchKeywords` against the
  Keywords list; a typo'd alias silently never matches. The Fetch
  errors view won't show this — it shows fetch health, not match
  health. The sweep's `onlineDocs=` summary field is the match-side
  tripwire.
- **One text per URL**: no per-section slicing; TestPlanGen's
  `OnlineDocCap` takes the head of the cache. Long pages should get
  a focused Summary and, if needed, an anchor-specific URL row.

## Queued follow-ons (documented, not built)

- **Match-side lint**: a fixture-free harness check cross-referencing
  `OnlineDocs_Seed.csv` MatchKeywords against
  `schemas/SPList_Keywords.csv` conventions (lowercase, '; '
  discipline), and — on-tenant — a monthly digest of rows whose
  MatchKeywords matched zero docs.
- **Provenance export**: when the built flow is exported from the
  tenant, diff against `flow/v1_0/definition.json`, record drift
  RL-4-style, and cut the import zip from the export.
- **Conditional fetch**: send `If-Modified-Since` from `LastFetched`
  and skip on 304 — only worth it if the catalog grows past ~200
  rows.
