#!/usr/bin/env bash
# snapshot.sh <project> — capture the project's current state as the golden
# baseline that reset.sh restores. Run after make-pristine.sh has passed AND
# after the tracked state has been COMMITTED (the baseline tag must contain
# the instance — .forge/, engineering/, .claude/workflows/ are git-tracked
# since the release-parity change; no tarball anymore).
#
# Captures:
#   - git tag testbench/<project>-baseline at HEAD (the whole baseline)
#   - MANIFEST.json: tag SHA, entity census, plugin/forgecli versions,
#     tool sentinels — readiness.sh and reset.sh verify against it
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT="${1:?usage: snapshot.sh <project>}"
PROJ="$ROOT/$PROJECT"
GOLDEN="$ROOT/testbench/golden/$PROJECT"
TAG="testbench/$PROJECT-baseline"

[ -d "$PROJ/.forge/store" ] || { echo "× no store at $PROJ/.forge/store" >&2; exit 1; }
mkdir -p "$GOLDEN"

# Refuse to snapshot uncommitted instance state — the tag must contain it.
if [ -n "$(git -C "$ROOT" status --porcelain -- "$PROJECT/")" ]; then
	echo "× $PROJECT has uncommitted changes — commit the pristine state first, then snapshot." >&2
	git -C "$ROOT" status --short -- "$PROJECT/" | head -20 >&2
	exit 1
fi

echo "── snapshot: $PROJECT"

# 1. Tag the baseline at HEAD
git -C "$ROOT" tag -f "$TAG" >/dev/null
SHA="$(git -C "$ROOT" rev-parse "$TAG")"
echo "  ✓ git tag $TAG -> ${SHA:0:10}"

# 2. Manifest: census + version pins + tool sentinels
FORGECLI_VERSION="$(forge --version 2>/dev/null | sed -n 's/.*forgecli@\([0-9.]*\).*/\1/p' || true)"
python3 - "$PROJ" "$GOLDEN/MANIFEST.json" "$TAG" "$SHA" "${FORGECLI_VERSION:-unknown}" <<'PY'
import json, glob, sys, datetime, os

proj, out, tag, sha, forgecli = sys.argv[1:6]
store = os.path.join(proj, ".forge", "store")

def census(kind, idkey):
    items = {}
    for f in sorted(glob.glob(f"{store}/{kind}/*.json")):
        d = json.load(open(f))
        items[d[idkey]] = d["status"]
    return items

config = json.load(open(os.path.join(proj, ".forge", "config.json")))

manifest = {
    "createdAt": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
    "baselineTag": tag,
    "baselineSha": sha,
    "pluginVersion": config.get("version", "unknown"),
    "forgecliVersion": forgecli,
    "sentinels": {
        "commit-task.cjs": os.path.isfile(os.path.join(proj, ".forge", "tools", "commit-task.cjs")),
        "store-cli.cjs": os.path.isfile(os.path.join(proj, ".forge", "tools", "store-cli.cjs")),
    },
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
print(f"  ✓ versions: plugin {manifest['pluginVersion']} / forgecli {manifest['forgecliVersion']}")
PY

echo "── golden captured. Commit testbench/golden/$PROJECT/MANIFEST.json and push the tag:"
echo "   git push -f origin $TAG"
