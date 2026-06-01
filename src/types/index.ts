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




export type {ReactionsState,ReactionKey,Reaction, ShareData}