import { Layout, Typography, Tag, Row, Col, Card, Divider, Space } from "antd";
import {Link} from "react-router-dom";
import {blogPostsData} from "../data/notionBlogData.js";
import { Grid } from "antd";
import styled from "@emotion/styled";
import {useState} from "react";
const {CheckableTag} = Tag;

const StyledTag = styled(CheckableTag)`
  border-radius: 8px;
  background-color: #f5f5f5;
  color: #000;
  padding: 4px 10px;
  border: 1px solid #e0e0e0;
  transition: all 0.25s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  ${({ theme }) => `
    &&&:hover {
      background-color: ${theme.token.colorPrimary};
      color: ${theme.token.colorTextLightSolid};
      transform: translateY(-2px);
      box-shadow: 0 3px 6px ${theme.token.colorPrimaryShadow || "rgba(0,0,0,0.15)"};
    }

    &&&:active {
      transform: translateY(0px);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
    }

    &&&:focus-visible {
      outline: 2px solid ${theme.token.colorPrimary};
      outline-offset: 3px;
    }
    &&&.ant-tag-checkable-checked {
      background-color: ${theme.token.colorPrimary};
      color: ${theme.token.colorTextLightSolid};
      transform: translateY(-2px);
      box-shadow: 0 3px 6px ${theme.token.colorPrimaryShadow || "rgba(0,0,0,0.15)"};                              
    }
  `}
`;



function BlogPage() {
    const screens = Grid.useBreakpoint();
    const isDesktop = screens.lg;
    let tags = new Set();
    const [selectedTags, setSelectedTags] = useState(new Set());
    function handleTagState(tag){
        setSelectedTags((prev)=>{
            const newSet = new Set(prev);
            if(newSet.has(tag)){
                newSet.delete(tag);
            }else{
                newSet.add(tag);
            }
            return newSet;
        });
    }

    const blogCards = blogPostsData.map((post)=>{
        tags.add(post.tag);
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
        {!screens.lg &&(
        <div style={{ marginBottom: "1.5em" }}>
        <Typography.Title level={2} style={{ marginTop: 0 }}>Tags</Typography.Title>
        <Space
            wrap
            size={[8, 8]}
            aria-label="Filter by tag"
        >
            
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[...tags].map((tag)=>{
                    return(
                        <StyledTag onChange={handleTagState(tag)} key={tag} checked={selectedTags.has(tag)}>{tag}</StyledTag>
                    );
                })}
            </div>
        </Space>
        </div>
        )}
        <section>
            <Typography.Title level={1} style={{ marginTop: 0 }}>Blog</Typography.Title>
            <Divider style={{ marginTop: 12 }} />

            <Row gutter={[24, 24]}>
                {blogCards}
            </Row>
        </section>



       {isDesktop && <Layout.Sider
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
            
                {[...tags].map((tag)=>{
                    return(
                        <StyledTag onChange={handleTagState(tag)} checked={selectedTags.has(tag)}>{tag}</StyledTag>
                    );
                })}
            
                </div>
        </Layout.Sider> }
        
    </Layout>
    
    );
}

export default BlogPage;