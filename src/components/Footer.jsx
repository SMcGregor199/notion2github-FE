import { Layout, Button, Space, Typography } from "antd";  
import { GithubOutlined, LinkedinOutlined } from "@ant-design/icons";

function Footer(){
    return(
        <Layout.Footer style={{ background: "#fff", paddingInline: 24,margin:"auto" }}>
           <Space size="large" align="center" style={{ marginBottom: 8,  display: "flex", justifyContent: "center", gap:"16px" }}>
                <Button icon={<LinkedinOutlined />} href="https://linkedin.com/in/shayne-mcgregor" target="_blank" rel="noopener noreferrer" aria-label="Open my LinkedIn profile in a new tab"></Button>
                <Button icon={<GithubOutlined />} href="https://github.com/SMcGregor199" target="_blank" rel="noopener noreferrer" aria-label="Open my GitHub profile in a new tab"></Button>
            </Space>
                <Typography.Text style={{ display: "block" }}>
                    © {new Date().getFullYear()} Shayne McGregor
                </Typography.Text>
        </Layout.Footer> 
        
    )
}

export default Footer
