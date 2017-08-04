import {
  ILoggerOptions,
  ILoggerFactoryOptions,
  noOp,
  ILogger,
  LoggerLevel,
  LogMethodFactory,
  defaultMethodFactory} from './model';

export class Logger implements ILogger {

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
