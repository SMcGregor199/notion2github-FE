import { act, render, screen, waitFor } from "@testing-library/react";
import { ConfigProvider } from "antd";
import { ThemeProvider } from "@emotion/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BlogDetail from "../pages/BlogDetail";

const theme = {
    token: {
        colorPrimary: "#D86F44",
        colorTextLightSolid: "#fff",
        colorPrimaryShadow: "rgba(216, 111, 68, 0.24)",
    },
};

const post = {
    id: "post-linkedin",
    title: "A post with a discussion",
    summary: "A summary.",
    link: "post-with-a-discussion",
    publishedDate: "2026-01-10T13:58:00.000Z",
    updatedDate: "",
    bodyMarkdown: "A short article body.",
    thumbnail: "https://example.com/feature.webp",
    linkedinDiscussionUrl: "https://www.linkedin.com/posts/example_123",
};

const originalMatchMedia = window.matchMedia;
const originalIntersectionObserver = window.IntersectionObserver;

function setViewport(desktop) {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(min-width: 1100px)" && desktop,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
    }));
}

function renderDetail(postData = post) {
    return render(
        <ConfigProvider theme={{ token: theme.token }}>
            <ThemeProvider theme={theme}>
                <MemoryRouter initialEntries={[`/blog/${postData.link}`]}>
                    <Routes>
                        <Route path="/blog/:slug" element={<BlogDetail initialData={[postData]} />} />
                    </Routes>
                </MemoryRouter>
            </ThemeProvider>
        </ConfigProvider>,
    );
}

afterEach(() => {
    window.matchMedia = originalMatchMedia;
    if (originalIntersectionObserver) {
        window.IntersectionObserver = originalIntersectionObserver;
    } else {
        delete window.IntersectionObserver;
    }
});

describe("LinkedIn discussion CTA", () => {
    it("does not render a CTA or rail without a valid discussion URL", () => {
        setViewport(false);
        renderDetail({ ...post, linkedinDiscussionUrl: "https://linkedin.example.com/posts/not-valid" });

        expect(screen.queryByRole("heading", { name: /continue the conversation/i })).not.toBeInTheDocument();
        expect(screen.queryByTestId("article-end-sentinel")).not.toBeInTheDocument();
    });

    it("renders an inline CTA on mobile and tablet layouts", () => {
        setViewport(false);
        renderDetail();

        const link = screen.getByRole("link", { name: "Join discussion" });
        expect(link.closest("aside")).toHaveClass("linkedin-discussion-cta--inline");
        expect(link).toHaveAttribute("href", post.linkedinDiscussionUrl);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
        expect(screen.getByText("Opens in a new tab.")).toBeVisible();
    });

    it("reveals the desktop rail only after the article-end sentinel is reached", async () => {
        setViewport(true);
        let observe;
        let callback;
        window.IntersectionObserver = class {
            constructor(nextCallback) {
                callback = nextCallback;
            }
            observe = vi.fn((element) => {
                observe = element;
            });
            disconnect = vi.fn();
        };

        renderDetail();

        expect(observe).toBe(screen.getByTestId("article-end-sentinel"));
        expect(screen.queryByRole("heading", { name: /continue the conversation/i })).not.toBeInTheDocument();

        await act(async () => {
            callback([{ isIntersecting: true }]);
        });

        await waitFor(() => {
            expect(screen.getByRole("heading", { name: /continue the conversation/i })).toBeInTheDocument();
        });
        expect(screen.getByRole("link", { name: "Join discussion" }).closest("aside")).toHaveClass("linkedin-discussion-cta--rail");
    });
});
