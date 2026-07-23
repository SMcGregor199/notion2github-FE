/* global process */
import { Buffer } from "node:buffer";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { blogPostsData } from "../src/data/notionBlogData.js";
import {
    DEFAULT_FALLBACK_IMAGE_URL,
    DEFAULT_SITE_URL,
    STATIC_SHARE_PREVIEW_IMAGE_PATH,
    STATIC_SHARE_PREVIEW_ROUTES,
    buildAllSharePreviewMetadata,
    buildStaticSharePreviewMetadata,
    escapeHtml,
    getSharePreviewImageOutputPath,
    getSharePreviewOutputPath,
    getStaticSharePreviewOutputPath,
    injectSharePreviewHead,
    prepareSharePreviewTitleLines,
} from "../src/utils/sharePreviewMetadata.js";

const DEFAULT_POSTS_URL = "https://shaynemcgregordev-be.netlify.app/.netlify/functions/blog-posts-json";
const FETCH_TIMEOUT_MS = 5000;
const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;
const RIGHT_IMAGE_WIDTH = 486;
const RIGHT_IMAGE_HEIGHT = 330;
const RIGHT_IMAGE_LEFT = 676;
const RIGHT_IMAGE_TOP = 96;
const RIGHT_IMAGE_RADIUS = 28;
const PROFILE_IMAGE_PATH = path.resolve("public/profile-pic.png");
const FALLBACK_PANEL_IMAGE_PATH = path.resolve("public/background-v2.png");

function escapeSvg(value) {
    return escapeHtml(value);
}

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

async function fileExists(filePath) {
    try {
        await access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function fetchImageBuffer(imageUrl) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
        const response = await fetch(imageUrl, {
            headers: { accept: "image/avif,image/webp,image/png,image/jpeg,image/*" },
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`image request returned HTTP ${response.status}`);
        }

        return Buffer.from(await response.arrayBuffer());
    } finally {
        clearTimeout(timeoutId);
    }
}

async function loadPanelImage(metadata) {
    if (metadata.sourceImageUrl) {
        try {
            return await fetchImageBuffer(metadata.sourceImageUrl);
        } catch (error) {
            console.warn(`[share-previews] Thumbnail unavailable for ${metadata.slug} (${error.message}); using local fallback panel image.`);
        }
    }

    if (await fileExists(FALLBACK_PANEL_IMAGE_PATH)) {
        return readFile(FALLBACK_PANEL_IMAGE_PATH);
    }

    return readFile(PROFILE_IMAGE_PATH);
}

function createRoundedMask(width, height, radius) {
    return Buffer.from(`
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#fff"/>
        </svg>
    `);
}

async function createRoundedImage(inputBuffer, width, height, radius) {
    const imageBuffer = await sharp(inputBuffer)
        .resize(width, height, { fit: "cover", position: "center" })
        .png()
        .toBuffer();
    const maskBuffer = createRoundedMask(width, height, radius);

    return sharp(imageBuffer)
        .composite([{ input: maskBuffer, blend: "dest-in" }])
        .png()
        .toBuffer();
}

async function createCircularImage(inputBuffer, size) {
    return createRoundedImage(inputBuffer, size, size, size / 2);
}

function renderTitleTspans(lines, x, y, lineHeight) {
    return lines
        .map((line, index) => {
            const dy = index === 0 ? 0 : lineHeight;
            return `<tspan x="${x}" dy="${dy}">${escapeSvg(line)}</tspan>`;
        })
        .join("");
}

function renderFooterTitle(title) {
    const normalizedTitle = title.length > 76 ? `${title.slice(0, 73).trim()}...` : title;
    return escapeSvg(normalizedTitle);
}

function createBaseCardSvg(metadata) {
    const titleLines = prepareSharePreviewTitleLines(metadata.title, {
        maxLines: 4,
        maxCharsPerLine: 14,
    });

    return Buffer.from(`
        <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="#f7f4ef"/>
            <rect x="650" y="0" width="550" height="548" fill="#ece7df"/>
            <rect x="0" y="548" width="${CARD_WIDTH}" height="82" fill="#e7e3dc"/>
            <rect x="${RIGHT_IMAGE_LEFT}" y="${RIGHT_IMAGE_TOP}" width="${RIGHT_IMAGE_WIDTH}" height="${RIGHT_IMAGE_HEIGHT}" rx="${RIGHT_IMAGE_RADIUS}" fill="#d8d1c7"/>
            <text x="72" y="78" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="2" fill="#7a4d36">${escapeSvg(metadata.siteName.toUpperCase())}</text>
            <text x="72" y="154" font-family="Georgia, 'Times New Roman', serif" font-size="52" font-weight="700" fill="#1f1b18">${renderTitleTspans(titleLines, 72, 154, 58)}</text>
            <text x="146" y="454" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" fill="#2a2520">Shayne McGregor</text>
            <text x="146" y="484" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="500" fill="#756d64">Writing on software, learning, and the web</text>
            <text x="72" y="598" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" fill="#4e4740">${renderFooterTitle(metadata.title)}</text>
        </svg>
    `);
}

