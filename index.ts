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

  // 🎯 Step 2: Create GitHub Octokit Client. Hint - https://github.com/octokit/app.js/#appgetinstallationoctokit

  // 🎯 Step 3:
  // a. Fetch meme from "https://meme-api.com/gimme/ProgrammerHumor" using axios.
  // b. Create meme comment using Octokit Client. Hint - https://docs.github.com/en/rest/issues/comments?#create-an-issue-comment
});

server.listen(env.port, () => console.log(`Express Server running at :${env.port} 🚀`));
