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
- `public/rss.xml` remains the tracked rollback fallback RSS artifact; public `/rss.xml` is routed to backend-generated RSS after approved activation.
- `dist/` is ignored build output and should not be committed.
- Do not inspect `.env` or secret files.
- For frontend UI work, inspect existing components and styles before proposing changes. Preserve current Ant Design, global CSS, Emotion, inline style, layout, responsive, accessibility, and motion patterns where appropriate.
- Document accessibility, responsive, motion, performance, and dependency considerations for UI changes. Avoid new dependencies unless an approved feature spec explicitly justifies them.
- Do not touch app/source code unless the approved feature spec explicitly requires it.

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
- Header RSS links should preserve `/rss.xml` as the canonical same-tab feed URL.
- Do not create commits, branches, PRs, releases, or tags unless Shayne asks.
