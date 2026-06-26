# Installed Claude Code Skills

This directory holds Claude Code skills vendored into the repo so they are
available in every session (including ephemeral Claude Code web sessions).
Each subdirectory with a `SKILL.md` is auto-discovered as a skill.

> Note: `.gitignore` ignores `.claude/*` (local tooling like `settings.json`)
> but explicitly re-includes `.claude/skills/` so these stay tracked.

## Sources

| Skill set | Source | Version | Skills |
| --- | --- | --- | --- |
| ui-ux-pro-max | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | 2.6.2 | `banner-design`, `brand`, `design`, `design-system`, `slides`, `ui-styling`, `ui-ux-pro-max` |
| superpowers | https://github.com/obra/superpowers | 6.0.3 | `brainstorming`, `dispatching-parallel-agents`, `executing-plans`, `finishing-a-development-branch`, `receiving-code-review`, `requesting-code-review`, `subagent-driven-development`, `systematic-debugging`, `test-driven-development`, `using-git-worktrees`, `using-superpowers`, `verification-before-completion`, `writing-plans`, `writing-skills` |

The ui-ux-pro-max skill originally symlinks its `data/` and `scripts/` to a
top-level `src/` directory; those symlinks were dereferenced on install so each
skill is fully self-contained here.

## Updating (re-sync / "merge")

To pull newer upstream versions, re-fetch the source tarball and overwrite the
relevant skill directories, e.g.:

```sh
curl -sSL https://codeload.github.com/obra/superpowers/tar.gz/refs/heads/main | tar xz
cp -r superpowers-main/skills/. .claude/skills/

curl -sSL https://codeload.github.com/nextlevelbuilder/ui-ux-pro-max-skill/tar.gz/refs/heads/main | tar xz
cp -rL ui-ux-pro-max-skill-main/.claude/skills/. .claude/skills/
```

Then commit the changes.
