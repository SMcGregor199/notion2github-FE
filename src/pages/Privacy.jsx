import { Typography } from "antd";

function Privacy() {
    return (
        <article className="privacy-page">
            <Typography.Title level={1}>Privacy</Typography.Title>
            <Typography.Paragraph>
                If you subscribe to Blog Updates, I store your first name, last name, email address, and any optional reading interests you share. I also keep consent, confirmation, delivery, and opt-out status needed to run the list responsibly.
            </Typography.Paragraph>
            <Typography.Paragraph>
                Notion is the subscriber record of truth. Resend processes delivery, hosted unsubscribe links, and bounce handling. Subscriber information is not sold.
            </Typography.Paragraph>
            <Typography.Paragraph>
                You can unsubscribe with the link in any newsletter. To request deletion or ask a privacy question, email <a href="mailto:updates@shaynemcgregor.dev">updates@shaynemcgregor.dev</a>.
            </Typography.Paragraph>
        </article>
    );
}

export default Privacy;
