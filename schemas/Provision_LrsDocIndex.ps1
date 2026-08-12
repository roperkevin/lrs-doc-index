<#
.SYNOPSIS
    Provisions the LRS Doc Index SharePoint schema: the "LRS Doc Index"
    document library (with its eight root folders) and the six lists —
    Doc Index, Keywords, Doc IDs, Issue Refs, Doc Keywords, Doc Links.

.DESCRIPTION
    Source of truth: schemas/SPList_*.csv in this repo. Hand-transcribed;
    every internal name, type, choice value (order preserved), default,
    required flag, index, and lookup target matches the CSVs.

    Idempotent: safe to re-run. Existing lists/fields/folders are left
    untouched (it does NOT reconcile drift on existing fields — it only
    creates what is missing and reports what it finds).

    Conventions enforced (see docs/SP_Adaptation_Notes.md build mechanics):
      - Columns created with Internal Name as the creation-time name
      - Choice columns: dropdown, no fill-in, exact values in order
      - Multi-line text: plain text (RichText FALSE), never enhanced
      - Numbers: 0 decimals; DateTime: date & time (not date-only)
      - Lookups: single-value, ShowField Title (provisioned via CSOM/CAML,
        bypassing the modern UI whose lookup creation is broken on this
        tenant — still verify each lookup with one test item before
        pointing the flow at it)
      - Indexes created now, while the lists are empty
      - No uniqueness enforcement anywhere (flow dedups via the indexed
        key columns)

.USAGE
    Install-Module PnP.PowerShell -Scope CurrentUser
    ./Provision_LrsDocIndex.ps1                     # interactive login
    ./Provision_LrsDocIndex.ps1 -ClientId <appId>   # if your tenant
        requires a registered Entra app for PnP interactive login

    Afterward, record the printed list GUIDs — the flow Config compose
    needs them.
#>
param(
    [string]$SiteUrl = "https://esriis.sharepoint.com/sites/lrsworkspace",
    [string]$ClientId
)

$ErrorActionPreference = "Stop"

if ($ClientId) {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $ClientId
} else {
    Connect-PnPOnline -Url $SiteUrl -Interactive
}

# ---------------------------------------------------------------- schema ---
# One entry per custom column, in CSV order. Title columns are native and
# not listed (Keywords' Title index is handled explicitly below).

