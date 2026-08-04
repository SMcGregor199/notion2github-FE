import { ThemeProvider } from "@emotion/react";
import { ConfigProvider } from "antd";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ResourceGuide from "../pages/ResourceGuide";
import { filterResourcesByCategory, getResourceCategories } from "../utils/resourceGuide";

const theme = { token: { colorPrimary: "#D86F44", colorTextLightSolid: "#fff" } };
const resources = [
  {
    id: "study-1", title: "Evidence for AI-supported review", url: "https://example.org/evidence",
    category: "Studies & Evidence", dateAdded: "2026-08-01T00:00:00.000Z",
    disciplines: [], researchStages: [], aiRoles: [], tags: ["Methods"], description: "A review of AI support.", publicAnnotation: "Start here.",
  },
  {
    id: "tool-1", title: "Research tool", url: "https://example.org/tool",
    category: "Tools", dateAdded: "2026-08-02T00:00:00.000Z",
    disciplines: [], researchStages: [], aiRoles: [], tags: [], resourceType: "Tool",
  },
];

function renderGuide() {
  return render(<ConfigProvider theme={theme}><ThemeProvider theme={theme}><ResourceGuide /></ThemeProvider></ConfigProvider>);
}

describe("Resource Guide", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => ({
      ok: true,
      headers: { get: () => "guide-version" },
      json: async () => ({ resources, generatedAt: "2026-08-04T12:00:00.000Z" }),
    })));
    localStorage.clear();
  });

  it("derives categories and filters resources without a fixed category enum", () => {
    expect(getResourceCategories(resources)).toEqual(["Studies & Evidence", "Tools"]);
    expect(filterResourcesByCategory(resources, "Tools")).toEqual([resources[1]]);
  });

  it("renders public annotations and filters by a Notion-provided category", async () => {
    renderGuide();

    expect(await screen.findByRole("heading", { name: "Evidence for AI-supported review" })).toBeInTheDocument();
    expect(screen.getByText("Shayne’s note")).toBeInTheDocument();
    expect(screen.getByText("Start here.")).toBeInTheDocument();

    fireEvent.click(screen.getAllByText("Tools").find((element) => element.closest(".ant-tag-checkable")));
    expect(screen.getByRole("heading", { name: "Research tool" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Evidence for AI-supported review" })).not.toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("radio", { name: "All" }), { key: "Enter" });
    expect(screen.getByRole("heading", { name: "Evidence for AI-supported review" })).toBeInTheDocument();
  });

  it("shows a retry state when no API or browser-cached guide is available", async () => {
    fetch.mockRejectedValueOnce(new Error("offline"));
    renderGuide();

    expect(await screen.findByText("The Resource Guide could not load.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
