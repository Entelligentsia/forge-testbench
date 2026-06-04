# PLAN REVIEW — CART-S03-T02 (standalone review)

**Verdict: Approved**

---

## Review Categories

### 1. Correctness

The plan accurately addresses the task requirements:
- New `listNodeTitles(): string[]` pure function in `src/store/graph.ts` — reads via `load()`, returns `node.title` for each node. No mutation. Correct.
- New `ls` sub-command in `src/cli.ts` — imports and calls `listNodeTitles()`, iterates printing `chalk.cyan(title)` per line. Falls back to `chalk.yellow("No nodes yet.")` on empty. Correct.
- Existing `list` command remains untouched. Verified: the `list` command at line 63 of `cli.ts` is a separate Commander sub-command. The new `ls` command adds a parallel `.command("ls")` — no conflict.

### 2. Security

No concerns. The `ls` command is read-only. No user-supplied input is evaluated, interpolated, or persisted. `load()` reads from the known `DATA_PATH` (`~/.cartographer/graph.json`).

### 3. Architecture Alignment

- **Separation of concerns**: Data access in `graph.ts`, I/O rendering in `cli.ts` — consistent with stack checklist item: "Only `cli.ts` performs I/O side effects".
- **Pure function pattern**: `listNodeTitles()` calls `load()` internally, same pattern as `exportMarkdown()`, `graphStats()`, and `mostConnectedNode()`. All read-only functions in `graph.ts` follow this pattern. No singleton state, no classes. Acceptable.
- **ESM imports**: Existing `cli.ts` imports use `.js` extensions (e.g., `from "./store/graph.js"`). Adding `listNodeTitles` to that existing import line is the correct approach.
- **Commander pattern**: Adding `.command("ls")` follows the established pattern for all other sub-commands (`add`, `rm`, `link`, `list`, `export`, `stats`).

### 4. Conventions

- **Chalk usage**: Success/info output uses `chalk.cyan` and `chalk.yellow` — consistent with existing conventions (`chalk.cyan` for link confirmation, `chalk.green` for success, `chalk.red` for errors).
- **Empty-state messaging**: "No nodes yet." matches the existing `list` command's prefix text. The `ls` command omits the "Try: carto add..." hint, which is intentional per the acceptance criteria (which only specify the fallback text, not the hint).
- **Export style**: New function should be added as a named `export function listNodeTitles()` consistent with all other exports in `graph.ts`.

### 5. Business Rules

No business-domain rules are at risk. The `ls` command is a display-only operation. Node lookup remains case-sensitive by title (unchanged). No data model changes.

### 6. Testing Strategy

- The plan proposes a `describe("listNodeTitles")` block in `src/store/graph.test.ts`.
- The existing test file uses `vi.mock("fs")` with `readFileSync: () => JSON.stringify(mockGraph)` and a module-scoped `mockGraph` variable. New tests can manipulate `mockGraph` in `beforeEach` to set populated/empty states, then call `listNodeTitles()` and assert on the returned titles. This is **sound and consistent** with the existing test infrastructure.
- One consideration: the existing tests use dynamic `await import("./graph.js")` inside each test case (to pick up mock changes). The new `listNodeTitles()` tests should follow the same pattern rather than top-level static imports, or carefully manage module caching with `vi.resetModules()`.
- No integration/smoke test is proposed — only unit tests. The acceptance criteria includes a manual smoke test step, which is appropriate for a CLI command.

### 7. Edge Cases Verified

| Case | Plan Coverage |
|------|--------------|
| Empty graph (no nodes) | ✅ Returns `[]`, CLI prints "No nodes yet." |
| Populated graph | ✅ Returns title array, CLI prints each in cyan |
| Graph file doesn't exist | ✅ `load()` already handles: returns `{ nodes: [], edges: [] }` — falls through to empty case |
| Node with empty title | Not explicitly addressed, but `title` is a required field on `Node` — would print an empty cyan line, which is the correct pass-through behavior |

### Advisory Notes

1. **Dynamic import in tests**: The existing test pattern uses `await import("./graph.js")` inside each `it()` block. The new test should follow this pattern to ensure the mock is active when the module loads. Avoid static top-level imports of `listNodeTitles` in the test file.

2. **Minor naming**: `listNodeTitles()` is clear and descriptive. No collision with existing exports.

3. **No pagination**: Not required by the spec, and the architecture guardrails note this is acceptable for small graphs. Flagged for future consideration if node counts grow.

4. **`lowdb` / `enquirer` unused deps**: Not in scope for this task, but noted as technical debt per the stack checklist.

---

## Verdict: **Approved**

The plan is well-scoped, architecturally consistent with the existing codebase, and addresses all acceptance criteria. No revision items required.