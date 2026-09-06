# Codebase review + enhancement plan — 2026-09-03

Scope: the whole repository as of `main` @ 504e00f (SlideFigures v2.0 /
svg2pptx v1.3). Reviewed end-to-end: the deployed local pipeline
(`local/` — sweep, curate, auth, graph, llm, svg2pptx, doc_crawl), the
Office Scripts (`scripts/`), the PAD runner (`pad/`), the harness
suites (`review/harness/`, `local/harness/`, `pad/harness/`), CI,
schemas, prompts, agent/testplangen assets, and the two source-of-truth
docs (README, STATUS).

---

## Part 1 — Assessment

### What is genuinely strong

- **The gate discipline.** Every behavioral change lands with harness
  assertions that *fire against the previous version* (the
  "discriminator" pattern), plus byte-equivalence legs proving old
  inputs are untouched. 158 local-sweep assertions, generated OOXML
  fixtures, a mock Graph/Dataverse/Anthropic/auth stack — this is a
  regression net most production services don't have.
- **Zero-dependency design.** No package.json, no node_modules; the
  entire pipeline is stdlib Node + stdlib Python harnesses. The
  supply-chain surface is the Node and Python runtimes.
- **Deliberate equivalence engineering.** The migration off Power
  Automate kept the `scripts/*.ts` files running UNMODIFIED (via the
  PAD loader), preserved sidecar byte-compatibility, and documented
  every deviation. Rollback to the cloud flow remains a real option.
- **Self-healing lanes.** Error retry, PDF rescue, scope rescue,
  ghost archiving (capped, throttling-safe), content-filter skip,
  restored-doc reindex — the failure taxonomy is thought through and
  each lane is gate-covered.
- **Operational visibility for the team, not just the operator.** The
  `_Sweep Status.md` page (error lane, night streaks, fatal-abort
  path) lives where the team already looks.
- **Record-keeping.** STATUS.md's deployed-vs-authored distinction and
  the per-component version ledgers make the system auditable months
  later. Rare and valuable.

### Structural risks (the things most likely to hurt)

**R1 — The pipeline is down right now, and only a human can notice.**
STATUS open action 12: Conditional Access killed device-code sign-in
(AADSTS53003); the nightly sweep has been failing closed since the
refresh token expired. The status page says so — but only to someone
who opens it. There is no push-style alerting: no email, no Teams
webhook, no dead-man timer. A pipeline that can silently be dead for
weeks is the single biggest operational gap.

**R2 — Single-machine, single-human deployment.** The deployed sweep
is one Windows machine, one Task Scheduler entry, one person's
delegated identity, one OneDrive sync relationship. Machine dies,
person leaves, CA policy changes → pipeline stops. The `auth: "app"`
path (Entra app registration, client credentials) is already designed
in Local_Setup §2 but not adopted; it is the durable answer (headless,
human-independent, works from any runner).

**R3 — Self-update deploys unvetted code.** `run_sweep.cmd` does
`git pull --ff-only` then runs `--live`. Anything merged to main goes
live on the next nightly run, *whether or not CI passed on it*. CI runs
on push, but nothing stops a red main from deploying. Low likelihood,
high blast radius (the sweep writes the corpus).

**R4 — OneDrive sync as the file transport.** Source reads and sidecar
writes assume the synced folders are fresh. Sync lag shows up as
`source file not found locally` errors (correctly retried), but there
is no fallback (e.g. Graph drive download) and no staleness detection
for the *write* side — a paused sync means sidecar writes sit local
and unreplicated with no signal.

**R5 — Full-list snapshots every run.** Every sweep pulls all rows of
five lists plus the whole source library. Correct and simple today;
DocKeywords/DocLinks grow monotonically, and the (already-materialized)
history shows the lists were once re-created wholesale. Two
consequences: run-start cost grows without bound, and *the lists are
the only copy of the graph* — a bad bulk operation or another list
re-creation loses state with no local backup.

### Code-level findings

All minor; none block anything today.

