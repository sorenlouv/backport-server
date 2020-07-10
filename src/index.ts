import * as backport from 'backport';
import { BackportOptions } from 'backport/dist/options/options';
import fastify from 'fastify';
import got from 'got';
import PQueue from 'p-queue';

// only allow a single backport operation at a time
const queue = new PQueue({ concurrency: 1 });
const server = fastify();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

server.get('/', async (request, reply) => {
  reply.send(`Backport server running... `);
});

server.post<{ Body: GithubBody }>('/', async (request, reply) => {
  const { body } = request;

  // ignore anything but merged PRs
  const isMerged = body.action === 'closed' && body.pull_request.merged;
  if (!isMerged) {
    return;
  }

  const config = await getBackportConfig(body);

  // add backport operation to queue to ensure only a single backport operation is in progress at a time
  queue.add(async () => {
    console.log('Starting backport: ', config);
    const res = await backport.run(config);
    console.log('Finished backport: ', res);

    // add small delay to ensure git has time to cleanup (might not be needed - can be removed at a later stage)
    await sleep(2000);
  });

  reply.send(config);
});

// Run the server!
server.listen(3000, (err, address) => {
  if (err) {
    throw err;
  }
  server.log.info(`server listening on ${address}`);
});

type GithubBody = {
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

async function getBackportConfig(body: GithubBody): Promise<BackportOptions> {
  const configUrl = `https://raw.githubusercontent.com/${body.repository.owner.login}/${body.repository.name}/${body.repository.default_branch}/.backportrc.json`;
  const response = await got(configUrl);
  const projectConfig = JSON.parse(response.body);

  return {
    ...projectConfig,
    ci: true,
    pullNumber: body.pull_request.number,
    assignees: [body.pull_request.merged_by.login],
  };
}
