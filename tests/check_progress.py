#!/usr/bin/env python3
"""Gate for pipeline/lib/progress.mjs — the shared run narration the
local jobs write to stderr:

  1. resolveProgress precedence: --no-progress > --progress > the
     config value > the caller's default > "a person is watching"
     (stderr is a TTY)
  2. a disabled reporter writes NOTHING and every helper still works
     (a caller may build its message eagerly)
  3. the line shape jobs and gates depend on: `progress: <message>`,
     phases with their elapsed seconds, `[i/n] label — detail`
  4. long loops thin out (one line per item to 200, then ~50 lines)
     and always print the last item
  5. heartbeats fire on their interval, stop on demand, and never
     hold the process open (unref'd)
  6. nothing is ever written to stdout

Prereqs: Node 22+. Run from anywhere.
Usage: python3 check_progress.py
"""
import json
import os
import subprocess
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
failures = []


def check(name, cond, detail=""):
    print(("  ok   " if cond else "  FAIL ") + name + ("" if cond else f"  <- {detail}"))
    if not cond:
        failures.append(name)


def run(js):
    """Run js against the module; returns (parsed stdout JSON, stderr)."""
    r = subprocess.run(
        ["node", "--input-type=module", "-e",
         "import * as P from './pipeline/lib/progress.mjs';\n" + js],
        capture_output=True, text=True, cwd=REPO,
    )
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-800:])
    return (json.loads(r.stdout) if r.stdout.strip() else None), r.stderr