$Lists = [ordered]@{
    "Doc Index" = @(
        @{ Name = "DocKey";         Type = "Text";     Required = $true; Indexed = $true }
        @{ Name = "FileName";       Type = "Text";     Required = $true }
        @{ Name = "SourceLink";     Type = "URL" }
        @{ Name = "Library";        Type = "Text" }      # RESERVED - unused by design
        @{ Name = "FileType";       Type = "Choice";   Choices = @("pptx","docx","xlsx","pdf","msg","txt","html","image","other") }
        @{ Name = "DocKind";        Type = "Choice";   Choices = @("Test Plan","User Story","Design Spike","Data Template","Schedule","Doc Review","Other") }
        @{ Name = "IndexStatus";    Type = "Choice";   Required = $true; Default = "Pending"; Choices = @("Pending","Indexed","Skipped","Error") }
        @{ Name = "SourceETag";     Type = "Text" }      # RESERVED - unused by design
        @{ Name = "SourceModified"; Type = "DateTime" }
        @{ Name = "TextPreview";    Type = "Note" }
        @{ Name = "TextFileUrl";    Type = "URL" }
        @{ Name = "Summary";        Type = "Note" }
        @{ Name = "DocRevision";    Type = "Text" }
        @{ Name = "TargetRelease";  Type = "Text" }
        @{ Name = "PE";             Type = "Text" }
        @{ Name = "Dev";            Type = "Text" }
        @{ Name = "SourceAuthor";   Type = "Text" }
        @{ Name = "SourceEditor";   Type = "Text" }
        @{ Name = "SourceEdited";   Type = "DateTime" }
        @{ Name = "Surface";        Type = "Choice";   Choices = @("Pro","Experience Builder","Server","Enterprise","Other") }
        @{ Name = "ExtractionLane"; Type = "Choice";   Choices = @("xmlstrip","workbookdump","plaintext","htmltotext","ocr","none") }
        @{ Name = "PromptVersion";  Type = "Text" }
        @{ Name = "IndexedOn";      Type = "DateTime" }
        @{ Name = "LastError";      Type = "Note" }
    )
    "Keywords" = @(
        @{ Name = "Kind";              Type = "Choice"; Required = $true; Choices = @("topic","tool","product") }
        @{ Name = "CanonicalRef";      Type = "Lookup"; LookupList = "Keywords" }   # self-lookup
        @{ Name = "Notes";             Type = "Note" }
        @{ Name = "CurationStatus";    Type = "Choice"; Choices = @("Proposed","Rejected") }
        @{ Name = "ProposedCanonical"; Type = "Text" }
    )
    "Doc IDs" = @(
        @{ Name = "Document";    Type = "Lookup"; Required = $true; Indexed = $true; LookupList = "Doc Index" }
        @{ Name = "Repo";        Type = "Text";   Required = $true }
        @{ Name = "IssueNumber"; Type = "Number"; Required = $true; Indexed = $true }
        @{ Name = "Source";      Type = "Choice"; Required = $true; Choices = @("url","filename","hashtag","titlematch","manual") }
        @{ Name = "IdKey";       Type = "Text";   Required = $true; Indexed = $true }
    )
    "Issue Refs" = @(
        @{ Name = "Repo";           Type = "Text";    Required = $true }
        @{ Name = "IssueNumber";    Type = "Number";  Required = $true }
        @{ Name = "IssueKey";       Type = "Text";    Required = $true; Indexed = $true }
        @{ Name = "IssueTitle";     Type = "Text";    Required = $true }
        @{ Name = "PE";             Type = "Text" }
        @{ Name = "Dev";            Type = "Text" }
        @{ Name = "IterationLabel"; Type = "Text" }
        @{ Name = "StatusSummary";  Type = "Text" }
        @{ Name = "DoneFlag";       Type = "Boolean" }
        @{ Name = "SourceDocument"; Type = "Lookup";  LookupList = "Doc Index" }
    )
    "Doc Keywords" = @(
        @{ Name = "Document"; Type = "Lookup"; Required = $true; Indexed = $true; LookupList = "Doc Index" }
        @{ Name = "Keyword";  Type = "Lookup"; Required = $true; Indexed = $true; LookupList = "Keywords" }
        @{ Name = "KWKey";    Type = "Text";   Required = $true; Indexed = $true }
    )
    "Doc Links" = @(
        @{ Name = "DocA";         Type = "Lookup"; Required = $true; LookupList = "Doc Index" }
        @{ Name = "DocB";         Type = "Lookup"; Required = $true; LookupList = "Doc Index" }
        @{ Name = "LinkType";     Type = "Choice"; Required = $true; Choices = @("id","gantt","titlematch","review") }
        @{ Name = "SharedValues"; Type = "Note" }
        @{ Name = "Strength";     Type = "Number" }
        @{ Name = "LinkKey";      Type = "Text";   Required = $true; Indexed = $true }
    )
}

$LibraryName    = "LRS Doc Index"
$LibraryFolders = @("media","Test Plans","User Stories","Design Spikes",
                    "Data Templates","Schedules","Doc Reviews","Other")

# --------------------------------------------------------------- helpers ---

function Ensure-List {
    param([string]$Title, [string]$Template)
    $list = Get-PnPList -Identity $Title -ErrorAction SilentlyContinue
    if ($null -eq $list) {
        New-PnPList -Title $Title -Template $Template | Out-Null
        Write-Host "+ created $Template '$Title'"
    } else {
        Write-Host "= $Template '$Title' already exists"
    }
    return Get-PnPList -Identity $Title
}

function New-FieldXml {
    param([hashtable]$F, [hashtable]$ListIds)
    $attrs = "Name=""$($F.Name)"" StaticName=""$($F.Name)"" DisplayName=""$($F.Name)"""
    if ($F.Required) { $attrs += ' Required="TRUE"' }
    if ($F.Indexed)  { $attrs += ' Indexed="TRUE"' }
    switch ($F.Type) {
        "Text"     { return "<Field Type=""Text"" $attrs />" }
        "Note"     { return "<Field Type=""Note"" RichText=""FALSE"" NumLines=""6"" $attrs />" }
        "URL"      { return "<Field Type=""URL"" Format=""Hyperlink"" $attrs />" }
        "DateTime" { return "<Field Type=""DateTime"" Format=""DateTime"" $attrs />" }
        "Number"   { return "<Field Type=""Number"" Decimals=""0"" $attrs />" }
        "Boolean"  { return "<Field Type=""Boolean"" $attrs />" }
        "Choice"   {
            $choices = ($F.Choices | ForEach-Object { "<CHOICE>$_</CHOICE>" }) -join ""
            $default = if ($F.Default) { "<Default>$($F.Default)</Default>" } else { "" }
            return "<Field Type=""Choice"" Format=""Dropdown"" FillInChoice=""FALSE"" $attrs>$default<CHOICES>$choices</CHOICES></Field>"
        }
        "Lookup"   {
            $targetId = $ListIds[$F.LookupList]
            return "<Field Type=""Lookup"" List=""{$targetId}"" ShowField=""Title"" $attrs />"
        }
    }
    throw "Unknown field type '$($F.Type)' for column '$($F.Name)'"
}

