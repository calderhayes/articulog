/* tslint:disable:max-file-line-count */
import {suite, test} from 'mocha-typescript';
import expect from 'ceylon';

import {LoggerFactory} from '../src/factory';
import {ILoggerFactoryOptions, LoggerLevel} from '../src/model';

@suite
export class LoggerFactoryTest {

  @test('logger should not trigger log messages below error when logger level is set to error')
  public basicLogLevel_error_test() {
    let traceIsRun = false;
    let debugIsRun = false;
    let infoIsRun = false;
    let warnIsRun = false;
    let errorIsRun = false;

    let pipedMessage: Array<any> = new Array<any>();

    const message1 = 'AN ERROR HAS RUN';
    const message2 = new Date();
    const message3 = { value: 10 };

    const factoryOptions: ILoggerFactoryOptions = {
      loggerTypeId: 'test',

      trace: () => {
        traceIsRun = true;
      },

      debug: () => {
        debugIsRun = true;
      },

      info: () => {
        infoIsRun = true;
      },

      warn: () => {
        warnIsRun = true;
      },

      error: (...msg: Array<any>) => {
        pipedMessage = msg;
        errorIsRun = true;
      }
    };

    const loggerFactory = new LoggerFactory(factoryOptions);
    const logger = loggerFactory.createLog({
      name: 'testlog',
      loggerLevel: LoggerLevel.ERROR
    });


    logger.trace('should not be run');
    expect(traceIsRun).toBe(false, 'trace should not be triggered when trace is run and logger level is set to error');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(false, 'info should not be triggered');
    expect(warnIsRun).toBe(false, 'warn should not be triggered');
    expect(errorIsRun).toBe(false, 'error should not be triggered');

    logger.debug('should not be run');
    expect(traceIsRun).toBe(false, 'trace should not be triggered');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(false, 'info should not be triggered');
    expect(warnIsRun).toBe(false, 'warn should not be triggered');
    expect(errorIsRun).toBe(false, 'error should not be triggered');

    logger.info('should not be run');
    expect(traceIsRun).toBe(false, 'trace should not be triggered');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(false, 'info should not be triggered');
    expect(warnIsRun).toBe(false, 'warn should not be triggered');
    expect(errorIsRun).toBe(false, 'error should not be triggered');

    logger.warn('should not be run');
    expect(traceIsRun).toBe(false, 'trace should not be triggered');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(false, 'info should not be triggered');
    expect(warnIsRun).toBe(false, 'warn should not be triggered');
    expect(errorIsRun).toBe(false, 'error should not be triggered');

    logger.error(message1, message2, message3);
    expect(traceIsRun).toBe(false, 'trace should not be triggered');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(false, 'info should not be triggered');
    expect(warnIsRun).toBe(false, 'warn should not be triggered');
    expect(errorIsRun).toBe(true, 'error should be triggered');

    const first = 0;
    const second = 1;
    const third = 2;
    expect(pipedMessage[first]).toBe(message1, 'Piped message 1 should be passed through');
    expect(pipedMessage[second]).toBe(message2, 'Piped message 2 should be passed through');
    expect(pipedMessage[third]).toBe(message3, 'Piped message 3 should be passed through');
  }

