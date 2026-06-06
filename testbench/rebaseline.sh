#!/usr/bin/env bash
# rebaseline.sh <project> — release-parity hook. Re-materializes the project's
# Forge instance from the LOCALLY INSTALLED forgecli's bundled payload, then
# re-pristines and gates. Run as part of every forge plugin / forgecli release
# (forge-releaser checklist), then snapshot + commit + push.
#
# Deterministic equivalent of /forge:rebuild --force + tools/schemas vendoring:
#   1. Resolve the installed forgecli payload (@entelligentsia/forgecli)
#   2. Stamp .forge/config.json: paths.forgeRoot -> payload, version -> plugin
#   3. substitute-placeholders.cjs against the bundled .base-pack
#      (regenerates .forge/workflows|personas|skills|templates + .claude/)
#   4. Vendor payload tools/ (+lib) into .forge/tools/, .schemas into .forge/schemas/
#   5. make-pristine.sh (rewind store, prune artifacts, collate, validate)
#
# Afterwards (manual, reviewed): commit → snapshot.sh → commit MANIFEST →
# push + push -f the baseline tag. readiness.sh gates the result in CI.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT="${1:?usage: rebaseline.sh <project>}"
PROJ="$ROOT/$PROJECT"
[ -f "$PROJ/.forge/config.json" ] || { echo "× $PROJECT has no .forge/config.json — onboard it first (init + curate fixtures)" >&2; exit 1; }

# 1. Locate the GLOBALLY installed forgecli payload ─────────────────────────
# npm root -g FIRST: require.resolve from an arbitrary cwd can walk up into a
# stale ~/node_modules and silently rebaseline against an ancient payload.
PKG_JSON="$(npm root -g 2>/dev/null)/@entelligentsia/forgecli/package.json"
[ -f "$PKG_JSON" ] || PKG_JSON="$(node -e "console.log(require.resolve('@entelligentsia/forgecli/package.json'))" 2>/dev/null || true)"
[ -n "$PKG_JSON" ] && [ -f "$PKG_JSON" ] || { echo "× @entelligentsia/forgecli not installed globally — npm install -g it first" >&2; exit 1; }
PKG_ROOT="$(dirname "$PKG_JSON")"
PAYLOAD="$PKG_ROOT/dist/forge-payload"
[ -d "$PAYLOAD" ] || { echo "× bundled payload not found at $PAYLOAD — npm install -g @entelligentsia/forgecli" >&2; exit 1; }
FORGECLI_VERSION="$(node -p "require('$PKG_JSON').version")"
PLUGIN_VERSION="$(node -p "require('$PKG_JSON').forge?.bundledVersion ?? 'unknown'")"
echo "── rebaseline: $PROJECT ← forgecli $FORGECLI_VERSION (plugin $PLUGIN_VERSION)"

# 2. Stamp config ───────────────────────────────────────────────────────────
python3 - "$PROJ/.forge/config.json" "$PAYLOAD" "$PLUGIN_VERSION" <<'PY'
import json, sys
p, payload, plugin = sys.argv[1:4]
c = json.load(open(p))
c.setdefault("paths", {})["forgeRoot"] = payload
c["version"] = plugin
json.dump(c, open(p, "w"), indent=2); open(p, "a").write("\n")
print(f"  ✓ config: forgeRoot -> payload, version -> {plugin}")
PY

# 3. Re-materialize from base-pack ──────────────────────────────────────────
(cd "$PROJ" && node "$PAYLOAD/tools/substitute-placeholders.cjs" \
	--forge-root "$PAYLOAD" --base-pack "$PAYLOAD/.base-pack" \
	--config .forge/config.json --context .forge/init-context.json --out . >/dev/null)
echo "  ✓ workflows / personas / skills / templates / .claude re-materialized"

# 4. Vendor tools + schemas ─────────────────────────────────────────────────
mkdir -p "$PROJ/.forge/tools/lib" "$PROJ/.forge/schemas"
cp "$PAYLOAD"/tools/*.cjs "$PROJ/.forge/tools/" 2>/dev/null || true
cp "$PAYLOAD"/tools/*.js "$PROJ/.forge/tools/" 2>/dev/null || true
cp "$PAYLOAD"/tools/package.json "$PROJ/.forge/tools/" 2>/dev/null || true
cp "$PAYLOAD"/tools/lib/*.cjs "$PAYLOAD"/tools/lib/*.js "$PROJ/.forge/tools/lib/" 2>/dev/null || true
cp "$PAYLOAD"/.schemas/*.json "$PROJ/.forge/schemas/" 2>/dev/null || true
[ -d "$PAYLOAD/.schemas/_defs" ] && cp -r "$PAYLOAD/.schemas/_defs" "$PROJ/.forge/schemas/"
echo "  ✓ tools + schemas vendored from payload"

# 5. Re-pristine + gate ─────────────────────────────────────────────────────
bash "$ROOT/testbench/make-pristine.sh" "$PROJECT"

echo "── rebaselined. Next:"
echo "   git add -A $PROJECT/ && git commit -m 'rebaseline: $PROJECT @ plugin $PLUGIN_VERSION / forgecli $FORGECLI_VERSION'"
echo "   testbench/snapshot.sh $PROJECT   # retags baseline + version-stamped MANIFEST"
echo "   git add testbench/golden/$PROJECT/ && git commit -m 'golden: $PROJECT manifest @ $PLUGIN_VERSION' "
echo "   git push origin main && git push -f origin testbench/$PROJECT-baseline"
echo "   testbench/readiness.sh $PROJECT  # final clone-ready gate"
