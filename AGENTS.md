# Agent Instructions for notion2github-FE

This repo is the React/Vite frontend for `shaynemcgregor.dev`.

Read the parent workspace `system_context.md` before making cross-repo or data-contract changes.

## Repo Purpose

- Render the public personal site.
- Fetch and cache blog data from `notion2github-BE`.
- Render blog index and blog detail pages from the shared blog post contract.
- Render backend-hosted Notion image URLs.
- Provide frontend routes for home, blog, blog detail, contact, and case studies.

## Important Directories And Files

- `src/main.jsx`: app bootstrap, backend fetch, `localStorage` cache, Ant Design theme.
- `src/App.jsx`: route definitions.
- `src/AppLayout.jsx`: shared layout.
- `src/pages/`: route-level pages.
- `src/components/`: reusable UI components.
- `src/data/notionBlogData.js`: static/generated-looking blog post data snapshot.
- `src/types/`: TypeScript type definitions.
- `src/setupTests.ts`: test setup.
- `scripts/`: local image optimization scripts.
- `public/`: static assets and public files, including `rss.xml`.
- `vite.config.js`: Vite and Vitest config.
- `tsconfig.json`: TypeScript config.
- `eslint.config.js`: ESLint config.
- `.gitignore`: ignore rules. Do not add `AGENTS.md`.

## Relevant Commands

- `npm run dev`: start Vite dev server.
- `npm run build`: build the frontend.
- `npm run lint`: run ESLint.
- `npm run test`: run Vitest.
- `npm run test:ui`: run Vitest UI.
- `npm run img-optimize`: optimize local public PNGs into WebP files.

## External Services Used

- Consumes `notion2github-BE` at `https://shaynemcgregordev-be.netlify.app/.netlify/functions/notion-blog-data`.
- Renders image URLs served by the backend `notion-image` function.
- Does not directly call Notion, Airtable, Netlify APIs, or GitHub APIs in inspected source.

## Connections To Other Repos

- Depends on `notion2github-BE` for live blog JSON.
- Depends on `notion2github-BE` for optimized Notion image URLs.
- Shares the blog post data contract with `notion2github-BE` and `xml-feed-gen`.
- `xml-feed-gen` owns RSS generation; this repo may contain a public `rss.xml` artifact.

## Inspect Before Changing

- `git status --short`
- `.gitignore`
- `.git/info/exclude`
- `package.json`
- `vite.config.js`
- `tsconfig.json`
- `eslint.config.js`
- relevant files under `src/`
- parent `../system_context.md` for cross-repo contract context

Do not inspect `.env` files or secret files.

## Do Not Do Without Confirmation

- Do not deploy.
- Do not change the backend API contract casually.
- Do not regenerate or replace public artifacts unless requested.
- Do not modify `.gitignore` to ignore `AGENTS.md`.
- Do not create commits, branches, PRs, releases, or tags.
- Do not overwrite user-owned dirty changes.

## Testing, Build, And Formatting Guidance

- For source changes, prefer `npm run lint`, `npm run test`, and `npm run build` when appropriate.
- For documentation-only changes, read back changed docs and check `git status --short`.
- No separate formatter command was identified in `package.json`.
- If skipping build/test/lint, report why.

## Data Contract Warnings

Frontend blog pages expect posts shaped like:

- `id`
- `tag`
- `title`
- `summary`
- `link`
- `thumbnail`
- `publishedDate`
- `updatedDate`
- `body` as sections with `heading` and `paras`

`link` is used for `/blog/:slug`. Changes to this contract must be coordinated with `notion2github-BE` and `xml-feed-gen`.

`src/components/ReactionsBar.jsx` and `src/components/ReactionsBar.tsx` both exist. Check current imports and prop shapes before changing reaction UI.

## Secrets And Environment Warnings

- Do not read `.env` or secret files.
- Do not print environment values.
- The inspected frontend source uses a hard-coded backend API URL rather than direct environment variable reads.

## PR Workflow Expectations

- Do not create a branch, commit, or PR unless Shayne asks.
- Before a PR, summarize dirty files and identify user-owned changes.
- Include verification commands and skipped commands in any PR summary.
- Mention cross-repo contract changes if blog data shape or backend endpoints change.
