import { LinkedinOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import BlogButton from "./BlogButton";

function LinkedInDiscussionCta({ url, placement }) {
    const headingId = `linkedin-discussion-${placement}-title`;

    return (
        <aside className={`linkedin-discussion-cta linkedin-discussion-cta--${placement}`} aria-labelledby={headingId}>
            <Typography.Title id={headingId} level={3}>Continue the conversation</Typography.Title>
            <Typography.Paragraph>
                Share your perspective on LinkedIn.
            </Typography.Paragraph>
            <BlogButton
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                icon={<LinkedinOutlined aria-hidden="true" />}
            >
                Join discussion
            </BlogButton>
            <Typography.Text type="secondary" className="linkedin-discussion-cta__new-tab-note">Opens in a new tab.</Typography.Text>
        </aside>
    );
}

export default LinkedInDiscussionCta;
