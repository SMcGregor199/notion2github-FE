import { describe, expect, it } from "vitest";
import {
    buildSitemapIndex,
    buildStaticPagesSitemap,
    STATIC_SITEMAP_PATHS,
} from "../../scripts/generate-sitemap.js";

describe("sitemap generator", () => {
    it("builds an index for the static and dynamic child sitemaps", () => {
        const sitemap = buildSitemapIndex();

        expect(sitemap).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
        expect(sitemap).toContain("https://shaynemcgregor.dev/sitemap-pages.xml");
        expect(sitemap).toContain("https://shaynemcgregor.dev/sitemap-posts.xml");
    });

    it("uses absolute canonical URLs for the selected static routes only", () => {
        const sitemap = buildStaticPagesSitemap();

        expect(STATIC_SITEMAP_PATHS).toEqual(["/", "/blog", "/contact", "/resume", "/privacy"]);
        for (const routePath of STATIC_SITEMAP_PATHS) {
            expect(sitemap).toContain(`https://shaynemcgregor.dev${routePath}`);
        }
        expect(sitemap).not.toContain("/case-studies");
        expect(sitemap).not.toContain("/subscribe/confirmed");
    });
});
