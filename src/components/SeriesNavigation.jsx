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
        <Link to={`/blog/series/${series.slug}`}>{series.name}</Link>
      </Typography.Title>
      <Typography.Paragraph className="series-navigation__position">
        Part {position} of {members.length}
      </Typography.Paragraph>
      <div className="series-navigation__links">
        {previous ? <Link to={`/blog/${previous.link}`}>Previous: {previous.title}</Link> : null}
        {next ? <Link to={`/blog/${next.link}`}>Next: {next.title}</Link> : null}
      </div>
    </nav>
  );
}

export default SeriesNavigation;
