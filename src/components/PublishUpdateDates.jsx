import{CalendarOutlined,ClockCircleOutlined} from "@ant-design/icons";
import {Typography,Space,Divider} from "antd";
export default function PublishUpdateDates({publishedDate, updatedDate}){
    return(
    <Space style={{alignSelf:"start"}}>
        <Typography.Text type="secondary" style={{fontSize:"1rem"}}>
            <Space>
                <CalendarOutlined />
                {`Published on ${publishedDate}`}
            </Space>
        </Typography.Text>
        <Divider type="vertical" style={{color:"rgba(0, 0, 0, 0.45)", borderInlineStart:"2px solid rgba(5, 5, 5, 0.06)"}}/>
        {updatedDate != "" && 
        <Typography.Text type="secondary" style={{fontSize:"1rem"}}>
            <Space>
                <ClockCircleOutlined />
                {`Last Updated on ${updatedDate}`}
            </Space>
        </Typography.Text>
        }
    </Space>
    )    
}
