import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, Divider, Space } from "antd";
import {
  BulbFilled,
  BulbOutlined,
  HeartFilled,
  HeartOutlined,
  MailOutlined,
  QuestionCircleFilled,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { JSX } from "react";
import type { ReactionCounts, ReactionKey, ShareData } from "../types/index.ts";
import {
  fetchReactionState,
  getReactionVisitor,
  getStoredReactionCounts,
  getStoredSelectedReaction,
  isReactionSetupUnavailable,
  storeSelectedReaction,
  storeReactionCounts,
  submitReaction,
} from "../utils/index.ts";

type ReactionsBarProps = {
  postId: string;
  slug: string;
  title: string;
};

type VisitorState = {
  storageAvailable: boolean;
  visitorId: string | null;
};

const REACTION_OPTIONS: Array<{
  key: ReactionKey;
  label: string;
  inactiveIcon: JSX.Element;
  activeIcon: JSX.Element;
}> = [
  {
    key: "love",
    label: "Loved",
    inactiveIcon: <HeartOutlined />,
    activeIcon: <HeartFilled />,
  },
  {
    key: "confusing",
    label: "Confusing",
    inactiveIcon: <QuestionCircleOutlined />,
    activeIcon: <QuestionCircleFilled />,
  },
  {
    key: "thoughtProvoking",
    label: "Thought Provoking",
    inactiveIcon: <BulbOutlined />,
    activeIcon: <BulbFilled />,
  },
];

export default function ReactionsBar({ postId, slug, title }: ReactionsBarProps): JSX.Element {
  const stablePostId = postId || slug;
  const [initialReactionState] = useState(() => {
    const reactionVisitor = getReactionVisitor();
    return {
      counts: getStoredReactionCounts(stablePostId),
      visitor: {
        storageAvailable: reactionVisitor.available,
        visitorId: reactionVisitor.visitorId,
      },
    };
  });
  const [counts, setCounts] = useState<ReactionCounts | null>(initialReactionState.counts);
  const [selectedReaction, setSelectedReaction] = useState<ReactionKey | null>(() =>
    getStoredSelectedReaction(stablePostId),
  );
  const [visitor] = useState<VisitorState>(initialReactionState.visitor);
  const [isLoading, setIsLoading] = useState(initialReactionState.counts === null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Loading reactions.");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isApiUnavailable, setIsApiUnavailable] = useState(false);
  const reactionMutationVersion = useRef(0);

  const canReact = visitor.storageAvailable && Boolean(visitor.visitorId) && !isLoading && !isApiUnavailable && counts !== null;

  useEffect(() => {
    let cancelled = false;
    const cachedCounts = getStoredReactionCounts(stablePostId);
    const loadMutationVersion = reactionMutationVersion.current;

    async function loadReactions(): Promise<void> {
      setIsLoading(cachedCounts === null);
      setErrorMessage(null);
      setIsApiUnavailable(false);
      setStatusMessage(cachedCounts ? "Refreshing reactions." : "Loading reactions.");
      try {
        const state = await fetchReactionState({
          postId: stablePostId,
          blogTitle: title,
          visitorId: visitor.visitorId,
        });
        if (cancelled || loadMutationVersion !== reactionMutationVersion.current) {
          return;
        }
        setCounts(state.counts);
        storeReactionCounts(stablePostId, state.counts);
        setSelectedReaction(state.selectedReaction);
        storeSelectedReaction(stablePostId, state.selectedReaction);
        setStatusMessage("Reactions loaded.");
      } catch (err) {
        if (cancelled || loadMutationVersion !== reactionMutationVersion.current) {
          return;
        }
        if (cachedCounts) {
          setCounts(cachedCounts);
        } else {
          setCounts(null);
          setSelectedReaction(null);
        }
        if (isReactionSetupUnavailable(err)) {
          setIsApiUnavailable(true);
          setErrorMessage("Reactions are not available for this post yet.");
          setStatusMessage("Reactions are not available for this post yet.");
        } else {
          setIsApiUnavailable(cachedCounts !== null);
          setErrorMessage(
            cachedCounts
              ? "Reaction counts could not be refreshed. Reactions are temporarily unavailable."
              : "Reaction counts could not be loaded.",
          );
          setStatusMessage(
            cachedCounts
              ? "Reaction counts could not be refreshed. Reactions are temporarily unavailable."
              : "Reaction counts could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadReactions();

    return () => {
      cancelled = true;
    };
  }, [stablePostId, title]);

  const storageWarning = useMemo(() => {
    if (visitor.storageAvailable) {
      return null;
    }
    return "Reactions are read-only because browser storage is unavailable.";
  }, [visitor.storageAvailable]);

  async function toggleReaction(reaction: ReactionKey): Promise<void> {
    if (!canReact || !visitor.visitorId || isUpdating) {
      return;
    }

    const nextReaction = selectedReaction === reaction ? null : reaction;
    reactionMutationVersion.current += 1;
    setIsUpdating(true);
    setErrorMessage(null);
    setStatusMessage(nextReaction ? `Saving ${labelFor(reaction)} reaction.` : "Removing reaction.");

    try {
      const state = await submitReaction({
        postId: stablePostId,
        blogTitle: title,
        visitorId: visitor.visitorId,
        reaction: nextReaction,
      });
      setCounts(state.counts);
      storeReactionCounts(stablePostId, state.counts);
      setSelectedReaction(state.selectedReaction);
      storeSelectedReaction(stablePostId, state.selectedReaction);
      setStatusMessage(state.selectedReaction ? `${labelFor(state.selectedReaction)} saved.` : "Reaction removed.");
    } catch (err) {
      if (isReactionSetupUnavailable(err)) {
        setIsApiUnavailable(true);
        setErrorMessage("Reactions are not available for this post yet.");
        setStatusMessage("Reactions are not available for this post yet.");
      } else {
        setErrorMessage("Reaction update failed. Counts were not changed.");
        setStatusMessage("Reaction update failed. Counts were not changed.");
      }
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleShare(): Promise<void> {
    const shareData: ShareData = {
      title,
      text: "Check out this article",
      url: window.location.href,
    };
    const encodedTitle = encodeURIComponent(shareData.title ?? "");
    const encodedBody = encodeURIComponent(window.location.href);
    if ("share" in navigator && typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
      } catch {
        window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedBody}`;
      }
      return;
    }
    window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedBody}`;
  }

  return (
    <section className="reaction-bar" aria-label="Blog post reactions">
      <Divider />
      <Space className="reaction-bar__controls">
        {counts === null && isLoading ? (
          <div className="reaction-bar__loading" aria-hidden="true">
            {REACTION_OPTIONS.map((option) => (
              <span key={option.key} className="reaction-bar__loading-chip" />
            ))}
          </div>
        ) : (
          REACTION_OPTIONS.map((option) => {
            const isSelected = selectedReaction === option.key;
            const count = counts?.[option.key];
            const countText = count === undefined ? "Not loaded" : String(count);
            return (
              <Button
                key={option.key}
                type="default"
                icon={isSelected ? option.activeIcon : option.inactiveIcon}
                onClick={() => void toggleReaction(option.key)}
                aria-pressed={isSelected}
                aria-label={buttonLabel(option.label, count, isSelected)}
                disabled={!canReact || isUpdating}
                loading={isUpdating && isSelected}
                className={isSelected ? "reaction-bar__button reaction-bar__button--selected" : "reaction-bar__button"}
              >
                {option.label} <span aria-hidden="true">{countText}</span>
              </Button>
            );
          })
        )}
        <Button type="default" icon={<MailOutlined />} onClick={handleShare}>
          Share
        </Button>
      </Space>
      <div className="reaction-bar__status" aria-live="polite" aria-atomic="true">
        {statusMessage}
      </div>
      {storageWarning ? (
        <Alert className="reaction-bar__alert" type="info" showIcon message={storageWarning} />
      ) : null}
      {errorMessage ? <Alert className="reaction-bar__alert" type="warning" showIcon message={errorMessage} /> : null}
      <Divider />
    </section>
  );
}

function labelFor(reaction: ReactionKey): string {
  return REACTION_OPTIONS.find((option) => option.key === reaction)?.label ?? reaction;
}

function buttonLabel(label: string, count: number | undefined, isSelected: boolean): string {
  if (count === undefined) {
    return `${label}. Reaction count not loaded.`;
  }
  return `${label}. ${count} ${count === 1 ? "reaction" : "reactions"}${isSelected ? ". Selected." : "."}`;
}
