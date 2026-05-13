import winston from 'winston';
import { env } from '../../config/env';
const { combine, timestamp, json, colorize, errors } = winston.format;

const errorFilter = winston.format((info, opts) => {
  return info.level === 'error' ? info : false;
});

const infoFilter = winston.format((info, opts) => {
  return info.level === 'info' ? info : false;
});

const httpFilter = winston.format((info, opts) => {
  return info.level === 'http' ? info : false;
});

const logTimeStamp = timestamp({
  format: 'YYYY-MM-DD hh:mm:ss.SSS A', // 2022-01-25 03:23:10.350 PM
})

const logger = winston.createLogger({
  level: env.WINSTON_LOG_LEVEL,
  format: combine(
    errors({stack: true}),
    logTimeStamp, json()),
  transports: [new winston.transports.Console(),
    new winston.transports.File({
      filename: 'combined.log',
    }),
    new winston.transports.File({
      filename: 'app-error.log',
      level: 'error',
      format: combine(errorFilter(), logTimeStamp, json()),
    }),
    new winston.transports.File({
      filename: 'app-info.log',
      level: 'info',
      format: combine(infoFilter(), logTimeStamp, json()),
    }),
    new winston.transports.File({
      filename: 'app-requests.log',
      level: 'http',
      format: combine(httpFilter(), logTimeStamp, json()),
    }),
  ],
});

export default logger;
