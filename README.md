# notion2github-FE

React/Vite frontend for `shaynemcgregor.dev`.

## What This Repo Does

- Renders the public site.
- Fetches blog data from the backend Netlify Function.
- Caches blog data and version metadata in browser `localStorage`.
- Renders blog list and blog detail pages from the shared backend contract.
- Renders backend-hosted Notion image URLs.
- Generates crawler-visible, per-post share preview HTML for `/blog/:slug` routes during production builds.

## Commands

- `npm run dev`: start the Vite dev server.
- `npm run build`: build the frontend and generate per-post share preview HTML in `dist/blog/<slug>/index.html`.
- `npm run lint`: run ESLint.
- `npm run test`: run Vitest.
- `npm run test:ui`: run Vitest UI.
- `npm run preview`: preview the production build locally.
- `npm run img-optimize`: optimize local public PNGs into WebP files.

## Local Development Notes

- This repo consumes backend data from the Netlify-hosted `notion2github-BE`.
- The repo has local `.netlify/` state in the workspace, but no clear repo-level Netlify configuration was found in the audit.
- The current source of truth for runtime blog data is the backend contract, not local static content.
- The share preview build step reads the stored backend JSON endpoint at `/.netlify/functions/blog-posts-json`; it does not use the refresh/write-oriented `notion-blog-data` endpoint.
- Optional non-secret build variables:
  - `SHARE_PREVIEW_POSTS_URL`: override the stored blog JSON URL.
  - `SHARE_PREVIEW_SITE_URL`: override the canonical site URL. Defaults to `https://shaynemcgregor.dev`.
  - `SHARE_PREVIEW_FALLBACK_IMAGE_URL`: override the absolute fallback share image. Defaults to `https://shaynemcgregor.dev/profile-pic.png`.
  - `SHARE_PREVIEW_STRICT_SOURCE=true`: fail the build if the stored JSON endpoint is unavailable instead of using the bundled local fallback.
  - `SHARE_PREVIEW_ALLOW_LOCAL_FALLBACK=false`: fail the build if the stored JSON endpoint is unavailable.

## Artifact And Generated File Cautions

- `public/rss.xml` is tracked and should be changed intentionally.
- `dist/` is ignored local build output.
- Do not commit local caches or build output unless the change is explicitly about a tracked artifact.
- `public/rss.xml` is the tracked rollback fallback RSS artifact for the public site.
- The header links to `/rss.xml` with a same-tab RSS icon link.
- Production generated RSS is implemented in backend/RSS tooling and public `/rss.xml` is routed to the generated backend feed.
- Keep the tracked static RSS file unless an approved rollback/fallback change says otherwise.

## Relation To The Other Repos

- Depends on `notion2github-BE` for blog JSON.
- Depends on `notion2github-BE` for image URLs.
- Shares the blog data contract with `notion2github-BE` and `xml-feed-gen`.
- Has the tracked rollback fallback RSS artifact in `public/rss.xml`.
