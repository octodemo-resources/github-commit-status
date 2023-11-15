import * as github from '@actions/github';

export type CommitState = 'error' | 'failure' | 'pending' | 'success';

export type CommitStatusInputs = {
  repository?: string,
  sha?: string,
  context: string,
  state: string,
  description?: string,
  targetUrl?: string
}

export type OctokitInputs = {
  token: string,
  githubApiUrl: string
}

export type CommitStatus = {
  owner: string;
  repo: string;
  sha: string;
  context: string;
  state: CommitState;
  target_url?: string;
  description?: string;
}

export async function createCommitStatus(octokit: any, commitStatus: CommitStatus) {
  const result = await octokit.rest.repos.createCommitStatus(commitStatus);

  if (result.status !== 201) {
    throw new Error(`Unexpected status code when creating a commit status: ${result.status}.`)
  }
}

export function getSha(sha?: string) {
  if (sha) {
    return sha
  }
  return github.context.sha;
}

export function getRepository(repository?: string): { owner: string; repo: string } {
  if (repository) {
    const parts = repository.split('/');
    if (parts.length !== 2) {
      throw new Error(`Invalid repository '${repository}', expected format {owner}/{repo}.`);
    }
    return {
      owner: parts[0],
      repo: parts[1]
    }
  }
  return github.context.repo;
}

export function getState(state?: string): CommitState {
  if (!state) {
    throw new Error(`No commit state was provided, please specify one of 'error', 'failure', 'pending' or 'success'.`);
  }

  if (state === 'error' || state === 'failure' || state === 'pending' || state === 'success') {
    return state;
  }
  throw new Error(`Invalid commit state '${state}'. Expected one of 'error', 'failure', 'pending' or 'success'.`);
}

export function validateInputs(inputs: CommitStatusInputs): CommitStatus {
  const repo = getRepository(inputs.repository);
  const state = getState(inputs.state);

  const result = {
    ...repo,
    sha: getSha(inputs.sha),
    context: inputs.context,
    state: state,
  }

  if (inputs.description) {
    result['description'] = validateDescription(inputs.description);
  }

  if (inputs.targetUrl) {
    result['target_url'] = inputs.targetUrl;
  }
  return result;
}

export function validateDescription(description?: string) {
  if (description && description.length > 140) {
    throw new Error(`The description is too long (${description.length} > 140).`);
  }
  return description;
}

export function getOctokit(inputs: OctokitInputs) {
  if (inputs.githubApiUrl) {
    return github.getOctokit(inputs.token, { baseUrl: inputs.githubApiUrl });
  }
  return github.getOctokit(inputs.token);
}