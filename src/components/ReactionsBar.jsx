import{useState} from "react";
import {Divider, Space, Button} from "antd";
import {QuestionCircleOutlined, QuestionCircleFilled, HeartOutlined, HeartFilled,BulbOutlined,
    BulbFilled,MailOutlined} from "@ant-design/icons";

export default function ReactionsBar({articleTitle}){
    const [reactions, setReactions] = useState({
        love:{active:false,count:0},
        confusing:{active:false,count:0},
        thoughtProvoking:{active:false,count:0},
    });

function toggle(type) {
    setReactions((prev) => {
        const wasActive = prev[type].active;

        if (wasActive) {
            return {
                ...prev,
                [type]: {
                    active: false,
                    count: prev[type].count - 1,
                }
            };
        }

        // Deactivate all others and activate the new one
        const newReactions = {};
        Object.keys(prev).forEach(key => {
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

    function handleShare(){
        const shareData = {
            title:articleTitle,
            text:"Check out this article",
            url: window.location.href,
        }
        if(navigator.share){
            navigator.share(shareData);
        }else {
            window.location.href = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.url)}`;
        }
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
