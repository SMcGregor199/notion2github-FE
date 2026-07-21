import { render, screen, waitFor } from "@testing-library/react";
import { ConfigProvider } from "antd";
import { ThemeProvider } from "@emotion/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Resume from "../pages/Resume.jsx";

const testTheme = {
    token: {
        colorPrimary: "#D86F44",
        colorTextLightSolid: "#fff",
        colorPrimaryShadow: "rgba(216, 111, 68, 0.24)",
    },
};

function renderResume() {
    return render(
        <ConfigProvider theme={testTheme}>
            <ThemeProvider theme={testTheme}>
                <MemoryRouter>
                    <Resume />
                </MemoryRouter>
            </ThemeProvider>
        </ConfigProvider>
    );
}

describe("Resume page", () => {
    beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn());
    });

    it("keeps the existing PDF available while no approved web resume has been published", async () => {
        vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ status: "draft", markdown: "" }));

        const { container } = renderResume();

        await waitFor(() => {
            expect(screen.queryByRole("status")).not.toBeInTheDocument();
        });
        expect(screen.getByRole("link", { name: /download pdf/i })).toHaveAttribute("href", "/resume.pdf");
        expect(container.querySelector("object")).toHaveAttribute("data", "/resume.pdf");
    });

    it("opens external resume links in a new tab", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                status: "approved",
                title: "Shayne McGregor — Resume",
                markdown: "# Shayne McGregor\n\n[GitHub](https://github.com/SMcGregor199) · [LinkedIn](https://linkedin.com/in/shayne-mcgregor)",
            }),
        });

        renderResume();

        const github = await screen.findByRole("link", { name: "GitHub" });
        const linkedin = screen.getByRole("link", { name: "LinkedIn" });

        expect(github).toHaveAttribute("target", "_blank");
        expect(github).toHaveAttribute("rel", "noopener noreferrer");
        expect(linkedin).toHaveAttribute("target", "_blank");
        expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders approved Markdown content when the publishing workflow has supplied it", async () => {
        vi.mocked(fetch).mockResolvedValueOnce(
            jsonResponse({
                status: "approved",
                title: "Shayne McGregor — Resume",
                markdown: "# Shayne McGregor\n\n## Experience\n\nBuilt useful systems.",
            }),
        );

        const { container } = renderResume();

        expect(await screen.findByRole("heading", { level: 1, name: "Shayne McGregor" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 2, name: "Experience" })).toBeInTheDocument();
        expect(screen.getAllByRole("heading", { level: 1, name: "Shayne McGregor" })).toHaveLength(1);
        expect(container.querySelector("object")).toBeNull();
    });
});

function jsonResponse(body) {
    return {
        ok: true,
        json: async () => body,
    };
}
