# spectral — Init Context

## Commands
{SYNTAX_CHECK} = 
{TEST_COMMAND}  = python3 -m pytest
{BUILD_COMMAND} = python3 -m pip install -e .
{LINT_COMMAND}  = 

## Paths
commands     = .claude/commands/spe
customCommands = engineering/commands
engineering  = engineering
forgeRef     = 1.2.20
forgeRoot    = /home/boni/.nvm/versions/node/v24.3.0/lib/node_modules/@entelligentsia/forgecli/dist/forge-payload
store        = .forge/store
templates    = .forge/templates
workflows    = .forge/workflows

## Personas
architect | /home/boni/src/forge-testbench/spectral/.forge/personas/architect.md | 🗻 | 🗻 **spectral Architect** — I hold the shape of the whole. I give final sign-off before commit.
bug-fixer | /home/boni/src/forge-testbench/spectral/.forge/personas/bug-fixer.md | 🐛 | 🐛 **spectral Bug Fixer** — I reproduce, isolate, and fix what's broken. I don't move on until the regression test passes.
collator | /home/boni/src/forge-testbench/spectral/.forge/personas/collator.md | 🍃 | 🍃 **spectral Collator** — I gather what exists and arrange it into views. No AI judgement required — deterministic regeneration from the JSON store.
engineer | /home/boni/src/forge-testbench/spectral/.forge/personas/engineer.md | 🌱 | 🌱 **spectral Engineer** — I plan what will be built before any code is written. I do not move forward until the code is clean.
librarian | /home/boni/src/forge-testbench/spectral/.forge/personas/librarian.md | 📚 | 📚 **spectral Librarian** — I index and curate knowledge. I ensure what's known is findable, current, and well-organized.
orchestrator | /home/boni/src/forge-testbench/spectral/.forge/personas/orchestrator.md | 🌊 | 🌊 **spectral Orchestrator** — I move tasks through their lifecycle. I don't do the work — I watch that it flows.
product-manager | /home/boni/src/forge-testbench/spectral/.forge/personas/product-manager.md | 📋 | 📋 **spectral Product Manager** — I stay in the problem space. I reject vague answers and elicit testable outcomes.
qa-engineer | /home/boni/src/forge-testbench/spectral/.forge/personas/qa-engineer.md | 🍵 | 🍵 **spectral Qa Engineer** — I validate against what was promised. The code compiling is not enough.
supervisor | /home/boni/src/forge-testbench/spectral/.forge/personas/supervisor.md | 🌿 | 🌿 **spectral Supervisor** — I review before things move forward. I read the actual code, not the report.

## Templates
CODE_REVIEW_TEMPLATE, COST_REPORT_TEMPLATE, PLAN_REVIEW_TEMPLATE, PLAN_TEMPLATE, PROGRESS_TEMPLATE, RETROSPECTIVE_TEMPLATE, SPRINT_MANIFEST_TEMPLATE, SPRINT_REQUIREMENTS_TEMPLATE, TASK_PROMPT_TEMPLATE

## Architecture Docs


## Domain Entities


## Installed Skill Wiring
(none)
