import Hero from "../components/Hero";
import FeaturedBlogs from "../components/FeaturedBlogPosts"
import background from "/img/background-v2.webp";
function Home({initialData}) {
    return (
        <>
            <Hero background={background}/>
            <FeaturedBlogs initialData={initialData}/>
        </>
    );
}

export default Home;
