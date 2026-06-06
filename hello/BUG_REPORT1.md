# Bug report — HELLO-BUG-002

When I run:

```
hello Alice --formal --shout
```

**Expected:** `GREETINGS, ALICE` (formal greeting, shouted).

It looks like `--shout` may be ignored on the formal path. Please investigate
with `/forge:fix-bug HELLO-BUG-002`. `tests/test_shout_formal.py` is the
regression guard for this interaction — make sure it covers the failing case
and passes when the fix (or verification) lands.
