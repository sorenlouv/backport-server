import { getPullRequestBody } from './addPullRequestComment';

describe('addPullRequestComment', () => {});

describe('getPullRequestBody', () => {
  it('should return successful message when all backports succeeded', () => {
    const body = getPullRequestBody({
      success: true,
      results: [
        { targetBranch: '7.8', success: true, pullRequestUrl: 'url1' },
        { targetBranch: '7.7', success: true, pullRequestUrl: 'url2' },
        { targetBranch: '7.6', success: true, pullRequestUrl: 'url3' },
      ],
    });

    expect(body).toMatchInlineSnapshot(`
      "## 💚 Backport successful
      The PR was backported to the following branches:
       ✅ [7.8](url1)
       ✅ [7.7](url2)
       ✅ [7.6](url3)"
    `);
  });

  it('should return unsuccessful message when some backports failed', () => {
    const body = getPullRequestBody({
      success: false,
      results: [
        { targetBranch: '7.8', success: true, pullRequestUrl: 'url1' },
        {
          targetBranch: '7.7',
          success: false,
          errorMessage: 'Something went wrong',
        },
        {
          targetBranch: '7.6',
          success: false,
          errorMessage: 'Something else went wrong',
        },
      ],
    });

    expect(body).toMatchInlineSnapshot(`
      "## 💔 Backport was not successful
      The PR was attempted backported to the following branches:
       ✅ [7.8](url1)
       ❌ 7.7: Something went wrong
       ❌ 7.6: Something else went wrong"
    `);
  });
});
