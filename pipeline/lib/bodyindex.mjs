/**
 * bodyindex.mjs v1.0 — the BM25 body-similarity index, moved verbatim
 * out of sweep.mjs v1.30 (module split, no behavior change; covered by
 * check_local_sweep.py's body-sim and rerank legs).
 */

import fs from "node:fs";
import { urlToLocal } from "./util.mjs";

/**
 * BodyIndex — BM25-weighted cosine similarity over sidecar bodies.
 * Pure in-memory JS: no dependencies, no AI spend. Built lazily from
 * the on-disk sidecar corpus once per run (the body below the header
 * seam, so template boilerplate doesn't score); docs indexed during
 * the run are upserted from their fresh text, so same-run neighbors
 * see each other. Cosine is symmetric — RelatedRank's score-symmetry
 * contract (reciprocal sidecar merges) holds.
 */
export class BodyIndex {
  constructor() {
    this.docs = new Map(); // rowId -> Map(term -> tf)
    this.df = new Map(); // term -> #docs carrying it
    this.built = false;
  }

  static tokenize(text) {
    const tf = new Map();
    const parts = String(text).slice(0, 80000).toLowerCase().match(/[a-z0-9]{3,}/g) || [];
    for (const p of parts) {
      if (!/[a-z]/.test(p)) continue;
      tf.set(p, (tf.get(p) || 0) + 1);
    }
    return tf;
  }

  _remove(id) {
    const old = this.docs.get(id);
    if (!old) return;
    for (const t of old.keys()) {
      const n = (this.df.get(t) || 1) - 1;
      if (n <= 0) this.df.delete(t);
      else this.df.set(t, n);
    }
    this.docs.delete(id);
  }

  upsert(id, text) {
    this._remove(id);
    const tf = BodyIndex.tokenize(text);
    if (tf.size === 0) return;
    for (const t of tf.keys()) this.df.set(t, (this.df.get(t) || 0) + 1);
    this.docs.set(id, tf);
  }

  ensureBuilt(rows, sw, cfg) {
    if (this.built) return;
    this.built = true;
    for (const r of rows) {
      if (!r.ID || r.IndexStatus === "Archived" || !r.TextFileUrl) continue;
      const local = urlToLocal(r.TextFileUrl, sw, cfg);
      if (!local) continue;
      let txt;
      try {
        txt = fs.readFileSync(local, "utf8");
      } catch {
        continue; // sidecar not synced/deleted — doc just lacks the signal
      }
      const seam = txt.lastIndexOf("\n---\n");
      this.upsert(r.ID, seam >= 0 ? txt.slice(seam + 5) : txt);
    }
  }

  _idf(t) {
    const d = this.df.get(t) || 0;
    return Math.log(1 + (this.docs.size - d + 0.5) / (d + 0.5));
  }

  /** Similarity of selfId's vector vs every other doc, sorted desc. */
  query(selfId) {
    const selfTf = this.docs.get(selfId);
    if (!selfTf || this.docs.size < 2) return [];
    const selfW = new Map();
    let selfNorm = 0;
    for (const [t, f] of selfTf) {
      const w = (1 + Math.log(f)) * this._idf(t);
      selfW.set(t, w);
      selfNorm += w * w;
    }
    selfNorm = Math.sqrt(selfNorm);
    if (selfNorm <= 0) return [];
    const out = [];
    for (const [id, tf] of this.docs) {
      if (id === selfId) continue;
      let dot = 0;
      let norm = 0;
      for (const [t, f] of tf) {
        const w = (1 + Math.log(f)) * this._idf(t);
        norm += w * w;
        const sw2 = selfW.get(t);
        if (sw2) dot += w * sw2;
      }
      if (dot <= 0 || norm <= 0) continue;
      const sim = Math.round((dot / (Math.sqrt(norm) * selfNorm)) * 1000) / 1000;
      if (sim > 0) out.push({ id, sim });
    }
    out.sort((a, b) => b.sim - a.sim || b.id - a.id);
    return out;
  }
}
