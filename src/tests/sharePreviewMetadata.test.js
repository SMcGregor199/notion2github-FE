import { describe, expect, it } from "vitest";
import {
    buildAllSharePreviewMetadata,
    buildSharePreviewMetadata,
    getSharePreviewOutputPath,
    injectSharePreviewHead,
    renderSharePreviewHead,
} from "../utils/sharePreviewMetadata";

const basePost = {
    tag: "EdTech",
    title: "A Useful Post",
    summary: "A specific summary for the post.",
    link: "a-useful-post",
    thumbnail: "https://example.com/share.webp",
    body: [
        {
            heading: "Intro",
            paras: ["The first paragraph should be available as a fallback."],
        },
    ],
    publishedDate: "2025-10-27T18:15:00.000Z",
    updatedDate: "2025-10-28T16:20:00.000Z",
};

describe("share preview metadata", () => {
    it("builds post-specific metadata from the blog contract", () => {
        const metadata = buildSharePreviewMetadata(basePost);

        expect(metadata).toMatchObject({
            slug: "a-useful-post",
            title: "A Useful Post",
            documentTitle: "A Useful Post | Shayne McGregor",
            description: "A specific summary for the post.",
            canonicalUrl: "https://shaynemcgregor.dev/blog/a-useful-post",
            siteName: "shaynemcgregor.dev",
            imageUrl: "https://example.com/share.webp",
            imageAlt: "A Useful Post preview image",
            publishedTime: "2025-10-27T18:15:00.000Z",
            modifiedTime: "2025-10-28T16:20:00.000Z",
            tag: "EdTech",
            twitterCard: "summary_large_image",
        });
    });

    it("escapes dynamic head values before injecting them into HTML", () => {
        const metadata = buildSharePreviewMetadata({
            ...basePost,
            title: "Title & <script>",
            summary: `Summary "quote" & apostrophe's <tag>`,
        });

        const head = renderSharePreviewHead(metadata);

        expect(head).toContain("<title>Title &amp; &lt;script&gt; | Shayne McGregor</title>");
        expect(head).toContain("Summary &quot;quote&quot; &amp; apostrophe&#39;s &lt;tag&gt;");
        expect(head).not.toContain("<script>");
    });

    it("falls back to the first body paragraph and site image when optional metadata is missing", () => {
        const metadata = buildSharePreviewMetadata({
            ...basePost,
            summary: "",
            thumbnail: "not-a-url",
        });

        expect(metadata.description).toBe("The first paragraph should be available as a fallback.");
        expect(metadata.imageUrl).toBe("https://shaynemcgregor.dev/profile-pic.png");
        expect(metadata.imageAlt).toBe("Shayne McGregor");
    });

    it("falls back to a site-level description when summary and body text are missing", () => {
        const metadata = buildSharePreviewMetadata({
            ...basePost,
            summary: "",
            body: [],
        });

        expect(metadata.description).toBe("Read Shayne McGregor's latest writing.");
    });

    it("fails clearly when a required title or slug is missing", () => {
        expect(() => buildSharePreviewMetadata({ ...basePost, title: " " })).toThrow(
            /requires a non-empty post.title/
        );
        expect(() => buildSharePreviewMetadata({ ...basePost, link: "" })).toThrow(
            /requires a non-empty post.link/
        );
    });

    it("fails clearly when duplicate slugs would overwrite generated routes", () => {
        expect(() => buildAllSharePreviewMetadata([basePost, { ...basePost, title: "Second" }])).toThrow(
            /Duplicate blog share preview slug "a-useful-post"/
        );
    });

    it("returns the expected static route output path", () => {
        expect(getSharePreviewOutputPath("a-useful-post")).toBe("blog/a-useful-post/index.html");
    });

    it("injects metadata before the SPA script executes", () => {
        const metadata = buildSharePreviewMetadata(basePost);
        const html = [
            "<!doctype html>",
            "<html>",
            '<head><title>Generic</title><script type="module" src="/assets/app.js"></script></head>',
            '<body><div id="root"></div></body>',
            "</html>",
        ].join("");
        const injected = injectSharePreviewHead(html, metadata);

        expect(injected.indexOf('property="og:title"')).toBeLessThan(injected.indexOf("<script"));
        expect(injected).toContain("<title>A Useful Post | Shayne McGregor</title>");
        expect(injected).not.toContain("<title>Generic</title>");
    });
});
