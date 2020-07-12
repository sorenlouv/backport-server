import winston from 'winston';

const logFormat = winston.format.printf((info) => {
  const date = new Date().toLocaleString();
  if (typeof info.message === 'string') {
    return `${date} ${info.level}: ${info.message}`;
  }

  if (typeof info.message === 'object') {
    if ('err' in info.message) {
      return `${date} ${info.level}: ${info.message.err.stack}`;
    }

    if ('res' in info.message) {
      return `${date} ${info.level}: Response (status code): ${info.message.res.statusCode}`;
    }

    if ('req' in info.message) {
      return `${date} ${info.level}: Request url: ${info.message.req.method} ${info.message.req.url}`;
    }
  }

  return `${date} ${info.level}:unknown ${Object.keys(info.message)}`;
});

export const logger = winston.createLogger({
  // Define levels required by Fastify (by default winston has verbose level and does not have trace)
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    trace: 4,
    debug: 5,
  },
  // Setup log level
  level: 'info',
  // Setup logs format
  format: winston.format.json(),
  // Define transports to write logs, it could be http, file or console
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      format: logFormat,
    }),
    new winston.transports.File({
      filename: 'combined.log',
      format: logFormat,
    }),
  ],
});
