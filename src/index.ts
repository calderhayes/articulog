// TODO: Move these definitions out

const logs: {[logName: string]: ILogger} = {

};

// The same as LogLevel, but encapsulated here so we can export
const enum LoggerLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  SILENT = 5
}

type LogMethodFactory =
  (rawMethod: (...msg : Array<any>) => void, methodName: string, level: LoggerLevel, loggerName: string) =>
  ((...msg : Array<any>) => void);

interface ILoggerLevelConfiguration {
  loggerLevel: LoggerLevel;
  isCountEnabled?: boolean;
  isAssertEnabled?: boolean;
  isTimeEnabled?: boolean;
}

interface ILoggerOptions {
  name: string;
  loggerLevel: LoggerLevel;
  isCountEnabled?: boolean;
  isAssertEnabled?: boolean;
  isTimeEnabled?: boolean;
  methodFactory: LogMethodFactory;
}

interface ILogger {
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

const defaultMethodFactory: LogMethodFactory = (rawMethod: (...msg : Array<any>) => void) => {
  return rawMethod;
};

const noOp = () => { /* no-op */};

class Logger implements ILogger {

  private static traceName: string = 'TRACE';
  private static debugName: string = 'DEBUG';
  private static infoName: string = 'INFO';
  private static warnName: string = 'WARN';
  private static errorName: string = 'ERROR';
  private static silentName: string = 'SILENT';

  public get name() {
    return this._name;
  }

  public get loggerTypeId() {
    return this._loggerTypeId;
  }

  public get level() {
    return this._level;
  }

  public trace: (...msg : Array<any>) => void;
  public debug: (...msg : Array<any>) => void;
  public info: (...msg : Array<any>) => void;
  public warn: (...msg : Array<any>) => void;
  public error: (...msg : Array<any>) => void;

  public count: () => void;
  public assert: (value: any, message?: string, ...optionalParams: Array<any>) => void;
  public time: () => void;
  public timeEnd: () => void;

  public get methodFactory() {
    return this._methodFactory;
  }

  private _name: string;
  private _loggerTypeId: string;
  private _level: LoggerLevel;
  private _methodFactory: LogMethodFactory;

  private _trace: (...msg : Array<any>) => void;
  private _debug: (...msg : Array<any>) => void;
  private _info: (...msg : Array<any>) => void;
  private _warn: (...msg : Array<any>) => void;
  private _error: (...msg : Array<any>) => void;

  private _count: (label: string) => void;
  private _assert: (value: any, message?: string, ...optionalParams: Array<any>) => void;
  private _time: (label: string) => void;
  private _timeEnd: (label: string) => void;

  private isCountEnabled: boolean;
  private isAssertEnabled: boolean;
  private isTimeEnabled: boolean;

  constructor(loggerOptions: ILoggerOptions, factoryOptions: ILoggerFactoryOptions) {
    if (!loggerOptions) {
      throw 'loggerOptions must be provided';
    }

    if (!factoryOptions) {
      throw 'factoryOptions must be provided';
    }

    this._name = loggerOptions.name;
    this._loggerTypeId = factoryOptions.loggerTypeId || '';
    this._level = LoggerLevel.SILENT;
    this._methodFactory = loggerOptions.methodFactory || factoryOptions.methodFactory || defaultMethodFactory;

    this._trace = factoryOptions.trace || noOp;
    this._debug = factoryOptions.debug || noOp;
    this._info = factoryOptions.info || noOp;
    this._warn = factoryOptions.warn || noOp;
    this._error = factoryOptions.error || noOp;

    this._count = factoryOptions.count || noOp;
    this._assert = factoryOptions.assert || noOp;
    this._time = factoryOptions.time || noOp;
    this._timeEnd = factoryOptions.timeEnd || noOp;

    this.isCountEnabled = loggerOptions.isCountEnabled || false;
    this.isAssertEnabled = loggerOptions.isAssertEnabled || false;
    this.isTimeEnabled = loggerOptions.isTimeEnabled || false;

    this.setLevel(this.level);
    this.setNonLogMethods();
  }

