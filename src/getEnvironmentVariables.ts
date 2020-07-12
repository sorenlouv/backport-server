import dotenv from 'dotenv';

// load environment variables
dotenv.config();

type EnvVars = {
  USERNAME?: string;
  ACCESS_TOKEN?: string;
  SERVER_HOST?: string;
  SERVER_PORT?: number;
  MERGED_BY_USERS?: string;
};

export function getEnvironmentVariables() {
  const {
    USERNAME,
    ACCESS_TOKEN,
    SERVER_HOST = '127.0.0.1',
    SERVER_PORT = 3000,
    MERGED_BY_USERS,
  } = process.env as EnvVars;

  if (!USERNAME) {
    throw new Error('Missing `USERNAME` environment variable');
  }

  if (!ACCESS_TOKEN) {
    throw new Error('Missing `ACCESS_TOKEN` environent variable');
  }

  return {
    USERNAME,
    ACCESS_TOKEN,
    SERVER_HOST,
    SERVER_PORT,
    MERGED_BY_USERS: MERGED_BY_USERS?.split(',') ?? [],
  };
}
