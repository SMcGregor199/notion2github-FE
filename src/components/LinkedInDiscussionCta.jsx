import { LinkedinOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import BlogButton from "./BlogButton";

function LinkedInDiscussionCta({ url, placement }) {
    const headingId = `linkedin-discussion-${placement}-title`;

    return (
        <aside className={`linkedin-discussion-cta linkedin-discussion-cta--${placement}`} aria-labelledby={headingId}>
            <Typography.Title id={headingId} level={3}>Continue the conversation</Typography.Title>
            <Typography.Paragraph>
                Have a perspective to share? Join the discussion on LinkedIn.
            </Typography.Paragraph>
            <BlogButton
                accent
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                icon={<LinkedinOutlined aria-hidden="true" />}
            >
                Join the discussion on LinkedIn (opens in a new tab)
            </BlogButton>
        </aside>
    );
}

export default LinkedInDiscussionCta;
