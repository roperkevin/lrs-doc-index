"""Verification for the design-token blocks in local/lib/designsystem.mjs
against the PUBLISHED packages — the check the Carbon MCP would give an
approved user, from the same source of truth, with no approval needed.

Downloads from the npm registry (network required):

  @carbon/colors, @carbon/type, @carbon/layout, @carbon/themes
  @fluentui/tokens
  @uswds/uswds            (34 MB — only with --all)

and compares, value by value:

  carbon   spacing-01 … spacing-13; the productive type ramp (px size,
           px line height from the ratio, weight); every colour role's
           named token (Gray 100, Blue 60 …) in @carbon/colors and the
           White / Gray 100 theme roles in @carbon/themes
  fluent   the type ramp (fontSizeBase / lineHeightBase / Hero tokens
           per typographyStyles), spacing, radii, strokes, FLUENT_LIGHT
           and FLUENT_DARK against webLightTheme / webDarkTheme
  uswds    the type scale and line-height tokens, the 8 px spacing
           units, the largest column-gap setting, the border radii,
           the default sans typeface, every colour role's named theme
           token resolved through the system colour families

Reports every mismatch as FAIL with both values; exits 1 on any. Not a
CI job (a registry hiccup must never redden main) — run it by hand
after editing a token block:

  python3 local/harness/check_design_tokens.py [--all] [--cache DIR]
"""
import io
import json
import os
import re
import subprocess
import sys
import tarfile
import tempfile
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
DS = os.path.join(REPO, "local", "lib", "designsystem.mjs")
REGISTRY = "https://registry.npmjs.org"

PASS, FAIL = [], []


def check(name, cond, detail=""):
    (PASS if cond else FAIL).append(name)
    print(f"  {'ok  ' if cond else 'FAIL'} {name}" + ("" if cond else f"  <- {str(detail)[:300]}"))


def fetch(url):
    with urllib.request.urlopen(url, timeout=120) as r:
        return r.read()


def package(name, cache):
    """Download + extract a package's latest tarball into cache; return (dir, version)."""
    meta = json.loads(fetch(f"{REGISTRY}/{name}"))
    version = meta["dist-tags"]["latest"]
    dest = os.path.join(cache, name.replace("@", "").replace("/", "_"), version)
    if not os.path.isdir(dest):
        os.makedirs(dest, exist_ok=True)
        with tarfile.open(fileobj=io.BytesIO(fetch(meta["versions"][version]["dist"]["tarball"])), mode="r:gz") as tf:
            members = [m for m in tf.getmembers() if m.name.startswith("package/")]
            for m in members:
                m.name = m.name[len("package/"):]
            tf.extractall(dest, members=[m for m in members if m.name])
    return dest, version


def module_tokens():
    script = (
        f"import * as D from {json.dumps('file://' + DS)};\n"
        "console.log(JSON.stringify({fluent: D.FLUENT, carbon: D.CARBON, uswds: D.USWDS,"
        " fluentLight: D.FLUENT_LIGHT, fluentDark: D.FLUENT_DARK,"
        " designs: Object.fromEntries(D.DESIGN_NAMES.flatMap((k) => ['light', 'dark'].map((t) => [`${k}/${t}`, D.designOf(k, t).COLOR])))}));\n"
    )
    res = subprocess.run(["node", "--input-type=module", "-e", script], capture_output=True, text=True, cwd=REPO)
    if res.returncode != 0:
        raise RuntimeError(res.stderr)
    return json.loads(res.stdout.strip().splitlines()[-1])


def hexup(v):
    return str(v).lstrip("#").upper()


def px_of(v):
    v = str(v)
    if v.endswith("rem"):
        return float(v[:-3]) * 16
    if v.endswith("px"):
        return float(v[:-2])
    return float(v)


