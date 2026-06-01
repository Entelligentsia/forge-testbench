#!/usr/bin/env python3
"""Regression guard for HELLO-BUG-002: --shout must upper-case the greeting on
both the formal and informal paths.

Standalone script (no pytest). Drives hello.py's `main` command via
click.testing.CliRunner and asserts the output for each case. Exits 1 on any
mismatch, 0 when all cases pass. Resolves hello.py robustly by inserting the
repo root (parent of tests/) onto sys.path, so it runs regardless of cwd.
"""
from __future__ import annotations

import os
import sys

# Make hello.py importable regardless of the current working directory:
# the repo root is the parent directory of this test file's directory.
_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _REPO_ROOT not in sys.path:
    sys.path.insert(0, _REPO_ROOT)

from click.testing import CliRunner  # noqa: E402

from hello import main  # noqa: E402

# (args, expected_output) pairs.
CASES = [
    (["Alice", "--formal", "--shout"], "GREETINGS, ALICE\n"),
    (["Alice", "--shout"], "HELLO, ALICE!\n"),
    (["Alice", "--formal"], "Greetings, Alice\n"),
    (["Alice", "--formal", "--shout", "--count", "2"],
     "GREETINGS, ALICE\nGREETINGS, ALICE\n"),
]


def run() -> int:
    runner = CliRunner()
    failures = 0
    for args, expected in CASES:
        result = runner.invoke(main, args)
        if result.exit_code != 0:
            print(f"FAIL: args={args} exited {result.exit_code}: "
                  f"{result.output!r}")
            failures += 1
            continue
        if result.output != expected:
            print(f"FAIL: args={args} expected {expected!r} "
                  f"got {result.output!r}")
            failures += 1
        else:
            print(f"PASS: args={args} -> {result.output!r}")
    return failures


if __name__ == "__main__":
    n = run()
    if n:
        print(f"{n} case(s) failed")
        sys.exit(1)
    print("All regression cases passed")
    sys.exit(0)
