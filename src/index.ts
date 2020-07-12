import fastify from 'fastify';
import PQueue from 'p-queue';
import { backportTask, GithubBody } from './backportTask';
import { getEnvironmentVariables } from './getEnvironmentVariables';

const {
  USERNAME,
  ACCESS_TOKEN,
  SERVER_PORT = 3000,
  MERGED_BY,
} = getEnvironmentVariables();

// only allow a single backport operation at a time
const queue = new PQueue({ concurrency: 1 });
const server = fastify();

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

  // limit to people listed in `MERGED_BY` env varible
  if (
    MERGED_BY.length > 0 &&
    !MERGED_BY.includes(body.pull_request.merged_by.login)
  ) {
    return;
  }

  // add backport operation to queue to ensure multiple request happen in sequence - not in parallel
  queue.add(async () => {
    try {
      return await backportTask(body, USERNAME, ACCESS_TOKEN);
    } catch (e) {
      console.log('Something happened...', e);
    }
  });

  reply.send();
});

// Run the server!
server.listen(SERVER_PORT, (err, address) => {
  if (err) {
    throw err;
  }
  server.log.info(`server listening on ${address}`);
});
