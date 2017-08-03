import {ILoggerOptions, LoggerLevel, ILogger, ILoggerLevelConfiguration} from './index';

const logs: {[logName: string]: ILogger} = {

};




export interface ILoggerFactoryOptions {
  readonly loggerTypeId: string;  

  readonly trace: (...msg : Array<any>) => void;
  readonly debug: (...msg : Array<any>) => void;
  readonly info: (...msg : Array<any>) => void;
  readonly warn: (...msg : Array<any>) => void;
  readonly error: (...msg : Array<any>) => void;

  readonly count?: (label: string) => void;
  readonly assert?: (value: any, message?: string, ...optionalParams: Array<any>) => void;
  readonly time?: (label: string) => void;
  readonly timeEnd?: (label: string) => void;

  readonly methodFactory: (rawMethod: (...msg : Array<any>) => void, methodName: string, level: LogLevel, loggerName: string) => void;
}

const defaultPrefixFunction = (methodName: string, level: LogLevel, loggerName: string, prefix: string|null) => {
  // Added the !!level to get rid of the compiler warning, level should always be provided
  const p = (prefix && !!level) ? `|${prefix}` : '';
  const newMessage = `[${loggerName}|${methodName.toUpperCase()}${p}]`;
  return newMessage;
};

const noOp = () => { };

export class LoggerFactory {

  private loggerTypeId: string;

  private trace: (...msg : Array<any>) => void;
  private debug: (...msg : Array<any>) => void;
  private info: (...msg : Array<any>) => void;
  private warn: (...msg : Array<any>) => void;
  private error: (...msg : Array<any>) => void;

  private count: (label: string) => void;
  private assert: (value: any, message?: string, ...optionalParams: Array<any>) => void;
  private time: (label: string) => void;
  private timeEnd: (label: string) => void;

  constructor(options: ILoggerFactoryOptions) {
    if (!options) {
      throw 'Logger Factory Options must be provided';
    }

    this.loggerTypeId = options.loggerTypeId || '';
    this.trace = options.trace || noOp;
    this.debug = options.debug || noOp;
    this.info = options.info || noOp;
    this.warn = options.warn || noOp;
    this.error = options.error || noOp;

    this.count = options.count || noOp;
    this.assert = options.assert || noOp;
    this.time = options.time || noOp;
    this.timeEnd = options.timeEnd || noOp;
  }



  public createLog(options: ILoggerOptions, level: ILoggerLevelConfiguration) {
    if (!options) {
      throw 'Logger Options must be provided';
    }

    if (!level) {
      throw 'Logger level configuration must be provided';
    }

    const logger: any = {};

    const doesLogNameExist = Object.keys(logs).indexOf(options.name) !== -1;
    const name = doesLogNameExist ? (options.name || '') : options.name;

    logger.loggerTypeId = this.loggerTypeId;
    logger.name = name;

    this.updateLoggerLevel(logger, level);
  }

  public updateLoggerLevel(logger: ILogger, level: ILoggerLevelConfiguration) {
    logger.trace = level.loggerLevel >= LoggerLevel.TRACE ? this.trace : noOp;
    logger.debug = level.loggerLevel >= LoggerLevel.DEBUG ? this.debug : noOp;
    logger.info = level.loggerLevel >= LoggerLevel.INFO ? this.info : noOp;
    logger.warn = level.loggerLevel >= LoggerLevel.WARN ? this.warn : noOp;
    logger.error = level.loggerLevel >= LoggerLevel.ERROR ? this.error : noOp;

    logger.count = level.isCountEnabled ? (() => this.count(logger.name)) : noOp;
    logger.assert = level.isAssertEnabled ? this.assert : noOp;
    logger.time = level.isTimeEnabled ? (() => this.time(logger.name)) : noOp;
    logger.timeEnd = level.isTimeEnabled ? (() => this.timeEnd(logger.name)) : noOp;
  }

}
