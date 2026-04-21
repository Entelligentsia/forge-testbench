# Architect Skills — hello

Project: hello (Python 3.11+ CLI greeter using click)
Engineering knowledge base: hello-project-knowledge/
Entry point: hello.py (hello:main)
Build: pip install -e .

---

## System Design & Modeling

### Architecture Analysis
Evaluate the current structure of hello.py and pyproject.toml to identify technical debt and bottlenecks. The project is a single-file Python CLI built on click. Assess whether the single-file layout remains appropriate as features grow, and flag if click command grouping or module extraction is warranted.

### Design Pattern Selection
Determine the most appropriate patterns for new click commands or options. For hello, this means deciding between adding flags to the existing `main` command vs. introducing click groups or subcommands. Prefer the simplest pattern that meets acceptance criteria without over-engineering a 26-line greeter.

### Data Modeling
Design efficient data flow through click's parameter pipeline. For hello, this covers how greeting strings are constructed from `name`, `--count`, `--shout`, and any future flags (e.g. `--formal`, `--goodbye`). Define clear transformation order: build greeting → apply modifiers (shout, formal) → repeat (`--count`).

### Interface Specification
Define clear contracts between click parameter parsing and greeting logic. Document expected input types, defaults, and output format for each option so that Engineer and Reviewer have an unambiguous reference. Example contract: `--shout` applies `.upper()` to the fully-constructed greeting string after all other modifiers.

---

## Strategic Planning

### Technical Roadmap
Map the evolution of hello across sprints. Track which sprints (HELLO-S01, HELLO-S02, …) introduce new flags, tests, or CI. Reference hello-project-knowledge/MASTER_INDEX.md for current sprint and task inventory. Propose logical sequencing: bug fixes before feature additions; test infrastructure (pytest) before complex features.

### Trade-off Analysis
Weigh technical approaches before approving plans. For hello, typical trade-offs include:
- Single `hello.py` file vs. package split (simplicity vs. maintainability)
- click `@pass_context` vs. direct parameter passing (flexibility vs. complexity)
- Adding pytest now vs. deferring (quality assurance vs. scope creep for a greeter)

Document the chosen approach and rationale in the relevant sprint plan artifact under hello-project-knowledge/sprints/.

### Complexity Management
Break large architectural goals into tasks sized for a single sprint iteration. For hello, no task should require changes outside hello.py and pyproject.toml unless introducing a new module is explicitly justified. Flag scope creep in plan reviews.

---

## High-Level Review

### Architecture Review
During plan review and architect approval gates, verify that Engineer implementations align with the intended click-based CLI design. Check that:
- New options are registered via `@click.option` decorators on `main`
- Greeting construction follows the agreed transformation order
- No external dependencies are added without justification in pyproject.toml

### Scalability Assessment
Analyze how hello will handle growth in options and user load. For a CLI greeter, scalability means code maintainability as flags multiply, not runtime throughput. Flag when the single-function `main` should be refactored into helper functions to keep cyclomatic complexity low.

### Security Modeling
Identify potential attack vectors in the click parameter surface and design mitigations. For hello, relevant vectors include:
- Unvalidated `name` input passed to string formatting (low severity for a local CLI, but document the assumption)
- `--count` integer with no upper bound (consider a reasonable max to prevent runaway output)

Document findings in hello-project-knowledge/architecture/ as they are discovered.
