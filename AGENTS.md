<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Branches and pull requests

- The only long-lived branches are `dev` and `main`. Every other branch belongs to exactly one pull request.
- `dev` is the integration branch. Start each piece of work on a new branch from `origin/dev`, and open one PR for it.
- Never reuse a branch for a second PR, and never stack unrelated work on a branch that already has a PR.
- Every pull request targets `dev` (for example `gh pr create --base dev`). Never open a PR into `main`, or into another feature branch.
- Merge PRs into `dev` with **squash merge** only (for example `gh pr merge <n> --squash --delete-branch`), then delete the branch on GitHub and locally.
- `main` is only updated from `dev` now and then, through a `dev` → `main` PR that a maintainer asks for. That release PR is the one exception to squashing: merge it with a merge commit so `dev` and `main` keep a shared history.
