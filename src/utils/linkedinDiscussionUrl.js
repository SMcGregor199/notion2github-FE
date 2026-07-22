export function getValidLinkedInDiscussionUrl(value) {
    if (typeof value !== "string" || !value.trim()) {
        return "";
    }

    try {
        const url = new URL(value.trim());
        const hostname = url.hostname.toLowerCase();
        const isLinkedInHost = hostname === "linkedin.com" || hostname.endsWith(".linkedin.com");
        return url.protocol === "https:" && isLinkedInHost && !url.username && !url.password ? url.href : "";
    } catch {
        return "";
    }
}
