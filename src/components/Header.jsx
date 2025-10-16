import { Layout, Menu, Button, Avatar, Flex, Typography } from "antd";  
import { GithubOutlined, LinkedinOutlined } from "@ant-design/icons";

function SiteHeader(){
    const navItems = [
        { key: "1", label: <a href="/">Home</a> },
        { key: "2", label: <a href="/blog">Blog</a> },
        { key: "3", label: <a href="/login">Login</a> },
    ];
    return (
    <>
    <a className="skip-link" href="#main">Skip to main content</a>
    <Layout.Header style={{ background: "#fff", paddingInline: 24, }}>
        <Flex align="center"  gap={16}>
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
        
        <nav aria-label="Primary" style={{ flex: 1, minWidth: 0 }}>
            <Menu 
                mode="horizontal"
                items={navItems}
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
