/**
 * remotefs.mjs v1.0 (sweep v1.39) — the sidecar library WITHOUT
 * OneDrive. Review r7 phase 4, owner-approved: with
 * `sweep.remoteFiles: true` the sweep runs anywhere headless — a
 * hosted runner, a fresh VM — using `paths.sidecarLibrary` as a plain
 * local WORKSPACE instead of a synced folder:
 *
 *   - mirror-down: before ranking needs them, every .md in the
 *     sidecar drive is downloaded into the workspace (one delta
 *     listing; the eTag manifest in workDir skips unchanged files,
 *     and .md files deleted remotely are pruned locally) — BodyIndex,
 *     neighbor patches, `--rerank`/`--reformat` and the embed index
 *     then read exactly what they read on the OneDrive machine;
 *   - write-through: every Writer file write/delete under the
 *     workspace queues a Graph drive upload/delete, flushed at the
 *     end of each document so a crash mid-run loses at most one
 *     doc's uploads (writes are also always on local disk first).
 *
 * Source-library reads don't need any of this: remote mode forces
 * the v1.33 graphDownloadFallback, so every source doc a run
 * actually processes downloads on demand.
 */

import fs from "node:fs";
import path from "node:path";

export class RemoteLibrary {
  /** graph: GraphClient; driveName: the library's drive name (e.g.
   *  "LRS Doc Index"); localRoot: the workspace standing in for the
   *  synced folder; manifestPath: the eTag manifest file. */
  constructor(graph, siteId, driveName, localRoot, manifestPath) {
    this.graph = graph;
    this.siteId = siteId;
    this.driveName = driveName;
    this.localRoot = path.resolve(localRoot);
    this.manifestPath = manifestPath;
    this.driveId = null;
    this.pending = []; // {op: "put"|"delete", rel}
  }

  async init() {
    const drives = await this.graph.listDrives(this.siteId);
    const hit = drives.find((d) => d.name === this.driveName);
    if (!hit) {
      throw new Error(
        `remote-files: no drive named "${this.driveName}" on the site — ` +
        `found: ${drives.map((d) => d.name).join(", ") || "(none)"} ` +
        "(set sweep.remoteDriveName to the sidecar library's title)"
      );
    }
    this.driveId = hit.id;
  }

  /** Local absolute path → drive-root-relative path, or null when the
   *  file is outside the workspace (e.g. temp downloads). */
  relOf(absPath) {
    const p = path.resolve(absPath);
    if (!p.startsWith(this.localRoot + path.sep)) return null;
    return p.slice(this.localRoot.length + 1).split(path.sep).join("/");
  }

  /** Mirror every remote .md into the workspace (eTag-deduped) and
   *  prune local .md files the drive no longer has. */
  async mirrorMarkdown() {
    let manifest = {};
    try {
      manifest = JSON.parse(fs.readFileSync(this.manifestPath, "utf8")) || {};
    } catch { /* cold mirror */ }
    const items = await this.graph.driveDeltaAll(this.driveId);
    const remote = new Map(); // rel -> eTag
    for (const it of items) {
      if (!it.file || !String(it.name || "").endsWith(".md")) continue;
      const parent = String(it.parentReference?.path || "");
      const rootAt = parent.indexOf("root:");
      const dir = rootAt >= 0 ? parent.slice(rootAt + 5).replace(/^\//, "") : "";
      const rel = dir ? `${dir}/${it.name}` : it.name;
      remote.set(rel, String(it.eTag || it.id || ""));
    }
    let downloaded = 0;
    for (const [rel, etag] of remote) {
      const local = path.join(this.localRoot, ...rel.split("/"));
      if (manifest[rel] === etag && fs.existsSync(local)) continue;
      const buf = await this.graph.getDriveFileByPath(this.driveId, rel);
      fs.mkdirSync(path.dirname(local), { recursive: true });
      fs.writeFileSync(local, buf);
      manifest[rel] = etag;
      downloaded++;
    }
    // prune: local .md files (the mirror's file type) gone remotely
    const walk = (dir) => {
      let names = [];
      try {
        names = fs.readdirSync(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const d of names) {
        const p = path.join(dir, d.name);
        if (d.isDirectory()) walk(p);
        else if (d.name.endsWith(".md") && !remote.has(this.relOf(p))) {
          try { fs.rmSync(p); } catch { /* best effort */ }
          delete manifest[this.relOf(p)];
        }
      }
    };
    walk(this.localRoot);
    try {
      fs.mkdirSync(path.dirname(this.manifestPath), { recursive: true });
      fs.writeFileSync(this.manifestPath, JSON.stringify(manifest, null, 1));
    } catch { /* manifest is an optimization, not state */ }
    return { files: remote.size, downloaded };
  }

  /** Queue a write-through upload/delete for a workspace path (a path
   *  outside the workspace is silently local-only, e.g. temp files). */
  queuePut(absPath) {
    const rel = this.relOf(absPath);
    if (rel) this.pending.push({ op: "put", rel });
  }

  queueDelete(absPath) {
    const rel = this.relOf(absPath);
    if (rel) this.pending.push({ op: "delete", rel });
  }

  /** Drain the queue. Upload failures throw (a sidecar that never
   *  reaches SharePoint IS a failed index — the caller's Error lane
   *  handles it); delete failures only warn. Uploaded files' eTags
   *  fold into the manifest so the next run's mirror doesn't
   *  re-download this run's own writes. */
  async flush() {
    const work = this.pending;
    this.pending = [];
    const tags = {};
    const dropped = [];
    try {
      for (const w of work) {
        if (w.op === "put") {
          const local = path.join(this.localRoot, ...w.rel.split("/"));
          const res = await this.graph.putDriveFile(this.driveId, w.rel, fs.readFileSync(local));
          if (res?.eTag) tags[w.rel] = String(res.eTag);
        } else {
          try {
            await this.graph.deleteDriveFileByPath(this.driveId, w.rel);
            dropped.push(w.rel);
          } catch (e) {
            process.stderr.write(`remote delete failed (${w.rel}): ${e.message}\n`);
          }
        }
      }
    } finally {
      if (Object.keys(tags).length || dropped.length) {
        try {
          let manifest = {};
          try {
            manifest = JSON.parse(fs.readFileSync(this.manifestPath, "utf8")) || {};
          } catch { /* cold */ }
          Object.assign(manifest, tags);
          for (const rel of dropped) delete manifest[rel];
          fs.mkdirSync(path.dirname(this.manifestPath), { recursive: true });
          fs.writeFileSync(this.manifestPath, JSON.stringify(manifest, null, 1));
        } catch { /* manifest is an optimization, not state */ }
      }
    }
    return work.length;
  }
}
