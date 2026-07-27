import FeaturedBlogs from "../components/FeaturedBlogPosts"
function Home({initialData}) {
    return (
        <div className="homepage-motif">
            <header className="homepage-title-banner">
                <h1>Notes from Shayne</h1>
            </header>
            <FeaturedBlogs initialData={initialData}/>
        </div>
    );
}

export default Home;
