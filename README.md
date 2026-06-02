# notion2github-FE

React/Vite frontend for `shaynemcgregor.dev`.

## What This Repo Does

- Renders the public site.
- Fetches blog data from the backend Netlify Function.
- Caches blog data and version metadata in browser `localStorage`.
- Renders blog list and blog detail pages from the shared backend contract.
- Renders backend-hosted Notion image URLs.

## Commands

- `npm run dev`: start the Vite dev server.
- `npm run build`: build the frontend.
- `npm run lint`: run ESLint.
- `npm run test`: run Vitest.
- `npm run test:ui`: run Vitest UI.
- `npm run preview`: preview the production build locally.
- `npm run img-optimize`: optimize local public PNGs into WebP files.

## Local Development Notes

- This repo consumes backend data from the Netlify-hosted `notion2github-BE`.
- The repo has local `.netlify/` state in the workspace, but no clear repo-level Netlify configuration was found in the audit.
- The current source of truth for runtime blog data is the backend contract, not local static content.

## Artifact And Generated File Cautions

- `public/rss.xml` is tracked and should be changed intentionally.
- `dist/` is ignored local build output.
- Do not commit local caches or build output unless the change is explicitly about a tracked artifact.
- `public/rss.xml` is the live RSS artifact for the public site.
- The Go RSS tooling in `xml-feed-gen` is experimental/prototype tooling and is not the authoritative source for the live feed right now.

## Relation To The Other Repos

- Depends on `notion2github-BE` for blog JSON.
- Depends on `notion2github-BE` for image URLs.
- Shares the blog data contract with `notion2github-BE` and `xml-feed-gen`.
- Has the tracked live RSS artifact in `public/rss.xml`.