  @test('logger should not trigger log messages below info when logger level is set to info')
  public basicLogLevel_info_test() {
    let traceIsRun = false;
    let debugIsRun = false;
    let infoIsRun = false;
    let warnIsRun = false;
    let errorIsRun = false;

    let pipedMessage: Array<any> = new Array<any>();

    const message1 = 'AN ERROR HAS RUN';
    const message2 = new Date();
    const message3 = { value: 10 };

    const factoryOptions: ILoggerFactoryOptions = {
      loggerTypeId: 'test',

      trace: () => {
        traceIsRun = true;
      },

      debug: () => {
        debugIsRun = true;
      },

      info: () => {
        infoIsRun = true;
      },

      warn: () => {
        warnIsRun = true;
      },

      error: (...msg: Array<any>) => {
        pipedMessage = msg;
        errorIsRun = true;
      }
    };

    const loggerFactory = new LoggerFactory(factoryOptions);
    const logger = loggerFactory.createLog({
      name: 'testlog',
      loggerLevel: LoggerLevel.INFO
    });

    const setFlagsToFalse = () => {
      traceIsRun = false;
      debugIsRun = false;
      infoIsRun = false;
      warnIsRun = false;
      errorIsRun = false;
    };

    logger.trace('should not be run');
    expect(traceIsRun).toBe(false, 'trace should not be triggered when trace is run and logger level is set to error');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(false, 'info should not be triggered, trace');
    expect(warnIsRun).toBe(false, 'warn should not be triggered');
    expect(errorIsRun).toBe(false, 'error should not be triggered');

    setFlagsToFalse();

    logger.debug('should not be run');
    expect(traceIsRun).toBe(false, 'trace should not be triggered');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(false, 'info should not be triggered, debug');
    expect(warnIsRun).toBe(false, 'warn should not be triggered');
    expect(errorIsRun).toBe(false, 'error should not be triggered');

    setFlagsToFalse();

    logger.info('should be run!');
    expect(traceIsRun).toBe(false, 'trace should not be triggered');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(true, 'info should be triggered');
    expect(warnIsRun).toBe(false, 'warn should not be triggered');
    expect(errorIsRun).toBe(false, 'error should not be triggered');

    setFlagsToFalse();

    logger.warn('should be run!');
    expect(traceIsRun).toBe(false, 'trace should not be triggered');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(false, 'info should not be triggered - warn');
    expect(warnIsRun).toBe(true, 'warn should not be triggered');
    expect(errorIsRun).toBe(false, 'error should not be triggered');

    setFlagsToFalse();

    logger.error(message1, message2, message3);
    expect(traceIsRun).toBe(false, 'trace should not be triggered');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(false, 'info should not be triggered');
    expect(warnIsRun).toBe(false, 'warn should not be triggered');
    expect(errorIsRun).toBe(true, 'error should be triggered');

    const first = 0;
    const second = 1;
    const third = 2;
    expect(pipedMessage[first]).toBe(message1, 'Piped message 1 should be passed through');
    expect(pipedMessage[second]).toBe(message2, 'Piped message 2 should be passed through');
    expect(pipedMessage[third]).toBe(message3, 'Piped message 3 should be passed through');
  }

  @test('logger should trigger all log messages when logger level is set to trace')
  public basicLogLevel_trace_test() {
    let traceIsRun = false;
    let debugIsRun = false;
    let infoIsRun = false;
    let warnIsRun = false;
    let errorIsRun = false;

    let pipedMessage: Array<any> = new Array<any>();

    const message1 = 'AN ERROR HAS RUN';
    const message2 = new Date();
    const message3 = { value: 10 };

    const factoryOptions: ILoggerFactoryOptions = {
      loggerTypeId: 'test',

      trace: () => {
        traceIsRun = true;
      },

      debug: () => {
        debugIsRun = true;
      },

      info: () => {
        infoIsRun = true;
      },

      warn: () => {
        warnIsRun = true;
      },

      error: (...msg: Array<any>) => {
        pipedMessage = msg;
        errorIsRun = true;
      }
    };

    const loggerFactory = new LoggerFactory(factoryOptions);
    const logger = loggerFactory.createLog({
      name: 'testlog',
      loggerLevel: LoggerLevel.TRACE
    });

    const setFlagsToFalse = () => {
      traceIsRun = false;
      debugIsRun = false;
      infoIsRun = false;
      warnIsRun = false;
      errorIsRun = false;
    };

    logger.trace('should be run');
    expect(traceIsRun).toBe(true, 'trace should be triggered');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(false, 'info should not be triggered, trace');
    expect(warnIsRun).toBe(false, 'warn should not be triggered');
    expect(errorIsRun).toBe(false, 'error should not be triggered');

    setFlagsToFalse();

    logger.debug('should be run');
    expect(traceIsRun).toBe(false, 'trace should not be triggered');
    expect(debugIsRun).toBe(true, 'debug should be triggered');
    expect(infoIsRun).toBe(false, 'info should not be triggered, debug');
    expect(warnIsRun).toBe(false, 'warn should not be triggered');
    expect(errorIsRun).toBe(false, 'error should not be triggered');

    setFlagsToFalse();

    logger.info('should be run!');
    expect(traceIsRun).toBe(false, 'trace should not be triggered');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(true, 'info should be triggered');
    expect(warnIsRun).toBe(false, 'warn should not be triggered');
    expect(errorIsRun).toBe(false, 'error should not be triggered');

    setFlagsToFalse();

    logger.warn('should be run!');
    expect(traceIsRun).toBe(false, 'trace should not be triggered');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(false, 'info should not be triggered - warn');
    expect(warnIsRun).toBe(true, 'warn should not be triggered');
    expect(errorIsRun).toBe(false, 'error should not be triggered');

    setFlagsToFalse();

    logger.error(message1, message2, message3);
    expect(traceIsRun).toBe(false, 'trace should not be triggered');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(false, 'info should not be triggered');
    expect(warnIsRun).toBe(false, 'warn should not be triggered');
    expect(errorIsRun).toBe(true, 'error should be triggered');

    const first = 0;
    const second = 1;
    const third = 2;
    expect(pipedMessage[first]).toBe(message1, 'Piped message 1 should be passed through');
    expect(pipedMessage[second]).toBe(message2, 'Piped message 2 should be passed through');
    expect(pipedMessage[third]).toBe(message3, 'Piped message 3 should be passed through');
  }

