
import { createRoot } from 'react-dom/client'
import "antd/dist/reset.css";
import "./index.css";
import App from './App.jsx'
import { ConfigProvider, theme as antdTheme } from 'antd';

createRoot(document.getElementById('root')).render(
        <ConfigProvider
      theme={{
        algorithm: antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#D86F44",
          colorTextLightSolid: "#fff",
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
    ><App /></ConfigProvider>
)
