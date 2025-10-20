import { Layout, Typography, Tag, Row, Col, Card, Divider } from "antd";
import {Link} from "react-router-dom";
import {blogPostsData} from "../data/notionBlogData.js";
import { Grid } from "antd";
const screens = Grid.useBreakpoint();
const isDesktop = screens.lg; // >= 992px


function BlogPage() {
    const blogCards = blogPostsData.map((post)=>{
        return(
            <Col key={post.id} xs={24} sm={12} lg={8}>
            <Link to={post.link} aria-label="test">
                <Card
                hoverable
                style={{ height: "100%" }}
                cover=
                    <img
                        src={post.thumbnail}
                        alt=""
                        style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover" }}
                        loading="lazy"
                    />    
                >
                            
                    <Card.Meta
                    title={post.title}
                    description={
                    <Typography.Paragraph type="secondary" style={{ marginBottom: 0, fontSize:"1rem", lineHeight:"1.5" }} ellipsis={{ rows: 2 }}>
                    {post.summary}
                    </Typography.Paragraph>
                    }
                    />
                    
                    <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                                                <Tag color="geekblue" style={{ width: "fit-content", background: "#eef2ff",     
                            color: "#1d4ed8",
                            border: "1px solid #c7d2fe",
                            padding: "2px 10px",
                            borderRadius: 9999,
                            fontWeight: 600,
                            fontSize: "clamp(0.8rem, 0.25vw + 0.78rem, 0.95rem)",
                            lineHeight: 1.2, }}
                        >
                            {post.tag}
                        </Tag>
                    </div>
                </Card>
            </Link>
        </Col>
        );
    });
    return (
    
    <Layout style={{ background: "transparent" }}>
        <Layout.Content>
            <Typography.Title level={1} style={{ marginTop: 0 }}>Blog</Typography.Title>
            <Divider style={{ marginTop: 12 }} />
            <Row gutter={[24, 24]}>
            {blogCards}
            </Row>

        </Layout.Content>

        <Layout.Sider
        width={280}
        breakpoint="lg"
        collapsedWidth={0}
        theme="light"
        style={{
          background: "transparent",
          paddingInline: 16,
          paddingBlock: 24,
          borderLeft: "1px solid rgba(5,5,5,0.06)",
          marginLeft: 24,
        }}>
            <Typography.Title level={2} style={{ marginTop: 0 }}>Tags</Typography.Title>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            
                    <Tag.CheckableTag
                    key={1}
                    checked={true}
                    >
                    test
                    </Tag.CheckableTag>
            
                </div>
        </Layout.Sider>
    </Layout>
    
    );
}

export default BlogPage;