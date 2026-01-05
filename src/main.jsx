
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router} from 'react-router-dom';
import "antd/dist/reset.css";
import "./index.css";
import App from './App.jsx'
import { ConfigProvider, theme as antdTheme } from 'antd';
const LATEST_API = "https://shaynemcgregordev-be.netlify.app/.netlify/functions/notion-blog-data";
const CACHE_DATA = "blogDataCache";
const CACHE_VER  = "blogDataVersion";

function fetchCachedData(){
  const cachedData = localStorage.getItem(CACHE_DATA);
  return cachedData ? JSON.parse(cachedData) : null;
  
}
async function revalidateBlogDataInBg(){
 const cachedVersion = localStorage.getItem(CACHE_VER) || "";
 try{
  //make a fetch (GET) request to the server, but only return data if the key I'm including in the If-None-Match header is different than the key returned in the ETag header
  // I'm using the cache: "no-store" option to ensure the browser doesn't use its own cache and to make a full network request. I'm controlling caching.
    const res = await fetch(LATEST_API, { headers: cachedVersion ? { "if-none-match": cachedVersion } : {}, cache: "no-store"});
    //the server will respond with a 304 if the key I'm including in the If-None-Match header is the same as the key returned in the ETag header
    //we then return early if this is the case. 
    if (res.status === 304) return;
    if(res.ok){
       const fresh = await res.json();
       const newVersion = res.headers.get("etag") || "";
       localStorage.setItem(CACHE_DATA, JSON.stringify(fresh));
       localStorage.setItem(CACHE_VER, newVersion);
    }
 }
 catch(err){
    console.error("Failed to revalidate blog data", err);
 }
}

  
let initialPostData = fetchCachedData();
if(!initialPostData){
  initialPostData = await fetch(LATEST_API,{cache: "no-store"}).then(res => res.json()); 
}
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
