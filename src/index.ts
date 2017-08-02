import {createConsoleLogger} from './console';

// TODO: Move these definitions out

// The same as LogLevel, but encapsulated here so we can export
const enum LoggerLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  SILENT = 5
}

interface ILoggerOptions {
  name: string;
  loggerLevel: LoggerLevel;
  prefix?: string;
  isCountEnabled?: boolean;
  isAssertEnabled?: boolean;
  isTimeEnabled?: boolean;
  logCallback?: (...msgs: Array<any>) => void;
  customPrefixFunction?: (methodName: string, level: LogLevel, loggerName: string, prefix: string|null) => string;
}

interface ILogger {
  trace(...args: Array<any>): void;
  debug(...args: Array<any>): void;
  info(...args: Array<any>): void;
  warn(...args: Array<any>): void;
  error(...args: Array<any>): void;
  count(): void;
  assert(value: any, message?: string, ...optionalParams: Array<any>): void;
  time(): void;
  timeEnd(): void;
  setLevel(level : LoggerLevel, persist? : boolean): void;
}

export {
  LoggerLevel,
  ILogger,
  ILoggerOptions,
  createConsoleLogger
}
