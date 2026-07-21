import {Card, Flex, Typography, Tag, Image} from 'antd'
import BlogButton from "./BlogButton";

function BlogCardLong(props){
    return(
            <Card className="blog-card"
            style={{
                borderRadius: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
            styles={{
                body: {
                    padding: "clamp(14px, 2vw, 18px)",
                },
            }}
            >
                <div className="blog-card__layout">
                    <Flex className="blog-card__copy" vertical gap={12}>
                        <Tag color="geekblue" style={{ width: "fit-content", background: "#eef2ff",     
                            color: "#1d4ed8",
                            border: "1px solid #c7d2fe",
                            padding: "2px 10px",
                            borderRadius: 9999,
                            fontWeight: 600,
                            fontSize: "clamp(0.8rem, 0.25vw + 0.78rem, 0.95rem)",
                            lineHeight: 1.2, }}
                        >
                            {props.tag}
                        </Tag>
                        <Typography.Title
                            level={3}
                            style={{
                            margin: 0,
                            fontWeight: 800,
                            color: "black",
                            letterSpacing: "-0.01em",
                            fontSize: "clamp(1.25rem, 1.2vw + 1rem, 1.75rem)"
                            }}
                        >
                            {props.title}
                        </Typography.Title>
                        <Typography.Paragraph
                            style={{
                            marginBottom: 16,
                            color: "rgba(0,0,0,0.62)",
                            lineHeight: 1.65,
                            fontSize: "clamp(1rem, 0.4vw + 0.95rem, 1.25rem)",
                            maxWidth: "62ch"
                            }}
                        >
                            {props.summary}
                        </Typography.Paragraph>
                        <div style={{paddingTop:"1rem"}}>
                            <BlogButton rootClassName="blog-btn" variant="solid" href={`/blog/${props.link}`} rel="noopener noreferrer" type="default" aria-label={`Read ${props.title}`}>Read More</BlogButton>
                        </div>
                    </Flex>
                    {props.thumbnail ? (
                        <div className="blog-card__media">
                            <Image
                                className="blog-card__image"
                                src={props.thumbnail}
                                alt={props.title}
                                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
                                preview={false}
                            />
                        </div>
                    ) : null}
                </div>
            </Card>
        
    )
}

export default BlogCardLong
