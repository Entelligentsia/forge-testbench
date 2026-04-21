<div align="center">

# forge-testbench

**Go from zero to structured SDLC in 15 minutes.**<br>
Four real CLI projects. One Forge init. Watch Claude Code become a full engineering team.

<br>

| | Project | Stack | What It Does |
|:---:|---------|-------|-------------|
| 🟢 | **[hello/](hello/)** | Python + Click | 21-line CLI greeter — **start here** |
| 🔵 | [cartographer/](cartographer/) | TypeScript + Commander | Terminal knowledge-graph tool |
| 🟠 | [emberglow/](emberglow/) | Go + YAML DSL | Smart home automation interpreter |
| 🟣 | [spectral/](spectral/) | Python + NumPy | Mood-based ambient soundscape generator |

</div>

---

## Why This Exists

Claude Code is powerful. But without structure, it re-learns your project every session — no memory of your architecture decisions, no awareness of past bugs, no consistent review process.

**Forge** generates a project-specific engineering knowledge base, personas, and workflows that improve with every sprint. This testbench lets you experience that from scratch.

```mermaid
graph LR
    A["① Setup"] --> B["② Initialize"]
    B --> C["③ First Sprint"]
    C --> D["④ Watch It Learn"]
    D --> E["⑤ Go Deeper"]
    style A fill:#2d333b,stroke:#58a6ff,color:#e6edf3
    style B fill:#2d333b,stroke:#58a6ff,color:#e6edf3
    style C fill:#2d333b,stroke:#58a6ff,color:#e6edf3
    style D fill:#2d333b,stroke:#58a6ff,color:#e6edf3
    style E fill:#2d333b,stroke:#58a6ff,color:#e6edf3
```

---

<br>

## ① Setup
<sup>~2 minutes</sup>

**Install Forge** — run these three commands inside Claude Code:

```
/plugin marketplace add Entelligentsia/skillforge
/plugin install forge@skillforge
/reload-plugins
```

**Clone and navigate** to the starter project:

```bash
git clone https://github.com/Entelligentsia/forge-testbench.git
cd forge-testbench/hello
```

> [!IMPORTANT]
> Open Claude Code **from inside the project directory** (`hello/`). Forge operates on the current working directory.

<details>
<summary><b>Verify installation</b></summary>

```
/plugin list
```

You should see `forge@skillforge (enabled)` in the output.

</details>

<br>

---

<br>

## ② Initialize Forge
<sup>~3 minutes</sup>

```
/forge:init --fast
```

Forge scans your codebase and builds a tailored engineering layer. Fast mode takes ~2–4 minutes (lazy-builds non-critical phases on first use instead of upfront).

You'll be prompted for:
- **KB folder name** — default `engineering/`, or pick your own
- **Permissions** — to create `.claude/commands/`

When it finishes, three things exist that didn't before:

```
.forge/              → config, workflow stubs, schemas, store
engineering/         → knowledge base skeleton (architecture, sprints, bugs)
.claude/commands/    → 14 project-specific slash commands
```

> [!TIP]
> Type `/hello:` in Claude Code — you should see commands like `sprint-intake`, `fix-bug`, `plan`, `implement`, and more autocomplete.

<details>
<summary><b>What happened during those 3 minutes?</b></summary>

Forge ran 12 phases (fast mode executes 7, defers 5):

| Phase | What It Does | Fast Mode |
|:-----:|-------------|:---------:|
| 1 | **Discover** — scans stack, processes, testing, routing | ✅ Runs |
| 2 | **Marketplace Skills** — recommends skills for your stack | ✅ Runs |
| 3 | **Knowledge Base** — creates MASTER_INDEX + directory structure | ✅ Runs |
| 4 | **Personas** — generates role definitions | ⏳ Deferred |
| 5 | **Skills** — generates skill configurations | ⏳ Deferred |
| 6 | **Templates** — generates output templates | ⏳ Deferred |
| 7 | **Workflows** — creates 18 self-materializing workflow stubs | ✅ Runs |
| 8 | **Orchestration** — multi-workflow coordination | ⏳ Deferred |
| 9 | **Commands** — creates project-specific slash commands | ✅ Runs |
| 10 | **Tools** — copies validation schemas | ✅ Runs |
| 11 | **Smoke Test** — validates wiring | ✅ Runs |
| 12 | **Tomoshibi** — links KB to CLAUDE.md | ✅ Runs |

