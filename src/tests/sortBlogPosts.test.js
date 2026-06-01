import { describe, expect, it } from "vitest";
import { sortBlogPostsByNewest } from "../utils/sortBlogPosts";

describe("sortBlogPostsByNewest", () => {
    it("orders posts by publishedDate with newest posts first", () => {
        const oldestPost = {
            id: "oldest",
            title: "Oldest Post",
            publishedDate: "2025-10-01T12:00:00.000Z",
        };
        const newestPost = {
            id: "newest",
            title: "Newest Post",
            publishedDate: "2026-06-01T12:00:00.000Z",
        };
        const middlePost = {
            id: "middle",
            title: "Middle Post",
            publishedDate: "2026-01-01T12:00:00.000Z",
        };

        const sortedPosts = sortBlogPostsByNewest([oldestPost, newestPost, middlePost]);

        expect(sortedPosts.map((post) => post.id)).toEqual(["newest", "middle", "oldest"]);
    });

    it("does not mutate the source array", () => {
        const posts = [
            { id: "oldest", publishedDate: "2025-10-01T12:00:00.000Z" },
            { id: "newest", publishedDate: "2026-06-01T12:00:00.000Z" },
        ];

        sortBlogPostsByNewest(posts);

        expect(posts.map((post) => post.id)).toEqual(["oldest", "newest"]);
    });
});
