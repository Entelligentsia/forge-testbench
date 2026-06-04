#!/usr/bin/env bash
# reset.sh <project> — restore the project to its golden pristine state.
# Fast, deterministic, no LLM, no store semantics: pure git + tar restore.
#
#   1. Tracked source: git restore from tag testbench/<project>-baseline,
#      scoped to the project subtree (other testbench projects untouched);
#      untracked leftovers removed with git clean (gitignored state like
#      .forge/ and engineering/ is handled by step 2, not git).
#   2. Forge state: wipe .forge/store, .forge/cache, .forge/transcripts,
#      enhancement-proposals + root run-artifacts, then untar golden.
#   3. Verify: entity counts/statuses vs MANIFEST.json + validate-store.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT="${1:?usage: reset.sh <project>}"
PROJ="$ROOT/$PROJECT"
GOLDEN="$ROOT/testbench/golden/$PROJECT"
TAG="testbench/$PROJECT-baseline"

[ -f "$GOLDEN/state.tgz" ] || { echo "× no golden snapshot at $GOLDEN — run snapshot.sh first" >&2; exit 1; }
git -C "$ROOT" rev-parse -q --verify "$TAG" >/dev/null || { echo "× missing git tag $TAG — run snapshot.sh first" >&2; exit 1; }

echo "── reset: $PROJECT ← golden ($(python3 -c "import json;print(json.load(open('$GOLDEN/MANIFEST.json'))['createdAt'])"))"

# 1. Tracked source back to baseline (project subtree only) ─────────────────
git -C "$ROOT" restore --source="$TAG" --worktree --staged -- "$PROJECT/" 2>/dev/null || true
git -C "$ROOT" clean -qfd -e node_modules -e dist -- "$PROJECT/"
echo "  ✓ src restored from $TAG ($(git -C "$ROOT" rev-parse --short "$TAG"))"

# 2. Forge state from golden ────────────────────────────────────────────────
rm -rf "$PROJ/.forge/store" "$PROJ/.forge/cache" "$PROJ/.forge/transcripts" "$PROJ/.forge/enhancement-proposals"
rm -rf "$PROJ/engineering"
rm -f "$PROJ"/VALIDATION_REPORT.md "$PROJ"/COMMIT-SUMMARY.json "$PROJ"/BUG_REPORT*.md
mkdir -p "$PROJ/.forge/transcripts" "$PROJ/.forge/enhancement-proposals"
tar xzf "$GOLDEN/state.tgz" -C "$PROJ"
echo "  ✓ store / cache / engineering / fixtures restored"

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
