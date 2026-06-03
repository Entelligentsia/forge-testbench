# PLAN REVIEW — CART-S02-T03 (iteration 2 of 3)

**Reviewer:** 🌿 cartographer Supervisor
**Date:** 2026-06-03

---

## 1. Correctness

The plan accurately addresses all seven acceptance criteria from the task prompt:

| AC | Plan Coverage | Verdict |
|---|---|---|
| AC#1: Pure named export in `graph.ts`, computes bidirectional degree, returns `null` sentinel | `mostConnectedNode(graph: Graph): { node: Node | null; degree: number }` — pure, no I/O | ✅ |
| AC#2: Node id → title resolution via `graph.nodes` | Function returns the full `Node` object; `cli.ts` accesses `.title` | ✅ |
| AC#3: Deterministic tie-break (first-encountered), covered by test | Plan specifies "first-encountered" — see ambiguity note below | ⚠️ Minor |
| AC#4: Empty-graph / no-edges sentinel; `carto stats` handles gracefully | `{ node: null, degree: 0 }` sentinel + `chalk.yellow("(no edges)")` in CLI | ✅ |
| AC#5: `stats` action extended, no new flags/options | Exactly one output line added after existing counts | ✅ |
| AC#6: vitest unit tests for degree, tie-break, sentinel | 4 tests enumerated in plan | ✅ |
| AC#7: Build/test/lint clean; pure helper in `graph.ts`; ESM `.js` imports | Plan respects all boundaries | ✅ |

**Ambiguity — tie-breaking** (carried from iteration 1, unresolved in plan):
"First-encountered" has two interpretations:
- (a) First node id to reach max degree during edge-array iteration.
- (b) First node in `graph.nodes` array order among those tied for max degree.

Interpretation (b) is correct — it is deterministic regardless of edge insertion order and easier to test reproducibly. The implementation should iterate `graph.nodes` to find the first node with max degree, not rely on edge-iteration ordering. **Advisory, not blocking.**

## 2. Security

Applied the security-guidance skill checklist:

- ✅ No new `eval()`, `new Function()`, or `vm.runInContext`
- ✅ No secret material in source code
- ✅ No new user input surface — `mostConnectedNode` takes a `Graph` parameter; `stats` takes no arguments
- ✅ No new network or database dependency — pure computation, no new imports
- ✅ No file-path operations from user input
- ✅ Error messages (none produced) do not leak paths

**No security concerns.** This is a pure computation function with no I/O side effects.

## 3. Architecture Alignment

| Convention | Aligned? | Notes |
|---|---|---|
| Pure functions in `graph.ts` (no singletons, no classes) | ✅ Yes | `mostConnectedNode` is a pure function, takes `Graph`, returns plain object |
| I/O side-effects confined to `cli.ts` | ✅ Yes | Only `console.log` + `chalk` in CLI layer |
| ESM imports use explicit `.js` extensions | ✅ Yes | Plan must use `import { mostConnectedNode } from "./store/graph.js"` |
| `const` + arrow functions; no `class` | ✅ Yes | Standard `export function` pattern consistent with `graphStats` |
| Node lookup by `title` (case-sensitive) preserved | ✅ N/A | `mostConnectedNode` operates on node IDs via edges, not title lookup |
| Errors → `console.error` + `chalk.red`; success → `chalk.green`/`chalk.cyan` | ⚠️ Minor | `(no edges)` sentinel uses `chalk.yellow` — advisory to use `chalk.gray` instead (informational, not a warning) |
| No database or network dependency added | ✅ Yes | Pure computation, zero new imports |

**No `types.ts` changes needed.** The return type `{ node: Node | null; degree: number }` is a plain object — no new interface required, consistent with how `graphStats` returns `{ nodes: number; edges: number }`.

**No persistence changes.** The function reads from the in-memory `Graph` parameter only.

## 4. Conventions

