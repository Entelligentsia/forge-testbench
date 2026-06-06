#!/usr/bin/env bash
# reset.sh <project> — restore the project to its golden pristine state.
# Fast, deterministic, no LLM, no store semantics: pure git restore.
#
# Since the release-parity change, the FULL Forge instance (.forge/ minus
# volatile dirs, engineering/, .claude/workflows/) is git-tracked, so the
# baseline tag is the single source of truth — no tarball.
#
#   1. Tracked state: git restore from tag testbench/<project>-baseline,
#      scoped to the project subtree (other testbench projects untouched);
#      untracked leftovers removed with git clean.
#   2. Volatile dirs recreated empty (.forge/cache, transcripts, events,
#      enhancement-proposals) + root run-artifacts removed.
#   3. Verify: entity census/statuses vs MANIFEST.json + validate-store.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT="${1:?usage: reset.sh <project>}"
PROJ="$ROOT/$PROJECT"
GOLDEN="$ROOT/testbench/golden/$PROJECT"
TAG="testbench/$PROJECT-baseline"

[ -f "$GOLDEN/MANIFEST.json" ] || { echo "× no golden manifest at $GOLDEN — run snapshot.sh first" >&2; exit 1; }
git -C "$ROOT" rev-parse -q --verify "$TAG" >/dev/null || { echo "× missing git tag $TAG — run snapshot.sh first" >&2; exit 1; }

echo "── reset: $PROJECT ← golden ($(python3 -c "import json;print(json.load(open('$GOLDEN/MANIFEST.json'))['createdAt'])"))"

# 1. Tracked state back to baseline (project subtree only) ──────────────────
git -C "$ROOT" restore --source="$TAG" --worktree --staged -- "$PROJECT/" 2>/dev/null || true
git -C "$ROOT" clean -qfd -e node_modules -e dist -- "$PROJECT/"
echo "  ✓ tracked state restored from $TAG ($(git -C "$ROOT" rev-parse --short "$TAG"))"

# 2. Volatile dirs + run artifacts ───────────────────────────────────────────
rm -rf "$PROJ/.forge/cache" "$PROJ/.forge/transcripts" "$PROJ/.forge/enhancement-proposals"
rm -rf "$PROJ/.forge/store/events"
mkdir -p "$PROJ/.forge/cache" "$PROJ/.forge/transcripts" "$PROJ/.forge/enhancement-proposals" "$PROJ/.forge/store/events"
touch "$PROJ/.forge/store/events/.gitkeep"
rm -f "$PROJ"/VALIDATION_REPORT.md "$PROJ"/COMMIT-SUMMARY.json
echo "  ✓ volatile state recreated empty"

# 3. Verify against the manifest ────────────────────────────────────────────
python3 - "$PROJ/.forge/store" "$GOLDEN/MANIFEST.json" <<'PY'
import json, glob, sys

store, manifest_path = sys.argv[1:3]
manifest = json.load(open(manifest_path))

def census(kind, idkey):
    items = {}
    for f in sorted(glob.glob(f"{store}/{kind}/*.json")):
        d = json.load(open(f))
        items[d[idkey]] = d["status"]
    return items

ok = True
for kind, idkey in (("sprints", "sprintId"), ("tasks", "taskId"), ("bugs", "bugId")):
    actual, expected = census(kind, idkey), manifest["entities"][kind]
    if actual != expected:
        ok = False
        print(f"  × {kind} mismatch:\n    expected {expected}\n    actual   {actual}")
    else:
        statuses = sorted(set(actual.values()))
        print(f"  ✓ {kind}: {len(actual)} @ {'/'.join(statuses)}")
if not ok:
    sys.exit(1)
PY

if (cd "$PROJ" && node .forge/tools/validate-store.cjs --dry-run >/tmp/testbench-reset-validate.log 2>&1); then
	echo "  ✓ validate-store: PASS"
else
	echo "× validate-store FAILED after reset:" >&2
	cat /tmp/testbench-reset-validate.log >&2
	exit 1
fi

shopt -s nullglob
FIXTURES=("$PROJ"/BUG_REPORT*.md)
shopt -u nullglob
echo "  ✓ fixtures: ${FIXTURES[*]##*/}"
echo "── PRISTINE — ready for /forge:run-sprint, /forge:run-task, /forge:fix-bug"
