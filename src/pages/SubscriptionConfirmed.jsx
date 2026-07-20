import { Typography } from "antd";
import { Link, useSearchParams } from "react-router-dom";

function SubscriptionConfirmed() {
    const [searchParams] = useSearchParams();
    const confirmed = searchParams.get("result") === "confirmed";
    return (
        <article className="subscription-confirmed">
            <Typography.Title level={1}>{confirmed ? "You’re confirmed" : "That confirmation link is no longer available"}</Typography.Title>
            <Typography.Paragraph>
                {confirmed ? "Thanks for confirming. New Blog Updates will arrive in your inbox when they’re published." : "For your privacy, confirmation links can only be used once and expire after a short time. You can submit the subscription form again to receive a new link."}
            </Typography.Paragraph>
            <Link to="/blog">Back to the blog</Link>
        </article>
    );
}

export default SubscriptionConfirmed;