function createStaticSiteCardSvg() {
    return Buffer.from(`
        <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="#f7f4ef"/>
            <rect x="650" y="0" width="550" height="548" fill="#ece7df"/>
            <rect x="0" y="548" width="${CARD_WIDTH}" height="82" fill="#e7e3dc"/>
            <rect x="${RIGHT_IMAGE_LEFT}" y="${RIGHT_IMAGE_TOP}" width="${RIGHT_IMAGE_WIDTH}" height="${RIGHT_IMAGE_HEIGHT}" rx="${RIGHT_IMAGE_RADIUS}" fill="#d8d1c7"/>
            <text x="72" y="78" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="2" fill="#7a4d36">NOTES FROM SHAYNE</text>
            <text x="72" y="170" font-family="Georgia, 'Times New Roman', serif" font-size="54" font-weight="700" fill="#1f1b18">Notes on</text>
            <text x="72" y="232" font-family="Georgia, 'Times New Roman', serif" font-size="54" font-weight="700" fill="#1f1b18">engineering, systems,</text>
            <text x="72" y="294" font-family="Georgia, 'Times New Roman', serif" font-size="54" font-weight="700" fill="#1f1b18">and the ideas behind</text>
            <text x="72" y="356" font-family="Georgia, 'Times New Roman', serif" font-size="54" font-weight="700" fill="#1f1b18">the work.</text>
            <text x="146" y="454" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" fill="#2a2520">Shayne McGregor</text>
            <text x="146" y="484" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="500" fill="#756d64">Writing on software, learning, and the web</text>
            <text x="72" y="598" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" fill="#4e4740">shaynemcgregor.dev</text>
        </svg>
    `);
}

async function renderShareCard(metadata, outputPath) {
    if (!(await fileExists(PROFILE_IMAGE_PATH))) {
        throw new Error(`Required profile image asset missing: ${PROFILE_IMAGE_PATH}`);
    }

    const baseSvg = createBaseCardSvg(metadata);
    const panelImage = await createRoundedImage(
        await loadPanelImage(metadata),
        RIGHT_IMAGE_WIDTH,
        RIGHT_IMAGE_HEIGHT,
        RIGHT_IMAGE_RADIUS
    );
    const profileImage = await createCircularImage(await readFile(PROFILE_IMAGE_PATH), 56);

    await mkdir(path.dirname(outputPath), { recursive: true });
    await sharp(baseSvg)
        .composite([
            { input: panelImage, left: RIGHT_IMAGE_LEFT, top: RIGHT_IMAGE_TOP },
            { input: profileImage, left: 72, top: 426 },
            {
                input: Buffer.from(`
                    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="454" r="30" fill="none" stroke="#f7f4ef" stroke-width="4"/>
                    </svg>
                `),
                left: 0,
                top: 0,
            },
        ])
        .png()
        .toFile(outputPath);
}

async function renderStaticSiteCard(outputPath) {
    if (!(await fileExists(PROFILE_IMAGE_PATH))) {
        throw new Error(`Required profile image asset missing: ${PROFILE_IMAGE_PATH}`);
    }

    const panelImage = await createRoundedImage(
        await readFile(FALLBACK_PANEL_IMAGE_PATH),
        RIGHT_IMAGE_WIDTH,
        RIGHT_IMAGE_HEIGHT,
        RIGHT_IMAGE_RADIUS
    );
    const profileImage = await createCircularImage(await readFile(PROFILE_IMAGE_PATH), 56);

    await mkdir(path.dirname(outputPath), { recursive: true });
    await sharp(createStaticSiteCardSvg())
        .composite([
            { input: panelImage, left: RIGHT_IMAGE_LEFT, top: RIGHT_IMAGE_TOP },
            { input: profileImage, left: 72, top: 426 },
            {
                input: Buffer.from(`
                    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="454" r="30" fill="none" stroke="#f7f4ef" stroke-width="4"/>
                    </svg>
                `),
                left: 0,
                top: 0,
            },
        ])
        .png()
        .toFile(outputPath);
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
    const staticMetadataList = STATIC_SHARE_PREVIEW_ROUTES.map((routePath) => buildStaticSharePreviewMetadata(routePath, {
        siteUrl: process.env.SHARE_PREVIEW_SITE_URL || DEFAULT_SITE_URL,
    }));
    const staticImageOutputPath = path.join(distDir, STATIC_SHARE_PREVIEW_IMAGE_PATH);

    await renderStaticSiteCard(staticImageOutputPath);

    for (const metadata of staticMetadataList) {
        const outputPath = path.join(distDir, getStaticSharePreviewOutputPath(metadata.routePath));
        const prerenderedHtml = injectSharePreviewHead(appShell, metadata);
        await mkdir(path.dirname(outputPath), { recursive: true });
        await writeFile(outputPath, prerenderedHtml, "utf8");
    }

    for (const metadata of metadataList) {
        const relativeOutputPath = getSharePreviewOutputPath(metadata.slug);
        const relativeImageOutputPath = getSharePreviewImageOutputPath(metadata.slug);
        const outputPath = path.join(distDir, relativeOutputPath);
        const imageOutputPath = path.join(distDir, relativeImageOutputPath);
        await renderShareCard(metadata, imageOutputPath);
        const prerenderedHtml = injectSharePreviewHead(appShell, metadata);
        await mkdir(path.dirname(outputPath), { recursive: true });
        await writeFile(outputPath, prerenderedHtml, "utf8");
    }

    console.log(`[share-previews] Generated ${staticMetadataList.length} static page previews and ${metadataList.length} blog post preview HTML files and share-card images from ${source}.`);
}

main().catch((error) => {
    console.error(`[share-previews] ${error.message}`);
    process.exitCode = 1;
});
