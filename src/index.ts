import fastify from 'fastify';
import PQueue from 'p-queue';
import { backportTask, GithubBody } from './backportTask';
import { getEnvironmentVariables } from './getEnvironmentVariables';
import { logger } from './logger';

const {
  USERNAME,
  ACCESS_TOKEN,
  SERVER_PORT,
  SERVER_HOST,
  MERGED_BY_USERS,
} = getEnvironmentVariables();

// only allow a single backport operation at a time
const queue = new PQueue({ concurrency: 1 });
const server = fastify({ logger: logger });

server.get('/', async (request, reply) => {
  reply.send(`Backport server running... `);
});

server.post<{ Body: GithubBody }>('/', async (request, reply) => {
  const { body } = request;
  // ignore anything but merged PRs
  const isMerged = body.action === 'closed' && body.pull_request.merged;
  if (!isMerged) {
    reply.code(204);
    return;
  }

  // limit to people listed in `MERGED_BY_USERS` env varible
  const mergedByUser = body.pull_request.merged_by.login;
  if (MERGED_BY_USERS.length > 0 && !MERGED_BY_USERS.includes(mergedByUser)) {
    logger.info(
      `Skipping: Merged by "${mergedByUser}" who is not in the "MERGED_BY_USERS" list: ${MERGED_BY_USERS}`
    );
    reply.code(204);
    return;
  }

  // add backport operation to queue to ensure simultaneous request happen in sequence - not in parallel
  queue.add(async () => {
    try {
      return await backportTask(body, USERNAME, ACCESS_TOKEN);
    } catch (e) {
      logger.error('An error occurred while running backport task');
      logger.error(e);
    }
  });

  reply.send('Backport started...');
});

// Run the server!
server.listen(SERVER_PORT, SERVER_HOST, (err) => {
  if (err) {
    throw err;
  }
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught error');
  logger.error(err);
  process.exit();
});
