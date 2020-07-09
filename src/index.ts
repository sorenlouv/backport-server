import { promises as fs } from 'fs';
import fastify from 'fastify';
import formbody from 'fastify-formbody';
import got from 'got';

const server = fastify();

// content type parser for application/x-www-form-urlencoded
server.register(formbody);

// Declare a route
server.get('/', (request, reply) => {
  reply.send({ hello: 'world24' });
});

// Declare a route
server.post<{
  Body: {
    action: string;
    pull_request: { merged: boolean; number: number };
    base: { ref: string }; // master
    repository: {
      name: string;
      owner: { login: string };
      default_branch: string;
    };
  };
}>('/', async (request, reply) => {
  const { body } = request;
  const isMerged = body.action === 'closed' && body.pull_request.merged;
  if (!isMerged) {
    return;
  }

  const configUrl = `https://raw.githubusercontent.com/${body.repository.owner.login}/${body.repository.name}/${body.repository.default_branch}/.backportrc.json`;
  const response = await got(configUrl);
  const configAsString = response.body;
  await fs.writeFile('./tmp/.backportrc.json', configAsString);

  reply.send(`backport --pr ${body.pull_request.number}`);
});

// Run the server!
server.listen(3000, (err, address) => {
  if (err) {
    throw err;
  }
  server.log.info(`server listening on ${address}`);
});
