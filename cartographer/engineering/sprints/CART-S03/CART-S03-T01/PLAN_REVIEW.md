# Plan Review — CART-S03-T01 (standalone review)

**Reviewer:** cartographer Supervisor (Oracle)
**Artifact:** PLAN.md

## Verdict: ✅ Approved

The plan is well-structured, follows established project patterns, and addresses all eight acceptance criteria. No blocking issues found.

---

## Correctness

- **`removeNode()` signature** `(): { node: Node; edgeCount: number } | null` matches the task requirements exactly. Returns `null` for not-found (caller handles error), returns deleted node + edge count for success message formatting.
- **Cascading edge delete** — filters `from === node.id || to === node.id` is correct for directed edges. Removes all edges where the deleted node participates as either endpoint.
- **Case-sensitive title lookup** — consistent with existing `link()` function's `find()` behavior and acceptance criterion.
- **`load() → filter → save()` pattern** — matches `addNode()` and `link()` exactly. ✓

## Security

- No concerns. Offline-only CLI tool, no injection vectors. Node titles are used as-is (consistent with existing `add`/`link` commands).

## Architecture

- Pure-function pattern preserved — `removeNode` is a pure function in `graph.ts`, I/O (chalk, console, process.exit) stays in `cli.ts`. ✓
- No data model changes needed — existing `Graph`, `Node`, `Edge` types are sufficient. ✓
- Follows the same Commander wiring pattern as `add` and `link` commands. ✓

## Conventions

- ESM `.js` import extensions explicitly called out. ✓
- chalk.green for success, chalk.red for error, console.error for error path, process.exit(1). ✓
- No new files — only modifies existing `graph.ts`, `cli.ts`, `graph.test.ts`. ✓

## Business Rules

- **Cascading delete** correctly specified — when a node is removed, all edges referencing it (both `from` and `to`) are also removed. This matches the entity model in the task prompt.
- **Idempotent not-found path** — returning `null` is clean; the CLI handles the user-facing error.

## Testing

Three test cases specified:
1. **Not found** — `removeNode("No Such Node")` returns `null` ✓
2. **Orphan node** — remove node with no edges, verify zero nodes remain ✓
3. **Cascade** — remove node with connected edges, verify both node and edge gone ✓

Existing CART-B01 regression guard is explicitly called out as untouched. ✓

## Advisory Notes

1. **Pluralization formatting** — Acceptance criterion 2 says "if 0, print `and 0 edges`" (always "edges"), but the plan template uses `${edgeCount} edge(s)` which would produce `0 edge(s)`. This is a minor formatting difference. Either approach is reasonable; the engineer should pick one and be consistent. Not blocking.

2. **Test setup detail** — The plan doesn't specify whether to call `addNode`/`link` to populate test state or mock `load()` directly. Given the existing test file mocks `fs` with `importOriginal`, calling `addNode`/`link` end-to-end on the mocked fs is the cleaner approach (tests the real code path). The engineer should set up state by calling the real functions on mocked storage. Not blocking.