import dotenv from 'dotenv';

// load environment variables
dotenv.config();

type EnvVars = {
  USERNAME?: string;
  ACCESS_TOKEN?: string;
  SERVER_PORT?: number;
  MERGED_BY?: string;
};

export function getEnvironmentVariables() {
  const {
    USERNAME,
    ACCESS_TOKEN,
    SERVER_PORT = 3000,
    MERGED_BY,
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
    SERVER_PORT,
    MERGED_BY: MERGED_BY?.split(',') ?? [],
  };
}
