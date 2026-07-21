import { Alert, Input, Typography } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import BlogButton from "./BlogButton";

const NEWSLETTER_ENDPOINT = "https://shaynemcgregordev-be.netlify.app/.netlify/functions/newsletter-subscribe";

function NewsletterSignup({ compact = false }) {
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", whySubscribe: "", website: "" });
    const [status, setStatus] = useState({ type: "", message: "" });
    const [submitting, setSubmitting] = useState(false);

    function updateField(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    }

    async function submit(event) {
        event.preventDefault();
        setSubmitting(true);
        setStatus({ type: "", message: "" });
        try {
            const response = await fetch(NEWSLETTER_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const body = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(body.message || "We could not process that subscription. Please try again.");
            setStatus({ type: "success", message: body.message || "Check your email to confirm your subscription." });
        } catch (error) {
            setStatus({ type: "error", message: error instanceof Error ? error.message : "We could not process that subscription. Please try again." });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className={`newsletter-signup${compact ? " newsletter-signup--compact" : ""}`} aria-labelledby="newsletter-signup-title">
            <Typography.Title id="newsletter-signup-title" level={2}>Get new posts in your inbox</Typography.Title>
            <div className="newsletter-signup__copy">
                <Typography.Paragraph className="newsletter-signup__intro">
                    Occasional notes on engineering, systems, and the ideas behind the work. Prefer a feed reader? The <a href="/rss.xml">RSS feed</a> is always available.
                </Typography.Paragraph>
                <Typography.Text type="secondary" className="newsletter-signup__delivery-note">
                    After subscribing, check your spam or Promotions folder if the confirmation email does not arrive within a few minutes.
                </Typography.Text>
            </div>
            <form className="newsletter-signup__form" onSubmit={submit}>
                <div className="newsletter-signup__grid">
                    <label>
                        <span>First name</span>
                        <Input name="firstName" value={form.firstName} onChange={updateField} autoComplete="given-name" required />
                    </label>
                    <label>
                        <span>Last name</span>
                        <Input name="lastName" value={form.lastName} onChange={updateField} autoComplete="family-name" required />
                    </label>
                </div>
                <label>
                    <span>Email address</span>
                    <Input name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" required />
                </label>
                <label>
                    <span>What would you like to read more about? <em>(optional)</em></span>
                    <Input.TextArea name="whySubscribe" value={form.whySubscribe} onChange={updateField} autoSize={{ minRows: 2, maxRows: 5 }} />
                </label>
                <label className="newsletter-signup__trap" aria-hidden="true">
                    <span>Website</span>
                    <input name="website" value={form.website} onChange={updateField} tabIndex="-1" autoComplete="off" />
                </label>
                <div className="newsletter-signup__actions">
                    <BlogButton htmlType="submit" loading={submitting}>Subscribe</BlogButton>
                    <Typography.Text type="secondary">By subscribing, you agree to the <Link to="/privacy">privacy notice</Link>.</Typography.Text>
                </div>
                {status.message ? <Alert type={status.type || "info"} showIcon message={status.message} role={status.type === "error" ? "alert" : "status"} /> : null}
            </form>
        </section>
    );
}

export default NewsletterSignup;
