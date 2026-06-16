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
    it("organizes sorted posts into featured, secondary, remaining, and archive links", () => {
        const posts = [
            makePost(1, { title: "Latest Post", link: "latest-post", thumbnail: "" }),
            makePost(2, { title: "Second Post", link: "second-post", thumbnail: "" }),
            makePost(3, { title: "Third Post", link: "third-post", thumbnail: "" }),
            makePost(4, { title: "Fourth Post", link: "fourth-post", thumbnail: "" }),
            makePost(5, { title: "Fifth Post", link: "fifth-post", thumbnail: "" }),
            makePost(6, { title: "Sixth Post", link: "sixth-post", thumbnail: "" }),
        ];

        renderWithProviders(<FeaturedBlogPosts initialData={posts} />);

        expect(screen.getByRole("heading", { level: 2, name: /latest writing/i })).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 3, name: "Latest Post" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 3, name: "More writing" })).toBeInTheDocument();

        const links = screen.getAllByRole("link");
        expect(links.map((link) => link.getAttribute("aria-label") || link.textContent)).toEqual([
            "Read Latest Post",
            "Read Second Post",
            "Read Third Post",
            "Read Fourth Post",
            "Read Fifth Post",
            "Read Sixth Post",
            "View all blog posts",
        ]);
        expect(links.map((link) => link.getAttribute("href"))).toEqual([
            "/blog/latest-post",
            "/blog/second-post",
            "/blog/third-post",
            "/blog/fourth-post",
            "/blog/fifth-post",
            "/blog/sixth-post",
            "/blog",
        ]);
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
        expect(screen.getByRole("img", { name: "Secondary With Image" })).toHaveAttribute(
            "src",
            posts[1].thumbnail
        );
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
