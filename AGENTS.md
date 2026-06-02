# Agent Instructions for notion2github-FE

Frontend for `shaynemcgregor.dev`.

## Read Before Work

- `../system_context.md`
- `../WORKFLOW.md`
- `../DECISIONS.md`
- `README.md`

## Repo-Specific Cautions

- Consumes backend data from `notion2github-BE`.
- Do not change frontend data expectations without checking the backend contract.
- `public/rss.xml` is tracked.
- `dist/` is ignored build output and should not be committed.
- Do not inspect `.env` or secret files.

## Verification Expectations

- For source changes, prefer `npm run lint`, `npm run test`, and `npm run build` when appropriate.
- For documentation-only changes, read back the edited docs and check `git status --short`.
- Report any skipped verification command and why it was skipped.

## Cleanup Expectations

- Leave user-owned dirty files untouched.
- Do not commit generated output unless the task explicitly targets a tracked artifact.
- Do not modify `.gitignore` to ignore `AGENTS.md`.

## Final Handoff Expectations

- State which files changed.
- State which commands ran and which were skipped.
- Call out any backend contract or RSS artifact implications.
- Do not create commits, branches, PRs, releases, or tags unless Shayne asks.
