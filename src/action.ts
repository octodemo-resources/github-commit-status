import * as core from '@actions/core';
import { createCommitStatus, getOctokit, validateInputs } from './commit-status';

async function run() {
  try {
    await exec();
  } catch (err: any) {
    core.setFailed(err);
  }
}
run();

async function exec() {
  const commitStatusInputs = {
    repository: core.getInput('repository'),
    sha: core.getInput('sha'),
    context: core.getInput('context'),
    state: core.getInput('state'),
    description: core.getInput('description'),
    targetUrl: core.getInput('target_url'),
  }

  const octokitInputs = {
    token: core.getInput('token'),
    githubApiUrl: core.getInput('github_api_url'),
  }

  const commitStatus = validateInputs(commitStatusInputs);
  core.startGroup('Commit status');
  core.info(`owner:       ${commitStatus.owner}`);
  core.info(`repo:        ${commitStatus.repo}`);
  core.info(`sha:         ${commitStatus.sha}`);
  core.info(`context:     ${commitStatus.context}`);
  core.info(`state:       ${commitStatus.state}`);
  if (commitStatus.description) {
    core.info(`description: ${commitStatus.description}`);
  }
  if (commitStatus.target_url) {
    core.info(`target_url:  ${commitStatus.target_url}`);
  }
  core.endGroup();

  const octokit = getOctokit(octokitInputs);
  await createCommitStatus(octokit, commitStatus);
}
