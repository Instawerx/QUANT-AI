Agent: master
    Goal: Integrate context engineering best practices into the project and workflow.

    Steps:
    - Read the `context-engineering-intro` guide 
 (https://github.com/coleam00/context-engineering-intro/tree/main/claude-code-full-guide) and summarize key guidelines relevant to our project, such as system
  prompt design, memory summarization, context compression, and multi‑agent workflows.
    - Update or create `docs/context_engineering.md` summarizing these guidelines; ensure it references our use of `.claude/context/memory.md` and defines how to compress context after each iteration.
    - Update `.claude/system.md` if needed to include high‑level context engineering guidance or a pointer to `docs/context_engineering.md`.
    - Confirm that `.claude/context/memory.md` exists and is used to persist summarized context after each build iteration.
    - Verify that `project.quant-ai.yaml` includes this task in the iteration order and update if necessary.
    - After making updates, run any relevant tests (if present) and commit the changes.

    Notes:
    - Do not duplicate existing guidelines; enhance and integrate them with existing documentation.
    - Maintain existing functionality and tasks; this task only adds context engineering integration.