  @test('logger should not trigger any messages when level set to silent')
  public basicLogLevel_silent_test() {
    let traceIsRun = false;
    let debugIsRun = false;
    let infoIsRun = false;
    let warnIsRun = false;
    let errorIsRun = false;

    const factoryOptions: ILoggerFactoryOptions = {
      loggerTypeId: 'test',

      trace: () => {
        traceIsRun = true;
      },

      debug: () => {
        debugIsRun = true;
      },

      info: () => {
        infoIsRun = true;
      },

      warn: () => {
        warnIsRun = true;
      },

      error: () => {
        errorIsRun = true;
      }
    };

    const loggerFactory = new LoggerFactory(factoryOptions);
    const logger = loggerFactory.createLog({
      name: 'testlog',
      loggerLevel: LoggerLevel.SILENT
    });

    logger.trace('should not be run');
    expect(traceIsRun).toBe(false, 'trace should not be triggered when trace is run and logger level is set to error');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(false, 'info should not be triggered');
    expect(warnIsRun).toBe(false, 'warn should not be triggered');
    expect(errorIsRun).toBe(false, 'error should not be triggered');

    logger.debug('should not be run');
    expect(traceIsRun).toBe(false, 'trace should not be triggered');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(false, 'info should not be triggered');
    expect(warnIsRun).toBe(false, 'warn should not be triggered');
    expect(errorIsRun).toBe(false, 'error should not be triggered');

    logger.info('should not be run');
    expect(traceIsRun).toBe(false, 'trace should not be triggered');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(false, 'info should not be triggered');
    expect(warnIsRun).toBe(false, 'warn should not be triggered');
    expect(errorIsRun).toBe(false, 'error should not be triggered');

    logger.warn('should not be run');
    expect(traceIsRun).toBe(false, 'trace should not be triggered');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(false, 'info should not be triggered');
    expect(warnIsRun).toBe(false, 'warn should not be triggered');
    expect(errorIsRun).toBe(false, 'error should not be triggered');

    logger.error('should not be run');
    expect(traceIsRun).toBe(false, 'trace should not be triggered');
    expect(debugIsRun).toBe(false, 'debug should not be triggered');
    expect(infoIsRun).toBe(false, 'info should not be triggered');
    expect(warnIsRun).toBe(false, 'warn should not be triggered');
    expect(errorIsRun).toBe(false, 'error should not be triggered');
  }

}
