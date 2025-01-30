import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (value) return value;
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`Missing environment variable: ${key}`);
};

const sesClient = new SESClient({
  region: getEnv("AWS_REGION"),
  credentials: {
    accessKeyId: getEnv("AWS_ACCESS_KEY_ID"),
    secretAccessKey: getEnv("AWS_SECRET_ACCESS_KEY"),
  },
});

export const sendMail = async (commandInput: SendEmailCommand) => {
  try {
    return await sesClient.send(commandInput);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
