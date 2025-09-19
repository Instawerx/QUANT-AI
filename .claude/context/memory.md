# Memory File for Context Engineering

This file is used by Claude Code to persist summarized context across build iterations.

After each iteration of the agentic loop (plan → change → test → commit), append a short summary of:
- The changes made (what files were modified and why).
- Key decisions or assumptions.
- Any tests run and their outcomes.
- Any outstanding issues or TODOs.

Write these summaries in bullet form or short paragraphs. Keep entries chronological, with the newest at the bottom.

The memory file is not meant to contain full code. Instead, it should capture the "why" and "what" of changes so future runs can load this context efficiently.
