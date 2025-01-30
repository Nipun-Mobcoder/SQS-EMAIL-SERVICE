import { SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";
import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";
import { sendMail } from "../config/sesConfig";
import { sendMailType } from "@src/type";

dotenv.config();

export const sendMailSES = async ({ userName, email, fileName, subject }: sendMailType) => {
  try {
    const templatePath = path.join(__dirname, fileName);
    const emailHTML = await ejs.renderFile(templatePath, {
      userName,
      email,
      platform: process.env.SEND_MAIL,
    });

    const params: SendEmailCommandInput = {
      Source: "nipun.bhardwaj@mobcoder.com",
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: emailHTML,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
    };

    const command = new SendEmailCommand(params);
    const sendMailToClient = await sendMail(command);
    console.log(`Email sent to ${email}`, sendMailToClient);
  } catch (error) {
    if (error instanceof Error) console.error("Error sending email:", error.message);
    throw new Error("Failed to send email.");
  }
};
