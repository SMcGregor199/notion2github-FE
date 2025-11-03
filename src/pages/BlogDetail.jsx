import { useParams } from "react-router-dom";
import {Typography,Tag,Divider,Image} from "antd";




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
        const paragraphs = paras.map((paragraph)=>{
            return <Typography.Paragraph key={i} style={{lineHeight: 2}}>{paragraph}</Typography.Paragraph>
        });
        return(
            <>
            <Typography.Title level={3} key={i} style={{alignSelf:"start"}}>{heading}</Typography.Title>
            {paragraphs}
            </>
        )
    
    });
    return (
        <section style={{padding:"2rem", maxWidth:"74ch", margin:"0 auto"}}>
            <article style={{display:"flex", flexDirection:"column", gap:"1rem"}}>
                <Typography.Title level={1}>{post.title}</Typography.Title>
                <Typography.Text type="secondary" style={{alignSelf:"start"}}>{`Published on ${formattedDate}`}</Typography.Text>
                {formattedUpdatedDate != "" && <Typography.Text type="secondary" style={{alignSelf:"start"}}>{`Last Updated on ${formattedUpdatedDate}`}</Typography.Text>}
                <Tag color="geekblue" style={{ width: "fit-content", alignSelf:"start", background: "#eef2ff",     
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
                <Typography.Title level={2}>{post.summary}</Typography.Title>
                {articleContent}
                <Image src={`${post.thumbnail}`} alt={post.title} preview={false}></Image>
            </article>
        </section>        
    );
}

export default BlogDetail;