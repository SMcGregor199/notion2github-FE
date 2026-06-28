import { Typography } from "antd";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <section className="not-found-page" aria-labelledby="not-found-title">
            <div className="not-found-page__content">
                <Typography.Text className="not-found-page__eyebrow">Not found</Typography.Text>
                <Typography.Title id="not-found-title" level={1} className="not-found-page__title">
                    404
                </Typography.Title>
                <Typography.Title level={2} className="not-found-page__headline">
                    This page took a wrong turn.
                </Typography.Title>
                <Typography.Paragraph className="not-found-page__copy">
                    The page you were looking for could not be found. It may have moved, been
                    renamed, or never existed in the first place.
                </Typography.Paragraph>
                <Typography.Paragraph className="not-found-page__copy not-found-page__copy--contact">
                    If you&apos;re sure this page is supposed to exist, email me at{" "}
                    <a
                        className="not-found-page__inline-link"
                        href="mailto:shaynemcgregor1@gmail.com"
                    >
                        shaynemcgregor1@gmail.com
                    </a>
                    .
                </Typography.Paragraph>
                <div className="not-found-page__actions">
                    <Link className="not-found-page__action not-found-page__action--primary" to="/">
                        Home
                    </Link>
                    <Link className="not-found-page__action" to="/blog">
                        Blog
                    </Link>
                    <Link className="not-found-page__action" to="/contact">
                        Contact Me
                    </Link>
                </div>
            </div>

            <aside
                className="not-found-page__visual"
                aria-label="Shayne shrugging 404 illustration"
            >
                <div className="not-found-page__image-shell">
                    <img
                        className="not-found-page__image"
                        src="/404-img.png"
                        alt="Shayne shrugging with both hands raised in a playful custom 404 illustration"
                    />
                </div>
            </aside>
        </section>
    );
}

export default NotFound;
