import { Layout, theme as antdTheme } from "antd";
import { ThemeProvider } from "@emotion/react";
import { Outlet } from "react-router-dom";
import SiteHeader from "./components/Header.jsx";
import SiteFooter from "./components/Footer.jsx";

function AppLayout() {
    const { token } = antdTheme.useToken();

    return(
        <ThemeProvider theme={{token}}>
            <Layout style={{paddingBlock: "2rem"}}>
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
