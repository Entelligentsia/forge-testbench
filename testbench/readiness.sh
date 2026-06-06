#!/usr/bin/env bash
# readiness.sh <project> — the CLONE-READY gate. Verifies that a fresh clone
# of this repo at HEAD can run /forge:run-sprint, /forge:run-task and
# /forge:fix-bug against <project> with the versions pinned in the golden
# MANIFEST. Node + git only — no forgecli, no LLM, CI-safe.
#
# Simulates the fresh clone with a temporary git worktree of HEAD, then
# asserts inside it:
#   1. .forge/config.json exists and parses
#   2. instance plugin version == MANIFEST.pluginVersion
#   3. tool sentinels present (store-cli.cjs, commit-task.cjs, preflight-gate.cjs)
#   4. workflow sentinels: commit_task.md routes through commit-task.cjs;
#      event.schema.json carries the v1.2.18+ vocabulary (bug-skipped)
#   5. wfl drivers present in .claude/workflows/
#   6. validate-store --dry-run passes
#   7. entity census/statuses == MANIFEST (runnable: planning/draft/reported)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT="${1:?usage: readiness.sh <project>}"
GOLDEN="$ROOT/testbench/golden/$PROJECT"
[ -f "$GOLDEN/MANIFEST.json" ] || { echo "× no golden manifest for $PROJECT" >&2; exit 1; }

WT="$(mktemp -d /tmp/testbench-readiness-XXXXXX)"
cleanup() { git -C "$ROOT" worktree remove --force "$WT" >/dev/null 2>&1 || true; rm -rf "$WT"; }
trap cleanup EXIT

git -C "$ROOT" worktree add --detach "$WT" HEAD >/dev/null 2>&1
PROJ="$WT/$PROJECT"

echo "── readiness: $PROJECT (fresh-clone simulation @ $(git -C "$ROOT" rev-parse --short HEAD))"
FAIL=0
check() { # check <label> <condition-exit-code>
	if [ "$2" -eq 0 ]; then echo "  ✓ $1"; else echo "  × $1" >&2; FAIL=1; fi
}

# 1+2. Config parses; version matches the manifest pin
python3 - "$PROJ" "$GOLDEN/MANIFEST.json" <<'PY'
import json, sys, os
proj, manifest_path = sys.argv[1:3]
config = json.load(open(os.path.join(proj, ".forge", "config.json")))
manifest = json.load(open(manifest_path))
assert config.get("version") == manifest.get("pluginVersion"), (
    f"instance plugin version {config.get('version')} != manifest pin {manifest.get('pluginVersion')}")
PY
check "config.json parses; plugin version matches MANIFEST pin" $?

# 3. Tool sentinels
T=0; for t in store-cli.cjs commit-task.cjs preflight-gate.cjs read-verdict.cjs; do
	[ -f "$PROJ/.forge/tools/$t" ] || { echo "    missing tool: $t" >&2; T=1; }
done
check "vendored tools present (store-cli, commit-task, preflight-gate, read-verdict)" $T

# 4. Workflow sentinels
W=0
grep -q 'commit-task.cjs' "$PROJ/.forge/workflows/commit_task.md" 2>/dev/null || { echo "    commit_task.md does not route through commit-task.cjs" >&2; W=1; }
grep -q 'bug-skipped' "$PROJ/.forge/schemas/event.schema.json" 2>/dev/null || { echo "    event.schema.json predates v1.2.18 vocabulary" >&2; W=1; }
check "workflow/schema sentinels (commit-task routing, event vocabulary)" $W

# 5. wfl drivers
D=0; for d in wfl-run-task.js wfl-run-sprint.js wfl-fix-bug.js; do
	[ -f "$PROJ/.claude/workflows/$d" ] || { echo "    missing driver: $d" >&2; D=1; }
done
check "wfl JS drivers present in .claude/workflows/" $D

# 6. validate-store (events dir may be empty on a fresh clone — recreate)
mkdir -p "$PROJ/.forge/store/events" "$PROJ/.forge/cache"
if (cd "$PROJ" && node .forge/tools/validate-store.cjs --dry-run >/tmp/testbench-readiness-validate.log 2>&1); then
	check "validate-store --dry-run" 0
else
	cat /tmp/testbench-readiness-validate.log | tail -5 >&2
	check "validate-store --dry-run" 1
fi

# 7. Census vs manifest, statuses runnable
python3 - "$PROJ/.forge/store" "$GOLDEN/MANIFEST.json" <<'PY'
import json, glob, sys
store, manifest_path = sys.argv[1:3]
manifest = json.load(open(manifest_path))
RUNNABLE = {"sprints": {"planning"}, "tasks": {"draft"}, "bugs": {"reported"}}
ok = True
for kind, idkey in (("sprints", "sprintId"), ("tasks", "taskId"), ("bugs", "bugId")):
    actual = {}
    for f in sorted(glob.glob(f"{store}/{kind}/*.json")):
        d = json.load(open(f)); actual[d[idkey]] = d["status"]
    if actual != manifest["entities"][kind]:
        print(f"    {kind} census mismatch vs MANIFEST", file=sys.stderr); ok = False
    bad = {k: v for k, v in actual.items() if v not in RUNNABLE[kind]}
    if bad:
        print(f"    {kind} not in runnable status: {bad}", file=sys.stderr); ok = False
sys.exit(0 if ok else 1)
PY
check "entity census matches MANIFEST; all statuses runnable" $?

if [ "$FAIL" -ne 0 ]; then
	echo "── NOT READY — a fresh clone cannot run Forge commands against $PROJECT" >&2
	exit 1
fi
echo "── CLONE-READY — git clone → checkout main → /forge:run-sprint|run-task|fix-bug works for $PROJECT"