def main():
    print("== resolveProgress")
    out, _ = run("""
      const r = P.resolveProgress;
      console.log(JSON.stringify({
        flagOffWins: r(true, {on: true, off: true}),
        flagOn: r(false, {on: true}),
        cfgTrue: r(true, {}),
        cfgFalse: r(false, {on: false, off: false}),
        cfgAlways: r("always", {}),
        cfgNever: r("never", {}),
        cfgAutoTakesDefault: r("auto", {defaultOn: true}),
        undefinedTakesDefault: r(undefined, {defaultOn: true}),
        defaultOffWins: r(undefined, {defaultOn: false}),
        // no config, no default, not a TTY under a captured pipe
        bare: r(undefined, {}),
      }));
    """)
    check("--no-progress beats --progress and the config", out["flagOffWins"] is False, str(out))
    check("--progress beats a config false", out["flagOn"] is True, str(out))
    check("config true / false honoured", out["cfgTrue"] and out["cfgFalse"] is False, str(out))
    check('config "always" / "never" honoured',
          out["cfgAlways"] and out["cfgNever"] is False, str(out))
    check('"auto" and an absent key fall through to the caller default',
          out["cfgAutoTakesDefault"] and out["undefinedTakesDefault"]
          and out["defaultOffWins"] is False, str(out))
    check("with no config and no default, a redirected run is quiet",
          out["bare"] is False, str(out))

    print("== a disabled reporter")
    out, err = run("""
      const prog = P.createProgress({enabled: false});
      prog("never printed");
      const ph = prog.phase("phase");
      ph.step("step"); ph.done("done"); ph.fail("fail");
      const tick = prog.counter(3, "things");
      tick("one"); tick("two"); tick("three");
      prog.note("note"); prog.fail("what", "why");
      const stop = prog.heartbeat("waiting", 1);
      stop();
      console.log(JSON.stringify({enabled: prog.enabled, counted: tick.count, elapsed: prog.elapsed() >= 0}));
    """)
    check("a disabled reporter writes nothing", err == "", repr(err[:200]))
    check("its helpers still work (the counter still counts)",
          out["enabled"] is False and out["counted"] == 3 and out["elapsed"], str(out))
    check("noProgress is such a reporter", run(
        "P.noProgress('x'); console.log(JSON.stringify({e: P.noProgress.enabled}));"
    )[0]["e"] is False)

    print("== the line shape")
    out, err = run("""
      const prog = P.createProgress({enabled: true});
      prog("plain line");
      prog.note("an aside");
      prog.fail("one document", "it exploded");
      const ph = prog.phase("figure index");
      ph.step("scanning");
      ph.done("482 rows upserted");
      const tick = prog.counter(2, "documents");
      tick("alpha.pptx", "3 figures");
      tick("beta.pptx");
      console.log(JSON.stringify({}));
    """)
    lines = [l for l in err.splitlines() if l]
    check("every line carries the `progress: ` prefix",
          all(l.startswith("progress: ") for l in lines), repr(lines[:3]))
    check("a plain line is the message verbatim", lines[0] == "progress: plain line", repr(lines[0]))
    check("note / fail have their own shapes",
          lines[1] == "progress: note: an aside"
          and lines[2] == "progress: FAILED one document: it exploded", repr(lines[1:3]))
    check("a phase announces its start, its steps and its result with elapsed seconds",
          lines[3] == "progress: figure index — start"
          and lines[4] == "progress: figure index — scanning"
          and lines[5].startswith("progress: figure index — 482 rows upserted (")
          and lines[5].endswith("s)"), repr(lines[3:6]))
    check("a counter announces its total, then [i/n] label — detail",
          lines[6] == "progress: documents — 2"
          and lines[7] == "progress: [1/2] alpha.pptx — 3 figures"
          and lines[8] == "progress: [2/2] beta.pptx", repr(lines[6:9]))
    check("nothing reaches stdout", out == {}, str(out))

    print("== long loops thin out")
    out, err = run("""
      const prog = P.createProgress({enabled: true});
      const small = prog.counter(200);
      for (let i = 0; i < 200; i++) small(`s${i}`);
      const big = prog.counter(1000);
      for (let i = 0; i < 1000; i++) big(`b${i}`);
      const every = prog.counter(100, "", {every: 25});
      for (let i = 0; i < 100; i++) every(`e${i}`);
      console.log(JSON.stringify({}));
    """)
    s_lines = [l for l in err.splitlines() if "] s" in l]
    b_lines = [l for l in err.splitlines() if "] b" in l]
    e_lines = [l for l in err.splitlines() if "] e" in l]
    check("up to 200 items, every item prints", len(s_lines) == 200, len(s_lines))
    check("a 1000-item loop thins to ~50 lines", 45 <= len(b_lines) <= 55, len(b_lines))
    check("the last item always prints",
          b_lines[-1] == "progress: [1000/1000] b999", repr(b_lines[-1]))
    check("an explicit `every` is honoured",
          len(e_lines) == 4 and e_lines[0] == "progress: [25/100] e24", repr(e_lines))

    print("== heartbeats")
    out, err = run("""
      const prog = P.createProgress({enabled: true});
      const stop = prog.heartbeat("waiting on the model", 30);
      await new Promise((r) => setTimeout(r, 110));
      stop();
      await new Promise((r) => setTimeout(r, 80));
      console.log(JSON.stringify({}));
    """)
    beats = [l for l in err.splitlines() if "still waiting on the model" in l]
    check("a heartbeat fires on its interval", 2 <= len(beats) <= 4, repr(beats))
    check("its line names what is being waited on and for how long",
          all(l.startswith("progress: still waiting on the model — ")
              and l.endswith("s elapsed") for l in beats), repr(beats[:1]))
    check("stopping it ends the beating", len(beats) <= 4, repr(beats))
    # an un-stopped heartbeat must not keep the process alive
    r = subprocess.run(
        ["node", "--input-type=module", "-e",
         "import * as P from './pipeline/lib/progress.mjs';\n"
         "const prog = P.createProgress({enabled: true});\n"
         "prog.heartbeat('forever', 50);\n"],
        capture_output=True, text=True, cwd=REPO, timeout=20,
    )
    check("an un-stopped heartbeat is unref'd — the process still exits",
          r.returncode == 0, r.stderr[-200:])

    print("== secs")
    out, _ = run("""
      console.log(JSON.stringify({a: P.secs(0), b: P.secs(1499), c: P.secs(90000)}));
    """)
    check("secs rounds to whole seconds",
          out == {"a": "0s", "b": "1s", "c": "90s"}, str(out))

    print(f"\n{len(failures)} failed" if failures else "\nGATE PASSED")
    if failures:
        print("FAILED:", ", ".join(failures))
        sys.exit(1)


if __name__ == "__main__":
    main()
