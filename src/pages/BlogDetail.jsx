import { Fragment } from "react";
import { useParams } from "react-router-dom";
import {Typography,Tag,Image} from "antd";
import PublishUpdateDates from "../components/PublishUpdateDates";
import ReactionsBar from "../components/ReactionsBar.tsx";




function BlogDetail({initialData}) {
    const { slug } = useParams();
    const post = initialData.find((post)=>post.link===slug);
    if (!post){
        return <h1>404 — Post not found</h1>;
    } 
    const {body, publishedDate, updatedDate} = post;
    let formattedUpdatedDate = "";
    const date = new Date(publishedDate);
    const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    });
    if(updatedDate != ""){
        formattedUpdatedDate = new Date(updatedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        });
    }
    const articleContent = body.map((section,i)=>{
        const {heading, paras} = section;
        const paragraphs = paras.map((paragraph, paragraphIndex)=>{
            return <Typography.Paragraph key={`${i}-${paragraphIndex}`} style={{lineHeight: 2}}>{paragraph}</Typography.Paragraph>
        });
        return(
            <Fragment key={`${heading}-${i}`}>
            <Typography.Title level={3} style={{alignSelf:"start"}}>{heading}</Typography.Title>
            {paragraphs}
            </Fragment>
        )
    
    });
    return (
       
            <article style={{display:"flex", flexDirection:"column", gap:"1rem", maxWidth:"64ch",justifySelf:"center"}}>
                <Typography.Title level={1}>{post.title}</Typography.Title>
                <PublishUpdateDates publishedDate={formattedDate} updatedDate={formattedUpdatedDate}/>
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
                <Typography.Title level={2}>{post.summary}</Typography.Title>
                <ReactionsBar articleTitle={post.title}/>
                {articleContent}
                {post.thumbnail ? (
                    <Image src={`${post.thumbnail}`} alt={post.title} preview={false}></Image>
                ) : null}
            </article>     
    );
}

export default BlogDetail;
