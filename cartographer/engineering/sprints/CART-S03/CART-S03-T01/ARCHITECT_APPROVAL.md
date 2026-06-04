# Architect Approval — CART-S03-T01: `carto rm` Remove Node Command

## Verdict: Approved

## Rationale

The implementation of `carto rm <title>` is architecturally sound and fully aligned with the project's design principles:

1. **Pure-function separation preserved**: `removeNode()` lives in `src/store/graph.ts` as a pure, load→filter→save function — matching the established pattern of `addNode` and `link`. All side-effects (chalk output, process.exit) remain in `cli.ts`.

2. **Cascading edge delete is correct**: The filter `e.from === node.id || e.to === node.id` correctly removes both outgoing and incoming edges for the directed graph model. This prevents orphaned edge references, which would be a data-corruption concern.

3. **No data model changes**: The existing `Node`, `Edge`, and `Graph` types are unmodified. The removal operation simply deletes entries from the existing `nodes[]` and `edges[]` arrays — no schema migration, no format change to `graph.json`.

4. **No cross-cutting concerns**: The `rm` command is purely additive. No existing commands are modified, no exports are changed, no new dependencies introduced.

5. **Convention compliance**: ESM `.js` import extensions on all relative imports; chalk.green/chalk.red error paths match existing CLI patterns; Commander subcommand follows the established structure.

6. **Test coverage**: 28/28 tests pass (3 new + 25 existing), 0 TS errors, 0 lint violations. The mock strategy correctly simulates cross-call persistence. The CART-B01 regression guard remains intact.

7. **Deployment impact**: None. Single offline CLI, local JSON file, no server/network dependency introduced.

## Deployment Notes

- No migration required — graph.json format is unchanged.
- No new npm dependencies — `chalk`, `commander`, and `uuid` are existing.
- The `rm` command is a user-facing addition only; existing commands (`add`, `link`, `list`, `export`, `stats`) are unaffected.

## Follow-up Items

- Consider adding a `--force` flag to `carto rm` to skip confirmation prompts in a future iteration (not in current AC scope).
- Duplicate title prevention (noted in entity model as `?`) remains an open issue across all commands — not specific to `rm`.
- Fuzzy/ID-based node lookup (mentioned in tech debt) would improve UX but is out of scope for this task.