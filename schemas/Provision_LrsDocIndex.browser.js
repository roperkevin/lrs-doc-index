/*
 * Provisions the LRS Doc Index SharePoint schema from the BROWSER CONSOLE —
 * no PnP.PowerShell, no Entra app registration. Uses your existing signed-in
 * session via the SharePoint REST API.
 *
 * Source of truth: schemas/SPList_*.csv (same schema as
 * Provision_LrsDocIndex.ps1, ported 1:1).
 *
 * HOW TO RUN
 *   1. In the browser, open https://esriis.sharepoint.com/sites/lrsworkspace
 *      (any page on the site) and sign in if needed.
 *   2. Press F12 -> Console tab.
 *   3. Paste this entire file and press Enter.
 *      (If the console asks you to type "allow pasting" first, do that.)
 *   4. Watch the log; it ends with the list GUIDs and a field verification
 *      table. Idempotent - safe to re-run; existing lists/fields are skipped.
 *
 * Conventions enforced (see docs/SP_Adaptation_Notes.md):
 *   - columns created with Internal Name as the creation-time name
 *     (REST createfieldasxml with Options=8, AddFieldInternalNameHint)
 *   - choice dropdowns, no fill-in, exact values in order;
 *     IndexStatus defaults to Pending
 *   - multi-line text is plain (RichText FALSE); numbers 0 decimals;
 *     DateTime includes time; lookups single-value showing Title
 *   - all INDEXED columns (plus Keywords.Title) indexed while lists are empty
 *   - no uniqueness enforcement (the flow dedups via the indexed key columns)
 *
 * Lookups are created via REST/CAML, bypassing the modern UI whose lookup
 * creation is broken on this tenant — still add ONE test item per list with
 * a lookup and confirm the value saves before wiring the flow.
 */
