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

    it("renders bold Notion body text as strong text", () => {
        const postWithBoldBodyText = {
            ...postWithoutImage,
            id: "post-4",
            link: "bold-body-post",
            body: [
                {
                    heading: "Section",
                    paras: [[
                        { text: "This is " },
                        { text: "important", bold: true },
                        { text: "." },
                    ]],
                },
            ],
        };

        renderWithProviders(
            <Routes>
                <Route path="/blog/:slug" element={<BlogDetail initialData={[postWithBoldBodyText]} />} />
            </Routes>,
            { route: "/blog/bold-body-post" }
        );

        const strongText = screen.getByText("important");

        expect(strongText.tagName).toBe("STRONG");
        expect(strongText.parentElement).toHaveTextContent("This is important.");
    });

    it("renders linked bold Notion body text as a link with strong content", () => {
        const postWithLinkedBoldBodyText = {
            ...postWithoutImage,
            id: "post-5",
            link: "linked-bold-body-post",
            body: [
                {
                    heading: "Section",
                    paras: [[
                        { text: "Read " },
                        { text: "the source", href: "https://example.com/source", bold: true },
                        { text: "." },
                    ]],
                },
            ],
        };

        renderWithProviders(
            <Routes>
                <Route path="/blog/:slug" element={<BlogDetail initialData={[postWithLinkedBoldBodyText]} />} />
            </Routes>,
            { route: "/blog/linked-bold-body-post" }
        );

        const link = screen.getByRole("link", { name: "the source" });
        const strongText = screen.getByText("the source");

        expect(link).toHaveAttribute("href", "https://example.com/source");
        expect(strongText.tagName).toBe("STRONG");
        expect(link).toContainElement(strongText);
    });

    it("renders rich Notion body blocks when legacy paragraphs are absent", () => {
        const postWithRichBlocks = {
            ...postWithoutImage,
            id: "post-6",
            link: "rich-block-post",
            body: [
                {
                    heading: "",
                    paras: [],
                    blocks: [
                        { type: "heading_1", text: "Block Heading" },
                        { type: "paragraph", text: [{ text: "A " }, { text: "bold", bold: true }, { text: " paragraph." }] },
                        { type: "quote", text: "Quoted text." },
                        { type: "bulleted_list_item", text: "Bullet item" },
                        { type: "numbered_list_item", text: "Step item" },
                        { type: "to_do", text: "Done item", checked: true },
                        { type: "code", text: "const value = 1;" },
                        { type: "divider" },
                        { type: "image", url: "https://example.com/body.webp", caption: "Body image caption" },
                        { type: "unsupported", originalType: "synced_block", text: "Fallback block text." },
                    ],
                },
            ],
        };

        renderWithProviders(
            <Routes>
                <Route path="/blog/:slug" element={<BlogDetail initialData={[postWithRichBlocks]} />} />
            </Routes>,
            { route: "/blog/rich-block-post" }
        );

        expect(screen.getByRole("heading", { name: "Block Heading", level: 2 })).toBeInTheDocument();
        expect(screen.getByText("bold").tagName).toBe("STRONG");
        expect(screen.getByText("Quoted text.")).toBeInTheDocument();
        expect(screen.getByText("Bullet item")).toBeInTheDocument();
        expect(screen.getByText("Step item")).toBeInTheDocument();
        expect(screen.getByRole("checkbox", { name: "Done item" })).toBeChecked();
        expect(screen.getByText("const value = 1;")).toBeInTheDocument();
        expect(screen.getAllByRole("separator").some((element) => element.tagName === "HR")).toBe(true);
        expect(screen.getByRole("img", { name: "Body image caption" })).toHaveAttribute("src", "https://example.com/body.webp");
        expect(screen.getByText("Fallback block text.")).toBeInTheDocument();
    });

    it("renders Markdown body content when bodyMarkdown is available", () => {
        const postWithMarkdownBody = {
            ...postWithoutImage,
            id: "post-9",
            link: "markdown-body-post",
            bodyMarkdown: [
                "## Markdown Heading",
                "",
                "Read **the guide** at [the source](https://example.com/source).",
                "",
                "> Quoted markdown.",
                "",
                "![Markdown image](https://example.com/markdown.webp)",
            ].join("\n"),
        };

        renderWithProviders(
            <Routes>
                <Route path="/blog/:slug" element={<BlogDetail initialData={[postWithMarkdownBody]} />} />
            </Routes>,
            { route: "/blog/markdown-body-post" }
        );

        expect(screen.getByRole("heading", { name: "Markdown Heading", level: 3 })).toBeInTheDocument();
        expect(screen.getByText("the guide").tagName).toBe("STRONG");
        expect(screen.getByRole("link", { name: "the source" })).toHaveAttribute("href", "https://example.com/source");
        expect(screen.getByText("Quoted markdown.")).toBeInTheDocument();
        expect(screen.getByRole("img", { name: "Markdown image" })).toHaveAttribute("src", "https://example.com/markdown.webp");
    });

    it("renders unsafe Notion body links as text", () => {
        const postWithUnsafeBodyLink = {
            ...postWithoutImage,
            id: "post-7",
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

    it("renders unsafe linked bold Notion body spans without anchors", () => {
        const postWithUnsafeLinkedBoldBodyText = {
            ...postWithoutImage,
            id: "post-8",
            link: "unsafe-linked-bold-body-post",
            body: [
                {
                    heading: "Section",
                    paras: [[{ text: "Do not execute", href: "javascript:alert(1)", bold: true }]],
                },
            ],
        };

        renderWithProviders(
            <Routes>
                <Route path="/blog/:slug" element={<BlogDetail initialData={[postWithUnsafeLinkedBoldBodyText]} />} />
            </Routes>,
            { route: "/blog/unsafe-linked-bold-body-post" }
        );

        const strongText = screen.getByText("Do not execute");

        expect(strongText.tagName).toBe("STRONG");
        expect(screen.queryByRole("link", { name: "Do not execute" })).not.toBeInTheDocument();
    });
});
