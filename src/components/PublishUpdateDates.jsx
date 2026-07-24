import {useEffect} from "react";
import{CalendarOutlined,ClockCircleOutlined, DownloadOutlined} from "@ant-design/icons";
import {Typography,Space,Divider} from "antd";
import BlogButton from "./BlogButton";

const prefetchedPdfUrls = new Set();

function prefetchPdf(downloadHref) {
    if (!downloadHref || prefetchedPdfUrls.has(downloadHref) || typeof window === "undefined" || typeof window.fetch !== "function") {
        return;
    }

    prefetchedPdfUrls.add(downloadHref);
    window.fetch(downloadHref, {credentials: "same-origin", cache: "force-cache"})
        .then((response) => response.arrayBuffer())
        .catch(() => prefetchedPdfUrls.delete(downloadHref));
}

export default function PublishUpdateDates({publishedDate, updatedDate, downloadHref, postTitle}){
    useEffect(() => {
        prefetchPdf(downloadHref);
    }, [downloadHref]);

    return(
    <Space data-testid="post-metadata" style={{alignSelf:"start"}} wrap>
        <Typography.Text type="secondary" style={{fontSize:"1rem"}}>
            <Space>
                <CalendarOutlined />
                {`Published on ${publishedDate}`}
            </Space>
        </Typography.Text>
        {updatedDate != "" && <>
        <Divider type="vertical" style={{color:"rgba(0, 0, 0, 0.45)", borderInlineStart:"2px solid rgba(5, 5, 5, 0.06)"}}/>
        <Typography.Text type="secondary" style={{fontSize:"1rem"}}>
            <Space>
                <ClockCircleOutlined />
                {`Last Updated on ${updatedDate}`}
            </Space>
        </Typography.Text>
        </>}
        {downloadHref ? <>
        <Divider type="vertical" style={{color:"rgba(0, 0, 0, 0.45)", borderInlineStart:"2px solid rgba(5, 5, 5, 0.06)"}}/>
        <BlogButton
            size="small"
            icon={<DownloadOutlined />}
            href={downloadHref}
            aria-label={`Download ${postTitle || "this post"} as PDF`}
            style={{padding:"4px 10px", minHeight:30, lineHeight:1.2}}
            onPointerEnter={() => prefetchPdf(downloadHref)}
            onFocus={() => prefetchPdf(downloadHref)}
        >
            Download PDF
        </BlogButton>
        </> : null}
    </Space>
    )    
}
