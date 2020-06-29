import appRoot from 'app-root-path';
import { transports, format, createLogger } from 'winston';
import * as path from 'path';

const appRoot = path.resolve(__dirname, '../../../');

const errorStackFormat = format(info => {
  if (info instanceof Error) {
    return Object.assign({}, info, {
      stack: info.stack,
      message: info.message
    })
  }
  return info
})

const logger = createLogger({
  level: 'info',
  format: format.combine(
    errorStackFormat(),
    format.timestamp(),
    format.colorize(),
    format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.Console(),
    new transports.Console({ level: 'error' }),
    new transports.File({ filename: `${appRoot}/logs/error.log`, level: 'error' }),
    new transports.File({ filename: `${appRoot}/logs/app.log` })
  ]
});

logger.info('Winston Logging on');
// define the custom settings for each transport (file, console)
// var options = {
//   file: {
//     level: 'info',
//     filename: `${appRoot}/logs/app.log`,
//     handleExceptions: true,
//     json: true,
//     maxsize: 5242880, // 5MB
//     maxFiles: 5,
//     colorize: false,
//   },
//   console: {
//     level: 'debug',
//     handleExceptions: true,
//     json: false,
//     colorize: true,
//   },
// };

// instantiate a new Winston Logger with the settings defined above
// var logger = winston.createLogger({
//   transports: [
//     new winston.transports.File(options.file),
//     new winston.transports.Console(options.console)
//   ],
//   exitOnError: false, // do not exit on handled exceptions
// });

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  //@ts-ignore
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

export default logger;


// var appRoot = require('app-root-path');
// var winston = require('winston');
//
// // define the custom settings for each transport (file, console)
// var options = {
//   file: {
//     level: 'info',
//     filename: `${appRoot}/logs/app.log`,
//     handleExceptions: true,
//     json: true,
//     maxsize: 5242880, // 5MB
//     maxFiles: 5,
//     colorize: false,
//   },
//   console: {
//     level: 'debug',
//     handleExceptions: true,
//     json: false,
//     colorize: true,
//   },
// };
//
// // instantiate a new Winston Logger with the settings defined above
// var logger = winston.createLogger({
//   transports: [
//     new winston.transports.File(options.file),
//     new winston.transports.Console(options.console)
//   ],
//   exitOnError: false, // do not exit on handled exceptions
// });
//
// // create a stream object with a 'write' function that will be used by `morgan`
// logger.stream = {
//   write: function(message, encoding) {
//     // use the 'info' log level so the output will be picked up by both transports (file and console)
//     logger.info(message);
//   },
// };
//
// module.exports = logger;
