# Copy-Paste Prompts for Testbench Demo

Use these prompts to quickly experience Forge workflows.

## Sprint Creation (hello/)

```
I want to create a test sprint for hello to see Forge in action.

Sprint goal: "Add --goodbye flag"

Feature description:
"Add a --goodbye flag to hello.py that prints 'Goodbye, NAME!' instead of 'Hello, NAME!'. 
Should work with --shout and --count just like regular greeting."

Acceptance criteria:
1. hello Alice --goodbye → "Goodbye, Alice!"
2. hello Alice --goodbye --shout → "GOODBYE, ALICE!"
3. hello Alice --goodbye --count 3 → "Goodbye, Alice!" (3 times)
4. Test coverage for new flag

Please run /sprint-intake using this information.
```

After `/sprint-intake` completes, run:
```bash
/sprint-plan HELLO-S01
```

Then run first task:
```bash
/run-task HELLO-S01-T01
```

---

## Bug Report (hello/)

```
I found a bug in hello.py. When I run:
hello Alice --count 5 --shout

Expected behavior: "HELLO, ALICE!" printed 5 times (shouted and repeated)

Possible issues:
- Off-by-one error in count logic
- Shout flag not applied correctly
- Count and shout interaction broken

Please run /hello:fix-bug (or /fix-bug if no project command) to investigate 
and fix using Forge's bug workflow.
```

---

## Sprint Creation (cartographer/)

```
I want to create a test sprint for cartographer to see Forge adapt to TypeScript.

Sprint goal: "Add node search command"

Feature description:
"Add a 'search' command to carto CLI that finds nodes by name or content.
Usage: carto search <query>
Should support partial matches and highlight matching text."

Acceptance criteria:
1. carto search "test" → lists all nodes containing "test"
2. Partial match support (case-insensitive)
3. Highlights matching text in output
4. Test coverage with vitest

Please run /sprint-intake using this information.
```

---

## Bug Report (cartographer/)

```
Bug in cartographer: When adding a node with special characters in the name 
(e.g., "node/with/slashes"), the file creation fails or creates invalid paths.

Expected: Sanitize node names, replace invalid characters
Actual: (test to see failure mode)

Please run /cartographer:fix-bug (or /fix-bug) to investigate and fix.
```

---

## Sprint Creation (emberglow/)

```
I want to create a test sprint for emberglow to see Forge adapt to Go.

Sprint goal: "Add recipe validation"

Feature description:
"Add --validate flag to emberglow that parses .ember recipes and reports 
syntax errors without executing actions."

Acceptance criteria:
1. emberglow --validate recipe.ember → checks syntax
2. Reports line numbers for errors
3. Validates device references exist
4. Test coverage with go test

Please run /sprint-intake using this information.
```

---

## Bug Report (emberglow/)

```
Bug in emberglow: When parsing nested IF blocks in .ember recipes, 
the lexer gets confused and reports "unexpected token" errors even for valid syntax.

Expected: Nested IF blocks should parse correctly
Actual: Lexer error on nested conditionals

Please run /emberglow:fix-bug (or /fix-bug) to investigate and fix.
```

---

## Sprint Creation (spectral/)

```
I want to create a test sprint for spectral to see Forge on another Python project.

Sprint goal: "Add shuffle mode"

Feature description:
"Add --shuffle flag to spectral that randomizes the order of soundscape layers.
Useful for discovering new mood combinations."

Acceptance criteria:
1. spectral calm --shuffle → random layer order
2. Reproducible with --seed flag
3. JSON output includes shuffle state
4. Test coverage with pytest

Please run /sprint-intake using this information.
```

---

## Bug Report (spectral/)

```
Bug in spectral: When loading audio files from custom directory (--audio-dir), 
the path joining fails on Windows (uses forward slashes instead of backslashes).

Expected: Cross-platform path handling
Actual: FileNotFoundError on Windows

Please run /spectral:fix-bug (or /fix-bug) to investigate and fix.
```

---

## General Queries (Any Project)

After creating sprints/bugs, try:

```bash
/forge:ask What sprints exist?
/forge:ask What's the status of [SPRINT-ID]?
/forge:ask What bugs have been reported?
/forge:ask Show me the task breakdown for [SPRINT-ID]
/forge:ask What's the current project status?
```

---

## Notes

- Replace `[SPRINT-ID]` with actual sprint ID (e.g., HELLO-S01, CARTO-S01)
- Project-specific commands like `/hello:fix-bug` only exist after `/forge:init`
- If project commands missing, use generic `/fix-bug`, `/sprint-intake`, etc.
- Adjust prompts for your exploration — these are starting points
