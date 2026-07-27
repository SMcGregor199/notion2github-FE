import { render, screen } from "@testing-library/react";
import { ConfigProvider } from "antd";
import { ThemeProvider } from "@emotion/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Home from "../pages/Home";

const testTheme = {
    token: {
        colorPrimary: "#D86F44",
        colorTextLightSolid: "#fff",
        colorPrimaryShadow: "rgba(216, 111, 68, 0.24)",
    },
};

function renderHome() {
    return render(
        <ConfigProvider theme={{ token: testTheme.token }}>
            <ThemeProvider theme={testTheme}>
                <MemoryRouter>
                    <Home initialData={[]} />
                </MemoryRouter>
            </ThemeProvider>
        </ConfigProvider>
    );
}

describe("Home", () => {
    it("renders the Notes from Shayne title banner without the Discourse Center promotion", () => {
        renderHome();

        expect(screen.getByRole("heading", { level: 1, name: /notes from shayne/i })).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 2, name: /latest writing/i })).toBeInTheDocument();
        expect(screen.queryByText(/discourse center/i)).not.toBeInTheDocument();
        expect(document.querySelector('a[href="https://www.discourse.center/"]')).toBeNull();
    });
});
