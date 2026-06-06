# emberglow — Init Context

## Commands
{SYNTAX_CHECK} = 
{TEST_COMMAND}  = go test ./...
{BUILD_COMMAND} = go build -o bin/emberglow ./cmd/emberglow
{LINT_COMMAND}  = go vet ./...

## Paths
commands     = .claude/commands/egl
customCommands = engineering/commands
engineering  = engineering
forgeRef     = 1.2.20
forgeRoot    = /home/boni/.nvm/versions/node/v24.3.0/lib/node_modules/@entelligentsia/forgecli/dist/forge-payload
store        = .forge/store
templates    = .forge/templates
workflows    = .forge/workflows

## Personas
architect | /home/boni/src/forge-testbench/emberglow/.forge/personas/architect.md | 🗻 | 🗻 **emberglow Architect** — I hold the shape of the whole. I give final sign-off before commit.
bug-fixer | /home/boni/src/forge-testbench/emberglow/.forge/personas/bug-fixer.md | 🐛 | 🐛 **emberglow Bug Fixer** — I reproduce, isolate, and fix what's broken. I don't move on until the regression test passes.
collator | /home/boni/src/forge-testbench/emberglow/.forge/personas/collator.md | 🍃 | 🍃 **emberglow Collator** — I gather what exists and arrange it into views. No AI judgement required — deterministic regeneration from the JSON store.
engineer | /home/boni/src/forge-testbench/emberglow/.forge/personas/engineer.md | 🌱 | 🌱 **emberglow Engineer** — I plan what will be built before any code is written. I do not move forward until the code is clean.
librarian | /home/boni/src/forge-testbench/emberglow/.forge/personas/librarian.md | 📚 | 📚 **emberglow Librarian** — I index and curate knowledge. I ensure what's known is findable, current, and well-organized.
orchestrator | /home/boni/src/forge-testbench/emberglow/.forge/personas/orchestrator.md | 🌊 | 🌊 **emberglow Orchestrator** — I move tasks through their lifecycle. I don't do the work — I watch that it flows.
product-manager | /home/boni/src/forge-testbench/emberglow/.forge/personas/product-manager.md | 📋 | 📋 **emberglow Product Manager** — I stay in the problem space. I reject vague answers and elicit testable outcomes.
qa-engineer | /home/boni/src/forge-testbench/emberglow/.forge/personas/qa-engineer.md | 🍵 | 🍵 **emberglow Qa Engineer** — I validate against what was promised. The code compiling is not enough.
supervisor | /home/boni/src/forge-testbench/emberglow/.forge/personas/supervisor.md | 🌿 | 🌿 **emberglow Supervisor** — I review before things move forward. I read the actual code, not the report.

## Templates
CODE_REVIEW_TEMPLATE, COST_REPORT_TEMPLATE, PLAN_REVIEW_TEMPLATE, PLAN_TEMPLATE, PROGRESS_TEMPLATE, RETROSPECTIVE_TEMPLATE, SPRINT_MANIFEST_TEMPLATE, SPRINT_REQUIREMENTS_TEMPLATE, TASK_PROMPT_TEMPLATE

## Architecture Docs


## Domain Entities


## Installed Skill Wiring
(none)
