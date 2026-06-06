# Bug report — HELLO-BUG-001

When I run:

```
hello Alice --count 5 --shout
```

**Expected:** `HELLO, ALICE!` printed 5 times (shouted and repeated).

Possible issues to investigate:

- Off-by-one error in the count loop
- Shout flag not applied on every repetition
- Count and shout interaction broken

Please investigate with `/forge:fix-bug HELLO-BUG-001` — and land a regression
guard for the count/shout interaction either way.
