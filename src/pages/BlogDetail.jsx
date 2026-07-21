import { Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import {Button, Image, Skeleton, Spin, Tag, Typography} from "antd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PublishUpdateDates from "../components/PublishUpdateDates";
import ReactionsBar from "../components/ReactionsBar.tsx";
import NewsletterSignup from "../components/NewsletterSignup";
import NotFound from "./NotFound";

const bodyImageStyle = {
    borderRadius: "8px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.18)",
};



function BlogDetail({initialData = [], blogDataStatus = "ready", onRetryBlogData}) {
    const { slug } = useParams();
    const posts = Array.isArray(initialData) ? initialData : [];
    const post = posts.find((post)=>post.link===slug);
    if (!post){
        if (blogDataStatus === "loading") {
            return <BlogPostLoading />;
        }
        if (blogDataStatus === "unavailable") {
            return <BlogPostUnavailable onRetry={onRetryBlogData} />;
        }
        return <NotFound />;
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
    const articleContent = post.bodyMarkdown
        ? renderMarkdownBody(post.bodyMarkdown, post.title)
        : bodySections.map((section,i)=>{
        const blocks = Array.isArray(section?.blocks) ? section.blocks : [];
        if (blocks.length > 0) {
            return (
                <Fragment key={`blocks-${i}`}>
                    {blocks.map((block, blockIndex) => renderBodyBlock(block, `${i}-${blockIndex}`, post.title))}
                </Fragment>
            );
        }

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
       
            <article style={{display:"flex", flexDirection:"column", gap:"1rem", maxWidth:"64ch", marginInline:0}}>
                <Typography.Title level={1}>{post.title}</Typography.Title>
                <PublishUpdateDates publishedDate={formattedDate} updatedDate={formattedUpdatedDate}/>
                {post.tag ? (
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
                ) : null}
                {post.summary ? <Typography.Title level={2}>{post.summary}</Typography.Title> : null}
                <ReactionsBar postId={post.id || post.link} slug={post.link} title={post.title}/>
                {articleContent}
                {post.thumbnail ? (
                    <Image src={`${post.thumbnail}`} alt={post.title} preview={false}></Image>
                ) : null}
                <NewsletterSignup compact />
            </article>     
    );
}

function BlogPostLoading() {
    return (
        <article
            aria-busy="true"
            aria-labelledby="blog-post-loading-title"
            style={{display:"flex", flexDirection:"column", gap:"1rem", maxWidth:"64ch", marginInline:0, width:"100%"}}
        >
            <div role="status" aria-live="polite" style={{display:"inline-flex", alignItems:"center", gap:8}}>
                <Spin size="small" />
                <Typography.Text id="blog-post-loading-title" type="secondary">Loading this post...</Typography.Text>
            </div>
            <Skeleton active title={{width:"68%"}} paragraph={{rows:8, width:["38%", "18%", "22%", "100%", "94%", "97%", "88%", "61%"]}} />
        </article>
    );
}

function BlogPostUnavailable({onRetry}) {
    return (
        <section style={{maxWidth:"64ch", marginInline:0}} aria-labelledby="blog-post-unavailable-title">
            <Typography.Title id="blog-post-unavailable-title" level={1}>This post could not load.</Typography.Title>
            <Typography.Paragraph style={{lineHeight:2}}>
                The blog data service is temporarily unavailable. Please try again.
            </Typography.Paragraph>
            <div style={{display:"flex", gap:"0.75rem", flexWrap:"wrap"}}>
                <Button type="primary" onClick={onRetry}>Retry</Button>
                <Link to="/blog">Back to the blog</Link>
            </div>
        </section>
    );
}

function renderMarkdownBody(bodyMarkdown, postTitle) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ children }) => <Typography.Title level={1}>{children}</Typography.Title>,
                h2: ({ children }) => <Typography.Title level={2}>{children}</Typography.Title>,
                h3: ({ children }) => <Typography.Title level={3}>{children}</Typography.Title>,
                p: ({ children }) => <Typography.Paragraph style={{lineHeight: 2}}>{children}</Typography.Paragraph>,
                blockquote: ({ children }) => (
                    <blockquote style={{borderLeft: "3px solid #c7d2fe", margin: "0 0 1rem", paddingLeft: "1rem"}}>
                        {children}
                    </blockquote>
                ),
                img: ({ src, alt }) => {
                    const safeSrc = safeBodyMediaSrc(src);
                    if (!safeSrc) {
                        return null;
                    }

                    const caption = typeof alt === "string" && alt.trim() !== "image" ? alt.trim() : "";
                    return (
                        <figure style={{margin: "0 0 1rem"}}>
                            <Image src={safeSrc} alt={caption || postTitle} preview={false} style={bodyImageStyle} />
                            {caption ? (
                                <figcaption style={{color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6, marginTop: "0.5rem"}}>
                                    {caption}
                                </figcaption>
                            ) : null}
                        </figure>
                    );
                },
                a: ({ href, children }) => {
                    const safeHref = safeBodyLinkHref(href);
                    if (!safeHref) {
                        return <>{children}</>;
                    }

                    const opensNewTab = isExternalHttpLink(safeHref);
                    return (
                        <a href={safeHref} target={opensNewTab ? "_blank" : undefined} rel={opensNewTab ? "noopener noreferrer" : undefined}>
                            {children}
                        </a>
                    );
                },
            }}
        >
            {bodyMarkdown}
        </ReactMarkdown>
    );
}

