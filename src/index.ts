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

interface ILoggerLevelConfiguration {
  loggerLevel: LoggerLevel;
  isCountEnabled?: boolean;
  isAssertEnabled?: boolean;
  isTimeEnabled?: boolean;
}

interface ILoggerOptions {
  name: string;
  prefix?: string;
  logCallback?: (...msgs: Array<any>) => void;
  customPrefixFunction?: (methodName: string, level: LogLevel, loggerName: string, prefix: string|null) => string;
}

interface ILogger {
  name: string;
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
  methodFactory: (rawMethod: (...msg : Array<any>) => void, methodName: string, level: LogLevel, loggerName: string) => void;
}

export {
  LoggerLevel,
  ILogger,
  ILoggerOptions,
  ILoggerLevelConfiguration,
  createConsoleLogger
}
