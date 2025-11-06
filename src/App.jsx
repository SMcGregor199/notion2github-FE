import {Routes, Route } from 'react-router-dom';
import AppLayout from "./AppLayout";
import Home from "./pages/Home";
import BlogPage from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
function App({initialData}) {
  
  return (
      <Routes>
      {/* Shared layout routes */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home initialData={initialData}/>} />
        <Route path="/blog" element={<BlogPage initialData={initialData}/>} />
        <Route path="/blog/:slug" element={<BlogDetail initialData={initialData}/>} />
        <Route path="/contact" element={<Contact/>}/>
        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
      </Route>
    </Routes>
  );
}

export default App

