import {getLogger} from 'loglevel';

interface ILoggerOptions {
  name: string;
  logLevel: LogLevel;
  prefix?: string;
  isCountEnabled?: boolean;
  isAssertEnabled?: boolean;
  isTimeEnabled?: boolean;
  logCallback: (...msgs: Array<any>) => void;
}

interface ILogger {
  readonly trace: (...args: Array<any>) => void;
  readonly debug: (...args: Array<any>) => void;
  readonly info: (...args: Array<any>) => void;
  readonly warn: (...args: Array<any>) => void;
  readonly error: (...args: Array<any>) => void;
  readonly count: () => void;
  readonly assert: (value: any, message?: string, ...optionalParams: Array<any>) => void;
  readonly time: () => void;
  readonly timeEnd: () => void;
}

const noOp = () => {
  // No Op
};

const createLogger = (options: ILoggerOptions) => {

  const opts = options || {} as any;

  const name = opts.name ? opts.name :
    'Log' + (new Date()).getTime().toString();

  const logger = getLogger(name);
  logger.setLevel(opts.logLevel || LogLevel.INFO);

  if (opts.isCountEnabled && console.count) {
    (logger as any).count = () => {
      console.count(name);
    };
  }
  else {
    (logger as any).count = noOp;
  }

  if (opts.isAssertEnabled && console.assert) {
    (logger as any).count = (value: any, message?: string, ...optionalParams: Array<any>) => {
      console.assert(value, message, ...optionalParams);
    };
  }
  else {
    (logger as any).assert = noOp;
  }

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

  const original = logger.methodFactory;
  const callback: any = opts.logCallback || noOp;

  const p = (opts.prefix) ? `|${opts.prefix}` : '';
  logger.methodFactory = (methodName: string, level: LogLevel, loggerName: string) => {

    const rawMethod = original(methodName, level, loggerName);
    return (...msg: Array<any>) => {
      const newMessage = `[${loggerName}|${methodName.toUpperCase()}${p}]`;
      rawMethod(newMessage, ...msg);
      setTimeout(() => callback(newMessage, ...msg), 0);
    };

};

  return (logger as any) as ILogger;
};

export {
  ILogger,
  ILoggerOptions,
  createLogger
}
