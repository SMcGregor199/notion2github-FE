import { Typography } from "antd";
import { Link } from "react-router-dom";
import { getSeriesNavigation } from "../utils/blogSeries";

function SeriesNavigation({ post, posts }) {
  const navigation = getSeriesNavigation(posts, post);
  if (!navigation) return null;

  const { series, members, position, previous, next } = navigation;
  return (
    <nav className="series-navigation" aria-label={`${series.name} series navigation`}>
      <Typography.Text className="series-navigation__eyebrow">Series</Typography.Text>
      <Typography.Title level={3} className="series-navigation__title">
        {series.name}
      </Typography.Title>
      <Typography.Paragraph className="series-navigation__position">
        Part {position} of {members.length}
      </Typography.Paragraph>
      <div className="series-navigation__cards">
        {previous ? <SeriesPreviewCard post={previous} direction="previous" /> : null}
        {next ? <SeriesPreviewCard post={next} direction="next" /> : null}
      </div>
    </nav>
  );
}

function SeriesPreviewCard({ post, direction }) {
  const directionLabel = direction === "previous" ? "Previous in the series" : "Next in the series";
  const arrow = direction === "previous" ? "←" : "→";

  return (
    <Link
      className={`series-preview-card series-preview-card--${direction}`}
      to={`/blog/${post.link}`}
      aria-label={`${directionLabel}: ${post.title}`}
    >
      {post.thumbnail ? (
        <img className="series-preview-card__image" src={post.thumbnail} alt="" loading="lazy" />
      ) : (
        <div className="series-preview-card__image series-preview-card__image--placeholder" aria-hidden="true" />
      )}
      <div className="series-preview-card__copy">
        <Typography.Text className="series-preview-card__direction">
          <span aria-hidden="true">{arrow}</span> {directionLabel}
        </Typography.Text>
        <Typography.Title level={4} className="series-preview-card__title">{post.title}</Typography.Title>
        {post.tag ? <Typography.Text className="series-preview-card__tag">{post.tag}</Typography.Text> : null}
        {post.summary ? <Typography.Paragraph className="series-preview-card__summary">{post.summary}</Typography.Paragraph> : null}
      </div>
    </Link>
  );
}

export default SeriesNavigation;
