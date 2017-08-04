import {ILogger, LoggerLevel} from './model';

export interface ILogControl {
  doesLogExist(logName: string): boolean;
  addLogger(logName: string, logger: ILogger): void;
  getLog(logName: string): ILogger|null;
  setAllLogsToLevel(level: LoggerLevel): void;
  turnOffAllLogs(): void;
}

class PrivateLogControl implements ILogControl {

  private logs: {[logName: string]: ILogger};

  constructor() {
    this.logs = {};
  }

  public doesLogExist(logName: string) {
    return Object.keys(this.logs).indexOf(logName) !== -1;
  }

  public addLogger(logName: string, logger: ILogger) {
    this.logs[logName] = logger;
  }

  public getLog(logName: string) {
    return this.logs[logName];
  }

  public setAllLogsToLevel(level: LoggerLevel) {
    const logNames = Object.keys(this.logs);
    for (const logName in logNames) {
      if (this.logs.hasOwnProperty(logName)) {
        this.logs[logName].setLevel(level);
      }
    }
  }

  public turnOffAllLogs() {
    this.setAllLogsToLevel(LoggerLevel.SILENT);
  }
}

export const LogControl: ILogControl = new PrivateLogControl();
