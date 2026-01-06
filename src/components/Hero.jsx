import {Typography, Flex} from 'antd'
function Hero({background}){
    return(
        <section
        style={{
            position: "relative",
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            textAlign: "center",
            overflow: "hidden",
            paddingBlock: "clamp(48px, 12vh, 96px)", 
        }}
        >
            <Flex vertical align="center"style={{ position: "relative", zIndex: 1, maxWidth: 700, padding: "0 24px" }}>
                <Typography.Title level={1} 
                style={{
                    color: "white",
                    fontWeight: 800,
                    marginBottom: 16,
                    wordBreak: "normal", 
                }}>
                  This isn’t hype-driven development
                </Typography.Title>
                <Typography.Paragraph 
                style={{
                    color: "white",
                    fontWeight: 400,
                    marginBottom: 16,
                }}>
                  I build full-stack web applications with an emphasis on clarity, tradeoffs, and software that holds up over time.
                </Typography.Paragraph>
            </Flex>
        </section>
    )
}

export default Hero
