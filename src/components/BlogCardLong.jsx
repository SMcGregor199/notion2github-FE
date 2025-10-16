import {Card, Flex, Typography, Tag, Button, Image} from 'antd'
import styled from "@emotion/styled";

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

function BlogCardLong(){
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
                            Technology
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
                            Building a Scalable E-commerce Platform
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
                            Learn how I designed and implemented a robust e-commerce platform using
                            modern technologies.
                        </Typography.Paragraph>
                        <div style={{paddingTop:"1rem"}}>
                            <BlogButton rootClassName="blog-btn" variant="solid"  type="default">Read More</BlogButton>
                        </div>
                    </Flex>
                
                    <Image
                        src="/blog-thumbnail.png"
                        alt="Abstract illustration for the article"
                        width={320}
                        height={180}
                        style={{ borderRadius: 12, objectFit: "cover",flexShrink: 0,
                                boxShadow: "0 1px 2px rgba(0,0,0,0.06)" 
                        }}
                        preview={false}
                    />
                </Flex>
            </Card>
        
    )
}

export default BlogCardLong
