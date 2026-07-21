import { useState } from "react";
import { Layout, Menu, Button, Avatar, Flex, Typography, Grid } from "antd";  
import { GithubOutlined, LinkedinOutlined, WifiOutlined } from "@ant-design/icons";
const { useBreakpoint } = Grid;
import { Link } from "react-router-dom";



function SiteHeader(){
    const supportLinkKey = "3";
    const [selectedKey, setSelectedKey] = useState(null);
    const navItems = [
        { key: "1", label: <Link to="/">Home</Link> },
        { key: "2", label: <Link to="/blog">Blog</Link> },
        { key: "5", label: <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a> },
        { key: "6", label: <Link to="/contact">Contact Me</Link> }
    ];
    const supportLinkItem = {
        key: supportLinkKey,
        label: (
            <a
                className="support-nav-link"
                href="https://buymeacoffee.com/smcgregor199"
                target="_blank"
                rel="noopener noreferrer"
            >
                Buy Me a Coffee
            </a>
        )
    };
    const screens = useBreakpoint();
    const showIdentity = screens.md;
    const compactHeader = !screens.md;

    const handleMenuClick = (info) => {
        if (info.key === supportLinkKey) {
            setSelectedKey(supportLinkKey);
            return;
        }

        setSelectedKey(null);
    };

    return (
    <>
    <a className="skip-link" href="#main">Skip to main content</a>
    <Layout.Header style={{ background: "#fff", paddingInline: compactHeader ? 8 : 24 }}>
        <Flex align="center" gap={compactHeader ? 8 : 16} style={{ width: "100%" }}>
        { showIdentity &&
            <>
            <Avatar
            src="/profile-pic.png"
            alt="Profile picture of Shayne McGregor"
            size={60}
            />
            <div >
                <Typography.Text style={{ color: "black", fontWeight: "bold" }}>
                    Shayne McGregor
                </Typography.Text>  
            </div>
            </>
        }
        
        <nav
            aria-label="Primary"
            style={{
                flex: compactHeader ? "0 1 136px" : "1 1 0",
                maxWidth: compactHeader ? 136 : undefined,
                minWidth: 0,
                overflow: compactHeader ? "hidden" : undefined,
            }}
        >
            <Menu 
                mode="horizontal"
                items={[...navItems, supportLinkItem]}
                selectedKeys={selectedKey === supportLinkKey ? [supportLinkKey] : []}
                onClick={handleMenuClick}
                style={{ borderBottom: "none", justifyContent: compactHeader ? "flex-start" : "flex-end", minWidth: 0 }}
            />
        </nav>
        <Flex align="center" gap={compactHeader ? 6 : 8} style={{ flex: "0 0 auto" }}>
            <Button
                type="default"
                icon={<GithubOutlined />}
                href="https://github.com/SMcGregor199"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open my GitHub profile in a new tab"
            />
            <Button
                type="default"
                icon={<WifiOutlined />}
                href="/rss.xml"
                aria-label="Open RSS feed"
            />
            <Button
                type="default"
                icon={<LinkedinOutlined />}
                href="https://linkedin.com/in/shayne-mcgregor"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open my LinkedIn profile in a new tab"
            />
        </Flex>
        
        </Flex>
    </Layout.Header>
    </>
        
    );
}
export default SiteHeader