- **ESM `.js` import extensions**: The plan does not explicitly show the import statement. Must use `import { mostConnectedNode } from "./store/graph.js"` following existing convention in `cli.ts`.
- **Named export style**: `export function mostConnectedNode(...)` is consistent with existing `graph.ts` exports. ✅
- **Chalk colors**: `chalk.green` for counts (existing), `chalk.cyan` for most-connected (new). Appropriate. The `(no edges)` color is advisory (see §3).
- **No `class` or `require()`**: Not introduced. ✅
- **`const` / arrow functions**: Plan destructuring `const { node, degree } = mostConnectedNode(graph)` is consistent. ✅

## 5. Business Rules

- **Case-sensitive title lookup**: Not affected. `mostConnectedNode` uses node IDs from edges and resolves via `graph.nodes`. ✅
- **Edge weight is `1`**: The degree counts edge incidence, not weight. Correct — counting edges, not summing weights. ✅
- **`lowdb`/`enquirer`**: Not introduced or used. ✅
- **`ink`/`react`**: Not introduced or used. ✅
- **Dangling edge references**: The plan does not explicitly handle edges whose `from`/`to` reference node IDs not present in `graph.nodes`. If such a dangling edge exists (e.g., from manual JSON editing), the degree counter would increment a count for a missing node, and node resolution would fail. **Advisory**: The implementation should gracefully handle this — either skip dangling edges for degree counting, or fall through to the next candidate if the top-degree node ID cannot be resolved. Not blocking since the primary data path (`addNode` + `link`) never produces dangling references, but adding a test for this edge case would be prudent.

## 6. Testing

The plan specifies 4 test cases:

| Test | Coverage | Assessment |
|---|---|---|
| No-edges sentinel | Nodes present, edges empty | ✅ Covers AC#4 |
| Bidirectional degree | Both incoming and outgoing edges counted | ✅ Covers AC#3 |
| First-encountered tie-break | Two nodes with equal degree | ✅ Covers AC#3 (semantics need clarification — see §1) |
| Empty graph | No nodes, no edges | ✅ Covers AC#4 |

**Assessment**: Adequate coverage for the core behaviour. Minor additions recommended (advisory, not blocking):

1. **Orphan nodes test**: `{ nodes: [n1], edges: [] }` → `{ node: null, degree: 0 }`. Subtly different from "empty graph" because nodes exist but have zero degree. The "no-edges sentinel" test may already cover this if it includes nodes; ensure at least one test has nodes with no edges.
2. **Dangling edge reference test**: An edge referencing a non-existent node ID. Tests that the function doesn't crash or return inconsistent results.

**Test conventions verified against existing codebase:**
- `beforeEach(() => vi.clearAllMocks())` in every mock-using `describe`. ✅
- `vitest` framework. ✅
- ESM imports from `../store/graph.js`. ✅

---

## Overall Verdict: **Approved**

The plan is well-structured, correctly scoped, and fully aligned with all acceptance criteria and architecture guardrails. The function is a pure computation helper (no I/O, no new attack surfaces). Security review is clean. The following advisory notes are non-blocking but recommended for implementation:

### Advisory Notes

1. **Tie-breaking**: Define as "first node in `graph.nodes` array order" among those with the highest degree. This is deterministic regardless of edge insertion order and straightforward to test.
2. **"(no edges)" color**: Use `chalk.gray("(no edges)")` to visually de-emphasize the empty state (informational, not a warning condition).
3. **Dangling edge handling**: If `edge.from` or `edge.to` references a node ID not in `graph.nodes`, skip it for node resolution but count it for degree. If the highest-degree node ID cannot be resolved, fall through to the next candidate. Add a test case.
4. **ESM import convention**: Ensure the import in `cli.ts` uses `.js` extension: `import { mostConnectedNode } from "./store/graph.js"`.
5. **Orphan-node test**: Add a test where `{ nodes: [n1], edges: [] }` returns `{ node: null, degree: 0 }` to distinguish from the empty-graph case.