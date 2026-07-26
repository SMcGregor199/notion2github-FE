import { Button, Card, Col, Divider, Layout, Row, Space, Spin, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import { Grid } from "antd";
import { useMemo, useState } from "react";
import { StyledTag } from "../components/styledTag";
import NewsletterSignup from "../components/NewsletterSignup";

function BlogPage({ initialData, isBlogDataLoading = false }) {
    const posts = useMemo(() => Array.isArray(initialData) ? initialData : [], [initialData]);
    const screens = Grid.useBreakpoint();
    const isDesktop = screens.lg;
    const [filterMode, setFilterMode] = useState("tags");
    const [selectedTag, setSelectedTag] = useState("All");
    const [selectedSeriesSlug, setSelectedSeriesSlug] = useState("All");

    const tags = useMemo(() => ["All", ...new Set(posts.map((post) => post.tag).filter(Boolean))], [posts]);
    const series = useMemo(() => {
        const bySlug = new Map();
        posts.forEach((post) => {
            if (post?.series?.slug && post.series.name) bySlug.set(post.series.slug, post.series);
        });
        return [...bySlug.values()].sort((left, right) => left.name.localeCompare(right.name));
    }, [posts]);
    const selectedSeries = series.find((item) => item.slug === selectedSeriesSlug);
    const filteredPosts = filterMode === "tags"
        ? selectedTag === "All" ? posts : posts.filter((post) => post.tag === selectedTag)
        : selectedSeriesSlug === "All" ? posts : posts.filter((post) => post.series?.slug === selectedSeriesSlug);

    function chooseFilterMode(mode) {
        setFilterMode(mode);
        if (mode === "tags") setSelectedSeriesSlug("All");
        else setSelectedTag("All");
    }

    function chooseTag(tag) {
        setFilterMode("tags");
        setSelectedTag(tag);
        setSelectedSeriesSlug("All");
    }

    function chooseSeries(slug) {
        setFilterMode("series");
        setSelectedSeriesSlug(slug);
        setSelectedTag("All");
    }

    const blogCards = filteredPosts.map((post) => <BlogCard key={post.id || post.link} post={post} />);
    const filters = (
        <BlogFilters
            filterMode={filterMode}
            tags={tags}
            series={series}
            selectedTag={selectedTag}
            selectedSeriesSlug={selectedSeriesSlug}
            onModeChange={chooseFilterMode}
            onTagChange={chooseTag}
            onSeriesChange={chooseSeries}
        />
    );

    return (
        <Layout>
            {!isDesktop ? <div className="blog-filters--mobile">{filters}</div> : null}
            <section style={{ flex: isDesktop ? "2 1 auto" : "0 1 auto" }}>
                <Typography.Title level={1} style={{ marginTop: 0 }}>Blog</Typography.Title>
                <Divider style={{ marginTop: 12 }} />

                {isBlogDataLoading ? (
                    <div className="blog-page__loading" role="status" aria-live="polite" aria-busy="true">
                        <Spin size="small" />
                        <Typography.Text type="secondary">Loading latest posts...</Typography.Text>
                    </div>
                ) : null}

                {filterMode === "series" && selectedSeries ? (
                    <div className="blog-series-filter-summary">
                        <Typography.Text>Showing posts in {selectedSeries.name}.</Typography.Text>
                        <Link to={`/blog/series/${selectedSeries.slug}`}>View the {selectedSeries.name} series →</Link>
                    </div>
                ) : null}

                <Row gutter={[24, 24]}>{blogCards}</Row>
                <NewsletterSignup />
            </section>

            {isDesktop ? (
                <Layout.Sider className="blog-filters--desktop" width={280} breakpoint="lg" collapsedWidth={0} theme="light">
                    {filters}
                </Layout.Sider>
            ) : null}
        </Layout>
    );
}

function BlogFilters({ filterMode, tags, series, selectedTag, selectedSeriesSlug, onModeChange, onTagChange, onSeriesChange }) {
    const filterItems = filterMode === "tags"
        ? tags.map((tag) => <StyledTag onChange={() => onTagChange(tag)} key={tag} checked={selectedTag === tag}>{tag}</StyledTag>)
        : [
            <StyledTag onChange={() => onSeriesChange("All")} key="all-series" checked={selectedSeriesSlug === "All"}>All</StyledTag>,
            ...series.map((item) => <StyledTag onChange={() => onSeriesChange(item.slug)} key={item.slug} checked={selectedSeriesSlug === item.slug}>{item.name}</StyledTag>),
        ];

    return (
        <section aria-label="Blog filters">
            <Typography.Title level={2} style={{ marginTop: 0 }}>Browse by</Typography.Title>
            <div className="blog-filter-mode" role="group" aria-label="Choose filter type">
                <Button type={filterMode === "tags" ? "primary" : "default"} aria-pressed={filterMode === "tags"} onClick={() => onModeChange("tags")}>Tags</Button>
                <Button type={filterMode === "series" ? "primary" : "default"} aria-pressed={filterMode === "series"} onClick={() => onModeChange("series")}>Series</Button>
            </div>
            <Typography.Title level={3} className="blog-filter-heading">{filterMode === "tags" ? "Tags" : "Series"}</Typography.Title>
            <Space wrap size={[8, 8]} aria-label={`Filter by ${filterMode}`}>
                <div className="blog-filter-items">{filterItems}</div>
            </Space>
        </section>
    );
}

function BlogCard({ post }) {
    const coverImage = post.thumbnail ? <img src={post.thumbnail} alt={post.title} style={{ width: "100%", objectFit: "cover" }} loading="lazy" /> : null;
    return (
        <Col xs={24} sm={12} lg={8}>
            <Link to={`/blog/${post.link}`} aria-label={`Read ${post.title}`}>
                <Card hoverable style={{ height: "100%" }} cover={coverImage}>
                    <Card.Meta
                        title={post.title}
                        description={<Typography.Paragraph type="secondary" style={{ marginBottom: 0, fontSize: "1rem", lineHeight: "1.5" }} ellipsis={{ rows: 2 }}>{post.summary}</Typography.Paragraph>}
                    />
                    {post.tag ? <div className="blog-card__tag"><Tag color="geekblue">{post.tag}</Tag></div> : null}
                </Card>
            </Link>
        </Col>
    );
}

export default BlogPage;
