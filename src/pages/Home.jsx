import Hero from "../components/Hero";
import FeaturedBlogs from "../components/FeaturedBlogPosts"
function Home({initialData}) {
    return (
        <>
            <Hero/>
            <FeaturedBlogs initialData={initialData}/>
        </>
    );
}

export default Home;
