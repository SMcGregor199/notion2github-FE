import { useEffect, useState } from "react";
import { Space, Spin, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BlogButton from "../components/BlogButton";

const EMPTY_RESUME = {
    status: "draft",
    title: "Shayne McGregor — Resume",
    markdown: "",
};

function ResumeLink({ href = "", children, ...props }) {
    const isExternal = /^https?:\/\//i.test(href)
        && new URL(href).hostname !== window.location.hostname;

    return (
        <a
            href={href}
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            {...props}
        >
            {children}
        </a>
    );
}

function Resume() {
    const [resume, setResume] = useState(EMPTY_RESUME);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadResume() {
            try {
                const response = await fetch("/resume.json", { cache: "no-store" });
                const data = await response.json();
                if (!cancelled && response.ok && data?.status === "approved" && typeof data.markdown === "string") {
                    setResume(data);
                }
            } catch {
                // The stable PDF fallback remains available if generated content is not yet published.
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadResume();
        return () => {
            cancelled = true;
        };
    }, []);

    const hasPublishedResume = resume.status === "approved" && resume.markdown.trim().length > 0;

    return (
        <section className="resume-page" aria-labelledby="resume-title">
            <div className="resume-page__header">
                <div>
                    {hasPublishedResume ? (
                        <Typography.Text id="resume-title" type="secondary">A current general resume.</Typography.Text>
                    ) : (
                        <>
                            <Typography.Title id="resume-title" level={1}>{resume.title}</Typography.Title>
                            <Typography.Paragraph type="secondary">The current resume is available as a PDF.</Typography.Paragraph>
                        </>
                    )}
                </div>
                <Space wrap>
                    <BlogButton icon={<DownloadOutlined />} href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                        Download PDF
                    </BlogButton>
                </Space>
            </div>

            {isLoading ? (
                <div className="resume-page__loading" role="status" aria-live="polite">
                    <Spin size="small" />
                    <Typography.Text type="secondary">Loading resume…</Typography.Text>
                </div>
            ) : hasPublishedResume ? (
                <article className="resume-page__content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: ResumeLink }}>{resume.markdown}</ReactMarkdown>
                </article>
            ) : (
                <object className="resume-page__pdf" data="/resume.pdf" type="application/pdf" aria-label="Shayne McGregor resume PDF">
                    <Typography.Paragraph>
                        Your browser cannot display this PDF inline. <a href="/resume.pdf">Download the resume PDF</a> instead.
                    </Typography.Paragraph>
                </object>
            )}
        </section>
    );
}

export default Resume;
