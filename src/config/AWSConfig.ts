import { SQSClient } from "@aws-sdk/client-sqs";

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (value) return value;
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`Missing environment variable: ${key}`);
};

const sqsClient = new SQSClient({
  region: getEnv("AWS_REGION"),
  credentials: {
    accessKeyId: getEnv("AWS_ACCESS_KEY_ID"),
    secretAccessKey: getEnv("AWS_SECRET_ACCESS_KEY"),
  },
});

export default sqsClient;
