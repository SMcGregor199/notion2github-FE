import {ConfigProvider, Layout, theme as antdTheme} from "antd";
import SiteHeader from "./components/Header";
import Hero from "./components/Hero";



function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#395662",
          colorBgLayout: "#fff",
          fontSize: "clamp(0.95rem, 2.8vw, 1.25rem)",
          fontSizeHeading1: "clamp(1.5rem, 6.5vw, 4.0625rem)",
          fontSizeHeading2: "clamp(1.25rem, 4vw, 2.25rem)",
          fontSizeHeading3: "clamp(1.125rem, 3vw, 1.75rem)",
          fontFamily: "'Noto Sans', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          fontFamilyCode: "'Fira Code', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        },
        components: {
          Layout: { headerHeight: 64 },
        },
      }}
    >
    <Layout>
      <SiteHeader/>
      <Layout.Content style={{ padding: "24px" }} id="main">
        <Hero/>
      </Layout.Content>
    </Layout>
    </ConfigProvider>
  );
}

export default App
