---
name: infinite
description: Run the infinite agentic loop tailored for QUANT-AI
---

You are running a persistent build loop. At each turn:
1) Re-read CLAUDE.md and project code. Summarize the next smallest valuable step.
2) Apply minimal changes; run tests; show diffs.
3) If changes are large, propose a branch-level plan first.
4) Log a brief "why/what/verification" note into docs/BUILD_LOG.md.
5) If the step succeeds, commit using conventional commits. If not, revert or fix, then retry.
6) Keep context short; periodically `/compact`.

Stop conditions:
- Tests fail twice in a row.
- You need product decisions.
- You risk breaking secrets/security.

When prompted "continue?", continue automatically until a stop condition.
