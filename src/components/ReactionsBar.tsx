import{useState} from "react";
import {Divider, Space, Button} from "antd";
import {QuestionCircleOutlined, QuestionCircleFilled, HeartOutlined, HeartFilled,BulbOutlined,
    BulbFilled,MailOutlined} from "@ant-design/icons";
import type {ReactionsState,ReactionKey, ShareData} from "../types/index.ts";
import type { JSX } from "react";

export default function ReactionsBar({title, id}:{title:string,id:string}):JSX.Element{

    const [reactions, setReactions] = useState<ReactionsState>({
        love:{active:false,count:0},
        confusing:{active:false,count:0},
        thoughtProvoking:{active:false,count:0},
    });

function toggle(type: ReactionKey):void {
    setReactions((prev:ReactionsState):ReactionsState => {
        const wasActive: boolean = prev[type].active;

        if (wasActive) {
            const next: ReactionsState = {
                ...prev,
                [type]: {
                    active: false,
                    count: prev[type].count - 1,
                }
            }
            return next;
        }

        // Deactivate all others and activate the new one
        const newReactions: ReactionsState = {...prev};
        (Object.keys(prev) as ReactionKey[]).forEach((key:ReactionKey) => {
            if (key === type) {
                newReactions[key] = {
                    active: true,
                    count: prev[key].count + 1,
                };
            } else if (prev[key].active) {
                newReactions[key] = {
                    active: false,
                    count: prev[key].count - 1,
                };
            } else {
                newReactions[key] = prev[key];
            }
        });

        return newReactions;
    });
}

    async function handleShare():Promise<void> {
        const shareData: ShareData = {
            title,
            text:"Check out this article",
            url: window.location.href,
        }
        const encodedTitle: string = encodeURIComponent(shareData.title ?? "");
        const encodedBody : string = encodeURIComponent(window.location.href);
        if("share" in navigator && typeof navigator.share === "function"){
          try {
            await navigator.share(shareData);
          } catch {
            const emailurl: string = `mailto:?subject=${encodedTitle}&body=${encodedBody}`;
            window.location.href = emailurl;
          }
          return;
        }
        window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedBody}`;
    }
    return(
        <>
            <Divider></Divider>
                <Space style={{minWidth:"0",maxWidth:"100%",gap:"1.5rem", flexWrap:"wrap"}}>
                    <Button type="default"
                    icon={reactions.love.active ? <HeartFilled/> : <HeartOutlined/>} onClick={()=>toggle("love")}
                    style={{color: reactions.love.active ? "white":"rgba(0, 0, 0, 0.88)",backgroundColor: reactions.love.active ? "#D86F44" : "#ffffff"}}
                    >Loved {reactions.love.count}
                    </Button>
                    <Button type="default"
                    icon={reactions.confusing.active ? <QuestionCircleFilled/> : <QuestionCircleOutlined/>} onClick={()=>toggle("confusing")}
                    style={{color: reactions.confusing.active ? "white":"rgba(0, 0, 0, 0.88)",backgroundColor: reactions.confusing.active ? "#D86F44" : "#ffffff"}}
                    >Confusing {reactions.confusing.count}
                    </Button>
                    <Button type="default"
                    icon={reactions.thoughtProvoking.active ? <BulbFilled/> : <BulbOutlined/>} onClick={()=>toggle("thoughtProvoking")}
                    style={{color: reactions.thoughtProvoking.active ? "white":"rgba(0, 0, 0, 0.88)",backgroundColor: reactions.thoughtProvoking.active ? "#D86F44" : "#ffffff"}}
                    >Thought Provoking {reactions.thoughtProvoking.count}
                    </Button>
                    <Button type="default" icon={<MailOutlined/>} onClick={handleShare}>Share</Button>
                </Space>
            <Divider></Divider>
        </>
    )
}
