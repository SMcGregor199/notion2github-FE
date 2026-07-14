import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ConfigProvider } from "antd";
import { ThemeProvider } from "@emotion/react";
import { describe, expect, it } from "vitest";
import BlogPage from "../pages/Blog";
import BlogCardLong from "../components/BlogCardLong";
import BlogDetail from "../pages/BlogDetail";

const postWithImage = {
    id: "post-1",
    tag: "EdTech",
    title: "Image Ready Post",
    summary: "A post with a valid thumbnail.",
    link: "image-ready-post",
    thumbnail: "https://example.com/image.webp",
    publishedDate: "2025-10-27T18:15:00.000Z",
    updatedDate: "2025-10-28T16:20:00.000Z",
    body: [
        {
            heading: "Section",
            paras: ["Paragraph one."],
        },
    ],
};

const postWithoutImage = {
    ...postWithImage,
    id: "post-2",
    link: "image-missing-post",
    thumbnail: "",
};

const testTheme = {
    token: {
        colorPrimary: "#D86F44",
        colorTextLightSolid: "#fff",
        colorPrimaryShadow: "rgba(216, 111, 68, 0.24)",
    },
};

function renderWithProviders(ui, { route = "/" } = {}) {
    return render(
        <ConfigProvider theme={{ token: testTheme.token }}>
            <ThemeProvider theme={testTheme}>
                <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
            </ThemeProvider>
        </ConfigProvider>
    );
}

describe("Notion image rendering", () => {
    it("renders the blog index card image when a thumbnail exists", () => {
        renderWithProviders(<BlogPage initialData={[postWithImage]} />);

        expect(screen.getByRole("img", { name: postWithImage.title })).toHaveAttribute(
            "src",
            postWithImage.thumbnail
        );
    });

    it("skips the blog index card image when the thumbnail is missing", () => {
        renderWithProviders(<BlogPage initialData={[postWithoutImage]} />);

        expect(screen.queryByRole("img", { name: postWithoutImage.title })).not.toBeInTheDocument();
    });

    it("shows a loading status on the blog page while data is fetching", () => {
        renderWithProviders(
            <BlogPage initialData={[postWithImage]} isBlogDataLoading={true} />
        );

        expect(screen.getByRole("status")).toHaveTextContent(/loading latest posts/i);
    });

    it("renders the featured blog card image when a thumbnail exists", () => {
        renderWithProviders(<BlogCardLong {...postWithImage} />);

        expect(screen.getByRole("img", { name: postWithImage.title })).toHaveAttribute(
            "src",
            postWithImage.thumbnail
        );
    });

    it("skips the featured blog card image when the thumbnail is missing", () => {
        renderWithProviders(<BlogCardLong {...postWithoutImage} />);

        expect(screen.queryByRole("img", { name: postWithoutImage.title })).not.toBeInTheDocument();
    });

    it("renders the blog detail image when a thumbnail exists", () => {
        renderWithProviders(
            <Routes>
                <Route path="/blog/:slug" element={<BlogDetail initialData={[postWithImage]} />} />
            </Routes>,
            { route: "/blog/image-ready-post" }
        );

        expect(screen.getByRole("img", { name: postWithImage.title })).toHaveAttribute(
            "src",
            postWithImage.thumbnail
        );
    });

    it("skips the blog detail image when the thumbnail is missing", () => {
        renderWithProviders(
            <Routes>
                <Route path="/blog/:slug" element={<BlogDetail initialData={[postWithoutImage]} />} />
            </Routes>,
            { route: "/blog/image-missing-post" }
        );

        expect(screen.queryByRole("img", { name: postWithoutImage.title })).not.toBeInTheDocument();
    });

    it("renders linked Notion body text as an anchor", () => {
        const postWithBodyLink = {
            ...postWithoutImage,
            id: "post-3",
            link: "linked-body-post",
            body: [
                {
                    heading: "Section",
                    paras: [[
                        { text: "Read " },
                        { text: "the source", href: "https://example.com/source" },
                        { text: " for more." },
                    ]],
                },
            ],
        };

        renderWithProviders(
            <Routes>
                <Route path="/blog/:slug" element={<BlogDetail initialData={[postWithBodyLink]} />} />
            </Routes>,
            { route: "/blog/linked-body-post" }
        );

        const link = screen.getByRole("link", { name: "the source" });

        expect(link.parentElement).toHaveTextContent("Read the source for more.");
        expect(link).toHaveAttribute(
            "href",
            "https://example.com/source"
        );
        expect(link).toHaveAttribute("target", "_blank");
    });

    it("renders unsafe Notion body links as text", () => {
        const postWithUnsafeBodyLink = {
            ...postWithoutImage,
            id: "post-4",
            link: "unsafe-body-post",
            body: [
                {
                    heading: "Section",
                    paras: [[{ text: "Do not execute", href: "javascript:alert(1)" }]],
                },
            ],
        };

        renderWithProviders(
            <Routes>
                <Route path="/blog/:slug" element={<BlogDetail initialData={[postWithUnsafeBodyLink]} />} />
            </Routes>,
            { route: "/blog/unsafe-body-post" }
        );

        expect(screen.getByText("Do not execute")).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "Do not execute" })).not.toBeInTheDocument();
    });
});
