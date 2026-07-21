import {Card, Flex, Typography, Tag, Image} from 'antd'
import BlogButton from "./BlogButton";

function BlogCardLong(props){
    return(
            <Card className="blog-card"
            
            style={{
                borderRadius: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                padding: "clamp(16px, 3vw, 28px)"
            }}
            >
                <Flex align="stretch" justify="space-between" gap={24} wrap="wrap">
                    <Flex vertical gap={12} style={{flex:1, minWidth:240, paddingRight: "clamp(0px, 4vw, 28px)"}}>
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
                        <Image
                            src={props.thumbnail}
                            alt={props.title}
                            width={320}
                            height="auto"
                            style={{ borderRadius: 12, objectFit: "cover",flexShrink: 0,
                                    aspectRatio: "8 / 5",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)"
                            }}
                            preview={false}
                        />
                    ) : null}
                </Flex>
            </Card>
        
    )
}

export default BlogCardLong
