import "dotenv/config";
import sqsClient from "./config/AWSConfig";
import {
  ReceiveMessageCommand,
  ReceiveMessageCommandInput,
  DeleteMessageCommand,
  DeleteMessageCommandInput,
} from "@aws-sdk/client-sqs";
// import { sendMailSES } from "./helper/sendMailSes";
import { sendMail } from "./helper/sendMail";

const runSQS = async () => {
  while (true) {
    try {
      var queueURL = `https://sqs.${process.env.AWS_REGION}.amazonaws.com/${process.env.ACCOUNT_ID}/${process.env.SQS_NAME}`;

      var params: ReceiveMessageCommandInput = {
        MaxNumberOfMessages: 10,
        MessageAttributeNames: ["All"],
        QueueUrl: queueURL,
        VisibilityTimeout: 20,
        WaitTimeSeconds: 20,
      };

      const data = await sqsClient.send(new ReceiveMessageCommand(params));
      if (!data || !data.Messages || data.Messages?.length === 0) {
        console.log("No message found yet. Waiting for a response....");
      } else {
        for (const message of data.Messages) {
          console.log(message.MessageAttributes);
          if (!message.MessageAttributes) {
            console.log("Wrong format please try again.");
            continue;
          }
          await sendMail({
            userName: message.MessageAttributes.userName.StringValue || "",
            email: message.MessageAttributes.email.StringValue || "",
            fileName: "welcomeMail.ejs",
            subject: "Welcome to the team.",
            teamName: message.MessageAttributes.teamName.StringValue || "",
          });

          const deleteParams: DeleteMessageCommandInput = {
            QueueUrl: queueURL,
            ReceiptHandle: message.ReceiptHandle,
          };

          await sqsClient.send(new DeleteMessageCommand(deleteParams));
          console.log(`Deleted message: ${message.MessageId}`);
        }
      }
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
};

runSQS();
