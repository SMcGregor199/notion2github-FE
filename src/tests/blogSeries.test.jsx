import { fireEvent, render, screen } from "@testing-library/react";
import { ConfigProvider } from "antd";
import { ThemeProvider } from "@emotion/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import BlogDetail from "../pages/BlogDetail";
import BlogSeries from "../pages/BlogSeries";
import BlogPage from "../pages/Blog";
import { getSeriesMembers } from "../utils/blogSeries";

const researchSeries = {
  name: "The Design of Research",
  slug: "the-design-of-research",
  description: "A closer look at how research becomes useful thought.",
};

const theme = {
  token: {
    colorPrimary: "#D86F44",
    colorTextLightSolid: "#fff",
    colorPrimaryShadow: "rgba(216, 111, 68, 0.24)",
  },
};

const firstPost = {
  id: "first",
  title: "The First Point of Friction in Academic Research",
  link: "first-point-of-friction",
  summary: "The first article.",
  thumbnail: "/first.webp",
  publishedDate: "2026-01-10T12:00:00.000Z",
  body: [],
  series: researchSeries,
};

const secondPost = {
  id: "second",
  title: "The Passage Is Not the Thought",
  link: "passage-is-not-the-thought",
  summary: "The second article.",
  thumbnail: "/second.webp",
  publishedDate: "2026-02-10T12:00:00.000Z",
  body: [],
  series: researchSeries,
};

function renderWithRouter(ui, route) {
  return render(
    <ConfigProvider>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </ThemeProvider>
    </ConfigProvider>,
  );
}

describe("Blog series", () => {
  it("renders a shareable landing page with published articles in chronological order", () => {
    const draft = { ...secondPost, id: "draft", link: "draft", title: "Draft", published: false };
    renderWithRouter(
      <Routes>
        <Route path="/blog/series/:seriesSlug" element={<BlogSeries initialData={[secondPost, draft, firstPost]} />} />
      </Routes>,
      "/blog/series/the-design-of-research",
    );

    expect(screen.getByRole("heading", { level: 1, name: "The Design of Research" })).toBeInTheDocument();
    expect(screen.getByText(researchSeries.description)).toBeInTheDocument();
    expect(screen.getAllByText(/Part \d/).map((element) => element.textContent)).toEqual(["Part 1", "Part 2"]);
    expect(screen.getByRole("link", { name: firstPost.title })).toHaveAttribute("href", `/blog/${firstPost.link}`);
    expect(screen.getByRole("link", { name: secondPost.title })).toHaveAttribute("href", `/blog/${secondPost.link}`);
    expect(screen.queryByRole("link", { name: "Draft" })).not.toBeInTheDocument();
  });

  it("uses the branded not-found view for an unknown series", () => {
    renderWithRouter(
      <Routes>
        <Route path="/blog/series/:seriesSlug" element={<BlogSeries initialData={[firstPost]} />} />
      </Routes>,
      "/blog/series/not-a-series",
    );

    expect(screen.getByRole("heading", { level: 1, name: "404" })).toBeInTheDocument();
  });

  it("calculates member order safely when invalid dates share a series", () => {
    expect(getSeriesMembers([
      { ...secondPost, publishedDate: "not-a-date" },
      firstPost,
    ], researchSeries.slug).map((post) => post.id)).toEqual(["first", "second"]);
  });

  it("renders Part N of M and only available previous/next article links", () => {
    renderWithRouter(
      <Routes>
        <Route path="/blog/:slug" element={<BlogDetail initialData={[secondPost, firstPost]} />} />
      </Routes>,
      `/blog/${firstPost.link}`,
    );

    expect(screen.getByText("Part 1 of 2")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: `Previous in the series: ${firstPost.title}` })).not.toBeInTheDocument();
    const nextCard = screen.getByRole("link", { name: `Next in the series: ${secondPost.title}` });
    expect(nextCard).toHaveAttribute("href", `/blog/${secondPost.link}`);
    expect(nextCard).toHaveClass("series-preview-card--next");
    expect(nextCard.querySelector("img")).toHaveAttribute("src", secondPost.thumbnail);
    expect(screen.getByRole("link", { name: `Part of the series: ${researchSeries.name}` })).toHaveAttribute("href", `/blog/series/${researchSeries.slug}`);
  });

  it("omits the next link at the final series boundary", () => {
    renderWithRouter(
      <Routes>
        <Route path="/blog/:slug" element={<BlogDetail initialData={[firstPost, secondPost]} />} />
      </Routes>,
      `/blog/${secondPost.link}`,
    );

    expect(screen.getByText("Part 2 of 2")).toBeInTheDocument();
    const previousCard = screen.getByRole("link", { name: `Previous in the series: ${firstPost.title}` });
    expect(previousCard).toHaveAttribute("href", `/blog/${firstPost.link}`);
    expect(previousCard).toHaveClass("series-preview-card--previous");
    expect(screen.queryByRole("link", { name: `Next in the series: ${secondPost.title}` })).not.toBeInTheDocument();
  });

  it("renders no series navigation for a post outside a series", () => {
    renderWithRouter(
      <Routes>
        <Route path="/blog/:slug" element={<BlogDetail initialData={[{ ...firstPost, series: undefined }]} />} />
      </Routes>,
      `/blog/${firstPost.link}`,
    );

    expect(screen.queryByText(/Part \d of \d/)).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: /series navigation/i })).not.toBeInTheDocument();
  });

  it("offers mutually exclusive tag and series filters, with a series-page link", () => {
    const unrelatedPost = {
      id: "unrelated",
      title: "A Post Outside the Series",
      link: "outside-the-series",
      summary: "A separate article.",
      tag: "Engineering",
      publishedDate: "2026-03-10T12:00:00.000Z",
      body: [],
    };
    renderWithRouter(<BlogPage initialData={[firstPost, secondPost, unrelatedPost]} />, "/blog");

    fireEvent.click(screen.getByRole("button", { name: "Series" }));
    fireEvent.click(screen.getByText(researchSeries.name).closest(".ant-tag"));

    expect(screen.getByRole("link", { name: `View the ${researchSeries.name} series →` })).toHaveAttribute(
      "href",
      `/blog/series/${researchSeries.slug}`,
    );
    expect(screen.getByRole("link", { name: `Read ${firstPost.title}` })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: `Read ${unrelatedPost.title}` })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Tags" }));
    expect(screen.queryByRole("link", { name: `View the ${researchSeries.name} series →` })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: `Read ${unrelatedPost.title}` })).toBeInTheDocument();
  });
});
