import { render, screen, within } from "@testing-library/react";
import { ConfigProvider } from "antd";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import App from "../App.jsx";

function renderNotFoundPage() {
    return render(
        <ConfigProvider>
            <MemoryRouter initialEntries={["/definitely-not-a-real-page"]}>
                <App initialData={[]} />
            </MemoryRouter>
        </ConfigProvider>
    );
}

describe("Custom 404 page", () => {
    beforeEach(() => {
        Object.defineProperty(window, "scrollTo", {
            configurable: true,
            writable: true,
            value: vi.fn(),
        });
    });

    it("renders a branded not-found page for unknown routes", async () => {
        renderNotFoundPage();

        const main = screen.getByRole("main");

        expect(await within(main).findByRole("heading", { level: 1, name: "404" })).toBeInTheDocument();
        expect(
            within(main).getByRole("heading", { level: 2, name: /this page took a wrong turn/i })
        ).toBeInTheDocument();
        expect(within(main).getByText(/could not be found/i)).toBeInTheDocument();

        const emailLink = within(main).getByRole("link", { name: "shaynemcgregor1@gmail.com" });
        expect(emailLink).toHaveAttribute("href", "mailto:shaynemcgregor1@gmail.com");

        expect(within(main).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
        expect(within(main).getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
        expect(within(main).getByRole("link", { name: "Contact Me" })).toHaveAttribute(
            "href",
            "/contact"
        );

        expect(
            within(main).getByRole("complementary", {
                name: /shayne shrugging 404 illustration/i,
            })
        ).toBeInTheDocument();

        const finalImage = within(main).getByAltText(
            /shayne shrugging with both hands raised in a playful custom 404 illustration/i
        );
        expect(finalImage).toHaveAttribute("src", "/404-img.png");
    });
});
