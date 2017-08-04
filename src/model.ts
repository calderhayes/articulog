export const enum LoggerLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  SILENT = 5
}

export type LogMethodFactory =
  (rawMethod: (...msg : Array<any>) => void, methodName: string, level: LoggerLevel, loggerName: string) =>
  ((...msg : Array<any>) => void);

export interface ILoggerOptions {
  name: string;
  loggerLevel: LoggerLevel;
  isCountEnabled?: boolean;
  isAssertEnabled?: boolean;
  isTimeEnabled?: boolean;
  methodFactory?: LogMethodFactory;
}

export interface ILoggerFactoryOptions {
  loggerTypeId: string;

  trace: (...msg : Array<any>) => void;
  debug: (...msg : Array<any>) => void;
  info: (...msg : Array<any>) => void;
  warn: (...msg : Array<any>) => void;
  error: (...msg : Array<any>) => void;

  count?: (label: string) => void;
  assert?: (value: any, message?: string, ...optionalParams: Array<any>) => void;
  time?: (label: string) => void;
  timeEnd?: (label: string) => void;

  methodFactory: LogMethodFactory;
}

export const defaultMethodFactory: LogMethodFactory = (rawMethod: (...msg : Array<any>) => void) => {
  return rawMethod;
};

export const noOp = () => { /* no-op */};

export interface ILoggerFactory {
  loggerTypeId: string;
  createLog(options: ILoggerOptions): ILogger;
}

export interface ILogger {
  name: string;
  loggerTypeId: string;

  readonly level: LoggerLevel;

  readonly trace: (...msg : Array<any>) => void;
  readonly debug: (...msg : Array<any>) => void;
  readonly info: (...msg : Array<any>) => void;
  readonly warn: (...msg : Array<any>) => void;
  readonly error: (...msg : Array<any>) => void;

  readonly count: (label: string) => void;
  readonly assert: (value: any, message?: string, ...optionalParams: Array<any>) => void;
  readonly time: (label: string) => void;
  readonly timeEnd: (label: string) => void;

  readonly methodFactory: LogMethodFactory;

  setLevel(level : LoggerLevel): void;
  setMethodFactory(factory: LogMethodFactory): void;
}
