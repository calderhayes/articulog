import {ILoggerOptions, LoggerLevel, ILogger} from './index';
import {getLogger} from 'loglevel';
import {registerName} from './name-register';

// Creates a console logger for node stdio, or the browser console
export const createConsoleLogger = (options: ILoggerOptions) => {

  // A no op function for stubbing out disabled functions
  const noOp = () => {
    // No Op
  };

  const defaultPrefixFunction: (methodName: string, level: LogLevel, loggerName: string, prefix: string|null) => void
    = (methodName: string, level: LogLevel, loggerName: string, prefix: string|null) => {
    // Added the !!level to get rid of the compiler warning
    const p = (prefix && !!level) ? `|${prefix}` : '';
    const newMessage = `[${loggerName}|${methodName.toUpperCase()}${p}]`;
    return newMessage;
  };

  const opts = options || {} as any;

  const prefixMethod = !opts.customPrefixFunction ?
    defaultPrefixFunction : opts.customPrefixFunction;

  // The name of the log, important and should be unique
  const name = registerName(opts.name);

  // The base of the console log is the loglevel logger
  const logger = getLogger(name);
  // LogLevel === LoggerLevel
  logger.setLevel((opts.loggerLevel || LoggerLevel.INFO) as any);

  // Enabling the count method
  if (opts.isCountEnabled && console.count) {
    (logger as any).count = () => {
      console.count(name);
    };
  }
  else {
    (logger as any).count = noOp;
  }

  // Enabling the assert method
  if (opts.isAssertEnabled && console.assert) {
    (logger as any).count = (value: any, message?: string, ...optionalParams: Array<any>) => {
      console.assert(value, message, ...optionalParams);
    };
  }
  else {
    (logger as any).assert = noOp;
  }

  // Enabling the time/timeEnd method
  if (opts.isTimeEnabled && console.time) {
    (logger as any).time = () => {
      console.time(name);
    };

    (logger as any).timeEnd = () => {
      console.timeEnd(name);
    };
  }
  else {
    (logger as any).time = noOp;
    (logger as any).timeEnd = noOp;
  }

  // Here is where we inject our custom functionality into the loglevel expansion point
  const original = logger.methodFactory;
  let callback = noOp;
  if (!!opts.logCallback) {
    callback = (...msg: Array<any>) => setTimeout(() => (opts.logCallback || noOp)(...msg));
  }

  const p = (opts.prefix) ? `|${opts.prefix}` : '';
  logger.methodFactory = (methodName: string, level: LogLevel, loggerName: string) => {

    const rawMethod = original(methodName, level, loggerName);
    return (...msg: Array<any>) => {
      const newMessage = prefixMethod(methodName, level, loggerName, p);
      if (newMessage) {
        rawMethod(newMessage, ...msg);
        callback(newMessage, ...msg);
      }
      else {
        rawMethod(...msg);
        callback(...msg);
      }
    };
  };

  // We can now safely cast our return object
  return (logger as any) as ILogger;
};
