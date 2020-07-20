import { getBackportConfig, GithubBody } from './backportTask';

describe('getBackportConfig', () => {
  it('returns config', async () => {
    const body = {
      pull_request: {
        merged_by: {
          login: 'sqren',
        },
      },
      repository: {
        default_branch: 'master',
        name: 'kibana',
        owner: {
          login: 'elastic',
        },
      },
    } as GithubBody;
    const accessToken = 'abcdefg';
    expect(await getBackportConfig(body, accessToken)).toEqual({
      accessToken: 'abcdefg',
      assignees: ['sqren'],
      branchLabelMapping: {
        '^v(\\d+).(\\d+).\\d+$': '$1.$2',
        '^v7.9.0$': '7.x',
        '^v8.0.0$': 'master',
      },
      ci: true,
      pullNumber: undefined,
      targetBranchChoices: [
        { checked: true, name: 'master' },
        { checked: true, name: '7.x' },
        '7.8',
        '7.7',
        '7.6',
        '7.5',
        '7.4',
        '7.3',
        '7.2',
        '7.1',
        '7.0',
        '6.8',
        '6.7',
        '6.6',
        '6.5',
        '6.4',
        '6.3',
        '6.2',
        '6.1',
        '6.0',
        '5.6',
      ],
      targetPRLabels: ['backport'],
      upstream: 'elastic/kibana',
      username: 'sqren',
    });
  });
});
