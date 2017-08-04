import {ILoggerOptions, ILoggerFactoryOptions, noOp, ILoggerFactory} from './model';
import {Logger} from './logger';
import {LogControl} from './control';

export class LoggerFactory implements ILoggerFactory {

  public loggerTypeId: string;

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

    const logger = new Logger(options, this.options);

    LogControl.addLogger(options.name, logger);

    return logger;
  }
}
