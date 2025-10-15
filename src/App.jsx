import {Layout, theme as antdTheme} from "antd";
import { ThemeProvider } from "@emotion/react";
import SiteHeader from "./components/Header";
import Hero from "./components/Hero";
import FeaturedBlogPosts from "./components/FeaturedBlogPosts";



function App() {
  const { token } = antdTheme.useToken();
  return (
    <ThemeProvider theme={{token}}>
    <Layout>
      <SiteHeader/>
      <Layout.Content style={{ padding: "24px" }} id="main">
        <Hero/>
        <FeaturedBlogPosts/>
      </Layout.Content>
    </Layout>
    </ThemeProvider> 
  );
}

export default App
