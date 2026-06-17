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

export type {ReactionsState,ReactionKey,Reaction, ShareData, ReactionCounts, ReactionApiState}
