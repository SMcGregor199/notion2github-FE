import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ReactionsBar from "../components/ReactionsBar.tsx";

const apiState = {
  postId: "post_123",
  counts: {
    love: 2,
    confusing: 1,
    thoughtProvoking: 0,
  },
  selectedReaction: null,
};

const zeroApiState = {
  postId: "post_123",
  counts: {
    love: 0,
    confusing: 0,
    thoughtProvoking: 0,
  },
  selectedReaction: null,
};

describe("ReactionsBar", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
    vi.stubGlobal("crypto", {
      getRandomValues(values) {
        values.fill(7);
        return values;
      },
    });
  });

  it("loads counts and submits a selected reaction with a generated visitor id", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(jsonResponse(apiState))
      .mockResolvedValueOnce(
        jsonResponse({
          ...apiState,
          counts: {
            love: 3,
            confusing: 1,
            thoughtProvoking: 0,
          },
          selectedReaction: "love",
        }),
      );

    render(<ReactionsBar postId="post_123" slug="post-slug" title="Post Title" />);

    const lovedButton = await screen.findByRole("button", { name: /Loved\. 2 reactions/i });
    expect(lovedButton).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(lovedButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Loved\. 3 reactions\. Selected\./i })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });

    const submittedBody = JSON.parse(String(fetchMock.mock.calls[1][1]?.body));
    expect(submittedBody).toMatchObject({
      postId: "post_123",
      blogTitle: "Post Title",
      reaction: "love",
    });
    expect(submittedBody.visitorId).toMatch(/^rxv_[A-Za-z0-9_-]{16,96}$/);
    expect(localStorage.getItem("blogReactionSelected:post_123")).toBe("love");
  });

  it("deselects the active reaction by submitting null", async () => {
    localStorage.setItem("blogReactionSelected:post_123", "love");
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse({
          ...apiState,
          counts: {
            love: 3,
            confusing: 1,
            thoughtProvoking: 0,
          },
          selectedReaction: "love",
        }),
      )
      .mockResolvedValueOnce(jsonResponse(apiState));

    render(<ReactionsBar postId="post_123" slug="post-slug" title="Post Title" />);

    const lovedButton = await screen.findByRole("button", { name: /Loved\. 3 reactions\. Selected\./i });
    await userEvent.click(lovedButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Loved\. 2 reactions/i })).toHaveAttribute("aria-pressed", "false");
    });

    expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body)).reaction).toBeNull();
    expect(localStorage.getItem("blogReactionSelected:post_123")).toBeNull();
  });

  it("shows an accessible warning and keeps counts stable when an update fails", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(jsonResponse(apiState))
      .mockResolvedValueOnce(jsonResponse({ error: { code: "airtable_transient_failure", message: "nope" } }, false, 502));

    render(<ReactionsBar postId="post_123" slug="post-slug" title="Post Title" />);

    await userEvent.click(await screen.findByRole("button", { name: /Confusing\. 1 reaction/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Reaction update failed. Counts were not changed.");
    expect(screen.getByRole("button", { name: /Confusing\. 1 reaction/i })).toHaveAttribute("aria-pressed", "false");
  });

  it("does not present failed initial load as successful zero counts", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: { code: "airtable_transient_failure", message: "temporary" } }, false, 502),
    );

    render(<ReactionsBar postId="post_123" slug="post-slug" title="Post Title" />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Reaction counts could not be loaded.");
    expect(screen.getByRole("button", { name: /Loved\. Reaction count not loaded\./i })).toBeDisabled();
    expect(screen.queryByRole("button", { name: /Loved\. 0 reactions/i })).not.toBeInTheDocument();
  });

  it("disables mutation attempts when setup is unavailable", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      jsonResponse(
        {
          error: {
            code: "missing_aggregate_record",
            message: "Reaction counts are not configured for this post yet.",
          },
        },
        false,
        503,
      ),
    );

    render(<ReactionsBar postId="post_123" slug="post-slug" title="Post Title" />);

    const lovedButton = await screen.findByRole("button", { name: /Loved\. Reaction count not loaded\./i });
    expect(await screen.findByRole("alert")).toHaveTextContent("Reactions are not available for this post yet.");
    expect(lovedButton).toBeDisabled();

    await userEvent.click(lovedButton);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("treats a successful zero-count response as loaded and selectable", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(jsonResponse(zeroApiState))
      .mockResolvedValueOnce(
        jsonResponse({
          ...zeroApiState,
          counts: {
            love: 1,
            confusing: 0,
            thoughtProvoking: 0,
          },
          selectedReaction: "love",
        }),
      );

    render(<ReactionsBar postId="post_123" slug="post-slug" title="Post Title" />);

    const lovedButton = await screen.findByRole("button", { name: /Loved\. 0 reactions/i });
    expect(lovedButton).not.toBeDisabled();

    await userEvent.click(lovedButton);

    expect(await screen.findByRole("button", { name: /Loved\. 1 reaction\. Selected\./i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("switches selected reactions with mocked successful backend responses", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse({
          ...apiState,
          selectedReaction: "love",
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          ...apiState,
          counts: {
            love: 1,
            confusing: 1,
            thoughtProvoking: 1,
          },
          selectedReaction: "thoughtProvoking",
        }),
      );

    render(<ReactionsBar postId="post_123" slug="post-slug" title="Post Title" />);

    await userEvent.click(await screen.findByRole("button", { name: /Thought Provoking\. 0 reactions/i }));

    expect(await screen.findByRole("button", { name: /Thought Provoking\. 1 reaction\. Selected\./i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /Loved\. 1 reaction/i })).toHaveAttribute("aria-pressed", "false");
  });
});

function jsonResponse(body, ok = true, status = ok ? 200 : 500) {
  return {
    ok,
    status,
    json: async () => body,
  };
}
