// import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import {suite, test} from 'mocha-typescript';
// import * as assert from 'assert';

import {ConsoleLoggerFactory} from './console-factory';
import {ILoggerOptions, LoggerLevel} from '../src/model';

@suite
export class ConsoleLoggerFactoryTest {

  @test('console logger factory should build a simple logger')
  public createLog_test() {
    const loggerOptions: ILoggerOptions = {
      name: 'test',
      loggerLevel: LoggerLevel.TRACE
    };

    const logger = ConsoleLoggerFactory.createLog(loggerOptions);

    assert.ok(logger !== null);
  }

}
