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
      <Layout.Content id="main">
        <Hero/>
      </Layout.Content>
    </Layout>
    </ConfigProvider>
  );
}

export default App
