import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ScrollToTop from "../components/ScrollToTop";

function TestPage({ title, to }) {
    return (
        <>
            <h1>{title}</h1>
            {to ? <Link to={to}>Next route</Link> : null}
        </>
    );
}

function renderRouteTest() {
    return render(
        <MemoryRouter initialEntries={["/blog"]}>
            <ScrollToTop />
            <Routes>
                <Route path="/blog" element={<TestPage title="Blog" to="/contact" />} />
                <Route path="/contact" element={<TestPage title="Contact" />} />
            </Routes>
        </MemoryRouter>
    );
}

describe("ScrollToTop", () => {
    beforeEach(() => {
        Object.defineProperty(window, "scrollTo", {
            configurable: true,
            writable: true,
            value: vi.fn(),
        });
    });

    it("scrolls to the viewport top after internal route navigation", async () => {
        renderRouteTest();

        await waitFor(() => expect(window.scrollTo).toHaveBeenCalled());
        window.scrollTo.mockClear();

        fireEvent.click(screen.getByRole("link", { name: /next route/i }));

        expect(await screen.findByRole("heading", { name: /contact/i })).toBeInTheDocument();
        await waitFor(() => {
            expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
        });
    });
});
