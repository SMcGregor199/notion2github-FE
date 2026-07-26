import { Card, Typography } from "antd";
import { Link, useParams } from "react-router-dom";
import { getSeriesMembers } from "../utils/blogSeries";
import NotFound from "./NotFound";

function BlogSeries({ initialData = [] }) {
  const { seriesSlug } = useParams();
  const members = getSeriesMembers(initialData, seriesSlug);
  if (members.length === 0) return <NotFound />;

  const series = members[0].series;
  return (
    <section className="blog-series" aria-labelledby="blog-series-title">
      <Typography.Text className="blog-series__eyebrow">Blog series</Typography.Text>
      <Typography.Title id="blog-series-title" level={1}>{series.name}</Typography.Title>
      {series.description ? <Typography.Paragraph className="blog-series__description">{series.description}</Typography.Paragraph> : null}
      <ol className="blog-series__list" aria-label={`${series.name} articles`}>
        {members.map((post, index) => (
          <li key={post.id || post.link}>
            <Card className="blog-series__card" hoverable>
              <Typography.Text type="secondary">Part {index + 1}</Typography.Text>
              <Typography.Title level={2} className="blog-series__card-title">
                <Link to={`/blog/${post.link}`}>{post.title}</Link>
              </Typography.Title>
              {post.summary ? <Typography.Paragraph>{post.summary}</Typography.Paragraph> : null}
            </Card>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default BlogSeries;
