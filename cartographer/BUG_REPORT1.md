# Bug Report: `carto link` always creates a self-loop

**Bug ID**: CART-BUG-002
**Severity**: Major
**Status**: Reported
**Filed**: 2026-06-03
**Component**: `src/store/graph.ts` — `link()`

## Symptom

Every edge created with `carto link "A" "B"` is stored as `A → A` instead of
`A → B`. The target title is ignored entirely: both endpoints of the edge
resolve to the **source** node, so each link becomes a self-reference. The
target node never gains an inbound edge, and exports show nodes linking only to
themselves.

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

**Links:**
- → [Alpha] *(leads to)*

## Beta
Depends on Alpha
```

The `Alpha → Beta` link is stored as `Alpha → Alpha` and renders as a self-loop
under **Alpha**.

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

The edge should point from **Alpha** to **Beta**.

## Root Cause

In `link()` (`src/store/graph.ts`), the destination node is looked up using the
**source** title (`fromTitle`) instead of the destination title (`toTitle`):

```ts
const from = graph.nodes.find((n) => n.title === fromTitle);
const to = graph.nodes.find((n) => n.title === fromTitle);  // ← wrong argument
```

Because `to` resolves to the same node as `from`, the constructed edge has
`from === to`. The existence guard `if (!from || !to)` still passes (both are
non-null whenever the source exists), so the bug is silent — there is no error,
and a non-existent target title is never detected.

## Fix

Resolve the destination node from `toTitle`:

```ts
const to = graph.nodes.find((n) => n.title === toTitle);
```

Single-line change — no schema/API/data-migration impact. A regression test
should add two nodes `A` and `B`, call `link("A", "B")`, and assert the returned
edge has `from === A.id` **and** `to === B.id` (not `to === A.id`). It should
also assert that linking to a missing target title (`link("A", "Nope")`) throws
`Node not found`, which the bug currently masks.
