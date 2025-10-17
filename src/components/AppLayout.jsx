import { Layout, theme as antdTheme } from "antd";
import { ThemeProvider } from "@emotion/react";
import { Outlet } from "react-router-dom";
import SiteHeader from "./Header.jsx";
import SiteFooter from "./Footer.jsx";

function AppLayout() {
    const { token } = antdTheme.useToken();

    return(
        <ThemeProvider theme={{token}}>
            <Layout>
                <SiteHeader/>
                    <Layout.Content style={{ padding: "24px" }} id="main">
                        <Outlet/>
                    </Layout.Content>
                <SiteFooter/>
            </Layout>
        </ThemeProvider> 
    )
}
export default AppLayout
