import {ILogger} from './model';

export interface ILogControl {
  doesLogExist(logName: string): boolean;
  addLogger(logName: string, logger: ILogger): void;
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
}

export const LogControl: ILogControl = new PrivateLogControl();
