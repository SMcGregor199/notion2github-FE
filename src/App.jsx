import {Routes, Route } from 'react-router-dom';
import AppLayout from "./AppLayout";
import Home from "./pages/Home";
import BlogPage from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import CaseStudies from "./pages/CaseStudies";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import SubscriptionConfirmed from "./pages/SubscriptionConfirmed";
function App({
  initialData,
  isBlogDataLoading = false,
  blogDataStatus = isBlogDataLoading ? "loading" : "ready",
  onRetryBlogData,
}) {
  
  return (
      <Routes>
      {/* Shared layout routes */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home initialData={initialData}/>} />
        <Route path="/blog" element={<BlogPage initialData={initialData} isBlogDataLoading={isBlogDataLoading}/>} />
        <Route
          path="/blog/:slug"
          element={
            <BlogDetail
              initialData={initialData}
              blogDataStatus={blogDataStatus}
              onRetryBlogData={onRetryBlogData}
            />
          }
        />
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/subscribe/confirmed" element={<SubscriptionConfirmed />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App