Deferred phases materialize automatically on first workflow use (~1–2 min one-time cost).

</details>

<details>
<summary><b>What do the generated artifacts look like?</b></summary>

**`engineering/MASTER_INDEX.md`** — KB entry point (stub in fast mode):
```markdown
# Master Index
<!-- forge-fast-stub -->

## Domain Entities
<!-- Will populate on materialization -->

## Architecture
- [Stack](architecture/stack.md)
- [Processes](architecture/processes.md)
```

**`.forge/workflows/plan_task.md`** — self-materializing stub:
```markdown
<!-- FORGE FAST-MODE STUB — will self-replace on first use -->
# Workflow: plan_task (fast-mode stub)

Before doing any task work, materialise this workflow:
1. Read lazy-materialize.md
2. Re-read this file (now replaced with real workflow)
3. Execute real workflow
```

**`.forge/config.json`** — discovered project config:
```json
{
  "project": { "prefix": "HELLO", "name": "hello" },
  "stack": { "primary": "Python", "version": "3.11+", "frameworks": ["click"] },
  "paths": { "engineering": "engineering", "store": ".forge/store" },
  "mode": "fast"
}
```

Forge discovered the stack from a 21-line Python file. No templates. No configuration.

</details>

<details>
<summary><b>Want to see the result without running init?</b></summary>

