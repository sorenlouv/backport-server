import dotenv from 'dotenv';

// load environment variables
dotenv.config();

type EnvVars = {
  ACCESS_TOKEN?: string;
  SERVER_HOST?: string;
  SERVER_PORT?: number;
  MERGED_BY_USERS?: string;
};

export function getEnvironmentVariables() {
  const {
    ACCESS_TOKEN,
    SERVER_HOST = '127.0.0.1',
    SERVER_PORT = 3000,
    MERGED_BY_USERS = '',
  } = process.env as EnvVars;

  if (!ACCESS_TOKEN) {
    throw new Error('Missing `ACCESS_TOKEN` environent variable');
  }

  return {
    ACCESS_TOKEN,
    SERVER_HOST,
    SERVER_PORT,
    MERGED_BY_USERS: MERGED_BY_USERS?.split(',').map((name) => name.trim()),
  };
}
