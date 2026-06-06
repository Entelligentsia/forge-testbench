# Bug Report: `carto export` renders links under the wrong node

**Bug ID**: CART-BUG-001
**Severity**: Major
**Status**: Reported
**Filed**: 2026-06-02
**Component**: `src/store/graph.ts` — `exportMarkdown()`

## Symptom

When exporting the knowledge map to markdown, outgoing links are listed under
the **target** node instead of the **source** node, and each rendered arrow
points the node back at itself. The link's direction is effectively inverted in
the output.

## Steps to Reproduce

```bash
carto add "Alpha" --body "The first idea" --tags root
carto add "Beta" --body "Depends on Alpha"
carto link "Alpha" "Beta" --label "leads to"
carto export
```

**Actual output:**
```markdown
# Knowledge Map

## Alpha
*tags: root*

The first idea

## Beta
Depends on Alpha

**Links:**
- → [Beta] *(leads to)*
```

The `Alpha → Beta` edge appears under **Beta** and points to **Beta** itself.

**Expected output:**
```markdown
# Knowledge Map

## Alpha
*tags: root*

The first idea

**Links:**
- → [Beta] *(leads to)*

## Beta
Depends on Alpha
```

The edge should appear under **Alpha** (its source) and point to **Beta** (its
target).

## Root Cause

In `exportMarkdown()` (`src/store/graph.ts`), the per-node edge filter collects
edges by their **destination** id while the variable name and surrounding logic
assume **outgoing** (source) edges:

```ts
const outgoing = graph.edges.filter((e) => e.to === node.id);  // ← wrong field
```

Because the filter matches `e.to` instead of `e.from`, the block is attached to
the target node, and `nodes.find((n) => n.id === edge.to)` then resolves the
arrow target to that same node — so every link renders as a self-reference under
the wrong heading.

## Fix

Filter on the edge's source (`e.from`) so `outgoing` genuinely holds the node's
outgoing edges:

```ts
const outgoing = graph.edges.filter((e) => e.from === node.id);
```

Single-line change — no schema/API/data-migration impact. A regression test
should add two nodes, link `A → B`, export, and assert the `**Links:**` block
appears in `A`'s section (not `B`'s) with `→ [B]`.
