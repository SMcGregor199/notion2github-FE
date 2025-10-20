import { Typography, Button} from 'antd'
import styled from "@emotion/styled";
import {blogPostsData} from "../data/notionBlogData.js";
import BlogCardLong from "./BlogCardLong";

const BlogButton = styled(Button)`
  border-radius: 8px;
  background-color: #f5f5f5;
  color: #000;
  font-weight: 600;
  padding: 8px 20px;
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
  `}
`;

function FeaturedBlogPosts(){
    const blogPosts = blogPostsData.map((post)=>{
        return <BlogCardLong key={post.id} {...post}/>
    })
    return(
        
        <section>
            <Typography.Title level={2}  style={{ margin: 0, fontWeight: 700, color: "black", paddingBlock: "clamp(24px, 6vh, 48px)",letterSpacing: "-0.02em"}}>
                Featured Blog Posts
            </Typography.Title>
            {blogPosts}
        </section>
    )
}

export default FeaturedBlogPosts
