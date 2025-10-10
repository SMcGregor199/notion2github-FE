function Header(){
    return (
    <>
    <a class="skip-link" href="#main">Skip to main content</a>
    <header>
        
        <div>
            <a href="/">
            <svg></svg>
            <span>Shayne McGregor</span>
            </a>
        </div>
        <nav>
            <ul>
                <li><a href="/" aria-current="page">Home</a></li>
                <li><a href="/blog" aria-current="page">Blog</a></li>
                <li><a href="/login" aria-current="page">Login</a></li>
            </ul>
        </nav>

        <a 
            href="https://github.com/SMcGregor199"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open my GitHub profile in a new tab"
        >
        <svg></svg>
        <span class="sr-only">GitHub</span>
        </a>
  
    </header>
    </>
        
    );
}
export{
    Header
}