  private static getMethodName(level: LoggerLevel) {
    switch (level) {
      case LoggerLevel.TRACE:
        return Logger.traceName;
      case LoggerLevel.DEBUG:
        return Logger.debugName;
      case LoggerLevel.INFO:
        return Logger.infoName;
      case LoggerLevel.WARN:
        return Logger.warnName;
      case LoggerLevel.ERROR:
        return Logger.errorName;
      default:
      case LoggerLevel.SILENT:
        return Logger.silentName;
    }
  }

  public setLevel(level: LoggerLevel) {
    this.trace = this.buildMethod(level, LoggerLevel.TRACE, this._trace);
    this.debug = this.buildMethod(level, LoggerLevel.DEBUG, this._debug);
    this.info = this.buildMethod(level, LoggerLevel.INFO, this._info);
    this.warn = this.buildMethod(level, LoggerLevel.WARN, this._warn);
    this.error = this.buildMethod(level, LoggerLevel.ERROR, this._error);


    this.trace = this.methodFactory(this._trace, Logger.getMethodName(LoggerLevel.TRACE), LoggerLevel.TRACE, this.name);
    this.trace = level >= LoggerLevel.TRACE ? this._trace : noOp;
    this.debug = level >= LoggerLevel.DEBUG ? this._debug : noOp;
    this.info = level >= LoggerLevel.INFO ? this._info : noOp;
    this.warn = level >= LoggerLevel.WARN ? this._warn : noOp;
    this.error = level >= LoggerLevel.ERROR ? this._error : noOp;
  }

  public setMethodFactory(factory: LogMethodFactory) {
    this._methodFactory = factory;
    this.setLevel(this.level);
  }

  private setNonLogMethods() {
    this.count = this.isCountEnabled ? (() => this._count(this.name)) : noOp;
    this.assert = this.isAssertEnabled ? this.assert : noOp;
    this.time = this.isTimeEnabled ? (() => this._time(this.name)) : noOp;
    this.timeEnd = this.isTimeEnabled ? (() => this._timeEnd(this.name)) : noOp;
  }

  private buildMethod(
    targetLevel: LoggerLevel,
    subjectLevel: LoggerLevel,
    originalSubjectMethod: (...msg : Array<any>) => void) {

    if (targetLevel < subjectLevel) {
      return noOp;
    }

    return this.methodFactory(originalSubjectMethod, Logger.getMethodName(subjectLevel), subjectLevel, this.name);
  }
}

class LoggerFactory {

  private loggerTypeId: string;

  private options: ILoggerFactoryOptions;

  constructor(options: ILoggerFactoryOptions) {
    if (!options) {
      throw 'Logger Factory Options must be provided';
    }

    this.loggerTypeId = options.loggerTypeId || '';
    this.options = options;
    this.options.trace = options.trace || noOp;
    this.options.debug = options.debug || noOp;
    this.options.info = options.info || noOp;
    this.options.warn = options.warn || noOp;
    this.options.error = options.error || noOp;

    this.options.count = options.count || noOp;
    this.options.assert = options.assert || noOp;
    this.options.time = options.time || noOp;
    this.options.timeEnd = options.timeEnd || noOp;
  }

  public createLog(options: ILoggerOptions) {
    if (!options) {
      throw 'Logger Options must be provided';
    }

    const doesLogNameExist = Object.keys(logs).indexOf(options.name) !== -1;
    const name = doesLogNameExist ? (options.name || '') : options.name;
    options.name = name;

    const logger = new Logger(options, this.options);

    logs[name] = logger;

    return logger;
  }
}

export {
  LoggerLevel,
  ILogger,
  ILoggerOptions,
  LogMethodFactory,
  ILoggerLevelConfiguration,
  LoggerFactory
}
