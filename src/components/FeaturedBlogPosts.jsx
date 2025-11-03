
import BlogCardLong from "./BlogCardLong";


function FeaturedBlogPosts({initialData}){
    const blogPosts = initialData.map((post)=>{
        return <BlogCardLong key={post.id} {...post}/>
    })
    return(
        
        <section>
            <Typography.Title level={2}  style={{ margin: 0, fontWeight: 700, color: "black", paddingBlock: "clamp(24px, 6vh, 48px)",letterSpacing: "-0.02em"}}>
                Featured Blog Posts
            </Typography.Title>
            {blogPosts}
        </section>
    )
}

export default FeaturedBlogPosts
