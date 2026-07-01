/* global process */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { blogPostsData } from "../src/data/notionBlogData.js";
import {
    DEFAULT_FALLBACK_IMAGE_URL,
    DEFAULT_SITE_URL,
    buildAllSharePreviewMetadata,
    getSharePreviewOutputPath,
    injectSharePreviewHead,
} from "../src/utils/sharePreviewMetadata.js";

const DEFAULT_POSTS_URL = "https://shaynemcgregordev-be.netlify.app/.netlify/functions/blog-posts-json";
const FETCH_TIMEOUT_MS = 5000;

function getEnvBoolean(name, defaultValue) {
    const value = process.env[name];
    if (value === undefined) {
        return defaultValue;
    }

    return value === "true";
}

async function fetchStoredBlogPosts(postsUrl) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
        const response = await fetch(postsUrl, {
            headers: { accept: "application/json" },
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`stored blog JSON returned HTTP ${response.status}`);
        }

        const posts = await response.json();
        if (!Array.isArray(posts)) {
            throw new Error("stored blog JSON response was not an array");
        }

        return posts;
    } finally {
        clearTimeout(timeoutId);
    }
}

async function loadPosts() {
    const postsUrl = process.env.SHARE_PREVIEW_POSTS_URL || DEFAULT_POSTS_URL;
    const strictSource = getEnvBoolean("SHARE_PREVIEW_STRICT_SOURCE", false);
    const allowLocalFallback = !strictSource && getEnvBoolean("SHARE_PREVIEW_ALLOW_LOCAL_FALLBACK", true);

    try {
        const posts = await fetchStoredBlogPosts(postsUrl);
        return { posts, source: postsUrl };
    } catch (error) {
        if (!allowLocalFallback) {
            throw new Error(`Unable to load stored blog JSON from ${postsUrl}: ${error.message}`);
        }

        console.warn(
            `[share-previews] Stored blog JSON unavailable (${error.message}); using bundled src/data/notionBlogData.js fallback.`
        );
        return { posts: blogPostsData, source: "src/data/notionBlogData.js fallback" };
    }
}

async function main() {
    const distDir = path.resolve("dist");
    const appShellPath = path.join(distDir, "index.html");
    const appShell = await readFile(appShellPath, "utf8");
    const { posts, source } = await loadPosts();
    const metadataList = buildAllSharePreviewMetadata(posts, {
        siteUrl: process.env.SHARE_PREVIEW_SITE_URL || DEFAULT_SITE_URL,
        fallbackImageUrl: process.env.SHARE_PREVIEW_FALLBACK_IMAGE_URL || DEFAULT_FALLBACK_IMAGE_URL,
    });

    for (const metadata of metadataList) {
        const relativeOutputPath = getSharePreviewOutputPath(metadata.slug);
        const outputPath = path.join(distDir, relativeOutputPath);
        const prerenderedHtml = injectSharePreviewHead(appShell, metadata);
        await mkdir(path.dirname(outputPath), { recursive: true });
        await writeFile(outputPath, prerenderedHtml, "utf8");
    }

    console.log(`[share-previews] Generated ${metadataList.length} blog post preview HTML files from ${source}.`);
}

main().catch((error) => {
    console.error(`[share-previews] ${error.message}`);
    process.exitCode = 1;
});
