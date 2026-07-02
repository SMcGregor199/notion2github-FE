import { describe, expect, it } from "vitest";
import {
    buildAllSharePreviewMetadata,
    buildSharePreviewMetadata,
    getSharePreviewImageOutputPath,
    getSharePreviewImageUrl,
    getSharePreviewOutputPath,
    injectSharePreviewHead,
    prepareSharePreviewTitleLines,
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
            imageUrl: "https://shaynemcgregor.dev/share/blog/a-useful-post.png",
            imageAlt: "A Useful Post social preview card",
            sourceImageUrl: "https://example.com/share.webp",
            publishedTime: "2025-10-27T18:15:00.000Z",
            modifiedTime: "2025-10-28T16:20:00.000Z",
            tag: "EdTech",
            twitterCard: "summary_large_image",
            imageWidth: 1200,
            imageHeight: 630,
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
        expect(metadata.imageUrl).toBe("https://shaynemcgregor.dev/share/blog/a-useful-post.png");
        expect(metadata.sourceImageUrl).toBe("");
        expect(metadata.fallbackImageUrl).toBe("https://shaynemcgregor.dev/profile-pic.png");
        expect(metadata.imageAlt).toBe("A Useful Post social preview card");
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

    it("returns the expected generated share-card image path and absolute URL", () => {
        expect(getSharePreviewImageOutputPath("a-useful-post")).toBe("share/blog/a-useful-post.png");
        expect(getSharePreviewImageUrl("a-useful-post")).toBe("https://shaynemcgregor.dev/share/blog/a-useful-post.png");
    });

    it("renders generated share-card image metadata with dimensions", () => {
        const metadata = buildSharePreviewMetadata(basePost);
        const head = renderSharePreviewHead(metadata);

        expect(head).toContain('property="og:image" content="https://shaynemcgregor.dev/share/blog/a-useful-post.png"');
        expect(head).toContain('property="og:image:width" content="1200"');
        expect(head).toContain('property="og:image:height" content="630"');
        expect(head).toContain('name="twitter:image" content="https://shaynemcgregor.dev/share/blog/a-useful-post.png"');
    });

    it("prepares long title lines without exceeding the card title line limit", () => {
        const lines = prepareSharePreviewTitleLines(
            "A very long article title about educational technology, software culture, and readable preview cards",
            { maxLines: 4, maxCharsPerLine: 20 }
        );

        expect(lines.length).toBeLessThanOrEqual(4);
        expect(lines.at(-1)).toMatch(/\.\.\.$/);
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
