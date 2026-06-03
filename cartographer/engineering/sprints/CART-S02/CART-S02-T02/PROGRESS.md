# PROGRESS — CART-S02-T02: Add read-only carto stats CLI command

## Summary
Implemented the `carto stats` CLI command per the approved plan. The command is a thin I/O shell in `src/cli.ts` that calls `load()` and `graphStats()`, then prints pluralised node/edge counts using `chalk.green`. No changes to `graph.ts`, no data model changes, no persistence changes.

## Changes Made
1. **`src/cli.ts`** — Added `graphStats` to the import from `./store/graph.js`; registered `.command("stats").description("Show graph statistics").action(...)` with pluralisation logic (`nodes === 1 ? "node" : "nodes"`, `edges === 1 ? "edge" : "edges"`), output via `console.log(chalk.green(...))`.
2. **`engineering/architecture/routing.md`** — Added `carto stats` to the Command Inventory table, added a dedicated section describing its behaviour (read-only, no flags/args, pluralisation), and added error-handling note.

## Test Evidence

### Build (TypeScript compilation)
```
> tsc
(clean — no errors)
```

### Unit tests
```
> vitest run

 ✓ src/store/graph.test.ts  (1 test) 9ms
 ✓ src/__tests__/graph.test.ts  (20 tests) 19ms

 Test Files  2 passed (2)
      Tests  21 passed (21)
```

### Lint
```
> eslint src
(clean — no errors)
```

## Files Changed
| File | Change |
|------|--------|
| `src/cli.ts` | Added `graphStats` import; added `stats` command registration with action handler |
| `engineering/architecture/routing.md` | Documented `stats` command in inventory, arguments section, and error handling notes |

## Acceptance Criteria Verification
- [x] A `stats` command is registered in `src/cli.ts` via `.command("stats").description(...).action(...)`
- [x] The action handler uses `graphStats(graph)` from `./store/graph.js`
- [x] Pluralisation is correct: `nodes === 1 ? "node" : "nodes"`, `edges === 1 ? "edge" : "edges"`
- [x] The command is read-only: no `save()` call, no flags or arguments
- [x] Success output uses `chalk.green`
- [x] `npm run build` compiles cleanly; `npm test` passes; `npm run lint` reports no new violations
- [x] ESM `.js` import extensions respected
- [x] All I/O stays in `cli.ts`; `graph.ts` is not modified