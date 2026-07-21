import { render, screen } from "@testing-library/react";
import { ConfigProvider } from "antd";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import SiteHeader from "../components/Header.jsx";

function renderHeader() {
    return render(
        <ConfigProvider>
            <MemoryRouter>
                <SiteHeader />
            </MemoryRouter>
        </ConfigProvider>
    );
}

describe("SiteHeader RSS link", () => {
    it("does not show the empty Case Studies destination in primary navigation", () => {
        renderHeader();

        expect(screen.queryByRole("link", { name: "Case Studies" })).not.toBeInTheDocument();
    });

    it("replaces the former Substack item with an icon-free Buy Me a Coffee link", () => {
        renderHeader();

        const support = screen.getByRole("link", { name: "Buy Me a Coffee" });
        expect(support).toHaveAttribute("href", "https://buymeacoffee.com/smcgregor199");
        expect(support).toHaveAttribute("target", "_blank");
        expect(support.querySelector(".anticon")).toBeNull();
        expect(screen.queryByText("The Signal Journal")).not.toBeInTheDocument();
    });

    it("links Resume to the site resume page", () => {
        renderHeader();

        const resume = screen.getByRole("link", { name: "Resume" });
        expect(resume).toHaveAttribute("href", "/resume");
        expect(resume).not.toHaveAttribute("target");
    });

    it("renders GitHub, RSS, and LinkedIn icon links in that order", () => {
        renderHeader();

        const github = screen.getByRole("link", { name: "Open my GitHub profile in a new tab" });
        const rss = screen.getByRole("link", { name: "Open RSS feed" });
        const linkedin = screen.getByRole("link", { name: "Open my LinkedIn profile in a new tab" });

        expect(github).toHaveAttribute("href", "https://github.com/SMcGregor199");
        expect(rss).toHaveAttribute("href", "/rss.xml");
        expect(rss).not.toHaveAttribute("target");
        expect(linkedin).toHaveAttribute("href", "https://linkedin.com/in/shayne-mcgregor");

        const iconLinks = [github, rss, linkedin];
        expect(iconLinks.map((link) => link.getAttribute("aria-label"))).toEqual([
            "Open my GitHub profile in a new tab",
            "Open RSS feed",
            "Open my LinkedIn profile in a new tab",
        ]);
        expect(github.compareDocumentPosition(rss) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        expect(rss.compareDocumentPosition(linkedin) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
});
