<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Branches and pull requests

- `dev` is the integration branch. Start new work from `origin/dev`.
- Every pull request targets `dev` (for example `gh pr create --base dev`). Never open a PR into `main`.
- `main` is only updated from `dev` now and then, through a `dev` → `main` PR that a maintainer asks for.
