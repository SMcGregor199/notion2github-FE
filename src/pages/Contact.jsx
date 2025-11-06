import { Typography } from "antd";

function Contact(){
    return(
        <section style={{padding:"2rem", maxWidth:"74ch", margin:"0 auto"}}>
            <Typography.Title level={1}>Contact</Typography.Title>
            <Typography.Paragraph>Want to discuss some cool ideas?</Typography.Paragraph>
            <Typography.Paragraph>You have a few options:</Typography.Paragraph>
            <ul>
                <li>            <Typography.Paragraph>Feel free to set up a meeting by grabbing time on 
                my <a target="_blank" rel="noopener noreferrer" href="https://calendly.com/shaynemcgregor1/20min">Calendly</a>
            </Typography.Paragraph></li>
                <li> <Typography.Paragraph>Or you can email me at <a href="mailto:shaynemcgregor1@gmail.com">shaynemcgregor1@gmail.com</a></Typography.Paragraph></li>
                <li> <Typography.Paragraph>Or you can send me a DM on <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/shaynemcgregor/">LinkedIn</a></Typography.Paragraph></li>
            </ul>

           
            
        </section>
        
    )
}

export default Contact;