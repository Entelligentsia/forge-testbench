# PROGRESS — CART-S02-T03: Nice-to-have: most-connected node title in carto stats

## Summary of Changes

### Implementation
- Added `mostConnectedNode(graph: Graph): { node: Node | null; degree: number }` to `src/store/graph.ts`
  - Returns `{ node: null, degree: 0 }` sentinel when no edges exist
  - Counts bidirectional degree (each edge contributes +1 to both nodes, regardless of direction)
  - Ties are broken by first-encountered node in `graph.nodes` array order

- Extended `src/cli.ts`:
  - Imported `mostConnectedNode` from `./store/graph.js`
  - Updated `stats` command to output most connected node title and degree
  - Falls back to "(no edges)" when degrees are zero

### Tests Added (`src/__tests__/graph.test.ts`)
Added `describe("mostConnectedNode()")` with 4 test cases:
1. **Sentinel behavior** — returns `{ node: null, degree: 0 }` when no edges exist
2. **Bidirectional degree** — edge A→B gives both A and B degree 1
3. **Tie-break** — first-encountered node wins when degrees are equal
4. **Empty graph** — returns null/zero for empty graph input

## Test Evidence

```
$ npm test

> cartographer@0.1.0 test
> vitest run

 RUN  v1.6.1 /home/boni/src/forge-testbench/cartographer

 ✓ src/store/graph.test.ts  (1 test) 20ms
 ✓ src/__tests__/graph.test.ts  (24 tests) 18ms

 Test Files  2 passed (2)
      Tests  25 passed (25)
   Start at  23:14:40
   Duration  565ms

$ npm run build

> cartographer@0.1.0 build
> tsc

(quiet - no errors)

$ npm run lint

> cartographer@0.1.0 lint
> eslint src

(quiet - no errors)

$ npx tsx src/cli.ts stats
23 nodes, 2 edges
Most connected: Alpha (degree 2)

$ rm -f ~/.cartographer/graph.json && npx tsx src/cli.ts stats
0 nodes, 0 edges
(no edges)
```

## Files Changed
| File | Change |
|------|--------|
| `src/store/graph.ts` | Added `mostConnectedNode()` function |
| `src/cli.ts` | Added import and extended `stats` command |
| `src/__tests__/graph.test.ts` | Added 4 tests for `mostConnectedNode()` |
