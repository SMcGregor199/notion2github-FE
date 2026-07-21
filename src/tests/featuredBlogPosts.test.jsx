import { render, screen, within } from "@testing-library/react";
import { ConfigProvider } from "antd";
import { ThemeProvider } from "@emotion/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import FeaturedBlogPosts from "../components/FeaturedBlogPosts";

const testTheme = {
    token: {
        colorPrimary: "#D86F44",
        colorTextLightSolid: "#fff",
        colorPrimaryShadow: "rgba(216, 111, 68, 0.24)",
    },
};

function makePost(index, overrides = {}) {
    return {
        id: `post-${index}`,
        tag: index % 2 === 0 ? "EdTech" : "Software Culture",
        title: `Post ${index}`,
        summary: `Summary for post ${index}.`,
        link: `post-${index}`,
        thumbnail: `https://example.com/post-${index}.webp`,
        publishedDate: `2026-01-${String(index).padStart(2, "0")}T12:00:00.000Z`,
        updatedDate: "",
        body: [],
        ...overrides,
    };
}

function renderWithProviders(ui) {
    return render(
        <ConfigProvider theme={{ token: testTheme.token }}>
            <ThemeProvider theme={testTheme}>
                <MemoryRouter>{ui}</MemoryRouter>
            </ThemeProvider>
        </ConfigProvider>
    );
}

describe("FeaturedBlogPosts", () => {
    it("organizes sorted posts into one featured, three secondary, and five more-writing links", () => {
        const posts = [
            makePost(1, { title: "Latest Post", link: "latest-post", thumbnail: "" }),
            makePost(2, { title: "Second Post", link: "second-post", thumbnail: "" }),
            makePost(3, { title: "Third Post", link: "third-post", thumbnail: "" }),
            makePost(4, { title: "Fourth Post", link: "fourth-post", thumbnail: "" }),
            makePost(5, { title: "Fifth Post", link: "fifth-post", thumbnail: "" }),
            makePost(6, { title: "Sixth Post", link: "sixth-post", thumbnail: "" }),
            makePost(7, { title: "Seventh Post", link: "seventh-post", thumbnail: "" }),
            makePost(8, { title: "Eighth Post", link: "eighth-post", thumbnail: "" }),
            makePost(9, { title: "Ninth Post", link: "ninth-post", thumbnail: "" }),
            makePost(10, { title: "Tenth Post", link: "tenth-post", thumbnail: "" }),
        ];

        renderWithProviders(<FeaturedBlogPosts initialData={posts} />);

        expect(screen.getByRole("heading", { level: 2, name: /latest writing/i })).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 3, name: "Latest Post" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 3, name: "Read Second Post" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 3, name: "Read Third Post" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 3, name: "Read Fourth Post" })).toBeInTheDocument();
        expect(screen.queryByRole("heading", { level: 3, name: "Fifth Post" })).not.toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 3, name: "More writing" })).toBeInTheDocument();

        const links = screen.getAllByRole("link");
        expect(links.map((link) => link.getAttribute("aria-label") || link.textContent)).toEqual([
            "Read Latest Post",
            "View artwork by Niyajean00 on Pinterest, opens in a new tab",
            "Read Second Post",
            "Read Third Post",
            "Read Fourth Post",
            "Read Fifth Post",
            "Read Sixth Post",
            "Read Seventh Post",
            "Read Eighth Post",
            "Read Ninth Post",
            "View all blog posts",
        ]);
        expect(links.map((link) => link.getAttribute("href"))).toEqual([
            "/blog/latest-post",
            "https://www.pinterest.com/niyajean00/",
            "/blog/second-post",
            "/blog/third-post",
            "/blog/fourth-post",
            "/blog/fifth-post",
            "/blog/sixth-post",
            "/blog/seventh-post",
            "/blog/eighth-post",
            "/blog/ninth-post",
            "/blog",
        ]);

        const postHrefs = links
            .map((link) => link.getAttribute("href"))
            .filter((href) => href !== "/blog");

        expect(new Set(postHrefs).size).toBe(postHrefs.length);
        expect(screen.queryByRole("link", { name: "Read Tenth Post" })).not.toBeInTheDocument();
    });

    it("uses post titles as thumbnail alt text for featured and secondary posts", () => {
        const posts = [
            makePost(1, { title: "Featured With Image" }),
            makePost(2, { title: "Secondary With Image" }),
        ];

        renderWithProviders(<FeaturedBlogPosts initialData={posts} />);

        expect(screen.getByRole("img", { name: "Featured With Image" })).toHaveAttribute(
            "src",
            posts[0].thumbnail
        );
        expect(screen.getByRole("img", { name: "Featured With Image" }).closest(".blog-card__media")).not.toBeNull();
        expect(screen.getByRole("img", { name: "Secondary With Image" })).toHaveAttribute(
            "src",
            posts[1].thumbnail
        );
        expect(screen.queryByRole("link", { name: /view artwork by niyajean00/i })).not.toBeInTheDocument();
    });

    it("renders a credited Pinterest flair link when three secondary posts are available", () => {
        const posts = [makePost(1), makePost(2), makePost(3), makePost(4)];

        renderWithProviders(<FeaturedBlogPosts initialData={posts} />);

        const flair = screen.getByRole("link", { name: /view artwork by niyajean00/i });
        expect(flair).toHaveAttribute("href", "https://www.pinterest.com/niyajean00/");
        expect(flair).toHaveAttribute("target", "_blank");
        expect(flair).toHaveAttribute("rel", "noopener noreferrer");
        expect(flair.querySelector('img[src="/homepage-flair.gif"]')).toHaveAttribute("alt", "");
        expect(flair.querySelector(".homepage-feature-flair__credit")).toHaveAttribute("aria-hidden", "true");
    });

    it("handles missing data safely and keeps the archive link visible", () => {
        renderWithProviders(<FeaturedBlogPosts initialData={undefined} />);

        expect(screen.getByText(/writing will appear here/i)).toBeInTheDocument();
        expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();

        const section = screen.getByRole("region", { name: /latest writing/i });
        expect(within(section).getByRole("link", { name: /view all blog posts/i })).toHaveAttribute(
            "href",
            "/blog"
        );
    });
});
