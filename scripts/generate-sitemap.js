/* global process */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SITE_URL = "https://shaynemcgregor.dev";

// Keep this list in sync with indexable static routes in src/App.jsx.
export const STATIC_SITEMAP_PATHS = ["/", "/blog", "/contact", "/resume", "/privacy"];

function normalizeSiteUrl(siteUrl) {
    return siteUrl.trim().replace(/\/+$/, "");
}

function escapeXml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

export function buildSitemapIndex(siteUrl = SITE_URL) {
    const canonicalSiteUrl = normalizeSiteUrl(siteUrl);

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        `  <sitemap><loc>${escapeXml(`${canonicalSiteUrl}/sitemap-pages.xml`)}</loc></sitemap>`,
        `  <sitemap><loc>${escapeXml(`${canonicalSiteUrl}/sitemap-posts.xml`)}</loc></sitemap>`,
        "</sitemapindex>",
        "",
    ].join("\n");
}

export function buildStaticPagesSitemap(siteUrl = SITE_URL, paths = STATIC_SITEMAP_PATHS) {
    const canonicalSiteUrl = normalizeSiteUrl(siteUrl);
    const urls = paths.map((routePath) => `${canonicalSiteUrl}${routePath === "/" ? "/" : routePath}`);

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
        "</urlset>",
        "",
    ].join("\n");
}

export async function writeSitemaps({ distDir = "dist", siteUrl = SITE_URL } = {}) {
    const outputDir = path.resolve(distDir);
    await mkdir(outputDir, { recursive: true });
    await Promise.all([
        writeFile(path.join(outputDir, "sitemap.xml"), buildSitemapIndex(siteUrl), "utf8"),
        writeFile(path.join(outputDir, "sitemap-pages.xml"), buildStaticPagesSitemap(siteUrl), "utf8"),
    ]);
}

async function main() {
    await writeSitemaps({
        siteUrl: process.env.SITEMAP_SITE_URL || SITE_URL,
    });
    console.log("[sitemap] Generated sitemap.xml and sitemap-pages.xml.");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main().catch((error) => {
        console.error(`[sitemap] ${error.message}`);
        process.exitCode = 1;
    });
}
