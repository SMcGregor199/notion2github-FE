import { fireEvent, render, screen } from "@testing-library/react";
import { ConfigProvider } from "antd";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import NewsletterSignup from "../components/NewsletterSignup.jsx";

function renderSignup() {
    return render(<ConfigProvider><MemoryRouter><NewsletterSignup /></MemoryRouter></ConfigProvider>);
}

describe("NewsletterSignup", () => {
    afterEach(() => vi.unstubAllGlobals());

    it("submits the accessible double-opt-in form and links the privacy notice", async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: "Check your email to confirm your subscription." }), { status: 202 }));
        vi.stubGlobal("fetch", fetchMock);
        renderSignup();

        fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Shayne" } });
        fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "McGregor" } });
        fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "shayne@example.com" } });
        fireEvent.click(screen.getByRole("button", { name: "Subscribe" }));

        expect(fetchMock).toHaveBeenCalledWith(
            "https://shaynemcgregordev-be.netlify.app/.netlify/functions/newsletter-subscribe",
            expect.objectContaining({ method: "POST" }),
        );
        expect(await screen.findByText("Check your email to confirm your subscription.")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "privacy notice" })).toHaveAttribute("href", "/privacy");
    });
});
