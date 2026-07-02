export const DEFAULT_SITE_NAME = "shaynemcgregor.dev";
export const DEFAULT_SITE_URL = "https://shaynemcgregor.dev";
export const DEFAULT_FALLBACK_IMAGE_URL = "https://shaynemcgregor.dev/profile-pic.png";
export const DEFAULT_DESCRIPTION = "Read Shayne McGregor's latest writing.";
export const SHARE_PREVIEW_IMAGE_WIDTH = 1200;
export const SHARE_PREVIEW_IMAGE_HEIGHT = 630;

const MAX_DESCRIPTION_LENGTH = 200;

function normalizeText(value) {
    return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function truncateDescription(description) {
    if (description.length <= MAX_DESCRIPTION_LENGTH) {
        return description;
    }

    const clipped = description.slice(0, MAX_DESCRIPTION_LENGTH + 1);
    const lastSpace = clipped.lastIndexOf(" ");
    const truncated = lastSpace > 120 ? clipped.slice(0, lastSpace) : clipped.slice(0, MAX_DESCRIPTION_LENGTH);
    return `${truncated.trim()}...`;
}

function getFirstBodyParagraph(body) {
    if (!Array.isArray(body)) {
        return "";
    }

    for (const section of body) {
        if (!Array.isArray(section?.paras)) {
            continue;
        }

        for (const paragraph of section.paras) {
            const normalized = normalizeText(paragraph);
            if (normalized) {
                return normalized;
            }
        }
    }

    return "";
}

function isAbsoluteHttpUrl(value) {
    try {
        const parsedUrl = new URL(value);
        return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
        return false;
    }
}

function normalizeSlug(value) {
    const slug = normalizeText(value).replace(/^\/+/, "");

    if (!slug) {
        return "";
    }

    if (slug.includes("..") || slug.includes("/") || slug.includes("\\")) {
        throw new Error(`Blog share preview slug "${slug}" is not safe for a /blog/:slug route.`);
    }

    return slug;
}

function toIsoDate(value) {
    const normalized = normalizeText(value);
    if (!normalized) {
        return "";
    }

    const timestamp = Date.parse(normalized);
    return Number.isNaN(timestamp) ? "" : new Date(timestamp).toISOString();
}

function combineUrl(baseUrl, path) {
    const normalizedBaseUrl = normalizeText(baseUrl).replace(/\/+$/, "");
    const normalizedPath = normalizeText(path).replace(/^\/+/, "");
    return `${normalizedBaseUrl}/${normalizedPath}`;
}

export function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

export function prepareSharePreviewTitleLines(title, options = {}) {
    const normalizedTitle = normalizeText(title);
    const maxLines = options.maxLines ?? 4;
    const maxCharsPerLine = options.maxCharsPerLine ?? 18;
    const words = normalizedTitle.split(" ").filter(Boolean);
    const lines = [];
    let currentLine = "";

    for (const word of words) {
        const nextLine = currentLine ? `${currentLine} ${word}` : word;
        if (nextLine.length <= maxCharsPerLine) {
            currentLine = nextLine;
            continue;
        }

        if (currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            lines.push(word.slice(0, maxCharsPerLine));
            currentLine = word.slice(maxCharsPerLine);
        }

        if (lines.length === maxLines) {
            break;
        }
    }

    if (currentLine && lines.length < maxLines) {
        lines.push(currentLine);
    }

    if (lines.length > maxLines) {
        lines.length = maxLines;
    }

    const usedWords = lines.join(" ").split(" ").filter(Boolean).length;
    const wasTruncated = usedWords < words.length || lines.some((line) => line.length > maxCharsPerLine);
    if (wasTruncated && lines.length) {
        const lastIndex = lines.length - 1;
        const line = lines[lastIndex].replace(/\.*$/, "");
        lines[lastIndex] = line.length > maxCharsPerLine - 3 ? `${line.slice(0, maxCharsPerLine - 3)}...` : `${line}...`;
    }

    return lines;
}

export function getSharePreviewOutputPath(slug) {
    const normalizedSlug = normalizeSlug(slug);
    if (!normalizedSlug) {
        throw new Error("Blog share preview output path requires a slug.");
    }

    return `blog/${normalizedSlug}/index.html`;
}

export function getSharePreviewImageOutputPath(slug) {
    const normalizedSlug = normalizeSlug(slug);
    if (!normalizedSlug) {
        throw new Error("Blog share preview image output path requires a slug.");
    }

    return `share/blog/${normalizedSlug}.png`;
}

export function getSharePreviewImageUrl(slug, options = {}) {
    const siteUrl = (normalizeText(options.siteUrl) || DEFAULT_SITE_URL).replace(/\/+$/, "");
    return combineUrl(siteUrl, getSharePreviewImageOutputPath(slug));
}

export function buildSharePreviewMetadata(post, options = {}) {
    const title = normalizeText(post?.title);
    if (!title) {
        throw new Error("Blog share preview requires a non-empty post.title.");
    }

    const slug = normalizeSlug(post?.link);
    if (!slug) {
        throw new Error(`Blog share preview for "${title}" requires a non-empty post.link.`);
    }

    const siteName = normalizeText(options.siteName) || DEFAULT_SITE_NAME;
    const siteUrl = (normalizeText(options.siteUrl) || DEFAULT_SITE_URL).replace(/\/+$/, "");
    const fallbackImageUrl = normalizeText(options.fallbackImageUrl) || DEFAULT_FALLBACK_IMAGE_URL;
    const summary = normalizeText(post?.summary);
    const bodyDescription = getFirstBodyParagraph(post?.body);
    const description = truncateDescription(summary || bodyDescription || DEFAULT_DESCRIPTION);
    const thumbnail = normalizeText(post?.thumbnail);
    const hasPostImage = isAbsoluteHttpUrl(thumbnail);
    const sourceImageUrl = hasPostImage ? thumbnail : "";
    const imageUrl = normalizeText(options.shareImageUrl) || getSharePreviewImageUrl(slug, { siteUrl });
    const canonicalUrl = `${siteUrl}/blog/${slug}`;
    const tag = normalizeText(post?.tag);
    const publishedTime = toIsoDate(post?.publishedDate);
    const modifiedTime = toIsoDate(post?.updatedDate);

    if (!isAbsoluteHttpUrl(imageUrl)) {
        throw new Error(`Blog share preview for "${title}" requires an absolute HTTP(S) image URL.`);
    }

    return {
        slug,
        title,
        documentTitle: `${title} | Shayne McGregor`,
        description,
        canonicalUrl,
        siteName,
        imageUrl,
        imageAlt: `${title} social preview card`,
        sourceImageUrl,
        fallbackImageUrl,
        publishedTime,
        modifiedTime,
        tag,
        twitterCard: "summary_large_image",
        imageWidth: SHARE_PREVIEW_IMAGE_WIDTH,
        imageHeight: SHARE_PREVIEW_IMAGE_HEIGHT,
    };
}

export function buildAllSharePreviewMetadata(posts, options = {}) {
    if (!Array.isArray(posts)) {
        throw new Error("Blog share preview generation requires an array of posts.");
    }

    const seenSlugs = new Set();

    return posts.map((post, index) => {
        try {
            const metadata = buildSharePreviewMetadata(post, options);
            if (seenSlugs.has(metadata.slug)) {
                throw new Error(`Duplicate blog share preview slug "${metadata.slug}".`);
            }
            seenSlugs.add(metadata.slug);
            return metadata;
        } catch (error) {
            throw new Error(`Invalid blog post at index ${index}: ${error.message}`);
        }
    });
}

function renderTag(tagName, attributes) {
    const renderedAttributes = Object.entries(attributes)
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([name, value]) => `${name}="${escapeHtml(value)}"`)
        .join(" ");

    return `<${tagName} ${renderedAttributes}>`;
}

