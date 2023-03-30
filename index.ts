// App
import express from "express";
import axios from "axios";
import { App as GitHubApp } from "@octokit/app";
import { verify } from "@octokit/webhooks-methods";
import { PullRequestEvent } from "@octokit/webhooks-types";

// Custom
import env from "./lib/Configuration";

const server = express();
server.use(express.json());

server.post("/", async function (req, res) {
  const payload = req.body as PullRequestEvent;
  const headers = req.headers;

  // 🎯 Step 1: Exit early if payload does not contain necessary input.
  if (payload.action !== "opened" || !payload.installation || !headers["x-hub-signature-256"]) {
    return res.send("Not Accurate"); // Doesn't matter, can be any response
  }

  // 🎯 Step 1.1: Webhook secret validation.
  const sig = headers["x-hub-signature-256"].toString();
  const isVerified = await verify(env.webhookSecret, JSON.stringify(payload).toString(), sig);
  if (!isVerified) {
    return res.send("Not Allowed");
  }

  console.log("Step 1 Complete");

  // 🎯 Step 2: Create GitHub Octokit Client. Hint - https://github.com/octokit/app.js/#appgetinstallationoctokit
  const installationId = payload.installation.id;
  const app = new GitHubApp({ appId: env.appId, privateKey: env.privateKey });
  const octokit = await app.getInstallationOctokit(installationId);

  console.log("Step 2 Complete");

  // 🎯 Step 3:
  // a. Fetch meme from "https://meme-api.com/gimme/ProgrammerHumor" using axios.
  // b. Create meme comment using Octokit Client. Hint - https://docs.github.com/en/rest/issues/comments?#create-an-issue-comment
  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;
  const issue_number = payload.pull_request.number;

  try {
    const meme = await axios.get("https://meme-api.com/gimme/ProgrammerHumor");

    await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      owner,
      repo,
      issue_number,
      body: `![Alt text](${meme.data["preview"].pop()})`,
    });

    console.log("Step 3 Complete");
  } catch (e) {
    console.error(`Octokit Error: ${e}`);
    return res.send("Failed!");
  }
});

server.listen(env.port, () => console.log(`Express Server running at :${env.port} 🚀`));
