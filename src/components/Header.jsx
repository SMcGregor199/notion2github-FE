import { Layout, Menu, Button } from "antd";  
import { GithubOutlined } from "@ant-design/icons";

function SiteHeader(){
    const items = [
        { key: "1", label: <a href="/">Home</a> },
        { key: "2", label: <a href="/blog">Blog</a> },
        { key: "3", label: <a href="/login">Login</a> },
    ];
    return (
    <>
    <a className="skip-link" href="#main">Skip to main content</a>
    <Layout.Header>
         <div > 
            <span style={{ color: "white" }}>Shayne McGregor</span>   
        </div>
       <Menu
            mode="horizontal"
            items={items}
       >
       </Menu>
        <Button
            type="default"
            icon={<GithubOutlined />}
            href="https://github.com/SMcGregor199"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open my GitHub profile in a new tab"
        />
        
       {/* <nav>
            <ul>
                <li><a href="/" aria-current="page">Home</a></li>
                <li><a href="/blog" aria-current="page">Blog</a></li>
                <li><a href="/login" aria-current="page">Login</a></li>
            </ul>
        </nav>

        <a 
            href="https://github.com/SMcGregor199"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open my GitHub profile in a new tab"
        >
            <svg></svg>
            <span className="sr-only">GitHub</span>
        </a> */}
  
    </Layout.Header>
    </>
        
    );
}
export{
    SiteHeader
}