Switch to the [`forge-initialized`](https://github.com/Entelligentsia/forge-testbench/tree/forge-initialized) branch — it contains all artifacts after `/forge:init --fast` + first sprint intake.

</details>

<br>

---

<br>

## ③ Your First Sprint
<sup>~5 minutes</sup>

### Create the sprint

Copy-paste this into Claude Code:

```
I want to create a test sprint for hello project to see Forge in action.

Sprint goal: "Add --goodbye flag"

Feature description:
"Add a --goodbye flag to hello.py that prints 'Goodbye, NAME!' instead of
'Hello, NAME!'. It should work with --shout and --count flags just like
the regular greeting."

Acceptance criteria:
1. hello Alice --goodbye → "Goodbye, Alice!"
2. hello Alice --goodbye --shout → "GOODBYE, ALICE!"
3. hello Alice --goodbye --count 3 → prints "Goodbye, Alice!" 3 times
4. Test coverage for new flag

Please run /sprint-intake for me using this information.
```

Claude creates `engineering/sprints/HELLO-S01/intake.md`.

### Plan the sprint

```
/sprint-plan HELLO-S01
```

Forge breaks the feature into tasks (typically 2–3), builds a dependency graph, and estimates complexity. Check `engineering/sprints/HELLO-S01/plan.md`.

### Execute a task

```
/run-task HELLO-S01-T01
```

This is where it gets interesting. Forge runs a full engineering pipeline:

```
Plan → Review Plan → Implement → Review Code → Architect Approval → Commit
```

Each stage produces an artifact in `engineering/sprints/HELLO-S01/HELLO-S01-T01/`:

| File | What It Contains |
|------|-----------------|
| `PLAN.md` | Implementation strategy |
| `PLAN_REVIEW.md` | Supervisor feedback on the plan |
| `CODE_REVIEW.md` | Supervisor code review |
| `ARCHITECT_APPROVAL.md` | Final quality gate |
| `COST_REPORT.md` | Token usage breakdown |
| `VALIDATION_REPORT.md` | Test results |

<br>

---

<br>

## ④ Watch It Learn
<sup>~3 minutes</sup>

### Report a bug

Copy-paste this into Claude Code:

```
I found a bug in hello.py. When I run:
hello Alice --count 5 --shout

The output should print "HELLO, ALICE!" 5 times (shouted, repeated).

But I suspect there might be an off-by-one error in the count logic,
or the shout flag might not be applied correctly.

Please run /hello:fix-bug to investigate and fix this bug.
```

Claude runs the bug workflow:

```
Triage → Root Cause → Propose Fix → Implement + Test → KB Writeback
```

### Check the self-learning

After the bug fix, open `engineering/bugs/HELLO-B01-*/BUG_FIX_PLAN.md` — the root cause is documented, not just the fix.

Then check `engineering/architecture/` — Forge wrote back patterns and checks to the knowledge base to prevent similar issues in future sprints.

> [!TIP]
> **This is the core loop.** Every bug and sprint enriches the KB. The next sprint's plan review catches issues this sprint taught. The knowledge base compounds.

### Ask Tomoshibi

Query project state anytime:

```
/forge:ask What sprints exist?
/forge:ask What's the status of HELLO-S01?
/forge:ask What bugs have been reported?
```

Tomoshibi reads `.forge/store/` and `engineering/` — instant answers, no re-scanning.

<br>

---

<br>

## ⑤ Go Deeper

### Try another project

Repeat steps ①–④ with a different stack:

```bash
cd ../cartographer    # TypeScript — different stack, same SDLC
cd ../emberglow       # Go — different conventions, same structure
cd ../spectral        # Python — different domain, same adaptation
```

Compare generated artifacts across projects. Same engineering process, different stack-aware adaptation. Different personas, different conventions, different entity models — all discovered from code.

<details>
<summary><b>What to compare across projects</b></summary>

- **`.forge/personas/engineer.md`** — stack-specific role definitions
- **`engineering/architecture/stack.md`** — discovered frameworks and patterns
- **`.forge/workflows/plan_task.md`** — references different KB docs per project
- **`engineering/tools/`** — collate/validate scripts generated in each project's language

</details>

### Fast mode vs full mode

| | Fast Mode | Full Mode |
|---|-----------|-----------|
| **Init time** | ~2–4 min | ~10–15 min |
| **Workflows** | Stubs → materialize on first use | All generated upfront |
| **Best for** | Quick demo, iteration | Production projects |

Switch modes:

```
/forge:config mode full
/forge:regenerate workflows
```

Or start fresh:

```bash
mv .forge .forge.backup && mv engineering engineering.backup
/forge:init --full
```

<br>

---

<br>

## What You Just Experienced

| Capability | What It Means |
|-----------|--------------|
| **Project-Specific Adaptation** | Personas and workflows generated from *your* codebase, not templates |
| **Self-Learning Loop** | Bug → root cause → KB writeback → prevents similar bugs |
| **Context-Efficient Recall** | Workflows load only relevant KB sections, not the full codebase |
| **Multi-Stage Review** | Plan review + code review + architect approval per task |
| **Deterministic Tools** | Collation and validation scripts generated in your project's language |

<br>

---

<br>

## Troubleshooting

<details>
<summary><b>Forge commands not found</b></summary>

```
/plugin list          # Verify forge@skillforge is enabled
/reload-plugins       # Reload if needed
```

</details>

<details>
<summary><b>Project commands missing (e.g. /hello:fix-bug)</b></summary>

Check that `.claude/commands/` was created during init:

```bash
ls .claude/commands/
```

If missing:

```
/forge:regenerate commands
```

</details>

<details>
<summary><b>Too many permission prompts</b></summary>

```
/update-config
# Ask to "allow Read tool for engineering/ and .forge/ directories"
```

</details>

<details>
<summary><b>Init failed or was interrupted</b></summary>

Check `.forge/init-progress.json` for the last completed phase, then:

```
/forge:init --resume
```

Or back up and start fresh.

</details>

<details>
<summary><b>Something else broken?</b></summary>

```
/forge:report-bug
```

Forge interviews you, captures diagnostics (version, stack, OS), and drafts a GitHub issue. Preferred over manual filing — structured and complete.

</details>

<br>

---

<br>

## Security

Every Forge release is scanned before publish — 171 files analyzed, 0 critical issues across all versions. [Public audit trail →](https://github.com/Entelligentsia/forge/tree/main/docs/security)

Scan installed plugins yourself:

```
/security-watchdog:scan-plugin forge:forge
```

<br>

---

<br>

<div align="center">

**Next Steps**

[Forge Docs](https://github.com/Entelligentsia/forge/tree/main/docs) · [Command Reference](https://github.com/Entelligentsia/forge/tree/main/docs/commands) · [Discussions](https://github.com/Entelligentsia/forge/discussions) · [Report a Bug](https://github.com/Entelligentsia/forge/issues)

<sub>MIT License · Built by <a href="https://github.com/Entelligentsia">Entelligentsia</a></sub>

</div>