(async () => {
  const SITE = "/sites/lrsworkspace";
  const LIBRARY = "LRS Doc Index";
  const FOLDERS = ["media", "Test Plans", "User Stories", "Design Spikes",
                   "Data Templates", "Schedules", "Doc Reviews", "Other"];

  // ------------------------------------------------------------- schema --
  // One entry per custom column, in CSV order. Title columns are native
  // (Keywords' Title index is handled explicitly at the end).
  const LISTS = {
    "Doc Index": [
      { name: "DocKey",         type: "Text",     required: true, indexed: true },
      { name: "FileName",       type: "Text",     required: true },
      { name: "SourceLink",     type: "URL" },
      { name: "Library",        type: "Text" },   // RESERVED - unused by design
      { name: "FileType",       type: "Choice",   choices: ["pptx","docx","xlsx","pdf","msg","txt","html","image","other"] },
      { name: "DocKind",        type: "Choice",   choices: ["Test Plan","User Story","Design Spike","Data Template","Schedule","Doc Review","Other"] },
      { name: "IndexStatus",    type: "Choice",   required: true, def: "Pending", choices: ["Pending","Indexed","Skipped","Error"] },
      { name: "SourceETag",     type: "Text" },   // RESERVED - unused by design
      { name: "SourceModified", type: "DateTime" },
      { name: "TextPreview",    type: "Note" },
      { name: "TextFileUrl",    type: "URL" },
      { name: "Summary",        type: "Note" },
      { name: "DocRevision",    type: "Text" },
      { name: "TargetRelease",  type: "Text" },
      { name: "PE",             type: "Text" },
      { name: "Dev",            type: "Text" },
      { name: "SourceAuthor",   type: "Text" },
      { name: "SourceEditor",   type: "Text" },
      { name: "SourceEdited",   type: "DateTime" },
      { name: "Surface",        type: "Choice",   choices: ["Pro","Experience Builder","Server","Enterprise","Other"] },
      { name: "ExtractionLane", type: "Choice",   choices: ["xmlstrip","workbookdump","plaintext","htmltotext","ocr","none"] },
      { name: "PromptVersion",  type: "Text" },
      { name: "IndexedOn",      type: "DateTime" },
      { name: "LastError",      type: "Note" },
    ],
    "Keywords": [
      { name: "Kind",              type: "Choice", required: true, choices: ["topic","tool","product"] },
      { name: "CanonicalRef",      type: "Lookup", lookupList: "Keywords" },  // self-lookup
      { name: "Notes",             type: "Note" },
      { name: "CurationStatus",    type: "Choice", choices: ["Proposed","Rejected"] },
      { name: "ProposedCanonical", type: "Text" },
    ],
    "Doc IDs": [
      { name: "Document",    type: "Lookup", required: true, indexed: true, lookupList: "Doc Index" },
      { name: "Repo",        type: "Text",   required: true },
      { name: "IssueNumber", type: "Number", required: true, indexed: true },
      { name: "Source",      type: "Choice", required: true, choices: ["url","filename","hashtag","titlematch","manual"] },
      { name: "IdKey",       type: "Text",   required: true, indexed: true },
    ],
    "Issue Refs": [
      { name: "Repo",           type: "Text",    required: true },
      { name: "IssueNumber",    type: "Number",  required: true },
      { name: "IssueKey",       type: "Text",    required: true, indexed: true },
      { name: "IssueTitle",     type: "Text",    required: true },
      { name: "PE",             type: "Text" },
      { name: "Dev",            type: "Text" },
      { name: "IterationLabel", type: "Text" },
      { name: "StatusSummary",  type: "Text" },
      { name: "DoneFlag",       type: "Boolean" },
      { name: "SourceDocument", type: "Lookup",  lookupList: "Doc Index" },
    ],
    "Doc Keywords": [
      { name: "Document", type: "Lookup", required: true, indexed: true, lookupList: "Doc Index" },
      { name: "Keyword",  type: "Lookup", required: true, indexed: true, lookupList: "Keywords" },
      { name: "KWKey",    type: "Text",   required: true, indexed: true },
    ],
    "Doc Links": [
      { name: "DocA",         type: "Lookup", required: true, lookupList: "Doc Index" },
      { name: "DocB",         type: "Lookup", required: true, lookupList: "Doc Index" },
      { name: "LinkType",     type: "Choice", required: true, choices: ["id","gantt","titlematch","review"] },
      { name: "SharedValues", type: "Note" },
      { name: "Strength",     type: "Number" },
      { name: "LinkKey",      type: "Text",   required: true, indexed: true },
    ],
  };

  // -------------------------------------------------------- REST helpers --
  const V = "application/json;odata=verbose";
  const digest = (await (await fetch(`${SITE}/_api/contextinfo`, {
    method: "POST", headers: { Accept: V },
  })).json()).d.GetContextWebInformation.FormDigestValue;

  const get = async (url) => {
    const r = await fetch(SITE + url, { headers: { Accept: V } });
    return r.ok ? (await r.json()).d : null;
  };
  const post = async (url, body, extra = {}) => {
    const r = await fetch(SITE + url, {
      method: "POST",
      headers: { Accept: V, "Content-Type": V, "X-RequestDigest": digest, ...extra },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`POST ${url} -> ${r.status}: ${await r.text()}`);
    return r.status === 204 ? null : (await r.json()).d;
  };

  const esc = (t) => `getbytitle('${encodeURIComponent(t.replace(/'/g, "''"))}')`;

  const ensureList = async (title, baseTemplate) => {
    let d = await get(`/_api/web/lists/${esc(title)}?$select=Id,Title`);
    if (d) { console.log(`= list '${title}' already exists`); return d.Id; }
    d = await post(`/_api/web/lists`, {
      __metadata: { type: "SP.List" }, Title: title, BaseTemplate: baseTemplate,
    });
    console.log(`+ created '${title}'`);
    return d.Id;
  };

  const fieldXml = (f, listIds) => {
    let attrs = `Name="${f.name}" StaticName="${f.name}" DisplayName="${f.name}"`;
    if (f.required) attrs += ` Required="TRUE"`;
    if (f.indexed)  attrs += ` Indexed="TRUE"`;
    switch (f.type) {
      case "Text":     return `<Field Type="Text" ${attrs} />`;
      case "Note":     return `<Field Type="Note" RichText="FALSE" NumLines="6" ${attrs} />`;
      case "URL":      return `<Field Type="URL" Format="Hyperlink" ${attrs} />`;
      case "DateTime": return `<Field Type="DateTime" Format="DateTime" ${attrs} />`;
      case "Number":   return `<Field Type="Number" Decimals="0" ${attrs} />`;
      case "Boolean":  return `<Field Type="Boolean" ${attrs} />`;
      case "Choice": {
        const choices = f.choices.map((c) => `<CHOICE>${c}</CHOICE>`).join("");
        const def = f.def ? `<Default>${f.def}</Default>` : "";
        return `<Field Type="Choice" Format="Dropdown" FillInChoice="FALSE" ${attrs}>${def}<CHOICES>${choices}</CHOICES></Field>`;
      }
      case "Lookup":
        return `<Field Type="Lookup" List="{${listIds[f.lookupList]}}" ShowField="Title" ${attrs} />`;
      default: throw new Error(`Unknown type ${f.type} for ${f.name}`);
    }
  };

  const ensureField = async (listTitle, f, listIds) => {
    const existing = await get(
      `/_api/web/lists/${esc(listTitle)}/fields/getbyinternalnameortitle('${f.name}')?$select=InternalName,TypeAsString`);
    if (existing) { console.log(`    = ${f.name} already exists (${existing.TypeAsString})`); return; }
    // Options 8 = AddFieldInternalNameHint: internal name taken from Name attr
    await post(`/_api/web/lists/${esc(listTitle)}/fields/createfieldasxml`, {
      parameters: {
        __metadata: { type: "SP.XmlSchemaFieldCreationInformation" },
        SchemaXml: fieldXml(f, listIds),
        Options: 8,
      },
    });
    console.log(`    + ${f.name}`);
  };

  // ------------------------------------------------------------ provision --
  // 1. Sidecar library + root folders (library first, per install order)
  const libId = await ensureList(LIBRARY, 101);
  const lib = await get(`/_api/web/lists/${esc(LIBRARY)}/RootFolder?$select=ServerRelativeUrl`);
  for (const folder of FOLDERS) {
    const path = `${lib.ServerRelativeUrl}/${folder}`;
    const existing = await get(
      `/_api/web/GetFolderByServerRelativeUrl('${encodeURIComponent(path).replace(/'/g, "''")}')/Exists`);
    if (existing && existing.Exists) { console.log(`  = folder ${folder} exists`); continue; }
    await post(`/_api/web/folders`, {
      __metadata: { type: "SP.Folder" }, ServerRelativeUrl: path,
    });
    console.log(`  + folder ${folder}`);
  }

  // 2. All six lists first (empty), so every lookup target exists before
  //    any lookup column is added — including Keywords' self-lookup.
  const listIds = {};
  for (const title of Object.keys(LISTS)) listIds[title] = await ensureList(title, 100);

  // 3. Columns, in CSV order
  for (const [title, fields] of Object.entries(LISTS)) {
    console.log(`Columns for '${title}':`);
    for (const f of fields) await ensureField(title, f, listIds);
  }

  // 4. Keywords needs its native Title indexed
  const kwTitle = await get(
    `/_api/web/lists/${esc("Keywords")}/fields/getbyinternalnameortitle('Title')?$select=Indexed`);
  if (!kwTitle.Indexed) {
    await post(`/_api/web/lists/${esc("Keywords")}/fields/getbyinternalnameortitle('Title')`,
      { __metadata: { type: "SP.Field" }, Indexed: true },
      { "X-HTTP-Method": "MERGE", "IF-MATCH": "*" });
    console.log("+ indexed Keywords.Title");
  } else {
    console.log("= Keywords.Title already indexed");
  }

  // --------------------------------------------------------- verification --
  console.log("\n=== List GUIDs (record these for the flow Config compose) ===");
  for (const [title, id] of Object.entries(listIds)) console.log(`${title.padEnd(14)} ${id}`);
  console.log(`${LIBRARY.padEnd(14)} ${libId}`);

  console.log("\n=== Field verification (diff against schemas/SPList_*.csv) ===");
  let problems = 0;
  for (const [title, fields] of Object.entries(LISTS)) {
    const d = await get(`/_api/web/lists/${esc(title)}/fields?$select=InternalName,TypeAsString,Required,Indexed`);
    const actual = Object.fromEntries(d.results.map((x) => [x.InternalName, x]));
    const rows = [];
    for (const f of fields) {
      const a = actual[f.name];
      if (!a) { rows.push({ column: f.name, status: "MISSING" }); problems++; continue; }
      const reqOk = !!a.Required === !!f.required, idxOk = !!a.Indexed === !!f.indexed;
      if (!reqOk || !idxOk) problems++;
      rows.push({ column: f.name, type: a.TypeAsString,
                  required: a.Required ? "Req" : "", indexed: a.Indexed ? "INDEXED" : "",
                  status: reqOk && idxOk ? "ok" : "!! MISMATCH" });
    }
    console.log(`[${title}]`); console.table(rows);
  }
  console.log(problems === 0
    ? "All columns present with expected Required/Indexed flags.\n" +
      "Before wiring the flow: create ONE test item in each list with a lookup\n" +
      "column and confirm the lookup value saves (tenant caveat)."
    : `${problems} problem(s) flagged above - resolve before wiring the flow.`);
})();
