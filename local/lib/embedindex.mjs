/**
 * embedindex.mjs v1.0 (sweep v1.38) — embedding-assisted relatedness.
 * Review r7 phase 4, owner-approved. OFF by default
 * (`sweep.embedRelated: true` enables); when off, nothing here runs
 * and the ranking pipeline is byte-identical to v1.37.
 *
 * What it adds: BodyIndex's BM25 cosine catches shared vocabulary;
 * embeddings catch PARAPHRASE-level relatedness (two docs about the
 * same behavior in different words). Design constraints honored:
 *   - RelatedRank.ts untouched (tenant-paste equivalence gates stay
 *     meaningful): embedding similarity enters through the SAME
 *     BodySim channel the ranker already reads — per candidate,
 *     BodySim = max(bm25Sim, scaledEmbedSim), where the embed cosine
 *     is rescaled from [embedSimMin..1] to [0..1] so the two signals
 *     share a magnitude and the ranker's weights need no retuning.
 *   - Deterministic-corpus discipline: embeddings are cached in
 *     workDir/embeddings-cache.json keyed by a content hash, so a
 *     doc is embedded once per body change — reruns and `--rerank`
 *     passes spend zero embedding calls on an unchanged corpus.
 *   - Fail-open: any endpoint failure logs once and disables the
 *     signal for the run; ranking falls back to BM25 exactly as
 *     with the flag off. An enhancement never fails an index.
 *
 * Provider: any OpenAI-compatible `POST {baseUrl}/v1/embeddings`
 * endpoint — Voyage AI (Anthropic's recommended embeddings partner;
 * the Anthropic API itself has no embeddings endpoint) uses exactly
 * this shape. Config (config.llm.embeddings):
 *   baseUrl    e.g. "https://api.voyageai.com"
 *   apiKey     bearer key ({"$env": "..."} supported)
 *   model      e.g. "voyage-3.5-lite"
 *   batchSize  texts per request (default 32)
 *   inputCap   chars embedded per doc (default 8000 — the body head)
 *   timeoutMs  per request (default 60000); maxRetries (default 2)
 * Data egress note: with this ON, document text leaves the tenant
 * for the embeddings endpoint — same class of decision as the
 * `anthropic` classify provider (Local_Setup §8); clear it with
 * whoever owns that call.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { urlToLocal } from "./util.mjs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function resolveKey(v) {
  if (v && typeof v === "object" && v.$env) return process.env[String(v.$env)] || "";
  return typeof v === "string" ? v : "";
}

const hashOf = (text) =>
  crypto.createHash("sha1").update(String(text)).digest("hex").slice(0, 16);

export class EmbedIndex {
  constructor(cfg) {
    const e = cfg?.llm?.embeddings || {};
    this.baseUrl = e.baseUrl || "https://api.voyageai.com";
    this.apiKey = resolveKey(e.apiKey);
    this.model = e.model || "voyage-3.5-lite";
    this.batchSize = Math.max(1, Number(e.batchSize) || 32);
    this.inputCap = Number(e.inputCap) || 8000;
    this.timeoutMs = Number(e.timeoutMs) || 60000;
    this.maxRetries = e.maxRetries === undefined ? 2 : Number(e.maxRetries);
    this.cachePath = path.join(cfg?.paths?.workDir || ".", "embeddings-cache.json");
    try {
      this.cache = JSON.parse(fs.readFileSync(this.cachePath, "utf8")) || {};
    } catch {
      this.cache = {};
    }
    this.texts = new Map(); // docId -> pending text (not yet embedded)
    this.built = false;
    this.disabled = false;
    this.calls = 0;
  }

  _bodyOf(txt) {
    const seam = txt.lastIndexOf("\n---\n");
    return (seam >= 0 ? txt.slice(seam + 5) : txt).slice(0, this.inputCap);
  }

  /** Collect every indexed sidecar's body (from disk) as pending
   *  work; the cache decides which actually get embedded. */
  ensureBuilt(rows, sw, cfg) {
    if (this.built || this.disabled) return;
    this.built = true;
    for (const r of rows) {
      if (!r.ID || r.IndexStatus === "Archived" || !r.TextFileUrl) continue;
      if (this.texts.has(r.ID)) continue; // an upsert already holds fresher text
      const local = urlToLocal(r.TextFileUrl, sw, cfg);
      if (!local) continue;
      try {
        this.texts.set(r.ID, this._bodyOf(fs.readFileSync(local, "utf8")));
      } catch { /* unsynced sidecar — doc just lacks the signal */ }
    }
  }

  /** Fresh text for a doc indexed THIS run (its sidecar may not be
   *  written yet); wins over the on-disk copy. */
  upsert(id, text) {
    this.texts.set(id, String(text).slice(0, this.inputCap));
  }

  async _embedBatch(texts) {
    const body = JSON.stringify({ model: this.model, input: texts });
    let lastErr;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) await sleep(Math.min(2000 * 2 ** (attempt - 1), 15000));
      let res;
      try {
        res = await fetch(this.baseUrl + "/v1/embeddings", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + this.apiKey,
          },
          body,
          signal: AbortSignal.timeout(this.timeoutMs),
        });
      } catch (e) {
        lastErr = new Error(`embeddings request failed: ${e.message}`);
        continue;
      }
      if (res.status === 429 || res.status >= 500) {
        lastErr = new Error(`embeddings ${res.status}: ${(await res.text()).slice(0, 200)}`);
        continue;
      }
      if (!res.ok) {
        throw new Error(`embeddings ${res.status}: ${(await res.text()).slice(0, 300)}`);
      }
      this.calls++;
      const json = await res.json();
      const out = new Array(texts.length);
      for (const d of json.data || []) {
        out[d.index ?? 0] = d.embedding;
      }
      if (out.some((v) => !Array.isArray(v))) {
        throw new Error("embeddings response missing vectors");
      }
      return out;
    }
    throw lastErr;
  }

  /** Embed everything pending whose hash misses the cache, then save.
   *  Any failure disables the signal for this run (fail-open). */
  async _sync() {
    if (this.disabled) return;
    const todo = [];
    for (const [id, text] of this.texts) {
      const h = hashOf(text);
      const hit = this.cache[id];
      if (!hit || hit.hash !== h) todo.push({ id, h, text });
    }
    if (!todo.length) return;
    try {
      for (let i = 0; i < todo.length; i += this.batchSize) {
        const batch = todo.slice(i, i + this.batchSize);
        const vecs = await this._embedBatch(batch.map((t) => t.text));
        for (let j = 0; j < batch.length; j++) {
          // stored normalized + rounded: cosine becomes a dot product
          // and the cache file stays reviewable
          const v = vecs[j];
          const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
          this.cache[batch[j].id] = {
            hash: batch[j].h,
            vec: v.map((x) => Math.round((x / norm) * 1e5) / 1e5),
          };
        }
      }
      fs.mkdirSync(path.dirname(this.cachePath), { recursive: true });
      fs.writeFileSync(this.cachePath, JSON.stringify(this.cache));
    } catch (e) {
      this.disabled = true;
      process.stderr.write(
        `note: embedding relatedness disabled for this run (${e.message}) — ranking falls back to BM25\n`
      );
    }
  }

  /** Cosine of selfId vs every embedded doc, sorted desc. Empty when
   *  disabled or the doc has no vector. */
  async query(selfId) {
    await this._sync();
    if (this.disabled) return [];
    const self = this.cache[selfId]?.vec;
    if (!self) return [];
    const out = [];
    for (const [idStr, rec] of Object.entries(this.cache)) {
      const id = Number(idStr);
      if (id === selfId || !rec.vec || rec.vec.length !== self.length) continue;
      if (!this.texts.has(id)) continue; // stale cache rows (archived docs) don't rank
      let dot = 0;
      for (let i = 0; i < self.length; i++) dot += self[i] * rec.vec[i];
      const sim = Math.round(dot * 1000) / 1000;
      if (sim > 0) out.push({ id, sim });
    }
    out.sort((a, b) => b.sim - a.sim || b.id - a.id);
    return out;
  }
}

/**
 * Merge embedding sims into the BM25 sims through the BodySim channel:
 * per doc, max(bm25, scaledEmbed) where scaledEmbed rescales the
 * cosine from [embedSimMin..1] to [0..1] (below the floor contributes
 * nothing — near-orthogonal high-dim cosines sit well above zero and
 * must not read as weak relatedness).
 */
export function mergeSims(bm25Sims, embedSims, embedSimMin) {
  const floor = embedSimMin === undefined ? 0.6 : Number(embedSimMin);
  const m = new Map(bm25Sims.map((s) => [s.id, s.sim]));
  for (const e of embedSims) {
    if (e.sim < floor) continue;
    const scaled = Math.round(((e.sim - floor) / (1 - floor)) * 1000) / 1000;
    if (scaled > (m.get(e.id) || 0)) m.set(e.id, scaled);
  }
  return [...m.entries()]
    .map(([id, sim]) => ({ id, sim }))
    .sort((a, b) => b.sim - a.sim || b.id - a.id);
}