| # | Where | Finding |
|---|---|---|
| C1 | `local/curate.mjs:84` | Config inheritance drops `clientId` only when `inheritMode === "device"`; `sweep.mjs:1082` handles `"device" || "interactive"`. With `graph.auth: "interactive"` **and** an explicit `graph.clientId` override, curate would pass the Graph client into Dataverse delegated auth. One-line fix; add a gate assertion. |
| C2 | `local/graph.mjs`, `local/llm.mjs` | No timeout on any `fetch` (the tool-link prober has one; Graph/SPO/Dataverse/Anthropic calls don't). One hung socket can stall the whole nightly run past the next scheduled fire. Add `AbortSignal.timeout(...)` uniformly. |
| C3 | `local/sweep.mjs:1100` | `loadConfig` dereferences `cfg.sharePoint` unconditionally — a config missing that section dies with a bare TypeError instead of a "config is missing sharePoint" message. A small validation pass (required keys, path existence) would make first-run setup and future machine moves friendlier. |
| C4 | runtime pinning | Everything depends on `node --experimental-strip-types` (Node ≥ 22.6; default-on ≥ 23.6). Nothing checks the runtime: an old Node on a fresh machine fails with a confusing flag error. Add a startup version guard with a plain-language message; record the supported range in Local_Setup. |
| C5 | CI (`.github/workflows/harness.yml`) | The ES2017 `tsc --noEmit` check that every promotion note cites is run **manually**, not in CI. Add it as a job (tsc via npx pinned version). Cheap, closes a real gap — a merged PR could break the tenant-paste contract silently. |
| C6 | `local/sweep.mjs` (2,383 lines) | Five separable concerns in one file: orchestration; presentation transforms (`tidyBody`/`caseHeadings`/`placeFigure`/`compactWhy`); doc-links resolution (`DocPageIndex`/`ToolLinkResolver`/`docsBlock`); `BodyIndex`; status page. All pure-function seams, all already gate-covered — a mechanical split into `local/lib/*.mjs` would keep each unit reviewable. Do it *as its own commit with zero behavior change* so the gates prove the move. |
| C7 | error-path row writes | The non-filtered Error create at `sweep.mjs:1678` omits `ExtractionLane`, so an Error-then-Skipped PDF sequence relies on the rescue's lane stamp elsewhere. Consistent stamping would simplify the rescue predicates. Cosmetic. |
| C8 | `htmlToText` | Entity decoding after tag stripping means `&lt;script&gt;` in source HTML lands as literal `<script>` text in the sidecar body. Markdown renderers treat it as text — harmless today, worth a comment or a final escape if sidecars ever render as raw HTML. |
| C9 | `GraphClient.request` | The 401-refresh retry consumes one of the four total attempts, and `_retryAfter` is per-instance state — both fine while calls are strictly sequential; both become bugs if concurrency is ever added. Leave a comment on the invariant. |

### Repo hygiene

- **STATUS.md's "Last updated" entry** has grown into a ~6,000-word
  single paragraph of nested history. The table sections are excellent;
  the narrative head is now the hardest-to-read part of the repo. Move
  per-day narratives into the component CHANGES files (where most
  already exist) and keep STATUS's head to ~10 lines of current state.
- Seven generations of `check_batch*.py` self-skip as superseded —
  working as designed, but a one-line index in `review/harness/README.md`
  of *which suites are live vs. historical* would save every future
  reader the archaeology.
- `flow/*.zip` binaries (~1.9 MB total) in git: accepted provenance
  cost, no action needed.
- PV-1 (work email in pre-scrub zip history of a public repo): closed
  by explicit owner decision 2026-08-12; noted here only so this review
  doesn't reopen it.

---

## Part 2 — Enhancement plan

Ordered; each phase's items are independent unless noted. Effort:
S ≤ half a day, M ≈ 1–2 days, L ≈ 3+ days, including gate coverage
(the repo's own rule: no behavior change without an assertion that
fires against the previous version).

### Phase 0 — Unblock the pipeline (operational, already queued)

These are STATUS open actions, listed here because every later phase
assumes a running pipeline. Nothing below jumps this queue.

1. **Restore sweep auth** (action 12): `"auth": "interactive"` on the
   joined machine, one console sign-in. Until then nothing indexes.
2. **Run the figures/headings reformat pass** (action 11):
   `run_sweep.cmd --reformat` once — SlideFigures v2.0 SVGs, DL-1
   label collapse, TC-1/TC-3 headings across the corpus, no AI spend.
3. **Paste Q&A agent instructions v1.3 + smoke** (actions 2/4b).
4. **Work the TestPlanGen coverage runbook top-to-bottom** (action 9).

### Phase 1 — Reliability hardening (small code, big risk reduction)

5. **Failure alerting + dead-man timer (addresses R1). [M]**
   Two pieces: (a) on fatal abort or error-streak ≥ 3, send an alert —
   simplest tenant-native path is Graph `sendMail` as the signed-in
   user (no new auth), or a Teams incoming-webhook URL in config;
   (b) a dead-man check: the sweep stamps a heartbeat row/file, and a
   separate tiny scheduled task (or a GitHub Actions cron hitting the
   status page via Graph) alerts when the last successful run is > 48h
   old. (a) alone still misses "task never fired"; (b) covers it.
6. **App-registration auth as the deployed mode (addresses R2). [M]**
   Adopt `auth: "app"` per Local_Setup §2 (cert credential preferred
   over secret). Kills the CA/device-code class of outage permanently,
   makes the runner machine fungible, and is the prerequisite for ever
   hosting the sweep off the owner's desktop. Keep delegated mode as
   the documented fallback.
7. **Nightly list export (addresses R5's data-loss half). [S]**
   `sweep.mjs --export-lists` (or automatic post-run): dump the five
   list snapshots the run already fetched to
   `workDir/list-backup-<date>.json.gz`, prune to ~30. The run already
   holds every row in memory — this is ~20 lines and turns "list
   re-created again" from a catastrophe into a restore.
8. **Fetch timeouts everywhere (C2) [S]**, **config validation (C3)
   [S]**, **Node version guard (C4) [S]**, **curate.mjs inherit fix
   (C1) [S]**.
9. **Gate the self-update (addresses R3). [S]**
   Have `run_sweep.cmd` pull a `deploy` branch (or tag) instead of
   main, and add a CI job that fast-forwards `deploy` to main only
   when the full suite is green. Zero new infrastructure; the sweep
   machine then only ever runs harness-passing code.
10. **Graph-download fallback for unsynced sources (addresses R4). [M]**
    When `localPath` is missing, fetch the file content via Graph
    (`/drives/{id}/items/{id}/content`) into a temp file and index
    from there; keep the OneDrive path as the fast path. Also stamp a
    status-page warning when the sidecar library's last write is
    older than the run (write-side sync staleness signal).

### Phase 2 — CI and maintainability

11. **`tsc --noEmit --target es2017` in CI (C5). [S]** Plus, while in
    there: pin the CI Node minor to what the sweep machine runs.
12. **Split sweep.mjs into modules (C6). [M]** Pure mechanical move,
    own commit, gates green before/after. Candidate seams:
    `lib/presentation.mjs`, `lib/doclinks.mjs`, `lib/bodyindex.mjs`,
    `lib/statuspage.mjs`, `lib/config.mjs`.
13. **STATUS.md restructure. [S]** Narrative history out to CHANGES
    files; STATUS head becomes a dated 10-line "current state" block
    above the existing tables. (Keep the file as the deployed-truth
    table — that part works.)
14. **Harness index. [S]** One table in `review/harness/README.md`:
    suite → live/superseded → what it guards.

### Phase 3 — Queued features (build on the running pipeline)

15. **Flow #2 as a local job: Gantt → Issue Refs. [L]**
    The long-queued feeder for the (deliberately empty) Issue Refs
    list. As `local/gantt.mjs` it is far cheaper than the cloud flow
    it was originally specced as: reuse `graph.mjs`, `ops.mjs`
    (WorkbookDump for the schedule xlsx), RegexExtract's hashtag lane,
    and the existing edge-minting pattern. RelatedRank already weights
    `gantt` edges (60) — they light up the day the rows exist.
16. **Librarian backfill / DocKeywords re-point. [M]**
    Mechanics already specified in `curation/Curation_Setup.md`:
    re-point historical junction rows from merged aliases to their
    canonical, prune stale duplicates. Natural home: a `--repoint`
    pass in curate.mjs after approved merges, followed by the existing
    `sweep --rerank` to propagate. Closes the known gap where history
    stays on alias ids.
17. **OCR lane for image-only PDFs. [M]**
    The designed-but-unbuilt fallback: when `pdftotext` yields empty,
    shell to Tesseract (same optional-tool pattern as Poppler —
    absent tool = today's Skip behavior, loudly). The Skip-lane rows
    with `lane=plaintext` are the exact rescue population; the PDF
    rescue precedent shows how to re-enter them without a
    PromptVersion bump.
18. **Corpus browse pages. [M]**
    Generate `_Index.md` per kind folder (title, product, release,
    one-line summary, link) plus a root index, rewritten each run like
    the status page. Cheap, no AI spend, and gives humans a browsing
    surface the Q&A agent doesn't cover. Deliberately marked content
    (like the docs block) so regeneration is idempotent.
19. **Status-page trends. [S]** The run logs already hold per-night
    summaries; fold a 14-day sparkline table (processed/errors/
    figures) into `_Sweep Status.md` so drift is visible where the
    team looks.

### Phase 4 — Exploratory (do only with an owner decision)

20. **Embedding-assisted relatedness.** BodyIndex's BM25 cosine is
    doing real work (v1.9's body-sim lane); local embeddings (or the
    Anthropic API) could catch paraphrase-level relatedness BM25
    misses. Costs: a dependency or per-doc AI spend, and
    nondeterminism in a currently fully deterministic ranker. If
    tried: as a third dormant signal behind `Config.RelatedWeights`,
    gated by `check_related`, off by default.
21. **`.msg` extraction lane.** The one KNOWN_EXT still parked (CFB
    container format — real parsing work, or a dependency). Decide
    whether the corpus actually accumulates .msg files before paying
    for it; the Skipped-row counts on the status page can answer that.
22. **Hosted runner.** After item 6 (app auth), the sweep can run
    anywhere headless — including a scheduled GitHub Actions job with
    the cert in an environment secret (files via Graph download,
    item 10, replacing OneDrive entirely). Removes the last
    single-machine dependency; weigh against keeping tenant creds in
    GitHub and the org's policy on that.

### Sequencing note

Phase 1 items 5–7 are the highest leverage-per-line in the repo: the
system's engineering quality is well ahead of its operational safety
net, and all three close gaps that history has already demonstrated
(auth outage since ~2026-08-30; tenant lists re-created once already).
Phases 2–3 can interleave freely; item 12 (module split) is best done
before items 15/17 add more code to sweep.mjs.
