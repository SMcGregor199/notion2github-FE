import {Typography, Flex} from 'antd'
function Hero(){
    return(
        <a
            className="discourse-hero-link"
            href="https://www.discourse.center/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Discourse Center in a new tab"
        >
            <section className="discourse-hero">
            <Flex vertical align="center" style={{ position: "relative", zIndex: 1, maxWidth: 700, padding: "0 24px" }}>
                <Typography.Title level={1} 
                style={{
                    color: "white",
                    fontWeight: 800,
                    marginBottom: 16,
                    wordBreak: "normal", 
                }}>
                  Discourse Center
                </Typography.Title>
                <Typography.Paragraph 
                style={{
                    color: "rgba(226, 246, 255, 0.92)",
                    fontWeight: 400,
                    marginBottom: 0,
                    fontSize: "1.15rem",
                    lineHeight: 1.6,
                }}>
                  the future of research writing workflows.
                </Typography.Paragraph>
            </Flex>
            </section>
        </a>
    )
}

export default Hero