function renderBodyBlock(block, keyPrefix, postTitle) {
    if (!block || typeof block !== "object") {
        return null;
    }

    switch (block.type) {
        case "heading_1":
            return <Typography.Title key={keyPrefix} level={1}>{renderParagraphContent(block.text, keyPrefix)}</Typography.Title>;
        case "heading_2":
            return <Typography.Title key={keyPrefix} level={2}>{renderParagraphContent(block.text, keyPrefix)}</Typography.Title>;
        case "heading_3":
            return <Typography.Title key={keyPrefix} level={3}>{renderParagraphContent(block.text, keyPrefix)}</Typography.Title>;
        case "paragraph":
            return renderTextBlock(block.text, keyPrefix);
        case "quote":
            return (
                <blockquote key={keyPrefix} style={{borderLeft: "3px solid #c7d2fe", margin: "0 0 1rem", paddingLeft: "1rem"}}>
                    <Typography.Paragraph style={{lineHeight: 2, marginBottom: 0}}>
                        {renderParagraphContent(block.text, keyPrefix)}
                    </Typography.Paragraph>
                </blockquote>
            );
        case "callout":
            return (
                <Typography.Paragraph key={keyPrefix} style={{background: "#f8fafc", borderLeft: "3px solid #94a3b8", lineHeight: 2, padding: "0.75rem 1rem"}}>
                    {renderParagraphContent(block.text, keyPrefix)}
                </Typography.Paragraph>
            );
        case "bulleted_list_item":
            return (
                <ul key={keyPrefix} style={{marginTop: 0}}>
                    <li>{renderParagraphContent(block.text, keyPrefix)}</li>
                </ul>
            );
        case "numbered_list_item":
            return (
                <ol key={keyPrefix} style={{marginTop: 0}}>
                    <li>{renderParagraphContent(block.text, keyPrefix)}</li>
                </ol>
            );
        case "to_do":
            return (
                <Typography.Paragraph key={keyPrefix} style={{lineHeight: 2}}>
                    <label>
                        <input type="checkbox" checked={block.checked === true} readOnly />{" "}
                        {renderParagraphContent(block.text, keyPrefix)}
                    </label>
                </Typography.Paragraph>
            );
        case "code":
            return (
                <pre key={keyPrefix} style={{background: "#0f172a", color: "#f8fafc", overflowX: "auto", padding: "1rem"}}>
                    <code>{typeof block.text === "string" ? block.text : ""}</code>
                </pre>
            );
        case "divider":
            return <hr key={keyPrefix} style={{border: 0, borderTop: "1px solid #e5e7eb", width: "100%"}} />;
        case "image":
            return renderImageBlock(block, keyPrefix, postTitle);
        case "bookmark":
        case "embed":
        case "link_preview":
        case "video":
        case "file":
        case "pdf":
            return renderLinkedBlock(block, keyPrefix);
        case "unsupported":
            return renderTextBlock(block.text || block.caption, keyPrefix);
        default:
            return renderTextBlock(block.text || block.caption, keyPrefix);
    }
}

function renderTextBlock(text, keyPrefix) {
    if (!hasTextContent(text)) {
        return null;
    }

    return (
        <Typography.Paragraph key={keyPrefix} style={{lineHeight: 2}}>
            {renderParagraphContent(text, keyPrefix)}
        </Typography.Paragraph>
    );
}

function renderImageBlock(block, keyPrefix, postTitle) {
    const src = safeBodyMediaSrc(block.url);
    const caption = hasTextContent(block.caption) ? block.caption : "";
    if (!src) {
        return renderTextBlock(caption, keyPrefix);
    }

    return (
        <figure key={keyPrefix} style={{margin: "0 0 1rem"}}>
            <Image src={src} alt={plainTextFromSerializedText(caption) || postTitle} preview={false} style={bodyImageStyle} />
            {caption ? (
                <figcaption style={{color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6, marginTop: "0.5rem"}}>
                    {renderParagraphContent(caption, `${keyPrefix}-caption`)}
                </figcaption>
            ) : null}
        </figure>
    );
}

function renderLinkedBlock(block, keyPrefix) {
    const href = safeBodyLinkHref(block.href);
    const label = hasTextContent(block.caption) ? block.caption : block.href;
    if (!href) {
        return renderTextBlock(label, keyPrefix);
    }

    const opensNewTab = isExternalHttpLink(href);
    return (
        <Typography.Paragraph key={keyPrefix} style={{lineHeight: 2}}>
            <a href={href} target={opensNewTab ? "_blank" : undefined} rel={opensNewTab ? "noopener noreferrer" : undefined}>
                {renderParagraphContent(label, keyPrefix)}
            </a>
        </Typography.Paragraph>
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
        const content = part?.bold === true ? <strong>{text}</strong> : text;
        const href = safeBodyLinkHref(part?.href);
        if (!href) {
            return <Fragment key={`${keyPrefix}-${index}`}>{content}</Fragment>;
        }

        const opensNewTab = isExternalHttpLink(href);
        return (
            <a
                key={`${keyPrefix}-${index}`}
                href={href}
                target={opensNewTab ? "_blank" : undefined}
                rel={opensNewTab ? "noopener noreferrer" : undefined}
            >
                {content}
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

function safeBodyMediaSrc(src) {
    if (typeof src !== "string") {
        return "";
    }

    const trimmedSrc = src.trim();
    return /^(https?:\/\/|\/(?!\/))/i.test(trimmedSrc) ? trimmedSrc : "";
}

function isExternalHttpLink(href) {
    return /^https?:\/\//i.test(href);
}

function hasTextContent(value) {
    return Boolean(plainTextFromSerializedText(value).trim());
}

function plainTextFromSerializedText(value) {
    if (typeof value === "string") {
        return value;
    }

    if (!Array.isArray(value)) {
        return "";
    }

    return value.map((part) => {
        if (typeof part === "string") {
            return part;
        }

        return typeof part?.text === "string" ? part.text : "";
    }).join("");
}

export default BlogDetail;
