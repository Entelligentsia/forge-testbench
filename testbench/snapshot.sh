#!/usr/bin/env bash
# snapshot.sh <project> — capture the project's current state as the golden
# baseline that reset.sh restores. Run after make-pristine.sh has passed.
#
# Captures:
#   - state.tgz: .forge/store, .forge/cache, engineering/, root fixtures
#     (BUG_REPORT*.md, sprint_requirements.md)
#   - git tag testbench/<project>-baseline at HEAD (tracked-source baseline)
#   - MANIFEST.json: tag SHA, entity counts/statuses, creation time
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT="${1:?usage: snapshot.sh <project>}"
PROJ="$ROOT/$PROJECT"
GOLDEN="$ROOT/testbench/golden/$PROJECT"
TAG="testbench/$PROJECT-baseline"

[ -d "$PROJ/.forge/store" ] || { echo "× no store at $PROJ/.forge/store" >&2; exit 1; }
mkdir -p "$GOLDEN"

echo "── snapshot: $PROJECT"

# 1. Collect the state payload (paths relative to the project root)
PATHS=(".forge/store" ".forge/cache" "engineering")
shopt -s nullglob
for f in "$PROJ"/BUG_REPORT*.md "$PROJ"/sprint_requirements.md; do
	PATHS+=("$(basename "$f")")
done
shopt -u nullglob

tar czf "$GOLDEN/state.tgz" -C "$PROJ" "${PATHS[@]}"
echo "  ✓ state.tgz: ${PATHS[*]}"

# 2. Tag the tracked-source baseline
git -C "$ROOT" tag -f "$TAG" >/dev/null
SHA="$(git -C "$ROOT" rev-parse "$TAG")"
echo "  ✓ git tag $TAG -> ${SHA:0:10}"

# 3. Manifest with entity counts for reset.sh verification
python3 - "$PROJ/.forge/store" "$GOLDEN/MANIFEST.json" "$TAG" "$SHA" <<'PY'
import json, glob, sys, datetime, hashlib

store, out, tag, sha = sys.argv[1:5]

def census(kind, idkey):
    items = {}
    for f in sorted(glob.glob(f"{store}/{kind}/*.json")):
        d = json.load(open(f))
        items[d[idkey]] = d["status"]
    return items

manifest = {
    "createdAt": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
    "baselineTag": tag,
    "baselineSha": sha,
    "stateTgzSha256": hashlib.sha256(open(out.replace("MANIFEST.json", "state.tgz"), "rb").read()).hexdigest(),
    "entities": {
        "sprints": census("sprints", "sprintId"),
        "tasks": census("tasks", "taskId"),
        "bugs": census("bugs", "bugId"),
    },
}
with open(out, "w") as fh:
    json.dump(manifest, fh, indent=2)
    fh.write("\n")
e = manifest["entities"]
print(f"  ✓ MANIFEST.json: {len(e['sprints'])} sprints, {len(e['tasks'])} tasks, {len(e['bugs'])} bugs")
PY

echo "── golden captured at testbench/golden/$PROJECT/ (commit it to keep it)"
