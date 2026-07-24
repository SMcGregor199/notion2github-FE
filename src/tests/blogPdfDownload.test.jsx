import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ConfigProvider } from "antd";
import { ThemeProvider } from "@emotion/react";
import { describe, expect, it } from "vitest";
import BlogDetail from "../pages/BlogDetail";

const post = {
  id: "post-1",
  title: "A Downloadable Post",
  link: "a-downloadable-post",
  tag: "Engineering",
  summary: "A post with a PDF download.",
  publishedDate: "2026-07-24T12:00:00.000Z",
  updatedDate: "",
  body: [],
};

const theme = {
  token: {
    colorPrimary: "#D86F44",
    colorTextLightSolid: "#fff",
    colorPrimaryShadow: "rgba(216, 111, 68, 0.24)",
  },
};

describe("BlogDetail PDF download", () => {
  it("places a branded PDF download below post metadata", () => {
    render(
      <ConfigProvider theme={{ token: theme.token }}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={["/blog/a-downloadable-post"]}>
            <Routes>
              <Route path="/blog/:slug" element={<BlogDetail initialData={[post]} />} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </ConfigProvider>
    );

    const button = screen.getByRole("link", { name: "Download A Downloadable Post as PDF" });
    expect(button).toHaveAttribute("href", "/blog/a-downloadable-post/download.pdf");
    expect(screen.getByTestId("post-metadata")).toContainElement(button);
    expect(button.compareDocumentPosition(screen.getByText("Engineering")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
