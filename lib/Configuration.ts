import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const getEnv = (key: string): string => {
  const res = process.env[key];

  if (!res) {
    throw new Error(`${key} not found in env.`);
  }

  return res;
};

const getFile = (path: string): string => {
  try {
    return fs.readFileSync(path, "utf-8");
  } catch (e) {
    throw new Error(`Error Reading File: ${e}`);
  }
};

export default {
  appId: parseInt(getEnv("GITHUB_APP_ID"), 10),
  privateKey: getFile(getEnv("GITHUB_APP_PRIVATE_KEY_PATH")),
  webhookSecret: getEnv("GITHUB_APP_WEBHOOK_SECRET"),
  port: parseInt(getEnv("GITHUB_APP_PORT"), 10),
};