export function renderSharePreviewHead(metadata) {
    const lines = [
        `<title>${escapeHtml(metadata.documentTitle)}</title>`,
        renderTag("meta", { name: "description", content: metadata.description }),
        renderTag("link", { rel: "canonical", href: metadata.canonicalUrl }),
        renderTag("meta", { property: "og:type", content: "article" }),
        renderTag("meta", { property: "og:site_name", content: metadata.siteName }),
        renderTag("meta", { property: "og:title", content: metadata.title }),
        renderTag("meta", { property: "og:description", content: metadata.description }),
        renderTag("meta", { property: "og:url", content: metadata.canonicalUrl }),
        renderTag("meta", { property: "og:image", content: metadata.imageUrl }),
        renderTag("meta", { property: "og:image:alt", content: metadata.imageAlt }),
        renderTag("meta", { property: "og:image:width", content: metadata.imageWidth }),
        renderTag("meta", { property: "og:image:height", content: metadata.imageHeight }),
    ];

    if (metadata.publishedTime) {
        lines.push(renderTag("meta", { property: "article:published_time", content: metadata.publishedTime }));
    }

    if (metadata.modifiedTime) {
        lines.push(renderTag("meta", { property: "article:modified_time", content: metadata.modifiedTime }));
    }

    if (metadata.tag) {
        lines.push(renderTag("meta", { property: "article:tag", content: metadata.tag }));
    }

    lines.push(
        renderTag("meta", { name: "twitter:card", content: metadata.twitterCard }),
        renderTag("meta", { name: "twitter:title", content: metadata.title }),
        renderTag("meta", { name: "twitter:description", content: metadata.description }),
        renderTag("meta", { name: "twitter:image", content: metadata.imageUrl }),
        renderTag("meta", { name: "twitter:image:alt", content: metadata.imageAlt })
    );

    return lines.map((line) => `    ${line}`).join("\n");
}

export function injectSharePreviewHead(html, metadata) {
    if (!html.includes("</head>")) {
        throw new Error("Cannot inject share preview metadata because </head> was not found.");
    }

    const htmlWithoutTitle = html.replace(/\s*<title>[\s\S]*?<\/title>\s*/i, "\n");
    const headCloseIndex = htmlWithoutTitle.indexOf("</head>");
    const headHtml = htmlWithoutTitle.slice(0, headCloseIndex);
    const headScriptMatch = headHtml.match(/<script\b/i);
    const insertionIndex = headScriptMatch?.index ?? headCloseIndex;

    return [
        htmlWithoutTitle.slice(0, insertionIndex),
        renderSharePreviewHead(metadata),
        "\n",
        htmlWithoutTitle.slice(insertionIndex),
    ].join("");
}
