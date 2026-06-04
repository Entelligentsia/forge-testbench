# PROGRESS — CART-S03-T02: Implement `carto ls` command to list all nodes

## Summary

**Objective:** Add a `carto ls` command that prints every node title in `chalk.cyan`, one per line, with a yellow `No nodes yet.` fallback for empty graphs.

**Status:** Implemented. All acceptance criteria met.

## Files Changed

| File | Change |
|------|--------|
| `src/store/graph.ts` | Added `listNodeTitles(): string[]` pure function |
| `src/cli.ts` | Added `ls` sub-command with chalk.cyan / chalk.yellow output |
| `src/store/graph.test.ts` | Added `describe("listNodeTitles")` block with 2 tests |

## Implementation Details

### `src/store/graph.ts` — New Function

```typescript
export function listNodeTitles(): string[] {
  const graph = load();
  return graph.nodes.map((n) => n.title);
}
```

- Pure function — reads via `load()`, returns `string[]` of titles
- No mutation, no side-effects
- ESM conventions respected — relative import uses explicit `.js` extension

### `src/cli.ts` — New Command

```typescript
program
  .command("ls")
  .description("List all node titles")
  .action(() => {
    const titles = listNodeTitles();
    if (!titles.length) {
      console.log(chalk.yellow("No nodes yet."));
      return;
    }
    for (const title of titles) {
      console.log(chalk.cyan(title));
    }
  });
```

- Imports `listNodeTitles` from `graph.js`
- Prints `chalk.cyan(title)` per node
- Prints `chalk.yellow("No nodes yet.")` when graph is empty
- Existing `list` command remains unchanged

### `src/store/graph.test.ts` — New Tests

```typescript
describe("listNodeTitles", () => {
  it("returns an empty array when the graph has no nodes", ...)
  it("returns all node titles in order", ...)
});
```

- Tests `listNodeTitles()` with both populated and empty graph states
- Uses existing `mockGraph` pattern from `CART-B01` tests

## Test Evidence

```
 RUN  v1.6.1 /home/boni/src/forge-testbench/cartographer

 ✓ src/store/graph.test.ts  (6 tests) 28ms
 ✓ src/__tests__/graph.test.ts  (24 tests) 11ms

 Test Files  2 passed (2)
      Tests  30 passed (30)
   Start at  09:12:10
   Duration  470ms
```

### Build: `npm run build`
```
> tsc
```
No TypeScript errors.

### Lint: `npm run lint`
```
> eslint src
```
No violations.

## Acceptance Criteria

- [x] `carto ls` prints all node titles, one per line, in `chalk.cyan`
- [x] `carto ls` on an empty graph prints `No nodes yet.` in `chalk.yellow`
- [x] `npm run build` compiles with no TypeScript errors
- [x] `npm test` passes — new behaviour covered by tests in `src/store/graph.test.ts`
- [x] `npm run lint` reports no violations
- [x] ESM conventions respected — relative imports use explicit `.js` extensions
- [x] `graph.ts` changes remain pure functions (no singleton state, no classes); all I/O side-effects stay in `cli.ts`
- [x] Existing `list` command remains unchanged