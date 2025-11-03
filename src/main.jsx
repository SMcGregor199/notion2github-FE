
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router} from 'react-router-dom';
import "antd/dist/reset.css";
import "./index.css";
import App from './App.jsx'
import { ConfigProvider, theme as antdTheme } from 'antd';
const API = "https://shaynemcgregordev-be.netlify.app/.netlify/functions/notion-blog-data";

const initialPostData = fetch(API)
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.error(error));

createRoot(document.getElementById('root')).render(

<React.StrictMode>
  <Router>
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
    >
      <App initialData={initialPostData}/>
    </ConfigProvider>
  </Router>
</React.StrictMode>
)
