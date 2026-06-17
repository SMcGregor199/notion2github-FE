type ReactionKey = "love" | "confusing" | "thoughtProvoking";
interface Reaction {
  active: boolean;
  count: number;
}
type ReactionsState = Record<ReactionKey, Reaction>;


type ShareData = {
    title: string;
    text: string;
    url: string;
}


type ReactionCounts = Record<ReactionKey, number>;

type ReactionApiState = {
  postId: string;
  counts: ReactionCounts;
  selectedReaction: ReactionKey | null;
};

type ReactionErrorCode =
  | "airtable_permission_denied"
  | "airtable_transient_failure"
  | "invalid_post_id"
  | "invalid_reaction"
  | "invalid_request"
  | "invalid_visitor_id"
  | "missing_aggregate_record"
  | "missing_aggregate_field"
  | "missing_aggregate_table"
  | "missing_env_var"
  | "missing_selection_field"
  | "missing_selection_table"
  | "reaction_setup_unavailable";

type ReactionApiErrorBody = {
  error?: {
    code?: ReactionErrorCode;
    message?: string;
  } | string;
};

export type {
  ReactionsState,
  ReactionKey,
  Reaction,
  ShareData,
  ReactionCounts,
  ReactionApiState,
  ReactionErrorCode,
  ReactionApiErrorBody,
}
