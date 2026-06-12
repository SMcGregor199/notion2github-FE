import Hero from "../components/Hero";
import FeaturedBlogs from "../components/FeaturedBlogPosts"
function Home({initialData}) {
    return (
        <div className="homepage-motif">
            <Hero />
            <FeaturedBlogs initialData={initialData}/>
        </div>
    );
}

export default Home;
