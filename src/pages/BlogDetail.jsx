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
    const bodySections = Array.isArray(body) ? body : [];
    const articleContent = bodySections.map((section,i)=>{
        const {heading, paras} = section;
        const paragraphs = (Array.isArray(paras) ? paras : []).map((paragraph, paragraphIndex)=>{
            return (
                <Typography.Paragraph key={`${i}-${paragraphIndex}`} style={{lineHeight: 2}}>
                    {renderParagraphContent(paragraph, `${i}-${paragraphIndex}`)}
                </Typography.Paragraph>
            )
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
                <ReactionsBar postId={post.id || post.link} slug={post.link} title={post.title}/>
                {articleContent}
                {post.thumbnail ? (
                    <Image src={`${post.thumbnail}`} alt={post.title} preview={false}></Image>
                ) : null}
            </article>     
    );
}

function renderParagraphContent(paragraph, keyPrefix) {
    if (typeof paragraph === "string") {
        return paragraph;
    }

    if (!Array.isArray(paragraph)) {
        return "";
    }

    return paragraph.map((part, index) => {
        const text = typeof part?.text === "string" ? part.text : "";
        const href = safeBodyLinkHref(part?.href);
        if (!href) {
            return <Fragment key={`${keyPrefix}-${index}`}>{text}</Fragment>;
        }

        const opensNewTab = isExternalHttpLink(href);
        return (
            <a
                key={`${keyPrefix}-${index}`}
                href={href}
                target={opensNewTab ? "_blank" : undefined}
                rel={opensNewTab ? "noopener noreferrer" : undefined}
            >
                {text}
            </a>
        );
    });
}

function safeBodyLinkHref(href) {
    if (typeof href !== "string") {
        return "";
    }

    const trimmedHref = href.trim();
    if (!trimmedHref) {
        return "";
    }

    return /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(trimmedHref) ? trimmedHref : "";
}

function isExternalHttpLink(href) {
    return /^https?:\/\//i.test(href);
}

export default BlogDetail;
