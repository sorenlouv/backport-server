import { request } from '@octokit/request';
import { BackportResponse } from 'backport/dist/main';

export function addPullRequestComment({
  upstream,
  pullNumber,
  accessToken,
  backportResponse,
}: {
  upstream: string;
  pullNumber: number;
  accessToken: string;
  backportResponse: BackportResponse;
}): Promise<unknown> {
  const [repoOwner, repoName] = upstream.split('/');
  return request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
    headers: {
      authorization: `token ${accessToken}`,
    },
    owner: repoOwner,
    repo: repoName,
    issue_number: pullNumber,
    body: getPullRequestBody(backportResponse),
  });
}

export function getPullRequestBody(backportResponse: BackportResponse): string {
  const header = backportResponse.success
    ? '## 💚 Backport successful\nThe PR was backported to the following branches:'
    : '## 💔 Backport was not successful\nThe PR was attempted backported to the following branches:';

  const details = backportResponse.results.map((result) => {
    if (result.success) {
      return ` - ✅ [${result.targetBranch}](${result.pullRequestUrl})`;
    }

    return ` - ❌ ${result.targetBranch}: ${result.errorMessage}`;
  });

  const generalErrorMessage =
    'errorMessage' in backportResponse
      ? `The backport operation failed due to the following error:\n${backportResponse.errorMessage}`
      : '';

  return `${header}\n${details.join('\n')}\n${generalErrorMessage}`;
}
