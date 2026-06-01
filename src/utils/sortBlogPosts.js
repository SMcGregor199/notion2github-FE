function getPublishedTime(post) {
    const timestamp = Date.parse(post?.publishedDate ?? "");
    return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
}

export function sortBlogPostsByNewest(posts) {
    return [...posts].sort((postA, postB) => {
        return getPublishedTime(postB) - getPublishedTime(postA);
    });
}
