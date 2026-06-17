import type { ReactionApiErrorBody, ReactionErrorCode, ReactionApiState, ReactionKey } from "../types/index.ts";

const REACTION_API_URL =
  import.meta.env.VITE_REACTION_API_URL ||
  "https://shaynemcgregordev-be.netlify.app/.netlify/functions/blog-reactions";

const VISITOR_ID_KEY = "blogReactionVisitorId";
const SELECTED_PREFIX = "blogReactionSelected:";

type StorageResult =
  | { available: true; visitorId: string }
  | { available: false; visitorId: null };

class ReactionApiError extends Error {
  constructor(
    public readonly code: ReactionErrorCode | "unknown",
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

function getReactionVisitor(): StorageResult {
  try {
    const storage = window.localStorage;
    let visitorId = storage.getItem(VISITOR_ID_KEY);
    if (!visitorId || !/^rxv_[A-Za-z0-9_-]{16,96}$/.test(visitorId)) {
      visitorId = `rxv_${createRandomToken()}`;
      storage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return { available: true, visitorId };
  } catch {
    return { available: false, visitorId: null };
  }
}

function getStoredSelectedReaction(postId: string): ReactionKey | null {
  try {
    const value = window.localStorage.getItem(`${SELECTED_PREFIX}${postId}`);
    if (value === "love" || value === "confusing" || value === "thoughtProvoking") {
      return value;
    }
  } catch {
    return null;
  }
  return null;
}

function storeSelectedReaction(postId: string, reaction: ReactionKey | null): void {
  try {
    const key = `${SELECTED_PREFIX}${postId}`;
    if (reaction) {
      window.localStorage.setItem(key, reaction);
    } else {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Browser storage is an enhancement; backend state remains authoritative.
  }
}

async function fetchReactionState(params: {
  postId: string;
  blogTitle: string;
  visitorId: string | null;
}): Promise<ReactionApiState> {
  const url = new URL(REACTION_API_URL);
  url.searchParams.set("postId", params.postId);
  url.searchParams.set("blogTitle", params.blogTitle);
  if (params.visitorId) {
    url.searchParams.set("visitorId", params.visitorId);
  }

  const response = await fetch(url.toString(), { method: "GET", cache: "no-store" });
  return parseReactionResponse(response);
}

async function submitReaction(params: {
  postId: string;
  blogTitle: string;
  visitorId: string;
  reaction: ReactionKey | null;
}): Promise<ReactionApiState> {
  const response = await fetch(REACTION_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return parseReactionResponse(response);
}

async function parseReactionResponse(response: Response): Promise<ReactionApiState> {
  const body = (await response.json().catch(() => null)) as ReactionApiState | ReactionApiErrorBody | null;
  if (!response.ok) {
    const parsedError = parseReactionError(body);
    throw new ReactionApiError(parsedError.code, parsedError.message, response.status);
  }
  return body as ReactionApiState;
}

function parseReactionError(body: ReactionApiState | ReactionApiErrorBody | null): {
  code: ReactionErrorCode | "unknown";
  message: string;
} {
  const error = (body as ReactionApiErrorBody | null)?.error;
  if (typeof error === "string") {
    return {
      code: "unknown",
      message: error,
    };
  }
  if (error && typeof error === "object") {
    return {
      code: error.code ?? "unknown",
      message: error.message ?? "Reaction request failed.",
    };
  }
  return {
    code: "unknown",
    message: "Reaction request failed.",
  };
}

function isReactionSetupUnavailable(error: unknown): boolean {
  if (!(error instanceof ReactionApiError)) {
    return false;
  }
  return [
    "airtable_permission_denied",
    "invalid_post_id",
    "missing_aggregate_record",
    "missing_aggregate_field",
    "missing_aggregate_table",
    "missing_env_var",
    "missing_selection_field",
    "missing_selection_table",
    "reaction_setup_unavailable",
  ].includes(error.code);
}

function createRandomToken(): string {
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export {
  fetchReactionState,
  getReactionVisitor,
  getStoredSelectedReaction,
  isReactionSetupUnavailable,
  ReactionApiError,
  storeSelectedReaction,
  submitReaction,
};
