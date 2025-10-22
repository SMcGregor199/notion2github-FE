import {Routes, Route } from 'react-router-dom';
import AppLayout from "./AppLayout";
import Home from "./pages/Home";
import BlogPage from "./pages/Blog";

function App() {
  
  return (
      <Routes>
      {/* Shared layout routes */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogPage />} />
        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
      </Route>
    </Routes>
  );
}

export default App

