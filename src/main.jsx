
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router} from 'react-router-dom';
import "antd/dist/reset.css";
import "./index.css";
import App from './App.jsx'
import { ConfigProvider, theme as antdTheme } from 'antd';
import { blogPostsData as fallbackBlogPostsData } from "./data/notionBlogData.js";
const LATEST_API = "https://shaynemcgregordev-be.netlify.app/.netlify/functions/notion-blog-data";
const CACHE_DATA = "blogDataCache";
const CACHE_VER  = "blogDataVersion";

function fetchCachedData(){
  try {
    const cachedData = localStorage.getItem(CACHE_DATA);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (err) {
    console.warn("Ignoring invalid cached blog data", err);
    localStorage.removeItem(CACHE_DATA);
    localStorage.removeItem(CACHE_VER);
    return null;
  }
}

async function revalidateBlogDataInBg(){
 try{
    const res = await fetch(LATEST_API, { cache: "no-store"});
    if(!res.ok){
      return;
    }
    const fresh = await res.json();
    const newVersion = res.headers.get("etag") || "";
    localStorage.setItem(CACHE_DATA, JSON.stringify(fresh));
    localStorage.setItem(CACHE_VER, newVersion);
 }
 catch(err){
    console.warn("Blog data revalidation skipped", err);
 }
}

async function loadInitialBlogData(){
  const cachedData = fetchCachedData();

  try{
    const res = await fetch(LATEST_API,{cache: "no-store"});
    if(!res.ok){
      throw new Error(`Blog API request failed with status ${res.status}`);
    }
    const fresh = await res.json();
    const newVersion = res.headers.get("etag") || "";
    localStorage.setItem(CACHE_DATA, JSON.stringify(fresh));
    localStorage.setItem(CACHE_VER, newVersion);
    return fresh;
  }
  catch(err){
    console.warn("Falling back to cached or bundled blog data", err);
    return cachedData ?? fallbackBlogPostsData;
  }
}

let initialPostData = await loadInitialBlogData();
revalidateBlogDataInBg()

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
        Button: {
          colorPrimaryHover: "#D86F44",   // hover text/icon color
        }
      },
      }}
    >
      <App initialData={initialPostData}/>
    </ConfigProvider>
  </Router>
</React.StrictMode>
)
