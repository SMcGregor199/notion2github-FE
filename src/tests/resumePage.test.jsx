import { render, screen, waitFor } from "@testing-library/react";
import { ConfigProvider } from "antd";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Resume from "../pages/Resume.jsx";

function renderResume() {
    return render(
        <ConfigProvider>
            <MemoryRouter>
                <Resume />
            </MemoryRouter>
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
