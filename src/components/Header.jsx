import { useState } from "react";
import { Layout, Menu, Button, Avatar, Flex, Typography, Grid } from "antd";  
import { ExportOutlined, GithubOutlined, LinkedinOutlined } from "@ant-design/icons";
const { useBreakpoint } = Grid;
import { Link } from "react-router-dom";



function SiteHeader(){
    const signalJournalKey = "3";
    const [selectedKey, setSelectedKey] = useState(null);
    const navItems = [
        { key: "1", label: <Link to="/">Home</Link> },
        { key: "2", label: <Link to="/blog">Blog</Link> },
        {key:"4", label: <Link to="/case-studies">Case Studies</Link> },
        { key: "5", label: <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a> },
        { key: "6", label: <Link to="/contact">Contact Me</Link> }
    ];
    const signalJournalItem = {
        key: signalJournalKey,
        label: (
            <a
                className="signal-journal-nav-link"
                href="https://shaynemcgregor.substack.com"
                target="_blank"
                rel="noopener noreferrer"
            >
                <span className="signal-journal-nav-label">
                    <span className="signal-journal-nav-text">The Signal Journal</span>
                    <ExportOutlined aria-hidden="true" focusable="false" className="signal-journal-nav-icon" />
                </span>
            </a>
        )
    };
    const screens = useBreakpoint();
    const isMobile = screens.md;

    const handleMenuClick = (info) => {
        if (info.key === signalJournalKey) {
            setSelectedKey(signalJournalKey);
            return;
        }

        setSelectedKey(null);
    };

    return (
    <>
    <a className="skip-link" href="#main">Skip to main content</a>
    <Layout.Header style={{ background: "#fff", paddingInline: 24, }}>
        <Flex align="center"  gap={16}>
        { isMobile &&
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
        
        <nav aria-label="Primary" style={{ flex: 1, minWidth: 0 }}>
            <Menu 
                mode="horizontal"
                items={[...navItems, signalJournalItem]}
                selectedKeys={selectedKey === signalJournalKey ? [signalJournalKey] : []}
                onClick={handleMenuClick}
                style={{ borderBottom: "none", justifyContent: "flex-end" }}
            />
        </nav>
        <Button
            type="default"
            icon={<LinkedinOutlined />}
            href="https://linkedin.com/in/shayne-mcgregor"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open my LinkedIn profile in a new tab"
        >
        </Button>
        <Button
            type="default"
            icon={<GithubOutlined />}
            href="https://github.com/SMcGregor199"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open my GitHub profile in a new tab"
        />
        
        </Flex>
    </Layout.Header>
    </>
        
    );
}
export default SiteHeader
