import {Typography, Flex} from 'antd'
function Hero(){
    return(
        <section
        style={{
            position: "relative",
            backgroundImage: "url('/background.png')",
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
                    Crafting Seamless Digital Experiences
                </Typography.Title>
                <Typography.Paragraph 
                style={{
                    color: "white",
                    fontWeight: 400,
                    marginBottom: 16,
                }}>
                    I’m a full-stack developer passionate about building innovative and
                    user-centric web applications.
                </Typography.Paragraph>
            </Flex>
        </section>
    )
}

export default Hero
