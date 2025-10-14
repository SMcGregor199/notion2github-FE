import {ConfigProvider, Layout, theme as antdTheme} from "antd";
import {SiteHeader} from "./components/Header";



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
          Menu: { itemBorderRadius: 8 },
        },
      }}
    >
    <Layout>
      <SiteHeader/>
      <Layout.Content
        id="main"
      >
        <h1>Main Content Area</h1> 
      </Layout.Content>

    </Layout>
    </ConfigProvider>
  );
}

export default App
