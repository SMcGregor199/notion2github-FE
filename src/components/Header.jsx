import { Layout, Menu, Button, Flex, Typography } from "antd";  
import { GithubOutlined } from "@ant-design/icons";

function SiteHeader(){
    const navItems = [
        { key: "1", label: <a href="/">Home</a> },
        { key: "2", label: <a href="/blog">Blog</a> },
        { key: "3", label: <a href="/login">Login</a> },
    ];
    return (
    <>
    <a className="skip-link" href="#main">Skip to main content</a>
    <Layout.Header style={{ background: "#fff", paddingInline: 24, boxShadow: "0 1px 0 rgba(0,0,0,0.06)", }}>
        <Flex align="center"  gap={16}>
        <div > 
            <Typography.Text style={{ color: "black" }}>
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
export{
    SiteHeader
}