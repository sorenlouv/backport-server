import * as backport from 'backport';
import { ConfigOptions } from 'backport/dist/options/ConfigOptions';
import got from 'got';
import { addPullRequestComment } from './github/addPullRequestComment';

export type GithubBody = {
  action: string;
  pull_request: {
    merged: boolean;
    number: number;
    merged_by: { login: string };
  };
  base: { ref: string }; // master
  repository: {
    name: string;
    owner: { login: string };
    default_branch: string;
  };
};

export async function backportTask(
  body: GithubBody,
  username: string,
  accessToken: string
): Promise<void> {
  const config = await getBackportConfig(body, username, accessToken);
  if (!config.upstream) {
    throw new Error('Missing upstream');
  }

  if (!config.pullNumber) {
    throw new Error('Missing pull request number');
  }

  console.log('Starting backport: ', { ...config, accessToken: '<REDACTED>' });
  console.log(backport);

  const backportResponse = await backport.run(config);
  console.log('Finished backport: ', backportResponse);

  await addPullRequestComment({
    upstream: config.upstream,
    pullNumber: config.pullNumber,
    accessToken,
    backportResponse,
  });
}

async function getBackportConfig(
  body: GithubBody,
  username: string,
  accessToken: string
): Promise<ConfigOptions> {
  const configUrl = `https://raw.githubusercontent.com/${body.repository.owner.login}/${body.repository.name}/${body.repository.default_branch}/.backportrc.json`;

  try {
    const response = await got(configUrl);
    const projectConfig = JSON.parse(response.body);

    return {
      ...projectConfig,
      username,
      accessToken,
      ci: true,
      pullNumber: body.pull_request.number,
      assignees: [body.pull_request.merged_by.login],
    };
  } catch (e) {
    if (e.response?.statusCode === 404) {
      throw new Error(`No config exists for ${configUrl}`);
    }
    throw e;
  }
}
