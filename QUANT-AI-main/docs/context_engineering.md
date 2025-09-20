# Context Engineering Guidelines

    This document summarizes advanced context engineering techniques from the 
context-engineering-intro guide. Use these guidelines to optimize Claude Code 
and project workflows.

    ## Optimize CLAUDE.md and system prompts

    - Provide project awareness and context-specific rules. Include relevant 
code structure guidance, testing requirements, task workflow, style conventions,
 and documentation standards.
    - Use advanced prompting "Power Keywords": e.g., `IMPORTANT` for critical 
instructions; `Proactively` to encourage initiative; `Ultra-think` for thorough 
analysis. Use them sparingly to emphasize critical points.
    - Avoid vague descriptors like "production-ready"; focus on explicit 
requirements and clarity.

    ## File placement and reusability

    - Place context files (CLAUDE.md) at the project root or in a parent 
directory that covers multiple modules or packages. Reference external files 
 (e.g., company engineering standards) instead of duplicating them.

    ## Permission Management

    - Use interactive allowlists or the `/permissions` command to grant tool 
access. Typical allowed tools include `Edit`, `Bash(git commit:*)`, 
 `Bash(npm:*)`, `Read`, and `Write`. Avoid destructive commands like `rm 
 -rf`.
    - Store persistent permission settings in `.claude/settings.local.json` for 
each project.

    ## Custom Slash Commands

    - Define custom commands (e.g., `/infinite`) to encapsulate multi-step 
workflows. Claude Code provides built-in commands like `/init`, `/permissions`, 
 `/clear`, `/agents`, and `/help`. Use parameterised workflows to reduce 
repetition and maintain consistency across runs.