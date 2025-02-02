import {Router} from "express";
import nodemailer from "nodemailer";
const emailRouter = Router();

const send = async (req, res) => { 
    const {to, subject, text} = req.body;
    const {sendersemail, password} = req.body;
    const transporter = await nodemailer.createTransport({
        service: 'Gmail', // You can use other email services
        auth: {
            user: sendersemail, // Replace with your email
            pass: password, // Replace with your email password or app password
        },
    });

    const mailOptions = {
        from:  sendersemail, // Sender address
        to: to, // List of recipients
        subject: subject, // Subject line
        text: text, // Plain text body
        html: '<p>This is a test email sent using <b>Nodemailer</b>!</p>', // HTML body (optional)
      };
    
     await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error:', error);
        } else {
          console.log('Email sent successfully:', info.response);
        }
      });
}



emailRouter.post("/send", send);


export default emailRouter;