def main():
    args = sys.argv[1:]
    want_all = "--all" in args
    cache = args[args.index("--cache") + 1] if "--cache" in args else os.path.join(tempfile.gettempdir(), "design-token-packages")
    os.makedirs(cache, exist_ok=True)
    mod = module_tokens()

    # ---- Carbon ---------------------------------------------------------
    print("== carbon")
    dirs = {n: package(n, cache) for n in ("@carbon/colors", "@carbon/type", "@carbon/layout", "@carbon/themes")}
    print("  versions:", {k: v[1] for k, v in dirs.items()})
    nm = os.path.join(cache, "node_modules", "@carbon")
    os.makedirs(nm, exist_ok=True)
    for n, (d, _) in dirs.items():
        link = os.path.join(nm, n.split("/")[1])
        if os.path.islink(link) or os.path.exists(link):
            os.remove(link)
        os.symlink(d, link)
    script = (
        "const C = require('@carbon/colors'); const T = require('@carbon/type'); const L = require('@carbon/layout');\n"
        "console.log(JSON.stringify({spacing: L.spacing, type: T, colors: C}));\n"
    )
    res = subprocess.run(["node", "-e", script], capture_output=True, text=True, cwd=cache)
    if res.returncode != 0:
        raise RuntimeError(res.stderr)
    pub = json.loads(res.stdout.strip().splitlines()[-1])
    cb = mod["carbon"]
    got = [round(px_of(v)) for v in pub["spacing"]]
    check("spacing-01 … spacing-13", got == [cb["spacing"][f"spacing-{i:02d}"] for i in range(1, 14)], (got, cb["spacing"]))
    for token, (sz, lh, w) in cb["type"].items():
        key = re.sub(r"-(\w)", lambda m: m.group(1).upper(), token)  # body-compact-01 → bodyCompact01
        st = pub["type"].get(key)
        if not st:
            check(f"type {token} exists as {key}", False, list(pub["type"].keys())[:8])
            continue
        psz = px_of(st["fontSize"])
        # the package stores line height as a ratio rounded to 3–4 decimals
        # (heading-07: 1.199 × 54 = 64.7 for the documented 64 px) — allow 1 px
        plh = psz * float(st["lineHeight"])
        pw = st.get("fontWeight", 400)
        check(f"type {token} = {sz}/{lh} w{w}", psz == sz and abs(plh - lh) <= 1 and pw == w, f"published {psz}/{plh:.1f} w{pw}")
    # colours named "X N" in the role comments → @carbon/colors keys
    def carbon_named(src):
        m = re.search(r"\b(Gray|Blue|Green|Red|Orange|Yellow|Purple|White)\s*(\d+)?\b", src)
        if not m:
            return None
        return (m.group(1).lower() + (m.group(2) or "")).replace("white", "white")
    for theme in ("colors", "colorsDark"):
        for role, (hexv, src) in cb[theme].items():
            key = carbon_named(src)
            if not key:
                continue
            pubv = pub["colors"].get(key)
            check(f"{theme}.{role} = {src} → {hexv}", pubv is not None and hexup(pubv) == hexv, f"@carbon/colors {key} = {pubv}")
    # theme roles from the generated scss
    themes_scss = open(os.path.join(dirs["@carbon/themes"][0], "scss", "generated", "_themes.scss"), encoding="utf-8").read()
    def theme_map(name):
        m = re.search(r"\$%s:\s*\((.*?)\n\)\s*!default;" % name, themes_scss, re.S)
        return dict(re.findall(r"\n\s*([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})", m.group(1)))
    white, g100 = theme_map("white"), theme_map("g100")
    for theme, tm, table in (("white", white, cb["colors"]), ("g100", g100, cb["colorsDark"])):
        for role, tok in (("background", "background"), ("layer", "layer-01"), ("border", "border-subtle-01"), ("textPrimary", "text-primary"),
                          ("textSecondary", "text-secondary"), ("textTertiary", "text-helper"), ("textOnInverse", "text-on-color"),
                          ("brand", "interactive"), ("danger", "support-error")):
            check(f"@carbon/themes {theme} {tok} → {role}", hexup(tm.get(tok, "")) == table[role][0], f"published {tm.get(tok)} vs {table[role][0]}")

    # ---- Fluent ---------------------------------------------------------
    print("== fluent")
    fdir, fver = package("@fluentui/tokens", cache)
    print("  version:", fver)
    nmf = os.path.join(cache, "node_modules", "@fluentui")
    os.makedirs(nmf, exist_ok=True)
    link = os.path.join(nmf, "tokens")
    if os.path.islink(link) or os.path.exists(link):
        os.remove(link)
    os.symlink(fdir, link)
    script = (
        "const F = require('@fluentui/tokens');\n"
        "const styles = Object.fromEntries(Object.entries(F.typographyStyles).map(([k, v]) => [k, [v.fontSize, v.lineHeight, v.fontWeight]]));\n"
        "console.log(JSON.stringify({light: F.webLightTheme, dark: F.webDarkTheme, styles}));\n"
    )
    res = subprocess.run(["node", "-e", script], capture_output=True, text=True, cwd=cache)
    if res.returncode != 0:
        raise RuntimeError(res.stderr)
    pf = json.loads(res.stdout.strip().splitlines()[-1])
    light, dark = pf["light"], pf["dark"]
    fl = mod["fluent"]
    var = lambda s: light[re.sub(r"^var\(--(\w+)\)$", r"\1", s)]
    for token, (sz, lh, w) in fl["type"].items():
        st = pf["styles"].get(token)
        if not st:
            check(f"type {token} exists", False, "")
            continue
        psz, plh, pw = px_of(var(st[0])), px_of(var(st[1])), var(st[2])
        check(f"type {token} = {sz}/{lh} w{w}", psz == sz and plh == lh and pw == w, f"published {psz}/{plh} w{pw}")
    for k, v in fl["spacing"].items():
        # xxs → XXS, sNudge → SNudge, none → None (the published key casing)
        key = "spacingHorizontal" + ("None" if k == "none" else k[0].upper() + k[1:] if k.endswith("Nudge") else k.upper())
        check(f"spacing {k} = {v}", key in light and px_of(light[key]) == v, f"published {light.get(key)} ({key})")
    for k, v in fl["borderRadius"].items():
        key = "borderRadius" + k[0].upper() + k[1:]
        check(f"radius {k} = {v}", px_of(light[key]) == v, f"published {light[key]}")
    for k, v in fl["strokeWidth"].items():
        key = "strokeWidth" + k[0].upper() + k[1:]
        check(f"stroke {k} = {v}", px_of(light[key]) == v, f"published {light[key]}")
    check("fontFamilyBase starts with Segoe UI", light["fontFamilyBase"].startswith("'Segoe UI'"), light["fontFamilyBase"])
    for role, hexv in mod["fluentLight"].items():
        pubv = light.get("color" + role[0].upper() + role[1:])
        check(f"FLUENT_LIGHT {role} = {hexv}", pubv is not None and hexup(pubv) == hexv, f"published {pubv}")
    for role, hexv in mod["fluentDark"].items():
        pubv = dark.get("color" + role[0].upper() + role[1:])
        check(f"FLUENT_DARK {role} = {hexv}", pubv is not None and hexup(pubv) == hexv, f"published {pubv}")

    # ---- USWDS ----------------------------------------------------------
    if not want_all:
        print("== uswds: skipped (34 MB tarball — pass --all)")
    else:
        print("== uswds")
        udir, uver = package("@uswds/uswds", cache)
        print("  version:", uver)
        styles = os.path.join(udir, "packages", "uswds-core", "src", "styles")
        rd = lambda *p: open(os.path.join(styles, *p), encoding="utf-8").read()
        us = mod["uswds"]
        scale = dict(re.findall(r'"?(micro|\d+)"?:\s*(\d+)px', rd("tokens", "font", "type-scale.scss")))
        lh = dict(re.findall(r"(\d):\s*([\d.]+)", rd("tokens", "font", "line-height.scss")))
        for token, (sz, line, w) in us["type"].items():
            m = re.match(r"(micro|size-(\d+))/(\d)", token)
            key = m.group(2) or "micro"
            psz = float(scale[key])
            plh = round(psz * float(lh[m.group(3)]), 1)
            check(f"type {token} = {sz}/{line}", psz == sz and plh == line, f"published {psz}/{plh}")
        mult = dict(re.findall(r'"?(\d+)"?:\s*spacing-multiple\(([\d.]+)\)', rd("tokens", "units", "spacing.scss")))
        for k, v in us["spacing"].items():
            key = k.replace("units-", "")
            check(f"spacing {k} = {v}", key in mult and float(mult[key]) * 8 == v, f"published {mult.get(key)} × 8")
        gaps = dict(re.findall(r"\$theme-column-gap-(\w+):\s*(\S+)\s*!default", rd("settings", "_settings-spacing.scss")))
        check("gutter = $theme-column-gap-lg units", us["grid"]["gutter"] == "units-" + gaps.get("lg", "?"), gaps)
        radii = dict(re.findall(r"\$theme-border-radius-(\w+):\s*(\S+)\s*!default", rd("settings", "_settings-spacing.scss")))
        check("radii sm 2px / md 0.5 unit / lg 1 unit", radii.get("sm") == "2px" and radii.get("md") == "0.5" and radii.get("lg") == "1", radii)
        sans = re.search(r'\$theme-font-type-sans:\s*"([\w-]+)"\s*!default', rd("settings", "_settings-typography.scss")).group(1)
        check(f"default sans = {sans} → {us['font']}", (sans == "source-sans-pro") == (us["font"] == "Source Sans Pro"), sans)
        assign = dict(re.findall(r'\$theme-color-([\w-]+):\s*"([\w-]+)"\s*!default', rd("settings", "_settings-color.scss")))
        def system_hex(name):
            m = re.match(r"([a-z]+(?:-[a-z]+)?)-(\d+)(v?)$", name)
            fam, grade, vivid = m.group(1), m.group(2), m.group(3)
            s = rd("tokens", "color", f"_{fam}.scss")
            if vivid:
                block = re.search(r'"vivid":\s*\((.*?)\)', s, re.S).group(1)
                return dict(re.findall(r"(\d+):\s*(#[0-9a-fA-F]{6})", block)).get(grade)
            return (re.search(r"\b%s:\s*(#[0-9a-fA-F]{6})" % grade, s) or [None, None])[1]
        for theme in ("colors", "colorsDark"):
            for role, (hexv, src) in us[theme].items():
                m = re.match(r"([a-z]+(?:-[a-z]+)*)", src)
                tok = m.group(1) if m else ""
                if tok in ("white",):
                    check(f"{theme}.{role} = white", hexv == "FFFFFF", hexv)
                    continue
                if tok == "ink":
                    tok = "base-ink"
                name = assign.get(tok)
                if not name:
                    check(f"{theme}.{role}: theme token {tok} exists", False, src)
                    continue
                pubv = system_hex(name)
                check(f"{theme}.{role} = {tok} ({name}) → {hexv}", pubv is not None and hexup(pubv) == hexv, f"published {pubv}")

    print(f"\n{len(PASS)}/{len(PASS) + len(FAIL)} checks passed")
    sys.exit(1 if FAIL else 0)


if __name__ == "__main__":
    main()
