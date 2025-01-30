import sgMail from "@sendgrid/mail";
import { sendMailType } from "@src/type";
import ejs from "ejs";
import path from "path";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export const sendMail = async ({ userName, email, fileName, subject, teamName }: sendMailType) => {
  try {
    const templatePath = path.join(__dirname, fileName);
    const emailHTML = await ejs.renderFile(templatePath, {
      userName,
      email,
      platform: process.env.SEND_MAIL,
      teamName,
    });

    const msg = {
      to: email,
      from: { name: "Admin", email: "nipun.bhardwaj@mobcoder.com" },
      subject: subject,
      html: emailHTML,
    };

    await sgMail.send(msg);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    if (error instanceof Error) console.error("Error sending email:", error.message);
    throw new Error("Failed to send email.");
  }
};
