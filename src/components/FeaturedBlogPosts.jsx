import { Card, Col, Flex, Row, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import BlogCardLong from "./BlogCardLong";

const SECONDARY_POST_COUNT = 3;
const MORE_WRITING_POST_COUNT = 5;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
});

const tagStyle = {
    width: "fit-content",
    background: "#eef2ff",
    color: "#1d4ed8",
    border: "1px solid #c7d2fe",
    padding: "2px 10px",
    borderRadius: 9999,
    fontWeight: 600,
    fontSize: "clamp(0.75rem, 0.25vw + 0.72rem, 0.9rem)",
    lineHeight: 1.2,
};

function formatPublishedDate(publishedDate) {
    const timestamp = Date.parse(publishedDate ?? "");
    if (Number.isNaN(timestamp)) {
        return "";
    }

    return dateFormatter.format(new Date(timestamp));
}

function postPath(post) {
    return `/blog/${post.link}`;
}

function PostMeta({ post }) {
    const formattedDate = formatPublishedDate(post.publishedDate);

    return (
        <Flex align="center" gap={8} wrap="wrap">
            {post.tag ? (
                <Tag color="geekblue" style={tagStyle}>
                    {post.tag}
                </Tag>
            ) : null}
            {formattedDate ? (
                <Typography.Text type="secondary" style={{ fontSize: "0.9rem" }}>
                    {formattedDate}
                </Typography.Text>
            ) : null}
        </Flex>
    );
}

function SecondaryPostCard({ post }) {
    return (
        <Card
            size="small"
            className="homepage-blog-secondary-card"
            style={{
                borderRadius: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
            styles={{
                body: {
                    padding: "clamp(14px, 2vw, 18px)",
                },
            }}
        >
            <Flex align="flex-start" gap={14} wrap={false}>
                <Flex vertical gap={8} style={{ flex: 1, minWidth: 0 }}>
                    <PostMeta post={post} />
                    <Typography.Title
                        level={3}
                        style={{
                            margin: 0,
                            fontSize: "clamp(1.05rem, 0.65vw + 0.95rem, 1.35rem)",
                            color: "black",
                            letterSpacing: "-0.01em",
                            lineHeight: 1.25,
                        }}
                    >
                        <Link
                            className="homepage-blog-link"
                            to={postPath(post)}
                            aria-label={`Read ${post.title}`}
                        >
                            {post.title}
                        </Link>
                    </Typography.Title>
                    {post.summary ? (
                        <Typography.Paragraph
                            type="secondary"
                            ellipsis={{ rows: 2 }}
                            style={{ margin: 0, color: "rgba(0,0,0,0.62)", lineHeight: 1.55 }}
                        >
                            {post.summary}
                        </Typography.Paragraph>
                    ) : null}
                </Flex>
                {post.thumbnail ? (
                    <img
                        src={post.thumbnail}
                        alt={post.title}
                        loading="lazy"
                        className="homepage-blog-thumb"
                    />
                ) : null}
            </Flex>
        </Card>
    );
}

function MoreWritingList({ posts }) {
    if (posts.length === 0) {
        return null;
    }

    return (
        <Card
            className="homepage-blog-more-card"
            style={{
                marginTop: 24,
                borderRadius: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
            styles={{
                body: {
                    padding: "clamp(16px, 2.5vw, 24px)",
                },
            }}
        >
            <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 16 }}>
                More writing
            </Typography.Title>
            <ul className="homepage-blog-more-list">
                {posts.map((post) => (
                    <li key={post.id ?? post.link}>
                        <Flex align="baseline" justify="space-between" gap={12} wrap="wrap">
                            <Link
                                className="homepage-blog-link"
                                to={postPath(post)}
                                aria-label={`Read ${post.title}`}
                            >
                                {post.title}
                            </Link>
                            <span className="homepage-blog-more-meta">
                                {[post.tag, formatPublishedDate(post.publishedDate)]
                                    .filter(Boolean)
                                    .join(" / ")}
                            </span>
                        </Flex>
                    </li>
                ))}
            </ul>
        </Card>
    );
}

function FeaturedBlogPosts({ initialData }) {
    const posts = Array.isArray(initialData) ? initialData.filter(Boolean) : [];
    const featuredPost = posts[0];
    const secondaryPosts = posts.slice(1, SECONDARY_POST_COUNT + 1);
    const remainingPosts = posts.slice(
        SECONDARY_POST_COUNT + 1,
        SECONDARY_POST_COUNT + 1 + MORE_WRITING_POST_COUNT
    );
    const hasFlairSpace = secondaryPosts.length === SECONDARY_POST_COUNT;

    return (
        <section aria-labelledby="latest-writing-heading" className="homepage-blog-section">
            <Typography.Title
                id="latest-writing-heading"
                level={2}
                style={{
                    margin: 0,
                    fontWeight: 700,
                    color: "black",
                    paddingBlock: "clamp(24px, 6vh, 48px)",
                    letterSpacing: "-0.02em",
                }}
            >
                Latest Writing
            </Typography.Title>

            {featuredPost ? (
                <>
                    <Row gutter={[24, 24]} align="stretch">
                        <Col xs={24} lg={14} className="homepage-feature-column">
                            <div className="homepage-feature-stack">
                                <BlogCardLong {...featuredPost} />
                                {hasFlairSpace ? (
                                    <a
                                        className="homepage-feature-flair"
                                        href="https://www.pinterest.com/niyajean00/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="View artwork by Niyajean00 on Pinterest, opens in a new tab"
                                    >
                                        <img src="/homepage-flair.gif" alt="" />
                                        <span className="homepage-feature-flair__credit" aria-hidden="true">Artwork: Niyajean00 ↗</span>
                                    </a>
                                ) : null}
                            </div>
                        </Col>
                        {secondaryPosts.length > 0 ? (
                            <Col xs={24} lg={10}>
                                <Flex className="homepage-blog-secondary-stack" vertical gap={12}>
                                    {secondaryPosts.map((post) => (
                                        <SecondaryPostCard key={post.id ?? post.link} post={post} />
                                    ))}
                                </Flex>
                            </Col>
                        ) : null}
                    </Row>

                    <MoreWritingList posts={remainingPosts} />
                </>
            ) : (
                <Card
                    style={{
                        borderRadius: 12,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    }}
                >
                    <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
                        Writing will appear here when posts are available.
                    </Typography.Paragraph>
                </Card>
            )}

            <div className="homepage-blog-archive-link">
                <Link className="homepage-blog-link" to="/blog" aria-label="View all blog posts">
                    View all posts
                </Link>
            </div>
        </section>
    );
}

export default FeaturedBlogPosts;
