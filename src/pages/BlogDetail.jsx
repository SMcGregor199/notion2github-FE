import { useParams } from "react-router-dom";
import {Typography,Tag,Divider,Image} from "antd";
import {blogPostsData} from "../data/notionBlogData.js";

function BlogDetail() {
    const { slug } = useParams();
    const post = blogPostsData.find((post)=>post.link===slug);
    if (!post){
        return <h1>404 — Post not found</h1>;
    } 
    const {body} = post;
    const articleContent = body.map((paragraph)=>{
        return <p>{paragraph}</p>
    })
    return (
        <article style={{display:"flex", flexDirection:"column", alignItems:"center", gap:"1rem"}}>
            <Typography.Title level={1}>{post.title}</Typography.Title>
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
            <Divider/>
            <Typography.Title level={3}>{post.summary}</Typography.Title>
           {articleContent}
          
           <Image src={`/${post.thumbnail}`} alt={post.title} preview={false}></Image>
         
         </article>
        
    );
}

export default BlogDetail;