import {LoggerFactory} from './factory';
import {ILoggerFactoryOptions, noOp, defaultMethodFactory} from './model';

let options: ILoggerFactoryOptions;

if (console) {
  options = {
    loggerTypeId: 'console',

    trace: console.trace.bind(console),
    debug: console.debug.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),

    count: console.count.bind(console),
    assert: console.assert.bind(console),
    time: console.time.bind(console),
    timeEnd: console.timeEnd.bind(console),

    methodFactory: defaultMethodFactory
  };
}
else {
  options = {
    loggerTypeId: 'console',

    trace: noOp,
    debug: noOp,
    info: noOp,
    warn: noOp,
    error: noOp,

    count: noOp,
    assert: noOp,
    time: noOp,
    timeEnd: noOp,

    methodFactory: defaultMethodFactory
  };
}

export const ConsoleLoggerFactory = new LoggerFactory(options);