function Ensure-Field {
    param([string]$ListTitle, [hashtable]$F, [hashtable]$ListIds)
    $existing = Get-PnPField -List $ListTitle -Identity $F.Name -ErrorAction SilentlyContinue
    if ($null -eq $existing) {
        Add-PnPFieldFromXml -List $ListTitle -FieldXml (New-FieldXml -F $F -ListIds $ListIds) | Out-Null
        Write-Host "    + $($F.Name)"
    } else {
        Write-Host "    = $($F.Name) already exists ($($existing.TypeAsString))"
    }
}

# ------------------------------------------------------------- provision ---

# 1. Sidecar library + root folders (library first, per install order)
Ensure-List -Title $LibraryName -Template DocumentLibrary | Out-Null
$web = Get-PnPWeb
$lib = Get-PnPList -Identity $LibraryName -Includes RootFolder.ServerRelativeUrl
$libSiteRelative = $lib.RootFolder.ServerRelativeUrl.Substring($web.ServerRelativeUrl.TrimEnd('/').Length).TrimStart('/')
foreach ($folder in $LibraryFolders) {
    Resolve-PnPFolder -SiteRelativePath "$libSiteRelative/$folder" | Out-Null
    Write-Host "  folder $libSiteRelative/$folder"
}

# 2. Create all six lists first (empty), so every lookup target exists
#    before any lookup column is added — including Keywords' self-lookup.
$listIds = @{}
foreach ($title in $Lists.Keys) {
    $listIds[$title] = (Ensure-List -Title $title -Template GenericList).Id
}

# 3. Columns, in CSV order
foreach ($title in $Lists.Keys) {
    Write-Host "Columns for '$title':"
    foreach ($f in $Lists[$title]) {
        Ensure-Field -ListTitle $title -F $f -ListIds $listIds
    }
}

# 4. Keywords needs its native Title indexed (dedup/canonical lookups key on it)
$kwTitle = Get-PnPField -List "Keywords" -Identity "Title"
if (-not $kwTitle.Indexed) {
    Set-PnPField -List "Keywords" -Identity "Title" -Values @{ Indexed = $true } | Out-Null
    Write-Host "+ indexed Keywords.Title"
} else {
    Write-Host "= Keywords.Title already indexed"
}

# ----------------------------------------------------------- verification ---

Write-Host "`n=== List GUIDs (record these for the flow Config compose) ==="
foreach ($title in $Lists.Keys) {
    Write-Host ("{0,-14} {1}" -f $title, $listIds[$title])
}
Write-Host ("{0,-14} {1}" -f $LibraryName, $lib.Id)

Write-Host "`n=== Field verification (diff against schemas/SPList_*.csv) ==="
$problems = 0
foreach ($title in $Lists.Keys) {
    Write-Host "`n[$title]"
    $actual = @{}
    Get-PnPField -List $title | ForEach-Object { $actual[$_.InternalName] = $_ }
    foreach ($f in $Lists[$title]) {
        $a = $actual[$f.Name]
        if ($null -eq $a) {
            Write-Host ("  MISSING  {0}" -f $f.Name); $problems++
            continue
        }
        $flags = @()
        if ($a.Required)                        { $flags += "Req" }
        if ($a.Indexed)                         { $flags += "INDEXED" }
        if ([bool]$a.Required -ne [bool]$f.Required) { $flags += "!! Required mismatch"; $problems++ }
        if ([bool]$a.Indexed  -ne [bool]$f.Indexed)  { $flags += "!! Indexed mismatch";  $problems++ }
        Write-Host ("  {0,-18} {1,-10} {2}" -f $f.Name, $a.TypeAsString, ($flags -join ", "))
    }
}

if ($problems -eq 0) {
    Write-Host "`nAll columns present with expected Required/Indexed flags."
    Write-Host "Before wiring the flow: create ONE test item in each list with a"
    Write-Host "lookup column and confirm the lookup value saves (tenant caveat)."
} else {
    Write-Host "`n$problems problem(s) flagged above - resolve before wiring the flow."
}
